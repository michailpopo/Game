/**
 * Toon bolts - "Bolt B": crisp, outlined, angular lightning. An ALTERNATIVE to the classic glow bolts of ribbons.js (which
 * stay untouched and remain the default). The owner compares the two in play (key B, or ?bolt=toon) and picks one.
 *
 * Same pooled camera-facing ribbons as the classic bolts (`Ribbons`), with a different surface and a different path:
 *   surface  normal blending, three flat bands across the ribbon (white core / skin colour / dark outline), hard
 *            anti-aliased edges, no additive haze, no bloom (colours stay <= 1). Reads over bright lit roofs too and
 *            matches the chunky outlined UI.
 *   path     a real ZIG-ZAG: a handful of straight segments whose joints jump alternately to either side of the
 *            straight line, in the plane facing the camera (so the angles show on screen), plus short side branches.
 *   timing   full strength for ~75% of the life, then it drops away fast; it re-jags every `flicker` s so it crackles.
 *
 *   const toon = new ToonBolts(scene, camera);
 *   toon.setSkin("#4df3ff");                    // body colour comes per bolt; the outline is a dark shade of the skin
 *   toon.strike(from, to, { color, width, forks, forkLength, jag, arc, life, segs, flicker });
 *   toon.update(dt, camera);  toon.clear();
 *
 * 1 draw call: a pool of 48 ribbons x 10 segments = 960 triangles.
 */

import { Color, NormalBlending, ShaderMaterial, Vector3 } from "three";
import { Ribbons } from "./ribbons.js";

