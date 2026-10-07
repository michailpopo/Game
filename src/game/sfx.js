/**
 * Storm Grid sounds. Recorded sounds from Kenney's CC0 packs (STORM_SAMPLES, src/assets/sfx/, built by
 * tools/audio/build-sfx.mjs) play when loaded; the procedural ZzFX arrays below are the fallback while a file loads
 * or if it fails. The ZzFX set (zero files) is added to the template's set
 * through AudioService({ sounds }) in main.js ({ ...SFX, ...STORM_SFX }: a key here overrides the template's).
 * Parameter order: volume, randomness, frequency, attack, sustain, release, shape, shapeCurve, slide,
 * deltaSlide, pitchJump, pitchJumpTime, repeatTime, noise, modulation, bitCrush, delay, sustainVolume,
 * decay, tremolo, filter.
 *
 * Levels: peaks (thunder, fanfare) 0.9-1.0; events (ding, district, gold, powerSweep) 0.6-0.8; per-hop and
 * UI ticks (crackle, fork, click, coinTick) 0.35-0.6 - repeated sounds sit lowest so the ladder never masks the
 * peaks. Mute priority and the SDK's audio rules stay with the AudioService (src/core/audio.js).
 *
 * Claude cannot hear these: the owner auditions every sound before it ships (GAME_BRIEF "Audio direction").
 * Pitch ladders, the charge hum's rise and coin-tick steps are applied at play time (view.js / main.js).
 */

export const STORM_SFX = {
  charge: [0.5, 0, 180, 0.05, 0.1, 0.2, 2, 1, 6, 0, 0, 0, 0, 0.3, 0, 0, 0, 0.6, 0.05, 0, 1200],     // the press: the storm gathers
  hum: [0.3, 0, 110, 0.02, 0.08, 0.06, 2, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0.8, 0, 0.1, 900],           // re-triggered while charging, pitch 1 -> 2
  ding: [0.7, 0, 1568, 0, 0.04, 0.4, 0, 2, 0, 0, 784, 0.03, 0, 0, 0, 0, 0.05, 0.5, 0.06],             // entering the SUPERCHARGE band
  buzz: [0.5, 0, 140, 0, 0.12, 0.08, 2, 1, 0, 0, 0, 0, 0.04, 0.2, 0, 0.3, 0, 0.7, 0, 0.3],             // overcharge warning (fizzle ahead)
  thunder: [1, 0.1, 60, 0.005, 0.12, 0.7, 4, 1, -0.4, 0, 0, 0, 0, 0.9, 0, 0.2, 0, 0.7, 0.1, 0, 800], // the strike boom (with the hit-stop)
  crackle: [0.5, 0.05, 660, 0, 0.015, 0.06, 2, 1.6, -8, 0, 0, 0, 0, 0.35, 0, 0.1, 0, 0.5, 0.01],     // per hop, pentatonic ladder
  fork: [0.6, 0.05, 880, 0, 0.02, 0.06, 2, 1.4, -6, 0, 0, 0, 0.05, 0.3, 0, 0.1, 0, 0.5],              // double zap
  gold: [0.7, 0, 1318, 0, 0.02, 0.5, 0, 2.2, 0, 0, 659, 0.05, 0, 0, 0, 0, 0.06, 0.4, 0.1],            // gold rod ping
  district: [0.8, 0, 523, 0.01, 0.25, 0.5, 1, 1.2, 0, 0, 132, 0.08, 0.16, 0, 0, 0, 0.05, 0.7, 0.05],   // BLOCK POWERED chord
  fizzle: [0.6, 0.3, 300, 0, 0.15, 0.2, 4, 1, -4, 0, 0, 0, 0.03, 0.8, 0, 0.5, 0, 0.5, 0, 0.5, 1500],  // held too long
  powerSweep: [0.65, 0, 220, 0.04, 0.45, 0.35, 2, 1, 9, 0, 0, 0, 0, 0.05, 0, 0, 0, 0.7, 0.06, 0, 2400], // FULL POWER: the city lights up (rising)
  fanfare: [0.9, 0, 523, 0.03, 0.4, 0.6, 1, 1, 0, 0, 262, 0.15, 0.2, 0, 0, 0, 0.06, 0.8, 0.08],       // FULL POWER
  coinTick: [0.35, 0, 1760, 0, 0.005, 0.05, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.01],              // one coin lands in the pill (pitch steps up)
  click: [0.4, 0, 740, 0, 0.012, 0.035, 1, 1.8, 0, 0, -220, 0.012, 0, 0, 0, 0, 0, 0.45],               // button click (overrides the template's)
};

// Recorded sounds (Kenney, CC0; docs/ASSET_MANIFEST.md). Every file is loudness-matched by build-sfx.mjs, so `gain`
// alone sets the mix: peaks (thunder, fanfare) highest, events in the middle, per-hop and UI ticks lowest.
// pitchExp narrows a play-time pitch ladder for a file (the hop ladder climbs 2 octaves; a recorded zap follows 1).
const url = (name) => new URL(`../assets/sfx/${name}.mp3`, import.meta.url).href;
const MIX = {
  thunder: 1, fanfare: 0.85, win: 0.75, fail: 0.65,
  charge: 0.5, hum: 0.35, ding: 0.7, buzz: 0.45, fizzle: 0.55,
  crackle: 0.4, fork: 0.45, gold: 0.65, district: 0.6, powerSweep: 0.55,
  coin: 0.6, coinTick: 0.4, click: 0.5, pop: 0.45, tier: 0.6, gateBad: 0.45,
};
const PITCH_EXP = { crackle: 0.5, fork: 0.5, hum: 0.6 };
export const STORM_SAMPLES = Object.fromEntries(Object.entries(MIX).map(([name, gain]) => [name, { url: url(name), gain, pitchExp: PITCH_EXP[name] ?? 1 }]));
