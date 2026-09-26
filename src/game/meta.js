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

import { ARENA } from "../config.js";

// New fields need no migration: SaveService merges saved data over these defaults.
export const DEFAULT_SAVE = {
  level: 1,          // round number (the next round to play)
  bestLevel: 1,
  tier: 1,           // arena tier 1-20: bot difficulty, adapts to results (GAME_BRIEF "Bot AI difficulty ramp")
  bestTier: 1,
  bestRank: 0,       // 0 = no finished round yet
  bestScore: 0,
  bestWorld: 0,      // highest ladder level ever reached ("NEW WORLD" cards)
  swallows: 0,
  firstWin: false,   // first #1 finish (happytime, once)
  lastSeenAt: 0,
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

/** Comet trail skins. `classic` keeps the theme's accent; the rest override it. (12 named trails: next package.) */
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
  start: { key: "upStart", max: 10, base: 50, growth: 1.45 },
  income: { key: "upIncome", max: 30, base: 70, growth: 1.38 },
};

/** "Start size" levels (GAME_BRIEF "Economy"): the chain mass a round starts with. */
const START_MASS = [6, 10, 14, 22, 30, 46, 62, 94, 126, 190, 254];

export function startMass(save) {
  return START_MASS[Math.min(START_MASS.length - 1, save.upStart)] ?? ARENA.snake.startMass;
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

/** Rank crate (skill-based, never random): #1 x5, #2-3 x3, #4-6 x2, #7-13 x1. */
export function crateFor(rank) {
  for (const [upTo, x] of ARENA.rewards.rankCrates) if (rank <= upTo) return x;
  return 1;
}

/** Coins for a finished round: (chain total / massPerCoin + coinsPerSwallow x swallows) x crate x income. */
export function roundReward(mass, swallows, rank, save) {
  const r = ARENA.rewards;
  const base = mass / r.massPerCoin + r.coinsPerSwallow * swallows;
  return Math.max(r.minCoins, Math.round(base * crateFor(rank) * incomeFactor(save)));
}

/** Arena tier after a finished round: +1 after a top-3 finish, -1 after rank 8 or worse (floor 1). */
export function nextTier(tier, rank) {
  const max = ARENA.bots.maxTier;
  if (rank <= 3) return Math.min(max, tier + 1);
  if (rank >= 8) return Math.max(1, tier - 1);
  return tier;
}

/** reportGameCompletedPercentage: the best arena tier reached, forward only. */
export function completionPercent(bestTier) {
  return Math.min(100, Math.round((Math.max(1, bestTier) / ARENA.bots.maxTier) * 100));
}
