#!/usr/bin/env node
/**
 * Static checks on the production bundle.
 *
 *   node tools/qa/check-bundle.mjs [dist]
 *
 * Limits from docs.crazygames.com/requirements/technical (read 2026-09-11):
 *   total <= 250 MB with SDK (<= 50 MB without), <= 1500 files, relative paths only.
 * Initial download is measured to the first gameplayStart and can only be
 * measured in a browser: see tools/qa/browser-qa.mjs (scenario "boot").
 */

import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const dist = resolve(root, process.argv[2] || "dist");
const MB = 1048576;

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p); else files.push({ path: relative(dist, p).replaceAll("\\", "/"), size: st.size });
  }
})(dist);

const results = [];
const add = (id, requirements, status, summary, evidence = {}) => {
  results.push({ id, requirements, status, summary, evidence });
  console.log(`${status.padEnd(6)} ${id.padEnd(20)} ${summary}`);
};

const total = files.reduce((s, f) => s + f.size, 0);
const html = readFileSync(join(dist, "index.html"), "utf8");
const sdkTag = /<script[^>]+src=["']https:\/\/sdk\.crazygames\.com\/crazygames-sdk-v3\.js["'][^>]*><\/script>/i.exec(html);
const sdk = !!sdkTag;
const cap = sdk ? 250 * MB : 50 * MB;

add("total-size", ["CG-TECH-002"], total <= cap ? "PASS" : "FAIL", `${(total / MB).toFixed(2)} MB (limit ${cap / MB} MB, SDK ${sdk ? "integrated" : "NOT integrated"})`, { total });
add("file-count", ["CG-TECH-003"], files.length <= 1500 ? "PASS" : "FAIL", `${files.length} files (limit 1500)`);

// SDK tag must be in <head> and before the module script.
const headEnd = html.indexOf("</head>");
const moduleIdx = html.search(/<script[^>]+type=["']module["']/i);
if (!sdk) add("sdk-tag", ["CG-SDK-001"], "WARN", "CrazyGames SDK v3 script tag not found (required for Full Launch)");
else add("sdk-tag", ["CG-SDK-001"], sdkTag.index < headEnd && sdkTag.index < moduleIdx ? "PASS" : "FAIL", "SDK v3 tag in <head> before game code");

// Absolute paths.
const absolute = [];
for (const f of files.filter((f) => [".html", ".js", ".css"].includes(extname(f.path)))) {
  const text = readFileSync(join(dist, f.path), "utf8");
  const re = /(?:src|href)=["'](\/[^/"'][^"']*)["']|url\((["']?)(\/[^/)][^)]*)\2\)|["'](\/assets\/[^"']+)["']/g;
  for (const m of text.matchAll(re)) absolute.push(`${f.path}: ${m[1] || m[3] || m[4]}`);
}
add("relative-paths", ["CG-TECH-005"], absolute.length ? "FAIL" : "PASS", absolute.length ? `${absolute.length} absolute paths, e.g. ${absolute[0]}` : "no absolute asset paths", { absolute: absolute.slice(0, 20) });

// Things that must never ship.
const shipped = [];
for (const f of files) {
  if (f.path.endsWith(".map")) shipped.push(`${f.path} (source map)`);
  if (/mock-crazygames-sdk/i.test(f.path)) shipped.push(`${f.path} (dev mock SDK)`);
}
for (const f of files.filter((f) => [".html", ".js"].includes(extname(f.path)))) {
  const text = readFileSync(join(dist, f.path), "utf8");
  if (text.includes("__dev/mock-crazygames-sdk")) shipped.push(`${f.path} references the dev mock`);
  if (/\bmockAdCode\b|__isMock\s*:\s*true/.test(text)) shipped.push(`${f.path} contains mock SDK code`);
  if (/https?:\/\/(localhost|127\.0\.0\.1)[:/]/.test(text)) shipped.push(`${f.path} references localhost`);
  if (/(sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(text)) shipped.push(`${f.path} contains something that looks like a secret`);
}
add("no-dev-artifacts", ["CG-GAME-004"], shipped.length ? "FAIL" : "PASS", shipped.length ? shipped.join("; ") : "no source maps, mock SDK, localhost URLs or secrets");

const largest = [...files].sort((a, b) => b.size - a.size).slice(0, 8).map((f) => `${f.path} ${(f.size / 1024).toFixed(0)} KB`);
add("largest-files", [], "INFO", largest.slice(0, 3).join(", "), { largest });

mkdirSync(resolve(root, "qa/evidence"), { recursive: true });
writeFileSync(resolve(root, "qa/evidence/bundle.json"), JSON.stringify({ tool: "check-bundle", checkedAt: new Date().toISOString(), dist, totalBytes: total, fileCount: files.length, results }, null, 2));
process.exit(results.some((r) => r.status === "FAIL") ? 1 : 0);
