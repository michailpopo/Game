/**
 * Every value block in the arena - all snakes and all loose blocks - is ONE InstancedMesh
 * (plus one InstancedMesh of blob shadows): 2 draw calls for ~1,000 blocks.
 *
 *  - geometry: a 12-triangle box; a soft bevel is shaded in the fragment shader from the
 *    face UVs (reads as a rounded cube without the 300 triangles of RoundedBoxGeometry)
 *  - colour: per instance (setColorAt), from palette.VALUE_COLORS by ladder level
 *  - number: the top face samples a canvas atlas (one cell per ladder level); a per-instance
 *    attribute aLabel = (cell, quarter turn) picks the cell and turns the label in 90-degree
 *    steps so it never reads more than 45 degrees off upright, whatever way the block faces
 *
 * Presentation only: writes instance data from simulation state each frame, allocates nothing
 * per frame.
 */

import {
  BoxGeometry, BufferAttribute, CanvasTexture, Color, DynamicDrawUsage, Euler, InstancedBufferAttribute,
  InstancedMesh, Matrix4, MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry, Quaternion, SRGBColorSpace, Vector3,
} from "three";
import { FONT_FAMILY } from "../render/text-texture.js";
import { LABEL_STYLE, VALUE_COLORS } from "../render/palette.js";
import { fmtValue, valueAt } from "./values.js";

const COLS = 8;
const ROWS = 8;
const CELL = 128;
const LEVELS = COLS * ROWS;

const _m = new Matrix4();
const _p = new Vector3();
const _q = new Quaternion();
const _e = new Euler();
const _s = new Vector3();
const _c = new Color();

