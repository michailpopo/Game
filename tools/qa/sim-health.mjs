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
import { ARENA } from "../../src/config.js";
import { createSim, makeInput, startRun, step } from "../../src/game/sim.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const selftest = process.argv.includes("--selftest");

// The full arena: 12 bots, loose blocks, spawner, AI, contacts, merges.
const makeState = () => {
  const s = createSim({ level: 2, seed: "sim-health" });
  startRun(s);
  return s;
};
// Continuous scripted input expressed as a RATE (key turn axis + boost), so it is step-size independent itself.
const input = makeInput();
const scripted = (fn) => (s, dt) => {
  input.hasDir = false;
  input.turn = Math.sin(s.t * 2.1);
  input.boost = s.t > 0.8 && s.t < 1.4;
  return fn(s, dt, input);
};
// Player head (continuous), its heading as a unit vector (no +-PI wrap artefact), its mass (discrete
// eats - the same blocks in the window at every rate), its tail block (path following), and one bot
// (its decisions are scheduled in sim seconds, not steps). Positions are measured from the arena's
// corner (+halfSize): the check divides by |value|, and a position's natural scale is the arena,
// not its distance from the origin (x = 0.01 vs 0.02 is not a "100% drift").
const H = ARENA.arena.halfSize;
const bot = (s) => s.snakes[1];
const sample = (s) => {
  const p = s.player;
  return [p.x + H, p.z + H, Math.cos(p.heading), Math.sin(p.heading), p.mass, p.segX[p.n - 1] + H, p.segZ[p.n - 1] + H, bot(s).x + H, bot(s).z + H];
};

// Window: inside the player's 2 s spawn protection, so no contact can end the run at one rate and not another.
const WINDOW = { seconds: 1.9 };

function run(label, stepFn) {
  const det = checkDeterminism(makeState, scripted(stepFn), sample, { steps: 1800 });
  const size = checkStepSizeIndependence(makeState, scripted(stepFn), sample, WINDOW);
  return { label, ok: det.ok && size.ok, determinism: { ok: det.ok, worst: det.worst }, stepSize: size };
}

const results = [run("game simulation", step)];

if (selftest) {
  // Planted bug: a per-step nudge (no dt) - the classic refresh-rate bug.
  const broken = (s, dt, inp) => { step(s, dt, inp); s.player.x += Math.cos(s.player.heading) * 0.03; };
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
