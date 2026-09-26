/**
 * Bot brains (and the QA autopilot). Pure and deterministic: the only randomness is the
 * seeded stream the simulation passes in; the autopilot passes none.
 *
 * Every `thinkSec` a bot picks ONE intention, in priority order:
 *   flee   - a block of a bigger-headed snake is within fleeRadius: steer away (boost if close)
 *   chase  - a smaller head is within chaseRadius and the aggression roll passes: intercept it
 *   food   - the best loose block within seekRadius (value / distance, turning penalised)
 *   wander - a point ahead with a random bend
 * Between thinks it steers toward that intention every step (continuous, rates x dt in sim.js),
 * and it always bends away from the wall when its look-ahead point leaves the arena.
 */

import { ARENA as A } from "../config.js";
// sim.js imports this module too; the cycle is safe because these are only called at run time.
import { canEat, collidable } from "./sim.js";
import { blockSize } from "./values.js";

/**
 * @param {object} s simulation state
 * @param {object} me the snake that thinks
 * @param {{ next:()=>number } | null} rng the bot's own seeded stream, or null for the deterministic autopilot
 * @param {{ flee?:number, chase?:number, seek?:number, aggression?:number, chaseMax?:number }} [o] overrides (autopilot)
 */
export function think(s, me, rng, o = {}) {
  const B = A.bots;
  const ai = me.ai;
  const hs = blockSize(me.head);
  const flee = (o.flee ?? B.fleeRadius) + hs * 0.5;
  const chase = o.chase ?? B.chaseRadius;
  const seek = o.seek ?? B.seekRadius;
  const aggression = o.aggression ?? s.tier.aggression;
  // Always the same number of draws per think, so a different branch never shifts later decisions.
  const roll = rng ? rng.next() : 0;
  const bend = rng ? (rng.next() - 0.5) * 2.2 : 0.4;

  // 1. flee the nearest planet of any chain with a bigger head
  let td2 = flee * flee, tx = 0, tz = 0, threat = false;
  for (const other of s.snakes) {
    if (other === me || !collidable(s, other) || other.head <= me.head) continue;
    const broad = other.len + flee + A.blocks.sizeMax;
    if ((other.x - me.x) ** 2 + (other.z - me.z) ** 2 > broad * broad) continue;
    for (let j = 0; j < other.n; j++) {
      const dx = other.segX[j] - me.x, dz = other.segZ[j] - me.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < td2) { td2 = d2; tx = other.segX[j]; tz = other.segZ[j]; threat = true; }
    }
  }
  if (threat) {
    ai.mode = "flee"; ai.tx = tx; ai.tz = tz; ai.target = -1;
    ai.boost = Math.sqrt(td2) < B.boostWhenClose + hs * 0.5;
    return;
  }

  // 2. chase a smaller head - for at most chaseMaxSec, then leave that hunt for chaseRestSec
  if (roll < aggression && s.clock >= ai.noChase) {
    let best = null, bd2 = chase * chase;
    for (const other of s.snakes) {
      if (other === me || !collidable(s, other) || other.head >= me.head) continue;
      const d2 = (other.x - me.x) ** 2 + (other.z - me.z) ** 2;
      if (d2 < bd2) { bd2 = d2; best = other; }
    }
    if (best) {
      if (ai.mode !== "chase" || ai.target !== best.id) ai.chaseStart = s.clock;
      if (s.clock - ai.chaseStart <= (o.chaseMax ?? B.chaseMaxSec)) {
        ai.mode = "chase"; ai.target = best.id; ai.tx = best.x; ai.tz = best.z;
        ai.boost = Math.sqrt(bd2) < B.boostWhenClose * 2;
        return;
      }
      ai.noChase = s.clock + B.chaseRestSec;
    }
  }

  // 3. food: value per distance, penalise blocks behind the head
  const L = s.loose;
  const seek2 = seek * seek;
  const hx = Math.cos(me.heading), hz = Math.sin(me.heading);
  let bestScore = 0, fi = -1;
  for (let i = 0; i < L.cap; i++) {
    if (!L.alive[i]) continue;
    const dx = L.x[i] - me.x, dz = L.z[i] - me.z;
    const d2 = dx * dx + dz * dz;
    if (d2 > seek2) continue;
    const d = Math.sqrt(d2) + 1e-6;
    const facing = (dx * hx + dz * hz) / d;            // 1 ahead ... -1 behind
    const score = L.v[i] / (d + 1.5) * (1.4 + 0.6 * facing);
    if (score > bestScore && canEat(s, me, L.v[i])) { bestScore = score; fi = i; }
  }
  if (fi >= 0) {
    ai.mode = "food"; ai.target = fi; ai.tx = L.x[fi]; ai.tz = L.z[fi]; ai.boost = false;
    return;
  }

  // 4. wander
  ai.mode = "wander"; ai.target = -1; ai.boost = false;
  ai.tx = me.x + Math.cos(me.heading + bend) * 10;
  ai.tz = me.z + Math.sin(me.heading + bend) * 10;
}

