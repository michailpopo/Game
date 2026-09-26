/**
 * Comet Chain arena simulation. Pure JS: no three.js, no DOM, no Math.random, no clock.
 *
 * That is what makes CG-GAME-003 testable (tools/qa/sim-health.mjs runs this in Node at
 * several step sizes) and what lets a server run the same rules later. All rates are per
 * second and multiplied by dt; smoothing uses exp(-k*dt); randomness comes from seeded
 * streams (one for spawns, one per bot) so the world replays exactly from its seed.
 *
 * The view never mutates state; it drains `state.events` for feedback.
 *
 * Phases: ready -> run <-> failed -> won
 *   ready   the ready screen: the arena is live, the player's comet circles on the spot
 *   run     the round clock runs (ARENA.round)
 *   failed  the player is dead; the clock keeps running and the player respawns with the
 *           starter chain after round.respawnSec (timed rounds) - unless the game holds the
 *           respawn for a revive offer (holdRespawn) or the round mode has no respawns
 *   won     the round is over (time-out in "timed" mode, target reached in "target" mode)
 * The arena lives in every phase: bots roam and eat on the ready screen and behind menus.
 *
 * Rules (numbers and switches in ARENA, src/config.js):
 *  - a comet leads a chain of planets, biggest right behind it (values.js merge rule);
 *    the comet steers toward a target direction with a max turn rate, the planets follow
 *    its recorded path at fixed spacing
 *  - a comet eats pickups it touches (magnet pull just before); bots only under their cap
 *  - contact: a comet touching another comet or its planets compares HEAD values
 *    (the biggest planets, contact.rule) - bigger swallows: the loser's planets scatter as
 *    pickups and the loser dies (bots and the player respawn); equal heads bounce
 *  - boost: x boost.factor speed for a cost (boost.cost: meter or dropTail)
 */

import { ARENA as A } from "../config.js";
import { createRng } from "../core/rng.js";
import { steerBot, think } from "./ai.js";
import { blockSize, headAfterEat, headOfMass, headSize, insertAndMerge, looseSize, massToChain } from "./values.js";

const TAU = Math.PI * 2;
const PATH_CAP = 512;
const MAXC = A.values.maxChain;
const HEAD0 = A.comet.size;

const wrap = (a) => a - TAU * Math.round(a / TAU);
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/** Per-step input for one comet. `hasDir`: steer toward (dirX, dirZ); else `turn` -1..1 rotates. */
export function makeInput() {
  return { hasDir: false, dirX: 0, dirZ: 0, turn: 0, boost: false };
}
const NO_INPUT = makeInput();
const _botIn = makeInput();

function makeSnake(id, name, isPlayer) {
  return {
    id, name, isPlayer,
    alive: false, respawn: 0, protect: 0, bounceCd: 0, killedBy: -1,
    x: 0, z: 0, heading: 0, prevX: 0, prevZ: 0, prevHeading: 0,
    // planets, biggest first; seg* = planet centres (the comet itself is at x, z)
    chain: new Float64Array(MAXC), n: 0, prevN: 0, mass: 0, head: 0, len: 0,
    segX: new Float32Array(MAXC), segZ: new Float32Array(MAXC), segYaw: new Float32Array(MAXC),
    prevSegX: new Float32Array(MAXC), prevSegZ: new Float32Array(MAXC), prevSegYaw: new Float32Array(MAXC),
    path: new Float32Array(PATH_CAP * 2), pathTop: 0, pathLen: 0, pathAcc: 0,
    boosting: false, meter: 1, meterDry: false, dropAcc: 0,
    kills: 0, deaths: 0, peakMass: 0, tier: 1, rng: null,
    ai: { next: 0, mode: "wander", tx: 0, tz: 0, target: -1, boost: false },
  };
}

function makeLoose(cap) {
  return {
    cap,
    x: new Float32Array(cap), z: new Float32Array(cap),
    px: new Float32Array(cap), pz: new Float32Array(cap),
    vx: new Float32Array(cap), vz: new Float32Array(cap),
    v: new Float64Array(cap), age: new Float32Array(cap), alive: new Uint8Array(cap), gold: new Uint8Array(cap),
    count: 0, cursor: 0,
  };
}

/**
 * @param {{ level?:number, seed?:string, startMass?:number, bots?:number, looseTarget?:number }} [o]
 *        bots / looseTarget override the config (tests and captures)
 */
