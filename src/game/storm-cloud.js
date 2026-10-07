/**
 * The storm front: a toy thunderhead behind the city, the place every bolt comes from.
 *
 * One continuous, smooth surface, not a pile of spheres. The cloud is authored as a few big soft "metaball" lobes - a
 * base roll of wide scallops, a body and a broad crown, stepping up and back - blended with wide fillets into one
 * signed distance field (smooth union) and cut flat underneath (smoothly, so the base edge is rounded). The
 * mesh comes from naive surface nets over that field (evenly spaced vertices, normals from the field), so the puffs
 * melt into each other without seams. The mesh is closed all round (the camera circles the finished city and sees
 * the cloud's back).
 *
 * Colour (vertex colours, same palette as before): slate at the base to pale lilac on top, darker on faces turned
 * down, darker in the creases between lobes (distance-field occlusion), so the billows read in any light.
 * The surface churns slowly (each vertex moves a little along its normal, a slow wave; the base stays flat); while a
 * strike charges the cloud flickers from inside, and on the strike it flashes.
 *
 * Cost: 1 draw call, ~3,200-4,800 triangles (the project's one "hero" geometry, budget 5,000); built once per city
 * (~10 ms), a light per-vertex update per frame.
 */

import { BufferAttribute, BufferGeometry, Color, Group, Mesh, MeshStandardMaterial } from "three";
import { enhance } from "../render/materials.js";

const COLORS = [[0, "#5f6688"], [0.3, "#7c83a8"], [0.62, "#9fa5c8"], [1, "#b9bed9"]];   // slate base -> pale lilac top
const MAX_TRIS = 4900;   // the cloud is the project's one "hero" geometry (budget 5,000)
const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
/** Polynomial smooth minimum: the union of two distances with a fillet of size k. */
const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };

/**
 * The cloud's puffs in its own frame: x across the view, y up from the flat base, z towards the camera.
 * A few big lobes in rows that step up and back, so from the game camera (a little above, in front) every row shows a
 * lit top over a darker front - the way a cumulus reads, with few round shapes.
 * @returns {{ x:number, y:number, z:number, rx:number, ry:number, rz:number }[]}
 */
function authorPuffs(rng, across, s) {
  const puffs = [], half = across * 0.45;
  const add = (x, y, z, r, sx, sy) => { const p = { x, y, z, rx: r * sx, ry: r * sy, rz: r }; puffs.push(p); return p; };
  // n lobes across `spread` of the cloud, radius r (shrinking towards the ends), centre height y, depth z (+ = camera side)
  const row = (n, spread, r, y, z, sx, sy, drop = 0.35) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = (n === 1 ? 0 : (i / (n - 1)) * 2 - 1) + rng.range(-0.25, 0.25) / n;
      const rr = r * (1 - 0.28 * t * t) * rng.range(0.9, 1.1);
      out.push(add(t * half * spread, (y - drop * Math.abs(t) * y) * rng.range(0.94, 1.06), z + rng.range(-0.8, 0.8) * s, rr, sx, sy));
    }
    return out;
  };
  row(5, 1, 8.4 * s, 2.4 * s, 5.0 * s, 1.25, 0.78, 0);          // front base roll on the flat base: a few wide scallops
  row(4, 0.88, 8.6 * s, 2.8 * s, -3.0 * s, 1.25, 0.75, 0);       // back base roll (thickness; mostly hidden)
  row(3, 0.66, 9.6 * s, 7.4 * s, 1.0 * s, 1.15, 0.84);           // the body
  row(2, 0.26, 8.4 * s, 14 * s, -1.8 * s, 1.12, 0.9);           // a broad crown
  return puffs;
}

