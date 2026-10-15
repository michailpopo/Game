/**
 * Storm Grid music + rain ambience - procedural Web Audio, zero files (quality pass 2026-10).
 *
 *   const music = new StormMusic();
 *   audio.onUnlock(({ ctx, master }) => music.attach(ctx, master));   // through the AudioService master:
 *                                                                     // platform / ad / hidden / player mute apply
 *   music.setLayer("calm" | "run")   // city intro: pad + arpeggio; a run adds bass, a soft kick and hats
 *   music.rumble(delaySec)           // distant thunder under the rain (the clouds' sheet lightning)
 *   music.update()                   // ~every frame: schedules the next notes (look-ahead 0.25 s)
 *
 * Score: 96 BPM, a 4-bar loop Am - F - C - G (i - VI - III - VII), soft and low so the SFX stay on top:
 *   pad      2 detuned saws per chord tone through a 900 Hz low-pass, slow attack/release
 *   arp      triangle plucks on 8ths from the chord tones + octave, a dotted-8th echo
 *   bass     triangle root on beat 1 and the "and" of 2 (run only)
 *   kick     a short sine drop on beats 1 and 3 (run only); hats: filtered noise ticks on the off-beats (run only)
 *   rain     looped band-passed noise, always on (the storm)
 * Levels: music bus 0.42 and rain 0.05 against SFX at 0.9 (tools/qa/audio-levels.mjs renders and measures them).
 * Claude cannot hear: the owner auditions the mix (HANDOFF.md).
 */

const BPM = 96;
const BEAT = 60 / BPM;
const STEP = BEAT / 2;                       // 8th notes
const BAR = BEAT * 4;
// MIDI notes per bar: chord tones (low to high) and the bass root
const CHORDS = [
  { tones: [57, 60, 64], root: 45 },         // Am  (A3 C4 E4), A2
  { tones: [53, 57, 60], root: 41 },         // F   (F3 A3 C4), F2
  { tones: [55, 60, 64], root: 48 },         // C   (G3 C4 E4), C3
  { tones: [55, 59, 62], root: 43 },         // G   (G3 B3 D4), G2
];
const ARP = [0, 1, 2, 3, 2, 1, 2, 3];       // chord-tone index per 8th (3 = the root an octave up)
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

export const MUSIC_LEVELS = { music: 0.42, rain: 0.05, pad: 0.05, arp: 0.07, bass: 0.16, kick: 0.22, hat: 0.025 };

export class StormMusic {
  ctx = null;
  #out = null; #music = null; #echo = null; #layers = {};
  #next = 0; #step = 0; #layer = "calm"; #noise = null; #rain = null;

