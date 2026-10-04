/**
 * Sky Port (look.js world.scenery "sky"): the last theme is a city high above the clouds.
 *
 * Built like stylised low-poly sky scenes usually are (floating islands with flat-shaded, faceted rock undersides that
 * taper to a point; soft puff clouds; a few airships and balloons for life):
 *   - the city stands on a floating island: a grass rim around the asphalt plate (rounded square, like the city), a
 *     dirt band, a jagged near-vertical rock cliff (what the steep camera sees), then a taper to a tip ~40 m below
 *   - small floating islets behind and beside it, with trees on top
 *   - a sea of cumulus clusters far below (the field drops to SKY_FLOOR, so there is sky between), a few at city height
 *   - hot-air balloons bobbing on small circles and an airship circling behind the city (it never crosses the camera)
 *
 * 4 draw calls: island + islets (one merged mesh, vertex colours, flat shading), clouds, balloons, airship.
 */

import {
  BoxGeometry, BufferGeometry, Color, ConeGeometry, Float32BufferAttribute, Group, InstancedMesh, Matrix4, Mesh,
  MeshStandardMaterial, Quaternion, SphereGeometry, Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { roundedRect } from "./islands.js";

export const SKY_FLOOR = -70;              // the field (the sky's colour far below the clouds)
const TAU = Math.PI * 2;
const ROCK = ["#b8957a", "#a07e6a", "#87695c", "#6f5650"];   // warm earth, so the cliffs read against the blue sky
const GRASS = "#7fcf6a", DIRT = "#a8795a";

const _m = new Matrix4(), _p = new Vector3(), _s = new Vector3(), _q = new Quaternion(), _c = new Color();
const UP = new Vector3(0, 1, 0), ID = new Quaternion();

/** Collects coloured triangles; each triangle's winding is turned to face `want` (flat-shaded afterwards). */
class Faceted {
  pos = []; col = [];
  tri(a, b, c, color, want) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], wx = c[0] - a[0], wy = c[1] - a[1], wz = c[2] - a[2];
    const n = [uy * wz - uz * wy, uz * wx - ux * wz, ux * wy - uy * wx];
    const [p, q] = n[0] * want[0] + n[1] * want[1] + n[2] * want[2] < 0 ? [c, b] : [b, c];
    _c.set(color);
    for (const v of [a, p, q]) { this.pos.push(v[0], v[1], v[2]); this.col.push(_c.r, _c.g, _c.b); }
  }
  /**
   * A body lofted through rings ({ pts:[x,z][], y, color }): a flat top over the first ring, sides between rings (each
   * band in its ring's colour), and a tip under the last ring when `tip` is given.
   */
  loft(cx, cz, rings, tip) {
    const top = rings[0];
    for (let i = 0; i < top.pts.length; i++) {
      const p = top.pts[i], q = top.pts[(i + 1) % top.pts.length];
      this.tri([cx, top.y, cz], [p[0], top.y, p[1]], [q[0], top.y, q[1]], top.color, [0, 1, 0]);
    }
    for (let r = 0; r + 1 < rings.length; r++) {
      const A = rings[r], B = rings[r + 1], n = A.pts.length;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const a0 = [A.pts[i][0], A.y, A.pts[i][1]], a1 = [A.pts[j][0], A.y, A.pts[j][1]];
        const b0 = [B.pts[i][0], B.y, B.pts[i][1]], b1 = [B.pts[j][0], B.y, B.pts[j][1]];
        const out = [(a0[0] + a1[0]) / 2 - cx, 0, (a0[2] + a1[2]) / 2 - cz];
        this.tri(a0, b0, b1, A.color, out);
        this.tri(a0, b1, a1, A.color, out);
      }
    }
    if (tip) {
      const L = rings[rings.length - 1], n = L.pts.length, t = [cx + tip.dx, tip.y, cz + tip.dz];
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, a = [L.pts[i][0], L.y, L.pts[i][1]], b = [L.pts[j][0], L.y, L.pts[j][1]];
        this.tri(a, b, t, L.color, [(a[0] + b[0]) / 2 - cx, -0.6, (a[2] + b[2]) / 2 - cz]);
      }
    }
  }
  geometry() {
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(this.pos, 3));
    g.setAttribute("color", new Float32BufferAttribute(this.col, 3));
    g.computeVertexNormals();                                 // non-indexed: one normal per face = flat shading
    g.computeBoundingSphere();
    return g;
  }
}

