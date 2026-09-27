/**
 * FxKit - one object that owns the whole particle kit and offers the "moments" as presets.
 * Draw calls when everything is active: sprites 1 + ribbons 1 + shards 1 + coins 1 + gems 1 = 5.
 *
 *   import { FxKit } from "./fx/fx-kit.js";
 *   const fx = new FxKit(stage.scene);
 *   fx.strike(from, to, { color: "#4df3ff", forks: 3 });   // forked bolt + halos + sparks + ring at `to`
 *   fx.shatter(at, { colors: GEM_COLORS });                // flash, 2 shockwaves, glass shards, sparks, streaks
 *   fx.coinBurst(at, { count: 12, target: hudWorldPos });  // coins pop out, then fly to the target
 *   fx.gemBurst(at) · fx.impact(at) · fx.sparkle(at)       // medium / small / micro feedback
 *   fx.update(dt, camera);                                  // once per frame, before stage.render()
 *   new FxKit(scene, { unit: 2.4, outline: { color: "#0b1446" } })  // metres per preset unit; dark bolt outline
 *
 * Proportional feedback (references/design/game-feel-juice.md): sparkle = micro (every hit),
 * impact = small, gemBurst/coinBurst = medium, strike/shatter = peak. Callers pick; nothing auto-escalates.
 * Pools never grow and never allocate per frame; when full the oldest slot is reused.
 */

import { CylinderGeometry, OctahedronGeometry } from "three";
import { Debris, FxSprites } from "./particles.js";
import { Bolts, Ribbons } from "./ribbons.js";
import { MATERIALS } from "../render/materials.js";
import { GEM_COLORS } from "../render/palette.js";

/** 9-triangle glass sliver. */
export function shardGeometry() { return new CylinderGeometry(0, 0.5, 1.5, 3, 1).scale(1, 1, 0.32); }
/** 56-triangle coin facing +z. */
export function coinGeometry() { return new CylinderGeometry(0.5, 0.5, 0.12, 14, 1).rotateX(Math.PI / 2); }
/** 8-triangle gem. */
export function gemGeometry() { return new OctahedronGeometry(0.5, 0).scale(1, 1.3, 1); }

const NO_OPTS = Object.freeze({});
const UP = Object.freeze([0, 1, 0]);
const MAX_STREAKS = 12;

export class FxKit {
  /**
   * @param {import("three").Scene} scene
   * @param {{ sprites?: number, shards?: number, coins?: number, gems?: number, ribbons?: number, unit?: number,
   *           outline?: { color?: string, alpha?: number } | null, castShadow?: boolean, floorY?: number, rand?: () => number }} [opts]
   *   unit: world metres per preset unit (sizes, speeds, gravity scale with it; 1 = the look demo's scale)
   */
  constructor(scene, { sprites = 1500, shards = 160, coins = 48, gems = 48, ribbons = 30, unit = 1, outline = null, castShadow = false, floorY = 0, rand = Math.random } = {}) {
    this.unit = unit;
    const g = 16 * unit;
    this.sprites = new FxSprites(scene, { max: sprites });
    this.shards = new Debris(scene, shardGeometry(), MATERIALS.crystal(0xffffff, { inner: 0.5, rim: 1.2 }), { max: shards, castShadow, floorY, gravity: g, name: "fx-shards" });
    this.coins = new Debris(scene, coinGeometry(), MATERIALS.gold(), { max: coins, castShadow, floorY, bounce: 0.45, gravity: g, name: "fx-coins" });
    this.gems = new Debris(scene, gemGeometry(), MATERIALS.crystal(0xffffff, { inner: 0.6 }), { max: gems, castShadow, floorY, gravity: g, name: "fx-gems" });
    this.ribbons = new Ribbons(scene, { max: ribbons, points: 33, outline });
    this.bolts = new Bolts(this.ribbons, { rand });
    this.rand = rand;
    this.streaks = Array.from({ length: MAX_STREAKS }, () => ({ slot: -1, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, g: 0 }));
  }

