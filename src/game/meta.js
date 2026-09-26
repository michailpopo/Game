/**
 * Meta progression: persistent save shape, upgrades, skins, completion. Pure functions over the
 * save object, so balance can be tested in Node. Numbers: docs/GAME_BRIEF.md "Economy".
 *
 * Design intent (skill references/design/dopamine-and-retention.md):
 *  - coins always go up after a city, cleared or not -> every run feels useful
 *  - upgrades visibly change the storm (more hops, forks, strikes, a wider band, gold rods)
 *  - rewarded ads accelerate, never gate: everything is reachable with coins
 *  - a visible collection (bolt skins, locked ones as silhouettes) is a goal between upgrades
 * (WP-32 adds try-skin, the daily gift and the per-city best plates on top of this shape.)
 */

import { STORM } from "../config.js";

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
  runs: 0,
  wins: 0,           // cities cleared
  fullPowers: 0,
  bestShare: 0,
  bestChain: 0,
  plates: {},        // city -> best plate multiplier
  userMuted: false,
  lastFreeUpgradeAt: 0,
  lastBoostAt: 0,
  lastCashAt: 0,
  lastSeenAt: 0,
  skin: "cyan",
  owned: ["cyan"],
};

/** v1 (Comet Chain) -> v2 (Storm Grid): a different game; keep the coins and the mute choice only. */
export const MIGRATIONS = {
  2: (d) => ({ coins: Math.max(0, d.coins | 0), userMuted: !!d.userMuted }),
};

/** 12 bolt skins (cosmetic only). */
export const SKINS = [
  { id: "cyan", color: "#4df3ff" },
  { id: "magenta", color: "#ff3fd8" },
  { id: "solar", color: "#ffd23f" },
  { id: "plasma", color: "#6dff7a" },
  { id: "ember", color: "#ff7a2f" },
  { id: "frost", color: "#bfe8ff" },
  { id: "violet", color: "#a66bff" },
  { id: "ruby", color: "#ff3355" },
  { id: "rainbow", color: "#ff9ad5" },
  { id: "void", color: "#7a5cff" },
  { id: "aurora", color: "#5dffc8" },
  { id: "legend", color: "#fff1b0" },
];

export function skinColor(save) {
  return SKINS.find((s) => s.id === save.skin)?.color ?? SKINS[0].color;
}

const round5 = (n) => (n >= 1000 ? Math.round(n / 50) * 50 : Math.round(n / 5) * 5);

/** Price of the next "unlock random": 250 x 1.45^(owned-1). null = all owned. */
export function skinUnlockCost(save) {
  const n = save.owned.length;
  if (n >= SKINS.length) return null;
  return round5(250 * 1.45 ** (n - 1));
}

/** Always a skin the player does not own yet - "random" never means a duplicate. */
export function pickRandomSkin(save, rand) {
  const locked = SKINS.filter((s) => !save.owned.includes(s.id));
  return locked.length ? locked[Math.min(locked.length - 1, Math.floor(rand() * locked.length))].id : null;
}

/** The 5 upgrades (GAME_BRIEF "Upgrades"): price = round5(base x growth^level). */
export const UPGRADES = {
  voltage: { key: "upVoltage", max: 15, base: 60, growth: 1.45 },
  fork: { key: "upFork", max: 10, base: 100, growth: 1.55 },
  strikes: { key: "upStrikes", max: STORM.strike.maxStrikeLevels, base: 600, growth: 3 },
  capacitor: { key: "upCapacitor", max: 5, base: 150, growth: 1.9 },
  gold: { key: "upGold", max: 5, base: 300, growth: 2.1 },
};

export function upgradeCost(kind, save) {
  const u = UPGRADES[kind];
  const lvl = save[u.key];
  if (lvl >= u.max) return null;
  return round5(u.base * u.growth ** lvl);
}

/** Upgrade levels for the simulation (sim.js deriveParams). */
export function upgradeLevels(save) {
  return { voltage: save.upVoltage, fork: save.upFork, strikes: save.upStrikes, capacitor: save.upCapacitor, gold: save.upGold };
}

/** reportGameCompletedPercentage: min(1, (bestCity - 1) / 40), forward only (planner, 2026-09-26). */
export function completionPercent(bestLevel) {
  return Math.min(100, Math.round((Math.max(1, bestLevel) - 1) / STORM.city.rampCities * 100));
}