/** Split every edge of a closed outline into pieces of at most `step` m, so the rock rings below can be jagged. */
function densify(pts, step) {
  const out = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  });
  return out;
}

/** Scale an outline about (cx, cz) and jitter every point outwards/inwards by up to `jit` (share of its radius). */
const shrink = (rng, pts, cx, cz, s, jit) => pts.map(([x, z]) => { const k = s * (1 + rng.range(-jit, jit)); return [cx + (x - cx) * k, cz + (z - cz) * k]; });

/** A cumulus puff: a low sphere pressed flat underneath, a shade darker towards the flat base (vertex colour). */
function puffGeometry() {
  const g = new SphereGeometry(1, 8, 5), p = g.attributes.position, col = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    if (y < -0.35) p.setY(i, -0.35);
    const k = 0.82 + 0.18 * Math.min(1, Math.max(0, (y + 0.35) / 1.35));
    col.set([k, k, k * 1.03], i * 3);
  }
  g.setAttribute("color", new Float32BufferAttribute(col, 3));
  g.deleteAttribute("uv");
  g.computeVertexNormals();
  return g;
}

function balloonGeometry() {
  const env = new SphereGeometry(2, 10, 8).toNonIndexed();
  env.scale(1, 1.15, 1).translate(0, 3.4, 0);
  const p = env.attributes.position, col = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i += 3) {                    // vertical stripes: every other gore a shade darker
    const ax = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3, az = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
    const k = Math.floor(((Math.atan2(az, ax) + Math.PI) / TAU) * 10) % 2 ? 1 : 0.72;
    for (let v = 0; v < 3; v++) col.set([k, k, k], (i + v) * 3);
  }
  env.setAttribute("color", new Float32BufferAttribute(col, 3));
  env.deleteAttribute("uv");
  const part = (g, hex) => {
    const n = g.toNonIndexed(); n.deleteAttribute("uv");
    const c = new Color(hex), a = new Float32Array(n.attributes.position.count * 3);
    for (let i = 0; i < a.length; i += 3) a.set([c.r, c.g, c.b], i);
    n.setAttribute("color", new Float32BufferAttribute(a, 3));
    return n;
  };
  return mergeGeometries([
    env,
    part(new ConeGeometry(1.05, 1.3, 10, 1, true).rotateX(Math.PI).translate(0, 1.15, 0), "#e8e2f4"),
    part(new BoxGeometry(0.9, 0.7, 0.9).translate(0, 0.1, 0), "#9a6b45"),
  ]);
}

function airshipGeometry() {
  const part = (g, hex) => {
    const n = g.index ? g.toNonIndexed() : g; n.deleteAttribute("uv");
    const c = new Color(hex), a = new Float32Array(n.attributes.position.count * 3);
    for (let i = 0; i < a.length; i += 3) a.set([c.r, c.g, c.b], i);
    n.setAttribute("color", new Float32BufferAttribute(a, 3));
    return n;
  };
  return mergeGeometries([                                   // nose towards +z, 15 m long
    part(new SphereGeometry(2.4, 12, 8).scale(1, 1, 3.1), "#eef0ff"),
    part(new SphereGeometry(2.42, 12, 1, 0, TAU, Math.PI * 0.46, Math.PI * 0.08).scale(1, 1, 3.1), "#ff6f8a"),   // a red band
    part(new BoxGeometry(1.3, 0.9, 3.4).translate(0, -2.75, 0.4), "#7a5a45"),
    part(new BoxGeometry(0.15, 2.4, 2).translate(0, 1.6, -6.4), "#ff6f8a"),
    part(new BoxGeometry(2.4, 0.15, 2).translate(0, 0, -6.4), "#ff6f8a"),
  ]);
}

/**
 * @param {{ rng: { range(a:number,b:number):number, next():number }, plate: number, camDir: { x:number, z:number } }} o
 * @returns {{ group: Group, trees: object[], update(time:number):void, dispose():void, counts: object }}
 *   trees stand on the islets (each has its own y)
 */
