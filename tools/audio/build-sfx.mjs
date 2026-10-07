#!/usr/bin/env node
/**
 * Builds the game's sound files from CC0 Kenney packs (kenney.nl; License.txt in each pack: CC0 1.0).
 *
 *   node tools/audio/build-sfx.mjs <kenney-dir>      (needs ffmpeg)
 *
 * <kenney-dir> holds the unzipped packs, one folder per pack: sci-fi-sounds, digital-audio, impact-sounds,
 * interface-sounds, music-jingles, casino-audio, ui-audio (zips from https://kenney.nl/assets/<pack>).
 * The sources are not committed; this script and its output (src/assets/sfx/*.mp3) are.
 *
 * Every sound: trimmed, faded, mono, loudness-matched (the loud part's RMS to TARGET_RMS dBFS, peak at most
 * -1 dBFS), MP3 at 80 kbps. The mix (which sound is louder) is set at play time: SFX_GAIN in src/game/sfx.js.
 * Claude cannot hear these: the owner auditions every sound.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const K = resolve(process.argv[2] || join(root, "assets-src/kenney"));
const OUT = join(root, "src/assets/sfx");
const TMP = join(root, "assets-src/.sfx-tmp");
const TARGET_RMS = -16;
const SR = 44100;

const P = (pack, file) => join(K, pack, "Audio", file);
// name: { src, start?, dur?, fadeIn?, fadeOut?, filter? }  (seconds; filter = extra ffmpeg audio filter)
const SOUNDS = {
  charge: { src: P("digital-audio", "phaserUp3.ogg"), fadeOut: 0.08 },                       // the press: rising
  hum: { src: P("sci-fi-sounds", "forceField_000.ogg"), start: 0.25, dur: 0.18, fadeIn: 0.02, fadeOut: 0.05 },   // re-triggered while charging
  ding: { src: P("interface-sounds", "glass_004.ogg") },                                    // entering the SUPERCHARGE band
  buzz: { src: P("interface-sounds", "error_006.ogg") },                                    // overcharge warning
  crackle: { src: P("sci-fi-sounds", "laserSmall_004.ogg"), dur: 0.15, fadeOut: 0.06 },      // per hop, on the pentatonic ladder
  fork: { src: P("digital-audio", "zapTwoTone.ogg"), dur: 0.34, fadeOut: 0.12 },            // a bolt splits
  gold: { src: P("impact-sounds", "impactBell_heavy_003.ogg") },                            // gold rod
  district: { src: P("music-jingles", "Pizzicato jingles/jingles_PIZZI16.ogg") },           // BLOCK POWERED
  fizzle: { src: P("digital-audio", "phaserDown3.ogg") },                                   // held too long
  powerSweep: { src: P("digital-audio", "powerUp3.ogg") },                                  // FULL POWER: the city lights up
  fanfare: { src: P("music-jingles", "Steel jingles/jingles_STEEL02.ogg") },                // FULL POWER
  win: { src: P("music-jingles", "Steel jingles/jingles_STEEL10.ogg") },                    // city cleared
  fail: { src: P("music-jingles", "Steel jingles/jingles_STEEL16.ogg") },                   // not cleared
  coin: { src: P("casino-audio", "chips-collide-1.ogg") },
  coinTick: { src: P("casino-audio", "chip-lay-1.ogg") },
  click: { src: P("ui-audio", "click1.ogg") },
  pop: { src: P("interface-sounds", "pluck_001.ogg") },
  tier: { src: P("interface-sounds", "confirmation_004.ogg") },                             // upgrade / skin bought
  gateBad: { src: P("interface-sounds", "error_007.ogg") },                                 // can't afford
};

const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { maxBuffer: 1 << 28 });

/** The strike: a bright electric crack, a crunchy blast, a low boom and a rolling rumble with echoes. */
function thunder(out) {
  ff([
    "-i", P("sci-fi-sounds", "laserSmall_001.ogg"),
    "-i", P("sci-fi-sounds", "explosionCrunch_000.ogg"),
    "-i", P("sci-fi-sounds", "lowFrequency_explosion_000.ogg"),
    "-f", "lavfi", "-i", "anoisesrc=color=brown:amplitude=0.9:duration=2.6:seed=7",
    "-filter_complex",
    [
      "[0:a]aformat=channel_layouts=mono,atrim=0:0.12,afade=t=out:st=0.05:d=0.07,volume=0.7[crack]",
      "[1:a]aformat=channel_layouts=mono,volume=0.9[crunch]",
      "[2:a]aformat=channel_layouts=mono,volume=1.0[boom]",
      // rumble: brown noise, low-passed, swelling then decaying, with a slow wobble and a couple of echoes
      "[3:a]aformat=channel_layouts=mono,lowpass=f=320,lowpass=f=320,tremolo=f=5:d=0.45,afade=t=in:st=0:d=0.25,afade=t=out:st=0.6:d=2.0,adelay=80,aecho=0.8:0.6:180|420:0.35|0.22,volume=1.6[rumble]",
      "[crack][crunch][boom][rumble]amix=inputs=4:normalize=0,atrim=0:2.6,afade=t=out:st=1.9:d=0.7",
    ].join(";"),
    "-ar", String(SR), "-ac", "1", out,
  ]);
}

