/**
 * Storm Grid simulation. Pure JS: no three.js, no DOM, no Math.random, no clock.
 *
 * That is what makes CG-GAME-003 testable (tools/qa/sim-health.mjs runs this in Node at several
 * step sizes). Rates are per second and multiplied by dt. The cascade is EVENT-TIMED: every hop
 * has an exact scheduled time and hops are processed in time order inside each step, so the same
 * strike gives the same chain at any step size (the seeded RNG is consumed in the same order).
 * The view never mutates state; it drains `state.events` for feedback.
 *
 * Phases: ready -> run -> won | failed
 *   ready   the dark city idles; the first press starts the run (and starts charging)
 *   run     hold to charge, release to strike; `strikesMax` strikes per city
 *   won     strikes spent (or FULL POWER) with at least payout.passAt of the city powered
 *   failed  strikes spent below payout.passAt (retry the city)
 *
 * Rules (docs/GAME_BRIEF.md "The charge meter" / "The chain algorithm"; numbers in STORM):
 *  - release: WEAK (< 40%) 0.5 x E0; CHARGED up to the band; SUPERCHARGE (band) two bolts of
 *    floor(1.3 x E0) leave the impact; HOT (band .. 100%, or released while overcharged) E0; held
 *    0.35 s past 100% the strike fires by itself as a FIZZLE (3 hops, never forks)
 *  - the strike lights the target building; each bolt then hops to the NEAREST UNLIT antenna within
 *    R (3D between tips), costs 1 energy and lights it; nothing unlit in range = a SUPERCHARGE bolt LEAPS
 *    to the nearest unlit antenna within leapRange x R for leapCost energy (hop event `leap: true`), any
 *    other bolt grounds out - the gold band is the skill that reaches the last dark blocks
 *  - on each hop a bolt forks with chance F (gold rods: always, +4 energy first) into two bolts
 *    that each carry ceil(0.6 x (e - 1))
 *  - a building pays round((1 + floors/8) x 1.06^(city-1) x min(2, 1 + 0.02 x depth)) (x10 gold);
 *    a district fully lit pays +25% of its buildings' value ("BLOCK POWERED")
 *
 * VIEW API - everything a view needs, read-only (units: metres, sim seconds). Restyle freely; the
 * simulation never depends on how it is drawn:
 *   s.city            { level, theme (0..7), width, depth, buildings: Building[], districts: District[] }
 *   Building          { id, district, x, z (footprint centre, ground y = 0), w, d (footprint), h (roof height),
 *                       tipY (antenna tip = the hop point, roof + 3 m), floors, roof ("flat" | "stepped" | "spire",
 *                       cosmetic), gold (gold rod: x10), seed (0..1, per-building variation) }
 *   District          { id, members (building ids), x, z, w, d (the district's lot area) }
 *   lit state         s.lit[i] 0/1 · s.litAt[i] sim time it lit (-1 = dark) · s.litGen[i] fork generation of the
 *                     bolt that lit it · s.paid[i] its "+N" · s.districtDone[d] 0/1 · progress(s) share powered
 *   live              s.phase · s.t · s.holding · s.charge (0..1.29) · bandOf(s, c) · s.params (bandLo, bandHi, e0,
 *                     range, fork, fillSec) · s.bolts[] { id, at (building), e, gen, depth } · s.strikesLeft/Max
 *   events            s.events (the view drains it each frame; every event has `type`, most have `t` = sim time):
 *     runStart                                  the first press of a city
 *     chargeStart                               a new charge began
 *     band      { band: "super" | "over" }      the charge entered the SUPERCHARGE band / went past 100%
 *     strike    { n, target, band, energy, bolts, charge, x, y, z, t }   band: weak|charged|super|hot|fizzle
 *     hop       { bolt, from, to, gen, depth, chain, leap, t }            a bolt leapt tip to tip (leap: a long jump)
 *     light     { b, value, gen, depth, gold, bolt, x, y, z, t }          a building lit ("+N" = value)
 *     fork      { bolt, child, at, gen, bolts, forced, t }                one bolt became two (bolts = in the air)
 *     district  { d, bonus, x, z, t }                                     BLOCK POWERED
 *     boltEnd   { bolt, at, grounded, t }                                 spent, or grounded (nothing in range)
 *     cascadeEnd { hops, value, lit, t }                                  the last bolt of a strike ended
 *     runEnd    { share, plate: { at, mult }, phase }                     the city is over (won | failed)
 *     extraStrike                                                         "One more strike" granted
 */