export function createSim({ level = 1, seed = "arena", startMass = A.snake.startMass, bots = A.bots.count, looseTarget = A.loose.target } = {}) {
  const r = A.round;
  const s = {
    level,
    phase: "ready",
    t: 0,                 // round time (difficulty ramp, the round clock)
    clock: 0,             // world time (bot thinking)
    rngSpawn: createRng(`${seed}:spawn`),
    winValue: Math.min(r.winValueMax, r.winValue * r.winValueGrowth ** (level - 1)),
    startMass,
    looseTarget,
    snakes: [],
    player: null,
    loose: makeLoose(A.loose.capacity),
    spawnAcc: 0,
    nearAcc: 0,
    respawnIn: 0,         // player respawn countdown while "failed"
    holdRespawn: false,   // the game holds the respawn while a revive offer is open
    deathMass: 0,         // the player's chain total when they died (a revive restores it)
    deathHead: 0,
    deathBy: null,
    finalRank: 0,         // set when the round ends
    events: [],
    merges: [],           // scratch for insertAndMerge
  };
  const player = makeSnake(0, "You", true);
  s.snakes.push(player);
  s.player = player;
  const names = A.bots.names;
  for (let i = 0; i < bots; i++) {
    const nm = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : "");
    const b = makeSnake(i + 1, A.bots.prefix ? `${A.bots.prefix} ${nm}` : nm, false);
    b.rng = createRng(`${seed}:bot${i + 1}`);   // one stream per bot: one bot's choice never reshuffles another's
    s.snakes.push(b);
  }

  // Player near the middle, bots spread over the rest of the floor.
  const rs = s.rngSpawn;
  spawnSnake(s, player, startMass, rs.range(-4, 4), rs.range(-4, 4), rs.range(-Math.PI, Math.PI));
  for (let i = 1; i < s.snakes.length; i++) respawnBot(s, s.snakes[i], 12);
  while (s.loose.count < s.looseTarget && spawnFresh(s) >= 0) { /* initial fill */ }
  return s;
}

// ------------------------------------------------------------------ queries

export function collidable(s, sn) {
  return sn.alive && sn.protect <= 0 && (!sn.isPlayer || s.phase === "run");
}

/** Highest head value a bot may reach right now (difficulty ramp). */
export function botCap(s) {
  const b = A.bots;
  const byTime = b.capStart * 2 ** (s.t / b.capDoubleSec);
  const byPlayer = Math.max(s.player.head, headOfMass(s.startMass)) * b.capVsPlayer;
  return Math.min(b.capMax, Math.max(byTime, byPlayer));
}

/** A bot's own ceiling: its tier's share of the arena cap, never below two ladder steps. */
export function capOf(s, sn) {
  return Math.max(A.values.base * 2, headOfMass(botCap(s) * sn.tier));
}

export function canEat(s, sn, v) {
  if (sn.isPlayer) return s.phase === "run";
  return headAfterEat(sn.chain, sn.n, v) <= capOf(s, sn);
}

/** Seconds left in a timed round. */
export function timeLeft(s) {
  return A.round.mode === "timed" ? Math.max(0, A.round.durationSec - s.t) : Infinity;
}

export function inFinale(s) {
  return A.round.mode === "timed" && s.phase === "run" && timeLeft(s) <= A.round.finaleSec;
}

/** 0..1 for the QA contract and the revive rule: how far this round got. */
export function progress(s) {
  const r = A.round;
  if (r.mode === "timed") return clamp(s.t / r.durationSec, 0, 1);
  if (r.mode === "endless") {
    const { rank, of } = playerRank(s);
    return of > 1 ? clamp(1 - (rank - 1) / (of - 1), 0, 1) : 1;
  }
  const head = s.player.alive ? s.player.head : s.deathHead;
  const h0 = Math.log2(Math.max(2, headOfMass(s.startMass)));
  const span = Math.log2(s.winValue) - h0;
  return span > 0 ? clamp((Math.log2(Math.max(head, 1)) - h0) / span, 0, 1) : 1;
}

/** The player's chain total for ranking: their chain, or the starter chain while a respawn is pending. */
export function playerScore(s) {
  return s.player.alive ? s.player.mass : s.phase === "failed" && A.round.mode === "timed" ? s.startMass : s.deathMass;
}

/** Rank by chain total among the living comets (and the player). */
export function playerRank(s) {
  const mine = playerScore(s);
  let rank = 1, of = 1;
  for (const sn of s.snakes) {
    if (sn.isPlayer || !sn.alive) continue;
    of++;
    if (sn.mass > mine) rank++;
  }
  return { rank, of };
}

export const massOf = (s, sn) => (sn.isPlayer ? playerScore(s) : sn.alive ? sn.mass : 0);

/** Fill `out` with the living comets (and the player) sorted by chain total, biggest first. Returns its length. */
export function standings(s, out) {
  let n = 0;
  for (const sn of s.snakes) if (sn.alive || sn.isPlayer) out[n++] = sn;
  out.length = n;
  out.sort((a, b) => massOf(s, b) - massOf(s, a) || a.id - b.id);
  return n;
}

