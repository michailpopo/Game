# Storm Grid - handoff for the next chat (2026-10-15)

Read this file first. It replaces reading the long history. Only open other docs at the sections named below.

## 1. What this is

**Storm Grid** is an original 3D hypercasual browser game for **CrazyGames** (three.js r186 + Vite, HTML5), built
with the `game-studio` skill (planner + specialist agents) and checked with the `crazygames-qa` skill.

- **Verb:** hold anywhere to charge a storm, release to strike. The bolt hits the rooftop antenna you aimed at and
  hops from roof to roof, forking (1 -> 2 -> 4 -> 8 bolts). Every building it touches floods from calm grey-blue to a
  bright candy colour and pays "+N" coins. Whole district lit = "BLOCK POWERED" bonus. Look (since 2026-10-15): a
  blacked-out toy city at NIGHT under a storm - the lightning and the lit windows are the light sources.
- **Charge:** fills in 1.2 s. SUPERCHARGE band 80-95% = two bolts + guaranteed fork. Holding past 100% fizzles.
- **Run:** 3 strikes per city (upgradable to 6). Result = % powered -> jackpot plates x2 (60%, city cleared), x3 (80%),
  x5 (95%), x10 FULL POWER (100%) -> Claim / Claim x3 (rewarded) -> Next city. Cities never end (themes cycle).
- **Meta:** 5 upgrades (Voltage, Fork, Strikes, Capacitor, Gold rods), 12 bolt skins, daily gift.
- **Ads (7 rewarded surfaces, all capped, all with a coin path):** Claim x3, One more strike (revive analogue, once per
  session, only at 85-99%), Supercharged start (+2 strikes), Free upgrade, Shop cash (+22%), Try a bolt, Daily gift x2.
  Midgame on Next city / Retry from city 4. Everything works with ads off and with an ad blocker.
- Single player, desktop + mobile (landscape + portrait), mouse / touch / Space + arrows/WASD (event.code). Click-to-
  target, so no pointer lock is needed (CG-QUAL-008 "click-on-UI"). Bundle ~0.8 MB.
- Full numbers: `docs/GAME_BRIEF.md` (source of truth). Concept text: `docs/CONCEPTS.md` section
  "T1 - Volt City" (~line 850) and "Round 3 decision" (end of file) - the game was renamed Storm Grid because
  "Volt City" is a Volt Casino game.

## 2. The owner's wishes (keep these - they decided every turn)

- Goal: "a game for CrazyGames that is simple yet it will make me money" - **upload-ready**.
- Benchmark = very popular HTML5 games (Cubes 2048.io 128k likes), not games with ~1.6k likes. "Not that hard to make."
- Must be **original** (not a copy - Comet Chain was rejected as a Cubes 2048.io copy that "looks shit").
- Must be **dopamine hitting** and **3D** ("It must be 3d game").
- Look: "the UI looks great" (keep it). The city must **not look AI-generated** - take inspiration from popular HTML5
  games (Holey.io, Slice Master, Cubes 2048.io, Paper.io 2, Harvest.io...). "Do not overcomplicate things."
- Always use the **CrazyGames QA** skill (build mode in every package, audit report at the gates).
- The owner prefers short updates; writes German or English.

## 3. Status per package (see docs/BUILD_PLAN.md for the table)

**2026-10-15: CrazyGames REJECTED the first submission (13.10.2026)** - "The overall quality of the game does not yet
meet the expectations of our platform." The quality pass in this session answers that: read `docs/QUALITY_PASS.md`
(what the reviewer most likely saw, the guideline -> change table, evidence).

| Package | What | Status |
|---|---|---|
| WP-20 / WP-21 / WP-30 | Look kit, toy-city kit, 3D core | done, verified |
| WP-31 | Look + juice + sounds wired into the game | done in the quality pass (night look below), verified by screenshots + harness |
| WP-32 | Shop, upgrades, skins, 7 offers, daily gift, midgame, save | done; harness scenarios in section 8 |
| **WP-40 (new)** | **Quality pass after the rejection**: night-storm look matching the store cover (dark city, glowing windows, streetlights per powered block, rain, sheet lightning, sky/rig flash + bolt light per strike, 8 night themes); onboarding hand (hold -> let go) + guaranteed SUPERCHARGE first strike + longer hops in city 1 + coach floats; HUD with GOAL / x3 / x5 labels and pops, city chip instead of the stats box; procedural music (calm/run layers) + rain + distant thunder + master limiter; clipping sounds lowered; loading screen with the title | **done, verified** (section 8) |
| WP-13 | Launch package: covers x3, preview videos x2, store text, portal checklist | todo (new covers should show the new look) |
| WP-QA | CrazyGames QA audit report `docs/CG_QA_AUDIT.md` | todo |

