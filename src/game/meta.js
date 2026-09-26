/**
 * Meta progression: persistent save shape, upgrade costs, rewards.
 * Pure functions over the save object, so balance can be tested in Node.
 *
 * Design intent (see skill references/design/dopamine-and-retention.md):
 *  - coins always go up after a level, win or lose -> every run feels useful
 *  - upgrades are affordable every 1-3 levels early, then slow -> a reason to return
 *  - rewarded ads accelerate, never gate: everything is reachable with coins
 *  - a visible collection (skins grid, locked ones as silhouettes) is a goal between upgrades
 */

import { GAME } from "../config.js";

// New fields need no migration: SaveService merges saved data over these defaults.
export const DEFAULT_SAVE = {
  level: 1,
  bestLevel: 1,
  coins: 0,
  upStart: 0,
  upIncome: 0,
  runs: 0,
  wins: 0,
  userMuted: false,
  lastFreeUpgradeAt: 0,
  lastBoostAt: 0,
  lastCashAt: 0,
  skin: "classic",
  owned: ["classic"],
};

/** Crowd skins. `classic` keeps each theme's own crowd colour; the rest override it. */
export const SKINS = [
  { id: "classic", color: null },
  { id: "blue", color: "#3a7bff" },
  { id: "orange", color: "#ff8a1f" },
  { id: "teal", color: "#12c4a2" },
  { id: "lemon", color: "#f2e23a" },
  { id: "lime", color: "#74d12a" },
  { id: "sky", color: "#46d2ff" },
  { id: "snow", color: "#f4f4ff" },
  { id: "pink", color: "#ff5ad9" },
];

export function skinColor(save) {
  return SKINS.find((s) => s.id === save.skin)?.color ?? null;
}

/** Price of the next "unlock random": rises with every skin owned. null = all owned. */
export function skinUnlockCost(save) {
  const n = save.owned.length;
  if (n >= SKINS.length) return null;
  const raw = 250 * 1.5 ** (n - 1);
  return raw >= 100 ? Math.round(raw / 10) * 10 : Math.round(raw / 5) * 5;
}

/** Always a skin the player does not own yet - "random" never means a duplicate. */
export function pickRandomSkin(save, rand) {
  const locked = SKINS.filter((s) => !save.owned.includes(s.id));
  return locked.length ? locked[Math.min(locked.length - 1, Math.floor(rand() * locked.length))].id : null;
}

export const UPGRADES = {
  start: { key: "upStart", max: 30, base: 45, growth: 1.32 },
  income: { key: "upIncome", max: 30, base: 70, growth: 1.38 },
};

export function startCount(save) {
  return 5 + save.upStart * 2;
}

export function incomeFactor(save) {
  return 1 + save.upIncome * 0.12;
}

export function upgradeCost(kind, save) {
  const u = UPGRADES[kind];
  const lvl = save[u.key];
  if (lvl >= u.max) return null;
  return Math.round((u.base * u.growth ** lvl) / 5) * 5;
}

export function levelReward(level, multiplier, save) {
  return Math.round((20 + level * 7) * multiplier * incomeFactor(save));
}

export function failReward(level, progress, save) {
  return Math.round((6 + level * 2) * progress * incomeFactor(save));
}

export function completionPercent(level) {
  return Math.min(100, ((level - 1) / GAME.completionLevel) * 100);
}
