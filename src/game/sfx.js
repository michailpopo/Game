/**
 * Comet Chain sounds (procedural ZzFX parameter arrays, zero files), added to the template's
 * set through AudioService({ sounds }). Parameter order: volume, randomness, frequency, attack,
 * sustain, release, shape, shapeCurve, slide, deltaSlide, pitchJump, pitchJumpTime, repeatTime,
 * noise, modulation, bitCrush, delay, sustainVolume, decay, tremolo, filter.
 *
 * Claude cannot hear these: the owner auditions every sound before it ships (GAME_BRIEF
 * "Audio direction"). Pitch ladders are applied at play time (view.js), not baked in here.
 */

export const ARENA_SFX = {
  tick: [0.55, 0, 1046, 0, 0.012, 0.07, 0, 1.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5],          // stardust (pentatonic ladder)
  fuse: [0.8, 0, 520, 0.004, 0.03, 0.16, 1, 1.4, 0, 0, 260, 0.02, 0, 0, 0, 0, 0, 0.6, 0.02],  // fusion pop (deeper for bigger worlds)
  crunch: [0.9, 0.08, 180, 0.004, 0.05, 0.24, 4, 1.4, 6, 0, 0, 0, 0, 0.7, 0, 0.1, 0, 0.6, 0.05, 0, 1800], // you swallow a comet
  thud: [1, 0, 90, 0.01, 0.1, 0.42, 0, 1, -1.5, 0, 0, 0, 0, 0.3, 0, 0, 0, 0.6, 0.1, 0, 700],   // you are swallowed
  spawn: [0.55, 0, 660, 0.02, 0.08, 0.25, 0, 1.5, 4, 0, 330, 0.06, 0, 0, 0, 0, 0, 0.6, 0.05], // respawn / revive
  count: [0.45, 0, 880, 0, 0.02, 0.05, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4],                // round clock ticks from 0:10
  sting: [0.8, 0, 523, 0.02, 0.2, 0.4, 1, 1.2, 0, 0, 262, 0.1, 0.1, 0, 0, 0, 0.04, 0.7, 0.06], // golden finale
};
