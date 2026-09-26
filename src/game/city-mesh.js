/**
 * The 3D city: ground, block pads, instanced buildings with shader windows, rooftop antennas
 * with aviation-light tips, tip glows and the storm front. Built once per city (disposed on
 * rebuild); per frame only the per-instance "lit" attribute, tip colours and glows are written.
 *
 * Windows cost no geometry: the fragment shader draws a window grid on every facade from the
 * instance's scale, and each window switches on when the building's aLit (0..1, animated by the
 * view from the simulation's litAt) passes the window's own random threshold - so a building
 * fills with light window by window.
 */

import {
  AdditiveBlending, BoxGeometry, CanvasTexture, Color, CylinderGeometry, DynamicDrawUsage, Euler, Group,
  IcosahedronGeometry, InstancedBufferAttribute, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial,
  OctahedronGeometry, PlaneGeometry, Quaternion, SRGBColorSpace, Vector3,
} from "three";
import { VOLT } from "../config.js";
import { createRng } from "../core/rng.js";
import { LOOK } from "./look.js";

const _m = new Matrix4();
const _p = new Vector3();
const _q = new Quaternion();
const _s = new Vector3();
const _e = new Euler();
const _c = new Color();
const ID = new Quaternion();

export function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function buildingMaterial() {
  const mat = new MeshLambertMaterial({ color: 0xffffff });
  const u = {
    uWinDark: { value: new Color(LOOK.windowDark) },
    uWinLit: { value: new Color(LOOK.windowLit) },
    uWinHot: { value: new Color(LOOK.windowLitHot) },
  };
  const floor = VOLT.city.floor.toFixed(3);
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>
attribute float aLit;
attribute float aSeed;
attribute float aHot;
varying vec2 vFacade;
varying float vLit;
varying float vSeed;
varying float vSide;
varying float vHot;`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>
vec3 sc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
vSide = 1.0 - abs(normal.y);
vFacade = abs(normal.x) > 0.5 ? vec2(position.z * sc.z, position.y * sc.y) : vec2(position.x * sc.x, position.y * sc.y);
vLit = aLit;
vSeed = aSeed;
vHot = aHot;`);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>
uniform vec3 uWinDark;
uniform vec3 uWinLit;
uniform vec3 uWinHot;
varying vec2 vFacade;
varying float vLit;
varying float vSeed;
varying float vSide;
varying float vHot;`)
      .replace("#include <color_fragment>", `#include <color_fragment>
vec2 wg = vFacade / vec2(0.9, ${floor});
vec2 wid = floor(wg);
vec2 wfr = fract(wg);
float win = step(0.2, wfr.x) * step(wfr.x, 0.8) * step(0.24, wfr.y) * step(wfr.y, 0.78) * step(1.0, wid.y) * step(0.5, vSide);
float wrnd = fract(sin(dot(wid + vec2(vSeed * 91.7, vSeed * 37.3), vec2(12.9898, 78.233))) * 43758.5453);
float winOn = win * step(wrnd * 0.9 + 0.05, vLit);
diffuseColor.rgb = mix(diffuseColor.rgb, uWinDark, win * (1.0 - winOn));
diffuseColor.rgb *= 1.0 - winOn;`)
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
float wb = 0.55 + 0.45 * fract(wrnd * 7.13);
totalEmissiveRadiance += winOn * mix(uWinLit * wb, uWinHot, vHot);
totalEmissiveRadiance += vec3(0.12, 0.1, 0.05) * vLit * vSide;`);
  };
  mat.customProgramCacheKey = () => "volt-building";
  return mat;
}

export class CityMesh {
  group = new Group();
  #owned = [];
  city = null;
  hot = null;

  constructor(scene) {
    scene.add(this.group);
    this.glowTex = glowTexture();
  }

  #own(r) { this.#owned.push(r); return r; }

