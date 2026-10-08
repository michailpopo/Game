#!/usr/bin/env node
/**
 * Browser QA harness - drives the real build in Chromium and records evidence
 * against the CrazyGames requirements.
 *
 *   npm run build
 *   node tools/qa/browser-qa.mjs --serve                 build must exist; starts `vite preview`
 *   node tools/qa/browser-qa.mjs --url http://127.0.0.1:4173/ --only boot,ads-basic-launch
 *
 * Output: qa/evidence/browser-qa.json, qa/shots/*.png, summary table, exit 1 on any FAIL.
 *
 * Honesty rules:
 *  - The mock SDK replaces the real one (the CDN URL is routed to dev/mock-crazygames-sdk.js).
 *    A PASS means the GAME handles the case; only the Developer Portal preview shows
 *    that CrazyGames accepts the integration.
 *  - This machine is not a 4 GB Chromebook. Performance numbers are evidence, not a verdict.
 *  - Legibility cannot be decided by a script: viewports produce screenshots marked
 *    UNVERIFIED until someone (Claude or a human) looks at them.
 *
 * Requires the game to expose window.__GS_QA__ with ?qa=1 (template main.js does).
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const opt = (name, def = null) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes(`--${name}`);

const OUT = resolve(root, opt("out", "qa"));
const SHOTS = resolve(OUT, "shots");
mkdirSync(SHOTS, { recursive: true });
mkdirSync(resolve(OUT, "evidence"), { recursive: true });
const MOCK = resolve(root, "dev/mock-crazygames-sdk.js");
const profile = JSON.parse(readFileSync(resolve(root, "project.json"), "utf8"));
const budgets = profile.budgets || null;   // style profile budgets (skill: references/threejs/visual-style.md)

// docs.crazygames.com/requirements/gameplay (read 2026-09-11)
const CG_VIEWPORTS = [
  [907, 510, "desktop"], [1216, 684, "desktop"], [1077, 606, "desktop"], [821, 462, "desktop"],
  [1366, 768, "desktop-fullscreen"], [1920, 1080, "desktop-fullscreen"], [1536, 864, "desktop-fullscreen"],
  [1280, 720, "desktop-fullscreen"], [800, 450, "mobile"], [1080, 607, "tablet"],
];

const results = [];
const allErrors = [];
const record = (r) => { results.push(r); console.log(`${r.status.padEnd(10)} ${r.id.padEnd(22)} ${r.summary}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ server
let server = null;
let baseUrl = opt("url");
if (flag("serve")) {
  if (!existsSync(resolve(root, "dist/index.html"))) { console.error("dist/ missing - run `npm run build` first"); process.exit(2); }
  server = spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--port", "4173", "--strictPort", "--host", "127.0.0.1"], { cwd: root, stdio: "ignore" });
  baseUrl = "http://127.0.0.1:4173/";
  for (let i = 0; i < 60; i++) { try { if ((await fetch(baseUrl)).ok) break; } catch { /* not up yet */ } await sleep(250); }
}
if (!baseUrl) { console.error("pass --serve or --url <game url>"); process.exit(2); }

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, headless: !flag("headed"), args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] });

