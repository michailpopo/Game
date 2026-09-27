/**
 * Look demo - the Storm Grid hero frame, WP-21 toy-city restyle (WP-20 kit + src/render/city-kit.js).
 * Built only from the kit: look.js (dusk backdrop, rig, soft static shadows, bloom by tier), city-kit.js
 * (toy building types, lit/unlit fill material, trees, cars, ground), fx-kit.js (bolt, halos, sparks),
 * number-pop.js and the WP-20 UI classes (unchanged - the owner likes the UI).
 *
 * Page: lookdemo.html (vite dev: `npx vite --port 5174`, http://127.0.0.1:5174/lookdemo.html). Not in the game
 * build. Query: ?quality=low|medium|high|ultra (pin) · ?still=1 (deterministic hero frame, then
 * window.__LOOK__.ready) · ?stats=1 · ?hud=0 · ?panel=1 · ?backdrop=dusk|storm|... · ?t=0.32 · ?seed=7
 *
 * The demo layout comes from layoutToyCity(); the game's own city generator (src/game, WP-30) only has to
 * output the same placement records ({ type, x, z, rot, scale, color }) to reuse ToyCity (WP-31).
 */

import "@fontsource/lilita-one/latin-400.css";
import "../ui/styles.css";

import { InstancedMesh, Matrix4, MeshStandardMaterial, PointLight, Quaternion, SphereGeometry, Vector3 } from "three";
import { createStage } from "./stage.js";
import { applyLook } from "./look.js";
import { enhance } from "./materials.js";
import { ACCENTS } from "./palette.js";
import { TOY, ToyCity, ToyProps, createToyGround, layoutToyCity } from "./city-kit.js";
import { AdaptiveQuality } from "../core/quality.js";
import { FxKit } from "../fx/fx-kit.js";
import { createNumberPops, worldToScreen } from "../fx/number-pop.js";

const qs = new URLSearchParams(location.search);
const STILL = qs.get("still") === "1";
const HERO_T = Number(qs.get("t") || 0.32);

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const rand = mulberry32(20260927);
if (STILL) Math.random = mulberry32(777);          // the kit's bursts use Math.random (demo page only)

// ------------------------------------------------------------------ stage + look
const stage = createStage(document.getElementById("game"));
const look = applyLook(stage, {
  backdrop: qs.get("backdrop") || "dusk", toneMapping: qs.get("tm") || "neutral", exposure: Number(qs.get("exposure") || 1),
  shadowArea: 44, shadowsStatic: true, keyDir: [-0.75, 0.62, 0.5], rimDir: [0.2, 0.6, -1],
  bloom: { strength: Number(qs.get("bs") || 0.45), radius: Number(qs.get("br") || 0.3), threshold: Number(qs.get("bt") || 1.05) },
});
look.key.shadow.radius = 5;
const quality = new AdaptiveQuality(stage.renderer, { onTier: (t) => look.setQuality(t) });
const { scene, camera } = stage;

// ------------------------------------------------------------------ the toy city
const layout = layoutToyCity({ blocks: 5, block: 10, street: 4.5, seed: Number(qs.get("seed") || 7), parks: 3 });
const P = layout.buildings;
// hero buildings: A (struck, lit), B (being hit - filling up), C and D (next hops, dark)
function claim(x, z, type) {
  let best = -1, bd = Infinity;
  P.forEach((p, i) => { const d = (p.x - x) ** 2 + (p.z - z) ** 2; if (d < bd && !p.hero) { bd = d; best = i; } });
  Object.assign(P[best], { type, scale: 1.15, hero: true });
  return best;
}
const A = claim(-12, 6, 0), B = claim(13, -13, 3), C = claim(22, 6, 2), D = claim(4, -24, 1);

// powered half: the chain came from the left - lit buildings get their candy colour
const litOf = (p) => (p.x * 0.85 + p.z * 0.4 < 9 + (rand() - 0.5) * 8 ? 1 : 0);
P.forEach((p, i) => { p.color = TOY.lit[Math.floor(rand() * TOY.lit.length)]; p.startLit = litOf(p); });
P[A].startLit = 1; P[B].startLit = 0; P[C].startLit = 0; P[D].startLit = 0;
P[A].color = "#ffc21a"; P[B].color = "#ff5e57";