// ------------------------------------------------------------------ flow

export function startRun(s) {
  if (s.phase !== "ready") return false;
  s.phase = "run";
  s.t = 0;
  s.player.protect = A.snake.protectSec;
  s.player.peakMass = s.player.mass;
  s.events.push({ type: "runStart" });
  return true;
}

/** Rewarded revive: the player comes back with the chain they died with, protected for a moment. */
export function revive(s) {
  if (s.phase !== "failed") return false;
  respawnPlayer(s, Math.max(s.deathMass, s.startMass), "revived");
  return true;
}

/** The normal respawn: the starter chain at a safe spot (timed rounds; also the revive decline). */
export function respawn(s) {
  if (s.phase !== "failed") return false;
  respawnPlayer(s, s.startMass, "respawned");
  return true;
}

function respawnPlayer(s, mass, type) {
  const p = s.player;
  const at = safeSpot(s, 10, 0.3);
  spawnSnake(s, p, mass, at.x, at.z, Math.atan2(-at.z, -at.x));
  p.protect = A.snake.protectSec;
  s.holdRespawn = false;
  s.phase = "run";
  s.events.push({ type, mass: p.mass });
}

/** Replace the player's chain (ready-screen start boost, QA fixtures). */
export function setPlayerMass(s, mass) {
  const p = s.player;
  if (!p.alive) return;
  p.n = massToChain(Math.max(A.values.base, Math.round(mass)), p.chain);
  recount(p);
  p.peakMass = Math.max(p.peakMass, p.mass);
  computeSegments(p);
  copyPrev(p);
}

/**
 * QA: the player dies as if swallowed, at a given progress 0..1 (the revive rule reads it).
 * Timed rounds: progress = round time, so the clock jumps there first.
 */
export function forceFail(s, at = 0) {
  if (s.phase !== "run") return false;
  const r = A.round;
  if (r.mode === "timed") s.t = clamp(at, 0, 0.99) * r.durationSec;
  else if (r.mode === "target") {
    const h0 = Math.log2(Math.max(2, headOfMass(s.startMass)));
    const lv = Math.floor(h0 + clamp(at, 0, 1) * (Math.log2(s.winValue) - h0) + 1e-9);
    setPlayerMass(s, 2 ** lv);
  }
  kill(s, s.player, null, "forced");
  return true;
}

/** QA / capture: end the round now (a finished round is the "won" phase). */
export function forceWin(s) {
  if (s.phase !== "run" && s.phase !== "failed") return false;
  endRound(s);
  return true;
}

/**
 * QA / capture staging: put a bot where the player is about to meet it.
 * kind "victim": a smaller comet crosses just ahead (the player swallows it);
 * kind "killer": a much bigger comet waits just ahead (the player dies).
 */
export function stageEncounter(s, kind = "victim") {
  const p = s.player;
  if (!p.alive) return null;
  let bot = null;
  for (const sn of s.snakes) if (!sn.isPlayer && (!bot || !sn.alive || sn.mass < bot.mass)) bot = sn;
  if (!bot) return null;
  if (kind !== "killer" && p.head < A.values.base * 4) setPlayerMass(s, p.mass + A.values.base * 4);
  const d = kind === "killer" ? 3.6 : 3.4;
  const x = p.x + Math.cos(p.heading) * d;
  const z = p.z + Math.sin(p.heading) * d;
  // victim: a head one or two steps below the player's; killer: far bigger
  const mass = kind === "killer" ? Math.max(64, p.mass * 8) : p.head / 2 + p.head / 4;
  const side = p.heading + Math.PI / 2;
  spawnSnake(s, bot, mass, x, z, kind === "killer" ? p.heading + Math.PI : side);
  bot.protect = 0;
  bot.ai.next = s.clock + 1.5;          // keep crossing instead of fleeing at once
  bot.ai.mode = "wander";
  bot.ai.tx = kind === "killer" ? p.x : x + Math.cos(side) * 20;
  bot.ai.tz = kind === "killer" ? p.z : z + Math.sin(side) * 20;
  return bot.name;
}

// ------------------------------------------------------------------ step