  /**
   * A bolt only (no impact): forked lightning from `from` to `to` with soft glow beads and a halo at `from`.
   * opts: color, width, forks, forkLength, arc, life, jag, intensity (glow, ~1.4-1.8), core (white, ~3), progress,
   * forkProgress, flicker, depth, haloSize, beads.
   */
  bolt(from, to, o = NO_OPTS) {
    const u = this.unit, color = o.color ?? "#4df3ff";
    const id = this.bolts.strike(from, to, {
      color, width: (o.width ?? 0.5) * u, forks: o.forks ?? 2, forkLength: o.forkLength ?? 0.45, arc: (o.arc ?? 0.8) * u, life: o.life ?? 0.4,
      jag: o.jag ?? 0.11, intensity: o.intensity ?? 1.6, core: o.core ?? 3, progress: o.progress ?? 1, forkProgress: o.forkProgress ?? 1, flicker: o.flicker ?? 0.05, depth: o.depth,
    });
    const s = (o.haloSize ?? 1.6) * u;
    if (o.fromHalo !== false) this.sprites.glow(from.x, from.y, from.z, { color, intensity: 2.2, size: s * 0.6, grow: 1.2, life: (o.life ?? 0.4) * 1.1 });
    const beads = o.beads ?? 3, reach = o.progress ?? 1, arc = (o.arc ?? 0.8) * u;
    for (let i = 1; i <= beads; i++) {
      const t = (i / (beads + 1)) * reach, lift = arc * 4 * t * (1 - t);
      this.sprites.glow(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t + lift, from.z + (to.z - from.z) * t,
        { color, intensity: 0.8, size: s * 0.8, grow: 1.1, life: (o.life ?? 0.4) * 1.2 });
    }
    return id;
  }

  /** Peak: a bolt + the impact at `to` (halo, flat shockwave, sparks). ringDrop lowers the ring onto the roof. */
  strike(from, to, o = NO_OPTS) {
    const id = this.bolt(from, to, o);
    if ((o.progress ?? 1) >= 1) this.impact(to, { color: o.color ?? "#4df3ff", size: o.haloSize ?? 1.6, sparks: o.sparks ?? 26, ringDrop: o.ringDrop });
    return id;
  }

  /** Small/medium: flash + sparks + a ring (flat on the ground/roof by default: reads as 3D). */
  impact(at, o = NO_OPTS) {
    const u = this.unit, color = o.color ?? "#ffffff", s = (o.size ?? 1.2) * u;
    this.sprites.halo(at, { color, size: s, intensity: o.intensity ?? 2.4, life: o.life ?? 0.4 });
    if (o.ring !== false) this.sprites.ring(at.x, at.y - (o.ringDrop ?? 0), at.z, { color, from: s * 0.3, to: s * 1.9, life: 0.5, thickness: 0.35, intensity: 1.8, normal: o.ringNormal ?? UP });
    if ((o.sparks ?? 18) > 0) this.sparks(at, { count: o.sparks ?? 18, color, colors: o.colors, speed: 7 * (o.power ?? 1), up: 3, size: 0.08, life: 0.55 });
  }

  /** A spark burst in preset units (scaled by `unit`). */
  sparks(at, o = NO_OPTS) {
    const u = this.unit;
    this.sprites.sparkBurst(at, {
      count: o.count ?? 12, color: o.color ?? "#ffffff", colors: o.colors, speed: (o.speed ?? 6) * u, up: (o.up ?? 2.5) * u, size: (o.size ?? 0.07) * u,
      life: o.life ?? 0.5, intensity: o.intensity ?? 2.8, stretch: (o.stretch ?? 0.06) / u, gravity: (o.gravity ?? 9) * u, spread: 0.2 * u,
    });
  }

  /** A soft glow in preset units. */
  glow(at, o = NO_OPTS) {
    const u = this.unit;
    return this.sprites.glow(at.x, at.y, at.z, { ...o, size: (o.size ?? 1) * u });
  }

  /** A flat or billboard ring in preset units. */
  ring(at, o = NO_OPTS) {
    const u = this.unit;
    return this.sprites.ring(at.x, at.y, at.z, { ...o, from: (o.from ?? 0.2) * u, to: (o.to ?? 3) * u });
  }

