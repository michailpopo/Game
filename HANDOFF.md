# Storm Grid - handoff for the next chat (updated 2026-10-01)

Read this file first (CLAUDE.md sends you here). It replaces the long chat history. Open other docs only at the
sections named here. Older session notes are in git history (`git log -- HANDOFF.md`).

## 1. What this is

**Storm Grid**: an original 3D hypercasual browser game for **CrazyGames** (three.js r186 + Vite, HTML5, ~0.8 MB),
built with the `game-studio` skill and checked with the `crazygames-qa` skill. Single player, desktop + mobile.

- **Verb:** hold anywhere to charge a storm, release to strike. The bolt hits the antenna you aimed at and hops roof
  to roof, forking (1 -> 2 -> 4 -> 8). Lit buildings flood with candy colour and pay "+N" coins; a lit district =
  "BLOCK POWERED". Charge fills in 1.2 s; the gold **SUPERCHARGE** band (80-95%) = two bolts + a fork, and SUPERCHARGE
  bolts **LEAP** to the nearest dark block within 2 x range (3 energy) when nothing dark is in reach. Past 100% fizzles.
- **Run:** 3 strikes per city (upgradable to 6) -> % powered -> plates x2 (60%, cleared) / x3 (80%) / x5 (95%) /
  x10 FULL POWER (100%) -> Claim / Claim x3 (rewarded) -> next city. Cities never end (8 themes cycle).
- **Meta:** 5 upgrades (Voltage, Fork, Strikes, Capacitor, Gold rods; prices doubled 2026-09-28), 12 bolt skins,
  daily gift. **7 rewarded surfaces** (all capped, all with a coin path) + midgame from city 4. Works with ads off and
  with an ad blocker.
- **World:** the toy city (owner: keep it as is) on an island (grass, earth edge, beach, surf, lagoon, sea), small
  islets on the horizon, one smooth storm cloud behind the city.
- Numbers: `docs/GAME_BRIEF.md` (source of truth; leap + prices noted in it). Code map: section 6.

## 2. Links and where things are

| What | Where |
|---|---|
| **Playtest (private, current build)** | https://claude.ai/artifact/NiMqU6S1QUtHXMyUzwPKd1 (version 12 = commit f94b8e9) |
| Sound audition page (private) | https://claude.ai/artifact/SLPJpVUS49CdYSpu6wsWLY |
| Repo / branch | `michailpopo/Game`, branch `claude/admiring-bell-26ljck` (everything pushed; no PR) |
| Rebuild the playtest page | `npm run build && node tools/playtest/make-page.mjs <scratch>/playtest`, then publish `<scratch>/playtest/index.html` with the Artifact tool, `url` = the playtest link, `files` = the printed list, old hashed asset names -> `null` (read the artifact first in a new chat) |

Phone: the claude.ai link only opens in a supported browser (Chrome/Safari directly, not inside WhatsApp/Instagram/
Gmail). A **public link** (Vercel) is blocked: the connected Vercel team "mischa" (`team_4jgRPRJ1rV6hJHZ4PGaDemDU`)
answered 403 "You don't have permission to create a project". The owner must create an empty project `storm-grid`
there (or get a role that can); then deploy with `create_deployment` from `gitSource` github michailpopo/Game,
ref = the branch, `projectSettings` vite / `npm ci` / `npm run build` / `dist`, `target: "production"`.

## 3. The owner's wishes and how to work with him

- Goal: "a game for CrazyGames that is simple yet it will make me money" - **upload-ready**. Benchmark = very popular
  HTML5 games (Cubes 2048.io), original (no copies), **3D**, **dopamine hitting**, "do not overcomplicate things".
- Keep: the UI ("looks great") and the **city/buildings as they are**. Change the surroundings only when asked.
- **Change only what he asks** ("nur Form der Wolke, nichts anderes"). He reverts fast ("mach zurück sofort"), so:
  one change = one commit (clean `git revert`), show before/after stills in chat (he cannot open `qa/`), republish
  the playtest after every visible change, keep replies short. He writes German or English - answer in his language.
- Reverted at his request (do not redo unasked): brighter/saturated surroundings, a cumulonimbus cloud moved back-left,
  the 7 picked Kenney sounds (picks below).
- Always use the `crazygames-qa` skill (build mode for changes, audit report at the gates). Claude cannot hear: the
  owner auditions sounds.

## 4. State (2026-10-01)

