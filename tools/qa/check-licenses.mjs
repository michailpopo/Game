#!/usr/bin/env node
/**
 * Every shipped asset must have a manifest row with a usable license.
 *
 *   node tools/qa/check-licenses.mjs
 *
 * Reads docs/ASSET_MANIFEST.md (a markdown table with columns
 * File | Source | Author | License | Tier | Modified | Added) and checks:
 *  - every file under src/assets/ and public/ (except public/LICENSES/) has a row
 *    (a row may cover a folder with a trailing /*)
 *  - no row uses a forbidden license (NonCommercial, personal/editorial use, unknown, GPL art)
 *  - tier C rows are flagged for the user's explicit OK
 *  - every runtime dependency in package.json is named in public/LICENSES/THIRD_PARTY_NOTICES.txt
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const results = [];
const add = (id, status, summary, evidence = {}) => {
  results.push({ id, requirements: ["CG-GAME-007", "CG-SUB-002"], status, summary, evidence });
  console.log(`${status.padEnd(6)} ${id.padEnd(22)} ${summary}`);
};

const manifestPath = resolve(root, "docs/ASSET_MANIFEST.md");
if (!existsSync(manifestPath)) { add("manifest", "FAIL", "docs/ASSET_MANIFEST.md missing"); finish(); }

const lines = readFileSync(manifestPath, "utf8").split("\n").filter((l) => l.trim().startsWith("|"));
const header = lines[0]?.split("|").slice(1, -1).map((c) => c.trim().toLowerCase()) ?? [];
const col = (name) => header.indexOf(name);
const rows = lines.slice(2).map((l) => l.split("|").slice(1, -1).map((c) => c.trim())).filter((r) => r.length >= header.length && r[0] && !/^-+$/.test(r[0]));
for (const needed of ["file", "source", "license", "tier"]) if (col(needed) < 0) add("manifest-columns", "FAIL", `manifest table lacks a "${needed}" column`);

const files = [];
const walk = (dir) => {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p); else files.push(relative(root, p).replaceAll("\\", "/"));
  }
};
walk(resolve(root, "src/assets"));
walk(resolve(root, "public"));
const shipped = files.filter((f) => !f.startsWith("public/LICENSES/"));

const covers = (row, file) => {
  const pattern = row[col("file")].replace(/`/g, "");
  return pattern.endsWith("/*") ? file.startsWith(pattern.slice(0, -1)) : pattern === file;
};
const uncovered = shipped.filter((f) => !rows.some((r) => covers(r, f)));
add("assets-covered", uncovered.length ? "FAIL" : "PASS", uncovered.length ? `${uncovered.length} shipped files without a manifest row, e.g. ${uncovered[0]}` : `${shipped.length} shipped asset files, all in the manifest`, { uncovered });

const FORBIDDEN = /\b(nc|noncommercial|non-commercial|personal use|editorial|unknown|tbd|todo|gpl)\b/i;
const forbidden = rows.filter((r) => FORBIDDEN.test(r[col("license")] || "") || /^x$/i.test(r[col("tier")] || ""));
add("licenses-allowed", forbidden.length ? "FAIL" : "PASS", forbidden.length ? `forbidden license: ${forbidden[0].join(" | ")}` : `${rows.length} manifest rows, none with a forbidden license`);

const tierC = rows.filter((r) => /^c$/i.test(r[col("tier")] || ""));
add("tier-c-needs-ok", tierC.length ? "WARN" : "PASS", tierC.length ? `${tierC.length} tier C assets: confirm the user approved their custom licenses` : "no custom-license (tier C) assets");

const incomplete = rows.filter((r) => !r[col("source")] || !r[col("license")] || !r[col("tier")]);
add("rows-complete", incomplete.length ? "FAIL" : "PASS", incomplete.length ? `${incomplete.length} rows missing source/license/tier` : "all rows have source, license and tier");

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const noticesPath = resolve(root, "public/LICENSES/THIRD_PARTY_NOTICES.txt");
const notices = existsSync(noticesPath) ? readFileSync(noticesPath, "utf8") : "";
const missingDeps = Object.keys(pkg.dependencies || {}).filter((d) => !notices.includes(d));
add("dependency-notices", missingDeps.length ? "FAIL" : "PASS", missingDeps.length ? `dependencies not named in THIRD_PARTY_NOTICES.txt: ${missingDeps.join(", ")}` : "every runtime dependency has a license notice");

finish();

function finish() {
  mkdirSync(resolve(root, "qa/evidence"), { recursive: true });
  writeFileSync(resolve(root, "qa/evidence/licenses.json"), JSON.stringify({ tool: "check-licenses", checkedAt: new Date().toISOString(), results }, null, 2));
  process.exit(results.some((r) => r.status === "FAIL") ? 1 : 0);
}