/** Turn the current intention into this step's input (fills `out`, see sim.js makeInput). */
export function steerBot(s, me, out) {
  const ai = me.ai;
  let tx = ai.tx, tz = ai.tz;
  if (ai.mode === "chase") {
    const o = s.snakes[ai.target];
    if (o && collidable(s, o) && o.head < me.head) {
      const lead = Math.min(3, Math.hypot(o.x - me.x, o.z - me.z) * 0.3);
      tx = o.x + Math.cos(o.heading) * lead;
      tz = o.z + Math.sin(o.heading) * lead;
    } else { ai.mode = "wander"; ai.boost = false; }
  } else if (ai.mode === "food") {
    const L = s.loose;
    if (L.alive[ai.target]) { tx = L.x[ai.target]; tz = L.z[ai.target]; }
  }
  let dx = tx - me.x, dz = tz - me.z;
  if (ai.mode === "flee") { dx = -dx; dz = -dz; }
  const d = Math.hypot(dx, dz) || 1;
  dx /= d; dz /= d;

  // Wall: when the look-ahead point is outside the safe zone, bend toward the middle.
  const hs = blockSize(me.head);
  const ahead = 3.5 + hs;
  const fx = me.x + Math.cos(me.heading) * ahead, fz = me.z + Math.sin(me.heading) * ahead;
  const safe = A.arena.halfSize - 3 - hs;
  const out_ = A.arena.shape === "circle"
    ? Math.max(0, Math.hypot(fx, fz) - safe)
    : Math.max(0, Math.abs(fx) - safe, Math.abs(fz) - safe);
  if (out_ > 0) {
    const cx = -me.x, cz = -me.z;
    const cd = Math.hypot(cx, cz) || 1;
    const w = Math.min(1, out_ / 2.5);
    dx = dx * (1 - w) + (cx / cd) * w * 1.6;
    dz = dz * (1 - w) + (cz / cd) * w * 1.6;
  }
  out.hasDir = true;
  out.dirX = dx;
  out.dirZ = dz;
  out.turn = 0;
  out.boost = ai.boost;
}

/**
 * QA autopilot for the player: steer toward pickups and smaller heads, away from bigger ones,
 * so dead-air and long-run checks measure real play. Deterministic (no rng).
 */
export function autopilot(s, out) {
  const p = s.player;
  if (!p.alive) { out.hasDir = false; out.turn = 0; out.boost = false; return; }
  if (s.clock >= p.ai.next) {
    think(s, p, null, { flee: A.bots.fleeRadius + 2, chase: 6, aggression: 1, chaseMax: 1.2 });
    p.ai.next = s.clock + 0.15;
  }
  steerBot(s, p, out);
  if (p.ai.mode === "food" || p.ai.mode === "wander") out.boost = false;
}
