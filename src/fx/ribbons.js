/**
 * Ribbons - pooled camera-facing polylines in ONE draw call (additive): lightning bolts and trails.
 * Allocation-free per frame; the ribbon mesh is rebuilt on the CPU each frame for live slots only.
 *
 *   const ribbons = new Ribbons(scene, { max: 30, points: 33 });   // 1,920-triangle pool, 1 draw call
 *   const bolts = new Bolts(ribbons);
 *   bolts.strike(a, b, { color: "#4df3ff", width: 0.5, forks: 2, arc: 1.2 });   // forked bolt a -> b
 *   const t = ribbons.trail({ color: "#ff2d95", width: 0.3, points: 16 });      // a trail slot
 *   ribbons.push(t, x, y, z);          // every frame: new head position
 *   ribbons.release(t);                // fades out, then frees the slot
 *   // per frame:  bolts.update(dt); ribbons.update(dt, camera);
 *
 * Look: across the ribbon a white-hot core (`core` = its HDR brightness, 0 = none) inside a coloured
 * glow (`intensity`; keep it ~1.5-2 so the colour stays saturated under ACES - the core carries the white). Bolts flicker (re-jag every `flicker` s) and taper toward fork tips;
 * `progress` < 1 reveals a bolt part-way (mid-leap). Trails fade from head to tail.
 */

import {
  AdditiveBlending, BufferAttribute, BufferGeometry, Color, DynamicDrawUsage, Mesh, NormalBlending, ShaderMaterial, Vector3,
} from "three";

