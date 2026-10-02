#!/usr/bin/env node
/**
 * Soak + abuse test (docs: game-studio checklists/gameplay-qa.md "Broken states" / "Nothing grows unbounded"):
 * the autopilot plays many cities back to back through the real UI (Claim / Retry / Finish buttons), while the test
 * mashes keys, double-clicks buttons, pauses and resizes the window, and logs heap, DOM nodes, GPU geometries and
 * textures per city. A leak shows as a trend; a crash or a softlock as a timeout.
 *
 *   npm run build
 *   PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/soak.mjs --serve --cities 25
 *   node tools/qa/soak.mjs --url http://127.0.0.1:4173/ --cities 40 --abuse 0
 *
 * Software-rendered CI: the 3D scene is drawn every 2 s (?renderEvery) at the low tier, so the game logic runs in real time.
 * Exit 1 on a console error, a softlock (no dialog within 90 s), or growth over the limits below.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const opt = (name, def = null) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes(`--${name}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CITIES = Number(opt("cities", 20));
const ABUSE = Number(opt("abuse", 1)) === 1;
const MOCK = resolve(root, "dev/mock-crazygames-sdk.js");

let server = null;
let baseUrl = opt("url");
if (flag("serve")) {
  if (!existsSync(resolve(root, "dist/index.html"))) { console.error("dist/ missing - run `npm run build` first"); process.exit(2); }
  server = spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--port", "4173", "--strictPort", "--host", "127.0.0.1"], { cwd: root, stdio: "ignore" });
  baseUrl = "http://127.0.0.1:4173/";
  for (let i = 0; i < 60; i++) { try { if ((await fetch(baseUrl)).ok) break; } catch { /* not up yet */ } await sleep(250); }
}
if (!baseUrl) { console.error("pass --serve or --url <game url>"); process.exit(2); }

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, headless: true, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader", "--enable-precise-memory-info"] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await ctx.route(/sdk\.crazygames\.com\/crazygames-sdk-v3\.js/, (route) => route.fulfill({ path: MOCK, contentType: "text/javascript" }));
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error" && !/Data module disabled/.test(m.text())) errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
await page.goto(`${baseUrl}?qa=1&quality=low&renderEvery=2000&runs=2&wins=2&coins=500${opt("query") ? `&${opt("query")}` : ""}`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__GS_QA__ && document.getElementById("boot")?.classList.contains("done"), null, { timeout: 60000 });
await page.evaluate(() => window.__GS_QA__.setAutopilot(true));

const snap = () => page.evaluate(() => {
  const q = window.__GS_QA__.state;
  const r = window.__GS_QA__.renderInfo();
  return { level: q.level, coins: q.coins, phase: q.phase, heapMB: performance.memory ? performance.memory.usedJSHeapSize / 1048576 : null, dom: document.getElementsByTagName("*").length, geo: r.geometries, tex: r.textures, runs: q.runs, ads: q.adsLog.length };
});

