#!/usr/bin/env node
/**
 * "Not high poly", statically: every model file that could ship with the game, and its
 * triangle count against project.json `budgets.modelTriangles` (profile M: 5,000 per model).
 *
 *   node tools/qa/check-poly.mjs            (part of npm run qa)
 *
 * .glb/.gltf are counted from their JSON (accessor counts), so Draco- or meshopt-compressed
 * files are counted too, and node instancing (EXT_mesh_gpu_instancing) is multiplied in.
 * .obj is counted from its face lines. .fbx/.dae/.blend/.3ds cannot be counted here: they are
 * reported UNVERIFIED - convert them to .glb (skill: references/assets/3d-models.md).
 * The browser harness scenario `poly-budget` measures what is actually drawn at runtime.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const profile = JSON.parse(readFileSync(resolve(root, "project.json"), "utf8"));
const budget = profile.budgets?.modelTriangles ?? null;
const MODEL = new Set([".glb", ".gltf", ".obj", ".fbx", ".dae", ".blend", ".3ds"]);

const files = [];
for (const dir of ["public", "src", "assets"]) {
  const start = resolve(root, dir);
  if (!existsSync(start)) continue;
  (function walk(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) { if (name !== "node_modules") walk(p); }
      else if (MODEL.has(extname(name).toLowerCase())) files.push(p);
    }
  })(start);
}

function gltfJson(path) {
  const buf = readFileSync(path);
  if (extname(path).toLowerCase() === ".gltf") return JSON.parse(buf.toString("utf8"));
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("not a binary glTF (magic)");
  const len = buf.readUInt32LE(12);
  if (buf.readUInt32LE(16) !== 0x4e4f534a) throw new Error("first GLB chunk is not JSON");
  return JSON.parse(buf.subarray(20, 20 + len).toString("utf8"));
}

function gltfTriangles(json) {
  const acc = json.accessors || [];
  const perMesh = (json.meshes || []).map((m) => (m.primitives || []).reduce((sum, p) => {
    const mode = p.mode ?? 4;
    const n = p.indices !== undefined ? acc[p.indices]?.count : acc[p.attributes?.POSITION]?.count;
    if (!n) return sum;
    if (mode === 4) return sum + Math.floor(n / 3);            // TRIANGLES
    if (mode === 5 || mode === 6) return sum + Math.max(0, n - 2);   // STRIP / FAN
    return sum;                                                 // points, lines
  }, 0));
  const unique = perMesh.reduce((a, b) => a + b, 0);
  const nodes = json.nodes || [];
  const scene = json.scenes?.[json.scene ?? 0];
  if (!scene) return { unique, drawn: unique, meshes: perMesh.length };
  let drawn = 0;
  const visit = (i, depth = 0) => {
    const nd = nodes[i];
    if (!nd || depth > 64) return;
    if (nd.mesh !== undefined) {
      const inst = nd.extensions?.EXT_mesh_gpu_instancing?.attributes?.TRANSLATION;
      drawn += (perMesh[nd.mesh] || 0) * (inst !== undefined ? acc[inst]?.count ?? 1 : 1);
    }
    for (const c of nd.children || []) visit(c, depth + 1);
  };
  for (const n of scene.nodes || []) visit(n);
  return { unique, drawn, meshes: perMesh.length };
}

function objTriangles(path) {
  let tris = 0;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (!line.startsWith("f ")) continue;
    tris += Math.max(0, line.trim().split(/\s+/).length - 3);   // an n-gon is n-2 triangles
  }
  return { unique: tris, drawn: tris, meshes: null };
}

const results = [];
const record = (r) => { results.push(r); console.log(`${r.status.padEnd(10)} ${r.id.padEnd(34)} ${r.summary}`); };

for (const path of files) {
  const rel = relative(root, path).replaceAll("\\", "/");
  const ext = extname(path).toLowerCase();
  if (![".glb", ".gltf", ".obj"].includes(ext)) {
    record({ id: `model ${rel}`, requirements: [], status: "UNVERIFIED", summary: `${ext} cannot be counted here - convert to .glb and re-run` });
    continue;
  }
  try {
    const c = ext === ".obj" ? objTriangles(path) : gltfTriangles(gltfJson(path));
    const over = budget !== null && c.drawn > budget;
    record({
      id: `model ${rel}`, requirements: [], status: over ? "FAIL" : budget === null ? "INFO" : "PASS",
      summary: `${c.drawn} triangles drawn (${c.unique} unique${c.meshes !== null ? `, ${c.meshes} meshes` : ""})${budget !== null ? `, budget ${budget}` : ", no budgets.modelTriangles in project.json"}`,
      evidence: c,
    });
  } catch (e) {
    record({ id: `model ${rel}`, requirements: [], status: "FAIL", summary: `unreadable: ${e.message}` });
  }
}
if (!files.length) record({ id: "models", requirements: [], status: "PASS", summary: "no model files - everything is built from code primitives" });

mkdirSync(resolve(root, "qa/evidence"), { recursive: true });
writeFileSync(resolve(root, "qa/evidence/check-poly.json"), JSON.stringify({ tool: "check-poly", checkedAt: new Date().toISOString(), budget, results }, null, 2));
process.exit(results.some((r) => r.status === "FAIL") ? 1 : 0);
