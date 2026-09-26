/**
 * Adaptive render quality: pixel ratio + feature tier (bloom, shadow maps, MSAA), from measured frame time.
 *
 * CG-TECH-008: games are disabled on Chromium OS if they do not run smoothly on
 * a 4 GB RAM Chromebook. Pixel ratio is the single biggest GPU cost lever in
 * three.js (a 2x DPR renders 4x the pixels), so it is chosen conservatively at
 * boot and adjusted from measured frame time. The same ladder switches the
 * expensive look features (src/render/look.js): full-screen post passes and
 * shadow maps only where the device has measured headroom.
 *
 *   level   dpr (capped by the device)  shadows      bloom (half-res)  composer MSAA
 *   low     1                           off          off               -  (direct render, canvas MSAA)
 *   medium  1.25                        1024 PCF     off               -
 *   high    1.5                         1024 PCF     on                4x
 *   ultra   2                           2048 PCF     on                4x
 *
 * Start: 4 GB-or-less devices -> low; touch devices -> medium; desktops -> high. Then one level
 * down after 1.5 s over 21 ms/frame, one level up after 6 s under 12.5 ms/frame.
 *
 * Usage (backward compatible - the old `new AdaptiveQuality(renderer)` still only manages DPR):
 *   const quality = new AdaptiveQuality(stage.renderer, { onTier: (lv) => look.setQuality(lv) });
 *   quality.update(loop.frameMs, dt);          // once per frame
 *   quality.tier                               // { name, index, dpr, bloom, shadows, shadowMapSize, msaa }
 *
 * Test overrides: ?dpr=1 pins the pixel ratio and disables adaptation (features follow the
 * start level); ?quality=low|medium|high|ultra pins the level (and its DPR) and disables adaptation.
 */

export const QUALITY_LEVELS = [
  { name: "low", dpr: 1, shadows: false, shadowMapSize: 0, bloom: false, msaa: 0 },
  { name: "medium", dpr: 1.25, shadows: true, shadowMapSize: 1024, bloom: false, msaa: 0 },
  { name: "high", dpr: 1.5, shadows: true, shadowMapSize: 1024, bloom: true, msaa: 4 },
  { name: "ultra", dpr: 2, shadows: true, shadowMapSize: 2048, bloom: true, msaa: 4 },
];

export class AdaptiveQuality {
  #renderer; #onChange; #onTier; #level = 2; #cap = 2; #pinned = false;
  #slowFor = 0; #fastFor = 0; #cooldown = 0;

  constructor(renderer, { onChange, onTier } = {}) {
    this.#renderer = renderer;
    this.#onChange = onChange;
    this.#onTier = onTier;
    const qs = new URLSearchParams(location.search);
    const native = window.devicePixelRatio || 1;
    const lowMemory = (navigator.deviceMemory || 8) <= 4;
    const coarse = matchMedia("(pointer: coarse)").matches;
    this.#cap = Math.min(native, lowMemory ? 1.25 : 2);
    this.#level = lowMemory ? 0 : coarse ? 1 : 2;

    const pinnedLevel = QUALITY_LEVELS.findIndex((l) => l.name === qs.get("quality"));
    const pinnedDpr = Number(qs.get("dpr"));
    if (pinnedLevel >= 0) {
      this.#pinned = true;
      this.#level = pinnedLevel;
      this.#cap = Math.max(this.#cap, QUALITY_LEVELS[pinnedLevel].dpr);   // a pinned level shows its real cost
    }
    if (pinnedDpr > 0) {
      this.#pinned = true;
      this.#apply(pinnedDpr);
      return;
    }
    this.#apply();
  }

  get pixelRatio() { return this.#renderer.getPixelRatio(); }

  /** The current level: { name, index, dpr, shadows, shadowMapSize, bloom, msaa }. */
  get tier() { return { ...QUALITY_LEVELS[this.#level], index: this.#level, dpr: this.#renderer.getPixelRatio() }; }

  /** Force a level by name or index (settings menu, tests). Adaptation continues unless pinned. */
  setLevel(level) {
    const i = typeof level === "number" ? level : QUALITY_LEVELS.findIndex((l) => l.name === level);
    if (i < 0 || i >= QUALITY_LEVELS.length || i === this.#level) return;
    this.#level = i;
    this.#apply();
  }

  /** Feed the smoothed frame time once per frame. */
  update(frameMs, dt) {
    if (this.#pinned) return;
    this.#cooldown -= dt;
    if (frameMs > 21) { this.#slowFor += dt; this.#fastFor = 0; }
    else if (frameMs < 12.5) { this.#fastFor += dt; this.#slowFor = 0; }
    else { this.#slowFor = 0; this.#fastFor = 0; }

    if (this.#cooldown > 0) return;
    if (this.#slowFor > 1.5 && this.#level > 0) {
      this.#level--; this.#cooldown = 3; this.#slowFor = 0;
      this.#apply();
    } else if (this.#fastFor > 6 && this.#level < QUALITY_LEVELS.length - 1) {
      this.#level++; this.#cooldown = 6; this.#fastFor = 0;
      this.#apply();
    }
  }

  #apply(dprOverride) {
    const dpr = dprOverride ?? Math.min(QUALITY_LEVELS[this.#level].dpr, this.#cap);
    if (dpr !== this.#renderer.getPixelRatio()) {
      this.#renderer.setPixelRatio(dpr);
      this.#onChange?.(dpr);
    } else if (dprOverride !== undefined) {
      this.#onChange?.(dpr);
    }
    this.#onTier?.(this.tier);
  }
}