/** @param {ReturnType<typeof makeInput>} [input] the player's intent this step (ignored outside "run") */
export function step(s, dt, input = NO_INPUT) {
  s.clock += dt;
  const live = s.phase === "run" || s.phase === "failed";
  if (live) s.t += dt;

  for (const sn of s.snakes) copyPrev(sn);
  spawnStep(s, dt);

  // Move: player, then bots (fixed order = deterministic).
  const p = s.player;
  if (p.alive) {
    if (s.phase === "run") moveSnake(s, p, dt, input);
    else idle(s, p, dt);
  }
  for (let i = 1; i < s.snakes.length; i++) {
    const b = s.snakes[i];
    if (!b.alive) {
      b.respawn -= dt;
      if (b.respawn <= 0) respawnBot(s, b, 8);
      continue;
    }
    if (s.clock >= b.ai.next) {
      think(s, b, b.rng);
      // Scheduled on the ideal timeline (not "now + interval"), so decisions happen at the
      // same sim times whatever the step size (CG-GAME-003).
      b.ai.next = Math.max(b.ai.next + A.bots.thinkSec * (0.8 + 0.4 * b.rng.next()), s.clock - A.bots.thinkSec);
    }
    steerBot(s, b, _botIn);
    moveSnake(s, b, dt, _botIn);
  }
  for (const sn of s.snakes) {
    if (!sn.alive) continue;
    if (sn.protect > 0 && !(sn.isPlayer && s.phase !== "run")) sn.protect = Math.max(0, sn.protect - dt);
    if (sn.bounceCd > 0) sn.bounceCd = Math.max(0, sn.bounceCd - dt);
    computeSegments(sn);
  }

  looseStep(s, dt);
  contacts(s);

  if (s.phase === "run") p.peakMass = Math.max(p.peakMass, p.mass);
  if (s.phase === "failed" && A.round.mode === "timed" && !s.holdRespawn) {
    s.respawnIn -= dt;
    if (s.respawnIn <= 0) respawn(s);
  }
  if (s.phase === "run" || s.phase === "failed") {
    const r = A.round;
    if ((r.mode === "timed" && s.t >= r.durationSec) || (r.mode === "target" && s.phase === "run" && p.head >= s.winValue)) endRound(s);
  }
}

function endRound(s) {
  const p = s.player;
  if (!p.alive && s.phase === "failed" && A.round.mode === "timed") {
    // Dead at the whistle: the pending respawn still counts (the starter chain), quietly.
    const at = safeSpot(s, 10, 0.3);
    spawnSnake(s, p, s.startMass, at.x, at.z, 0);
  }
  s.phase = "won";
  s.holdRespawn = false;
  s.finalRank = playerRank(s).rank;
  s.events.push({ type: "won", mass: p.mass, head: p.head, rank: s.finalRank });
}

// ------------------------------------------------------------------ comets

function recount(sn) {
  let m = 0;
  for (let i = 0; i < sn.n; i++) m += sn.chain[i];
  sn.mass = m;
  sn.head = sn.n ? sn.chain[0] : 0;
}

function copyPrev(sn) {
  sn.prevX = sn.x;
  sn.prevZ = sn.z;
  sn.prevHeading = sn.heading;
  sn.prevN = sn.n;
  sn.prevSegX.set(sn.segX);
  sn.prevSegZ.set(sn.segZ);
  sn.prevSegYaw.set(sn.segYaw);
}

function spawnSnake(s, sn, mass, x, z, heading) {
  sn.alive = true;
  sn.n = massToChain(Math.max(A.values.base, mass), sn.chain);
  recount(sn);
  sn.peakMass = sn.mass;
  sn.x = x; sn.z = z; sn.heading = wrap(heading);
  sn.protect = A.snake.protectSec;
  sn.bounceCd = 0;
  sn.meter = 1; sn.meterDry = false; sn.boosting = false; sn.dropAcc = 0;
  sn.killedBy = -1;
  sn.ai.mode = "wander"; sn.ai.next = s.clock; sn.ai.target = -1; sn.ai.boost = false;
  // A straight path behind the comet, long enough for the whole chain.
  const st = A.snake.pathStep;
  const cnt = Math.min(PATH_CAP, Math.ceil((sn.n + 2) * A.values.sizeMax * A.blocks.spacing / st) + 2);
  const c = Math.cos(sn.heading), sn_ = Math.sin(sn.heading);
  for (let k = 0; k < cnt; k++) {
    const back = (cnt - k) * st;
    sn.path[k * 2] = x - c * back;
    sn.path[k * 2 + 1] = z - sn_ * back;
  }
  sn.pathTop = cnt - 1;
  sn.pathLen = cnt;
  sn.pathAcc = 0;
  computeSegments(sn);
  copyPrev(sn);
  if (sn.isPlayer) return;
}

/** A spot at least `clear` units from every living comet, `margin` (fraction of halfSize) inside the edge. */
function safeSpot(s, clear, margin) {
  const rs = s.rngSpawn;
  const lim = A.arena.halfSize * (1 - margin);
  let bx = 0, bz = 0, bestD = -1;
  for (let k = 0; k < 10; k++) {
    let x = rs.range(-lim, lim), z = rs.range(-lim, lim);
    if (A.arena.shape === "circle") {
      const r = lim * Math.sqrt(rs.next()), a = rs.next() * TAU;
      x = Math.cos(a) * r; z = Math.sin(a) * r;
    }
    let d = Infinity;
    for (const o of s.snakes) if (o.alive) d = Math.min(d, Math.hypot(o.x - x, o.z - z));
    if (d > bestD) { bestD = d; bx = x; bz = z; }
    if (d >= clear) break;
  }
  return { x: bx, z: bz };
}

