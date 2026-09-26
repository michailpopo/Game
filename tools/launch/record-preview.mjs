#!/usr/bin/env node
/**
 * Record the two mandatory CrazyGames preview videos from the game's ?capture=1 mode.
 *
 *   npm run build && node tools/launch/record-preview.mjs --serve [--seconds 18] [--level 8]
 *
 * Spec (docs.crazygames.com/requirements/game-covers, read 2026-09-11):
 *   15-20 s (longer is cut to 20), <= 50 MB, landscape 1080p 16:9 AND portrait 1080p 2:3,
 *   no sound, no default mouse cursor, no black screen/logo intro, no black bars,
 *   no "Play Now"/promo text, no app or social icons, no fast-forwarding,
 *   and the static cover as the opening frame.
 *
 * How: frames are rendered deterministically (the game steps exactly 1/fps per
 * frame), screenshotted, and encoded with ffmpeg. Deterministic capture cannot
 * stutter the way screen recording does, and headless screenshots contain no cursor.
 */

import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const opt = (n, d = null) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const seconds = Number(opt("seconds", 18));
const fps = Number(opt("fps", 30));
const level = Number(opt("level", 5));
const units = Number(opt("units", 40));                          // start crowd: an upgraded mid-game player
const minWinCrowd = Number(opt("min-win-crowd", 12));            // a clip that squeaks past with 1 unit is not a highlight
const lead = Number(opt("lead", Math.round(seconds * 0.6)));     // seconds of running before the finish line
const outDir = resolve(root, opt("out", "submission/video"));
const VIDEOS = [["landscape", 1920, 1080], ["portrait", 1080, 1620]];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (spawnSync("ffmpeg", ["-version"]).status !== 0) { console.error("ffmpeg is required (winget install Gyan.FFmpeg)"); process.exit(2); }
mkdirSync(outDir, { recursive: true });

let server = null;
let base = opt("url");
if (args.includes("--serve")) {
  server = spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--port", "4175", "--strictPort", "--host", "127.0.0.1"], { cwd: root, stdio: "ignore" });
  base = "http://127.0.0.1:4175/";
  for (let i = 0; i < 60; i++) { try { if ((await fetch(base)).ok) break; } catch { /* wait */ } await sleep(250); }
}
if (!base) { console.error("pass --serve or --url"); process.exit(2); }

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined, args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] });

for (const [kind, w, h] of VIDEOS) {
  const frames = resolve(root, `qa/.frames-${kind}`);
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  // English: store assets are seen worldwide; otherwise any text follows this PC's locale
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, locale: "en-US" });
  await ctx.route(/sdk\.crazygames\.com/, (r) => r.abort());
  const page = await ctx.newPage();

  // Opening frame: the cover composition at video resolution.
  await page.goto(`${base}?cover=${kind}&dpr=1`);
  await page.waitForFunction(() => window.__GS_COVER_READY__ === true, null, { timeout: 30000 });
  await page.screenshot({ path: resolve(frames, "cover.png") });

  await page.goto(`${base}?capture=1&dpr=1&capture_level=${level}&capture_lead=${lead}&capture_units=${units}`);
  await page.waitForFunction(() => window.__GS_CAPTURE__, null, { timeout: 30000 });
  const total = Math.round(seconds * fps);
  let last;
  let crowdAtWin = null;
  for (let i = 0; i < total; i++) {
    last = await page.evaluate((dt) => window.__GS_CAPTURE__.frame(dt), 1 / fps);
    if (last.phase === "failed") break;
    if (last.phase === "won" && crowdAtWin === null) crowdAtWin = last.count;
    await page.screenshot({ path: resolve(frames, `${String(i).padStart(5, "0")}.jpg`), type: "jpeg", quality: 92 });
    if (i % fps === 0) process.stdout.write(`\r${kind}: ${i}/${total} frames (phase ${last.phase}, crowd ${last.count})   `);
  }
  process.stdout.write("\n");
  await ctx.close();
  const weak = last.phase === "failed" || crowdAtWin === null || crowdAtWin < minWinCrowd;
  if (weak) {
    // A preview that ends in defeat, never reaches the finish, or scrapes by with a
    // handful of units sells nothing. Measurable spec checks cannot catch this.
    const what = last.phase === "failed" ? `LOST at frame ${last.frame}` : crowdAtWin === null ? `never won (ended in phase ${last.phase})` : `won with only ${crowdAtWin} units`;
    console.error(`${kind}: the autopilot ${what}. Not encoding. Try --units ${units + 20}, another --level, or a different --lead.`);
    await browser.close();
    server?.kill();
    process.exit(1);
  }

  const out = resolve(outDir, `${kind}-${w}x${h}.mp4`);
  const r = spawnSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-loop", "1", "-framerate", String(fps), "-t", "0.6", "-i", resolve(frames, "cover.png"),
    "-framerate", String(fps), "-i", resolve(frames, "%05d.jpg"),
    "-filter_complex", `[0:v]scale=${w}:${h},setsar=1,format=yuv420p[c];[1:v]scale=${w}:${h},setsar=1,format=yuv420p[g];[c][g]concat=n=2:v=1:a=0[v]`,
    "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out,
  ]);
  if (r.status !== 0) { console.error(r.stderr.toString()); process.exit(1); }
  rmSync(frames, { recursive: true, force: true });
  console.log(`wrote ${out} (${(statSync(out).size / 1048576).toFixed(1)} MB, ${(seconds + 0.6).toFixed(1)} s)`);
}

await browser.close();
server?.kill();
console.log("Now WATCH both videos: exciting moments, no dead air, cover as first frame. Then run tools/launch/check-submission.mjs");
