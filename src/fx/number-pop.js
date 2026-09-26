/**
 * Number pops (DOM): big, bold, outlined numbers that punch in with a scale overshoot, hang, then rise
 * and fade. DOM instead of sprites: crisp at every DPR, readable at 800x450, zero draw calls.
 * Pooled elements + Web Animations API; styles are the generic `.pop` classes in src/ui/styles.css.
 *
 *   import { createNumberPops, worldToScreen } from "./fx/number-pop.js";
 *   const pops = createNumberPops(document.getElementById("ui"));
 *   worldToScreen(hitPos, camera, stage.size.width, stage.size.height, scr);
 *   pops.pop(scr.x, scr.y, "+1,280", { kind: "gold", size: 1.4 });     // kinds: gold volt good bad white
 *   pops.pop(scr.x, scr.y + 60, "x64 CHAIN", { kind: "combo" });        // slanted gradient label
 *   pops.punch(coinPillEl);                                              // counter punch (scale + flash)
 *
 * Size: `size` 1 = 3.2em of the UI base font (>= 41 px at 800x450); keep micro rewards at 0.6-0.8 and
 * reserve >= 1.3 for peaks (feedback size matches event size).
 */

export function createNumberPops(root, { max = 14 } = {}) {
  const layer = document.createElement("div");
  layer.className = "pops";
  root.appendChild(layer);
  const pool = Array.from({ length: max }, () => {
    const el = document.createElement("div");
    el.className = "pop";
    el.innerHTML = '<span class="pop-back"></span><span class="pop-front"></span>';
    el.style.display = "none";
    layer.appendChild(el);
    return el;
  });
  let next = 0;

  /**
   * @param {number} x screen px (relative to root)  @param {number} y
   * @param {string} text
   * @param {{ kind?: string, size?: number, rise?: number, duration?: number, tilt?: number }} [o]
   */
  function pop(x, y, text, { kind = "gold", size = 1, rise = 1, duration = 1150, tilt = -3 } = {}) {
    const el = pool[next];
    next = (next + 1) % max;
    for (const a of el.getAnimations()) a.cancel();
    el.className = `pop ${kind}`;
    el.style.setProperty("--pop-size", String(size));
    el.children[0].textContent = text;
    el.children[1].textContent = text;
    el.style.display = "";
    const r = tilt + (Math.random() - 0.5) * 5;
    const at = (dy, s, rot) => `translate(${x.toFixed(1)}px, ${(y + dy).toFixed(1)}px) translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`;
    const anim = el.animate([
      { transform: at(0, 0.15, r - 12), opacity: 0, easing: "cubic-bezier(.2,.9,.3,1)" },
      { transform: at(0, 1.4, r + 3), opacity: 1, offset: 0.13, easing: "ease-in-out" },
      { transform: at(0, 0.88, r - 1), opacity: 1, offset: 0.23, easing: "ease-in-out" },
      { transform: at(0, 1.07, r), opacity: 1, offset: 0.31, easing: "ease-in-out" },
      { transform: at(0, 1, r), opacity: 1, offset: 0.38 },
      { transform: at(-22 * rise, 1, r), opacity: 1, offset: 0.78, easing: "ease-in" },
      { transform: at(-64 * rise, 0.82, r), opacity: 0 },
    ], { duration, fill: "forwards" });
    anim.onfinish = () => { el.style.display = "none"; };
    return el;
  }

  return {
    layer,
    pop,
    /** A slanted combo/chain label ("x64 CHAIN", "FORK x8"). */
    combo(x, y, text, o = {}) { return pop(x, y, text, { kind: "combo", size: 0.9, duration: 1400, tilt: -6, rise: 0.6, ...o }); },
    /** Counter / pill punch: scale overshoot + a bright flash. Safe on elements that use `transform`/`translate`. */
    punch(el, strength = 1) {
      el?.animate([
        { scale: 1, filter: "brightness(1)" },
        { scale: 1 + 0.3 * strength, filter: "brightness(1.5)", offset: 0.28 },
        { scale: 1 - 0.05 * strength, filter: "brightness(1.1)", offset: 0.62 },
        { scale: 1, filter: "brightness(1)" },
      ], { duration: 280, easing: "ease-out" });
    },
    /** Captures: hold every running pop at `ms` into its animation. */
    freeze(ms) { for (const el of pool) for (const a of el.getAnimations()) { a.pause(); a.currentTime = ms; } },
    clear() { for (const el of pool) { for (const a of el.getAnimations()) a.cancel(); el.style.display = "none"; } },
  };
}

/** World position -> CSS px inside a canvas of width x height (writes into out {x, y, visible}). */
export function worldToScreen(v, camera, width, height, out) {
  const x = v.x, y = v.y, z = v.z;
  const e = camera.matrixWorldInverse.elements, p = camera.projectionMatrix.elements;
  const vx = e[0] * x + e[4] * y + e[8] * z + e[12];
  const vy = e[1] * x + e[5] * y + e[9] * z + e[13];
  const vz = e[2] * x + e[6] * y + e[10] * z + e[14];
  const cx = p[0] * vx + p[4] * vy + p[8] * vz + p[12];
  const cy = p[1] * vx + p[5] * vy + p[9] * vz + p[13];
  const cw = p[3] * vx + p[7] * vy + p[11] * vz + p[15];
  out.x = (cx / cw * 0.5 + 0.5) * width;
  out.y = (-cy / cw * 0.5 + 0.5) * height;
  out.visible = cw > 0;
  return out;
}
