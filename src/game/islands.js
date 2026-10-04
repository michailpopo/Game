/**
 * Islands for the water themes (look.js world.water), so nothing grows on the sea.
 *
 *   - The city's island follows the city: a square with softly rounded corners, parallel to the asphalt plate.
 *     Grass (y = 0, the city's ground) and a sand beach one step down - concentric rounded squares, so the beach
 *     has the same width all the way round.
 *   - Up to 9 islets behind and beside the city: round, slightly irregular outlines (an ellipse wobbled by three
 *     low harmonics), with the same grass / sand bands. They carry the scenery trees.
 *
 * planIslands() is pure (outlines + trees; tools/qa/check-city.mjs tests it in Node). islandMeshes() turns the
 * outlines into 2 merged meshes (grass, sand) = 2 draw calls, each well under 2,000 triangles. The water around them
 * (shallow colour, foam line, waves rolling in) is drawn by the sea's shader (water.js) from shoreField().
 */

import { BufferGeometry, Float32BufferAttribute, Mesh, MeshStandardMaterial } from "three";

export const WATER_Y = -1.0;               // sea level (land themes keep their field at -0.05)
export const SAND_TOP = -0.45;             // the beach: one 0.45 m step below the grass
const WALL_FOOT = WATER_Y - 0.1;           // walls end just under the water line

const MAIN = { rim: 8, beach: 3, shallow: 5.5, corner: 4, cornerSegments: 6 };   // metres (shallow: water kept free around it)
const ISLET = { beach: 1.4, shallow: 2.8, segments: 20, max: 9 };
const TAU = Math.PI * 2;

// ------------------------------------------------------------------ outlines: [x, z] points, counter-clockwise
// (angle growing from +x towards +z). Every band of one island has the same point count, point i facing point i.

/** A rounded square/rectangle centred on (cx, cz); offsetting it by d = the same call with hw + d, hd + d, r + d. */
export function roundedRect(cx, cz, hw, hd, r, seg) {
  const pts = [];
  const corners = [[hw - r, hd - r, 0], [-(hw - r), hd - r, TAU / 4], [-(hw - r), -(hd - r), TAU / 2], [hw - r, -(hd - r), TAU * 0.75]];
  for (const [ox, oz, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (TAU / 4);
      pts.push([cx + ox + Math.cos(a) * r, cz + oz + Math.sin(a) * r]);
    }
  }
  return pts;
}

/** Radius at a world angle of a round, irregular islet: an ellipse wobbled by +-18% at most (never star-shaped). */
function blobRadius(rng, rx, rz) {
  const rot = rng.range(0, Math.PI);
  const waves = [[2, rng.range(0.03, 0.08), rng.range(0, TAU)], [3, rng.range(0.03, 0.07), rng.range(0, TAU)], [5, rng.range(0.01, 0.03), rng.range(0, TAU)]];
  return (a) => {
    const t = a - rot;
    let f = 1;
    for (const [m, amp, ph] of waves) f += amp * Math.sin(m * a + ph);
    return ((rx * rz) / Math.hypot(rz * Math.cos(t), rx * Math.sin(t))) * f;
  };
}

const blobRing = (cx, cz, radius, off, n) => Array.from({ length: n }, (_, k) => {
  const a = (k / n) * TAU, r = radius(a) + off;
  return [cx + Math.cos(a) * r, cz + Math.sin(a) * r];
});

/** Inside a rounded square of half-size h and corner radius r, at least `pad` m from its edge. */
function inRoundedSquare(x, z, h, r, pad) {
  const ax = Math.abs(x), az = Math.abs(z);
  if (ax > h - pad || az > h - pad) return false;
  const c = h - r;
  return ax <= c || az <= c || Math.hypot(ax - c, az - c) <= r - pad;
}

/**
 * @param {{ rng: { range(a:number,b:number):number, next():number }, plate:number, vx:number, vz:number }} o
 *   rng: the city's look stream · plate: side of the square asphalt plate (m) · vx, vz: the camera's ground direction
 * @returns {{ isles: object[], trees: {kind:string,x:number,z:number,s:number,r:number}[] }}
 *   isles[0] is the city's island; each isle has outlines grass, sand and shallow ([x, z][]; shallow = the water kept
 *   free around it) and islets a `reach` (m from their centre that the shallow outline can extend). Every tree stands on an island's grass (y = 0).
 */
