/**
 * Game identity and tuning. Everything a designer tweaks lives here.
 *
 * WP-10: merge-snake arena core with the owner's twist R1 "Comet Chain" (docs/CONCEPTS.md):
 * a comet drags a chain of planets; 90 s rounds with 2 s respawns and a rank payout.
 * Values, merge ladder, sizes, arena, contact and round rules are read from ARENA; colours,
 * rings and glows per planet from src/render/palette.js - never hard-coded in game code.
 */

export const GAME = {
  slug: "cg-game",
  title: "Comet Chain",        // working title (owner, 2026-09-26)
  saveVersion: 1,
  // CrazyGames midgame guidance: wait until the tutorial is done / level 3-4
  // before the first midgame ad. Not a cooldown - the SDK paces the rest.
  // "Level" = round number: it goes up after every finished round.
  firstMidgameLevel: 3,
  // Endless level game: this arena counts as 100% for reportGameCompletedPercentage.
  completionLevel: 12,
};

/**
 * Rewarded offers (skill: references/crazygames/monetization-playbook.md, "Ad-view
 * maximisation"). More ad views come from more WANTED offers at the right moments,
 * each with a real cap - never from pressure. Rules live in src/game/offers.js.
 */
export const OFFERS = {
  // Revive: CrazyGames guidance "at most once per session" (CG-ADS-014), and only
  // for runs worth continuing. The ring countdown EXPIRES the offer at 0 - it never accepts.
  revivesPerSession: 1,
  reviveMinProgress: 1 / 3,   // progress = round time / duration: 30 s of a 90 s round
  reviveCountdownSec: 6,
  // "Start x2" on the ready screen: one round that starts with twice the starter chain.
  boostAfterRuns: 2,          // not in the first runs - let the player learn the game first
  boostCooldownSec: 120,
  boostFactor: 2,
  // "FREE" upgrade card, only while the upgrade is not affordable (CG-ADS-011/012).
  freeUpgradeCooldownSec: 180,
  // Shop: "+coins" while the next skin is not affordable, with a visible cooldown timer.
  cashCooldownSec: 180,
  cashShare: 0.25,            // one video = ~25% of the next unlock (Slice Master: $1.2k of $5k)
  // Never more video buttons than this on one screen: more offers per SESSION, not per screen.
  maxVideoOffersPerScreen: 2,
};

/**
 * The arena ("Comet Chain", concept R1 in docs/CONCEPTS.md). Units: world units, seconds,
 * radians. Rates are per second and multiplied by dt in the simulation (CG-GAME-003).
 * Colours, rings and glows per ladder step live in src/render/palette.js (PLANETS).
 */
