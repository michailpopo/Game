/**
 * Game identity and tuning. Everything a designer tweaks lives here.
 *
 * WP-10: merge-snake arena core (grey-box, theme-neutral). The designer's twist
 * (theme, round structure, one rule change) is meant to land by editing ARENA and
 * src/render/palette.js - values, merge ladder, colours per value, block shape,
 * arena size, contact and round rules are all read from here, never hard-coded.
 */

export const GAME = {
  slug: "cg-game",
  title: "Merge Arena",        // placeholder wordmark until the designer names the game
  saveVersion: 1,
  // CrazyGames midgame guidance: wait until the tutorial is done / level 3-4
  // before the first midgame ad. Not a cooldown - the SDK paces the rest.
  // "Level" = arena number: it goes up each time the player reaches the arena's target value.
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
  reviveMinProgress: 0.2,
  reviveCountdownSec: 6,
  // "Start x2" on the ready screen: one run that starts with twice the start mass.
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
 * The arena. Units: world units (a 2-block is 1 unit wide), seconds, radians.
 * Rates are per second and multiplied by dt in the simulation (CG-GAME-003).
 */
export const ARENA = {
  arena: {
    shape: "square",          // "square" | "circle"
    halfSize: 40,             // square: half the side; circle: the radius
    wall: "block",            // "block": heads slide along the wall | "kill": touching the wall ends the run
    wallMargin: 0.6,          // how far inside the wall a head centre is kept
    gridStep: 2,              // floor dot grid spacing (presentation)
  },

  // Value ladder: base, base*2, base*4 ... Equal neighbours merge into one of double value.
  // The chain is kept sorted, biggest at the head, so a chain is the binary form of its mass.
  values: {
    base: 2,
    maxChain: 32,             // blocks one snake can carry (a mass of 2^33 - far beyond play)
  },

  // Block shape and size (the look lives in palette.js: colours per value, label style).
  blocks: {
    size: 1.0,                // edge of the smallest block
    sizePerLevel: 0.08,       // + per doubling
    sizeMax: 2.3,
    looseScale: 0.84,         // loose blocks are drawn and collide a little smaller
    spacing: 1.04,            // centre distance along a chain = mean edge x this
  },

  snake: {
    speed: 6.8,               // u/s
    turnRate: 3.8,            // rad/s max heading change for a small head (mouse / touch target)
    turnRateBig: 2.6,         // rad/s at blocks.sizeMax (big snakes turn wider)
    keyTurnRate: 3.4,         // rad/s with A/D or the arrow keys
    idleTurnRate: 0.9,        // rad/s: the ready-screen snake circles on the spot
    idleSpeed: 2.6,
    startMass: 6,             // a fresh player chain: [4, 2]
    protectSec: 2,            // spawn / revive protection: cannot kill or be killed, blinks
    eatReach: 0.95,           // a loose block is eaten within (head + block) / 2 x this
    magnetRadius: 1.7,        // loose blocks this far beyond the head's edge slide into it
    magnetSpeed: 8,           // u/s
    pathStep: 0.2,            // head path is recorded every this many units (chain follows it)
  },

  boost: {
    factor: 1.6,              // speed multiplier while boosting
    cost: "meter",            // "meter": a bar drains while boosting and refills | "dropTail": sheds the smallest block every dropSec
    drainPerSec: 0.42,        // full bar = ~2.4 s of boost
    regenPerSec: 0.16,        // empty -> full in ~6 s
    restartAt: 0.2,           // after running dry, boost works again from this level
    dropSec: 0.8,
  },

  contact: {
    // "headVsAny": a head touching ANY block of another snake compares the two HEAD values -
    //              bigger head eats (the loser's chain drops as loose blocks), smaller dies.
    // "headVsHead": only head-to-head touches count; heads pass through bodies.
    rule: "headVsAny",
    equal: "bounce",          // equal heads: "bounce" (both turn away) | "none" (pass through)
    reach: 0.82,              // contact when centre distance < (a + b) / 2 x this
    bounceCooldown: 0.5,
    dropScatter: 3.4,         // u/s: a dead snake's blocks scatter outward
    dropDamping: 3.2,         // 1/s: the scatter slows with exp(-k*dt)
  },

  loose: {
    target: 220,              // loose blocks the spawner keeps on the floor
    spawnPerSec: 30,          // refill rate
    capacity: 720,            // pool size; drops from dead snakes fit on top of the target
    weights: [[2, 0.8], [4, 0.16], [8, 0.04]],   // [value, weight] for fresh spawns
    minDistFromHead: 2.5,     // no spawn right under a head
    // Food floor around the player: when fewer than nearMin loose blocks lie within nearRadius of
    // the player's head, fresh blocks spawn in a ring nearInner..nearRadius away (keeps a reward
    // in reach every second, hypercasual-hits.md rule 2).
    nearRadius: 13,
    nearInner: 7,
    nearMin: 14,
  },

  bots: {
    count: 12,
    prefix: "Bot",            // shown in every name: bots are never presented as real players
    names: ["Kiwi", "Mango", "Plum", "Pixel", "Nova", "Fizz", "Taco", "Blip", "Olive", "Zest", "Pebble", "Comet", "Mochi", "Rusty", "Juno"],
    respawnSec: 2.5,
    startMass: [6, 10, 14, 22, 30],   // picked at random, never above the current cap
    thinkSec: 0.22,           // decision interval (sim time); steering in between is continuous
    seekRadius: 14,
    fleeRadius: 6,
    chaseRadius: 10,
    aggression: 0.45,         // chance a bot chases a smaller head it sees (arena 1)
    aggressionPerLevel: 0.07,
    boostWhenClose: 3.2,      // flee/chase boost distance
    // Each spawn draws a tier: the bot's own cap is this fraction of the arena cap (on the ladder),
    // so the field always has small fry to eat and a few big threats.
    tiers: [0.125, 0.25, 0.25, 0.5, 0.5, 1],
    // Difficulty ramp: a bot's head never exceeds cap = min(capMax, max(capStart * 2^(t/capDoubleSec), playerHead * capVsPlayer)).
    capStart: 8,
    capDoubleSec: 50,
    capVsPlayer: 2,
    capMax: 8192,
  },

  round: {
    mode: "target",           // "target": reach the arena's target value -> won | "timed": survive durationSec | "endless": until death
    winValue: 1024,           // arena 1 target; x winValueGrowth per arena
    winValueGrowth: 2,
    winValueMax: 65536,
    durationSec: 180,
  },

  rewards: {
    coinsPerScore: 0.12,      // coins = (peak score x this + kills x coinsPerKill) x income upgrade
    coinsPerKill: 4,
    winBonusBase: 20,         // + (base + arena x perLevel) when the arena target is reached
    winBonusPerLevel: 7,
  },

  camera: {
    pitchDeg: 60,             // 90 = straight down
    halfWidth: 12.5,          // visible ground half-width at the head (landscape) for a small snake
    halfWidthPortrait: 7.6,   // portrait keeps blocks large; the tall screen shows more ahead
    zoomPerLevel: 0.045,      // + per doubling of the head value
    zoomMax: 1.6,
    follow: 6,                // 1/s exponential follow
    lookAhead: 1.2,           // units ahead of the head
  },
};
