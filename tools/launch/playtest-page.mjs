#!/usr/bin/env node
/**
 * Builds a self-contained PLAYTEST page from dist/ for the owner (HANDOFF "Owner playtest"): one HTML file with the CSS (fonts as
 * data URIs) and the game bundle inlined, in the form the Artifact tool wants (page content only: no doctype / html / head / body).
 *
 *   npm run build && node tools/launch/playtest-page.mjs            -> qa/playtest/index.html
 *
 * Differences from the real build, on purpose:
 *   - the CrazyGames SDK <script> is removed (a hosted private page cannot load it) and replaced by the dev MOCK SDK
 *     (dev/mock-crazygames-sdk.js), so the owner sees every rewarded surface and the ad flow (fake ads: they "play" for ~1 s and
 *     always grant); pass --no-mock to run without any SDK (then every video button is hidden, as under an ad blocker)
 *   - window.__PLAYTEST__ = true shows the bolt / light / sound-check buttons (a hosted page cannot take ?compare=1)
 * Nothing else changes; the upload build stays dist/. Never upload this file to CrazyGames.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const dist = resolve(root, "dist");
const html = readFileSync(resolve(dist, "index.html"), "utf8");

const attr = (tag, name) => new RegExp(`${name}="([^"]+)"`).exec(tag)?.[1];
const jsSrc = attr(/<script[^>]*type="module"[^>]*>/.exec(html)[0], "src");
const cssHref = attr(/<link[^>]*rel="stylesheet"[^>]*>/.exec(html)[0], "href");
const inlineStyle = /<style>([\s\S]*?)<\/style>/.exec(html)[1];
const title = /<title>([\s\S]*?)<\/title>/.exec(html)[1];
const bodyInner = /<body>([\s\S]*?)<\/body>/.exec(html)[1].trim();

// The stylesheet refers to its fonts by relative URL: inline them (woff2 first; the woff fallback is dropped).
const assets = (p) => resolve(dist, p.replace(/^\.\//, ""));
let css = readFileSync(assets(cssHref), "utf8");
css = css.replace(/url\(([^)]+\.(woff2?))\)/g, (m, u, ext) => {
  const file = resolve(dirname(assets(cssHref)), u.replace(/["']/g, ""));
  return `url(data:font/${ext};base64,${readFileSync(file).toString("base64")})`;
});

const js = readFileSync(assets(jsSrc), "utf8");
if (/<\/script/i.test(js)) throw new Error("the bundle contains </script - escape it before inlining");

const useMock = !process.argv.includes("--no-mock");
const mock = useMock ? readFileSync(resolve(root, "dev/mock-crazygames-sdk.js"), "utf8") : "";
if (/<\/script/i.test(mock)) throw new Error("the mock SDK contains </script");

const page = `<title>${title}</title>
<style>${inlineStyle}</style>
<style>${css}</style>
${bodyInner}
<script>window.__PLAYTEST__ = true;</script>
${useMock ? `<script>${mock}</script>\n` : ""}<script type="module">${js}</script>
`;

mkdirSync(resolve(root, "qa/playtest"), { recursive: true });
writeFileSync(resolve(root, "qa/playtest/index.html"), page);
console.log(`qa/playtest/index.html  ${(page.length / 1024).toFixed(0)} KB  (js ${(js.length / 1024).toFixed(0)} KB, css ${(css.length / 1024).toFixed(0)} KB, ${useMock ? "mock SDK" : "no SDK"}, compare buttons on)`);
