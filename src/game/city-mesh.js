/**
 * The 3D toy city (WP-31, look from docs/QA_REPORT.md "WP-21 notes"), built from the simulation's view API
 * (src/game/sim.js header) - the sim stays the source of truth for every position and every hop point.
 *
 * Per sim building one of the six toy types, built to its footprint and height:
 *   house (lowest, pyramid roof) · flat (rim cap) · box (rim cap + roof box) · dome · spire · stepped (setback)
 * Every part is instanced (bodies 1 + trims 1 + domes 1 + spires 1 + pyramids 1 + poles 1 + tips 1 draw calls);
 * the rod tip ball sits exactly on the sim's tipY (roof + 3 m), so the bolt lands on it.
 * Lit state (from sim.litAt): the building floods with its candy colour from the ground up over FILL_SEC with a
 * glowing fill line, a white flash on the hit; its roof, cap and rod ball light when the flood reaches the top.
 * BLOCK POWERED: the district pad turns warm in a wave from its centre and its buildings pulse in order.
 * FULL POWER: sweep() ripples a flash across the whole city.
 * Ground: the city's island (grass top, earth edge, sand beach, shallow lagoon, open sea, islets on the horizon;
 * colours per theme in look.js SHORES), the asphalt plate, rounded district pads, lane dashes, park trees in
 * empty lots, trees on the island rim (no shadows), a few toy cars; the storm front is a row of slate puffs.
 * Built once per city (disposed on rebuild); per frame only the instance attributes that changed are uploaded.
 */

import {
  Color, ConeGeometry, CylinderGeometry, DynamicDrawUsage, ExtrudeGeometry, Group, IcosahedronGeometry, InstancedBufferAttribute,
  OctahedronGeometry, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, PlaneGeometry, Quaternion, Shape, SphereGeometry, Vector3,
} from "three";
import { STORM } from "../config.js";
import { createRng } from "../core/rng.js";
import { chamferPrismGeometry, propGeometries, toyBlockMaterial, toyTrimMaterial } from "../render/city-kit.js";
import { enhance } from "../render/materials.js";
import { LOOK, shoreOf } from "./look.js";

const _m = new Matrix4();
const _p = new Vector3();
const _q = new Quaternion();
const _s = new Vector3();
const _c = new Color();
const _c2 = new Color();
const _up = new Vector3(0, 1, 0);
const ID = new Quaternion();
const BASE = 0.35;              // pad top: buildings stand on their district pad
const ISLAND_RIM = 14;          // m of grass between the asphalt plate and the beach
const SHORE_LIFT = 0.28;        // emissive share of the island/sea colours: they stay bright under the dusk light

/** Emissive tinted by the per-instance / vertex colour (emissive white x lift would wash everything to white). */
function enhanceTint(mat) {
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
  totalEmissiveRadiance *= vColor.rgb;
#endif`);
  };
  mat.customProgramCacheKey = () => "storm-tint-emissive";
}

/** Surroundings material: its own colour as a soft emissive lift, so the dusk rig cannot grey it out. */
const shoreMat = (color, o = {}) => new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: SHORE_LIFT, roughness: 0.9, ...o });

/** A rounded-rectangle slab, top face at y = 0, `h` deep, bevelled edge; caps = group 0, sides + bevel = group 1. */
function roundedSlabGeometry(w, d, r, h, bevel) {
  const s = new Shape(), x = -w / 2, y = -d / 2;
  r = Math.min(r, w / 2 - 0.01, d / 2 - 0.01);
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new ExtrudeGeometry(s, { depth: h, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 6 });
  g.rotateX(Math.PI / 2);            // shape XY -> world XZ, extrusion goes down
  g.translate(0, -bevel, 0);         // top face at y = 0
  return g;
}
const FILL_SEC = 0.45;          // dark -> lit, flooding from the ground up
const HOT_SEC = 0.22;           // the white flash of a hit
const CAP = 0.55;               // roof rim cap height (m)
const MAX_W = 7.6;              // widest visual footprint (lots are 9 m apart, +-1.2 m jitter)

