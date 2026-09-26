/**
 * Pause arbitration.
 *
 * Subsystems hold named reasons; the simulation runs only while no reason is
 * held. No subsystem may "resume" on its own - it can only release its own
 * reason.
 *
 * The bug this prevents: an ad starts -> the ad iframe steals focus -> `blur`;
 * the ad ends -> a naive `focus` handler resumes the game while the ad overlay
 * is still up (or after the player deliberately opened a menu).
 *
 * Reasons and owners:
 *   AD      AdController, from request until adFinished/adError   (CG-ADS-003)
 *   MENU    UI screens: level complete, fail, shop
 *   DIALOG  modal offers
 *   HIDDEN  tab hidden or window blurred. Pauses the SIMULATION only. It is not
 *           a gameplay break for the SDK: docs.crazygames.com/sdk/game says
 *           "Don't call gameplayStop when the user switches focus or leaves the
 *           game area (we handle this on our side)". See gameplay-events.js.
 *   BOOT    until the first playable frame
 */

export const Reason = Object.freeze({
  AD: "ad",
  MENU: "menu",
  DIALOG: "dialog",
  HIDDEN: "hidden",
  BOOT: "boot",
});

export class PauseArbiter {
  #reasons = new Set();
  #listeners = new Set();

  constructor(initial = [Reason.BOOT]) {
    for (const r of initial) this.#reasons.add(r);
  }

  get running() { return this.#reasons.size === 0; }
  get reasons() { return [...this.#reasons]; }
  has(reason) { return this.#reasons.has(reason); }

  /** Idempotent: holding a held reason is a no-op. */
  hold(reason) {
    if (!reason) throw new Error("hold() needs a reason");
    if (!this.#reasons.has(reason)) {
      this.#reasons.add(reason);
      this.#emit();
    }
    return this;
  }

  release(reason) {
    if (this.#reasons.delete(reason)) this.#emit();
    return this;
  }

  /** Fires on EVERY change of the reason set, not only running transitions. */
  onChange(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  #emit() {
    const state = { running: this.running, reasons: this.reasons };
    for (const fn of this.#listeners) {
      try { fn(state); } catch (e) { console.error("[pause] listener threw", e); }
    }
  }
}

/**
 * Wire browser interruptions to Reason.HIDDEN.
 *
 * Deliberately asymmetric:
 *  - pause on `visibilitychange:hidden`, `blur` and `pagehide`
 *  - resume on `visibilitychange:visible`, `focus`, or the player touching the
 *    canvas (an iframe that never regained focus must not stay frozen)
 *  - the INITIAL unfocused state does not pause: on CrazyGames the iframe is
 *    usually not focused until the first click, and the first frame must still
 *    be live.
 *
 * `onHide` is the last reliable moment to flush a save (pagehide on mobile).
 */
export function watchInterruptions(pause, { onHide, interactionTarget } = {}) {
  const hide = () => pause.hold(Reason.HIDDEN);
  const show = () => pause.release(Reason.HIDDEN);

  const onVisibility = () => {
    if (document.visibilityState === "hidden") { hide(); onHide?.(); }
    else show();
  };

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("blur", hide);
  window.addEventListener("focus", () => { if (document.visibilityState === "visible") show(); });
  window.addEventListener("pagehide", () => { hide(); onHide?.(); });
  interactionTarget?.addEventListener("pointerdown", show, { passive: true });

  if (document.visibilityState === "hidden") hide();
}
