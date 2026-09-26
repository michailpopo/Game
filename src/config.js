/**
 * Game identity and tuning. Everything a designer tweaks lives here.
 *
 * Storm Grid (docs/GAME_BRIEF.md; concept T1 in docs/CONCEPTS.md): hold to charge a storm, release a
 * lightning strike onto a rooftop antenna of a dark 3D city; the bolt leaps antenna to antenna in 3D,
 * forking as it goes, and every building it touches lights up and pays. Power the city for the jackpot.
 * The numbers below are the brief's (Monte Carlo, 2026-09-26); the view's look values live in
 * src/game/look.js.
 */

export const GAME = {
  slug: "storm-grid",
  title: "Storm Grid",          // owner, 2026-09-26 (the only place the name lives besides i18n/index.html)
  saveVersion: 2,               // 2 = Storm Grid save shape (v1 was Comet Chain: coins + mute are kept)
  // Midgame from this city on, on "Next city" and "Retry" (GAME_BRIEF "Midgame"; the SDK paces the rest).
  firstMidgameLevel: 4,
};

/**
 * Rewarded offers (skill: references/crazygames/monetization-playbook.md, "Ad-view maximisation").
 * More ad views come from more WANTED offers at the right moments, each with a real cap - never
 * from pressure. Rules live in src/game/offers.js. (Try-skin and the daily gift arrive in WP-32.)
 */
export const OFFERS = {
  // "One more strike" (the revive analogue): the last cascade ended 85-99% powered. Once per session;
  // the ring countdown REMOVES the offer at 0 - it never accepts it. The strike is an auto-SUPERCHARGE.
  revivesPerSession: 1,
  reviveMinProgress: 0.85,      // progress = share of the city powered (offered only below 1.0)
  reviveCountdownSec: 5,
  // "Supercharged start" on the city intro: +boostStrikes strikes for this city.
  boostAfterRuns: 2,            // hidden in the first runs
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
 * Storm Grid rules. Units: metres and seconds. Rates are per second and multiplied by dt in the
 * simulation (CG-GAME-003); the cascade runs on exact event times (src/game/sim.js).
 * Ramps run from city 1 to city `rampCities` and then hold; cities never run out (planner, 2026-09-26):
 * past city 40 the themes cycle, pay keeps growing and the building count stays capped.
 */
export const STORM = {
  city: {
    buildings: 24,              // N = min(maxBuildings, round(buildings x growth^(city-1)))
    growth: 1.1,
    maxBuildings: 300,
    themeRelief: 0.85,          // the first city of each theme (6, 11, 16 ...) is smaller
    themeEvery: 5,              // cities per theme
    themes: 8,                  // Downtown, Harbour, Old Town, Hill Towers, Neon Bay, Snow Peak, Desert Spires, Sky Port
    rampCities: 40,
    lotsSmall: 3,               // district = 3x3 lots while N <= smallUpTo, else 4x4
    lotsLarge: 4,
    smallUpTo: 40,
    lotPitch: 9,                // m between lot centres
    jitter: 1.2,                // +- m per lot
    avenue: [4, 12],            // extra gap between districts (m), city 1 -> rampCities: the key difficulty knob
    park: [0.1, 0.25],          // empty-lot chance, city 1 -> rampCities
    heightMin: 12,              // uniform heights from heightMin to heightMax (m)
    heightMax: [24, 60],
    footprint: [0.58, 0.8],     // building width/depth as a share of the lot pitch (look only; hops use the tips)
    antenna: 3,                 // antenna tip = roof + this (m): the hop points
    goldFrom: 3,                // gold rods (the Gold rods upgrade) appear from this city
  },
  strike: {
    fillSec: 1.2,               // 0 -> 100% charge
    band: [0.8, 0.95],          // SUPERCHARGE band; each Capacitor level widens it downward
    capacitorStep: 0.03,
    firstCity: { fillSec: 1.6, bandLo: 0.6 },   // city 1: slower fill, wider band (the first strike must land)
    weakBelow: 0.4,             // WEAK: 0.5 x E0
    weakShare: 0.5,             // CHARGED (weakBelow .. band): E0 x (0.5 + 1.25 x (c - 0.4)), up to E0
    superShare: 1.3,            // SUPERCHARGE: superBolts bolts leave the impact, each floor(1.3 x E0)
    superBolts: 2,
    overSec: 0.35,              // held this long past 100%: auto-fires a FIZZLE
    fizzleEnergy: 3,            // ... with 3 hops and no forks
    strikes: 3,                 // per city; +1 per Strikes level
    maxStrikeLevels: 3,
  },
  chain: {
    e0: 8,                      // E0 = e0 + e0PerVoltage x Voltage (hops per bolt)
    e0PerVoltage: 2,
    range: 16,                  // R = range + rangePerVoltage x Voltage (m, 3D between antenna tips)
    rangePerVoltage: 0.5,
    fork: 0.05,                 // F = fork + forkPerLevel x Fork, rolled on every hop
    forkPerLevel: 0.03,
    forkShare: 0.6,             // both halves carry ceil(forkShare x (e - 1))
    hopFast: 0.08,              // hop time = hopFast + hopSlow x (1 - e / e_strike): fresh bolts leap fast
    hopSlow: 0.07,
    maxBolts: 64,               // concurrent bolts (forks stop splitting beyond it)
  },
  gold: { pay: 10, energy: 4 }, // a gold antenna pays x10, always forks and gives the bolt +4 energy
  payout: {
    // "+N" = round((1 + floors / floorsDiv) x cityGrowth^(city-1) x min(depthCap, 1 + depthStep x depth)) x gold
    floorM: 4,
    floorsDiv: 8,
    cityGrowth: 1.06,
    depthStep: 0.02,
    depthCap: 2,
    districtShare: 0.25,        // BLOCK POWERED: +25% of the district's buildings' value
    // Jackpot plates on the run's coins, by share powered: [at least, multiplier]
    plates: [[1, 10], [0.95, 5], [0.8, 3], [0.6, 2]],
    passAt: 0.6,                // below this: x1 and the city is not cleared (retry it)
  },
  input: {
    snapPx: 80,                 // the target snaps to the antenna nearest the finger within this (screen px)
  },
};
