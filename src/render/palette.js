/**
 * Colour themes. One theme = one coherent look (CG quality guideline: the
 * aesthetic must not switch styles). Themes rotate every 5 levels for variety
 * while staying inside the same art direction.
 *
 * Rules that keep the hypercasual look readable at thumbnail size:
 *  - player colour is the most saturated thing on screen
 *  - good = cool/blue, bad = warm/red, and they differ in brightness too
 *    (readable in greyscale / for colour-blind players)
 *  - world colours are desaturated and fogged so gameplay objects pop
 */

export const THEMES = [
  {
    name: "frost",
    skyTop: "#b7bbe9", skyBottom: "#7f86d4", fog: "#8e94dc",
    track: "#4f4a78", trackStripe: "#5d5889", rail: "#f2f1ff",
    spire: "#8b93dd", spireCap: "#eef0ff",
    crowd: "#c44ee6", enemy: "#e8424f",
    gateGood: "#3fb6ff", gateBad: "#ff4d5e", block: "#f28a3c",
    saw: "#e23b4a", hemiSky: "#e9ebff", hemiGround: "#6d62ad",
  },
  {
    name: "sunset",
    skyTop: "#ffcf9e", skyBottom: "#e97b8c", fog: "#f09a96",
    track: "#5b4063", trackStripe: "#6a4c73", rail: "#fff4ea",
    spire: "#d98a8f", spireCap: "#fff1e0",
    crowd: "#3a7bff", enemy: "#e8424f",
    gateGood: "#29c3a8", gateBad: "#ff4d5e", block: "#8f5bff",
    saw: "#2c2c3a", hemiSky: "#fff0e0", hemiGround: "#8a5065",
  },
  {
    name: "mint",
    skyTop: "#c9f3e3", skyBottom: "#6fc7b1", fog: "#86d3bf",
    track: "#35555a", trackStripe: "#3e6166", rail: "#f4fffb",
    spire: "#7cc2ad", spireCap: "#f2fff9",
    crowd: "#ff8a1f", enemy: "#8b3bd9",
    gateGood: "#3fa0ff", gateBad: "#ff4d5e", block: "#ef5a8b",
    saw: "#35353f", hemiSky: "#f0fff8", hemiGround: "#3f7a6e",
  },
];

export function themeFor(index) {
  return THEMES[((index % THEMES.length) + THEMES.length) % THEMES.length];
}

// Enemy colours to fall back on when a player skin sits too close to the theme's enemy hue.
const ENEMY_FALLBACKS = ["#e8424f", "#8b3bd9", "#ff8a1f"];

/** Hue in degrees and chroma 0..1 (near-white and near-grey colours have almost no chroma). */
function hueChroma(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), c = max - Math.min(r, g, b);
  if (c === 0) return { h: 0, c };
  const h = max === r ? ((g - b) / c + 6) % 6 : max === g ? (b - r) / c + 2 : (r - g) / c + 4;
  return { h: h * 60, c };
}

/**
 * The theme with a player skin applied. Friend and foe must never share a hue
 * (palette rule 2), so the enemy colour moves to a fallback when the skin is
 * within 50 degrees of it.
 */
export function withSkin(theme, skinHex) {
  if (!skinHex) return theme;
  const p = hueChroma(skinHex);
  const far = (hex) => { const e = hueChroma(hex); const dh = Math.abs(e.h - p.h); return p.c < 0.25 || e.c < 0.25 || Math.min(dh, 360 - dh) >= 50; };
  const enemy = [theme.enemy, ...ENEMY_FALLBACKS].find(far) ?? theme.enemy;
  return { ...theme, crowd: skinHex, enemy };
}
