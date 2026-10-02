/**
 * Toy city kit (WP-21) - chunky, clean, toy-like buildings for Storm Grid, restyled from the hit references
 * (Holey.io, Slice Master, Smash Karts, Harvest.io ...): few big shapes, chamfered edges, one flat colour per
 * part, a handful of window BANDS instead of noisy grids, and a big colour change when a building lights up.
 *
 *   import { buildingTypes, ToyCity, ToyProps, layoutToyCity, createToyGround, TOY } from "./render/city-kit.js";
 *   const layout = layoutToyCity({ blocks: 5, seed: 7 });          // or build placements from the game's own city
 *   const ground = createToyGround(scene, layout);                // asphalt, sidewalks, parks, lane dashes (4 draws)
 *   const city = new ToyCity(scene, layout.buildings);            // 1 InstancedMesh per building type (<= 6 draws)
 *   const props = new ToyProps(scene, layout.props);              // trees + cars (3 draws)
 *   city.setLit(i, 1);             // the building fills with its candy colour from the ground up, windows glow
 *   city.setLit(i, 1, true);       // instant
 *   city.tip(i, out);              // world position of its lightning rod (the bolt's hop point)
 *   city.update(dt);               // animates fills (call once per frame)
 *
 * Placement record (what the game's generator must produce): { type, x, z, rot (radians, use k*PI/2), scale
 * (0.85-1.15), color (lit candy colour, optional - picked from TOY.lit) }. `type` indexes buildingTypes():
 *   0 tower (stepped top + rod) · 1 mid block (flat rim roof) · 2 dome · 3 spire (+ rod) · 4 low wide · 5 house.
 *
 * Look rules (docs/QA_REPORT.md "WP-21 notes"): unlit = calm desaturated grey-blue with darker glass; lit = one
 * bright candy colour per building + warm glowing window bands; the bolt stays the most saturated thing on screen.
 */