async function openGame(query = "", { viewport = { width: 1280, height: 720 }, blockSdk = false, touch = false, context = null } = {}) {
  const ctx = context || await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch });
  await ctx.route(/sdk\.crazygames\.com\/crazygames-sdk-v3\.js/, (route) =>
    blockSdk ? route.abort() : route.fulfill({ path: MOCK, contentType: "text/javascript" }));
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (/Data module disabled/.test(text)) return;                       // intentional, scenario-driven
    if (blockSdk && /Failed to load resource/.test(text)) return;       // the scenario itself blocked the SDK script
    errors.push(text);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  const url = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}qa=1${query ? `&${query}` : ""}`;
  const t0 = Date.now();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__GS_QA__ && document.getElementById("boot")?.classList.contains("done"), null, { timeout: 30000 });
  return { ctx, page, errors, bootMs: Date.now() - t0 };
}

const state = (page) => page.evaluate(() => window.__GS_QA__.state);
const mockLog = (page) => page.evaluate(() => (window.__CG_MOCK_LOG__ || []).map((e) => e.event));

async function startRun(page) {
  const vp = page.viewportSize();
  await page.mouse.click(vp.width / 2, vp.height * 0.7);
  await page.waitForFunction(() => window.__GS_QA__.state.phase !== "ready", null, { timeout: 5000 });
}

async function reachResult(page, kind = "win") {
  await startRun(page);
  await sleep(600);
  await page.evaluate((k) => (k === "win" ? window.__GS_QA__.forceWin() : window.__GS_QA__.forceFail()), kind);
  await page.waitForSelector(".modal:not([hidden]) .dialog button", { timeout: 8000 });
}

async function scenario(id, fn) {
  if (opt("only") && !opt("only").split(",").includes(id)) return;
  try { await fn(); }
  catch (e) { record({ id, status: "FAIL", requirements: [], summary: `scenario crashed: ${e.message.split("\n")[0]}` }); }
}

// ------------------------------------------------------------------ scenarios
await scenario("boot", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  let bytes = 0;
  cdp.on("Network.loadingFinished", (e) => { bytes += e.encodedDataLength || 0; });
  const marks = {};
  await page.exposeFunction("__qaMark", (name) => { if (!marks[name]) marks[name] = { t: Date.now(), bytes }; });
  await page.addInitScript(() => { window.__CG_MOCK_ON_RECORD__ = (e) => window.__qaMark?.(e.event); });
  await ctx.route(/sdk\.crazygames\.com\/crazygames-sdk-v3\.js/, (r) => r.fulfill({ path: MOCK, contentType: "text/javascript" }));
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const t0 = Date.now();
  await page.goto(`${baseUrl}?qa=1`);
  await page.waitForFunction(() => window.__GS_QA__ && document.getElementById("boot")?.classList.contains("done"), null, { timeout: 30000 });
  const readyMs = Date.now() - t0;
  const readyBytes = bytes;
  await sleep(300);
  await startRun(page);
  await sleep(300);
  const gs = marks.gameplayStart;
  const mb = (n) => (n / 1048576).toFixed(2);
  const measured = gs ? gs.bytes : readyBytes;
  await page.screenshot({ path: resolve(SHOTS, "boot-first-run.png") });
  allErrors.push(...errors);
  record({
    id: "boot", requirements: ["CG-TECH-001", "CG-TECH-004", "CG-SDK-002"],
    status: measured <= 20 * 1048576 ? "PASS" : measured <= 50 * 1048576 ? "WARN" : "FAIL",
    summary: `ready in ${readyMs} ms; ${mb(measured)} MB transferred up to first gameplayStart (limit 50 MB, mobile homepage 20 MB)`,
    evidence: { readyMs, readyBytes, bytesAtFirstGameplayStart: gs?.bytes ?? null, note: "localhost transfer sizes, SDK script mocked and excluded; CrazyGames' CDN may compress further" },
  });
  await ctx.close();
});

await scenario("sdk-events", async () => {
  const { ctx, page, errors } = await openGame();
  await reachResult(page, "win");
  const log = await mockLog(page);
  const s = await state(page);
  const idx = (e) => log.indexOf(e);
  const problems = [];
  if (idx("init") !== 1) problems.push("init is not the first SDK call");
  if (idx("loadingStart") < 0 || idx("loadingStop") < 0) problems.push("loadingStart/loadingStop missing (optional, recommended)");
  if (idx("gameplayStart") < idx("loadingStop")) problems.push("gameplayStart before loadingStop");
  const starts = log.filter((e) => e === "gameplayStart").length;
  const stops = log.filter((e) => e === "gameplayStop").length;
  if (starts !== stops) problems.push(`unbalanced gameplayStart(${starts})/gameplayStop(${stops}) on the result screen`);
  if (s.gameplayReported) problems.push("gameplay still reported while the result dialog is open");
  allErrors.push(...errors);
  record({
    id: "sdk-events", requirements: ["CG-SDK-002", "CG-SDK-003"], status: problems.length ? "FAIL" : "PASS",
    summary: problems.length ? problems.join("; ") : `order ok: ${log.filter((e) => !e.startsWith("data.")).join(" > ")}`,
    evidence: { log },
  });
  await ctx.close();
});

await scenario("viewports", async () => {
  const rows = [];
  for (const [w, h, kind] of [...CG_VIEWPORTS, [1080, 1620, "portrait-2:3"], [390, 844, "phone-portrait"]]) {
    // A returning player's ready screen is the fullest one: hint, upgrade cards, Start boost, shop button.
    const { ctx, page, errors } = await openGame("runs=3&wins=1&coins=40", { viewport: { width: w, height: h }, touch: kind === "mobile" || kind === "phone-portrait" });
    await sleep(500);
    const m = await page.evaluate(() => {
      const d = document.documentElement;
      const c = document.getElementById("game");
      let minFont = Infinity; const offscreen = [];
      for (const el of document.querySelectorAll("#ui *")) {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0 || r.width === 0) continue;
        if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) minFont = Math.min(minFont, parseFloat(cs.fontSize));
        if (el.closest(".bubbles,.floats")) continue;
        if (r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.left < -1 || r.top < -1) offscreen.push(el.className || el.tagName);
      }
      // Controls and texts of the ready screen must not sit on top of each other.
      const blocks = [".hud .icon-btn", ".hud .progress", ".hud .coins", ".hint .hand", ".hint .main", ".hint .sub", ".upgrades .upgrade", ".boost", ".shop-btn"]
        .flatMap((sel) => [...document.querySelectorAll(`#ui ${sel}`)].map((el) => ({ sel, el })))
        .filter(({ el }) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== "none" && cs.visibility !== "hidden" && !el.closest(".hidden") && r.width > 0; })
        .map(({ sel, el }) => ({ sel, r: el.getBoundingClientRect() }));
      const overlaps = [];
      for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
        const a = blocks[i].r, b = blocks[j].r;
        if (blocks[i].sel === blocks[j].sel || (blocks[i].sel.startsWith(".hint") && blocks[j].sel.startsWith(".hint"))) continue;
        if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) overlaps.push(`${blocks[i].sel} x ${blocks[j].sel}`);
      }
      return { scroll: d.scrollWidth > innerWidth || d.scrollHeight > innerHeight, canvas: [c.clientWidth, c.clientHeight], minFont, offscreen: [...new Set(offscreen)].slice(0, 5), overlaps };
    });
    const file = `viewport-${w}x${h}.png`;
    await page.screenshot({ path: resolve(SHOTS, file) });
    rows.push({ size: `${w}x${h}`, kind, ...m, screenshot: `qa/shots/${file}` });
    allErrors.push(...errors);
    await ctx.close();
  }
  const bad = rows.filter((r) => r.scroll || r.offscreen.length || r.overlaps.length || r.canvas[0] < r.size.split("x")[0] - 1);
  const smallest = Math.min(...rows.map((r) => r.minFont));
  record({
    id: "viewports", requirements: ["CG-GAME-002", "CG-TECH-010"], status: bad.length ? "FAIL" : "UNVERIFIED",
    summary: bad.length ? `layout problems at ${bad.map((r) => `${r.size}${r.overlaps.length ? ` (${r.overlaps.join(", ")})` : ""}${r.offscreen.length ? ` (offscreen: ${r.offscreen.join(", ")})` : ""}`).join("; ")}`
      : `no scroll/overflow/overlap at ${rows.length} sizes (returning player's ready screen), smallest text ${smallest}px - LOOK at qa/shots/viewport-*.png to judge legibility`,
    evidence: { rows },
  });
});

await scenario("no-sdk", async () => {
  const { ctx, page, errors } = await openGame("", { blockSdk: true });
  await startRun(page);
  await sleep(800);
  const s = await state(page);
  allErrors.push(...errors);
  record({ id: "no-sdk", requirements: ["CG-SDK-005"], status: s.phase === "run" && !errors.length ? "PASS" : "FAIL",
    summary: `SDK script blocked: platform=${s.platform.name}, phase=${s.phase}, errors=${errors.length}`, evidence: { state: s, errors } });
  await ctx.close();
});

