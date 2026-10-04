#!/usr/bin/env node
/**
 * City layout health: no two buildings may touch, and nothing may grow on water, in any city.
 *
 *   node tools/qa/check-city.mjs             check cities 1..60 (part of npm run qa)
 *   node tools/qa/check-city.mjs --selftest  also prove the check FAILS on footprints that were never trimmed
 *
 * Measured on what is DRAWN (src/game/city-mesh.js): a body is min(maxVisual, footprint x visualGrow) wide
 * and the roof cap is capOverhang wider. Two buildings pass when their roof caps are at least
 * `clearance` m apart along one axis (config.js STORM.city), and no footprint side is under footprintMin.
 * Keep the two formulas below in step with city-mesh.js.
 *
 * Islands (themes whose field is sea): every scenery tree must stand on an island's grass (chamfered footprint, with
 * 0.5 m to spare) and no two islands may overlap, checked on cities 1-60 x 4 random streams.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { STORM } from "../../src/config.js";
import { createRng } from "../../src/core/rng.js";
import { ISLAND_CHAMFER, planIslands } from "../../src/game/city-mesh.js";
import { themeOf } from "../../src/game/look.js";
import { generateCity } from "../../src/game/sim.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const C = STORM.city;
const LEVELS = 60;
const EPS = 1e-3;

const body = (s) => Math.min(C.maxVisual, s * C.visualGrow);
const cap = (s) => body(s) + C.capOverhang;

/** Worst-case numbers over a list of cities. */
function measure(cities) {
  let pairs = 0, touching = 0, tight = 0, minAir = Infinity, minSide = Infinity, worst = null;
  for (const city of cities) {
    const bs = city.buildings;
    for (const b of bs) minSide = Math.min(minSide, b.w, b.d);
    for (let i = 0; i < bs.length; i++) {
      for (let j = i + 1; j < bs.length; j++) {
        const a = bs[i], b = bs[j];
        const dx = Math.abs(a.x - b.x), dz = Math.abs(a.z - b.z);
        if (dx > 14 || dz > 14) continue;
        pairs++;
        const air = Math.max(dx - (cap(a.w) + cap(b.w)) / 2, dz - (cap(a.d) + cap(b.d)) / 2);   // roof caps
        const bodyAir = Math.max(dx - (body(a.w) + body(b.w)) / 2, dz - (body(a.d) + body(b.d)) / 2);
        if (bodyAir < 0) touching++;
        if (air < C.clearance - EPS) tight++;
        if (air < minAir) { minAir = air; worst = { level: city.level, a: a.id, b: b.id }; }
      }
    }
  }
  return { pairs, touching, tight, minAir, minSide, worst };
}

/** Island plans for every water-theme city; `shift` moves all trees (selftest: planted trees on water). */
function checkIslands(cities, shift = 0) {
  const yaw = 35 * Math.PI / 180, vx = Math.sin(yaw), vz = Math.cos(yaw);
  let plans = 0, trees = 0, onWater = 0, overlaps = 0, minIsles = Infinity, levels = 0;
  const onGrass = (o, x, z) => { const u = Math.abs(x - o.x) / (o.w - 1), v = Math.abs(z - o.z) / (o.d - 1); return u <= 0.5 && v <= 0.5 && u + v <= 1 - ISLAND_CHAMFER; };
  for (const city of cities) {
    if (!themeOf(city).world.water) continue;
    levels++;
    for (let k = 0; k < 4; k++) {
      const rng = createRng(`city-${city.level}:look:${city.level}:${k}`);
      const { isles, trees: ts } = planIslands({ rng, plate: city.width + city.plan.avenue * 2 + 6, vx, vz });
      plans++; minIsles = Math.min(minIsles, isles.length);
      for (const t of ts) { trees++; if (!isles.some((o) => onGrass(o, t.x + shift, t.z + shift))) onWater++; }
      for (let i = 0; i < isles.length; i++) for (let j = i + 1; j < isles.length; j++) {
        const a = isles[i], b = isles[j];   // sand outlines (grass + beach) must not touch
        if (Math.abs(a.x - b.x) < (a.w + b.w) / 2 + a.beach + b.beach && Math.abs(a.z - b.z) < (a.d + b.d) / 2 + a.beach + b.beach) overlaps++;
      }
    }
  }
  return { levels, plans, trees, onWater, overlaps, minIsles };
}