const rows = [];
let lastLevel = 0, citiesDone = 0, mashed = 0;
const t0 = Date.now();
while (citiesDone < CITIES && Date.now() - t0 < 40 * 60 * 1000) {
  // 1. start the next run (the autopilot plays it)
  const s0 = await snap();
  if (s0.phase === "ready") await page.mouse.click(640, 500).catch(() => {});
  // 2. abuse while it plays: key mashing, a pause/resume, a window resize
  if (ABUSE && s0.phase !== "won" && s0.phase !== "failed") {
    for (const code of ["Space", "Enter", "KeyW", "KeyA", "ArrowUp", "KeyM", "KeyM"]) { await page.keyboard.press(code).catch(() => {}); mashed++; }
    if (citiesDone % 3 === 0) { await page.keyboard.press("KeyP"); await sleep(300); await page.mouse.click(640, 360); }   // pause, then click to resume (P cannot resume in this build: see KNOWN_ISSUES in browser-qa.mjs)
    if (citiesDone % 4 === 1) { await page.setViewportSize({ width: 800 + (citiesDone % 5) * 90, height: 450 + (citiesDone % 3) * 120 }); }
  }
  // 3. wait for a dialog (result / near-miss), click through it (double click on purpose)
  let handled = false;
  const tEnd = Date.now() + 90000;
  while (Date.now() < tEnd && !handled) {
    const sel = await page.evaluate(() => {
      const m = document.querySelector(".modal:not([hidden])");
      if (!m) return null;
      for (const id of ["claim", "retry", "finish"]) if (m.querySelector(`button[data-id="${id}"]`)) return id;
      return null;
    });
    if (sel) {
      const btn = await page.$(`.modal:not([hidden]) button[data-id="${sel}"]`);
      if (btn) { await btn.click({ timeout: 5000 }).catch(() => {}); if (ABUSE) await btn.click({ timeout: 300 }).catch(() => {}); handled = true; }
    } else await sleep(400);
  }
  if (!handled) { console.log("SOFTLOCK: no dialog within 90 s", JSON.stringify(await snap())); break; }
  // 4. wait for the next city intro, log
  await page.waitForFunction(() => window.__GS_QA__.state.phase === "ready" || document.querySelector('.modal:not([hidden]) button[data-id="claim"], .modal:not([hidden]) button[data-id="retry"]'), null, { timeout: 60000 }).catch(() => {});
  const s1 = await snap();
  if (s1.phase === "ready") {
    citiesDone++;
    rows.push({ n: citiesDone, ...s1, sec: Math.round((Date.now() - t0) / 1000) });
    if (s1.level !== lastLevel) console.log(`city ${String(s1.level).padStart(2)}  coins ${String(s1.coins).padStart(7)}  heap ${s1.heapMB?.toFixed(1)} MB  dom ${s1.dom}  geo ${s1.geo}  tex ${s1.tex}  t+${rows.at(-1).sec}s`);
    lastLevel = s1.level;
  }
}

const first = rows[2] || rows[0], last = rows.at(-1);
const problems = [];
if (!last) problems.push("no city completed");
else {
  if (rows.length < CITIES) problems.push(`only ${rows.length}/${CITIES} cities completed`);
  if (last.dom - first.dom > 40) problems.push(`DOM grew ${first.dom} -> ${last.dom}`);
  if (last.geo - first.geo > 8) problems.push(`GPU geometries grew ${first.geo} -> ${last.geo}`);
  if (last.tex - first.tex > 4) problems.push(`GPU textures grew ${first.tex} -> ${last.tex}`);
  if (first.heapMB && last.heapMB - first.heapMB > 60) problems.push(`JS heap grew ${first.heapMB.toFixed(0)} -> ${last.heapMB.toFixed(0)} MB`);
}
if (errors.length) problems.push(`${errors.length} console errors: ${[...new Set(errors)].slice(0, 3).join(" | ")}`);
mkdirSync(resolve(root, "qa/evidence"), { recursive: true });
writeFileSync(resolve(root, "qa/evidence/soak.json"), JSON.stringify({ checkedAt: new Date().toISOString(), cities: rows.length, mashedKeys: mashed, abuse: ABUSE, rows, problems }, null, 2));
console.log(problems.length ? `FAIL soak: ${problems.join("; ")}` : `PASS soak: ${rows.length} cities in ${Math.round((Date.now() - t0) / 1000)} s (${ABUSE ? `${mashed} mashed keys, pauses, resizes, double clicks` : "no abuse"}); heap ${first.heapMB?.toFixed(0)} -> ${last.heapMB?.toFixed(0)} MB, dom ${first.dom} -> ${last.dom}, geometries ${first.geo} -> ${last.geo}, textures ${first.tex} -> ${last.tex}, no console errors`);
await browser.close();
server?.kill();
process.exit(problems.length ? 1 : 0);
