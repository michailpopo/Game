/**
 * Storm Grid look (quality pass 2026-10): a blacked-out toy city at night under a storm - the store cover's promise.
 *   - world: dark and calm - night ground, wet asphalt, dark sidewalks, dark slate buildings with black windows
 *   - lit buildings: one candy colour each (never the bolt's cyan), warm glowing windows, a soft self-glow
 *   - powered blocks: warm sidewalks and a ring of streetlights
 *   - the bolt: white core + skin glow + a deep-blue outline -> always the brightest thing on screen; every strike
 *     flashes the sky and throws a coloured light on the roofs around it
 *   - night sky per theme (src/render/palette.js BACKDROPS.night + the theme's overrides), rain
 * The view reads everything from here. World units are metres.
 */

import { BACKDROPS } from "../render/palette.js";

export const LOOK = {
  fogNear: 1.5, fogFar: 4.2,     // x the camera distance (set per city): the far field melts into the night
  hotFlash: "#ffffff",           // the first flash of a freshly lit building
  pole: "#8d95c4",               // lightning rods
  tipDark: "#7f8bd0",            // rod ball before power (self-lit: a dim beacon on the dark roof)
  tipLit: "#fff2b8",             // ... once lit
  gold: "#ffc21a",
  goldGlow: "#ffd766",
  cloud: "#2b2a5c",
  cloudGlow: "#9fe8ff",          // the storm front flickers while charging
  boltCore: "#ffffff",
  boltGlow: "#4df3ff",           // default bolt skin
  boltOutline: "#0b1446",        // deep-blue band under every bolt (contrast over lit buildings)
  super: "#ffcf3a",              // SUPERCHARGE band / flash
  over: "#ff4f5a",               // overcharge warning
  spark: "#dffbff",
  street: "#ffd98a",             // streetlights of a powered block
  rain: "#9fb4ff",
  windowGlow: 1.9,               // HDR: the lit windows bloom on the high tier and read as light on every tier
  litSelf: 0.3,                 // lit facades glow a little in the dark
  plates: { 2: "#4df3ff", 3: "#7cff7a", 5: "#ffcc33", 10: "#ff3fa4" },
};

/**
 * 8 themes x 5 cities (then they cycle). Names: i18n keys `theme_<id>`.
 *   window/accent/fog  legacy keys (still read by the UI side)
 *   world              field, asphalt, pad (sidewalk), padLit (a powered block), unlit, unlitWin, trim, dash, trees[]
 *   lit                candy colours for lit buildings (warm/candy; the bolt keeps cyan to itself)
 *   sky                overrides of BACKDROPS.night (top, bottom, horizon, glow, glow2, fog, hemiSky, hemiGround, key, rim)
 */
