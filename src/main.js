/**
 * Boot + game flow controller.
 *
 * Boot order matters:
 *   1. SDK init (awaited, with a timeout) -> loadingStart
 *   2. services: pause, gameplay reporter, save, audio, input, ads
 *   3. renderer + first level built -> loadingStop -> release BOOT
 *   4. player lands IN the level (CG-GAME-001): the run starts on the first
 *      press/drag; gameplayStart fires then, from gameplay-events.js
 *
 * Ad placements in this demo (the surface map in the skill's monetization playbook),
 * and the rule each follows - src/game/offers.js decides visibility and caps:
 *   level complete -> "Claim" or "Claim ×3" (rewarded, same button style)
 *   "Claim"/"Next"  -> midgame from level GAME.firstMidgameLevel on
 *   fail            -> "Retry" (midgame on click) or "Revive" (rewarded, once per session,
 *                      ring countdown that removes the offer at 0 - it never accepts)
 *   ready screen    -> "Start ×2" boost (rewarded, one run, after the first runs, cooldown)
 *                      "FREE" upgrade (rewarded) only when unaffordable, with cooldown
 *   skins shop      -> "Random" unlock for coins (always a new skin) and "+coins" (rewarded)
 *                      only while the unlock is unaffordable, with a visible cooldown timer
 * Everything works with ads off (Basic Launch) and with an ad blocker.
 */

import "@fontsource/lilita-one/latin-400.css";
import "./ui/styles.css";

import { GAME, OFFERS, TUNING } from "./config.js";
import { initPlatform } from "./platform/platform.js";
import { PauseArbiter, Reason, watchInterruptions } from "./core/pause.js";
import { GameLoop } from "./core/loop.js";
import { Input } from "./core/input.js";
import { SaveService } from "./core/save.js";
import { AudioService } from "./core/audio.js";
import { AdController } from "./core/ads.js";
import { createGameplayReporter } from "./core/gameplay-events.js";
import { AdaptiveQuality } from "./core/quality.js";
import { initI18n, t } from "./core/i18n.js";
import { createStage } from "./render/stage.js";
import { fontsReady } from "./render/text-texture.js";
import { themeFor, withSkin } from "./render/palette.js";
import { applyOp, generateLevel } from "./game/level-gen.js";
import { createSim, progress, revive, startRun, step } from "./game/sim.js";
import {
  DEFAULT_SAVE, SKINS, UPGRADES, completionPercent, failReward, levelReward, pickRandomSkin, skinColor,
  skinUnlockCost, startCount, upgradeCost,
} from "./game/meta.js";
import { boostOffer, cashOffer, freeUpgradeOffer, reviveOffer } from "./game/offers.js";
import { GameView } from "./game/view.js";
import { createUI } from "./ui/ui.js";

const qs = new URLSearchParams(location.search);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const mmss = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

