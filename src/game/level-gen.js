/**
 * Deterministic level generation.
 *
 * Same level number -> same layout, on every device, forever (so a player's
 * report about "level 12" is reproducible and setGameContext is useful).
 * Balanced against a NOMINAL start count, not the player's upgrades, so
 * upgrades make levels easier instead of the levels scaling away from them.
 *
 * Solvability rule: along the greedy-best path (best gate each time, avoidable
 * hazards avoided), the crowd must beat every enemy with a margin. If it would
 * not, enemies are scaled down until it does.
 */

import { TUNING as T } from "../config.js";
import { createRng } from "../core/rng.js";

const NOMINAL_START = 5;
const TIER_MULTS = [1.2, 1.4, 1.6, 1.8, 2, 2.5, 3, 4, 5, 6];
const COIN_ROW = [-4.2, -2.1, 0, 2.1, 4.2];

export function applyOp(count, op) {
  switch (op.op) {
    case "+": return count + op.v;
    case "-": return Math.max(0, count - op.v);
    case "x": return Math.round(count * op.v);
    case "/": return Math.ceil(count / op.v);
    default: return count;
  }
}

export function opLabel(op) {
  return { "+": "+", "-": "−", x: "×", "/": "÷" }[op.op] + op.v;
}

export function isGoodOp(op) { return op.op === "+" || op.op === "x"; }

/**
 * Target best-path crowd size across a level. Without a curve, ×2 gates compound
 * without limit (a first test run hit 509 units on level 1, which made the
 * final battle trivial and flooded the screen).
 */
export function crowdTarget(level, frac) {
  const end = 45 + 18 * Math.min(level, 25);
  return NOMINAL_START + (end - NOMINAL_START) * Math.pow(Math.max(0, Math.min(1, frac)), 0.85);
}

/** The better option lands near the target curve; the other is a lesser gain or a trap. */
function makeGate(rng, E, target, level, id, z) {
  let best;
  if (E >= 6 && E * 2 <= target * 1.3 && rng.chance(0.55)) best = { op: "x", v: 2 };
  else if (E >= 4 && E * 3 <= target * 1.2 && rng.chance(0.25)) best = { op: "x", v: 3 };
  else best = { op: "+", v: Math.max(3, Math.round(target - E + rng.int(-2, 4))) };
  const gain = applyOp(E, best) - E;

  let other;
  const roll = rng.next();
  if (level <= 1 || roll < 0.4) other = { op: "+", v: Math.max(2, Math.round(gain * rng.range(0.35, 0.7))) };
  else if (roll < 0.8 || E < 8) other = { op: "-", v: Math.max(2, Math.round(E * rng.range(0.2, 0.5))) };
  else other = { op: "/", v: 2 };
  if (other.op === best.op && other.v === best.v) other.v = Math.max(1, other.v - 2);

  const swap = rng.chance(0.5);
  return { type: "gate", id, z, left: swap ? other : best, right: swap ? best : other };
}

export function generateLevel(level) {
  const rng = createRng(`crowd-rush-level-${level}`);
  const length = Math.round(360 + Math.min(level, 20) * 14);
  const finishZ = -length;
  const spec = {
    level, length, finishZ,
    gates: [], blocks: [], saws: [], enemies: [], tiers: [],
    theme: Math.floor((level - 1) / 5),
  };

  let E = NOMINAL_START;
  let z = -34;
  let id = 0;
  const endOfObstacles = finishZ + 70;

  while (z > endOfObstacles) {
    const r = rng.next();
    const allowSaw = level >= 2;
    const allowBlock = true;
    const allowMidEnemy = level >= 4 && E > 20;

    const target = crowdTarget(level, z / finishZ);
    if (r < 0.52 || z > -40) {
      const g = makeGate(rng, E, target, level, id++, z);
      spec.gates.push(g);
      E = Math.max(applyOp(E, g.left), applyOp(E, g.right));
    } else if (r < 0.72 && allowBlock) {
      const side = rng.chance(0.5) ? -1 : 1;
      const hp0 = Math.round(E * rng.range(0.3, 0.75)) + 3;
      spec.blocks.push({ id: id++, z, x0: side < 0 ? -T.trackHalfWidth : 0.9, x1: side < 0 ? -0.9 : T.trackHalfWidth, depth: 1.6, hp0 });
    } else if (r < 0.88 && allowSaw) {
      spec.saws.push({ id: id++, z, x: rng.chance(0.5) ? -3 : 3, len: 2.7, speed: rng.range(2.4, 3.4) * (rng.chance(0.5) ? 1 : -1), phase: rng.range(0, Math.PI) });
    } else if (allowMidEnemy) {
      const count0 = Math.round(E * rng.range(0.22, 0.4));
      spec.enemies.push({ id: id++, z0: z, count0 });
      E -= count0;
    } else {
      const g = makeGate(rng, E, target, level, id++, z);
      spec.gates.push(g);
      E = Math.max(applyOp(E, g.left), applyOp(E, g.right));
    }
    z -= rng.range(36, 50);
  }

  // Final guard before the finish stairs.
  const bossShare = Math.min(0.3 + level * 0.025, 0.7);
  spec.enemies.push({ id: id++, z0: finishZ + 40, count0: Math.max(3, Math.round(E * bossShare)) });

  // Coin rows in the gaps between obstacles: a small reward every 1-2 s (skill:
  // references/design/hypercasual-hits.md, rule 2 - checked by the dead-air QA scenario).
  // Placed from the layout without the RNG, so they never reshuffle a level. A row spans
  // the track, so every steering line collects some. Coin id = index, rows in run order.
  spec.coins = [];
  const featureZ = [0, finishZ, ...spec.gates.map((g) => g.z), ...spec.blocks.map((b) => b.z),
    ...spec.saws.map((s) => s.z), ...spec.enemies.map((e) => e.z0)].sort((a, b) => b - a);
  for (let i = 1; i < featureZ.length; i++) {
    if (featureZ[i - 1] - featureZ[i] < 18) continue;
    const zRow = (featureZ[i - 1] + featureZ[i]) / 2;
    for (const x of COIN_ROW) spec.coins.push({ id: spec.coins.length, x, z: zRow });
  }

  // Solvability: E is the best-path crowd after mid-level enemies. It must beat
  // the final guard with a healthy margin; scale the guard down if it cannot.
  const finalEnemy = spec.enemies[spec.enemies.length - 1];
  const minRemaining = Math.max(4, Math.round(E * 0.25));
  if (E - finalEnemy.count0 < minRemaining) finalEnemy.count0 = Math.max(2, E - minRemaining);
  const remaining = Math.max(1, E - finalEnemy.count0);

  // Finish stairs: reaching all tiers needs most of the best-path crowd.
  const unit = Math.max(1, remaining / 16);
  for (let i = 0; i < TIER_MULTS.length; i++) {
    spec.tiers.push({ cost: Math.max(1, Math.round(unit * (0.6 + i * 0.22))), mult: TIER_MULTS[i] });
  }
  spec.expectedBest = remaining;
  return spec;
}
