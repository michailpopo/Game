# Storm Grid - handoff for the next chat (2026-09-28)

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

| Package | What | Status |
|---|---|---|
| WP-20 | Premium look kit: tone mapping, light rig + soft shadows, bloom on high tier, materials, particle kit, number pops, UI styles | done, verified |
| WP-21 | Toy-city restyle from hit-game references (`src/render/city-kit.js`, refs in `qa/refs/`) | done, verified, owner saw frames |
| WP-30 | 3D core: city generator, charge/strike, hop/fork chain, lighting, % powered, plates, result, QA hooks | done, verified (build, sim-health, 13 browser scenarios 0 FAIL) |
| WP-31 | Wire toy city + bolts + juice + ZzFX sounds into the real game (`src/game/view.js`, `city-mesh.js`, `look.js`, `sfx.js`, `src/fx/*`) | **stopped near the end, NOT verified by the planner** |
| WP-32 | Shop, upgrades, 12 skins, all 7 offers, daily gift, midgame from city 4, completion %, save | **stopped near the end, NOT verified by the planner** (all offer functions exist in `src/game/offers.js`) |
| WP-13 | Launch package: covers x3, preview videos x2, store text, portal checklist | todo |
| WP-QA | CrazyGames QA audit report `docs/CG_QA_AUDIT.md` (crazygames-qa skill format) | todo |

State at handoff: `npm run build` OK, `node tools/qa/sim-health.mjs --selftest` PASS. Full browser harness result at
handoff: see section 8. Screenshots of the latest work: `qa/wp31/*.png` (game with toy city) and `qa/wp32/*.png`
(shop, offers) - `qa/` is gitignored, copies are in the handoff ZIP under `screenshots/`.

What I saw in the last screenshots (fix first):
1. `qa/wp31/fork-1280x720.png`: the toy city is in the game, but the lightning barely shows in that frame and the lit
   buildings flood pale white/orange instead of clear candy colours; no sky visible at that camera angle. The bolt
   must be the brightest, most saturated thing on screen (WP-21 rule).
2. `qa/wp32/shop-1280x720.png`: the shop panel works (Random 250 coins / video +55), but it sits over the OLD dark
   plain city background - the shop/menus must render over the new toy city.
3. Check that bolt skins actually recolour the bolt in play, and that every offer screen has at most 2 video buttons.

## 4. What is left to be upload-ready (in this order)

1. **Finish + verify WP-31 and WP-32** (fix the 3 items above). Checks:
   `npm run build`, `node tools/qa/sim-health.mjs --selftest`,
   `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/browser-qa.mjs --serve` (all scenarios, 0 FAIL),
   look at `qa/shots/*.png`.
2. **Owner playtest (Gate 2):** publish `dist/` as a private page (Artifact tool; strip the SDK script tag, keep
   `assets/*` as supporting files - the page runs without the SDK) or `npm run dev -- --host`. Ask: what did you try
   first, when did it get fun, when did you want to stop. The owner must also **audition the sounds** (Claude cannot
   hear): charge hum, supercharge ding, strike boom, hop crackle ladder, fork zap, block-powered chord, full-power
   fanfare, coin ticks, click.
3. **Full QA:** `npm run qa` (writes `COMPLIANCE_REPORT.md`, exit 0) + the **crazygames-qa audit** in its report format
   into `docs/CG_QA_AUDIT.md` (technical, gameplay, ads, covers; FAIL blocks). Run
   `NODE_USE_ENV_PROXY=1 node <game-studio>/scripts/docs/check-docs-freshness.mjs` first.
4. **Launch package:** `npm run launch:covers` (1920x1080, 800x1200, 800x800), `npm run launch:video` (landscape +
   portrait, 15-20 s, no sound), `npm run launch:check`; fill `docs/STORE_METADATA.md`; portal checklist in
   `<game-studio>/checklists/launch-checklist.md`. Build the upload ZIP from `dist/`.
5. **The owner uploads** in the CrazyGames Developer Portal (Claude never logs in or submits). Basic Launch first is the
   usual path; ads only run at Full Launch.

## 5. Environment gotchas (cloud container)

- Browser harness: always `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` (template pins Playwright 1.63; the container has
  Chromium 1194; the launch calls in `tools/qa/browser-qa.mjs`, `tools/launch/*.mjs` read that env var).
- Node scripts that fetch the web: `NODE_USE_ENV_PROXY=1` (Node fetch ignores HTTPS_PROXY otherwise).
- Allowed hosts (owner set them): crazygames.com, docs/sdk/api/builds/imgs/videos.crazygames.com,
  `<slug>.game-files.crazygames.com`, poki.com, youtube.com. Everything else may be blocked.
- WebGL renders in software here (1-9 fps): judge looks by still frames and budgets by draw calls/triangles, not fps.
  Browser QA runs take 10-25 minutes.
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
- Git: repo `michailpopo/Game`, branch `claude/festive-darwin-7ukgnb` (everything is pushed). No PR opened.

## 7. How to save tokens in the next chat

- Read this file + GAME_BRIEF; do not re-read the conversation history or the long docs.
- Prefer doing small fixes directly; use at most one specialist agent at a time, with a tight brief and "be
  economical: no extra iterations". Agents burned ~500k tokens each per package here.
- Run the slow browser harness once per package with `--only <scenarios>`, not the full set every time.

## 8. Browser QA at handoff (2026-09-28, full harness, current HEAD)

See `docs/handoff-qa.txt` (written by the planner at handoff).
