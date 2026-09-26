/**
 * Mock CrazyGames HTML5 SDK v3 - DEV AND QA ONLY. Never ship it.
 *
 * Makes ad failures, Basic Launch (ads disabled), slow fills, platform mute,
 * a disabled Data module and app/locale variants reproducible on localhost.
 * It mirrors the documented surface (docs.crazygames.com, read 2026-09-11). A
 * green run here proves the game HANDLES these cases - not that CrazyGames
 * accepts the integration. Only the Developer Portal preview tool shows that.
 *
 * Query parameters:
 *   mockEnv=local|crazygames|disabled     SDK.environment            (default local)
 *   mockAd=fill|error|slow                how requestAd resolves     (default fill)
 *   mockAdCode=unfilled|adblock|adCooldown|adsDisabledBasicLaunch|other
 *   mockAdDelay=400  mockAdLength=900     ms
 *   mockAdblock=true                      hasAdblock() -> true
 *   mockDataDisabled=true                 data.* throws dataModuleDisabled
 *   mockUser=guest|logged                 getUser()
 *   mockLocale=de-DE  mockDevice=mobile  mockAppType=apple_store
 *   mockInitDelay=50  mockInitHang=true   (never resolves init)
 *   muteAudio=true  disableChat=true      same overrides the real SDK documents
 *
 * Every call is recorded in window.__CG_MOCK_LOG__ for the QA harness.
 */
