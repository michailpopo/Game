/**
 * Everything that moves in the arena, drawn with a handful of instanced meshes (one draw
 * call each, rewritten every frame, no per-frame allocation):
 *
 *   planets   IcosahedronGeometry(r,1), 80 tris, flat-shaded, colour + emissive per instance
 *   rocks     IcosahedronGeometry(r,0), 20 tris: pebbles and loose stardust
 *   outlines  the same two meshes again, back faces, 12% larger, in the theme's outline colour -
 *             they share the instance matrices (no extra upload) and make the bodies read on the
 *             light nebula
 *   rings     TorusGeometry(r, t, 6, 16), 192 tris, from the ringed giant up
 *   halos     billboard quads, radial gradient: glows (lava, suns ...), the head's coma, gold dust
 *   badges    billboard quads from a canvas atlas: the value under every planet (>= 12 px at 800x450)
 *   shadows   flat soft blobs under every body
 *   rims      flat rings under heads: danger (bigger than yours) / prey (smaller) / you
 *   ribbons   one dynamic strip mesh: every comet's trail along its recorded path
 *
 * Presentation only: the view calls begin(), adds bodies from simulation state, then end().
 */

import {
  BackSide, BufferAttribute, BufferGeometry, CanvasTexture, Color, DoubleSide, DynamicDrawUsage,
  Euler, IcosahedronGeometry, InstancedBufferAttribute, OctahedronGeometry, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  MeshLambertMaterial, NormalBlending, PlaneGeometry, Quaternion, RingGeometry, SRGBColorSpace, TorusGeometry, Vector3,
} from "three";
import { BADGE_STYLE, PLANETS, STARDUST } from "../render/palette.js";
import { FONT_FAMILY } from "../render/text-texture.js";
import { fmtValue, ladderKey, valueAt } from "./values.js";

const COLS = 8, ROWS = 8, CW = 128, CH = 64;
const LEVELS = COLS * ROWS;
const RIBBON_PTS = 32;

const _m = new Matrix4();
const _p = new Vector3();
const _q = new Quaternion();
const _e = new Euler();
const _s = new Vector3();
const _c = new Color();

/** Pill + number per ladder level. */
function badgeAtlas() {
  const c = document.createElement("canvas");
  c.width = COLS * CW;
  c.height = ROWS * CH;
  const ctx = c.getContext("2d");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let lv = 1; lv <= LEVELS; lv++) {
    const text = fmtValue(valueAt(lv));
    const col = (lv - 1) % COLS, row = Math.floor((lv - 1) / COLS);
    let px = Math.round(CH * BADGE_STYLE.fontScale);
    ctx.font = `${px}px ${FONT_FAMILY}`;
    let w = ctx.measureText(text).width;
    const maxW = CW - 22;
    if (w > maxW) { px = Math.floor(px * (maxW / w)); ctx.font = `${px}px ${FONT_FAMILY}`; w = ctx.measureText(text).width; }
    const pw = Math.min(CW - 4, w + 26), ph = CH - 8;
    const x0 = col * CW + (CW - pw) / 2, y0 = row * CH + 4;
    ctx.fillStyle = BADGE_STYLE.pill;
    ctx.beginPath();
    ctx.roundRect(x0, y0, pw, ph, ph / 2);
    ctx.fill();
    ctx.fillStyle = BADGE_STYLE.fill;
    ctx.fillText(text, col * CW + CW / 2, row * CH + CH / 2 + px * 0.06);
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function radialTexture(inner = 1, mid = 0.35) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, `rgba(255,255,255,${inner})`);
  g.addColorStop(0.45, `rgba(255,255,255,${mid})`);
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/** Lambert + flat shading + per-instance emissive (aGlow). */
function bodyMaterial() {
  const mat = new MeshLambertMaterial({ color: 0xffffff, flatShading: true });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aGlow;\nvarying float vGlow;")
      .replace("#include <uv_vertex>", "#include <uv_vertex>\nvGlow = aGlow;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vGlow;")
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * vGlow;");
  };
  return mat;
}

