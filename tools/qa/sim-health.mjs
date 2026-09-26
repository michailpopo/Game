#!/usr/bin/env node
/**
 * CG-GAME-003 health check: "physics must perform consistently across monitor
 * refresh rates (e.g. 144 Hz, 165 Hz)".
 *
 *   node tools/qa/sim-health.mjs            run both checks, write qa/evidence/sim-health.json
 *   node tools/qa/sim-health.mjs --selftest also prove the check FAILS on a planted per-step bug
 *
 * Exit 0 = pass, 1 = fail. A test you have never seen fail is not a test,
 * which is what --selftest is for.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkDeterminism, checkStepSizeIndependence } from "../../src/core/sim-health.js";
import { createSim, makeInput, startRun, step } from "../../src/game/sim.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const selftest = process.argv.includes("--selftest");

// Storm Grid, city 3: three strikes - a SUPERCHARGE, a WEAK tap and a hold past full that auto-fires a
// FIZZLE - and their cascades (hops, forks, grounding, BLOCK POWERED).
let aim = 0;
const makeState = () => {
  const s = createSim({ level: 3, seed: "sim-health" });
  aim = Math.floor(s.city.buildings.length / 2);
  startRun(s);
  return s;
};
// Scripted input: hold from t = 0 until 1.0 s (charge 0.83: inside the SUPERCHARGE band), a short tap at
// 2.2-2.5 s, then a hold from 3.0 s that runs 0.35 s past full (the FIZZLE fires by itself at 4.55 s).
// The press/release times are multiples of every tested step (1/30 ... 1/240 s), the charge is a function
// of sim time and the cascade runs on exact event times, so the same chain must happen at every step size.
const input = makeInput();
const HOLD = [[0, 1.0], [2.2, 2.5], [3.0, 5.0]];
const scripted = (fn) => (s, dt) => {
  input.hold = HOLD.some(([a, b]) => s.t >= a - 1e-6 && s.t < b - 1e-6);
  input.aim = aim;
  return fn(s, dt, input);
};
// Charge (continuous), what the first release produced, and the cascade's outcome (lit buildings,
// points, strikes left): all must match across step sizes.
const sample = (s) => [s.charge, s.lastRelease ? s.lastRelease.charge : 0, s.lastRelease ? s.lastRelease.energy : 0, s.litCount, s.score, s.strikesLeft];

// Window: all three strikes and their cascades.
const WINDOW = { seconds: 6.5 };

function run(label, stepFn) {
  const det = checkDeterminism(makeState, scripted(stepFn), sample, { steps: 600 });
  const size = checkStepSizeIndependence(makeState, scripted(stepFn), sample, WINDOW);
  return { label, ok: det.ok && size.ok, determinism: { ok: det.ok, worst: det.worst }, stepSize: size };
}

const results = [run("game simulation", step)];

if (selftest) {
  // Planted bug: charge grows per step instead of per second - the classic refresh-rate bug
  // (moving the press time back by 0.4% of the fill per step = +0.004 charge per step).
  const broken = (s, dt, inp) => { step(s, dt, inp); if (s.holding) s.holdT -= 0.004 * s.params.fillSec; };
  const r = run("planted per-step bug (must FAIL)", broken);
  r.expectedToFail = true;
  r.selftestPassed = !r.ok;
  results.push(r);
}

let exit = 0;
for (const r of results) {
  const worst = (r.stepSize.worst * 100).toFixed(2);
  if (r.expectedToFail) {
    console.log(`${r.selftestPassed ? "PASS" : "FAIL"}  selftest: ${r.label} -> check reported ${r.ok ? "ok (BAD: the check cannot detect this bug)" : `failure, drift ${worst}%`}`);
    if (!r.selftestPassed) exit = 1;
  } else {
    console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.label}: determinism ${r.determinism.ok ? "exact" : `differs by ${r.determinism.worst}`}, step-size drift ${worst}% (tolerance ${(r.stepSize.tolerance * 100).toFixed(0)}%)`);
    if (!r.ok) exit = 1;
  }
}

mkdirSync(resolve(root, "qa/evidence"), { recursive: true });
writeFileSync(resolve(root, "qa/evidence/sim-health.json"), JSON.stringify({
  tool: "sim-health",
  checkedAt: new Date().toISOString(),
  results: results.map((r) => r.expectedToFail
    ? { id: "sim-health-selftest", requirements: [], status: r.selftestPassed ? "PASS" : "FAIL", summary: `planted per-step bug detected: drift ${(r.stepSize.worst * 100).toFixed(1)}%`, detail: r }
    : { id: "sim-health", requirements: ["CG-GAME-003"], status: r.ok ? "PASS" : "FAIL", summary: `determinism ${r.determinism.ok ? "exact" : "BROKEN"}, step-size drift ${(r.stepSize.worst * 100).toFixed(2)}% at 30/60/120/240 Hz`, detail: r }),
}, null, 2));
process.exit(exit);