function respawnBot(s, b, clear) {
  const at = safeSpot(s, clear, 0.2);
  b.tier = s.rngSpawn.pick(A.bots.tiers);
  const cap = capOf(s, b);
  let mass = s.rngSpawn.pick(A.bots.startMass);
  while (mass > A.values.base && headOfMass(mass) > cap) mass = Math.floor(mass / 2);
  spawnSnake(s, b, mass, at.x, at.z, s.rngSpawn.range(-Math.PI, Math.PI));
  s.events.push({ type: "spawn", sid: b.id });
}

function turnRate(sn) {
  const k = clamp((headSize(sn.head) - HEAD0) / Math.max(1e-6, A.comet.sizeMax - HEAD0), 0, 1);
  return A.snake.turnRate + (A.snake.turnRateBig - A.snake.turnRate) * k;
}

function idle(s, p, dt) {
  p.heading = wrap(p.heading + A.snake.idleTurnRate * dt);
  advance(s, p, dt, A.snake.idleSpeed);
}

function moveSnake(s, sn, dt, input) {
  if (input.hasDir && (input.dirX !== 0 || input.dirZ !== 0)) {
    const diff = wrap(Math.atan2(input.dirZ, input.dirX) - sn.heading);
    const max = turnRate(sn) * dt;
    sn.heading = wrap(sn.heading + clamp(diff, -max, max));
  } else if (input.turn) {
    sn.heading = wrap(sn.heading + clamp(input.turn, -1, 1) * A.snake.keyTurnRate * dt);
  }
  boostStep(s, sn, input.boost, dt);
  advance(s, sn, dt, A.snake.speed * (sn.boosting ? A.boost.factor : 1));
}

function boostStep(s, sn, want, dt) {
  const b = A.boost;
  if (b.cost === "dropTail") {
    sn.boosting = !!want && sn.n >= 2;
    if (!sn.boosting) { sn.dropAcc = 0; return; }
    sn.dropAcc += dt;
    if (sn.dropAcc >= b.dropSec) { sn.dropAcc -= b.dropSec; dropTail(s, sn); }
    return;
  }
  if (sn.meterDry && sn.meter >= b.restartAt) sn.meterDry = false;
  sn.boosting = !!want && !sn.meterDry && sn.meter > 0;
  if (sn.boosting) {
    sn.meter -= b.drainPerSec * dt;
    if (sn.meter <= 0) { sn.meter = 0; sn.meterDry = true; }
  } else {
    sn.meter = Math.min(1, sn.meter + b.regenPerSec * dt);
  }
}

function dropTail(s, sn) {
  if (sn.n < 2) return;
  const i = sn.n - 1;
  const v = sn.chain[i];
  const back = sn.segYaw[i] + Math.PI;
  spawnLoose(s, sn.segX[i] + Math.cos(back) * 0.8, sn.segZ[i] + Math.sin(back) * 0.8, v, Math.cos(back) * 2, Math.sin(back) * 2);
  sn.n--;
  recount(sn);
  s.events.push({ type: "boostDrop", sid: sn.id, value: v });
}

/** Move the comet forward, keep it inside the arena, record its path. */
function advance(s, sn, dt, speed) {
  const x0 = sn.x, z0 = sn.z;
  sn.x += Math.cos(sn.heading) * speed * dt;
  sn.z += Math.sin(sn.heading) * speed * dt;
  if (wall(s, sn)) return;
  const dx = sn.x - x0, dz = sn.z - z0;
  const d = Math.hypot(dx, dz);
  if (d <= 1e-9) return;
  const ux = dx / d, uz = dz / d;
  const st = A.snake.pathStep;
  let fx = x0, fz = z0, remain = d;
  while (sn.pathAcc + remain >= st) {
    const use = st - sn.pathAcc;
    fx += ux * use; fz += uz * use;
    remain -= use;
    sn.pathAcc = 0;
    sn.pathTop = (sn.pathTop + 1) % PATH_CAP;
    sn.path[sn.pathTop * 2] = fx;
    sn.path[sn.pathTop * 2 + 1] = fz;
    if (sn.pathLen < PATH_CAP) sn.pathLen++;
  }
  sn.pathAcc += remain;
}

