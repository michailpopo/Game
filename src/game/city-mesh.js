/**
 * The 3D city, deliberately plain (planner, 2026-09-26: the feel artist restyles it in WP-21/31):
 * ground, district pads, one instanced box per building whose colour is its lit state (dark -> a
 * short white-hot flash -> the theme's lit colour), rooftop antennas with tip lights (the hop points),
 * a few glows for gold rods and fresh hits, and the storm front. Built once per city (disposed on
 * rebuild); per frame only instance colours and the glow list are written. Units: metres.
 * Everything it draws comes from the simulation's view API (src/game/sim.js header).
 */

import {
  AdditiveBlending, BoxGeometry, CanvasTexture, Color, CylinderGeometry, DynamicDrawUsage, Euler, Group,
  IcosahedronGeometry, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial,
  OctahedronGeometry, PlaneGeometry, Quaternion, SRGBColorSpace, Vector3,
} from "three";
import { STORM } from "../config.js";
import { createRng } from "../core/rng.js";
import { LOOK, themeOf } from "./look.js";

const _m = new Matrix4();
const _p = new Vector3();
const _q = new Quaternion();
const _s = new Vector3();
const _e = new Euler();
const _c = new Color();
const ID = new Quaternion();
const FILL_SEC = 0.3;           // dark -> lit colour (GAME_BRIEF: a building lights in ~0.3 s)
const HOT_SEC = 0.3;            // the white-hot flash of a freshly lit building
const _dark = new Color();
const _lit = new Color();
const _hot = new Color();

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

export class CityMesh {
  group = new Group();
  #owned = [];
  city = null;

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
    const theme = themeOf(city);
    this.theme = theme;
    this.litColor = new Color(theme.window).multiplyScalar(LOOK.litBoost);
    const n = city.buildings.length;
    const rng = createRng(`${seed}:look:${city.level}`);
    const size = Math.max(city.width, city.depth);

