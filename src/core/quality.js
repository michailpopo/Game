/**
 * Adaptive render quality.
 *
 * CG-TECH-008: games are disabled on Chromium OS if they do not run smoothly on
 * a 4 GB RAM Chromebook. Pixel ratio is the single biggest GPU cost lever in
 * three.js (a 2x DPR renders 4x the pixels), so it is chosen conservatively at
 * boot and adjusted from measured frame time.
 *
 * Override for testing: ?dpr=1 pins the pixel ratio and disables adaptation.
 */

const TIERS = [1, 1.25, 1.5, 2];

export class AdaptiveQuality {
  #renderer; #onChange; #tier; #cap; #pinned = false;
  #slowFor = 0; #fastFor = 0; #cooldown = 0;

  constructor(renderer, { onChange } = {}) {
    this.#renderer = renderer;
    this.#onChange = onChange;
    const qs = new URLSearchParams(location.search);
    const pinned = Number(qs.get("dpr"));
    const native = window.devicePixelRatio || 1;

    if (pinned > 0) {
      this.#pinned = true;
      this.#apply(pinned);
      return;
    }
    const lowMemory = (navigator.deviceMemory || 8) <= 4;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const startCap = lowMemory ? 1 : coarse ? 1.5 : 1.5;
    this.#cap = Math.min(native, lowMemory ? 1.25 : 2);
    this.#tier = TIERS.filter((t) => t <= Math.min(startCap, this.#cap)).length - 1;
    this.#tier = Math.max(0, this.#tier);
    this.#apply(TIERS[this.#tier]);
  }

  get pixelRatio() { return this.#renderer.getPixelRatio(); }

  /** Feed the smoothed frame time once per frame. */
  update(frameMs, dt) {
    if (this.#pinned) return;
    this.#cooldown -= dt;
    if (frameMs > 21) { this.#slowFor += dt; this.#fastFor = 0; }
    else if (frameMs < 12.5) { this.#fastFor += dt; this.#slowFor = 0; }
    else { this.#slowFor = 0; this.#fastFor = 0; }

    if (this.#cooldown > 0) return;
    if (this.#slowFor > 1.5 && this.#tier > 0) {
      this.#tier--; this.#cooldown = 3; this.#slowFor = 0;
      this.#apply(TIERS[this.#tier]);
    } else if (this.#fastFor > 6 && this.#tier < TIERS.length - 1 && TIERS[this.#tier + 1] <= this.#cap) {
      this.#tier++; this.#cooldown = 6; this.#fastFor = 0;
      this.#apply(TIERS[this.#tier]);
    }
  }

  #apply(dpr) {
    this.#renderer.setPixelRatio(dpr);
    this.#onChange?.(dpr);
  }
}
