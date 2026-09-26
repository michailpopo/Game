/**
 * The arena scenery: a pastel nebula disc (one canvas texture) inside deeper space, a soft
 * glowing rim, an asteroid belt at the edge (one InstancedMesh of 20-triangle rocks) and
 * star points. Built once per arena; everything created here is disposed on rebuild.
 * Shape and size come from ARENA.arena (circle or square), colours from the palette theme.
 */

import {
  BufferGeometry, CanvasTexture, CircleGeometry, Color, Euler, Float32BufferAttribute, Group, IcosahedronGeometry,
  InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry, Points, PointsMaterial,
  Quaternion, RingGeometry, SRGBColorSpace, Vector3,
} from "three";
import { ARENA } from "../config.js";
import { createRng } from "../core/rng.js";

const _m = new Matrix4();
const _p = new Vector3();
const _q = new Quaternion();
const _e = new Euler();
const _s = new Vector3();
const _c = new Color();

/** Soft pastel blobs over a base colour; the canvas maps onto the arena's bounding square. */
function nebulaTexture(theme, seed) {
  const rng = createRng(seed);
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const ctx = c.getContext("2d");
  const [base, ...blobs] = theme.nebula;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 26; i++) {
    const x = rng.range(0, 1024), y = rng.range(0, 1024), r = rng.range(140, 380);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const col = blobs[i % blobs.length];
    g.addColorStop(0, col);
    g.addColorStop(1, `${col}00`);
    ctx.globalAlpha = rng.range(0.45, 0.85);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // Faint dust specks: motion reference on the soft field.
  ctx.globalAlpha = 1;
  for (let i = 0; i < 900; i++) {
    const x = rng.range(0, 1024), y = rng.range(0, 1024), r = rng.range(0.8, 2.2);
    ctx.fillStyle = rng.chance(0.55) ? "rgba(255,255,255,0.75)" : "rgba(120,100,190,0.22)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export class SpaceMesh {
  group = new Group();
  #owned = [];

  constructor(scene) { scene.add(this.group); }

  #own(r) { this.#owned.push(r); return r; }

  clear() {
    for (const r of this.#owned) r.dispose?.();
    this.#owned = [];
    this.group.clear();
  }

  build(theme, seed = "nebula") {
    this.clear();
    const ar = ARENA.arena;
    const R = ar.halfSize;
    const circle = ar.shape === "circle";

    // Deep space under everything.
    const space = new Mesh(this.#own(new PlaneGeometry(R * 12, R * 12)), this.#own(new MeshBasicMaterial({ color: theme.space })));
    space.rotation.x = -Math.PI / 2;
    space.position.y = -0.06;
    space.name = "space";
    this.group.add(space);

    // The nebula floor.
    const tex = this.#own(nebulaTexture(theme, seed));
    const floorGeo = this.#own(circle ? new CircleGeometry(R + 0.4, 96) : new PlaneGeometry(R * 2 + 0.8, R * 2 + 0.8));
    const floor = new Mesh(floorGeo, this.#own(new MeshBasicMaterial({ map: tex })));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    floor.name = "nebula";
    this.group.add(floor);

    // A soft glowing rim just inside the edge.
    if (circle) {
      const rim = new Mesh(this.#own(new RingGeometry(R - 1.2, R + 0.4, 128)), this.#own(new MeshBasicMaterial({ color: theme.rim, transparent: true, opacity: 0.42, depthWrite: false })));
      rim.rotation.x = -Math.PI / 2;
      rim.position.y = -0.01;
      rim.name = "rim";
      this.group.add(rim);
    }

    // Asteroid belt: the wall the heads slide along.
    const rng = createRng(`${seed}:belt`);
    const n = circle ? 170 : 200;
    const rocks = new InstancedMesh(this.#own(new IcosahedronGeometry(0.5, 0)), this.#own(new MeshLambertMaterial({ color: 0xffffff, flatShading: true })), n);
    rocks.name = "asteroid-belt";
    const base = new Color(theme.rocks);
    for (let i = 0; i < n; i++) {
      let x, z;
      if (circle) {
        const a = (i / n) * Math.PI * 2 + rng.range(-0.01, 0.01);
        const r = R + 0.9 + rng.range(-0.3, 0.9);
        x = Math.cos(a) * r; z = Math.sin(a) * r;
      } else {
        const side = i % 4, t = rng.range(-R - 1, R + 1), off = R + 0.9 + rng.range(-0.3, 0.9);
        x = side === 0 ? t : side === 1 ? t : side === 2 ? off : -off;
        z = side === 0 ? off : side === 1 ? -off : t;
      }
      const size = rng.range(1.0, 2.4);
      _q.setFromEuler(_e.set(rng.range(0, 3), rng.range(0, 3), rng.range(0, 3)));
      _p.set(x, size * 0.3, z);
      _s.set(size, size * rng.range(0.7, 1), size * rng.range(0.8, 1.1));
      rocks.setMatrixAt(i, _m.compose(_p, _q, _s));
      rocks.setColorAt(i, _c.copy(base).multiplyScalar(rng.range(0.82, 1.12)));
    }
    this.#own(rocks);
    this.group.add(rocks);

    // Stars: dense outside the arena, sparse inside.
    const pts = [];
    for (let i = 0; i < 1100; i++) {
      const inside = i < 250;
      const r = inside ? R * Math.sqrt(rng.next()) : R + 3 + rng.range(0, R * 2.2);
      const a = rng.next() * Math.PI * 2;
      pts.push(Math.cos(a) * r, 0.02, Math.sin(a) * r);
    }
    const sg = this.#own(new BufferGeometry());
    sg.setAttribute("position", new Float32BufferAttribute(pts, 3));
    const stars = new Points(sg, this.#own(new PointsMaterial({ color: theme.stars, size: 2.4, sizeAttenuation: false, transparent: true, opacity: 0.6, depthWrite: false })));
    stars.name = "stars";
    this.group.add(stars);
  }
}