  /** Peak: something glassy explodes - flash, two shockwaves, glass shards, sparks, glowing streaks. */
  shatter(at, o = NO_OPTS) {
    const u = this.unit, colors = o.colors ?? GEM_COLORS, p = o.power ?? 1, main = o.color ?? colors[0];
    this.sprites.halo(at, { color: main, size: 2.4 * p * u, intensity: 2.6, life: 0.5 });
    this.sprites.ring(at.x, at.y, at.z, { color: "#ffffff", from: 0.3 * u, to: 3.4 * p * u, life: 0.35, thickness: 0.07, intensity: 1.1 });
    this.sprites.ring(at.x, at.y, at.z, { color: main, from: 0.2 * u, to: 2.4 * p * u, life: 0.6, thickness: 0.3, intensity: 1.6 });
    this.shards.burst(at, { count: o.count ?? 36, colors, speed: 11 * p * u, up: 4 * u, size: 0.5 * p * u, life: 1.6, spin: 14 });
    this.sparks(at, { count: (o.count ?? 36) * 2, colors, speed: 14 * p, up: 3, size: 0.09, life: 0.8, intensity: 3.2, stretch: 0.07 });
    for (let i = 0; i < (o.streaks ?? 6); i++) {
      const a = this.rand() * Math.PI * 2, k = this.rand() * 0.9 + 0.1, sp = (10 + this.rand() * 6) * p * u;
      this.streak(at, Math.cos(a) * sp * (1 - k * 0.5), k * sp, Math.sin(a) * sp * (1 - k * 0.5), { color: colors[i % colors.length], width: 0.28 * p });
    }
  }

  /** A glowing ballistic streak with a ribbon tail (fireworks-style). Velocity in world units/s. */
  streak(at, vx, vy, vz, o = NO_OPTS) {
    const s = this.streaks.find((q) => q.slot < 0);
    if (!s) return;
    s.slot = this.ribbons.trail({ color: o.color ?? "#ffffff", width: (o.width ?? 0.28) * this.unit, intensity: o.intensity ?? 2.2, core: 1.8 });
    if (s.slot < 0) return;
    s.x = at.x; s.y = at.y; s.z = at.z; s.vx = vx; s.vy = vy; s.vz = vz; s.life = o.life ?? 0.7; s.g = (o.gravity ?? 14) * this.unit;
  }

  /** Medium: coins pop out; with `target` ({x,y,z}) they fly there after `delay` s. */
  coinBurst(at, o = NO_OPTS) {
    const u = this.unit;
    if (o.target) this.coins.target.copy(o.target);
    this.coins.burst(at, { count: o.count ?? 12, color: "#ffffff", speed: (o.speed ?? 6) * u, up: 7 * u, size: (o.size ?? 0.55) * u, life: o.life ?? 2.2, spin: 9, home: !!o.target, homeDelay: o.delay ?? 0.5 });
    this.sparks(at, { count: 12, color: "#ffd166", speed: 6, up: 4, size: 0.07, life: 0.5, intensity: 2.6 });
  }

  /** Medium: gems pop out and bounce. */
  gemBurst(at, o = NO_OPTS) {
    const u = this.unit;
    this.gems.burst(at, { count: o.count ?? 10, colors: o.colors ?? GEM_COLORS, speed: (o.speed ?? 6) * u, up: 7 * u, size: (o.size ?? 0.5) * u, life: 1.8, spin: 8 });
    this.sprites.glow(at.x, at.y, at.z, { color: "#ffffff", size: u, life: 0.25, intensity: 2 });
  }

  /** Micro reward: a few sparks and a tiny glow. */
  sparkle(at, o = NO_OPTS) {
    const color = o.color ?? "#ffffff";
    this.sprites.glow(at.x, at.y, at.z, { color, size: (o.size ?? 0.6) * this.unit, life: 0.22, intensity: 2.2 });
    this.sparks(at, { count: o.count ?? 8, color, speed: 4, up: 2.5, size: 0.06, life: 0.4, intensity: 2.6 });
  }

  update(dt, camera) {
    for (let i = 0; i < MAX_STREAKS; i++) {
      const s = this.streaks[i];
      if (s.slot < 0) continue;
      s.life -= dt;
      s.vy -= s.g * dt;
      const k = Math.exp(-1.2 * dt);
      s.vx *= k; s.vz *= k;
      s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt;
      this.ribbons.push(s.slot, s.x, s.y, s.z);
      if (s.life <= 0) { this.ribbons.release(s.slot, 0.2); s.slot = -1; }
    }
    this.bolts.update(dt);
    this.sprites.update(dt);
    this.shards.update(dt);
    this.coins.update(dt);
    this.gems.update(dt);
    this.ribbons.update(dt, camera);
  }

  clear() {
    for (const s of this.streaks) s.slot = -1;
    this.bolts.clear(); this.ribbons.clear(); this.sprites.clear(); this.shards.clear(); this.coins.clear(); this.gems.clear();
  }
}
