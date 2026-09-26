/**
 * Look demo (WP-20) - the Storm Grid ("Volt City" concept) hero frame, built ONLY from the premium kit:
 * look.js (tone mapping, backdrop, rig, soft shadows, palette env, bloom by quality tier), materials.js
 * (window facades, wet street, fake reflection, rim-lit cloud), fx-kit.js (bolts, halos, sparks, rings),
 * number-pop.js (+1,280 / x64 CHAIN) and the refreshed styles.css (HUD pill, icon buttons, big meter).
 *
 * Page: lookdemo.html (vite dev: `npx vite --port 5174`, http://127.0.0.1:5174/lookdemo.html). Not in the
 * game build. Query: ?quality=low|medium|high|ultra (pin; default adapts) · ?still=1 (deterministic hero
 * frame for captures, then window.__LOOK__.ready) · ?stats=1 · ?hud=0 · ?panel=1 (result dialog with the
 * chunky buttons) · ?backdrop=storm|space|sunset|candy|ocean · ?t=0.32 (hero time in the strike sequence).
 *
 * The city is generated here for the demo only; the game's own generator lives in src/game (WP-30).
 * How the pieces are used is the reference for WP-31 (wiring the kit into the game view).
 */

import "@fontsource/lilita-one/latin-400.css";
import "../ui/styles.css";

import {
  BoxGeometry, Color, IcosahedronGeometry, InstancedBufferAttribute, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial,
  PlaneGeometry, PointLight, Quaternion, Vector3,
} from "three";
import { createStage } from "./stage.js";
import { applyLook } from "./look.js";
import { MATERIALS, enhance } from "./materials.js";
import { ACCENTS } from "./palette.js";
import { AdaptiveQuality } from "../core/quality.js";
import { FxKit } from "../fx/fx-kit.js";
import { createNumberPops, worldToScreen } from "../fx/number-pop.js";

const qs = new URLSearchParams(location.search);
const STILL = qs.get("still") === "1";
const HERO_T = Number(qs.get("t") || 0.32);

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Deterministic frame: the kit's bursts use Math.random, so the demo seeds it (demo page only).
const rand = mulberry32(20260926);
if (STILL) Math.random = mulberry32(777);

// ------------------------------------------------------------------ stage + look
const canvas = document.getElementById("game");
const stage = createStage(canvas);
const look = applyLook(stage, {
  backdrop: qs.get("backdrop") || "storm", toneMapping: qs.get("tm") || "neutral", exposure: Number(qs.get("exposure") || 1),
  shadowArea: 34, shadowsStatic: true, keyDir: [-0.85, 0.8, 0.25], rimDir: [-0.25, 1.1, -1],
  bloom: { strength: Number(qs.get("bs") || 0.62), radius: Number(qs.get("br") || 0.35), threshold: Number(qs.get("bt") || 0.9) },
});
const quality = new AdaptiveQuality(stage.renderer, { onTier: (t) => look.setQuality(t) });
const { scene, camera } = stage;

// ------------------------------------------------------------------ city layout (demo generator)
const BLOCKS = 9, BLOCK = 6.4, STREET = 2.6, PITCH = BLOCK + STREET, CURB = 0.14;
const HALF = (BLOCKS * PITCH) / 2;
// street centre lines along each axis; one wide boulevard (x) shows the wet-street reflection
const BOULEVARD = { k: 6, width: 7.5 };
function streetLines(wide) {
  const w = Array.from({ length: BLOCKS + 1 }, (_, k) => (wide && k === BOULEVARD.k ? BOULEVARD.width : STREET));
  const total = w.reduce((a, b) => a + b, 0) - w[0] / 2 - w[BLOCKS] / 2 + BLOCKS * BLOCK;
  const lines = [], centres = [];
  let x = -total / 2;
  for (let k = 0; k <= BLOCKS; k++) {
    lines.push(x);
    if (k < BLOCKS) { centres.push(x + w[k] / 2 + BLOCK / 2); x += w[k] / 2 + BLOCK + w[k + 1] / 2; }
  }
  return { lines, centres, widths: w };
}
const SX = streetLines(false), SZ = streetLines(true);
/** @type {{x:number,z:number,w:number,d:number,h:number,y:number,lit:number,target:number,seed:number,top:boolean,roof:number}[]} */
const parts = [];     // every box in the city mesh (buildings, setbacks, roof units)
const towers = [];    // main building per lot (for antennas, wave)

