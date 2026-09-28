# Storm Grid - handoff for the next chat (2026-09-28, updated by the 2nd chat)

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
| WP-30 | 3D core: city generator, charge/strike, hop/fork chain, lighting, % powered, plates, result, QA hooks | done, verified |
| WP-31 | Toy city + bolts + juice + ZzFX sounds in the real game (`src/game/view.js`, `city-mesh.js`, `look.js`, `sfx.js`, `src/fx/*`) | **done, verified by the planner 2026-09-28** (full harness 0 FAIL, stills in `qa/frames/`) |
| WP-32 | Shop, upgrades, 12 skins, all 7 offers, daily gift, midgame from city 4, completion %, save | **done, verified by the planner 2026-09-28** (shop, ad-ui, revive-offer, persistence PASS) |
| WP-13 | Launch package: covers x3, preview videos x2, store text, portal checklist | todo |
| WP-QA | CrazyGames QA audit report `docs/CG_QA_AUDIT.md` (crazygames-qa skill format) | todo |

Session 2026-09-28 (2nd chat) changed:
- `tools/qa/browser-qa.mjs`: the 9 FAILs were harness timing on the software renderer (~2 fps), not game bugs.
  `ads-fill` now samples mute/overlay/gameplay inside the page at each mock SDK event (`__CG_MOCK_ON_RECORD__`)
  instead of wall-clock sleeps (the game already muted only on adStarted, `src/core/ads.js`); crashed scenarios now
  close their browser contexts (a leaked page kept rendering and starved the next scenario = the "cascade");
  boot wait 60 s, result-dialog wait 20 s; `persistence` closes its first page before the fallback check.
- Look fixes: bolts 35-40% wider, outline alpha 0.55 -> 0.85, bolts drawn over buildings (no depth test) so a bolt
  behind a tower still reads (`src/game/view.js`). Lit buildings were already clear candy colours (poly-budget.png).
  Shop backdrop dims less (`.shop-modal` in `styles.css`): the toy city stays visible behind it.
- Skins: `view.recolor()` feeds the skin's glow colour into every strike/hop bolt (code-checked; not seen in a still).
  Max 2 video buttons per screen: `ad-ui` PASS (ready screen has exactly 2: FREE upgrade + "+2 strikes").
- New tool `tools/qa/look-frames.mjs` (stills incl. a frame sequence right after a strike).
- Playtest published (private): https://claude.ai/artifact/NiMqU6S1QUtHXMyUzwPKd1 (dist/ without the SDK tag).

Session 2026-09-28 (3rd round, owner: "maps must look better - keep the city, work on everything around it;
game logic: I have not reached 100% on any level"):
- **Game logic:** `node tools/qa/balance.mjs` (new Monte Carlo: fixed cities or `campaign` with coins + greedy
  upgrades; player models pro / casual / human) showed FULL POWER was nearly impossible: lone dark blocks strand the
  last % because a bolt with nothing dark within R grounds out. New rule (`src/game/sim.js`, `STORM.chain.leap*`):
  a **SUPERCHARGE bolt LEAPS** to the nearest dark antenna within 2 x R for 3 energy (gold arc + "LEAP!" in
  `view.js`; hint text "SUPERCHARGE leaps to dark blocks"). Upgrade prices doubled (`ECONOMY.upgrades`) because
  FULL POWER x10 is common now. Result, "human" model campaign: 100% in 58-82% of cities, pass ~100%; pro ~100%.
- **Surroundings (city untouched):** the city now stands on an island - grass top with an earth edge, sand beach,
  white surf line, pale lagoon, open sea, 3-7 islets on the horizon, trees on the island rim (count grows with the
  island). Colours per theme in `src/game/look.js` SHORES (harbour blue sea, snow/ice, desert oasis, neon violet,
  Sky Port = cloud sea). Stills: `qa/frames/level{6,21,26,36}.png`, `ready/charge-1280x720.png`.
- A brighter colour pass for the surroundings (commit ffe8823: saturated SHORES, emissive lift, horizon fog) was
  **reverted at the owner's request** ("nevermind mach zurück") - the island colours above are the current ones.
- A stylised-cumulonimbus rebuild of the storm cloud (moved back-left over the sea) was **reverted at the owner's
  request** ("mach zurück sofort") - the cloud is the original row of slate puffs behind the city again.
- Harness: `revive-offer` waits for the ring digit to change (the ring counts game time; 1 fps software WebGL).

Open look notes for the owner to judge: in portrait the "FREE" upgrade button sits low under the Voltage card.
Is the FULL POWER rate now right (too easy / too hard)? Tune with `STORM.chain.leapRange/leapCost` + upgrade prices
and re-run `node tools/qa/balance.mjs campaign 60 1-20`.

## 4. What is left to be upload-ready (in this order)

1. ~~Finish + verify WP-31 and WP-32~~ done 2026-09-28.
2. **Owner playtest (Gate 2)** - the page above. Ask: what did you try first, when did it get fun, when did you want
   to stop. The owner must also **audition the sounds** (Claude cannot hear): charge hum, supercharge ding, strike
   boom, hop crackle ladder, fork zap, block-powered chord, full-power fanfare, coin ticks, click. Fix what they say.
   To republish after changes: `npm run build`, copy `dist/assets` + `dist/index.html` without the SDK `<script>` and
   without doctype/html/head/body tags to the scratchpad, publish with the Artifact tool to the same URL.
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
- Git: repo `michailpopo/Game`, working branch `claude/admiring-bell-26ljck` (everything is pushed; earlier work on
  `claude/festive-darwin-7ukgnb`). No PR opened.

## 7. How to save tokens in the next chat

- Read this file + GAME_BRIEF; do not re-read the conversation history or the long docs.
- Prefer doing small fixes directly; use at most one specialist agent at a time, with a tight brief and "be
  economical: no extra iterations". Agents burned ~500k tokens each per package here.
- Run the slow browser harness once per package with `--only <scenarios>`, not the full set every time.

## 8. Browser QA (2026-09-28, after the island + leap changes)

`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/browser-qa.mjs --serve` (~25 min here): 18 PASS,
1 FAIL (`revive-offer`: harness timing, fixed, then `--only revive-offer` PASS), 3 UNVERIFIED (need eyes:
`viewports`, `ad-ui-style`, `performance` - software WebGL, p95 1167 ms, not a Chromebook number).
Poly budget: max 12.9k tris / 39 draw calls in play at city 1 (budget 60k / 60); idle city 36: 32k tris / 39 calls.
Boot 0.23 MB to first gameplayStart. `npm run build` OK, `node tools/qa/sim-health.mjs --selftest` PASS.
Playtest page updated (version 2): https://claude.ai/artifact/NiMqU6S1QUtHXMyUzwPKd1

**First job for the next chat:** owner playtest answers (FULL POWER reachable now? island look? sounds), fix what
they say, then HANDOFF section 4 steps 3-4 (full QA + crazygames-qa audit `docs/CG_QA_AUDIT.md`, launch package).
