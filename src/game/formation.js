/**
 * Crowd formation: a sunflower (Vogel) spiral, squeezed into an ellipse so a
 * big crowd stays narrow enough to choose a side of the track.
 * Pure and deterministic - shared by the simulation (collisions) and the view.
 */

import { TUNING as T } from "../config.js";

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const MAX = T.maxSlots;

// Precomputed unit spiral: slot i at angle i*golden, radius sqrt(i + 0.5).
const COS = new Float32Array(MAX);
const SIN = new Float32Array(MAX);
const RAD = new Float32Array(MAX);
for (let i = 0; i < MAX; i++) {
  COS[i] = Math.cos(i * GOLDEN_ANGLE);
  SIN[i] = Math.sin(i * GOLDEN_ANGLE);
  RAD[i] = Math.sqrt(i + 0.5);
}

/**
 * @param {number} count  units (may be fractional or exceed MAX)
 * @param {number} [spacing]
 * @returns {{ n:number, R:number, sx:number, sz:number, extentX:number, extentZ:number, perSlot:number }}
 */
export function formation(count, spacing = T.unitSpacing) {
  const n = Math.max(0, Math.min(Math.ceil(count - 1e-6), MAX));
  const R = spacing * Math.sqrt(Math.max(n, 1) + 0.5);
  const sx = Math.min(1, T.crowdExtentX / R);
  const sz = Math.min(1, T.crowdExtentZ / R);
  return { n, R, sx, sz, extentX: R * sx, extentZ: R * sz, perSlot: n > 0 ? count / n : 0 };
}

/** Offset of slot i relative to the crowd centre. Writes into `out` to avoid allocation. */
export function slotOffset(i, f, out, spacing = T.unitSpacing) {
  const r = spacing * RAD[i];
  out.x = COS[i] * r * f.sx;
  out.z = SIN[i] * r * f.sz;
  return out;
}