for (let bx = 0; bx < BLOCKS; bx++) {
  for (let bz = 0; bz < BLOCKS; bz++) {
    const cx = SX.centres[bx], cz = SZ.centres[bz];
    const nx = rand() < 0.7 ? 2 : 3, nz = rand() < 0.7 ? 2 : 3;
    const lw = BLOCK / nx, ld = BLOCK / nz;
    const downtown = Math.exp(-(cx * cx + cz * cz) / (2 * 20 * 20));
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < nz; j++) {
        const w = lw * (0.74 + rand() * 0.18), d = ld * (0.74 + rand() * 0.18);
        const x = cx - BLOCK / 2 + lw * (i + 0.5) + (rand() - 0.5) * (lw - w) * 0.8;
        const z = cz - BLOCK / 2 + ld * (j + 0.5) + (rand() - 0.5) * (ld - d) * 0.8;
        let h = 1.3 + (1.2 + 7 * downtown) * (0.25 + rand() * 0.95);
        if (rand() < 0.05) h *= 1.6;
        const t = { x, z, w, d, h, y: CURB, lit: 0, target: 0, seed: rand(), top: false, roof: h + CURB };
        towers.push(t);
        parts.push(t);
      }
    }
  }
}

// hero towers: A (just struck, lit), B (being hit), C and D (fork targets, dark)
function nearest(x, z) { let best = towers[0], bd = Infinity; for (const t of towers) { const dd = (t.x - x) ** 2 + (t.z - z) ** 2; if (dd < bd) { bd = dd; best = t; } } return best; }
const A = nearest(-8, 1); A.h = 14; A.w = Math.max(A.w, 2.3); A.d = Math.max(A.d, 2.3); A.roof = A.h + CURB;
const B = nearest(6, -6); B.h = 16.5; B.w = Math.max(B.w, 2.4); B.d = Math.max(B.d, 2.4); B.roof = B.h + CURB;
const C = nearest(13, 4); C.h = Math.max(C.h, 8.5); C.roof = C.h + CURB;
const D = nearest(2, 9); D.h = Math.max(D.h, 7.5); D.roof = D.h + CURB;
const E = nearest(-2, -12); E.h = Math.max(E.h, 9); E.roof = E.h + CURB;

// setbacks + roof units
for (const t of [...towers]) {
  if (t.h > 5.5 && rand() < 0.5 && t !== B) {
    const s = { x: t.x, z: t.z, w: t.w * (0.55 + rand() * 0.15), d: t.d * (0.55 + rand() * 0.15), h: t.h * (0.18 + rand() * 0.2), y: t.roof, lit: 0, target: 0, seed: rand(), top: true, parent: t };
    t.roof = s.y + s.h;
    t.setback = s;
    parts.push(s);
  }
  const units = rand() < 0.45 ? 1 : 0;
  for (let k = 0; k < units; k++) {
    const top = t.setback ?? t;
    const u = { x: t.x + (rand() - 0.5) * t.w * 0.5, z: t.z + (rand() - 0.5) * t.d * 0.5, w: 0.35 + rand() * 0.35, d: 0.35 + rand() * 0.35, h: 0.25 + rand() * 0.3, y: t.setback ? t.y + t.h : t.roof, lit: 0, target: 0, seed: rand(), top: true, parent: t };
    if (t.setback) { u.x = t.x + (rand() - 0.5) * t.w * 0.9; u.z = t.z + (t.d * 0.5 - 0.35) * (rand() < 0.5 ? 1 : -1); }
    if (top === t) parts.push(u); else parts.push(u);
  }
}

// initial power: the chain came from the far left - the left/back half blazes, the right/front is dark
function initialLit(t) {
  const edge = -3.5 + (t.seed - 0.5) * 5;
  const s = t.x * 0.9 + t.z * 0.45;
  if (s < edge - 3) return 1;
  if (s < edge) return 0.35 + 0.65 * ((edge - s) / 3);
  return 0;
}
for (const t of towers) t.lit = t.target = initialLit(t);
A.lit = A.target = 1;
B.lit = B.target = 0; C.lit = C.target = 0; D.lit = D.target = 0;
for (const p of parts) if (p.parent) p.lit = p.target = p.parent.lit;

