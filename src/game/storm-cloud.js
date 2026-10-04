/**
 * The storm front: a toy thunderhead behind the city, the place every bolt comes from.
 *
 * Built the way stylised low-poly clouds usually are (merged/instanced spheres, "chopped" flat at the bottom,
 * dark underneath and light on top): one puff geometry - a sphere whose lower part is flattened into a disc - is
 * instanced in four tiers (the lower ones two rows deep, so it reads as a mass). The base tier sits on one shared height, so the whole cloud gets a flat, dark underside;
 * a middle tier and a few top puffs build the tower. Instance colours go from slate (base) to pale lilac (top) and the
 * puff's own vertex colours darken its underside, so every puff reads round. The puffs breathe slowly (per-frame
 * matrices, 25 instances); while a strike charges the cloud flickers from inside, and on the strike it flashes.
 *
 * Cost: 1 draw call, one 11x8 sphere (~150 triangles) x 25 puffs.
 */

import { BufferAttribute, Color, Group, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, SphereGeometry, Vector3 } from "three";
import { enhance } from "../render/materials.js";

const CHOP = -0.32;              // puff y below this is pressed flat: the flat underside
const TIERS = [
  // count, spread (share of the cloud width), radius range (m, before the size scale), height step, squash, rows in depth
  // (m, before the scale), colour: slate underneath, pale lilac-grey on top
  { n: 10, spread: 0.9, r: [6.0, 8.2], y: 0.0, squash: 0.6, rows: [-4.5, 4.5], color: "#5f6688" },
  { n: 8, spread: 0.82, r: [6.4, 9.2], y: 0.55, squash: 0.82, rows: [-1.5, 2.5], color: "#7c83a8" },
  { n: 5, spread: 0.52, r: [5.6, 7.8], y: 1.2, squash: 0.9, rows: [0, 1.5], color: "#9fa5c8" },
  { n: 2, spread: 0.18, r: [4.6, 5.8], y: 1.8, squash: 0.95, rows: [0.5], color: "#b9bed9" },
];

function puffGeometry() {
  const g = new SphereGeometry(1, 11, 8);
  const p = g.attributes.position, n = p.count, col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const y = p.getY(i);
    if (y < CHOP) p.setY(i, CHOP);                      // the chop
    const k = 0.62 + 0.38 * Math.min(1, Math.max(0, (y - CHOP) / (1 - CHOP)));   // darker underside
    col.set([k, k, k * 1.04], i * 3);
  }
  g.setAttribute("color", new BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

const _m = new Matrix4(), _p = new Vector3(), _s = new Vector3(), _c = new Color();
const ID = new Quaternion();

/**
 * @param {{ range(a:number,b:number):number }} rng
 * @param {{ center: Vector3, yaw: number, across: number, scale: number, rim: string, glow: string }} o
 *   center: middle of the cloud's underside · yaw: the camera yaw (puffs spread across the view) · across: width (m)
 */
export function createStormCloud(rng, { center, yaw, across, scale, rim, glow }) {
  const geo = puffGeometry();
  const mat = enhance(new MeshStandardMaterial({ vertexColors: true, roughness: 1, emissive: glow, emissiveIntensity: 0, envMapIntensity: 0.3 }),
    { rim: 0.45, rimPower: 2.2, rimColor: rim, rimTint: 0 });
  const puffs = [];
  const ax = Math.cos(yaw), az = -Math.sin(yaw);        // across the view
  const dx = -Math.sin(yaw), dz = -Math.cos(yaw);       // away from the camera
  for (const T of TIERS) {
    for (let i = 0; i < T.n; i++) {
      const t = (T.n === 1 ? 0 : i / (T.n - 1) - 0.5) * T.spread + rng.range(-0.03, 0.03);
      const taper = 1 - Math.abs(t) * 0.5;   // round ends, no trailing single puffs
      const r = rng.range(T.r[0], T.r[1]) * scale * taper;
      const depth = (T.rows[i % T.rows.length] + rng.range(-1.5, 1.5)) * scale;   // rows in depth: a mass, not a chain
      // the base tier shares one height (flat underside); upper tiers rise towards the middle
      const y = T.y === 0 ? -CHOP * r * T.squash : (T.y + (1 - Math.abs(t) * 2) * 0.35) * 6 * scale;
      puffs.push({
        x: center.x + ax * t * across + dx * depth, z: center.z + az * t * across + dz * depth, y: center.y + y,
        r, squash: T.squash, color: T.color, phase: rng.range(0, 6.28), base: T.y === 0,
      });
    }
  }
  const mesh = new InstancedMesh(geo, mat, puffs.length);
  mesh.name = "storm-cloud";
  puffs.forEach((p, i) => mesh.setColorAt(i, _c.set(p.color)));
  const group = new Group();
  group.add(mesh);

  let flashAt = -10;
  /** @param {number} time view seconds · @param {number} charge 0..1 while holding (inner flicker) */
  function update(time, charge = 0) {
    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i];
      const breathe = 1 + Math.sin(time * 0.55 + p.phase) * 0.035;
      const bob = p.base ? 0 : Math.sin(time * 0.4 + p.phase) * 0.35 * scale;   // the underside stays flat
      mesh.setMatrixAt(i, _m.compose(_p.set(p.x, p.y + bob, p.z), ID, _s.set(p.r * 1.2 * breathe, p.r * p.squash * breathe, p.r * breathe)));
    }
    mesh.instanceMatrix.needsUpdate = true;
    const flick = charge > 0 ? charge * (0.55 + 0.45 * Math.sin(time * 37) * Math.sin(time * 23)) : 0;
    const flash = Math.max(0, 1 - (time - flashAt) / 0.35);
    mat.emissiveIntensity = Math.max(0, flick) * 0.35 + flash * flash * 0.9;
  }
  update(0);

  return {
    group, mesh,
    update,
    /** A strike just left the cloud: a short bright flash from inside. */
    flash(time) { flashAt = time; },
    dispose() { geo.dispose(); mat.dispose(); },
  };
}
