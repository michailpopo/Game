#!/usr/bin/env node
/**
 * Progression pace on the real simulation (src/game/sim.js) and the real prices (src/game/meta.js).
 *
 *   node tools/qa/economy-sim.mjs [--hours 3] [--players skilled,average] [--json out.json]
 *
 * A simulated player plays city after city: aims (the densest dark area - skilled 90% of the time, average 70% -
 * else a random dark building), releases (around the middle of the SUPERCHARGE band: skilled sd 0.03, average
 * sd 0.12), collects the run's coins (no ads, no daily gift: the slowest honest path), retries a city it did
 * not clear, and after every run buys the cheapest upgrade it can afford until none is affordable. Play time = sim
 * time of the run + RUN_OVERHEAD s (intro, result, shop taps).
 * Reports: city reached and upgrades owned at 5/10/20/30/60/90/120/180 min, minutes to the first maxed upgrade
 * and to all maxed, runs between purchases.
 */
import { writeFileSync } from "node:fs";
import { ECONOMY, STORM } from "../../src/config.js";
import { upgradeCost, upgradeLevels, UPGRADES } from "../../src/game/meta.js";
import { createSim, makeInput, progress, runCoins, startRun, step } from "../../src/game/sim.js";
import { densestUnlit } from "../../src/game/ai.js";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const HOURS = Number(opt("hours", 3));
const PLAYERS = opt("players", "skilled,average").split(",");
const RUN_OVERHEAD = 9;          // s per run outside the sim: city intro, result screen, claim, shop
const MARKS = [5, 10, 20, 30, 60, 90, 120, 180, 240, 300].filter((m) => m <= HOURS * 60);

function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const gauss = (r) => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());

function playRun(level, save, kind, r) {
  const s = createSim({ level, seed: `city-${level}`, up: upgradeLevels(save) });
  startRun(s);
  const inp = makeInput();
  let target = 0;
  for (let i = 0; i < 60 * 600 && (s.phase === "run"); i++) {
    if (!s.holding) {
      if (s.strikesLeft > 0 && s.bolts.length === 0 && !s.needRelease) {
        if (r() < (kind === "skilled" ? 0.9 : 0.7)) inp.aim = densestUnlit(s);
        else { const dark = s.city.buildings.filter((b) => !s.lit[b.id]); inp.aim = dark.length ? dark[Math.floor(r() * dark.length)].id : -1; }
        const mid = (s.params.bandLo + s.params.bandHi) / 2;
        target = Math.min(1.05, Math.max(0.2, mid + gauss(r) * (kind === "skilled" ? 0.03 : 0.12)));
        inp.hold = inp.aim >= 0;
      } else inp.hold = false;
    } else inp.hold = s.charge < target;
    step(s, 1 / 60, inp);
    s.events.length = 0;
  }
  return { share: progress(s), coins: runCoins(s), won: s.phase === "won", secs: s.t };
}

function simulate(kind, seed = 1) {
  const r = mulberry(seed);
  const save = { coins: 0, level: 1, bestLevel: 1, upVoltage: 0, upFork: 0, upStrikes: 0, upCapacitor: 0, upGold: 0 };
  let t = 0, runs = 0, lastBuyRun = 0, firstMax = null, allMax = null, mark = 0;
  const gaps = [], rows = [], recent = [], byCity = new Map();
  const kinds = Object.keys(UPGRADES);
  while (t < HOURS * 3600) {
    const res = playRun(save.level, save, kind, r);
    runs++; t += res.secs + RUN_OVERHEAD;
    save.coins += res.coins;
    { const c = save.level - (res.won ? 1 : 0), e = byCity.get(c) || [0, 0]; byCity.set(c, [e[0] + res.coins, e[1] + 1]); }
    res.buys = 0;
    recent.push(res); if (recent.length > 10) recent.shift();
    if (res.won) { save.level++; save.bestLevel = Math.max(save.bestLevel, save.level); }
    for (;;) {                                                  // buy the cheapest affordable upgrade, repeat
      let best = null;
      for (const k of kinds) { const c = upgradeCost(k, save); if (c !== null && c <= save.coins && (!best || c < best.c)) best = { k, c }; }
      if (!best) break;
      save.coins -= best.c; save[UPGRADES[best.k].key]++; res.buys++;
      gaps.push(runs - lastBuyRun); lastBuyRun = runs;
    }
    const maxed = kinds.filter((k) => upgradeCost(k, save) === null).length;
    if (maxed > 0 && firstMax === null) firstMax = t / 60;
    if (maxed === kinds.length && allMax === null) allMax = t / 60;
    while (mark < MARKS.length && t >= MARKS[mark] * 60) {
      const avg = (f) => recent.reduce((a, x) => a + f(x), 0) / recent.length;
      rows.push({ min: MARKS[mark], city: save.level, runs, up: kinds.map((k) => save[UPGRADES[k].key]).join("/"),
        coins: Math.round(avg((x) => x.coins)), share: Math.round(100 * avg((x) => x.share)), cleared: Math.round(100 * avg((x) => (x.won ? 1 : 0))), buys: Math.round(avg((x) => x.buys) * 10) });
      mark++;
    }
  }
  const tail = gaps.slice(-10);
  const coinsAt = Object.fromEntries([1, 5, 10, 20, 40, 60, 80].filter((c) => byCity.has(c)).map((c) => [c, Math.round(byCity.get(c)[0] / byCity.get(c)[1])]));
  return { kind, rows, firstMax, allMax, purchases: gaps.length, lateGap: tail.length ? tail.reduce((a, b) => a + b, 0) / tail.length : null, coinsAt };
}

const out = [];
const maxes = Object.values(UPGRADES).map((u) => u.max).join("/");
for (const kind of PLAYERS) {
  const res = simulate(kind, 7);
  out.push(res);
  console.log(`\n${kind} player (${HOURS} h, upgrades Volt/Fork/Strikes/Cap/Gold, max ${maxes})`);
  for (const r of res.rows) console.log(`  ${String(r.min).padStart(3)} min  city ${String(r.city).padStart(3)}  runs ${String(r.runs).padStart(4)}  upgrades ${r.up.padEnd(14)}  last 10 runs: ${String(r.coins).padStart(7)} coins, ${r.share}% powered, ${r.cleared}% cleared, ${r.buys} upgrades`);
  console.log(`  coins per run by city: ${Object.entries(res.coinsAt).map(([c, v]) => `${c}: ${v}`).join(", ")}`);
  console.log(`  first upgrade maxed: ${res.firstMax === null ? "never" : res.firstMax.toFixed(0) + " min"}  ·  all maxed: ${res.allMax === null ? `not within ${HOURS} h` : res.allMax.toFixed(0) + " min"}  ·  ${res.purchases} purchases, last 10 every ${res.lateGap?.toFixed(1) ?? "-"} runs`);
}
const jsonPath = opt("json", null);
if (jsonPath) writeFileSync(jsonPath, JSON.stringify({ when: new Date().toISOString(), hours: HOURS, economy: ECONOMY.upgrades, passAt: STORM.payout.passAt, players: out }, null, 2));