// ------------------------------------------------------------------ meshes
const cityGeo = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const litAttr = new InstancedBufferAttribute(new Float32Array(parts.length), 1);
const seedAttr = new InstancedBufferAttribute(new Float32Array(parts.length), 1);
cityGeo.setAttribute("aLit", litAttr);
cityGeo.setAttribute("aSeed", seedAttr);
const facade = MATERIALS.facade({ litColor: ACCENTS.gold, litIntensity: Number(qs.get("li") || 1.75), cell: [0.5, 0.62], spill: 0.07, dim: 0.06 });
const city = new InstancedMesh(cityGeo, facade, parts.length);
city.name = "city";
city.castShadow = true;
city.receiveShadow = true;
const _m = new Matrix4(), _q = new Quaternion(), _p = new Vector3(), _s = new Vector3(), _c = new Color();
const charcoal = new Color(ACCENTS.charcoal);
parts.forEach((b, i) => {
  _m.compose(_p.set(b.x, b.y, b.z), _q.identity(), _s.set(b.w, b.h, b.d));
  city.setMatrixAt(i, _m);
  const v = 0.82 + b.seed * 0.36;
  _c.copy(charcoal).multiplyScalar(v);
  if (b.top && b.h < 0.7) _c.multiplyScalar(1.35);            // roof units a touch lighter
  city.setColorAt(i, _c);
  seedAttr.array[i] = b.seed;
  litAttr.array[i] = b.lit;
});
scene.add(city);

// far skyline: a ring of simple towers beyond the grid that dissolves into the fog and the storm glow
const far = [];
for (let i = 0; i < 360; i++) {
  const a = rand() * Math.PI * 2, r = HALF + 6 + Math.pow(rand(), 0.7) * 70;
  const x = Math.cos(a) * r, z = Math.sin(a) * r;
  if (x > HALF * 0.6 && z > HALF * 0.6) continue;                // nothing between the camera and the city
  const h = 1.5 + rand() * 6 + (rand() < 0.08 ? 6 : 0);
  far.push({ x, z, w: 2 + rand() * 2.5, d: 2 + rand() * 2.5, h, seed: rand(), lit: initialLit({ x, z, seed: rand() }) > 0.5 ? 0.25 + rand() * 0.5 : rand() * 0.06 });
}
const farGeo = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
farGeo.setAttribute("aLit", new InstancedBufferAttribute(new Float32Array(far.map((f) => f.lit)), 1));
farGeo.setAttribute("aSeed", new InstancedBufferAttribute(new Float32Array(far.map((f) => f.seed)), 1));
const skyline = new InstancedMesh(farGeo, facade, far.length);
skyline.name = "far-skyline";
far.forEach((f, i) => {
  _m.compose(_p.set(f.x, 0, f.z), _q.identity(), _s.set(f.w, f.h, f.d));
  skyline.setMatrixAt(i, _m);
  skyline.setColorAt(i, _c.copy(charcoal).multiplyScalar(0.7 + f.seed * 0.3));
});
scene.add(skyline);

// fake wet-street reflection: the same instances mirrored below y = 0, windows only, fading with depth
const mirror = new InstancedMesh(cityGeo, MATERIALS.facadeReflection(facade, { strength: 0.9, depthFade: 0.3 }), parts.length);
mirror.instanceMatrix = city.instanceMatrix;
mirror.instanceColor = city.instanceColor;
mirror.scale.y = -0.55;
mirror.name = "city-reflection";
scene.add(mirror);

// street (transparent wet asphalt over the reflection) + curbs/sidewalk slabs
const street = new Mesh(new PlaneGeometry(700, 700), MATERIALS.wetStreet({ color: "#0a0c24", opacity: Number(qs.get("street") || 0.66), roughness: 0.3, metalness: 0.3, envMapIntensity: 0.5 }));
street.rotation.x = -Math.PI / 2;
street.receiveShadow = true;
street.name = "street";
scene.add(street);
// the void under the transparent street: stops the sky from showing through where nothing is mirrored
const voidPlane = new Mesh(new PlaneGeometry(700, 700), new MeshStandardMaterial({ color: "#05040f", roughness: 1 }));
voidPlane.rotation.x = -Math.PI / 2;
voidPlane.position.y = -30;
voidPlane.name = "void";
scene.add(voidPlane);
const slabGeo = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const slabs = new InstancedMesh(slabGeo, new MeshStandardMaterial({ color: "#1d2050", roughness: 0.75, metalness: 0.1 }), BLOCKS * BLOCKS);
slabs.receiveShadow = true;
slabs.name = "sidewalks";
for (let bx = 0, i = 0; bx < BLOCKS; bx++) for (let bz = 0; bz < BLOCKS; bz++, i++) {
  _m.compose(_p.set(SX.centres[bx], 0, SZ.centres[bz]), _q.identity(), _s.set(BLOCK + 0.5, CURB, BLOCK + 0.5));
  slabs.setMatrixAt(i, _m);
}
scene.add(slabs);