/** Returns true when the edge killed the comet. */
function wall(s, sn) {
  const ar = A.arena;
  const lim = ar.halfSize - ar.wallMargin - headSize(sn.head) / 2;
  let dx = Math.cos(sn.heading), dz = Math.sin(sn.heading);
  let hit = false;
  if (ar.shape === "circle") {
    const r = Math.hypot(sn.x, sn.z);
    if (r > lim) {
      hit = true;
      const nx = sn.x / r, nz = sn.z / r;
      sn.x = nx * lim; sn.z = nz * lim;
      const out = dx * nx + dz * nz;
      if (out > 0) { dx -= out * nx; dz -= out * nz; }
      if (Math.hypot(dx, dz) < 1e-3) { dx = -nz; dz = nx; }
    }
  } else {
    if (sn.x > lim) { sn.x = lim; hit = true; if (dx > 0) dx = 0; }
    else if (sn.x < -lim) { sn.x = -lim; hit = true; if (dx < 0) dx = 0; }
    if (sn.z > lim) { sn.z = lim; hit = true; if (dz > 0) dz = 0; }
    else if (sn.z < -lim) { sn.z = -lim; hit = true; if (dz < 0) dz = 0; }
    if (hit && Math.abs(dx) + Math.abs(dz) < 1e-3) { dx = -Math.sign(sn.x) || 1; dz = 0; }
  }
  if (!hit) return false;
  if (ar.wall === "kill" && collidable(s, sn)) { kill(s, sn, null, "wall"); return true; }
  // Slide along the edge at full speed.
  sn.heading = Math.atan2(dz, dx);
  return false;
}

/** Place every planet along the comet's recorded path at fixed arc spacing behind it. */
function computeSegments(sn) {
  const sp = A.blocks.spacing;
  const n = sn.n;
  if (n === 0) { sn.len = 0; return; }
  let curX = sn.x, curZ = sn.z, walked = 0, want = 0, k = 0;
  let lastDX = -Math.cos(sn.heading), lastDZ = -Math.sin(sn.heading);
  let prevSize = headSize(sn.head);
  let px0 = sn.x, pz0 = sn.z;
  for (let i = 0; i < n; i++) {
    const size = blockSize(sn.chain[i]);
    want += (prevSize + size) * 0.5 * sp;
    prevSize = size;
    let x = 0, z = 0;
    for (;;) {
      if (k >= sn.pathLen) {          // ran past the recorded path: continue straight back
        const rest = want - walked;
        x = curX + lastDX * rest;
        z = curZ + lastDZ * rest;
        curX = x; curZ = z; walked = want;
        break;
      }
      const idx = ((sn.pathTop - k + PATH_CAP) % PATH_CAP) * 2;
      const px = sn.path[idx], pz = sn.path[idx + 1];
      const ex = px - curX, ez = pz - curZ;
      const L = Math.hypot(ex, ez);
      if (L > 1e-6) { lastDX = ex / L; lastDZ = ez / L; }
      if (walked + L >= want) {
        const t = L > 1e-6 ? (want - walked) / L : 0;
        x = curX + ex * t;
        z = curZ + ez * t;
        curX = x; curZ = z; walked = want;
        break;
      }
      walked += L;
      curX = px; curZ = pz;
      k++;
    }
    sn.segX[i] = x;
    sn.segZ[i] = z;
    sn.segYaw[i] = Math.atan2(pz0 - z, px0 - x);
    px0 = x; pz0 = z;
  }
  sn.len = want;
}

// ------------------------------------------------------------------ pickups

function spawnLoose(s, x, z, v, vx = 0, vz = 0, gold = 0) {
  const L = s.loose;
  for (let k = 0; k < L.cap; k++) {
    const i = (L.cursor + k) % L.cap;
    if (L.alive[i]) continue;
    L.cursor = (i + 1) % L.cap;
    L.alive[i] = 1;
    L.x[i] = L.px[i] = x;
    L.z[i] = L.pz[i] = z;
    L.vx[i] = vx;
    L.vz[i] = vz;
    L.v[i] = v;
    L.gold[i] = gold;
    L.age[i] = 0;
    L.count++;
    return i;
  }
  return -1;
}

function pickValue(rs) {
  const w = A.loose.weights;
  let total = 0;
  for (const [, p] of w) total += p;
  let r = rs.next() * total;
  for (const [v, p] of w) { if ((r -= p) <= 0) return v; }
  return w[0][0];
}

/** Fresh stardust; in the round's finale it is golden and worth finaleFactor times more. */
function freshValue(s, out) {
  const v = pickValue(s.rngSpawn);
  const gold = inFinale(s) ? 1 : 0;
  out.gold = gold;
  return gold ? v * A.round.finaleFactor : v;
}
const _fresh = { gold: 0 };

