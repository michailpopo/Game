/**
 * Ad controller - the only code allowed to request an ad.
 *
 * Enforced structurally (docs.crazygames.com/requirements/ads, read 2026-09-11):
 *   CG-ADS-002  midgame requires a declared break context, never active gameplay
 *   CG-ADS-003  pause + blocking overlay taken BEFORE the request, released only on
 *               adFinished or adError ("an ad request is not instantaneous")
 *   CG-ADS-004  mute on adStarted, not on request; unmute on finish or error
 *   CG-ADS-005  every error resolves and the game continues
 *   CG-ADS-009  rewarded requests from an active gameplay screen are refused
 *   CG-ADS-010  one ad at a time (no chaining)
 *   CG-ADS-013  grant() runs only when the ad finished
 *   CG-ADS-015  a midgame and a "continue" rewarded never share one break
 *   CG-ADS-020/021  adblock or Basic Launch (ads disabled): rewarded offers are
 *               hidden for the session instead of staying clickable without effect
 *
 * Deliberately absent: a midgame cooldown. The SDK paces midgame ads (max 1 per
 * 3 minutes) and ignores early requests harmlessly - request at every natural break.
 * Delaying the FIRST midgame until level 3-4 is retention guidance and lives in
 * the game flow, not here.
 */

import { platform } from "../platform/platform.js";
import { Reason } from "./pause.js";

const SESSION_BLOCKING = new Set(["adsDisabledBasicLaunch", "adblock", "no-sdk"]);

export class AdController {
  #pause; #audio; #overlay;
  #inFlight = false;
  #break = null;
  #rewardedBlocked = null;   // reason string once rewarded ads are known unavailable this session
  log = [];

  /**
   * @param {import('./pause.js').PauseArbiter} pause
   * @param {{ setAdMute(on:boolean):void }} audio
   * @param {{ show():void, hide():void }} overlay  full-screen input blocker
   */
  constructor(pause, audio, overlay) {
    this.#pause = pause;
    this.#audio = audio;
    this.#overlay = overlay;
  }

  get busy() { return this.#inFlight; }

  /** Whether rewarded offers should be shown at all, and why not. */
  get rewardedAvailability() {
    if (!platform.sdkAvailable) return { ok: false, reason: "no-sdk" };
    if (this.#rewardedBlocked) return { ok: false, reason: this.#rewardedBlocked };
    return { ok: true, reason: null };
  }

  /** Call once after platform init. Adblock -> rewarded offers carry a notice instead of doing nothing. */
  async detectAdblock() {
    if (await platform.hasAdblock()) this.#rewardedBlocked = "adblock";
  }

  beginBreak(name) { this.#break = { name, midgame: false, continueRewarded: false }; }
  endBreak() { this.#break = null; }

  /**
   * Offer funnel: record that a rewarded offer was shown, expired or declined, so
   * shown -> requested -> finished can be read per surface (ads.log, QA harness, playtests).
   */
  offer(context, outcome = "shown") {
    this.log.push({ type: "offer", context, outcome, t: Date.now() });
  }

  /** @returns {Promise<{shown:boolean, reason:string}>} */
  async midgame({ context, gameplayActive = false }) {
    if (!context) return this.#refuse("midgame", "no break context (CG-ADS-002)");
    if (gameplayActive) return this.#refuse("midgame", "gameplay active (CG-ADS-002)");
    if (this.#break?.continueRewarded) return this.#refuse("midgame", "continue-rewarded already used at this break (CG-ADS-015)");
    const r = await this.#run("midgame", context);
    if (this.#break) this.#break.midgame = true;   // requested counts: the pairing rule is about the break
    return r;
  }

  /**
   * @param {{ context:string, grant:()=>void, gameplayActive?:boolean, isContinue?:boolean }} opts
   * @returns {Promise<{shown:boolean, reason:string}>}
   */
  async rewarded({ context, grant, gameplayActive = false, isContinue = false }) {
    if (typeof grant !== "function") throw new Error("rewarded() needs a grant callback");
    if (!context) return this.#refuse("rewarded", "no context");
    if (gameplayActive) return this.#refuse("rewarded", "active gameplay screen (CG-ADS-009)");
    if (isContinue && this.#break?.midgame) return this.#refuse("rewarded", "midgame already used at this break (CG-ADS-015)");

    const r = await this.#run("rewarded", context);
    if (r.shown) {
      if (isContinue && this.#break) this.#break.continueRewarded = true;
      try { grant(); } catch (e) { console.error("[ads] grant threw", e); }
    } else if (SESSION_BLOCKING.has(r.reason)) {
      this.#rewardedBlocked = r.reason;
    }
    return r;
  }

  #refuse(type, why) {
    console.warn(`[ads] refused ${type}: ${why}`);
    this.log.push({ type, outcome: "refused", why, t: Date.now() });
    return { shown: false, reason: "refused" };
  }

  async #run(type, context) {
    if (this.#inFlight) return this.#refuse(type, "another ad in flight (CG-ADS-010)");
    this.#inFlight = true;
    this.#pause.hold(Reason.AD);
    this.#overlay.show();

    let muted = false;
    const t0 = performance.now();
    let result;
    try {
      result = await platform.requestAd(type, { onStarted: () => { muted = true; this.#audio.setAdMute(true); } });
    } catch (e) {
      console.error("[ads] requestAd rejected unexpectedly", e);
      result = { shown: false, reason: "threw" };
    } finally {
      if (muted) this.#audio.setAdMute(false);
      this.#overlay.hide();
      this.#pause.release(Reason.AD);
      this.#inFlight = false;
    }
    this.log.push({ type, context, outcome: result.shown ? "shown" : result.reason, ms: Math.round(performance.now() - t0), t: Date.now() });
    return result;
  }
}