/** Signed distance to the cloud: the puffs' smooth union, cut flat at y = 0 with a rounded edge. */
function cloudField(puffs, s) {
  const k = 2.0 * s, kb = 1.0 * s;                              // wide fillets: the lobes melt into one mass
  const F = new Float64Array(puffs.length * 7);                  // flat: x, y, z, 1/rx, 1/ry, 1/rz, max radius
  puffs.forEach((p, i) => F.set([p.x, p.y, p.z, 1 / p.rx, 1 / p.ry, 1 / p.rz, Math.max(p.rx, p.ry, p.rz)], i * 7));
  return (x, y, z) => {
    let d = Infinity;
    for (let o = 0; o < F.length; o += 7) {
      const dx = x - F[o], dy = y - F[o + 1], dz = z - F[o + 2];
      if (d !== Infinity) { const m = d + k + F[o + 6]; if (m > 0 && dx * dx + dy * dy + dz * dz > m * m) continue; }   // too far to matter
      const ix = F[o + 3], iy = F[o + 4], iz = F[o + 5], qx = dx * ix, qy = dy * iy, qz = dz * iz;
      const k0 = Math.sqrt(qx * qx + qy * qy + qz * qz);
      const k1 = Math.sqrt(qx * qx * ix * ix + qy * qy * iy * iy + qz * qz * iz * iz) || 1e-6;
      const e = (k0 * (k0 - 1)) / k1;                             // ellipsoid distance bound (Quilez)
      d = d === Infinity ? e : smin(d, e, k);
    }
    return -smin(-d, y, kb);                                     // smooth max(d, -y): the flat base
  };
}

/** The field's gradient (central differences), normalised: the surface normal. */
function gradient(sdf, x, y, z, e, out) {
  const gx = sdf(x + e, y, z) - sdf(x - e, y, z), gy = sdf(x, y + e, z) - sdf(x, y - e, z), gz = sdf(x, y, z + e) - sdf(x, y, z - e);
  const l = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1;
  out[0] = gx / l; out[1] = gy / l; out[2] = gz / l;
  return out;
}

/**
 * The mesh: naive surface nets over the distance field. The field is sampled on a grid of cell h; every cell the
 * surface passes through gets one vertex (the mean of its edge crossings, then snapped onto the surface along the
 * gradient), and every grid edge the surface crosses gets a quad between the four cells round it. Watertight, evenly
 * spaced vertices; normals come from the field itself, so the shading is smooth at any cell size.
 */
