/**
 * Audio service.
 *
 * Mute sources, in priority order (separate flags, so "unmute after the ad" can
 * never override the platform):
 *   1. platform settings.muteAudio - CG-SDK-004: "should take priority over your
 *      in-game audio settings"
 *   2. ad mute - set on adStarted, cleared on adFinished/adError (CG-ADS-004)
 *   3. hidden - tab hidden/blurred; browsers keep playing audio in background tabs
 *   4. the player's own toggle
 *
 * Browser reality:
 *   - No AudioContext before a user gesture (autoplay policy). Created in unlock().
 *   - iOS interrupts the context when backgrounded; resume() must run inside a
 *     touchend/click handler, visibilitychange alone is not enough (CG-TECH-017).
 *
 * Sounds are procedural (ZzFX, MIT) by default. A game may also pass `samples` (name -> { url, gain, pitchExp }):
 * those files are fetched by preload() (or on unlock) and decoded once the AudioContext exists; until a file is
 * decoded - or if it fails to load - the ZzFX sound of the same name plays, so audio never waits on the network.
 * Claude cannot listen to these: a human auditions every sound.
 */

import { buildSamples } from "./zzfx.js";

/** ZzFX parameter arrays. Order: volume, randomness, frequency, attack, sustain, release, shape, shapeCurve, slide, deltaSlide, pitchJump, pitchJumpTime, repeatTime, noise, modulation, bitCrush, delay, sustainVolume, decay, tremolo, filter */
export const SFX = {
  gateGood: [1, 0, 523, 0.01, 0.06, 0.2, 1, 1.6, 0, 0, 262, 0.06, 0, 0, 0, 0, 0, 0.7, 0.03],
  gateBad: [0.9, 0, 196, 0.01, 0.08, 0.25, 2, 1.2, -3, 0, 0, 0, 0, 0.1, 0, 0, 0, 0.5, 0.05, 0, 900],
  pop: [0.35, 0.15, 620, 0, 0.01, 0.05, 1, 2.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4],
  hit: [1, 0.05, 110, 0.005, 0.04, 0.25, 4, 1.6, -1.5, 0, 0, 0, 0, 0.6, 0, 0.1, 0, 0.5, 0.08, 0, 1400],
  coin: [0.6, 0, 1318, 0, 0.02, 0.12, 1, 1.5, 0, 0, 659, 0.04, 0, 0, 0, 0, 0, 0.6],
  win: [0.9, 0, 523, 0.02, 0.22, 0.45, 1, 1.1, 0, 0, 262, 0.12, 0.12, 0, 0, 0, 0.04, 0.7, 0.08],
  fail: [0.9, 0, 294, 0.02, 0.18, 0.5, 2, 1.4, -2.5, 0, 0, 0, 0, 0.1, 0, 0, 0, 0.6, 0.12, 0, 1100],
  click: [0.45, 0, 880, 0, 0.01, 0.04, 1, 1.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4],
  tier: [0.7, 0, 659, 0.005, 0.04, 0.14, 1, 1.4, 0, 0, 330, 0.03, 0, 0, 0, 0, 0, 0.6],
  clash: [0.4, 0.25, 150, 0, 0.02, 0.07, 4, 1.8, 0, 0, 0, 0, 0, 0.7, 0, 0, 0, 0.4, 0, 0, 2000],
};

export class AudioService {
  #defs; #ctx = null; #master = null; #sfx = null;
  #platformMute = false; #adMute = false; #hiddenMute = false; #userMute = false;
  #buffers = new Map(); #lastPlay = new Map(); #active = new Map();
  #listeners = new Set();
  #samples; #raw = new Map(); #mix = new Map();

  /**
   * @param {{ sounds?: object, samples?: Record<string, { url: string, gain?: number, pitchExp?: number }>, userMuted?: boolean }} [o]
   *   samples: gain = this file's level in the mix; pitchExp: play-time pitch p becomes p ** pitchExp for the file
   *   (< 1 narrows a pitch ladder that a sampled sound cannot follow as far as a synthesised one)
   */
  constructor({ sounds = SFX, samples = {}, userMuted = false } = {}) {
    this.#defs = sounds;
    this.#samples = samples;
    this.#userMute = userMuted;
  }

