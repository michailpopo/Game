#!/usr/bin/env node
/**
 * Audio level check (quality pass 2026-10; CrazyGames quality guideline "audio levels are consistent, sounds
 * aren't too loud or quiet"). Claude cannot listen, so this renders every sound OFFLINE in Chromium and
 * measures it: each ZzFX effect at its play volume through the SFX bus, the music in its calm and run
 * layers, the rain bed and a distant rumble. It does not judge taste - the owner auditions the sounds.
 *
 *   PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/audio-levels.mjs
 *
 * Prints peak and RMS in dBFS per sound and FAILs (exit 1) when anything clips (peak > -0.1 dBFS) or when
 * the music bed is not clearly under the effects (music RMS must sit >= 6 dB below the median SFX RMS).
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const strip = (src) => src.replace(/^export /gm, "").replace(/^import .*$/gm, "");
const zzfx = strip(readFileSync(resolve(root, "src/core/zzfx.js"), "utf8"));
const music = strip(readFileSync(resolve(root, "src/game/music.js"), "utf8"));
const sfxSrc = (file, name) => {
  const m = readFileSync(resolve(root, file), "utf8").match(new RegExp(`export const ${name} = (\\{[\\s\\S]*?\\n\\});`));
  return m[1];
};
const SFX = sfxSrc("src/core/audio.js", "SFX"), STORM = sfxSrc("src/game/sfx.js", "STORM_SFX");

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const page = await browser.newPage();
await page.setContent("<!doctype html><title>audio levels</title>");
const out = await page.evaluate(async ({ zzfx, music, SFX, STORM }) => {
  // eslint-disable-next-line no-new-func
  const lib = new Function(`${zzfx}\n${music}\nreturn { buildSamples, StormMusic, MUSIC_LEVELS };`)();
  const defs = { ...eval(`(${SFX})`), ...eval(`(${STORM})`) };
  const rate = 44100;
  const db = (v) => (v > 0 ? 20 * Math.log10(v) : -Infinity);
  const measure = (ch, from = 0) => {
    let peak = 0, sum = 0, n = 0;
    for (let i = from; i < ch.length; i++) { const v = Math.abs(ch[i]); if (v > peak) peak = v; sum += v * v; n++; }
    return { peak: db(peak), rms: db(Math.sqrt(sum / Math.max(1, n))) };
  };
  const rows = [];
  // SFX: the samples x the SFX bus gain (0.9, AudioService), at volume 1 (what play() uses by default)
  for (const [name, p] of Object.entries(defs)) {
    const q = [...p]; while (q.length < 21) q.push(undefined);
    const s = lib.buildSamples(...q, rate).map((v) => v * 0.9);
    // RMS over the loud part only (the first 60% of the sound): tails would read as "quiet"
    const m = measure(s.subarray ? s : Float32Array.from(s));
    const head = Float32Array.from(s).subarray(0, Math.max(1, Math.floor(s.length * 0.6)));
    rows.push({ kind: "sfx", name, peak: m.peak, rms: measure(head).rms, sec: s.length / rate });
  }
  // Music + rain: render 12 s per layer
  async function render(layer, rainOnly = false) {
    const ctx = new OfflineAudioContext(1, rate * 12, rate);
    const m = new lib.StormMusic();
    m.attach(ctx, ctx.destination);
    m.setLayer(layer);
    if (rainOnly) m.ctx = null;   // no notes: rain bed only
    else m.scheduleAhead(11.5);
    const buf = await ctx.startRendering();
    return measure(buf.getChannelData(0), rate * 4);   // skip the fade-in
  }
  rows.push({ kind: "music", name: "calm (pad + arp + rain)", ...(await render("calm")), sec: 8 });
  rows.push({ kind: "music", name: "run (+ bass, kick, hats)", ...(await render("run")), sec: 8 });
  rows.push({ kind: "music", name: "rain bed only", ...(await render("calm", true)), sec: 8 });
  return rows;
}, { zzfx, music, SFX, STORM });
await browser.close();

const f = (v) => (v === -Infinity ? "  -inf" : v.toFixed(1).padStart(6));
const sfx = out.filter((r) => r.kind === "sfx");
const med = [...sfx.map((r) => r.rms)].sort((a, b) => a - b)[sfx.length >> 1];
const problems = [];
console.log("sound                         peak dBFS   RMS dBFS   length");
for (const r of out) {
  console.log(`${(r.kind === "music" ? "[music] " : "") + r.name}`.padEnd(30), f(r.peak), "   ", f(r.rms), `   ${r.sec.toFixed(2)} s`);
  if (r.peak > -0.1) problems.push(`${r.name} clips (peak ${r.peak.toFixed(1)} dBFS)`);
}
const run = out.find((r) => r.name.startsWith("run"));
console.log(`\nmedian SFX RMS ${med.toFixed(1)} dBFS; music (run layer) RMS ${run.rms.toFixed(1)} dBFS -> ${(med - run.rms).toFixed(1)} dB under the effects`);
if (med - run.rms < 6) problems.push(`music only ${(med - run.rms).toFixed(1)} dB under the median SFX (want >= 6 dB)`);
console.log(problems.length ? `FAIL  ${problems.join("; ")}` : "PASS  no clipping; the music bed sits under the effects");
process.exit(problems.length ? 1 : 0);
