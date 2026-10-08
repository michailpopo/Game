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
 * Islands (themes whose field is sea, src/game/islands.js), on cities 1-60 x 4 random streams, measured on the
 * drawn outlines with a plain point-in-polygon test: every scenery tree stands on an island's grass with 0.6 m to
 * spare; no two islands' shallow rings overlap; the city's island is a square around the asphalt plate; islets are
 * round outlines (>= 16 points, never a square).
 *
 * Z-fighting: one city per theme builds its real park ground (city-life.js) and scenery (scenery.js). Any two flat
 * pieces that overlap must have the same top and colour, or tops >= 0.04 m apart; snow caps must sit outside their
 * mountain's surface (a wider, taller cone), never on it.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { STORM } from "../../src/config.js";
import { createRng } from "../../src/core/rng.js";
import { planIslands } from "../../src/game/islands.js";
import { themeOf } from "../../src/game/look.js";
import { generateCity } from "../../src/game/sim.js";
import { createCityLife } from "../../src/game/city-life.js";
import { createScenery } from "../../src/game/scenery.js";

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

/** Ray-casting point-in-polygon, plus the distance to the polygon's edges (both on [x, z] outlines). */
function inside(poly, x, z) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
function edgeDistance(poly, x, z) {
  let d = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[j], [bx, bz] = poly[i], dx = bx - ax, dz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)));
    d = Math.min(d, Math.hypot(x - ax - t * dx, z - az - t * dz));
  }
  return d;
}