await scenario("sdk-disabled", async () => {
  const { ctx, page, errors } = await openGame("mockEnv=disabled");
  await startRun(page);
  const s = await state(page);
  record({ id: "sdk-disabled", requirements: ["CG-SDK-005"], status: s.phase === "run" && s.platform.name === "none" && !errors.length ? "PASS" : "FAIL",
    summary: `environment "disabled": platform=${s.platform.name}, phase=${s.phase}, errors=${errors.length}`, evidence: { errors } });
  await ctx.close();
});

await scenario("sdk-init-hang", async () => {
  const t0 = Date.now();
  const { ctx, page, errors } = await openGame("mockInitHang=true");
  const ms = Date.now() - t0;
  await startRun(page);
  record({ id: "sdk-init-hang", requirements: ["CG-SDK-005", "CG-GAME-004"], status: ms < 15000 && !errors.length ? "PASS" : "FAIL",
    summary: `init never resolves: game playable after ${ms} ms`, evidence: { ms, errors } });
  await ctx.close();
});

await scenario("ads-basic-launch", async () => {
  const { ctx, page, errors } = await openGame("mockAd=error&mockAdCode=adsDisabledBasicLaunch");
  await reachResult(page, "win");
  const before = (await state(page)).coins;
  const offer = await page.$('button[data-id="claim_x"]');
  let grantedOnError = false, offerHidden = false, note = "";
  if (offer) {
    await offer.click();
    await sleep(1500);
    grantedOnError = (await state(page)).coins !== before;
    offerHidden = !(await page.$('button[data-id="claim_x"]'));
    note = await page.textContent(".dialog .note");
  }
  await page.click('button[data-id="claim"]');
  await page.waitForFunction(() => window.__GS_QA__.state.phase === "ready" && !window.__GS_QA__.state.pause.length, null, { timeout: 10000 });
  await startRun(page);
  const s = await state(page);
  const ok = !grantedOnError && (offerHidden || !offer) && s.phase === "run";
  await page.screenshot({ path: resolve(SHOTS, "ads-basic-launch-next-level.png") });
  allErrors.push(...errors);
  record({ id: "ads-basic-launch", requirements: ["CG-ADS-021", "CG-ADS-013", "CG-ADS-005"], status: ok ? "PASS" : "FAIL",
    summary: `ads disabled: reward granted on error=${grantedOnError}, dead offer removed=${offerHidden || !offer}, note="${note}", next level playable=${s.phase === "run"}`,
    evidence: { adsLog: s.adsLog } });
  await ctx.close();
});

await scenario("ads-fill", async () => {
  // Adapter (Storm Grid): the very first city result has no video offer (GAME_BRIEF "Claim x3 ... from run 2").
  // Event-ordered (2026-10-07): the page samples the game's state right after each ad event the SDK mock fires, so a
  // slow renderer cannot make the check miss a phase (fixed sleeps sampled too late in software GL).
  const { ctx, page, errors } = await openGame("runs=2&mockAdDelay=900&mockAdLength=900");
  await reachResult(page, "win");
  const before = (await state(page)).coins;
  await page.evaluate(() => {
    const seen = (window.__ADS_FILL__ = []);
    const sample = (at) => { const st = window.__GS_QA__.state; seen.push({ at, adMute: st.audio.adMute, gameplay: st.gameplayReported, overlay: !!document.querySelector(".ad-block:not([hidden])") && getComputedStyle(document.querySelector(".ad-block")).display !== "none" }); };
    window.__CG_MOCK_ON_RECORD__ = (e) => {
      if (!["adRequested", "adStarted", "adFinished", "adError"].includes(e.event)) return;
      setTimeout(() => sample(e.event), 0);   // after the game's own handler for this event has run
    };
  });
  await page.click('button[data-id="claim_x"]');
  await page.waitForFunction(() => (window.__ADS_FILL__ || []).some((x) => x.at === "adFinished" || x.at === "adError"), null, { timeout: 30000 });
  await page.waitForFunction((c) => window.__GS_QA__.state.coins > c, before, { timeout: 15000 }).catch(() => {});
  const seen = await page.evaluate(() => window.__ADS_FILL__);
  const after = await state(page);
  const at = (ev) => seen.find((x) => x.at === ev);
  const req = at("adRequested"), start = at("adStarted"), fin = at("adFinished");
  const problems = [];
  if (!req || !start || !fin) problems.push(`ad events missing: ${seen.map((x) => x.at).join(",") || "none"}`);
  else {
    if (!req.overlay) problems.push("no blocking overlay while the ad was requested");
    if (req.adMute) problems.push("muted on request instead of on adStarted");
    if (!start.adMute) problems.push("not muted while the ad played");
    if (fin.adMute) problems.push("still muted after the ad");
    if (req.gameplay || start.gameplay) problems.push("gameplay reported during the ad");
  }
  if (after.audio.adMute) problems.push("still muted after the ad (final state)");
  if (after.coins <= before) problems.push("reward not granted after adFinished");
  allErrors.push(...errors);
  record({ id: "ads-fill", requirements: ["CG-ADS-003", "CG-ADS-004", "CG-ADS-013", "CG-SDK-003"], status: problems.length ? "FAIL" : "PASS",
    summary: problems.length ? problems.join("; ") : `overlay during request, mute only between adStarted and adFinished, coins ${before} -> ${after.coins}`, evidence: { seen } });
  await ctx.close();
});

await scenario("ads-slow-fill", async () => {
  const { ctx, page, errors } = await openGame("runs=2&mockAd=slow&mockAdDelay=4000");   // runs=2: see ads-fill
  await reachResult(page, "win");
  await page.click('button[data-id="claim_x"]');
  await sleep(1200);
  const blocked = await page.isVisible(".ad-block");
  // Try to progress while the request is pending: the blocker must eat the click.
  await page.mouse.click(640, 400);
  const s = await state(page);
  await page.screenshot({ path: resolve(SHOTS, "ads-slow-fill-blocked.png") });
  record({ id: "ads-slow-fill", requirements: ["CG-ADS-003"], status: blocked && s.pause.includes("ad") && s.level === 1 ? "PASS" : "FAIL",
    summary: `4 s fill: blocker visible=${blocked}, pause=${s.pause.join("+")}, still on level ${s.level}`, evidence: {} });
  allErrors.push(...errors);
  await ctx.close();
});

