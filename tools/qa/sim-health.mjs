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
import { generateLevel } from "../../src/game/level-gen.js";
import { createSim, startRun, step } from "../../src/game/sim.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const selftest = process.argv.includes("--selftest");

const makeState = () => {
  const s = createSim(generateLevel(7), 12);
  startRun(s);
  return s;
};
// Continuous scripted input expressed as a RATE (axis), so it is step-size independent itself.
const scripted = (fn) => (s, dt) => fn(s, dt, { axis: Math.sin(s.t * 2.1) });
const sample = (s) => [s.x, s.z, s.count];

// Window: the first gate is at z=-34, ~2.6 s in at run speed. Stay before it.
const WINDOW = { seconds: 2.0 };

function run(label, stepFn) {
  const det = checkDeterminism(makeState, scripted(stepFn), sample, { steps: 1800 });
  const size = checkStepSizeIndependence(makeState, scripted(stepFn), sample, WINDOW);
  return { label, ok: det.ok && size.ok, determinism: { ok: det.ok, worst: det.worst }, stepSize: size };
}

const results = [run("game simulation", step)];

if (selftest) {
  // Planted bug: an extra per-step smoothing constant (no dt) - the classic refresh-rate bug.
  const broken = (s, dt, input) => { step(s, dt, input); s.x += (s.targetX - s.x) * 0.2; };
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