function surfaceNet(puffs, sdf, h) {
  let x0 = Infinity, x1 = -Infinity, y1 = 0, z0 = Infinity, z1 = -Infinity;
  for (const p of puffs) { x0 = Math.min(x0, p.x - p.rx); x1 = Math.max(x1, p.x + p.rx); y1 = Math.max(y1, p.y + p.ry); z0 = Math.min(z0, p.z - p.rz); z1 = Math.max(z1, p.z + p.rz); }
  const m = 2 * h, ox = x0 - m, oy = -m, oz = z0 - m;
  const nx = Math.ceil((x1 + m - ox) / h) + 1, ny = Math.ceil((y1 + m - oy) / h) + 1, nz = Math.ceil((z1 + m - oz) / h) + 1;
  const S = new Float32Array(nx * ny * nz), at = (i, j, k) => i + nx * (j + ny * k);
  // a coarse pass (every other sample) first; the fine samples are only evaluated near the surface
  for (let k = 0; k < nz; k += 2) for (let j = 0; j < ny; j += 2) for (let i = 0; i < nx; i += 2) S[at(i, j, k)] = sdf(ox + i * h, oy + j * h, oz + k * h);
  const band = 2.2 * h;
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    if (!(i & 1) && !(j & 1) && !(k & 1)) continue;
    const c = S[at(Math.min(i + (i & 1), nx - 1) & ~1, Math.min(j + (j & 1), ny - 1) & ~1, Math.min(k + (k & 1), nz - 1) & ~1)];
    S[at(i, j, k)] = Math.abs(c) > band ? c : sdf(ox + i * h, oy + j * h, oz + k * h);
  }
  const cell = new Int32Array(nx * ny * nz).fill(-1), pos = [], nrm = [], g = [0, 0, 0];
  // the 8 corners of a cell (offsets in grid units and in S) and its 12 edges (corner pairs)
  const CX = [0, 1, 0, 1, 0, 1, 0, 1], CY = [0, 0, 1, 1, 0, 0, 1, 1], CZ = [0, 0, 0, 0, 1, 1, 1, 1];
  const CO = CX.map((x, c) => x + nx * (CY[c] + ny * CZ[c]));
  const EA = [0, 2, 4, 6, 0, 1, 4, 5, 0, 1, 2, 3], EB = [1, 3, 5, 7, 2, 3, 6, 7, 4, 5, 6, 7];
  const v = new Float32Array(8);
  for (let k = 0; k + 1 < nz; k++) for (let j = 0; j + 1 < ny; j++) for (let i = 0; i + 1 < nx; i++) {
    const o = at(i, j, k);
    let inside = 0;
    for (let c = 0; c < 8; c++) { v[c] = S[o + CO[c]]; if (v[c] < 0) inside++; }
    if (inside === 0 || inside === 8) continue;
    let px = 0, py = 0, pz = 0, n = 0;
    for (let e = 0; e < 12; e++) {
      const a = EA[e], b = EB[e];
      if ((v[a] < 0) === (v[b] < 0)) continue;
      const t = v[a] / (v[a] - v[b]);
      px += CX[a] + (CX[b] - CX[a]) * t; py += CY[a] + (CY[b] - CY[a]) * t; pz += CZ[a] + (CZ[b] - CZ[a]) * t; n++;
    }
    let x = ox + (i + px / n) * h, y = oy + (j + py / n) * h, z = oz + (k + pz / n) * h;
    const d = sdf(x, y, z);                                       // snap onto the surface; its gradient is the normal
    gradient(sdf, x, y, z, 0.3 * h, g);
    x -= g[0] * d; y -= g[1] * d; z -= g[2] * d;
    cell[o] = pos.length / 3;
    pos.push(x, y, z); nrm.push(g[0], g[1], g[2]);
  }
  // one quad per crossed grid edge; axis a with (b, c) the next two axes in cyclic order, so b x c = a
  const tri = [], D = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let k = 1; k + 1 < nz; k++) for (let j = 1; j + 1 < ny; j++) for (let i = 1; i + 1 < nx; i++) {
    const s0 = S[at(i, j, k)] < 0;
    for (let a = 0; a < 3; a++) {
      const [ai, aj, ak] = D[a];
      if (s0 === (S[at(i + ai, j + aj, k + ak)] < 0)) continue;
      const [bi, bj, bk] = D[(a + 1) % 3], [ci, cj, ck] = D[(a + 2) % 3];
      const q00 = cell[at(i - bi - ci, j - bj - cj, k - bk - ck)], q10 = cell[at(i - ci, j - cj, k - ck)];
      const q11 = cell[at(i, j, k)], q01 = cell[at(i - bi, j - bj, k - bk)];
      if (q00 < 0 || q10 < 0 || q11 < 0 || q01 < 0) continue;
      if (s0) tri.push(q00, q10, q11, q00, q11, q01);           // inside at the low end: the surface faces +a
      else tri.push(q00, q11, q10, q00, q01, q11);
    }
  }
  // closed all round: the camera circles the finished city while the cloud stays put, so its back shows too
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(new Float32Array(pos), 3));
  geo.setAttribute("normal", new BufferAttribute(new Float32Array(nrm), 3));
  geo.setIndex(tri);
  return { geometry: geo, top: y1 };
}

/**
 * @param {{ range(a:number,b:number):number }} rng
 * @param {{ center: import("three").Vector3, yaw: number, across: number, scale: number, rim: string, glow: string }} o
 *   center: middle of the cloud's underside · yaw: the camera yaw (the cloud spreads across the view) · across: width (m)
 */
