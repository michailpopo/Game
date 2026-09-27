/**
 * Rewarded-offer rules: which offer may be shown right now, and what it is worth.
 * One place decides every "is this offer allowed?", so the caps cannot drift apart
 * between screens. Pure functions over the save + session state; the caller passes
 * `now` (ms) and `available` (ads.rewardedAvailability.ok), so this runs in Node.
 * (docs/GAME_BRIEF.md "Monetization plan", 7 surfaces; numbers in OFFERS / ECONOMY.)
 *
 * The rules each offer follows (docs.crazygames.com/requirements/ads, register ids):
 *   CG-ADS-009  never on an active gameplay screen - callers only ask on the city intro (before
 *               the first strike), after the last cascade, on the result and in the shop
 *   CG-ADS-011  not too often: every offer has a cap or a cooldown
 *   CG-ADS-012  a non-ad path exists: coins buy everything an ad accelerates
 *   CG-ADS-014  revive not on every run: once per session, only at 85-99% powered
 *   CG-ADS-020/021  ads off / adblock: every video button hidden (`available` false); coin paths stay
 */

import { OFFERS } from "../config.js";
import { boostCoinCost, dailyGift, skinUnlockCost, upgradeCost } from "./meta.js";

const left = (lastAt, cooldownSec, now) => Math.max(0, Math.ceil((lastAt + cooldownSec * 1000 - now) / 1000));
const nice = (n) => (n >= 100 ? Math.round(n / 10) * 10 : Math.max(5, Math.round(n / 5) * 5));

/** After the last cascade: offer "One more strike"? (progress = share powered, never at 100%) */
export function reviveOffer({ available, revivesUsed, progress }) {
  return available && revivesUsed < OFFERS.revivesPerSession && progress >= OFFERS.reviveMinProgress && progress < 1;
}

/**
 * City intro: is it Supercharged start's turn? Hidden in runs 1-2; then on every boostEveryRuns-th
 * intro, or once boostCooldownSec passed since it was last shown. Asked once per intro (the caller
 * then records lastBoostRun / lastBoostAt).
 */
export function boostDue(save, now) {
  if (save.runs < OFFERS.boostAfterRuns) return false;
  return save.runs - save.lastBoostRun >= OFFERS.boostEveryRuns || now - save.lastBoostAt >= OFFERS.boostCooldownSec * 1000;
}

/**
 * The Supercharged-start pair on this intro: the video button (+strikes) and its coin path
 * (same reward for the next Voltage level's price). `due` = boostDue() at the start of the intro.
 */
export function boostOffer(save, { available, due, boostedThisRun }) {
  const on = due && !boostedThisRun;
  const cost = boostCoinCost(save);
  return { visible: on && available, coin: on, cost, affordable: save.coins >= cost, strikes: OFFERS.boostStrikes };
}

/** Upgrade card: "FREE" instead of coins, only when the upgrade is out of reach. */
export function freeUpgradeOffer(kind, save, { available, now }) {
  const cost = upgradeCost(kind, save);
  const cooling = left(save.lastFreeUpgradeAt, OFFERS.freeUpgradeCooldownSec, now) > 0;
  return { visible: available && cost !== null && save.coins < cost && !cooling };
}

/** Shop: "+N coins" while the next skin is not affordable. Hidden (with a timer) while cooling. */
export function cashOffer(save, { available, now }) {
  const cost = skinUnlockCost(save);
  const cooldown = left(save.lastCashAt, OFFERS.cashCooldownSec, now);
  const amount = cost === null ? 0 : nice(cost * OFFERS.cashShare);
  const wanted = cost !== null && save.coins < cost;
  return { visible: available && wanted && cooldown === 0, amount, cooldown: wanted ? cooldown : 0 };
}

/** Shop: "Try it" - one city with a locked skin, once per skin, from run trySkinFromRuns on. */
export function trySkinOffer(save, skinId, { available, trialActive }) {
  return !!skinId && available && !trialActive && save.runs >= OFFERS.trySkinFromRuns
    && !save.owned.includes(skinId) && !save.tried.includes(skinId);
}

/**
 * Daily gift: the first session of a local day, after the first result of the session (never
 * before the first strike, never blocking play). Collect always; Collect xN with a video.
 */
export function dailyGiftOffer(save, { available, now, resultsThisSession }) {
  const g = dailyGift(save, now);
  const due = resultsThisSession > 0 && save.lastGiftDay !== g.day;
  return { visible: due, video: due && available, factor: OFFERS.giftVideoFactor, ...g };
}