/** Back-face hull, scaled up in object space: a cheap outline that follows every instance. */
function outlineMaterial(color, grow) {
  const mat = new MeshBasicMaterial({ color, side: BackSide });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>\ntransformed *= ${grow.toFixed(3)};`);
  };
  mat.customProgramCacheKey = () => `outline-${grow}`;
  return mat;
}

function instanced(geo, mat, cap, name) {
  const m = new InstancedMesh(geo, mat, cap);
  m.name = name;
  m.frustumCulled = false;            // instances cover the whole arena
  m.instanceMatrix.setUsage(DynamicDrawUsage);
  m.count = 0;
  return m;
}

/** Resolved look per ladder level (colours pre-parsed once). */
function lookFor(level) {
  const def = PLANETS[ladderKey(level)] || PLANETS.pebble;
  return {
    color: new Color(def.color),
    rock: !!def.rock,
    emissive: def.emissive || 0,
    glow: def.glow ? new Color(def.glow) : null,
    glowScale: def.glowScale || 2,
    ring: def.ring ? new Color(def.ring) : null,
    rings: def.rings || 1,
    pulse: !!def.pulse,
  };
}

export class Bodies {
  #owned = [];
  #looks = [];
  #ribbonComets = 16;
  #n = { planets: 0, rocks: 0, dust: 0, rings: 0, halos: 0, badges: 0, shadows: 0, rims: 0 };
  #cam = new Quaternion();
  #ribbon; #ribPos; #ribCol; #ribSlot = 0; #ribK = 0; #ribColor = new Color();
  #dustColors = {};
  #gold = new Color(STARDUST.gold);
  #goldGlow = new Color(STARDUST.goldGlow);
  #white = new Color(0xffffff);

  constructor(scene, theme, { planets = 700, rocks = 500, dust = 800, rings = 160, halos = 500, badges = 800, comets = 16 } = {}) {
    for (let lv = 1; lv <= LEVELS; lv++) this.#looks.push(lookFor(lv));
    for (const [v, hex] of Object.entries(STARDUST.colors)) this.#dustColors[v] = new Color(hex);

    const own = (r) => { this.#owned.push(r); return r; };
    const planetGeo = own(new IcosahedronGeometry(0.5, 1));
    const rockGeo = own(new IcosahedronGeometry(0.5, 0));
    const mkGlowAttr = (geo, cap) => {
      const a = new InstancedBufferAttribute(new Float32Array(cap), 1);
      a.setUsage(DynamicDrawUsage);
      geo.setAttribute("aGlow", a);
      return a;
    };
    const dustGeo = own(new OctahedronGeometry(0.5, 0));
    this.planetGlow = mkGlowAttr(planetGeo, planets);
    this.rockGlow = mkGlowAttr(rockGeo, rocks);
    this.dustGlow = mkGlowAttr(dustGeo, dust);
    const bodyMat = own(bodyMaterial());
    this.planets = instanced(planetGeo, bodyMat, planets, "planets");
    this.rocks = instanced(rockGeo, bodyMat, rocks, "pebbles");
    this.dustMesh = instanced(dustGeo, bodyMat, dust, "stardust");
    for (const m of [this.planets, this.rocks, this.dustMesh]) { m.setColorAt(0, _c.set(0xffffff)); m.instanceColor.setUsage(DynamicDrawUsage); }

    // Outlines share the bodies' instance matrices.
    this.outlineMat = own(outlineMaterial(theme.outline, 1.14));
    this.planetOutline = instanced(planetGeo, this.outlineMat, planets, "planet-outline");
    this.planetOutline.instanceMatrix = this.planets.instanceMatrix;
    this.rockOutline = instanced(rockGeo, this.outlineMat, rocks, "rock-outline");
    this.rockOutline.instanceMatrix = this.rocks.instanceMatrix;

    const ringGeo = own(new TorusGeometry(1, 0.075, 6, 16));
    ringGeo.rotateX(Math.PI / 2);                    // lie flat (XZ), tilted per instance
    this.rings = instanced(ringGeo, own(new MeshLambertMaterial({ color: 0xffffff })), rings, "rings");
    this.rings.setColorAt(0, _c.set(0xffffff));

    const quad = own(new PlaneGeometry(1, 1));
    this.haloTex = own(radialTexture(0.9, 0.35));
    this.halos = instanced(quad, own(new MeshBasicMaterial({ map: this.haloTex, transparent: true, depthWrite: false, blending: NormalBlending })), halos, "halos");
    this.halos.setColorAt(0, _c.set(0xffffff));
    this.halos.renderOrder = 2;

    // Badges: a cell of the atlas per instance (aCell), always on top.
    const badgeGeo = own(new PlaneGeometry(1, 0.5));
    this.badgeCell = new InstancedBufferAttribute(new Float32Array(badges), 1);
    this.badgeCell.setUsage(DynamicDrawUsage);
    badgeGeo.setAttribute("aCell", this.badgeCell);
    this.atlas = own(badgeAtlas());
    const badgeMat = own(new MeshBasicMaterial({ map: this.atlas, transparent: true, depthTest: false, depthWrite: false }));
    badgeMat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nattribute float aCell;")
        .replace("#include <uv_vertex>", `#include <uv_vertex>
vec2 cell = vec2(mod(aCell, ${COLS}.0), floor(aCell / ${COLS}.0));
vMapUv = vec2((cell.x + uv.x) / ${COLS}.0, 1.0 - (cell.y + 1.0 - uv.y) / ${ROWS}.0);`);
    };
    this.badges = instanced(badgeGeo, badgeMat, badges, "badges");
    this.badges.renderOrder = 5;

    const shadowGeo = own(new PlaneGeometry(1, 1));
    shadowGeo.rotateX(-Math.PI / 2);
    this.shadowTex = own(radialTexture(0.9, 0.6));
    this.shadows = instanced(shadowGeo, own(new MeshBasicMaterial({ map: this.shadowTex, color: 0x2a2350, transparent: true, opacity: 0.32, depthWrite: false })), planets + rocks, "shadows");
    this.shadows.renderOrder = -1;

    const rimGeo = own(new RingGeometry(0.82, 1, 40));
    rimGeo.rotateX(-Math.PI / 2);
    this.rims = instanced(rimGeo, own(new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false })), comets * 2, "rims");
    this.rims.setColorAt(0, _c.set(0xffffff));
    this.rims.renderOrder = -1;

    // Ribbons: comets x RIBBON_PTS points, two vertices each, RGBA vertex colours.
    const verts = comets * RIBBON_PTS * 2;
    const rg = new BufferGeometry();
    this.#ribPos = new Float32Array(verts * 3);
    this.#ribCol = new Float32Array(verts * 4);
    const pa = new BufferAttribute(this.#ribPos, 3); pa.setUsage(DynamicDrawUsage);
    const ca = new BufferAttribute(this.#ribCol, 4); ca.setUsage(DynamicDrawUsage);
    rg.setAttribute("position", pa);
    rg.setAttribute("color", ca);
    const idx = [];
    for (let c = 0; c < comets; c++) {
      for (let k = 0; k < RIBBON_PTS - 1; k++) {
        const a = (c * RIBBON_PTS + k) * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    rg.setIndex(idx);
    own(rg);
    this.#ribbon = new Mesh(rg, own(new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: DoubleSide })));
    this.#ribbon.name = "ribbons";
    this.#ribbon.frustumCulled = false;
    this.#ribbon.renderOrder = -1;
    this.#ribbonComets = comets;
    scene.add(this.#ribbon, this.shadows, this.rims, this.planetOutline, this.rockOutline, this.planets, this.rocks, this.dustMesh, this.rings, this.halos, this.badges);
  }

  setTheme(theme) { this.outlineMat.color.set(theme.outline); }

  look(level) { return this.#looks[Math.min(LEVELS, Math.max(1, level)) - 1]; }

  begin(camera) {
    this.#cam.copy(camera.quaternion);
    for (const k in this.#n) this.#n[k] = 0;
    this.#ribSlot = 0;
    this.#ribPos.fill(0);
    this.#ribCol.fill(0);
  }

  /**
   * One planet of a chain (or a dropped one).
   * @param {number} level ladder level; spin radians; bright colour multiplier; lift extra height
   * @param {boolean} badge draw its value badge
   */
  planet(x, z, size, level, spin, bright = 1, lift = 0, badge = true, time = 0) {
    const L = this.look(level);
    const y = size * 0.5 + lift;
    _q.setFromEuler(_e.set(0.35, spin, 0.2));
    _p.set(x, y, z);
    _s.setScalar(size);
    _m.compose(_p, _q, _s);
    _c.copy(L.color).multiplyScalar(bright);
    if (L.rock) {
      const k = this.#n.rocks++;
      if (k < this.rocks.instanceMatrix.count) { this.rocks.setMatrixAt(k, _m); this.rocks.setColorAt(k, _c); this.rockGlow.setX(k, L.emissive); }
    } else {
      const k = this.#n.planets++;
      if (k < this.planets.instanceMatrix.count) { this.planets.setMatrixAt(k, _m); this.planets.setColorAt(k, _c); this.planetGlow.setX(k, L.emissive); }
    }
    if (L.ring) {
      for (let r = 0; r < L.rings; r++) {
        const pulse = L.pulse ? 1 + 0.12 * Math.sin(time * 6) : 1;
        _q.setFromEuler(_e.set(0.42 + r * 0.9, r * 1.2 + spin * 0.15, 0.18 - r * 0.5));
        _s.setScalar(size * 0.92 * pulse);
        _m.compose(_p, _q, _s);
        const k = this.#n.rings++;
        if (k < this.rings.instanceMatrix.count) { this.rings.setMatrixAt(k, _m); this.rings.setColorAt(k, _c.copy(L.ring).multiplyScalar(bright)); }
      }
    }
    if (L.glow) this.halo(x, y, z, size * L.glowScale, L.glow, 0.85);
    this.shadow(x, z, size);
    if (badge) this.badge(x, z + size * 0.5 + 0.22, level);
  }

  /** Loose stardust (golden in the finale): small spinning octahedra, no outline, a little self-light. */
  dust(x, z, size, value, gold, spin, bob) {
    _q.setFromEuler(_e.set(spin * 0.5, spin, 0.4));
    const y = size * 0.5 + 0.1 + bob;
    _p.set(x, y, z);
    _s.set(size, size * 1.25, size);
    _m.compose(_p, _q, _s);
    const k = this.#n.dust++;
    if (k >= this.dustMesh.instanceMatrix.count) return;
    this.dustMesh.setMatrixAt(k, _m);
    const col = gold ? this.#gold : this.#dustColors[value] || this.look(Math.round(Math.log2(value))).color;
    this.dustMesh.setColorAt(k, col);
    this.dustGlow.setX(k, gold ? 0.6 : 0.3);
    if (gold) this.halo(x, y, z, size * 3, this.#goldGlow, 0.9);
    this.shadow(x, z, size * 0.8);
  }

  /** Billboard glow. color: Color or hex string. */
  halo(x, y, z, size, color, alpha = 1) {
    const k = this.#n.halos++;
    if (k >= this.halos.instanceMatrix.count) return;
    _p.set(x, y, z);
    _s.set(size, size, 1);
    this.halos.setMatrixAt(k, _m.compose(_p, this.#cam, _s));
    if (color.isColor) _c.copy(color); else _c.set(color);
    this.halos.setColorAt(k, _c.multiplyScalar(alpha));
  }

  badge(x, z, level, scale = 1.3) {
    const k = this.#n.badges++;
    if (k >= this.badges.instanceMatrix.count) return;
    _p.set(x, 0.3, z);
    _s.set(1.15 * scale, 1.15 * scale, 1);
    this.badges.setMatrixAt(k, _m.compose(_p, this.#cam, _s));
    this.badgeCell.setX(k, Math.min(LEVELS, Math.max(1, level)) - 1);
  }

  shadow(x, z, size) {
    const k = this.#n.shadows++;
    if (k >= this.shadows.instanceMatrix.count) return;
    _q.identity();
    _p.set(x + size * 0.14, 0.015, z + size * 0.1);
    _s.set(size * 1.25, 1, size * 1.25);
    this.shadows.setMatrixAt(k, _m.compose(_p, _q, _s));
  }

  rim(x, z, radius, color) {
    const k = this.#n.rims++;
    if (k >= this.rims.instanceMatrix.count) return;
    _q.identity();
    _p.set(x, 0.03, z);
    _s.set(radius, 1, radius);
    this.rims.setMatrixAt(k, _m.compose(_p, _q, _s));
    this.rims.setColorAt(k, color.isColor ? color : _c.set(color));
  }

  /** Start one comet's ribbon. Points come nearest-first via ribbonPoint(). */
  ribbonBegin(color) {
    this.#ribK = 0;
    if (color.isColor) this.#ribColor.copy(color); else this.#ribColor.set(color);
  }

  /** @param {number} w half-width  @param {number} a alpha 0..1  (dx, dz) = direction along the trail */
  ribbonPoint(x, z, dx, dz, w, a) {
    if (this.#ribSlot >= this.#ribbonComets || this.#ribK >= RIBBON_PTS) return;
    const len = Math.hypot(dx, dz) || 1;
    const nx = -dz / len * w, nz = dx / len * w;
    const base = (this.#ribSlot * RIBBON_PTS + this.#ribK) * 2;
    const P = this.#ribPos, C = this.#ribCol;
    P[base * 3] = x + nx; P[base * 3 + 1] = 0.04; P[base * 3 + 2] = z + nz;
    P[base * 3 + 3] = x - nx; P[base * 3 + 4] = 0.04; P[base * 3 + 5] = z - nz;
    const c = this.#ribColor;
    for (let v = 0; v < 2; v++) { const o = (base + v) * 4; C[o] = c.r; C[o + 1] = c.g; C[o + 2] = c.b; C[o + 3] = a; }
    this.#ribK++;
  }

  ribbonEnd() {
    // Collapse the unused tail of this slot onto the last point (zero-area triangles).
    if (this.#ribSlot >= this.#ribbonComets) return;
    const P = this.#ribPos;
    const last = (this.#ribSlot * RIBBON_PTS + Math.max(0, this.#ribK - 1)) * 2;
    for (let k = this.#ribK; k < RIBBON_PTS; k++) {
      const b = (this.#ribSlot * RIBBON_PTS + k) * 2;
      for (let v = 0; v < 6; v++) P[b * 3 + v] = P[last * 3 + (v % 3)];
    }
    this.#ribSlot++;
  }

  end() {
    const n = this.#n;
    const fit = (mesh, k) => { mesh.count = Math.min(k, mesh.instanceMatrix.count); mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; };
    fit(this.planets, n.planets);
    fit(this.rocks, n.rocks);
    fit(this.dustMesh, n.dust);
    this.dustGlow.needsUpdate = true;
    this.planetOutline.count = this.planets.count;
    this.rockOutline.count = this.rocks.count;
    this.planetGlow.needsUpdate = true;
    this.rockGlow.needsUpdate = true;
    fit(this.rings, n.rings);
    fit(this.halos, n.halos);
    fit(this.badges, n.badges);
    this.badgeCell.needsUpdate = true;
    fit(this.shadows, n.shadows);
    fit(this.rims, n.rims);
    const g = this.#ribbon.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.color.needsUpdate = true;
  }

  dispose() {
    for (const r of this.#owned) r.dispose?.();
    for (const m of [this.planets, this.rocks, this.dustMesh, this.planetOutline, this.rockOutline, this.rings, this.halos, this.badges, this.shadows, this.rims]) m.dispose();
  }
}