Bugs found and fixed in the quality pass (all verified):
- `src/core/loop.js`: a negative frame time after a long main-thread block froze the simulation for seconds (and fed a
  negative fps to the quality governor) - now clamped at 0.
- Never use `renderer.compileAsync` here: without `KHR_parallel_shader_compile` three r186 polls forever (10 ms timer)
  and starves the game. Boot uses a synchronous `renderer.compile` behind the boot screen.
- `tools/qa/browser-qa.mjs`: a crashed scenario left its page rendering and starved every later scenario (the
  "cascade" at the 09-28 handoff) - contexts now always close; timeouts sized for software GL; Linux GPU flags.
- ads-fill was a timing artefact of the slow renderer (the mute IS on `adStarted`); the scenario now uses 4 s ads.

New tools: `node tools/balance/naive-players.mjs [cities] [runs]` (pass rates of tappers / 1-s holders / random /
skilled per city), `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/audio-levels.mjs` (renders every
sound + the music offline, FAILs on clipping or a music bed that is not >= 6 dB under the effects).

## 4. What is left to be upload-ready (in this order)

1. **Owner playtest + audition (Gate 2):** publish `dist/` as a private page or run `npm run dev -- --host`. Claude
   cannot hear: listen to the NEW music loop (calm on menus, a rhythm layer during strikes), the rain, the distant
   thunder, the re-levelled strike thunder, plus the old set (charge hum, supercharge ding, hop crackle ladder, fork
   zap, block chord, full-power fanfare, coin ticks, click). Ask: what did you try first, when did it get fun.
2. **Launch package:** `npm run launch:covers` renders covers from the real game (1920x1080, 800x1200, 800x800) in the
   new night look - compare with the owner's current cover and pick; `npm run launch:video` (landscape + portrait);
   `npm run launch:check`; `docs/STORE_METADATA.md`.
3. **crazygames-qa audit** into `docs/CG_QA_AUDIT.md` (run `NODE_USE_ENV_PROXY=1 node <game-studio>/scripts/docs/check-docs-freshness.mjs` first).
4. **The owner re-submits** in the Developer Portal (Claude never logs in or submits). Suggested note to the
   reviewers: "Reworked after the quality feedback: night-storm look that matches the cover, in-game onboarding
   (animated hold/release hand, guaranteed first supercharge), clearer goal on the meter, music and ambience."

## 5. Environment gotchas (cloud container)

- Browser harness: always `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` (template pins Playwright 1.63; the container has
  Chromium 1194; the launch calls in `tools/qa/browser-qa.mjs`, `tools/launch/*.mjs` read that env var).
- Node scripts that fetch the web: `NODE_USE_ENV_PROXY=1` (Node fetch ignores HTTPS_PROXY otherwise).
- Allowed hosts (owner set them): crazygames.com, docs/sdk/api/builds/imgs/videos.crazygames.com,
  `<slug>.game-files.crazygames.com`, poki.com, youtube.com. Everything else may be blocked.
- WebGL renders in software here (1-9 fps): judge looks by still frames and budgets by draw calls/triangles, not fps.
  The simulation runs ~4x slower than real time, so stage screenshots on SIM conditions (`__GS_QA__.freezeWhen`,
  poll `state.charge`), never on wall-clock waits. Boot takes 8-15 s here (shaders compile on the CPU).
  A full harness run takes 30-60 minutes: run it in the background and do NOT `npm run build` or start other browsers
  meanwhile (a rebuild swaps dist/ under the running pages; parallel browsers starve it into timeouts).
- `pkill -f "<pattern>"` kills your own shell when the pattern is in the same command line (exit 144): look up PIDs
  with `ps` first and `kill` them in a separate command.
