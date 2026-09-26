/**
 * Game identity and tuning. Everything a designer tweaks lives here.
 *
 * WP-30: Volt City (docs/CONCEPTS.md "T1 - Volt City"): hold to charge a storm cloud, release a
 * lightning strike that hops from rooftop antenna to rooftop antenna across a dark 3D city,
 * forking as it goes; every building it touches lights up and pays. Power the city for the
 * jackpot. All rules and numbers live in VOLT (the brief's final values drop in here).
 */

export const GAME = {
  slug: "cg-game",
  title: "Volt City",          // owner, 2026-09-26
  saveVersion: 1,
  // CrazyGames midgame guidance: wait until the tutorial is done. "Level" = city number;
  // the midgame is requested on "Next city" from this level on (the SDK paces the rest).
  firstMidgameLevel: 4,
};

/**
 * Rewarded offers (skill: references/crazygames/monetization-playbook.md, "Ad-view
 * maximisation"). More ad views come from more WANTED offers at the right moments,
 * each with a real cap - never from pressure. Rules live in src/game/offers.js.
 * (The full Volt City offer set is WP-32; these keep the template's surfaces working.)
 */
export const OFFERS = {
  // "One more strike" (the revive analogue): the run ended close to FULL POWER. Once per session;
  // the ring countdown REMOVES the offer at 0 - it never accepts it.
  revivesPerSession: 1,
  reviveMinProgress: 0.85,    // progress = share of the city powered
  reviveCountdownSec: 5,
  // "Supercharged start" on the ready screen: +boostStrikes strikes for one city.
  boostAfterRuns: 2,          // hidden in the first runs
  boostCooldownSec: 120,
  boostStrikes: 2,
  // "FREE" upgrade card, only while the upgrade is not affordable (CG-ADS-011/012).
  freeUpgradeCooldownSec: 180,
  // Shop: "+coins" while the next bolt skin is not affordable, with a visible cooldown timer.
  cashCooldownSec: 180,
  cashShare: 0.22,
  // Never more video buttons than this on one screen: more offers per SESSION, not per screen.
  maxVideoOffersPerScreen: 2,
};

/**
 * Volt City. Units: world units (a city lot is ~3 u), seconds. Rates are per second and
 * multiplied by dt in the simulation (CG-GAME-003); the cascade runs on exact event times.
 */
export const VOLT = {
  city: {
    // Blocks (= districts) per city grow with the level up to the max; lots per block are rolled.
    blocksX: [3, 6],          // [level 1, max]
    blocksZ: [3, 5],
    blocksPerLevel: 0.25,     // +1 block column every 4 levels, +1 row every 6 (see sim.js cityShape)
    lots: [2, 4],             // lots per block side, rolled per block (min, max)
    lotSize: 3.2,             // lot pitch footprint
    alley: 0.55,              // gap between lots inside a block
    street: 3.2,              // gap between blocks
    parkChance: 0.07,         // an empty lot
    footprint: [0.72, 0.95],  // building width/depth as a share of the lot
    height: [3.2, 12],        // base height range
    downtown: 13,             // extra height at the city centre (falls off to 0 at the edge)
    floor: 0.8,               // heights snap to whole floors
    antenna: 1.4,             // mast height above the roof (the hop points are the mast tips)
    gold: [1, 5],             // gold rods per city: [level 1, max]; +1 every 3 levels
  },
  strike: {
    fillSec: 1.2,             // hold time from 0 to 100% charge
    superLo: 0.8,             // SUPERCHARGE band: full voltage + a guaranteed first fork
    superHi: 0.95,
    overMax: 1.3,             // held this long past full: grounds out automatically
    minShare: 0.3,            // a quick tap still strikes with this share of the voltage
    lateShare: 0.85,          // 95-100%: a little past the sweet spot
    fizzleEnergy: 1,          // > 100%: grounds out into a weak spark
    strikes: 3,               // strikes per city
  },
  chain: {
    voltage: 12,              // hops per bolt at full charge
    fork: 0.12,               // chance per hop that the bolt splits in two (both keep the energy left)
    range: 8.2,               // max hop distance between antenna tips
    verticalWeight: 0.55,     // height differences count this much in the hop distance
    hopMin: 0.14,             // seconds per hop (rolled per hop, seeded)
    hopMax: 0.22,
    maxBolts: 64,             // concurrent bolts cap (forks stop splitting beyond it)
  },
  payout: {
    heightUnit: 3,            // a building pays 1 + floor(height / heightUnit) points ...
    forkDouble: true,         // ... x 2 per fork generation of the bolt that lit it ("+8 +8 +16 +32")
    goldFactor: 10,           // gold rods pay x10 and always fork
    districtBonus: 10,        // "BLOCK POWERED": + this x buildings in the district
    // Jackpot plates by share powered: [at least, multiplier]
    plates: [[1, 10], [0.95, 5], [0.8, 3], [0.6, 2]],
    passAt: 0.6,              // below this the city is not cleared (retry it)
    coinsPerPoint: 0.05,      // coins = points x this x plate multiplier
    minCoins: 3,
  },
  input: {
    crosshairSpeed: 16,       // u/s for the keyboard crosshair
    pickRadiusPx: 90,         // a press this close (screen px) to an antenna aims at it
  },
};
