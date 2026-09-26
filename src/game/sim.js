/**
 * Volt City simulation. Pure JS: no three.js, no DOM, no Math.random, no clock.
 *
 * That is what makes CG-GAME-003 testable (tools/qa/sim-health.mjs runs this in Node at
 * several step sizes). Rates are per second and multiplied by dt. The cascade is EVENT-TIMED:
 * every hop has an exact scheduled time and hops are processed in time order inside each step,
 * so the same strike gives the same chain at any step size (the seeded RNG is consumed in the
 * same order). The view never mutates state; it drains `state.events` for feedback.
 *
 * Phases: ready -> run -> won | failed
 *   ready   the dark city idles; the first press starts the run (and starts charging)
 *   run     hold to charge (0..1 in VOLT.strike.fillSec), release to strike; VOLT.strike.strikes per city
 *   won     strikes spent (or FULL POWER), at least payout.passAt of the city powered
 *   failed  strikes spent below payout.passAt
 *
 * Rules (numbers in VOLT, src/config.js):
 *  - release: charge < superLo -> part voltage; superLo..superHi -> SUPERCHARGE (full voltage +
 *    a guaranteed first fork); ..1.0 -> lateShare; > 1.0 (or held to overMax) -> a weak spark
 *  - the bolt hits the antenna nearest the aim and lights that building; each hop goes to the
 *    nearest UNLIT antenna within `range` (3D, height weighted), costs 1 energy and lights it
 *  - on each hop the bolt forks with probability `fork` (gold rods: always) into two bolts that
 *    both keep the energy left; a bolt ends when its energy is spent or nothing unlit is in range
 *  - a building pays (1 + floor(height / heightUnit)) x 2^forkGeneration (x goldFactor for gold);
 *    a district fully lit pays districtBonus x its size ("BLOCK POWERED")
 */

import { VOLT as V } from "../config.js";
import { createRng } from "../core/rng.js";

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a, b, k) => a + (b - a) * k;

/** Per-step input: hold = the strike button is down; aim = building index, or -1 to use (aimX, aimZ). */
export function makeInput() {
  return { hold: false, aim: -1, aimX: 0, aimZ: 0 };
}
const NO_INPUT = makeInput();

// ------------------------------------------------------------------ city

/** Blocks per side for a level (grows with the level, capped). */
export function cityShape(level) {
  const c = V.city;
  const k = Math.max(0, level - 1);
  return {
    bx: Math.min(c.blocksX[1], c.blocksX[0] + Math.floor(k * c.blocksPerLevel)),
    bz: Math.min(c.blocksZ[1], c.blocksZ[0] + Math.floor(k * c.blocksPerLevel * 0.67)),
    gold: Math.min(c.gold[1], c.gold[0] + Math.floor(k / 3)),
  };
}

/**
 * A seeded city: blocks (districts) of lots on a grid with streets between them. Taller towers
 * downtown. Every building has a rooftop antenna tip (the hop point).
 */