- On a local Windows PC: `npm install`, then `npm run dev` (http://127.0.0.1:5173/?qa=1) - no env vars needed.
- The account hit its **usage limit twice** in this session (agents are expensive). See section 7.

## 6. Skills, agents, files

- Skills: `game-studio` (workflows/, checklists/quality-gates.md, references/) and `crazygames-qa` (SKILL.md +
  references/). In a new cloud session install the studio agents once:
  `node <game-studio>/scripts/install-agents.mjs` (they load in the NEXT session; otherwise run a general-purpose agent
  that reads `~/.claude/agents/<name>.md`).
- Docs to read (only these sections): `docs/GAME_BRIEF.md` (all), `docs/BUILD_PLAN.md` (package table + CrazyGames QA
  section), `docs/PROJECT_STATUS.md` (gates, decisions), `docs/QA_REPORT.md` (WP-20/21/30 notes; the view API is in
  the header of `src/game/sim.js`, the look-kit API in the headers of `src/render/look.js`, `city-kit.js`,
  `src/fx/fx-kit.js`).
- Docs to SKIP (history, long): `docs/CONCEPTS.md` rounds 1-2 and `docs/RESEARCH.md` except "Hit list: popular and
  simple"; `docs/shelved/*` (Skip Legend, Comet Chain briefs).
- Code map: `src/game/sim.js` (pure deterministic rules), `view.js` + `city-mesh.js` + `look.js` + `sfx.js`
  (presentation), `meta.js` + `offers.js` + `src/config.js` (`STORM`, `OFFERS`, economy), `src/main.js` (flow),
  `src/ui/ui.js` + `styles.css` (DOM UI), `src/platform/platform.js` (only file touching `window.CrazyGames`),
  `src/core/*` (ads, save, pause, gameplay events, audio, input, quality).
- Code map additions (quality pass): `src/game/music.js` (music + rain + rumble), `src/fx/rain.js`,
  `src/render/look.js` `setFlash`, `docs/QUALITY_PASS.md`, `tools/balance/naive-players.mjs`, `tools/qa/audio-levels.mjs`.
- Git: repo `michailpopo/Game`, branch `claude/game-quality-standards-809ss0` (quality pass, pushed; it continues
  `claude/festive-darwin-7ukgnb`). No PR opened.

## 7. How to save tokens in the next chat

- Read this file + GAME_BRIEF; do not re-read the conversation history or the long docs.
- Prefer doing small fixes directly; use at most one specialist agent at a time, with a tight brief and "be
  economical: no extra iterations". Agents burned ~500k tokens each per package here.
- Run the slow browser harness once per package with `--only <scenarios>`, not the full set every time.

## 8. Browser QA at handoff (2026-10-15, after the quality pass)

Full harness (`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/browser-qa.mjs --url http://127.0.0.1:4173/`,
with `vite preview` running): **17 PASS, 2 FAIL, 3 UNVERIFIED** - and both FAILs were then fixed and re-run alone:
- `revive-offer` FAIL -> the countdown ran on the game's capped frame time, so at 1-2 fps it crawled. The countdown
  now uses real seconds (`src/ui/ui.js` `tickCountdown`). Re-run: **PASS** (ring 5 -> 4, expires without an ad request,
  once per session).
- `persistence` FAIL in the full run only (Claude's click on Claim timed out at 30 s while the dialog drew at 1-2 fps;
  PASS when run alone). Click timeout raised to 60 s; re-run: **PASS** (reload keeps level 2 / 470 coins via the Data
  module; Data module disabled -> localStorage).
- PASS: boot (0.23 MB to the first gameplayStart), sdk-events, no-sdk, sdk-disabled, sdk-init-hang, ads-basic-launch,
  **ads-fill** (mute only while the ad plays), ads-slow-fill, adblock, mute-priority, tab-hidden, touch, **poly-budget**
  (max 12,269 tris / 34 draw calls; budget 60,000 / 60), dead-air (longest silence 2.9 s of 3), ad-ui, shop,
  console-errors.
- UNVERIFIED (need eyes): `viewports` - Claude looked at 800x450, 390x844, 1080x1620, 1920x1080: legible, no overlap
  (the ghost boot title seen in those shots is fixed: the boot title now hides instantly). `ad-ui-style` - Claude looked
  at the revive dialog: Finish and One more strike share the button style and size. `performance` - software GL
  (p95 1150 ms at 4x throttle), not a real device: judge on the owner's PC/phone.
- Also PASS: `node tools/qa/sim-health.mjs --selftest`, `tools/qa/audio-levels.mjs`, `npm run build` (~0.8 MB).
- Covers rendered from the real game: `submission/covers/{landscape-1920x1080,portrait-800x1200,square-800x800}.png`
  (`node tools/launch/capture-covers.mjs --url http://127.0.0.1:4173/ --scale 1`); Claude looked at all three.
- Playtest page (private, no SDK/ads): https://claude.ai/artifact/1uTzAegjhcbFV3pSWiTo6j

**First job for the next chat:** read the owner's playtest/audio feedback, then the launch package (section 4).
