/**
 * A crowd drawn as ONE InstancedMesh (plus one for blob shadows): 150 units
 * cost 2 draw calls. Formation slots come from formation.js, the same code the
 * simulation collides with, so what you see is what gets hit.
 */

import {
  CapsuleGeometry, CircleGeometry, Color, Euler, InstancedMesh, Matrix4,
  MeshBasicMaterial, MeshStandardMaterial, Quaternion, SphereGeometry, Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { TUNING as T } from "../config.js";
import { formation, slotOffset } from "./formation.js";

let unitGeo = null;
let shadowGeo = null;

/** Low-poly "bean" character: capsule body + sphere head, merged into one geometry. */
export function unitGeometry() {
  if (!unitGeo) {
    // ~250 triangles per unit: 150 units stay near 40k triangles (Chromebook budget).
    const body = new CapsuleGeometry(0.25, 0.36, 3, 9);    // r186: (radius, height, capSegments, radialSegments)
    body.translate(0, 0.47, 0);
    const head = new SphereGeometry(0.22, 10, 7);
    head.translate(0, 1.06, 0);
    unitGeo = mergeGeometries([body, head]);
    body.dispose();
    head.dispose();
  }
  return unitGeo;
}

function blobShadowGeometry() {
  if (!shadowGeo) {
    shadowGeo = new CircleGeometry(0.36, 16);
    shadowGeo.rotateX(-Math.PI / 2);
  }
  return shadowGeo;
}

const _m = new Matrix4();
const _p = new Vector3();
const _q = new Quaternion();
const _e = new Euler();
const _s = new Vector3();
const _c = new Color();
const _o = { x: 0, z: 0 };

export class CrowdMesh {
  mesh; shadows;
  #scene; #max; #material; #shadowMaterial;
  #cur; #scale; #phase; #shown = 0;

  constructor(scene, { max = T.maxSlots, color = "#c44ee6" } = {}) {
    this.#scene = scene;
    this.#max = max;
    this.#material = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.34, metalness: 0.04 });
    this.mesh = new InstancedMesh(unitGeometry(), this.#material, max);
    this.mesh.frustumCulled = false;   // instances move far from the geometry's bounding sphere
    this.mesh.count = 0;

    this.#shadowMaterial = new MeshBasicMaterial({ color: 0x1a1030, transparent: true, opacity: 0.2, depthWrite: false });
    this.shadows = new InstancedMesh(blobShadowGeometry(), this.#shadowMaterial, max);
    this.shadows.frustumCulled = false;
    this.shadows.count = 0;
    this.shadows.renderOrder = -1;

    this.#cur = new Float32Array(max * 2);
    this.#scale = new Float32Array(max);
    this.#phase = new Float32Array(max);
    for (let i = 0; i < max; i++) this.#phase[i] = (i * 2.39996) % (Math.PI * 2);

    this.setColor(color);
    scene.add(this.mesh, this.shadows);
  }

  setColor(hex) {
    const base = new Color(hex);
    for (let i = 0; i < this.#max; i++) {
      const v = 0.9 + (((i * 7919) % 97) / 97) * 0.2;   // deterministic, subtle variation
      this.mesh.setColorAt(i, _c.copy(base).multiplyScalar(v));
    }
    this.mesh.instanceColor.needsUpdate = true;
  }

  /**
   * @param {number} cx @param {number} cy @param {number} cz  crowd centre (interpolated)
   * @param {number} count
   * @param {"idle"|"run"|"battle"} mode
   * @param {{ facing?: -1|1, blink?: boolean }} [opts]  facing -1 = travelling toward -z
   */
  update(cx, cy, cz, count, dt, time, mode = "idle", { facing = -1, blink = false } = {}) {
    const f = formation(count);
    const n = f.n;
    for (let i = this.#shown; i < n; i++) {
      // New units pop out of the crowd centre.
      this.#cur[i * 2] = 0;
      this.#cur[i * 2 + 1] = 0;
      this.#scale[i] = 0.05;
    }
    const follow = 1 - Math.exp(-10 * dt);
    const grow = 1 - Math.exp(-14 * dt);
    const running = mode === "run";
    const fighting = mode === "battle";

    for (let i = 0; i < n; i++) {
      slotOffset(i, f, _o);
      const j = i * 2;
      this.#cur[j] += (_o.x - this.#cur[j]) * follow;
      this.#cur[j + 1] += (_o.z - this.#cur[j + 1]) * follow;
      this.#scale[i] += (1 - this.#scale[i]) * grow;

      const ph = this.#phase[i];
      const bob = running ? Math.abs(Math.sin(time * 13 + ph)) * 0.16
        : fighting ? Math.abs(Math.sin(time * 21 + ph)) * 0.12
        : Math.sin(time * 2.2 + ph) * 0.015;
      // Positive X rotation tips the head toward +z; lean into the direction of travel.
      const lean = running ? 0.17 * facing : fighting ? Math.sin(time * 18 + ph) * 0.14 : 0;
      const sway = Math.sin(time * 6.5 + ph) * (running ? 0.14 : 0.04);

      const sc = this.#scale[i] * (blink ? 0.86 : 1);
      _p.set(cx + this.#cur[j], cy + bob, cz + this.#cur[j + 1]);
      _q.setFromEuler(_e.set(lean, 0, sway));
      _s.set(sc, sc * (1 - bob * 0.3), sc);
      _m.compose(_p, _q, _s);
      this.mesh.setMatrixAt(i, _m);

      _p.y = cy + 0.02;
      _q.identity();
      _s.set(this.#scale[i], 1, this.#scale[i]);
      _m.compose(_p, _q, _s);
      this.shadows.setMatrixAt(i, _m);
    }

    this.#shown = n;
    this.mesh.count = n;
    this.shadows.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.shadows.instanceMatrix.needsUpdate = true;
    const glow = blink ? 0.4 : 0;
    this.#material.emissive.setRGB(glow, glow, glow);
  }

  dispose() {
    this.#scene.remove(this.mesh, this.shadows);
    this.#material.dispose();
    this.#shadowMaterial.dispose();
    this.mesh.dispose();
    this.shadows.dispose();
  }
}