export function generateCity(level, seed) {
  const c = V.city;
  const rng = createRng(`${seed}:city`);
  const { bx, bz, gold } = cityShape(level);
  const pitch = c.lotSize + c.alley;
  // Lots per block side, rolled per block column / row so streets stay straight.
  const colLots = Array.from({ length: bx }, () => rng.int(c.lots[0], c.lots[1]));
  const rowLots = Array.from({ length: bz }, () => rng.int(c.lots[0], c.lots[1]));
  const span = (lots) => lots * pitch - c.alley;
  const width = colLots.reduce((a, n) => a + span(n), 0) + (bx - 1) * c.street;
  const depth = rowLots.reduce((a, n) => a + span(n), 0) + (bz - 1) * c.street;
  const maxR = Math.hypot(width, depth) / 2;

  const buildings = [];
  const districts = [];
  let z0 = -depth / 2;
  for (let j = 0; j < bz; j++) {
    let x0 = -width / 2;
    for (let i = 0; i < bx; i++) {
      const d = { id: districts.length, members: [], x: x0 + span(colLots[i]) / 2, z: z0 + span(rowLots[j]) / 2, w: span(colLots[i]), d: span(rowLots[j]) };
      for (let lz = 0; lz < rowLots[j]; lz++) {
        for (let lx = 0; lx < colLots[i]; lx++) {
          if (rng.chance(c.parkChance)) continue;
          const x = x0 + lx * pitch + c.lotSize / 2;
          const z = z0 + lz * pitch + c.lotSize / 2;
          const fw = c.lotSize * rng.range(c.footprint[0], c.footprint[1]);
          const fd = c.lotSize * rng.range(c.footprint[0], c.footprint[1]);
          const centre = 1 - Math.min(1, Math.hypot(x, z) / maxR);
          let h = rng.range(c.height[0], c.height[1]) + c.downtown * centre * centre * rng.range(0.6, 1.2);
          h = Math.max(c.floor * 3, Math.round(h / c.floor) * c.floor);
          const b = { id: buildings.length, district: d.id, x, z, w: fw, d: fd, h, tipY: h + c.antenna, gold: false, seed: rng.next() };
          buildings.push(b);
          d.members.push(b.id);
        }
      }
      if (d.members.length) districts.push(d);
      else d.id = -1;
      x0 += span(colLots[i]) + c.street;
    }
    z0 += span(rowLots[j]) + c.street;
  }
  // Re-number districts densely (an all-park block is dropped).
  districts.forEach((d, k) => { d.id = k; for (const m of d.members) buildings[m].district = k; });
  // Gold rods: mid-to-tall buildings, never two in one district.
  const used = new Set();
  const byHeight = buildings.map((b) => b.id).sort((a, b) => buildings[b].h - buildings[a].h);
  for (let tries = 0; tries < 200 && used.size < gold; tries++) {
    const b = buildings[byHeight[Math.floor(rng.next() * Math.min(byHeight.length, Math.max(4, byHeight.length * 0.6)))]];
    if (!b || b.gold || used.has(b.district)) continue;
    b.gold = true;
    used.add(b.district);
  }
  return { level, width, depth, buildings, districts };
}

