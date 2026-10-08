/**
 * Meta progression: persistent save shape, upgrades, bolt skins, daily gift, completion. Pure
 * functions over the save object (and `now` in ms), so balance can be tested in Node. Numbers:
 * src/config.js ECONOMY (from docs/GAME_BRIEF.md "Economy").
 *
 * Design intent (skill references/design/dopamine-and-retention.md):
 *  - coins always go up after a city, cleared or not -> every run feels useful
 *  - upgrades visibly change the storm (more hops, forks, strikes, a wider band, gold rods)
 *  - rewarded ads accelerate, never gate: everything is reachable with coins
 *  - a visible collection (12 bolts, locked ones as silhouettes) and a forgiving daily streak
 */

import { ECONOMY, STORM } from "../config.js";

// New fields need no migration: SaveService merges saved data over these defaults.
export const DEFAULT_SAVE = {
  level: 1,          // the city to play next
  bestLevel: 1,      // the furthest city reached (completion %)
  coins: 0,
  upVoltage: 0,
  upFork: 0,
  upStrikes: 0,
  upCapacitor: 0,
  upGold: 0,
  runs: 0,           // runs started
  wins: 0,           // cities cleared
  fullPowers: 0,
  bestShare: 0,
  bestChain: 0,
  plates: {},        // city -> best plate multiplier
  userMuted: false,
  musicMuted: false,
  lastFreeUpgradeAt: 0,
  lastBoostAt: 0,    // Supercharged start: when it was last SHOWN (cadence) ...
  lastBoostRun: -99, // ... and on which run
  lastCashAt: 0,
  lastGiftDay: -1,   // local day number of the last collected daily gift
  giftStreak: 0,     // 1..7
  lastSeenAt: 0,
  skin: "cyan",
  owned: ["cyan"],
  tried: [],         // skins already tried for one city ("Try it" once per skin)
};

/**
 * Save migrations (SaveService runs every step from the saved version up):
 *  v1 -> v2  Comet Chain -> Storm Grid: a different game; keep the coins and the mute choice only
 *  v2 -> v3  WP-32 fields (daily gift, tried skins, boost cadence); skin ids unchanged
 *  v3 -> v4  finer upgrade levels (2026-10-07): Voltage, Fork and Capacitor levels now do 1/2, 1/3 and 1/2 of what
 *            they did, so their saved levels are scaled up to keep the player's storm exactly as strong
 */
export const MIGRATIONS = {
  2: (d) => ({ coins: Math.max(0, d.coins | 0), userMuted: !!d.userMuted }),
  3: (d) => ({
    ...d,
    tried: Array.isArray(d.tried) ? d.tried : [],
    lastGiftDay: Number.isFinite(d.lastGiftDay) ? d.lastGiftDay : -1,
    giftStreak: Number.isFinite(d.giftStreak) ? d.giftStreak : 0,
    lastBoostRun: Number.isFinite(d.lastBoostRun) ? d.lastBoostRun : -99,
    owned: Array.isArray(d.owned) && d.owned.length ? d.owned : ["cyan"],
  }),
  4: (d) => ({
    ...d,
    upVoltage: Math.min(ECONOMY.upgrades.voltage.max, (d.upVoltage | 0) * 2),
    upFork: Math.min(ECONOMY.upgrades.fork.max, (d.upFork | 0) * 3),
    upCapacitor: Math.min(ECONOMY.upgrades.capacitor.max, (d.upCapacitor | 0) * 2),
  }),
};

/**
 * 12 bolt skins (cosmetic only; GAME_BRIEF "Bolt skins"). `glow` colours the bolt, `core` its
 * centre. The view gets the whole object through view.recolor(glow, skin) - the skin hook the look
 * pass can extend (spark shape, crackle timbre). Names: i18n `skin_<id>`.
 */
export const SKINS = [
  { id: "cyan", glow: "#4df3ff", core: "#ffffff" },       // Storm Cyan (owned)
  { id: "magenta", glow: "#ff3fd8", core: "#ffe6fa" },
  { id: "solar", glow: "#ffcc33", core: "#fff8d6" },      // Solar Gold
  { id: "plasma", glow: "#6dff7a", core: "#eaffea" },     // Plasma Green
  { id: "ember", glow: "#ff7a2f", core: "#fff0e0" },
  { id: "frost", glow: "#bfe8ff", core: "#ffffff" },
  { id: "violet", glow: "#a66bff", core: "#f1e8ff" },
  { id: "ruby", glow: "#ff3355", core: "#ffe0e6" },
  { id: "rainbow", glow: "#ff9ad5", core: "#ffffff" },    // Neon Rainbow
  { id: "void", glow: "#5b3fe0", core: "#d8ccff" },
  { id: "aurora", glow: "#5dffc8", core: "#e8fff8" },
  { id: "legend", glow: "#fff1b0", core: "#ffffff" },     // Legend White-Gold
];

