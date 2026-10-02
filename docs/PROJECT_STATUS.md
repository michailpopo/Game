# Project status - Storm Grid

Updated: 2026-10-02 · Project folder: /home/user/Game (repo michailpopo/Game, branch claude/peaceful-allen-pphssd)

## Where we are
- **Phase:** 3 Build done - Storm Grid (3D) is the 2026-09-28 game again (the owner: "the old version of the game was good, make it like it was") and it passed the automated CrazyGames QA on 2026-10-02 (`docs/CG_QA_AUDIT.md`). Read HANDOFF.md first.
- **Current objective:** an original, dopamine-hitting game that looks premium, upload-ready. Scope of the last session: the QA harness green + the crazygames-qa audit of the game, nothing else (no look / sound changes, no covers / videos / store text).
- **Next action (one concrete step):** the owner plays the build (PC + phone), listens to the sounds, and says whether to apply the small known-issue fixes (P cannot resume a pause, no message without WebGL, loud strike boom - HANDOFF section 3).
- **Waiting on the user:** the answers above. Launch package (WP-13) only when they ask for it.

## Gates
| Gate | Status | Date | Evidence |
|---|---|---|---|
| 1 Concept | PASS | 2026-09-26 | owner picked T1 Volt City (3D), renamed Storm Grid; GAME_BRIEF, ORIGINALITY (casino name collision found -> rename), project.json done |
| 2 Prototype fun | FAIL (Comet Chain) | 2026-09-26 | owner played playtest 1: "the game looks shit" - wants an original, dopamine-hitting game, not a copy; Comet Chain shelved |
| 3 Vertical slice | READY FOR REVIEW | 2026-10-02 | whole loop plays in the real UI (soak: 20 cities with key mashing / pauses / resizes, no errors); waiting for the owner's play and ears |
| 4 Gameplay quality | READY FOR REVIEW | 2026-10-02 | sim-health selftest PASS (deterministic, step-size drift 0%); dead-air longest silence 0.4 s; economy still model numbers until a human playtest |
| 5 Content & polish | READY FOR REVIEW | 2026-10-02 | the owner likes the current look and bolt; sounds never auditioned (thunder / fail clip, see Known bugs) |
| 6 Platform integration | PASS (mock SDK; portal preview still the owner's) | 2026-10-02 | browser-qa sdk-events, no-sdk, sdk-disabled, sdk-init-hang, ads-*, adblock, mute-priority, tab-hidden, persistence all PASS |
| 7 Performance | READY FOR REVIEW (proxies only) | 2026-10-02 | 9.5k tris / 35 calls (high tier), 2.7 ms/frame script+style+layout at 4x CPU throttle, 0.76 MB; no real low-end device measured |
| 8 QA & compliance | READY FOR REVIEW | 2026-10-02 | `docs/CG_QA_AUDIT.md`: 0 FAIL in the automated run (2 WARN = known issues left on purpose); open = real devices, portal, owner's ears, store assets |
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
| Bytes to first gameplayStart | 0.22 MB | 2026-10-02 | browser-qa boot |
| Total dist size / files | 0.76 MB, 6 files | 2026-10-02 | check-bundle |
| Main-thread cost per frame @4x CPU throttle | 2.7 ms (script 1.5 + style 0.9 + layout 0.2), 3D draw excluded; budget 16.7 ms | 2026-10-02 | browser-qa cpu-cost (a proxy: software WebGL cannot give real frame times) |
| Draw calls / triangles in play | max 35 calls / 9.5k tris over 12 s at the high tier (budget 60 / 60k) | 2026-10-02 | browser-qa poly-budget |
| Compliance verdict | see `COMPLIANCE_REPORT.md` / `docs/CG_QA_AUDIT.md` (0 FAIL; open items are device / portal / owner / store assets) | 2026-10-02 | report.mjs |
| Docs freshness | register 2026.09.11 (review due 2026-11-11 - re-check the CrazyGames docs before submitting) | 2026-10-02 | requirements.json meta |
| Soak (20 cities, abuse) | PASS in 221 s: heap 11 -> 12 MB, DOM 327 -> 287, geometries 19 -> 19, textures 4 -> 4, no console errors | 2026-10-02 | tools/qa/soak.mjs |

## Top 3 problems (reorder after every playtest)
1. The owner has not played the final build or heard the sounds; `thunder` (every strike) and `fail` clip by 2-3 dB (computed, not heard).
2. Nothing was measured on a real low-end device (4 GB Chromebook, phone) or in the Developer Portal preview (Progress Save, orientation, safe areas, iOS audio) - only proxies in a software-rendered container.
3. Economy numbers are model numbers (Monte Carlo) until a human playtest; the launch package (covers, videos, store text) is not started on purpose.

## Known bugs
| Id | Severity (P0-P3) | Description | Status |
|---|---|---|---|
| B1 | P2 | Template demo: save not flushed on tab hide | fixed in WP-10 (main.js marks the save dirty on hide) |
| B2 | P2 | A paused run cannot be resumed with P (a paused game does not step, so the key handler in update() never runs); click / tap on the overlay resumes | open on purpose (old game kept as it was); fix = commit 1ab9a22; harness: `pause-keys` WARN |
| B3 | P3 | Classic bolt: the ribbon pool (30 ribbons, 16 bolts) can run dry in 8-chain cascades, a few late hops show only their flash | open on purpose - the owner likes the classic look; a 60-ribbon x 17-point pool was prototyped (not committed) |
| B4 | P3 | Without WebGL the loading bar never ends and shows no message | open on purpose; fix = commit e7cbd85; harness: `no-webgl` WARN |
| B5 | P3 | `thunder` and `fail` peak at +2.3 / +3.3 dBFS after the SFX gain (Web Audio clips) | open until the owner has listened; fix = limiter in commit 926cb82 |
| B6 | P3 | After a WebGL context loss + restore the picture is ~10% darker | open on purpose; fix = restore handler in commit e7cbd85 |

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
| 2026-10-01 | Scope of the polish session: the game itself, no covers / videos / store text | owner: "just the game not the files for now" | launch package now |
| 2026-10-01 | Keep the classic glow bolt untouched; build a second outlined ("toon") bolt for comparison | owner: "i like how the bolt looks in the game actually so dont delete the version there is now, make a new and i will tell you which is better" | replacing the bolt |
| 2026-10-02 | Revert all look / sound / UI changes of 2026-10-01/02 to the 2026-09-28 game (`d575418`); the toon bolt, bright light, docked dialogs, candy roofs, audio limiter and playtest switches stay in git history only. Only QA-only hooks remain in src/ | owner: "the old version of the game was good make it like it was only make the Full browser-QA harness green + crazygames-qa audit of the game" | keeping the polish; A/B playtest |
| 2026-10-02 | Real defects found in the old game (P cannot resume, no WebGL message, loud sounds, darker picture after context restore) are left unfixed and reported as WARN with the fix commit named | the owner asked for the game unchanged; the fixes are tiny and can be applied on request | silently fixing them; hiding the scenarios |
