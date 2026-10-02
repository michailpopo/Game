# Storm Grid - handoff for the next chat (2026-10-02, late)

Read this file first. It replaces reading the long history. Only open other docs at the sections named below.

## 1. What this is

**Storm Grid** is an original 3D hypercasual browser game for **CrazyGames** (three.js r186 + Vite, HTML5), built
with the `game-studio` skill (planner + specialist agents) and checked with the `crazygames-qa` skill.

- **Verb:** hold anywhere to charge a storm, release to strike. The bolt hits the rooftop antenna you aimed at and
  hops from roof to roof, forking (1 -> 2 -> 4 -> 8 bolts). Every building it touches floods from calm grey-blue to a
  bright candy colour and pays "+N" coins. Whole district lit = "BLOCK POWERED" bonus.
- **Charge:** fills in 1.2 s. SUPERCHARGE band 80-95% = two bolts + guaranteed fork. Holding past 100% fizzles.
- **Run:** 3 strikes per city (upgradable to 6). Result = % powered -> jackpot plates x2 (60%, city cleared), x3 (80%),
  x5 (95%), x10 FULL POWER (100%) -> Claim / Claim x3 (rewarded) -> Next city. Cities never end (themes cycle).
- **Meta:** 5 upgrades (Voltage, Fork, Strikes, Capacitor, Gold rods), 12 bolt skins, daily gift.
- **Ads (7 rewarded surfaces, all capped, all with a coin path):** Claim x3, One more strike (revive analogue, once per
  session, only at 85-99%), Supercharged start (+2 strikes), Free upgrade, Shop cash (+22%), Try a bolt, Daily gift x2.
  Midgame on Next city / Retry from city 4. Everything works with ads off and with an ad blocker.
- Single player, desktop + mobile (landscape + portrait), mouse / touch / Space + arrows/WASD (event.code). Click-to-
  target, so no pointer lock is needed (CG-QUAL-008 "click-on-UI"). Bundle 0.8 MB, 6 files, 0.22 MB to first gameplayStart.
- Full numbers: `docs/GAME_BRIEF.md` (source of truth). The game was renamed Storm Grid because "Volt City" is a Volt
  Casino game (a web search on 2026-10-01 again found no game called "Storm Grid" on Steam / itch / CrazyGames / Poki).

## 2. The owner's wishes (keep these - they decided every turn)

- Goal: "a game for CrazyGames that is simple yet it will make me money" - **upload-ready**.
- Benchmark = very popular HTML5 games (Cubes 2048.io 128k likes), not games with ~1.6k likes. "Not that hard to make."
- Must be **original**, **dopamine hitting** and **3D**. Look: "the UI looks great" (keep it); the city must **not look
  AI-generated** (toy city, WP-21). "Do not overcomplicate things."
- Always use the **CrazyGames QA** skill. The owner prefers short updates; writes German or English.
- **2026-10-02: "the old version of the game was good, make it like it was, only make the Full browser-QA harness green +
  crazygames-qa audit of the game."** -> The game is the 2026-09-28 version (commit `d575418`) again: classic glow bolt, dusk look,
  centred dialogs, original sounds. **Do not change how it looks, sounds or plays unless the owner asks.** The only code
  differences to `d575418` are two QA-only hooks in `src/main.js` (`?qa=1&renderEvery=`, `loopFrames` in the QA state).
  (2026-10-01 they had also asked for the classic bolt to stay while a new one was built - that A/B is now moot.)
- 2026-10-01 scope: "just the game, not the files for now" -> no covers / preview videos / store text yet (WP-13 stays todo).

## 3. Status per package

| Package | What | Status |
|---|---|---|
| WP-20 / WP-21 | Premium look kit; toy-city restyle | done |
| WP-30 | 3D core (generator, charge/strike, hop/fork chain, plates, result) | done |
| WP-31 | Toy city + bolts + juice + ZzFX sounds in the real game | done |
| WP-32 | Shop, upgrades, 12 skins, 7 offers, daily gift, midgame, save | done |
| WP-QA | Full browser-QA harness green + crazygames-qa audit of the game | **done 2026-10-02: `docs/CG_QA_AUDIT.md`** - harness 27 checks 0 FAIL / 2 WARN (known issues), soak 20 cities PASS, 43/53 mandatory PASS, 0 FAIL |
| WP-13 | Launch package: covers x3, preview videos x2, store text, portal checklist | **todo - the owner said "not for now"** |

