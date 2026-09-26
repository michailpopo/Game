/**
 * Crowd runner simulation. Pure JS: no three.js, no DOM, no Math.random, no clock.
 *
 * That is what makes CG-GAME-003 testable (tools/qa/sim-health.mjs runs this in
 * Node at several step sizes) and what lets a multiplayer server run the same
 * rules. All rates are per second and multiplied by dt; smoothing uses
 * exp(-k*dt), never a per-step constant.
 *
 * The view never mutates state; it drains `state.events` for feedback.
 *
 * Phases: ready -> run <-> battle -> finish -> won | failed
 */

import { TUNING as T } from "../config.js";
import { formation, slotOffset } from "./formation.js";
import { applyOp } from "./level-gen.js";

const tmp = { x: 0, z: 0 };
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

export function createSim(spec, startCount) {
  return {
    spec,
    phase: "ready",
    t: 0,
    x: 0, prevX: 0, targetX: 0,
    z: 0, prevZ: 0,
    count: startCount,
    lostAcc: 0,
    pushing: false,
    invuln: 0,
    battle: null,
    tier: -1,
    multiplier: 1,
    gates: spec.gates.map((g) => ({ ...g, used: false, side: null })),
    blocks: spec.blocks.map((b) => ({ ...b, hp: b.hp0, broken: false, touched: false })),
    saws: spec.saws.map((s) => ({ ...s, angle: s.phase })),
    enemies: spec.enemies.map((e) => ({ ...e, z: e.z0, prevZ: e.z0, count: e.count0, dead: false, charging: false })),
    coins: (spec.coins || []).map((c) => ({ ...c, got: false })),
    coinNext: 0,       // coins are in run order: everything before this index has been passed
    runCoins: 0,       // collected this run; banked at the result (win or fail)
    events: [],
  };
}

export function progress(s) {
  return clamp(s.z / s.spec.finishZ, 0, 1);
}

export function displayCount(n) {
  return Math.max(0, Math.round(n));
}

export function startRun(s) {
  if (s.phase !== "ready") return false;
  s.phase = "run";
  s.events.push({ type: "runStart" });
  return true;
}

/** Rewarded revive: a fair second chance, not an instant second death. */
export function revive(s) {
  if (s.phase !== "failed") return false;
  if (s.battle) { s.battle.dead = true; s.battle.count = 0; s.battle = null; }
  s.count = T.reviveUnits;
  s.invuln = T.reviveInvulnSec;
  s.phase = "run";
  s.events.push({ type: "revived", count: s.count });
  return true;
}

/** @param {{ steer?:number, axis?:number }} input steer in world units this step, axis -1..1 */
export function step(s, dt, input = {}) {
  s.prevX = s.x;
  s.prevZ = s.z;
  for (const e of s.enemies) e.prevZ = e.z;
  for (const w of s.saws) w.angle += w.speed * dt;
  if (s.phase === "ready" || s.phase === "won" || s.phase === "failed") return;

  s.t += dt;
  if (s.invuln > 0) s.invuln = Math.max(0, s.invuln - dt);

  const f = formation(s.count);
  const maxX = Math.max(0, T.trackHalfWidth - T.unitRadius - f.extentX);
  s.targetX = clamp(s.targetX + (input.steer || 0) + (input.axis || 0) * T.keySteerSpeed * dt, -maxX, maxX);
  s.x = clamp(s.x + (s.targetX - s.x) * (1 - Math.exp(-T.lateralFollow * dt)), -maxX, maxX);

  if (s.phase === "battle") return stepBattle(s, dt);
  if (s.phase === "finish") return stepFinish(s, dt);

  const speed = T.runSpeed * (s.pushing ? T.pushSpeedFactor : 1);
  s.z -= speed * dt;
  s.pushing = false;

  // Gates: triggered when the front of the crowd reaches them; the side under
  // the crowd centre applies to the whole crowd.
  for (const g of s.gates) {
    if (g.used || s.z - f.extentZ * 0.35 > g.z) continue;
    g.used = true;
    g.side = s.x < 0 ? "left" : "right";
    const op = g[g.side];
    const before = s.count;
    s.count = applyOp(s.count, op);
    s.events.push({ type: "gate", id: g.id, side: g.side, op, before, after: s.count });
    if (s.count < 0.5) return fail(s, "gate");
  }

  // Coins: judged when the crowd front reaches their row; collected if the crowd covers them.
  while (s.coinNext < s.coins.length && s.z - f.extentZ * 0.35 <= s.coins[s.coinNext].z) {
    const c = s.coins[s.coinNext++];
    if (Math.abs(c.x - s.x) > f.extentX + T.coinReach) continue;
    c.got = true;
    s.runCoins++;
    s.events.push({ type: "coin", id: c.id, x: c.x, z: c.z });
  }

  if (s.invuln <= 0) {
    collideBlocks(s, dt, f);
    if (s.phase !== "run") return;
    collideSaws(s, dt, f);
    if (s.phase !== "run") return;
  }

  for (const e of s.enemies) {
    if (e.dead) continue;
    const fe = formation(e.count);
    const gap = (s.z - f.extentZ) - (e.z + fe.extentZ);
    if (!e.charging && gap < T.enemyChargeDistance) e.charging = true;
    if (e.charging) e.z += T.enemyChargeSpeed * dt;
    if (gap <= 0.4) {
      s.phase = "battle";
      s.battle = e;
      s.events.push({ type: "battleStart", id: e.id, enemy: e.count, crowd: s.count });
      return;
    }
  }

  if (s.z <= s.spec.finishZ) {
    s.phase = "finish";
    s.events.push({ type: "finishLine" });
  }
}

