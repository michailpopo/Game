// Measures sound files in Chromium (duration, effective length, peak, RMS, attack, zero-crossing rate).
// Serve the folder first: python3 -m http.server 8765 --directory assets-src/kenney
//   find assets-src/kenney -name "*.ogg" | sed "s|assets-src/kenney/||" > list.txt; node tools/audio/scan-sounds.mjs list.txt out.json
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
const list = readFileSync(process.argv[2], "utf8").trim().split("\n");
const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const p = await b.newPage();
await p.goto("http://127.0.0.1:8765/");
const res = await p.evaluate(async (list) => {
  const out = [];
  const ctx = new OfflineAudioContext(1, 1, 44100);
  for (const f of list) {
    try {
      const buf = await ctx.decodeAudioData(await (await fetch(encodeURI(f))).arrayBuffer());
      const d = buf.getChannelData(0), n = d.length, sr = buf.sampleRate;
      let peak = 0, peakAt = 0, sum = 0, zc = 0;
      for (let i = 0; i < n; i++) { const v = Math.abs(d[i]); if (v > peak) { peak = v; peakAt = i; } sum += d[i] * d[i]; if (i && (d[i] >= 0) !== (d[i - 1] >= 0)) zc++; }
      // effective length: until the level falls under 2% of the peak for good
      let end = n - 1; while (end > 0 && Math.abs(d[end]) < peak * 0.02) end--;
      out.push({ f, dur: +(n / sr).toFixed(2), eff: +(end / sr).toFixed(2), peak: +peak.toFixed(2), rms: +Math.sqrt(sum / n).toFixed(3), attack: +(peakAt / sr).toFixed(3), zcr: Math.round(zc / (n / sr)), ch: buf.numberOfChannels, sr });
    } catch (e) { out.push({ f, err: String(e) }); }
  }
  return out;
}, list);
writeFileSync(process.argv[3], JSON.stringify(res));
console.log(res.length, res.filter((r) => r.err).length, "errors");
await b.close();