export class CityMesh {
  group = new Group();
  city = null;
  top = 0;
  cloudY = 0;
  #owned = [];
  #scene;
  #wave = [];                   // per district: start time of its BLOCK POWERED wave (-1 = none)
  #sweepAt = -1;                // FULL POWER sweep start (view time)
  #pulse;                       // per building: extra flash 0..1 (district wave, sweep)
  #lastLit;                     // per building: litAt seen last frame (-2 = unknown)
  #settled;                     // per building: nothing left to animate

  constructor(scene) {
    this.#scene = scene;
    scene.add(this.group);
  }

  #own(r) { this.#owned.push(r); return r; }

  clear() {
    for (const r of this.#owned) r.dispose?.();
    this.#owned = [];
    this.group.clear();
    this.city = null;
  }

  /**
   * @param {object} city  sim.city   @param {string} seed   @param {object} theme  look.js THEMES entry
   * @param {import("../fx/fx-kit.js").FxKit} [fx]  for the gold-rod glows (persistent sprites)
   */
  build(city, seed, theme, fx) {
    this.clear();
    this.city = city;
    this.theme = theme;
    const W = theme.world;
    const bs = city.buildings, n = bs.length;
    const rng = createRng(`${seed}:look:${city.level}`);
    const plan = city.plan;
    const hMin = STORM.city.heightMin, hMax = Math.max(hMin + 1, plan?.heightMax ?? hMin + 12);
    this.#pulse = new Float32Array(n);
    this.#lastLit = new Float32Array(n).fill(-2);
    this.#settled = new Uint8Array(n);
    this.#wave = city.districts.map(() => -1);
    this.#sweepAt = -1;
    this.litColor = [];
    this.kind = [];

    // ---------------------------------------------------------------- building parts
    const segs = [], trims = [], domes = [], spires = [], pyramids = [], rods = [];
    this.parts = bs.map(() => ({ segs: [], trims: [], roof: -1, roofKind: "", pole: -1, tip: -1 }));
    for (const b of bs) {
      const rel = Math.min(1, Math.max(0, (b.h - hMin) / (hMax - hMin)));
      const r2 = (b.seed * 7.13) % 1, r3 = (b.seed * 13.7) % 1;
      let kind = b.roof === "spire" ? "spire" : b.roof === "stepped" ? "stepped" : "flat";
      if (kind === "flat") kind = rel < 0.2 && r2 < 0.65 ? "house" : rel > 0.5 && r2 > 0.55 ? "dome" : r2 < 0.3 ? "box" : "flat";
      this.kind[b.id] = kind;
      this.litColor[b.id] = new Color(theme.lit[Math.floor(r3 * theme.lit.length) % theme.lit.length]);
      const vw = Math.min(MAX_W, b.w * 1.1), vd = Math.min(MAX_W, b.d * 1.1);
      const H = b.h - BASE;                      // body height above the pad (roof at the sim's h)
      const style = r2 > 0.5 ? 1 : 0;
      const P = this.parts[b.id];
      let roofTop;
      if (kind === "stepped") {
        const h1 = Math.round(H * 0.7), uw = vw * 0.64, ud = vd * 0.64;
        P.segs.push(segs.length); segs.push([b.x, BASE, b.z, vw, h1, vd, 0, style, b.id]);
        P.trims.push(trims.length); trims.push([b.x, BASE + h1, b.z, vw + 0.5, 0.4, vd + 0.5, b.id]);
        P.segs.push(segs.length); segs.push([b.x, BASE + h1, b.z, uw, H - h1, ud, h1, style, b.id]);
        P.trims.push(trims.length); trims.push([b.x, b.h, b.z, uw + 0.6, CAP, ud + 0.6, b.id]);
        roofTop = b.h + CAP;
      } else {
        P.segs.push(segs.length); segs.push([b.x, BASE, b.z, vw, H, vd, 0, style, b.id]);
        if (kind === "house") {
          P.roof = pyramids.length; P.roofKind = "pyramid";
          const rr = Math.min(vw, vd) * 0.74, rh = Math.min(2.4, rr * 0.8);
          pyramids.push([b.x, b.h, b.z, rr, rh, b.id]);
          roofTop = b.h + rh;
        } else {
          P.trims.push(trims.length); trims.push([b.x, b.h, b.z, vw + 0.7, CAP, vd + 0.7, b.id]);
          roofTop = b.h + CAP;
          if (kind === "dome") {
            const r = Math.min(1.9, Math.min(vw, vd) * 0.36);
            P.roof = domes.length; P.roofKind = "dome"; domes.push([b.x, roofTop, b.z, r, b.id]);
            roofTop += r;
          } else if (kind === "spire") {
            const r = Math.min(vw, vd) * 0.3;
            P.roof = spires.length; P.roofKind = "spire"; spires.push([b.x, roofTop, b.z, r, 2.1, b.id]);
            roofTop += 2.1;
          } else if (kind === "box") {
            P.trims.push(trims.length);
            trims.push([b.x + vw * 0.18 * (r3 < 0.5 ? 1 : -1), roofTop, b.z - vd * 0.15, vw * 0.34, 1.1, vd * 0.3, b.id]);
          }
        }
      }
      P.pole = rods.length;
      rods.push([b.x, Math.min(roofTop, b.tipY - 0.4), b.z, b.tipY, b.gold, b.id]);
    }

    // bodies (the toy block material: flood fill + window bands)
    const bodyGeo = this.#own(chamferPrismGeometry(0.1));
    const aState = new InstancedBufferAttribute(new Float32Array(segs.length * 4), 4).setUsage(DynamicDrawUsage);
    const aLitC = new InstancedBufferAttribute(new Float32Array(segs.length * 3), 3);
    bodyGeo.setAttribute("aState", aState);
    bodyGeo.setAttribute("aLitColor", aLitC);
    const bodyMat = this.#own(toyBlockMaterial({ unlit: W.unlit, unlitWindow: W.unlitWin, unlitTop: W.trim }));
    // Shadow casters: bodies always; caps, roofs, trees and cars only while the city is small, so a shadow-map
    // refresh frame stays inside profile M (60k triangles) even at 300 buildings.
    const small = n <= 120;
    const bodies = new InstancedMesh(bodyGeo, bodyMat, segs.length);
    bodies.name = "buildings";
    bodies.castShadow = true;
    bodies.receiveShadow = true;
    segs.forEach(([x, y, z, w, h, d, base, style, id], i) => {
      bodies.setMatrixAt(i, _m.compose(_p.set(x, y, z), ID, _s.set(w, h, d)));
      aState.array.set([0, base, 0, style], i * 4);
      const c = this.litColor[id];
      aLitC.array.set([c.r, c.g, c.b], i * 3);
    });
    bodies.computeBoundingSphere();
    this.bodies = bodies; this.aState = aState; this.segs = segs;
    this.group.add(bodies);

    // trims: roof caps, setback ledges, roof boxes
    const trimMat = this.#own(toyTrimMaterial());
    const trimMesh = new InstancedMesh(this.#own(chamferPrismGeometry(0.14)), trimMat, Math.max(1, trims.length));
    trimMesh.name = "roof-caps";
    trimMesh.castShadow = small;
    trimMesh.receiveShadow = true;
    trims.forEach(([x, y, z, w, h, d], i) => { trimMesh.setMatrixAt(i, _m.compose(_p.set(x, y, z), ID, _s.set(w, h, d))); trimMesh.setColorAt(i, _c.set(W.trim)); });
    trimMesh.count = trims.length;
    if (trimMesh.instanceColor) trimMesh.instanceColor.setUsage(DynamicDrawUsage);
    this.trims = trimMesh;
    this.group.add(trimMesh);

    // roofs
    const roofMesh = (geo, list, name, place) => {
      const mesh = new InstancedMesh(this.#own(geo), trimMat, Math.max(1, list.length));
      mesh.name = name;
      mesh.castShadow = small;
      list.forEach((r, i) => { place(r); mesh.setMatrixAt(i, _m); mesh.setColorAt(i, _c.set(W.trim)); });
      mesh.count = list.length;
      if (mesh.instanceColor) mesh.instanceColor.setUsage(DynamicDrawUsage);
      this.group.add(mesh);
      return mesh;
    };
    this.domes = roofMesh(new SphereGeometry(1, 10, 4, 0, Math.PI * 2, 0, Math.PI / 2), domes, "roof-domes",
      ([x, y, z, r]) => _m.compose(_p.set(x, y, z), ID, _s.set(r, r * 0.95, r)));
    this.spires = roofMesh(new ConeGeometry(1, 1, 8, 1).translate(0, 0.5, 0), spires, "roof-spires",
      ([x, y, z, r, h]) => _m.compose(_p.set(x, y, z), ID, _s.set(r, h, r)));
    this.pyramids = roofMesh(new ConeGeometry(1, 1, 4, 1).rotateY(Math.PI / 4).translate(0, 0.5, 0), pyramids, "roof-pyramids",
      ([x, y, z, r, h]) => _m.compose(_p.set(x, y, z), ID, _s.set(r, h, r)));

    // lightning rods: pole + tip ball on the sim's tipY; gold rods are gold and bigger
    const poleMesh = new InstancedMesh(this.#own(new CylinderGeometry(0.14, 0.2, 1, 4, 1, true).translate(0, 0.5, 0)), this.#own(toyTrimMaterial({ roughness: 0.4 })), n);
    poleMesh.name = "rods";
    const tipMesh = new InstancedMesh(this.#own(new OctahedronGeometry(0.62, 0)), this.#own(new MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, emissive: 0xffffff, emissiveIntensity: 0.15 })), n);
    tipMesh.name = "rod-tips";
    rods.forEach(([x, y0, z, tipY, gold], i) => {
      const k = gold ? 1.6 : 1;
      poleMesh.setMatrixAt(i, _m.compose(_p.set(x, y0, z), ID, _s.set(k, Math.max(0.3, tipY - y0), k)));
      poleMesh.setColorAt(i, _c.set(gold ? LOOK.gold : LOOK.pole));
      tipMesh.setMatrixAt(i, _m.compose(_p.set(x, tipY, z), ID, _s.setScalar(gold ? 1.5 : 1)));
      tipMesh.setColorAt(i, _c.set(gold ? LOOK.gold : LOOK.tipDark));
    });
    tipMesh.instanceColor.setUsage(DynamicDrawUsage);
    this.poles = poleMesh; this.tips = tipMesh;
    this.group.add(poleMesh, tipMesh);
    if (fx) for (const b of bs) if (b.gold) fx.sprites.glow(b.x, b.tipY, b.z, { color: LOOK.goldGlow, size: 3.2, life: Infinity, intensity: 1.6, pulse: 1.1 });

    // ---------------------------------------------------------------- ground
    const size = Math.max(city.width, city.depth);
    const avenue = plan?.avenue ?? 6;
    const sh = shoreOf(theme);
    const plateW = city.width + avenue * 2 + 6, plateD = city.depth + avenue * 2 + 6;
    const islW = plateW + 2 * ISLAND_RIM, islD = plateD + 2 * ISLAND_RIM;
    // island: grass top (caps) with an earth edge (sides + bevel); its top is the old field level
    const field = new Mesh(this.#own(roundedSlabGeometry(islW, islD, 12, 5, 0.9)),
      [this.#own(shoreMat(sh.ground)), this.#own(shoreMat(sh.earth))]);
    field.position.y = -0.05;
    field.receiveShadow = true;
    field.name = "island";
    const beach = new Mesh(this.#own(roundedSlabGeometry(islW + 9, islD + 9, 16, 3, 1.2)), this.#own(shoreMat(sh.sand)));
    beach.position.y = -1.0;
    beach.name = "beach";
    const lagoon = new Mesh(this.#own(roundedSlabGeometry(islW + 34, islD + 34, 30, 0.2, 0)), this.#own(shoreMat(sh.shallow, { roughness: 0.25, transparent: true, opacity: 0.85 })));
    lagoon.position.y = -1.42;
    const foam = new Mesh(this.#own(roundedSlabGeometry(islW + 12, islD + 12, 18, 0.2, 0)), this.#own(shoreMat("#ffffff", { roughness: 0.6, transparent: true, opacity: 0.85 })));
    foam.position.y = -1.34;
    foam.name = "surf";
    lagoon.name = "lagoon";
    this.lagoon = lagoon;
    const sea = new Mesh(this.#own(new PlaneGeometry(size * 14 + 600, size * 14 + 600)), this.#own(shoreMat(sh.sea, { roughness: 0.3, metalness: 0.05 })));
    sea.rotation.x = -Math.PI / 2;
    sea.position.y = -1.6;
    sea.name = "sea";
    // islets on the horizon (behind and beside the city, never between the camera and it)
    const isleRng = createRng(`${seed}:isles:${city.level}`), isles = [];
    const yawC = 35 * Math.PI / 180, cvx = Math.sin(yawC), cvz = Math.cos(yawC);
    for (let k = 0; k < 40 && isles.length < 7; k++) {
      const a = isleRng.range(0, Math.PI * 2), rr = Math.max(islW, islD) * isleRng.range(0.95, 1.9) + 30;
      const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
      if ((x * cvx + z * cvz) / rr > 0.2) continue;
      if (isles.some((o) => Math.hypot(o.x - x, o.z - z) < 40)) continue;
      isles.push({ x, z, r: isleRng.range(9, 20), h: isleRng.range(0.3, 0.55), rot: isleRng.range(0, 6.28) });
    }
    const isleMesh = new InstancedMesh(this.#own(new IcosahedronGeometry(1, 1)), this.#own(shoreMat(sh.islet, { flatShading: true })), Math.max(1, isles.length));
    isleMesh.name = "islets";
    isles.forEach((o, i) => isleMesh.setMatrixAt(i, _m.compose(_p.set(o.x, -1.6, o.z), _q.setFromAxisAngle(_up, o.rot), _s.set(o.r, o.r * o.h, o.r * 0.8))));
    isleMesh.count = isles.length;
    const isleSand = new InstancedMesh(this.#own(new CylinderGeometry(1, 1, 1, 14)), this.#own(shoreMat(sh.sand)), Math.max(1, isles.length));
    isleSand.name = "islet-beaches";
    isles.forEach((o, i) => isleSand.setMatrixAt(i, _m.compose(_p.set(o.x, -1.55, o.z), _q.setFromAxisAngle(_up, o.rot), _s.set(o.r * 1.25, 0.3, o.r))));
    isleSand.count = isles.length;
    this.group.add(sea, lagoon, foam, beach, isleMesh, isleSand);
    const plate = new Mesh(this.#own(chamferPrismGeometry(0.02)), this.#own(new MeshStandardMaterial({ color: W.asphalt, roughness: 0.9 })));
    plate.scale.set(plateW, 0.12, plateD);
    plate.position.y = -0.02;
    plate.receiveShadow = true;
    plate.name = "asphalt";
    const pads = new InstancedMesh(this.#own(chamferPrismGeometry(0.06)), this.#own(toyTrimMaterial({ roughness: 0.85 })), city.districts.length);
    pads.name = "districts";
    pads.receiveShadow = true;
    city.districts.forEach((d, i) => { pads.setMatrixAt(i, _m.compose(_p.set(d.x, 0.08, d.z), ID, _s.set(d.w + 1.6, BASE - 0.08, d.d + 1.6))); pads.setColorAt(i, _c.set(W.pad)); });
    pads.instanceColor.setUsage(DynamicDrawUsage);
    this.pads = pads;
    this.group.add(field, plate, pads);

    // lane dashes along the avenues between districts (centre lines, crossings skipped)
    const xs = [...new Set(city.districts.map((d) => Math.round(d.x * 10) / 10))].sort((a, b) => a - b);
    const zs = [...new Set(city.districts.map((d) => Math.round(d.z * 10) / 10))].sort((a, b) => a - b);
    const bw = city.districts[0]?.w ?? 27;
    const lines = (cs) => { const out = []; for (let i = 0; i < cs.length - 1; i++) out.push((cs[i] + cs[i + 1]) / 2); if (cs.length) { out.unshift(cs[0] - bw / 2 - avenue / 2 - 1.5); out.push(cs[cs.length - 1] + bw / 2 + avenue / 2 + 1.5); } return out; };
    const lx = lines(xs), lz = lines(zs), dashes = [];
    const onRoad = (v, cs) => cs.every((c) => Math.abs(v - c) > bw / 2 + 1.2);
    const span = size / 2 + avenue;
    for (const x of lx) for (let v = -span; v < span; v += 4.2) if (onRoad(v, zs)) dashes.push([x, v, 0]);
    for (const z of lz) for (let v = -span; v < span; v += 4.2) if (onRoad(v, xs)) dashes.push([v, z, 1]);
    const dash = new InstancedMesh(this.#own(new PlaneGeometry(1, 1).rotateX(-Math.PI / 2)), this.#own(new MeshStandardMaterial({ color: W.dash, roughness: 0.8 })), Math.max(1, dashes.length));
    dash.name = "lane-dashes";
    dash.receiveShadow = true;
    dashes.forEach(([x, z, alongX], i) => dash.setMatrixAt(i, _m.compose(_p.set(x, 0.06, z), ID, alongX ? _s.set(2.2, 1, 0.35) : _s.set(0.35, 1, 2.2))));
    dash.count = dashes.length;
    this.group.add(dash);

    // ---------------------------------------------------------------- props
    const geos = propGeometries();
    for (const g of Object.values(geos)) this.#own(g);
    const pitch = STORM.city.lotPitch;
    const trees = [], ring = [], cars = [];
    for (const d of city.districts) {
      const lots = Math.max(1, Math.round(d.w / pitch));
      for (let lzI = 0; lzI < lots; lzI++) for (let lxI = 0; lxI < lots; lxI++) {
        const x = d.x - d.w / 2 + (lxI + 0.5) * (d.w / lots), z = d.z - d.d / 2 + (lzI + 0.5) * (d.d / lots);
        if (bs.some((b) => Math.abs(b.x - x) < pitch * 0.55 && Math.abs(b.z - z) < pitch * 0.55)) continue;
        const k = 1 + Math.floor(rng.next() * 2);
        for (let t = 0; t < k && trees.length < 70; t++) trees.push({ kind: rng.next() < 0.6 ? "roundTree" : "coneTree", x: x + rng.range(-2, 2), z: z + rng.range(-2, 2), s: rng.range(1.7, 2.3), r: rng.range(0, 6.28) });
      }
    }
    // trees on the island rim: behind and beside the city (the camera side keeps only low, sparse ones)
    const yaw0 = 35 * Math.PI / 180, vx = Math.sin(yaw0), vz = Math.cos(yaw0);
    const ringMax = Math.min(96, Math.max(44, Math.round((islW + islD) / 4)));   // grows with the island's rim
    for (let k = 0; k < 400 && ring.length < ringMax; k++) {
      const x = rng.range(-islW / 2 + 3, islW / 2 - 3), z = rng.range(-islD / 2 + 3, islD / 2 - 3);
      if (Math.abs(x) < plateW / 2 + 2 && Math.abs(z) < plateD / 2 + 2) continue;   // on the grass, off the plate
      const front = (x * vx + z * vz) / Math.hypot(x, z) > 0.35;                     // between the camera and the city
      if (front && rng.next() < 0.75) continue;
      ring.push({ kind: rng.next() < 0.55 ? "roundTree" : "coneTree", x, z, s: front ? rng.range(1.3, 1.7) : rng.range(1.8, 2.8), r: rng.range(0, 6.28) });
    }
    for (let k = 0; k < Math.min(14, (lx.length + lz.length) * 2); k++) {
      const along = rng.next() < 0.5, list = along ? lx : lz;
      const c = list[Math.floor(rng.next() * list.length)] ?? 0, v = rng.range(-span * 0.9, span * 0.9), side = rng.next() < 0.5 ? -1 : 1;
      if (!onRoad(v, along ? zs : xs)) continue;
      cars.push(along ? { kind: "car", x: c + side * 1.6, z: v, s: 1.35, r: side > 0 ? 0 : Math.PI } : { kind: "car", x: v, z: c + side * 1.6, s: 1.35, r: side > 0 ? Math.PI / 2 : -Math.PI / 2 });
    }
    const propMesh = (list, kind, cast, name, y0 = 0, palette = W.trees, lift = 0) => {
      const items = list.filter((p) => p.kind === kind);
      if (!items.length) return;
      const mat = new MeshStandardMaterial({ vertexColors: true, roughness: kind === "car" ? 0.45 : 0.85 });
      if (lift) { mat.emissive.set("#ffffff"); mat.emissiveIntensity = lift; enhanceTint(mat); }
      const mesh = new InstancedMesh(geos[kind], this.#own(mat), items.length);
      mesh.name = name;
      mesh.castShadow = cast;
      mesh.receiveShadow = kind !== "car";
      items.forEach((p, i) => {
        mesh.setMatrixAt(i, _m.compose(_p.set(p.x, kind === "car" ? 0.1 : y0, p.z), _q.setFromAxisAngle(_up, p.r), _s.setScalar(p.s)));
        mesh.setColorAt(i, _c.set(kind === "car" ? ["#ff5a5f", "#ffd23f", "#4f8dff", "#ffffff", "#ff9f40"][i % 5] : palette[i % palette.length]));
      });
      this.group.add(mesh);
    };
    propMesh(trees, "roundTree", small, "park-trees", BASE, sh.trees, SHORE_LIFT);
    propMesh(trees, "coneTree", small, "park-pines", BASE, sh.trees, SHORE_LIFT);
    propMesh(ring, "roundTree", false, "ring-trees", 0, sh.trees, SHORE_LIFT);
    propMesh(ring, "coneTree", false, "ring-pines", 0, sh.trees, SHORE_LIFT);
    propMesh(cars, "car", false, "cars");

    // ---------------------------------------------------------------- storm front (behind the city, top of frame)
    let top = 0;
    for (const b of bs) top = Math.max(top, b.tipY);
    this.top = top;
    this.cloudY = top + 16;
    const yaw = 35 * Math.PI / 180, far = size * 0.5 + 14;
    const cx = -Math.sin(yaw) * far, cz = -Math.cos(yaw) * far;
    this.cloudCenter = new Vector3(cx, this.cloudY, cz);
    const cloudMat = this.#own(enhance(new MeshStandardMaterial({ color: LOOK.cloud, roughness: 1, emissive: LOOK.cloudGlow, emissiveIntensity: 0, envMapIntensity: 0.3 }),
      { rim: 0.4, rimPower: 2.4, rimColor: "#ffe0ec", rimTint: 0 }));
    const puffs = 14;
    const cloud = new InstancedMesh(this.#own(new SphereGeometry(1, 12, 8)), cloudMat, puffs);
    cloud.name = "storm-cloud";
    const across = Math.max(40, size * 1.1);
    for (let i = 0; i < puffs; i++) {
      const t = i / (puffs - 1) - 0.5;
      const s = rng.range(5.5, 9.5) * (1 - Math.abs(t) * 0.6) * Math.max(1, size / 60);
      const x = cx + Math.cos(yaw) * t * across + rng.range(-3, 3), z = cz - Math.sin(yaw) * t * across + rng.range(-3, 3);
      cloud.setMatrixAt(i, _m.compose(_p.set(x, this.cloudY + rng.range(-2, 5) + (1 - Math.abs(t) * 2) * 4, z), ID, _s.set(s * 1.25, s * 0.8, s)));
    }
    this.cloudMat = cloudMat;
    this.cloudGroup = new Group();
    this.cloudGroup.add(cloud);
    this.group.add(this.cloudGroup);
    this.cloudBase = this.cloudCenter.clone();
  }

  /** Keep the storm front behind the city as the camera orbits: rotate it by the view's yaw offset (radians). */
  setCloudYaw(delta) {
    if (!this.cloudGroup) return;
    this.cloudGroup.rotation.y = delta;
    this.cloudCenter.copy(this.cloudBase).applyAxisAngle(_up, delta);
  }

  /** Where a strike comes from: the storm front's underside, leaning toward the target. */
  strikeOrigin(b, out) {
    const c = this.cloudCenter;
    out.x = c.x + (b.x - c.x) * 0.18;
    out.y = this.cloudY - 5;
    out.z = c.z + (b.z - c.z) * 0.18;
    return out;
  }

  /** BLOCK POWERED: the district's pad warms up in a wave from its centre; its buildings pulse in order. */
  districtWave(d, time) { if (this.#wave[d] !== undefined) this.#wave[d] = time; }

  /** FULL POWER: a flash ripples across the whole city from its centre. */
  sweep(time) { this.#sweepAt = time; }

  /**
   * Per frame, from the simulation's litAt: the flood fill, flashes, roof/cap/tip colours, pads, cloud flicker.
   * @param {object} sim  @param {number} time view seconds (frozen with the effects)
   */
  update(sim, time, camQ, charge = 0, holding = false) {
    if (!this.city) return;
    const bs = this.city.buildings, W = this.theme.world, parts = this.parts;
    const A = this.aState.array;
    let bodiesDirty = false, colorsDirty = false;
    // district waves and the FULL POWER sweep feed a per-building pulse
    const pulse = this.#pulse;
    pulse.fill(0);
    let anyWave = false;
    for (let d = 0; d < this.#wave.length; d++) {
      const t0 = this.#wave[d];
      if (t0 < 0) continue;
      const dist = this.city.districts[d];
      const age = time - t0;
      if (age > 2) { this.#wave[d] = -2; continue; }
      anyWave = true;
      const k = Math.min(1, age / 0.6);
      this.pads.setColorAt(d, _c.set(W.pad).lerp(_c2.set(W.padLit), k));
      colorsDirty = true;
      for (const m of dist.members) {
        const b = bs[m];
        const r = Math.hypot(b.x - dist.x, b.z - dist.z) / (dist.w * 0.7);
        const x = age - r * 0.45;
        if (x > 0 && x < 0.35) pulse[m] = Math.max(pulse[m], 0.55 * (1 - x / 0.35));
      }
    }
    if (this.#sweepAt >= 0) {
      const age = time - this.#sweepAt, reach = Math.max(this.city.width, this.city.depth) * 0.75;
      if (age > 2.2) this.#sweepAt = -1;
      else {
        anyWave = true;
        for (const b of bs) {
          const x = age - (Math.hypot(b.x, b.z) / reach) * 1.2;
          if (x > 0 && x < 0.6) pulse[b.id] = Math.max(pulse[b.id], 0.9 * (1 - x / 0.6));
        }
      }
    }
    for (let i = 0; i < bs.length; i++) {
      const b = bs[i], at = sim.litAt[i];
      if (at !== this.#lastLit[i]) { this.#lastLit[i] = at; this.#settled[i] = 0; }
      if (this.#settled[i] && pulse[i] === 0) continue;
      let fill = 0, hot = 0;
      if (at >= 0) {
        const age = Math.max(0, sim.t - at);
        const k = Math.min(1, age / FILL_SEC);
        fill = 1 - (1 - k) * (1 - k);
        hot = Math.max(0, 1 - age / HOT_SEC);
        if (k >= 1 && hot === 0 && pulse[i] === 0) this.#settled[i] = 1;
      } else if (pulse[i] === 0) this.#settled[i] = 1;
      const flash = Math.min(1, hot * 0.6 + pulse[i] * 0.8);
      const P = parts[i];
      const fillH = fill * (b.h - BASE + 0.8);
      for (const s of P.segs) { A[s * 4] = fillH; A[s * 4 + 2] = flash; }
      bodiesDirty = true;
      // roof, caps and the rod ball light when the flood reaches the top
      const top = Math.max(0, Math.min(1, (fill - 0.8) / 0.2));
      const lc = this.litColor[i];
      _c.set(W.trim).lerp(_c2.copy(lc).lerp(WHITE, 0.4), top).lerp(WHITE, flash * 0.6);
      for (const t of P.trims) this.trims.setColorAt(t, _c);
      if (P.roof >= 0) {
        const mesh = P.roofKind === "dome" ? this.domes : P.roofKind === "spire" ? this.spires : this.pyramids;
        _c.set(W.trim).lerp(lc, top).lerp(WHITE, flash * 0.6);
        mesh.setColorAt(P.roof, _c);
        mesh.instanceColor.needsUpdate = true;
      }
      if (!b.gold) this.tips.setColorAt(P.pole, _c.set(at >= 0 ? LOOK.tipLit : LOOK.tipDark).lerp(WHITE, flash));
      colorsDirty = true;
    }
    if (bodiesDirty) this.aState.needsUpdate = true;
    if (colorsDirty) {
      if (this.trims.instanceColor) this.trims.instanceColor.needsUpdate = true;
      this.tips.instanceColor.needsUpdate = true;
      this.pads.instanceColor.needsUpdate = true;
    }
    if (!anyWave) for (let d = 0; d < this.#wave.length; d++) if (sim.districtDone[d] && this.#wave[d] === -1) { this.pads.setColorAt(d, _c.set(W.padLit)); this.pads.instanceColor.needsUpdate = true; this.#wave[d] = -2; }
    // the storm front flickers while the strike charges
    const flick = holding ? Math.min(1, charge) * (0.55 + 0.45 * Math.sin(time * 37) * Math.sin(time * 23)) : 0;
    this.cloudMat.emissiveIntensity = Math.max(0, flick) * 0.3;
  }

  dispose() { this.clear(); }
}

const WHITE = new Color(1, 1, 1);
