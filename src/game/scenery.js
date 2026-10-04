/**
 * The world around the city, so no map looks unfinished. One recipe per theme (look.js world.scenery):
 *
 *   meadow  (Downtown)      farm-field patchwork, low-poly green hills, groves, rocks, country roads out of town
 *   farm    (Old Town)      denser patchwork with crop rows, windmills turning, hills, groves, roads
 *   hills   (Hill Towers)   big faceted hills and pine forests, a few fields, roads
 *   snow    (Snow Peak)     low-poly rock mountains with snow caps, pine forests, frozen ponds, rocks
 *   desert  (Desert Spires) dunes, mesas, cacti, rocks, roads
 *   sky     (Sky Port)      the city on a floating island over a sea of clouds, islets, balloons, an airship (sky.js)
 *   sea     (Harbour, Neon Bay)  boats sailing round the city's island (the islands themselves: islands.js)
 *
 * Tall things (hills, mesas, forests, windmills) stand behind and beside the city, never between it and the camera;
 * low things (fields, roads, rocks, ponds) may lie anywhere outside the asphalt plate. Everything is instanced:
 * 2-5 draw calls per theme, flat-shaded low-poly shapes in the toy palette, no shadow casting.
 */

import {
  BoxGeometry, Color, ConeGeometry, CylinderGeometry, DodecahedronGeometry, Float32BufferAttribute, Group, IcosahedronGeometry,
  InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { createSkyWorld } from "./sky.js";

const TAU = Math.PI * 2;
// Heights (m) of the flat boxes, all standing on y = -0.05 (the field). Layers that can overlap are >= 0.05 m apart so
// the depth buffer can always tell them apart, also far away (camera near = 1% of its distance): field top +0.02,
// pond +0.04, road +0.10, crop rows on a field +0.12, road dashes +0.16. Roads end at the plate edge, never on it.
const LAYER = { field: 0.07, pond: 0.09, road: 0.15, row: 0.17, dash: 0.21 };
const RECIPES = {
  meadow: { fields: 0.6, rows: 0.25, hills: 12, mesas: 0, groves: 5, pines: 0.35, rocks: 14, roads: true, crops: ["#e8c65a", "#a6d86a", "#5fae4f", "#c99a62", "#8fcf5f"], hill: ["#6cbd58", "#88cc62", "#5aa857"], rock: "#a7a3b8" },
  farm: { fields: 0.85, rows: 0.6, hills: 9, mesas: 0, groves: 3, pines: 0.2, rocks: 8, roads: true, windmills: 2, crops: ["#e9c75a", "#f0d77a", "#a9cf5a", "#7dbb4c", "#c79a5e", "#d4b06a"], hill: ["#9cc35a", "#86b44f", "#b0cc66"], rock: "#b3a497" },
  hills: { fields: 0.25, rows: 0.2, hills: 18, hillScale: 1.5, mesas: 0, groves: 8, pines: 0.75, rocks: 14, roads: true, crops: ["#a6d86a", "#e8c65a", "#5fae4f"], hill: ["#5fae55", "#77c160", "#4f9c50"], rock: "#9a9fb4" },
  snow: { fields: 0, rows: 0, hills: 13, peaks: true, mesas: 0, groves: 8, pines: 1, rocks: 18, ponds: 3, roads: true, crops: [], hill: ["#8f9ab6", "#a3acc6", "#7f89a6"], cap: "#f6f9ff", rock: "#8c95ad" },
  desert: { fields: 0, rows: 0, hills: 16, dunes: true, mesas: 8, groves: 0, pines: 0, rocks: 16, cacti: 30, roads: true, crops: [], hill: ["#efcf93", "#e6c084", "#f3d9a3"], rock: "#c08a63" },
  sky: { fields: 0, rows: 0, hills: 0, mesas: 0, groves: 0, pines: 0, rocks: 0, roads: false, crops: [], hill: [], rock: "#ffffff" },
  sea: { fields: 0, rows: 0, hills: 0, mesas: 0, groves: 0, pines: 0, rocks: 0, boats: 5, roads: false, crops: [], hill: [], rock: "#ffffff" },
};

/** Vertex-coloured part, moved into place. */
function paint(geo, hex, { x = 0, y = 0, z = 0, rx = 0, rz = 0 } = {}) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  g.deleteAttribute("uv");
  if (rz) g.rotateZ(rz);
  if (rx) g.rotateX(rx);
  g.translate(x, y, z);
  const c = new Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) a.set([c.r, c.g, c.b], i * 3);
  g.setAttribute("color", new Float32BufferAttribute(a, 3));
  return g;
}

