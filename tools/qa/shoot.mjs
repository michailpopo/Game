#!/usr/bin/env node
/**
 * Look-check screenshots of staged game states (for a human or Claude to LOOK at; nothing is asserted).
 *
 *   npm run build
 *   PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/shoot.mjs --serve --shots ready,charge,fork --sizes 1280x720,450x800
 *   node tools/qa/shoot.mjs --url http://127.0.0.1:4173/ --out qa/look
 *
 * Shots: ready, ready-returning, charge, supercharge, fork, district, result, result-fail, revive, shop, paused, mid, lit, film
 * Each state is staged with the ?qa=1 hooks (window.__GS_QA__: freezeWhen / freeze / setHold / setAim / forceWin ...),
 * frozen on the frame, then captured after the (slow, software) renderer has drawn at least two more frames.
 * Output: <out>/<shot>-<WxH>.png (default qa/look, gitignored). Software WebGL is slow here: judge stills, not fps.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const opt = (name, def = null) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes(`--${name}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const OUT = resolve(root, opt("out", "qa/look"));
mkdirSync(OUT, { recursive: true });
const MOCK = resolve(root, "dev/mock-crazygames-sdk.js");
const WANT = (opt("shots", "ready,charge,fork,result") || "").split(",").filter(Boolean);
const SIZES = (opt("sizes", "1280x720") || "").split(",").filter(Boolean).map((s) => s.split("x").map(Number));
const TWEAK = opt("tweakFile") ? (await import("node:fs")).readFileSync(resolve(opt("tweakFile")), "utf8") : opt("tweak", "");   // JS run in the page after boot (look-dev: window.__GS_LOOK__ / __GS_VIEW__, ?qa=1 only)
const EXTRA = opt("query", "");          // extra query string for every shot, e.g. quality=low
const LEVEL = opt("level", "");          // pin the city number for every shot

let server = null;
let baseUrl = opt("url");
if (flag("serve")) {
  if (!existsSync(resolve(root, "dist/index.html"))) { console.error("dist/ missing - run `npm run build` first"); process.exit(2); }
  server = spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--port", "4173", "--strictPort", "--host", "127.0.0.1"], { cwd: root, stdio: "ignore" });
  baseUrl = "http://127.0.0.1:4173/";
  for (let i = 0; i < 60; i++) { try { if ((await fetch(baseUrl)).ok) break; } catch { /* not up yet */ } await sleep(250); }
}
if (!baseUrl) { console.error("pass --serve or --url <game url>"); process.exit(2); }

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, headless: true, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] });