  /** Starts fetching the sample files (no AudioContext needed). Safe to call more than once. */
  preload() {
    for (const [name, s] of Object.entries(this.#samples)) {
      if (this.#raw.has(name)) continue;
      this.#raw.set(name, fetch(s.url).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null));
    }
    return this;
  }

  /** Decodes each fetched sample into the context; a decoded file replaces the ZzFX sound of the same name. */
  #decodeSamples() {
    this.preload();
    for (const [name, pending] of this.#raw) {
      pending.then((bytes) => (bytes ? this.#ctx.decodeAudioData(bytes.slice(0)) : null)).then((buf) => {
        if (!buf) return;
        this.#buffers.set(name, buf);
        const s = this.#samples[name];
        this.#mix.set(name, { gain: s.gain ?? 1, pitchExp: s.pitchExp ?? 1 });
      }).catch(() => { /* keep the ZzFX fallback */ });
    }
  }

  get muted() { return this.#platformMute || this.#adMute || this.#hiddenMute || this.#userMute; }
  get userMuted() { return this.#userMute; }
  get lockedByPlatform() { return this.#platformMute; }
  get state() {
    return {
      platformMute: this.#platformMute, adMute: this.#adMute, hiddenMute: this.#hiddenMute,
      userMute: this.#userMute, effectiveMuted: this.muted, context: this.#ctx?.state ?? "none",
      samplesDecoded: this.#mix.size,
    };
  }

  onChange(fn) { this.#listeners.add(fn); return () => this.#listeners.delete(fn); }

  bindPlatform(platform) {
    this.#platformMute = !!platform.settings?.muteAudio;
    platform.onSettingsChange((s) => { this.#platformMute = !!s?.muteAudio; this.#apply(); });
    this.#apply();
    return this;
  }

  setAdMute(on) { this.#adMute = !!on; this.#apply(); }
  setHiddenMute(on) { this.#hiddenMute = !!on; this.#apply(); }
  setUserMute(on) { this.#userMute = !!on; this.#apply(); }

  /** The in-game toggle. Returns whether the platform still overrides it, so the UI can say so. */
  toggleUserMute() {
    this.#userMute = !this.#userMute;
    this.#apply();
    return { userMute: this.#userMute, effectiveMuted: this.muted, lockedByPlatform: this.#platformMute };
  }

  /** Must run inside a user gesture handler. Safe to call repeatedly; also repairs a suspended/interrupted context. */
  unlock() {
    if (!this.#ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.#ctx = new AC();
      this.#master = this.#ctx.createGain();
      this.#master.connect(this.#ctx.destination);
      this.#sfx = this.#ctx.createGain();
      this.#sfx.gain.value = 0.9;
      this.#sfx.connect(this.#master);
      for (const [name, params] of Object.entries(this.#defs)) this.#build(name, params);
      this.#decodeSamples();
      this.#apply();
    }
    if (this.#ctx.state !== "running") this.#ctx.resume().catch(() => {});
    return true;
  }

  installUnlockHandlers(target = window) {
    const tryUnlock = () => this.unlock();
    for (const ev of ["pointerdown", "touchend", "keydown", "click"]) target.addEventListener(ev, tryUnlock, { passive: true });
    return this;
  }

  /**
   * @param {string} name
   * @param {{ volume?:number, pitch?:number, minGap?:number, maxVoices?:number }} [opts]
   */
  play(name, { volume = 1, pitch = 1, minGap = 0.03, maxVoices = 6 } = {}) {
    const ctx = this.#ctx;
    if (!ctx || ctx.state !== "running" || this.muted) return false;
    const buffer = this.#buffers.get(name);
    if (!buffer) return false;
    const now = ctx.currentTime;
    if (now - (this.#lastPlay.get(name) ?? -1) < minGap) return false;
    if ((this.#active.get(name) ?? 0) >= maxVoices) return false;
    this.#lastPlay.set(name, now);

    const mix = this.#mix.get(name);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = mix ? pitch ** mix.pitchExp : pitch;
    const g = ctx.createGain();
    g.gain.value = mix ? volume * mix.gain : volume;
    src.connect(g).connect(this.#sfx);
    this.#active.set(name, (this.#active.get(name) ?? 0) + 1);
    src.onended = () => this.#active.set(name, Math.max(0, (this.#active.get(name) ?? 1) - 1));
    src.start();
    return true;
  }

  #build(name, params) {
    const rate = this.#ctx.sampleRate;
    const p = [...params];
    while (p.length < 21) p.push(undefined);
    const samples = buildSamples(...p, rate);
    if (!samples.length) return;
    const buf = this.#ctx.createBuffer(1, samples.length, rate);
    buf.getChannelData(0).set(samples);
    this.#buffers.set(name, buf);
  }

  #apply() {
    const v = this.muted ? 0 : 1;
    if (this.#master) {
      const now = this.#ctx.currentTime;
      this.#master.gain.cancelScheduledValues(now);
      this.#master.gain.setTargetAtTime(v, now, 0.015);
    }
    window.__GS_AUDIO_GAIN__ = v;   // read by the QA harness
    const s = this.state;
    for (const fn of this.#listeners) { try { fn(s); } catch { /* listener */ } }
  }
}
