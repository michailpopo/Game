/**
 * Storm Grid placeholder look: deliberately plain (boxes with a lit/unlit colour state) until the
 * game-feel-artist restyles the city (WP-21/31); the view reads everything from here. Colours from docs/GAME_BRIEF.md "Art direction (3D)". World units are metres.
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
  blockLit: "#4a3d5e",           // ... once BLOCK POWERED
  building: "#232848",           // a dark building
  buildingVar: 0.18,             // +- brightness variation per building
  litBoost: 1.25,                // lit building = the theme's lit colour x this
  hotFlash: "#ffffff",           // the first flash of a freshly lit building
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
 * 8 themes x 5 cities (then they cycle). Colour sets only in v1: the lit building colour (`window`),
 * an accent and the horizon glow. The rules stay the same. Names: i18n keys `theme_<id>`.
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