const cities = [];
for (let n = 1; n <= LEVELS; n++) cities.push(generateCity(n, `city-${n}`, 0));
const m = measure(cities);

const results = [];
const record = (r) => { results.push(r); console.log(`${r.status.padEnd(6)} ${r.id.padEnd(20)} ${r.summary}`); };

record({
  id: "buildings-apart",
  status: m.touching === 0 && m.tight === 0 ? "PASS" : "FAIL",
  summary: `cities 1-${LEVELS}, ${m.pairs} neighbour pairs: ${m.touching} bodies touching, ${m.tight} roof caps closer than ${C.clearance} m; least air between roof caps ${m.minAir.toFixed(2)} m${m.worst ? ` (city ${m.worst.level}, buildings ${m.worst.a}/${m.worst.b})` : ""}`,
});
record({
  id: "footprint-min",
  status: m.minSide >= C.footprintMin - EPS ? "PASS" : "FAIL",
  summary: `narrowest footprint side ${m.minSide.toFixed(2)} m (floor ${C.footprintMin} m)`,
});

const isl = checkIslands(cities);
record({
  id: "trees-on-land",
  status: isl.levels > 0 && isl.trees > 0 && isl.onWater === 0 ? "PASS" : "FAIL",
  summary: `${isl.levels} water-theme cities x 4 streams: ${isl.trees} scenery trees, ${isl.onWater} on water`,
});
record({
  id: "islands-apart",
  status: isl.overlaps === 0 && isl.minIsles >= 4 ? "PASS" : "FAIL",
  summary: `${isl.plans} island plans: ${isl.overlaps} overlapping islands, fewest islands in a plan ${isl.minIsles}`,
});

// Same city twice must be identical: the layout is seeded, trimming draws no randoms.
const again = generateCity(30, "city-30", 0), first = cities[29];
const same = again.buildings.length === first.buildings.length && again.buildings.every((b, i) => {
  const o = first.buildings[i];
  return b.x === o.x && b.z === o.z && b.h === o.h && b.w === o.w && b.d === o.d;
});
record({ id: "layout-deterministic", status: same ? "PASS" : "FAIL", summary: same ? "city 30 generated twice: identical positions, heights and footprints" : "city 30 differs between two generations" });

if (process.argv.includes("--selftest")) {
  // Planted bug: the widest footprint everywhere, never trimmed. The check must report failures.
  const planted = cities.map((city) => ({ ...city, buildings: city.buildings.map((b) => ({ ...b, w: C.lotPitch * C.footprint[1], d: C.lotPitch * C.footprint[1] })) }));
  const p = measure(planted);
  const caught = p.touching > 0 || p.tight > 0;
  record({ id: "selftest", status: caught ? "PASS" : "FAIL", summary: `untrimmed footprints (must FAIL): ${p.touching} bodies touching, ${p.tight} roof caps too close -> ${caught ? "check reported failure" : "BAD: the check cannot detect this"}` });
  const wet = checkIslands(cities, 40);   // every tree moved 40 m: onto the water
  record({ id: "selftest-islands", status: wet.onWater > 0 ? "PASS" : "FAIL", summary: `trees moved onto the sea (must FAIL): ${wet.onWater} of ${wet.trees} on water -> ${wet.onWater > 0 ? "check reported failure" : "BAD: the check cannot detect this"}` });
}

mkdirSync(resolve(root, "qa/evidence"), { recursive: true });
writeFileSync(resolve(root, "qa/evidence/check-city.json"), JSON.stringify({ tool: "check-city", checkedAt: new Date().toISOString(), levels: LEVELS, measure: m, results }, null, 2));
process.exit(results.some((r) => r.status === "FAIL") ? 1 : 0);