function measure(wav) {
  const buf = execFileSync("ffmpeg", ["-v", "error", "-i", wav, "-f", "f32le", "-ac", "1", "-"], { maxBuffer: 1 << 28 });
  const x = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  let peak = 0; for (const v of x) peak = Math.max(peak, Math.abs(v));
  const N = 1024; let e = 0, n = 0;
  for (let s = 0; s + N <= x.length || (s === 0 && x.length); s += N) {
    let f = 0; const end = Math.min(x.length, s + N); for (let i = s; i < end; i++) f += x[i] * x[i];
    const rms = Math.sqrt(f / Math.max(1, end - s));
    if (rms > peak * 0.1) { e += f; n += end - s; }
    if (end >= x.length) break;
  }
  return { peakDb: 20 * Math.log10(peak || 1e-9), rmsDb: 10 * Math.log10(e / Math.max(1, n) || 1e-12), dur: x.length / SR };
}

if (!existsSync(K)) { console.error(`Kenney packs not found in ${K}`); process.exit(1); }
mkdirSync(OUT, { recursive: true }); mkdirSync(TMP, { recursive: true });
const rows = [];
for (const name of [...Object.keys(SOUNDS), "thunder"]) {
  const wav = join(TMP, `${name}.wav`);
  if (name === "thunder") thunder(wav);
  else {
    const s = SOUNDS[name], f = [];
    if (s.start || s.dur) f.push(`atrim=${s.start || 0}${s.dur ? `:${(s.start || 0) + s.dur}` : ""}`, "asetpts=PTS-STARTPTS");
    if (s.fadeIn) f.push(`afade=t=in:st=0:d=${s.fadeIn}`);
    if (s.fadeOut) {
      const d = s.dur ?? Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", s.src]).toString()) - (s.start || 0);
      f.push(`afade=t=out:st=${Math.max(0, d - s.fadeOut).toFixed(3)}:d=${s.fadeOut}`);
    }
    if (s.filter) f.push(s.filter);
    ff(["-i", s.src, ...(f.length ? ["-af", f.join(",")] : []), "-ar", String(SR), "-ac", "1", wav]);
  }
  const m = measure(wav);
  const gain = Math.min(TARGET_RMS - m.rmsDb, -1 - m.peakDb);
  const mp3 = join(OUT, `${name}.mp3`);
  ff(["-i", wav, "-af", `volume=${gain.toFixed(2)}dB`, "-ac", "1", "-ar", String(SR), "-b:a", "80k", mp3]);
  const after = measure(mp3);
  rows.push(`${name.padEnd(11)} ${m.dur.toFixed(2)}s  gain ${gain.toFixed(1).padStart(5)} dB  -> rms ${after.rmsDb.toFixed(1)} peak ${after.peakDb.toFixed(1)} dBFS  ${(statSync(mp3).size / 1024).toFixed(1)} KB`);
}
rmSync(TMP, { recursive: true, force: true });
console.log(rows.join("\n"));