import {
  BufferAttribute, BufferGeometry, Color, ConeGeometry, CylinderGeometry, DynamicDrawUsage, Float32BufferAttribute,
  InstancedBufferAttribute, InstancedMesh, Matrix4, Mesh, MeshStandardMaterial, PlaneGeometry, Quaternion, SphereGeometry,
  Vector2, Vector3,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/** The toy palette: limited, calm world + candy lit colours. */
export const TOY = {
  unlit: "#8690b6",          // calm desaturated grey-blue
  unlitWindow: "#474f73",
  unlitTrim: "#9aa3c6",
  rod: "#d9def0",
  window: "#fff2b8",         // lit window bands (HDR via windowGlow)
  lit: ["#ffc21a", "#ff5e57", "#ff6fb5", "#3fd07a", "#ff8c2a", "#9d6bff"],   // warm/candy - never cyan (the bolt's)
  asphalt: "#5a6290",
  field: "#7cc463",
  sidewalk: "#e4dde6",
  park: "#78c86a",
  dash: "#f2f4ff",
  treeGreen: ["#58c25a", "#7fd65a", "#3fae6a"],
  trunk: "#8a5a3c",
  cars: ["#ff5a5f", "#ffd23f", "#4f8dff", "#ffffff", "#ff9f40", "#7a5cff"],
};

const PART = { body: 0, window: 1, trim: 2, rod: 3 };
const _m = new Matrix4(), _q = new Quaternion(), _p = new Vector3(), _s = new Vector3(), _c = new Color(), _v = new Vector3();

/** A part: non-indexed, no uv, transformed, tagged with aPart. */
function part(geo, kind, { x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0 } = {}) {
  let g = geo.index ? geo.toNonIndexed() : geo;
  g.deleteAttribute("uv");
  if (rz) g.rotateZ(rz);
  if (rx) g.rotateX(rx);
  if (ry) g.rotateY(ry);
  g.translate(x, y, z);
  g.setAttribute("aPart", new Float32BufferAttribute(new Float32Array(g.attributes.position.count).fill(kind), 1));
  return g;
}

/** Window bands on the 4 faces of a w x h x d body whose base is at y0: one band per storey, or big panes. */
function windows(out, w, d, y0, h, { storey = 1.45, style = "bands", bottom = 1.1, top = 0.6 } = {}) {
  const floors = Math.floor((h - bottom - top) / storey);
  if (floors < 1) return;
  const faces = [[0, d / 2, 0, w], [Math.PI, -d / 2, 0, w], [Math.PI / 2, 0, w / 2, d], [-Math.PI / 2, 0, -w / 2, d]];
  for (const [ry, fz, fx, faceW] of faces) {
    for (let f = 0; f < floors; f++) {
      const cy = y0 + bottom + f * storey + storey * 0.4;
      if (style === "bands") {
        out.push(part(new PlaneGeometry(faceW - 0.75, storey * 0.36), PART.window, { ry, y: cy, ...offset(ry, fx, fz) }));
      } else {
        const cols = Math.max(1, Math.floor((faceW - 0.5) / 1.35));
        const pitch = (faceW - 0.5) / cols;
        for (let c = 0; c < cols; c++) {
          const u = -faceW / 2 + 0.25 + pitch * (c + 0.5);
          out.push(part(new PlaneGeometry(pitch * 0.62, storey * 0.5), PART.window, { ry, y: cy, ...offset(ry, fx, fz, u) }));
        }
      }
    }
  }
}
/** Face placement: panels float 0.03 in front of the face; `u` slides along the face. */
function offset(ry, fx, fz, u = 0) {
  const e = 0.03;
  if (ry === 0) return { x: u, z: fz + e };
  if (ry === Math.PI) return { x: -u, z: fz - e };
  if (ry === Math.PI / 2) return { x: fx + e, z: -u };
  return { x: fx - e, z: u };
}
const body = (w, h, d, y0) => part(new RoundedBoxGeometry(w, h, d, 1, Math.min(0.35, w * 0.08)), PART.body, { y: y0 + h / 2 });
const cap = (w, d, y) => part(new RoundedBoxGeometry(w + 0.3, 0.4, d + 0.3, 1, 0.12), PART.trim, { y: y + 0.2 });
function rod(out, y, len = 1.8) {
  out.push(part(new CylinderGeometry(0.08, 0.1, len, 6, 1), PART.rod, { y: y + len / 2 }));
  out.push(part(new SphereGeometry(0.24, 8, 6), PART.rod, { y: y + len + 0.12 }));
  return y + len + 0.3;
}

function finish(name, parts, tipY) {
  const geo = mergeGeometries(parts, false);
  geo.computeBoundingBox();
  const top = geo.boundingBox.max.y;
  const pos = geo.attributes.position;
  const h = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) h[i] = Math.min(1, Math.max(0, pos.getY(i) / top));
  geo.setAttribute("aH", new BufferAttribute(h, 1));
  geo.computeBoundingSphere();
  return { name, geometry: geo, height: top, tip: new Vector3(0, tipY ?? top, 0), triangles: pos.count / 3 };
}

/** The 6 building types (model space, base at y = 0, centred on x/z). Each is ONE geometry (<= ~600 tris). */
export function buildingTypes() {
  const T = [];
  { // 0 tower: tall body, stepped top, rod
    const p = [body(4.2, 12, 4.2, 0), body(2.8, 3, 2.8, 12)];
    windows(p, 4.2, 4.2, 0, 12, { style: "bands" });
    windows(p, 2.8, 2.8, 12, 3, { style: "bands", bottom: 0.7, top: 0.4 });
    p.push(cap(2.8, 2.8, 15));
    const tip = rod(p, 15.4);
    T.push(finish("tower", p, tip));
  }
  { // 1 mid block: flat roof with a rim + a roof box
    const p = [body(5, 7, 5, 0)];
    windows(p, 5, 5, 0, 7, { style: "panes" });
    p.push(cap(5, 5, 7));
    p.push(part(new RoundedBoxGeometry(1.6, 0.9, 1.2, 1, 0.15), PART.trim, { x: 0.9, y: 7.4 + 0.45, z: -0.6 }));
    T.push(finish("mid", p, 8.3));
  }
  { // 2 dome
    const p = [body(4.4, 8.5, 4.4, 0)];
    windows(p, 4.4, 4.4, 0, 8.5, { style: "bands" });
    p.push(cap(4.4, 4.4, 8.5));
    p.push(part(new SphereGeometry(1.8, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2), PART.trim, { y: 8.9 }));
    const tip = rod(p, 10.6, 1.2);
    T.push(finish("dome", p, tip));
  }
  { // 3 spire
    const p = [body(3.8, 10, 3.8, 0)];
    windows(p, 3.8, 3.8, 0, 10, { style: "panes" });
    p.push(cap(3.8, 3.8, 10));
    p.push(part(new ConeGeometry(1.5, 3.4, 8, 1), PART.trim, { y: 10.4 + 1.7 }));
    const tip = rod(p, 13.6, 1.2);
    T.push(finish("spire", p, tip));
  }
  { // 4 low wide
    const p = [body(6.2, 3.6, 4.8, 0)];
    windows(p, 6.2, 4.8, 0, 3.6, { style: "bands", bottom: 0.9, top: 0.5, storey: 1.6 });
    p.push(cap(6.2, 4.8, 3.6));
    T.push(finish("low", p, 4.0));
  }
  { // 5 house: small body + pyramid roof
    const p = [body(3.4, 3, 3.4, 0)];
    windows(p, 3.4, 3.4, 0, 3, { style: "panes", bottom: 0.8, top: 0.5, storey: 1.6 });
    p.push(part(new ConeGeometry(2.7, 1.9, 4, 1), PART.trim, { ry: Math.PI / 4, y: 3 + 0.95 }));
    T.push(finish("house", p, 4.9));
  }
  return T;
}

