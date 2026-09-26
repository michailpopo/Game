/**
 * Colours - "Comet Chain" (concept R1, docs/CONCEPTS.md). One theme = one coherent look
 * (CG-QUAL-007: the aesthetic must not switch styles).
 *
 * Rules that keep a value-coded arena readable at thumbnail size:
 *  - every ladder step has its own planet colour (and from the ringed giant up a ring
 *    and/or glow), neighbours differ in hue AND brightness
 *  - the nebula is a light pastel field, so planets are saturated and carry a soft shadow
 *  - the player's comet is marked by an accent ring on the floor and the "You" tag
 *  - UI accents (magenta CTA, gold coins) stay constant
 */

export const THEMES = [
  {
    name: "nebula",
    // stage.js: sky gradient, fog and hemisphere light
    skyTop: "#2a2166", skyBottom: "#171236", fog: "#211a4d",
    hemiSky: "#ffffff", hemiGround: "#8a7fc4",
    // arena: a pastel nebula disc in deep space, a glowing rim
    nebula: ["#b7a8f0", "#f2a9d2", "#a5d4f5", "#f7c8a8", "#b8ecd8"],   // blob colours, first = base
    space: "#241c55",
    spaceStars: "#ffffff",
    nebulaStars: "#ffffff",
    rim: "#fff0fb",
    // the player's accent (floor ring, name tag); a skin replaces it
    crowd: "#ffe45c",
    enemy: "#ff4d5e",
  },
];

export function themeFor(index) {
  return THEMES[((index % THEMES.length) + THEMES.length) % THEMES.length];
}

/**
 * Planet look per ladder key (ARENA.values.ladder): body colour, optional ring and glow.
 * Keys past the table fall back to the last entry.
 */
export const PLANETS = {
  pebble: { color: "#8c7f78" },
  moon: { color: "#e6e9f2" },
  ice: { color: "#5fd2ee" },
  desert: { color: "#e89a4e" },
  ocean: { color: "#2e6fe0" },
  ringed: { color: "#e2b884", ring: "#fff0d2" },
  sun: { color: "#ffc62e", glow: "#ffd95a" },
  bluegiant: { color: "#4aa2ff", glow: "#a8d6ff" },
  redgiant: { color: "#ff5040", glow: "#ff9a80" },
  pulsar: { color: "#f4f1ff", ring: "#b393ff", glow: "#d9ccff" },
  blackhole: { color: "#1d1633", ring: "#ff9a36", glow: "#ffb46a" },
  quasar: { color: "#ff4dcf", ring: "#ffe266", glow: "#ff9ae4" },
};

/** Loose pickups. */
export const STARDUST = {
  colors: { 2: "#ffffff", 4: "#8ff3ff" },   // by value; other values use the planet colour
  gold: "#ffbf1f",
  goldGlow: "#ffd766",
};

/** Comet nucleus colours for bots (the player's comet uses the theme accent / skin). */
export const COMET_COLORS = ["#ff7ad9", "#6fe8ff", "#a4ff7a", "#ffa65c", "#c79bff", "#ff6b7d", "#7affd1", "#ffd36b", "#8fa6ff", "#ff9ec0", "#b6ff5c", "#6bc7ff"];

/** Value badges (instanced, billboarded - game/body-mesh.js atlas). */
export const BADGE_STYLE = {
  fill: "#ffffff",
  pill: "rgba(28, 18, 64, 0.78)",
  fontScale: 0.72,          // x cell height
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
 * The theme with a player skin applied (the skin is the player's comet accent). Friend and
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