async function boot() {
  const canvas = document.getElementById("game");
  // Flow state is declared before the first await: callbacks that resolve
  // during boot (e.g. adblock detection) must never hit a temporal dead zone.
  let level = 1;
  let sim = null;
  let runEnded = false;
  let revivesUsed = 0;
  let resumeRamp = 1;
  let boosted = false;          // this level's ready screen already took the "Start ×2" boost
  let offerTick = 0;
  let shownRunCoins = 0;        // coins picked up this run, shown in the pill before they are banked
  let qaAutopilot = false;
  const offerSeen = new Map();  // surface -> visible, so "offer shown" is logged once per appearance
  const platform = await initPlatform();
  platform.loadingStart();
  initI18n(platform.systemInfo.locale);
  if (platform.isCrazyGamesApp) document.documentElement.classList.add("in-app");

  const pause = new PauseArbiter([Reason.BOOT]);
  const gameplay = createGameplayReporter(platform, pause);
  const save = new SaveService({ key: `${GAME.slug}.save`, version: GAME.saveVersion, defaults: DEFAULT_SAVE }).init(platform);
  const audio = new AudioService({ userMuted: save.data.userMuted }).bindPlatform(platform).installUnlockHandlers(window);
  const input = new Input(canvas).attach();
  const stage = createStage(canvas);
  const quality = new AdaptiveQuality(stage.renderer);

  const ui = createUI(document.getElementById("ui"), {
    onSound: toggleSound, onBuy: buyUpgrade, onFree: freeUpgrade, onBoost: takeBoost,
    onShop: openShop, onShopClose: closeShop, onSkin: selectSkin, onUnlock: unlockRandom, onCash: cashForShop,
  });
  const ads = new AdController(pause, audio, ui.adOverlay);
  ads.detectAdblock().then(refreshReady);   // never block boot on this

  await fontsReady();

  const loop = new GameLoop({ update, render });
  const view = new GameView(stage, { audio, ui, loop });

  const currentTheme = () => withSkin(themeFor(sim.spec.theme), skinColor(save.data));

  function loadLevel(n) {
    level = n;
    sim = createSim(generateLevel(n), startCount(save.data));
    runEnded = false;
    boosted = false;
    view.build(sim.spec, sim, currentTheme());
    ui.setLevel(n);
    ui.setProgress(0);
  }

  function enterReady() {
    const label = input.movementLabel;
    ui.showHint(true, `${label[1]}/${label[3]}`);
    refreshReady();
  }

  function tryStartRun() {
    if (!sim || sim.phase !== "ready" || pause.has(Reason.MENU) || pause.has(Reason.AD)) return;
    startRun(sim);
    ui.showHint(false);
    ui.showUpgrades(null);
    ui.showBoost(null);
    ui.showShopButton(false);
    offerSeen.clear();
    gameplay.setPlaying(true);
    platform.setGameContext({ level, startUnits: Math.round(sim.count) });
    save.update((d) => { d.runs++; });
  }
  canvas.addEventListener("pointerdown", tryStartRun);

  function update(dt) {
    const active = sim.phase === "run" || sim.phase === "battle" || sim.phase === "finish";
    const steer = input.consumeDragX() * TUNING.steerSensitivity;
    const axis = qaAutopilot && active ? autopilotAxis() : input.axis("left", "right");
    if (sim.phase === "ready" && (axis !== 0 || input.justPressed("action") || input.justPressed("up"))) tryStartRun();
    step(sim, dt, active ? { steer, axis } : undefined);
    input.endStep();
    if (!runEnded && sim.phase === "won") onWin();
    else if (!runEnded && sim.phase === "failed") onFail();
  }

  function render(alpha, dt) {
    stage.resize();
    if (resumeRamp < 1) { resumeRamp = Math.min(1, resumeRamp + dt * 2); loop.timeScale = 0.25 + 0.75 * resumeRamp; }
    view.update(sim, alpha, dt);
    syncRunCoins();
    ui.update(dt);
    offerTick += dt;
    if (offerTick >= 0.5) { offerTick = 0; tickOffers(); }
    quality.update(loop.frameMs, dt);
    stage.render();
  }

  /** Coins picked up this run count up in the pill at once; they are banked at the result. */
  function syncRunCoins() {
    if (sim.runCoins === shownRunCoins) return;
    shownRunCoins = sim.runCoins;
    ui.setCoins(save.data.coins + sim.runCoins, { animate: true });
  }

  // ---------------------------------------------------------------- flow
  async function onWin() {
    runEnded = true;
    gameplay.setPlaying(false);
    platform.clearGameContext();
    const reward = levelReward(level, sim.multiplier, save.data) + sim.runCoins;
    const next = level + 1;
    save.update((d) => { d.coins += reward; d.level = next; d.bestLevel = Math.max(d.bestLevel, next); d.wins++; });
    save.flush();
    platform.reportCompletion(completionPercent(next));
    if (next % 10 === 1) platform.happytime();   // rare on purpose: "use sparingly"

    await wait(1100);
    pause.hold(Reason.MENU);
    ads.beginBreak("level-complete");
    const offer = ads.rewardedAvailability;
    const dlg = ui.showResult({
      kind: "win",
      title: t("level_complete"),
      amount: reward,
      buttons: [{ id: "claim", label: t("claim") }, offer.ok ? { id: "claim_x", label: t("claim_x", { m: 3 }), video: true } : null],
      note: offer.reason === "adblock" ? t("adblock_notice") : "",
    });
    if (offer.ok) ads.offer("level-complete-x3");
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
      // Natural break on "next". Skipped right after a rewarded video: two ads back to back is bad UX.
      if (level >= GAME.firstMidgameLevel && !rewardedShown) await ads.midgame({ context: "level-complete-next" });
      ads.endBreak();
      loadLevel(next);
      pause.release(Reason.MENU);
      enterReady();
    }
  }

  async function onFail() {
    runEnded = true;
    gameplay.setPlaying(false);
    platform.clearGameContext();
    const p = progress(sim);
    const consolation = failReward(level, p, save.data) + sim.runCoins;   // picked-up coins are always kept
    save.update((d) => { d.coins += consolation; });
    save.flush();

    await wait(800);
    pause.hold(Reason.MENU);
    ads.beginBreak("fail");
    const offer = ads.rewardedAvailability;
    const canRevive = reviveOffer({ available: offer.ok, revivesUsed, progress: p });
    let reviveOpen = canRevive;
    // Retry (the decline) and Revive (the offer) share one button style and appear together.
    // The ring counts down; at 0 it removes the offer - it never accepts it.
    const dlg = ui.showResult({
      kind: "fail",
      title: t("level_failed"),
      amount: consolation,
      buttons: [{ id: "retry", label: t("retry") }, canRevive ? { id: "revive", label: t("revive"), video: true } : null],
      note: offer.reason === "adblock" ? t("adblock_notice") : "",
      timed: canRevive ? { id: "revive", seconds: OFFERS.reviveCountdownSec, onExpire: () => { reviveOpen = false; ads.offer("fail-revive", "expired"); } } : null,
    });
    if (canRevive) ads.offer("fail-revive");

    dlg.onChoice(async (id) => {
      audio.play("click");
      if (id === "revive") {
        dlg.lock(true);
        const r = await ads.rewarded({ context: "fail-revive", isContinue: true, grant: () => { revivesUsed++; } });
        dlg.lock(false);
        if (r.shown) {
          dlg.close();
          ads.endBreak();
          revive(sim);
          runEnded = false;
          pause.release(Reason.MENU);
          gameplay.setPlaying(true);
          platform.setGameContext({ level, revived: true });
          return;
        }
        reviveOpen = false;
        dlg.hideButton("revive");
        dlg.setNote(r.reason === "adblock" ? t("adblock_notice") : t("no_video"));
        return;
      }
      if (reviveOpen) ads.offer("fail-revive", "declined");
      ui.setCoins(save.data.coins, { animate: true });
      dlg.close();
      if (level >= GAME.firstMidgameLevel) await ads.midgame({ context: "fail-retry" });
      ads.endBreak();
      loadLevel(level);
      pause.release(Reason.MENU);
      enterReady();
    });
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
    const items = Object.keys(UPGRADES).map((kind) => {
      const cost = upgradeCost(kind, save.data);
      return {
        kind,
        title: t(kind === "start" ? "start_units" : "income"),
        level: save.data[UPGRADES[kind].key] + 1,
        cost,
        affordable: cost !== null && save.data.coins >= cost,
        maxed: cost === null,
        free: freeUpgradeOffer(kind, save.data, ctx),
      };
    });
    // At most OFFERS.maxVideoOffersPerScreen video buttons on the ready screen (CG-ADS-011: rewarded
    // ads are "special opportunities"): the boost counts as one, then the cheapest FREE upgrade.
    const budget = OFFERS.maxVideoOffersPerScreen - (boostModel() ? 1 : 0);
    items.filter((it) => it.free.visible).sort((x, y) => x.cost - y.cost).slice(Math.max(0, budget)).forEach((it) => { it.free = { visible: false }; });
    return items;
  }

  function boostModel() {
    const b = boostOffer(save.data, { ...offerCtx(), boostedThisRun: boosted });
    return b.visible ? { label: t("start_boost", { m: b.factor }) } : null;
  }

  /** Ready screen: upgrades (after the first win), boost (after the first runs), shop (after run 1). */
  function refreshReady() {
    if (!sim || sim.phase !== "ready" || ui.shopOpen) return;
    const upgrades = save.data.wins > 0 ? upgradeModel() : null;   // first session: nothing before the first run
    ui.showUpgrades(upgrades);
    seen("free-upgrade", !!upgrades?.some((u) => u.free.visible));
    const boost = boostModel();
    ui.showBoost(boost);
    seen("ready-boost", !!boost);
    ui.showShopButton(save.data.runs > 0);
  }

  /** Twice a second: cooldowns that end while the player idles on a screen. */
  function tickOffers() {
    if (ui.shopOpen) { ui.updateShop(shopModel()); return; }
    if (sim?.phase !== "ready" || pause.reasons.length) return;
    const boost = boostModel();
    if (!!boost !== !!offerSeen.get("ready-boost")) { ui.showBoost(boost); seen("ready-boost", !!boost); }
  }

  function applyUpgrade(kind) {
    save.update((d) => { d[UPGRADES[kind].key]++; });
    if (kind === "start" && sim.phase === "ready") sim.count = startCount(save.data) * (boosted ? OFFERS.boostFactor : 1);
    audio.play("tier", { pitch: 1.2 });
    refreshReady();
    ui.popUpgrade(kind);
  }

  async function takeBoost() {
    if (sim.phase !== "ready" || boosted || pause.has(Reason.AD) || pause.has(Reason.MENU)) return;
    const r = await ads.rewarded({
      context: "ready-boost",
      grant: () => {
        boosted = true;
        save.update((d) => { d.lastBoostAt = Date.now(); });
        sim.count = startCount(save.data) * OFFERS.boostFactor;
        const s = view.toScreen(sim.x, 2.8, sim.z);
        ui.floatText(s.x, s.y, t("boosted", { m: OFFERS.boostFactor }), "gold");
        ui.pulseBubble("player");
        audio.play("tier", { pitch: 1.35 });
      },
    });
    if (!r.shown) ui.toast(r.reason === "adblock" ? t("adblock_notice") : t("no_video"));
    save.flush();
    refreshReady();
  }

  // ---------------------------------------------------------------- skins shop
  function shopModel() {
    const ctx = offerCtx();
    const cost = skinUnlockCost(save.data);
    const cash = cashOffer(save.data, ctx);
    const wanting = cost !== null && save.data.coins < cost;
    const base = themeFor(sim.spec.theme);
    let note = "";
    if (cost === null) note = t("all_skins");
    else if (wanting && ads.rewardedAvailability.reason === "adblock") note = t("adblock_notice");
    else if (wanting && ctx.available && cash.cooldown > 0) note = t("free_coins_in", { t: mmss(cash.cooldown) });
    return {
      title: t("skins"),
      skins: SKINS.map((s) => ({ id: s.id, color: s.color ?? base.crowd, owned: save.data.owned.includes(s.id), selected: save.data.skin === s.id })),
      unlock: cost === null ? null : { label: t("unlock_random"), cost, affordable: !wanting },
      cash: cash.visible ? { amount: cash.amount } : null,
      note,
    };
  }

  function openShop() {
    if (sim.phase !== "ready" || ui.shopOpen || pause.has(Reason.AD) || pause.has(Reason.MENU)) return;
    pause.hold(Reason.MENU);
    ui.showHint(false);
    ui.showUpgrades(null);
    ui.showBoost(null);
    ui.showShopButton(false);
    offerSeen.delete("ready-boost");
    const model = shopModel();
    ui.openShop(model);
    seen("shop-cash", !!model.cash);
    audio.play("click");
  }

  function closeShop() {
    if (!ui.shopOpen || pause.has(Reason.AD)) return;
    ui.closeShop();
    offerSeen.delete("shop-cash");
    pause.release(Reason.MENU);
    audio.play("click");
    enterReady();
  }

  function selectSkin(id) {
    if (!save.data.owned.includes(id) || save.data.skin === id || pause.has(Reason.AD)) return;
    save.update((d) => { d.skin = id; });
    view.recolor(currentTheme());
    audio.play("pop", { pitch: 1.2 });
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
    ui.setCoins(save.data.coins, { animate: true });
    view.recolor(currentTheme());
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
    if (!blocked) {
      input.consumeDragX();
      if (sim?.phase === "run") { resumeRamp = 0; loop.timeScale = 0.25; }
    }
  });
  watchInterruptions(pause, { onHide: () => save.flush(), interactionTarget: canvas });

  // ---------------------------------------------------------------- marketing capture modes
  // ?cover=landscape|portrait|square -> composed hero shot (tools/launch/capture-covers.mjs)
  // ?capture=1                        -> deterministic autoplay (tools/launch/record-preview.mjs)
  // Both render the real game, so covers and preview videos stay honest about
  // what players get (CG-QUAL-006). Nothing here is reachable in normal play.

  /** Autopilot for captures: take the better gate, dodge blocks and saws. */
  function autopilotAxis() {
    const ahead = (list, range) => list.filter((it) => it.z < sim.z && it.z > sim.z - range);
    let desired = sim.x;
    const gate = ahead(sim.gates.filter((g) => !g.used), 48).sort((a, b) => b.z - a.z)[0];
    if (gate) desired = applyOp(sim.count, gate.left) >= applyOp(sim.count, gate.right) ? -3 : 3;
    for (const b of ahead(sim.blocks.filter((bl) => !bl.broken), 24)) {
      if (desired > b.x0 - 1.5 && desired < b.x1 + 1.5) desired = (b.x0 + b.x1) / 2 > 0 ? -3 : 3;
    }
    for (const w of ahead(sim.saws, 20)) if (Math.abs(desired - w.x) < 2.6) desired = w.x > 0 ? -3.2 : 3.2;
    const diff = desired - sim.x;
    return Math.abs(diff) < 0.2 ? 0 : Math.max(-1, Math.min(1, diff));
  }

  async function startMarketingMode(kind) {
    const uiRoot = document.getElementById("ui");
    uiRoot.classList.add("marketing");
    ui.showHint(false);
    ui.showUpgrades(null);
    document.getElementById("boot").classList.add("done");

    if (kind) {
      uiRoot.classList.add("cover");
      const title = document.createElement("div");
      title.className = "cover-title stroke";
      title.textContent = GAME.title;
      uiRoot.appendChild(title);
      loadLevel(Number(qs.get("cover_level") || 6));
      startRun(sim);
      sim.count = Number(qs.get("cover_count") || 110);
      const gate = sim.gates[1] || sim.gates[0];
      sim.z = sim.prevZ = gate.z + 10;
      sim.x = sim.prevX = sim.targetX = 1.6;
      const shots = {
        landscape: { pos: [-3.2, 4.6, 9.5], look: [1.2, 1.6, -12] },
        portrait: { pos: [-1.2, 6.2, 11], look: [0.6, 0.8, -11] },
        square: { pos: [-2.2, 5.2, 10], look: [0.8, 1.2, -11] },
      };
      view.setCameraOverride(shots[kind] || shots.landscape);
      loop.setSimPaused(true);
      loop.start();
      await wait(1200);
      window.__GS_COVER_READY__ = true;
      return;
    }

    loadLevel(Number(qs.get("capture_level") || 8));
    // A mid-game player with upgraded start units: honest, and the clip ends in a win.
    sim.count = Number(qs.get("capture_units") || 30);
    startRun(sim);
    const lead = Number(qs.get("capture_lead") || 11);
    const startZ = sim.spec.finishZ + TUNING.runSpeed * lead;
    while ((sim.phase === "run" || sim.phase === "battle") && sim.z > startZ) step(sim, 1 / 60, { axis: autopilotAxis() });
    sim.events.length = 0;
    view.snapCamera(sim);
    let frames = 0;
    window.__GS_CAPTURE__ = {
      frame(dt = 1 / 30) {
        const steps = Math.max(1, Math.round(dt * 60));
        for (let i = 0; i < steps; i++) step(sim, 1 / 60, { axis: autopilotAxis() });
        stage.resize();
        view.update(sim, 1, dt);
        syncRunCoins();
        ui.update(dt);
        stage.render();
        return { frame: ++frames, phase: sim.phase, count: Math.round(sim.count) };
      },
    };
  }

  const coverKind = qs.get("cover");
  if (coverKind || qs.get("capture") === "1") return startMarketingMode(coverKind);

  // ---------------------------------------------------------------- start
  const qa = qs.get("qa") === "1";
  const qaLevel = qa ? Number(qs.get("level")) : 0;
  // QA fixtures (?qa=1 only): a returning player's runs / wins / coins, so the harness reaches
  // the boost, upgrade and shop surfaces without playing ten levels first.
  if (qa && Number(qs.get("runs")) > 0) save.update((d) => { d.runs = Math.max(d.runs, Number(qs.get("runs"))); });
  if (qa && qs.has("coins")) save.update((d) => { d.coins = Math.max(0, Number(qs.get("coins")) || 0); });
  if (qa && Number(qs.get("wins")) > 0) save.update((d) => { d.wins = Math.max(d.wins, Number(qs.get("wins"))); });
  loadLevel(qaLevel > 0 ? qaLevel : save.data.level);
  stage.resize();
  ui.setCoins(save.data.coins);
  ui.setSound(audio.state);
  loop.start();
  platform.reportCompletion(completionPercent(save.data.level));
  platform.loadingStop();
  pause.release(Reason.BOOT);
  document.getElementById("boot").classList.add("done");
  enterReady();

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
          phase: sim.phase, level, count: Math.round(sim.count), progress: progress(sim),
          coins: save.data.coins, pause: pause.reasons, gameplayReported: gameplay.reported,
          firstGameplayStartMs: gameplay.firstStartMs, audio: audio.state, save: save.status,
          platform: { name: platform.name, environment: platform.environment }, fps: loop.stats.fps,
          pixelRatio: stage.renderer.getPixelRatio(), adsLog: ads.log, gameplayHistory: gameplay.history,
          runs: save.data.runs, skin: save.data.skin, owned: [...save.data.owned], boosted, shopOpen: ui.shopOpen,
        };
      },
      feedback,
      start: tryStartRun,
      /** The capture autopilot steers (dead-air and long-run checks); the player's input is ignored meanwhile. */
      setAutopilot(on) { qaAutopilot = !!on; },
      forceWin() { if (sim.phase !== "ready") { sim.phase = "won"; sim.multiplier = 2; } },
      /** @param {number} [at] progress 0..1 at which the run dies (revive needs OFFERS.reviveMinProgress) */
      forceFail(at = 0) {
        if (sim.phase === "ready") return;
        if (at > 0) sim.z = sim.prevZ = sim.spec.finishZ * at;
        sim.count = 0;
        sim.phase = "failed";
      },
      renderInfo: () => ({ ...stage.renderer.info.render, geometries: stage.renderer.info.memory.geometries, textures: stage.renderer.info.memory.textures }),
      /** Triangles per unique geometry in the scene - the "not high poly" budget (project.json budgets). */
      sceneStats() {
        const rows = new Map();
        stage.scene.traverse((o) => {
          if (!o.isMesh || !o.geometry?.attributes?.position) return;
          const g = o.geometry;
          const triangles = Math.round((g.index ? g.index.count : g.attributes.position.count) / 3);
          const row = rows.get(g.uuid) || { name: o.name || g.type, triangles, instances: 0 };
          row.instances += o.isInstancedMesh ? o.count : 1;
          rows.set(g.uuid, row);
        });
        const list = [...rows.values()].sort((a, b) => b.triangles - a.triangles);
        return { geometries: list.length, maxGeometryTriangles: list[0]?.triangles ?? 0, heaviest: list.slice(0, 6) };
      },
    };
  }
}

boot().catch((e) => {
  console.error("[boot] failed", e);
});
