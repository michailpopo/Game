# Project status - Storm Grid

Updated: 2026-10-02 · Project folder: /home/user/Game (repo michailpopo/Game, branch claude/amazing-carson-87o6sf)

## Where we are
- **Phase:** 3 Build - Storm Grid (3D). Handoff to a new chat on 2026-09-28: read HANDOFF.md first.
- **Current objective:** an original, dopamine-hitting game that looks premium, upload-ready this session.
- **Latest:** CrazyGames QA audit done 2026-10-02 (`docs/CG_QA_AUDIT.md`): 38/45 mandatory PASS, 4 FAIL (covers + preview videos not made yet), 3 cannot verify (Edge, 4 GB Chromebook, CG-app safe areas), 6 warnings. No code requirement fails.
- **Also 2026-10-04 (evening):** toy thunderhead cloud, city life (parks, benches, lamps, walking people, driving cars) and a finished world around every theme (fields, hills, roads, windmills, mountains, desert, cloud banks, boats): `storm-cloud.js`, `city-life.js`, `scenery.js`. <= 44 draw calls, <= 51.4k tris/frame. Waiting for the owner to look.
- **Also 2026-10-04 (water):** toy water shader for the island themes (`src/game/water.js`: shallow gradient, beach foam, waves rolling in, soft crests; 1 draw call, distance field once per city). Waiting for the owner to look.
- **Also 2026-10-04 (later):** the city's island is now a square that follows the city, islets are round and irregular (`src/game/islands.js`), owner's request.
- **Also 2026-10-04:** water themes (Harbour, Neon Bay) stand on islands with beaches and islet trees instead of trees on open water (`planIslands` in `city-mesh.js`, guard in `tools/qa/check-city.mjs`). Waiting for the owner to look.
- **Also 2026-10-02:** buildings that touched or intersected (from city 3) now keep >= 1.0 m of air between roof caps (`clearFootprints` in `sim.js`, guard `tools/qa/check-city.mjs`). Waiting for the owner to look.
- **Next action (one concrete step):** fix the save fallback in `src/core/save.js` (audit W1) and the two harness scenarios `persistence` / `ads-fill` (test-tool problems, not game bugs), so `npm run qa` exits 0; then the owner judges the 3 visual items, plays, auditions the sounds; then the launch package (HANDOFF.md section 4).
- **Waiting on the user:** nothing until the next playtest build; then: play it and audition the sounds.

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
| 8 QA & compliance | IN PROGRESS | 2026-10-02 | `docs/CG_QA_AUDIT.md` (audit mode, Full Launch); `npm run qa:fast` green; browser harness traced, 2 scenarios still fail on a correct game |
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
| Bytes to first gameplayStart | 0.22 MB (Storm Grid) | 2026-10-02 | browser-qa boot |
| Total dist size / files | 0.76 MB / 6 files | 2026-10-02 | check-bundle |
| p95 frame time @4x CPU throttle | | | browser-qa performance |
| Draw calls / triangles in play | max 32 calls / 10,541 tris (budget 60 / 60,000) | 2026-10-02 | browser-qa poly-budget (software GL) |
| Compliance verdict | audit: 38/45 mandatory PASS, 4 FAIL (covers/videos), 3 cannot verify; `COMPLIANCE_REPORT.md` still lists browser items UNVERIFIED (regenerate with a clean full `npm run qa`) | 2026-10-02 | CG_QA_AUDIT.md |
| Docs freshness | CHANGED: cg-technical, cg-sitelock; rules re-read, no effect on this game (audit W5); register not bumped | 2026-10-02 | check-docs-freshness.mjs |

## Top 3 problems (reorder after every playtest)
1. Visual items from HANDOFF.md section 3 (bolt brightness, candy colours, shop over the toy city) not re-judged; 2026-10-02 frames show candy-coloured lit buildings and the toy city behind the shop, the owner decides.
2. No owner playtest of Storm Grid yet; sounds not auditioned.
3. Economy numbers are model numbers (Monte Carlo) until a human playtest.

## Known bugs
| Id | Severity (P0-P3) | Description | Status |
|---|---|---|---|
| B1 | P2 | Template demo: save not flushed on tab hide | fixed in WP-10 (main.js marks the save dirty on hide) |
| B2 | P2 | Data module off (Progress Save not ticked in the portal): progress is written to localStorage but never read back, the game boots from defaults (`src/core/save.js`; audit W1; reproduced) | open, 3-line fix in HANDOFF.md section 4 |
| B3 | P3 (test tool) | `browser-qa` `persistence` leaks two WebGL pages and starves later scenarios; `ads-fill` uses fixed sleeps. The game is correct in both (audit "Test-tool findings") | open, fix in the harness |

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
| 2026-10-04 | Dress every map: city life + per-theme scenery, all instanced and capped | owner: "all maps should look finished and not so plain", wants driving cars, people, benches, parks, a better cloud | loading model packs (download size, licences), one generic scenery for every theme |
| 2026-10-04 | Stylised water from a shore distance field, not three.js Water/Water2 | owner asked for three.js water in the game style; the examples' Water (reflection render target) and Water2 (reflection + refraction) render the scene again every frame and look realistic, not toy; a distance field is exact here because the islands are known shapes | three.js Water.js / Water2.js, a depth pre-pass for foam, a displaced 72x72 wave grid (over the 2,000-triangle geometry budget) |
| 2026-10-04 | Islands for the water themes, built new (never existed in git) | owner: "in some version before there were islands and no trees on water, that doesn't make sense, bring back the islands"; trees on a flat sea read as a bug | keeping the tree ring and recolouring the field; making the whole sea land |
| 2026-10-02 | Fix touching buildings by trimming footprints, not by moving lots | owner: "some of the buildings almost stand in each other"; footprints are look only, so the hop graph and the economy stay as tuned; measured 220 touching pairs before, 0 after (`tools/qa/check-city.mjs`) | reducing lot jitter (changes hop distances), fewer buildings |
| 2026-10-02 | Audit before fixing: wrote the report, applied no code changes | owner asked to check the game against the CrazyGames requirements; fixes (B2, B3) wait for the owner's go | fixing while auditing |
| 2026-09-28 | Stopped both specialists and wrote HANDOFF.md | owner wants to continue in a new chat to save context tokens; the account hit its usage limit twice | keep agents running here |
