#!/usr/bin/env node
/**
 * Static policy scan of the source for things CrazyGames prohibits or that
 * commonly fail review. Heuristic: a hit is a lead to inspect, and a clean scan
 * is not proof of compliance.
 *
 *   node tools/qa/policy-scan.mjs
 */

import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(m?js|ts|html|css)$/.test(name)) files.push(p);
  }
})(resolve(root, "src"));
files.push(resolve(root, "index.html"));

const src = files.map((p) => ({ path: relative(root, p).replaceAll("\\", "/"), text: readFileSync(p, "utf8") }));
const results = [];
const hits = (re, filter = () => true) => src.filter(filter).flatMap((f) =>
  f.text.split("\n").map((line, i) => (re.test(line) && !/^\s*(\*|\/\/)/.test(line) ? `${f.path}:${i + 1}: ${line.trim().slice(0, 110)}` : null)).filter(Boolean));
const check = (id, requirements, found, okMsg, badMsg, status = "FAIL") => {
  const r = { id, requirements, status: found.length ? status : "PASS", summary: found.length ? `${badMsg}: ${found[0]}${found.length > 1 ? ` (+${found.length - 1})` : ""}` : okMsg, evidence: found.slice(0, 20) };
  results.push(r);
  console.log(`${r.status.padEnd(6)} ${id.padEnd(22)} ${r.summary}`);
};

check("custom-fullscreen", ["CG-GAME-008"], hits(/requestFullscreen|webkitRequestFullscreen|mozRequestFullScreen/), "no custom fullscreen", "custom fullscreen code");
check("orientation-lock", ["CG-TECH-011"], hits(/screen\.orientation\.lock|lockOrientation/), "no orientation lock", "orientation lock logic");
check("external-ads", ["CG-ADS-001"], hits(/googlesyndication|adsbygoogle|doubleclick|imasdk|applovin|ironsource|unityads|gamemonetize|gamedistribution|poki-sdk|PokiSDK|adinplay|venatus/i), "no third-party ad networks", "third-party ad code");
check("key-not-code", ["CG-QUAL-002"], hits(/\.key\s*={2,3}\s*["'`][a-zA-Z]["'`]|\.key\s*===?\s*["'`](?:w|a|s|d|z|q)["'`]/i), "movement keys read via KeyboardEvent.code", "letter keys compared with KeyboardEvent.key (breaks AZERTY)");
check("escape-binding", ["CG-QUAL-001"], hits(/["'`]Escape["'`]/, (f) => !f.path.endsWith("input.js")), "Escape not bound", "Escape used as a binding", "WARN");
check("sdk-outside-facade", ["architecture"], hits(/window\.CrazyGames|globalThis\.CrazyGames|CrazyGames\.SDK/, (f) => !f.path.endsWith("platform/platform.js") && !f.path.endsWith(".html")), "SDK only touched in platform.js", "SDK called outside the platform facade");
check("gameplaystop-on-hide", ["CG-SDK-003"], hits(/visibilitychange[\s\S]{0,120}gameplayStop|blur[\s\S]{0,80}gameplayStop/), "gameplayStop not tied to focus/visibility", "gameplayStop tied to focus/visibility (docs: CrazyGames handles this)");
check("popups", ["CG-ADS-020"], hits(/\balert\(|\bconfirm\(|\bprompt\(/), "no browser popups", "browser popup call");
check("window-open", ["CG-GAME-009"], hits(/window\.open\(/), "no window.open", "window.open (check it is not cross-promotion)", "WARN");
check("app-store-links", ["CG-GAME-009"], hits(/apps\.apple\.com|play\.google\.com\/store|itunes\.apple\.com/), "no app store links", "app store link in game (never allowed in-game)");
check("external-urls", ["CG-GAME-009", "CG-TECH-006"], hits(/https?:\/\/(?!sdk\.crazygames\.com|www\.w3\.org|images\.crazygames\.com)[a-z0-9.-]+\.[a-z]{2,}/i, (f) => !f.path.endsWith("platform/platform.js")), "no unexpected external URLs", "external URL (cross-promotion or externally loaded asset?)", "WARN");
check("random-in-sim", ["CG-GAME-003"], hits(/Math\.random|Date\.now|performance\.now/, (f) => /src\/game\/(sim|level-gen|formation|meta|offers)\.js$/.test(f.path)), "simulation is free of Math.random/clock reads", "non-deterministic call in simulation code");

const html = src.find((f) => f.path === "index.html")?.text || "";
const userSelect = /user-select:\s*none/.test(html) || src.some((f) => f.path.endsWith(".css") && /body[^{]*\{[^}]*user-select:\s*none/.test(f.text));
results.push({ id: "user-select-none", requirements: ["CG-TECH-012"], status: userSelect ? "PASS" : "FAIL", summary: userSelect ? "user-select: none on body" : "body lacks user-select: none" });
console.log(`${(userSelect ? "PASS" : "FAIL").padEnd(6)} ${"user-select-none".padEnd(22)} ${results.at(-1).summary}`);

mkdirSync(resolve(root, "qa/evidence"), { recursive: true });
writeFileSync(resolve(root, "qa/evidence/policy-scan.json"), JSON.stringify({ tool: "policy-scan", checkedAt: new Date().toISOString(), results }, null, 2));
process.exit(results.some((r) => r.status === "FAIL") ? 1 : 0);
