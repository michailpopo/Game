#!/usr/bin/env node
/**
 * Record evidence for a requirement that only a person (or Claude looking at
 * screenshots/video, or the Developer Portal) can judge.
 *
 *   node tools/qa/record.mjs CG-ADS-008 PASS --evidence "Claim and Claim x3 both .btn, 1.25em, same gradient; qa/shots/ads-fill.png" --method "looked at screenshot, 1280x720"
 *   node tools/qa/record.mjs CG-MP-001 NOT_APPLICABLE --evidence "single-player game, no rooms" --method "project.json features.multiplayer=false"
 *   node tools/qa/record.mjs --list      open requirements for this project
 *
 * Refuses unknown ids, vague evidence (< 25 characters) and a missing method.
 * Evidence is tied to the current build fingerprint; a new build makes it STALE in the report.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const register = JSON.parse(readFileSync(resolve(root, "tools/qa/requirements.json"), "utf8"));
const manualPath = resolve(root, "qa/evidence/manual.json");
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };

export function buildFingerprint() {
  const dist = resolve(root, "dist");
  if (!existsSync(dist)) return "no-build";
  const h = createHash("sha256");
  const walk = (dir) => {
    for (const name of readdirSync(dir).sort()) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p); else { h.update(name); h.update(readFileSync(p)); }
    }
  };
  walk(dist);
  return h.digest("hex").slice(0, 12);
}

if (import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}` || process.argv[1]?.endsWith("record.mjs")) {
  const manual = existsSync(manualPath) ? JSON.parse(readFileSync(manualPath, "utf8")) : { entries: [] };

  if (args.includes("--list")) {
    const profile = JSON.parse(readFileSync(resolve(root, "project.json"), "utf8"));
    const applies = (r) => (r.applies_to.includes("all") || r.applies_to.some((f) => profile.features[f])) && (profile.targetStage === "full" || r.stage !== "full");
    const done = new Set(manual.entries.map((e) => e.id));
    for (const r of register.requirements.filter(applies).filter((r) => ["manual", "portal"].includes(r.verification) && !done.has(r.id))) {
      console.log(`${r.id.padEnd(12)} ${r.verification.padEnd(7)} ${r.type.padEnd(9)} ${r.title}`);
    }
    process.exit(0);
  }

  const [id, status] = args;
  const req = register.requirements.find((r) => r.id === id);
  const evidence = opt("evidence");
  const method = opt("method");
  const problems = [];
  if (!req) problems.push(`unknown requirement id "${id}"`);
  if (!["PASS", "FAIL", "NOT_APPLICABLE"].includes(status)) problems.push("status must be PASS, FAIL or NOT_APPLICABLE");
  if (!evidence || evidence.trim().length < 25) problems.push("--evidence must say what was observed (>= 25 characters)");
  if (!method) problems.push("--method must say how it was checked (tool, device, browser, viewport)");
  if (problems.length) { console.error(`refused:\n - ${problems.join("\n - ")}`); process.exit(1); }

  const entry = { id, status, evidence, method, recordedAt: new Date().toISOString(), build: buildFingerprint() };
  manual.entries = manual.entries.filter((e) => e.id !== id).concat(entry);
  mkdirSync(dirname(manualPath), { recursive: true });
  writeFileSync(manualPath, JSON.stringify(manual, null, 2));
  console.log(`recorded ${id} ${status} for build ${entry.build}`);
}
