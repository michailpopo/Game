/**
 * Pooled particle bursts in ONE draw call (InstancedMesh with per-instance colour).
 * No allocation per burst: fixed-size typed arrays, dead particles recycled.
 * Presentation only - runs on real frame time, never touches the simulation.
 */

import { Color, IcosahedronGeometry, InstancedMesh, Matrix4, MeshLambertMaterial, Quaternion, Vector3, Euler } from "three";

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
