#!/usr/bin/env node
/**
 * Render the three mandatory CrazyGames cover images from the game's ?cover= mode.
 *
 *   npm run build && node tools/launch/capture-covers.mjs --serve
 *
 * Spec (docs.crazygames.com/requirements/game-covers, read 2026-09-11):
 *   landscape 16:9 1920x1080 | portrait 2:3 800x1200 | square 1:1 800x800
 *   no borders, no text except the game title, no icons or store logos,
 *   no copyrighted visuals you lack rights to, nothing blurry or pixelated.
 *   Guideline: "Don't just take a screenshot" - use a composed hero shot + a big title.
 *
 * Rendered at 2x and downscaled with ffmpeg (Lanczos) for clean edges.
 * The rules about content still need eyes: open the PNGs before submitting.
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const opt = (n, d = null) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const outDir = resolve(root, opt("out", "submission/covers"));
mkdirSync(outDir, { recursive: true });
const COVERS = [["landscape", 1920, 1080], ["portrait", 800, 1200], ["square", 800, 800]];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let server = null;
let base = opt("url");
if (args.includes("--serve")) {
  server = spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--port", "4174", "--strictPort", "--host", "127.0.0.1"], { cwd: root, stdio: "ignore" });
  base = "http://127.0.0.1:4174/";
  for (let i = 0; i < 60; i++) { try { if ((await fetch(base)).ok) break; } catch { /* wait */ } await sleep(250); }
}
if (!base) { console.error("pass --serve or --url"); process.exit(2); }

const hasFfmpeg = spawnSync("ffmpeg", ["-version"]).status === 0;
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] });
// Storm Grid: --level (city) and --up V,F,S,C,G (the upgrade levels of the storm shown: a real mid-game save)
const extra = [`cover_level=${opt("level", "12")}`, `capture_up=${opt("up", "12,10,1,4,2")}`, opt("share") && `cover_share=${opt("share")}`].filter(Boolean).join("&");

for (const [kind, w, h] of COVERS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, locale: "en-US" });
  await ctx.route(/sdk\.crazygames\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(`${base}?cover=${kind}&dpr=2${extra ? `&${extra}` : ""}`);
  await page.waitForFunction(() => window.__GS_COVER_READY__ === true, null, { timeout: 120000, polling: 500 });
  const raw = resolve(outDir, `.${kind}@2x.png`);
  const final = resolve(outDir, `${kind}-${w}x${h}.png`);
  await page.screenshot({ path: raw, timeout: 180000 });
  if (hasFfmpeg) {
    const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-vf", `scale=${w}:${h}:flags=lanczos`, final]);
    if (r.status !== 0) { console.error(r.stderr.toString()); process.exit(1); }
    rmSync(raw);
    console.log(`wrote ${final}`);
  } else {
    console.log(`ffmpeg not found: kept 2x render ${raw} (UNVERIFIED size - scale it to ${w}x${h})`);
  }
  await ctx.close();
}

await browser.close();
server?.kill();
console.log("Now LOOK at every cover: title only, no borders/logos, readable at thumbnail size, not blurry.");
if (!existsSync(outDir)) process.exit(1);