async function open([w, h], query = "") {
  const touch = w < 700;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch });
  await ctx.route(/sdk\.crazygames\.com\/crazygames-sdk-v3\.js/, (route) => route.fulfill({ path: MOCK, contentType: "text/javascript" }));
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  const q = ["qa=1", LEVEL ? `level=${LEVEL}` : "", EXTRA, query].filter(Boolean).join("&");
  await page.goto(`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}${q}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => (window.__GS_QA__ || window.__GS_CAPTURE__) && document.getElementById("boot")?.classList.contains("done"), null, { timeout: 60000 });
  return { ctx, page, errors };
}

const qa = (page, fn, arg) => page.evaluate(fn, arg);
/** Wait until the renderer drew `n` more frames (the software renderer needs seconds per frame). */
async function frames(page, n = 2, timeout = 60000) {
  const start = await qa(page, () => window.__GS_QA__.renderInfo().frame);
  await page.waitForFunction((s) => window.__GS_QA__.renderInfo().frame >= s, start + n, { timeout, polling: 100 });
}
const phase = (page) => qa(page, () => window.__GS_QA__.state.phase);
async function press(page, size, y = 0.62) { await page.mouse.click(size[0] / 2, size[1] * y); }

/** Start a run with a synthetic press+hold so a charge is on (no real pointer is needed afterwards). */
async function beginHeld(page, size) {
  await qa(page, () => { window.__GS_QA__.setHold(true); window.__GS_QA__.setAim(-1); });
  await qa(page, () => window.__GS_QA__.start());
  await page.waitForFunction(() => window.__GS_QA__.state.phase === "run", null, { timeout: 15000 });
}

const SHOTS = {
  // The first frame of a brand-new player: dark toy city, wordmark, hold hint.
  async ready(page) { await sleep(1800); await frames(page, 2); },
  // A returning player: upgrade cards, Supercharged start, gift, shop button.
  async "ready-returning"(page) { await sleep(1800); await frames(page, 2); },
  // Holding: the charge ring on the target, storm front flicker.
  async charge(page, size) {
    await beginHeld(page, size);
    await qa(page, () => window.__GS_QA__.freezeWhen({ charge: 0.55 }));
    await page.waitForFunction(() => window.__GS_QA__.frozen, null, { timeout: 30000 });
    await sleep(600); await frames(page, 2);
  },
  // In the SUPERCHARGE band (gold ring).
  async supercharge(page, size) {
    await beginHeld(page, size);
    await qa(page, () => window.__GS_QA__.freezeWhen({ charge: 0.88 }));
    await page.waitForFunction(() => window.__GS_QA__.frozen, null, { timeout: 30000 });
    await sleep(600); await frames(page, 2);
  },
  // Mid-cascade: a forked bolt in the air (autopilot strikes the densest dark area).
  async fork(page) {
    await qa(page, () => { window.__GS_QA__.setAutopilot(true); window.__GS_QA__.start(); });
    await qa(page, () => window.__GS_QA__.freezeWhen({ bolts: 3 }));
    await page.waitForFunction(() => window.__GS_QA__.frozen, null, { timeout: 60000 });
    await sleep(700); await frames(page, 2);
  },
  // BLOCK POWERED card.
  async district(page) {
    await qa(page, () => { window.__GS_QA__.setAutopilot(true); window.__GS_QA__.start(); });
    await qa(page, () => window.__GS_QA__.freezeWhen({ district: 0 }));
    await page.waitForFunction(() => window.__GS_QA__.frozen, null, { timeout: 90000 });
    await sleep(700); await frames(page, 2);
  },
  // A mid-run frame: the autopilot a few seconds in.
  async mid(page) {
    await qa(page, () => { window.__GS_QA__.setAutopilot(true); window.__GS_QA__.start(); });
    await page.waitForFunction(() => window.__GS_QA__.state.lit >= 8, null, { timeout: 90000 });
    await qa(page, () => window.__GS_QA__.freeze(true));
    await sleep(700); await frames(page, 2);
  },
  // Result of a won city.
  async result(page) {
    await qa(page, () => window.__GS_QA__.start());
    await sleep(600);
    await qa(page, () => window.__GS_QA__.forceWin());
    await page.waitForSelector(".modal:not([hidden]) .dialog button", { timeout: 30000 });
    await sleep(1400); await frames(page, 2);
  },
  async "result-fail"(page) {
    await qa(page, () => window.__GS_QA__.start());
    await sleep(600);
    await qa(page, () => window.__GS_QA__.forceFail(0.45));
    await page.waitForSelector(".modal:not([hidden]) .dialog button", { timeout: 30000 });
    await sleep(1400); await frames(page, 2);
  },
  // "One more strike" near-miss dialog with the countdown ring.
  async revive(page) {
    await qa(page, () => window.__GS_QA__.start());
    await sleep(600);
    await qa(page, () => window.__GS_QA__.forceFail(window.__GS_QA__.reviveAt));
    await page.waitForSelector('.modal:not([hidden]) button[data-id="revive"]', { timeout: 30000 });
    await sleep(900); await frames(page, 2);
  },
  async shop(page) {
    await sleep(1200);
    await page.click(".shop-btn");
    await page.waitForSelector(".shop-modal:not([hidden])", { timeout: 10000 });
    await sleep(1200); await frames(page, 2);
  },
  async paused(page) {
    await qa(page, () => window.__GS_QA__.start());
    await sleep(500);
    await page.click(".icon-btn.pause");
    await sleep(900); await frames(page, 2);
  },
  // A city powered to ~55% with the dialog hidden: the lit candy colours against the calm unlit ones, no bolts.
  async lit(page) {
    await qa(page, () => window.__GS_QA__.start());
    await sleep(400);
    await qa(page, () => window.__GS_QA__.forceFail(0.55));
    await page.waitForSelector(".modal:not([hidden]) .dialog button", { timeout: 30000 });
    await qa(page, () => { document.querySelector(".modal").hidden = true; window.__GS_VIEW__.fxScale = 0; });
    await sleep(600); await frames(page, 3);
  },
  // Filmstrip: the deterministic capture mode (?capture=1, the autopilot plays) stepped at exactly 1/30 s per drawn frame, so the
  // juice is judged as a 30 fps player sees it even though this container draws a frame per second. FILM_FROM / FILM_TO /
  // FILM_EVERY (frames) pick the window; files: <out>/film-<WxH>-<frame>.png
  async film(page, size) {
    const from = Number(process.env.FILM_FROM || 36), to = Number(process.env.FILM_TO || 120), every = Number(process.env.FILM_EVERY || 3);
    let last = null;
    for (let i = 0; i <= to; i++) {
      last = await qa(page, () => window.__GS_CAPTURE__.frame(1 / 30));
      if (i >= from && (i - from) % every === 0) await page.screenshot({ path: resolve(OUT, `film-${size[0]}x${size[1]}-${String(i).padStart(3, "0")}.png`) });
      if (last.phase !== "run") break;
    }
    console.log(`     film ended at frame ${last.frame}: phase ${last.phase}, powered ${(last.progress * 100).toFixed(0)}%`);
    return "manual";
  },
};
// Query per shot (save fixtures: a returning player has runs / wins / coins).
const QUERY = {
  "ready-returning": "runs=6&wins=3&coins=140&level=7&up=3,2,0,1,0",
  fork: "up=2,2,0,0,0&level=3", district: "up=2,2,0,0,0&level=3", mid: "level=3",
  shop: "runs=6&wins=3&coins=130&level=4", supercharge: "level=3", charge: "level=3",
  result: "level=3", "result-fail": "level=3", revive: "runs=3&wins=1&level=3", paused: "level=3",
  film: "capture=1&capture_level=3", lit: "level=3",
};

const failed = [];
for (const size of SIZES) {
  for (const name of WANT) {
    const fn = SHOTS[name];
    if (!fn) { console.error(`unknown shot "${name}"`); continue; }
    const tag = `${name}-${size[0]}x${size[1]}`;
    let ctxHandle = null;
    try {
      const t0 = Date.now();
      const { ctx, page, errors } = await open(size, QUERY[name] || "");
      ctxHandle = ctx;
      if (TWEAK) { await page.evaluate(`(() => { ${TWEAK}\n})()`); }
      const manual = (await fn(page, size)) === "manual";
      if (manual) { console.log(`OK   ${tag.padEnd(28)} ${((Date.now() - t0) / 1000).toFixed(1)}s${errors.length ? `  ERRORS: ${errors.slice(0, 2).join(" | ")}` : ""}`); continue; }
      await page.screenshot({ path: resolve(OUT, `${tag}.png`) });
      const info = await qa(page, () => ({ ...window.__GS_QA__.renderInfo(), phase: window.__GS_QA__.state.phase, lit: window.__GS_QA__.state.lit, of: window.__GS_QA__.state.buildings }));
      console.log(`OK   ${tag.padEnd(28)} ${((Date.now() - t0) / 1000).toFixed(1)}s  calls ${info.calls}  tris ${info.triangles}  phase ${info.phase}  lit ${info.lit}/${info.of}${errors.length ? `  ERRORS: ${errors.slice(0, 2).join(" | ")}` : ""}`);
    } catch (e) {
      failed.push(tag);
      console.log(`FAIL ${tag.padEnd(28)} ${e.message.split("\n")[0]}`);
    } finally {
      await ctxHandle?.close().catch(() => {});
    }
  }
}
await browser.close();
server?.kill();
console.log(`screenshots in ${OUT}${failed.length ? `; failed: ${failed.join(", ")}` : ""}`);
process.exit(failed.length ? 1 : 0);