export function createSkyWorld({ rng, plate, camDir }) {
  const group = new Group(), own = [], trees = [];
  const P = plate / 2;
  const behind = (x, z) => (x * camDir.x + z * camDir.z) / Math.max(1, Math.hypot(x, z)) < 0.25;

  // ---------------------------------------------------------------- the floating island under the city
  const body = new Faceted();
  const g = P + 6, corner = 5;
  const sq = densify(roundedRect(0, 0, g, g, corner, 2), 13);
  // The camera looks steeply down, so a tapering face is seen edge-on: the island keeps a jagged, near-vertical rock cliff
  // under the rim (the part the camera sees past the plate's edges), then tapers to its tip out of sight.
  body.loft(0, 0, [
    { pts: sq, y: -0.05, color: GRASS },                     // the top sits where the land field does (under the plate)
    { pts: sq, y: -0.9, color: DIRT },
    { pts: shrink(rng, sq, 0, 0, 1.0, 0.012), y: -2.2, color: ROCK[0] },
    { pts: shrink(rng, sq, 0, 0, 0.995, 0.02), y: -7, color: ROCK[1] },
    { pts: shrink(rng, sq, 0, 0, 0.9, 0.05), y: -11, color: ROCK[2] },
    { pts: shrink(rng, sq, 0, 0, 0.6, 0.09), y: -21, color: ROCK[3] },
  ], { y: -35 - P * 0.1, dx: rng.range(-3, 3), dz: rng.range(-3, 3) });

  // ---------------------------------------------------------------- islets with trees
  const islets = [];
  for (let k = 0; k < 160 && islets.length < 6; k++) {
    const a = rng.range(0, TAU), dist = P + rng.range(16, 70), x = Math.cos(a) * dist, z = Math.sin(a) * dist;
    const r = rng.range(4.5, 8), y = rng.range(-6, 8);
    if (!behind(x, z) || islets.some((o) => Math.hypot(o.x - x, o.z - z) < o.r + r + 8)) continue;
    islets.push({ x, z, r, y });
    const n = 10, rad = Array.from({ length: n }, () => r * rng.range(0.82, 1.12));
    const ring = (s, jit, dy) => ({ pts: rad.map((rr, i) => { const t = (i / n) * TAU, k2 = s * (1 + rng.range(-jit, jit)); return [x + Math.cos(t) * rr * k2, z + Math.sin(t) * rr * k2]; }), y: y + dy });
    body.loft(x, z, [
      { ...ring(1, 0, 0), color: GRASS },
      { ...ring(1, 0, -0.7), color: DIRT },
      { ...ring(1, 0.04, -1.5), color: ROCK[0] },
      { ...ring(0.8, 0.08, -3.6), color: ROCK[1] },
      { ...ring(0.4, 0.1, -6.4), color: ROCK[2] },
    ], { y: y - r * 1.6 - 3, dx: rng.range(-0.8, 0.8), dz: rng.range(-0.8, 0.8) });
    const count = r > 6.5 ? 4 : r > 5.5 ? 3 : 2, a0 = rng.range(0, TAU);
    for (let t = 0; t < count; t++) {
      const ta = a0 + (t / count) * TAU, tr = r * 0.45;
      trees.push({ kind: rng.next() < 0.5 ? "roundTree" : "coneTree", x: x + Math.cos(ta) * tr, y, z: z + Math.sin(ta) * tr, s: rng.range(1.3, 1.9), r: rng.range(0, TAU) });
    }
  }
  const bodyGeo = body.geometry();
  const bodyMat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true });
  const island = new Mesh(bodyGeo, bodyMat);
  island.name = "sky-island";
  island.receiveShadow = true;
  group.add(island);
  own.push(bodyGeo, bodyMat);

  // ---------------------------------------------------------------- clouds: a sea far below, a few at city height
  // each cloud is a cluster of flat-bottomed puffs (one big one in the middle, smaller ones round it)
  const clouds = [];
  const cluster = (cx, cy, cz, R, n, color) => {
    const phase = rng.range(0, TAU);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + rng.range(-0.4, 0.4), d = i === 0 ? 0 : R * rng.range(0.7, 1.05), r = i === 0 ? R : R * rng.range(0.5, 0.72);
      clouds.push({ x: cx + Math.cos(a) * d * 1.25, y: cy - (i === 0 ? 0 : R - r) * 0.35, z: cz + Math.sin(a) * d, r, phase, color });
    }
  };
  const seas = [];
  for (let k = 0; k < 600 && seas.length < 20; k++) {        // the sea of clouds, round the island far below it
    const a = rng.range(0, TAU), dist = P + rng.range(4, 170), x = Math.cos(a) * dist, z = Math.sin(a) * dist, R = rng.range(9, 16);
    if (seas.some((o) => Math.hypot(o.x - x, o.z - z) < (o.R + R) * 1.1)) continue;
    seas.push({ x, z, R });
    cluster(x, rng.range(-32, -26), z, R, 4, rng.next() < 0.8 ? "#ffffff" : "#eef0ff");
  }
  const highs = [];
  for (let k = 0; k < 300 && highs.length < 5; k++) {        // drifting at the city's height, beside and behind it
    const a = rng.range(0, TAU), dist = P + rng.range(14, 110), x = Math.cos(a) * dist, z = Math.sin(a) * dist, R = rng.range(4, 7);
    if (!behind(x, z) || highs.some((o) => Math.hypot(o.x - x, o.z - z) < 22) || islets.some((o) => Math.hypot(o.x - x, o.z - z) < o.r + R * 2)) continue;
    highs.push({ x, z });
    cluster(x, rng.range(-4, 10), z, R, 3, "#ffffff");
  }
  const cloudGeo = puffGeometry(), cloudMat = new MeshStandardMaterial({ vertexColors: true, roughness: 1, emissive: "#ffffff", emissiveIntensity: 0.14 });
  const cloudMesh = new InstancedMesh(cloudGeo, cloudMat, clouds.length);
  cloudMesh.name = "sky-clouds";
  clouds.forEach((c, i) => cloudMesh.setColorAt(i, _c.set(c.color)));
  group.add(cloudMesh);
  own.push(cloudGeo, cloudMat);

  // ---------------------------------------------------------------- balloons and an airship
  const balloons = [];
  for (let k = 0; k < 120 && balloons.length < 4; k++) {
    const a = rng.range(0, TAU), dist = P + rng.range(10, 55), x = Math.cos(a) * dist, z = Math.sin(a) * dist;
    if (!behind(x, z) || balloons.some((b) => Math.hypot(b.x - x, b.z - z) < 18)) continue;
    balloons.push({ x, z, y: rng.range(14, 30), s: rng.range(1.5, 2.1), phase: rng.range(0, TAU), speed: rng.range(0.08, 0.14), color: ["#ff6f8a", "#ffd23f", "#6fd0ff", "#a98bff", "#7be08a"][k % 5] });
  }
  const balloonGeo = balloonGeometry(), balloonMat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.75 });
  const balloonMesh = new InstancedMesh(balloonGeo, balloonMat, Math.max(1, balloons.length));
  balloonMesh.name = "sky-balloons";
  balloonMesh.count = balloons.length;
  balloons.forEach((b, i) => balloonMesh.setColorAt(i, _c.set(b.color)));
  group.add(balloonMesh);
  own.push(balloonGeo, balloonMat);

  const shipGeo = airshipGeometry(), shipMat = new MeshStandardMaterial({ vertexColors: true, roughness: 0.6 });
  const ship = new Mesh(shipGeo, shipMat);
  ship.name = "sky-airship";
  group.add(ship);
  own.push(shipGeo, shipMat);
  // its route: a slow circle centred behind the city, far enough out that it never passes in front of the camera
  const route = { cx: -camDir.x * (P + 75), cz: -camDir.z * (P + 75), r: 34 + P * 0.15, y: 26 + P * 0.06, speed: 0.045 };

  function update(time) {
    clouds.forEach((c, i) => {
      const b = Math.sin(time * 0.25 + c.phase);              // a cluster's puffs share a phase: it drifts as one
      cloudMesh.setMatrixAt(i, _m.compose(_p.set(c.x + b * 1.2, c.y + b * 0.3, c.z), ID, _s.set(c.r * 1.2, c.r * 0.62, c.r)));
    });
    cloudMesh.instanceMatrix.needsUpdate = true;
    balloons.forEach((b, i) => {
      const t = time * b.speed + b.phase;
      _m.compose(_p.set(b.x + Math.cos(t) * 5, b.y + Math.sin(time * 0.7 + b.phase) * 0.8, b.z + Math.sin(t) * 5), _q.setFromAxisAngle(UP, t * 0.5), _s.setScalar(b.s));
      balloonMesh.setMatrixAt(i, _m);
    });
    balloonMesh.instanceMatrix.needsUpdate = true;
    const a = time * route.speed;
    ship.position.set(route.cx + Math.cos(a) * route.r, route.y + Math.sin(time * 0.5) * 0.6, route.cz + Math.sin(a) * route.r);
    ship.rotation.set(0, Math.atan2(-Math.sin(a), Math.cos(a)), Math.sin(time * 0.4) * 0.03);   // nose along the circle
  }
  update(0);

  return {
    group, trees, update,
    counts: { islets: islets.length, clouds: clouds.length, balloons: balloons.length, islandTris: bodyGeo.attributes.position.count / 3 },
    dispose() { for (const r of own) r.dispose?.(); },
  };
}