(function () {
  "use strict";
  if (window.CrazyGames && window.CrazyGames.SDK && !window.CrazyGames.SDK.__isMock) return;

  const qs = new URLSearchParams(location.search);
  const cfg = Object.assign({
    env: qs.get("mockEnv") || "local",
    adMode: qs.get("mockAd") || "fill",
    adCode: qs.get("mockAdCode") || "unfilled",
    adDelay: Number(qs.get("mockAdDelay") || 400),
    adLength: Number(qs.get("mockAdLength") || 900),
    adblock: qs.get("mockAdblock") === "true",
    dataDisabled: qs.get("mockDataDisabled") === "true",
    user: qs.get("mockUser") || "guest",
    locale: qs.get("mockLocale") || "en-US",
    device: qs.get("mockDevice") || (matchMedia("(pointer: coarse)").matches ? "mobile" : "desktop"),
    appType: qs.get("mockAppType") || "web",
    initDelay: Number(qs.get("mockInitDelay") || 50),
    initHang: qs.get("mockInitHang") === "true",
  }, window.__CG_MOCK__ || {});

  const t0 = performance.now();
  const log = (window.__CG_MOCK_LOG__ = []);
  const record = (event, detail = null) => {
    const e = { event, detail, t: Math.round(performance.now() - t0) };
    log.push(e);
    try { window.__CG_MOCK_ON_RECORD__?.(e); } catch { /* QA hook */ }
    return e;
  };

  const settings = { muteAudio: qs.get("muteAudio") === "true", disableChat: qs.get("disableChat") === "true" };
  const settingsListeners = new Set();
  const authListeners = new Set();
  const joinListeners = new Set();
  // Like the real SDK for guests, the mock keeps Data module values in localStorage,
  // so reload/persistence tests are meaningful.
  const STORE_KEY = "__cg_mock_data_module__";
  const store = new Map(Object.entries((() => { try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch { return {}; } })()));
  const persist = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(Object.fromEntries(store))); } catch { /* storage blocked */ } };
  let initialized = false;
  let adInFlight = false;
  let gameContext = null;

  const guard = (name) => {
    if (cfg.env === "disabled") { record("threwDisabled", name); throw { code: "sdkDisabled", message: "SDK is disabled on this domain" }; }
    if (!initialized) { record("error", `${name} before init`); throw new Error(`[cg-mock] ${name}() called before await SDK.init()`); }
  };
  const dataGuard = (name) => {
    guard(name);
    if (cfg.dataDisabled) { record("dataModuleDisabled", name); throw { code: "dataModuleDisabled", message: "Data module disabled" }; }
  };

  const USER = { __dangerousUserId: "mock-user-1", username: "MockPlayer.X1", profilePictureUrl: "https://images.crazygames.com/userportal/avatars/4.png" };

  const SDK = {
    __isMock: true,
    get environment() { return cfg.env; },

    async init() {
      record("init");
      if (cfg.initHang) return new Promise(() => {});
      await new Promise((r) => setTimeout(r, cfg.initDelay));
      initialized = true;
    },

    game: {
      get settings() { return { ...settings }; },
      addSettingsChangeListener(fn) { settingsListeners.add(fn); },
      removeSettingsChangeListener(fn) { settingsListeners.delete(fn); },
      gameplayStart() { guard("gameplayStart"); record("gameplayStart"); },
      gameplayStop() { guard("gameplayStop"); record("gameplayStop"); },
      loadingStart() { guard("loadingStart"); record("loadingStart"); },
      loadingStop() { guard("loadingStop"); record("loadingStop"); },
      happytime() { guard("happytime"); record("happytime"); },
      reportGameCompletedPercentage(p) { guard("reportGameCompletedPercentage"); record("reportGameCompletedPercentage", p); },
      setGameContext(ctx) { guard("setGameContext"); gameContext = ctx; record("setGameContext", ctx); },
      clearGameContext() { guard("clearGameContext"); gameContext = null; record("clearGameContext"); },
      get isInstantMultiplayer() { return qs.get("mockInstantMultiplayer") === "true"; },
      get inviteParams() { const r = qs.get("mockRoom"); return r ? { roomId: r } : null; },
      getInviteParam(k) { return this.inviteParams?.[k] ?? null; },
      updateRoom(room) { guard("updateRoom"); record("updateRoom", room); },
      leftRoom() { guard("leftRoom"); record("leftRoom"); },
      inviteLink(params) { guard("inviteLink"); record("inviteLink", params); return "https://www.crazygames.com/game/mock?" + new URLSearchParams(params); },
      addJoinRoomListener(fn) { joinListeners.add(fn); },
      removeJoinRoomListener(fn) { joinListeners.delete(fn); },
    },

    ad: {
      requestAd(type, callbacks = {}) {
        guard("requestAd");
        record("adRequested", type);
        if (adInFlight) {
          record("adRejectedConcurrent", type);
          setTimeout(() => callbacks.adError?.({ code: "other", message: "ad already in flight" }), 10);
          return;
        }
        adInFlight = true;
        const delay = cfg.adMode === "slow" ? Math.max(cfg.adDelay, 4000) : cfg.adDelay;
        if (cfg.adMode === "error" || cfg.adblock) {
          const code = cfg.adblock ? "adblock" : cfg.adCode;
          setTimeout(() => { adInFlight = false; record("adError", code); callbacks.adError?.({ code, message: `mock ${code}` }); }, delay);
          return;
        }
        setTimeout(() => {
          record("adStarted", type);
          callbacks.adStarted?.();
          setTimeout(() => { adInFlight = false; record("adFinished", type); callbacks.adFinished?.(); }, cfg.adLength);
        }, delay);
      },
      async hasAdblock() { guard("hasAdblock"); record("hasAdblock", cfg.adblock); return cfg.adblock; },
    },

    banner: {
      async requestBanner(opts) {
        guard("requestBanner");
        record("requestBanner", opts);
        const el = document.getElementById(opts?.id);
        if (!el) throw { code: "notCreated", message: "container missing" };
        el.style.background = "repeating-linear-gradient(45deg,#2224,#2224 8px,#4444 8px,#4444 16px)";
      },
      async requestResponsiveBanner(id) { guard("requestResponsiveBanner"); record("requestResponsiveBanner", id); },
      clearBanner(id) { record("clearBanner", id); },
      clearAllBanners() { record("clearAllBanners"); },
    },

    data: {
      getItem(k) { dataGuard("data.getItem"); const v = store.has(String(k)) ? store.get(String(k)) : null; record("data.getItem", { k, hit: v !== null }); return v; },
      setItem(k, v) {
        dataGuard("data.setItem");
        store.set(String(k), String(v));
        let total = 0;
        store.forEach((val, key) => { total += key.length + val.length; });
        record("data.setItem", { k, bytes: String(v).length, total });
        if (total > 1048576) { store.delete(String(k)); throw { code: "dataLimitExcedeed", message: "Game data when converted to a JSON string cannot exceed 1048576 bytes" }; }
        persist();
      },
      removeItem(k) { dataGuard("data.removeItem"); store.delete(String(k)); persist(); record("data.removeItem", k); },
      clear() { dataGuard("data.clear"); store.clear(); persist(); record("data.clear"); },
    },

    user: {
      get isUserAccountAvailable() { return qs.get("user_account_available") !== "false"; },
      get systemInfo() {
        return {
          countryCode: "BE", locale: cfg.locale,
          device: { type: cfg.device }, os: { name: "Windows", version: "10" },
          browser: { name: "Chrome", version: "153" }, applicationType: cfg.appType,
        };
      },
      async getUser() { guard("getUser"); record("getUser", cfg.user); return cfg.user === "logged" ? { ...USER } : null; },
      async getUserToken() { guard("getUserToken"); if (cfg.user !== "logged") throw { code: "userNotAuthenticated" }; return "mock.jwt.token"; },
      async showAuthPrompt() {
        guard("showAuthPrompt"); record("showAuthPrompt");
        if (cfg.user === "logged") throw { code: "userAlreadySignedIn" };
        cfg.user = "logged";
        authListeners.forEach((fn) => fn({ ...USER }));
        return { ...USER };
      },
      addAuthListener(fn) { authListeners.add(fn); },
      removeAuthListener(fn) { authListeners.delete(fn); },
      async showAccountLinkPrompt() { guard("showAccountLinkPrompt"); return { response: "yes" }; },
      async listFriends({ page = 1, size = 10 } = {}) { guard("listFriends"); return { friends: [], page, size, hasMore: false, total: 0 }; },
      async submitScore(payload) { guard("submitScore"); record("submitScore", payload); },
    },

    analytics: { trackOrder(provider, order) { record("trackOrder", { provider, order }); } },
  };

  window.__CG_MOCK_SET__ = (patch) => {
    Object.assign(settings, patch);
    record("settingsChanged", patch);
    settingsListeners.forEach((fn) => fn({ ...settings }));
  };
  window.__CG_MOCK_CONTEXT__ = () => gameContext;

  window.CrazyGames = { SDK };
  record("mockInstalled", cfg);
  console.info("[cg-mock] mock CrazyGames SDK installed", cfg);
})();
