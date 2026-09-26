/**
 * Game identity and tuning. Everything a designer tweaks lives here.
 * The template demo is a crowd runner; replace GAME and TUNING for a real game.
 */

export const GAME = {
  slug: "cg-game",
  title: "Working Title",
  saveVersion: 1,
  // CrazyGames midgame guidance: wait until the tutorial is done / level 3-4
  // before the first midgame ad. Not a cooldown - the SDK paces the rest.
  firstMidgameLevel: 3,
  // Endless level game: this level counts as 100% for reportGameCompletedPercentage.
  completionLevel: 30,
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
  // "Start x2" on the ready screen: one run with double start units.
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

export const TUNING = {
  trackHalfWidth: 6,
  runSpeed: 13,              // world units per second
  finishSpeed: 10,
  pushSpeedFactor: 0.25,     // speed while pushing into a block
  steerSensitivity: 16,      // world units per full-width horizontal drag
  keySteerSpeed: 11,         // world units per second with keys
  lateralFollow: 12,         // 1/s, exponential follow of the crowd toward its target x
  unitSpacing: 0.62,
  unitRadius: 0.3,
  maxSlots: 150,             // formation slots simulated and drawn; the count can go higher
  crowdExtentX: 3.3,         // formation semi-axes cap: keeps gate choice possible
  crowdExtentZ: 4.6,
  blockRateMin: 22,          // units per second drained while pushing a block
  blockRateFactor: 2.4,
  sawKillRate: 7,            // kills per overlapping slot per second
  battleRateMin: 16,
  battleRateFactor: 2.0,
  enemyChargeDistance: 24,
  enemyChargeSpeed: 5,
  finishTierLength: 3.4,
  tierStep: 0.55,            // height added per finish stair (presentation)
  reviveUnits: 10,
  reviveInvulnSec: 2.5,
  coinReach: 0.55,           // a coin counts when it is this close to the crowd's edge
};
