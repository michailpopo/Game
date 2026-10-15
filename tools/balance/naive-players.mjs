#!/usr/bin/env node
/**
 * Balance check for first-time players (quality pass 2026-10): how much of a city do NAIVE players power?
 * A CrazyGames reviewer plays city 1 once, without reading anything; a first city they fail reads as "not fun".
 *
 *   node tools/balance/naive-players.mjs [cities=1,2,3,4,5] [runs=400]
 *
 * Policies (each strike: pick a target, hold for a charge, release, wait for the cascade):
 *   tapper   quick clicks (charge 0.05-0.25) on a random dark building
 *   holder   holds ~1 s every time (charge = 1 s / fillSec, +-0.15 s jitter) on a random dark building
 *   random   releases anywhere between 0.15 and 1.3 of full on a random dark building (incl. fizzles)
 *   aimer    random charge like `random`, but aims at the densest dark area (a player who looks)
 *   skilled  releases in the middle of the gold band on the densest dark area (the autopilot)
 * Prints the share powered (median, p10) and the pass rate (>= STORM.payout.passAt) per city and policy.
 */
import { STORM } from "../../src/config.js";
import { createRng } from "../../src/core/rng.js";
import { densestUnlit } from "../../src/game/ai.js";
import { createSim, makeInput, progress, startRun, step } from "../../src/game/sim.js";

const cities = (process.argv[2] || "1,2,3,4,5").split(",").map(Number);
const runs = Number(process.argv[3] || 400);
const DT = 1 / 60;

function play(level, policy, seed) {
  const rng = createRng(`naive:${policy}:${level}:${seed}`);
  // city 1 plays like a first-time player's: its first strike is the onboarding SUPERCHARGE (main.js loadLevel)
  const s = createSim({ level, seed: `city-${level}`, assist: level === 1 });
  startRun(s);
  const input = makeInput();
  let want = 0;
  const pickCharge = () => {
    const p = s.params;
    if (policy === "tapper") return rng.range(0.05, 0.25);
    if (policy === "holder") return Math.max(0.05, (1 + rng.range(-0.15, 0.15)) / p.fillSec);
    if (policy === "skilled") return (p.bandLo + p.bandHi) / 2;
    return rng.range(0.15, 1.3);
  };
  const pickAim = () => {
    if (policy === "aimer" || policy === "skilled") return densestUnlit(s);
    const dark = s.city.buildings.filter((b) => !s.lit[b.id]);
    return dark.length ? dark[Math.floor(rng.next() * dark.length)].id : -1;
  };
  for (let i = 0; i < 60 * 120 && s.phase === "run"; i++) {
    if (!s.holding && s.bolts.length === 0 && s.strikesLeft > 0) {
      if (!input.hold) { input.aim = pickAim(); want = pickCharge(); input.hold = true; }
    }
    if (s.holding && s.charge >= want) input.hold = false;
    if (!s.holding && input.hold && s.needRelease) input.hold = false;
    step(s, DT, input);
    s.events.length = 0;
  }
  return progress(s);
}

const pct = (v) => `${Math.round(v * 100)}%`.padStart(4);
console.log(`pass at ${pct(STORM.payout.passAt)}, ${runs} runs per cell (median / p10 / pass rate)`);
for (const level of cities) {
  const row = [`city ${String(level).padStart(2)}`];
  for (const policy of ["tapper", "holder", "random", "aimer", "skilled"]) {
    const res = Array.from({ length: runs }, (_, k) => play(level, policy, k)).sort((a, b) => a - b);
    const pass = res.filter((v) => v >= STORM.payout.passAt - 1e-9).length / runs;
    row.push(`${policy.padEnd(7)} ${pct(res[runs >> 1])} ${pct(res[Math.floor(runs * 0.1)])} ${pct(pass)}`);
  }
  console.log(row.join(" | "));
}