function spawnFresh(s) {
  const rs = s.rngSpawn;
  const lim = A.arena.halfSize - 1.5;
  const v = freshValue(s, _fresh);
  let x = 0, z = 0;
  for (let tries = 0; tries < 4; tries++) {
    if (A.arena.shape === "circle") {
      const r = lim * Math.sqrt(rs.next()), a = rs.next() * TAU;
      x = Math.cos(a) * r; z = Math.sin(a) * r;
    } else {
      x = rs.range(-lim, lim); z = rs.range(-lim, lim);
    }
    let ok = true;
    for (const sn of s.snakes) {
      if (sn.alive && (sn.x - x) ** 2 + (sn.z - z) ** 2 < A.loose.minDistFromHead ** 2) { ok = false; break; }
    }
    if (ok) break;
  }
  return spawnLoose(s, x, z, v, 0, 0, _fresh.gold);
}

/** Food floor around the player (ARENA.loose.near*): top up a ring just off the comet. */
function nearStep(s) {
  const p = s.player;
  const lo = A.loose;
  if (!p.alive || !lo.nearMin || s.loose.count >= s.loose.cap - 8) return;
  const L = s.loose;
  const r2 = lo.nearRadius * lo.nearRadius;
  let n = 0;
  for (let i = 0; i < L.cap && n < lo.nearMin; i++) {
    if (L.alive[i] && (L.x[i] - p.x) ** 2 + (L.z[i] - p.z) ** 2 < r2) n++;
  }
  if (n >= lo.nearMin) return;
  const rs = s.rngSpawn;
  const lim = A.arena.halfSize - 1.5;
  const a = rs.next() * TAU;
  const d = lo.nearInner + (lo.nearRadius - lo.nearInner) * rs.next();
  let x = clamp(p.x + Math.cos(a) * d, -lim, lim), z = clamp(p.z + Math.sin(a) * d, -lim, lim);
  if (A.arena.shape === "circle") { const r = Math.hypot(x, z); if (r > lim) { x *= lim / r; z *= lim / r; } }
  const v = freshValue(s, _fresh);
  spawnLoose(s, x, z, v, 0, 0, _fresh.gold);
}

function spawnStep(s, dt) {
  s.nearAcc += dt;
  if (s.nearAcc >= 0.25) { s.nearAcc -= 0.25; nearStep(s); }
  if (s.loose.count >= s.looseTarget) { s.spawnAcc = 0; return; }
  s.spawnAcc += A.loose.spawnPerSec * dt;
  while (s.spawnAcc >= 1 && s.loose.count < s.looseTarget) {
    s.spawnAcc -= 1;
    if (spawnFresh(s) < 0) break;
  }
}

function looseStep(s, dt) {
  const L = s.loose;
  const lim = A.arena.halfSize - A.arena.wallMargin - 0.5;
  const decay = Math.exp(-A.contact.dropDamping * dt);
  const mag = A.snake.magnetRadius;
  const reach = A.snake.eatReach;
  for (let i = 0; i < L.cap; i++) {
    if (!L.alive[i]) continue;
    L.px[i] = L.x[i];
    L.pz[i] = L.z[i];
    L.age[i] += dt;
    if (L.vx[i] !== 0 || L.vz[i] !== 0) {
      L.x[i] = clamp(L.x[i] + L.vx[i] * dt, -lim, lim);
      L.z[i] = clamp(L.z[i] + L.vz[i] * dt, -lim, lim);
      if (A.arena.shape === "circle") {
        const r = Math.hypot(L.x[i], L.z[i]);
        if (r > lim) { L.x[i] *= lim / r; L.z[i] *= lim / r; }
      }
      L.vx[i] *= decay;
      L.vz[i] *= decay;
      if (L.vx[i] * L.vx[i] + L.vz[i] * L.vz[i] < 1e-4) { L.vx[i] = 0; L.vz[i] = 0; }
    }
    const v = L.v[i];
    const ls = looseSize(v, L.gold[i]);
    let best = null, bd2 = Infinity, bhs = 0, swept2 = Infinity;
    for (const sn of s.snakes) {
      if (!sn.alive) continue;
      const hs = headSize(sn.head);
      const r = hs * 0.5 + mag + ls * 0.5;
      const dx = sn.x - L.x[i], dz = sn.z - L.z[i];
      const d2 = dx * dx + dz * dz;
      if (d2 < r * r && d2 < bd2 && canEat(s, sn, v)) {
        best = sn; bd2 = d2; bhs = hs;
        // Swept test along this step's movement, so a pickup grazed between two steps still counts
        // (the outcome must not depend on the step size, CG-GAME-003).
        const mx = sn.x - sn.prevX, mz = sn.z - sn.prevZ;
        const m2 = mx * mx + mz * mz;
        const t = m2 > 1e-9 ? clamp(((L.x[i] - sn.prevX) * mx + (L.z[i] - sn.prevZ) * mz) / m2, 0, 1) : 1;
        swept2 = (sn.prevX + mx * t - L.x[i]) ** 2 + (sn.prevZ + mz * t - L.z[i]) ** 2;
      }
    }
    if (!best) continue;
    const eatR = (bhs + ls) * 0.5 * reach;
    if (swept2 <= eatR * eatR) { eat(s, best, i); continue; }
    const d = Math.sqrt(bd2);
    const k = Math.min(d, A.snake.magnetSpeed * dt) / d;
    L.x[i] += (best.x - L.x[i]) * k;
    L.z[i] += (best.z - L.z[i]) * k;
  }
}