export const THEMES = [
  {
    id: "downtown", window: "#ffe2a0", accent: "#4df3ff", fog: "#181338",
    world: { field: "#121a34", asphalt: "#1d2246", pad: "#2c3160", padLit: "#8a6f8c", unlit: "#3a4482", unlitWin: "#11142c", trim: "#46508c", dash: "#4c5696", trees: ["#1f5a62", "#24705e", "#1a4a5c"] },
    lit: ["#ffc21a", "#ff5e57", "#ff4fb4", "#3fe08a", "#ff8c2a", "#a67bff"],
    sky: {},
  },
  {
    id: "harbour", window: "#ffd8a0", accent: "#7cf3ff", fog: "#0f1c3a",
    world: { field: "#0c1f3c", asphalt: "#1b2546", pad: "#2a3862", padLit: "#7a7a90", unlit: "#2f4170", unlitWin: "#0f162c", trim: "#45598e", dash: "#4c6098", trees: ["#1f5f62", "#2a7266", "#17505a"] },
    lit: ["#ff5e57", "#ffc21a", "#ff8c2a", "#ff4fb4", "#3fe08a", "#ffe6a0"],
    sky: { top: "#030a1c", bottom: "#0c1a3a", horizon: "#13406e", glow: "#1f6ab0", glow2: "#ff6a8a", fog: "#0f1c3a", hemiSky: "#5a8ad8" },
  },
  {
    id: "oldtown", window: "#ffc878", accent: "#ff8a5b", fog: "#21142e",
    world: { field: "#1c1a2c", asphalt: "#262040", pad: "#3a2f52", padLit: "#9a7480", unlit: "#40375f", unlitWin: "#161226", trim: "#5a4c80", dash: "#5e5288", trees: ["#2f5a46", "#3a6a48", "#264a40"] },
    lit: ["#ff7a45", "#ffb81c", "#ff5f8f", "#3fcf8f", "#e85aa0", "#ffd166"],
    sky: { top: "#0a0618", bottom: "#1e1030", horizon: "#5a2050", glow: "#b0503a", glow2: "#ff7a5a", fog: "#21142e", key: "#d8c0ff", rim: "#ff8a5b" },
  },
  {
    id: "hills", window: "#ffeaa8", accent: "#9dff9a", fog: "#0f1a30",
    world: { field: "#0f2030", asphalt: "#1b2444", pad: "#2a3660", padLit: "#7a8a8a", unlit: "#2e3e6c", unlitWin: "#10152c", trim: "#44568a", dash: "#4a5c94", trees: ["#1f6a52", "#2a7a5a", "#175a4a"] },
    lit: ["#ffcf3a", "#ff4fb4", "#9dff3a", "#ff8c2a", "#ff5e57", "#b58bff"],
    sky: { top: "#030a1a", bottom: "#0c1a34", horizon: "#124a4a", glow: "#1fa07a", glow2: "#6a4ad8", fog: "#0f1a30", rim: "#5fffc0" },
  },
  {
    id: "neonbay", window: "#ffb0e0", accent: "#ff3fa4", fog: "#1e0f3a",
    world: { field: "#170f36", asphalt: "#221848", pad: "#33275e", padLit: "#a0609a", unlit: "#3a2f72", unlitWin: "#120c2c", trim: "#55449a", dash: "#6a52b0", trees: ["#2a4a7a", "#3a3a8a", "#22406a"] },
    lit: ["#ff4fb4", "#a67bff", "#ff8c2a", "#9dff3a", "#ffcf3a", "#ff5e57"],
    sky: { top: "#08031c", bottom: "#1e0c40", horizon: "#6a1a7a", glow: "#a02ad8", glow2: "#ff2fa0", glow2Size: 0.26, fog: "#1e0f3a", hemiSky: "#8a6ae8", rim: "#ff3fd0" },
  },
  {
    id: "snowpeak", window: "#fff2c4", accent: "#bfe8ff", fog: "#1a2240",
    world: { field: "#3a4670", asphalt: "#262e52", pad: "#56628e", padLit: "#a8a0b8", unlit: "#3e4a7a", unlitWin: "#141a34", trim: "#7a88c0", dash: "#8a96c8", trees: ["#1f5060", "#285e6a", "#18465a"] },
    lit: ["#ff4f5a", "#ffc21a", "#ff8c2a", "#ff4fb4", "#3fe08a", "#a67bff"],
    sky: { top: "#050a20", bottom: "#141c40", horizon: "#3a4a8a", glow: "#5a7ad8", glow2: "#a0c0ff", glow2Size: 0.16, fog: "#1a2240", hemiSky: "#8aa0f0", hemiGround: "#2a3050", stars: 0.6 },
  },
  {
    id: "desert", window: "#ffd08a", accent: "#ff8a5b", fog: "#24142a",
    world: { field: "#2a1a2c", asphalt: "#2a2038", pad: "#4a3450", padLit: "#a07870", unlit: "#4a3a62", unlitWin: "#180f22", trim: "#6a5080", dash: "#7a5c88", trees: ["#3a5a3a", "#4a6a3a", "#2f4a30"] },
    lit: ["#ff5e57", "#ff8c2a", "#ff4fb4", "#ffc21a", "#a67bff", "#3fe08a"],
    sky: { top: "#0a0614", bottom: "#24102a", horizon: "#6a2a3a", glow: "#c0602a", glow2: "#ff5a6a", fog: "#24142a", key: "#ffd0c0", hemiGround: "#24101c", rim: "#ff8a5b" },
  },
  {
    id: "skyport", window: "#c8faff", accent: "#c86bff", fog: "#141a40",
    world: { field: "#121838", asphalt: "#1c2250", pad: "#2c3468", padLit: "#8a7aa8", unlit: "#323c7a", unlitWin: "#10142e", trim: "#4a56a0", dash: "#5260b0", trees: ["#2a5a7a", "#2f6a80", "#204a6a"] },
    lit: ["#ff4fb4", "#a67bff", "#ffc21a", "#ff8c2a", "#ff5e57", "#3fe08a"],
    sky: { top: "#04061e", bottom: "#141a48", horizon: "#3a2a8a", glow: "#3a6ae8", glow2: "#c84aff", fog: "#141a40", hemiSky: "#7a8ae8", rim: "#c86bff" },
  },
];

export const themeOf = (city) => THEMES[(city?.theme ?? 0) % THEMES.length];

/** The look.js backdrop preset for a theme: the night sky with the theme's overrides. */
export function backdropFor(theme) {
  return { ...BACKDROPS.night, ...theme.sky };
}