export function planIslands({ rng, plate, vx, vz }) {
  const g = plate / 2 + MAIN.rim;                                    // grass half-size of the city's island
  const sq = (off) => roundedRect(0, 0, g + off, g + off, MAIN.corner + off, MAIN.cornerSegments);
  const main = {
    kind: "main", x: 0, z: 0, half: g, corner: MAIN.corner,
    grass: sq(0), sand: sq(MAIN.beach), shallow: sq(MAIN.beach + MAIN.shallow),
  };
  const mainOuter = g + MAIN.beach + MAIN.shallow;                   // half-size of its shallow ring
  const isles = [main], trees = [];
  const tree = (x, z, s) => ({ kind: rng.next() < 0.55 ? "roundTree" : "coneTree", x, z, s, r: rng.range(0, TAU) });
  const camSide = (x, z) => (x * vx + z * vz) / Math.max(1, Math.hypot(x, z)) > 0.35;   // between camera and city: open water

  for (let k = 0; k < 120 && isles.length < ISLET.max + 1; k++) {
    const rx = rng.range(3.8, 8.2), rz = rx * rng.range(0.78, 1.18);
    const a = rng.range(0, TAU);
    const reach = Math.max(rx, rz) * 1.18 + ISLET.beach + ISLET.shallow;
    const dist = mainOuter + reach + rng.range(3, 48);
    const x = Math.cos(a) * dist, z = Math.sin(a) * dist;
    if (camSide(x, z)) continue;
    if (Math.abs(x) < mainOuter + reach + 2 && Math.abs(z) < mainOuter + reach + 2) continue;          // clear of the city's island
    if (isles.some((o) => o.kind === "islet" && Math.hypot(o.x - x, o.z - z) < o.reach + reach + 1.5)) continue;
    const radius = blobRadius(rng, rx, rz), n = ISLET.segments;
    isles.push({
      kind: "islet", x, z, reach, radius,
      grass: blobRing(x, z, radius, 0, n), sand: blobRing(x, z, radius, ISLET.beach, n),
      shallow: blobRing(x, z, radius, ISLET.beach + ISLET.shallow, n),
    });
    // 1-3 trees, spread round the middle, always 1.4 m inside the grass edge.
    const count = rx > 6.2 ? 3 : rx > 4.6 ? 2 : 1, a0 = rng.range(0, TAU);
    for (let t = 0; t < count; t++) {
      const ta = a0 + (t / count) * TAU + rng.range(-0.4, 0.4);
      const tr = (count === 1 ? rng.range(0, 0.25) : rng.range(0.3, 0.6)) * Math.max(0, radius(ta) - 1.4);
      trees.push(tree(x + Math.cos(ta) * tr, z + Math.sin(ta) * tr, rng.range(1.6, 2.4)));
    }
  }
  // A few trees on the city island's grass margin: never on the plate, never in front of the city.
  const half = plate / 2;
  for (let k = 0; k < 40 && trees.length < 40; k++) {
    const x = rng.range(-1, 1) * g, z = rng.range(-1, 1) * g;
    if (Math.abs(x) < half + 1.2 && Math.abs(z) < half + 1.2) continue;
    if (camSide(x, z) || !inRoundedSquare(x, z, g, MAIN.corner, 1.6)) continue;
    trees.push(tree(x, z, rng.range(1.8, 2.6)));
  }
  return { isles, trees };
}

// ------------------------------------------------------------------ meshes

/** Collects triangles with per-vertex normals (and colours); fixes each triangle's winding to face its normal. */
class Builder {
  pos = []; nor = []; col = [];
  tri(a, b, c, na, nb, nc, color) {
    // geometric normal (b - a) x (c - a); flip the winding when it points away from the wanted side
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
    const gx = uy * wz - uz * wy, gy = uz * wx - ux * wz, gz = ux * wy - uy * wx;
    const want = [na[0] + nb[0] + nc[0], na[1] + nb[1] + nc[1], na[2] + nb[2] + nc[2]];
    const order = gx * want[0] + gy * want[1] + gz * want[2] < 0 ? [[a, na], [c, nc], [b, nb]] : [[a, na], [b, nb], [c, nc]];
    for (const [p, n] of order) {
      this.pos.push(p[0], p[1], p[2]);
      this.nor.push(n[0], n[1], n[2]);
      if (color) this.col.push(color.r, color.g, color.b);
    }
  }
  /** A flat top over the whole outline (fan from its centre; every outline here is star-shaped from it). */
  cap(poly, y, color) {
    let cx = 0, cz = 0;
    for (const [x, z] of poly) { cx += x; cz += z; }
    cx /= poly.length; cz /= poly.length;
    const up = [0, 1, 0];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length];
      this.tri([cx, y, cz], [p[0], y, p[1]], [q[0], y, q[1]], up, up, up, color);
    }
  }
  /** Vertical sides from yTop down to yBot, with smooth outward normals (round islets read round). */
  wall(poly, yTop, yBot, color) {
    const n = poly.length, edgeN = [];
    for (let i = 0; i < n; i++) {
      const p = poly[i], q = poly[(i + 1) % n], dx = q[0] - p[0], dz = q[1] - p[1], l = Math.hypot(dx, dz) || 1;
      edgeN.push([dz / l, 0, -dx / l]);                              // outward for counter-clockwise outlines
    }
    const vn = poly.map((_, i) => {
      const a = edgeN[(i - 1 + n) % n], b = edgeN[i], x = a[0] + b[0], z = a[2] + b[2], l = Math.hypot(x, z) || 1;
      return [x / l, 0, z / l];
    });
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n, p = poly[i], q = poly[j];
      const pt = [p[0], yTop, p[1]], pb = [p[0], yBot, p[1]], qt = [q[0], yTop, q[1]], qb = [q[0], yBot, q[1]];
      this.tri(pt, pb, qb, vn[i], vn[i], vn[j], color);
      this.tri(pt, qb, qt, vn[i], vn[j], vn[j], color);
    }
  }
  geometry() {
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(this.pos, 3));
    g.setAttribute("normal", new Float32BufferAttribute(this.nor, 3));
    if (this.col.length) g.setAttribute("color", new Float32BufferAttribute(this.col, 3));
    g.computeBoundingBox();
    g.computeBoundingSphere();
    return g;
  }
}