await scenario("adblock", async () => {
  const { ctx, page, errors } = await openGame("mockAdblock=true");
  await reachResult(page, "win");
  const offer = await page.$('button[data-id="claim_x"]');
  const note = await page.textContent(".dialog .note");
  await page.screenshot({ path: resolve(SHOTS, "adblock-result.png") });
  await page.click('button[data-id="claim"]');
  await page.waitForFunction(() => window.__GS_QA__.state.phase === "ready", null, { timeout: 10000 });
  await startRun(page);
  const s = await state(page);
  allErrors.push(...errors);
  record({ id: "adblock", requirements: ["CG-ADS-020"], status: !offer && note && s.phase === "run" ? "PASS" : "FAIL",
    summary: `adblock: rewarded offer shown=${!!offer}, notice="${note}", keeps playing=${s.phase === "run"}`, evidence: {} });
  await ctx.close();
});

await scenario("mute-priority", async () => {
  const { ctx, page, errors } = await openGame("muteAudio=true");
  await startRun(page);
  // Adapter (Comet Chain): the round locks the pointer (CG-QUAL-008), so HUD buttons are only
  // clickable once it is released - P pauses and frees the mouse, the HUD stays above the overlay.
  if (await page.evaluate(() => !!document.pointerLockElement)) { await page.keyboard.press("KeyP"); await sleep(200); }
  await page.click(".icon-btn.sound");   // player tries to turn sound on
  await page.click(".icon-btn.sound");
  const gain = await page.evaluate(() => window.__GS_AUDIO_GAIN__);
  const s1 = await state(page);
  const { ctx: ctx2, page: p2 } = await openGame("");
  await startRun(p2);
  await p2.evaluate(() => window.__CG_MOCK_SET__({ muteAudio: true }));
  await sleep(100);
  const gain2 = await p2.evaluate(() => window.__GS_AUDIO_GAIN__);
  allErrors.push(...errors);
  record({ id: "mute-priority", requirements: ["CG-SDK-004"], status: gain === 0 && gain2 === 0 ? "PASS" : "FAIL",
    summary: `?muteAudio=true + in-game toggles: gain=${gain}; muteAudio flipped mid-game: gain=${gain2}`, evidence: { audio: s1.audio } });
  await ctx.close();
  await ctx2.close();
});

await scenario("tab-hidden", async () => {
  const { ctx, page, errors } = await openGame("");
  await startRun(page);
  await sleep(500);
  const logBefore = await mockLog(page);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { get: () => "hidden", configurable: true });
    Object.defineProperty(document, "hidden", { get: () => true, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await sleep(200);
  const p1 = (await state(page)).progress;
  await sleep(1000);
  const hidden = await state(page);
  const logHidden = await mockLog(page);
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { get: () => "visible", configurable: true });
    Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await sleep(900);
  const shown = await state(page);
  const newEvents = logHidden.slice(logBefore.length);
  const problems = [];
  if (!hidden.pause.includes("hidden")) problems.push("not paused while hidden");
  if (Math.abs(hidden.progress - p1) > 1e-6) problems.push("simulation advanced while hidden");
  if (newEvents.includes("gameplayStop")) problems.push("gameplayStop sent on tab hide (docs: CrazyGames handles focus changes)");
  if (!hidden.audio.hiddenMute) problems.push("audio not silenced while hidden");
  if (!newEvents.includes("data.setItem")) problems.push("save not flushed on hide");
  if (shown.pause.length) problems.push(`did not resume: ${shown.pause}`);
  allErrors.push(...errors);
  record({ id: "tab-hidden", requirements: ["CG-SDK-003", "CG-GAME-004"], status: problems.length ? "FAIL" : "PASS",
    summary: problems.length ? problems.join("; ") : "pauses + silences + flushes save on hide, no gameplayStop, resumes on return", evidence: { newEvents } });
  await ctx.close();
});

await scenario("persistence", async () => {
  // Two halves, one page at a time (two live software-GL pages starve each other; 2026-10-07 fix):
  // 1) Data module on: a cleared city survives a reload. 2) Data module disabled ("Progress Save" off): the game falls
  //    back to localStorage AND reads it back after a reload (the W1 bug of the 2026-10-02 audit).
  const { ctx, page, errors } = await openGame("");
  await reachResult(page, "win");
  await page.click('button[data-id="claim"]');
  await page.waitForFunction(() => window.__GS_QA__.state.phase === "ready", null, { timeout: 15000 });
  const before = await state(page);
  await page.reload();
  await page.waitForFunction(() => window.__GS_QA__ && document.getElementById("boot")?.classList.contains("done"), null, { timeout: 60000 });
  const after = await state(page);
  const okOn = after.coins === before.coins && after.level === before.level && after.level > 1;
  allErrors.push(...errors);
  await ctx.close();

  const off = await openGame("mockDataDisabled=true");
  await reachResult(off.page, "win");
  await off.page.click('button[data-id="claim"]');
  await off.page.waitForFunction(() => window.__GS_QA__.state.phase === "ready", null, { timeout: 15000 });
  await off.page.evaluate(() => window.dispatchEvent(new Event("pagehide")));   // flush now
  const offBefore = await state(off.page);
  await off.page.reload();
  await off.page.waitForFunction(() => window.__GS_QA__ && document.getElementById("boot")?.classList.contains("done"), null, { timeout: 60000 });
  const offAfter = await state(off.page);
  const okOff = offBefore.save.provider === "localStorage" && offAfter.save.provider === "localStorage"
    && offAfter.coins === offBefore.coins && offAfter.level === offBefore.level && offAfter.level > 1;
  allErrors.push(...off.errors);
  await off.ctx.close();
  record({ id: "persistence", requirements: ["CG-DATA-001", "CG-DATA-002"], status: okOn && okOff ? "PASS" : "FAIL",
    summary: `Data module on: reload keeps level ${after.level} / ${after.coins} coins via ${after.save.provider}; disabled: ${offBefore.save.provider} -> reload keeps level ${offAfter.level} / ${offAfter.coins} coins (${offAfter.save.loadedFrom})`,
    evidence: { before: before.save, after: after.save, offBefore: offBefore.save, offAfter: offAfter.save, note: "cross-device cloud sync can only be checked on CrazyGames (portal preview)" } });
});

