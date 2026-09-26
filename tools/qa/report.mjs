#!/usr/bin/env node
/**
 * Compliance report: every applicable CrazyGames requirement, with the evidence
 * collected so far. Everything starts UNVERIFIED; nothing becomes PASS without evidence.
 *
 *   node tools/qa/report.mjs            writes COMPLIANCE_REPORT.md
 *   node tools/qa/report.mjs --strict   exit 3 if any mandatory requirement lacks evidence
 *
 * Inputs: tools/qa/requirements.json (register snapshot copied from the skill),
 *         project.json (targetStage + features), qa/evidence/*.json
 * Precedence per requirement: FAIL from any source > PASS > NOT_APPLICABLE > PORTAL pending > UNVERIFIED.
 * Verdicts are records of what was checked. Only CrazyGames approves a game.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildFingerprint } from "./record.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const register = JSON.parse(readFileSync(resolve(root, "tools/qa/requirements.json"), "utf8"));
const profile = JSON.parse(readFileSync(resolve(root, "project.json"), "utf8"));
const build = buildFingerprint();
const today = new Date();

const applies = (r) => (r.applies_to.includes("all") || r.applies_to.some((f) => profile.features?.[f])) && (profile.targetStage === "full" || r.stage !== "full");
const reqs = register.requirements.filter(applies);

const evidence = new Map();
const push = (id, e) => { if (!evidence.has(id)) evidence.set(id, []); evidence.get(id).push(e); };
const evDir = resolve(root, "qa/evidence");
if (existsSync(evDir)) {
  for (const file of readdirSync(evDir).filter((f) => f.endsWith(".json") && f !== "manual.json")) {
    const doc = JSON.parse(readFileSync(resolve(evDir, file), "utf8"));
    for (const r of doc.results || []) for (const id of r.requirements || []) {
      push(id, { source: doc.tool || file, status: r.status, summary: r.summary, at: doc.checkedAt });
    }
  }
  const manualPath = resolve(evDir, "manual.json");
  if (existsSync(manualPath)) {
    for (const e of JSON.parse(readFileSync(manualPath, "utf8")).entries) {
      push(e.id, { source: `manual (${e.method})`, status: e.build !== build ? "STALE" : e.status, summary: e.evidence, at: e.recordedAt, build: e.build });
    }
  }
}

const rows = reqs.map((r) => {
  const ev = evidence.get(r.id) || [];
  const statuses = ev.map((e) => e.status);
  let status = "UNVERIFIED";
  if (statuses.includes("FAIL")) status = "FAIL";
  else if (statuses.includes("PASS")) status = "PASS";
  else if (statuses.includes("NOT_APPLICABLE")) status = "N/A";
  else if (statuses.includes("WARN")) status = "WARN";
  else if (statuses.includes("STALE")) status = "STALE";
  else if (r.verification === "portal") status = "PORTAL";
  return { r, status, ev };
});

const count = (s) => rows.filter((x) => x.status === s).length;
const mandatoryOpen = rows.filter((x) => x.r.type === "mandatory" && !["PASS", "N/A"].includes(x.status));
const verdict = count("FAIL") ? "NOT COMPLIANT - something failed"
  : mandatoryOpen.length ? `NOT VERIFIED - ${mandatoryOpen.length} mandatory requirements lack current evidence`
  : "ALL APPLICABLE REQUIREMENTS CHECKED";

const stale = today > new Date(register.meta.review_due);
let md = `# Compliance report - ${profile.name}\n\n`;
md += `Generated ${today.toISOString().slice(0, 16).replace("T", " ")} UTC · build \`${build}\` · target stage **${profile.targetStage}** · register ${register.meta.register_version} (researched ${register.meta.researched_on})\n\n`;
if (stale) md += `> **Register past its review date (${register.meta.review_due}).** Run the skill's docs freshness check before trusting this report.\n\n`;
md += `## Verdict: ${verdict}\n\nThis is a record of what was checked, how and when. It is not an approval: only CrazyGames approves a submission.\n\n`;
md += `| PASS | FAIL | WARN | UNVERIFIED | PORTAL | STALE | N/A |\n|---|---|---|---|---|---|---|\n| ${count("PASS")} | ${count("FAIL")} | ${count("WARN")} | ${count("UNVERIFIED")} | ${count("PORTAL")} | ${count("STALE")} | ${count("N/A")} |\n\n`;
md += `Legend: PORTAL = can only be confirmed in the Developer Portal preview or by CrazyGames QA · STALE = manual evidence recorded for a different build · UNVERIFIED = no evidence yet.\n`;

for (const area of [...new Set(rows.map((x) => x.r.area))]) {
  md += `\n## ${area}\n\n| Id | Requirement | Type | Stage | Status | Evidence |\n|---|---|---|---|---|---|\n`;
  for (const { r, status, ev } of rows.filter((x) => x.r.area === area)) {
    const e = ev.map((x) => `${x.status}: ${String(x.summary).replaceAll("|", "/").slice(0, 140)} _(${x.source})_`).join("<br>") || (r.verify_with ? `check with: ${r.verify_with}` : "");
    md += `| ${r.id} | ${r.title} | ${r.type} | ${r.stage} | **${status}** | ${e} |\n`;
  }
}

writeFileSync(resolve(root, "COMPLIANCE_REPORT.md"), md);
console.log(`${verdict}\nPASS ${count("PASS")} · FAIL ${count("FAIL")} · WARN ${count("WARN")} · UNVERIFIED ${count("UNVERIFIED")} · PORTAL ${count("PORTAL")} · STALE ${count("STALE")} · N/A ${count("N/A")} -> COMPLIANCE_REPORT.md`);
process.exit(count("FAIL") ? 1 : process.argv.includes("--strict") && mandatoryOpen.length ? 3 : 0);
