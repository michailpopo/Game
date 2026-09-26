/**
 * Rewarded-offer rules: which offer may be shown right now, and what it is worth.
 * One place decides every "is this offer allowed?", so the caps cannot drift apart
 * between screens. Pure functions over the save + session state; the caller passes
 * `now` (ms) and `available` (ads.rewardedAvailability.ok), so this runs in Node.
 *
 * The rules each offer follows (docs.crazygames.com/requirements/ads, register ids):
 *   CG-ADS-009  never on an active gameplay screen - callers only ask on the city intro (before
 *               the first strike), after the last cascade, on the result and in the shop
 *   CG-ADS-011  not too often: every offer has a cap or a cooldown
 *   CG-ADS-012  a non-ad path exists: coins buy everything an ad accelerates
 *   CG-ADS-014  revive not on every run: once per session, only at 85-99% powered
 */

import { OFFERS } from "../config.js";
import { skinUnlockCost, upgradeCost } from "./meta.js";

const left = (lastAt, cooldownSec, now) => Math.max(0, Math.ceil((lastAt + cooldownSec * 1000 - now) / 1000));
const nice = (n) => (n >= 100 ? Math.round(n / 10) * 10 : Math.max(5, Math.round(n / 5) * 5));

/** After the last cascade: offer "One more strike"? (progress = share powered, never at 100%) */
export function reviveOffer({ available, revivesUsed, progress }) {
  return available && revivesUsed < OFFERS.revivesPerSession && progress >= OFFERS.reviveMinProgress && progress < 1;
}

/** City intro: "Supercharged start" = +boostStrikes strikes for this city. */
export function boostOffer(save, { available, now, boostedThisRun }) {
  const cooldown = left(save.lastBoostAt, OFFERS.boostCooldownSec, now);
  const visible = available && !boostedThisRun && save.runs >= OFFERS.boostAfterRuns && cooldown === 0;
  return { visible, strikes: OFFERS.boostStrikes, cooldown };
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
