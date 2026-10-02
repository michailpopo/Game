# Storm Grid - handoff for the next chat (2026-10-02)

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
- **2026-10-01, about the bolt: "i like how the bolt looks in the game actually so dont delete the version there is now,
  make a new and i will tell you which is better."** -> The classic bolt is untouched and still the default; a NEW outlined
  ("toon") bolt exists next to it; the owner will pick. **Do not touch the classic bolt code** (`src/fx/ribbons.js`,
  `src/fx/fx-kit.js`, the `classic` branch in `src/game/view.js`) until they have answered.
- 2026-10-01 scope: "just the game, not the files for now" -> no covers / preview videos / store text yet (WP-13 stays todo).

## 3. Status per package

| Package | What | Status |
|---|---|---|
| WP-20 / WP-21 | Premium look kit; toy-city restyle | done |
| WP-30 | 3D core (generator, charge/strike, hop/fork chain, plates, result) | done |
| WP-31 | Toy city + bolts + juice + ZzFX sounds in the real game | **done, verified 2026-10-02** (harness, screenshots, filmstrips) |
| WP-32 | Shop, upgrades, 12 skins, 7 offers, daily gift, midgame, save | **done, verified 2026-10-02** (ad-ui, shop, revive-offer, ads-* scenarios) |
| WP-QA | CrazyGames audit of the game | **done: `docs/CG_QA_AUDIT.md`** - 28 browser checks 0 FAIL, soak 20 cities PASS, 43/53 mandatory PASS, 0 FAIL; open = real devices, portal, owner's ears, covers / video / text |
| WP-13 | Launch package: covers x3, preview videos x2, store text, portal checklist | **todo - the owner said "not for now"** |

What the 2026-10-01/02 session did (all committed on `claude/peaceful-allen-pphssd`):

1. **The 3 failing scenarios were harness / environment problems, not game bugs.** The container renders WebGL in software
   (0.3-1.2 s per frame), a crashed scenario left its browser page running (CPU starved the next scenarios), and `ads-fill`
   used sleeps. Fixes in `tools/qa/browser-qa.mjs`: every scenario closes its contexts; logic / UI scenarios run in **lite
   mode** (`?quality=low&renderEvery=1500`, the 3D scene is drawn once per 1.5 s, the sim runs in real time); `ads-fill`
   reads the audio / overlay state at each SDK ad event; poly-budget runs at the `high` tier. `src/main.js` got the QA-only
   `renderEvery` flag. New scenarios: `input-strike` (mouse / Space+arrows / touch hold), `context-loss`, `no-webgl`,
   `cpu-cost`, `bolt-styles`.
2. **Look polish (the three items from the last handoff):** lit roofs / caps keep their candy colour (35-40% white mix cut to
   12-14%); the result, "So close" and shop panels **dock beside the lit city** (right edge in landscape, bottom in portrait)
   and the camera frames the city in the rest of the screen (`ui.js` `dialogInsets` -> `view.setSafeArea`), veils lighter;
   bolt skins recolour both bolt styles (checked); at most 2 video buttons per screen (ad-ui, shop).
3. **Audio:** a limiter + per-sound peak ceiling in `src/core/audio.js` (`thunder` peaked at +3 dBFS, i.e. it clipped);
   the coin count-up now ticks (`coinTick`, rising pitch, was defined but never played). The owner still has to audition.
4. **Robustness:** WebGL context-restore handler (rebuilds the lighting environment), a clear message when WebGL is missing.
5. **Bug found by the new soak test and fixed:** P paused a run but could not resume it (a paused game does not step, so the key
   handler in `update()` never ran; click / tap worked). Now handled in the window `keydown` listener; scenario `pause-keys`.
6. **Playtest A/B switches (see below).**

### PLAYTEST-ONLY switches - remove after the owner has picked

| Switch | Default | Alternative | How |
|---|---|---|---|
| Bolt | `classic` (glow bolt, the liked one) | `toon` (crisp outlined zig-zag + white flash, `src/fx/toon-bolts.js`) | key **B**, `?bolt=toon`, button with `?compare=1` |
| Light | `dusk` (current look) | `bright` (white key, strong fill; `brightBackdropFor` in `src/game/look.js`) | key **L**, `?look=bright` |
| Sound check | - | a panel with every sound once, through the real mixer | button "Sounds" with `?compare=1` |

The hosted playtest page (`node tools/launch/playtest-page.mjs` after `npm run build` -> `qa/playtest/index.html`, one
self-contained file, mock SDK inside so every ad surface is visible; never upload it) shows the buttons by default.
**Cleanup list once the owner answered:** `src/main.js` (B / L handlers, `swapBolt`, `swapLook`, compare + sound buttons,
`__PLAYTEST__`), `src/core/i18n.js` (`bolt_*`, `look_*`), `src/game/view.js` (`boltStyle`, `toon`, `#strikeToon`,
`#hopToon`, `#flash`, `lookStyle`, the `?bolt=` / `?look=` params; keep the winner only), `src/game/look.js`
(`brightBackdropFor`, `EXPOSURE` if dusk wins), delete `src/fx/toon-bolts.js` if classic wins, `tools/qa/browser-qa.mjs`
scenario `bolt-styles`. Comparison images: `docs/review/bolt-compare-2026-10-01.png`.

