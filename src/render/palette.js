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

// =====================================================================================================
// Premium look kit palette (WP-20) - concept-agnostic. Used by src/render/look.js (backdrop, light rig,
// environment) and src/render/materials.js. Rules that keep it "premium" instead of "washed out":
//  - backdrops are DEEP and saturated (dark value at the edges, one bright glow) so emissive and glossy
//    objects are the brightest things on screen; nothing pastel behind the action
//  - accents are fully saturated; the player/strike colour is the one most saturated hue
//  - every backdrop names its own light rig colours so the objects sit IN the world (hemi sky/ground,
//    key, rim) and its own environment tint (reflections pick up the backdrop hues)
// =====================================================================================================

/**
 * Backdrop presets (analytic gradient drawn by look.js - no texture):
 *   top, bottom     vertical gradient (screen space)
 *   horizon         colour band at `horizonAt` (0 = bottom, 1 = top of screen), `horizonWidth`
 *   glow, glowAt    radial glow colour and centre in screen uv, glowSize (fraction of screen height)
 *   vignette        0..1 edge darkening
 *   stars           0..1 density of tiny stars/bokeh (0 = none)
 *   fog             fog colour (distance fade toward the horizon), fogNear/fogFar in world units
 *   hemiSky/hemiGround/hemi   hemisphere light, key/keyIntensity, rim/rimIntensity
 *   env             [top, horizon, bottom] tint of the reflection environment, envPanels = softbox colours,
 *                   envPanelIntensity (default 1) scales the softboxes, envIntensity = scene.environmentIntensity
 */
