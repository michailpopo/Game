/**
 * Particle kit - every system is pooled, instanced (ONE draw call each) and allocation-free per frame.
 * Presentation only: runs on real frame time, never touches the simulation.
 *
 *   Particles  (legacy, used by the current game view) lit tumbling debris, `burst(at, opts)`
 *   FxSprites  additive camera-facing sprites in one draw call, four shapes:
 *                spark(x,y,z, vx,vy,vz, opts)   velocity-stretched glowing streak (gravity, drag)
 *                glow(x,y,z, opts)              soft halo with a white-hot core (impact flash, beacon, pickup)
 *                ring(x,y,z, opts)              expanding shockwave ring (billboard, or flat with opts.normal)
 *                puff(...)                      = glow with normal blending when constructed { additive:false }
 *              + presets: sparkBurst(at, opts), halo(at, opts)
 *   Debris     lit instanced solids with gravity, spin, floor bounce and an optional magnet target:
 *                shards (glass/crystal material), coins (gold), gems - `burst(at, opts)`
 *   (ribbons.js: Ribbons - camera-facing trails and forked lightning bolts)
 *   (fx-kit.js: FxKit - one object that owns them all with shatter / strike / coinBurst presets)
 *
 * Colours are sRGB hex (converted to linear); `intensity` > 1 makes a sprite bloom on the high tier.
 */

import {
  AdditiveBlending, Color, DynamicDrawUsage, Euler, Float32BufferAttribute, IcosahedronGeometry, InstancedBufferAttribute, InstancedBufferGeometry,
  InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, NormalBlending, Quaternion, ShaderMaterial, Vector3,
} from "three";

const _m = new Matrix4();
const _q = new Quaternion();
const _e = new Euler();
const _p = new Vector3();
const _s = new Vector3();
const _c = new Color();

export class Particles {
  mesh;
  #max; #next = 0; #live = 0;
  #pos; #vel; #life; #maxLife; #size; #spin;

  constructor(scene, max = 700) {
    this.#max = max;
    this.#pos = new Float32Array(max * 3);
    this.#vel = new Float32Array(max * 3);
    this.#life = new Float32Array(max);
    this.#maxLife = new Float32Array(max);
    this.#size = new Float32Array(max);
    this.#spin = new Float32Array(max);
    const geo = new IcosahedronGeometry(1, 0);
    const mat = new MeshLambertMaterial({ color: 0xffffff });
    this.mesh = new InstancedMesh(geo, mat, max);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    for (let i = 0; i < max; i++) this.mesh.setColorAt(i, _c.set(0xffffff));
    scene.add(this.mesh);
  }