Done and verified (details in git log and docs/PROJECT_STATUS.md):
- WP-20/21/30/31/32 done: look kit, toy city, 3D core, juice, shop, upgrades, skins, offers, daily gift, save.
- Browser-QA harness made robust on the 1-3 fps software renderer (event-based ads-fill, context cleanup, game-time
  waits). Full harness after the island + leap change: 0 FAIL (3 UNVERIFIED need eyes: viewports, ad-ui-style,
  performance). Later changes were checked with `--only` subsets (boot, poly-budget, touch, persistence, sdk-events,
  ads-fill, viewports, mute-priority, tab-hidden, dead-air): 0 FAIL.
- Balance: `node tools/qa/balance.mjs campaign 60 1-20` -> "human" model powers 58-82% of cities fully (was ~0-35%).
- Look: bolts wider + outline + drawn over buildings; island surroundings; cloud = one smooth mesh
  (`cloudGeometry`, 4,500 tris = the one hero geometry); islets = mini islands (`ringLayerGeometry`, 4 draw calls).
  Poly budget in play at city 1: 18.7k tris / 41 draw calls (budget 60k / 60).
- Result dialog scrollbar flash fixed (`.dialog` overflow-x hidden; `tools/qa/dialog-overflow.mjs`).
- Save v4 = fresh start for everyone (old saves held coins from the old prices).
- Sounds: all procedural ZzFX. The owner's Kenney picks (thunder=C, charge=A, fizzle=A, fork=B, powerSweep=C,
  coinTick=C, click=B) were shipped in 104dfaf and **reverted in f94b8e9 "for now"**; restore = `git revert f94b8e9`
  (needs the raw packs: re-download the 7 Kenney zips from kenney.nl/assets/<pack> into assets-src/kenney/ only if
  you re-run tools/audio/import-sounds.mjs; the reverted commit already contains the WAVs).

Open questions for the owner: is FULL POWER now too easy/hard? portrait "FREE" upgrade button sits low; sounds later?

## 5. What is left to be upload-ready (in this order)

1. Owner playtest feedback on the current build (and sounds, if he wants them back). Fix what he says.
2. **Full QA:** `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium npm run qa` (writes `COMPLIANCE_REPORT.md`) and the
   **crazygames-qa audit** in its report format into `docs/CG_QA_AUDIT.md` (technical, gameplay, ads, covers; FAIL
   blocks). First `NODE_USE_ENV_PROXY=1 node <game-studio>/scripts/docs/check-docs-freshness.mjs`.
3. **Launch package (WP-13):** `npm run launch:covers` (1920x1080, 800x1200, 800x800), `npm run launch:video`
   (landscape + portrait, 15-20 s, no sound), `npm run launch:check`; fill `docs/STORE_METADATA.md`; portal checklist
   `<game-studio>/checklists/launch-checklist.md`; upload ZIP from `dist/`.
4. **The owner uploads** in the CrazyGames Developer Portal (Claude never logs in or submits). Basic Launch first;
   ads only run at Full Launch.

## 6. Code map, tools, environment

- `src/game/sim.js` pure deterministic rules (leap: `leapTarget`), `view.js` (juice, bolts, camera), `city-mesh.js`
  (city, island, islets, cloud), `look.js` (themes, `SHORES` per theme), `sfx.js` (ZzFX sounds), `meta.js` + `offers.js`
  + `src/config.js` (`STORM`, `ECONOMY`, `GAME.saveVersion`), `src/main.js` (flow, `__GS_QA__` hooks), `src/ui/*`,
  `src/core/*` (ads, save, audio, pause, input, quality), `src/platform/platform.js` (only file touching the SDK).
- QA tools: `tools/qa/browser-qa.mjs` (harness, `--serve --only a,b`), `balance.mjs`, `look-frames.mjs`,
  `cloud-shots.mjs`, `dialog-overflow.mjs` (the last three need `npx vite preview --port 4174 --strictPort`),
  `sim-health.mjs --selftest`, `check-licenses.mjs`. Audio: `tools/audio/*`. Playtest: `tools/playtest/make-page.mjs`.
- Cloud container: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` for browser tools; `NODE_USE_ENV_PROXY=1` for Node
  fetches. WebGL is software-rendered (1-3 fps): judge stills and draw calls, not fps; the full harness takes ~25 min.
  Network: kenney.nl and crazygames.com/poki.com/youtube.com are allowed; pixabay, freesound, opengameart, medium,
  wikimedia, unsplash are blocked (ask the owner to add a host in the environment's Network access settings).
- Kill a preview server with `pkill -f "[v]ite preview --port 4174"` style patterns: a plain pattern that also
  appears in your own command line kills your shell (exit 144).
- Skills: `game-studio` and `crazygames-qa`. Studio agents are expensive (~500k tokens per package): prefer small
  direct fixes, at most one specialist agent at a time.

**First job for the next chat:** ask the owner for playtest feedback on the current build; then section 5 step 2.
