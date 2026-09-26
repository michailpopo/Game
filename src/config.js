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
 * The arena ("Comet Chain", docs/GAME_BRIEF.md is the source of truth for these numbers).
 * Units: world units, seconds, radians. Rates are per second and multiplied by dt in the
 * simulation (CG-GAME-003). Colours, rings and glows per planet live in src/render/palette.js.
 */
export const ARENA = {
  arena: {
    shape: "circle",          // "circle" | "square"
    halfSize: 40,             // circle: the radius; square: half the side
    wall: "block",            // "block": heads slide along the asteroid belt | "kill": touching it is a death
    wallMargin: 0.6,          // how far inside the edge a head centre is kept
  },

  // Value ladder: base, base*2, base*4 ... Equal neighbours fuse into one of double value.
  // The chain is kept sorted, the biggest planet is the head (it wears the comet coma), so a
  // chain is the binary form of its total. One `ladder` key per step names the world (palette
  // look + i18n name); steps past the table reuse the last key.
  values: {
    base: 2,
    maxChain: 32,
    ladder: ["pebble", "moon", "ice", "desert", "ocean", "jungle", "lava", "ringed", "storm", "sun", "redgiant", "bluegiant", "neutron", "nebula", "galaxy"],
  },

  // Planet size (diameter, world units): size + sizePerLevel x (step - 1), capped. Drawing AND collision.
  blocks: {
    size: 1.0,
    sizePerLevel: 0.08,
    sizeMax: 2.3,
    stardustSize: 0.5,        // fresh stardust (loose) - grows 12% per step (golden finale values)
    looseScale: 0.84,         // a dropped planet is drawn and collides this much smaller
    spacing: 1.02,            // centre distance along a chain = mean diameter x this
  },

  snake: {
    speed: 6.8,               // u/s
    turnRate: 3.8,            // rad/s max heading change for a small head (mouse / touch / keys target)
    turnRateBig: 2.6,         // rad/s at blocks.sizeMax (big heads turn wider)
    idleTurnRate: 0.9,        // rad/s: the ready-screen comet circles on the spot
    idleSpeed: 2.6,
    startMass: 6,             // round start: moon head + pebble ("Start size" upgrade raises it)
    protectSec: 2,            // spawn / respawn protection: cannot eat others or be eaten, blinks
    eatReach: 0.95,           // a pickup is eaten within (head + pickup) / 2 x this
    magnetRadius: 1.7,        // pickups this far beyond the head's edge slide into it
    magnetSpeed: 8,           // u/s
    pathStep: 0.2,            // the head's path is recorded every this many units (the chain follows it)
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
    // "headVsAny": a head touching ANY planet of another chain compares the two HEAD values -
    //              bigger swallows (the loser's planets scatter as pickups), smaller dies.
    // "headVsHead": only head-to-head touches count; heads pass through chains.
    rule: "headVsAny",
    equal: "bounce",          // equal heads: "bounce" (both turn away) | "none" (pass through)
    reach: 0.82,              // contact when centre distance < (a + b) / 2 x this
    bounceCooldown: 0.5,
    dropScatter: 3.4,         // u/s: a dead chain's planets scatter outward
    dropDamping: 3.2,         // 1/s: the scatter slows with exp(-k*dt)
  },

  loose: {
    target: 300,              // pickups the spawner keeps on the floor
    spawnPerSec: 30,          // refill rate
    capacity: 720,            // pool size; dropped planets fit on top of the target
    weights: [[2, 0.85], [4, 0.15]],   // [value, weight] for fresh stardust
    minDistFromHead: 2.5,     // no spawn right under a head
    // Food floor around the player: when fewer than nearMin pickups lie within nearRadius,
    // fresh stardust spawns in a ring nearInner..nearRadius away (a reward in reach every second).
    nearRadius: 13,
    nearInner: 7,
    nearMin: 18,
  },

  bots: {
    count: 12,
    prefix: "",               // the mode is labelled "Offline Arena" wherever names appear; names stay plain
    names: ["Kiwi", "Mango", "Plum", "Pixel", "Fizz", "Taco", "Blip", "Olive", "Zest", "Mochi", "Rusty", "Juno", "Biscuit", "Noodle", "Pepper"],
    respawnSec: 2.5,
    // Arena tier 1-20 (saved; +1 after a top-3 finish, -1 after rank 8 or worse): numeric columns
    // interpolate linearly between rows, startMass uses the row at or below the tier.
    // aggression = aggressionBase + aggressionPerTier x (tier - 1) (chance to chase a smaller head it sees).
    tierTable: [
      { tier: 1, startMass: [6, 10, 14], capStart: 8, capDoubleSec: 60, capVsPlayer: 1.5, thinkSec: 0.30 },
      { tier: 5, startMass: [6, 10, 14, 22, 30], capStart: 8, capDoubleSec: 50, capVsPlayer: 2, thinkSec: 0.24 },
      { tier: 10, startMass: [10, 14, 22, 30, 46], capStart: 16, capDoubleSec: 45, capVsPlayer: 2, thinkSec: 0.20 },
      { tier: 20, startMass: [14, 22, 30, 46, 62], capStart: 32, capDoubleSec: 40, capVsPlayer: 2.5, thinkSec: 0.18 },
    ],
    aggressionBase: 0.30,
    aggressionPerTier: 0.025,
    maxTier: 20,
    capMax: 8192,
    // Each spawn draws a share of the arena cap, so there are always small comets to eat and a few big threats.
    capShares: [0.125, 0.25, 0.25, 0.5, 0.5, 1],
    seekRadius: 14,
    fleeRadius: 6,
    chaseRadius: 10,
    boostWhenClose: 3.2,      // flee/chase boost distance
    chaseMaxSec: 2,           // a hunt that has not paid off by then is dropped...
    chaseRestSec: 3,          // ...for this long (bots and the QA autopilot)
  },

  round: {
    mode: "timed",            // "timed": the round ends after durationSec, rank = chain total | "target": reach winValue | "endless"
    durationSec: 90,
    respawnSec: 2,            // a death respawns the player after this long (timed mode); the clock keeps running
    respawnMass: 14,          // 8-4-2 (or the start mass if the Start size upgrade made it bigger)
    finaleSec: 15,            // the last seconds spawn golden stardust from finaleWeights
    finaleWeights: [[4, 0.6], [8, 0.3], [16, 0.1]],
    winValue: 1024,           // "target" mode only; x winValueGrowth per round
    winValueGrowth: 2,
    winValueMax: 65536,
  },

  rewards: {
    // coins = (chain total at 0:00 / massPerCoin + coinsPerSwallow x swallows) x rank crate (skill-based, never random)
    massPerCoin: 20,
    coinsPerSwallow: 3,
    rankCrates: [[1, 5], [3, 3], [6, 2], [99, 1]],   // [up to rank, x]: #1 x5, #2-3 x3, #4-6 x2, #7-13 x1
    minCoins: 3,
  },

  camera: {
    pitchDeg: 60,             // 90 = straight down
    halfWidth: 12.5,          // visible ground half-width at the head (landscape) for a small chain
    halfWidthPortrait: 7.6,   // portrait keeps planets large; the tall screen shows more ahead
    zoomPerLevel: 0.045,      // + per doubling of the head value
    zoomMax: 1.6,
    follow: 6,                // 1/s exponential follow
    lookAhead: 1.2,           // units ahead of the head
    lookAheadBoost: 2.0,
  },

  controls: {
    cursorRadius: 6,          // the mouse cursor ring is kept within this many units of the head
    deadZone: 0.5,            // closer than this to the head: keep the heading
    joystickRadiusPx: 56,     // touch joystick knob travel
    joystickDeadPx: 8,
    joystickArea: 0.7,        // the first finger opens the joystick on the left 70% of the screen
  },
};
