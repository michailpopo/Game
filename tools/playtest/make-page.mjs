// Builds the private playtest page from dist/ for the Artifact tool (claude.ai): copies dist/assets (and dist/sfx if
// present) into <outDir> and writes <outDir>/index.html as page content only - no doctype/html/head/body/meta (the
// artifact wraps it) and WITHOUT the CrazyGames SDK <script> (the game runs without it; platform "none").
//   npm run build && node tools/playtest/make-page.mjs <outDir>
// Then publish <outDir>/index.html with the Artifact tool: `url` = the playtest link (HANDOFF section 2) and `files` =
// every file under <outDir>/assets (+ sfx), mapping old hashed names that are gone to null. Prints that list.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2];
if (!out) { console.error("usage: node tools/playtest/make-page.mjs <outDir>"); process.exit(2); }
if (!existsSync("dist/index.html")) { console.error("dist/ missing: run npm run build first"); process.exit(2); }
mkdirSync(out, { recursive: true });
for (const d of ["assets", "sfx"]) {
  rmSync(join(out, d), { recursive: true, force: true });
  if (existsSync(join("dist", d))) cpSync(join("dist", d), join(out, d), { recursive: true });
}
const html = readFileSync("dist/index.html", "utf8");
const head = html.match(/<head>([\s\S]*)<\/head>/)[1]
  .replace(/\s*<meta[^>]*>/g, "")
  .replace(/\s*<!--[\s\S]*?-->/g, "")
  .replace(/\s*<script src="https:\/\/sdk\.crazygames\.com[^"]*"><\/script>/g, "");
if (/crazygames/i.test(head)) throw new Error("SDK tag still in the page head");
const body = html.match(/<body>([\s\S]*)<\/body>/)[1];
writeFileSync(join(out, "index.html"), `${head.trim()}\n${body.trim()}\n`);
const files = [];
for (const d of ["assets", "sfx"]) if (existsSync(join(out, d))) for (const f of readdirSync(join(out, d))) files.push(`${d}/${f}`);
console.log(JSON.stringify(files, null, 1));