import { STORM as S } from "../config.js";
import { createRng } from "../core/rng.js";

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a, b, k) => a + (b - a) * k;

/** Per-step input: hold = the strike button is down; aim = building index, or -1 to use (aimX, aimZ). */
export function makeInput() {
  return { hold: false, aim: -1, aimX: 0, aimZ: 0 };
}
const NO_INPUT = makeInput();

/** Upgrade levels (meta.js) -> the strike's numbers. Pure; tests call it directly. */
export function deriveParams(level = 1, up = {}) {
  const st = S.strike, ch = S.chain;
  const volt = up.voltage | 0, fork = up.fork | 0, cap = up.capacitor | 0, strikes = up.strikes | 0, gold = up.gold | 0;
  const first = level === 1 ? st.firstCity : null;
  const bandLo = Math.max(0.05, Math.min(first ? first.bandLo : 1, st.band[0] - st.capacitorStep * cap));
  return {
    e0: ch.e0 + ch.e0PerVoltage * volt,
    range: ch.range + ch.rangePerVoltage * volt,
    fork: Math.min(1, ch.fork + ch.forkPerLevel * fork),
    fillSec: first ? first.fillSec : st.fillSec,
    bandLo,
    bandHi: st.band[1],
    strikes: st.strikes + Math.min(st.maxStrikeLevels, strikes),
    gold: level >= S.city.goldFrom ? gold : 0,
  };
}

// ------------------------------------------------------------------ city

/** The city recipe for a city number (docs/GAME_BRIEF.md "City generation"). */
export function cityPlan(level) {
  const c = S.city;
  const k = clamp((level - 1) / (c.rampCities - 1), 0, 1);
  let n = Math.min(c.maxBuildings, Math.round(c.buildings * c.growth ** (level - 1)));
  if (level > 1 && (level - 1) % c.themeEvery === 0) n = Math.round(n * c.themeRelief);
  const park = lerp(c.park[0], c.park[1], k);
  const lots = n <= c.smallUpTo ? c.lotsSmall : c.lotsLarge;
  const per = Math.max(1, Math.ceil(Math.sqrt(n / (lots * lots * (1 - park)))));
  return {
    n, park, lots, per,
    avenue: lerp(c.avenue[0], c.avenue[1], k),
    heightMax: lerp(c.heightMax[0], c.heightMax[1], k),
    theme: Math.floor((level - 1) / c.themeEvery) % c.themes,
  };
}

/**
 * A seeded city: per x per districts of lots x lots lots, with avenues between districts. Exactly
 * N lots get a building: park rolls first, then the lots nearest the centre win (a compact skyline
 * with parks as holes; the outer lots stay empty). Every building has a rooftop antenna tip.
 * Gold rods come from a separate stream, so the layout never depends on the Gold rods level.
 */
