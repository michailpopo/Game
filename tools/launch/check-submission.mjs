#!/usr/bin/env node
/**
 * Check submission assets against the published spec. Measurable properties only;
 * the content rules (title-only text, no borders/logos, not blurry, cover as the
 * opening frame, exciting footage) stay UNVERIFIED until someone looks.
 *
 *   node tools/launch/check-submission.mjs
 *
 * Expected layout (written by capture-covers.mjs and record-preview.mjs):
 *   submission/covers/landscape-1920x1080.png  portrait-800x1200.png  square-800x800.png
 *   submission/video/landscape-1920x1080.mp4   portrait-1080x1620.mp4
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, openSync, readSync, closeSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const results = [];
const add = (id, requirements, status, summary) => { results.push({ id, requirements, status, summary }); console.log(`${status.padEnd(10)} ${id.padEnd(26)} ${summary}`); };

function pngSize(path) {
  const fd = openSync(path, "r");
  const buf = Buffer.alloc(24);
  readSync(fd, buf, 0, 24, 0);
  closeSync(fd);
  if (buf.toString("ascii", 1, 4) !== "PNG") return null;
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

for (const [kind, w, h] of [["landscape", 1920, 1080], ["portrait", 800, 1200], ["square", 800, 800]]) {
  const p = resolve(root, `submission/covers/${kind}-${w}x${h}.png`);
  if (!existsSync(p)) { add(`cover-${kind}`, ["CG-SUB-001"], "FAIL", `missing ${p}`); continue; }
  const size = pngSize(p);
  add(`cover-${kind}`, ["CG-SUB-001"], size && size[0] === w && size[1] === h ? "PASS" : "FAIL", `${size ? size.join("x") : "not a PNG"} (need ${w}x${h}), ${(statSync(p).size / 1024).toFixed(0)} KB`);
}
add("cover-content", ["CG-SUB-002"], "UNVERIFIED", "look: title is the only text, no borders, no icons/store logos, sharp, consistent across the 3 sizes");

const probe = spawnSync("ffprobe", ["-version"]).status === 0;
for (const [kind, w, h] of [["landscape", 1920, 1080], ["portrait", 1080, 1620]]) {
  const p = resolve(root, `submission/video/${kind}-${w}x${h}.mp4`);
  if (!existsSync(p)) { add(`video-${kind}`, ["CG-SUB-003"], "FAIL", `missing ${p}`); continue; }
  const mb = statSync(p).size / 1048576;
  if (!probe) { add(`video-${kind}`, ["CG-SUB-003"], "UNVERIFIED", `ffprobe not installed; size ${mb.toFixed(1)} MB`); continue; }
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration", "-of", "json", p]);
  const info = JSON.parse(r.stdout.toString());
  const video = info.streams.find((s) => s.codec_type === "video");
  const audio = info.streams.some((s) => s.codec_type === "audio");
  const dur = Number(info.format.duration);
  const problems = [];
  if (!video || video.width !== w || video.height !== h) problems.push(`resolution ${video?.width}x${video?.height}, need ${w}x${h}`);
  if (dur < 15 || dur > 20) problems.push(`duration ${dur.toFixed(1)} s, need 15-20 s`);
  if (mb > 50) problems.push(`size ${mb.toFixed(1)} MB > 50 MB`);
  if (audio) problems.push("has an audio stream (videos must be silent)");
  add(`video-${kind}`, ["CG-SUB-003"], problems.length ? "FAIL" : "PASS", problems.length ? problems.join("; ") : `${w}x${h}, ${dur.toFixed(1)} s, ${mb.toFixed(1)} MB, silent`);
}
add("video-content", ["CG-SUB-003"], "UNVERIFIED", "watch: cover as first frame, no black intro/bars, no cursor, no promo text/icons, not sped up, shows the best moments");

mkdirSync(resolve(root, "qa/evidence"), { recursive: true });
writeFileSync(resolve(root, "qa/evidence/submission.json"), JSON.stringify({ tool: "check-submission", checkedAt: new Date().toISOString(), results }, null, 2));
process.exit(results.some((r) => r.status === "FAIL") ? 1 : 0);
