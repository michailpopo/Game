/**
 * QA / capture autopilot for Volt City. Deterministic (no randomness): it aims at the unlit
 * building with the most unlit neighbours in range (the densest dark area), holds until the
 * charge sits inside the SUPERCHARGE band, releases, and waits for the cascade to finish before
 * the next strike - so dead-air and long-run checks measure real play.
 */

import { VOLT as V } from "../config.js";

/** Best strike target: the unlit building with the most unlit neighbours (ties: lower id). */
export function densestUnlit(s) {
  let best = -1, bestScore = -1;
  for (const b of s.city.buildings) {
    if (s.lit[b.id]) continue;
    const list = s.near[b.id];
    let n = 0;
    for (let k = 0; k < list.length && k < 14; k++) if (!s.lit[list[k]]) n++;
    if (n > bestScore) { bestScore = n; best = b.id; }
  }
  return best;
}

/** Fill `out` (sim.js makeInput) for this step. */
export function autopilot(s, out) {
  out.aimX = 0; out.aimZ = 0;
  if (s.phase !== "run" || s.strikesLeft <= 0) { out.hold = false; return out; }
  if (!s.holding) {
    if (s.bolts.length > 0) { out.hold = false; return out; }   // let the cascade play out
    out.aim = densestUnlit(s);
    out.hold = out.aim >= 0;
    return out;
  }
  const mid = (V.strike.superLo + V.strike.superHi) / 2;
  out.hold = s.charge < mid;
  return out;
}
