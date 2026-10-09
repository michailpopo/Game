# Project status - Storm Grid

Updated: 2026-10-08 · Project folder: /home/user/Game (repo michailpopo/Game, branch claude/amazing-carson-87o6sf)

## Where we are
- **Phase:** 3 Build - Storm Grid (3D). Handoff to a new chat on 2026-09-28: read HANDOFF.md first.
- **Current objective:** an original, dopamine-hitting game that looks premium, upload-ready this session.
- **2026-10-09:** the portal takes files, not a zip -> upload the contents of submission/storm-grid-build/; result-dialog scrollbar flash fixed (CSS only).
- **2026-10-08 evening: upload-ready again after the owner's playtest fixes** (cars, layout, music removed, 70% covers); `npm run qa` exit 0 on HEAD 88449bb, the build in submission/storm-grid-build/ (uploaded as files: the portal rejects zips).
- **Earlier (2026-10-08): upload-ready.** Launch-gate audit (`docs/CG_QA_AUDIT.md`): 42/45 mandatory PASS, 0 FAIL, 3 cannot verify (Edge, 4 GB Chromebook, CG-app safe areas), 3 warnings. `npm run qa` exits 0 on the final code (HEAD dfb2848, 22 browser checks). Launch package in `submission/`: 3 covers, 2 preview videos (18.6 s, silent), the upload zip; texts and portal settings in `docs/STORE_METADATA.md`. Fixed for it: W1 save fallback (B2), harness `persistence`/`ads-fill` (B3), frame peaks in big cities (<= 58k tris).
- **Also 2026-10-08 (playtest feedback 4):** background music removed again (owner: "good, but no need for it").
- **Also 2026-10-08 (playtest feedback 3):** music ~6.4 dB louder and brighter (later removed); cars obey traffic rules (one car per crossing, keep distance) - check-city `cars-apart` proves 0 overlaps.
- **Also 2026-10-08 (music):** background music written in code (src/game/music.js) - removed again the same day at the owner's wish.
- **Also 2026-10-08 (playtest feedback 2):** tighter city layout - the lot grid fits the buildings, so empty lots are the planned parks (cities 5-16 were 41-57% empty, now 3-16%). Pacing unchanged within noise.
- **Also 2026-10-08 (playtest feedback):** cars no longer shrink and pop at the plate edge; they drive random routes through the street grid and turn at crossings (owner: "looks cheap"). Upload zip, covers and videos re-made.
- **Also 2026-10-08:** at the end of a run the storm cloud (still never turning with the camera) glides over the city's centre, so it hangs over the city from every orbit angle (owner: "where it is over the city looks bad once the camera has turned"). Checked on landscape + portrait stills.
- **Also 2026-10-07 (evening):** recorded CC0 sounds (Kenney) replace the synth sounds (ZzFX stays as fallback; owner must audition); progression rebalanced: upgrades max after ~1.6-2 h instead of 6-7 min, 79 upgrade levels, rising clear threshold, difficulty ramp to city 70, endless slow progress after (tools/qa/economy-sim.mjs).
- **Also 2026-10-07 (later still):** the cloud stays fixed in the world while the camera circles the finished city (owner's request; camera unchanged); the cloud mesh is closed all round for that. Browser-verified (win + fail).
- **Also 2026-10-07 (later):** the cloud kept smooth but built from far fewer, bigger lobes (owner: "smooth, just not so many circles"); a faceted low-poly try was rejected by the owner. Waiting for the owner to look.
- **Also 2026-10-07:** the storm cloud's form reworked (owner: "just the form of the cloud"): one smooth cumulus (metaball field + surface nets) instead of 25 instanced spheres; colours, flicker, flash, size and position unchanged. It is the one hero geometry (<= 4,670 tris of 5,000); frames <= 55.7k tris, <= 44 calls. Waiting for the owner to look.
- **Also 2026-10-04 (night):** Sky Port is a city on a floating island above a sea of clouds (islets with trees, hot-air balloons, an airship; `src/game/sky.js`), owner's request; 43 draw calls, <= 55.0k tris/frame on cities 36-40. A mouse press now keeps its building as the target until release (`main.js`), browser-verified. Waiting for the owner to look.
- **Also 2026-10-04 (late):** z-fighting fixed on all maps (layer heights, snow caps, roads, parks, lane dashes, fountain); `check-city.mjs` guards it per theme.
- **Also 2026-10-04 (evening):** toy thunderhead cloud, city life (parks, benches, lamps, walking people, driving cars) and a finished world around every theme (fields, hills, roads, windmills, mountains, desert, cloud banks, boats): `storm-cloud.js`, `city-life.js`, `scenery.js`. <= 44 draw calls, <= 51.4k tris/frame. Waiting for the owner to look.
- **Also 2026-10-04 (water):** toy water shader for the island themes (`src/game/water.js`: shallow gradient, beach foam, waves rolling in, soft crests; 1 draw call, distance field once per city). Waiting for the owner to look.
- **Also 2026-10-04 (later):** the city's island is now a square that follows the city, islets are round and irregular (`src/game/islands.js`), owner's request.
- **Also 2026-10-04:** water themes (Harbour, Neon Bay) stand on islands with beaches and islet trees instead of trees on open water (`planIslands` in `city-mesh.js`, guard in `tools/qa/check-city.mjs`). Waiting for the owner to look.
- **Also 2026-10-02:** buildings that touched or intersected (from city 3) now keep >= 1.0 m of air between roof caps (`clearFootprints` in `sim.js`, guard `tools/qa/check-city.mjs`). Waiting for the owner to look.
- **Next action (one concrete step):** the owner uploads (HANDOFF.md section 4): the files in submission/storm-grid-build/ by drag and drop (no zip) + texts + covers + videos, Progress Save ON; then plays the portal preview in Edge and on a phone and auditions every sound.
- **Waiting on the user:** the upload and the portal preview; then CrazyGames' QA feedback.

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
| 8 QA & compliance | READY FOR REVIEW | 2026-10-08 | `docs/CG_QA_AUDIT.md` launch gate: 42/45 PASS, 0 FAIL, 3 cannot verify (need hardware/portal); `npm run qa` exits 0 |
| 9 Launch package | READY FOR REVIEW | 2026-10-08 | `submission/` covers x3 + videos x2 (`launch:check` PASS) + the build folder storm-grid-build/; `docs/STORE_METADATA.md`; the owner uploads |
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
| Bytes to first gameplayStart | 0.25 MB | 2026-10-07 | browser-qa boot |
| Total dist size / files | 0.94 MB / 20 files | 2026-10-08 | check-bundle |
| p95 frame time @4x CPU throttle | | | browser-qa performance |
| Draw calls / triangles in play | city 1: 43 calls / 21.5k tris; city 55: 45 calls / 56.6k tris (budget 60 / 60,000; one-off shadow re-bake frame 64.7k) | 2026-10-08 | browser-qa poly-budget (software GL) |
| Compliance verdict | launch gate: 42/45 mandatory PASS, 0 FAIL, 3 cannot verify; `npm run qa` exit 0 | 2026-10-08 | CG_QA_AUDIT.md, COMPLIANCE_REPORT.md |
| Docs freshness | CHANGED: cg-technical, cg-sitelock; technical page body identical to the 10-02 copy, no effect (audit W5); register not bumped | 2026-10-07 | check-docs-freshness.mjs |

## Top 3 problems (reorder after every playtest)
1. No owner playtest of the new pacing and no audition of the recorded sounds yet (Claude cannot hear).
2. Not run on Edge, a Chromebook or inside the CrazyGames app (audit CANNOT VERIFY); the portal preview is the first chance.
3. Economy numbers are simulated players (`tools/qa/economy-sim.mjs`) until real players.

## Known bugs
| Id | Severity (P0-P3) | Description | Status |
|---|---|---|---|
| B1 | P2 | Template demo: save not flushed on tab hide | fixed in WP-10 (main.js marks the save dirty on hide) |
| B2 | P2 | Data module off (Progress Save not ticked in the portal): progress is written to localStorage but never read back, the game boots from defaults (`src/core/save.js`; audit W1; reproduced) | fixed 2026-10-07 (`save.js` re-picks localStorage; `persistence` proves it) |
| B5 | P3 (test tool) | `mute-priority` kept page 1 open while page 2 booted (2 of 4 full runs failed); shop Try-it raced the SDK init on a starved host | fixed 2026-10-08 (`e23b213`, `88449bb`); full run exit 0 |
| B4 | P3 (test tool) | Harness timing on a slower host: result dialog ~8 s vs an 8 s limit, a crashed scenario's page starved the rest (16 cascading FAILs); `revive-offer` slept 1.3 s against a frame-time countdown | fixed 2026-10-08 (`dfb2848`: crashed pages closed, 30 s game-time waits, countdown polled; full run exit 0) |
| B3 | P3 (test tool) | `browser-qa` `persistence` leaks two WebGL pages and starves later scenarios; `ads-fill` uses fixed sleeps. The game is correct in both (audit "Test-tool findings") | fixed 2026-10-07 (one page at a time; event-ordered ads-fill) |

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
| 2026-10-08 | No background music (removed after a try) | owner: "music is good but remove it, no need for it" | keeping the coded loop with its toggle |
| 2026-10-08 | Background music composed in code and rendered at runtime (later removed) | owner picked it over a track the owner downloads or an AI-generated one; no music site but kenney.nl (jingles only) is reachable from the container; zero download size | a downloaded CC0 track (owner would have to fetch it), AI music (credits, licence) |
| 2026-10-08 | City = square G x G lot grid fit to N and the park share, districts 2-4 lots wide | owner: empty squares look bad; measured 41-57% empty lots in cities 5-16 from rounding up whole square districts; a fitted grid keeps the square plate (islands, sky island, scenery unchanged) | rectangular cities (would need scenery/islands/sky changes), decorative fillers on empty lots (owner picked the layout fix) |
| 2026-10-08 | Held storm cloud glides over the city centre at run end (no turning) | owner: the fixed cloud hung beside the city once the camera had turned; a cloud over the centre looks the same from every orbit angle and still never spins with the camera | turning the cloud with the camera again (rejected by the owner on 10-07), leaving it behind the city |
| 2026-10-08 | Covers hold the last strike and hops on screen; preview cuts to a 2nd city after the win | a still without lightning does not show the game; 10 s of orbiting a finished city is dead air in an 18 s clip | screenshots of a random frame; a longer orbit |
| 2026-10-07 | Recorded CC0 sounds (Kenney) with ZzFX fallback | owner: "better sounds, find free ones"; Kenney is CC0 and the only sound site the container can reach; a fallback keeps audio instant while files load | Freesound (needs a login), Pixabay/Mixkit (custom licenses, blocked), more ZzFX tuning (the owner wants real sounds) |
| 2026-10-07 | Longer progression: 79 finer upgrade levels, two-phase prices, rising clear threshold 60->70%, ramp to city 70, coins +4%/city | owner maxed everything in minutes; measured: maxed at 6-7 min, wall at city ~37 by min 15; now maxed at ~1.6-2 h and endless slow progress | raising max power (8 strikes, 10 rods: every city cleared forever, coins explode), a flat 0.8 pass mark (hard wall at city ~68), uncapped upgrades |
| 2026-10-07 | Storm cloud as one metaball surface (surface nets), the project's one hero geometry (<= 5,000 tris) | owner: work on the cloud's form until it looks good; separate spheres read as dark pillows with seams and faceted outlines; one blended surface gives round lobes, soft crevices and a clean silhouette; hero budget is in project.json already (no budget raised) | more/finer instanced spheres (still seams), three.js MarchingCubes (cube grid wastes resolution on a wide, flat cloud), rays from one centre or a tube of slices (spikes on the stepped shape), a cap lobe on top (mushroom look) |
| 2026-10-04 | Sky Port = city on a floating island over a cloud sea, with a near-vertical cliff band | owner: "make Sky Port better"; the old flat cloud banks on a blue field did not say "sky"; the camera looks steeply down, so a tapering underside is invisible edge-on and only a steep cliff under the rim shows | flat cloud banks (old), a fully tapered rock cone (invisible from the game camera), extra waterfalls (needs a shader, not asked) |
| 2026-10-04 | Dress every map: city life + per-theme scenery, all instanced and capped | owner: "all maps should look finished and not so plain", wants driving cars, people, benches, parks, a better cloud | loading model packs (download size, licences), one generic scenery for every theme |
| 2026-10-04 | Stylised water from a shore distance field, not three.js Water/Water2 | owner asked for three.js water in the game style; the examples' Water (reflection render target) and Water2 (reflection + refraction) render the scene again every frame and look realistic, not toy; a distance field is exact here because the islands are known shapes | three.js Water.js / Water2.js, a depth pre-pass for foam, a displaced 72x72 wave grid (over the 2,000-triangle geometry budget) |
| 2026-10-04 | Islands for the water themes, built new (never existed in git) | owner: "in some version before there were islands and no trees on water, that doesn't make sense, bring back the islands"; trees on a flat sea read as a bug | keeping the tree ring and recolouring the field; making the whole sea land |
| 2026-10-02 | Fix touching buildings by trimming footprints, not by moving lots | owner: "some of the buildings almost stand in each other"; footprints are look only, so the hop graph and the economy stay as tuned; measured 220 touching pairs before, 0 after (`tools/qa/check-city.mjs`) | reducing lot jitter (changes hop distances), fewer buildings |
| 2026-10-02 | Audit before fixing: wrote the report, applied no code changes | owner asked to check the game against the CrazyGames requirements; fixes (B2, B3) wait for the owner's go | fixing while auditing |
| 2026-09-28 | Stopped both specialists and wrote HANDOFF.md | owner wants to continue in a new chat to save context tokens; the account hit its usage limit twice | keep agents running here |
