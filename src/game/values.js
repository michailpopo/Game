/**
 * The value ladder and the chain merge rule. Pure functions, no DOM, no three.js.
 *
 * Ladder: base, base*2, base*4 ... ("level" 1, 2, 3 ...). Colours, label text and block
 * size are looked up by level, so a designer can change the base or the palette without
 * touching the simulation.
 *
 * Merge rule (ARENA.values): a chain is kept sorted, biggest value at the head. A new block
 * is inserted after every block >= its value; whenever two neighbours are equal they merge
 * into one block of double value, and that may cascade (2+2=4, 4+4=8 ...). With this rule a
 * chain is exactly the binary form of its mass (the sum of its values).
 */

import { ARENA } from "../config.js";

const LOG_BASE = Math.log2(ARENA.values.base);

/** 2 -> 1, 4 -> 2, 8 -> 3 ... (for base 2). */
export function levelOf(v) {
  return Math.round(Math.log2(v) - LOG_BASE) + 1;
}

export function valueAt(level) {
  return ARENA.values.base * 2 ** (level - 1);
}

const LADDER = ARENA.values.ladder;

/** The ladder key (world name) for a level; steps past the table reuse the last key. */
export function ladderKey(level) {
  return LADDER[Math.min(LADDER.length, Math.max(1, level)) - 1];
}

/** Diameter of a planet of value v (world units) - drawing and collision. The head is its biggest planet. */
export function blockSize(v) {
  const b = ARENA.blocks;
  return Math.min(b.sizeMax, b.size + b.sizePerLevel * (Math.max(1, levelOf(v)) - 1));
}

/** Loose pickup kinds: a planet dropped by a dead chain, fresh stardust, golden finale stardust. */
export const DROPPED = 0;
export const DUST = 1;
export const GOLD = 2;

/** Diameter of a loose pickup. */
export function looseSize(v, kind) {
  const b = ARENA.blocks;
  if (kind === DROPPED) return blockSize(v) * b.looseScale;
  return b.stardustSize * (1 + 0.12 * (Math.max(1, levelOf(v)) - 1));
}

/** Short label for a value: 2 ... 8192, then 16K, 32K ... 1M. */
export function fmtValue(v) {
  if (v < 10000) return String(v);
  if (v < 1e6) return `${Math.floor(v / 1000)}K`;
  return `${Math.floor(v / 1e6)}M`;
}

/** Largest ladder value <= mass (0 when mass < base). */
export function headOfMass(mass) {
  let v = ARENA.values.base;
  if (mass < v) return 0;
  while (v * 2 <= mass) v *= 2;
  return v;
}

/**
 * Write the chain for a mass (largest first) into `out`; returns its length.
 * Any remainder below the base is dropped.
 */
export function massToChain(mass, out) {
  let n = 0;
  let v = headOfMass(mass);
  let left = mass;
  while (v >= ARENA.values.base && n < out.length) {
    if (left >= v) { out[n++] = v; left -= v; }
    v /= 2;
  }
  return n;
}

/**
 * Insert `v` into the descending chain `chain[0..n)` and merge equal neighbours.
 * `merges` (a preallocated array) receives [value, index] pairs, one per merge in cascade
 * order; `merges.length` is reset first. Returns the new length (capped at chain.length).
 */
export function insertAndMerge(chain, n, v, merges) {
  merges.length = 0;
  const cap = chain.length;
  if (n >= cap) n = cap - 1;          // full chain: the smallest block is lost
  let i = n;
  while (i > 0 && chain[i - 1] < v) { chain[i] = chain[i - 1]; i--; }
  chain[i] = v;
  n++;
  for (;;) {
    let j = -1;
    if (i > 0 && chain[i - 1] === chain[i]) j = i - 1;
    else if (i + 1 < n && chain[i + 1] === chain[i]) j = i;
    if (j < 0) break;
    chain[j] *= 2;
    for (let k = j + 1; k < n - 1; k++) chain[k] = chain[k + 1];
    n--;
    i = j;
    while (i > 0 && chain[i - 1] < chain[i]) { const t = chain[i - 1]; chain[i - 1] = chain[i]; chain[i] = t; i--; }
    merges.push(chain[i], i);
  }
  return n;
}

/** Head value the chain would have after eating v (no mutation). */
export function headAfterEat(chain, n, v) {
  // With the sorted-merge rule the chain is the binary form of its mass.
  let mass = v;
  for (let i = 0; i < n; i++) mass += chain[i];
  return headOfMass(mass);
}
