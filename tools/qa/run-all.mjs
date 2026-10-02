#!/usr/bin/env node
/**
 * Run every automated check in order, keep going on failures, then write the report.
 *
 *   node tools/qa/run-all.mjs            (npm run qa)
 *   node tools/qa/run-all.mjs --fast     skip the browser harness
 */

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const node = process.execPath;
const vite = resolve(root, "node_modules/vite/bin/vite.js");
const steps = [
  ["simulation health", [node, "tools/qa/sim-health.mjs", "--selftest"]],
  ["city layout (buildings apart)", [node, "tools/qa/check-city.mjs", "--selftest"]],
  ["policy scan", [node, "tools/qa/policy-scan.mjs"]],
  ["licenses", [node, "tools/qa/check-licenses.mjs"]],
  ["poly budget (model files)", [node, "tools/qa/check-poly.mjs"]],
  ["production build", [node, vite, "build"]],
  ["bundle", [node, "tools/qa/check-bundle.mjs"]],
];
if (!process.argv.includes("--fast")) steps.push(["browser harness", [node, "tools/qa/browser-qa.mjs", "--serve"]]);

const outcome = [];
for (const [name, [cmd, ...args]] of steps) {
  console.log(`\n=== ${name} ===`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: "inherit" });
  outcome.push([name, r.status]);
  if (name === "production build" && r.status !== 0) { console.error("build failed - skipping build-dependent steps"); break; }
}
console.log("\n=== compliance report ===");
const report = spawnSync(node, ["tools/qa/report.mjs"], { cwd: root, stdio: "inherit" });

console.log("\nSummary:");
for (const [name, status] of outcome) console.log(`  ${status === 0 ? "ok  " : "FAIL"}  ${name}`);
process.exit(outcome.some(([, s]) => s !== 0) || report.status === 1 ? 1 : 0);