export function createStormCloud(rng, { center, yaw, across, scale, rim, glow }) {
  const s = scale;
  const puffs = authorPuffs(rng, across, s);
  const sdf = cloudField(puffs, s);
  let h = 1.5 * s, net = surfaceNet(puffs, sdf, h);            // ~4,500 triangles all round at this cell size
  for (let tries = 0; tries < 4 && net.geometry.index.count / 3 > MAX_TRIS; tries++) {   // coarser until in budget
    h *= Math.sqrt(net.geometry.index.count / 3 / MAX_TRIS) * 1.03;
    net.geometry.dispose();
    net = surfaceNet(puffs, sdf, h);
  }
  const { geometry: geo, top } = net;
  const P = geo.attributes.position, Nm = geo.attributes.normal, n = P.count;

  // vertex colours: height ramp x underside shade x crevice occlusion
  const ramp = COLORS.map(([t, hex]) => [t, new Color(hex)]);
  const col = new Float32Array(n * 3), c = new Color();
  const base = new Float32Array(P.array), amp = new Float32Array(n), phase = new Float32Array(n);
  const occ = 2.0 * s;
  for (let i = 0; i < n; i++) {
    const x = P.getX(i), y = P.getY(i), z = P.getZ(i), nx = Nm.getX(i), ny = Nm.getY(i), nz = Nm.getZ(i);
    const h = Math.min(1, Math.max(0, y / top));
    let k = 1;
    while (k < ramp.length - 1 && ramp[k][0] < h) k++;
    c.copy(ramp[k - 1][1]).lerp(ramp[k][1], Math.min(1, Math.max(0, (h - ramp[k - 1][0]) / (ramp[k][0] - ramp[k - 1][0]))));
    const shade = 0.62 + 0.38 * smoothstep(-0.9, 0.6, ny);
    const open = Math.min(1, Math.max(0, sdf(x + nx * occ, y + ny * occ, z + nz * occ) / occ));
    const ao = 0.45 + 0.55 * open;
    col.set([c.r * shade * ao, c.g * shade * ao, c.b * shade * ao * 1.02], i * 3);
    amp[i] = 0.32 * s * smoothstep(0.6 * s, 4 * s, y);           // the flat base stays put
    phase[i] = x * 0.11 / s + y * 0.17 / s + z * 0.07 / s;
  }
  geo.setAttribute("color", new BufferAttribute(col, 3));
  geo.computeBoundingSphere();
  geo.boundingSphere.radius += 0.5 * s;

  const mat = enhance(new MeshStandardMaterial({ vertexColors: true, roughness: 1, emissive: glow, emissiveIntensity: 0, envMapIntensity: 0.3 }),
    { rim: 0.45, rimPower: 2.2, rimColor: rim, rimTint: 0 });
  const mesh = new Mesh(geo, mat);
  mesh.name = "storm-cloud";
  mesh.position.copy(center);
  mesh.rotation.y = yaw;                                         // x across the view, z towards the camera
  const group = new Group();
  group.add(mesh);

  let flashAt = -10;
  /** @param {number} time view seconds · @param {number} charge 0..1 while holding (inner flicker) */
  function update(time, charge = 0) {
    const a = P.array, nn = Nm.array;
    for (let i = 0; i < n; i++) {
      const w = amp[i] * Math.sin(time * 0.55 + phase[i]), j = i * 3;
      a[j] = base[j] + nn[j] * w; a[j + 1] = base[j + 1] + nn[j + 1] * w; a[j + 2] = base[j + 2] + nn[j + 2] * w;
    }
    P.needsUpdate = true;
    const flick = charge > 0 ? charge * (0.55 + 0.45 * Math.sin(time * 37) * Math.sin(time * 23)) : 0;
    const flash = Math.max(0, 1 - (time - flashAt) / 0.35);
    mat.emissiveIntensity = Math.max(0, flick) * 0.35 + flash * flash * 0.9;
  }
  update(0);

  return {
    group, mesh,
    update,
    /** A strike just left the cloud: a short bright flash from inside. */
    flash(time) { flashAt = time; },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}
