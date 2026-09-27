/**
 * Storm Grid look (WP-31): the toy city from the WP-21 reference study (docs/QA_REPORT.md "WP-21 notes").
 *   - world: calm and limited - one field colour, one asphalt, light sidewalks, grey-blue unlit buildings
 *   - lit buildings: one candy colour each (never the bolt's cyan), glowing window bands
 *   - the bolt: white core + skin glow + a deep-blue outline -> always the most saturated thing on screen
 *   - dusk sky per theme (src/render/palette.js BACKDROPS.dusk + the theme's overrides)
 * The view reads everything from here. World units are metres.
 */

import { BACKDROPS } from "../render/palette.js";

export const LOOK = {
  fogNear: 1.7, fogFar: 5.5,     // x the camera distance (set per city): the far field melts into the horizon
  hotFlash: "#ffffff",           // the first flash of a freshly lit building
  pole: "#c9cfe4",               // lightning rods
  tipDark: "#e9edff",            // rod ball before power
  tipLit: "#fff2b8",             // ... once lit
  gold: "#ffc21a",
  goldGlow: "#ffd766",
  cloud: "#737aa6",
  cloudGlow: "#9fe8ff",          // the storm front flickers while charging
  boltCore: "#ffffff",
  boltGlow: "#4df3ff",           // default bolt skin
  boltOutline: "#0b1446",        // deep-blue band under every bolt (contrast over bright sky / lit buildings)
  super: "#ffcf3a",              // SUPERCHARGE band / flash
  over: "#ff4f5a",               // overcharge warning
  spark: "#dffbff",
  plates: { 2: "#4df3ff", 3: "#7cff7a", 5: "#ffcc33", 10: "#ff3fa4" },
};

/**
 * 8 themes x 5 cities (then they cycle). Names: i18n keys `theme_<id>`.
 *   window/accent/fog  legacy keys (still read by the UI side)
 *   world              field, asphalt, pad (sidewalk), padLit (a powered block), unlit, unlitWin, trim, dash, trees[]
 *   lit                candy colours for lit buildings (warm/candy; the bolt keeps cyan to itself)
 *   sky                overrides of BACKDROPS.dusk (top, horizon, glow, glow2, fog, hemiSky, hemiGround, key)
 */
