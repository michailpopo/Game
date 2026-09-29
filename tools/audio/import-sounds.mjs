// Turns the owner's audition picks into shipped sounds: decodes each picked Kenney .ogg in Chromium, mixes to mono,
// resamples to 32 kHz, trims silence (short fade-out), keeps the level the owner heard, and writes 16-bit WAV files to
// public/sfx/<sound>.wav (WAV decodes in every browser, iOS Safari included). "Now" keeps the procedural ZzFX sound.
//   node tools/audio/import-sounds.mjs "sounds: thunder=C, charge=A, ..."
// Needs the raw packs in assets-src/kenney/ (see HANDOFF: re-download from kenney.nl/assets/<pack>, CC0).
import { chromium } from "playwright";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const RATE = 32000;
const line = process.argv[2] || "";
const picks = Object.fromEntries([...line.matchAll(/(\w+)=(\w+)/g)].map((m) => [m[1], m[2]]));
const roles = JSON.parse(readFileSync("tools/audio/sound-candidates.json", "utf8"));
const chosen = roles.filter((r) => picks[r.key] && picks[r.key] !== "Now").map((r) => ({ key: r.key, ...r.cands.find((c) => c.id === picks[r.key]) }));
rmSync("public/sfx", { recursive: true, force: true });
mkdirSync("public/sfx", { recursive: true });

const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const page = await b.newPage();
const out = [];
for (const c of chosen) {
  const bytes = [...readFileSync(`assets-src/kenney/${c.source}`)];
  const pcm = await page.evaluate(async ({ bytes, RATE }) => {
    const src = await new OfflineAudioContext(1, 1, 44100).decodeAudioData(new Uint8Array(bytes).buffer);
    const ctx = new OfflineAudioContext(1, Math.ceil(src.duration * RATE), RATE);   // 1 channel: the render downmixes
    const node = ctx.createBufferSource(); node.buffer = src; node.connect(ctx.destination); node.start();
    const d = (await ctx.startRendering()).getChannelData(0);
    let peak = 0; for (const v of d) peak = Math.max(peak, Math.abs(v));
    let a = 0, e = d.length - 1;
    while (a < e && Math.abs(d[a]) < peak * 0.01) a++;
    while (e > a && Math.abs(d[e]) < peak * 0.01) e--;
    a = Math.max(0, a - Math.round(RATE * 0.004));
    e = Math.min(d.length - 1, e + Math.round(RATE * 0.02));
    const s = d.slice(a, e + 1), fade = Math.min(s.length, Math.round(RATE * 0.02));
    for (let i = 0; i < fade; i++) s[s.length - 1 - i] *= i / fade;
    return { pcm: [...s].map((v) => Math.max(-32768, Math.min(32767, Math.round(v * 32767)))), peak };
  }, { bytes, RATE });
  const n = pcm.pcm.length, buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 2, 40);
  pcm.pcm.forEach((v, i) => buf.writeInt16LE(v, 44 + i * 2));
  writeFileSync(`public/sfx/${c.key}.wav`, buf);
  out.push({ key: c.key, source: c.source, sec: +(n / RATE).toFixed(2), kb: Math.round(buf.length / 1024), peak: +pcm.peak.toFixed(2) });
}
await b.close();
writeFileSync("tools/audio/picks.json", JSON.stringify({ picks, shipped: out }, null, 1));
console.table(out);
console.log("paste into src/game/sfx.js:\nexport const STORM_SFX_FILES = {\n" + out.map((o) => `  ${o.key}: "sfx/${o.key}.wav",`).join("\n") + "\n};");
