/**
 * Boot + game flow controller - Storm Grid (docs/GAME_BRIEF.md).
 *
 * Boot order matters:
 *   1. SDK init (awaited, with a timeout) -> loadingStart
 *   2. services: pause, gameplay reporter, save, audio, input, ads
 *   3. renderer + the first city built -> loadingStop -> release BOOT
 *   4. the player lands IN the live dark city (CG-GAME-001): the first press on the city (or
 *      Space/Enter) starts the run AND starts charging the first strike; gameplayStart fires then,
 *      from gameplay-events.js
 *
 * Run flow: ready (city intro) -> run (3+ strikes: hold to charge, release to strike) -> the last
 * cascade ends -> [85-99% powered: "One more strike" offer, once per session] -> result (% powered,
 * jackpot plate, coins, Claim / Claim x3) -> next city (>= 60%) or the same city again.
 *
 * Ad placements and the rule each follows - src/game/offers.js decides visibility and caps:
 *   result          -> "Claim" (or "Retry") next to "Claim x3" (rewarded, same button style, from run 2)
 *   "Next city" / "Retry" -> midgame from city GAME.firstMidgameLevel on (a natural break), never
 *                      right after a rewarded video
 *   85-99% powered  -> "One more strike" (rewarded, once per session, auto-SUPERCHARGE) next to
 *                      "Finish", with a ring countdown that removes the offer at 0
 *   city intro      -> "Supercharged start" (+2 strikes; rewarded, after the first runs, cooldown),
 *                      "FREE" upgrade (rewarded) only when unaffordable, with cooldown
 *   bolt shop       -> "Random" unlock for coins (always a new bolt) and "+coins" (rewarded) only
 *                      while the unlock is unaffordable, with a visible cooldown timer
 * Everything works with ads off (Basic Launch) and with an ad blocker.
 *
 * Mouse control (CG-QUAL-008): click-to-target - nothing follows mouse movement continuously, so no
 * pointer lock (project.json notes). The hold uses pointer capture (core/input.js): a release
 * outside the frame still fires the strike and cannot click the page.
 */

import "@fontsource/lilita-one/latin-400.css";
import "./ui/styles.css";

import { GAME, OFFERS, STORM } from "./config.js";
import { initPlatform } from "./platform/platform.js";
import { PauseArbiter, Reason, watchInterruptions } from "./core/pause.js";
import { GameLoop } from "./core/loop.js";
import { Input } from "./core/input.js";
import { SaveService } from "./core/save.js";
import { AudioService, SFX } from "./core/audio.js";
import { AdController } from "./core/ads.js";
import { createGameplayReporter } from "./core/gameplay-events.js";
import { AdaptiveQuality } from "./core/quality.js";
import { initI18n, t } from "./core/i18n.js";
import { createStage } from "./render/stage.js";
import { fontsReady } from "./render/text-texture.js";
import { autopilot, densestUnlit } from "./game/ai.js";
import {
  addStartStrikes, addStrike, createSim, forceFail, forceWin, makeInput, nearestBuilding, plateFor, progress, runCoins,
  startRun, step,
} from "./game/sim.js";
import {
  DEFAULT_SAVE, MIGRATIONS, SKINS, UPGRADES, activeSkin, completionPercent, pickRandomSkin, skinUnlockCost,
  upgradeCost, upgradeLevels,
} from "./game/meta.js";
import { boostDue, boostOffer, cashOffer, dailyGiftOffer, freeUpgradeOffer, reviveOffer, trySkinOffer } from "./game/offers.js";
import { STORM_SAMPLES, STORM_SFX } from "./game/sfx.js";
import { coverLogo } from "./ui/cover-logo.js";
import { themeOf } from "./game/look.js";
import { GameView } from "./game/view.js";
import { createUI } from "./ui/ui.js";

const qs = new URLSearchParams(location.search);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const mmss = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
const pct = (share) => Math.floor(share * 100 + 1e-6);
const UPGRADE_ORDER = Object.keys(UPGRADES);   // Voltage, Fork, Strikes, Capacitor, Gold rods
const PLATE_LADDER = [...STORM.payout.plates].reverse();   // [[0.6, 2], [0.8, 3], [0.95, 5], [1, 10]]