const _m = new Matrix4(), _p = new Vector3(), _s = new Vector3(), _q = new Quaternion(), _c = new Color();
const UP = new Vector3(0, 1, 0), FWD = new Vector3(0, 0, 1), ID = new Quaternion(), _spin = new Quaternion();

/**
 * @param {object} o  W: theme.world · rng: the city's look stream · plate: asphalt plate side (m) · camDir {x,z}: towards
 *   the camera · lanes { lx, lz }: avenue lines (roads leave town along the middle ones)
 * @returns {{ group: Group, trees: object[], update(time:number):void, dispose():void, counts: object }}
 *   trees: scenery trees for city-mesh's tree meshes (y = 0, or their own y on the sky islets)
 */
export function createScenery({ W, rng, plate, camDir, lanes }) {
  const R = RECIPES[W.scenery ?? "meadow"] ?? RECIPES.meadow;
  const group = new Group(), own = [], trees = [];
  const P = plate / 2;                                          // asphalt plate half-size
  const behind = (x, z) => (x * camDir.x + z * camDir.z) / Math.max(1, Math.hypot(x, z)) < 0.2;
  const outside = (x, z, m) => Math.abs(x) > P + m || Math.abs(z) > P + m;
  const pick = (list) => list[Math.floor(rng.next() * list.length)];
  const tall = [];                                              // footprints of tall things, so they don't overlap
  const clearOf = (x, z, r) => tall.every((t) => Math.hypot(t.x - x, t.z - z) > t.r + r);

  // ---------------------------------------------------------------- flat ground: roads, fields, crop rows, ponds
  const flat = [];                                              // { x, z, w, d, h, color }
  const roads = [];
  if (R.roads && lanes.lx.length && lanes.lz.length) {
    const mid = (a) => a[Math.floor(a.length / 2)];
    roads.push({ alongX: true, c: mid(lanes.lz), from: -P - 280, to: -P });            // leaves town to -x (ends at the plate)
    roads.push({ alongX: false, c: mid(lanes.lx), from: -P - 280, to: -P });           // leaves town to -z
    for (const r of roads) {
      const len = r.to - r.from, cen = (r.to + r.from) / 2;
      flat.push(r.alongX ? { x: cen, z: r.c, w: len, d: 6.5, h: LAYER.road, color: W.asphalt } : { x: r.c, z: cen, w: 6.5, d: len, h: LAYER.road, color: W.asphalt });
      for (let v = r.from + 2; v < r.to - 2; v += 6) flat.push(r.alongX ? { x: v, z: r.c, w: 2.2, d: 0.35, h: LAYER.dash, color: W.dash } : { x: r.c, z: v, w: 0.35, d: 2.2, h: LAYER.dash, color: W.dash });
    }
  }
  const onRoad = (x, z, m) => roads.some((r) => (r.alongX ? Math.abs(z - r.c) < 3.25 + m && x < r.to + m : Math.abs(x - r.c) < 3.25 + m && z < r.to + m));
  if (R.fields > 0) {
    const cell = 17, reach = P + 95;
    for (let gx = -reach; gx < reach; gx += cell) for (let gz = -reach; gz < reach; gz += cell) {
      const x = gx + cell / 2, z = gz + cell / 2;
      if (!outside(x, z, cell / 2 + 4) || Math.hypot(x, z) > reach || onRoad(x, z, cell / 2) || rng.next() > R.fields) continue;
      const w = cell - rng.range(1.6, 3), d = cell - rng.range(1.6, 3), color = pick(R.crops);
      flat.push({ x, z, w, d, h: LAYER.field, color });
      if (rng.next() < R.rows) {                                // crop rows: darker stripes across the field
        const dark = new Color(color).multiplyScalar(0.82).getStyle(), alongX = rng.next() < 0.5;
        for (let k = -2; k <= 2; k++) flat.push(alongX ? { x, z: z + k * d * 0.18, w: w * 0.9, d: d * 0.07, h: LAYER.row, color: dark } : { x: x + k * w * 0.18, z, w: w * 0.07, d: d * 0.9, h: LAYER.row, color: dark });
      }
    }
  }
  for (let k = 0; k < (R.ponds ?? 0); k++) {
    for (let t = 0; t < 20; t++) {
      const a = rng.range(0, TAU), r = P + rng.range(14, 60), x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!outside(x, z, 10) || onRoad(x, z, 8)) continue;
      flat.push({ x, z, w: rng.range(10, 18), d: rng.range(7, 12), h: LAYER.pond, color: "#bfe4f7" });
      break;
    }
  }

  // ---------------------------------------------------------------- tall things: hills / mountains / dunes, mesas, windmills
  const mounds = [], peaks = [];                               // { x, z, r, h, rot, sx, color, y }
  const hs = R.hillScale ?? 1;
  for (let k = 0; k < 400 && mounds.length + peaks.length / 2 < R.hills; k++) {
    const a = rng.range(0, TAU), x0 = Math.cos(a), z0 = Math.sin(a);
    if (R.peaks) {
      // low-poly mountains: a faceted rock cone, and a white cone of the same slope on its top third = the snow cap
      const r = rng.range(18, 34), dist = P + rng.range(70, 200), x = x0 * dist, z = z0 * dist;
      if (!behind(x, z) || !outside(x, z, r + 6) || onRoad(x, z, r) || !clearOf(x, z, r * 0.7)) continue;
      tall.push({ x, z, r: r * 0.7 });
      const h = r * rng.range(0.9, 1.4), rot = rng.range(0, TAU), sx = rng.range(0.85, 1.2);
      peaks.push({ x, z, r, h, rot, sx, color: pick(R.hill), y: -0.5 });
      // the cap is a touch wider and taller than the mountain's top (never the same surface: no z-fighting)
      peaks.push({ x, z, r: r * 0.48, h: h * 0.47, rot, sx, color: R.cap, y: -0.5 + h * 0.56 });
      continue;
    }
    const dist = P + rng.range(45, 190), x = x0 * dist, z = z0 * dist;
    const r = rng.range(14, 30) * hs, h = R.dunes ? r * rng.range(0.12, 0.18) : r * rng.range(0.35, 0.7);
    if (!behind(x, z) || !outside(x, z, r + 6) || onRoad(x, z, r) || !clearOf(x, z, r * 0.7)) continue;
    tall.push({ x, z, r: r * 0.7 });
    mounds.push({ x, z, r, h, rot: rng.range(0, TAU), sx: R.dunes ? rng.range(1.3, 1.8) : rng.range(0.85, 1.25), color: pick(R.hill), y: -h * (R.dunes ? 0.3 : 0.18) });
  }
  const mesas = [];
  for (let k = 0; k < 300 && mesas.length < (R.mesas ?? 0); k++) {
    const a = rng.range(0, TAU), dist = P + rng.range(40, 160), x = Math.cos(a) * dist, z = Math.sin(a) * dist;
    const r = rng.range(10, 20);
    if (!behind(x, z) || !outside(x, z, r + 4) || onRoad(x, z, r) || !clearOf(x, z, r)) continue;
    tall.push({ x, z, r });
    mesas.push({ x, z, r, h: rng.range(12, 24), rot: rng.range(0, TAU) });
  }
  const mills = [];
  for (let k = 0; k < 200 && mills.length < (R.windmills ?? 0); k++) {
    const a = rng.range(0, TAU), dist = P + rng.range(22, 60), x = Math.cos(a) * dist, z = Math.sin(a) * dist;
    if (!behind(x, z) || !outside(x, z, 8) || onRoad(x, z, 6) || !clearOf(x, z, 6)) continue;
    tall.push({ x, z, r: 5 });
    mills.push({ x, z, face: Math.atan2(camDir.x, camDir.z) + rng.range(-0.5, 0.5), speed: rng.range(0.6, 0.9), phase: rng.range(0, TAU) });
  }

  // ---------------------------------------------------------------- groves and scattered trees, cacti, rocks
  for (let g = 0; g < R.groves; g++) {
    for (let t = 0; t < 40; t++) {
      const a = rng.range(0, TAU), dist = P + rng.range(14, 80), cx = Math.cos(a) * dist, cz = Math.sin(a) * dist;
      if (!behind(cx, cz) || !outside(cx, cz, 9) || onRoad(cx, cz, 9) || !clearOf(cx, cz, 9)) continue;
      tall.push({ x: cx, z: cz, r: 7 });
      const n = 4 + Math.floor(rng.next() * 5);
      for (let i = 0; i < n && trees.length < 50; i++) {
        const x = cx + rng.range(-7, 7), z = cz + rng.range(-7, 7);
        if (outside(x, z, 3) && !onRoad(x, z, 2)) trees.push({ kind: rng.next() < R.pines ? "coneTree" : "roundTree", x, z, s: rng.range(1.7, 2.7), r: rng.range(0, TAU) });
      }
      break;
    }
  }
  for (let k = 0; k < 200 && trees.length < 64 && R.groves > 0; k++) {
    const a = rng.range(0, TAU), dist = P + rng.range(8, 110), x = Math.cos(a) * dist, z = Math.sin(a) * dist;
    if (!behind(x, z) || !outside(x, z, 4) || onRoad(x, z, 3) || !clearOf(x, z, 2)) continue;
    trees.push({ kind: rng.next() < R.pines ? "coneTree" : "roundTree", x, z, s: rng.range(1.8, 2.8), r: rng.range(0, TAU) });
  }
  const cacti = [];
  for (let k = 0; k < 400 && cacti.length < (R.cacti ?? 0); k++) {
    const a = rng.range(0, TAU), dist = P + rng.range(6, 90), x = Math.cos(a) * dist, z = Math.sin(a) * dist;
    if (!outside(x, z, 4) || onRoad(x, z, 2) || !clearOf(x, z, 2)) continue;
    cacti.push({ x, z, s: rng.range(1.6, 2.6), r: rng.range(0, TAU) });
  }
  const rocks = [];
  for (let k = 0; k < 300 && rocks.length < R.rocks; k++) {
    const a = rng.range(0, TAU), dist = P + rng.range(5, 70), x = Math.cos(a) * dist, z = Math.sin(a) * dist;
    if (!outside(x, z, 3) || onRoad(x, z, 2) || !clearOf(x, z, 2)) continue;
    rocks.push({ x, z, s: rng.range(0.7, 2.2), r: rng.range(0, TAU) });
  }

  // ---------------------------------------------------------------- sea: boats sailing round the city's island
  const boats = [];
  const loop = P + 8 + 3 + 3.5;                                // half-size of the boats' rounded-square route (islands.js: rim 8, beach 3)
  for (let k = 0; k < (R.boats ?? 0); k++) boats.push({ s0: rng.range(0, 1), speed: rng.range(2.2, 3.4) * (k % 2 ? 1 : -1), off: rng.range(-1.2, 1.2), sail: pick(["#ffffff", "#ff7e8a", "#ffd23f", "#7fd0ff"]) });

  // ---------------------------------------------------------------- meshes
  const material = (opts) => { const m = new MeshStandardMaterial({ roughness: 0.9, ...opts }); own.push(m); return m; };
  const add = (geo, list, name, place, color, matOpts = {}) => {
    if (!list.length) { geo.dispose(); return null; }
    own.push(geo);
    const mesh = new InstancedMesh(geo, material(matOpts), list.length);
    mesh.name = name;
    mesh.receiveShadow = true;
    list.forEach((it, i) => { place(it); mesh.setMatrixAt(i, _m); if (color) mesh.setColorAt(i, _c.set(color(it))); });
    group.add(mesh);
    return mesh;
  };
  add(new BoxGeometry(1, 1, 1).translate(0, 0.5, 0), flat, "scenery-ground", (f) => _m.compose(_p.set(f.x, -0.05, f.z), ID, _s.set(f.w, f.h, f.d)), (f) => f.color);
  // hills: a faceted half-icosahedron, sunk into the ground
  add(new IcosahedronGeometry(1, 1), mounds, "scenery-hills",
    (h) => _m.compose(_p.set(h.x, h.y, h.z), _q.setFromAxisAngle(UP, h.rot), _s.set(h.r * h.sx, h.h, h.r)), (h) => h.color, { flatShading: true });
  add(new ConeGeometry(1, 1, 7, 1).translate(0, 0.5, 0), peaks, "scenery-mountains",
    (h) => _m.compose(_p.set(h.x, h.y, h.z), _q.setFromAxisAngle(UP, h.rot), _s.set(h.r * h.sx, h.h, h.r)), (h) => h.color, { flatShading: true });
  add(mergeGeometries([
    paint(new CylinderGeometry(0.88, 1, 0.82, 7), "#c9774f", { y: 0.41 }),
    paint(new CylinderGeometry(0.86, 0.88, 0.06, 7), "#e9a46e", { y: 0.85 }),
    paint(new CylinderGeometry(0.66, 0.86, 0.14, 7), "#d98a5c", { y: 0.95 }),
  ]), mesas, "scenery-mesas", (m) => _m.compose(_p.set(m.x, 0, m.z), _q.setFromAxisAngle(UP, m.rot), _s.set(m.r, m.h, m.r)), null, { vertexColors: true, flatShading: true });
  add(mergeGeometries([
    paint(new CylinderGeometry(0.32, 0.38, 3, 6), "#4f9f55", { y: 1.5 }),
    paint(new CylinderGeometry(0.2, 0.22, 1.1, 5, 1, true), "#4f9f55", { x: 0.62, y: 1.1, rz: Math.PI / 2 }),
    paint(new CylinderGeometry(0.2, 0.22, 1.0, 5), "#5aab5c", { x: 1.15, y: 1.55 }),
    paint(new CylinderGeometry(0.18, 0.2, 0.8, 5, 1, true), "#4f9f55", { x: -0.5, y: 1.7, rz: Math.PI / 2 }),
    paint(new CylinderGeometry(0.18, 0.2, 0.8, 5), "#5aab5c", { x: -0.92, y: 2.05 }),
  ]), cacti, "scenery-cacti", (c) => _m.compose(_p.set(c.x, 0, c.z), _q.setFromAxisAngle(UP, c.r), _s.setScalar(c.s)), null, { vertexColors: true });
  add(new DodecahedronGeometry(1, 0), rocks, "scenery-rocks",
    (r) => _m.compose(_p.set(r.x, r.s * 0.25, r.z), _q.setFromAxisAngle(UP, r.r), _s.set(r.s * 1.2, r.s * 0.7, r.s)), () => R.rock, { flatShading: true });
  const millTowers = add(mergeGeometries([
    paint(new CylinderGeometry(1.1, 1.7, 7, 8), "#f4efe6", { y: 3.5 }),
    paint(new ConeGeometry(1.45, 2.2, 8), "#c75b4b", { y: 8.1 }),
    paint(new BoxGeometry(0.9, 1.4, 0.2), "#7a5a45", { y: 0.7, z: 1.55 }),
  ]), mills, "scenery-windmills", (w) => _m.compose(_p.set(w.x, 0, w.z), _q.setFromAxisAngle(UP, w.face), _s.setScalar(1)), null, { vertexColors: true });
  const millBlades = add(mergeGeometries([0, 1, 2, 3].map((k) => {
    const g = paint(new BoxGeometry(0.55, 4.4, 0.08), "#fffaf0", { y: 2.4 });
    g.rotateZ((k * Math.PI) / 2);
    return g;
  })), mills, "scenery-windmill-blades", () => _m.identity(), null, { vertexColors: true });
  const boatMesh = add(mergeGeometries([
    paint(new BoxGeometry(1.5, 0.6, 3.6), "#8a5a3c", { y: 0.15 }),
    paint(new BoxGeometry(1.2, 0.12, 3.2), "#e9d3a8", { y: 0.5 }),
    paint(new CylinderGeometry(0.06, 0.07, 3.4, 4), "#5b4636", { y: 2.1, z: 0.2 }),
    paint(new ConeGeometry(1.1, 2.9, 3), "#ffffff", { y: 2.2, z: -0.25 }),
  ]), boats, "scenery-boats", () => _m.identity(), (b) => b.sail, { vertexColors: true, roughness: 0.7 });
  if (millTowers) millTowers.castShadow = false;

  // a point on the boats' rounded-square route, and the heading there
  const corner = 9, side = loop - corner, edge = side * 2, quarter = edge + (Math.PI / 2) * corner, perim = quarter * 4;
  function route(s, out) {
    s = ((s % perim) + perim) % perim;
    const k = Math.floor(s / quarter), u = s - k * quarter;
    let x, z, hx, hz;
    if (u < edge) { x = loop; z = -side + u; hx = 0; hz = 1; }
    else { const a = (u - edge) / corner; x = side + Math.cos(a) * corner; z = side + Math.sin(a) * corner; hx = -Math.sin(a); hz = Math.cos(a); }
    for (let i = 0; i < k; i++) { [x, z] = [-z, x]; [hx, hz] = [-hz, hx]; }   // rotate the quarter into place
    out.x = x; out.z = z; out.hx = hx; out.hz = hz;
    return out;
  }
  const pt = { x: 0, z: 0, hx: 0, hz: 1 };

  function update(time) {
    if (millBlades) {
      mills.forEach((w, i) => {
        _q.setFromAxisAngle(UP, w.face).multiply(_spin.setFromAxisAngle(FWD, time * w.speed + w.phase));
        _m.compose(_p.set(w.x + Math.sin(w.face) * 1.75, 6.6, w.z + Math.cos(w.face) * 1.75), _q, _s.setScalar(1));
        millBlades.setMatrixAt(i, _m);
      });
      millBlades.instanceMatrix.needsUpdate = true;
    }
    if (boatMesh) {
      boats.forEach((b, i) => {
        route(b.s0 * perim + time * b.speed, pt);
        const dir = Math.sign(b.speed), yaw = Math.atan2(pt.hx * dir, pt.hz * dir);
        const nx = pt.hz, nz = -pt.hx;                          // sideways offset off the route
        _q.setFromAxisAngle(UP, yaw);
        _m.compose(_p.set(pt.x + nx * b.off, -1.0 + Math.sin(time * 1.6 + i) * 0.08, pt.z + nz * b.off), _q, _s.setScalar(1.25));
        boatMesh.setMatrixAt(i, _m);
      });
      boatMesh.instanceMatrix.needsUpdate = true;
    }
  }
  update(0);

  const sky = W.scenery === "sky" ? createSkyWorld({ rng, plate, camDir }) : null;
  if (sky) { group.add(sky.group); trees.push(...sky.trees); }

  return {
    group, trees,
    update(time) { update(time); sky?.update(time); },
    layers: flat.map((f) => ({ x: f.x, z: f.z, w: f.w, d: f.d, top: -0.05 + f.h, color: f.color })),
    peaks,
    counts: { flat: flat.length, mounds: mounds.length, peaks: peaks.length, mesas: mesas.length, mills: mills.length, trees: trees.length, cacti: cacti.length, rocks: rocks.length, boats: boats.length, sky: sky?.counts },
    dispose() { for (const r of own) r.dispose?.(); sky?.dispose(); },
  };
}
