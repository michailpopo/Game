/**
 * Boot + game flow controller - Comet Chain (docs/GAME_BRIEF.md).
 *
 * Boot order matters:
 *   1. SDK init (awaited, with a timeout) -> loadingStart
 *   2. services: pause, gameplay reporter, save, audio, input, controls, ads
 *   3. renderer + the first round built -> loadingStop -> release BOOT
 *   4. the player lands IN the live arena (CG-GAME-001): one click on PLAY (or anywhere on the
 *      arena, or Space/Enter) starts the round; gameplayStart fires then, from gameplay-events.js
 *
 * Round flow: ready -> run (90 s clock) -> [death -> 2 s respawn, or the revive offer] -> won
 * (the round is over) -> podium + Claim / Claim x3 -> next round (ready).
 *
 * Ad placements and the rule each follows - src/game/offers.js decides visibility and caps:
 *   round result   -> "Claim" or "Claim x3" (rewarded, same button style)
 *   "Claim"        -> midgame from round GAME.firstMidgameLevel on (a natural break)
 *   death          -> "Keep chain" (rewarded, once per session, only after >= 30 s of the round,
 *                     ring countdown that removes the offer at 0) next to "Respawn"; otherwise
 *                     the free 2 s respawn with no dialog at all
 *   ready screen   -> "Start x2" boost (rewarded, after the first rounds, cooldown)
 *                     "FREE" upgrade (rewarded) only when unaffordable, with cooldown
 *   trails shop    -> "Random" unlock for coins (always a new trail) and "+coins" (rewarded)
 *                     only while the unlock is unaffordable, with a visible cooldown timer
 * Everything works with ads off (Basic Launch) and with an ad blocker.
 *
 * Mouse control (CG-QUAL-008): pointer lock on the PLAY click, a cursor ring in the arena,
 * P / Tab / native Escape release it -> pause overlay; menus always run unlocked
 * (src/game/controls.js).
 */

import "@fontsource/lilita-one/latin-400.css";
import "./ui/styles.css";

import { ARENA, GAME, OFFERS } from "./config.js";
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
import { themeFor, withSkin } from "./render/palette.js";
import { autopilot } from "./game/ai.js";
import { Controls } from "./game/controls.js";
import {
  createSim, forceFail, forceWin, inFinale, makeInput, massOf, playerRank, playerScore, progress, respawn, revive,
  setPlayerMass, stageEncounter, standings, startRun, step, timeLeft,
} from "./game/sim.js";
import {
  DEFAULT_SAVE, SKINS, UPGRADES, completionPercent, crateFor, nextTier, pickRandomSkin, roundReward, skinColor,
  skinUnlockCost, startMass, upgradeCost,
} from "./game/meta.js";
import { boostOffer, cashOffer, freeUpgradeOffer, reviveOffer } from "./game/offers.js";
import { ARENA_SFX } from "./game/sfx.js";
import { fmtValue, ladderKey, levelOf } from "./game/values.js";
import { GameView } from "./game/view.js";
import { createUI } from "./ui/ui.js";

const qs = new URLSearchParams(location.search);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const mmss = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
const LOCK = "lock";   // pause reason: pointer lost to a focus change (not a gameplay break)