// lane dashes (dim neon) along the centre line of every street
const dashes = [];
const onStreet = (v, S) => S.centres.every((c) => Math.abs(v - c) > BLOCK / 2 + 0.3);
for (let k = 0; k <= BLOCKS; k++) {
  for (let s = -HALF - 4; s < HALF + 4; s += 1.7) {
    if (onStreet(s, SZ)) dashes.push(SX.lines[k], s, 0);      // line along z at x = street k (skip crossings)
    if (onStreet(s, SX)) dashes.push(s, SZ.lines[k], 1);      // line along x at z = street k
  }
}
const dashCount = dashes.length / 3;
const dashMesh = new InstancedMesh(new BoxGeometry(1, 1, 1), MATERIALS.neon("#8f86ff", 0.5), dashCount);
dashMesh.name = "lane-dashes";
for (let i = 0; i < dashCount; i++) {
  const x = dashes[i * 3], z = dashes[i * 3 + 1], alongX = dashes[i * 3 + 2];
  _m.compose(_p.set(x, 0.012, z), _q.identity(), alongX ? _s.set(0.8, 0.02, 0.07) : _s.set(0.07, 0.02, 0.8));
  dashMesh.setMatrixAt(i, _m);
}
scene.add(dashMesh);

// rooftop antennas (the bolt's hop points) on the tall towers
const antennaTowers = towers.filter((t) => t.h > 6.5 || [A, B, C, D, E].includes(t));
const antGeo = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
const antennas = new InstancedMesh(antGeo, MATERIALS.metal("#8a8fb8", { roughness: 0.35 }), antennaTowers.length);
antennas.name = "antennas";
antennas.castShadow = true;
antennaTowers.forEach((t, i) => {
  t.antH = [A, B, C, D, E].includes(t) ? 2.2 : 1 + rand() * 1.2;
  _m.compose(_p.set(t.x, t.roof, t.z), _q.identity(), _s.set(0.12, t.antH, 0.12));
  antennas.setMatrixAt(i, _m);
  t.tip = new Vector3(t.x, t.roof + t.antH, t.z);
});
scene.add(antennas);

// storm cloud: rim-lit puffs (instanced icospheres) + a point light that flashes with every strike
const cloudCenter = new Vector3(-21, 24.5, 6);
const puffs = [];
for (let i = 0; i < 30; i++) {
  const a = rand() * Math.PI * 2, r = Math.sqrt(rand());
  const s = 1.6 + rand() * 2.2 * (1 - r * 0.5);
  // flat-ish base, billowing top: puffs rise toward the middle
  puffs.push([cloudCenter.x + Math.cos(a) * r * 11, cloudCenter.y + (1 - r) * 2.4 + rand() * 1.2 + s * 0.35, cloudCenter.z + Math.sin(a) * r * 7, s]);
}
const cloudMat = enhance(new MeshStandardMaterial({ color: "#2a1d5c", roughness: 1, metalness: 0 }), { rim: 0.3, rimPower: 2.2, rimColor: "#c77dff", rimTint: 0, inner: 0 });
const cloud = new InstancedMesh(new IcosahedronGeometry(1, 2), cloudMat, puffs.length);
cloud.name = "storm-cloud";
puffs.forEach(([x, y, z, s], i) => { _m.compose(_p.set(x, y, z), _q.identity(), _s.set(s * 1.3, s * 0.72, s)); cloud.setMatrixAt(i, _m); });
scene.add(cloud);
const flash = new PointLight(ACCENTS.volt, 0, 60, 1.6);
scene.add(flash);

