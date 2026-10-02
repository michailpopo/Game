# Project status - Storm Grid

Updated: 2026-10-02 · Project folder: /home/user/Game (repo michailpopo/Game, branch claude/peaceful-allen-pphssd)

## Where we are
- **Phase:** 3 Build done for the game itself - Storm Grid (3D) is functionally complete and passed the automated CrazyGames QA on 2026-10-02 (`docs/CG_QA_AUDIT.md`). Read HANDOFF.md first.
- **Current objective:** an original, dopamine-hitting game that looks premium, upload-ready. Scope of the last session: "just the game, not the files" (no covers / videos / store text yet).
- **Next action (one concrete step):** the owner plays the hosted playtest page (PC + phone), picks the bolt (classic vs outlined) and the light (dusk vs bright), auditions the sounds (Sounds panel) -> then remove the losing variants + playtest switches (HANDOFF.md section 3 list) and re-run the full harness.
- **Waiting on the user:** the playtest answers above. Launch package (WP-13) only when they ask for it.

## Gates
| Gate | Status | Date | Evidence |
|---|---|---|---|
| 1 Concept | PASS | 2026-09-26 | owner picked T1 Volt City (3D), renamed Storm Grid; GAME_BRIEF, ORIGINALITY (casino name collision found -> rename), project.json done |
| 2 Prototype fun | FAIL (Comet Chain) | 2026-09-26 | owner played playtest 1: "the game looks shit" - wants an original, dopamine-hitting game, not a copy; Comet Chain shelved |
| 3 Vertical slice | NOT STARTED | | |
| 4 Gameplay quality | NOT STARTED | | |
| 5 Content & polish | NOT STARTED | | |
| 6 Platform integration | NOT STARTED | | |
| 7 Performance | NOT STARTED | | |
| 8 QA & compliance | NOT STARTED | | |
| 9 Launch package | NOT STARTED | | |
| 10 Post-launch review | NOT STARTED | | |
Statuses: NOT STARTED · IN PROGRESS · BLOCKED · READY FOR REVIEW · PASS · FAIL

## How to run
```bash
npm install
npm run dev          # http://127.0.0.1:5173/?qa=1   (mock SDK; add &realsdk=1 for the real SDK)
npm run qa           # all automated checks + COMPLIANCE_REPORT.md
# cloud container only: PW_CHROMIUM_PATH=/opt/pw-browsers/chromium for the browser harness,
# NODE_USE_ENV_PROXY=1 for Node scripts that fetch the web
```

## Latest measurements
| Metric | Value | Date | How |
|---|---|---|---|
| Bytes to first gameplayStart | 0.18 MB (template demo) | 2026-09-26 | browser-qa boot |
| Total dist size / files | ~0.8 MB (Storm Grid build) | 2026-09-28 | du -sh dist |
| p95 frame time @4x CPU throttle | | | browser-qa performance |
| Draw calls / triangles in play | | | `__GS_QA__.renderInfo()` |
| Compliance verdict | NOT VERIFIED (template demo: 16 PASS, 46 unverified) | 2026-09-26 | report.mjs |
| Docs freshness | UNCHANGED vs register 2026.09.11 | 2026-09-26 | check-docs-freshness.mjs |

## Top 3 problems (reorder after every playtest)
1. WP-31/WP-32 unverified; last screenshots show a weak bolt / pale lit colours in the game and the shop over the old dark city (HANDOFF.md section 3).
2. No owner playtest of Storm Grid yet; sounds not auditioned.
3. Economy numbers are model numbers (Monte Carlo) until a human playtest.

## Known bugs
| Id | Severity (P0-P3) | Description | Status |
|---|---|---|---|
| B1 | P2 | Template demo: save not flushed on tab hide | fixed in WP-10 (main.js marks the save dirty on hide) |

## Decisions log
| Date | Decision | Why | Alternatives rejected |
|---|---|---|---|
| 2026-09-26 | Research-and-propose, desktop + mobile, single-player | owner's answers | own idea, desktop only, multiplayer |
| 2026-09-26 | Runner template (three.js, profile M minimal-poly) | one-screen hypercasual game | world template |
| 2026-09-26 | Concept C1 Skip Legend, working title kept | owner's pick at Gate 1 (recommended: simplest build, 7 wanted ad surfaces, no stone-skipping game on CrazyGames) | C4 Core Diver (fallback if the feel fails), C5 Topple Line, C2 Blob Barrage, C3 Grazeline |
| 2026-09-26 | Gate 1 reopened; Skip Legend brief on hold | owner: "Rocket Fling only has 1.6k likes - look at games like Cubes 2048.io that have many likes / are very popular and not that hard to make" | continuing Skip Legend unchanged |
| 2026-09-26 | Direction: Cubes 2048.io family, full reskin | owner: very popular (128k likes) and simple; hit list: clones get 2-13% of its plays, a full reskin (Harvest.io) 29% | Skip Legend (shelved), crowd runner, one-verb arcade |
| 2026-09-26 | Concept R1 Comet Chain; bots labelled via "Offline Arena" mode name only; title kept | owner's picks | R2 Merge Express, R3 Gloop Merge; per-name BOT tag |
| 2026-09-26 | Comet Chain shelved after the owner's playtest | owner: "the game looks shit, now create an original game not copy game, but it must be dopamine hitting" | polishing Comet Chain |
| 2026-09-26 | Art direction becomes a user checkpoint before building (look test) | the skill lists art direction as the owner's decision; we skipped it for Comet Chain | building first, showing later |
| 2026-09-26 | Concept T1 Volt City, fully 3D; renamed Storm Grid | owner's picks ("It must be 3d game"; Volt City collides with a Volt Casino game) | T2 Shatterfall, T3 Magnet Heap; keeping the casino-colliding name |
| 2026-09-26 | Look kit WP-20 done: Neutral tone mapping (ACES/AgX washed colours out), bloom only on high/ultra tiers | side-by-side captures in qa/wp20/ | ACES, AgX |
| 2026-09-27 | Keep the UI; restyle the city from hit-game references, keep it simple | owner: "good in general, the ui looks great but the city is still looking too ai generated, grab some visual inspo from games with a lot of likes that are made in html5, do not overcomplicate" | neon-cyberpunk city |
| 2026-09-28 | Stopped both specialists and wrote HANDOFF.md | owner wants to continue in a new chat to save context tokens; the account hit its usage limit twice | keep agents running here |