await scenario("touch", async () => {
  const { ctx, page, errors } = await openGame("mockDevice=mobile", { viewport: { width: 800, height: 450 }, touch: true });
  await page.touchscreen.tap(400, 330);
  await sleep(600);
  const s = await state(page);
  allErrors.push(...errors);
  record({ id: "touch", requirements: ["CG-TECH-009"], status: s.phase === "run" ? "PASS" : "FAIL",
    summary: `tap on 800x450 touch device starts the run: phase=${s.phase}`, evidence: {} });
  await ctx.close();
});

// ------------------------------------------------------------------ hypercasual profile: poly, dead air, offers
/** Every visible rewarded offer (`data-video`) and the alternatives shown next to it. */
async function auditOffers(page) {
  return page.evaluate(() => {
    const vis = (el) => {
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05 && !el.closest("[hidden]") && !el.closest(".hidden");
    };
    const look = (el) => {
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), font: `${cs.fontSize} ${cs.fontFamily}`, color: cs.color, bg: `${cs.backgroundImage}|${cs.backgroundColor}`, opacity: cs.opacity, filter: cs.filter };
    };
    return [...document.querySelectorAll("#ui [data-video]")].filter(vis).map((el) => {
      const row = el.closest(".row");
      const alternatives = row ? [...row.querySelectorAll("button")].filter((b) => b !== el && !b.hasAttribute("data-video") && vis(b)).map(look) : [];
      return { label: el.textContent.trim(), where: el.closest(".dialog") ? "dialog" : el.closest(".shop") ? "shop" : "screen", icon: !!el.querySelector("svg"), isBtn: el.classList.contains("btn"), offer: look(el), alternatives };
    });
  });
}

const MAX_VIDEO_OFFERS = 2;

/** CG-ADS-007/008 + CG-QUAL-004 as far as a script can see them. Returns problem strings. */
function offerProblems(offers, moment) {
  const p = [];
  for (const o of offers) {
    if (!o.icon) p.push(`${moment}: "${o.label}" has no video icon`);
    if (!o.isBtn) p.push(`${moment}: "${o.label}" is not the shared .btn component`);
    if (o.where === "screen") continue;   // standalone offers: the alternative is playing / buying with coins
    const alt = o.alternatives[0];
    if (!alt) { p.push(`${moment}: "${o.label}" has no decline/alternative visible in the same frame`); continue; }
    const a = o.offer;
    if (Math.abs(a.w - alt.w) > 2 || Math.abs(a.h - alt.h) > 2) p.push(`${moment}: "${o.label}" ${a.w}x${a.h} vs decline ${alt.w}x${alt.h}`);
    if (a.font !== alt.font) p.push(`${moment}: font differs (${a.font} vs ${alt.font})`);
    if (a.color !== alt.color || a.bg !== alt.bg) p.push(`${moment}: colours differ between "${o.label}" and its decline`);
    if (a.opacity !== alt.opacity || (alt.filter !== "none" && o.where === "dialog")) p.push(`${moment}: decline is faded (opacity ${alt.opacity}, filter ${alt.filter})`);
  }
  return p;
}

await scenario("poly-budget", async () => {
  // Two cities: the first one, and a 300-building city (where the frame is heaviest; added 2026-10-07). A frame that
  // re-bakes the static shadow map (after a build or an adaptive-quality change) also draws every caster into the map:
  // a one-off cost, reported separately and not held to the per-frame budget.
  const measure = async (query) => {
    const { ctx, page, errors } = await openGame(query);
    await page.evaluate(() => window.__GS_QA__.setAutopilot?.(true));
    await startRun(page);
    const samples = await page.evaluate(() => new Promise((res) => {
      const out = []; const t0 = performance.now();
      const tick = () => { out.push(window.__GS_QA__.renderInfo()); if (performance.now() - t0 < 6000) requestAnimationFrame(tick); else res(out); };
      requestAnimationFrame(tick);
    }));
    const stats = await page.evaluate(() => window.__GS_QA__.sceneStats?.() ?? null);
    if (!query) await page.screenshot({ path: resolve(SHOTS, "poly-budget.png") });
    allErrors.push(...errors);
    await ctx.close();
    const steady = samples.filter((x) => !x.shadowBake), bakes = samples.filter((x) => x.shadowBake);
    return {
      maxTris: Math.max(...steady.map((x) => x.triangles)), maxCalls: Math.max(...steady.map((x) => x.calls)),
      bakeFrames: bakes.length, bakeMax: bakes.length ? Math.max(...bakes.map((x) => x.triangles)) : 0, frames: samples.length, stats,
    };
  };
  const first = await measure("");
  const big = await measure("level=55");
  const problems = [];
  const stats = first.stats;
  if (!stats) problems.push("the game does not expose __GS_QA__.sceneStats()");
  if (budgets && stats) {
    for (const [name, m] of [["city 1", first], ["city 55", big]]) {
      if (m.maxTris > budgets.trianglesPerFrame) problems.push(`${name}: ${m.maxTris} triangles in one frame > ${budgets.trianglesPerFrame}`);
      if (m.maxCalls > budgets.drawCalls) problems.push(`${name}: ${m.maxCalls} draw calls > ${budgets.drawCalls}`);
      const heavy = (m.stats?.heaviest ?? []).filter((g) => g.triangles > budgets.trianglesPerGeometry);
      if (heavy.length > 1 || heavy.some((g) => g.triangles > budgets.heroTriangles)) {
        problems.push(`${name}: geometries over ${budgets.trianglesPerGeometry} tris: ${heavy.map((g) => `${g.name} ${g.triangles}`).join(", ")} (one hero allowed up to ${budgets.heroTriangles})`);
      }
    }
  }
  const top = big.stats?.heaviest?.[0];
  record({
    id: "poly-budget", requirements: [], status: !budgets ? "INFO" : problems.length ? "FAIL" : "PASS",
    summary: problems.length ? problems.join("; ")
      : `max per frame over 6 s of play: city 1 ${first.maxTris} tris / ${first.maxCalls} calls, city 55 ${big.maxTris} tris / ${big.maxCalls} calls${budgets ? ` (budget ${budgets.trianglesPerFrame} / ${budgets.drawCalls})` : ""}; shadow re-bake frames: ${first.bakeFrames + big.bakeFrames} (max ${Math.max(first.bakeMax, big.bakeMax)} tris, one-off); heaviest geometry ${top ? `${top.name} ${top.triangles} tris x${top.instances}` : "?"}`,
    evidence: { first: { ...first, stats: undefined }, big: { ...big, stats: undefined }, stats: big.stats, budgets },
  });
});