createToyGround(scene, layout);
// a ring of trees around the city plate frames the diorama (negative space stays green and calm)
for (let k = 0; k < 70; k++) {
  const a = rand() * Math.PI * 2, r = layout.size * 0.5 + 5 + rand() * 30;
  const x = Math.cos(a) * r * (1 + 0.15 * Math.sin(a * 3)), z = Math.sin(a) * r;
  if (Math.abs(x) < layout.size * 0.5 + 3 && Math.abs(z) < layout.size * 0.5 + 3) continue;
  layout.props.push({ kind: rand() < 0.55 ? "roundTree" : "coneTree", x, z, rot: rand() * 6.28, scale: 1 + rand() * 0.8 });
}
const city = new ToyCity(scene, P);
new ToyProps(scene, layout.props);
function resetCity() { P.forEach((p, i) => city.setLit(i, p.startLit, true)); }
resetCity();
const tipA = city.tip(A), tipB = city.tip(B), tipC = city.tip(C), tipD = city.tip(D);

// storm cloud: a few big smooth puffs, slate blue with a bright rim (toy-like, no haze)
const cloudCenter = new Vector3(-40, 25, 2);
const puffs = [[0, 0, 0, 5], [5.5, -0.6, 1, 4.2], [-5.2, -0.8, -0.5, 4], [2.2, 2.4, -1, 4.2], [-2.6, 2, 0.8, 3.8], [8.8, -1.2, -0.6, 3], [-8.4, -1.4, 0.4, 2.8], [0.5, -1.4, 3, 3.6]];
const cloud = new InstancedMesh(new SphereGeometry(1, 16, 12),
  enhance(new MeshStandardMaterial({ color: "#5d6594", roughness: 0.9 }), { rim: 0.45, rimPower: 2.4, rimColor: "#ffd9e8", rimTint: 0 }), puffs.length);
cloud.name = "storm-cloud";
const _m = new Matrix4(), _q = new Quaternion(), _p = new Vector3(), _s = new Vector3();
puffs.forEach(([x, y, z, r], i) => { _m.compose(_p.set(cloudCenter.x + x, cloudCenter.y + y, cloudCenter.z + z), _q.identity(), _s.set(r, r * 0.82, r)); cloud.setMatrixAt(i, _m); });
scene.add(cloud);
const flash = new PointLight(ACCENTS.volt, 0, 22, 1.6);
scene.add(flash);

// ------------------------------------------------------------------ FX
const fx = new FxKit(scene, { rand, sprites: 900, ribbons: 30 });

