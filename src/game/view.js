/**
 * Presentation for Volt City: turns simulation state + events into pixels, sound and juice.
 * It reads the simulation and drains `sim.events`; it never mutates game state.
 *
 * Juice (skill references/design/game-feel-juice.md, feedback size matches event size):
 *   hop        a jagged camera-facing bolt between two rooftops, a flash at the new tip, a few
 *              sparks, "+N", a crackle on a rising pitch ladder (the chain count climbs it)
 *   fork       "FORK x2 / x4 / x8" as the bolt count doubles, a higher zap
 *   strike     the big bolt from the storm front, 60 ms hit-stop, camera kick, white flash,
 *              SUPERCHARGE! / FIZZLE
 *   district   BLOCK POWERED card + chime; cascade end: CHAIN xN
 *   run end    a slow orbit sweep over the lit city
 *
 * Plain three materials for now (look.js); the game-feel-artist's look kit replaces them.
 */

import { Color, Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from "three";
import { VOLT } from "../config.js";
import { t } from "../core/i18n.js";
import { CameraShake } from "../fx/shake.js";
import { BoltMesh } from "./bolt-mesh.js";
import { CityMesh } from "./city-mesh.js";
import { LOOK } from "./look.js";

const _v = new Vector3();
const _o = { x: 0, y: 0, z: 0 };
const _scr = { x: 0, y: 0, visible: false };
const PENTA = [0, 2, 4, 7, 9];
const lerp = (a, b, k) => a + (b - a) * k;

export class GameView {
  constructor(stage, { audio, ui, loop }) {
    this.stage = stage;
    this.audio = audio;
    this.ui = ui;
    this.loop = loop;
    this.cityMesh = new CityMesh(stage.scene);
    this.bolts = new BoltMesh(stage.scene);
    this.shake = new CameraShake({ maxOffset: 0.9, maxRoll: 0.02 });
    this.time = 0;
    this.boltColor = new Color(LOOK.boltGlow);
    this.hot = new Color(LOOK.boltCore);
    this.gold = new Color(LOOK.gold);
    this.superCol = new Color(LOOK.super);
    this.spark = new Color(LOOK.spark);
    this.camYaw = 0.42;
    this.camLook = new Vector3();
    this.camPos = new Vector3(0, 40, 40);
    this.follow = new Vector3();       // smoothed centroid of recent hops
    this.followW = 0;
    this.dolly = 0;                    // impact kick (0..1)
    this.lastFloat = -9;
    this.forkShown = 1;
    this.aim = { index: -1, charge: 0, holding: false, visible: false };
    this.cameraOverride = null;

    const ringGeo = new RingGeometry(0.9, 1.15, 40);
    ringGeo.rotateX(-Math.PI / 2);
    this.marker = new Mesh(ringGeo, new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false }));
    this.marker.name = "aim-marker";
    this.marker.renderOrder = 6;
    this.marker.visible = false;
    stage.scene.add(this.marker);

    // Night: dim the template's day lights (the look kit brings its own rig).
    stage.scene.traverse((o) => {
      if (o.isHemisphereLight) o.intensity = LOOK.hemiIntensity;
      if (o.isDirectionalLight) { o.intensity = LOOK.sunIntensity; o.color.set(LOOK.sunColor); }
    });
    if ("environmentIntensity" in stage.scene) stage.scene.environmentIntensity = 0.12;
  }

  setCameraOverride(o) { this.cameraOverride = o; }

  build(sim) {
    this.stage.setTheme(LOOK);
    if (this.stage.scene.fog) { this.stage.scene.fog.near = LOOK.fogNear; this.stage.scene.fog.far = LOOK.fogFar; }
    this.cityMesh.build(sim.city, sim.seed);
    this.bolts.clear();
    this.shake.trauma = 0;
    this.followW = 0;
    this.forkShown = 1;
    this.snapCamera(sim);
  }

  /** The equipped bolt skin. */
  recolor(hex) { this.boltColor.set(hex || LOOK.boltGlow); }

  toScreen(x, y, z, out = { x: 0, y: 0, visible: false }) {
    _v.set(x, y, z).project(this.stage.camera);
    out.x = (_v.x * 0.5 + 0.5) * this.stage.size.width;
    out.y = (-_v.y * 0.5 + 0.5) * this.stage.size.height;
    out.visible = _v.z > -1 && _v.z < 1 && Math.abs(_v.x) < 1.05 && Math.abs(_v.y) < 1.05;
    return out;
  }

  /**
   * Aim from a screen point (canvas pixels): the antenna tip nearest on screen. Tips within
   * pickRadiusPx win by screen distance; otherwise the nearest tip anyway (every press strikes).
   */
  pick(sim, sx, sy) {
    let best = -1, bd = Infinity;
    for (const b of sim.city.buildings) {
      this.toScreen(b.x, b.tipY, b.z, _scr);
      const d = (_scr.x - sx) ** 2 + (_scr.y - sy) ** 2;
      if (d < bd) { bd = d; best = b.id; }
    }
    return best;
  }

  snapCamera(sim) {
    this.#frame(sim, 0, true);
  }

  update(sim, alpha, dt) {
    this.time += dt;
    this.#events(sim);
    this.cityMesh.update(sim, this.time, this.stage.camera.quaternion, sim.charge, sim.holding);
    this.bolts.update(dt, this.stage.camera, this.time);
    this.shake.update(dt);
    this.#marker(sim);
    this.#frame(sim, dt, false);
  }

  // ------------------------------------------------------------------ events -> juice
  #events(sim) {
    const bs = sim.city.buildings;
    for (const ev of sim.events) {
      switch (ev.type) {
        case "chargeStart":
          this.audio.play("charge", { pitch: 1 });
          break;
        case "strike": {
          const b = bs[ev.target];
          this.cityMesh.strikeOrigin(b, _o);
          // The main bolt: storm front -> rooftop, in three jagged legs.
          const mx = lerp(_o.x, b.x, 0.45) + (b.x - _o.x) * 0.08, my = lerp(_o.y, b.tipY, 0.45) + 3, mz = lerp(_o.z, b.z, 0.5);
          const nx = lerp(_o.x, b.x, 0.78), ny = lerp(_o.y, b.tipY, 0.8), nz = lerp(_o.z, b.z, 0.8) + 1.5;
          const w = ev.band === "over" ? 0.35 : ev.band === "super" ? 1.1 : 0.75;
          const col = ev.band === "super" ? this.superCol : this.boltColor;
          this.bolts.segment(_o.x, _o.y, _o.z, mx, my, mz, col, w, 0.55, ev.n * 11);
          this.bolts.segment(mx, my, mz, nx, ny, nz, col, w, 0.55, ev.n * 11 + 3);
          this.bolts.segment(nx, ny, nz, b.x, b.tipY, b.z, col, w, 0.55, ev.n * 11 + 7);
          this.bolts.halo(b.x, b.tipY, b.z, ev.band === "over" ? 4 : 11, this.hot, 0.5);
          this.bolts.halo(b.x, b.tipY, b.z, 18, col, 0.35);
          this.bolts.sparks(b.x, b.tipY, b.z, ev.band === "over" ? 8 : 34, this.spark, 8, 0.22);
          this.shake.add(ev.band === "over" ? 0.15 : 0.42);
          this.dolly = 1;
          if (ev.band !== "over") this.loop.freeze(60);
          this.audio.play("thunder", { pitch: ev.band === "super" ? 1.1 : 0.9 });
          this.forkShown = 1;
          const s = this.toScreen(b.x, b.tipY + 2, b.z, _scr);
          if (ev.band === "super") this.ui.floatText(s.x, s.y - 40, t("supercharge"), "gold");
          else if (ev.band === "over") { this.ui.floatText(s.x, s.y - 40, t("fizzle"), "bad"); this.audio.play("fizzle"); }
          break;
        }
        case "hop": {
          const a = bs[ev.from], b = bs[ev.to];
          const gen = Math.min(4, ev.gen);
          const col = gen >= 2 ? _mix(this.boltColor, this.hot, 0.25 * (gen - 1)) : this.boltColor;
          this.bolts.segment(a.x, a.tipY, a.z, b.x, b.tipY, b.z, col, 0.26 + gen * 0.06, 0.42, ev.bolt * 31 + ev.depth);
          this.bolts.halo(b.x, b.tipY, b.z, 3.2 + gen * 0.4, col, 0.3);
          this.bolts.sparks(b.x, b.tipY, b.z, 5, this.spark, 5, 0.14, 0.45);
          // Crackle on a rising pentatonic ladder: the chain count climbs it.
          const step = Math.min(ev.chain, 29);
          const semis = PENTA[step % 5] + 12 * Math.floor(step / 5);
          this.audio.play("crackle", { pitch: Math.min(3.2, 0.8 * 2 ** (semis / 24)), minGap: 0.025, maxVoices: 5, volume: 0.8 });
          this.follow.x = lerp(this.follow.x, b.x, 0.25);
          this.follow.z = lerp(this.follow.z, b.z, 0.25);
          this.followW = Math.min(1, this.followW + 0.2);
          break;
        }
        case "light": {
          const b = bs[ev.b];
          if (ev.gold) {
            this.bolts.halo(b.x, b.tipY, b.z, 14, this.gold, 0.6);
            this.bolts.sparks(b.x, b.tipY, b.z, 26, this.gold, 7, 0.24);
            this.audio.play("gold");
          }
          // "+N" at the rooftop; throttled so a burst of hops stays readable (big values always show).
          if (this.time - this.lastFloat > 0.05 || ev.value >= 16 || ev.gold) {
            const s = this.toScreen(b.x, b.tipY + 1.2, b.z, _scr);
            if (s.visible) { this.ui.floatText(s.x, s.y, `+${ev.value}`, ev.gold || ev.value >= 16 ? "gold" : "good"); this.lastFloat = this.time; }
          }
          break;
        }
        case "fork": {
          const b = bs[ev.at];
          this.bolts.halo(b.x, b.tipY, b.z, 6, this.hot, 0.35);
          if (ev.bolts >= this.forkShown * 2) {
            this.forkShown = 2 ** Math.floor(Math.log2(ev.bolts));
            const s = this.toScreen(b.x, b.tipY + 3, b.z, _scr);
            if (s.visible) this.ui.floatText(s.x, s.y - 30, t("fork_x", { n: this.forkShown }), "merge");
            this.audio.play("fork", { pitch: 1 + Math.min(0.8, Math.log2(ev.bolts) * 0.15), minGap: 0.05 });
          }
          break;
        }
        case "boltEnd": {
          const b = bs[ev.at];
          this.bolts.sparks(b.x, b.tipY, b.z, 3, this.boltColor, 3, 0.1, 0.35);
          break;
        }
        case "district":
          this.ui.showWorld(t("block_powered"), `+${ev.bonus}`);
          this.audio.play("district");
          this.shake.add(0.12);
          break;
        case "cascadeEnd":
          if (ev.hops >= 6) {
            const s = this.toScreen(this.follow.x, 6, this.follow.z, _scr);
            this.ui.floatText(s.visible ? s.x : this.stage.size.width / 2, s.visible ? s.y - 50 : this.stage.size.height * 0.3, t("chain_x", { n: ev.hops }), "gold");
          }
          break;
        case "runEnd":
          if (ev.share >= 1) {
            for (const b of bs) if ((b.id % 3) === 0) this.bolts.sparks(b.x, b.tipY, b.z, 4, this.gold, 6, 0.2, 1.2);
            this.audio.play("win");
          } else this.audio.play(ev.phase === "won" ? "win" : "fail", { pitch: ev.phase === "won" ? 1 : 0.9 });
          break;
        case "extraStrike":
          this.audio.play("charge", { pitch: 1.4 });
          break;
        default:
          break;
      }
    }
    sim.events.length = 0;
  }

  #marker(sim) {
    const a = this.aim;
    const b = a.index >= 0 ? sim.city.buildings[a.index] : null;
    const show = !!b && a.visible && (sim.phase === "ready" || sim.phase === "run");
    this.marker.visible = show;
    if (!show) return;
    const st = VOLT.strike;
    const c = sim.holding ? sim.charge : 0;
    const inBand = c >= st.superLo && c <= st.superHi;
    const over = c > 1;
    const s = (Math.max(b.w, b.d) * 0.55 + 0.4) * (sim.holding ? 1.25 - Math.min(1, c) * 0.45 : 1 + Math.sin(this.time * 4) * 0.06);
    this.marker.position.set(b.x, b.h + 0.2, b.z);
    this.marker.scale.set(s, 1, s);
    this.marker.material.color.set(over ? "#ff5a6e" : inBand ? LOOK.super : "#ffffff");
    this.marker.material.opacity = sim.holding ? 1 : 0.6;
  }

  // ------------------------------------------------------------------ camera
  /** Elevated 3/4 view over the whole city; follows the chain gently, kicks on impact, sweeps at the end. */
  #frame(sim, dt, snap) {
    const cam = this.stage.camera;
    const size = this.stage.size;
    const city = sim.city;
    const r = Math.hypot(city.width, city.depth) / 2 + 3;
    const vfov = (cam.fov * Math.PI) / 180;
    const aspect = size.aspect || 16 / 9;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
    const portrait = aspect < 1;
    // Fit the city across the screen width (portrait pulls back and up on its own: hfov is narrow).
    let dist = (r * (portrait ? 0.92 : 0.8)) / Math.tan(Math.min(hfov, vfov * 1.2) / 2);
    const done = sim.phase === "won" || sim.phase === "failed";
    const pitch = ((portrait ? 50 : 40) * Math.PI) / 180;
    if (done) this.camYaw += dt * 0.18;                     // result sweep
    else if (sim.phase === "ready") this.camYaw = 0.42 + Math.sin(this.time * 0.25) * 0.12;
    else this.camYaw = lerp(this.camYaw, 0.42, 1 - Math.exp(-0.8 * dt));
    this.dolly *= Math.exp(-5 * dt);
    this.followW *= Math.exp(-0.6 * dt);
    dist *= 1 - this.dolly * 0.05 - (sim.bolts.length ? 0.04 : 0);
    const fx = this.follow.x * this.followW * 0.3, fz = this.follow.z * this.followW * 0.3;
    const lookY = portrait ? 1 : 3;
    const tx = fx, tz = fz + (portrait ? 0 : 2);
    const px = tx + Math.sin(this.camYaw) * Math.cos(pitch) * dist;
    const py = lookY + Math.sin(pitch) * dist;
    const pz = tz + Math.cos(this.camYaw) * Math.cos(pitch) * dist;
    if (this.cameraOverride) {
      const o = this.cameraOverride;
      cam.position.set(o.pos[0], o.pos[1], o.pos[2]);
      cam.lookAt(o.look[0], o.look[1], o.look[2]);
      return;
    }
    const k = snap ? 1 : 1 - Math.exp(-3 * dt);
    this.camPos.x = lerp(this.camPos.x, px, k); this.camPos.y = lerp(this.camPos.y, py, k); this.camPos.z = lerp(this.camPos.z, pz, k);
    this.camLook.x = lerp(this.camLook.x, tx, k); this.camLook.y = lerp(this.camLook.y, lookY, k); this.camLook.z = lerp(this.camLook.z, tz, k);
    const o = this.shake.offset;
    cam.position.set(this.camPos.x + o.x, this.camPos.y + o.y, this.camPos.z + o.z);
    cam.lookAt(this.camLook);
    cam.rotateZ(o.roll);
    if (cam.far < dist * 4) { cam.far = dist * 4; cam.updateProjectionMatrix(); }
  }
}

const _mixC = new Color();
function _mix(a, b, k) { return _mixC.copy(a).lerp(b, Math.min(1, k)); }
