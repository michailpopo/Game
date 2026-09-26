/**
 * Simulation health checks for CG-GAME-003 (consistent physics across refresh
 * rates). Pure functions, no DOM, runnable in Node: see tools/qa/sim-health.mjs.
 *
 * Why two checks, and why the obvious test is useless:
 * Through a fixed-step loop, simulating a 60 Hz vs 165 Hz *display* passes
 * trivially - the accumulator hands update() the same dt regardless - so that
 * test cannot fail even for `v *= 0.98` per step. What protects the requirement
 * is that the physics is written in real units and survives a change of STEP
 * size. That is what checkStepSizeIndependence measures.
 *
 * Discrete events (a gate, a collision, a spawn) happening one step earlier at
 * a finer dt legitimately change the outcome. Keep the test window before the
 * first discrete event, or sample a non-chaotic quantity.
 *
 * Adapted from the codex-game-factory template (same author's reference skill).
 */

/** Same seed, same steps, twice. Any difference: reads Math.random/Date/perf or leaks state. */
export function checkDeterminism(makeState, step, sample, { steps = 600, dt = 1 / 60 } = {}) {
  const run = () => {
    const s = makeState();
    for (let i = 0; i < steps; i++) step(s, dt);
    return sample(s);
  };
  const a = run();
  const b = run();
  const worst = Math.max(0, ...a.map((v, i) => Math.abs(v - b[i])));
  return { ok: worst === 0, worst, a, b };
}

/** Same simulated duration at several step rates; relative drift must stay small. */
export function checkStepSizeIndependence(makeState, step, sample, {
  seconds = 1, stepRates = [30, 60, 120, 240], tolerance = 0.05,
} = {}) {
  const measure = (duration) => {
    const runs = stepRates.map((hz) => {
      const s = makeState();
      const n = Math.round(duration * hz);
      for (let i = 0; i < n; i++) step(s, 1 / hz);
      return { hz, sample: sample(s) };
    });
    const finest = runs.reduce((a, b) => (b.hz > a.hz ? b : a));
    const scale = finest.sample.map((v) => Math.max(Math.abs(v), 1));
    const diffs = runs.map((r) => ({
      stepHz: r.hz,
      maxRelDelta: Math.max(...r.sample.map((v, i) => Math.abs(v - finest.sample[i]) / scale[i])),
    }));
    return { diffs, worst: Math.max(...diffs.map((d) => d.maxRelDelta)) };
  };

  const { diffs, worst } = measure(seconds);
  const ok = worst <= tolerance;
  let divergesAt = null;
  if (!ok) {
    let lo = 0, hi = seconds;
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2;
      if (measure(mid).worst <= tolerance) lo = mid; else hi = mid;
    }
    divergesAt = hi;
  }
  return { ok, worst, tolerance, diffs, divergesAt };
}
