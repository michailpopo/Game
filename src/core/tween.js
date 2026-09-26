/**
 * Tiny tween + easing kit for presentation (never for simulation state).
 * Runs on real frame time, so juice keeps animating during hit-stop.
 */

export const ease = {
  linear: (t) => t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inQuad: (t) => t * t,
  outCubic: (t) => 1 - (1 - t) ** 3,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  outBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2; },
  outElastic: (t) => (t === 0 || t === 1 ? t : 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
};

export class Tweens {
  #list = [];

  /**
   * @param {{ duration:number, update:(k:number)=>void, ease?:(t:number)=>number, delay?:number, done?:()=>void }} spec
   *        duration in seconds; update receives the eased 0..1 progress
   */
  add(spec) {
    const tw = { t: -(spec.delay || 0), ease: ease.outCubic, ...spec };
    this.#list.push(tw);
    return tw;
  }

  cancel(tw) { tw.cancelled = true; }

  update(dt) {
    for (let i = this.#list.length - 1; i >= 0; i--) {
      const tw = this.#list[i];
      if (tw.cancelled) { this.#list.splice(i, 1); continue; }
      tw.t += dt;
      if (tw.t < 0) continue;
      const k = Math.min(tw.t / tw.duration, 1);
      tw.update(tw.ease(k));
      if (k >= 1) { this.#list.splice(i, 1); tw.done?.(); }
    }
  }

  clear() { this.#list.length = 0; }
}

/** Frame-rate independent exponential smoothing: move `current` toward `target`. */
export function damp(current, target, lambda, dt) {
  return target + (current - target) * Math.exp(-lambda * dt);
}