export const BACKDROPS = {
  // Volt City night: deep navy to indigo, a magenta storm glow on the horizon
  storm: {
    top: "#030620", bottom: "#0f0a33", horizon: "#9c1175", horizonAt: 0.72, horizonWidth: 0.1,
    glow: "#ff2fb0", glowAt: [0.62, 0.72], glowSize: 0.24, glow2: "#2433ff", glow2At: [0.15, 0.98], glow2Size: 0.5,
    vignette: 0.6, stars: 0.4,
    fog: "#3a0c55", fogNear: 40, fogFar: 150,
    hemiSky: "#3346c8", hemiGround: "#0a0618", hemi: 0.45,
    key: "#9fb2ff", keyIntensity: 1.35, rim: "#ff3fbf", rimIntensity: 0.8,
    env: ["#0a1040", "#4a0c50", "#05040f"], envPanels: ["#5fd9ff", "#ff58c8", "#c9d4ff"], envPanelIntensity: 0.3, envIntensity: 0.4,
  },
  // dusk: clean evening sky - deep blue overhead, warm peach horizon (Storm Grid toy city, WP-21)
  dusk: {
    top: "#23398f", bottom: "#5a4f9e", horizon: "#ffb48c", horizonAt: 0.72, horizonWidth: 0.13,
    glow: "#ffd9a8", glowAt: [0.28, 0.73], glowSize: 0.2, glow2: "#ff86b8", glow2At: [0.78, 0.74], glow2Size: 0.2,
    vignette: 0.25, stars: 0.12,
    fog: "#9b94c4", fogNear: 110, fogFar: 420,
    hemiSky: "#c0cbf0", hemiGround: "#626a84", hemi: 1.15,
    key: "#ffcfa8", keyIntensity: 2.1, rim: "#9fb0ff", rimIntensity: 0.5,
    env: ["#3a50b0", "#f0a890", "#3a3050"], envPanels: ["#ffffff", "#ffd0a0", "#a0b8ff"], envPanelIntensity: 0.5, envIntensity: 0.55,
  },
  // deep space: blue-violet with a violet core glow
  space: {
    top: "#0a0730", bottom: "#04020d", horizon: "#3a1a9e", horizonAt: 0.45, horizonWidth: 0.22,
    glow: "#7a3cff", glowAt: [0.5, 0.62], glowSize: 0.42, glow2: "#0090ff", glow2At: [0.88, 0.2], glow2Size: 0.35,
    vignette: 0.65, stars: 0.6,
    fog: "#120a38", fogNear: 20, fogFar: 60,
    hemiSky: "#8f9dff", hemiGround: "#1a0f3a", hemi: 0.7,
    key: "#fff1e6", keyIntensity: 1.8, rim: "#45d8ff", rimIntensity: 1.6,
    env: ["#1a1460", "#4a24b0", "#0a0620"], envPanels: ["#ffffff", "#7fe6ff", "#ff7ad9"], envPanelIntensity: 0.6, envIntensity: 0.8,
  },
  // sunset: hot coral to violet
  sunset: {
    top: "#3a0f6e", bottom: "#ff7a45", horizon: "#ff3d6e", horizonAt: 0.4, horizonWidth: 0.22,
    glow: "#ffd36b", glowAt: [0.5, 0.35], glowSize: 0.5, glow2: "#ff2d95", glow2At: [0.1, 0.6], glow2Size: 0.5,
    vignette: 0.4, stars: 0,
    fog: "#b8356e", fogNear: 30, fogFar: 110,
    hemiSky: "#ffb38a", hemiGround: "#4a1a6b", hemi: 1.3,
    key: "#ffe2b8", keyIntensity: 2.6, rim: "#ff4fa0", rimIntensity: 2,
    env: ["#4a1a8a", "#ff6a5a", "#2a0a3a"], envPanels: ["#fff1d6", "#ffb35a", "#ff5ab4"], envIntensity: 1,
  },
  // candy: saturated pink to violet, bright and cheerful but never pastel
  candy: {
    top: "#ff4fb4", bottom: "#5a2bd6", horizon: "#ff8ad8", horizonAt: 0.55, horizonWidth: 0.2,
    glow: "#ffe0f4", glowAt: [0.5, 0.5], glowSize: 0.5, glow2: "#40d8ff", glow2At: [0.9, 0.1], glow2Size: 0.4,
    vignette: 0.35, stars: 0,
    fog: "#b03ab8", fogNear: 30, fogFar: 110,
    hemiSky: "#ffd6f2", hemiGround: "#4a2a9e", hemi: 1.5,
    key: "#ffffff", keyIntensity: 2.4, rim: "#6ff0ff", rimIntensity: 1.6,
    env: ["#ff6ac8", "#ffc2ea", "#5a2bd6"], envPanels: ["#ffffff", "#fff0a8", "#8ae8ff"], envIntensity: 1,
  },
  // ocean: electric cyan to deep blue
  ocean: {
    top: "#00a6e8", bottom: "#0a1a6e", horizon: "#38f0ff", horizonAt: 0.5, horizonWidth: 0.2,
    glow: "#b8fbff", glowAt: [0.5, 0.6], glowSize: 0.45, glow2: "#3a5bff", glow2At: [0.1, 0.1], glow2Size: 0.5,
    vignette: 0.45, stars: 0,
    fog: "#0a4aa0", fogNear: 30, fogFar: 110,
    hemiSky: "#aef4ff", hemiGround: "#0a1a5e", hemi: 1.4,
    key: "#ffffff", keyIntensity: 2.3, rim: "#7affd9", rimIntensity: 1.8,
    env: ["#0090e0", "#5ef2ff", "#081a5a"], envPanels: ["#ffffff", "#b8fff0", "#7aa6ff"], envIntensity: 1,
  },
};

/** Fully saturated accents - one of them is the player's colour, one the danger colour. */
export const ACCENTS = {
  volt: "#4df3ff",       // Volt City bolt glow (white core)
  gold: "#ffd166",       // Volt City lit windows, coins, jackpot numbers
  magenta: "#ff2d95",
  cyan: "#22d3ff",
  lime: "#9dff3a",
  orange: "#ff7a1a",
  violet: "#8b5cff",
  red: "#ff3b4f",
  charcoal: "#1b1f3b",   // Volt City unlit buildings
  ink: "#1a1240",        // UI outline / shadow ink
};

/** Gem / crystal set for collectibles and debris (hue AND brightness differ between neighbours). */
export const GEM_COLORS = ["#ff2e63", "#2f7bff", "#19e38a", "#b04dff", "#ffb31f", "#22e5ff", "#ff5cc8"];

/** Bolt skins (Volt City collection): glow colour; the core is always near-white. */
export const BOLT_COLORS = { volt: "#4df3ff", magenta: "#ff4fd8", gold: "#ffcf3f", plasma: "#7dff4f", violet: "#a66bff", ember: "#ff6a2a" };
