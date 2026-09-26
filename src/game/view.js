/**
 * Presentation: turns simulation state + events into pixels, sound and juice.
 * It reads the simulation and drains `sim.events`; it never mutates game state.
 *
 * Juice rule (skill references/design/game-feel-juice.md): feedback size matches event size.
 *   stardust eaten  "+N" at the head, a tick that climbs a pentatonic ladder while pickups keep
 *                   coming within 1.5 s (GAME_BRIEF "Audio direction"), a few sparkles
 *   fusion          the new planet pops (scale punch + flash), its own pop pitch (bigger worlds
 *                   sound deeper), cascades 70 ms apart, "xN FUSION" from 3 in a row
 *   big fusion      lava and up: camera punch; sun and up: 60 ms hit-stop + burst
 *   swallow         80 ms hit-stop, shake, the victim's colours burst, kill-feed line
 *   swallowed       the biggest shake + a low thud (the death message is main.js's)
 */

import { CircleGeometry, Color, Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from "three";
import { ARENA } from "../config.js";
import { t } from "../core/i18n.js";
import { Particles } from "../fx/particles.js";
import { CameraShake } from "../fx/shake.js";
import { COMET_COLORS, STARDUST } from "../render/palette.js";
import { Bodies } from "./body-mesh.js";
import { pathPoint, playerRank } from "./sim.js";
import { SpaceMesh } from "./space-mesh.js";
import { DROPPED, GOLD, blockSize, fmtValue, levelOf, looseSize } from "./values.js";

const _v = new Vector3();
const _scr = { x: 0, y: 0, visible: false };
const _v2 = new Vector3();
const _pt = { x: 0, z: 0 };
const CONFETTI = ["#ffd23f", "#3fb6ff", "#ff3fa4", "#6fdc6a", "#ff8a3c"];
const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
const lerp = (a, b, k) => a + (b - a) * k;
const MAXC = ARENA.values.maxChain;

export class GameView {
  constructor(stage, { audio, ui, loop }) {
    this.stage = stage;
    this.audio = audio;
    this.ui = ui;
    this.loop = loop;
    this.space = new SpaceMesh(stage.scene);
    this.theme = null;
    this.bodies = null;
    this.particles = new Particles(stage.scene, 500);
    this.shake = new CameraShake({ maxOffset: 0.7 });
    this.camPos = new Vector3(0, 20, 12);
    this.camLook = new Vector3(0, 0, 0);
    this._tPos = new Vector3();
    this._tLook = new Vector3();
    this.time = 0;
    this.cameraOverride = null;
    this.pops = [];               // per snake: Float32Array pop timers per chain index
    this.tick = { step: 0, last: -9 };
    this.cascade = { n: 0, last: -9 };
    this.sfxQueue = [];           // delayed fusion pops: [time, name, pitch, volume]
    this.accent = new Color();
    this.coma = new Color();
    this.danger = new Color();
    this.prey = new Color();
    this.neutral = new Color("#ffffff");
    this.cometColors = COMET_COLORS.map((h) => new Color(h));   // parsed once (no per-frame string parsing)
    this.labels = [];             // name tag text per snake id

    // Player markers: an arrow ahead of the head, the cursor ring.
    const arrowGeo = new CircleGeometry(0.34, 3);
    arrowGeo.rotateX(-Math.PI / 2);
    this.arrow = new Mesh(arrowGeo, new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false }));
    this.arrow.name = "player-arrow";
    this.arrow.renderOrder = 3;
    const cursorGeo = new RingGeometry(0.34, 0.5, 28);
    cursorGeo.rotateX(-Math.PI / 2);
    this.cursorRing = new Mesh(cursorGeo, new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false, depthTest: false }));
    this.cursorRing.name = "cursor-ring";
    this.cursorRing.renderOrder = 6;
    this.cursorRing.visible = false;
    stage.scene.add(this.arrow, this.cursorRing);
    this.cursor = null;           // { x, z, shown } world offset from the head (controls.js)
  }

  /** Fixed camera relative to the player's head, for marketing captures. null restores the rig. */
  setCameraOverride(o) { this.cameraOverride = o; }

  build(sim, theme) {
    this.stage.setTheme(theme);
    this.space.build(theme, `nebula-${sim.level}`);
    if (!this.bodies) this.bodies = new Bodies(this.stage.scene, theme, { comets: sim.snakes.length + 2 });
    this.pops = sim.snakes.map(() => new Float32Array(MAXC));
    this.labels = sim.snakes.map((sn) => (sn.isPlayer ? t("you") : sn.name));
    this.particles.clear();
    this.shake.trauma = 0;
    this.sfxQueue.length = 0;
    this.recolor(theme);
    this.snapCamera(sim);
  }

  /** Skin change: the player's accent (ribbon, arrow, cursor ring, rim). */
  recolor(theme) {
    this.theme = theme;
    this.bodies?.setTheme(theme);
    this.accent.set(theme.crowd);
    this.coma.set(theme.coma);
    this.danger.set(theme.danger);
    this.prey.set(theme.prey);
    this.arrow.material.color.set(theme.crowd);
    this.cursorRing.material.color.set(theme.crowd);
  }

  toScreen(x, y, z, out = { x: 0, y: 0, visible: false }) {
    _v.set(x, y, z).project(this.stage.camera);
    out.x = (_v.x * 0.5 + 0.5) * this.stage.size.width;
    out.y = (-_v.y * 0.5 + 0.5) * this.stage.size.height;
    out.visible = _v.z > -1 && _v.z < 1 && _v.x > -1.1 && _v.x < 1.1 && _v.y > -1.1 && _v.y < 1.1;
    return out;
  }

  /** Canvas-local pixel -> point on the arena floor (y = 0). */
  screenToGround(sx, sy, out) {
    const cam = this.stage.camera;
    const w = this.stage.size.width || 1, h = this.stage.size.height || 1;
    _v.set((sx / w) * 2 - 1, -(sy / h) * 2 + 1, 0.5).unproject(cam);
    _v2.copy(_v).sub(cam.position);
    if (_v2.y > -1e-6) return false;
    const k = -cam.position.y / _v2.y;
    out.x = cam.position.x + _v2.x * k;
    out.z = cam.position.z + _v2.z * k;
    return true;
  }

  /** World units per screen pixel at the player's depth (mouse -> cursor ring). */
  worldPerPixel() {
    return (this._halfWidth * 2) / Math.max(1, this.stage.size.width);
  }

  canvasRect() { return this.stage.renderer.domElement.getBoundingClientRect(); }

  snapCamera(sim) {
    this.#cameraTarget(sim, sim.player.x, sim.player.z);
    this.camPos.copy(this._tPos);
    this.camLook.copy(this._tLook);
  }

  update(sim, alpha, dt) {
    this.time += dt;
    const p = sim.player;
    const px = lerp(p.prevX, p.x, alpha), pz = lerp(p.prevZ, p.z, alpha);
    this.#events(sim, px, pz);
    this.#sfx();
    this.#draw(sim, alpha);
    this.particles.update(dt);
    this.shake.update(dt);
    this.#camera(sim, px, pz, dt);
    this.#tags(sim, alpha);
  }

  // ------------------------------------------------------------------ events -> juice
  #events(sim, px, pz) {
    const p = sim.player;
    for (const ev of sim.events) {
      switch (ev.type) {
        case "eat": {
          if (ev.sid !== 0) { this.#sparkle(ev.x, ev.z, ev.value, ev.kind, 3); break; }
          const gold = ev.kind === GOLD;
          const s = this.toScreen(px, blockSize(p.head) + 0.6, pz);
          if (s.visible) this.ui.floatText(s.x, s.y, `+${fmtValue(ev.value)}`, gold ? "gold" : "good");
          // Pentatonic ladder: one step up per pickup within 1.5 s, back to the root after a pause.
          this.tick.step = this.time - this.tick.last < 1.5 ? Math.min(PENTA.length - 1, this.tick.step + 1) : 0;
          this.tick.last = this.time;
          const pitch = 2 ** (PENTA[this.tick.step] / 12) * (0.98 + Math.random() * 0.04);
          this.audio.play(gold ? "coin" : "tick", { pitch, minGap: 0.045, maxVoices: 4, volume: gold ? 0.8 : 0.9 });
          this.#sparkle(ev.x, ev.z, ev.value, ev.kind, gold ? 10 : 5);
          break;
        }
        case "merge": {
          const pop = this.pops[ev.sid];
          if (pop && ev.index < MAXC) pop[ev.index] = 1;
          if (ev.sid !== 0) break;
          const lv = levelOf(ev.value);
          this.cascade.n = this.time - this.cascade.last < 0.4 ? this.cascade.n + 1 : 1;
          this.cascade.last = this.time;
          // Bigger worlds sound deeper; a cascade plays its pops 70 ms apart.
          const delay = (ev.step - 1) * 0.07;
          this.sfxQueue.push([this.time + delay, "fuse", Math.max(0.35, 1.5 * 0.93 ** lv), lv >= 10 ? 1 : 0.85]);
          const sx = p.segX[Math.min(ev.index, p.n - 1)] ?? px, sz = p.segZ[Math.min(ev.index, p.n - 1)] ?? pz;
          const size = blockSize(ev.value);
          this.particles.burst({ x: sx, y: size * 0.6, z: sz }, { count: 8 + Math.min(16, lv * 2), color: this.bodies.look(lv).color.getHex(), speed: 4 + lv * 0.3, up: 4, size: 0.12 + lv * 0.01, life: 0.6 });
          const s = this.toScreen(sx, size + 0.9, sz);
          if (s.visible) {
            const label = this.cascade.n >= 3 ? t("fusion_x", { n: this.cascade.n }) : fmtValue(ev.value);
            this.ui.floatText(s.x, s.y - 18, label, this.cascade.n >= 3 || lv >= 7 ? "gold" : "merge");
          }
          if (lv >= 7) this.shake.add(0.1 + Math.min(0.2, (lv - 7) * 0.05));
          if (lv >= 10) {
            this.loop.freeze(60);
            for (let k = 0; k < 3; k++) this.particles.burst({ x: sx, y: size, z: sz }, { count: 10, color: CONFETTI[(lv + k) % CONFETTI.length], speed: 7, up: 7, size: 0.16, life: 1 });
          }
          this.ui.pulseScore?.();
          break;
        }
        case "kill": {
          const killer = ev.killer >= 0 ? sim.snakes[ev.killer] : null;
          const victim = sim.snakes[ev.victim];
          const val = fmtValue(ev.value);
          if (ev.killer === 0) {
            this.ui.feed(t("feed_you_ate", { name: victim.name, v: val }), "you");
            const s = this.toScreen(ev.x, 1.6, ev.z);
            if (s.visible) this.ui.floatText(s.x, s.y, t("swallowed_float", { name: victim.name }), "gold");
            this.audio.play("crunch", { pitch: 1 + Math.random() * 0.08 });
            this.loop.freeze(80);
            this.shake.add(0.32);
            this.#burst(ev.x, ev.z, 26);
          } else if (ev.victim === 0) {
            this.ui.feed(killer ? t("feed_ate_you", { name: killer.name, v: fmtValue(killer.head) }) : t("feed_you_crashed"), "bad");
            this.audio.play("thud");
            this.loop.freeze(80);
            this.shake.add(0.55);
            this.#burst(ev.x, ev.z, 30);
          } else {
            if (killer) this.ui.feed(t("feed_ate", { a: killer.name, b: victim.name }), "");
            if (Math.abs(ev.x - px) < 18 && Math.abs(ev.z - pz) < 14) this.#burst(ev.x, ev.z, 14);
          }
          break;
        }
        case "bounce":
          this.audio.play("hit", { pitch: 1.3, volume: 0.6 });
          this.shake.add(0.12);
          break;
        case "boostDrop":
          if (ev.sid === 0) this.audio.play("pop", { pitch: 0.8 });
          break;
        case "respawned":
        case "revived":
          this.particles.burst({ x: p.x, y: 1, z: p.z }, { count: 24, color: this.accent.getHex(), speed: 5, up: 5 });
          this.audio.play("spawn", { pitch: ev.type === "revived" ? 1.2 : 1 });
          break;
        case "won":
          for (let k = 0; k < 5; k++) this.particles.burst({ x: px + (k - 2) * 1.4, y: 2, z: pz }, { count: 14, color: CONFETTI[k], speed: 6, up: 9, size: 0.16, life: 1.2 });
          break;
        default:
          break;
      }
    }
    sim.events.length = 0;
  }

  #sfx() {
    const q = this.sfxQueue;
    for (let i = q.length - 1; i >= 0; i--) {
      if (q[i][0] > this.time) continue;
      const [, name, pitch, volume] = q[i];
      this.audio.play(name, { pitch, volume, minGap: 0.02 });
      q.splice(i, 1);
    }
  }

  #sparkle(x, z, value, kind, count) {
    const col = kind === GOLD ? STARDUST.gold : kind === DROPPED ? this.bodies.look(levelOf(value)).color.getHex() : "#ffffff";
    this.particles.burst({ x, y: 0.6, z }, { count, color: col, speed: 3.2, up: 3, size: 0.08, life: 0.4 });
  }

  #burst(x, z, count) {
    for (let k = 0; k < 3; k++) this.particles.burst({ x, y: 0.8, z }, { count: Math.round(count / 3), color: CONFETTI[k + 1], speed: 6, up: 5, size: 0.13, life: 0.7 });
  }

  // ------------------------------------------------------------------ drawing
  #draw(sim, alpha) {
    const B = this.bodies;
    B.begin(this.stage.camera);
    const p = sim.player;
    const live = sim.phase === "run";
    const time = this.time;
    const decay = Math.exp(-6 * Math.min(0.05, this.loop.frameMs / 1000));

    for (const sn of sim.snakes) {
      if (!sn.alive || sn.n === 0) continue;
      const pop = this.pops[sn.id];
      const blink = sn.protect > 0 && (sim.phase === "run" || !sn.isPlayer) && Math.floor(time * 10) % 2 === 0;
      const bright = blink ? 1.45 : 1;
      const hx = lerp(sn.prevX, sn.x, alpha), hz = lerp(sn.prevZ, sn.z, alpha);
      // Ribbon trail along the recorded path, under the chain.
      B.ribbonBegin(sn.isPlayer ? this.accent : this.cometColors[(sn.id - 1) % this.cometColors.length]);
      const headSize = blockSize(sn.head);
      const trail = Math.max(4, sn.len + 2);
      let lx = hx, lz = hz;
      B.ribbonPoint(hx, hz, Math.cos(sn.heading), Math.sin(sn.heading), headSize * 0.42, 0.55);
      for (let k = 2, d = 0; k < 400; k += 2) {
        if (!pathPoint(sn, k, _pt)) break;
        const dx = lx - _pt.x, dz = lz - _pt.z;
        d += Math.hypot(dx, dz);
        const f = d / trail;
        if (f >= 1) break;
        B.ribbonPoint(_pt.x, _pt.z, dx, dz, headSize * 0.42 * (1 - f * 0.85), 0.55 * (1 - f));
        lx = _pt.x; lz = _pt.z;
      }
      B.ribbonEnd();

      for (let i = 0; i < sn.n; i++) {
        const v = sn.chain[i];
        const lv = levelOf(v);
        const x = i === 0 ? hx : i < sn.prevN ? lerp(sn.prevSegX[i], sn.segX[i], alpha) : sn.segX[i];
        const z = i === 0 ? hz : i < sn.prevN ? lerp(sn.prevSegZ[i], sn.segZ[i], alpha) : sn.segZ[i];
        let size = blockSize(v);
        if (pop) {
          const k = pop[i];
          if (k > 0) { size *= 1 + 0.45 * k * k; pop[i] = k * decay - 0.002; }
        }
        const flash = pop && pop[i] > 0.6 ? 1.35 : 1;
        B.planet(x, z, size, lv, time * (0.7 + (i % 3) * 0.25) + sn.id + i, bright * flash, 0, true, time);
        if (i === 0) {
          // The coma: every head glows; the rim tells danger (bigger head) from prey (smaller).
          B.halo(x, size * 0.5, z, size * 2.3, this.coma, sn.isPlayer ? 0.95 : 0.75);
          if (sn.isPlayer) B.rim(x, z, size * 0.95 + 0.25, this.accent);
          else if (live && p.alive && sn.protect <= 0) B.rim(x, z, size * 0.95 + 0.2, sn.head > p.head ? this.danger : sn.head < p.head ? this.prey : this.neutral);
        }
      }
    }

    // Loose pickups.
    const L = sim.loose;
    for (let i = 0; i < L.cap; i++) {
      if (!L.alive[i]) continue;
      const x = lerp(L.px[i], L.x[i], alpha), z = lerp(L.pz[i], L.z[i], alpha);
      const v = L.v[i];
      const kind = L.kind[i];
      const age = L.age[i];
      const grow = age < 0.3 ? easeOutBack(age / 0.3) : 1;
      const size = looseSize(v, kind) * grow;
      if (kind === DROPPED) B.planet(x, z, size, levelOf(v), time + i, 1, 0.1, true, time);
      else B.dust(x, z, size, v, kind === GOLD, time * 2.2 + i, Math.sin(time * 3 + i) * 0.08);
    }
    B.end();

    // Player markers.
    const on = p.alive && sim.phase !== "won";
    this.arrow.visible = on;
    if (on) {
      const hx = lerp(p.prevX, p.x, alpha), hz = lerp(p.prevZ, p.z, alpha);
      const d = blockSize(p.head) * 0.5 + 0.55;
      this.arrow.position.set(hx + Math.cos(p.heading) * d, 0.05, hz + Math.sin(p.heading) * d);
      this.arrow.rotation.y = -p.heading;
      const c = this.cursor;
      this.cursorRing.visible = !!(c && c.shown && live);
      if (this.cursorRing.visible) this.cursorRing.position.set(hx + c.x, 0.06, hz + c.z);
    } else {
      this.cursorRing.visible = false;
    }
  }

  // ------------------------------------------------------------------ camera
  #cameraTarget(sim, cx, cz) {
    const cam = ARENA.camera;
    const size = this.stage.size;
    const portrait = size.aspect < 1;
    const head = sim.player.alive ? sim.player.head : Math.max(2, sim.deathHead);
    const zoom = Math.min(cam.zoomMax, 1 + cam.zoomPerLevel * (levelOf(Math.max(2, head)) - 1));
    const halfWidth = (portrait ? cam.halfWidthPortrait : cam.halfWidth) * zoom;
    this._halfWidth = halfWidth;
    const vfov = (this.stage.camera.fov * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * Math.max(0.2, size.aspect || 1));
    const dist = halfWidth / Math.tan(hfov / 2);
    const pitch = (cam.pitchDeg * Math.PI) / 180;
    const p = sim.player;
    const ahead = p.alive && sim.phase === "run" ? (p.boosting ? cam.lookAheadBoost : cam.lookAhead) : 0;
    let lx = cx + Math.cos(p.heading) * ahead, lz = cz + Math.sin(p.heading) * ahead;
    // Ready screen: look a little past the comet so it idles below the wordmark and PLAY.
    if (sim.phase === "ready") lz -= halfWidth * (portrait ? 0.55 : 0.12);
    this._tLook.set(lx, 0, lz);
    this._tPos.set(lx, Math.sin(pitch) * dist, lz + Math.cos(pitch) * dist);
  }

  #camera(sim, cx, cz, dt) {
    const cam = this.stage.camera;
    if (this.cameraOverride) {
      const { pos, look } = this.cameraOverride;
      cam.position.set(cx + pos[0], pos[1], cz + pos[2]);
      cam.lookAt(cx + look[0], look[1], cz + look[2]);
      this._halfWidth = ARENA.camera.halfWidth;
      return;
    }
    this.#cameraTarget(sim, cx, cz);
    const k = 1 - Math.exp(-ARENA.camera.follow * dt);
    this.camPos.lerp(this._tPos, k);
    this.camLook.lerp(this._tLook, k);
    const o = this.shake.offset;
    cam.position.set(this.camPos.x + o.x, this.camPos.y + o.y, this.camPos.z + o.z);
    cam.lookAt(this.camLook);
    cam.rotateZ(o.roll);
  }

  // ------------------------------------------------------------------ name tags
  #tags(sim, alpha) {
    const p = sim.player;
    for (const sn of sim.snakes) {
      const id = `n${sn.id}`;
      if (!sn.alive || sn.n === 0) { this.ui.setBubble(id, 0, 0, "", false, "name"); continue; }
      const x = lerp(sn.prevX, sn.x, alpha), z = lerp(sn.prevZ, sn.z, alpha);
      const s = this.toScreen(x, blockSize(sn.head) + 0.35, z - blockSize(sn.head) * 0.3, _scr);
      const label = this.labels[sn.id] ?? sn.name;
      const kind = sn.isPlayer ? "name you" : sim.phase === "run" && p.alive && sn.head > p.head ? "name danger" : "name";
      // Keep tags out of the top HUD band (clock, score, leaderboard).
      const clear = s.y > this.stage.size.height * 0.13 + 40;
      this.ui.setBubble(id, s.x, s.y, label, s.visible && clear && sim.phase !== "won", kind);
    }
  }

  /** HUD helper: the player's rank now. */
  rank(sim) { return playerRank(sim); }
}

function easeOutBack(t) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