async function boot() {
  const canvas = document.getElementById("game");
  // Flow state is declared before the first await: callbacks that resolve
  // during boot (e.g. adblock detection) must never hit a temporal dead zone.
  let level = 1;                // city number
  let sim = null;
  let runEnded = false;
  let revivesUsed = 0;
  let resumeRamp = 1;
  let boosted = false;          // this city's intro already took the Supercharged start
  let boostIntroRun = -1;       // the run whose intro decided the Supercharged-start cadence ...
  let boostDueNow = false;      // ... and whether it is this intro's turn
  let trialSkin = null;         // "Try it": a locked bolt for this one city
  let shopPreview = null;       // the locked bolt selected in the shop
  let resultsThisSession = 0;   // the daily gift waits for the first result of the session
  let offerTick = 0;
  let qaAutopilot = false;
  let qaHold = null;            // QA/screenshot override for the hold button (null = real input)
  let qaFrozen = false;         // QA screenshot staging: simulation and effects stopped on this frame
  let qaFreezeWhen = null;      // QA: freeze on the first step where this returns true
  let qaFrozenAnims = [];
  const qaFreeze = (on) => {
    qaFrozen = on;
    view.fxScale = 1;
    if (on) {
      // The effects of this very step (bolts, cards, floats) get 0.3 s to draw in, then everything holds.
      setTimeout(() => {
        if (!qaFrozen) return;
        view.fxScale = 0;
        qaFrozenAnims = document.getAnimations().filter((a) => a.playState === "running");
        // A slow frame may leave a fresh card or float at its first keyframe: hold it at least 0.25 s in.
        qaFrozenAnims.forEach((a) => { if ((a.currentTime ?? 0) < 250) a.currentTime = 250; a.pause(); });
      }, 300);
    } else { qaFrozenAnims.forEach((a) => a.play()); qaFrozenAnims = []; }
  };
  let paused = false;
  let lastLit = 0;
  let aim = -1;                 // the targeted building
  let inputMode = "mouse";      // mouse | touch | keys
  let sawSuper = false;         // onboarding: the player released in the gold band at least once
  let panelKey = -1;
  let pillOn = false;
  const pointer = { id: null, down: false, x: 0, y: 0 };
  const offerSeen = new Map();  // surface -> visible, so "offer shown" is logged once per appearance
  const stepIn = makeInput();
  const platform = await initPlatform();
  platform.loadingStart();
  initI18n(platform.systemInfo.locale);
  if (platform.isCrazyGamesApp) document.documentElement.classList.add("in-app");

  const pause = new PauseArbiter([Reason.BOOT]);
  const gameplay = createGameplayReporter(platform, pause);
  const save = new SaveService({ key: `${GAME.slug}.save`, version: GAME.saveVersion, defaults: DEFAULT_SAVE, migrations: MIGRATIONS }).init(platform);
  const audio = new AudioService({ sounds: { ...SFX, ...STORM_SFX }, samples: STORM_SAMPLES, userMuted: save.data.userMuted }).bindPlatform(platform).installUnlockHandlers(window);
  const input = new Input(canvas, { bindings: { action: ["Space", "Enter"], pause: ["KeyP"] } }).attach();
  const stage = createStage(canvas);
  const quality = new AdaptiveQuality(stage.renderer);
  const touchUI = () => inputMode === "touch" || matchMedia("(pointer: coarse)").matches || platform.systemInfo?.device?.type === "mobile";

  const ui = createUI(document.getElementById("ui"), {
    onSound: toggleSound, onPause: () => (paused ? resumeRun() : pauseRun()), onResume: resumeRun,
    onBuy: buyUpgrade, onFree: freeUpgrade, onBoost: takeBoost, onBoostCoins: buyBoost, onGift: openGift,
    onShop: openShop, onShopClose: closeShop, onSkin: selectSkin, onPreview: previewSkin, onUnlock: unlockRandom,
    onCash: cashForShop, onTry: trySkin,
  });
  const ads = new AdController(pause, audio, ui.adOverlay);
  ads.detectAdblock().then(refreshReady);   // never block boot on this

  await fontsReady();

  // Up to 8 fixed steps per frame: the charge and the cascade stay real-time down to ~8 fps on weak
  // devices (a step costs well under 0.1 ms); below that the spiral guard slows the game instead.
  const loop = new GameLoop({ update, render, maxStepsPerFrame: 8 });
  const view = new GameView(stage, { audio, ui, loop });
  /** The skin hook: the bolt colour (and the whole skin object, for the look pass) of the equipped or tried bolt. */
  const applySkin = () => { const k = activeSkin(save.data, trialSkin); view.recolor(k.glow, k); };
  applySkin();

  const themeName = () => t(`theme_${themeOf(sim.city).id}`);
  const cityMode = () => t("city_mode", { n: level, theme: themeName() });

  function loadLevel(n) {
    level = n;
    sim = createSim({ level: n, seed: `city-${n}`, up: upgradeLevels(save.data), extraStrikes: boosted ? OFFERS.boostStrikes : 0 });
    runEnded = false;
    lastLit = 0;
    view.build(sim);
    aim = -1;
    ui.setPowered(0, false);
    ui.setStrikes(sim.strikesLeft, sim.strikesMax);
    ui.setCharge(null);
    ui.showPill(null);
    pillOn = false;
  }

  function enterReady() {
    // Supercharged start's cadence is decided once per intro (re-entering from the shop keeps it).
    if (boostIntroRun !== save.data.runs) {
      boostIntroRun = save.data.runs;
      boostDueNow = boostDue(save.data, Date.now());
      if (boostDueNow) save.update((d) => { d.lastBoostRun = d.runs; d.lastBoostAt = Date.now(); });
    }
    const keys = inputMode === "keys";
    ui.showHome(true, {
      title: t("title"), mode: cityMode(), main: t("hint_hold"),
      sub: keys ? t("hint_sub_keys", { keys: input.movementLabel }) : t("hint_sub_pointer"), icon: touchUI() ? "finger" : keys ? "keys" : "mouse",
    });
    ui.showRoundHud(false);
    refreshReady();
  }

  /** The first press on the city (or Space / Enter) starts the run; the same press charges the first strike. */
  function tryStartRun() {
    if (!sim || sim.phase !== "ready" || !canPlay()) return false;
    startRun(sim);
    ui.showHome(false);
    ui.showRoundHud(true);
    ui.showUpgrades(null);
    ui.showBoost(null);
    ui.showShopButton(false);
    ui.showGift(false);
    view.setSafeArea(null);   // the run framing: the city as big as the HUD allows
    offerSeen.clear();
    gameplay.setPlaying(true);
    platform.setGameContext({ city: level });
    save.update((d) => { d.runs++; });
    return true;
  }

  const canPlay = () => !paused && !pause.has(Reason.MENU) && !pause.has(Reason.AD) && !pause.has(Reason.BOOT) && !ui.shopOpen && !ui.modalOpen;

  // ---------------------------------------------------------------- pointer: press = aim + charge, release = strike
  const local = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener("pointerdown", (e) => {
    if (pointer.id !== null || e.button > 0) return;             // a second finger (or button) is ignored
    if (!sim || (sim.phase !== "ready" && sim.phase !== "run") || !canPlay()) return;
    [pointer.x, pointer.y] = local(e);
    pointer.id = e.pointerId;
    pointer.down = true;
    inputMode = e.pointerType === "touch" ? "touch" : "mouse";
    aim = view.pick(sim, pointer.x, pointer.y);
    if (sim.phase === "ready") tryStartRun();
  });
  canvas.addEventListener("pointermove", (e) => {
    const holding = e.pointerId === pointer.id;
    if (!holding && e.pointerType !== "mouse") return;
    if (!sim || (sim.phase !== "ready" && sim.phase !== "run") || !canPlay()) return;
    [pointer.x, pointer.y] = local(e);
    // A mouse press locks its building as the target until release: the camera keeps moving while it charges, so the
    // cursor drifts over other buildings, but the strike goes where the press started.
    if (holding && e.pointerType === "mouse") return;
    if (holding || e.pointerType === "mouse") { aim = view.pick(sim, pointer.x, pointer.y); if (!holding) inputMode = "mouse"; }
  }, { passive: true });
  const pointerUp = (e) => { if (e.pointerId === pointer.id) { pointer.down = false; pointer.id = null; } };
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointercancel", pointerUp);
  window.addEventListener("blur", () => { pointer.down = false; pointer.id = null; });
  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyM" && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) toggleSound();
  });

  // ---------------------------------------------------------------- pause (P / pause button; Escape is never bound)
  function pauseRun() {
    if (paused || sim?.phase !== "run" || runEnded) return;
    paused = true;
    pointer.down = false;
    pointer.id = null;
    pause.hold(Reason.DIALOG);
    ui.setCharge(null);
    const touch = touchUI();
    ui.showPaused(true, { title: t("paused"), sub: t(touch ? "tap_resume" : "click_resume"), keys: touch ? "" : t("pause_keys") });
  }

  function resumeRun() {
    if (!paused) return;
    paused = false;
    ui.showPaused(false);
    pause.release(Reason.DIALOG);
  }

  // ---------------------------------------------------------------- simulation step
  function update(dt) {
    if (qaFrozen) return;
    if (input.justPressed("pause")) { if (paused) resumeRun(); else pauseRun(); }
    const live = sim.phase === "ready" || sim.phase === "run";
    if (live && canPlay()) {
      // Keyboard crosshair: arrows / WASD step between antennas in that screen direction.
      const dx = (input.justPressed("right") ? 1 : 0) - (input.justPressed("left") ? 1 : 0);
      const dy = (input.justPressed("down") ? 1 : 0) - (input.justPressed("up") ? 1 : 0);
      if (dx || dy) { inputMode = "keys"; aim = view.stepAim(sim, aim, dx, dy); }
      if (input.justPressed("action")) {
        if (inputMode !== "keys" && !pointer.down) inputMode = "keys";
        if (aim < 0) aim = view.pick(sim, stage.size.width / 2, stage.size.height / 2);
        if (sim.phase === "ready") tryStartRun();
      }
    }
    if (sim.phase === "run") {
      if (qaAutopilot) autopilot(sim, stepIn);
      else {
        stepIn.hold = qaHold ?? (!paused && (pointer.down || input.held("action")));
        stepIn.aim = aim;
      }
    } else stepIn.hold = false;
    step(sim, dt, stepIn);
    input.endStep();
    if (qaAutopilot && stepIn.aim >= 0) aim = stepIn.aim;
    if (qaFreezeWhen && qaFreezeWhen(sim)) { qaFreezeWhen = null; qaFreeze(true); }
    if ((sim.phase === "won" || sim.phase === "failed") && !runEnded) onRunEnd();
  }

  function render(alpha, dt) {
    stage.resize();
    if (resumeRamp < 1) { resumeRamp = Math.min(1, resumeRamp + dt * 2); loop.timeScale = 0.25 + 0.75 * resumeRamp; }
    const live = sim.phase === "ready" || sim.phase === "run";
    view.aim.index = aim;
    view.aim.visible = live && !paused && aim >= 0 && (inputMode !== "touch" || sim.holding);
    view.update(sim, alpha, dt);
    hud();
    ui.update(dt * view.fxScale);
    offerTick += dt;
    if (offerTick >= 0.5) { offerTick = 0; tickOffers(); }
    quality.update(loop.frameMs, dt);
    stage.render();
  }

  // ---------------------------------------------------------------- run HUD
  function hud() {
    if (sim.litCount !== lastLit) { ui.setPowered(progress(sim), sim.litCount > lastLit); lastLit = sim.litCount; }
    ui.setStrikes(sim.strikesLeft, sim.strikesMax);
    // City panel: rebuilt only when a number changes (no per-frame strings).
    const pk = (((level * 16 + sim.strikesLeft) * 16 + sim.strikesMax) * 4096 + sim.districtsDone * 512 + sim.bestChain) * 2 + (stage.size.aspect < 1 ? 1 : 0);
    if (pk !== panelKey && sim.phase !== "ready") {
      panelKey = pk;
      ui.setPanel(t("city_n", { n: level }), [
        [`${sim.strikesLeft}/${sim.strikesMax}`, t("strikes"), ""],
        [`${sim.districtsDone}/${sim.city.districts.length}`, t("blocks"), ""],
        [String(sim.bestChain), t("best_chain"), ""],
      ]);
    }
    // Keyboard players: after a cascade the crosshair slides to the nearest dark building.
    if (inputMode === "keys" && sim.phase === "run" && !sim.holding && sim.bolts.length === 0 && aim >= 0 && sim.lit[aim]) {
      const b = sim.city.buildings[aim];
      const u = nearestBuilding(sim, b.x, b.z, true);
      if (u >= 0) aim = u;
    }
    // Onboarding: until the first SUPERCHARGE, a pill while charging.
    if (sim.lastRelease?.band === "super") sawSuper = true;
    const wantPill = sim.phase === "run" && sim.holding && !sawSuper && save.data.runs <= 3;
    if (wantPill !== pillOn) { pillOn = wantPill; ui.showPill(wantPill ? t("pill_band") : null, "bolt"); }
  }

  // ---------------------------------------------------------------- flow
  /** The last cascade ended (or the city is fully powered). */
  async function onRunEnd() {
    runEnded = true;
    pointer.down = false;
    ui.setCharge(null);
    ui.showPill(null);
    pillOn = false;
    if (paused) { paused = false; ui.showPaused(false); pause.release(Reason.DIALOG); }
    const share = progress(sim);
    const offer = ads.rewardedAvailability;
    if (!reviveOffer({ available: offer.ok, revivesUsed, progress: share })) { showCityResult(); return; }

    // "One more strike": Finish (the decline) and the offer share one button style and appear together.
    // The ring counts down; at 0 it removes the offer - it never accepts it.
    gameplay.setPlaying(false);
    await wait(700);
    pause.hold(Reason.MENU);
    ads.beginBreak("fail");
    let reviveOpen = true;
    const left = sim.city.buildings.length - sim.litCount;
    const dlg = ui.showResult({
      kind: "fail",
      mode: cityMode(),
      title: t("so_close"),
      stats: [left === 1 ? t("near_full_1", { p: pct(share) }) : t("near_full_n", { p: pct(share), k: left })],
      amount: null,
      buttons: [{ id: "finish", label: t("finish") }, { id: "revive", label: t("one_more_strike"), video: true }],
      timed: { id: "revive", seconds: OFFERS.reviveCountdownSec, onExpire: () => { reviveOpen = false; ads.offer("fail-revive", "expired"); } },
    });
    ads.offer("fail-revive");

    dlg.onChoice(async (id) => {
      audio.play("click");
      if (id === "revive") {
        dlg.lock(true);
        const r = await ads.rewarded({ context: "fail-revive", isContinue: true, grant: () => { revivesUsed++; } });
        dlg.lock(false);
        if (r.shown) {
          dlg.close();
          ads.endBreak();
          addStrike(sim);
          runEnded = false;
          pause.release(Reason.MENU);
          gameplay.setPlaying(true);
          resumeRamp = 0;
          loop.timeScale = 0.25;
          return;
        }
        reviveOpen = false;
        dlg.hideButton("revive");
        dlg.setNote(r.reason === "adblock" ? t("adblock_notice") : t("no_video"));
        return;
      }
      if (reviveOpen) ads.offer("fail-revive", "declined");
      dlg.close();
      ads.endBreak();
      pause.release(Reason.MENU);
      showCityResult();
    });
  }

  /** % powered -> jackpot plate -> coins; Claim / Claim x3; next city (>= 60%) or the same city again. */
  async function showCityResult() {
    gameplay.setPlaying(false);
    resultsThisSession++;
    platform.clearGameContext();
    const share = progress(sim);
    const plate = plateFor(share);
    const won = sim.phase === "won";
    const reward = runCoins(sim);
    const city = level;
    const firstFull = share >= 1 && save.data.fullPowers === 0;
    const bestBefore = save.data.bestLevel;
    save.update((d) => {
      d.coins += reward;
      if (won) { d.level = city + 1; d.bestLevel = Math.max(d.bestLevel, city + 1); d.wins++; }
      if (share >= 1) d.fullPowers++;
      d.bestShare = Math.max(d.bestShare, share);
      d.bestChain = Math.max(d.bestChain, sim.bestChain);
      d.plates = { ...d.plates, [city]: Math.max(d.plates[city] || 0, plate.mult) };
    });
    save.flush();
    platform.reportCompletion(completionPercent(save.data.bestLevel));
    // happytime sparingly: the first FULL POWER ever, reaching city 20 and city 40.
    if (firstFull || (bestBefore < 20 && save.data.bestLevel >= 20) || (bestBefore < 40 && save.data.bestLevel >= 40)) platform.happytime();

    await wait(won ? 1300 : 900);   // the camera orbits the lit city first
    pause.hold(Reason.MENU);
    ads.beginBreak("level-complete");
    const offer = ads.rewardedAvailability;
    const videoOk = offer.ok && save.data.runs >= 2;   // city 1's first result has no video offer
    const n = sim.city.buildings.length;
    let note = "";
    if (!won) note = t("near_pass", { p: pct(share), d: Math.max(1, Math.ceil((STORM.payout.passAt - share) * 100)) });
    else if (share < 1) {
      // The true near-miss to the next plate, in buildings ("94% - one building short of x5").
      const [at, mult] = PLATE_LADDER.find(([a]) => a > share + 1e-9);
      const k = Math.max(1, Math.ceil(at * n - 1e-9) - sim.litCount);
      if (mult === 10) note = k === 1 ? t("near_full_1", { p: pct(share) }) : t("near_full_n", { p: pct(share), k });
      else if (k <= 3) note = k === 1 ? t("near_plate_1", { p: pct(share), m: mult }) : t("near_plate_n", { p: pct(share), k, m: mult });
    }
    if (offer.reason === "adblock") note = t("adblock_notice");
    const dlg = ui.showResult({
      kind: won ? "win" : "fail",
      mode: cityMode(),
      title: share >= 1 ? t("full_power") : t(won ? "city_cleared" : "city_dark", { p: pct(share) }),
      plates: PLATE_LADDER.map(([at, mult]) => ({ at, mult, on: mult === plate.mult })),
      stats: [t("stat_lit", { a: sim.litCount, b: n }), t("stat_blocks", { a: sim.districtsDone, b: sim.city.districts.length }), t("stat_chain", { n: sim.bestChain })],
      amount: reward,
      crate: plate.mult > 1 ? t("jackpot", { m: plate.mult }) : "",
      buttons: [won ? { id: "claim", label: t("claim") } : { id: "retry", label: t("retry") }, videoOk ? { id: "claim_x", label: t("claim_x", { m: 3 }), video: true } : null],
      note,
    });
    if (videoOk) ads.offer("level-complete-x3");
    let rewardedShown = false;

    dlg.onChoice(async (id) => {
      audio.play("click");
      if (id === "claim_x") {
        dlg.lock(true);
        const r = await ads.rewarded({
          context: "level-complete-x3",
          grant: () => { save.update((d) => { d.coins += reward * 2; }); dlg.setAmount(reward * 3); },
        });
        dlg.lock(false);
        if (r.shown) { rewardedShown = true; save.flush(); audio.play("coin"); await wait(450); return finish(); }
        dlg.hideButton("claim_x");
        dlg.setNote(r.reason === "adblock" ? t("adblock_notice") : t("no_video"));
        return;
      }
      finish();
    });

    async function finish() {
      ui.coinsFly(dlg.amountElement, reward);
      ui.setCoins(save.data.coins, { animate: true });
      dlg.close();
      await wait(250);
      // Natural break on "Next city" / "Retry". Skipped right after a rewarded video: two ads back to back is bad UX.
      if (city >= GAME.firstMidgameLevel && !rewardedShown) await ads.midgame({ context: won ? "level-complete-next" : "retry" });
      ads.endBreak();
      boosted = false;
      if (trialSkin) { ui.toast(t("trial_over", { name: t(`skin_${trialSkin}`) })); trialSkin = null; applySkin(); }
      loadLevel(won ? city + 1 : city);
      pause.release(Reason.MENU);
      enterReady();
    }
  }

  // ---------------------------------------------------------------- meta
  const offerCtx = () => ({ available: ads.rewardedAvailability.ok, now: Date.now() });

  /** The funnel's first step: log "offer shown" once per appearance of a surface. */
  function seen(context, visible) {
    if (visible && !offerSeen.get(context)) ads.offer(context);
    offerSeen.set(context, visible);
  }

  function upgradeModel() {
    const ctx = offerCtx();
    const items = UPGRADE_ORDER.map((kind) => {
      const cost = upgradeCost(kind, save.data);
      return {
        kind,
        title: t(`up_${kind}`),
        level: save.data[UPGRADES[kind].key] + 1,
        cost,
        affordable: cost !== null && save.data.coins >= cost,
        maxed: cost === null,
        free: freeUpgradeOffer(kind, save.data, ctx),
      };
    });
    // At most OFFERS.maxVideoOffersPerScreen video buttons on the intro (CG-ADS-011: rewarded
    // ads are "special opportunities"): the boost counts as one, then the cheapest FREE upgrade.
    const budget = OFFERS.maxVideoOffersPerScreen - (boostModel()?.video ? 1 : 0);
    items.filter((it) => it.free.visible).sort((x, y) => x.cost - y.cost).slice(Math.max(0, budget)).forEach((it) => { it.free = { visible: false }; });
    return items;
  }

  /** Supercharged start on this intro: the video button and its coin path (the same reward for coins). */
  function boostModel() {
    const b = boostOffer(save.data, { available: ads.rewardedAvailability.ok, due: boostDueNow, boostedThisRun: boosted });
    if (!b.visible && !b.coin) return null;
    const label = t("start_boost", { n: b.strikes });
    return { video: b.visible ? { label } : null, coin: b.coin ? { label, cost: b.cost, affordable: b.affordable } : null };
  }

  function giftModel() {
    return dailyGiftOffer(save.data, { available: ads.rewardedAvailability.ok, now: Date.now(), resultsThisSession });
  }

  /** Keep the city clear of the intro's cards and offers (measured after layout). */
  function updateSafeArea() {
    if (sim?.phase !== "ready") return;
    const a = ui.readyInsets();
    const pad = 10;
    view.setSafeArea({ top: a.top + pad, bottom: a.bottom + pad, left: a.left + pad, right: a.right + pad });
  }

  /** City intro: upgrades (after the first cleared city), boost (after the first runs), shop (after run 1). */
  function refreshReady() {
    if (!sim || sim.phase !== "ready" || ui.shopOpen) return;
    const upgrades = save.data.wins > 0 ? upgradeModel() : null;   // first session: nothing before the first city
    ui.showUpgrades(upgrades);
    seen("free-upgrade", !!upgrades?.some((u) => u.free.visible));
    const boost = boostModel();
    ui.showBoost(boost);
    seen("ready-boost", !!boost?.video);
    ui.showShopButton(save.data.runs > 0);
    ui.showGift(giftModel().visible);
    requestAnimationFrame(updateSafeArea);
  }

  /** Twice a second: cooldowns that end while the player idles on a screen. */
  function tickOffers() {
    if (ui.shopOpen) { ui.updateShop(shopModel()); return; }
    if (sim?.phase !== "ready" || pause.reasons.length) return;
    const boost = boostModel();
    if (!!boost?.video !== !!offerSeen.get("ready-boost")) { ui.showBoost(boost); seen("ready-boost", !!boost?.video); }
    updateSafeArea();
  }

  /** Upgrades change the storm's numbers: rebuild this city's simulation (same layout; gold rods may appear). */
  function applyUpgrade(kind) {
    save.update((d) => { d[UPGRADES[kind].key]++; });
    if (sim.phase === "ready") loadLevel(level);
    audio.play("tier", { pitch: 1.2 });
    refreshReady();
    ui.popUpgrade(kind, t(`up_fx_${kind}`));
  }

  function grantBoost() {
    boosted = true;
    addStartStrikes(sim, OFFERS.boostStrikes);
    ui.setStrikes(sim.strikesLeft, sim.strikesMax);
    ui.floatText(stage.size.width / 2, stage.size.height * 0.45, t("boosted", { n: OFFERS.boostStrikes }), "gold");
    audio.play("tier", { pitch: 1.35 });
  }

  async function takeBoost() {
    if (sim.phase !== "ready" || boosted || pause.has(Reason.AD) || pause.has(Reason.MENU)) return;
    const r = await ads.rewarded({ context: "ready-boost", grant: grantBoost });
    if (!r.shown) ui.toast(r.reason === "adblock" ? t("adblock_notice") : t("no_video"));
    save.flush();
    refreshReady();
  }

  /** Supercharged start's coin path: the same +2 strikes for the next Voltage level's price. */
  function buyBoost(btn) {
    if (sim.phase !== "ready" || boosted || pause.has(Reason.AD) || pause.has(Reason.MENU)) return;
    const b = boostOffer(save.data, { available: false, due: boostDueNow, boostedThisRun: boosted });
    if (!b.coin) return;
    if (save.data.coins < b.cost) { audio.play("gateBad", { volume: 0.5 }); ui.shakeElement(btn); ui.toast(t("need_coins")); return; }
    save.update((d) => { d.coins -= b.cost; });
    ui.setCoins(save.data.coins, { animate: true });
    grantBoost();
    save.flush();
    refreshReady();
  }

  // ---------------------------------------------------------------- daily gift
  /** The gift icon's dialog: Collect, or Collect xN with a video. Never blocks play: it is optional. */
  function openGift() {
    const g = giftModel();
    if (!g.visible || sim.phase !== "ready" || ui.shopOpen || ui.modalOpen || pause.has(Reason.AD) || pause.has(Reason.MENU)) return;
    pause.hold(Reason.MENU);
    // One screen at a time: the intro's offers step aside while the gift dialog is open (max 2 video buttons).
    ui.showGift(false);
    ui.showUpgrades(null);
    ui.showBoost(null);
    ui.showShopButton(false);
    offerSeen.delete("ready-boost");
    offerSeen.delete("free-upgrade");
    audio.play("click");
    const dlg = ui.showResult({
      kind: "win",
      mode: t("gift_mode", { n: g.streak, m: g.mult.toFixed(2).replace(/\.?0+$/, "") }),
      title: t("gift_title"),
      amount: g.amount,
      buttons: [{ id: "collect", label: t("collect") }, g.video ? { id: "collect_x", label: t("collect_x", { m: g.factor }), video: true } : null],
      note: ads.rewardedAvailability.reason === "adblock" ? t("adblock_notice") : t("gift_note", { n: Math.min(7, g.streak + 1) }),
    });
    if (g.video) ads.offer("daily-gift");
    let total = g.amount;
    const take = () => save.update((d) => { d.lastGiftDay = g.day; d.giftStreak = g.streak; });
    dlg.onChoice(async (id) => {
      if (id === "collect_x") {
        dlg.lock(true);
        const r = await ads.rewarded({
          context: "daily-gift",
          grant: () => { total = g.amount * g.factor; save.update((d) => { d.coins += total; }); take(); dlg.setAmount(total); },
        });
        dlg.lock(false);
        if (r.shown) { audio.play("coin"); await wait(450); return done(); }
        dlg.hideButton("collect_x");
        dlg.setNote(r.reason === "adblock" ? t("adblock_notice") : t("no_video"));
        return;
      }
      audio.play("click");
      if (g.video) ads.offer("daily-gift", "declined");
      save.update((d) => { d.coins += total; });
      take();
      done();
    });
    function done() {
      save.flush();
      ui.coinsFly(dlg.amountElement, total);
      ui.setCoins(save.data.coins, { animate: true });
      dlg.close();
      pause.release(Reason.MENU);
      refreshReady();
    }
  }

  // ---------------------------------------------------------------- bolt shop
  function shopModel() {
    const ctx = offerCtx();
    const cost = skinUnlockCost(save.data);
    const cash = cashOffer(save.data, ctx);
    const wanting = cost !== null && save.data.coins < cost;
    const preview = shopPreview && !save.data.owned.includes(shopPreview) ? shopPreview : null;
    const canTry = trySkinOffer(save.data, preview, { available: ctx.available, trialActive: !!trialSkin });
    let note = "";
    if (cost === null) note = t("all_skins");
    else if (preview && save.data.tried.includes(preview)) note = t("tried_already");
    else if (canTry) note = t("try_once");
    else if (wanting && ads.rewardedAvailability.reason === "adblock") note = t("adblock_notice");
    else if (wanting && ctx.available && cash.cooldown > 0) note = t("free_coins_in", { t: mmss(cash.cooldown) });
    const shown = preview || trialSkin || save.data.skin;
    return {
      title: t("skins"),
      count: t("owned_count", { a: save.data.owned.length, b: SKINS.length }),
      skins: SKINS.map((s) => ({ id: s.id, name: t(`skin_${s.id}`), color: s.glow, owned: save.data.owned.includes(s.id), selected: save.data.skin === s.id, preview: s.id === preview })),
      name: `${t(`skin_${shown}`)}${preview ? ` · ${t("locked")}` : ""}`,
      unlock: cost === null ? null : { label: t("unlock_random"), cost, affordable: !wanting },
      tryIt: canTry ? { label: t("try_it") } : null,
      cash: cash.visible ? { amount: cash.amount } : null,
      note,
    };
  }

  function openShop() {
    if (sim.phase !== "ready" || ui.shopOpen || pause.has(Reason.AD) || pause.has(Reason.MENU)) return;
    pause.hold(Reason.MENU);
    ui.showHome(false);
    ui.showUpgrades(null);
    ui.showBoost(null);
    ui.showShopButton(false);
    offerSeen.delete("ready-boost");
    shopPreview = null;
    ui.showGift(false);
    const model = shopModel();
    ui.openShop(model);
    seen("shop-cash", !!model.cash);
    audio.play("click");
  }

  function closeShop() {
    if (!ui.shopOpen || pause.has(Reason.AD)) return;
    ui.closeShop();
    offerSeen.delete("shop-cash");
    offerSeen.delete("try-skin");
    shopPreview = null;
    pause.release(Reason.MENU);
    audio.play("click");
    enterReady();
  }

  function selectSkin(id) {
    if (!save.data.owned.includes(id) || save.data.skin === id || pause.has(Reason.AD)) return;
    save.update((d) => { d.skin = id; });
    shopPreview = null;
    applySkin();
    audio.play("pop", { pitch: 1.2 });
    ui.updateShop(shopModel());
    seen("try-skin", false);
  }

  /** A locked bolt tapped in the shop: show its name, and "Try it" when it may be tried. */
  function previewSkin(id) {
    if (save.data.owned.includes(id) || pause.has(Reason.AD)) return;
    shopPreview = shopPreview === id ? null : id;
    audio.play("pop", { pitch: 0.9 });
    const m = shopModel();
    ui.updateShop(m);
    seen("try-skin", !!m.tryIt);
  }

  /** "Try it": one city with the previewed locked bolt (rewarded, once per skin). */
  async function trySkin() {
    const id = shopPreview;
    if (!trySkinOffer(save.data, id, { available: ads.rewardedAvailability.ok, trialActive: !!trialSkin }) || pause.has(Reason.AD)) return;
    const r = await ads.rewarded({
      context: "try-skin",
      grant: () => { trialSkin = id; save.update((d) => { d.tried = [...d.tried, id]; }); applySkin(); },
    });
    save.flush();
    if (r.shown) {
      audio.play("tier", { pitch: 1.3 });
      ui.toast(t("trying", { name: t(`skin_${id}`) }));
      shopPreview = null;
      closeShop();
      return;
    }
    ui.toast(r.reason === "adblock" ? t("adblock_notice") : t("no_video"));
    ui.updateShop(shopModel());
  }

  function unlockRandom(btn) {
    const cost = skinUnlockCost(save.data);
    if (cost === null || pause.has(Reason.AD)) return;
    if (save.data.coins < cost) {
      audio.play("gateBad", { volume: 0.5 });
      ui.shakeElement(btn);
      ui.toast(t("need_coins"));
      return;
    }
    // Meta randomness is cosmetic and bought with earned coins only - never with money.
    const id = pickRandomSkin(save.data, Math.random);
    save.update((d) => { d.coins -= cost; d.owned.push(id); d.skin = id; });
    save.flush();
    shopPreview = null;
    if (trialSkin === id) trialSkin = null;
    ui.setCoins(save.data.coins, { animate: true });
    applySkin();
    ui.updateShop(shopModel());
    seen("shop-cash", !!shopModel().cash);
    ui.popSwatch(id);
    audio.play("tier", { pitch: 1.3 });
    ui.toast(t("new_skin"));
  }

  async function cashForShop(btn) {
    const offer = cashOffer(save.data, offerCtx());
    if (!offer.visible || pause.has(Reason.AD)) return;
    const r = await ads.rewarded({
      context: "shop-cash",
      grant: () => { save.update((d) => { d.coins += offer.amount; d.lastCashAt = Date.now(); }); },
    });
    if (r.shown) {
      ui.coinsFly(btn, offer.amount);
      ui.setCoins(save.data.coins, { animate: true });
      audio.play("coin");
    } else {
      ui.toast(r.reason === "adblock" ? t("adblock_notice") : t("no_video"));
    }
    save.flush();
    ui.updateShop(shopModel());
    offerSeen.set("shop-cash", !!shopModel().cash);
  }

  function buyUpgrade(kind) {
    if (sim.phase !== "ready" || pause.has(Reason.AD)) return;
    const cost = upgradeCost(kind, save.data);
    if (cost === null) return;
    if (save.data.coins < cost) { audio.play("gateBad", { volume: 0.5 }); return; }
    save.update((d) => { d.coins -= cost; });
    ui.setCoins(save.data.coins, { animate: true });
    applyUpgrade(kind);
  }

  async function freeUpgrade(kind) {
    if (sim.phase !== "ready" || pause.has(Reason.AD)) return;
    const r = await ads.rewarded({
      context: "free-upgrade",
      grant: () => { save.update((d) => { d.lastFreeUpgradeAt = Date.now(); }); applyUpgrade(kind); },
    });
    if (!r.shown) ui.toast(r.reason === "adblock" ? t("adblock_notice") : t("no_video"));
    save.flush();
    refreshReady();
  }

  function toggleSound() {
    const r = audio.toggleUserMute();
    save.update((d) => { d.userMuted = r.userMute; });
    ui.setSound(audio.state);
    if (r.lockedByPlatform) ui.toast(t("muted_by_platform"));
  }
  audio.onChange((s) => ui.setSound(s));

  // ---------------------------------------------------------------- pause wiring
  pause.onChange(({ reasons }) => {
    const blocked = reasons.length > 0;
    loop.setSimPaused(blocked);
    audio.setHiddenMute(reasons.includes(Reason.HIDDEN));
    if (blocked) { pointer.down = false; pointer.id = null; }
    if (!blocked && sim?.phase === "run") { resumeRamp = 0; loop.timeScale = 0.25; }
  });
  // On hide: always write (a timestamp), so the save is flushed even when the debounced write
  // already went out - the last reliable moment on mobile (pagehide).
  watchInterruptions(pause, {
    onHide: () => {
      save.update((d) => { d.lastSeenAt = Date.now(); if (sim) d.bestChain = Math.max(d.bestChain, sim.bestChain); });
      save.flush();
    },
    interactionTarget: canvas,
  });

  // ---------------------------------------------------------------- marketing capture modes
  // ?cover=landscape|portrait|square -> composed hero shot (tools/launch/capture-covers.mjs)
  // ?capture=1                        -> deterministic autoplay (tools/launch/record-preview.mjs)
  // Both render the real game, so covers and preview videos stay honest about
  // what players get (CG-QUAL-006). Nothing here is reachable in normal play.
  async function startMarketingMode(kind) {
    const uiRoot = document.getElementById("ui");
    uiRoot.classList.add("marketing");
    document.getElementById("boot").classList.add("done");
    ui.showHome(false);
    // ?capture_up=V,F,S,C,G: the storm of a real mid-game save (upgrade levels; this context only, never flushed)
    const up = (qs.get("capture_up") || "").split(",").map(Number);
    if (up.length === 5 && up.every(Number.isFinite)) [save.data.upVoltage, save.data.upFork, save.data.upStrikes, save.data.upCapacitor, save.data.upGold] = up;
    loadLevel(Number(qs.get(kind ? "cover_level" : "capture_level") || 8));
    startRun(sim);
    ui.showRoundHud(!kind);
    if (kind) {
      uiRoot.classList.add("cover");
      uiRoot.appendChild(coverLogo(t("title"), qs.get("cover_style") || undefined));
      // ?cover_share of the city powered (the lit colours fill the frame; the store covers use 0.85), then freeze mid-cascade.
      const stopAt = Number(qs.get("cover_share") || 0.7);
      for (let i = 0; i < 60 * 40 && sim.phase === "run"; i++) {
        autopilot(sim, stepIn); step(sim, 1 / 60, stepIn);
        if (progress(sim) >= stopAt && sim.bolts.length >= 2) break;
      }
      // A still needs its bolts to outlive their 0.6 s flash: hold the newest hops on screen. The strike from the cloud
      // is the logo's own bolt, so the game's frozen strike would only compete with it.
      const hops = sim.events.filter((e) => e.type === "hop" && e.t > sim.t - 0.6).slice(-12);
      loop.setSimPaused(true);
      view.holdBolts(sim, null, hops);
      // Hero framing (store covers only): lower and closer than play, so the sky and the storm cloud sit behind the
      // title and the lit towers fill the frame. ?cover_pitch / cover_dist (x city size) / cover_ty (x tallest tip) /
      // cover_yaw tune it. The narrow portrait turns to 45 deg so the storm front's bulk sits in the frame.
      const H = { landscape: [15, 1.08, 35], square: [16, 1.3, 35], portrait: [17, 1.4, 45] }[kind] ?? [15, 1.08, 35];
      const cp = Number(qs.get("cover_pitch") || H[0]) * Math.PI / 180, cy = Number(qs.get("cover_yaw") || H[2]) * Math.PI / 180;
      const cd = Math.max(sim.city.width, sim.city.depth) * Number(qs.get("cover_dist") || H[1]);
      const cty = view.cityMesh.top * Number(qs.get("cover_ty") || 0.55);
      view.setCameraOverride({ pos: [Math.sin(cy) * Math.cos(cp) * cd, cty + Math.sin(cp) * cd, Math.cos(cy) * Math.cos(cp) * cd], look: [0, cty, 0] });
      loop.start();
      await wait(1200);
      window.__GS_COVER_READY__ = true;
      return;
    }
    sim.events.length = 0;
    view.snapCamera(sim);
    let frames = 0;
    // ?capture_next=N: 2.2 s after the win, cut to city N (another theme) instead of orbiting a finished city.
    const next = Number(qs.get("capture_next") || 0);
    let wonFor = 0;
    window.__GS_CAPTURE__ = {
      frame(dt = 1 / 30) {
        if (next && level !== next && sim.phase === "won" && (wonFor += dt) >= 2.2) {
          loadLevel(next);
          startRun(sim);
          sim.events.length = 0;
          view.snapCamera(sim);
        }
        const steps = Math.max(1, Math.round(dt * 60));
        for (let i = 0; i < steps; i++) { autopilot(sim, stepIn); step(sim, 1 / 60, stepIn); }
        aim = stepIn.aim;
        view.aim.index = aim;
        view.aim.visible = sim.phase === "run";
        stage.resize();
        view.update(sim, 1, dt);
        hud();
        ui.update(dt);
        stage.render();
        return { frame: ++frames, phase: sim.phase, progress: progress(sim) };
      },
    };
  }

  const coverKind = qs.get("cover");
  if (coverKind || qs.get("capture") === "1") return startMarketingMode(coverKind);

  // ---------------------------------------------------------------- start
  const qa = qs.get("qa") === "1";
  const qaLevel = qa ? Number(qs.get("level")) : 0;
  // QA fixtures (?qa=1 only): a returning player's runs / wins / coins, so the harness reaches
  // the boost, upgrade and shop surfaces without playing ten cities first.
  if (qa && Number(qs.get("runs")) > 0) save.update((d) => { d.runs = Math.max(d.runs, Number(qs.get("runs"))); });
  if (qa && qs.has("coins")) save.update((d) => { d.coins = Math.max(0, Number(qs.get("coins")) || 0); });
  if (qa && Number(qs.get("wins")) > 0) save.update((d) => { d.wins = Math.max(d.wins, Number(qs.get("wins"))); });
  // ?up=voltage,fork,strikes,capacitor,gold - upgrade levels (screenshots of a mid-campaign storm).
  if (qa && qs.has("up")) {
    const lv = qs.get("up").split(",").map((v) => Math.max(0, Number(v) || 0));
    save.update((d) => { ["voltage", "fork", "strikes", "capacitor", "gold"].forEach((k, i) => { d[UPGRADES[k].key] = Math.min(UPGRADES[k].max, lv[i] || 0); }); });
  }
  loadLevel(qaLevel > 0 ? qaLevel : save.data.level);
  stage.resize();
  view.snapCamera(sim);
  ui.setCoins(save.data.coins);
  ui.setSound(audio.state);
  loop.start();
  platform.reportCompletion(completionPercent(save.data.bestLevel));
  platform.loadingStop();
  pause.release(Reason.BOOT);
  document.getElementById("boot").classList.add("done");
  enterReady();
  audio.preload();                         // the recorded sounds (~150 KB) load behind the ready screen

  if (qa) {
    // Feedback timestamps for the dead-air check: every sound and floating number the
    // player gets. Wrapping the instances also catches the calls made from view.js.
    const feedback = [];
    for (const [obj, key] of [[audio, "play"], [ui, "floatText"]]) {
      const original = obj[key].bind(obj);
      obj[key] = (...a) => { feedback.push([Math.round(performance.now()), key, a[0]]); return original(...a); };
    }
    // Read-only window for the QA harness. Harmless in production: it only
    // exists with ?qa=1 and exposes no way to grant ad rewards.
    window.__GS_QA__ = {
      get state() {
        return {
          phase: sim.phase, level, progress: progress(sim), lit: sim.litCount, buildings: sim.city.buildings.length, simT: sim.t,
          strikesLeft: sim.strikesLeft, strikesMax: sim.strikesMax, holding: sim.holding, charge: sim.charge, bolts: sim.bolts.length,
          score: sim.score, bestChain: sim.bestChain, districtsDone: sim.districtsDone, aim, inputMode, paused,
          coins: save.data.coins, pause: pause.reasons, gameplayReported: gameplay.reported,
          firstGameplayStartMs: gameplay.firstStartMs, audio: audio.state, save: save.status,
          platform: { name: platform.name, environment: platform.environment }, fps: loop.stats.fps,
          pixelRatio: stage.renderer.getPixelRatio(), adsLog: ads.log, gameplayHistory: gameplay.history,
          runs: save.data.runs, skin: save.data.skin, owned: [...save.data.owned], boosted, shopOpen: ui.shopOpen,
          trialSkin, tried: [...save.data.tried], boostDue: boostDueNow, giftDay: save.data.lastGiftDay, giftStreak: save.data.giftStreak,
          upgrades: upgradeLevels(save.data), bestLevel: save.data.bestLevel,
        };
      },
      /** The share of the city at which "One more strike" is offered (OFFERS.reviveMinProgress, never at 100%). */
      reviveAt: Math.min(0.99, OFFERS.reviveMinProgress + 0.05),
      feedback,
      start: tryStartRun,
      /** The autopilot plays (dead-air and long-run checks); the player's input is ignored meanwhile. */
      setAutopilot(on) { qaAutopilot = !!on; },
      /** Screenshot staging: hold the strike button (true/false) or give it back to the player (null). */
      setHold(on) { qaHold = on === null ? null : !!on; },
      /** Screenshot staging: aim at a building (-1: the densest dark area). */
      setAim(i = -1) { aim = i >= 0 ? i : densestUnlit(sim); return aim; },
      /** Screenshot staging: freeze the simulation AND the effects on the current frame (true), or run on (false). */
      freeze(on) { qaFreeze(!!on); },
      get frozen() { return qaFrozen; },
      /**
       * Screenshot staging: freeze on the first simulation step where the condition holds:
       * { charge: 0.85 } while holding, { bolts: 4 } bolts in the air, { district: n } more than n powered blocks.
       */
      freezeWhen(c) {
        qaFreezeWhen = (s) => (c.charge !== undefined && s.holding && s.charge >= c.charge)
          || (c.bolts !== undefined && s.bolts.length >= c.bolts) || (c.district !== undefined && s.districtsDone > c.district);
      },
      /** Ends the run now with the whole city powered (FULL POWER, "won"). */
      forceWin() { forceWin(sim); },
      /** @param {number} [at] share powered 0..1 at which the run ends (the One-more-strike offer needs reviveAt) */
      forceFail(at = 0) { forceFail(sim, at); },
      renderInfo: () => ({ ...stage.renderer.info.render, geometries: stage.renderer.info.memory.geometries, textures: stage.renderer.info.memory.textures, shadowBake: !!window.__GS_LOOK__?.info?.().shadowBake }),
      /** Triangles per unique geometry in the scene - the "not high poly" budget (project.json budgets). */
      sceneStats() {
        const rows = new Map();
        stage.scene.traverse((o) => {
          if (!(o.isMesh || o.isPoints) || !o.geometry?.attributes?.position) return;
          const g = o.geometry;
          const triangles = o.isPoints ? 0 : Math.round((g.index ? g.index.count : g.attributes.position.count) / 3);
          const row = rows.get(g.uuid) || { name: o.name || g.type, triangles, instances: 0 };
          row.instances += o.isInstancedMesh ? o.count : 1;
          rows.set(g.uuid, row);
        });
        const list = [...rows.values()].sort((a, b) => b.triangles - a.triangles);
        return { geometries: list.length, maxGeometryTriangles: list[0]?.triangles ?? 0, heaviest: list.slice(0, 6), all: list };
      },
    };
  }
}

boot().catch((e) => {
  console.error("[boot] failed", e);
});
