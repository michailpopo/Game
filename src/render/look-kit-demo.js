/**
 * Kit swatch (WP-20): the concept-agnostic half of the premium kit on one frame - every material
 * (candy, crystal, glass + emissive core, gold, metal, neon), the shatter + coin-burst presets frozen
 * mid-air, a number pop and a combo label, on the "space" backdrop with a soft key shadow.
 * lookdemo.html?scene=kit (&still=1 &quality=... &backdrop=space|candy|sunset|ocean|storm)
 */

import "@fontsource/lilita-one/latin-400.css";
import "../ui/styles.css";

import {
  CircleGeometry, Color, CylinderGeometry, IcosahedronGeometry, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, OctahedronGeometry,
  Quaternion, SphereGeometry, TorusGeometry, Vector3,
} from "three";
import { createStage } from "./stage.js";
import { applyLook } from "./look.js";
import { MATERIALS } from "./materials.js";
import { GEM_COLORS } from "./palette.js";
import { AdaptiveQuality } from "../core/quality.js";
import { FxKit } from "../fx/fx-kit.js";
import { createNumberPops, worldToScreen } from "../fx/number-pop.js";

const qs = new URLSearchParams(location.search);
const STILL = qs.get("still") === "1";
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
if (STILL) Math.random = mulberry32(4242);

const stage = createStage(document.getElementById("game"));
const look = applyLook(stage, {
  backdrop: qs.get("backdrop") || "space", toneMapping: qs.get("tm") || "neutral", shadowArea: 9,
  keyDir: [-0.6, 1, 0.55], rimDir: [0.4, 0.6, -1], ground: { opacity: 0.5, color: "#05020f" },
  bloom: { strength: 0.7, radius: 0.45, threshold: 0.9 },
});
const quality = new AdaptiveQuality(stage.renderer, { onTier: (t) => look.setQuality(t) });
const { scene, camera } = stage;
// dark satin stage that runs into the fog (no visible edge)
const floor = new Mesh(new CircleGeometry(80, 48), new MeshStandardMaterial({ color: "#120b35", roughness: 0.55, metalness: 0.2, envMapIntensity: 0.5 }));
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);
look.ground.position.y = 0.002;

const _m = new Matrix4(), _q = new Quaternion(), _p = new Vector3(), _s = new Vector3(), _c = new Color();
const X = [-6.2, -3.7, -1.25, 1.25, 3.7, 6.2];
const add = (mesh, x, y = 1, cast = true) => { mesh.position.set(x, y, 0); mesh.castShadow = cast; scene.add(mesh); return mesh; };

