/**
 * Platform facade - the ONLY file that touches window.CrazyGames.
 *
 * Why: (1) the game must boot and stay playable without the SDK - localhost,
 * ad blockers, a hung init, or a non-CrazyGames domain where the SDK is
 * "disabled" and every call throws; (2) when the SDK changes, one file changes.
 *
 * Every method resolves or returns a safe default. Nothing here throws.
 *
 * API surface read from docs.crazygames.com on 2026-09-11:
 *   /sdk/intro/   init(), environment: "local" | "crazygames" | "disabled"
 *   /sdk/game/    gameplayStart/Stop, loadingStart/Stop, happytime,
 *                 settings {muteAudio, disableChat} + change listener,
 *                 reportGameCompletedPercentage, setGameContext/clearGameContext,
 *                 isInstantMultiplayer, updateRoom/leftRoom, inviteLink,
 *                 inviteParams/getInviteParam, add/removeJoinRoomListener
 *   /sdk/video-ads/  requestAd(type, {adStarted, adFinished, adError}), hasAdblock()
 *   /sdk/banners/    requestBanner({id,width,height}), clearBanner, clearAllBanners
 *   /sdk/data/       getItem/setItem/removeItem/clear (localStorage-shaped)
 *   /sdk/user/       isUserAccountAvailable, getUser, getUserToken, showAuthPrompt,
 *                    addAuthListener, systemInfo {locale, device.type, applicationType}
 *   /sdk/leaderboards-client/  user.submitScore({encryptedScore, score}) - invite-only
 */

const warned = new Set();
function warnOnce(what, e) {
  if (warned.has(what)) return;
  warned.add(what);
  console.warn(`[platform] ${what} failed:`, e?.code || e?.message || e);
}

function localSystemInfo() {
  const coarse = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  return {
    countryCode: null,
    locale: navigator.language || "en-US",
    device: { type: coarse ? "mobile" : "desktop" },
    os: { name: null, version: null },
    browser: { name: null, version: null },
    applicationType: "web",
  };
}

/** Used when the SDK is missing, failed to init, or reports environment "disabled". */
class NullPlatform {
  name = "none";
  environment = "none";
  sdkAvailable = false;
  #settings = { muteAudio: false, disableChat: false };

  async init() {
    // Mirror the SDK's documented local overrides so mute paths stay testable.
    const qs = new URLSearchParams(location.search);
    this.#settings = { muteAudio: qs.get("muteAudio") === "true", disableChat: qs.get("disableChat") === "true" };
    return this;
  }