function eat(s, sn, i) {
  const L = s.loose;
  const v = L.v[i];
  L.alive[i] = 0;
  L.count--;
  const merges = s.merges;
  sn.n = insertAndMerge(sn.chain, sn.n, v, merges);
  recount(sn);
  computeSegments(sn);
  s.events.push({ type: "eat", sid: sn.id, value: v, gold: L.gold[i], x: L.x[i], z: L.z[i] });
  for (let m = 0; m < merges.length; m += 2) {
    s.events.push({ type: "merge", sid: sn.id, value: merges[m], index: merges[m + 1], step: m / 2 + 1 });
  }
}

// ------------------------------------------------------------------ contacts

function contacts(s) {
  const reach = A.contact.reach;
  const headOnly = A.contact.rule === "headVsHead";
  for (const a of s.snakes) {
    if (!collidable(s, a)) continue;
    const ha = headSize(a.head);
    for (const b of s.snakes) {
      if (b === a || !collidable(s, b)) continue;
      const broad = b.len + ha + A.values.sizeMax;
      if ((a.x - b.x) ** 2 + (a.z - b.z) ** 2 > broad * broad) continue;
      // comet vs comet
      const rh = (ha + headSize(b.head)) * 0.5 * reach;
      if ((a.x - b.x) ** 2 + (a.z - b.z) ** 2 < rh * rh) { resolve(s, a, b, -1); if (!a.alive) break; continue; }
      if (headOnly) continue;
      for (let j = 0; j < b.n; j++) {
        const r = (ha + blockSize(b.chain[j])) * 0.5 * reach;
        const dx = a.x - b.segX[j], dz = a.z - b.segZ[j];
        if (dx * dx + dz * dz >= r * r) continue;
        resolve(s, a, b, j);
        break;
      }
      if (!a.alive) break;
    }
  }
}

/** j = -1: comet touched comet; j >= 0: comet touched planet j of b. */
function resolve(s, a, b, j) {
  if (a.head > b.head) return kill(s, b, a, "eaten");
  if (a.head < b.head) return kill(s, a, b, "eaten");
  if (A.contact.equal !== "bounce" || a.bounceCd > 0) return;
  const bx = j < 0 ? b.x : b.segX[j], bz = j < 0 ? b.z : b.segZ[j];
  const ang = Math.atan2(a.z - bz, a.x - bx);
  a.heading = ang;
  a.bounceCd = A.contact.bounceCooldown;
  if (j < 0 && b.bounceCd <= 0) { b.heading = wrap(ang + Math.PI); b.bounceCd = A.contact.bounceCooldown; }
  if (a.isPlayer || b.isPlayer) s.events.push({ type: "bounce", a: a.id, b: b.id, x: a.x, z: a.z });
}

/** The victim's planets scatter as pickups; a dead comet respawns later. */
export function kill(s, victim, killer, cause) {
  if (!victim.alive) return;
  victim.alive = false;
  victim.killedBy = killer ? killer.id : -1;
  victim.deaths++;
  const rs = s.rngSpawn;
  const sc = A.contact.dropScatter;
  for (let j = 0; j < victim.n; j++) {
    const a = rs.range(-Math.PI, Math.PI);
    const sp = sc * (0.5 + 0.5 * rs.next());
    spawnLoose(s, victim.segX[j], victim.segZ[j], victim.chain[j], Math.cos(a) * sp, Math.sin(a) * sp);
  }
  if (killer) killer.kills++;
  s.events.push({
    type: "kill", killer: killer ? killer.id : -1, victim: victim.id, value: victim.head, mass: victim.mass,
    x: victim.x, z: victim.z, cause,
  });
  if (victim.isPlayer) {
    s.deathMass = victim.mass;
    s.deathHead = victim.head;
    s.deathBy = killer ? killer.name : null;
    s.phase = "failed";
    s.respawnIn = A.round.respawnSec;
    s.events.push({ type: "failed", cause, by: s.deathBy, mass: victim.mass });
  } else {
    victim.respawn = A.bots.respawnSec;
  }
  victim.n = 0;
  victim.mass = 0;
  victim.head = 0;
}