const RIBBON_VERTEX = /* glsl */`
attribute float aSide;
attribute vec2 aInfo;     // x: u along (0 tail/start .. 1 head/end), y: core amount
attribute vec4 aCol;      // rgb linear HDR, a alpha
varying float vSide;
varying float vCore;
varying vec4 vCol;
#include <common>
void main() {
  vSide = aSide;
  vCore = aInfo.y;
  vCol = aCol;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

const RIBBON_FRAGMENT = /* glsl */`
varying float vSide;
varying float vCore;
varying vec4 vCol;
#include <common>
void main() {
  float s = min( abs( vSide ), 1.0 );                        // clamp: interpolation can overshoot 1 -> NaN
  float glow = exp( - s * s * 2.5 ) * sqrt( 1.0 - s );      // wide coloured glow
  float core = smoothstep( 0.14, 0.0, s );                   // white-hot centre line
  vec3 c = vCol.rgb * glow + vec3( vCore ) * core;           // vCore = absolute core brightness (HDR)
  gl_FragColor = vec4( c, clamp( glow + core * step( 0.001, vCore ), 0.0, 1.0 ) * vCol.a );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// Outline under the additive ribbon: a deep-blue band (normal blending) so the bolt keeps its contrast and
// saturation over bright skies and lit buildings, where a purely additive glow washes out toward white.
const OUTLINE_FRAGMENT = /* glsl */`
uniform vec3 olColor;
uniform float olAlpha;
varying float vSide;
varying vec4 vCol;
#include <common>
void main() {
  float s = min( abs( vSide ), 1.0 );
  float a = ( 1.0 - smoothstep( 0.72, 1.0, s ) ) * olAlpha * clamp( vCol.a, 0.0, 1.0 );
  gl_FragColor = vec4( olColor, a );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const _c = new Color();
const _cam = new Vector3();
const _t = new Vector3();
const _v = new Vector3();
const _side = new Vector3();
const NO_OPTS = Object.freeze({});

// per-ribbon record layout (Float32Array, RB floats each)
const RB = 16;
// 0 alive, 1 mode (0 static, 1 trail), 2 n points used, 3 life, 4 maxLife, 5 width, 6 w0, 7 w1,
// 8 r, 9 g, 10 b, 11 alpha, 12 core, 13 flicker (alpha jitter 0..1), 14 releasing, 15 trail head index

export class Ribbons {
  mesh;
  #R; #P; #rec; #pts; #pos; #info; #col; #dirty; #hi = 0;

  /** Outline mesh (shares the geometry; +1 draw call) or null. */
  outline = null;

  /**
   * Pool geometry = max x (points - 1) x 2 triangles; the default 30 x 33 = 1,920 stays under profile M's 2,000
   * per geometry. outline: { color: "#0b1446", alpha: 0.6 } draws a dark band under every ribbon.
   */
  constructor(scene, { max = 30, points = 33, outline = null } = {}) {
    this.#R = max; this.#P = points;
    this.#rec = new Float32Array(max * RB);
    this.#pts = new Float32Array(max * points * 3);
    this.#dirty = new Uint8Array(max);
    const nv = max * points * 2;
    const geo = new BufferGeometry();
    this.#pos = new BufferAttribute(new Float32Array(nv * 3), 3).setUsage(DynamicDrawUsage);
    this.#info = new BufferAttribute(new Float32Array(nv * 2), 2).setUsage(DynamicDrawUsage);
    this.#col = new BufferAttribute(new Float32Array(nv * 4), 4).setUsage(DynamicDrawUsage);
    const side = new Float32Array(nv);
    for (let i = 0; i < nv; i++) side[i] = i % 2 ? 1 : -1;
    const idx = new Uint32Array(max * (points - 1) * 6);
    let k = 0;
    for (let r = 0; r < max; r++) {
      for (let j = 0; j < points - 1; j++) {
        const a = (r * points + j) * 2;
        idx[k++] = a; idx[k++] = a + 1; idx[k++] = a + 2;
        idx[k++] = a + 1; idx[k++] = a + 3; idx[k++] = a + 2;
      }
    }
    geo.setIndex(new BufferAttribute(idx, 1));
    geo.setAttribute("position", this.#pos);
    geo.setAttribute("aSide", new BufferAttribute(side, 1));
    geo.setAttribute("aInfo", this.#info);
    geo.setAttribute("aCol", this.#col);
    geo.setDrawRange(0, 0);
    const mat = new ShaderMaterial({
      vertexShader: RIBBON_VERTEX, fragmentShader: RIBBON_FRAGMENT, transparent: true, depthWrite: false, blending: AdditiveBlending,
    });
    this.mesh = new Mesh(geo, mat);
    this.mesh.name = "fx-ribbons";
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
    this.mesh.renderOrder = 10;
    scene.add(this.mesh);
    if (outline) {
      const om = new ShaderMaterial({
        vertexShader: RIBBON_VERTEX, fragmentShader: OUTLINE_FRAGMENT, transparent: true, depthWrite: false, blending: NormalBlending,
        uniforms: { olColor: { value: new Color(outline.color ?? "#0b1446") }, olAlpha: { value: outline.alpha ?? 0.6 } },
      });
      this.outline = new Mesh(geo, om);
      this.outline.name = "fx-ribbon-outline";
      this.outline.frustumCulled = false;
      this.outline.visible = false;
      this.outline.renderOrder = 9;
      scene.add(this.outline);
    }
  }

  get maxPoints() { return this.#P; }

  /** Claim a slot. opts: color, intensity 1.8, width 0.4, w0/w1 (width scale at start/end), core 2.5 (white brightness), life (s, Infinity), flicker 0..1, alpha 1 */
  alloc(o = NO_OPTS, mode = 0) {
    const rec = this.#rec;
    let r = -1;
    for (let i = 0; i < this.#R; i++) if (!rec[i * RB]) { r = i; break; }
    if (r < 0) return -1;
    const b = r * RB;
    _c.set(o.color ?? "#4df3ff").multiplyScalar(o.intensity ?? 1.8);
    rec[b] = 1; rec[b + 1] = mode; rec[b + 2] = 0; rec[b + 3] = o.life ?? Infinity; rec[b + 4] = rec[b + 3];
    rec[b + 5] = o.width ?? 0.4; rec[b + 6] = o.w0 ?? 1; rec[b + 7] = o.w1 ?? 1;
    rec[b + 8] = _c.r; rec[b + 9] = _c.g; rec[b + 10] = _c.b; rec[b + 11] = o.alpha ?? 1; rec[b + 12] = o.core ?? 2.5;
    rec[b + 13] = o.flicker ?? 0; rec[b + 14] = 0; rec[b + 15] = 0;
    if (r + 1 > this.#hi) this.#hi = r + 1;
    return r;
  }

  /** Static polyline from a flat [x,y,z, ...] array (n points; extra capacity ignored). */
  setPoints(r, xyz, n) {
    if (r < 0) return;
    const P = this.#P, m = Math.min(n, P), pts = this.#pts, o = r * P * 3;
    for (let i = 0; i < m * 3; i++) pts[o + i] = xyz[i];
    this.#rec[r * RB + 2] = m;
  }

  /** A trail slot (mode 1): push the head position every frame. opts as alloc(); points = history length. */
  trail(o = NO_OPTS) {
    const r = this.alloc({ w0: 0, w1: 1, core: 1.5, ...o }, 1);
    if (r >= 0) this.#rec[r * RB + 2] = 0;
    return r;
  }

  push(r, x, y, z) {
    if (r < 0) return;
    const b = r * RB, P = this.#P, rec = this.#rec, pts = this.#pts;
    const n = rec[b + 2];
    if (n < P) { const o = (r * P + n) * 3; pts[o] = x; pts[o + 1] = y; pts[o + 2] = z; rec[b + 2] = n + 1; return; }
    // full: shift the history by one (P is small: 16-33 points)
    const base = r * P * 3;
    pts.copyWithin(base, base + 3, base + P * 3);
    pts[base + (P - 1) * 3] = x; pts[base + (P - 1) * 3 + 1] = y; pts[base + (P - 1) * 3 + 2] = z;
  }

  /** Fade out over `fade` s, then free. */
  release(r, fade = 0.25) {
    if (r < 0) return;
    const b = r * RB;
    this.#rec[b + 14] = 1;
    this.#rec[b + 3] = Math.min(this.#rec[b + 3], fade);
    this.#rec[b + 4] = fade;
  }

  kill(r) { if (r >= 0) { this.#rec[r * RB] = 0; this.#dirty[r] = 1; } }

  isAlive(r) { return r >= 0 && this.#rec[r * RB] === 1; }

  /** Rebuild live ribbons facing `camera`. */
  update(dt, camera) {
    _cam.setFromMatrixPosition(camera.matrixWorld);
    const rec = this.#rec, pts = this.#pts, P = this.#P;
    const pos = this.#pos.array, info = this.#info.array, col = this.#col.array;
    let hi = 0;
    for (let r = 0; r < this.#hi; r++) {
      const b = r * RB;
      if (!rec[b]) {
        if (this.#dirty[r]) { this.#collapse(r); this.#dirty[r] = 0; }
        continue;
      }
      rec[b + 3] -= dt;
      if (rec[b + 3] <= 0) { rec[b] = 0; this.#collapse(r); continue; }
      hi = r + 1;
      const n = rec[b + 2];
      const trail = rec[b + 1] === 1;
      const max = rec[b + 4];
      const k = max === Infinity ? 1 : rec[b + 3] / max;
      let alpha = rec[b + 11] * (rec[b + 14] ? k : max === Infinity ? 1 : Math.sqrt(k));
      if (rec[b + 13] > 0) alpha *= 1 - rec[b + 13] * Math.random();
      const width = rec[b + 5], w0 = rec[b + 6], w1 = rec[b + 7];
      const cr = rec[b + 8], cg = rec[b + 9], cb = rec[b + 10], core = rec[b + 12];
      const base = r * P;
      for (let j = 0; j < P; j++) {
        const jj = Math.min(j, Math.max(0, n - 1));
        const o = (base + jj) * 3;
        const u = n > 1 ? jj / (n - 1) : 1;
        let half = 0;
        if (n > 1 && j < n) {
          const a = (base + Math.max(0, jj - 1)) * 3, c = (base + Math.min(n - 1, jj + 1)) * 3;
          _t.set(pts[c] - pts[a], pts[c + 1] - pts[a + 1], pts[c + 2] - pts[a + 2]);
          _v.set(_cam.x - pts[o], _cam.y - pts[o + 1], _cam.z - pts[o + 2]);
          _side.crossVectors(_t, _v);
          const l = _side.length();
          half = l > 1e-6 ? (width * 0.5 * (w0 + (w1 - w0) * u)) / l : 0;
        }
        const vi = (base + j) * 2;
        const x = pts[o], y = pts[o + 1], z = pts[o + 2];
        const sx = _side.x * half, sy = _side.y * half, sz = _side.z * half;
        pos[vi * 3] = x - sx; pos[vi * 3 + 1] = y - sy; pos[vi * 3 + 2] = z - sz;
        pos[vi * 3 + 3] = x + sx; pos[vi * 3 + 4] = y + sy; pos[vi * 3 + 5] = z + sz;
        const a = trail ? alpha * u * u : alpha;
        info[vi * 2] = u; info[vi * 2 + 1] = core; info[vi * 2 + 2] = u; info[vi * 2 + 3] = core;
        col[vi * 4] = cr; col[vi * 4 + 1] = cg; col[vi * 4 + 2] = cb; col[vi * 4 + 3] = a;
        col[vi * 4 + 4] = cr; col[vi * 4 + 5] = cg; col[vi * 4 + 6] = cb; col[vi * 4 + 7] = a;
      }
    }
    const upload = hi > 0 || this.#hi > 0;      // skip the upload while nothing is (or was) alive
    this.#hi = hi;
    if (upload) { this.#pos.needsUpdate = true; this.#info.needsUpdate = true; this.#col.needsUpdate = true; }
    this.mesh.geometry.setDrawRange(0, hi * (P - 1) * 6);
    this.mesh.visible = hi > 0;
    if (this.outline) this.outline.visible = hi > 0;
  }

  #collapse(r) {
    const P = this.#P, pos = this.#pos.array, col = this.#col.array;
    pos.fill(0, r * P * 6, (r + 1) * P * 6);
    col.fill(0, r * P * 8, (r + 1) * P * 8);
  }

  clear() {
    for (let r = 0; r < this.#R; r++) if (this.#rec[r * RB]) this.kill(r);
  }
}

// =====================================================================================================
// Bolts - forked, flickering lightning built on Ribbons.
// =====================================================================================================

const MAX_BOLTS = 16;
const MAX_FORKS = 6;
const _a = new Vector3();
const _b = new Vector3();
const _dir = new Vector3();
const _p1 = new Vector3();
const _p2 = new Vector3();
const _up = new Vector3(0, 1, 0);
const _scratch = new Float32Array(65 * 3);

/** Midpoint-displacement lightning path a -> b into out (n = 2^depth + 1 points), bowed up by `arc`. Returns n. */
function jagPath(out, a, b, depth, jag, arc, rand) {
  const n = (1 << depth) + 1;
  _dir.subVectors(b, a);
  const len = _dir.length() || 1;
  _dir.divideScalar(len);
  _p1.crossVectors(_dir, Math.abs(_dir.y) > 0.95 ? _v.set(1, 0, 0) : _up).normalize();
  _p2.crossVectors(_dir, _p1).normalize();
  const e = (n - 1) * 3;
  out[0] = a.x; out[1] = a.y; out[2] = a.z;
  out[e] = b.x; out[e + 1] = b.y; out[e + 2] = b.z;
  let step = n - 1, amp = jag * len;
  while (step > 1) {
    const h = step >> 1;
    for (let i = h; i < n; i += step) {
      const l = (i - h) * 3, r = (i + h) * 3, o = i * 3;
      const o1 = (rand() - 0.5) * 2 * amp, o2 = (rand() - 0.5) * 2 * amp;
      out[o] = (out[l] + out[r]) * 0.5 + _p1.x * o1 + _p2.x * o2;
      out[o + 1] = (out[l + 1] + out[r + 1]) * 0.5 + _p1.y * o1 + _p2.y * o2;
      out[o + 2] = (out[l + 2] + out[r + 2]) * 0.5 + _p1.z * o1 + _p2.z * o2;
    }
    amp *= 0.55;
    step = h;
  }
  if (arc) for (let i = 1; i < n - 1; i++) { const t = i / (n - 1); out[i * 3 + 1] += arc * 4 * t * (1 - t); }
  return n;
}

export class Bolts {
  #ribbons; #rand;
  // per bolt: endpoints, options, slots
  #bolts = Array.from({ length: MAX_BOLTS }, () => ({
    alive: false, a: new Vector3(), b: new Vector3(), depth: 5, jag: 0.12, arc: 0, flicker: 0.06, t: 0, progress: 1,
    main: -1, forks: new Int16Array(MAX_FORKS).fill(-1), forkN: 0, forkAt: new Float32Array(MAX_FORKS),
    forkDir: new Float32Array(MAX_FORKS * 3), forkLen: new Float32Array(MAX_FORKS), forkProgress: 1,
  }));

  /** @param {Ribbons} ribbons  @param {{ rand?: () => number }} [opts] seeded rand for reproducible frames */
  constructor(ribbons, { rand = Math.random } = {}) {
    this.#ribbons = ribbons;
    this.#rand = rand;
  }

  /**
   * A forked bolt from a to b ({x,y,z}). opts: color "#4df3ff", intensity 1.8 (glow), width 0.45, core 3 (white), life 0.35
   * (Infinity = until killed), forks 2, forkLength 0.4 (x main length), jag 0.12, arc 0 (upward bow, world),
   * depth 5 (33 points), flicker 0.06 (s between re-jags; 0 = frozen), progress 1, forkProgress 1.
   * Returns the bolt id (or -1).
   */
  strike(a, b, o = NO_OPTS) {
    const id = this.#bolts.findIndex((x) => !x.alive);
    if (id < 0) return -1;
    const B = this.#bolts[id];
    const R = this.#ribbons;
    const life = o.life ?? 0.35;
    B.main = R.alloc({ color: o.color ?? "#4df3ff", intensity: o.intensity ?? 1.8, width: o.width ?? 0.45, w0: 0.85, w1: 1, core: o.core ?? 3, life, flicker: 0.25 });
    if (B.main < 0) return -1;
    B.alive = true; B.a.copy(a); B.b.copy(b);
    B.depth = Math.min(6, o.depth ?? 5); B.jag = o.jag ?? 0.12; B.arc = o.arc ?? 0; B.flicker = o.flicker ?? 0.06; B.t = 0;
    B.progress = o.progress ?? 1; B.forkProgress = o.forkProgress ?? 1;
    B.forkN = Math.min(MAX_FORKS, o.forks ?? 2);
    const rand = this.#rand;
    for (let f = 0; f < B.forkN; f++) {
      B.forks[f] = R.alloc({ color: o.forkColor ?? o.color ?? "#4df3ff", intensity: (o.intensity ?? 1.8) * 0.85, width: (o.width ?? 0.45) * 0.6, w0: 1, w1: 0.15, core: (o.core ?? 3) * 0.8, life, flicker: 0.35 });
      B.forkAt[f] = 0.2 + rand() * 0.6;
      _dir.set(rand() - 0.5, (rand() - 0.5) * 0.8 - 0.25, rand() - 0.5).normalize();
      B.forkDir.set([_dir.x, _dir.y, _dir.z], f * 3);
      B.forkLen[f] = (o.forkLength ?? 0.4) * (0.6 + rand() * 0.7);
    }
    this.#build(B);
    return id;
  }

  kill(id) {
    const B = this.#bolts[id];
    if (!B?.alive) return;
    B.alive = false;
    this.#ribbons.kill(B.main);
    for (let f = 0; f < B.forkN; f++) this.#ribbons.kill(B.forks[f]);
  }

  #build(B) {
    const R = this.#ribbons, rand = this.#rand;
    const n = jagPath(_scratch, B.a, B.b, B.depth, B.jag, B.arc, rand);
    // mid-leap: reveal only part of the main path
    const shown = Math.max(2, Math.min(n, Math.ceil(B.progress * (n - 1)) + 1));
    R.setPoints(B.main, _scratch, shown);
    const len = B.a.distanceTo(B.b);
    for (let f = 0; f < B.forkN; f++) {
      const at = Math.min(shown - 1, Math.round(B.forkAt[f] * (n - 1)));
      _a.set(_scratch[at * 3], _scratch[at * 3 + 1], _scratch[at * 3 + 2]);
      // forks leave in the bolt's direction of travel, bent by their own random direction
      _dir.subVectors(B.b, B.a).normalize();
      _b.set(B.forkDir[f * 3], B.forkDir[f * 3 + 1], B.forkDir[f * 3 + 2]).addScaledVector(_dir, 0.8).normalize();
      _b.multiplyScalar(B.forkLen[f] * len * B.forkProgress).add(_a);
      const m = jagPath(_forkScratch, _a, _b, Math.max(2, B.depth - 2), B.jag * 1.2, 0, rand);
      R.setPoints(B.forks[f], _forkScratch, m);
    }
  }

  update(dt) {
    for (let i = 0; i < MAX_BOLTS; i++) {
      const B = this.#bolts[i];
      if (!B.alive) continue;
      if (!this.#ribbons.isAlive(B.main)) { this.kill(i); continue; }
      if (B.flicker <= 0) continue;
      B.t += dt;
      if (B.t >= B.flicker) { B.t = 0; this.#build(B); }
    }
  }

  clear() { for (let i = 0; i < MAX_BOLTS; i++) this.kill(i); }
}

const _forkScratch = new Float32Array(65 * 3);
