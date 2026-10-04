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
 * Water themes (look.js world.water): the field is sea, the city stands on islands (islands.js), trees only on land.
 * Ground: a calm field to the horizon, the asphalt plate, rounded district pads, lane dashes; parks in the empty lots,
 * lamps, walking people and driving cars (city-life.js); the world around it per theme (scenery.js, no shadows); the storm front is a toy thunderhead behind the city (storm-cloud.js).
 * Built once per city (disposed on rebuild); per frame only the instance attributes that changed are uploaded.
 */

import {
  Color, ConeGeometry, CylinderGeometry, DynamicDrawUsage, Group, InstancedBufferAttribute, OctahedronGeometry,
  InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, PlaneGeometry, Quaternion, SphereGeometry, Vector3,
} from "three";
import { STORM } from "../config.js";
import { createRng } from "../core/rng.js";
import { chamferPrismGeometry, propGeometries, toyBlockMaterial, toyTrimMaterial } from "../render/city-kit.js";
import { LOOK } from "./look.js";
import { WATER_Y, islandMeshes, planIslands, shoreField } from "./islands.js";
import { createWaterMaterial } from "./water.js";
import { createStormCloud } from "./storm-cloud.js";
import { createCityLife } from "./city-life.js";
import { createScenery } from "./scenery.js";