export function generateCity(level, seed, gold = 0) {
  const c = S.city;
  const P = cityPlan(level);
  const rng = createRng(`${seed}:city:${level}`);
  const pitch = c.lotPitch;
  const block = P.lots * pitch;
  const stride = block + P.avenue;
  const span = P.per * block + (P.per - 1) * P.avenue;
  const half = span / 2;

  const lots = [];
  for (let dj = 0; dj < P.per; dj++) {
    for (let di = 0; di < P.per; di++) {
      for (let lz = 0; lz < P.lots; lz++) {
        for (let lx = 0; lx < P.lots; lx++) {
          const x = -half + di * stride + (lx + 0.5) * pitch + rng.range(-c.jitter, c.jitter);
          const z = -half + dj * stride + (lz + 0.5) * pitch + rng.range(-c.jitter, c.jitter);
          const park = rng.chance(P.park);
          const key = Math.hypot(x, z) / Math.max(1, half) + rng.range(0, 0.35);
          lots.push({ i: lots.length, district: dj * P.per + di, x, z, park, key });
        }
      }
    }
  }
  const order = (a, b) => a.key - b.key || a.i - b.i;
  const open = lots.filter((l) => !l.park).sort(order);
  const chosen = open.slice(0, P.n);
  if (chosen.length < P.n) chosen.push(...lots.filter((l) => l.park).sort(order).slice(0, P.n - chosen.length));
  chosen.sort((a, b) => a.i - b.i);   // stable index order: district by district

  const buildings = [];
  const byDistrict = new Map();
  for (const l of chosen) {
    const h = Math.round(rng.range(c.heightMin, P.heightMax) * 2) / 2;
    const b = {
      id: buildings.length, district: l.district, x: l.x, z: l.z,
      w: pitch * rng.range(c.footprint[0], c.footprint[1]), d: pitch * rng.range(c.footprint[0], c.footprint[1]),
      h, tipY: h + c.antenna, floors: Math.floor(h / S.payout.floorM), roof: "flat", gold: false, seed: rng.next(),
    };
    buildings.push(b);
    if (!byDistrict.has(l.district)) byDistrict.set(l.district, []);
    byDistrict.get(l.district).push(b.id);
  }
  // Districts with at least one building, renumbered densely (bounds = the district's lot area).
  const districts = [];
  for (const [raw, members] of [...byDistrict.entries()].sort((a, b) => a[0] - b[0])) {
    const di = raw % P.per, dj = Math.floor(raw / P.per);
    const d = { id: districts.length, members, x: -half + di * stride + block / 2, z: -half + dj * stride + block / 2, w: block, d: block };
    for (const m of members) buildings[m].district = d.id;
    districts.push(d);
  }
  // Roof types (cosmetic, for the view): their own stream, so the layout never depends on them.
  const rr = createRng(`${seed}:roof:${level}`);
  for (const b of buildings) {
    const r = rr.next();
    b.roof = b.h > 0.75 * P.heightMax && r < 0.5 ? "spire" : r < 0.35 ? "stepped" : "flat";
  }
  // Gold rods: mid-to-tall buildings, one per district while districts last.
  if (gold > 0) {
    const g = createRng(`${seed}:gold:${level}`);
    const tall = buildings.map((b) => b.id).sort((a, b) => buildings[b].h - buildings[a].h || a - b);
    const pool = tall.slice(0, Math.max(4, Math.ceil(tall.length * 0.6)));
    const used = new Set();
    let placed = 0;
    for (let tries = 0; tries < 400 && placed < Math.min(gold, buildings.length); tries++) {
      const b = buildings[pool[Math.floor(g.next() * pool.length)]];
      if (b.gold || (used.has(b.district) && used.size < districts.length)) continue;
      b.gold = true;
      used.add(b.district);
      placed++;
    }
  }
  return { level, theme: P.theme, width: span, depth: span, plan: P, buildings, districts };
}