const VERTEX = /* glsl */`
attribute float aSide;
attribute vec2 aInfo;     // x: u along, y: core amount (> 0 = draw the white core)
attribute vec4 aCol;      // rgb body colour (linear), a alpha
varying float vSide;
varying float vCore;
varying vec4 vCol;
void main() {
  vSide = aSide;
  vCore = aInfo.y;
  vCol = aCol;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

const FRAGMENT = /* glsl */`
uniform vec3 olColor;
varying float vSide;
varying float vCore;
varying vec4 vCol;
void main() {
  float s = min( abs( vSide ), 1.0 );
  float aa = fwidth( s ) * 1.1 + 0.002;
  float body = 1.0 - smoothstep( 0.72 - aa, 0.72 + aa, s );                      // skin colour (the core sits on top of it)
  float core = ( 1.0 - smoothstep( 0.34 - aa, 0.34 + aa, s ) ) * step( 0.001, vCore );
  vec3 c = mix( olColor, vCol.rgb, body );
  c = mix( c, vec3( 1.0 ), core );
  float edge = 1.0 - smoothstep( 1.0 - 2.0 * aa, 1.0, s );
  float a = smoothstep( 0.0, 0.5, vCol.a ) * edge;                               // hold, then drop away fast
  gl_FragColor = vec4( c, a );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const MAX_BOLTS = 32;
const MAX_FORKS = 4;
const _c = new Color();
const _dir = new Vector3();
const _mid = new Vector3();
const _toCam = new Vector3();
const _side = new Vector3();
const _p = new Vector3();
const _q = new Vector3();
const _up = new Vector3(0, 1, 0);
const _scratch = new Float32Array(16 * 3);
const _forkScratch = new Float32Array(5 * 3);

/**
 * a -> b as `segs` straight segments whose interior joints jump alternately to either side (`side`, unit) of the straight line
 * by amp x (0.5..1), with slightly uneven spacing; `arc` bows the whole path upward. Returns the point count (segs + 1).
 */
function zigzag(out, a, b, segs, amp, side, arc, rand) {
  const n = segs + 1;
  const flip = rand() < 0.5 ? 1 : -1;
  for (let i = 0; i < n; i++) {
    const t = i === 0 ? 0 : i === segs ? 1 : (i + (rand() - 0.5) * 0.5) / segs;
    let x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t, z = a.z + (b.z - a.z) * t;
    if (i > 0 && i < segs) {
      const m = amp * (0.5 + 0.5 * rand()) * ((i & 1) ? flip : -flip);
      x += side.x * m; y += side.y * m; z += side.z * m;
    }
    y += arc * 4 * t * (1 - t);
    out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
  }
  return n;
}

export class ToonBolts {
  #R; #rand; #cam; #bolts;

  /** @param {import("three").Scene} scene  @param {import("three").Camera} camera  @param {{ max?: number, points?: number, rand?: () => number }} [opts] */
  constructor(scene, camera, { max = 48, points = 11, rand = Math.random } = {}) {
    this.#cam = camera;
    this.#rand = rand;
    this.#R = new Ribbons(scene, { max, points, outline: null });
    this.uniforms = { olColor: { value: new Color("#0b1446") } };
    // Swap the classic glow surface for the toon one; the pool, the quad strips and the lifetimes are the classic code.
    this.#R.mesh.material.dispose();
    this.#R.mesh.material = new ShaderMaterial({
      uniforms: this.uniforms, vertexShader: VERTEX, fragmentShader: FRAGMENT,
      transparent: true, depthWrite: false, blending: NormalBlending,
    });
    this.#R.mesh.name = "fx-toon-bolts";
    this.#R.mesh.renderOrder = 10;
    this.#bolts = Array.from({ length: MAX_BOLTS }, () => ({
      alive: false, a: new Vector3(), b: new Vector3(), segs: 5, amp: 1, arc: 0, t: 0, flicker: 0.09,
      main: -1, forkN: 0, forks: new Int16Array(MAX_FORKS).fill(-1), forkAt: new Int8Array(MAX_FORKS),
      forkDir: new Float32Array(MAX_FORKS * 3), forkLen: new Float32Array(MAX_FORKS),
    }));
  }

  /** The skin's glow colour tints the outline: a deep, saturated shade of the same hue (dark navy for the default cyan). */
  setSkin(hex) {
    const hsl = { h: 0, s: 0, l: 0 };
    _c.set(hex).getHSL(hsl);
    this.uniforms.olColor.value.setHSL(hsl.h, Math.min(0.85, 0.35 + hsl.s * 0.5), 0.13);
  }

  /**
   * A forked zig-zag bolt from `a` to `b` ({x,y,z}). opts: color "#4df3ff", width (world metres, the whole ribbon incl. the
   * outline), forks 2, forkLength 0.3 (x main length), jag 0.12 (joint offset as a share of the length), arc 0 (upward bow,
   * metres), life 0.3 s, segs 5 (straight segments, <= 10), flicker 0.09 (s between re-jags).
   */
  strike(a, b, o = {}) {
    const id = this.#bolts.findIndex((x) => !x.alive);
    if (id < 0) return -1;
    const B = this.#bolts[id], R = this.#R, rand = this.#rand;
    const life = o.life ?? 0.3, width = o.width ?? 3, color = o.color ?? "#4df3ff";
    B.main = R.alloc({ color, intensity: 1, width, w0: 0.9, w1: 1, core: 1, life });
    if (B.main < 0) return -1;
    B.alive = true; B.a.copy(a); B.b.copy(b);
    B.segs = Math.max(2, Math.min(R.maxPoints - 1, o.segs ?? 5));
    B.amp = (o.jag ?? 0.12) * a.distanceTo(b);
    B.arc = o.arc ?? 0;
    B.flicker = o.flicker ?? 0.09; B.t = 0;
    B.forkN = Math.min(MAX_FORKS, o.forks ?? 2);
    for (let f = 0; f < B.forkN; f++) {
      B.forks[f] = R.alloc({ color: o.forkColor ?? color, intensity: 1, width: width * 0.55, w0: 1, w1: 0.25, core: 1, life });
      B.forkAt[f] = 1 + Math.floor(rand() * (B.segs - 1));
      _dir.set(rand() - 0.5, (rand() - 0.5) * 0.5, rand() - 0.5);
      B.forkDir.set([_dir.x, _dir.y, _dir.z], f * 3);
      B.forkLen[f] = (o.forkLength ?? 0.3) * (0.6 + rand() * 0.7);
    }
    this.#build(B);
    return id;
  }

  /** Rebuild the zig-zag (new joint offsets) with the same endpoints; the offsets lie in the plane facing the camera. */
  #build(B) {
    const R = this.#R, rand = this.#rand;
    _dir.subVectors(B.b, B.a);
    const len = _dir.length() || 1;
    _dir.divideScalar(len);
    _mid.addVectors(B.a, B.b).multiplyScalar(0.5);
    _toCam.subVectors(this.#cam.position, _mid);
    _side.crossVectors(_dir, _toCam);
    if (_side.lengthSq() < 1e-6) _side.crossVectors(_dir, _up);
    _side.normalize();
    const n = zigzag(_scratch, B.a, B.b, B.segs, B.amp, _side, B.arc, rand);
    R.setPoints(B.main, _scratch, n);
    for (let f = 0; f < B.forkN; f++) {
      const at = Math.min(n - 2, B.forkAt[f]);
      _p.set(_scratch[at * 3], _scratch[at * 3 + 1], _scratch[at * 3 + 2]);
      // a branch leaves in the bolt's direction of travel, bent sideways by its own random direction
      _q.set(B.forkDir[f * 3], B.forkDir[f * 3 + 1], B.forkDir[f * 3 + 2]).addScaledVector(_dir, 1.1).normalize().multiplyScalar(B.forkLen[f] * len).add(_p);
      const m = zigzag(_forkScratch, _p, _q, 3, B.amp * 0.5, _side, 0, rand);
      R.setPoints(B.forks[f], _forkScratch, m);
    }
  }

  update(dt, camera) {
    for (let i = 0; i < MAX_BOLTS; i++) {
      const B = this.#bolts[i];
      if (!B.alive) continue;
      if (!this.#R.isAlive(B.main)) { this.#kill(B); continue; }
      B.t += dt;
      if (B.t >= B.flicker) { B.t = 0; this.#build(B); }
    }
    this.#R.update(dt, camera);
  }

  #kill(B) {
    B.alive = false;
    this.#R.kill(B.main);
    for (let f = 0; f < B.forkN; f++) this.#R.kill(B.forks[f]);
  }

  clear() {
    for (const B of this.#bolts) if (B.alive) this.#kill(B);
    this.#R.clear();
  }
}
