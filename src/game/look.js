/**
 * Storm Grid placeholder look (plain three.js materials). The game-feel-artist's look kit
 * (src/render/**, WP-31) replaces these values; the view reads everything from here so the swap is
 * one place. Colours from docs/GAME_BRIEF.md "Art direction (3D)". World units are metres.
 */

export const LOOK = {
  // stage.js theme keys: sky gradient, fog (= the magenta storm glow on the horizon), hemisphere light
  skyTop: "#0a0e2a", skyBottom: "#2a1a5e", fog: "#3a1850",
  hemiSky: "#3a3f8f", hemiGround: "#0b0d1f",
  fogNear: 0.9, fogFar: 3.2,     // x the camera distance (set per city)
  hemiIntensity: 2.2, sunIntensity: 1.5, sunColor: "#9fb7ff",
  ground: "#0a0c1a",
  street: "#12152b",
  block: "#1a1e38",              // sidewalk pads under each district
  blockLit: "#3a3350",           // ... once BLOCK POWERED (warm, the streetlights are on)
  streetLight: "#ffcf7a",
  building: "#1b1f3b",           // unlit facades (charcoal)
  buildingLit: "#2b2f55",        // lit facades
  buildingVar: 0.18,             // +- brightness variation per building
  windowCell: [2.0, 2.6],        // window grid on the facades (m): width x height
  windowDark: "#262b4f",         // unlit glass
  windowLitHot: "#fff1c4",       // the first flash of a freshly lit building
  roof: "#161a31",
  antenna: "#4a5078",
  tipDark: "#ff3355",            // aviation light before power
  tipLit: "#9ff8ff",
  gold: "#ffcc33",
  cloud: "#2c2450",
  cloudGlow: "#c86bff",          // the cloud flickers magenta while charging
  boltCore: "#ffffff",
  boltGlow: "#4df3ff",           // default bolt skin
  super: "#ffe066",              // SUPERCHARGE band / flash
  over: "#ff5a6e",               // overcharge warning
  spark: "#bff8ff",
  plates: { 2: "#4df3ff", 3: "#7cff7a", 5: "#ffcc33", 10: "#ff3fa4" },
};

/**
 * 8 themes x 5 cities (then they cycle). Colour sets only in v1: the lit window colour, a facade
 * accent and the horizon glow. The rules stay the same. Names: i18n keys `theme_<id>`.
 */
export const THEMES = [
  { id: "downtown", window: "#ffd166", accent: "#4df3ff", fog: "#3a1850" },
  { id: "harbour", window: "#ffc07a", accent: "#7cf3ff", fog: "#162a50" },
  { id: "oldtown", window: "#ffb35c", accent: "#ff8a5b", fog: "#3a1a30" },
  { id: "hills", window: "#ffe08a", accent: "#9dff9a", fog: "#1c2c44" },
  { id: "neonbay", window: "#ff9ad5", accent: "#ff3fa4", fog: "#3a0f4a" },
  { id: "snowpeak", window: "#fff2c4", accent: "#bfe8ff", fog: "#283456" },
  { id: "desert", window: "#ffc46b", accent: "#ff8a5b", fog: "#44202a" },
  { id: "skyport", window: "#9ff8ff", accent: "#c86bff", fog: "#14204e" },
];

export const themeOf = (city) => THEMES[(city?.theme ?? 0) % THEMES.length];