// 1 candy
add(new Mesh(new SphereGeometry(0.95, 32, 16), MATERIALS.candy("#ff2d95")), X[0], 0.95).name = "candy";
// 2 crystal cluster (instanced, per-instance gem colours)
const gems = new InstancedMesh(new OctahedronGeometry(0.5, 0).scale(0.7, 1.7, 0.7), MATERIALS.crystal(0xffffff), 7);
gems.name = "crystal-cluster";
gems.castShadow = true;
for (let i = 0; i < 7; i++) {
  const a = (i / 6) * Math.PI * 2, r = i === 0 ? 0 : 0.55, tilt = i === 0 ? 0 : 0.45;
  _q.setFromAxisAngle(_p.set(Math.sin(a), 0, -Math.cos(a)).normalize(), tilt);
  _m.compose(_p.set(X[1] + Math.cos(a) * r, i === 0 ? 1.05 : 0.7, Math.sin(a) * r), _q, _s.setScalar(i === 0 ? 1.25 : 0.8));
  gems.setMatrixAt(i, _m);
  gems.setColorAt(i, _c.set(GEM_COLORS[i % GEM_COLORS.length]));
}
scene.add(gems);
// 3 glass shell + emissive core
add(new Mesh(new OctahedronGeometry(0.42, 0), MATERIALS.core("#4df3ff", 5)), X[2], 1.05, false).name = "core";
add(new Mesh(new IcosahedronGeometry(0.95, 0), MATERIALS.glass("#9ff6ff")), X[2], 1.05).name = "glass";
// 4 gold coin stack
const coins = new InstancedMesh(new CylinderGeometry(0.62, 0.62, 0.16, 20, 1), MATERIALS.gold(), 6);
coins.name = "gold";
coins.castShadow = true;
for (let i = 0; i < 6; i++) {
  _q.setFromAxisAngle(_p.set(0, 1, 0), i * 0.4);
  _m.compose(_p.set(X[3] + (i % 2) * 0.05, 0.08 + i * 0.17, 0), _q, _s.setScalar(1));
  coins.setMatrixAt(i, _m);
}
scene.add(coins);
// 5 metal torus
add(new Mesh(new TorusGeometry(0.62, 0.27, 16, 40), MATERIALS.metal("#c9d3ff")), X[4], 0.95).rotation.set(0.3, 0.6, 0);
// 6 neon rings
add(new Mesh(new TorusGeometry(0.75, 0.07, 8, 48), MATERIALS.neon("#ff2d95", 3)), X[5], 1.0, false).rotation.set(0, 0.5, 0);
add(new Mesh(new TorusGeometry(0.5, 0.06, 8, 40), MATERIALS.neon("#4df3ff", 3)), X[5], 1.0, false).rotation.set(1.2, 0.2, 0);

// FX + pops
const fx = new FxKit(scene, { castShadow: true, rand: STILL ? mulberry32(7) : Math.random });
const ui = document.getElementById("ui");
const pops = createNumberPops(ui);
const burstAt = new Vector3(0, 4.4, 0.5);
const coinAt = new Vector3(5, 3.6, 0.5);
function fire() {
  fx.shatter(burstAt, { colors: GEM_COLORS, count: 40 });
  fx.coinBurst(coinAt, { count: 14 });
  fx.gemBurst(new Vector3(-5, 3.4, 0.5), { count: 10 });
}

function placeCamera() {
  const a = stage.size.aspect || 16 / 9;
  const d = a >= 1 ? 11.5 : 11.5 / Math.max(0.45, a) * 0.95;
  camera.position.set(0, 3.6 + (a < 1 ? 2 : 0), d);
  camera.lookAt(0, a >= 1 ? 2.1 : 2.8, 0);
  camera.updateMatrixWorld();
}
const scr = { x: 0, y: 0, visible: true };
function popLabels() {
  worldToScreen(burstAt, camera, stage.size.width, stage.size.height, scr);
  const els = [pops.pop(scr.x, scr.y - stage.size.height * 0.2, "+250", { kind: "gold", size: 1.3, duration: 1400 }),
    pops.combo(scr.x, scr.y - stage.size.height * 0.1, "x12 COMBO", { size: 1, duration: 1600 })];
  return els;
}

stage.resize();
placeCamera();
window.__LOOK__ = { ready: false, info: () => look.info(), setQuality: (n) => quality.setLevel(n) };
if (STILL) {
  stage.renderer.compileAsync(scene, camera).catch(() => {}).finally(() => {
    fire();
    for (let i = 0; i < 11; i++) fx.update(1 / 60, camera);
    stage.resize(); placeCamera();
    const els = popLabels();
    stage.render(); stage.render();
    for (const el of els) for (const a of el.getAnimations()) { a.pause(); a.currentTime = 480; }
    window.__LOOK__.ready = true;
  });
} else {
  let last = performance.now(), ema = 16.7, t = 0;
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    ema += ((now - last) - ema) * 0.05; last = now; t += dt;
    if (t > 2.2 || t === dt) { t = dt; fire(); popLabels(); }
    stage.resize(); placeCamera();
    fx.update(dt, camera);
    stage.render();
    quality.update(ema, dt);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  window.__LOOK__.ready = true;
}