// ------------------------------------------------------------------ FX
const fx = new FxKit(scene, { rand, sprites: 1200, ribbons: 30 });
// beacons: blinking red on dark towers, warm on lit ones - persistent sprites (life Infinity)
for (const t of antennaTowers) {
  if ([A, B, C, D, E].includes(t)) continue;
  const lit = t.lit > 0.5;
  fx.sprites.glow(t.tip.x, t.tip.y, t.tip.z, { color: lit ? "#ffcf6b" : "#ff2e55", size: 0.32, life: Infinity, intensity: 2.2, pulse: lit ? 0 : 0.6 + rand() });
}
// street lights: warm pools on the asphalt + a small lamp glow, only in the powered half
for (let k = 0; k <= BLOCKS; k++) {
  for (let s = 0; s < BLOCKS; s++) {
    const x = SX.lines[k] - SX.widths[k] / 2 + 0.5, z = SZ.centres[s] + (rand() - 0.5) * 3;
    const lit = initialLit({ x, z, seed: 0.5 }) > 0.5;
    if (!lit || rand() < 0.35) continue;
    fx.sprites.glow(x, 0.03, z, { color: "#ffb347", size: 1.3, life: Infinity, intensity: 0.5, normal: [0, 1, 0] });
    fx.sprites.glow(x, 0.9, z, { color: "#ffd9a0", size: 0.16, life: Infinity, intensity: 2 });
  }
}
// lightning inside the cloud: soft cyan glows under and between the puffs
for (let i = 0; i < 5; i++) {
  fx.sprites.glow(cloudCenter.x + (rand() - 0.5) * 12, cloudCenter.y - 1 + rand() * 1.5, cloudCenter.z + (rand() - 0.5) * 7,
    { color: i % 2 ? "#8f7bff" : ACCENTS.volt, size: 3 + rand() * 3, life: Infinity, intensity: 0.45, pulse: 1.3 + rand() * 2 });
}

