/**
 * Presentation: turns simulation state + events into pixels, sound and juice.
 *
 * Juice rule (skill references/design/game-feel-juice.md): feedback size matches
 * event size. A gate = sound + particles + number pop. A block breaking = bigger
 * burst + shake + 70 ms hit-stop. Losing the run = the biggest shake. Uniform
 * maximum feedback is the same as none.
 */

import { Color, InstancedMesh, Matrix4, MeshStandardMaterial, Vector3 } from "three";
import { TUNING as T } from "../config.js";
import { Particles } from "../fx/particles.js";
import { CameraShake } from "../fx/shake.js";
import { CrowdMesh, unitGeometry } from "./crowd-mesh.js";
import { formation } from "./formation.js";
import { isGoodOp } from "./level-gen.js";
import { displayCount, progress } from "./sim.js";
import { World } from "./world.js";

const _v = new Vector3();
const _m = new Matrix4();
const CONFETTI = ["#ffd23f", "#3fb6ff", "#ff5ad9", "#5cf29b", "#ff8a3c"];
const lerp = (a, b, k) => a + (b - a) * k;

export class GameView {
  constructor(stage, { audio, ui, loop }) {
    this.stage = stage;
    this.audio = audio;
    this.ui = ui;
    this.loop = loop;
    this.world = new World(stage.scene);
    this.particles = new Particles(stage.scene, 700);
    this.shake = new CameraShake();
    this.player = new CrowdMesh(stage.scene);
    this.enemies = [];
    this.sitterMat = new MeshStandardMaterial({ roughness: 0.34, metalness: 0.04 });
    this.sitters = new InstancedMesh(unitGeometry(), this.sitterMat, 160);
    this.sitters.frustumCulled = false;
    this.sitters.count = 0;
    stage.scene.add(this.sitters);
    this.camPos = new Vector3(0, 11, 13);
    this.camLook = new Vector3(0, 0, -7);
    this.time = 0;
    this.theme = null;
    this.clashTimer = 0;
    this.coinStreak = 0;
    this.lastCoinAt = -99;
    this.cameraOverride = null;
  }

  /** Fixed camera relative to the crowd centre, for marketing captures. null restores the rig. */
  setCameraOverride(o) { this.cameraOverride = o; }

  snapCamera(sim) {
    this.#cameraTarget(sim, sim.x, 0, sim.z);
    this.camPos.copy(this._tPos);
    this.camLook.copy(this._tLook);
  }

  /** @param theme a palette theme, already combined with the player's skin (palette.js withSkin) */
  build(spec, sim, theme) {
    this.stage.setTheme(theme);
    this.world.build(spec, theme);
    for (const e of this.enemies) e.dispose();
    this.enemies = sim.enemies.map(() => new CrowdMesh(this.stage.scene, { color: theme.enemy }));
    this.recolor(theme);
    this.coinStreak = 0;
    this.sitters.count = 0;
    this.particles.clear();
    this.shake.trauma = 0;
    this.snapCamera(sim);
  }

  /** Skin change on the ready screen: crowd, finish sitters and (if the hue clashed) enemies. */
  recolor(theme) {
    this.theme = theme;
    this.player.setColor(theme.crowd);
    this.sitterMat.color.set(theme.crowd);
    for (const e of this.enemies) e.setColor(theme.enemy);
  }

  toScreen(x, y, z) {
    _v.set(x, y, z).project(this.stage.camera);
    return {
      x: (_v.x * 0.5 + 0.5) * this.stage.size.width,
      y: (-_v.y * 0.5 + 0.5) * this.stage.size.height,
      visible: _v.z > -1 && _v.z < 1,
    };
  }

  update(sim, alpha, dt) {
    this.time += dt;
    const cx = lerp(sim.prevX, sim.x, alpha);
    const cz = lerp(sim.prevZ, sim.z, alpha);
    const cy = sim.tier >= 0 ? (sim.tier + 1) * T.tierStep : 0;
    const mode = sim.phase === "run" || sim.phase === "finish" ? "run" : sim.phase === "battle" ? "battle" : "idle";
    const blink = sim.invuln > 0 && Math.floor(this.time * 12) % 2 === 0;

    this.player.update(cx, cy, cz, sim.count, dt, this.time, mode, { facing: -1, blink });
    sim.enemies.forEach((e, i) => {
      const ez = lerp(e.prevZ, e.z, alpha);
      const emode = sim.battle === e ? "battle" : e.charging ? "run" : "idle";
      this.enemies[i].update(0, 0, ez, e.dead ? 0 : e.count, dt, this.time, emode, { facing: 1 });
    });

    this.world.update(sim, dt);
    this.#events(sim, cx, cy, cz);
    if (sim.phase === "battle" && sim.battle) this.#battleFx(sim, cx, cz, dt);
    this.particles.update(dt);
    this.shake.update(dt);
    this.#camera(sim, cx, cy, cz, dt);
    this.#bubbles(sim, cx, cy, cz, alpha);
    this.ui.setProgress(progress(sim));
  }