  /**
   * @param {{x:number,y:number,z:number}} at
   * @param {{ count?:number, color?:string|number, speed?:number, up?:number, size?:number, life?:number, spread?:number }} [o]
   */
  burst(at, { count = 12, color = 0xffffff, speed = 5, up = 4, size = 0.14, life = 0.7, spread = 0.3 } = {}) {
    _c.set(color);
    for (let n = 0; n < count; n++) {
      const i = this.#next;
      this.#next = (this.#next + 1) % this.#max;
      const a = Math.random() * Math.PI * 2;
      const sp = speed * (0.4 + Math.random() * 0.6);
      this.#pos[i * 3] = at.x + (Math.random() - 0.5) * spread;
      this.#pos[i * 3 + 1] = at.y + Math.random() * spread;
      this.#pos[i * 3 + 2] = at.z + (Math.random() - 0.5) * spread;
      this.#vel[i * 3] = Math.cos(a) * sp;
      this.#vel[i * 3 + 1] = up * (0.5 + Math.random());
      this.#vel[i * 3 + 2] = Math.sin(a) * sp;
      this.#maxLife[i] = life * (0.7 + Math.random() * 0.6);
      this.#life[i] = this.#maxLife[i];
      this.#size[i] = size * (0.6 + Math.random() * 0.8);
      this.#spin[i] = Math.random() * 10;
      this.mesh.setColorAt(i, _c);
    }
    this.#live = Math.min(this.#max, this.#live + count);
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  update(dt) {
    const g = 14;
    let highest = 0;
    for (let i = 0; i < this.#max; i++) {
      if (this.#life[i] <= 0) {
        if (i < this.mesh.count) { _m.makeScale(0, 0, 0); this.mesh.setMatrixAt(i, _m); }
        continue;
      }
      this.#life[i] -= dt;
      const k = Math.max(0, this.#life[i] / this.#maxLife[i]);
      this.#vel[i * 3 + 1] -= g * dt;
      this.#vel[i * 3] *= Math.exp(-2 * dt);
      this.#vel[i * 3 + 2] *= Math.exp(-2 * dt);
      this.#pos[i * 3] += this.#vel[i * 3] * dt;
      this.#pos[i * 3 + 1] = Math.max(0.05, this.#pos[i * 3 + 1] + this.#vel[i * 3 + 1] * dt);
      this.#pos[i * 3 + 2] += this.#vel[i * 3 + 2] * dt;
      this.#spin[i] += dt * 8;
      _p.set(this.#pos[i * 3], this.#pos[i * 3 + 1], this.#pos[i * 3 + 2]);
      const s = this.#size[i] * (k < 0.3 ? k / 0.3 : 1);
      _s.set(s, s, s);
      _q.setFromEuler(_e.set(this.#spin[i], this.#spin[i] * 0.7, 0));
      _m.compose(_p, _q, _s);
      this.mesh.setMatrixAt(i, _m);
      highest = i + 1;
    }
    this.mesh.count = highest;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  clear() {
    this.#life.fill(0);
    this.mesh.count = 0;
  }
}

// =====================================================================================================
// FxSprites - additive (or alpha) camera-facing sprites: sparks, glows, rings, flat ground glows, puffs.
// =====================================================================================================

const SPRITE_VERTEX = /* glsl */`
attribute vec3 iPos;
attribute vec4 iVel;    // xyz velocity (world) for the streak direction, w stretch (s per unit speed)
attribute vec4 iNrm;    // xyz: normal for flat sprites (0 = face the camera), w: shape 0 glow 1 ring 2 spark
attribute vec4 iCol;    // rgb (linear, HDR), a alpha
attribute vec2 iSize;   // x radius (world), y ring thickness (fraction of the radius)
varying vec2 vUv;
varying vec4 vCol;
varying float vShape;
varying float vThick;
#include <common>
#include <fog_pars_vertex>
void main() {
  vUv = position.xy * 2.0;
  vCol = iCol;
  vShape = iNrm.w;
  vThick = iSize.y;
  float s = iSize.x;
  vec4 mvPosition;
  if ( dot( iNrm.xyz, iNrm.xyz ) > 0.01 ) {
    vec3 n = normalize( iNrm.xyz );
    vec3 t = normalize( cross( n, abs( n.y ) < 0.99 ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 ) ) );
    vec3 b = cross( n, t );
    vec3 wp = iPos + ( t * position.x + b * position.y ) * 2.0 * s;
    mvPosition = viewMatrix * vec4( wp, 1.0 );
  } else {
    mvPosition = modelViewMatrix * vec4( iPos, 1.0 );
    vec3 vv = ( modelViewMatrix * vec4( iVel.xyz, 0.0 ) ).xyz;
    float sp = length( vv.xy );
    vec2 ax = sp > 1e-4 ? vv.xy / sp : vec2( 1.0, 0.0 );
    vec2 pp = vec2( - ax.y, ax.x );
    float len = s * ( 1.0 + sp * iVel.w );
    mvPosition.xy += ax * position.x * 2.0 * len + pp * position.y * 2.0 * s;
  }
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;

const SPRITE_FRAGMENT = /* glsl */`
varying vec2 vUv;
varying vec4 vCol;
varying float vShape;
varying float vThick;
#include <common>
#include <fog_pars_fragment>
void main() {
  float d = length( vUv );
  if ( d > 1.0 ) discard;
  vec3 c = vCol.rgb;
  float peak = max( c.r, max( c.g, c.b ) );
  float a;
  if ( vShape < 0.5 ) {                 // glow: soft halo + white-hot core
    float g = 1.0 - d;
    a = g * g;
    c += vec3( peak ) * smoothstep( 0.32, 0.0, d ) * 0.9;
  } else if ( vShape < 1.5 ) {          // ring
    float w = max( vThick, 0.02 ) * 0.5;
    float band = 1.0 - smoothstep( 0.0, w, abs( d - ( 1.0 - w ) ) );
    a = band * band + ( 1.0 - smoothstep( 0.0, 1.0, 1.0 - d ) ) * 0.12;
    c += vec3( peak ) * band * band * 0.5;
  } else {                              // spark streak: tight bright core
    float g = 1.0 - d;
    a = g * g * g * 1.6;
    c += vec3( peak ) * smoothstep( 0.45, 0.0, d ) * 0.8;
  }
  gl_FragColor = vec4( c, clamp( a, 0.0, 1.0 ) * vCol.a );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}`;

const SPR = 26;           // floats per sprite in the CPU pool
const SHAPE = { glow: 0, ring: 1, spark: 2 };
const NO_OPTS = Object.freeze({});

export class FxSprites {
  mesh;
  #max; #live = 0; #steal = 0; #time = 0;
  #d;                     // CPU pool, SPR floats per sprite (dense: 0..live-1)
  #aPos; #aVel; #aNrm; #aCol; #aSize; #attrs; #ranges;

  /** @param {{ max?: number, additive?: boolean, fog?: boolean }} [opts] */
  constructor(scene, { max = 1500, additive = true, fog = false } = {}) {
    this.#max = max;
    this.#d = new Float32Array(max * SPR);
    const geo = new InstancedBufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0], 3));
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    const attr = (n) => new InstancedBufferAttribute(new Float32Array(max * n), n).setUsage(DynamicDrawUsage);
    this.#aPos = attr(3); this.#aVel = attr(4); this.#aNrm = attr(4); this.#aCol = attr(4); this.#aSize = attr(2);
    geo.setAttribute("iPos", this.#aPos); geo.setAttribute("iVel", this.#aVel); geo.setAttribute("iNrm", this.#aNrm);
    geo.setAttribute("iCol", this.#aCol); geo.setAttribute("iSize", this.#aSize);
    this.#attrs = [this.#aPos, this.#aVel, this.#aNrm, this.#aCol, this.#aSize];
    this.#ranges = this.#attrs.map(() => ({ start: 0, count: 0 }));   // reused every frame (no garbage)
    geo.instanceCount = 0;
    const mat = new ShaderMaterial({
      vertexShader: SPRITE_VERTEX, fragmentShader: SPRITE_FRAGMENT, transparent: true, depthWrite: false,
      blending: additive ? AdditiveBlending : NormalBlending, fog,
      uniforms: fog ? { fogColor: { value: new Color() }, fogNear: { value: 1 }, fogFar: { value: 2000 }, fogDensity: { value: 0 } } : {},
    });
    this.mesh = new Mesh(geo, mat);
    this.mesh.name = additive ? "fx-sprites" : "fx-puffs";
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
    scene.add(this.mesh);
  }

  get live() { return this.#live; }

  /** Low-level emit (no allocation). Returns the pool index (valid until the next update). */
  emit(shape, x, y, z, vx, vy, vz, gravity, drag, life, size0, size1, stretch, color, intensity, alpha, nx, ny, nz, thick, pulse = 0) {
    let i = this.#live;
    if (i >= this.#max) { i = this.#steal; this.#steal = (this.#steal + 1) % this.#max; } else this.#live++;
    const d = this.#d, b = i * SPR;
    _c.set(color).multiplyScalar(intensity);
    d[b] = x; d[b + 1] = y; d[b + 2] = z; d[b + 3] = vx; d[b + 4] = vy; d[b + 5] = vz;
    d[b + 6] = gravity; d[b + 7] = drag; d[b + 8] = life; d[b + 9] = life; d[b + 10] = size0; d[b + 11] = size1;
    d[b + 12] = stretch; d[b + 13] = _c.r; d[b + 14] = _c.g; d[b + 15] = _c.b; d[b + 16] = alpha; d[b + 17] = shape;
    d[b + 18] = nx; d[b + 19] = ny; d[b + 20] = nz; d[b + 21] = thick; d[b + 22] = pulse; d[b + 23] = Math.random() * 6.283;
    d[b + 24] = 0; d[b + 25] = 0;
    return i;
  }

  /** A glowing streak flying with velocity (vx, vy, vz). opts: color, intensity 2, size 0.08, life 0.6, stretch 0.05, gravity 9, drag 1.5 */
  spark(x, y, z, vx, vy, vz, o = NO_OPTS) {
    return this.emit(SHAPE.spark, x, y, z, vx, vy, vz, o.gravity ?? 9, o.drag ?? 1.5, o.life ?? 0.6, o.size ?? 0.08, (o.size ?? 0.08) * (o.endScale ?? 0.3),
      o.stretch ?? 0.05, o.color ?? 0xffffff, o.intensity ?? 2, o.alpha ?? 1, 0, 0, 0, 0);
  }

  /** A soft halo. opts: color, intensity 2, size 1, grow (end size multiplier) 1.4, life 0.35 (Infinity = persistent), normal [x,y,z] (flat), pulse (Hz) */
  glow(x, y, z, o = NO_OPTS) {
    const s = o.size ?? 1, n = o.normal;
    return this.emit(SHAPE.glow, x, y, z, 0, 0, 0, 0, 0, o.life ?? 0.35, s, s * (o.grow ?? 1.4), 0, o.color ?? 0xffffff, o.intensity ?? 2, o.alpha ?? 1,
      n ? n[0] : 0, n ? n[1] : 0, n ? n[2] : 0, 0, o.pulse ?? 0);
  }

  /** An expanding ring. opts: color, intensity 2.5, from 0.2, to 3, life 0.45, thickness 0.18, normal [x,y,z] (flat; default billboard) */
  ring(x, y, z, o = NO_OPTS) {
    const n = o.normal;
    return this.emit(SHAPE.ring, x, y, z, 0, 0, 0, 0, 0, o.life ?? 0.45, o.from ?? 0.2, o.to ?? 3, 0, o.color ?? 0xffffff, o.intensity ?? 2.5, o.alpha ?? 1,
      n ? n[0] : 0, n ? n[1] : 0, n ? n[2] : 0, o.thickness ?? 0.18);
  }

  /** Radial spark burst. opts: count 24, speed 8, up 2, color, colors[], intensity 2.5, size 0.07, life 0.6, stretch 0.05, gravity 9, spread 0.2 */
  sparkBurst(at, o = NO_OPTS) {
    const count = o.count ?? 24, speed = o.speed ?? 8, up = o.up ?? 2, spread = o.spread ?? 0.2, colors = o.colors;
    for (let n = 0; n < count; n++) {
      // uniform direction on a sphere, biased upward by `up`
      const u = Math.random() * 2 - 1, a = Math.random() * 6.283, r = Math.sqrt(1 - u * u);
      const sp = speed * (0.35 + Math.random() * 0.65);
      const color = colors ? colors[n % colors.length] : o.color ?? 0xffffff;
      this.emit(SHAPE.spark, at.x + (Math.random() - 0.5) * spread, at.y + (Math.random() - 0.5) * spread, at.z + (Math.random() - 0.5) * spread,
        r * Math.cos(a) * sp, u * sp + up * Math.random(), r * Math.sin(a) * sp, o.gravity ?? 9, o.drag ?? 1.6,
        (o.life ?? 0.6) * (0.6 + Math.random() * 0.7), (o.size ?? 0.07) * (0.7 + Math.random() * 0.6), (o.size ?? 0.07) * 0.25,
        o.stretch ?? 0.05, color, o.intensity ?? 2.5, 1, 0, 0, 0, 0);
    }
  }

  /** Impact flash: a big fast glow + a smaller hot one. */
  halo(at, o = NO_OPTS) {
    const s = o.size ?? 1.6;
    this.glow(at.x, at.y, at.z, { color: o.color ?? 0xffffff, intensity: o.intensity ?? 2.2, size: s, grow: 1.6, life: o.life ?? 0.4 });
    this.glow(at.x, at.y, at.z, { color: 0xffffff, intensity: (o.intensity ?? 2.2) * 1.2, size: s * 0.45, grow: 1.2, life: (o.life ?? 0.4) * 0.6 });
  }

  update(dt) {
    this.#time += dt;
    const d = this.#d;
    let live = this.#live;
    for (let i = 0; i < live;) {
      const b = i * SPR;
      d[b + 8] -= dt;
      if (d[b + 8] <= 0) {
        live--;
        if (i !== live) d.copyWithin(b, live * SPR, live * SPR + SPR);
        continue;
      }
      const drag = Math.exp(-d[b + 7] * dt);
      d[b + 3] *= drag; d[b + 5] *= drag;
      d[b + 4] = d[b + 4] * drag - d[b + 6] * dt;
      d[b] += d[b + 3] * dt; d[b + 1] += d[b + 4] * dt; d[b + 2] += d[b + 5] * dt;
      i++;
    }
    this.#live = live;
    if (this.#steal >= live) this.#steal = 0;
    this.#write();
  }

  #write() {
    const d = this.#d, live = this.#live, t = this.#time;
    const P = this.#aPos.array, V = this.#aVel.array, N = this.#aNrm.array, C = this.#aCol.array, S = this.#aSize.array;
    for (let i = 0; i < live; i++) {
      const b = i * SPR;
      const life = d[b + 8], max = d[b + 9];
      const k = max === Infinity ? 1 : life / max;          // 1 -> 0
      const shape = d[b + 17];
      const e = 1 - k;
      let size, alpha = d[b + 16];
      if (shape === 1) {                                     // ring: ease-out growth, fade
        const q = 1 - (1 - e) * (1 - e) * (1 - e);
        size = d[b + 10] + (d[b + 11] - d[b + 10]) * q;
        alpha *= k;
      } else if (shape === 0) {                              // glow: quick bloom-out
        size = d[b + 10] + (d[b + 11] - d[b + 10]) * (1 - (1 - e) * (1 - e));
        alpha *= max === Infinity ? 1 : k * k;
      } else {                                               // spark: shrink + fade
        size = d[b + 11] + (d[b + 10] - d[b + 11]) * k;
        alpha *= Math.min(1, k * 1.6);
      }
      if (d[b + 22] > 0) alpha *= 0.55 + 0.45 * Math.sin(t * d[b + 22] * 6.283 + d[b + 23]);
      P[i * 3] = d[b]; P[i * 3 + 1] = d[b + 1]; P[i * 3 + 2] = d[b + 2];
      V[i * 4] = d[b + 3]; V[i * 4 + 1] = d[b + 4]; V[i * 4 + 2] = d[b + 5]; V[i * 4 + 3] = d[b + 12];
      N[i * 4] = d[b + 18]; N[i * 4 + 1] = d[b + 19]; N[i * 4 + 2] = d[b + 20]; N[i * 4 + 3] = shape;
      C[i * 4] = d[b + 13]; C[i * 4 + 1] = d[b + 14]; C[i * 4 + 2] = d[b + 15]; C[i * 4 + 3] = alpha;
      S[i * 2] = size; S[i * 2 + 1] = d[b + 21];
    }
    for (let n = 0; n < this.#attrs.length; n++) {
      const a = this.#attrs[n], r = this.#ranges[n];
      a.clearUpdateRanges();
      if (live) { r.start = 0; r.count = live * a.itemSize; a.updateRanges.push(r); a.needsUpdate = true; }
    }
    this.mesh.geometry.instanceCount = live;
    this.mesh.visible = live > 0;
  }

  clear() { this.#live = 0; this.#write(); }
}

// =====================================================================================================
// Debris - lit instanced solids (glass shards, coins, gems) with gravity, spin, bounce, magnet.
// =====================================================================================================

const DEB = 18;
const _axis = new Vector3();

export class Debris {
  mesh;
  /** Magnet target (world). Pieces burst with `home: true` fly here after their delay. */
  target = new Vector3();
  /** Called with the pool index when a homing piece arrives (e.g. punch the coin counter). */
  onArrive = null;
  #max; #live = 0; #steal = 0; #d; #floorY; #bounce; #gravity;

  /**
   * @param {import("three").BufferGeometry} geometry  e.g. shardGeometry(), coinGeometry(), gemGeometry()
   * @param {import("three").Material} material        e.g. MATERIALS.crystal(0xffffff), MATERIALS.gold()
   */
  constructor(scene, geometry, material, { max = 160, castShadow = false, floorY = 0, bounce = 0.35, gravity = 16, name = "fx-debris" } = {}) {
    this.#max = max;
    this.#d = new Float32Array(max * DEB);
    this.#floorY = floorY; this.#bounce = bounce; this.#gravity = gravity;
    this.mesh = new InstancedMesh(geometry, material, max);
    this.mesh.name = name;
    this.mesh.frustumCulled = false;
    this.mesh.castShadow = castShadow;
    this.mesh.count = 0;
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    for (let i = 0; i < max; i++) this.mesh.setColorAt(i, _c.set(0xffffff));
    scene.add(this.mesh);
  }

  get live() { return this.#live; }

  /**
   * opts: count 20, color | colors[], speed 7, up 5, size 0.3, life 1.4, spread 0.3, spin 12,
   *       dir {x,y,z} + cone 0..1 (0 = straight along dir, 1 = any direction), home false, homeDelay 0.45
   */
  burst(at, o = NO_OPTS) {
    const count = o.count ?? 20, colors = o.colors, speed = o.speed ?? 7, up = o.up ?? 5, spread = o.spread ?? 0.3;
    const cone = o.cone ?? 1, dir = o.dir;
    for (let n = 0; n < count; n++) {
      let i = this.#live;
      if (i >= this.#max) { i = this.#steal; this.#steal = (this.#steal + 1) % this.#max; } else this.#live++;
      const d = this.#d, b = i * DEB;
      const u = Math.random() * 2 - 1, a = Math.random() * 6.283, r = Math.sqrt(1 - u * u);
      let vx = r * Math.cos(a), vy = u, vz = r * Math.sin(a);
      if (dir) { vx = dir.x + vx * cone; vy = dir.y + vy * cone; vz = dir.z + vz * cone; const l = Math.hypot(vx, vy, vz) || 1; vx /= l; vy /= l; vz /= l; }
      const sp = speed * (0.45 + Math.random() * 0.55);
      d[b] = at.x + (Math.random() - 0.5) * spread; d[b + 1] = at.y + (Math.random() - 0.5) * spread; d[b + 2] = at.z + (Math.random() - 0.5) * spread;
      d[b + 3] = vx * sp; d[b + 4] = vy * sp + up * (0.5 + Math.random() * 0.5); d[b + 5] = vz * sp;
      _axis.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      d[b + 6] = _axis.x; d[b + 7] = _axis.y; d[b + 8] = _axis.z;
      d[b + 9] = Math.random() * 6.283;                           // angle
      d[b + 10] = (o.spin ?? 12) * (0.5 + Math.random());          // spin rad/s
      d[b + 11] = (o.life ?? 1.4) * (0.75 + Math.random() * 0.5); // life
      d[b + 12] = d[b + 11];
      d[b + 13] = (o.size ?? 0.3) * (0.6 + Math.random() * 0.8);
      d[b + 14] = o.home ? (o.homeDelay ?? 0.45) + n * 0.02 : -1;  // homing starts after (s), -1 = never
      d[b + 15] = 0;                                               // age
      d[b + 16] = 0; d[b + 17] = 0;
      this.mesh.setColorAt(i, _c.set(colors ? colors[n % colors.length] : o.color ?? 0xffffff));
    }
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  update(dt) {
    const d = this.#d, g = this.#gravity, floor = this.#floorY, bounce = this.#bounce, T = this.target;
    let live = this.#live;
    let colorsMoved = false;
    for (let i = 0; i < live;) {
      const b = i * DEB;
      d[b + 11] -= dt;
      d[b + 15] += dt;
      let dead = d[b + 11] <= 0;
      if (!dead && d[b + 14] >= 0 && d[b + 15] > d[b + 14]) {
        // magnet: steer toward the target, accelerating
        const dx = T.x - d[b], dy = T.y - d[b + 1], dz = T.z - d[b + 2];
        const dist = Math.hypot(dx, dy, dz);
        if (dist < 0.35) { dead = true; this.onArrive?.(i); }
        else {
          const want = 10 + (d[b + 15] - d[b + 14]) * 40, k = 1 - Math.exp(-9 * dt);
          d[b + 3] += (dx / dist * want - d[b + 3]) * k; d[b + 4] += (dy / dist * want - d[b + 4]) * k; d[b + 5] += (dz / dist * want - d[b + 5]) * k;
          d[b + 11] = Math.max(d[b + 11], 0.2);
        }
      } else if (!dead) {
        d[b + 4] -= g * dt;
      }
      if (dead) {
        live--;
        if (i !== live) {
          d.copyWithin(b, live * DEB, live * DEB + DEB);
          this.mesh.getColorAt(live, _c); this.mesh.setColorAt(i, _c);
          colorsMoved = true;
        }
        continue;
      }
      d[b] += d[b + 3] * dt; d[b + 1] += d[b + 4] * dt; d[b + 2] += d[b + 5] * dt;
      const half = d[b + 13] * 0.5;
      if (d[b + 14] < 0 && d[b + 1] < floor + half && d[b + 4] < 0) {
        d[b + 1] = floor + half; d[b + 4] = -d[b + 4] * bounce; d[b + 3] *= 0.7; d[b + 5] *= 0.7; d[b + 10] *= 0.6;
      }
      d[b + 9] += d[b + 10] * dt;
      const k = d[b + 11] / d[b + 12];
      const s = d[b + 13] * Math.min(1, d[b + 15] / 0.06) * (k < 0.25 ? k / 0.25 : 1);
      _p.set(d[b], d[b + 1], d[b + 2]);
      _q.setFromAxisAngle(_axis.set(d[b + 6], d[b + 7], d[b + 8]), d[b + 9]);
      _s.set(s, s, s);
      _m.compose(_p, _q, _s);
      this.mesh.setMatrixAt(i, _m);
      i++;
    }
    this.#live = live;
    if (this.#steal >= live) this.#steal = 0;
    this.mesh.count = live;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (colorsMoved && this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  clear() { this.#live = 0; this.mesh.count = 0; }
}