export const THEMES = [
  {
    id: "downtown", window: "#ffd166", accent: "#4df3ff", fog: "#9b94c4",
    world: { field: "#7cc463", asphalt: "#6a71a0", pad: "#e4dde6", padLit: "#fff1c9", unlit: "#8690b6", unlitWin: "#474f73", trim: "#9aa3c6", dash: "#f2f4ff", trees: ["#58c25a", "#7fd65a", "#3fae6a"] },
    lit: ["#ffc21a", "#ff5e57", "#ff6fb5", "#3fd07a", "#ff8c2a", "#9d6bff"],
    sky: {},
  },
  {
    id: "harbour", window: "#ffc07a", accent: "#7cf3ff", fog: "#8fb0d8",
    world: { field: "#3f93d6", asphalt: "#56607f", pad: "#ece6dc", padLit: "#fff0cf", unlit: "#8b99b0", unlitWin: "#4a5873", trim: "#a3b0c6", dash: "#f4f6ff", trees: ["#4fbf6a", "#6fd07a", "#3aa36a"] },
    lit: ["#ff5e57", "#ffc21a", "#ff8c2a", "#ff6fb5", "#3fd07a", "#ffe6a0"],
    sky: { top: "#1f4aa0", horizon: "#ffc49a", glow: "#ffe0b0", glow2: "#ff9ec0", fog: "#8fb0d8", hemiSky: "#bcd6ff" },
  },
  {
    id: "oldtown", window: "#ffb35c", accent: "#ff8a5b", fog: "#b89aa8",
    world: { field: "#8cbf5a", asphalt: "#6a6080", pad: "#efe2d0", padLit: "#fff0d0", unlit: "#9a90a8", unlitWin: "#554b66", trim: "#b1a7bd", dash: "#fff6ea", trees: ["#6fb84a", "#8fcf5a", "#4f9f4a"] },
    lit: ["#ff7a45", "#ffb81c", "#ff6f91", "#3fbf8f", "#e85a8a", "#ffd166"],
    sky: { top: "#3a3a8f", horizon: "#ffb080", glow: "#ffd09a", glow2: "#ff8aa0", fog: "#b89aa8", key: "#ffc08a" },
  },
  {
    id: "hills", window: "#ffe08a", accent: "#9dff9a", fog: "#a7b3d6",
    world: { field: "#6cb85a", asphalt: "#58668a", pad: "#e6e6ea", padLit: "#fff4cc", unlit: "#8594a8", unlitWin: "#44516b", trim: "#9fadc2", dash: "#f4f6ff", trees: ["#3fae5a", "#5fc46a", "#2f9a5a"] },
    lit: ["#ffcf3a", "#ff6fb5", "#9dff3a", "#ff8c2a", "#ff5e57", "#b58bff"],
    sky: { top: "#2a4aa8", horizon: "#ffd09a", glow: "#fff0c0", glow2: "#ffa0b0", fog: "#a7b3d6" },
  },
  {
    id: "neonbay", window: "#ff9ad5", accent: "#ff3fa4", fog: "#6a5aa8",
    world: { field: "#3552a8", asphalt: "#474c7e", pad: "#d3cdef", padLit: "#ffe3f4", unlit: "#7a80b0", unlitWin: "#3c4170", trim: "#9095c4", dash: "#e8e4ff", trees: ["#3fc48a", "#5fd49a", "#2fa47a"] },
    lit: ["#ff4fb4", "#9d6bff", "#ff8c2a", "#9dff3a", "#ffcf3a", "#ff5e57"],
    sky: { top: "#1a1f6e", horizon: "#ff8ac8", glow: "#ffb0e0", glow2: "#9a7aff", fog: "#6a5aa8", hemiSky: "#a8b0ff", key: "#ffb8d8" },
  },
  {
    id: "snowpeak", window: "#fff2c4", accent: "#bfe8ff", fog: "#c9d6f0",
    world: { field: "#eef2fb", asphalt: "#7a86a8", pad: "#ffffff", padLit: "#fff4d6", unlit: "#98a4c2", unlitWin: "#56617f", trim: "#b8c2dc", dash: "#ffffff", trees: ["#3f9a6a", "#4fae7a", "#2f8a5a"] },
    lit: ["#ff4f5a", "#ffc21a", "#ff8c2a", "#ff6fb5", "#3fd07a", "#9d6bff"],
    sky: { top: "#3a5ab8", horizon: "#ffd8c0", glow: "#fff0e0", glow2: "#ffb8c8", fog: "#c9d6f0", hemiSky: "#d6e2ff", hemiGround: "#8a8aa8" },
  },
  {
    id: "desert", window: "#ffc46b", accent: "#ff8a5b", fog: "#d8a890",
    world: { field: "#e6c186", asphalt: "#8a7a8f", pad: "#f5e6cc", padLit: "#fff0d0", unlit: "#a8969a", unlitWin: "#5f5060", trim: "#bfaeb0", dash: "#fff8ea", trees: ["#8fbf4a", "#a8cf5a", "#6f9f3a"] },
    lit: ["#ff5e57", "#ff8c2a", "#ff6fb5", "#ffc21a", "#9d6bff", "#3fd07a"],
    sky: { top: "#3a4aa0", horizon: "#ffb070", glow: "#ffd890", glow2: "#ff8a70", fog: "#d8a890", key: "#ffc890", hemiGround: "#8a6a5a" },
  },
  {
    id: "skyport", window: "#9ff8ff", accent: "#c86bff", fog: "#b8c4ee",
    world: { field: "#f4f6ff", asphalt: "#5d6aa0", pad: "#e8ecfb", padLit: "#fff1f8", unlit: "#8793c0", unlitWin: "#434c7a", trim: "#a4aed6", dash: "#ffffff", trees: ["#6fd08a", "#8fe09a", "#4fb87a"] },
    lit: ["#ff6fb5", "#9d6bff", "#ffc21a", "#ff8c2a", "#ff5e57", "#3fd07a"],
    sky: { top: "#2f5ad0", horizon: "#ffd0e8", glow: "#fff0fa", glow2: "#c8a8ff", fog: "#b8c4ee", hemiSky: "#d0dcff" },
  },
];

export const themeOf = (city) => THEMES[(city?.theme ?? 0) % THEMES.length];

/** The look.js backdrop preset for a theme: the dusk sky with the theme's overrides. */
export function backdropFor(theme) {
  return { ...BACKDROPS.dusk, ...theme.sky };
}