export const ARENA = {
  arena: {
    shape: "circle",          // "circle" | "square"
    halfSize: 40,             // circle: the radius; square: half the side
    wall: "block",            // "block": comets slide along the edge | "kill": touching it is a death
    wallMargin: 0.6,          // how far inside the edge a comet centre is kept
  },

  // Value ladder: base, base*2, base*4 ... Equal neighbours fuse into one of double value.
  // The chain is kept sorted, biggest planet right behind the comet, so a chain is the binary
  // form of its total. One ladder entry per step: `key` names the planet (palette + i18n),
  // `size` is its diameter in world units (drawing AND collision). Steps past the end grow by
  // sizeAfter per step up to sizeMax.
  values: {
    base: 2,
    maxChain: 32,
    ladder: [
      { key: "pebble", size: 0.72 },      // 2
      { key: "moon", size: 0.86 },        // 4
      { key: "ice", size: 1.0 },          // 8
      { key: "desert", size: 1.12 },      // 16
      { key: "ocean", size: 1.24 },       // 32
      { key: "ringed", size: 1.36 },      // 64   torus ring
      { key: "sun", size: 1.5 },          // 128  glow
      { key: "bluegiant", size: 1.62 },   // 256  glow
      { key: "redgiant", size: 1.74 },    // 512  glow
      { key: "pulsar", size: 1.84 },      // 1024 ring + glow
      { key: "blackhole", size: 1.94 },   // 2048 ring + glow
      { key: "quasar", size: 2.04 },      // 4096 ring + glow
    ],
    sizeAfter: 0.08,
    sizeMax: 2.3,
  },

  // The comet leads its chain; its size follows the head value (the biggest planet it carries).
  comet: {
    size: 1.05,               // diameter with a pebble-headed chain
    sizePerLevel: 0.07,
    sizeMax: 2.0,
  },

  // Loose pickups: fresh spawns are stardust (small), dropped planets keep their size.
  blocks: {
    stardustSize: 0.55,       // diameter of a loose value-2/4 pickup
    looseScale: 0.8,          // a dropped planet is drawn and collides this much smaller
    spacing: 1.02,            // centre distance along a chain = mean diameter x this
  },

  snake: {
    speed: 6.8,               // u/s
    turnRate: 3.8,            // rad/s max heading change for a small head (mouse / touch target)
    turnRateBig: 2.6,         // rad/s at comet.sizeMax (big comets turn wider)
    keyTurnRate: 3.4,         // rad/s with A/D or the arrow keys
    idleTurnRate: 0.9,        // rad/s: the ready-screen comet circles on the spot
    idleSpeed: 2.6,
    startMass: 14,            // the starter chain: 8-4-2 (fresh round and every respawn)
    protectSec: 2,            // spawn / respawn protection: cannot kill or be killed, blinks
    eatReach: 0.95,           // a pickup is eaten within (comet + pickup) / 2 x this
    magnetRadius: 1.7,        // pickups this far beyond the comet's edge slide into it
    magnetSpeed: 8,           // u/s
    pathStep: 0.2,            // the comet's path is recorded every this many units (the chain follows it)
  },

  boost: {
    factor: 1.6,              // speed multiplier while boosting
    cost: "meter",            // "meter": a bar drains while boosting and refills | "dropTail": sheds the smallest planet every dropSec
    drainPerSec: 0.42,        // full bar = ~2.4 s of boost
    regenPerSec: 0.16,        // empty -> full in ~6 s
    restartAt: 0.2,           // after running dry, boost works again from this level
    dropSec: 0.8,
  },

  contact: {
    // "headVsAny": a comet touching ANY part of another chain compares the two HEAD values
    //              (biggest planets) - bigger swallows, the loser's planets scatter as pickups.
    // "headVsHead": only comet-to-comet touches count; comets pass through chains.
    rule: "headVsAny",
    equal: "bounce",          // equal heads: "bounce" (both turn away) | "none" (pass through)
    reach: 0.82,              // contact when centre distance < (a + b) / 2 x this
    bounceCooldown: 0.5,
    dropScatter: 3.4,         // u/s: a dead chain's planets scatter outward
    dropDamping: 3.2,         // 1/s: the scatter slows with exp(-k*dt)
  },

  loose: {
    target: 230,              // pickups the spawner keeps on the floor
    spawnPerSec: 30,          // refill rate
    capacity: 720,            // pool size; dropped planets fit on top of the target
    weights: [[2, 0.85], [4, 0.15]],   // [value, weight] for fresh stardust
    minDistFromHead: 2.5,     // no spawn right under a comet
    // Food floor around the player: when fewer than nearMin pickups lie within nearRadius,
    // fresh stardust spawns in a ring nearInner..nearRadius away (a reward in reach every second).
    nearRadius: 13,
    nearInner: 7,
    nearMin: 14,
  },

  bots: {
    count: 11,
    prefix: "",               // the mode is labelled "Offline Arena" (HUD, home, leaderboard, result); names stay plain
    names: ["Kiwi", "Mango", "Plum", "Pixel", "Fizz", "Taco", "Blip", "Olive", "Zest", "Mochi", "Rusty", "Juno", "Biscuit", "Noodle", "Pepper"],
    respawnSec: 2,
    startMass: [6, 10, 14, 22, 30],   // picked at random, never above the bot's cap
    thinkSec: 0.22,           // decision interval (sim time); steering in between is continuous
    seekRadius: 14,
    fleeRadius: 6,
    chaseRadius: 10,
    aggression: 0.45,         // chance a bot chases a smaller head it sees (round 1)
    aggressionPerLevel: 0.05,
    boostWhenClose: 3.2,      // flee/chase boost distance
    // Difficulty ramp: arena cap = min(capMax, max(capStart * 2^(t/capDoubleSec), playerHead * capVsPlayer));
    // each spawn draws a tier (its share of the cap), so there are always small comets to eat and a few big threats.
    capStart: 8,
    capDoubleSec: 30,
    capVsPlayer: 2,
    capMax: 8192,
    tiers: [0.125, 0.25, 0.25, 0.5, 0.5, 1],
  },

  round: {
    mode: "timed",            // "timed": the round ends after durationSec, rank = chain total | "target": reach winValue | "endless"
    durationSec: 90,
    respawnSec: 2,            // a death respawns the player with the starter chain after this long (timed mode)
    finaleSec: 15,            // the last seconds spawn golden stardust...
    finaleFactor: 2,          // ...worth this many times more
    winValue: 1024,           // "target" mode only; x winValueGrowth per round
    winValueGrowth: 2,
    winValueMax: 65536,
  },

  rewards: {
    // Coins at the end of a round = chain total / scorePerCoin x the rank's multiplier (skill-based, never random).
    scorePerCoin: 8,
    rankMultipliers: [[1, 5], [3, 3], [6, 2], [99, 1]],   // [up to rank, x]: #1 x5, #2-3 x3, #4-6 x2, rest x1
    minCoins: 5,
  },

  camera: {
    pitchDeg: 60,             // 90 = straight down
    halfWidth: 12.5,          // visible ground half-width at the head (landscape) for a small chain
    halfWidthPortrait: 7.6,   // portrait keeps planets large; the tall screen shows more ahead
    zoomPerLevel: 0.045,      // + per doubling of the head value
    zoomMax: 1.6,
    follow: 6,                // 1/s exponential follow
    lookAhead: 1.2,           // units ahead of the comet
  },
};