  /** Connect to a running AudioContext; `out` is the AudioService master (mute applies). Idempotent. */
  attach(ctx, out) {
    if (this.ctx) return;
    this.ctx = ctx;
    this.#out = out;
    const L = MUSIC_LEVELS;
    this.#music = ctx.createGain();
    this.#music.gain.value = 0;
    this.#music.gain.setTargetAtTime(L.music, ctx.currentTime + 0.05, 1.2);   // fade in over the first seconds
    this.#music.connect(out);
    // dotted-8th echo for the arp
    const d = ctx.createDelay(1);
    d.delayTime.value = STEP * 1.5;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    const damp = ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 1800;
    d.connect(damp).connect(fb).connect(d);
    damp.connect(wet).connect(this.#music);
    this.#echo = d;
    // layer buses: "run" layers fade in/out with the run
    for (const name of ["pad", "arp", "bass", "kick", "hat"]) {
      const g = ctx.createGain();
      g.gain.value = name === "pad" || name === "arp" ? L[name] : 0;
      g.connect(this.#music);
      this.#layers[name] = g;
    }
    this.#layers.arp.connect(d);
    // noise source shared by the rain, the hats and the rumble
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    let b = 0;
    for (let i = 0; i < len; i++) { b = 0.97 * b + 0.03 * (Math.random() * 2 - 1); ch[i] = (Math.random() * 2 - 1) * 0.6 + b * 4; }
    this.#noise = buf;
    this.#startRain();
    this.setLayer(this.#layer);
    this.#next = ctx.currentTime + 0.1;
    this.#step = 0;
  }

  #startRain() {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.#noise;
    src.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 500;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 5200;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.setTargetAtTime(MUSIC_LEVELS.rain, ctx.currentTime + 0.05, 1.5);
    src.connect(hp).connect(lp).connect(g).connect(this.#out);
    src.start();
    this.#rain = g;
  }

  /** "calm" (city intro, results) or "run" (strikes in play): the rhythm section fades in and out. */
  setLayer(name) {
    this.#layer = name;
    if (!this.ctx) return;
    const t = this.ctx.currentTime, run = name === "run", L = MUSIC_LEVELS;
    for (const k of ["bass", "kick", "hat"]) this.#layers[k].gain.setTargetAtTime(run ? L[k] : 0, t, run ? 0.4 : 0.8);
  }

  /** Distant thunder under the rain, `delay` s from now (sound arrives after the flash). */
  rumble(delay = 0.8, level = 0.5) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== "running") return;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = this.#noise;
    src.playbackRate.value = 0.5;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 220;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5 * level, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.001, t + 2.4);
    src.connect(lp).connect(g).connect(this.#out);
    src.start(t, Math.random());
    src.stop(t + 2.5);
  }

  /** Offline rendering (tools/qa/audio-levels.mjs): schedule the next `seconds` of the loop at once. */
  scheduleAhead(seconds) {
    const end = this.ctx.currentTime + seconds;
    while (this.#next < end) {
      this.#schedule(this.#step, this.#next);
      this.#next += STEP;
      this.#step = (this.#step + 1) % (CHORDS.length * 8);
    }
  }

  /** Schedule every note that starts within the next 0.25 s (call often; cheap when nothing is due). */
  update() {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== "running") return;
    if (this.#next < ctx.currentTime - 0.5) this.#next = ctx.currentTime + 0.05;   // after a suspend: no burst of old notes
    while (this.#next < ctx.currentTime + 0.25) {
      this.#schedule(this.#step, this.#next);
      this.#next += STEP;
      this.#step = (this.#step + 1) % (CHORDS.length * 8);
    }
  }

  #schedule(step, t) {
    const bar = Math.floor(step / 8), s8 = step % 8;
    const chord = CHORDS[bar];
    if (s8 === 0) {
      for (const m of chord.tones) this.#pad(hz(m), t, BAR);
      this.#kick(t);
      this.#bass(hz(chord.root), t, BEAT * 1.4);
    }
    if (s8 === 3) this.#bass(hz(chord.root), t, BEAT * 0.9);
    if (s8 === 4) this.#kick(t);
    if (s8 % 2 === 1) this.#hat(t);
    const idx = ARP[s8];
    const m = idx === 3 ? chord.tones[0] + 12 : chord.tones[idx];
    this.#pluck(hz(m + 12), t);
  }

  #voice(type, freq, detune = 0) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    return o;
  }

  #pad(freq, t, dur) {
    const ctx = this.ctx;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    lp.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 0.7);
    g.gain.setValueAtTime(1, t + dur - 0.2);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.6);
    lp.connect(g).connect(this.#layers.pad);
    for (const det of [-7, 7]) {
      const o = this.#voice("sawtooth", freq, det);
      o.connect(lp);
      o.start(t);
      o.stop(t + dur + 0.7);
    }
  }

  #pluck(freq, t) {
    const ctx = this.ctx;
    const o = this.#voice("triangle", freq);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    o.connect(g).connect(this.#layers.arp);
    o.start(t);
    o.stop(t + 0.35);
  }

  #bass(freq, t, dur) {
    const ctx = this.ctx;
    const o = this.#voice("triangle", freq);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 0.02);
    g.gain.setTargetAtTime(0.6, t + 0.05, 0.15);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(lp).connect(g).connect(this.#layers.bass);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  #kick(t) {
    const ctx = this.ctx;
    const o = this.#voice("sine", 110);
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    o.connect(g).connect(this.#layers.kick);
    o.start(t);
    o.stop(t + 0.28);
  }

  #hat(t) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.#noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.8, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    src.connect(hp).connect(g).connect(this.#layers.hat);
    src.start(t, Math.random() * 1.5);
    src.stop(t + 0.06);
  }
}
