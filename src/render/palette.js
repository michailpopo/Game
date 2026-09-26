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
    skyTop: "#8d7fd0", skyBottom: "#5d4f9e", fog: "#7a6cc0",
    hemiSky: "#ffffff", hemiGround: "#9d93cc",
    // arena: a pastel nebula disc (GAME_BRIEF "Art direction") in deeper space, an asteroid belt edge
    nebula: ["#e9dcff", "#ffe6d9", "#d6f1ff", "#f6d9f4", "#dcd3ff"],   // base, then soft blobs
    space: "#6f60b8",
    stars: "#ffffff",
    rocks: "#9a8fb5",
    rim: "#ff9ff3",
    outline: "#2a2350",       // dark hull around planets and stardust: they read on the light nebula
    coma: "#bff6ff",          // every head wears the coma glow
    danger: "#ff5a5f",        // rim under heads bigger than yours
    prey: "#6fdc6a",          // rim under heads smaller than yours
    // the player's accent (arrow marker, cursor ring, ribbon, name tag); a skin replaces it
    crowd: "#39c6ff",
    enemy: "#ff4d5e",
  },
];

export function themeFor(index) {
  return THEMES[((index % THEMES.length) + THEMES.length) % THEMES.length];
}

/**
 * Planet look per ladder key (ARENA.values.ladder, GAME_BRIEF "The planet ladder"):
 *   color    body colour
 *   rock     true: the 20-triangle icosahedron (pebbles) instead of the 80-triangle one
 *   emissive 0..1 self-light
 *   glow     halo colour (a billboard behind the planet), glowScale its size x diameter
 *   ring     ring colour; rings = 2 for two crossed rings; pulse = the ring breathes
 */
export const PLANETS = {
  pebble: { color: "#b8b2c9", rock: true },
  moon: { color: "#f1e9d2" },
  ice: { color: "#9fe7ff" },
  desert: { color: "#ffc27a" },
  ocean: { color: "#3fb6ff" },
  jungle: { color: "#6fdc6a" },
  lava: { color: "#ff6b4a", emissive: 0.3, glow: "#ff8a5c", glowScale: 1.7 },
  ringed: { color: "#c9a0ff", ring: "#ffe8a3" },
  storm: { color: "#7a8cff", ring: "#d6f1ff" },
  sun: { color: "#ffd23f", emissive: 0.55, glow: "#ffe27a", glowScale: 2.3 },
  redgiant: { color: "#ff5a5f", emissive: 0.5, glow: "#ff8a8c", glowScale: 2.7 },
  bluegiant: { color: "#6fb8ff", emissive: 0.5, glow: "#a8d6ff", glowScale: 2.3, ring: "#e6f4ff" },
  neutron: { color: "#ffffff", emissive: 0.4, ring: "#bfe9ff", pulse: true },
  nebula: { color: "#ff3fa4", emissive: 0.3, glow: "#ff8fcf", glowScale: 2.3, ring: "#ffd1ec" },
  galaxy: { color: "#fff0ff", emissive: 0.45, ring: "#d9c2ff", rings: 2, glow: "#f3e2ff", glowScale: 2.2 },
};

/** Loose pickups. */
export const STARDUST = {
  colors: { 2: "#ffe98a", 4: "#7ff0ff" },   // by value; other values use the planet colour
  gold: "#ffbf1f",
  goldGlow: "#ffd766",
};

/** Ribbon tints for bot comets (the player's ribbon uses the theme accent / skin). */
export const COMET_COLORS = ["#ff7ad9", "#6fe8ff", "#a4ff7a", "#ffa65c", "#c79bff", "#ff6b7d", "#7affd1", "#ffd36b", "#8fa6ff", "#ff9ec0", "#b6ff5c", "#6bc7ff"];

/** Value badges (instanced, billboarded under each planet - game/body-mesh.js atlas). */
export const BADGE_STYLE = {
  fill: "#ffffff",
  pill: "rgba(42, 35, 80, 0.86)",   // #2a2350
  fontScale: 0.74,          // x cell height
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
