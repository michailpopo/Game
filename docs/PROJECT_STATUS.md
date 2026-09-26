# Project status - Skip Legend

Updated: 2026-09-26 · Project folder: /home/user/Game (repo michailpopo/Game, branch claude/festive-darwin-7ukgnb)

## Where we are
- **Phase:** 2 Concept -> 3 Prototype
- **Current objective:** finish the brief for Skip Legend, then build the grey-box prototype of tap-per-skip.
- **Next action (one concrete step):** planner verifies GAME_BRIEF.md / ORIGINALITY.md / project.json, closes
  Gate 1, then briefs WP-02 (threejs-game-engineer).
- **Waiting on the user:** nothing right now. Next: play the prototype (Gate 2).

## Gates
| Gate | Status | Date | Evidence |
|---|---|---|---|
| 1 Concept | IN PROGRESS | 2026-09-26 | owner picked C1 Skip Legend (docs/CONCEPTS.md); brief + originality in progress |
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
