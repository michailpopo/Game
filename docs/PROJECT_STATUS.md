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
| 3 Vertical slice | READY FOR REVIEW | 2026-10-02 | whole loop plays in the real UI (soak: 20 cities with key mashing / pauses / resizes, no errors); waiting for the owner's play and ears |
| 4 Gameplay quality | READY FOR REVIEW | 2026-10-02 | sim-health selftest PASS (deterministic, step-size drift 0%); dead-air longest silence 0.6 s; economy still model numbers until a human playtest |
| 5 Content & polish | READY FOR REVIEW | 2026-10-02 | candy roofs, docked dialogs, limiter + coin ticks, two bolts and two lights to pick from (owner decides); sounds never auditioned |
| 6 Platform integration | PASS (mock SDK; portal preview still the owner's) | 2026-10-02 | browser-qa sdk-events, no-sdk, sdk-disabled, sdk-init-hang, ads-*, adblock, mute-priority, tab-hidden, persistence all PASS |
| 7 Performance | READY FOR REVIEW (proxies only) | 2026-10-02 | 8.7k tris / 35 calls (high tier), 3.9 ms/frame script+style+layout at 4x CPU throttle, 0.77 MB; no real low-end device measured |
| 8 QA & compliance | READY FOR REVIEW | 2026-10-02 | `docs/CG_QA_AUDIT.md`: 0 FAIL in the automated run; open = real devices, portal, owner's ears, store assets |
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
| Total dist size / files | 0.77 MB, 6 files | 2026-10-02 | check-bundle |
| Main-thread cost per frame @4x CPU throttle | 3.9 ms (script 2.3 + style 1.4 + layout 0.25), 3D draw excluded; budget 16.7 ms | 2026-10-02 | browser-qa cpu-cost (a proxy: software WebGL cannot give real frame times) |
| Draw calls / triangles in play | max 35 calls / 8.7k tris over 12 s at the high tier (budget 60 / 60k) | 2026-10-02 | browser-qa poly-budget |
| Compliance verdict | see `COMPLIANCE_REPORT.md` / `docs/CG_QA_AUDIT.md` (0 FAIL; open items are device / portal / owner / store assets) | 2026-10-02 | report.mjs |
| Docs freshness | register 2026.09.11 (review due 2026-11-11 - re-check the CrazyGames docs before submitting) | 2026-10-02 | requirements.json meta |
| Soak (20 cities, abuse) | PASS: heap 11 -> 13 MB, DOM 327 -> 287, geometries 19 -> 19, textures 4 -> 4, no console errors | 2026-10-02 | tools/qa/soak.mjs |

## Top 3 problems (reorder after every playtest)
1. The owner has not played the final build or heard the sounds: bolt (classic vs outlined) and light (dusk vs bright) are undecided; sound levels were only limited, never auditioned.
2. Nothing was measured on a real low-end device (4 GB Chromebook, phone) or in the Developer Portal preview (Progress Save, orientation, safe areas, iOS audio) - only proxies in a software-rendered container.
3. Economy numbers are model numbers (Monte Carlo) until a human playtest; the launch package (covers, videos, store text) is not started on purpose.

## Known bugs
| Id | Severity (P0-P3) | Description | Status |
|---|---|---|---|
| B1 | P2 | Template demo: save not flushed on tab hide | fixed in WP-10 (main.js marks the save dirty on hide) |
| B2 | P2 | A paused run could not be resumed with P (a paused game does not step, so the key was never read); click / tap worked | fixed 2026-10-02 (key handler in main.js; browser-qa `pause-keys`; found by the soak test) |
| B3 | P3 | Classic bolt: the ribbon pool (30 ribbons, 16 bolts) can run dry in 8-chain cascades, a few late hops show only their flash | open on purpose - the owner likes the classic look; fix prototyped (HANDOFF section 3), ask first |

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
| 2026-10-01 | Keep the classic glow bolt as the default and untouched; build a second outlined ("toon") bolt next to it | owner: "i like how the bolt looks in the game actually so dont delete the version there is now, make a new and i will tell you which is better" | replacing the bolt |
| 2026-10-02 | Playtest switches (bolt, light, sound check) work only on the hosted playtest page or with `?compare=1`; they are removed once the owner picks | a player must never flip the look by accident | always-on hotkeys |
| 2026-10-02 | Limiter + per-sound peak ceiling in the mixer instead of re-tuning every sound by ear | `thunder` peaked at +3 dBFS (clipped); Claude cannot hear, the owner will audition | rewriting the sounds blind |