function lose(s, amount, cause, x, z) {
  if (amount <= 0) return;
  s.count = Math.max(0, s.count - amount);
  s.lostAcc += amount;
  const n = Math.floor(s.lostAcc);
  if (n > 0) {
    s.lostAcc -= n;
    s.events.push({ type: "lost", n, cause, x, z });
  }
}

function fail(s, cause) {
  s.count = 0;
  s.phase = "failed";
  s.events.push({ type: "failed", cause, progress: progress(s) });
}

function collideBlocks(s, dt, f) {
  const r = T.unitRadius;
  for (const b of s.blocks) {
    if (b.broken) continue;
    const zMin = b.z - b.depth / 2 - r;
    const zMax = b.z + b.depth / 2 + r;
    if (s.z - f.extentZ > zMax || s.z + f.extentZ < zMin) continue;

    let k = 0, sx = 0, sz = 0;
    for (let i = 0; i < f.n; i++) {
      slotOffset(i, f, tmp);
      const px = s.x + tmp.x, pz = s.z + tmp.z;
      if (px >= b.x0 - r && px <= b.x1 + r && pz >= zMin && pz <= zMax) { k++; sx += px; sz += pz; }
    }
    if (k === 0) continue;

    s.pushing = true;
    if (!b.touched) { b.touched = true; s.events.push({ type: "blockHit", id: b.id }); }
    const rate = Math.max(T.blockRateMin, b.hp0 * T.blockRateFactor);
    const amount = Math.min(rate * dt, b.hp, s.count, k * f.perSlot);
    b.hp -= amount;
    lose(s, amount, "block", sx / k, sz / k);
    if (b.hp <= 1e-6) {
      b.hp = 0;
      b.broken = true;
      s.events.push({ type: "blockBroken", id: b.id });
    }
    if (s.count < 0.5) return fail(s, "block");
  }
}

function collideSaws(s, dt, f) {
  const hitR = 0.28 + T.unitRadius;
  for (const w of s.saws) {
    if (Math.abs(s.z - w.z) > f.extentZ + w.len) continue;
    const c = Math.cos(w.angle), sn = Math.sin(w.angle);
    let k = 0, sx = 0, sz = 0;
    for (let i = 0; i < f.n; i++) {
      slotOffset(i, f, tmp);
      const dx = s.x + tmp.x - w.x, dz = s.z + tmp.z - w.z;
      const t = clamp(dx * c + dz * sn, -w.len, w.len);
      const ex = dx - t * c, ez = dz - t * sn;
      if (ex * ex + ez * ez < hitR * hitR) { k++; sx += s.x + tmp.x; sz += s.z + tmp.z; }
    }
    if (k === 0) continue;
    lose(s, Math.min(s.count, k * f.perSlot * T.sawKillRate * dt), "saw", sx / k, sz / k);
    if (s.count < 0.5) return fail(s, "saw");
  }
}

function stepBattle(s, dt) {
  const e = s.battle;
  const rate = Math.max(T.battleRateMin, Math.min(s.count, e.count) * T.battleRateFactor);
  const amount = Math.min(rate * dt, s.count, e.count);
  const fe = formation(e.count);
  const f = formation(s.count);
  // Close the gap so the groups visibly collide.
  const gap = (s.z - f.extentZ) - (e.z + fe.extentZ);
  if (gap > 0) e.z += Math.min(gap, T.enemyChargeSpeed * dt);
  e.count = Math.max(0, e.count - amount);
  lose(s, amount, "battle", s.x, s.z - f.extentZ);
  if (e.count < 0.5) {
    e.count = 0;
    e.dead = true;
    s.battle = null;
    s.phase = s.count < 0.5 ? "failed" : "run";
    s.events.push({ type: "enemyDefeated", id: e.id });
    if (s.phase === "failed") fail(s, "battle");
    return;
  }
  if (s.count < 0.5) fail(s, "battle");
}

function stepFinish(s, dt) {
  s.z -= T.finishSpeed * dt;
  const next = s.tier + 1;
  const tierStartZ = s.spec.finishZ - 4 - next * T.finishTierLength;
  if (s.z > tierStartZ) return;

  const tier = s.spec.tiers[next];
  if (!tier || s.count < tier.cost) return win(s);
  s.count -= tier.cost;
  s.tier = next;
  s.multiplier = tier.mult;
  s.events.push({ type: "tier", index: next, mult: tier.mult, cost: tier.cost });
  if (next === s.spec.tiers.length - 1 || s.count < 0.5) win(s);
}

function win(s) {
  s.phase = "won";
  s.events.push({ type: "won", multiplier: s.multiplier, tier: s.tier });
}