export const skinById = (id) => SKINS.find((s) => s.id === id) || SKINS[0];

/** The equipped skin, or the one being tried for this city. */
export function activeSkin(save, trialId = null) {
  return skinById(trialId || save.skin);
}

export function skinColor(save, trialId = null) {
  return activeSkin(save, trialId).glow;
}

const round5 = (n) => (n >= 1000 ? Math.round(n / 50) * 50 : Math.round(n / 5) * 5);

/** Price of the next "unlock random": 250 x 1.45^(owned-1), to the nearest 5. null = all owned. */
export function skinUnlockCost(save) {
  const n = save.owned.length;
  if (n >= SKINS.length) return null;
  const e = ECONOMY.skins;
  return Math.round((e.base * e.growth ** (n - 1)) / 5) * 5;
}

/** Always a skin the player does not own yet - "random" never means a duplicate. */
export function pickRandomSkin(save, rand) {
  const locked = SKINS.filter((s) => !save.owned.includes(s.id));
  return locked.length ? locked[Math.min(locked.length - 1, Math.floor(rand() * locked.length))].id : null;
}

/** The 5 upgrades, in card order. key = the save field with the level. */
export const UPGRADES = {
  voltage: { key: "upVoltage", ...ECONOMY.upgrades.voltage },
  fork: { key: "upFork", ...ECONOMY.upgrades.fork },
  strikes: { key: "upStrikes", ...ECONOMY.upgrades.strikes, max: Math.min(ECONOMY.upgrades.strikes.max, STORM.strike.maxStrikeLevels) },
  capacitor: { key: "upCapacitor", ...ECONOMY.upgrades.capacitor },
  gold: { key: "upGold", ...ECONOMY.upgrades.gold },
};

/**
 * Price of the next level, or null when maxed: base x growth^level, x lateGrowth for every level past lateFrom
 * (cheap early levels for a purchase after almost every run, steep late ones so maxing takes hours).
 */
export function upgradeCost(kind, save) {
  const u = UPGRADES[kind];
  const lvl = save[u.key];
  if (lvl >= u.max) return null;
  return round5(u.base * u.growth ** lvl * (u.lateGrowth ?? 1) ** Math.max(0, lvl - (u.lateFrom ?? u.max)));
}

/** Upgrade levels for the simulation (sim.js deriveParams). */
export function upgradeLevels(save) {
  return { voltage: save.upVoltage, fork: save.upFork, strikes: save.upStrikes, capacitor: save.upCapacitor, gold: save.upGold };
}

/** Supercharged start for coins: the next Voltage level's price (the last one once Voltage is maxed). */
export function boostCoinCost(save) {
  const u = UPGRADES.voltage;
  return upgradeCost("voltage", save) ?? round5(u.base * u.growth ** (u.max - 1));
}

// ------------------------------------------------------------------ daily gift

/** Local calendar day number (days since 1970-01-01 in the player's time zone). */
export function dayNumber(ms) {
  const d = new Date(ms);
  return Math.floor((ms - d.getTimezoneOffset() * 60000) / 86400000);
}

/** The streak day a gift collected on `day` counts as (1..7): +1 per day, a missed day steps back one. */
export function nextStreak(save, day) {
  const max = ECONOMY.gift.streak.length;
  if (save.lastGiftDay < 0 || save.giftStreak <= 0) return 1;
  const gap = day - save.lastGiftDay;
  if (gap <= 0) return Math.max(1, save.giftStreak);
  return Math.max(1, Math.min(max, save.giftStreak + 1 - (gap - 1)));
}

/** Average coins per run at a city (the brief's table, log-interpolated; +6% per city past it). */
export function averageRunCoins(city) {
  const t = ECONOMY.gift.runCoins;
  const c = Math.max(1, city);
  if (c <= t[0][0]) return t[0][1];
  for (let i = 1; i < t.length; i++) {
    const [c0, v0] = t[i - 1], [c1, v1] = t[i];
    if (c <= c1) return v0 * (v1 / v0) ** ((c - c0) / (c1 - c0));
  }
  const [cl, vl] = t[t.length - 1];
  return vl * STORM.payout.cityGrowth ** (c - cl);
}

/** Today's gift: { day, streak, mult, amount } (amount = runs x average run coins at the best city x streak). */
export function dailyGift(save, now) {
  const day = dayNumber(now);
  const streak = nextStreak(save, day);
  const mult = ECONOMY.gift.streak[streak - 1];
  const amount = round5(ECONOMY.gift.runs * averageRunCoins(save.bestLevel) * mult);
  return { day, streak, mult, amount };
}

/** reportGameCompletedPercentage: min(1, (bestCity - 1) / 40), forward only (planner, 2026-09-26). */
export function completionPercent(bestLevel) {
  return Math.min(100, Math.round((Math.max(1, bestLevel) - 1) / STORM.city.rampCities * 100));
}
