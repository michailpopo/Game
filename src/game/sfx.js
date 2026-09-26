/**
 * Storm Grid sounds (procedural ZzFX parameter arrays, zero files), added to the template's set
 * through AudioService({ sounds }). Parameter order: volume, randomness, frequency, attack,
 * sustain, release, shape, shapeCurve, slide, deltaSlide, pitchJump, pitchJumpTime, repeatTime,
 * noise, modulation, bitCrush, delay, sustainVolume, decay, tremolo, filter.
 *
 * Claude cannot hear these: the owner auditions every sound before it ships (GAME_BRIEF
 * "Audio direction"). Pitch ladders and the charge hum's rise are applied at play time (view.js).
 */

export const STORM_SFX = {
  charge: [0.5, 0, 180, 0.05, 0.1, 0.2, 2, 1, 6, 0, 0, 0, 0, 0.3, 0, 0, 0, 0.6, 0.05, 0, 1200],     // the press: the storm gathers
  hum: [0.35, 0, 110, 0.02, 0.08, 0.06, 2, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0.8, 0, 0.1, 900],          // re-triggered while charging, pitch 1 -> 2
  ding: [0.7, 0, 1568, 0, 0.04, 0.4, 0, 2, 0, 0, 784, 0.03, 0, 0, 0, 0, 0.05, 0.5, 0.06],             // entering the SUPERCHARGE band
  buzz: [0.5, 0, 140, 0, 0.12, 0.08, 2, 1, 0, 0, 0, 0, 0.04, 0.2, 0, 0.3, 0, 0.7, 0, 0.3],             // overcharge warning
  thunder: [1, 0.1, 60, 0.005, 0.12, 0.7, 4, 1, -0.4, 0, 0, 0, 0, 0.9, 0, 0.2, 0, 0.7, 0.1, 0, 800], // the strike (with the hit-stop)
  crackle: [0.5, 0.05, 660, 0, 0.015, 0.06, 2, 1.6, -8, 0, 0, 0, 0, 0.35, 0, 0.1, 0, 0.5, 0.01],     // per hop, pentatonic ladder
  fork: [0.6, 0.05, 880, 0, 0.02, 0.06, 2, 1.4, -6, 0, 0, 0, 0.05, 0.3, 0, 0.1, 0, 0.5],              // double zap
  gold: [0.7, 0, 1318, 0, 0.02, 0.5, 0, 2.2, 0, 0, 659, 0.05, 0, 0, 0, 0, 0.06, 0.4, 0.1],            // gold rod ping
  district: [0.8, 0, 523, 0.01, 0.25, 0.5, 1, 1.2, 0, 0, 132, 0.08, 0.16, 0, 0, 0, 0.05, 0.7, 0.05],   // BLOCK POWERED chord
  fizzle: [0.6, 0.3, 300, 0, 0.15, 0.2, 4, 1, -4, 0, 0, 0, 0.03, 0.8, 0, 0.5, 0, 0.5, 0, 0.5, 1500],  // held too long
  fanfare: [0.9, 0, 523, 0.03, 0.4, 0.6, 1, 1, 0, 0, 262, 0.15, 0.2, 0, 0, 0, 0.06, 0.8, 0.08],       // FULL POWER
};
