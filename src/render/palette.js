/**
 * Colours. One theme = one coherent look (CG quality guideline: the aesthetic must not
 * switch styles). WP-10 ships ONE neutral grey-box arena theme; the designer's twist
 * replaces it (and VALUE_COLORS) without touching game code.
 *
 * Rules that keep a value-coded arena readable at thumbnail size:
 *  - every value has its own colour, neighbours on the ladder differ in hue AND brightness
 *  - the floor and walls are desaturated so blocks pop; the player gets an accent ring
 *  - UI accents (magenta CTA, gold coins) stay constant across themes
 */

export const THEMES = [
  {
    name: "greybox",
    // stage.js: sky gradient, fog and hemisphere light (the sky only shows at the far edge)
    skyTop: "#262a3a", skyBottom: "#1b1e2b", fog: "#1f2231",
    hemiSky: "#f2f4ff", hemiGround: "#4a4f68",
    // arena
    floor: "#3b4054", floorLine: "#474d64", floorEdge: "#565d78",
    outside: "#232636", wall: "#cfd3e2", wallSide: "#9ba2ba",
    // the player's accent (ring under the head, name tag); a skin replaces it
    crowd: "#ffffff",
    enemy: "#ff4d5e",
  },
];

export function themeFor(index) {
  return THEMES[((index % THEMES.length) + THEMES.length) % THEMES.length];
}

/**
 * One colour per ladder level (level 1 = the smallest value). Our own sequence - not the
 * reference game's. Levels past the end cycle.
 */
export const VALUE_COLORS = [
  "#8fd3ff", // 2    sky
  "#5be0a0", // 4    mint
  "#ffd84a", // 8    yellow
  "#ff9d4a", // 16   orange
  "#ff5d6c", // 32   coral
  "#d46bff", // 64   violet
  "#4f86ff", // 128  blue
  "#20c9b4", // 256  teal
  "#ff6fd2", // 512  pink
  "#b8e04a", // 1024 lime
  "#ffb02e", // 2048 amber
  "#9c7bff", // 4096 lavender
];

export function valueColor(level) {
  return VALUE_COLORS[(Math.max(1, level) - 1) % VALUE_COLORS.length];
}

/** Number labels drawn on the blocks (render/block-mesh.js atlas). */
export const LABEL_STYLE = {
  fill: "#ffffff",
  stroke: "rgba(22, 16, 44, 0.78)",
  strokeWidth: 0.16,        // x font size
  fontScale: 0.6,           // x cell size for 1-2 digit numbers; longer numbers shrink to fit
};

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
 * The theme with a player skin applied (the skin is the player's accent colour). Friend and
 * foe must never share a hue (palette rule 2), so the enemy colour moves to a fallback when
 * the skin is within 50 degrees of it.
 */
export function withSkin(theme, skinHex) {
  if (!skinHex) return theme;
  const p = hueChroma(skinHex);
  const far = (hex) => { const e = hueChroma(hex); const dh = Math.abs(e.h - p.h); return p.c < 0.25 || e.c < 0.25 || Math.min(dh, 360 - dh) >= 50; };
  const enemy = [theme.enemy, ...ENEMY_FALLBACKS].find(far) ?? theme.enemy;
  return { ...theme, crowd: skinHex, enemy };
}