Known and left alone: with the classic bolt the ribbon pool (30 ribbons, 16 bolts) can run dry in 8-chain cascades, so a
few late hops show only their flash. Raising it (60 ribbons x 17 points = 1,920 tris, `MAX_BOLTS` 40, hop life 0.3 s) was
prototyped and works, but it changes the look the owner likes - ask first, then do it for the winner.

## 4. What is left to be upload-ready (in this order)

1. **The owner decides and plays:** bolt classic vs outlined, light dusk vs bright (button / key switches), plays the
   hosted playtest page on PC **and phone**, **auditions the sounds** with the Sounds panel (levels were only normalised by
   a limiter; nobody has heard them), says what felt good / when they wanted to stop (Gate 2).
2. **Cleanup** of the losing variants and switches (list in section 3), rebuild, re-run `node tools/qa/browser-qa.mjs
   --serve` (all scenarios, 0 FAIL) and `node tools/qa/soak.mjs --serve --cities 20`.
3. **Launch package when the owner says so:** `npm run launch:covers` (1920x1080, 800x1200, 800x800), `npm run
   launch:video` (landscape + portrait, 15-20 s, no sound), `npm run launch:check`, fill `docs/STORE_METADATA.md`, portal
   checklist `<game-studio>/checklists/launch-checklist.md`, build the upload ZIP from `dist/`. Portal items that only
   the owner can do: enable **Progress Save**, set orientation **both**, test in the Developer Portal preview.
4. **The owner uploads** in the CrazyGames Developer Portal (Claude never logs in or submits). Basic Launch first is the
   usual path; ads only run at Full Launch.
5. Optional later: German / French / Spanish / Portuguese strings (only if the owner checks them), a music loop.

## 5. Environment gotchas (cloud container)

- Browser harness: always `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`. **Run exactly one browser job at a time** (4 cores,
  the software GPU process alone takes ~2). Never `npm run build` while a harness or screenshot job is running (it replaces
  `dist/` under the preview server). Start long jobs with `run_in_background` directly (not `cmd &` inside the command).
- Node scripts that fetch the web: `NODE_USE_ENV_PROXY=1`.
- WebGL renders in software: 0.3 s (low) / 0.5 s (medium) / 1.2 s (high) per frame at 1280x720. Judge looks by stills,
  budgets by draw calls / triangles (35 calls, 9.5k tris at the high tier), never by fps. Use the tools below.
- `qa/` is gitignored (screenshots, evidence). Python PIL is installed in the container for cropping / contact sheets.

Look and juice tools (`tools/qa/shoot.mjs`, `--serve --shots a,b --sizes 1280x720,450x800 --out qa/x [--query bolt=toon]`):
`ready ready-returning charge supercharge fork district mid result result-fail revive shop paused lit boltlab boltlab-lit
film`. `film` steps the deterministic capture mode at exactly 1/30 s per drawn frame (FILM_FROM / FILM_TO / FILM_EVERY env)
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
  `src/core/*` (ads, save, pause, gameplay events, audio, input, quality), `src/fx/*` (ribbons / fx-kit = classic bolts,
  toon-bolts = the alternative).
- Git: repo `michailpopo/Game`, working branch `claude/peaceful-allen-pphssd` (pushed). No PR opened.

## 7. How to save tokens in the next chat

- Read this file + GAME_BRIEF; do not re-read the long docs or the conversation history.
- Small fixes directly; at most one specialist agent at a time with a tight brief.
- Run the slow browser harness once per package with `--only <scenarios>`, the full set once at the end.

## 8. QA at handoff (2026-10-02, final build `9e15b0b06a33`, container = software WebGL)

Full details: `docs/CG_QA_AUDIT.md` (audit report + evidence table), `COMPLIANCE_REPORT.md` (register view: 52 PASS, 0 FAIL,
11 UNVERIFIED, 2 PORTAL), `docs/PROJECT_STATUS.md` (gates, measurements). Results on this build: browser harness 28 checks,
**0 FAIL** (3 "need eyes" were looked at); soak 20 cities PASS; sim-health, policy-scan, licenses, poly, bundle PASS; dist 0.77 MB /
6 files; 0.22 MB to the first `gameplayStart`.

Commands: `npm run build`; `node tools/qa/sim-health.mjs --selftest`; `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node
tools/qa/browser-qa.mjs --serve`; `node tools/qa/soak.mjs --serve --cities 20`; then `bash tools/qa/manual-evidence.sh && node
tools/qa/report.mjs` (manual evidence is tied to the build, so re-run it after every build).

Playtest page for the owner: `node tools/launch/playtest-page.mjs` -> `qa/playtest/index.html`, published 2026-10-02 as the private
artifact https://claude.ai/artifact/6qMB926NNgDDVKyFijJXQ8 (build `9e15b0b06a33`; smoke-tested as a standalone page, not inside the
artifact viewer). After any change: rebuild, regenerate the page and publish the same file path again (keeps the URL). Never upload it
to CrazyGames.

**First job for the next chat:** get the owner's answers (section 4 item 1), then do the cleanup (item 2); do not start the
launch package before they ask for it.