  #events(sim, cx, cy, cz) {
    const th = this.theme;
    let got = 0, gx = 0, gz = 0;
    for (const ev of sim.events) {
      switch (ev.type) {
        case "coin":
          this.world.takeCoin(ev.id);
          got++; gx += ev.x; gz = ev.z;
          break;
        case "gate": {
          const good = ev.after >= ev.before;
          const delta = Math.round(ev.after - ev.before);
          const gx = ev.side === "left" ? -T.trackHalfWidth / 2 : T.trackHalfWidth / 2;
          const s = this.toScreen(gx, 3.2, sim.gates.find((g) => g.id === ev.id).z);
          this.ui.floatText(s.x, s.y, `${delta >= 0 ? "+" : "−"}${Math.abs(delta)}`, good ? "good" : "bad");
          this.audio.play(good ? "gateGood" : "gateBad", { pitch: good ? 1 + Math.min(0.45, Math.abs(delta) / 150) : 1 });
          this.particles.burst({ x: cx, y: 1, z: cz }, { count: good ? 26 : 12, color: isGoodOp(ev.op) ? th.gateGood : th.gateBad, speed: 6, up: 5 });
          this.ui.pulseBubble("player");
          if (!good) this.shake.add(0.2);
          break;
        }
        case "lost":
          this.particles.burst({ x: ev.x, y: 0.7, z: ev.z }, { count: Math.min(ev.n, 5), color: ev.cause === "battle" ? th.enemy : th.crowd, speed: 4, up: 3.5, size: 0.12, life: 0.5 });
          this.audio.play("pop", { pitch: 0.85 + Math.random() * 0.45, minGap: 0.045 });
          break;
        case "blockHit":
          this.shake.add(0.12);
          this.audio.play("hit", { pitch: 1.15 });
          break;
        case "blockBroken": {
          const p = this.world.blockCenter(ev.id);
          if (p) this.particles.burst({ x: p.x, y: 1.2, z: p.z }, { count: 36, color: th.block, speed: 8, up: 7, size: 0.28, life: 0.9, spread: 1.4 });
          this.shake.add(0.38);
          this.loop.freeze(70);
          this.audio.play("hit", { pitch: 0.75 });
          break;
        }
        case "battleStart":
          this.shake.add(0.12);
          this.audio.play("clash");
          break;
        case "enemyDefeated": {
          const e = sim.enemies.find((en) => en.id === ev.id);
          this.particles.burst({ x: 0, y: 1, z: e ? e.z : cz - 3 }, { count: 30, color: th.enemy, speed: 7, up: 6, size: 0.18 });
          this.shake.add(0.3);
          this.loop.freeze(60);
          this.audio.play("win", { pitch: 1.5, volume: 0.6 });
          break;
        }
        case "finishLine":
          this.audio.play("coin", { pitch: 1.2 });
          break;
        case "tier": {
          this.audio.play("tier", { pitch: 1 + ev.index * 0.07 });
          const tier = this.world.tiers[ev.index];
          if (tier) {
            for (let k = 0; k < 3; k++) this.particles.burst({ x: (k - 1) * 3, y: tier.y + 0.5, z: tier.z }, { count: 6, color: CONFETTI[(ev.index + k) % CONFETTI.length], speed: 5, up: 7, size: 0.13 });
            this.#addSitters(ev.cost, tier);
            const s = this.toScreen(0, tier.y + 2.5, tier.z);
            this.ui.floatText(s.x, s.y, `×${ev.mult}`, "gold");
          }
          break;
        }
        case "won":
          for (let k = 0; k < 5; k++) this.particles.burst({ x: cx + (k - 2) * 1.5, y: cy + 1.5, z: cz }, { count: 14, color: CONFETTI[k], speed: 6, up: 9, size: 0.14, life: 1.2 });
          this.audio.play("win");
          this.shake.add(0.15);
          break;
        case "failed":
          this.audio.play("fail");
          this.shake.add(0.55);
          this.loop.freeze(90);
          break;
        case "revived":
          this.particles.burst({ x: cx, y: 1, z: cz }, { count: 30, color: "#ffffff", speed: 6, up: 6 });
          this.audio.play("win", { pitch: 1.25 });
          break;
        default:
          break;
      }
    }
    if (got) this.#coinFx(got, gx / got, gz);
    sim.events.length = 0;
  }

  /** Micro reward: coins burst into sparkles, a "+n" rises, the pitch climbs with the streak. */
  #coinFx(n, x, z) {
    this.coinStreak = this.time - this.lastCoinAt < 4 ? this.coinStreak + 1 : 0;
    this.lastCoinAt = this.time;
    this.particles.burst({ x, y: 0.9, z }, { count: 5 + n * 3, color: "#ffd23f", speed: 4.5, up: 4, size: 0.12, life: 0.5 });
    const s = this.toScreen(x, 2.2, z);
    if (s.visible) this.ui.floatText(s.x, s.y, `+${n}`, "gold");
    this.audio.play("coin", { pitch: 1 + Math.min(0.6, this.coinStreak * 0.06), volume: 0.8 });
  }

  #battleFx(sim, cx, cz, dt) {
    this.clashTimer -= dt;
    if (this.clashTimer > 0) return;
    this.clashTimer = 0.09;
    const f = formation(sim.count);
    const z = cz - f.extentZ;
    this.particles.burst({ x: cx + (Math.random() - 0.5) * 4, y: 0.8, z }, { count: 3, color: Math.random() < 0.5 ? this.theme.crowd : this.theme.enemy, speed: 5, up: 4, size: 0.11, life: 0.45 });
    this.audio.play("clash", { pitch: 0.9 + Math.random() * 0.3, volume: 0.7, minGap: 0.08 });
  }

  #addSitters(cost, tier) {
    const add = Math.min(12, Math.round(cost));
    for (let i = 0; i < add && this.sitters.count < 160; i++) {
      const k = this.sitters.count;
      const x = (((k * 7919) % 100) / 100 - 0.5) * (T.trackHalfWidth * 2 - 1.2);
      const dz = (((k * 104729) % 100) / 100 - 0.5) * (T.finishTierLength - 0.8);
      _m.makeTranslation(x, tier.y, tier.z + dz);
      this.sitters.setMatrixAt(k, _m);
      this.sitters.count = k + 1;
    }
    this.sitters.instanceMatrix.needsUpdate = true;
  }

  #cameraTarget(sim, cx, cy, cz) {
    const portrait = this.stage.size.aspect < 1;
    const f = formation(Math.max(sim.count, 1));
    // Portrait (mobile) keeps the crowd large and pushes the horizon up, so the
    // screen is not half empty sky.
    const back = (portrait ? 12 : 12.5) + f.extentZ * 0.7;
    const up = (portrait ? 14 : 10.5) + f.extentZ * 0.4;
    this._tPos = this._tPos || new Vector3();
    this._tLook = this._tLook || new Vector3();
    this._tPos.set(cx * (portrait ? 0.35 : 0.55), cy + up, cz + back);
    this._tLook.set(cx * 0.35, cy + 0.6, cz - (portrait ? 8 : 7));
    if (sim.phase === "finish" || sim.phase === "won") {
      this._tPos.x += portrait ? 3 : 8;
      this._tPos.y += 2.5;
      this._tLook.x = 0;
    } else if (sim.phase === "battle") {
      this._tPos.y -= 1.5;
      this._tPos.z -= 2.5;
    }
  }

  #camera(sim, cx, cy, cz, dt) {
    if (this.cameraOverride) {
      const { pos, look } = this.cameraOverride;
      this.stage.camera.position.set(cx + pos[0], cy + pos[1], cz + pos[2]);
      this.stage.camera.lookAt(cx + look[0], cy + look[1], cz + look[2]);
      return;
    }
    this.#cameraTarget(sim, cx, cy, cz);
    const k = 1 - Math.exp(-5 * dt);
    this.camPos.lerp(this._tPos, k);
    this.camLook.lerp(this._tLook, k);
    const cam = this.stage.camera;
    const o = this.shake.offset;
    cam.position.set(this.camPos.x + o.x, this.camPos.y + o.y, this.camPos.z + o.z);
    cam.lookAt(this.camLook);
    cam.rotateZ(o.roll);
  }

  #bubbles(sim, cx, cy, cz, alpha) {
    const f = formation(sim.count);
    const s = this.toScreen(cx, cy + 2.1, cz - f.extentZ * 0.3);
    const showPlayer = sim.count >= 0.5 && sim.phase !== "won";
    this.ui.setBubble("player", s.x, s.y, displayCount(sim.count), showPlayer && s.visible, "player");
    sim.enemies.forEach((e, i) => {
      const ez = lerp(e.prevZ, e.z, alpha);
      const near = !e.dead && Math.abs(ez - cz) < 70;
      const es = this.toScreen(0, 2.1, ez);
      this.ui.setBubble(`enemy${i}`, es.x, es.y, displayCount(e.count), near && es.visible, "enemy");
    });
  }
}