    // Ground and district pads (sidewalks).
    const ground = new Mesh(this.#own(new PlaneGeometry(size * 8, size * 8)), this.#own(new MeshLambertMaterial({ color: LOOK.street })));
    ground.rotation.x = -Math.PI / 2;
    ground.name = "ground";
    this.group.add(ground);
    const pads = new InstancedMesh(this.#own(new BoxGeometry(1, 1, 1)), this.#own(new MeshLambertMaterial({ color: 0xffffff })), city.districts.length);
    pads.name = "districts";
    city.districts.forEach((d, i) => {
      pads.setMatrixAt(i, _m.compose(_p.set(d.x, 0.1, d.z), ID, _s.set(d.w + 1.6, 0.2, d.d + 1.6)));
      pads.setColorAt(i, _c.set(LOOK.block));
    });
    this.pads = this.#own(pads);
    this.group.add(pads);

    // Buildings: plain boxes; the instance colour is the lit state (update()).
    const geo = this.#own(new BoxGeometry(1, 1, 1));
    geo.translate(0, 0.5, 0);
    const bm = new InstancedMesh(geo, this.#own(new MeshLambertMaterial({ color: 0xffffff })), n);
    bm.name = "buildings";
    this.shade = new Float32Array(n);   // per-building brightness variation (dark and lit alike)
    for (const b of city.buildings) {
      bm.setMatrixAt(b.id, _m.compose(_p.set(b.x, 0.2, b.z), ID, _s.set(b.w, b.h, b.d)));
      this.shade[b.id] = 1 + (rng.next() - 0.5) * 2 * LOOK.buildingVar;
      bm.setColorAt(b.id, _c.set(LOOK.building).multiplyScalar(this.shade[b.id]));
    }
    bm.instanceColor.setUsage(DynamicDrawUsage);
    this.buildings = this.#own(bm);
    this.group.add(bm);

    // Antennas (6 segments) + tips (aviation light before power, bright once lit, gold rods).
    const mast = STORM.city.antenna;
    const ag = this.#own(new CylinderGeometry(0.1, 0.24, 1, 6));
    ag.translate(0, 0.5, 0);
    const am = new InstancedMesh(ag, this.#own(new MeshLambertMaterial({ color: 0xffffff })), n);
    am.name = "antennas";
    const tg = this.#own(new OctahedronGeometry(0.42, 0));
    const tm = new InstancedMesh(tg, this.#own(new MeshBasicMaterial({ color: 0xffffff })), n);
    tm.name = "antenna-tips";
    for (const b of city.buildings) {
      am.setMatrixAt(b.id, _m.compose(_p.set(b.x, b.h + 0.2, b.z), ID, _s.set(b.gold ? 1.8 : 1, mast, b.gold ? 1.8 : 1)));
      am.setColorAt(b.id, _c.set(b.gold ? LOOK.gold : LOOK.antenna));
      tm.setMatrixAt(b.id, _m.compose(_p.set(b.x, b.tipY + 0.2, b.z), ID, _s.setScalar(b.gold ? 1.9 : 1)));
      tm.setColorAt(b.id, _c.set(b.gold ? LOOK.gold : LOOK.tipDark));
    }
    this.antennas = this.#own(am);
    this.tips = this.#own(tm);
    this.tips.instanceColor.setUsage(DynamicDrawUsage);
    this.group.add(am, tm);

    // Glows (billboards, additive): gold rods and freshly hit tips.
    const glow = new InstancedMesh(this.#own(new PlaneGeometry(1, 1)), this.#own(new MeshBasicMaterial({ map: this.glowTex, transparent: true, depthWrite: false, blending: AdditiveBlending })), n);
    glow.name = "glows";
    glow.frustumCulled = false;
    glow.instanceMatrix.setUsage(DynamicDrawUsage);
    glow.setColorAt(0, _c.set(0xffffff));
    glow.instanceColor.setUsage(DynamicDrawUsage);
    glow.count = 0;
    this.glows = this.#own(glow);
    this.group.add(glow);

    // The storm front: dark puffs along the far edge, high up; they flicker while charging.
    const puffs = 28;
    const cloudMat = this.#own(new MeshLambertMaterial({ color: LOOK.cloud, emissive: LOOK.cloudGlow, emissiveIntensity: 0 }));
    const cloud = new InstancedMesh(this.#own(new IcosahedronGeometry(1, 2)), cloudMat, puffs);
    cloud.name = "storm-cloud";
    let top = 0;
    for (const b of city.buildings) top = Math.max(top, b.tipY);
    this.top = top;
    this.cloudY = top + 55;
    const span = city.width * 1.6 + 160;
    for (let i = 0; i < puffs; i++) {
      const x = (i / (puffs - 1) - 0.5) * span + rng.range(-10, 10);
      const z = -city.depth / 2 - rng.range(70, 150);
      const s = rng.range(22, 40);
      cloud.setMatrixAt(i, _m.compose(_p.set(x, this.cloudY + rng.range(-10, 18), z), _q.setFromEuler(_e.set(rng.range(0, 3), rng.range(0, 3), 0)), _s.set(s * 1.5, s * 0.45, s)));
    }
    this.cloudMat = cloudMat;
    this.cloud = this.#own(cloud);
    this.group.add(cloud);
  }

  /** Where a strike comes from: high above and behind the target, out of the storm front. */
  strikeOrigin(b, out) {
    out.x = b.x * 0.6;
    out.y = this.cloudY;
    out.z = -this.city.depth / 2 - 70;
    return out;
  }

  /**
   * Per frame, from the simulation's litAt: each building's colour (dark -> white-hot flash -> lit over
   * FILL_SEC), tip colours, glows (gold rods, fresh hits), powered district pads, the cloud flicker.
   * @param {object} sim  @param {number} time real seconds  @param {Quaternion} camQ camera quaternion
   */
  update(sim, time, camQ, charge = 0, holding = false) {
    if (!this.city) return;
    const bs = this.city.buildings;
    _dark.set(LOOK.building);
    _lit.copy(this.litColor);
    _hot.set(LOOK.hotFlash);
    let g = 0;
    const blink = Math.sin(time * 3.2) > 0.2;
    for (let i = 0; i < bs.length; i++) {
      const b = bs[i];
      const at = sim.litAt[i];
      let k = 0, hot = 0;
      if (at >= 0) {
        const age = Math.max(0, sim.t - at);
        k = Math.min(1, age / FILL_SEC);
        hot = Math.max(0, 1 - age / HOT_SEC);
      }
      _c.copy(_dark).lerp(_lit, k).lerp(_hot, hot * 0.7).multiplyScalar(this.shade[i]);
      this.buildings.setColorAt(i, _c);
      if (at >= 0) this.tips.setColorAt(i, _c.set(b.gold ? LOOK.gold : LOOK.tipLit).multiplyScalar(1 + hot));
      else this.tips.setColorAt(i, b.gold ? _c.set(LOOK.gold) : _c.set(LOOK.tipDark).multiplyScalar(blink ? 1 : 0.25));
      if (b.gold || hot > 0) {
        const size = b.gold ? 6.5 + Math.sin(time * 4 + i) * 1 : 2.6 + hot * 6;
        this.glows.setMatrixAt(g, _m.compose(_p.set(b.x, b.tipY + 0.2, b.z), camQ, _s.set(size, size, 1)));
        this.glows.setColorAt(g, _c.set(b.gold ? LOOK.gold : LOOK.tipLit).multiplyScalar(b.gold ? 0.9 : hot));
        g++;
      }
    }
    for (let d = 0; d < this.city.districts.length; d++) this.pads.setColorAt(d, _c.set(sim.districtDone[d] ? LOOK.blockLit : LOOK.block));
    this.glows.count = g;
    this.glows.instanceMatrix.needsUpdate = true;
    this.glows.instanceColor.needsUpdate = true;
    this.buildings.instanceColor.needsUpdate = true;
    this.tips.instanceColor.needsUpdate = true;
    this.pads.instanceColor.needsUpdate = true;
    // Storm front flickers while the strike charges.
    const flick = holding ? Math.min(1, charge) * (0.55 + 0.45 * Math.sin(time * 37) * Math.sin(time * 23)) : 0;
    this.cloudMat.emissiveIntensity = 0.12 + Math.max(0, flick) * 0.7;
  }

  dispose() { this.clear(); this.glowTex.dispose(); }
}