await scenario("dead-air", async () => {
  const limit = budgets?.maxDeadAirSec ?? null;
  const { ctx, page, errors } = await openGame("");
  const autopilot = await page.evaluate(() => typeof window.__GS_QA__.setAutopilot === "function");
  if (autopilot) await page.evaluate(() => window.__GS_QA__.setAutopilot(true));
  await startRun(page);
  const t0 = await page.evaluate(() => performance.now());
  await page.waitForFunction(() => !["run", "battle", "finish"].includes(window.__GS_QA__.state.phase), null, { timeout: 20000 }).catch(() => {});
  const r = await page.evaluate((start) => ({ end: performance.now(), fb: (window.__GS_QA__.feedback || []).filter(([t]) => t >= start), phase: window.__GS_QA__.state.phase }), t0);
  const times = [t0, ...r.fb.map(([t]) => t), r.end];
  let gap = 0, at = 0;
  for (let i = 1; i < times.length; i++) if (times[i] - times[i - 1] > gap) { gap = times[i] - times[i - 1]; at = times[i - 1] - t0; }
  const secs = (r.end - t0) / 1000;
  allErrors.push(...errors);
  record({
    id: "dead-air", requirements: [], status: limit === null || !r.fb.length && !autopilot ? "INFO" : gap / 1000 <= limit ? "PASS" : "FAIL",
    summary: `${r.fb.length} feedback events (sounds + floating numbers) in ${secs.toFixed(1)} s of ${autopilot ? "autopiloted" : "hands-off"} play = ${(r.fb.length / Math.max(secs, 0.1)).toFixed(1)}/s; longest silence ${(gap / 1000).toFixed(1)} s at +${(at / 1000).toFixed(1)} s${limit !== null ? ` (budget ${limit} s)` : ""}; run ended: ${r.phase}`,
    evidence: { autopilot, events: r.fb.length, seconds: secs, longestGapMs: Math.round(gap), gapAtMs: Math.round(at), kinds: [...new Set(r.fb.map((f) => f[2]))] },
  });
  await ctx.close();
});

await scenario("ad-ui", async () => {
  // A returning player (runs, a win, too few coins): the ready screen shows boost and upgrade offers.
  const { ctx, page, errors } = await openGame("runs=3&wins=1&coins=40");
  const problems = [];
  const moments = {};
  await sleep(400);
  moments.ready = await auditOffers(page);
  await page.screenshot({ path: resolve(SHOTS, "ad-ui-ready.png") });
  await startRun(page);
  await sleep(300);
  const during1 = await auditOffers(page);
  await sleep(1200);
  const during2 = await auditOffers(page);
  const inPlay = [...during1, ...during2];
  await page.evaluate(() => window.__GS_QA__.forceWin());
  await page.waitForSelector(".modal:not([hidden]) .dialog button", { timeout: 8000 });
  moments.win = await auditOffers(page);   // same frame the dialog appeared: the decline must already be there
  await sleep(450);                         // screenshot after the entrance animation
  await page.screenshot({ path: resolve(SHOTS, "ad-ui-win.png") });
  await page.click('button[data-id="claim"]');
  await page.waitForFunction(() => window.__GS_QA__.state.phase === "ready" && !window.__GS_QA__.state.pause.length, null, { timeout: 10000 });
  await startRun(page);
  await sleep(300);
  // The revive-type offer needs a near-miss: __GS_QA__.reviveAt (Storm Grid: 85-99% powered).
  await page.evaluate(() => window.__GS_QA__.forceFail(window.__GS_QA__.reviveAt ?? 0.5));
  await page.waitForSelector('.modal:not([hidden]) button[data-id="revive"]', { timeout: 8000 });
  moments.fail = await auditOffers(page);
  await sleep(450);
  await page.screenshot({ path: resolve(SHOTS, "ad-ui-fail-revive.png") });
  if (!moments.ready.length) problems.push("no Start boost offer on the ready screen of a returning player");
  for (const [m, offers] of Object.entries(moments)) {
    problems.push(...offerProblems(offers, m));
    // The skill caps video buttons per screen (OFFERS.maxVideoOffersPerScreen): CG-ADS-011 "special opportunities".
    if (offers.length > MAX_VIDEO_OFFERS) problems.push(`${m}: ${offers.length} video offers on one screen (limit ${MAX_VIDEO_OFFERS})`);
  }
  allErrors.push(...errors);
  record({ id: "ad-ui", requirements: ["CG-ADS-009"], status: inPlay.length ? "FAIL" : "PASS",
    summary: inPlay.length ? `rewarded offer visible during active gameplay: ${inPlay.map((o) => o.label).join(", ")}` : "no rewarded offer visible during active gameplay (checked at +0.3 s and +1.5 s of a run)",
    evidence: { inPlay } });
  record({ id: "ad-ui-style", requirements: ["CG-ADS-007", "CG-ADS-008", "CG-QUAL-004"], status: problems.length ? "FAIL" : "UNVERIFIED",
    summary: problems.length ? problems.join("; ")
      : `${Object.values(moments).flat().length} offers on ready/win/fail screens: video icon, shared .btn, decline in the same frame with equal size/font/colours - LOOK at qa/shots/ad-ui-*.png for clarity and location`,
    evidence: moments });
  await ctx.close();
});

