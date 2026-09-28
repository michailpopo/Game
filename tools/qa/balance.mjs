// Balance Monte Carlo: how often does a player reach each plate (x2 60%, x3 80%, x5 95%, x10 100%)?
//   node tools/qa/balance.mjs [runsPerCity=200] [cities=1-10]            fixed cities, no upgrades
//   node tools/qa/balance.mjs campaign [players=60] [cities=1-20]         cities in order with coins + upgrades
// Players: "pro" = autopilot (densest dark area, always SUPERCHARGE); "casual" = aims at the densest dark area
// with a little miss, releases at a normal-distributed charge around 85% (sd 15%) - lands the band ~35-45%;
// "human" = half the taps on a random dark building, release around 82% (sd 18%) - closest to a first-time player.
import { createSim, makeInput, progress, runCoins, startRun, step } from "../../src/game/sim.js";
import { DEFAULT_SAVE, UPGRADES, upgradeCost, upgradeLevels } from "../../src/game/meta.js";
import { densestUnlit } from "../../src/game/ai.js";
import { createRng } from "../../src/core/rng.js";
import { STORM } from "../../src/config.js";
// Tuning scans without editing config.js: LEAP_RANGE=2 LEAP_COST=3 node tools/qa/balance.mjs ...
if (process.env.LEAP_RANGE) STORM.chain.leapRange = +process.env.LEAP_RANGE;
if (process.env.LEAP_COST) STORM.chain.leapCost = +process.env.LEAP_COST;
if (process.env.GROWTH) STORM.city.growth = +process.env.GROWTH;
if (process.env.EPV) STORM.chain.e0PerVoltage = +process.env.EPV;
if (process.env.LEAP_ALL) STORM.chain.leapSuperOnly = false;
if (process.env.MAXSTRIKES) STORM.strike.maxStrikeLevels = +process.env.MAXSTRIKES;
if (process.env.PRICEMULT) for (const u of Object.values(UPGRADES)) u.base *= +process.env.PRICEMULT;
if (process.env.VGROWTH) UPGRADES.voltage.growth = +process.env.VGROWTH;
const MODELS = (process.env.MODELS || "pro,casual,human").split(",");

const campaign = process.argv[2] === "campaign";
const args = campaign ? process.argv.slice(3) : process.argv.slice(2);
const runs = +(args[0] || (campaign ? 60 : 200));
const [c0, c1] = (args[1] || (campaign ? "1-20" : "1-10")).split("-").map(Number);
const DT = 1 / 60;

function play(level, seed, model, up = {}) {
  const s = createSim({ level, seed: `bal-${seed}`, up });
  const r = createRng(`player-${model}-${seed}`).next;
  const gauss = () => { let u = 0; for (let i = 0; i < 6; i++) u += r(); return (u - 3) / Math.sqrt(0.5); };
  startRun(s);
  const inp = makeInput();
  let target = 0, guard = 0;
  while (s.phase === "run" && guard++ < 60 * 120) {
    if (!s.holding) {
      if (s.bolts.length > 0) { inp.hold = false; step(s, DT, inp); continue; }
      inp.aim = densestUnlit(s);
      if (model === "human" && r() < 0.5) {
        const dark = s.city.buildings.filter((b) => !s.lit[b.id]);
        if (dark.length) inp.aim = dark[Math.floor(r() * dark.length)].id;
      } else if (model !== "pro" && r() < 0.25) {             // a quarter of the taps land on a neighbour instead
        const nb = s.near[inp.aim].filter((i) => !s.lit[i]);
        if (nb.length) inp.aim = nb[Math.floor(r() * nb.length)];
      }
      const p = s.params;
      target = model === "pro" ? (p.bandLo + p.bandHi) / 2
        : model === "human" ? Math.min(1.25, Math.max(0.3, 0.82 + 0.18 * gauss())) : Math.min(1.25, Math.max(0.3, 0.85 + 0.15 * gauss()));
      inp.hold = true;
    } else inp.hold = s.charge < target;
    step(s, DT, inp);
  }
  return s;
}
const pctOf = (arr, k) => `${String(Math.round((100 * arr.filter((v) => v >= k - 1e-9).length) / Math.max(1, arr.length))).padStart(4)}%`;

if (campaign) {
  for (const model of MODELS) {
    const rows = new Map();   // city -> { shares: [], tries: [], up: [] }
    for (let pl = 0; pl < runs; pl++) {
      const save = { ...DEFAULT_SAVE };
      let city = 1, tries = 0, n = 0;
      while (city <= c1 && n++ < 400) {
        const s = play(city, `${pl}-${n}`, model, upgradeLevels(save));
        const share = progress(s);
        save.coins += runCoins(s);
        tries++;
        const row = rows.get(city) || { shares: [], tries: [], volt: [] };
        row.shares.push(share); rows.set(city, row);
        if (share >= 0.6) { row.tries.push(tries); row.volt.push(save.upVoltage); tries = 0; city++; }
        for (;;) {   // buy the cheapest affordable upgrade until nothing is affordable
          let best = null, bestCost = Infinity;
          for (const k of Object.keys(UPGRADES)) { const c = upgradeCost(k, save); if (c !== null && c < bestCost) { best = k; bestCost = c; } }
          if (!best || bestCost > save.coins) break;
          save.coins -= bestCost; save[UPGRADES[best].key]++;
        }
      }
    }
    console.log(`\n${model}: city | tries | >=60%  >=80%  >=95%  100% | voltage when cleared`);
    for (const [city, r] of rows) {
      if (city < c0) continue;
      const avg = (a) => (a.reduce((x, y) => x + y, 0) / Math.max(1, a.length)).toFixed(1);
      console.log(`${String(city).padStart(4)} | ${avg(r.tries).padStart(5)} | ${pctOf(r.shares, 0.6)}  ${pctOf(r.shares, 0.8)}  ${pctOf(r.shares, 0.95)}  ${pctOf(r.shares, 1)} | ${avg(r.volt)}`);
    }
  }
  process.exit(0);
}

console.log("city  n   | model   | >=60%  >=80%  >=95%  100%  | mean");
for (let L = c0; L <= c1; L++) {
  for (const model of MODELS) {
    const shares = Array.from({ length: runs }, (_, i) => progress(play(L, i, model)));
    const pct = (k) => pctOf(shares, k);
    const n = createSim({ level: L, seed: "bal-0" }).city.buildings.length;
    console.log(`${String(L).padStart(4)} ${String(n).padStart(3)}  | ${model.padEnd(7)} | ${pct(0.6)}  ${pct(0.8)}  ${pct(0.95)}  ${pct(1)} | ${(100 * shares.reduce((a, b) => a + b, 0) / runs).toFixed(0)}%`);
  }
}
