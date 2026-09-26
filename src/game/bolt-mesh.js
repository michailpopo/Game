/**
 * Lightning in 3D space, pooled and allocation-free per frame:
 *   ribbons  one dynamic mesh: every bolt segment is a jagged polyline drawn as two camera-facing
 *            strips (a wide coloured glow and a thin white core), additive, flickering
 *   halos    instanced additive billboards (impact flashes, hop flashes)
 *   sparks   instanced additive billboards with velocity + gravity
 * Presentation only: the view adds effects from simulation events and calls update() per frame.
 */

import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Color, DoubleSide, DynamicDrawUsage, InstancedMesh, Matrix4,
  Mesh, MeshBasicMaterial, PlaneGeometry, Vector3,
} from "three";
import { glowTexture } from "./city-mesh.js";

const PTS = 9;                  // points per segment polyline
const _m = new Matrix4();
const _p = new Vector3();
const _s = new Vector3();
const _a = new Vector3();
const _b = new Vector3();
const _d = new Vector3();
const _v = new Vector3();
const _side = new Vector3();
const _perp = new Vector3();
const _perp2 = new Vector3();
const _pt = new Vector3();
const _c = new Color();
const WHITE = new Color(0xffffff);

const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export class BoltMesh {
  #seg; #segN; #halo; #haloN; #spark; #sparkN;
  #pos; #col; #geo;
  #haloMesh; #sparkMesh; #owned = [];

  /**
   * @param {{ segments?:number, halos?:number, sparks?:number, unit?:number }} [o]
   *        segments: 150 keeps the ribbon geometry at 4,800 triangles (the one "hero" geometry allowed
   *        over project.json trianglesPerGeometry); unit: world units per metre-ish scale of the jag/gravity
   */
  constructor(scene, { segments = 150, halos = 200, sparks = 500, unit = 1 } = {}) {
    this.unit = unit;
    // Segment pool: [ax, ay, az, bx, by, bz, age, life, width, seed, r, g, b, reveal]
    this.#segN = segments;
    this.#seg = new Float32Array(segments * 14);
    this.#seg.fill(-1);
    const verts = segments * 2 * PTS * 2;             // 2 strips x PTS points x 2 sides
    this.#pos = new Float32Array(verts * 3);
    this.#col = new Float32Array(verts * 4);
    const geo = new BufferGeometry();
    const pa = new BufferAttribute(this.#pos, 3); pa.setUsage(DynamicDrawUsage);
    const ca = new BufferAttribute(this.#col, 4); ca.setUsage(DynamicDrawUsage);
    geo.setAttribute("position", pa);
    geo.setAttribute("color", ca);
    const idx = [];
    for (let s = 0; s < segments * 2; s++) {
      for (let k = 0; k < PTS - 1; k++) {
        const a = (s * PTS + k) * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    geo.setIndex(idx);
    this.#geo = geo;
    // depthTest off: lightning is light - it reads over the rooftops in front instead of vanishing behind them.
    const ribbons = new Mesh(geo, new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending, side: DoubleSide }));
    ribbons.name = "bolts";
    ribbons.frustumCulled = false;
    ribbons.renderOrder = 4;
    this.ribbons = ribbons;
    this.#owned.push(geo, ribbons.material);

    const tex = glowTexture();
    const quad = new PlaneGeometry(1, 1);
    this.#owned.push(tex, quad);
    const mk = (n, name) => {
      const m = new InstancedMesh(quad, new MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending }), n);
      m.name = name;
      m.frustumCulled = false;
      m.instanceMatrix.setUsage(DynamicDrawUsage);
      m.setColorAt(0, WHITE);
      m.instanceColor.setUsage(DynamicDrawUsage);
      m.count = 0;
      m.renderOrder = 5;
      this.#owned.push(m.material);
      return m;
    };
    // Halo pool: [x, y, z, age, life, size, r, g, b]
    this.#haloN = halos;
    this.#halo = new Float32Array(halos * 9).fill(-1);
    this.#haloMesh = mk(halos, "bolt-halos");
    // Spark pool: [x, y, z, vx, vy, vz, age, life, size, r, g, b]
    this.#sparkN = sparks;
    this.#spark = new Float32Array(sparks * 12).fill(-1);
    this.#sparkMesh = mk(sparks, "sparks");
    this.#nextSeg = 0; this.#nextHalo = 0; this.#nextSpark = 0;
    scene.add(ribbons, this.#haloMesh, this.#sparkMesh);
  }

  #nextSeg; #nextHalo; #nextSpark;

  /** A bolt segment from a to b. color: Color; width in world units; life in seconds. */
  segment(ax, ay, az, bx, by, bz, color, width = 0.35, life = 0.45, seed = 0) {
    const i = this.#nextSeg;
    this.#nextSeg = (i + 1) % this.#segN;
    const o = i * 14, S = this.#seg;
    S[o] = ax; S[o + 1] = ay; S[o + 2] = az; S[o + 3] = bx; S[o + 4] = by; S[o + 5] = bz;
    S[o + 6] = 0; S[o + 7] = life; S[o + 8] = width; S[o + 9] = seed;
    S[o + 10] = color.r; S[o + 11] = color.g; S[o + 12] = color.b;
  }

  halo(x, y, z, size, color, life = 0.35) {
    const i = this.#nextHalo;
    this.#nextHalo = (i + 1) % this.#haloN;
    const o = i * 9, H = this.#halo;
    H[o] = x; H[o + 1] = y; H[o + 2] = z; H[o + 3] = 0; H[o + 4] = life; H[o + 5] = size;
    H[o + 6] = color.r; H[o + 7] = color.g; H[o + 8] = color.b;
  }

  sparks(x, y, z, count, color, speed = 6, size = 0.18, life = 0.6) {
    const P = this.#spark;
    for (let n = 0; n < count; n++) {
      const i = this.#nextSpark;
      this.#nextSpark = (i + 1) % this.#sparkN;
      const o = i * 12;
      const a = Math.random() * Math.PI * 2, u = Math.random() * 2 - 1, sp = speed * (0.35 + Math.random() * 0.65);
      const r = Math.sqrt(1 - u * u);
      P[o] = x; P[o + 1] = y; P[o + 2] = z;
      P[o + 3] = Math.cos(a) * r * sp; P[o + 4] = Math.abs(u) * sp * 0.8 + 1.5 * this.unit; P[o + 5] = Math.sin(a) * r * sp;
      P[o + 6] = 0; P[o + 7] = life * (0.6 + Math.random() * 0.8); P[o + 8] = size * (0.6 + Math.random() * 0.8);
      P[o + 9] = color.r; P[o + 10] = color.g; P[o + 11] = color.b;
    }
  }

  clear() {
    this.#seg.fill(-1); this.#halo.fill(-1); this.#spark.fill(-1);
  }

  /** @param {number} dt real seconds  @param {import("three").Camera} camera */
  update(dt, camera, time) {
    const cam = camera.position;
    const S = this.#seg, P = this.#pos, C = this.#col;
    const flick = Math.floor(time * 24);          // jag pattern re-rolls ~24x/s
    for (let i = 0; i < this.#segN; i++) {
      const o = i * 14;
      const vbase = i * 2 * PTS * 2;             // first vertex of this segment's two strips
      const life = S[o + 7];
      let alpha = 0;
      if (life > 0) {
        S[o + 6] += dt;
        const age = S[o + 6];
        if (age >= life) { S[o + 7] = -1; }
        else alpha = age < 0.05 ? 1 : Math.max(0, 1 - (age - 0.05) / (life - 0.05)) ** 1.2;
      }
      if (alpha <= 0) {                           // collapse unused strips (zero area)
        for (let v = 0; v < 2 * PTS * 2; v++) { const q = (vbase + v) * 3; P[q] = P[q + 1] = P[q + 2] = 0; C[(vbase + v) * 4 + 3] = 0; }
        continue;
      }
      _a.set(S[o], S[o + 1], S[o + 2]);
      _b.set(S[o + 3], S[o + 4], S[o + 5]);
      _d.subVectors(_b, _a);
      const len = _d.length() || 1;
      _d.divideScalar(len);
      // two perpendiculars for the zig-zag
      _perp.set(0, 1, 0).cross(_d);
      if (_perp.lengthSq() < 1e-4) _perp.set(1, 0, 0).cross(_d);
      _perp.normalize();
      _perp2.crossVectors(_d, _perp).normalize();
      const seed = S[o + 9] * 13.7 + flick * 0.31;
      const jag = Math.min(1.4 * this.unit, len * 0.12);
      const reveal = Math.min(1, S[o + 6] / 0.06);  // the bolt draws itself from a to b
      const w = S[o + 8];
      for (let strip = 0; strip < 2; strip++) {
        const width = strip === 0 ? w * 3.6 : w * 0.85;
        const cr = strip === 0 ? S[o + 10] : 1, cg = strip === 0 ? S[o + 11] : 1, cb = strip === 0 ? S[o + 12] : 1;
        const a = strip === 0 ? alpha * 0.7 : alpha;
        for (let k = 0; k < PTS; k++) {
          const f = Math.min(k / (PTS - 1), reveal);
          const env = Math.sin(Math.PI * f);
          const j1 = (hash(seed + k * 3.1) - 0.5) * 2 * jag * env;
          const j2 = (hash(seed + k * 7.7 + 1.3) - 0.5) * 2 * jag * env;
          _pt.copy(_a).addScaledVector(_d, len * f).addScaledVector(_perp, j1).addScaledVector(_perp2, j2);
          _v.subVectors(cam, _pt);
          _side.crossVectors(_d, _v).normalize().multiplyScalar(width * 0.5);
          const vi = vbase + (strip * PTS + k) * 2;
          P[vi * 3] = _pt.x + _side.x; P[vi * 3 + 1] = _pt.y + _side.y; P[vi * 3 + 2] = _pt.z + _side.z;
          P[vi * 3 + 3] = _pt.x - _side.x; P[vi * 3 + 4] = _pt.y - _side.y; P[vi * 3 + 5] = _pt.z - _side.z;
          const edge = k === 0 || k === PTS - 1 ? 0.4 : 1;
          // Additive blending multiplies by alpha once: the colour itself is not pre-multiplied.
          for (let s = 0; s < 2; s++) { const ci = (vi + s) * 4; C[ci] = cr * edge; C[ci + 1] = cg * edge; C[ci + 2] = cb * edge; C[ci + 3] = a; }
        }
      }
    }
    this.#geo.attributes.position.needsUpdate = true;
    this.#geo.attributes.color.needsUpdate = true;

    // Halos.
    const H = this.#halo, hm = this.#haloMesh;
    let k = 0;
    for (let i = 0; i < this.#haloN; i++) {
      const o = i * 9;
      if (H[o + 4] <= 0) continue;
      H[o + 3] += dt;
      const t = H[o + 3] / H[o + 4];
      if (t >= 1) { H[o + 4] = -1; continue; }
      const size = H[o + 5] * (0.6 + 0.6 * t);
      hm.setMatrixAt(k, _m.compose(_p.set(H[o], H[o + 1], H[o + 2]), camera.quaternion, _s.set(size, size, 1)));
      hm.setColorAt(k, _c.setRGB(H[o + 6], H[o + 7], H[o + 8]).multiplyScalar((1 - t) ** 2));
      k++;
    }
    hm.count = k;
    hm.instanceMatrix.needsUpdate = true;
    hm.instanceColor.needsUpdate = true;

    // Sparks.
    const Q = this.#spark, sm = this.#sparkMesh;
    k = 0;
    const drag = Math.exp(-1.8 * dt);
    const gravity = 16 * this.unit;
    for (let i = 0; i < this.#sparkN; i++) {
      const o = i * 12;
      if (Q[o + 7] <= 0) continue;
      Q[o + 6] += dt;
      const t = Q[o + 6] / Q[o + 7];
      if (t >= 1) { Q[o + 7] = -1; continue; }
      Q[o + 4] -= gravity * dt;
      Q[o + 3] *= drag; Q[o + 5] *= drag;
      Q[o] += Q[o + 3] * dt; Q[o + 1] = Math.max(0.2, Q[o + 1] + Q[o + 4] * dt); Q[o + 2] += Q[o + 5] * dt;
      const size = Q[o + 8] * (1 - t * 0.6);
      sm.setMatrixAt(k, _m.compose(_p.set(Q[o], Q[o + 1], Q[o + 2]), camera.quaternion, _s.set(size, size, 1)));
      sm.setColorAt(k, _c.setRGB(Q[o + 9], Q[o + 10], Q[o + 11]).multiplyScalar(1 - t));
      k++;
    }
    sm.count = k;
    sm.instanceMatrix.needsUpdate = true;
    sm.instanceColor.needsUpdate = true;
  }

  dispose() {
    for (const r of this.#owned) r.dispose?.();
    this.#haloMesh.dispose();
    this.#sparkMesh.dispose();
  }
}