await scenario("revive-offer", async () => {
  // Adapter (Storm Grid): the revive analogue is "One more strike", offered once per session when the
  // last cascade ends at __GS_QA__.reviveAt (85-99%) of the city powered. Its dialog shows "Finish"
  // (data-id "finish", the decline) next to the video offer; a run ending lower goes straight to the
  // city result (Retry / Claim), and the harness clicks through it to the next run.
  const { ctx, page, errors } = await openGame("");
  const problems = [];
  const reviveAt = await page.evaluate(() => window.__GS_QA__.reviveAt ?? 0.5);
  const noOfferThenNextRun = async (label) => {
    const dialog = await page.waitForSelector('.modal:not([hidden]) button[data-id="revive"]', { timeout: 1500 }).then(() => true).catch(() => false);
    if (dialog) problems.push(`revive offered for ${label}`);
    await throughResult(label);
  };
  // The city result (Retry or Claim) -> the next city intro -> a new run.
  const throughResult = async (label) => {
    const btn = await page.waitForSelector('.modal:not([hidden]) button[data-id="retry"], .modal:not([hidden]) button[data-id="claim"]', { timeout: 8000 }).catch(() => null);
    if (!btn) { problems.push(`no city result after ${label}`); return; }
    await btn.click();
    await page.waitForFunction(() => window.__GS_QA__.state.phase === "ready" && !window.__GS_QA__.state.pause.length, null, { timeout: 10000 })
      .catch(() => problems.push(`no next city intro after ${label}`));
    await startRun(page);
  };
  // 1. a weak run gets no revive (not every run: CG-ADS-014) - the result with Retry instead
  await startRun(page);
  await sleep(300);
  await page.evaluate(() => window.__GS_QA__.forceFail(0.05));
  await noOfferThenNextRun("a run ending at 5% powered");
  // 2. the countdown removes the offer at 0 and never requests an ad
  await sleep(300);
  await page.evaluate((a) => window.__GS_QA__.forceFail(a), reviveAt);
  await page.waitForSelector('.modal:not([hidden]) button[data-id="revive"]', { timeout: 8000 });
  const ring1 = await page.textContent(".dialog .ring b");
  // The ring runs on frame time: poll for the drop (a fixed wall-clock sleep misses it on a loaded software renderer).
  await page.waitForFunction((r1) => Number(document.querySelector(".dialog .ring b")?.textContent) < r1, Number(ring1), { timeout: 4000, polling: 100 }).catch(() => {});
  const ring2 = await page.textContent(".dialog .ring b");
  if (!(Number(ring2) < Number(ring1))) problems.push(`countdown not running (${ring1} -> ${ring2})`);
  await page.waitForSelector('.modal:not([hidden]) button[data-id="revive"]', { state: "detached", timeout: 12000 }).catch(() => problems.push("revive offer still there after the countdown"));
  let s = await state(page);
  if (s.adsLog.some((e) => e.type === "rewarded" && e.context === "fail-revive")) problems.push("an ad was requested when the countdown ran out");
  if (!s.adsLog.some((e) => e.type === "offer" && e.context === "fail-revive" && e.outcome === "expired")) problems.push("expiry not logged in the offer funnel");
  if (!(await page.$('.modal:not([hidden]) button[data-id="finish"]'))) problems.push("the Finish path vanished with the offer");
  await page.click('button[data-id="finish"]');
  await throughResult("Finish");
  // 3. watch one revive, then the next near-miss of the session gets none (once per session)
  await sleep(300);
  await page.evaluate((a) => window.__GS_QA__.forceFail(a), reviveAt);
  await page.waitForSelector('.modal:not([hidden]) button[data-id="revive"]', { timeout: 8000 });
  await page.click('button[data-id="revive"]');
  await page.waitForFunction(() => window.__GS_QA__.state.phase === "run", null, { timeout: 8000 }).catch(() => problems.push("revive did not continue the run"));
  await sleep(300);
  await page.evaluate((a) => window.__GS_QA__.forceFail(a), reviveAt);
  await noOfferThenNextRun("a second near-miss in the same session");
  s = await state(page);
  const funnel = s.adsLog.filter((e) => e.context === "fail-revive").map((e) => `${e.type}:${e.outcome}`);
  allErrors.push(...errors);
  record({ id: "revive-offer", requirements: ["CG-ADS-014"], status: problems.length ? "FAIL" : "PASS",
    summary: problems.length ? problems.join("; ") : `no revive at 5% powered (result + retry); ring ${ring1} -> ${ring2} then the offer expired without an ad request; one revive watched, none offered after; funnel ${funnel.join(" > ")}`,
    evidence: { funnel } });
  await ctx.close();
});

