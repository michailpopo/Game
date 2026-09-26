/**
 * SDK gameplayStart / gameplayStop, derived from ONE place.
 *
 * docs.crazygames.com/sdk/game (read 2026-09-11):
 *  - gameplayStart: "whenever the player starts playing or resumes playing after a
 *    break (game start, resume, revive, enter next level, ...). The first event is
 *    used to determine your game's initial loading size."
 *  - gameplayStop: "on every game break (entering a menu, ending level, pausing the
 *    game, ...). Don't call this event when the user switches focus or leaves the
 *    game area (we handle this on our side)."
 *
 * So: reported = gameWantsPlay && no AD/MENU/DIALOG/BOOT reason held.
 * Reason.HIDDEN is ignored on purpose.
 *
 * Scattering these calls across the code is how games end up reporting gameplay
 * behind an ad, or double-stopping on every tab switch.
 */

import { Reason } from "./pause.js";

const BREAK_REASONS = [Reason.AD, Reason.MENU, Reason.DIALOG, Reason.BOOT];

export function createGameplayReporter(platform, pause) {
  let wantsPlay = false;
  let reported = false;
  let firstStartAt = null;
  const history = [];

  const sync = () => {
    const should = wantsPlay && !BREAK_REASONS.some((r) => pause.has(r));
    if (should === reported) return;
    reported = should;
    if (should) {
      if (firstStartAt === null) firstStartAt = performance.now();
      platform.gameplayStart();
    } else {
      platform.gameplayStop();
    }
    history.push({ event: should ? "gameplayStart" : "gameplayStop", t: Math.round(performance.now()) });
  };

  pause.onChange(sync);

  return {
    /** The game says whether the player is in a playable state right now. */
    setPlaying(on) { wantsPlay = !!on; sync(); },
    get reported() { return reported; },
    get firstStartMs() { return firstStartAt; },
    get history() { return history.slice(); },
  };
}