// ------------------------------------------------------------------ UI (generic kit classes)
const ui = document.getElementById("ui");
const ICON = {
  coin: `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13.5" fill="#ffd23f" stroke="#e08e12" stroke-width="3"/><circle cx="16" cy="16" r="8" fill="none" stroke="#fff1b8" stroke-width="2.4"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>`,
  sound: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
  video: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="14" height="14" rx="3"/><path d="M17 10.2 22 7v10l-5-3.2z"/></svg>`,
};
if (qs.get("hud") !== "0") {
  ui.insertAdjacentHTML("beforeend", `
    <div class="hud">
      <div class="hud-left"><div class="coins"><b>12,480</b><span class="coin">${ICON.coin}</span></div></div>
      <div class="hud-center"></div>
      <div class="hud-right"><div class="btns"><button class="icon-btn" type="button">${ICON.pause}</button><button class="icon-btn" type="button">${ICON.sound}</button></div></div>
    </div>
    <div class="big-meter"><div class="bm-row"><span class="bm-value glow-cyan"><b>97</b><small>%</small></span><span class="bm-label stroke">POWERED</span></div><div class="bm-bar" style="--fill: 97%"><i></i></div></div>`);
}
if (qs.get("panel") === "1") {
  ui.insertAdjacentHTML("beforeend", `
    <div class="modal"><div class="dialog"><p class="dialog-mode">CITY 3 - HARBOUR</p><h2 class="stroke">FULL POWER!</h2>
      <div class="amount stroke"><span class="coin">${ICON.coin}</span><b>1,280</b></div>
      <div class="row"><button class="btn" type="button"><span>Claim</span></button><button class="btn" type="button" data-video="1">${ICON.video}<span>Claim x3</span></button></div>
    </div></div>`);
}
const pops = createNumberPops(ui);
let statsEl = null;
if (qs.get("stats") === "1") { statsEl = document.createElement("div"); statsEl.id = "stats"; document.getElementById("app").appendChild(statsEl); }

// ------------------------------------------------------------------ camera (elevated 3/4)
const target = new Vector3(-1, 11, -4);
const camDir = new Vector3(0.55, 0.36, 0.76).normalize();
const lookAt = new Vector3();
function placeCamera() {
  const aspect = stage.size.aspect || 16 / 9;
  const dist = aspect >= 1 ? 46 : 46 + (1 - aspect) * 12;
  camera.position.copy(target).addScaledVector(camDir, dist);
  camera.lookAt(lookAt.copy(target).setY(target.y + (aspect >= 1 ? 0 : 1.5)));
  camera.updateMatrixWorld();
}

// ------------------------------------------------------------------ the strike sequence
const SEQ_LEN = 4.2;
let seqT = 0;
const fired = new Set();
const scr = { x: 0, y: 0, visible: true };
const popLog = [];   // [element, sequence time] - stills seek each pop to its own age
function popAt(v, text, o) {
  worldToScreen(v, camera, stage.size.width, stage.size.height, scr);
  const el = pops.pop(scr.x + (o.dx ?? 0), scr.y + (o.dy ?? 0), text, o);
  popLog.push([el, seqT]);
  return el;
}
/** Where the peak numbers go: clear of the meter, the impact and the bolt (landscape vs portrait). */
function heroLayout() {
  const W = stage.size.width, H = stage.size.height, a = { x: 0, y: 0, visible: true }, b = { x: 0, y: 0, visible: true };
  worldToScreen(A.tip, camera, W, H, a);
  worldToScreen(B.tip, camera, W, H, b);
  if (W >= H) {
    // keep the big number clear of the meter: its top edge sits below the meter's bottom edge
    const meter = document.querySelector(".big-meter")?.getBoundingClientRect();
    const em = parseFloat(getComputedStyle(ui).fontSize) || 15;
    const half = em * 3.2 * 1.35 * 0.5;
    const y = Math.max(b.y - H * 0.13, (meter ? meter.bottom : 0) + half + 6);
    return { portrait: false, big: [b.x + W * 0.12, y], combo: [b.x + W * 0.14, Math.max(b.y - H * 0.02, y + half + em * 0.9)] };
  }
  const top = Math.min(a.y, b.y);
  return { portrait: true, big: [W * 0.5, top - H * 0.15], combo: [W * 0.52, top - H * 0.075] };
}
function light(t, delay = 0) { t.target = 1; t.delay = delay; }
function wave(from, radius, t0) {
  for (const t of towers) {
    if (t.target >= 1) continue;
    const dd = Math.hypot(t.x - from.x, t.z - from.z);
    if (dd < radius) light(t, t0 + dd * 0.06);
  }
}
const EVENTS = [
  [0.0, () => {
    fx.strike(_p.set(cloudCenter.x + 4, cloudCenter.y - 2, cloudCenter.z - 3).clone(), A.tip, { width: 1.1, forks: 3, arc: 0, life: 0.45, jag: 0.09, intensity: 1.4, haloSize: 2.2, beads: 2, ringDrop: A.antH });
    flash.position.set(A.x, A.roof + 6, A.z); flash.intensity = 260;
    popAt(A.tip, "+8", { kind: "gold", size: 0.6, dx: -95, dy: 45 });
  }],
  [0.14, () => {
    fx.strike(A.tip, B.tip, { width: 1.8, forks: 3, forkLength: 0.35, arc: 2.2, life: 0.55, jag: 0.1, intensity: 1.4, core: 3.2, haloSize: 2.6, sparks: 40, ringDrop: B.antH });
    flash.position.lerpVectors(A.tip, B.tip, 0.5); flash.intensity = 420;
    light(B, 0.05); wave(A, 7, 0.1);
  }],
  [0.24, () => {
    fx.strike(B.tip, C.tip, { width: 1.2, forks: 2, arc: 1.2, life: 0.5, progress: 0.62, forkProgress: 0.5, intensity: 1.4 });
    fx.strike(B.tip, D.tip, { width: 1.1, forks: 1, arc: 1, life: 0.5, progress: 0.5, forkProgress: 0.4, intensity: 1.4 });
    popAt(B.tip, "+16", { kind: "gold", size: 0.7, dx: 50, dy: 95 });
  }],
  [0.27, () => {
    const L = heroLayout();
    popLog.push([pops.pop(L.big[0], L.big[1], "+1,280", { kind: "gold", size: L.portrait ? 1.1 : 1.35, duration: 1500 }), seqT]);
  }],
  [0.3, () => {
    const L = heroLayout();
    popLog.push([pops.combo(L.combo[0], L.combo[1], "x64 CHAIN", { size: L.portrait ? 0.95 : 1.05, duration: 1700 }), seqT]);
  }],
  [0.45, () => { light(C, 0); light(D, 0.1); wave(B, 9, 0.2); fx.impact(C.tip, { color: ACCENTS.volt, size: 1.2 }); popAt(C.tip, "+32", { kind: "gold", size: 0.7, dy: -24 }); }],
  [0.6, () => { fx.impact(D.tip, { color: ACCENTS.volt, size: 1.1 }); popAt(D.tip, "+32", { kind: "gold", size: 0.7, dy: -24 }); }],
];

function resetCity() {
  for (const t of towers) { t.lit = t.target = initialLit(t); t.delay = 0; }
  A.lit = A.target = 1; B.lit = B.target = 0; C.lit = C.target = 0; D.lit = D.target = 0;
  syncLit(true);
}
function syncLit(force) {
  let changed = force;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const src = p.parent ?? p;
    if (!p.parent) {
      if (p.delay > 0) p.delay -= lastDt;
      else if (p.lit < p.target) { p.lit = Math.min(p.target, p.lit + lastDt * 1.8); changed = true; }
    }
    if (litAttr.array[i] !== src.lit) { litAttr.array[i] = src.lit; changed = true; }
  }
  if (changed) litAttr.needsUpdate = true;
}

let lastDt = 1 / 60;
function step(dt) {
  lastDt = dt;
  seqT += dt;
  for (let i = 0; i < EVENTS.length; i++) if (!fired.has(i) && seqT >= EVENTS[i][0]) { fired.add(i); EVENTS[i][1](); }
  if (seqT > SEQ_LEN && !STILL) { seqT = 0; fired.clear(); resetCity(); }
  flash.intensity *= Math.exp(-5 * dt);
  syncLit(false);
  fx.update(dt, camera);
}

function frame(dt) {
  stage.resize();
  placeCamera();
  step(dt);
  stage.render();
  if (statsEl) {
    const i = look.info();
    statsEl.textContent = `${i.tier} dpr ${i.dpr} bloom ${i.bloom} shadows ${i.shadows}\ncalls ${i.calls} (scene ${i.sceneCalls} + post ${i.postCalls})\ntris ${i.triangles} (scene ${i.sceneTriangles})`;
  }
}

// ------------------------------------------------------------------ run
stage.resize();
placeCamera();
syncLit(true);
window.__LOOK__ = {
  ready: false,
  info: () => look.info(),
  parts: parts.length,
  /** Advance the live scene by dt and render (captures). */
  frame(dt = 1 / 60) { frame(dt); return look.info(); },
  setQuality(name) { quality.setLevel(name); },
  /** Allocation check: run only the FX kit update n times (no render). */
  fxOnly(n = 240, dt = 1 / 60) { for (let i = 0; i < n; i++) fx.update(dt, camera); return fx.sprites.live; },
  /** Re-fire the strike sequence (live FX for measurements). */
  replay() { seqT = 0; fired.clear(); },
  /** One frame that re-renders the static shadow map (its cost is paid only when casters change). */
  shadowFrame() { look.refreshShadows(); stage.render(); const i = look.info(); stage.render(); return i; },
  /** Screen positions of the hero points (layout checks). */
  debug() {
    const o = {};
    for (const [k, v] of Object.entries({ A: A.tip, B: B.tip, C: C.tip, D: D.tip, cloud: cloudCenter })) {
      const r = worldToScreen(v, camera, stage.size.width, stage.size.height, { x: 0, y: 0, visible: true });
      o[k] = [Math.round(r.x), Math.round(r.y)];
    }
    return o;
  },
  sceneStats() {
    const rows = [];
    scene.traverse((o) => {
      if (!o.isMesh || !o.geometry?.attributes?.position) return;
      const g = o.geometry;
      rows.push({ name: o.name || g.type, triangles: Math.round((g.index ? g.index.count : g.attributes.position.count) / 3), instances: o.isInstancedMesh ? o.count : 1 });
    });
    return rows.sort((a, b) => b.triangles - a.triangles);
  },
};

if (STILL) {
  // deterministic hero frame: run the sequence to HERO_T in fixed steps, freeze the pops there
  const dt = 1 / 60;
  const steps = Math.round(HERO_T / dt);
  stage.renderer.compileAsync(scene, camera).catch(() => {}).finally(() => {
    for (let i = 0; i < steps; i++) step(dt);
    stage.resize(); placeCamera();
    stage.render();                     // frame 1: static shadow map
    stage.render();                     // frame 2: steady state (what the stats report)
    // each pop is shown at its own age + a hold so the peaks sit just after their overshoot
    for (const [el, t] of popLog) for (const a of el.getAnimations()) { a.pause(); a.currentTime = Math.min(900, (HERO_T - t) * 1000 + 430); }
    for (const a of document.getAnimations()) if (a.playState === "running") a.pause();
    window.__LOOK__.ready = true;
  });
} else {
  let last = performance.now(), ema = 16.7;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    ema += ((now - last) - ema) * 0.05;
    last = now;
    frame(dt);
    quality.update(ema, dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  window.__LOOK__.ready = true;
}