  get settings() { return { ...this.#settings }; }
  onSettingsChange() { return () => {}; }

  gameplayStart() {}
  gameplayStop() {}
  loadingStart() {}
  loadingStop() {}
  happytime() {}
  reportCompletion() {}
  setGameContext() {}
  clearGameContext() {}

  /** Always resolves { shown:false, reason }. */
  async requestAd() { return { shown: false, reason: "no-sdk" }; }
  async hasAdblock() { return false; }

  async showBanner() { return { shown: false, reason: "no-sdk" }; }
  clearBanner() {}
  clearAllBanners() {}

  get dataAvailable() { return false; }
  dataGet() { return null; }
  dataSet() { return false; }
  dataRemove() { return false; }

  get userAccountsAvailable() { return false; }
  async getUser() { return null; }
  async getUserToken() { return null; }
  async showAuthPrompt() { return null; }
  onAuth() { return () => {}; }
  get systemInfo() { return localSystemInfo(); }
  get isCrazyGamesApp() { return ["google_play_store", "apple_store"].includes(this.systemInfo.applicationType); }

  get isInstantMultiplayer() { return false; }
  get inviteParams() { return null; }
  updateRoom() {}
  leftRoom() {}
  inviteLink() { return null; }
  onJoinRoom() { return () => {}; }

  async submitScore() { return false; }
}

class CrazyGamesPlatform extends NullPlatform {
  name = "crazygames";
  sdkAvailable = true;
  #sdk;
  #dataOk = true;

  constructor(sdk) { super(); this.#sdk = sdk; }

  async init() {
    await super.init();
    await this.#sdk.init();
    this.environment = this.#sdk.environment || "crazygames";
    return this;
  }

  // CG-SDK-004: muteAudio outranks the in-game toggle. AudioService applies the
  // priority; this only surfaces the value.
  get settings() {
    try { return { ...this.#sdk.game.settings }; } catch (e) { warnOnce("settings", e); return super.settings; }
  }
  onSettingsChange(fn) {
    try {
      this.#sdk.game.addSettingsChangeListener(fn);
      return () => { try { this.#sdk.game.removeSettingsChangeListener(fn); } catch { /* ignore */ } };
    } catch (e) { warnOnce("addSettingsChangeListener", e); return () => {}; }
  }

  gameplayStart() { try { this.#sdk.game.gameplayStart(); } catch (e) { warnOnce("gameplayStart", e); } }
  gameplayStop() { try { this.#sdk.game.gameplayStop(); } catch (e) { warnOnce("gameplayStop", e); } }
  loadingStart() { try { this.#sdk.game.loadingStart(); } catch (e) { warnOnce("loadingStart", e); } }
  loadingStop() { try { this.#sdk.game.loadingStop(); } catch (e) { warnOnce("loadingStop", e); } }
  // "Use this feature sparingly, the celebration should remain a special moment."
  happytime() { try { this.#sdk.game.happytime(); } catch (e) { warnOnce("happytime", e); } }

  /** 0..100, should only move forward. See /sdk/game "Game completion percentage". */
  reportCompletion(percent) {
    const p = Math.max(0, Math.min(100, Math.round(percent)));
    try { this.#sdk.game.reportGameCompletedPercentage(p); } catch (e) { warnOnce("reportGameCompletedPercentage", e); }
  }
  setGameContext(ctx) { try { this.#sdk.game.setGameContext(ctx); } catch (e) { warnOnce("setGameContext", e); } }
  clearGameContext() { try { this.#sdk.game.clearGameContext(); } catch (e) { warnOnce("clearGameContext", e); } }

  /**
   * Promise that ALWAYS resolves. { shown:true } only on adFinished; any other
   * outcome is { shown:false, reason } with reason = SDK error code
   * (adsDisabledBasicLaunch | unfilled | adblock | adCooldown | other).
   * Because nothing rejects, a forgotten catch() can never look like a reward
   * (CG-ADS-013). onStarted is the only correct moment to mute (CG-ADS-004).
   */
  requestAd(type, { onStarted } = {}) {
    return new Promise((resolve) => {
      let settled = false;
      const done = (r) => { if (!settled) { settled = true; clearTimeout(timer); resolve(r); } };
      // Safety net: a callback that never arrives must not leave the UI blocked.
      const timer = setTimeout(() => done({ shown: false, reason: "timeout" }), 60000);
      try {
        this.#sdk.ad.requestAd(type, {
          adStarted: () => { try { onStarted?.(); } catch (e) { console.error(e); } },
          adFinished: () => done({ shown: true, reason: "finished" }),
          adError: (err) => done({ shown: false, reason: err?.code || "other", error: err }),
        });
      } catch (e) {
        warnOnce("requestAd", e);
        done({ shown: false, reason: "threw" });
      }
    });
  }

  async hasAdblock() {
    try { return !!(await this.#sdk.ad.hasAdblock()); } catch (e) { warnOnce("hasAdblock", e); return false; }
  }

  async showBanner(id, width, height) {
    try { await this.#sdk.banner.requestBanner({ id, width, height }); return { shown: true }; }
    catch (e) { return { shown: false, reason: e?.code || "other" }; }
  }
  clearBanner(id) { try { this.#sdk.banner.clearBanner(id); } catch { /* ignore */ } }
  clearAllBanners() { try { this.#sdk.banner.clearAllBanners(); } catch { /* ignore */ } }

  // Data module. Requires "Progress Save" enabled in the submission, otherwise
  // calls fail with dataModuleDisabled; SaveService then falls back to
  // localStorage for the session and logs loudly.
  get dataAvailable() { return this.#dataOk && !!this.#sdk.data; }
  dataGet(key) {
    try { return this.#sdk.data.getItem(key); } catch (e) { this.#dataFail("getItem", e); return null; }
  }
  dataSet(key, value) {
    try { this.#sdk.data.setItem(key, value); return true; } catch (e) { this.#dataFail("setItem", e); return false; }
  }
  dataRemove(key) {
    try { this.#sdk.data.removeItem(key); return true; } catch (e) { this.#dataFail("removeItem", e); return false; }
  }
  #dataFail(what, e) {
    if (e?.code === "dataModuleDisabled") {
      this.#dataOk = false;
      console.error("[platform] Data module disabled: enable 'Progress Save' (Data Module) in the CrazyGames submission.");
    }
    warnOnce(`data.${what}`, e);
  }

  get userAccountsAvailable() {
    try { return !!this.#sdk.user.isUserAccountAvailable; } catch { return false; }
  }
  async getUser() {
    if (!this.userAccountsAvailable) return null;
    try { return (await this.#sdk.user.getUser()) ?? null; } catch (e) { warnOnce("getUser", e); return null; }
  }
  /** Verify SERVER-side only (public key at sdk.crazygames.com/publicKey.json). Never decode on the client. */
  async getUserToken() {
    try { return await this.#sdk.user.getUserToken(); } catch (e) { if (e?.code !== "userNotAuthenticated") warnOnce("getUserToken", e); return null; }
  }
  /** Only from an explicit player action - never automatically (account requirements). */
  async showAuthPrompt() {
    try { return await this.#sdk.user.showAuthPrompt(); } catch (e) { return null; }
  }
  onAuth(fn) {
    try {
      this.#sdk.user.addAuthListener(fn);
      return () => { try { this.#sdk.user.removeAuthListener(fn); } catch { /* ignore */ } };
    } catch (e) { warnOnce("addAuthListener", e); return () => {}; }
  }
  get systemInfo() {
    try { return { ...localSystemInfo(), ...this.#sdk.user.systemInfo }; } catch { return localSystemInfo(); }
  }

  get isInstantMultiplayer() { try { return !!this.#sdk.game.isInstantMultiplayer; } catch { return false; } }
  get inviteParams() { try { return this.#sdk.game.inviteParams ?? null; } catch { return null; } }
  updateRoom(room) { try { this.#sdk.game.updateRoom(room); } catch (e) { warnOnce("updateRoom", e); } }
  leftRoom() { try { this.#sdk.game.leftRoom(); } catch (e) { warnOnce("leftRoom", e); } }
  inviteLink(params) { try { return this.#sdk.game.inviteLink(params); } catch (e) { warnOnce("inviteLink", e); return null; } }
  onJoinRoom(fn) {
    try {
      this.#sdk.game.addJoinRoomListener(fn);
      return () => { try { this.#sdk.game.removeJoinRoomListener(fn); } catch { /* ignore */ } };
    } catch (e) { warnOnce("addJoinRoomListener", e); return () => {}; }
  }

  /** Leaderboards are invite-only; the score must be AES-GCM encrypted with the portal key. */
  async submitScore(encryptedScore, score) {
    try { await this.#sdk.user.submitScore({ encryptedScore, score }); return true; } catch (e) { warnOnce("submitScore", e); return false; }
  }
}

/** Import this binding, never window.CrazyGames. Replaced once, during boot. */
export let platform = new NullPlatform();

export async function initPlatform({ timeoutMs = 8000 } = {}) {
  const sdk = globalThis.CrazyGames?.SDK;
  if (!sdk) {
    console.info("[platform] CrazyGames SDK not present - local mode");
    await platform.init();
    return platform;
  }
  const candidate = new CrazyGamesPlatform(sdk);
  try {
    await Promise.race([
      candidate.init(),
      new Promise((_, rej) => setTimeout(() => rej(new Error("SDK init timed out")), timeoutMs)),
    ]);
    if (candidate.environment === "disabled") {
      // Non-CrazyGames domain: every SDK call would throw.
      console.info("[platform] SDK environment 'disabled' - running without SDK");
      await platform.init();
    } else {
      platform = candidate;
      console.info(`[platform] SDK ready (environment: ${candidate.environment}${sdk.__isMock ? ", MOCK" : ""})`);
    }
  } catch (e) {
    console.warn("[platform] SDK init failed, continuing without it:", e?.message || e);
    await platform.init();
  }
  return platform;
}
