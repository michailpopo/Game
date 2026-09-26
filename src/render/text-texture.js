/**
 * Big chunky numbers on 3D objects (gates, blocks, stair tiers) via a canvas
 * texture. Cheaper and smaller than an SDF text library, and it uses the same
 * bundled font as the DOM UI so the look stays consistent.
 *
 * Call `await fontsReady()` before creating labels, or the first frames draw
 * with a fallback font and never redraw.
 */

import { CanvasTexture, SRGBColorSpace } from "three";

export const FONT_FAMILY = '"Lilita One", "Arial Black", system-ui, sans-serif';

export async function fontsReady(timeoutMs = 2500) {
  if (!document.fonts?.load) return false;
  try {
    await Promise.race([
      document.fonts.load(`64px "Lilita One"`),
      new Promise((_, rej) => setTimeout(() => rej(new Error("font timeout")), timeoutMs)),
    ]);
    return true;
  } catch {
    return false;
  }
}

export class LabelTexture {
  #canvas; #ctx; #text = null;
  texture;

  constructor(width = 256, height = 128) {
    this.#canvas = document.createElement("canvas");
    this.#canvas.width = width;
    this.#canvas.height = height;
    this.#ctx = this.#canvas.getContext("2d");
    this.texture = new CanvasTexture(this.#canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 4;
  }

  /** Redraws only when the text actually changes. */
  set(text, { color = "#ffffff", stroke = "rgba(20,10,40,0.55)", size = 0.72 } = {}) {
    const key = `${text}|${color}|${stroke}|${size}`;
    if (key === this.#text) return;
    this.#text = key;
    const { width: w, height: h } = this.#canvas;
    const ctx = this.#ctx;
    ctx.clearRect(0, 0, w, h);
    let px = Math.round(h * size);
    ctx.font = `${px}px ${FONT_FAMILY}`;
    const maxW = w * 0.92;
    const measured = ctx.measureText(text).width;
    if (measured > maxW) { px = Math.floor(px * (maxW / measured)); ctx.font = `${px}px ${FONT_FAMILY}`; }
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(4, px * 0.14);
    ctx.strokeStyle = stroke;
    ctx.strokeText(text, w / 2, h / 2 + px * 0.04);
    ctx.fillStyle = color;
    ctx.fillText(text, w / 2, h / 2 + px * 0.04);
    this.texture.needsUpdate = true;
  }

  dispose() { this.texture.dispose(); }
}
