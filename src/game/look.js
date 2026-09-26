/**
 * Volt City placeholder look (plain three.js materials). The game-feel-artist's look kit
 * (src/render/**, WP-20/31) replaces these values; the view reads everything from here so the
 * swap is one place. Colours from docs/CONCEPTS.md "T1 - Volt City" art direction.
 */

export const LOOK = {
  // stage.js theme keys: sky gradient, fog (= the magenta storm glow on the horizon), hemisphere light
  skyTop: "#05081a", skyBottom: "#1a0c2e", fog: "#2a1446",
  hemiSky: "#6a74c8", hemiGround: "#0d0f1f",
  fogNear: 55, fogFar: 170,
  hemiIntensity: 0.9, sunIntensity: 0.55, sunColor: "#9aa6ff",
  ground: "#080a16",
  street: "#0d1022",
  block: "#141833",            // sidewalk pads under each block
  building: "#1b1f3b",         // unlit facades (charcoal)
  buildingVar: 0.18,           // +- brightness variation per building
  windowDark: "#0e1128",       // unlit glass
  windowLit: "#ffd166",        // warm gold windows
  windowLitHot: "#fff1c4",     // the first flash of a freshly lit building
  roof: "#161a31",
  antenna: "#3a3f63",
  tipDark: "#ff3355",          // aviation light before power
  tipLit: "#9ff8ff",
  gold: "#ffc83d",
  cloud: "#241d3d",
  cloudGlow: "#c86bff",        // the cloud flickers magenta while charging
  boltCore: "#ffffff",
  boltGlow: "#4df3ff",         // default bolt skin
  super: "#ffe066",            // SUPERCHARGE band / flash
  spark: "#bff8ff",
};