// ------------------------------------------------------------------ UI (WP-20 classes, unchanged)
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
const target = new Vector3(-1, 5, -5);
const camDir = new Vector3(0.55, 0.37, 0.75).normalize();
const lookAt = new Vector3();
function placeCamera() {
  const aspect = stage.size.aspect || 16 / 9;
  const dist = aspect >= 1 ? 74 : 74 + (1 - aspect) * 30;
  camera.position.copy(target).addScaledVector(camDir, dist);
  camera.lookAt(lookAt.copy(target).setY(target.y + (aspect >= 1 ? 0 : 2)));
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
  worldToScreen(tipA, camera, W, H, a);
  worldToScreen(tipB, camera, W, H, b);
  if (W >= H) {
    const meter = document.querySelector(".big-meter")?.getBoundingClientRect();
    const em = parseFloat(getComputedStyle(ui).fontSize) || 15;
    const half = em * 3.2 * 1.35 * 0.5;
    const y = Math.max(b.y - H * 0.13, (meter ? meter.bottom : 0) + half + 6);
    return { portrait: false, big: [b.x + W * 0.13, y], combo: [b.x + W * 0.15, Math.max(b.y - H * 0.02, y + half + em * 0.9)] };
  }
  const top = Math.min(a.y, b.y);
  return { portrait: true, big: [W * 0.5, top - H * 0.15], combo: [W * 0.52, top - H * 0.075] };
}
/** Neighbours light up in a wave from a hop point. */
function wave(from, radius, delay) {
  const f = P[from];
  P.forEach((p, i) => {
    if (city.target[i] >= 1 || i === C || i === D) return;
    const d = Math.hypot(p.x - f.x, p.z - f.z);
    if (d < radius) wakes.push([seqT + delay + d * 0.05, i]);
  });
}
const wakes = [];
const EVENTS = [
  [0.0, () => {
    fx.strike(_p.set(cloudCenter.x + 5, cloudCenter.y - 3, cloudCenter.z + 2).clone(), tipA, { width: 1.1, forks: 2, arc: 0, life: 0.45, jag: 0.08, intensity: 1.4, haloSize: 2.2, beads: 2, ringDrop: 1.6 });
    flash.position.copy(tipA).setY(tipA.y + 5); flash.intensity = 90;
    popAt(tipA, "+8", { kind: "gold", size: 0.6, dx: -80, dy: 40 });
  }],
  [0.14, () => {
    fx.strike(tipA, tipB, { width: 2.2, forks: 3, forkLength: 0.32, arc: 3, life: 0.55, jag: 0.09, intensity: 1.4, core: 3.2, haloSize: 2.6, sparks: 40, ringDrop: 1.4 });
    flash.position.lerpVectors(tipA, tipB, 0.5); flash.intensity = 120;
    city.setLit(B, 1); city.value[B] = 0.3;       // the hit floods the tower from the ground up
    wave(A, 18, 0.1);
  }],
  [0.24, () => {
    fx.strike(tipB, tipC, { width: 1.2, forks: 2, arc: 1.6, life: 0.5, progress: 0.62, forkProgress: 0.5, intensity: 1.4 });
    fx.strike(tipB, tipD, { width: 1.1, forks: 1, arc: 1.4, life: 0.5, progress: 0.5, forkProgress: 0.4, intensity: 1.4 });
    popAt(tipB, "+16", { kind: "gold", size: 0.7, dx: 50, dy: 95 });
  }],
  [0.27, () => { const L = heroLayout(); popLog.push([pops.pop(L.big[0], L.big[1], "+1,280", { kind: "gold", size: L.portrait ? 1.1 : 1.35, duration: 1500 }), seqT]); }],
  [0.3, () => { const L = heroLayout(); popLog.push([pops.combo(L.combo[0], L.combo[1], "x64 CHAIN", { size: L.portrait ? 0.95 : 1.05, duration: 1700 }), seqT]); }],
  [0.45, () => { city.setLit(C, 1); fx.impact(tipC, { color: ACCENTS.volt, size: 1.2 }); popAt(tipC, "+32", { kind: "gold", size: 0.7, dy: -24 }); wave(C, 14, 0.1); }],
  [0.6, () => { city.setLit(D, 1); fx.impact(tipD, { color: ACCENTS.volt, size: 1.1 }); popAt(tipD, "+32", { kind: "gold", size: 0.7, dy: -24 }); }],
];

let lastDt = 1 / 60;
function step(dt) {
  lastDt = dt;
  seqT += dt;
  for (let i = 0; i < EVENTS.length; i++) if (!fired.has(i) && seqT >= EVENTS[i][0]) { fired.add(i); EVENTS[i][1](); }
  for (let k = wakes.length - 1; k >= 0; k--) if (seqT >= wakes[k][0]) { city.setLit(wakes[k][1], 1); wakes.splice(k, 1); }
  if (seqT > SEQ_LEN && !STILL) { seqT = 0; fired.clear(); wakes.length = 0; resetCity(); }
  flash.intensity *= Math.exp(-5 * dt);
  city.update(dt);
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
window.__LOOK__ = {
  ready: false,
  info: () => look.info(),
  frame(dt = 1 / 60) { frame(dt); return look.info(); },
  setQuality(name) { quality.setLevel(name); },
  fxOnly(n = 240, dt = 1 / 60) { for (let i = 0; i < n; i++) fx.update(dt, camera); return fx.sprites.live; },
  replay() { seqT = 0; fired.clear(); },
  shadowFrame() { look.refreshShadows(); stage.render(); const i = look.info(); stage.render(); return i; },
  debug() {
    const o = {};
    for (const [k, v] of Object.entries({ A: tipA, B: tipB, C: tipC, D: tipD, cloud: cloudCenter })) {
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
  const dt = 1 / 60;
  const steps = Math.round(HERO_T / dt);
  stage.renderer.compileAsync(scene, camera).catch(() => {}).finally(() => {
    for (let i = 0; i < steps; i++) step(dt);
    stage.resize(); placeCamera();
    stage.render();                     // frame 1: static shadow map
    stage.render();                     // frame 2: steady state
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
