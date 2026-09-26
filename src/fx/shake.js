/**
 * Trauma-based camera shake (Squirrel Eiserloh, "Math for Game Programmers:
 * Juicing Your Cameras With Math", GDC 2016): add trauma on impacts, shake
 * amount = trauma^2, trauma decays linearly. Squaring keeps small hits subtle
 * and big hits dramatic. Smooth pseudo-noise instead of random jitter.
 */

export class CameraShake {
  trauma = 0;
  offset = { x: 0, y: 0, z: 0, roll: 0 };
  #t = 0;

  constructor({ maxOffset = 0.55, maxRoll = 0.03, decay = 1.6, frequency = 22 } = {}) {
    this.maxOffset = maxOffset;
    this.maxRoll = maxRoll;
    this.decay = decay;
    this.frequency = frequency;
  }

  /** 0..1. A small hit ~0.15, a block break ~0.35, losing the run ~0.6. */
  add(amount) { this.trauma = Math.min(1, this.trauma + amount); }

  update(dt) {
    this.#t += dt * this.frequency;
    this.trauma = Math.max(0, this.trauma - this.decay * dt);
    const k = this.trauma * this.trauma;
    const n = (seed) => Math.sin(this.#t * 1.0 + seed) * 0.6 + Math.sin(this.#t * 2.3 + seed * 1.7) * 0.4;
    this.offset.x = this.maxOffset * k * n(1.1);
    this.offset.y = this.maxOffset * k * n(4.7);
    this.offset.z = this.maxOffset * 0.5 * k * n(9.3);
    this.offset.roll = this.maxRoll * k * n(13.1);
  }
}