What the 2026-10-01/02 session did, and what it undid:

1. **The failing scenarios at the 2026-09-28 baseline (9 FAIL) were harness / environment problems, not game bugs.** The container
   renders WebGL in software (0.3-1.2 s per frame), a crashed scenario left its browser page running (CPU starved the next
   scenarios), and `ads-fill` used sleeps. Fixes only in `tools/qa/browser-qa.mjs`: every scenario closes its contexts;
   logic / UI scenarios run in **lite mode** (`?quality=low&renderEvery=1500`, the 3D scene is drawn once per 1.5 s, the sim runs in
   real time); `ads-fill` reads the audio / overlay state at each SDK ad event; poly-budget runs at the `high` tier. New scenarios:
   `input-strike`, `context-loss`, `no-webgl`, `cpu-cost`, `pause-keys`. New tools: `tools/qa/shoot.mjs` (stills / filmstrip),
   `tools/qa/soak.mjs` (N cities with key mashing, pauses, resizes), `tools/qa/manual-evidence.sh` (re-records the manual
   evidence for a build).
2. **Look / sound / UI polish that the owner did NOT want - reverted, kept in git history only:** the outlined "toon" bolt
   (`d93d18d`, `src/fx/toon-bolts.js`), bright lighting + docked result / shop dialogs + candy roofs + lighter veils + playtest A/B
   switches (`e7cbd85`, `aa11079`), audio limiter + peak ceiling (`926cb82`), coin ticks, sound-check panel. `src/` is
   `d575418` plus the two QA hooks. The hosted playtest artifact (https://claude.ai/artifact/6qMB926NNgDDVKyFijJXQ8) still shows
   that reverted variant - it is NOT the game that ships; unpublish it from the artifact page if it confuses.
3. **Known issues left in the game on purpose** (the owner asked for the old game unchanged; each has a ready fix in git, the harness
   reports them as WARN, see `KNOWN_ISSUES` in `tools/qa/browser-qa.mjs` and the WARNING list in `docs/CG_QA_AUDIT.md`):
   - **P pauses a run but cannot resume it** (click / tap can) - fix `1ab9a22`, ~3 lines in `src/main.js`. A CrazyGames reviewer may press P twice.
   - **No WebGL -> endless loading bar, no message** - fix `e7cbd85` (`boot().catch`).
   - **`thunder` (every strike) and `fail` clip** (+2.3 / +3.3 dBFS after the SFX gain) - fix `926cb82` (limiter in `src/core/audio.js`). Decide after the owner has listened.
   - After a WebGL context loss + restore the picture is ~10% darker - fix: the restore handler in `e7cbd85` (`src/game/view.js`).
   - The coin count-up is silent (`coinTick` is defined but never played) - polish only, `aa11079`.
   To apply one: `git show <commit> -- src`, copy the hunk, rebuild, re-run the harness (the WARN turns PASS; delete its `KNOWN_ISSUES` entry).

## 4. What is left to be upload-ready (in this order)

1. **The owner plays the build on PC and phone** and **listens to the sounds** (nobody has heard them; Claude cannot), says what
   felt good / when they wanted to stop (Gate 2), and says which of the known issues in section 3 to fix (recommended: the
   first two, they are tiny and invisible; the audio limiter only if the strike boom sounds harsh).
2. **Launch package when the owner says so:** `npm run launch:covers` (1920x1080, 800x1200, 800x800), `npm run
   launch:video` (landscape + portrait, 15-20 s, no sound), `npm run launch:check`, fill `docs/STORE_METADATA.md`, portal
   checklist `<game-studio>/checklists/launch-checklist.md`, build the upload ZIP from `dist/`. Portal items that only
   the owner can do: enable **Progress Save**, set orientation **both**, test in the Developer Portal preview.
3. **The owner uploads** in the CrazyGames Developer Portal (Claude never logs in or submits). Basic Launch first is the
   usual path; ads only run at Full Launch.
4. Optional later: German / French / Spanish / Portuguese strings (only if the owner checks them), a music loop.

## 5. Environment gotchas (cloud container)

- Browser harness: always `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`. **Run exactly one browser job at a time** (4 cores,
  the software GPU process alone takes ~2). Never `npm run build` while a harness or screenshot job is running (it replaces
  `dist/` under the preview server). Start long jobs with `run_in_background` directly (not `cmd &` inside the command).
- Node scripts that fetch the web: `NODE_USE_ENV_PROXY=1`.
- WebGL renders in software: 0.3 s (low) / 0.5 s (medium) / 1.2 s (high) per frame at 1280x720. Judge looks by stills,
  budgets by draw calls / triangles (35 calls, 9.5k tris at the high tier), never by fps. Use the tools below.
- `qa/` is gitignored (screenshots, evidence). Python PIL is installed in the container for cropping / contact sheets.

Look and juice tools (`tools/qa/shoot.mjs`, `--serve --shots a,b --sizes 1280x720,450x800 --out qa/x`):
`ready ready-returning charge supercharge fork district mid result result-fail revive shop paused lit film`. `film` steps the deterministic capture mode at exactly 1/30 s per drawn frame (FILM_FROM / FILM_TO / FILM_EVERY env)
- the way to judge juice and bolts as a 30 fps player sees them. `--tweakFile x.js` runs JS in the page after boot
(`window.__GS_LOOK__`, `__GS_VIEW__`) for live look-dev without rebuilding. `tools/qa/soak.mjs` = N cities through the real
UI with key mashing, double clicks, pauses and resizes, logging heap / DOM / GPU memory.

## 6. Skills, agents, files

- Skills: `game-studio` and `crazygames-qa`. The studio agents are not installed in a fresh container
  (`node <game-studio>/scripts/install-agents.mjs`); this session did everything directly (cheaper, ~no agents).
- Docs to read (only these sections): `docs/GAME_BRIEF.md` (all), `docs/BUILD_PLAN.md` (package table + CrazyGames QA
  section), `docs/PROJECT_STATUS.md` (gates, decisions), `docs/CG_QA_AUDIT.md` (the audit), `docs/QA_REPORT.md` (the
  2026-10-01 section at the end; WP-20/21/30 notes; view API in the header of `src/game/sim.js`).
- Docs to SKIP: `docs/CONCEPTS.md` rounds 1-2, `docs/RESEARCH.md`, `docs/shelved/*`.
- Code map: `src/game/sim.js` (pure deterministic rules), `view.js` + `city-mesh.js` + `look.js` + `sfx.js`
  (presentation), `meta.js` + `offers.js` + `src/config.js` (`STORM`, `OFFERS`, economy), `src/main.js` (flow),
  `src/ui/ui.js` + `styles.css` (DOM UI), `src/platform/platform.js` (only file touching `window.CrazyGames`),
  `src/core/*` (ads, save, pause, gameplay events, audio, input, quality), `src/fx/*` (ribbons / fx-kit = the bolts).
- Git: repo `michailpopo/Game`, working branch `claude/peaceful-allen-pphssd` (pushed). No PR opened.

## 7. How to save tokens in the next chat

- Read this file + GAME_BRIEF; do not re-read the long docs or the conversation history.
- Small fixes directly; at most one specialist agent at a time with a tight brief.
- Run the slow browser harness once per package with `--only <scenarios>`, the full set once at the end.

## 8. QA at handoff (2026-10-02, build `1e4c4dd4a1d7` = the 2026-09-28 game + 2 QA hooks, container = software WebGL)

Full details: `docs/CG_QA_AUDIT.md` (audit report + evidence table), `COMPLIANCE_REPORT.md` (register view: 52 PASS, 0 FAIL,
11 UNVERIFIED, 2 PORTAL), `docs/PROJECT_STATUS.md` (gates, measurements). Results on this build: browser harness 27 checks,
**0 FAIL**, 2 WARN (the known issues P-resume and no-WebGL message), 3 "need eyes" (looked at); soak 20 cities PASS; sim-health,
policy-scan, licenses, poly, bundle PASS; dist 0.76 MB / 6 files; 0.22 MB to the first `gameplayStart`.

Commands: `npm run build`; `node tools/qa/sim-health.mjs --selftest`; `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node
tools/qa/browser-qa.mjs --serve`; `node tools/qa/soak.mjs --serve --cities 20`; then `bash tools/qa/manual-evidence.sh && node
tools/qa/report.mjs` (manual evidence is tied to the build, so re-run it after every build; look at `qa/shots/viewport-*.png` and
`ad-ui-*.png` again first and edit the lines if the look changed).

**First job for the next chat:** get the owner's answers (section 4 item 1). Do not touch the look, sounds or feel without their
word; do not start the launch package before they ask for it.