/** Island plans for every water-theme city; `shift` moves all trees (selftest: planted trees on water). */
function checkIslands(cities, shift = 0) {
  const yaw = 35 * Math.PI / 180, vx = Math.sin(yaw), vz = Math.cos(yaw);
  let plans = 0, trees = 0, onWater = 0, overlaps = 0, minIsles = Infinity, levels = 0, badMain = 0, badIslet = 0;
  for (const city of cities) {
    if (!themeOf(city).world.water) continue;
    levels++;
    const plate = city.width + city.plan.avenue * 2 + 6;
    for (let k = 0; k < 4; k++) {
      const rng = createRng(`city-${city.level}:look:${city.level}:${k}`);
      const { isles, trees: ts } = planIslands({ rng, plate, vx, vz });
      plans++; minIsles = Math.min(minIsles, isles.length);
      for (const t of ts) {
        trees++;
        const x = t.x + shift, z = t.z + shift;
        if (!isles.some((o) => inside(o.grass, x, z) && edgeDistance(o.grass, x, z) >= 0.6)) onWater++;
      }
      // The city's island: a square (equal width and depth, centred) that holds the whole plate.
      const xs = isles[0].grass.map((p) => p[0]), zs = isles[0].grass.map((p) => p[1]);
      const w = Math.max(...xs) - Math.min(...xs), d = Math.max(...zs) - Math.min(...zs);
      if (Math.abs(w - d) > 1e-6 || Math.abs(Math.max(...xs) + Math.min(...xs)) > 1e-6 || w < plate) badMain++;
      // Islets: round outlines, not squares.
      for (const o of isles.slice(1)) if (o.grass.length < 16) badIslet++;
      // No two shallow rings may overlap (any vertex of one inside the other).
      for (let i = 0; i < isles.length; i++) for (let j = i + 1; j < isles.length; j++) {
        const a = isles[i].shallow, b = isles[j].shallow;
        if (a.some(([x, z]) => inside(b, x, z)) || b.some(([x, z]) => inside(a, x, z))) overlaps++;
      }
    }
  }
  return { levels, plans, trees, onWater, overlaps, minIsles, badMain, badIslet };
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
record({
  id: "island-shapes",
  status: isl.badMain === 0 && isl.badIslet === 0 ? "PASS" : "FAIL",
  summary: `city's island square around the plate: ${isl.plans - isl.badMain}/${isl.plans}; islets with a round outline: ${isl.badIslet} bad`,
});

// ---------------------------------------------------------------- z-fighting
/** Lanes like city-mesh.js builds them: avenue centre lines between district columns, plus the ring road outside. */
function lanesOf(city) {
  const avenue = city.plan.avenue;
  const lines = (cs) => {
    const out = [];
    for (let i = 0; i < cs.length - 1; i++) out.push((cs[i].c + cs[i].w / 2 + cs[i + 1].c - cs[i + 1].w / 2) / 2);
    if (cs.length) { out.unshift(cs[0].c - cs[0].w / 2 - avenue / 2 - 1.5); out.push(cs.at(-1).c + cs.at(-1).w / 2 + avenue / 2 + 1.5); }
    return out;
  };
  return { lx: lines(city.grid.xs), lz: lines(city.grid.zs), span: Math.max(city.width, city.depth) / 2 + avenue, avenue };
}
function zFight(layers) {
  let bad = 0, worst = null;
  for (let i = 0; i < layers.length; i++) for (let j = i + 1; j < layers.length; j++) {
    const a = layers[i], b = layers[j];
    const ox = (a.w + b.w) / 2 - Math.abs(a.x - b.x), oz = (a.d + b.d) / 2 - Math.abs(a.z - b.z);
    if (ox <= 1e-6 || oz <= 1e-6) continue;                    // not overlapping (touching edges are fine)
    const dy = Math.abs(a.top - b.top);
    if ((dy < 1e-6 && a.color === b.color) || dy >= 0.04 - 1e-6) continue;
    bad++;
    if (!worst || dy < worst.dy) worst = { dy, a: a.color, b: b.color };
  }
  return { bad, worst };
}
const yaw = 35 * Math.PI / 180, camDir = { x: Math.sin(yaw), z: Math.cos(yaw) };
const zf = { cities: 0, layers: 0, bad: 0, worst: null, caps: 0, badCaps: 0 };
for (const n of [1, 9, 13, 18, 21, 28, 33, 38]) {
  const city = cities[n - 1], W = themeOf(city).world, lanes = lanesOf(city);
  const rng = createRng(`city-${n}:look:${n}`);
  const life = createCityLife({ city, bs: city.buildings, rng, W, base: 0.35, pitch: C.lotPitch, lanes, camDir });
  const scen = createScenery({ W, rng, plate: city.width + city.plan.avenue * 2 + 6, camDir, lanes });
  for (const set of [life.layers, scen.layers]) {
    const r = zFight(set);
    zf.layers += set.length; zf.bad += r.bad;
    if (r.worst && (!zf.worst || r.worst.dy < zf.worst.dy)) zf.worst = { ...r.worst, city: n };
  }
  // caps come right after their mountain: cap slope (radius per height) must be wider, cap tip higher
  for (let i = 0; i + 1 < scen.peaks.length; i += 2) {
    const m = scen.peaks[i], c = scen.peaks[i + 1];
    zf.caps++;
    if (!(c.r / c.h > m.r / m.h + 1e-6 && c.y + c.h > m.y + m.h)) zf.badCaps++;
  }
  life.dispose(); scen.dispose();
  zf.cities++;
}
record({
  id: "no-z-fighting",
  status: zf.bad === 0 && zf.badCaps === 0 ? "PASS" : "FAIL",
  summary: `${zf.cities} cities (one per theme), ${zf.layers} flat pieces: ${zf.bad} overlapping pairs closer than 0.04 m${zf.worst ? ` (worst ${zf.worst.dy.toFixed(3)} m, city ${zf.worst.city})` : ""}; snow caps outside their mountain ${zf.caps - zf.badCaps}/${zf.caps}`,
});

// ---------------------------------------------------------------- cars never drive into each other
// Owner 2026-10-08: "cars should not be able to be in each other". City life's traffic (crossings one car at a time,
// braking for the car ahead) is run for 2 minutes of view time per city; every pair of car bodies (3 x 1.62 m at scale 1,
// as oriented rectangles) is tested every frame, and no car may stand still for more than 15 s (gridlock).
function carBodies(mesh) {
  const a = mesh.instanceMatrix.array, scale = Math.hypot(a[0], a[1], a[2]), L = 1.5 * scale, W = 0.81 * scale, out = [];
  for (let i = 0; i < mesh.count; i++) { const e = a.subarray(i * 16, i * 16 + 16); out.push([e[12], e[14], e[8] / scale, e[10] / scale, L, W]); }
  return out;
}
function bodiesOverlap(a, b) {
  const corners = ([x, z, hx, hz, L, W]) => [[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([u, v]) => [x + hx * L * u - hz * W * v, z + hz * L * u + hx * W * v]);
  const ca = corners(a), cb = corners(b);
  for (const [ax, az] of [[a[2], a[3]], [-a[3], a[2]], [b[2], b[3]], [-b[3], b[2]]]) {
    const pa = ca.map(([x, z]) => x * ax + z * az), pb = cb.map(([x, z]) => x * ax + z * az);
    if (Math.max(...pa) <= Math.min(...pb) || Math.max(...pb) <= Math.min(...pa)) return false;
  }
  return true;
}
function trafficOf(level, seconds = 120, dt = 1 / 30) {
  const city = cities[level - 1], rng = createRng(`city-${level}:look:${level}`);
  const life = createCityLife({ city, bs: city.buildings, rng, W: themeOf(city).world, base: 0.35, pitch: C.lotPitch, lanes: lanesOf(city), camDir });
  const mesh = life.group.children.find((o) => o.name === "cars");
  const r = { cars: mesh?.count ?? 0, overlaps: 0, longestStop: 0 };
  if (!mesh) return r;
  let prev = null; const still = new Float64Array(r.cars);
  for (let t = 0; t < seconds; t += dt) {
    life.update(t);
    const cur = carBodies(mesh);
    for (let i = 0; i < cur.length; i++) {
      if (prev) { still[i] = Math.hypot(cur[i][0] - prev[i][0], cur[i][1] - prev[i][1]) < 1e-4 ? still[i] + dt : 0; r.longestStop = Math.max(r.longestStop, still[i]); }
      for (let j = i + 1; j < cur.length; j++) if (Math.abs(cur[i][0] - cur[j][0]) < 5 && Math.abs(cur[i][1] - cur[j][1]) < 5 && bodiesOverlap(cur[i], cur[j])) r.overlaps++;
    }
    prev = cur;
  }
  return r;
}
{
  const levels = [1, 5, 12, 22, 37, 55], runs = levels.map((n) => ({ n, ...trafficOf(n) }));
  const overlaps = runs.reduce((s, r) => s + r.overlaps, 0), stop = Math.max(...runs.map((r) => r.longestStop));
  record({ id: "cars-apart", status: overlaps === 0 && stop < 15 ? "PASS" : "FAIL",
    summary: `cities ${levels.join(", ")}, 2 min of traffic each (${runs.map((r) => r.cars).join("/")} cars): ${overlaps} overlapping car-frames, longest stop ${stop.toFixed(1)} s (gridlock limit 15 s)` });
}

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
  const flatA = [{ x: 0, z: 0, w: 10, d: 10, top: 0.02, color: "#00ff00" }, { x: 2, z: 0, w: 4, d: 4, top: 0.04, color: "#ffffff" }];
  const zr = zFight(flatA);   // a path 2 cm above a lawn (must FAIL)
  record({ id: "selftest-z-fight", status: zr.bad > 0 ? "PASS" : "FAIL", summary: `a path 2 cm above a lawn (must FAIL): ${zr.bad > 0 ? "check reported failure" : "BAD: the check cannot detect this"}` });
  const ghost = [[0, 0, 0, 1, 2, 1.1], [0.5, 3.2, 0, 1, 2, 1.1]];   // two cars 3.2 m apart nose to tail (must FAIL)
  record({ id: "selftest-cars", status: bodiesOverlap(ghost[0], ghost[1]) ? "PASS" : "FAIL", summary: `two 4 m cars 3.2 m apart (must FAIL): ${bodiesOverlap(ghost[0], ghost[1]) ? "check reported an overlap" : "BAD: the check cannot detect this"}` });
  const wet = checkIslands(cities, 40);   // every tree moved 40 m: onto the water
  record({ id: "selftest-islands", status: wet.onWater > 0 ? "PASS" : "FAIL", summary: `trees moved onto the sea (must FAIL): ${wet.onWater} of ${wet.trees} on water -> ${wet.onWater > 0 ? "check reported failure" : "BAD: the check cannot detect this"}` });
}

mkdirSync(resolve(root, "qa/evidence"), { recursive: true });
writeFileSync(resolve(root, "qa/evidence/check-city.json"), JSON.stringify({ tool: "check-city", checkedAt: new Date().toISOString(), levels: LEVELS, measure: m, results }, null, 2));
process.exit(results.some((r) => r.status === "FAIL") ? 1 : 0);