await scenario("shop", async () => {
  const problems = [];
  // Cash offer while the next skin is unaffordable, reward only after the video, then a cooldown.
  const { ctx, page, errors } = await openGame("runs=1&coins=0");
  await page.click(".shop-btn");
  await page.waitForSelector(".shop-modal:not([hidden]) .swatch", { timeout: 5000 });
  const offers = await auditOffers(page);
  problems.push(...offerProblems(offers, "shop"));
  await sleep(350);
  await page.screenshot({ path: resolve(SHOTS, "shop.png") });
  const before = await state(page);
  if (!before.pause.includes("menu")) problems.push("the run can start behind the open shop (no menu pause)");
  const cash = await page.$('.shop button[data-act="cash"]');
  if (!cash) problems.push("no +coins offer although the next skin is unaffordable");
  else {
    const label = Number((await cash.textContent()).replace(/\D/g, ""));
    await cash.click();
    await page.waitForFunction((c) => window.__GS_QA__.state.coins > c, before.coins, { timeout: 6000 }).catch(() => problems.push("coins not granted after the video"));
    const after = await state(page);
    if (after.coins - before.coins !== label) problems.push(`granted ${after.coins - before.coins}, button said ${label}`);
    await sleep(700);
    if (await page.$('.shop button[data-act="cash"]')) problems.push("+coins offer still visible right after use (no cooldown)");
    const note = await page.textContent(".shop .note");
    if (!/\d:\d\d/.test(note)) problems.push(`no visible cooldown timer (note "${note}")`);
  }
  await page.click(".shop .close");
  const closed = await state(page);
  if (closed.shopOpen || closed.pause.length) problems.push("closing the shop left the game paused");
  allErrors.push(...errors);
  await ctx.close();
  // Unlock with coins: always a new skin, price deducted, equipped.
  const { ctx: c2, page: p2, errors: e2 } = await openGame("runs=1&coins=400");
  await p2.click(".shop-btn");
  await p2.waitForSelector(".shop-modal:not([hidden]) .swatch", { timeout: 5000 });
  const s0 = await state(p2);
  await p2.click('.shop button[data-act="unlock"]');
  await sleep(700);
  const s1 = await state(p2);
  if (s1.owned.length !== s0.owned.length + 1) problems.push("unlock did not add a skin");
  if (s0.owned.includes(s1.skin)) problems.push("unlock gave a skin the player already owned");
  if (s1.coins >= s0.coins) problems.push("unlock did not cost coins");
  await p2.screenshot({ path: resolve(SHOTS, "shop-unlocked.png") });
  allErrors.push(...e2);
  await c2.close();
  // Try a bolt (from run 4): a locked bolt tapped -> "Try it" (video) in the same row as the coin unlock,
  // same size; watching it equips the bolt for one city and marks it tried (never offered again).
  const { ctx: c4, page: p4, errors: e4 } = await openGame("runs=5&coins=100");
  await p4.click(".shop-btn");
  await p4.waitForSelector(".shop-modal:not([hidden]) .swatch.locked", { timeout: 5000 });
  await p4.click(".shop .swatch.locked");
  const tryBtn = await p4.waitForSelector('.shop button[data-act="try"]', { timeout: 3000 }).catch(() => null);
  if (!tryBtn) problems.push("no Try-it offer for a locked bolt at run 5");
  else {
    const tryOffers = await auditOffers(p4);
    problems.push(...offerProblems(tryOffers, "shop-try"));
    if (tryOffers.length > MAX_VIDEO_OFFERS) problems.push(`shop-try: ${tryOffers.length} video offers on one screen`);
    await tryBtn.click();
    await p4.waitForFunction(() => window.__GS_QA__.state.trialSkin, null, { timeout: 6000 }).catch(() => problems.push("Try it did not equip the bolt after the video"));
    const t4 = await state(p4);
    if (!t4.tried.includes(t4.trialSkin)) problems.push("the tried bolt was not recorded (once per skin)");
    if (t4.owned.includes(t4.trialSkin)) problems.push("Try it unlocked the bolt instead of lending it");
    await p4.click(".shop-btn").catch(() => {});
    await p4.waitForSelector(".shop-modal:not([hidden]) .swatch.locked", { timeout: 5000 }).catch(() => {});
    await p4.click(`.shop .swatch[data-id="${t4.trialSkin}"]`).catch(() => {});
    await sleep(300);
    if (await p4.$('.shop button[data-act="try"]')) problems.push("Try it offered again for the same bolt");
  }
  allErrors.push(...e4);
  await c4.close();
  // Adblock: no dead rewarded button in the shop, a notice instead (CG-ADS-020).
  const { ctx: c3, page: p3, errors: e3 } = await openGame("runs=1&coins=0&mockAdblock=true");
  await sleep(300);
  await p3.click(".shop-btn");
  await p3.waitForSelector(".shop-modal:not([hidden]) .swatch", { timeout: 5000 });
  if (await p3.$('.shop button[data-act="cash"]')) problems.push("adblock: +coins offer still shown in the shop");
  const note3 = await p3.textContent(".shop .note");
  if (!note3.trim()) problems.push("adblock: no notice in the shop");
  allErrors.push(...e3);
  await c3.close();
  record({ id: "shop", requirements: [], status: problems.length ? "FAIL" : "PASS",
    summary: problems.length ? problems.join("; ") : `+coins offer only while unaffordable, granted after the video, then hidden with a timer; unlock adds a new skin for coins; Try it lends a locked bolt once (same-size coin alternative); adblock shows "${note3}"`,
    evidence: { offers } });
});

await scenario("performance", async () => {
  const { ctx, page, errors } = await openGame("");
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await startRun(page);
  const sample = await page.evaluate(() => new Promise((res) => {
    const frames = []; let last = performance.now(); const t0 = last;
    const heap0 = performance.memory?.usedJSHeapSize ?? null;
    const tick = (now) => {
      frames.push(now - last); last = now;
      if (now - t0 < 8000) requestAnimationFrame(tick);
      else res({ frames, heap0, heap1: performance.memory?.usedJSHeapSize ?? null, render: window.__GS_QA__.renderInfo() });
    };
    requestAnimationFrame(tick);
  }));
  const sorted = [...sample.frames].sort((a, b) => a - b);
  const p = (q) => sorted[Math.floor(q * (sorted.length - 1))].toFixed(1);
  const p95 = +p(0.95);
  const s = await state(page);
  allErrors.push(...errors);
  record({ id: "performance", requirements: ["CG-TECH-008", "CG-GAME-004"], status: "UNVERIFIED",
    summary: `4x CPU throttle: p50 ${p(0.5)} ms, p95 ${p95} ms, ${sample.render.calls} draw calls, ${sample.render.triangles} tris, DPR ${s.pixelRatio} - dev GPU, not a 4 GB Chromebook`,
    evidence: { p50: +p(0.5), p95, longFrames: sample.frames.filter((f) => f > 34).length, heapStart: sample.heap0, heapEnd: sample.heap1, render: sample.render } });
  await ctx.close();
});

// ------------------------------------------------------------------ wrap up
const uniqueErrors = [...new Set(allErrors)];
record({ id: "console-errors", requirements: ["CG-GAME-004"], status: uniqueErrors.length ? "FAIL" : "PASS",
  summary: uniqueErrors.length ? `${uniqueErrors.length} distinct errors: ${uniqueErrors.slice(0, 3).join(" | ")}` : "no console errors or page errors across all scenarios", evidence: { errors: uniqueErrors } });

writeFileSync(resolve(OUT, "evidence/browser-qa.json"), JSON.stringify({ tool: "browser-qa", checkedAt: new Date().toISOString(), url: baseUrl, results }, null, 2));
await browser.close();
server?.kill();
const failed = results.filter((r) => r.status === "FAIL").length;
console.log(`\n${results.length} checks: ${failed} FAIL, ${results.filter((r) => r.status === "UNVERIFIED").length} UNVERIFIED (need eyes), evidence in qa/evidence/browser-qa.json`);
process.exit(failed ? 1 : 0);
