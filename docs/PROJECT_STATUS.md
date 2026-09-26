# Project status - Comet Chain

Updated: 2026-09-26 · Project folder: /home/user/Game (repo michailpopo/Game, branch claude/festive-darwin-7ukgnb)

## Where we are
- **Phase:** 2 Concept -> 3 Prototype
- **Current objective:** Comet Chain (Cubes 2048.io family, full reskin): brief + core engine -> twist -> slice -> QA -> launch package, upload-ready this session.
- **Next action (one concrete step):** designer writes GAME_BRIEF/ORIGINALITY/project.json for Comet Chain; engineer finishes WP-10 core with the Comet Chain rule changes.
- **Waiting on the user:** nothing right now. Next: play the prototype (Gate 2).

## Gates
| Gate | Status | Date | Evidence |
|---|---|---|---|
| 1 Concept | IN PROGRESS (twist picked: R1 Comet Chain; brief in progress) | 2026-09-26 | owner picked C1 Skip Legend, then asked to re-benchmark against very popular games (Cubes 2048.io-level likes) that are simple to make; hit-list research running, Skip Legend brief on hold |
| 2 Prototype fun | NOT STARTED | | |
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
| Total dist size / files | 0.64 MB / 6 files (template demo) | 2026-09-26 | check-bundle |
| p95 frame time @4x CPU throttle | | | browser-qa performance |
| Draw calls / triangles in play | | | `__GS_QA__.renderInfo()` |
| Compliance verdict | NOT VERIFIED (template demo: 16 PASS, 46 unverified) | 2026-09-26 | report.mjs |
| Docs freshness | UNCHANGED vs register 2026.09.11 | 2026-09-26 | check-docs-freshness.mjs |

## Top 3 problems (reorder after every playtest)
1. The core feel (tap on every water contact) is unproven - the Gate 2 prototype answers it.
2. The launch-and-upgrade family is crowded on CrazyGames (Rocket Fling, Bouncemasters, Splash Sliders); Skip Legend must read as different in a 3-second clip.
3. "Skip It!" (1Games.IO, 2026-03) is a stone-skipping upgrade game on other portals - originality review must show our verb and structure are distinct.

## Known bugs
| Id | Severity (P0-P3) | Description | Status |
|---|---|---|---|
| B1 | P2 | Template demo: save not flushed on tab hide (browser-qa tab-hidden FAIL) | open - WP-02 |
| B2 | P2 | Template demo: dead-air 8.6 s (budget 3 s) | open - replaced by the new game in WP-02 |

## Decisions log
| Date | Decision | Why | Alternatives rejected |
|---|---|---|---|
| 2026-09-26 | Research-and-propose, desktop + mobile, single-player | owner's answers | own idea, desktop only, multiplayer |
| 2026-09-26 | Runner template (three.js, profile M minimal-poly) | one-screen hypercasual game | world template |
| 2026-09-26 | Concept C1 Skip Legend, working title kept | owner's pick at Gate 1 (recommended: simplest build, 7 wanted ad surfaces, no stone-skipping game on CrazyGames) | C4 Core Diver (fallback if the feel fails), C5 Topple Line, C2 Blob Barrage, C3 Grazeline |
| 2026-09-26 | Gate 1 reopened; Skip Legend brief on hold | owner: "Rocket Fling only has 1.6k likes - look at games like Cubes 2048.io that have many likes / are very popular and not that hard to make" | continuing Skip Legend unchanged |
| 2026-09-26 | Direction: Cubes 2048.io family, full reskin | owner: very popular (128k likes) and simple; hit list: clones get 2-13% of its plays, a full reskin (Harvest.io) 29% | Skip Legend (shelved), crowd runner, one-verb arcade |
| 2026-09-26 | Concept R1 Comet Chain; bots labelled via "Offline Arena" mode name only; title kept | owner's picks | R2 Merge Express, R3 Gloop Merge; per-name BOT tag |