/** Hop distance between two antenna tips: plain 3D (tall towers are hubs; a tall neighbour can be out of reach). */
export function hopDistance(a, b) {
  const dx = a.x - b.x, dz = a.z - b.z, dy = a.tipY - b.tipY;
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
 * @param {{ level?:number, seed?:string, up?:object, extraStrikes?:number, params?:object }} [o]
 *        up = upgrade levels { voltage, fork, strikes, capacitor, gold } (meta.js); params overrides tests
 */
export function createSim({ level = 1, seed = "storm", up = {}, extraStrikes = 0, params = null } = {}) {
  const p = { ...deriveParams(level, up), ...(params || {}) };
  const city = generateCity(level, seed, p.gold);
  const n = city.buildings.length;
  const strikes = p.strikes + extraStrikes;
  return {
    level, seed, city, params: p,
    near: neighbours(city, p.range),
    phase: "ready",
    t: 0,
    rng: createRng(`${seed}:bolts:${level}`),
    lit: new Uint8Array(n),            // 1 once lit
    litAt: new Float32Array(n).fill(-1),
    litGen: new Uint8Array(n),         // fork generation of the bolt that lit it (view: colour)
    paid: new Int32Array(n),           // what each building paid (BLOCK POWERED is 25% of the sum)
    litCount: 0,
    districtLit: new Int32Array(city.districts.length),
    districtDone: new Uint8Array(city.districts.length),
    districtsDone: 0,
    strikesLeft: strikes,
    strikesMax: strikes,
    strikeCount: 0,
    nextFull: false,                   // "one more strike": the next release is a SUPERCHARGE whatever the charge
    holding: false,
    holdT: 0,                          // sim time of the press that started this charge
    needRelease: false,                // after an auto-FIZZLE the button must be let go first
    charge: 0,
    lastRelease: null,                 // { charge, band, energy, bolts, target }
    bolts: [],                         // active: { id, at, e, eStrike, gen, depth, next, strike, noFork, leaps }
    boltSeq: 0,
    cascadeHops: 0,                    // hops in the current strike (all bolts)
    cascadeValue: 0,                   // "+N" paid by the current strike (merged float at its end)
    bestChain: 0,
    score: 0,                          // the run's coins before the plate
    events: [],
  };
}

export function progress(s) {
  return s.city.buildings.length ? s.litCount / s.city.buildings.length : 0;
}

/** The jackpot plate for a share powered: { mult, at } (x1 below the pass mark). */
export function plateFor(share) {
  for (const [at, mult] of S.payout.plates) if (share >= at - 1e-9) return { at, mult };
  return { at: 0, mult: 1 };
}

/** The run's coins with the plate applied. */
export function runCoins(s) {
  return Math.max(0, Math.round(s.score * plateFor(progress(s)).mult));
}

export function startRun(s) {
  if (s.phase !== "ready") return false;
  s.phase = "run";
  s.t = 0;
  s.events.push({ type: "runStart" });
  return true;
}

/** "Supercharged start" (rewarded, city intro): more strikes for this city, before the first strike. */
export function addStartStrikes(s, n) {
  if (s.strikeCount > 0 || (s.phase !== "ready" && s.phase !== "run")) return false;
  s.strikesLeft += n;
  s.strikesMax += n;
  return true;
}

/** "One more strike" (rewarded): back into the run with one auto-SUPERCHARGE strike. */
export function addStrike(s) {
  if (s.phase !== "won" && s.phase !== "failed") return false;
  if (s.litCount >= s.city.buildings.length) return false;
  s.strikesLeft += 1;
  s.strikesMax += 1;
  s.nextFull = true;
  s.phase = "run";
  s.events.push({ type: "extraStrike" });
  return true;
}

/** The building whose antenna is nearest to a ground point (XZ). */
export function nearestBuilding(s, x, z, unlitOnly = false) {
  let best = -1, bd = Infinity;
  for (const b of s.city.buildings) {
    if (unlitOnly && s.lit[b.id]) continue;
    const d = (b.x - x) ** 2 + (b.z - z) ** 2;
    if (d < bd) { bd = d; best = b.id; }
  }
  return best;
}

/** The charge band a value falls in: weak | charged | super | hot | over. */
export function bandOf(s, charge) {
  const p = s.params;
  if (charge > 1) return "over";
  if (charge >= p.bandLo && charge <= p.bandHi) return "super";
  if (charge > p.bandHi) return "hot";
  return charge < S.strike.weakBelow ? "weak" : "charged";
}

/** Energy per bolt and bolt count for a release. */
export function chargeEnergy(s, charge, full = false) {
  const st = S.strike, e0 = s.params.e0;
  if (full) return { band: "super", energy: Math.floor(st.superShare * e0), bolts: st.superBolts };
  const band = bandOf(s, charge);
  if (band === "super") return { band, energy: Math.floor(st.superShare * e0), bolts: st.superBolts };
  if (band === "hot" || band === "over") return { band: "hot", energy: e0, bolts: 1 };
  if (band === "weak") return { band, energy: Math.max(1, Math.round(st.weakShare * e0)), bolts: 1 };
  const k = Math.min(1, st.weakShare + 1.25 * (charge - st.weakBelow));
  return { band, energy: Math.max(1, Math.round(e0 * k)), bolts: 1 };
}

// ------------------------------------------------------------------ step

/** @param {ReturnType<typeof makeInput>} [input] */
export function step(s, dt, input = NO_INPUT) {
  const t0 = s.t;
  const t1 = s.t + dt;
  if (s.phase === "run") {
    handleCharge(s, dt, input, t0);
    runCascade(s, t1);
    const all = s.litCount === s.city.buildings.length;
    if (s.bolts.length === 0 && !s.holding && (s.strikesLeft === 0 || all)) endRun(s);
  }
  s.t = t1;
}

function handleCharge(s, dt, input, now) {
  if (s.strikesLeft <= 0 || s.litCount === s.city.buildings.length) { s.holding = false; s.charge = 0; return; }
  if (!input.hold) s.needRelease = false;
  if (input.hold && !s.needRelease) {
    const p = s.params;
    if (!s.holding) {
      s.holding = true;
      s.holdT = now;
      s.charge = 0;
      s.events.push({ type: "chargeStart" });
    }
    // The charge is a function of sim time since the press, so every step size sees the same value.
    const fireAt = s.holdT + p.fillSec + S.strike.overSec;
    if (now + dt >= fireAt - 1e-9) {                      // held too long: FIZZLE at the exact time
      s.charge = (fireAt - s.holdT) / p.fillSec;
      s.needRelease = true;                               // the next strike needs a fresh press
      release(s, input, fireAt, true);
      return;
    }
    const before = s.charge;
    s.charge = (now + dt - s.holdT) / p.fillSec;
    if (before < p.bandLo && s.charge >= p.bandLo) s.events.push({ type: "band", band: "super" });
    else if (before <= 1 && s.charge > 1) s.events.push({ type: "band", band: "over" });
    return;
  }
  if (s.holding) release(s, input, now, false);
}

function release(s, input, time, fizzle) {
  const charge = s.charge;
  s.holding = false;
  s.charge = 0;
  const r = fizzle ? { band: "fizzle", energy: S.strike.fizzleEnergy, bolts: 1 } : chargeEnergy(s, charge, s.nextFull);
  s.nextFull = false;
  const n = s.city.buildings.length;
  const target = input.aim >= 0 && input.aim < n ? input.aim : nearestBuilding(s, input.aimX, input.aimZ, true);
  if (target < 0) return;
  s.strikesLeft--;
  s.strikeCount++;
  s.cascadeHops = 0;
  s.cascadeValue = 0;
  s.lastRelease = { charge, band: r.band, energy: r.energy, bolts: r.bolts, target };
  const b = s.city.buildings[target];
  s.events.push({ type: "strike", n: s.strikeCount, target, band: r.band, energy: r.energy, bolts: r.bolts, charge, x: b.x, y: b.tipY, z: b.z, t: time });
  // The impact lights the struck building; the bolts then hop on from there.
  if (!s.lit[target]) light(s, target, 0, 0, time, -1);
  const gen = r.bolts > 1 ? 1 : 0;
  let first = null;
  for (let k = 0; k < r.bolts; k++) {
    const bolt = spawnBolt(s, target, r.energy, gen, time, r.band === "fizzle", r.band === "super" || !S.chain.leapSuperOnly);
    if (!first) first = bolt;
    else s.events.push({ type: "fork", bolt: first.id, child: bolt.id, at: target, gen, bolts: s.bolts.length, forced: true, t: time });
  }
}

function hopTime(bolt) {
  const c = S.chain;
  return c.hopFast + c.hopSlow * clamp(1 - bolt.e / bolt.eStrike, 0, 1);
}

function spawnBolt(s, at, energy, gen, time, noFork, leaps = false) {
  const bolt = { id: s.boltSeq++, at, e: energy, eStrike: Math.max(1, energy), gen, depth: 0, next: 0, strike: s.strikeCount, noFork, leaps };
  bolt.next = time + hopTime(bolt);
  s.bolts.push(bolt);
  return bolt;
}

/** Process every hop scheduled before t1, in time order (ties: lower bolt id first). */
function runCascade(s, t1) {
  const c = S.chain;
  for (;;) {
    let bi = -1, bt = Infinity;
    for (let i = 0; i < s.bolts.length; i++) {
      const b = s.bolts[i];
      if (b.next < bt || (b.next === bt && b.id < s.bolts[bi].id)) { bt = b.next; bi = i; }
    }
    if (bi < 0 || bt > t1) break;
    const bolt = s.bolts[bi];
    const from = bolt.at;
    let to = bolt.e > 0 ? nextTarget(s, from) : -1;
    let leap = false;
    // Nothing dark in range: a SUPERCHARGE bolt (leapSuperOnly) with energy to spare LEAPS to the nearest dark antenna within
    // leapRange x R (costs leapCost), so a lone dark block no longer strands the last few percent.
    if (to < 0 && bolt.leaps && bolt.e >= c.leapCost) { to = leapTarget(s, from); leap = to >= 0; }
    if (to < 0) {
      s.bolts.splice(bi, 1);
      s.events.push({ type: "boltEnd", bolt: bolt.id, at: from, t: bt, grounded: bolt.e > 0 });
      if (s.bolts.length === 0) cascadeEnd(s, bt);
      continue;
    }
    bolt.e -= leap ? c.leapCost : 1;
    bolt.depth++;
    bolt.at = to;
    s.cascadeHops++;
    s.events.push({ type: "hop", bolt: bolt.id, from, to, gen: bolt.gen, depth: bolt.depth, chain: s.cascadeHops, leap, t: bt });
    light(s, to, bolt.gen, bolt.depth, bt, bolt.id);
    const gold = s.city.buildings[to].gold;
    if (gold) bolt.e += S.gold.energy;
    if (bolt.e > 0 && !bolt.noFork && s.bolts.length < c.maxBolts && (gold || s.rng.next() < s.params.fork)) {
      const e = Math.ceil(c.forkShare * bolt.e);
      bolt.e = e;
      bolt.gen = Math.min(12, bolt.gen + 1);
      const child = spawnBolt(s, to, e, bolt.gen, bt, false, bolt.leaps);
      child.eStrike = bolt.eStrike;
      child.depth = bolt.depth;
      child.next = bt + hopTime(child);
      s.events.push({ type: "fork", bolt: bolt.id, child: child.id, at: to, gen: bolt.gen, bolts: s.bolts.length, forced: gold, t: bt });
    }
    bolt.next = bt + hopTime(bolt);
  }
}

/** Nearest unlit antenna within range (the neighbour lists are sorted by distance). */
function nextTarget(s, from) {
  const list = s.near[from];
  for (let k = 0; k < list.length; k++) if (!s.lit[list[k]]) return list[k];
  return -1;
}

/** Nearest unlit antenna within leapRange x R (ties: lower id), or -1. */
function leapTarget(s, from) {
  const bs = s.city.buildings, a = bs[from], max = s.params.range * S.chain.leapRange;
  let best = -1, bd = Infinity;
  for (let j = 0; j < bs.length; j++) {
    if (s.lit[j]) continue;
    const d = hopDistance(a, bs[j]);
    if (d <= max && d < bd) { bd = d; best = j; }
  }
  return best;
}

/** "+N" for lighting building b at chain depth `depth`. */
export function buildingValue(level, b, depth) {
  const p = S.payout;
  const v = Math.round((1 + b.floors / p.floorsDiv) * p.cityGrowth ** (level - 1) * Math.min(p.depthCap, 1 + p.depthStep * depth));
  return Math.max(1, v) * (b.gold ? S.gold.pay : 1);
}

function light(s, id, gen, depth, time, bolt) {
  const b = s.city.buildings[id];
  s.lit[id] = 1;
  s.litAt[id] = time;
  s.litGen[id] = gen;
  s.litCount++;
  const value = buildingValue(s.level, b, depth);
  s.paid[id] = value;
  s.score += value;
  s.cascadeValue += value;
  s.events.push({ type: "light", b: id, value, gen, depth, gold: b.gold, bolt, x: b.x, y: b.tipY, z: b.z, t: time });
  const d = b.district;
  s.districtLit[d]++;
  const members = s.city.districts[d].members;
  if (!s.districtDone[d] && s.districtLit[d] === members.length) {
    s.districtDone[d] = 1;
    s.districtsDone++;
    let sum = 0;
    for (const m of members) sum += s.paid[m];
    const bonus = Math.max(1, Math.round(S.payout.districtShare * sum));
    s.score += bonus;
    s.cascadeValue += bonus;
    s.events.push({ type: "district", d, bonus, x: s.city.districts[d].x, z: s.city.districts[d].z, t: time });
  }
}

function cascadeEnd(s, time) {
  s.bestChain = Math.max(s.bestChain, s.cascadeHops);
  s.events.push({ type: "cascadeEnd", hops: s.cascadeHops, value: s.cascadeValue, lit: s.litCount, t: time });
}

function endRun(s) {
  const share = progress(s);
  s.phase = share >= S.payout.passAt - 1e-9 ? "won" : "failed";
  s.events.push({ type: "runEnd", share, plate: plateFor(share), phase: s.phase });
}

// ------------------------------------------------------------------ QA / capture helpers

/** QA: power the whole city now (FULL POWER, "won"). */
export function forceWin(s) {
  if (s.phase !== "run") return false;
  for (const b of s.city.buildings) if (!s.lit[b.id]) light(s, b.id, 0, 0, s.t, -1);
  s.bolts.length = 0;
  s.strikesLeft = 0;
  s.holding = false;
  endRun(s);
  return true;
}

/**
 * QA: end the run now with `at` (0..1) of the city powered (never 100%). Below the pass mark it is
 * "failed"; at 0.85-0.99 the One-more-strike offer reads it.
 */
export function forceFail(s, at = 0) {
  if (s.phase !== "run") return false;
  const n = s.city.buildings.length;
  const want = Math.min(n - 1, Math.round(clamp(at, 0, 1) * n));
  for (const b of s.city.buildings) { if (s.litCount >= want) break; if (!s.lit[b.id]) light(s, b.id, 0, 0, s.t, -1); }
  s.bolts.length = 0;
  s.strikesLeft = 0;
  s.holding = false;
  endRun(s);
  return true;
}