// ------------------------------------------------------------------ material
const TOY_VERTEX_PARS = /* glsl */`
attribute float aPart;
attribute float aH;
attribute float aLit;
attribute vec3 aLitColor;
varying float vPart;
varying float vH;
varying float vLit;
varying vec3 vLitColor;
`;
const TOY_FRAGMENT_PARS = /* glsl */`
uniform vec3 tyUnlit, tyUnlitWin, tyUnlitTrim, tyRod, tyWin;
uniform float tyWinGlow, tySelf, tyEdge;
varying float vPart;
varying float vH;
varying float vLit;
varying vec3 vLitColor;
`;

/**
 * Toy building material: flat-colour parts, lit state per instance (aLit 0..1 = fill height, aLitColor).
 * opts: unlit, unlitWindow, unlitTrim, rod, window (colours), windowGlow (HDR, > 1 blooms), self (lit body glow),
 * edge (glow of the rising fill line).
 */
export function toyBuildingMaterial({ unlit = TOY.unlit, unlitWindow = TOY.unlitWindow, unlitTrim = TOY.unlitTrim, rod = TOY.rod,
  window = TOY.window, windowGlow = 1.05, self = 0.0, edge = 2.2, roughness = 0.72 } = {}) {
  const m = new MeshStandardMaterial({ color: 0xffffff, roughness, metalness: 0, envMapIntensity: 0.6 });
  const u = {
    tyUnlit: { value: new Color(unlit) }, tyUnlitWin: { value: new Color(unlitWindow) }, tyUnlitTrim: { value: new Color(unlitTrim) },
    tyRod: { value: new Color(rod) }, tyWin: { value: new Color(window) }, tyWinGlow: { value: windowGlow }, tySelf: { value: self }, tyEdge: { value: edge },
  };
  m.userData.toy = u;
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${TOY_VERTEX_PARS}`)
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvPart = aPart; vH = aH; vLit = aLit; vLitColor = aLitColor;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${TOY_FRAGMENT_PARS}`)
      .replace("#include <color_fragment>", `#include <color_fragment>
        float tyFill = 1.0 - smoothstep( vLit - 0.004, vLit + 0.004, vH );          // 1 below the fill line
        float tyW = step( 0.5, vPart ) * step( vPart, 1.5 );
        float tyT = step( 1.5, vPart ) * step( vPart, 2.5 );
        float tyR = step( 2.5, vPart );
        vec3 tyBody = mix( tyUnlit, vLitColor, tyFill );
        vec3 tyWinC = mix( tyUnlitWin, tyWin, tyFill );
        vec3 tyTrimC = mix( tyUnlitTrim, mix( vLitColor, vec3( 1.0 ), 0.45 ), tyFill );
        diffuseColor.rgb = tyBody * ( 1.0 - tyW - tyT - tyR ) + tyWinC * tyW + tyTrimC * tyT + tyRod * tyR;`)
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix( roughnessFactor, 0.25, tyW );")
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        totalEmissiveRadiance += tyWin * tyWinGlow * tyW * tyFill;
        totalEmissiveRadiance += vLitColor * tySelf * tyFill * ( 1.0 - tyW - tyR );
        float tyLine = ( 1.0 - smoothstep( 0.0, 0.025, abs( vH - vLit ) ) ) * step( 0.002, vLit ) * step( vLit, 0.998 );
        totalEmissiveRadiance += vec3( 1.0, 0.95, 0.8 ) * tyEdge * tyLine;`);
  };
  m.customProgramCacheKey = () => "gs-toy-building";
  return m;
}

// ------------------------------------------------------------------ the city (instanced per type)
export class ToyCity {
  /** @param {{type:number,x:number,z:number,rot?:number,scale?:number,color?:string}[]} placements */
  constructor(scene, placements, { types = buildingTypes(), material = toyBuildingMaterial(), castShadow = true, receiveShadow = true } = {}) {
    this.types = types;
    this.material = material;
    this.placements = placements;
    this.count = placements.length;
    this.target = new Float32Array(this.count);
    this.value = new Float32Array(this.count);
    this.speed = 1.6;                                         // fill per second (0 -> 1 in ~0.6 s)
    this.#slot = new Int32Array(this.count);
    this.#typeOf = new Int32Array(this.count);
    this.meshes = types.map((t, ti) => {
      const list = placements.map((p, i) => [p, i]).filter(([p]) => p.type === ti);
      if (!list.length) return null;
      const geo = t.geometry.clone();
      const lit = new InstancedBufferAttribute(new Float32Array(list.length), 1).setUsage(DynamicDrawUsage);
      const col = new InstancedBufferAttribute(new Float32Array(list.length * 3), 3);
      geo.setAttribute("aLit", lit);
      geo.setAttribute("aLitColor", col);
      const mesh = new InstancedMesh(geo, material, list.length);
      mesh.name = `city-${t.name}`;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      list.forEach(([p, i], k) => {
        this.#slot[i] = k;
        this.#typeOf[i] = ti;
        const s = p.scale ?? 1;
        _m.compose(_p.set(p.x, p.y ?? 0, p.z), _q.setFromAxisAngle(_v.set(0, 1, 0), p.rot ?? 0), _s.set(s, s, s));
        mesh.setMatrixAt(k, _m);
        _c.set(p.color ?? TOY.lit[i % TOY.lit.length]);
        col.array[k * 3] = _c.r; col.array[k * 3 + 1] = _c.g; col.array[k * 3 + 2] = _c.b;
      });
      mesh.computeBoundingSphere();
      scene.add(mesh);
      return mesh;
    });
  }
  #slot; #typeOf; #dirty = false;

  /** Target fill 0..1 (1 = fully lit). instant skips the rising-fill animation. */
  setLit(i, v, instant = false) {
    this.target[i] = v;
    if (instant) { this.value[i] = v; this.#write(i); }
    this.#dirty = true;
  }

  lit(i) { return this.value[i]; }

  /** World position of building i's lightning rod tip (or roof top). */
  tip(i, out = new Vector3()) {
    const p = this.placements[i], t = this.types[p.type], s = p.scale ?? 1;
    return out.set(p.x, (p.y ?? 0) + t.tip.y * s, p.z);
  }

  /** Index of the building nearest to (x, z), optionally only among types in `only`. */
  nearest(x, z, only) {
    let best = -1, bd = Infinity;
    for (let i = 0; i < this.count; i++) {
      const p = this.placements[i];
      if (only && !only.includes(p.type)) continue;
      const d = (p.x - x) ** 2 + (p.z - z) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  update(dt) {
    if (!this.#dirty) return;
    let moving = false;
    for (let i = 0; i < this.count; i++) {
      const v = this.value[i], t = this.target[i];
      if (v === t) continue;
      this.value[i] = t > v ? Math.min(t, v + this.speed * dt) : Math.max(t, v - this.speed * 2 * dt);
      this.#write(i);
      moving = true;
    }
    this.#dirty = moving;
  }

  #write(i) {
    const mesh = this.meshes[this.#typeOf[i]];
    const a = mesh.geometry.attributes.aLit;
    a.array[this.#slot[i]] = this.value[i];
    a.needsUpdate = true;
  }
}

// ------------------------------------------------------------------ props (trees, cars)
function colored(geo, hex, t) {
  const g = part(geo, 0, t);
  g.deleteAttribute("aPart");
  const c = new Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) a.set([c.r, c.g, c.b], i * 3);
  g.setAttribute("color", new BufferAttribute(a, 3));
  return g;
}

/** Prop geometries with vertex colours: roundTree (~90 tris), coneTree (~34), car (~340; white body = instance colour). */
export function propGeometries() {
  return {
    roundTree: mergeGeometries([
      colored(new CylinderGeometry(0.22, 0.28, 1.2, 5, 1, true), TOY.trunk, { y: 0.6 }),
      colored(new SphereGeometry(1.25, 8, 5), "#ffffff", { y: 2.1 }),
    ]),
    coneTree: mergeGeometries([
      colored(new CylinderGeometry(0.18, 0.22, 0.8, 5, 1), TOY.trunk, { y: 0.4 }),
      colored(new ConeGeometry(1.05, 2.6, 7, 1), "#ffffff", { y: 0.8 + 1.3 }),
    ]),
    car: mergeGeometries([
      colored(new RoundedBoxGeometry(1.5, 0.6, 3, 1, 0.18), "#ffffff", { y: 0.55 }),
      colored(new RoundedBoxGeometry(1.25, 0.55, 1.5, 1, 0.14), "#dfe6ff", { y: 1.1, z: -0.2 }),
      ...[[-0.72, 0.9], [0.72, 0.9], [-0.72, -0.9], [0.72, -0.9]].map(([x, z]) =>
        colored(new CylinderGeometry(0.3, 0.3, 0.25, 8, 1), "#2a2f45", { rz: Math.PI / 2, x, y: 0.3, z })),
    ]),
  };
}

export class ToyProps {
  /** @param {{kind:"roundTree"|"coneTree"|"car", x:number, z:number, rot?:number, scale?:number, color?:string}[]} list */
  constructor(scene, list, { castShadow = true } = {}) {
    const geos = propGeometries();
    this.meshes = Object.entries(geos).map(([kind, geo]) => {
      const items = list.filter((p) => p.kind === kind);
      if (!items.length) return null;
      const mesh = new InstancedMesh(geo, new MeshStandardMaterial({ vertexColors: true, roughness: kind === "car" ? 0.45 : 0.85, metalness: 0 }), items.length);
      mesh.name = `prop-${kind}`;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = kind !== "car";
      items.forEach((p, k) => {
        const s = p.scale ?? 1;
        _m.compose(_p.set(p.x, p.y ?? 0, p.z), _q.setFromAxisAngle(_v.set(0, 1, 0), p.rot ?? 0), _s.set(s, s, s));
        mesh.setMatrixAt(k, _m);
        mesh.setColorAt(k, _c.set(p.color ?? (kind === "car" ? TOY.cars[k % TOY.cars.length] : TOY.treeGreen[k % TOY.treeGreen.length])));
      });
      scene.add(mesh);
      return mesh;
    });
  }
}

// ------------------------------------------------------------------ ground + layout
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/**
 * A simple grid city: `blocks` x `blocks` blocks of `block` units, `street` wide streets, a few parks.
 * Returns { buildings: placements[], props: [], blocks: [{x, z, park}], size, block, street }.
 * Downtown (centre) gets towers/spires/domes, the edge gets low blocks and houses.
 */
export function layoutToyCity({ blocks = 5, block = 10, street = 4.5, seed = 7, parks = 3 } = {}) {
  const rand = mulberry32(seed);
  const pitch = block + street, half = (blocks * pitch) / 2;
  const B = [], buildings = [], props = [];
  const parkSet = new Set();
  while (parkSet.size < parks) parkSet.add(Math.floor(rand() * blocks * blocks));
  for (let bx = 0; bx < blocks; bx++) for (let bz = 0; bz < blocks; bz++) {
    const x = -half + pitch * (bx + 0.5), z = -half + pitch * (bz + 0.5), idx = bx * blocks + bz;
    const park = parkSet.has(idx);
    B.push({ x, z, park });
    const centre = Math.hypot(x, z) / half;          // 0 centre .. ~1.4 corner
    if (park) {
      for (let k = 0; k < 7; k++) props.push({ kind: rand() < 0.6 ? "roundTree" : "coneTree", x: x + (rand() - 0.5) * (block - 2.5), z: z + (rand() - 0.5) * (block - 2.5), rot: rand() * 6.28, scale: 0.8 + rand() * 0.5 });
      continue;
    }
    // 1 big or 2x2 small lots
    const big = rand() < (centre < 0.6 ? 0.55 : 0.3);
    const lots = big ? [[0, 0, 1]] : [[-1, -1, 0.5], [1, -1, 0.5], [-1, 1, 0.5], [1, 1, 0.5]];
    for (const [ox, oz, size] of lots) {
      if (!big && rand() < 0.18) {            // an empty lot gets a tree: negative space
        props.push({ kind: "roundTree", x: x + ox * block * 0.25, z: z + oz * block * 0.25, scale: 0.9 + rand() * 0.3, rot: rand() * 6.28 });
        continue;
      }
      let type;
      if (big) type = centre < 0.45 ? [0, 3, 2][Math.floor(rand() * 3)] : centre < 0.9 ? [1, 2, 3, 1][Math.floor(rand() * 4)] : [1, 4][Math.floor(rand() * 2)];
      else type = centre < 0.5 ? [1, 3, 2, 1][Math.floor(rand() * 4)] : [4, 5, 5, 1][Math.floor(rand() * 4)];
      const scale = big ? 1.05 + rand() * 0.2 : (type === 4 ? 0.62 : 0.72) + rand() * 0.12;
      buildings.push({ type, x: x + ox * block * 0.25, z: z + oz * block * 0.25, rot: Math.floor(rand() * 4) * Math.PI / 2, scale, y: 0.2 });
    }
  }
  // a few cars on the streets
  for (let k = 0; k < 14; k++) {
    const along = rand() < 0.5, lane = Math.floor(rand() * (blocks + 1));
    const c = -half + pitch * lane, s = (rand() - 0.5) * blocks * pitch * 0.95;
    const side = rand() < 0.5 ? -1 : 1;
    props.push(along ? { kind: "car", x: c + side * street * 0.22, z: s, rot: side > 0 ? 0 : Math.PI } : { kind: "car", x: s, z: c + side * street * 0.22, rot: side > 0 ? Math.PI / 2 : -Math.PI / 2 });
  }
  return { buildings, props, blocks: B, size: blocks * pitch, block, street, pitch, half };
}

/** Grass field to the horizon, the city's asphalt plate, rounded sidewalk slabs, park lawns, lane dashes. */
export function createToyGround(scene, layout, { size = 800 } = {}) {
  const out = [];
  const field = new Mesh(new PlaneGeometry(size, size), new MeshStandardMaterial({ color: TOY.field, roughness: 0.95, metalness: 0 }));
  field.rotation.x = -Math.PI / 2;
  field.position.y = -0.02;
  field.receiveShadow = true;
  field.name = "field";
  scene.add(field); out.push(field);
  const plate = layout.size + layout.street;
  const asphalt = new Mesh(new RoundedBoxGeometry(plate, 0.1, plate, 1, 0.05), new MeshStandardMaterial({ color: TOY.asphalt, roughness: 0.92, metalness: 0 }));
  asphalt.position.y = -0.03;
  asphalt.receiveShadow = true;
  asphalt.name = "asphalt";
  scene.add(asphalt); out.push(asphalt);
  const slabGeo = new RoundedBoxGeometry(1, 1, 1, 1, 0.06);
  const walk = new InstancedMesh(slabGeo, new MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }), layout.blocks.length);
  walk.name = "sidewalks";
  walk.receiveShadow = true;
  layout.blocks.forEach((b, i) => {
    _m.compose(_p.set(b.x, 0.1, b.z), _q.identity(), _s.set(layout.block + 0.6, 0.2, layout.block + 0.6));
    walk.setMatrixAt(i, _m);
    walk.setColorAt(i, _c.set(b.park ? TOY.park : TOY.sidewalk));
  });
  scene.add(walk); out.push(walk);
  // lane dashes along every street centre line
  const d = [];
  for (let k = 0; k <= layout.blocks.length ** 0.5; k++) {
    const c = -layout.half + layout.pitch * k;
    for (let s = -layout.half + 1; s < layout.half; s += 2.4) {
      const inCross = Math.abs(((s + layout.half) % layout.pitch) - layout.pitch / 2) > layout.block / 2 - 0.5;
      if (inCross) continue;
      d.push([c, s, 0], [s, c, 1]);
    }
  }
  const dash = new InstancedMesh(new PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new MeshStandardMaterial({ color: TOY.dash, roughness: 0.8 }), d.length);
  dash.name = "lane-dashes";
  dash.receiveShadow = true;
  d.forEach(([x, z, alongX], i) => { _m.compose(_p.set(x, 0.02, z), _q.identity(), alongX ? _s.set(1.2, 1, 0.22) : _s.set(0.22, 1, 1.2)); dash.setMatrixAt(i, _m); });
  scene.add(dash); out.push(dash);
  return out;
}

// =====================================================================================================
// Parametric toy blocks (WP-31): the same toy language as buildingTypes(), built to ANY footprint and
// height (the game's sim decides w x h x d). One InstancedMesh draws every body segment of a city.
//   const geo = chamferPrismGeometry();                       // unit footprint, y 0..1, 22 tris
//   geo.setAttribute("aState", new InstancedBufferAttribute(new Float32Array(n * 4), 4));  // see below
//   geo.setAttribute("aLitColor", new InstancedBufferAttribute(new Float32Array(n * 3), 3));
//   const bodies = new InstancedMesh(geo, toyBlockMaterial(), n);   // instance matrix = translate + scale (w, h, d)
// aState per instance: x = fill height (m, building space: lit below it), y = this segment's base (m, building
// space, 0 for the ground segment; stacked segments share one rising fill), z = white flash 0..1, w = window
// style (0 bands, 1 panes). Windows are computed in the shader from real metres: never stretched.
// =====================================================================================================

/** A unit box (x, z in -0.5..0.5, y 0..1) with chamfered vertical edges and a top: 22 triangles. */
export function chamferPrismGeometry(c = 0.1) {
  const a = 0.5 - c, b = 0.5;
  const ring = [[a, b], [b, a], [b, -a], [a, -b], [-a, -b], [-b, -a], [-b, a], [-a, b]];   // counter-clockwise from +z
  const pos = [];
  for (let i = 0; i < 8; i++) {
    const [x0, z0] = ring[i], [x1, z1] = ring[(i + 1) % 8];
    // side quad (outward facing, CCW seen from outside)
    pos.push(x0, 0, z0, x1, 0, z1, x1, 1, z1, x0, 0, z0, x1, 1, z1, x0, 1, z0);
  }
  for (let i = 1; i < 7; i++) {
    const [x0, z0] = ring[0], [x1, z1] = ring[i], [x2, z2] = ring[i + 1];
    pos.push(x0, 1, z0, x1, 1, z1, x2, 1, z2);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  // side normals point inward if the ring winding is clockwise seen from above: fix orientation if needed
  const n = g.attributes.normal, p = g.attributes.position;
  if (n.getX(0) * (p.getX(0) + p.getX(1)) + n.getZ(0) * (p.getZ(0) + p.getZ(1)) < 0) {
    for (let i = 0; i < p.count; i += 3) {             // swap two vertices of every triangle
      for (const arr of [p, n]) { const t = [arr.getX(i + 1), arr.getY(i + 1), arr.getZ(i + 1)]; arr.setXYZ(i + 1, arr.getX(i + 2), arr.getY(i + 2), arr.getZ(i + 2)); arr.setXYZ(i + 2, ...t); }
    }
    g.computeVertexNormals();
  }
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return g;
}

const BLOCK_VERTEX_PARS = /* glsl */`
attribute vec4 aState;
attribute vec3 aLitColor;
varying vec3 vBkLocal;
varying vec3 vBkScale;
varying vec3 vBkN;
varying vec4 vBkState;
varying vec3 vBkLit;
`;
const BLOCK_FRAGMENT_PARS = /* glsl */`
uniform vec3 bkUnlit, bkUnlitWin, bkUnlitTop, bkWin;
uniform float bkWinGlow, bkEdge, bkFlash, bkStorey, bkMargin, bkPane;
uniform vec2 bkBand;
varying vec3 vBkLocal;
varying vec3 vBkScale;
varying vec3 vBkN;
varying vec4 vBkState;
varying vec3 vBkLit;
`;

/**
 * Toy block material for parametric bodies: calm unlit colour, the instance's candy colour below the
 * rising fill line, window bands (or panes) per storey in real metres, a glowing fill line, a white flash.
 */
export function toyBlockMaterial({ unlit = TOY.unlit, unlitWindow = TOY.unlitWindow, unlitTop = TOY.unlitTrim, window = TOY.window,
  windowGlow = 1.05, edge = 2.4, flash = 0.9, storey = 3.2, band = [0.34, 0.72], margin = 0.9, pane = 1.8, roughness = 0.72 } = {}) {
  const m = new MeshStandardMaterial({ color: 0xffffff, roughness, metalness: 0, envMapIntensity: 0.6 });
  const u = {
    bkUnlit: { value: new Color(unlit) }, bkUnlitWin: { value: new Color(unlitWindow) }, bkUnlitTop: { value: new Color(unlitTop) },
    bkWin: { value: new Color(window) }, bkWinGlow: { value: windowGlow }, bkEdge: { value: edge }, bkFlash: { value: flash },
    bkStorey: { value: storey }, bkMargin: { value: margin }, bkPane: { value: pane }, bkBand: { value: new Vector2(band[0], band[1]) },
  };
  m.userData.block = u;
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${BLOCK_VERTEX_PARS}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vBkScale = vec3( length( instanceMatrix[ 0 ].xyz ), length( instanceMatrix[ 1 ].xyz ), length( instanceMatrix[ 2 ].xyz ) );
        #else
          vBkScale = vec3( 1.0 );
        #endif
        vBkLocal = position * vBkScale; vBkN = normal; vBkState = aState; vBkLit = aLitColor;`);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${BLOCK_FRAGMENT_PARS}`)
      .replace("#include <color_fragment>", `#include <color_fragment>
        float bkY = vBkState.y + vBkLocal.y;
        float bkLitK = 1.0 - smoothstep( vBkState.x - 0.2, vBkState.x + 0.2, bkY );
        float bkTopF = step( 0.5, vBkN.y );
        float bkWinK = 0.0;
        float bkAx = max( abs( vBkN.x ), abs( vBkN.z ) );
        if ( bkTopF < 0.5 && bkAx > 0.9 ) {
          bool onX = abs( vBkN.x ) > abs( vBkN.z );
          float u = onX ? vBkLocal.z : vBkLocal.x;
          float faceW = onX ? vBkScale.z : vBkScale.x;
          float q = bkY / bkStorey;
          float fy = fract( q );
          float aa = max( fwidth( q ) * 1.2, 0.002 );
          float bandK = smoothstep( bkBand.x - aa, bkBand.x + aa, fy ) * ( 1.0 - smoothstep( bkBand.y - aa, bkBand.y + aa, fy ) );
          float edgeU = faceW * 0.5 - bkMargin;
          float au = max( fwidth( u ) * 1.2, 0.002 );
          float inside = 1.0 - smoothstep( edgeU - au, edgeU + au, abs( u ) );
          float notGround = step( 1.0, floor( q ) );
          float notTop = 1.0 - step( vBkScale.y - 1.1, vBkLocal.y );
          bkWinK = bandK * inside * notGround * notTop;
          if ( vBkState.w > 0.5 ) {
            float fu = fract( u / bkPane + 0.5 );
            float ap = max( fwidth( u / bkPane ) * 1.2, 0.002 );
            bkWinK *= smoothstep( 0.16 - ap, 0.16 + ap, fu ) * ( 1.0 - smoothstep( 0.84 - ap, 0.84 + ap, fu ) );
          }
        }
        vec3 bkBody = mix( bkUnlit, vBkLit, bkLitK );
        vec3 bkRoof = mix( bkUnlitTop, mix( vBkLit, vec3( 1.0 ), 0.35 ), bkLitK );
        vec3 bkWinC = mix( bkUnlitWin, bkWin, bkLitK );
        diffuseColor.rgb = mix( mix( bkBody, bkRoof, bkTopF ), bkWinC, bkWinK );`)
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix( roughnessFactor, 0.3, bkWinK );")
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        totalEmissiveRadiance += bkWin * bkWinGlow * bkWinK * bkLitK;
        float bkLine = ( 1.0 - smoothstep( 0.0, 0.45, abs( bkY - vBkState.x ) ) ) * step( 0.05, vBkState.x ) * ( 1.0 - bkTopF );
        totalEmissiveRadiance += vec3( 1.0, 0.95, 0.82 ) * bkEdge * bkLine * step( bkY, vBkState.x + 0.6 ) * step( vBkState.x, vBkState.y + vBkScale.y + 0.3 ) * step( 0.001, vBkState.x - vBkState.y );
        totalEmissiveRadiance += vec3( 1.0 ) * bkFlash * vBkState.z;`);
  };
  m.customProgramCacheKey = () => "gs-toy-block";
  return m;
}

/** Plain toy trim material (caps, roofs, rods): colour per instance via setColorAt. */
export function toyTrimMaterial({ roughness = 0.6, metalness = 0 } = {}) {
  return new MeshStandardMaterial({ color: 0xffffff, roughness, metalness, envMapIntensity: 0.6 });
}