/**
 * @param {object[]} isles  planIslands().isles
 * @param {{ land:string, sand:string }} colors  look.js world.water
 * @returns {Mesh[]}  grass, sand; the caller owns and disposes them
 */
export function islandMeshes(isles, colors) {
  const grass = new Builder(), sand = new Builder();
  for (const o of isles) {
    grass.cap(o.grass, 0);
    grass.wall(o.grass, 0, SAND_TOP - 0.02);
    sand.cap(o.sand, SAND_TOP);
    sand.wall(o.sand, SAND_TOP, WALL_FOOT);
  }
  const mesh = (b, name, mat) => {
    const m = new Mesh(b.geometry(), mat);
    m.name = name;
    m.receiveShadow = true;
    return m;
  };
  return [
    mesh(grass, "isle-land", new MeshStandardMaterial({ color: colors.land, roughness: 0.95 })),
    mesh(sand, "isle-sand", new MeshStandardMaterial({ color: colors.sand, roughness: 0.95 })),
  ];
}

// ------------------------------------------------------------------ shore distance (for the water shader)

/** Signed-free distance helpers on a flat outline [x0, z0, x1, z1, ...] (hot loops: no destructuring). */
function inFlat(p, x, z) {
  let c = false;
  for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
    const xi = p[i], zi = p[i + 1], xj = p[j], zj = p[j + 1];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
function edgeFlat(p, x, z) {
  let d = Infinity;
  for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
    const ax = p[j], az = p[j + 1], dx = p[i] - ax, dz = p[i + 1] - az;
    let t = ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const ex = x - ax - t * dx, ez = z - az - t * dz, e = ex * ex + ez * ez;
    if (e < d) d = e;
  }
  return Math.sqrt(d);
}

/**
 * Metres from the nearest beach (the sand outline) on a res x res grid centred on the city (res: 128-512, ~0.9 m a cell), 0 on land, clamped at
 * maxD; stored as bytes (0..255 = 0..maxD m) for a linear-filtered texture. The city's island uses the exact
 * rounded-square distance; islets use their outline polygons, only within maxD of them.
 * @returns {{ data: Uint8Array, res: number, half: number, maxD: number }}  the grid covers [-half, half] in x and z
 */
export function shoreField(isles, { maxD = 16, texel = 0.9 } = {}) {
  let r = 0;
  for (const o of isles) for (const [x, z] of o.shallow) r = Math.max(r, Math.abs(x), Math.abs(z));
  const half = r + maxD;
  const res = Math.min(512, Math.max(128, 2 ** Math.round(Math.log2((half * 2) / texel))));   // about `texel` m per cell
  const cell = (half * 2) / res;
  const data = new Uint8Array(res * res).fill(255);
  const enc = (d) => Math.round((Math.min(maxD, Math.max(0, d)) / maxD) * 255);
  const at = (i) => -half + (i + 0.5) * cell;
  const main = isles[0];
  const b = main.half + MAIN.beach, rr = main.corner + MAIN.beach;      // the city island's beach: a rounded square
  for (let j = 0; j < res; j++) {
    const qz = Math.abs(at(j)) - (b - rr);
    if (qz - rr >= maxD) continue;                                    // the whole row is open sea
    for (let i = 0; i < res; i++) {
      const qx = Math.abs(at(i)) - (b - rr);
      if (qx - rr >= maxD) continue;
      const ox = qx > 0 ? qx : 0, oz = qz > 0 ? qz : 0;
      const d = Math.sqrt(ox * ox + oz * oz) + Math.min(Math.max(qx, qz), 0) - rr;
      if (d < maxD) data[j * res + i] = enc(d);
    }
  }
  for (const o of isles.slice(1)) {
    const flat = Float64Array.from(o.sand.flat());
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const [x, z] of o.sand) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    const i0 = Math.max(0, Math.floor((x0 - maxD + half) / cell)), i1 = Math.min(res - 1, Math.ceil((x1 + maxD + half) / cell));
    const j0 = Math.max(0, Math.floor((z0 - maxD + half) / cell)), j1 = Math.min(res - 1, Math.ceil((z1 + maxD + half) / cell));
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const x = at(i), z = at(j);
        const v = enc(inFlat(flat, x, z) ? 0 : edgeFlat(flat, x, z));
        const k = j * res + i;
        if (v < data[k]) data[k] = v;
      }
    }
  }
  return { data, res, half, maxD };
}