/** One cell per ladder level: white number, dark outline, transparent background. */
function labelAtlas() {
  const c = document.createElement("canvas");
  c.width = COLS * CELL;
  c.height = ROWS * CELL;
  const ctx = c.getContext("2d");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  for (let lv = 1; lv <= LEVELS; lv++) {
    const text = fmtValue(valueAt(lv));
    const col = (lv - 1) % COLS, row = Math.floor((lv - 1) / COLS);
    let px = Math.round(CELL * LABEL_STYLE.fontScale);
    ctx.font = `${px}px ${FONT_FAMILY}`;
    const maxW = CELL * 0.8;
    const w = ctx.measureText(text).width;
    if (w > maxW) { px = Math.floor(px * (maxW / w)); ctx.font = `${px}px ${FONT_FAMILY}`; }
    const x = col * CELL + CELL / 2, y = row * CELL + CELL / 2 + px * 0.06;
    ctx.lineWidth = Math.max(4, px * LABEL_STYLE.strokeWidth);
    ctx.strokeStyle = LABEL_STYLE.stroke;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = LABEL_STYLE.fill;
    ctx.fillText(text, x, y);
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Soft rounded-square shadow blob. */
function blobTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  ctx.filter = "blur(6px)";
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.beginPath();
  ctx.roundRect(14, 14, 36, 36, 9);
  ctx.fill();
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

function blockGeometry() {
  const g = new BoxGeometry(1, 1, 1);
  // BoxGeometry faces: +x, -x, +y, -y, +z, -z, four vertices each. aTop marks the +y face.
  const top = new Float32Array(24);
  for (let i = 8; i < 12; i++) top[i] = 1;
  g.setAttribute("aTop", new BufferAttribute(top, 1));
  return g;
}

export class BlockMesh {
  mesh; shadows;
  #cap; #k = 0; #label; #colors;
  #owned = [];

  constructor(scene, capacity = 1200) {
    this.#cap = capacity;
    const geo = blockGeometry();
    this.#label = new InstancedBufferAttribute(new Float32Array(capacity * 2), 2);
    this.#label.setUsage(DynamicDrawUsage);
    geo.setAttribute("aLabel", this.#label);
    const atlas = labelAtlas();
    const mat = new MeshLambertMaterial({ color: 0xffffff });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uLabelAtlas = { value: atlas };
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>
attribute float aTop;
attribute vec2 aLabel;
varying vec2 vFaceUv;
varying vec2 vLabelUv;
varying float vTop;
varying float vCell;`)
        .replace("#include <uv_vertex>", `#include <uv_vertex>
vFaceUv = uv;
vTop = aTop;
vCell = aLabel.x;
vec2 lu = uv - 0.5;
if (aLabel.y > 2.5) lu = vec2(lu.y, -lu.x);
else if (aLabel.y > 1.5) lu = -lu;
else if (aLabel.y > 0.5) lu = vec2(-lu.y, lu.x);
vLabelUv = lu + 0.5;`);
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", `#include <common>
uniform sampler2D uLabelAtlas;
varying vec2 vFaceUv;
varying vec2 vLabelUv;
varying float vTop;
varying float vCell;`)
        .replace("#include <color_fragment>", `#include <color_fragment>
float edge = min(min(vFaceUv.x, 1.0 - vFaceUv.x), min(vFaceUv.y, 1.0 - vFaceUv.y));
diffuseColor.rgb *= mix(0.6, 1.0, smoothstep(0.0, 0.13, edge));
if (vTop > 0.5) {
  float col = mod(vCell, ${COLS}.0);
  float row = floor(vCell / ${COLS}.0);
  vec2 luv = clamp(vLabelUv, 0.0, 1.0);
  vec2 auv = vec2((col + luv.x) / ${COLS}.0, 1.0 - (row + 1.0 - luv.y) / ${ROWS}.0);
  vec4 lab = texture2D(uLabelAtlas, auv);
  diffuseColor.rgb = mix(diffuseColor.rgb, lab.rgb, lab.a);
}`);
    };
    this.mesh = new InstancedMesh(geo, mat, capacity);
    this.mesh.name = "blocks";
    this.mesh.frustumCulled = false;        // instances cover the whole arena
    this.mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    this.mesh.setColorAt(0, _c.set(0xffffff));
    this.mesh.instanceColor.setUsage(DynamicDrawUsage);
    this.mesh.count = 0;

    const sgeo = new PlaneGeometry(1, 1);
    sgeo.rotateX(-Math.PI / 2);
    const blob = blobTexture();
    const smat = new MeshBasicMaterial({ map: blob, transparent: true, opacity: 0.42, depthWrite: false });
    this.shadows = new InstancedMesh(sgeo, smat, capacity);
    this.shadows.name = "block-shadows";
    this.shadows.frustumCulled = false;
    this.shadows.instanceMatrix.setUsage(DynamicDrawUsage);
    this.shadows.renderOrder = -1;
    this.shadows.count = 0;

    this.#colors = VALUE_COLORS.map((h) => new Color(h));
    this.#owned.push(geo, mat, atlas, sgeo, smat, blob);
    scene.add(this.shadows, this.mesh);
  }

  begin() { this.#k = 0; }

  /**
   * @param {number} yaw   rotation about +Y (three.js convention)
   * @param {number} size  edge length
   * @param {number} level ladder level (1 = smallest value)
   * @param {number} [bright] colour multiplier (pops, blinking)
   * @param {number} [lift]  extra height (hops)
   */
  add(x, z, yaw, size, level, bright = 1, lift = 0) {
    const k = this.#k;
    if (k >= this.#cap) return;
    this.#k = k + 1;
    _q.setFromEuler(_e.set(0, yaw, 0));
    _p.set(x, size * 0.5 + lift, z);
    _s.setScalar(size);
    this.mesh.setMatrixAt(k, _m.compose(_p, _q, _s));
    _c.copy(this.#colors[(level - 1) % this.#colors.length]).multiplyScalar(bright);
    this.mesh.setColorAt(k, _c);
    // Quarter turns that bring the label closest to upright on screen.
    const quarter = ((Math.round(yaw / (Math.PI / 2)) % 4) + 4) % 4;
    this.#label.setXY(k, Math.min(LEVELS - 1, level - 1), quarter);
    // Shadow: offset away from the light (upper left), slightly larger than the block.
    _q.identity();
    _p.set(x + size * 0.16, 0.012, z + size * 0.12);
    _s.set(size * 1.45, 1, size * 1.45);
    this.shadows.setMatrixAt(k, _m.compose(_p, _q, _s));
  }

  end() {
    this.mesh.count = this.#k;
    this.shadows.count = this.#k;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor.needsUpdate = true;
    this.#label.needsUpdate = true;
    this.shadows.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    for (const r of this.#owned) r.dispose();
    this.mesh.dispose();
    this.shadows.dispose();
  }
}
