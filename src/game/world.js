/**
 * Level geometry: track, rails, scenery, gates, blocks, saws, finish stairs.
 *
 * Budget rules this file follows (see skill references/threejs/performance.md):
 *  - repeated scenery is instanced (hundreds of spires = 2 draw calls)
 *  - geometries/materials shared where possible; everything created per level
 *    is tracked and disposed on the next build (GPU memory does not GC)
 *  - labels are canvas textures redrawn only when their text changes
 */

import {
  BoxGeometry, CanvasTexture, Color, CylinderGeometry, DoubleSide, Euler, Group,
  InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry,
  Quaternion, RepeatWrapping, SRGBColorSpace, SphereGeometry, Vector3,
} from "three";
import { TUNING as T } from "../config.js";
import { createRng } from "../core/rng.js";
import { LabelTexture } from "../render/text-texture.js";
import { isGoodOp, opLabel } from "./level-gen.js";

const _m = new Matrix4();
const _p = new Vector3();
const _q = new Quaternion();
const _s = new Vector3();
const _e = new Euler();
const _c = new Color();

function chevronTexture(theme) {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = theme.track;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = theme.trackStripe;
  ctx.lineWidth = 26;
  ctx.lineJoin = "miter";
  ctx.beginPath();
  ctx.moveTo(-10, 100);
  ctx.lineTo(64, 40);
  ctx.lineTo(138, 100);
  ctx.stroke();
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function checkerTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 16;
  const ctx = c.getContext("2d");
  for (let x = 0; x < 16; x++) for (let y = 0; y < 2; y++) {
    ctx.fillStyle = (x + y) % 2 ? "#ffffff" : "#2a2440";
    ctx.fillRect(x * 8, y * 8, 8, 8);
  }
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

export class World {
  group = new Group();
  gates = new Map();
  blocks = new Map();
  saws = new Map();
  tiers = [];
  #owned = [];

  constructor(scene) { scene.add(this.group); }

  #own(resource) { this.#owned.push(resource); return resource; }

  clear() {
    for (const r of this.#owned) r.dispose?.();
    this.#owned = [];
    this.group.clear();
    this.gates.clear();
    this.blocks.clear();
    this.saws.clear();
    this.tiers = [];
  }

  build(spec, theme) {
    this.clear();
    const halfW = T.trackHalfWidth;
    const stairsLen = 4 + spec.tiers.length * T.finishTierLength;
    const zStart = 40;
    const zEnd = spec.finishZ - stairsLen - 30;
    const len = zStart - zEnd;
    const zMid = (zStart + zEnd) / 2;

    // Track: textured top, plain sides.
    const chevrons = this.#own(chevronTexture(theme));
    chevrons.repeat.set(1, len / 9);
    const top = this.#own(new MeshStandardMaterial({ map: chevrons, roughness: 0.9 }));
    const side = this.#own(new MeshStandardMaterial({ color: new Color(theme.track).multiplyScalar(0.7), roughness: 0.9 }));
    const track = new Mesh(this.#own(new BoxGeometry(halfW * 2, 1.4, len)), [side, side, top, side, side, side]);
    track.position.set(0, -0.7, zMid);
    this.group.add(track);

    const railMat = this.#own(new MeshStandardMaterial({ color: theme.rail, roughness: 0.45 }));
    const railGeo = this.#own(new BoxGeometry(0.34, 0.55, len));
    for (const sx of [-1, 1]) {
      const rail = new Mesh(railGeo, railMat);
      rail.position.set(sx * (halfW + 0.17), 0.02, zMid);
      this.group.add(rail);
    }

    this.#buildScenery(spec, theme, zStart, zEnd);
    this.#buildGates(spec, theme);
    this.#buildBlocks(spec, theme);
    this.#buildSaws(spec, theme);
    this.#buildCoins(spec);
    this.#buildFinish(spec, theme);
  }

  /** Coins: one InstancedMesh; only the coins near the crowd are written each frame. */
  #buildCoins(spec) {
    const list = spec.coins || [];
    this.coins = null;
    if (!list.length) return;
    const geo = this.#own(new CylinderGeometry(0.44, 0.44, 0.13, 14));
    geo.rotateX(Math.PI / 2);                       // a disc standing on its edge, facing the run
    const mat = this.#own(new MeshStandardMaterial({ color: "#ffc83d", emissive: "#5a3800", roughness: 0.32, metalness: 0.35 }));
    const mesh = this.#own(new InstancedMesh(geo, mat, list.length));
    mesh.frustumCulled = false;                     // instances move along the whole track
    mesh.count = 0;
    this.coins = { mesh, list, taken: new Uint8Array(list.length), spin: 0 };
    this.group.add(mesh);
  }

  takeCoin(id) { if (this.coins && id < this.coins.taken.length) this.coins.taken[id] = 1; }

  #updateCoins(sim, dt) {
    const c = this.coins;
    if (!c) return;
    c.spin += dt * 3.2;
    let k = 0;
    for (let i = 0; i < c.list.length; i++) {
      const coin = c.list[i];
      if (coin.z > sim.z + 12) continue;              // behind the camera
      if (coin.z < sim.z - 120) break;                // beyond the fog; the rest is further
      if (c.taken[i]) continue;
      _p.set(coin.x, 0.8 + Math.sin(c.spin * 1.4 + i) * 0.08, coin.z);
      _q.setFromEuler(_e.set(0, c.spin + i * 0.45, 0));
      c.mesh.setMatrixAt(k++, _m.compose(_p, _q, _s.setScalar(1)));
    }
    c.mesh.count = k;
    c.mesh.instanceMatrix.needsUpdate = true;
  }

  #buildScenery(spec, theme, zStart, zEnd) {
    const rng = createRng(`scenery-${spec.level}`);
    const bodyGeo = this.#own(new CylinderGeometry(0.72, 1, 1, 6, 1));
    bodyGeo.translate(0, -0.5, 0);                    // top face at y = 0
    const capGeo = this.#own(new CylinderGeometry(0.8, 0.78, 1, 6, 1));
    capGeo.translate(0, 0.5, 0);                      // bottom face at y = 0
    const bodyMat = this.#own(new MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 0.95 }));
    const capMat = this.#own(new MeshStandardMaterial({ color: theme.spireCap, flatShading: true, roughness: 0.75 }));

    // Near spires stay mostly BELOW the track so it reads as a path over a
    // canyon; far spires rise higher and fade into fog. Leave sky visible.
    const items = [];
    for (let z = zStart + 30; z > zEnd - 60; z -= rng.range(7, 11)) {
      for (const sx of [-1, 1]) {
        const near = rng.chance(0.5);
        const dist = near ? rng.range(4, 14) : rng.range(16, 55);
        const radius = near ? rng.range(1.3, 2.6) : rng.range(2.4, 5);
        const topY = near ? rng.range(-9, -0.5) : rng.range(-6, 9);
        items.push({ x: sx * (T.trackHalfWidth + dist + radius), z: z + rng.range(-3, 3), radius, topY, rot: rng.range(0, Math.PI) });
      }
    }

    const bodies = new InstancedMesh(bodyGeo, bodyMat, items.length);
    const caps = new InstancedMesh(capGeo, capMat, items.length);
    const base = new Color(theme.spire);
    items.forEach((it, i) => {
      _q.setFromEuler(_e.set(0, it.rot, 0));
      _p.set(it.x, it.topY, it.z);
      _s.set(it.radius, 90, it.radius);
      _m.compose(_p, _q, _s);
      bodies.setMatrixAt(i, _m);
      _s.set(it.radius * 1.02, 0.35 + it.radius * 0.12, it.radius * 1.02);
      _m.compose(_p, _q, _s);
      caps.setMatrixAt(i, _m);
      bodies.setColorAt(i, _c.copy(base).multiplyScalar(0.86 + ((i * 37) % 23) / 23 * 0.22));
    });
    this.#own(bodies);
    this.#own(caps);
    this.group.add(bodies, caps);
  }

  #buildGates(spec, theme) {
    const halfW = T.trackHalfWidth;
    const postGeo = this.#own(new BoxGeometry(0.24, 3.3, 0.24));
    const postMat = this.#own(new MeshStandardMaterial({ color: "#3b3558", roughness: 0.6 }));
    const panelGeo = this.#own(new PlaneGeometry(halfW - 0.28, 2.8));
    const labelGeo = this.#own(new PlaneGeometry(4.4, 2.2));

    for (const g of spec.gates) {
      const group = new Group();
      group.position.z = g.z;
      for (const x of [-halfW, 0, halfW]) {
        const post = new Mesh(postGeo, postMat);
        post.position.set(x, 1.65, 0);
        group.add(post);
      }
      const entry = { group, used: false, t: 0, side: null, panels: {}, labels: {} };
      for (const sideName of ["left", "right"]) {
        const op = g[sideName];
        const x = sideName === "left" ? -halfW / 2 : halfW / 2;
        const color = isGoodOp(op) ? theme.gateGood : theme.gateBad;
        const panelMat = this.#own(new MeshBasicMaterial({ color, transparent: true, opacity: 0.5, depthWrite: false, side: DoubleSide }));
        const panel = new Mesh(panelGeo, panelMat);
        panel.position.set(x, 1.5, 0);
        const label = new LabelTexture(256, 128);
        this.#own(label);
        label.set(opLabel(op));
        const labelMat = this.#own(new MeshBasicMaterial({ map: label.texture, transparent: true, depthWrite: false }));
        const labelMesh = new Mesh(labelGeo, labelMat);
        labelMesh.position.set(x, 1.55, 0.04);
        group.add(panel, labelMesh);
        entry.panels[sideName] = panel;
        entry.labels[sideName] = labelMesh;
      }
      this.gates.set(g.id, entry);
      this.group.add(group);
    }
  }

  #buildBlocks(spec, theme) {
    const labelGeo = this.#own(new PlaneGeometry(3.2, 1.6));
    for (const b of spec.blocks) {
      const width = b.x1 - b.x0;
      const mat = this.#own(new MeshStandardMaterial({ color: theme.block, roughness: 0.55 }));
      const mesh = new Mesh(this.#own(new BoxGeometry(width, 2.3, b.depth)), mat);
      mesh.position.set((b.x0 + b.x1) / 2, 1.15, b.z);
      const label = new LabelTexture(256, 128);
      this.#own(label);
      label.set(String(b.hp0));
      const labelMesh = new Mesh(labelGeo, this.#own(new MeshBasicMaterial({ map: label.texture, transparent: true, depthWrite: false })));
      labelMesh.position.set(mesh.position.x, 1.2, b.z + b.depth / 2 + 0.03);
      labelMesh.scale.setScalar(Math.min(1, (width - 0.3) / 3.2));
      this.group.add(mesh, labelMesh);
      this.blocks.set(b.id, { mesh, label, labelMesh, hpShown: b.hp0, punch: 0 });
    }
  }

  #buildSaws(spec, theme) {
    const hubGeo = this.#own(new CylinderGeometry(0.42, 0.42, 1.1, 14));
    const hubMat = this.#own(new MeshStandardMaterial({ color: "#2f2a45", roughness: 0.5 }));
    const barMat = this.#own(new MeshStandardMaterial({ color: theme.saw, roughness: 0.4 }));
    const tipGeo = this.#own(new SphereGeometry(0.34, 12, 10));
    const tipMat = this.#own(new MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 }));
    for (const w of spec.saws) {
      const group = new Group();
      group.position.set(w.x, 0.6, w.z);
      group.add(new Mesh(hubGeo, hubMat));
      const bar = new Mesh(this.#own(new BoxGeometry(w.len * 2, 0.32, 0.44)), barMat);
      group.add(bar);
      for (const sx of [-1, 1]) {
        const tip = new Mesh(tipGeo, tipMat);
        tip.position.x = sx * w.len;
        group.add(tip);
      }
      this.saws.set(w.id, group);
      this.group.add(group);
    }
  }

  #buildFinish(spec, theme) {
    const halfW = T.trackHalfWidth;
    const checker = this.#own(checkerTexture());
    const line = new Mesh(this.#own(new PlaneGeometry(halfW * 2, 1.5)), this.#own(new MeshBasicMaterial({ map: checker })));
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.015, spec.finishZ);
    this.group.add(line);

    const labelGeo = this.#own(new PlaneGeometry(5, 2.4));
    spec.tiers.forEach((tier, i) => {
      const z0 = spec.finishZ - 4 - i * T.finishTierLength;
      const h = (i + 1) * T.tierStep;
      const color = new Color().setHSL(0.58 - (i / spec.tiers.length) * 0.62, 0.72, 0.62);
      const step = new Mesh(this.#own(new BoxGeometry(halfW * 2, h, T.finishTierLength)), this.#own(new MeshStandardMaterial({ color, roughness: 0.6 })));
      step.position.set(0, h / 2, z0 - T.finishTierLength / 2);
      const label = new LabelTexture(256, 128);
      this.#own(label);
      label.set(`×${tier.mult}`);
      const labelMesh = new Mesh(labelGeo, this.#own(new MeshBasicMaterial({ map: label.texture, transparent: true, depthWrite: false })));
      labelMesh.rotation.x = -Math.PI / 2;
      labelMesh.position.set(0, h + 0.02, z0 - T.finishTierLength / 2);
      this.group.add(step, labelMesh);
      this.tiers.push({ step, z: z0 - T.finishTierLength / 2, y: h });
    });
  }

  /** Sync visuals with simulation state. Presentation-only timers run on real dt. */
  update(sim, dt) {
    for (const g of sim.gates) {
      const w = this.gates.get(g.id);
      if (!w || !w.group.visible) continue;
      if (g.used && !w.used) { w.used = true; w.side = g.side; w.t = 0; }
      if (!w.used) continue;
      w.t += dt;
      const k = Math.min(1, w.t / 0.45);
      for (const sideName of ["left", "right"]) {
        const chosen = sideName === w.side;
        const panel = w.panels[sideName];
        panel.material.opacity = (chosen ? 0.85 : 0.5) * (1 - k);
        if (chosen && w.t < 0.12) panel.material.color.lerp(_c.set("#ffffff"), 0.35);
        w.labels[sideName].material.opacity = 1 - k;
      }
      w.group.scale.set(1 + k * 0.08, 1 + k * 0.2, 1);
      if (k >= 1) w.group.visible = false;
    }

    for (const b of sim.blocks) {
      const w = this.blocks.get(b.id);
      if (!w) continue;
      if (b.broken) { w.mesh.visible = false; w.labelMesh.visible = false; continue; }
      const hp = Math.ceil(b.hp - 1e-6);
      if (hp !== w.hpShown) { w.hpShown = hp; w.label.set(String(hp)); w.punch = 1; }
      w.punch = Math.max(0, w.punch - dt * 6);
      const s = 1 + Math.sin(w.punch * Math.PI) * 0.05;
      w.mesh.scale.set(s, 1 / s, s);
    }

    for (const s of sim.saws) {
      const group = this.saws.get(s.id);
      if (group) group.rotation.y = -s.angle;
    }

    this.#updateCoins(sim, dt);
  }

  blockCenter(id) {
    const w = this.blocks.get(id);
    return w ? w.mesh.position : null;
  }
}
