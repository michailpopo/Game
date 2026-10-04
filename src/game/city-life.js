/**
 * City life: what makes the toy city look lived in.
 *
 *   - Parks: every empty lot becomes a small park - a lawn tile with paving paths, and one of three layouts
 *     (fountain plaza, grove, pond), with benches, a lamp, flower bushes and trees. Neighbouring park lots line up
 *     their paths, so bigger empty areas read as one park.
 *   - Lamps along the sidewalk rims of the blocks.
 *   - People: little pawns walking back and forth on park paths and along the block rims (only where no building
 *     stands on the rim).
 *   - Cars driving along the avenues (two lanes on wide avenues and the ring road, one-way in the middle of narrow
 *     ones), shrinking in and out at the plate edge.
 *
 * Built like the rest of the city: one InstancedMesh per prop type (flat ground pieces 1, benches 1, lamps 1,
 * fountains 1, bushes 1, people 2 (bodies + heads), cars 1 = 8 draw calls), no shadow casting, counts capped so a
 * 300-building city stays inside the profile M frame budget. People and cars move by per-frame instance matrices
 * driven by the view time (frozen together with the effects for QA stills).
 */

import { BoxGeometry, Color, CylinderGeometry, Float32BufferAttribute, Group, IcosahedronGeometry, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, SphereGeometry, Vector3 } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const CAP = { dressedParks: 40, benches: 40, lamps: 36, bushes: 64, fountains: 6, walkers: 32, cars: 18, trees: 70 };
const FLOWERS = ["#ff7eb6", "#ffd23f", "#ffffff", "#ff8c5a", "#b98cff", "#6fd07a"];
const SHIRTS = ["#ff5a5f", "#4f8dff", "#ffd23f", "#3fd07a", "#ff9f40", "#9d6bff", "#ffffff", "#2a2f45"];
const SKIN = ["#f6d2b8", "#e0ac86", "#b97f5a", "#8a5a3c"];

/** A part with vertex colour, moved into place (non-indexed, no uv). */
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

function geometries() {
  const wood = "#c98a4b", iron = "#3b3f5c", stone = "#dfe1ec", water = "#79c9ff";
  return {
    ground: new BoxGeometry(1, 1, 1).translate(0, 0.5, 0),     // flat pieces: 12 triangles
    car: mergeGeometries([                                     // toy car, faces +z: 48 triangles
      paint(new BoxGeometry(1.5, 0.62, 3), "#ffffff", { y: 0.58 }),
      paint(new BoxGeometry(1.24, 0.52, 1.5), "#dfe6ff", { y: 1.15, z: -0.2 }),
      paint(new BoxGeometry(1.62, 0.5, 0.56), "#2a2f45", { y: 0.3, z: 0.95 }),
      paint(new BoxGeometry(1.62, 0.5, 0.56), "#2a2f45", { y: 0.3, z: -0.95 }),
    ]),
    bench: mergeGeometries([                                   // faces +z, 1.6 m long
      paint(new BoxGeometry(1.6, 0.1, 0.5), wood, { y: 0.45 }),
      paint(new BoxGeometry(1.6, 0.42, 0.09), wood, { y: 0.74, z: -0.22 }),
      paint(new BoxGeometry(0.1, 0.45, 0.45), iron, { x: -0.68, y: 0.22 }),
      paint(new BoxGeometry(0.1, 0.45, 0.45), iron, { x: 0.68, y: 0.22 }),
    ]),
    lamp: mergeGeometries([
      paint(new CylinderGeometry(0.07, 0.1, 3.3, 5, 1, true), iron, { y: 1.65 }),
      paint(new IcosahedronGeometry(0.3, 0), "#fff4c2", { y: 3.45 }),
    ]),
    fountain: mergeGeometries([
      paint(new CylinderGeometry(1.75, 1.85, 0.45, 14), stone, { y: 0.22 }),
      paint(new CylinderGeometry(1.48, 1.48, 0.06, 14), water, { y: 0.43 }),
      paint(new CylinderGeometry(0.2, 0.28, 1.0, 6), stone, { y: 0.9 }),
      paint(new CylinderGeometry(0.62, 0.32, 0.22, 10), stone, { y: 1.4 }),
      paint(new CylinderGeometry(0.02, 0.2, 0.55, 6), "#d4f0ff", { y: 1.78 }),
    ]),
    bush: paint(new IcosahedronGeometry(0.62, 0), "#ffffff", { y: 0.45 }),
    body: mergeGeometries([
      paint(new CylinderGeometry(0.17, 0.2, 0.5, 6), "#3a3f5c", { y: 0.25 }),     // legs (dark trousers)
      paint(new CylinderGeometry(0.24, 0.3, 0.62, 7), "#ffffff", { y: 0.8 }),     // shirt: the instance colour
    ]),
    head: paint(new SphereGeometry(0.22, 7, 5), "#ffffff", { y: 1.33 }),
  };
}