const _m = new Matrix4();
const _p = new Vector3();
const _q = new Quaternion();
const _s = new Vector3();
const _c = new Color();
const _c2 = new Color();
const _up = new Vector3(0, 1, 0);
const ID = new Quaternion();
const BASE = 0.35;              // pad top: buildings stand on their district pad
const FILL_SEC = 0.45;          // dark -> lit, flooding from the ground up
const HOT_SEC = 0.22;           // the white flash of a hit
const CAP = 0.55;               // roof rim cap height (m)
const MAX_W = STORM.city.maxVisual;       // widest visual footprint (lots are 9 m apart, +-1.2 m jitter)
const GROW = STORM.city.visualGrow;       // drawn body vs sim footprint
const CAP_OVER = STORM.city.capOverhang;  // flat roof caps are this much wider than the body (sim.js keeps air between them)

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
    this.water = null;
    this.life = null;
    this.scenery = null;
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
      const vw = Math.min(MAX_W, b.w * GROW), vd = Math.min(MAX_W, b.d * GROW);
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
          P.trims.push(trims.length); trims.push([b.x, b.h, b.z, vw + CAP_OVER, CAP, vd + CAP_OVER, b.id]);
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
    const field = new Mesh(this.#own(new PlaneGeometry(size * 14 + 400, size * 14 + 400)), this.#own(new MeshStandardMaterial({ color: W.field, roughness: 0.95 })));
    field.rotation.x = -Math.PI / 2;
    field.position.y = W.water ? WATER_Y : -0.05;
    field.receiveShadow = true;
    field.name = "field";
    const avenue = plan?.avenue ?? 6;
    const plate = new Mesh(this.#own(chamferPrismGeometry(0.02)), this.#own(new MeshStandardMaterial({ color: W.asphalt, roughness: 0.9 })));
    plate.scale.set(city.width + avenue * 2 + 6, 0.12, city.depth + avenue * 2 + 6);
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
    // a decal on the asphalt: lifted 4.5 cm and pulled forward in the depth test (polygon offset), so it never z-fights
    const dash = new InstancedMesh(this.#own(new PlaneGeometry(1, 1).rotateX(-Math.PI / 2)),
      this.#own(new MeshStandardMaterial({ color: W.dash, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 })), Math.max(1, dashes.length));
    dash.name = "lane-dashes";
    dash.receiveShadow = true;
    dashes.forEach(([x, z, alongX], i) => dash.setMatrixAt(i, _m.compose(_p.set(x, 0.085, z), ID, alongX ? _s.set(2.2, 1, 0.35) : _s.set(0.35, 1, 2.2))));
    dash.count = dashes.length;
    this.group.add(dash);

    // ---------------------------------------------------------------- props
    const geos = propGeometries();
    for (const g of Object.values(geos)) this.#own(g);
    const pitch = STORM.city.lotPitch;
    const trees = [], ring = [];
    // parks on the empty lots, lamps, walking people and driving cars (city-life.js)
    const yaw0 = 35 * Math.PI / 180, vx = Math.sin(yaw0), vz = Math.cos(yaw0);   // the camera's ground direction
    this.life = this.#own(createCityLife({ city, bs, rng, W, base: BASE, pitch, lanes: { lx, lz, span, avenue }, camDir: { x: vx, z: vz } }));
    this.group.add(this.life.group);
    trees.push(...this.life.trees);
    // the world around the city: fields, hills, roads, forests, mesas, windmills, cloud tops or boats (scenery.js)
    this.scenery = this.#own(createScenery({ W, rng, plate: city.width + avenue * 2 + 6, camDir: { x: vx, z: vz }, lanes: { lx, lz } }));
    this.group.add(this.scenery.group);
    // the tree ring: behind and beside the city only (the camera side stays open), sparse near the plate.
    // Water themes: no ring on the sea - the trees stand on islands (islands.js, 3 draws) instead.
    if (W.water) {
      const { isles, trees: onIsles } = planIslands({ rng, plate: city.width + avenue * 2 + 6, vx, vz });
      for (const m of islandMeshes(isles, W.water)) { this.#own(m.geometry); this.#own(m.material); this.group.add(m); }
      // the sea becomes toy water: shallow at the beaches, foam lines, waves rolling in (water.js)
      field.material = this.#own(createWaterMaterial(shoreField(isles), { deep: W.field, shallow: W.water.shallow, foam: W.water.foam }));
      this.water = field.material.userData.water;
      ring.push(...onIsles);
    }
    else ring.push(...this.scenery.trees);
    const propMesh = (list, kind, cast, name, y0 = 0) => {
      const items = list.filter((p) => p.kind === kind);
      if (!items.length) return;
      const mesh = new InstancedMesh(geos[kind], this.#own(new MeshStandardMaterial({ vertexColors: true, roughness: kind === "car" ? 0.45 : 0.85 })), items.length);
      mesh.name = name;
      mesh.castShadow = cast;
      mesh.receiveShadow = kind !== "car";
      items.forEach((p, i) => {
        mesh.setMatrixAt(i, _m.compose(_p.set(p.x, kind === "car" ? 0.1 : y0, p.z), _q.setFromAxisAngle(_up, p.r), _s.setScalar(p.s)));
        mesh.setColorAt(i, _c.set(kind === "car" ? ["#ff5a5f", "#ffd23f", "#4f8dff", "#ffffff", "#ff9f40"][i % 5] : W.trees[i % W.trees.length]));
      });
      this.group.add(mesh);
    };
    propMesh(trees, "roundTree", small, "park-trees", BASE);
    propMesh(trees, "coneTree", small, "park-pines", BASE);
    propMesh(ring, "roundTree", false, "ring-trees");
    propMesh(ring, "coneTree", false, "ring-pines");

    // ---------------------------------------------------------------- storm front (behind the city, top of frame)
    let top = 0;
    for (const b of bs) top = Math.max(top, b.tipY);
    this.top = top;
    this.cloudY = top + 16;
    const yaw = 35 * Math.PI / 180, far = size * 0.5 + 14;
    const cx = -Math.sin(yaw) * far, cz = -Math.cos(yaw) * far;
    this.cloudCenter = new Vector3(cx, this.cloudY, cz);
    this.cloud = this.#own(createStormCloud(rng, {
      center: this.cloudCenter, yaw, across: Math.max(40, size * 1.1), scale: Math.max(1, size / 60), rim: "#ffe0ec", glow: LOOK.cloudGlow,
    }));
    this.cloudGroup = this.cloud.group;
    this.group.add(this.cloudGroup);
    this.cloudBase = this.cloudCenter.clone();
  }

  /** Keep the storm front behind the city as the camera orbits: rotate it by the view's yaw offset (radians). */
  setCloudYaw(delta) {
    if (!this.cloudGroup) return;
    this.cloudGroup.rotation.y = delta;
    this.cloudCenter.copy(this.cloudBase).applyAxisAngle(_up, delta);
  }

  /** A strike just left the storm front: it flashes from inside. */
  flashCloud(time) { this.cloud?.flash(time); }

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
    if (this.water) this.water.wtTime.value = time;
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
    // the storm front breathes, and flickers from inside while the strike charges
    this.cloud.update(time, holding ? Math.min(1, charge) : 0);
    this.life?.update(time);
    this.scenery?.update(time);
  }

  dispose() { this.clear(); }
}

const WHITE = new Color(1, 1, 1);