async function boot() {
  const canvas = document.getElementById("game");
  // Flow state is declared before the first await: callbacks that resolve
  // during boot (e.g. adblock detection) must never hit a temporal dead zone.
  let level = 1;                // round number
  let sim = null;
  let runEnded = false;
  let deathHandled = false;
  let revivesUsed = 0;
  let resumeRamp = 1;
  let boosted = false;          // this round's ready screen already took the "Start x2" boost
  let offerTick = 0;
  let hudTick = 0;
  let qaAutopilot = false;
  let paused = false;
  let lastScore = 0;
  let lastClockSec = -1;
  let finaleShown = false;
  let deathText = "";
  let onboard = { step: 0, steer: 0, boost: 0, t: 0, t2: 0 };
  const offerSeen = new Map();  // surface -> visible, so "offer shown" is logged once per appearance
  const rankRows = [];
  const standingsBuf = [];
  const stepIn = makeInput();
  const platform = await initPlatform();
  platform.loadingStart();
  initI18n(platform.systemInfo.locale);
  if (platform.isCrazyGamesApp) document.documentElement.classList.add("in-app");

  const pause = new PauseArbiter([Reason.BOOT]);
  const gameplay = createGameplayReporter(platform, pause);
  const save = new SaveService({ key: `${GAME.slug}.save`, version: GAME.saveVersion, defaults: DEFAULT_SAVE }).init(platform);
  const audio = new AudioService({ sounds: { ...SFX, ...ARENA_SFX }, userMuted: save.data.userMuted }).bindPlatform(platform).installUnlockHandlers(window);
  const input = new Input(canvas, { bindings: { action: ["Enter"], boost: ["Space", "ShiftLeft"] } }).attach();
  const controls = new Controls(canvas, input, { onUnlock: (focused) => pauseRound(focused ? "user" : "focus"), onPauseKey }).attach();
  const stage = createStage(canvas);
  const quality = new AdaptiveQuality(stage.renderer);
  const touchUI = () => controls.mode === "touch" || matchMedia("(pointer: coarse)").matches || platform.systemInfo?.device?.type === "mobile";

  const ui = createUI(document.getElementById("ui"), {
    onSound: toggleSound, onPause: () => (paused ? resumeRound() : pauseRound("user")), onResume: resumeRound, onPlay: (e) => tryStartRun(e),
    onTouchBoost: (on) => { controls.touchBoost = on; },
    onBuy: buyUpgrade, onFree: freeUpgrade, onBoost: takeBoost,
    onShop: openShop, onShopClose: closeShop, onSkin: selectSkin, onUnlock: unlockRandom, onCash: cashForShop,
  });
  const ads = new AdController(pause, audio, ui.adOverlay);
  ads.detectAdblock().then(refreshReady);   // never block boot on this

  await fontsReady();

  // Up to 8 fixed steps per frame: the 90 s round clock stays real-time down to ~8 fps on weak
  // devices (a step costs ~0.1-0.2 ms); below that the spiral guard slows the game instead.
  const loop = new GameLoop({ update, render, maxStepsPerFrame: 8 });
  const view = new GameView(stage, { audio, ui, loop });
  view.cursor = controls.cursor;

  const currentTheme = () => withSkin(themeFor(0), skinColor(save.data));

  function loadLevel(n) {
    level = n;
    boosted = false;
    sim = createSim({ level: n, tier: save.data.tier, seed: `round-${n}-${save.data.runs}`, startMass: startMass(save.data) });
    runEnded = false;
    deathHandled = false;
    finaleShown = false;
    lastClockSec = -1;
    view.build(sim, currentTheme());
    ui.setScore(playerScore(sim), false);
    ui.setClock(ARENA.round.durationSec, ARENA.round.durationSec, false);
    ui.showDeath(null);
    ui.showPill(null);
  }

  function enterReady() {
    const touch = touchUI();
    ui.showHome(true, {
      title: GAME.title, mode: t("offline_arena"), play: t("play"),
      main: t(touch ? "hint_touch" : "hint_mouse"), sub: t(touch ? "hint_touch_sub" : "hint_mouse_sub"), icon: touch ? "finger" : "mouse",
    });
    ui.showRoundHud(false);
    ui.showTouchBoost(false);
    controls.setRunning(false);
    canvas.style.cursor = "";
    refreshReady();
  }

  function tryStartRun(e) {
    if (!sim || sim.phase !== "ready" || pause.has(Reason.MENU) || pause.has(Reason.AD) || ui.shopOpen) return;
    startRun(sim);
    controls.setRunning(true);
    if (e && e.pointerType === "mouse") {
      controls.mode = "mouse";
      controls.requestLock();                       // CG-QUAL-008: lock on the PLAY click (a user gesture)
      const r = canvas.getBoundingClientRect();
      const g = { x: 0, z: 0 };
      if (e.target === canvas && view.screenToGround(e.clientX - r.left, e.clientY - r.top, g)) controls.aimAt(g.x - sim.player.x, g.z - sim.player.z);
      else controls.aimAt(Math.cos(sim.player.heading) * 3, Math.sin(sim.player.heading) * 3);
    } else if (e && e.pointerType === "touch") controls.mode = "touch";
    else if (!e) controls.mode = "keys";           // Space / Enter: no cursor steering until the mouse moves
    ui.showHome(false);
    ui.showRoundHud(true);
    ui.showUpgrades(null);
    ui.showBoost(null);
    ui.showShopButton(false);
    ui.showTouchBoost(touchUI());
    offerSeen.clear();
    onboard = { step: save.data.runs < 3 ? 0 : 3, steer: 0, boost: 0, t: 0, t2: 0 };
    gameplay.setPlaying(true);
    platform.setGameContext({ round: level, tier: save.data.tier });
    save.update((d) => { d.runs++; });
    audio.play("click");
  }
  canvas.addEventListener("pointerdown", (e) => {
    if (sim?.phase === "ready") { tryStartRun(e); return; }
    // A click on the arena during a round re-tries the lock (fallback mode, after a revive ...).
    if (sim?.phase === "run" && !paused && e.pointerType === "mouse" && !controls.locked) controls.requestLock();
  });
  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyM" && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) toggleSound();
  });

  // ---------------------------------------------------------------- pause / pointer lock
  function onPauseKey() {
    if (paused) { resumeRound(); return; }
    if (sim?.phase !== "run" || runEnded || pause.has(Reason.MENU) || pause.has(Reason.AD)) return;
    controls.releaseLock();
    pauseRound("user");
  }

  /** "user": P / Tab / Escape / pause button -> a gameplay break. "focus": the lock went with the window focus. */
  function pauseRound(kind) {
    if (paused || sim?.phase !== "run" || runEnded) return;
    paused = true;
    pause.hold(kind === "user" ? Reason.DIALOG : LOCK);
    controls.setRunning(false);
    controls.releaseLock();
    const touch = touchUI();
    ui.showPaused(true, { title: t("paused"), sub: t(touch ? "tap_resume" : "click_resume"), keys: touch ? "" : t("pause_keys") });
  }

  function resumeRound() {
    if (!paused) return;
    paused = false;
    ui.showPaused(false);
    controls.setRunning(true);
    if (controls.mode === "mouse") controls.requestLock();   // the resume click / key is a user gesture
    pause.release(Reason.DIALOG);
    pause.release(LOCK);
  }

  // ---------------------------------------------------------------- simulation step
  function update(dt) {
    if (sim.phase === "ready" && (input.justPressed("action") || input.justPressed("boost"))) tryStartRun(null);
    if (sim.phase === "run") {
      if (qaAutopilot) autopilot(sim, stepIn);
      else controls.intent(sim.player, view, stepIn);
    }
    step(sim, dt, stepIn);
    input.endStep();
    if (sim.phase === "failed" && !deathHandled) onDeath();
    else if (sim.phase === "run" && deathHandled) { deathHandled = false; ui.showDeath(null); }
    if (sim.phase === "won" && !runEnded) onRoundEnd();
  }

  function render(alpha, dt) {
    stage.resize();
    if (resumeRamp < 1) { resumeRamp = Math.min(1, resumeRamp + dt * 2); loop.timeScale = 0.25 + 0.75 * resumeRamp; }
    view.update(sim, alpha, dt);
    hud(dt);
    ui.update(dt);
    offerTick += dt;
    if (offerTick >= 0.5) { offerTick = 0; tickOffers(); }
    quality.update(loop.frameMs, dt);
    stage.render();
  }

  // ---------------------------------------------------------------- round HUD
  function hud(dt) {
    const inRound = sim.phase === "run" || sim.phase === "failed";
    const p = sim.player;
    const score = playerScore(sim);
    if (score !== lastScore) { ui.setScore(score, score > lastScore && inRound); lastScore = score; }
    if (inRound) {
      const left = timeLeft(sim);
      const gold = inFinale(sim);
      ui.setClock(left, ARENA.round.durationSec, gold);
      const sec = Math.ceil(left);
      if (sec !== lastClockSec) {
        if (sec <= 10 && sec > 0 && lastClockSec > 0) audio.play("count", { pitch: sec <= 3 ? 1.5 : 1, volume: sec <= 3 ? 1 : 0.55 });
        lastClockSec = sec;
      }
      if (gold && !finaleShown) {
        finaleShown = true;
        ui.showWorld(t("golden_finale"), "×2");
        audio.play("sting");
      }
      ui.setMeter(p.meter, ARENA.boost.cost === "meter" && p.alive);
      // New world reached for the first time (the planet ladder is the collection).
      const lv = p.alive ? levelOf(Math.max(2, p.head)) : 0;
      if (lv > save.data.bestWorld) {
        const first = save.data.bestWorld > 0;
        save.update((d) => { d.bestWorld = lv; });
        if (first && lv >= 3 && sim.phase === "run") ui.showWorld(t("new_world"), t(`planet_${ladderKey(lv)}`));
      }
      // Death message with the respawn ring.
      if (sim.phase === "failed" && !sim.holdRespawn) ui.showDeath(deathText, 1 - sim.respawnIn / ARENA.round.respawnSec);
      onboarding(dt);
    }
    ui.showStick(inRound ? controls.stickView : null);
    canvas.style.cursor = inRound && !controls.locked && controls.mode === "mouse" && !paused ? "crosshair" : "";
    hudTick += dt;
    if (hudTick >= 0.25 && sim.phase !== "won") { hudTick = 0; ranks(); }   // frozen at the whistle
  }

  /** Leaderboard slice: the top 3, then you with a neighbour. */
  function ranks() {
    const n = standings(sim, standingsBuf);
    rankRows.length = 0;
    let me = standingsBuf.findIndex((s) => s.isPlayer);
    const push = (i) => {
      const sn = standingsBuf[i];
      rankRows.push({ rank: i + 1, name: sn.isPlayer ? t("you") : sn.name, score: massOf(sim, sn), you: sn.isPlayer, danger: !sn.isPlayer && sim.player.alive && sn.head > sim.player.head });
    };
    for (let i = 0; i < Math.min(3, n); i++) push(i);
    if (me >= 3) { if (me > 3) push(me - 1); push(me); }
    else if (n > 3) push(3);
    if (rankRows.length < 5 && me + 1 < n && me + 1 > 3) push(me + 1);
    ui.setRanks(rankRows);
  }

  /** Contextual pills: steer -> (later) boost; the lock hint when the mouse runs unlocked. */
  function onboarding(dt) {
    const touch = controls.mode === "touch";
    const keys = controls.mode === "keys";
    onboard.t += dt;
    if (sim.phase !== "run" || paused || pause.has(Reason.MENU)) { ui.showPill(null); return; }
    if (controls.mode === "mouse" && !controls.locked && onboard.t > 1.2) { ui.showPill(t("pill_lock"), "mouse"); return; }
    if (stepIn.hasDir) onboard.steer += dt;
    if (sim.player.boosting) onboard.boost += dt;
    if (onboard.step === 0) {
      ui.showPill(touch ? t("pill_steer_touch") : keys ? t("pill_steer_keys", { keys: input.movementLabel }) : t("pill_steer_mouse"), touch ? "finger" : "mouse");
      if (onboard.steer > 0.8 && onboard.t > 3) onboard.step = 1;
    } else if (onboard.step === 1) {
      ui.showPill(null);
      if (onboard.t > 14) { onboard.step = 2; onboard.t2 = onboard.t; }
    } else if (onboard.step === 2) {
      ui.showPill(touch ? t("pill_boost_touch") : t("pill_boost_mouse"), "boost");
      if (onboard.boost > 0.4 || onboard.t - onboard.t2 > 8) { onboard.step = 3; save.update((d) => { d.lastSeenAt = Date.now(); }); }
    } else ui.showPill(null);
  }

  // ---------------------------------------------------------------- flow
  /** The player was swallowed: a 2 s respawn, or (once per session, after 30 s) the revive offer. */
  async function onDeath() {
    deathHandled = true;
    const killer = sim.deathBy ? sim.snakes.find((sn) => sn.name === sim.deathBy) : null;
    deathText = killer ? t("swallowed_by", { name: killer.name, v: fmtValue(killer.head) }) : t("crashed");
    const p = progress(sim);
    const offer = ads.rewardedAvailability;
    const canRevive = reviveOffer({ available: offer.ok, revivesUsed, progress: p }) && ARENA.round.mode === "timed";
    if (!canRevive) { ui.showDeath(deathText, 0); return; }   // the sim respawns the player after round.respawnSec

    sim.holdRespawn = true;
    ui.showDeath(deathText, 0);
    await wait(800);
    if (sim.phase !== "failed") return;   // the round ended meanwhile
    controls.releaseLock();
    controls.setRunning(false);
    pause.hold(Reason.MENU);
    ads.beginBreak("fail");
    ui.showDeath(null);
    let reviveOpen = true;
    // Respawn (the decline) and Keep chain (the offer) share one button style and appear together.
    // The ring counts down; at 0 it removes the offer - it never accepts it.
    const dlg = ui.showResult({
      kind: "fail",
      mode: `${t("offline_arena")} · ${t("round_n", { n: level })}`,
      title: killer ? t("swallowed_title") : t("crashed"),
      stats: [killer ? deathText : null, t("stat_chain", { m: sim.deathMass })].filter(Boolean),
      amount: null,
      buttons: [{ id: "retry", label: t("respawn") }, { id: "revive", label: t("keep_chain"), video: true }],
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
          revive(sim);
          backToRound();
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
      respawn(sim);
      backToRound();
    });
  }

  function backToRound() {
    deathHandled = false;
    ui.showDeath(null);
    controls.setRunning(true);
    pause.release(Reason.MENU);
    resumeRamp = 0;
    loop.timeScale = 0.25;
  }

  /** The clock hit 0:00 (or forceWin): podium, payout, Claim / Claim x3, next round. */
  async function onRoundEnd() {
    runEnded = true;
    gameplay.setPlaying(false);
    controls.setRunning(false);
    controls.releaseLock();
    if (paused) { paused = false; ui.showPaused(false); pause.release(Reason.DIALOG); pause.release(LOCK); }
    platform.clearGameContext();
    ui.showPill(null);
    ui.showDeath(null);
    ui.showTouchBoost(false);
    if (ARENA.round.mode === "timed") ui.setClock(Math.max(0, timeLeft(sim)), ARENA.round.durationSec, false);
    const { rank, of } = playerRank(sim);
    const mass = playerScore(sim);
    const swallows = sim.player.kills;
    const crate = crateFor(rank);
    const reward = roundReward(mass, swallows, rank, save.data);
    const next = level + 1;
    const tierBefore = save.data.tier;
    const firstWin = rank === 1 && !save.data.firstWin;
    save.update((d) => {
      d.coins += reward; d.level = next; d.bestLevel = Math.max(d.bestLevel, next); d.wins++;
      d.tier = nextTier(d.tier, rank); d.bestTier = Math.max(d.bestTier, d.tier);
      d.bestRank = d.bestRank ? Math.min(d.bestRank, rank) : rank; d.bestScore = Math.max(d.bestScore, mass);
      d.swallows += swallows;
      if (rank === 1) d.firstWin = true;
    });
    save.flush();
    platform.reportCompletion(completionPercent(save.data.bestTier));
    if (firstWin || (save.data.tier === ARENA.bots.maxTier && tierBefore < ARENA.bots.maxTier)) platform.happytime();   // rare on purpose

    // Podium: the top 3 and you.
    const n = standings(sim, standingsBuf);
    const podium = [];
    for (let i = 0; i < Math.min(3, n); i++) {
      const sn = standingsBuf[i];
      podium.push({ rank: i + 1, name: sn.isPlayer ? t("you") : sn.name, score: massOf(sim, sn), you: sn.isPlayer });
    }
    if (rank > 3) podium.push({ rank, name: t("you"), score: mass, you: true });
    audio.play("win", { pitch: rank === 1 ? 1 : rank <= 3 ? 0.9 : 0.8 });

    await wait(1100);
    pause.hold(Reason.MENU);
    ads.beginBreak("level-complete");
    const offer = ads.rewardedAvailability;
    const dlg = ui.showResult({
      kind: "win",
      mode: t("results_mode", { n: level }),
      title: `${t("round_over")} ${t("rank_of", { r: rank, of })}`,
      podium,
      stats: [t("stat_chain", { m: mass }), t("stat_swallows", { k: swallows }), t("stat_best", { b: save.data.bestRank })],
      amount: reward,
      crate: t("crate", { m: crate }),
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
      // Natural break on "next round". Skipped right after a rewarded video: two ads back to back is bad UX.
      if (level >= GAME.firstMidgameLevel && !rewardedShown) await ads.midgame({ context: "level-complete-next" });
      ads.endBreak();
      loadLevel(next);
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

  /** Ready screen: upgrades (after the first finished round), boost (after the first rounds), shop (after round 1). */
  function refreshReady() {
    if (!sim || sim.phase !== "ready" || ui.shopOpen) return;
    const upgrades = save.data.wins > 0 ? upgradeModel() : null;   // first session: nothing before the first round
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

  function applyStartMass() {
    if (sim.phase !== "ready") return;
    const m = startMass(save.data) * (boosted ? OFFERS.boostFactor : 1);
    sim.startMass = m;
    setPlayerMass(sim, m);
    ui.setScore(playerScore(sim), true);
  }

  function applyUpgrade(kind) {
    save.update((d) => { d[UPGRADES[kind].key]++; });
    if (kind === "start") applyStartMass();
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
        applyStartMass();
        const s = view.toScreen(sim.player.x, 2.4, sim.player.z);
        ui.floatText(s.x, s.y, t("boosted", { m: OFFERS.boostFactor }), "gold");
        audio.play("tier", { pitch: 1.35 });
      },
    });
    if (!r.shown) ui.toast(r.reason === "adblock" ? t("adblock_notice") : t("no_video"));
    save.flush();
    refreshReady();
  }

  // ---------------------------------------------------------------- trails shop
  function shopModel() {
    const ctx = offerCtx();
    const cost = skinUnlockCost(save.data);
    const cash = cashOffer(save.data, ctx);
    const wanting = cost !== null && save.data.coins < cost;
    const base = themeFor(0);
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
    ui.showHome(false);
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
    if (!blocked && sim?.phase === "run") { resumeRamp = 0; loop.timeScale = 0.25; }
  });
  // On hide: always write (a timestamp + the best chain so far), so the save is flushed even when
  // the debounced write already went out - the last reliable moment on mobile (pagehide).
  watchInterruptions(pause, {
    onHide: () => {
      save.update((d) => { d.lastSeenAt = Date.now(); if (sim) d.bestScore = Math.max(d.bestScore, sim.player.peakMass || 0); });
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

    if (kind) {
      uiRoot.classList.add("cover");
      const title = document.createElement("div");
      title.className = "cover-title stroke";
      title.textContent = GAME.title;
      uiRoot.appendChild(title);
      loadLevel(Number(qs.get("cover_level") || 3));
      startRun(sim);
      for (let i = 0; i < 60 * 25; i++) { autopilot(sim, stepIn); step(sim, 1 / 60, stepIn); if (sim.phase !== "run") break; }
      setPlayerMass(sim, Number(qs.get("cover_count") || 1500));
      sim.events.length = 0;
      view.snapCamera(sim);
      const shots = {
        landscape: { pos: [0, 15, 12], look: [0, 0, -1] },
        portrait: { pos: [0, 17, 10], look: [0, 0, -2] },
        square: { pos: [0, 16, 11], look: [0, 0, -1.5] },
      };
      view.setCameraOverride(shots[kind] || shots.landscape);
      view.bodies.badges.visible = false;   // covers: the title is the only text allowed
      loop.setSimPaused(true);
      loop.start();
      await wait(1200);
      window.__GS_COVER_READY__ = true;
      return;
    }

    loadLevel(Number(qs.get("capture_level") || 3));
    startRun(sim);
    const lead = Number(qs.get("capture_lead") || 20);
    while (sim.phase === "run" && sim.t < lead) { autopilot(sim, stepIn); step(sim, 1 / 60, stepIn); }
    if (qs.get("capture_units")) setPlayerMass(sim, Number(qs.get("capture_units")));
    sim.events.length = 0;
    view.snapCamera(sim);
    let frames = 0;
    window.__GS_CAPTURE__ = {
      frame(dt = 1 / 30) {
        const steps = Math.max(1, Math.round(dt * 60));
        for (let i = 0; i < steps; i++) { autopilot(sim, stepIn); step(sim, 1 / 60, stepIn); }
        stage.resize();
        view.update(sim, 1, dt);
        ui.update(dt);
        stage.render();
        return { frame: ++frames, phase: sim.phase, count: playerScore(sim) };
      },
    };
  }

  const coverKind = qs.get("cover");
  if (coverKind || qs.get("capture") === "1") return startMarketingMode(coverKind);

  // ---------------------------------------------------------------- start
  const qa = qs.get("qa") === "1";
  const qaLevel = qa ? Number(qs.get("level")) : 0;
  // QA fixtures (?qa=1 only): a returning player's runs / wins / coins, so the harness reaches
  // the boost, upgrade and shop surfaces without playing ten rounds first.
  if (qa && Number(qs.get("runs")) > 0) save.update((d) => { d.runs = Math.max(d.runs, Number(qs.get("runs"))); });
  if (qa && qs.has("coins")) save.update((d) => { d.coins = Math.max(0, Number(qs.get("coins")) || 0); });
  if (qa && Number(qs.get("wins")) > 0) save.update((d) => { d.wins = Math.max(d.wins, Number(qs.get("wins"))); });
  if (qa && Number(qs.get("tier")) > 0) save.update((d) => { d.tier = Math.min(ARENA.bots.maxTier, Number(qs.get("tier"))); });
  loadLevel(qaLevel > 0 ? qaLevel : save.data.level);
  stage.resize();
  ui.setCoins(save.data.coins);
  ui.setSound(audio.state);
  loop.start();
  platform.reportCompletion(completionPercent(save.data.bestTier));
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
        const p = sim.player;
        const r = playerRank(sim);
        return {
          phase: sim.phase, level, tier: save.data.tier, count: playerScore(sim), score: playerScore(sim), value: p.alive ? p.head : sim.deathHead,
          rank: r.rank, of: r.of, progress: progress(sim), timeLeft: timeLeft(sim), alive: p.alive, chain: Array.from(p.chain.subarray(0, p.n)),
          kills: p.kills, deaths: p.deaths, looseCount: sim.loose.count, botsAlive: sim.snakes.filter((s) => !s.isPlayer && s.alive).length,
          lock: controls.locked, lockRefused: controls.lockRefused, inputMode: controls.mode, paused,
          coins: save.data.coins, pause: pause.reasons, gameplayReported: gameplay.reported,
          firstGameplayStartMs: gameplay.firstStartMs, audio: audio.state, save: save.status,
          platform: { name: platform.name, environment: platform.environment }, fps: loop.stats.fps,
          pixelRatio: stage.renderer.getPixelRatio(), adsLog: ads.log, gameplayHistory: gameplay.history,
          runs: save.data.runs, skin: save.data.skin, owned: [...save.data.owned], boosted, shopOpen: ui.shopOpen,
        };
      },
      feedback,
      start: tryStartRun,
      /** The autopilot steers (dead-air and long-run checks); the player's input is ignored meanwhile. */
      setAutopilot(on) { qaAutopilot = !!on; },
      /** Ends the round now (a finished round is the "won" phase). */
      forceWin() { forceWin(sim); },
      /** @param {number} [at] round progress 0..1 at which the player is swallowed (the revive offer needs OFFERS.reviveMinProgress) */
      forceFail(at = 0) { forceFail(sim, at); },
      /** Screenshot staging: "victim" = a smaller comet crosses just ahead; "killer" = a much bigger one waits ahead. */
      stage(kind) { return stageEncounter(sim, kind); },
      setMass(m) { setPlayerMass(sim, m); },
      /** Jump the round clock (screenshots of the golden finale / time-out). */
      setTimeLeft(sec) { if (sim.phase === "run") sim.t = Math.max(0, ARENA.round.durationSec - sec); },
      renderInfo: () => ({ ...stage.renderer.info.render, geometries: stage.renderer.info.memory.geometries, textures: stage.renderer.info.memory.textures }),
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
        return { geometries: list.length, maxGeometryTriangles: list[0]?.triangles ?? 0, heaviest: list.slice(0, 6) };
      },
    };
  }
}

boot().catch((e) => {
  console.error("[boot] failed", e);
});