const _m = new Matrix4(), _p = new Vector3(), _s = new Vector3(), _q = new Quaternion(), _c = new Color();
const UP = new Vector3(0, 1, 0), ID = new Quaternion();

/**
 * @param {object} o
 *   city, bs (buildings), rng (look stream), W (theme.world), base (pad top y), pitch (lot pitch),
 *   lanes { lx, lz, span, avenue }: avenue centre lines (x of north-south lanes, z of east-west lanes; the first and
 *   last are the ring road outside the blocks), their half length and the avenue width,
 *   camDir {x, z}: unit ground direction towards the camera
 * @returns {{ group: Group, trees: object[], update(time:number):void, dispose():void }}
 */
export function createCityLife({ city, bs, rng, W, base, pitch, lanes, camDir }) {
  const geo = geometries();
  const own = [...Object.values(geo)];
  const group = new Group();
  const lawnColor = W.park ?? "#86cf63";
  const pathColor = new Color(W.pad).lerp(new Color("#b7b2c6"), 0.3).getStyle();

  // ---------------------------------------------------------------- parks on the empty lots
  const ground = [], trees = [], benches = [], lamps = [], fountains = [], bushes = [], walkers = [];
  const vis = (b) => ({ hw: Math.min(7.6, b.w * 1.1) / 2 + 0.35, hd: Math.min(7.6, b.d * 1.1) / 2 + 0.35 });
  // nothing may stand in a building (neighbours can lean 0.85 m into an empty lot)
  const free = (x, z, r) => !bs.some((b) => { const v = vis(b); return Math.abs(b.x - x) < v.hw + r && Math.abs(b.z - z) < v.hd + r; });
  const tree = (x, z, s) => trees.length < CAP.trees && free(x, z, s * 1.1) && trees.push({ kind: rng.next() < 0.6 ? "roundTree" : "coneTree", x, z, s, r: rng.range(0, 6.28) });
  const bush = (x, z) => bushes.length < CAP.bushes && free(x, z, 0.7) && bushes.push({ x, z, s: rng.range(0.75, 1.15), r: rng.range(0, 6.28), color: FLOWERS[Math.floor(rng.next() * FLOWERS.length)] });
  const bench = (x, z, r) => benches.length < CAP.benches && free(x, z, 0.9) && benches.push({ x, z, r });
  const lamp = (x, z) => lamps.length < CAP.lamps && free(x, z, 0.45) && lamps.push({ x, z });
  // Empty lots, nearest to the camera first: the capped park dressing goes where the player looks.
  const empty = [];
  for (const d of city.districts) {
    const lots = Math.max(1, Math.round(d.w / pitch)), cell = d.w / lots;
    for (let lzI = 0; lzI < lots; lzI++) for (let lxI = 0; lxI < lots; lxI++) {
      const x = d.x - d.w / 2 + (lxI + 0.5) * cell, z = d.z - d.d / 2 + (lzI + 0.5) * cell;
      if (bs.some((b) => { const v = vis(b); return Math.abs(b.x - x) < cell / 2 + v.hw - 1 && Math.abs(b.z - z) < cell / 2 + v.hd - 1; })) continue;
      empty.push({ x, z, cell, front: x * camDir.x + z * camDir.z });
    }
  }
  empty.sort((p, q) => q.front - p.front);
  let dressed = 0;
  for (const { x, z, cell } of empty) {
    {
      const L = cell;                                            // lawn side: neighbouring park lots join into one lawn
      ground.push({ x, z, w: L, d: L, y: base, h: 0.08, color: lawnColor });
      if (dressed >= CAP.dressedParks) {
        tree(x + rng.range(-1.5, 1.5), z + rng.range(-1.5, 1.5), rng.range(1.6, 2.1));
        bush(x + rng.range(-3, 3), z + rng.range(-3, 3));
        continue;
      }
      dressed++;
      const kind = fountains.length < CAP.fountains && rng.next() < 0.3 ? "fountain" : rng.next() < 0.6 ? "grove" : "pond";
      const along = rng.next() < 0.5;                            // the main path runs along x (true) or z
      const pathTop = base + 0.1;
      const path = (ax) => ground.push(ax ? { x, z, w: L, d: 1.5, y: base, h: 0.1, color: pathColor } : { x, z, w: 1.5, d: L, y: base, h: 0.1, color: pathColor });
      const q = L * 0.3;                                         // quadrant offset
      if (kind === "fountain") {
        path(true); path(false);
        fountains.push({ x, z });
        bench(x - q, z - q, Math.PI / 4); bench(x + q, z + q, Math.PI + Math.PI / 4);
        tree(x + q, z - q, rng.range(1.5, 1.9)); tree(x - q, z + q, rng.range(1.5, 1.9));
        for (const [sx, sz] of [[-1, -1], [1, 1]]) bush(x + sx * (q + 1.6), z + sz * (q - 1.2));
        lamp(x + L * 0.42, z + L * 0.42);
        walkers.push({ ax: x - L * 0.45, az: z, bx: x - 2.1, bz: z, y: pathTop });   // strolls to the fountain and back
      } else if (kind === "grove") {
        path(along);
        const side = along ? [[0, 1], [0, -1]] : [[1, 0], [-1, 0]];
        tree(x - q + rng.range(-0.4, 0.4), z + (along ? q : -q), rng.range(1.6, 2.2));
        tree(x + q + rng.range(-0.4, 0.4), z + (along ? -q : q), rng.range(1.6, 2.2));
        const [ox, oz] = side[0];
        bench(x + ox * 1.35 + (along ? -1.2 : 0), z + oz * 1.35 + (along ? 0 : -1.2), along ? Math.PI : -Math.PI / 2);
        bush(x + q, z + (along ? q : -q)); bush(x - q, z + (along ? -q : q)); bush(x + q * 1.2, z + (along ? q * 0.4 : -q * 0.4));
        lamp(x + (along ? L * 0.1 : 1.2), z + (along ? 1.2 : L * 0.1));
        walkers.push(along ? { ax: x - L * 0.45, az: z, bx: x + L * 0.45, bz: z, y: pathTop } : { ax: x, az: z - L * 0.45, bx: x, bz: z + L * 0.45, y: pathTop });
      } else {
        path(along);
        const px = x + (along ? 0 : 1.6), pz = z + (along ? 1.6 : 0);
        ground.push({ x: px, z: pz, w: along ? 4.2 : 2.8, d: along ? 2.8 : 4.2, y: base, h: 0.11, color: W.water?.shallow ?? "#6fc3f0" });
        bush(px + (along ? 2.4 : 0.9), pz + (along ? 0.9 : 2.4)); bush(px - (along ? 2.4 : 0.9), pz - (along ? 0.9 : 2.4));
        tree(x + (along ? -q : -q), z + (along ? -q : q), rng.range(1.6, 2.1));
        bench(x + (along ? q : -1.3), z + (along ? -1.3 : q), along ? 0 : Math.PI / 2);
        lamp(x - (along ? L * 0.35 : 1.2), z - (along ? 1.2 : L * 0.35));
      }
    }
  }

  // ---------------------------------------------------------------- the block rims: lamps and sidewalk walkers
  // A rim is the pad's border strip (pads are 0.8 m wider than the lots on each side). Free stretches = no building on it.
  const rims = [];
  for (const d of city.districts) {
    const o = d.w / 2 + 0.42;
    for (const [nx, nz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const alongX = nz !== 0, c = alongX ? d.z + nz * o : d.x + nx * o, lo = (alongX ? d.x : d.z) - d.w / 2, hi = lo + d.w;
      const blocked = [];
      for (const b of bs) {
        const v = vis(b);
        if (alongX ? Math.abs(b.z - c) < v.hd + 0.3 : Math.abs(b.x - c) < v.hw + 0.3) blocked.push(alongX ? [b.x - v.hw, b.x + v.hw] : [b.z - v.hd, b.z + v.hd]);
      }
      blocked.sort((a, b) => a[0] - b[0]);
      let at = lo;
      for (const [b0, b1] of [...blocked, [hi, hi]]) {
        if (b0 - at >= 5) rims.push({ alongX, c, a: at + 0.6, b: b0 - 0.6, nx, nz });
        at = Math.max(at, b1);
      }
    }
  }
  for (const r of rims) {
    for (let v = r.a + 2; v < r.b - 1 && lamps.length < CAP.lamps; v += 13) if (rng.next() < 0.55) lamp(r.alongX ? v : r.c, r.alongX ? r.c : v);
  }
  const walkRims = rims.filter((r) => r.b - r.a >= 6);
  for (let k = 0; k < walkRims.length * 2 && walkers.length < CAP.walkers; k++) {
    const r = walkRims[Math.floor(rng.next() * walkRims.length)];
    walkers.push(r.alongX ? { ax: r.a, az: r.c, bx: r.b, bz: r.c, y: base } : { ax: r.c, az: r.a, bx: r.c, bz: r.b, y: base });
  }
  for (const w of walkers) {
    w.len = Math.hypot(w.bx - w.ax, w.bz - w.az);
    w.speed = rng.range(1.0, 1.5);
    w.phase = rng.range(0, 1000);
    w.shirt = SHIRTS[Math.floor(rng.next() * SHIRTS.length)];
    w.skin = SKIN[Math.floor(rng.next() * SKIN.length)];
    w.scale = rng.range(1.2, 1.38);                            // toy proportions: readable from the city camera
  }

  // ---------------------------------------------------------------- cars on the avenues
  // Narrow avenues (the road between two pads is avenue - 1.6 m) are one-way streets with the car in the middle;
  // wide ones have two lanes. The ring road outside the blocks is always wide enough for two.
  const cars = [];
  const laneDirs = [];
  const road = lanes.avenue - 1.6, twoWay = road >= 5.2;
  const addLanes = (list, alongX) => list.forEach((c, i) => {
    const ring = i === 0 || i === list.length - 1;
    if (twoWay || ring) for (const side of [1, -1]) laneDirs.push({ alongX, c, side, off: 1.45 * side, scale: 1.35 });
    else laneDirs.push({ alongX, c, side: i % 2 ? 1 : -1, off: 0, scale: Math.min(1.35, (road - 0.3) / 1.5) });
  });
  addLanes(lanes.lx, false);
  addLanes(lanes.lz, true);
  for (let k = 0; k < laneDirs.length && cars.length < CAP.cars; k++) {
    const L = laneDirs[(k * 7) % laneDirs.length];
    const per = laneDirs.length * 2 <= CAP.cars ? 2 : 1;
    for (let j = 0; j < per && cars.length < CAP.cars; j++) cars.push({ ...L, speed: rng.range(5.5, 7.5), offset: rng.range(0, 1) + j * 0.5, color: SHIRTS[Math.floor(rng.next() * 6)] });
  }

  // ---------------------------------------------------------------- meshes
  const mat = (opts = {}) => { const m = new MeshStandardMaterial({ vertexColors: true, roughness: 0.85, ...opts }); own.push(m); return m; };
  const instanced = (g, list, name, place, color, plain = false) => {
    if (!list.length) return null;
    // plain: the geometry has no vertex colours (the instance colour alone), else WebGL reads them as black
    const mesh = new InstancedMesh(g, plain ? (() => { const m = new MeshStandardMaterial({ roughness: 0.9 }); own.push(m); return m; })() : mat(), list.length);
    mesh.name = name;
    mesh.receiveShadow = true;
    list.forEach((it, i) => { place(it); mesh.setMatrixAt(i, _m); if (color) mesh.setColorAt(i, _c.set(color(it))); });
    group.add(mesh);
    return mesh;
  };
  instanced(geo.ground, ground, "park-ground", (g) => _m.compose(_p.set(g.x, g.y, g.z), ID, _s.set(g.w, g.h, g.d)), (g) => g.color, true);
  instanced(geo.bench, benches, "benches", (b) => _m.compose(_p.set(b.x, base, b.z), _q.setFromAxisAngle(UP, b.r), _s.setScalar(1)));
  instanced(geo.lamp, lamps, "lamps", (l) => _m.compose(_p.set(l.x, base, l.z), ID, _s.setScalar(1)));
  instanced(geo.fountain, fountains, "fountains", (f) => _m.compose(_p.set(f.x, base, f.z), ID, _s.setScalar(1)));
  instanced(geo.bush, bushes, "flower-bushes", (b) => _m.compose(_p.set(b.x, base, b.z), _q.setFromAxisAngle(UP, b.r), _s.set(b.s, b.s * 0.8, b.s)), (b) => b.color);
  const bodies = instanced(geo.body, walkers, "people", () => _m.identity(), (w) => w.shirt);
  const heads = instanced(geo.head, walkers, "people-heads", () => _m.identity(), (w) => w.skin);
  const carMesh = cars.length ? new InstancedMesh(geo.car, mat({ roughness: 0.45 }), cars.length) : null;
  if (carMesh) {
    carMesh.name = "cars";
    cars.forEach((c, i) => carMesh.setColorAt(i, _c.set(c.color)));
    group.add(carMesh);
  }

  function update(time) {
    if (bodies) {
      walkers.forEach((w, i) => {
        // ping-pong along the segment, facing the way it walks, with a little bounce and sway
        const u = (w.phase + time * w.speed) / w.len, k = u % 2, f = k < 1 ? k : 2 - k, dir = k < 1 ? 1 : -1;
        const x = w.ax + (w.bx - w.ax) * f, z = w.az + (w.bz - w.az) * f;
        const yaw = Math.atan2((w.bx - w.ax) * dir, (w.bz - w.az) * dir);
        const step = time * w.speed * 5 + w.phase;
        _q.setFromAxisAngle(UP, yaw);
        _m.compose(_p.set(x, w.y + Math.abs(Math.sin(step)) * 0.07, z), _q, _s.setScalar(w.scale));
        bodies.setMatrixAt(i, _m);
        heads.setMatrixAt(i, _m);
      });
      bodies.instanceMatrix.needsUpdate = true;
      heads.instanceMatrix.needsUpdate = true;
    }
    if (carMesh) {
      const span = lanes.span, len = span * 2;
      cars.forEach((c, i) => {
        const v = -span + (((c.offset * len + time * c.speed) % len) + len) % len;      // along the lane, its direction
        const along = v * c.side;
        const grow = Math.min(1, (span - Math.abs(along)) / 4);                        // shrink in / out at the plate edge
        const x = c.alongX ? along : c.c + c.off, z = c.alongX ? c.c + c.off : along;
        const r = c.alongX ? (c.side > 0 ? Math.PI / 2 : -Math.PI / 2) : (c.side > 0 ? 0 : Math.PI);
        carMesh.setMatrixAt(i, _m.compose(_p.set(x, 0.1, z), _q.setFromAxisAngle(UP, r), _s.setScalar(c.scale * Math.max(0.001, grow))));
      });
      carMesh.instanceMatrix.needsUpdate = true;
    }
  }
  update(0);

  return {
    group, trees, update,
    counts: { parks: dressed, lawns: ground.length, benches: benches.length, lamps: lamps.length, bushes: bushes.length, fountains: fountains.length, walkers: walkers.length, cars: cars.length },
    dispose() { for (const r of own) r.dispose?.(); },
  };
}