/** Hop distance between two antenna tips (height differences count VOLT.chain.verticalWeight). */
export function hopDistance(a, b, vw = V.chain.verticalWeight) {
  const dx = a.x - b.x, dz = a.z - b.z, dy = (a.tipY - b.tipY) * vw;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Neighbour lists within range, nearest first (computed once per city). */
function neighbours(city, range) {
  const bs = city.buildings;
  return bs.map((a) => {
    const list = [];
    for (const b of bs) {
      if (b === a) continue;
      const d = hopDistance(a, b);
      if (d <= range) list.push([b.id, d]);
    }
    list.sort((p, q) => p[1] - q[1] || p[0] - q[0]);
    return Int32Array.from(list.map((p) => p[0]));
  });
}

// ------------------------------------------------------------------ state

/**
 * @param {{ level?:number, seed?:string, strikes?:number, voltage?:number, fork?:number, range?:number }} [o]
 *        overrides come from upgrades (meta.js) and tests
 */
export function createSim({ level = 1, seed = "volt", strikes = V.strike.strikes, voltage = V.chain.voltage, fork = V.chain.fork, range = V.chain.range } = {}) {
  const city = generateCity(level, seed);
  const n = city.buildings.length;
  return {
    level, seed, city,
    params: { voltage, fork, range },
    near: neighbours(city, range),
    phase: "ready",
    t: 0,
    rng: createRng(`${seed}:bolts`),
    lit: new Uint8Array(n),            // 1 once lit
    litAt: new Float32Array(n).fill(-1),
    litGen: new Uint8Array(n),         // fork generation of the bolt that lit it (view: colour)
    litCount: 0,
    districtLit: new Int32Array(city.districts.length),
    districtDone: new Uint8Array(city.districts.length),
    strikesLeft: strikes,
    strikesMax: strikes,
    strikeCount: 0,
    nextFull: false,                   // "one more strike": the next release is a SUPERCHARGE whatever the charge
    holding: false,
    charge: 0,
    lastRelease: null,                 // { charge, band, energy, target }
    bolts: [],                         // active: { id, at, energy, gen, depth, next, strike }
    boltSeq: 0,
    cascadeHops: 0,                    // hops in the current strike (all bolts)
    bestChain: 0,
    score: 0,
    events: [],
  };
}

export function progress(s) {
  return s.city.buildings.length ? s.litCount / s.city.buildings.length : 0;
}

/** The jackpot plate for a share powered: { mult, at } or null. */
export function plateFor(share) {
  for (const [at, mult] of V.payout.plates) if (share >= at - 1e-9) return { at, mult };
  return null;
}

export function startRun(s) {
  if (s.phase !== "ready") return false;
  s.phase = "run";
  s.t = 0;
  s.events.push({ type: "runStart" });
  return true;
}

/** "One more strike" (rewarded): back into the run with one SUPERCHARGE strike. */
export function addStrike(s) {
  if (s.phase !== "won" && s.phase !== "failed") return false;
  if (s.litCount >= s.city.buildings.length) return false;
  s.strikesLeft += 1;
  s.nextFull = true;
  s.phase = "run";
  s.events.push({ type: "extraStrike" });
  return true;
}

/** The building whose antenna tip is nearest to a ground point (XZ). */
export function nearestBuilding(s, x, z, unlitOnly = false) {
  let best = -1, bd = Infinity;
  for (const b of s.city.buildings) {
    if (unlitOnly && s.lit[b.id]) continue;
    const d = (b.x - x) ** 2 + (b.z - z) ** 2;
    if (d < bd) { bd = d; best = b.id; }
  }
  return best;
}

// ------------------------------------------------------------------ step

/** @param {ReturnType<typeof makeInput>} [input] */
export function step(s, dt, input = NO_INPUT) {
  const t0 = s.t;
  const t1 = s.t + dt;
  if (s.phase === "run") {
    handleCharge(s, dt, input, t0);
    runCascade(s, t1);
    if (s.strikesLeft === 0 && s.bolts.length === 0 && !s.holding) endRun(s);
    else if (s.litCount === s.city.buildings.length && s.bolts.length === 0) endRun(s);
  }
  s.t = t1;
}

function handleCharge(s, dt, input, now) {
  const st = V.strike;
  if (s.strikesLeft <= 0) { s.holding = false; s.charge = 0; return; }
  if (input.hold) {
    if (!s.holding) {
      s.holding = true;
      s.charge = 0;
      s.events.push({ type: "chargeStart" });
    }
    s.charge += dt / st.fillSec;
    if (s.charge >= st.overMax) release(s, input, now + dt);   // grounded out: forced weak spark
    return;
  }
  if (s.holding) release(s, input, now);
}

/** Energy for a release charge; band = "super" | "part" | "late" | "over". */
export function chargeEnergy(charge, voltage, full = false) {
  const st = V.strike;
  if (full) return { band: "super", energy: voltage };
  if (charge > 1) return { band: "over", energy: st.fizzleEnergy };
  if (charge >= st.superLo && charge <= st.superHi) return { band: "super", energy: voltage };
  if (charge > st.superHi) return { band: "late", energy: Math.max(1, Math.round(voltage * st.lateShare)) };
  const k = st.minShare + (1 - st.minShare) * 0.85 * clamp(charge / st.superLo, 0, 1);
  return { band: "part", energy: Math.max(1, Math.round(voltage * k)) };
}

function release(s, input, time) {
  const charge = s.charge;
  s.holding = false;
  s.charge = 0;
  const { band, energy } = chargeEnergy(charge, s.params.voltage, s.nextFull);
  s.nextFull = false;
  const target = input.aim >= 0 && input.aim < s.city.buildings.length ? input.aim : nearestBuilding(s, input.aimX, input.aimZ);
  if (target < 0) return;
  s.strikesLeft--;
  s.strikeCount++;
  s.cascadeHops = 0;
  s.lastRelease = { charge, band, energy, target };
  const b = s.city.buildings[target];
  s.events.push({ type: "strike", n: s.strikeCount, target, band, energy, charge, x: b.x, y: b.tipY, z: b.z, t: time });
  // The impact lights the struck building; the bolt then starts hopping from there.
  if (!s.lit[target]) light(s, target, 0, 0, time, -1);
  const bolt = spawnBolt(s, target, energy, 0, time);
  if (band === "super" && energy > 1) forkBolt(s, bolt, time, true);
}

function spawnBolt(s, at, energy, gen, time) {
  const c = V.chain;
  const bolt = { id: s.boltSeq++, at, energy, gen, depth: 0, next: time + lerp(c.hopMin, c.hopMax, s.rng.next()), strike: s.strikeCount };
  s.bolts.push(bolt);
  return bolt;
}

function forkBolt(s, bolt, time, forced) {
  if (s.bolts.length >= V.chain.maxBolts) return;
  bolt.gen = Math.min(12, bolt.gen + 1);
  const child = spawnBolt(s, bolt.at, bolt.energy, bolt.gen, time);
  child.depth = bolt.depth;
  s.events.push({ type: "fork", bolt: bolt.id, child: child.id, at: bolt.at, gen: bolt.gen, bolts: s.bolts.length, forced, t: time });
}

/** Process every hop scheduled before t1, in time order (ties: lower bolt id first). */
function runCascade(s, t1) {
  const c = V.chain;
  for (;;) {
    let bi = -1, bt = Infinity;
    for (let i = 0; i < s.bolts.length; i++) {
      const b = s.bolts[i];
      if (b.next < bt || (b.next === bt && b.id < s.bolts[bi].id)) { bt = b.next; bi = i; }
    }
    if (bi < 0 || bt > t1) break;
    const bolt = s.bolts[bi];
    const from = bolt.at;
    const to = nextTarget(s, from);
    if (to < 0 || bolt.energy <= 0) {
      s.bolts.splice(bi, 1);
      s.events.push({ type: "boltEnd", bolt: bolt.id, at: from, t: bt, spent: bolt.energy <= 0 });
      if (s.bolts.length === 0) cascadeEnd(s, bt);
      continue;
    }
    bolt.energy--;
    bolt.depth++;
    bolt.at = to;
    s.cascadeHops++;
    s.events.push({ type: "hop", bolt: bolt.id, from, to, gen: bolt.gen, depth: bolt.depth, chain: s.cascadeHops, t: bt });
    light(s, to, bolt.gen, bolt.depth, bt, bolt.id);
    const gold = s.city.buildings[to].gold;
    if (bolt.energy > 0 && (gold || s.rng.next() < s.params.fork)) forkBolt(s, bolt, bt, gold);
    bolt.next = bt + lerp(c.hopMin, c.hopMax, s.rng.next());
  }
}

/** Nearest unlit antenna within range (the neighbour lists are sorted by distance). */
function nextTarget(s, from) {
  const list = s.near[from];
  for (let k = 0; k < list.length; k++) if (!s.lit[list[k]]) return list[k];
  return -1;
}

function light(s, id, gen, depth, time, bolt) {
  const b = s.city.buildings[id];
  s.lit[id] = 1;
  s.litAt[id] = time;
  s.litGen[id] = gen;
  s.litCount++;
  const p = V.payout;
  const value = (1 + Math.floor(b.h / p.heightUnit)) * (p.forkDouble ? 2 ** gen : 1) * (b.gold ? p.goldFactor : 1);
  s.score += value;
  s.events.push({ type: "light", b: id, value, gen, depth, gold: b.gold, bolt, x: b.x, y: b.tipY, z: b.z, t: time });
  const d = b.district;
  s.districtLit[d]++;
  if (!s.districtDone[d] && s.districtLit[d] === s.city.districts[d].members.length) {
    s.districtDone[d] = 1;
    const bonus = p.districtBonus * s.city.districts[d].members.length;
    s.score += bonus;
    s.events.push({ type: "district", d, bonus, x: s.city.districts[d].x, z: s.city.districts[d].z, t: time });
  }
}

function cascadeEnd(s, time) {
  s.bestChain = Math.max(s.bestChain, s.cascadeHops);
  s.events.push({ type: "cascadeEnd", hops: s.cascadeHops, lit: s.litCount, t: time });
}

function endRun(s) {
  const share = progress(s);
  s.phase = share >= V.payout.passAt ? "won" : "failed";
  s.events.push({ type: "runEnd", share, plate: plateFor(share), phase: s.phase });
}

// ------------------------------------------------------------------ QA / capture helpers

/** QA: power the whole city now (a finished run is "won"). */
export function forceWin(s) {
  if (s.phase !== "run") return false;
  for (const b of s.city.buildings) if (!s.lit[b.id]) light(s, b.id, 0, 0, s.t, -1);
  s.bolts.length = 0;
  s.strikesLeft = 0;
  s.holding = false;
  endRun(s);
  return true;
}

/** QA: end the run with `at` (0..1) of the city powered, as a failed run (the revive offer reads it). */
export function forceFail(s, at = 0) {
  if (s.phase !== "run") return false;
  const n = s.city.buildings.length;
  const want = Math.min(n - 1, Math.round(clamp(at, 0, 1) * n));
  for (const b of s.city.buildings) { if (s.litCount >= want) break; if (!s.lit[b.id]) light(s, b.id, 0, 0, s.t, -1); }
  s.bolts.length = 0;
  s.strikesLeft = 0;
  s.holding = false;
  s.phase = "failed";
  s.events.push({ type: "runEnd", share: progress(s), plate: plateFor(progress(s)), phase: "failed" });
  return true;
}