  clear() {
    for (const r of this.#owned) r.dispose?.();
    this.#owned = [];
    this.group.clear();
    this.city = null;
  }

  build(city, seed) {
    this.clear();
    this.city = city;
    const n = city.buildings.length;
    const rng = createRng(`${seed}:look`);
    const size = Math.max(city.width, city.depth);

    // Ground and block pads.
    const ground = new Mesh(this.#own(new PlaneGeometry(size * 6, size * 6)), this.#own(new MeshLambertMaterial({ color: LOOK.street })));
    ground.rotation.x = -Math.PI / 2;
    ground.name = "ground";
    this.group.add(ground);
    const pads = new InstancedMesh(this.#own(new BoxGeometry(1, 1, 1)), this.#own(new MeshLambertMaterial({ color: 0xffffff })), city.districts.length);
    pads.name = "blocks";
    city.districts.forEach((d, i) => {
      pads.setMatrixAt(i, _m.compose(_p.set(d.x, 0.06, d.z), ID, _s.set(d.w + 1.1, 0.12, d.d + 1.1)));
      pads.setColorAt(i, _c.set(LOOK.block));
    });
    this.pads = this.#own(pads);
    this.group.add(pads);

    // Buildings.
    const geo = this.#own(new BoxGeometry(1, 1, 1));
    geo.translate(0, 0.5, 0);
    this.aLit = new InstancedBufferAttribute(new Float32Array(n), 1);
    this.aLit.setUsage(DynamicDrawUsage);
    this.aHot = new InstancedBufferAttribute(new Float32Array(n), 1);
    this.aHot.setUsage(DynamicDrawUsage);
    const seeds = new Float32Array(n);
    geo.setAttribute("aLit", this.aLit);
    geo.setAttribute("aHot", this.aHot);
    geo.setAttribute("aSeed", new InstancedBufferAttribute(seeds, 1));
    const bm = new InstancedMesh(geo, this.#own(buildingMaterial()), n);
    bm.name = "buildings";
    const base = new Color(LOOK.building);
    for (const b of city.buildings) {
      bm.setMatrixAt(b.id, _m.compose(_p.set(b.x, 0.12, b.z), ID, _s.set(b.w, b.h, b.d)));
      bm.setColorAt(b.id, _c.copy(base).multiplyScalar(1 + (rng.next() - 0.5) * 2 * LOOK.buildingVar));
      seeds[b.id] = b.seed;
    }
    this.buildings = this.#own(bm);
    this.group.add(bm);

    // Antennas + tips (aviation light before power, bright once lit, gold rods).
    const ag = this.#own(new CylinderGeometry(0.045, 0.09, 1, 5));
    ag.translate(0, 0.5, 0);
    const am = new InstancedMesh(ag, this.#own(new MeshLambertMaterial({ color: LOOK.antenna })), n);
    am.name = "antennas";
    const tg = this.#own(new OctahedronGeometry(0.2, 0));
    const tm = new InstancedMesh(tg, this.#own(new MeshBasicMaterial({ color: 0xffffff })), n);
    tm.name = "antenna-tips";
    tm.instanceMatrix.setUsage(DynamicDrawUsage);
    for (const b of city.buildings) {
      am.setMatrixAt(b.id, _m.compose(_p.set(b.x, b.h + 0.12, b.z), ID, _s.set(b.gold ? 1.6 : 1, VOLT.city.antenna, b.gold ? 1.6 : 1)));
      tm.setMatrixAt(b.id, _m.compose(_p.set(b.x, b.tipY + 0.12, b.z), ID, _s.setScalar(b.gold ? 1.8 : 1)));
      tm.setColorAt(b.id, _c.set(b.gold ? LOOK.gold : LOOK.tipDark));
    }
    this.antennas = this.#own(am);
    this.tips = this.#own(tm);
    this.tips.instanceColor.setUsage(DynamicDrawUsage);
    this.group.add(am, tm);

    // Tip glows (billboards, additive): lit tips and gold rods.
    const glow = new InstancedMesh(this.#own(new PlaneGeometry(1, 1)), this.#own(new MeshBasicMaterial({ map: this.glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending })), n);
    glow.name = "tip-glows";
    glow.frustumCulled = false;
    glow.instanceMatrix.setUsage(DynamicDrawUsage);
    glow.setColorAt(0, _c.set(0xffffff));
    glow.instanceColor.setUsage(DynamicDrawUsage);
    glow.count = 0;
    this.glows = this.#own(glow);
    this.group.add(glow);

    // The storm front: dark puffs along the far edge, high up; they flicker while charging.
    const puffs = 26;
    const cloudMat = this.#own(new MeshLambertMaterial({ color: LOOK.cloud, emissive: LOOK.cloudGlow, emissiveIntensity: 0, flatShading: true }));
    const cloud = new InstancedMesh(this.#own(new IcosahedronGeometry(1, 1)), cloudMat, puffs);
    cloud.name = "storm-cloud";
    const top = Math.max(...city.buildings.map((b) => b.tipY));
    this.cloudY = top + 16;
    for (let i = 0; i < puffs; i++) {
      const x = (i / (puffs - 1) - 0.5) * (city.width + 30) + rng.range(-3, 3);
      const z = -city.depth / 2 - rng.range(8, 22);
      const s = rng.range(5, 10);
      cloud.setMatrixAt(i, _m.compose(_p.set(x, this.cloudY + rng.range(-3, 5), z), _q.setFromEuler(_e.set(rng.range(0, 3), rng.range(0, 3), 0)), _s.set(s * 1.4, s * 0.55, s)));
    }
    this.cloudMat = cloudMat;
    this.cloud = this.#own(cloud);
    this.group.add(cloud);
    this.hot = new Float32Array(n);
  }

  /** Where a strike comes from: high above and behind the target, out of the storm front. */
  strikeOrigin(b, out) {
    out.x = b.x * 0.7;
    out.y = this.cloudY + 4;
    out.z = -this.city.depth / 2 - 12;
    return out;
  }

  /**
   * Per frame: windows from the simulation's litAt (window by window over ~0.6 s, a hot flash
   * first), tip colours, glows.
   * @param {object} sim  @param {number} time real seconds  @param {Quaternion} camQ camera quaternion
   */
  update(sim, time, camQ, charge = 0, holding = false) {
    if (!this.city) return;
    const bs = this.city.buildings;
    const litA = this.aLit.array, hotA = this.aHot.array;
    let g = 0;
    const blink = Math.sin(time * 3.2) > 0.2;
    for (let i = 0; i < bs.length; i++) {
      const b = bs[i];
      const at = sim.litAt[i];
      let k = 0, hot = 0;
      if (at >= 0) {
        const age = sim.t - at;
        k = Math.min(1, Math.max(0.12, age / 0.6));
        hot = Math.max(0, 1 - age / 0.35);
      }
      litA[i] = k;
      hotA[i] = hot;
      if (at >= 0) this.tips.setColorAt(i, _c.set(b.gold ? LOOK.gold : LOOK.tipLit).multiplyScalar(1 + hot));
      else this.tips.setColorAt(i, b.gold ? _c.set(LOOK.gold) : _c.set(LOOK.tipDark).multiplyScalar(blink ? 1 : 0.25));
      // glows: lit tips (small, cyan), gold rods (big, pulsing, lit or not)
      if (at >= 0 || b.gold) {
        const size = b.gold ? 2.6 + Math.sin(time * 4 + i) * 0.4 : 1.1 + hot * 2.2;
        this.glows.setMatrixAt(g, _m.compose(_p.set(b.x, b.tipY + 0.12, b.z), camQ, _s.set(size, size, 1)));
        this.glows.setColorAt(g, _c.set(b.gold ? LOOK.gold : LOOK.tipLit).multiplyScalar(b.gold ? 0.9 : 0.35 + hot * 0.65));
        g++;
      }
    }
    this.glows.count = g;
    this.glows.instanceMatrix.needsUpdate = true;
    this.glows.instanceColor.needsUpdate = true;
    this.tips.instanceColor.needsUpdate = true;
    this.aLit.needsUpdate = true;
    this.aHot.needsUpdate = true;
    // Powered blocks: the pad brightens a little.
    for (let d = 0; d < this.city.districts.length; d++) {
      this.pads.setColorAt(d, _c.set(LOOK.block).multiplyScalar(sim.districtDone[d] ? 1.9 : 1));
    }
    this.pads.instanceColor.needsUpdate = true;
    // Storm front flickers while the strike charges.
    const flick = holding ? Math.min(1, charge) * (0.55 + 0.45 * Math.sin(time * 37) * Math.sin(time * 23)) : 0;
    this.cloudMat.emissiveIntensity = Math.max(0, flick) * 1.4;
  }

  dispose() { this.clear(); this.glowTex.dispose(); }
}

