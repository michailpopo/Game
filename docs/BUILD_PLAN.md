# Build plan - Storm Grid (concept "Volt City", original, 3D)

Owner: the planner (game-studio-director / the main session). Builders work only from packages here.
Last updated: 2026-09-26

## Rules

- One package = one owner agent, one goal, a bounded set of files, checks that prove it.
- Order: prove the fun first (Gate 2), then the slice, platform, polish.
- Packages that run in parallel never share files. `src/main.js`, `src/ui/ui.js`, `src/config.js` and
  `src/ui/styles.css` have one owner per round.
- A package is **done** only after the planner re-ran its checks and looked at its screenshots.
- Follow-ups go to the same builder (SendMessage keeps its context); the critic is always a fresh agent.
- Builders return `NEEDS USER:` items; only the planner talks to the user.
- Environment (cloud container, 2026-09-26): run the browser harness with
  `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`; Node scripts that fetch the web need `NODE_USE_ENV_PROXY=1`.

## CrazyGames QA (owner's instruction, 2026-09-26: "use the CrazyGames QA")

The `crazygames-qa` skill is applied in two modes on every round, next to the game-studio register
(`tools/qa/requirements.json`) and `npm run qa`:

- **BUILD MODE - constraints in every package brief** (from the skill's checklist and `references/*.md`):
  land in gameplay in <= 1 click (Full Launch); text readable at devicePixelRatio 1 at 907x510, 821x462,
  800x450 and up to 1920x1080; landscape on desktop; mouse + keyboard + touch; `user-select: none` and no
  magnification on mobile; safe areas; no custom fullscreen button; no Escape / Ctrl+W bindings; physical
  keys via `event.code` (AZERTY); delta-time physics identical at 60/144/165 Hz; iOS AudioContext resume on
  touchend; relative paths only; `gameplayStart`/`gameplayStop` at the real play boundaries; progress via the
  Data module; midgame only at natural breaks (never on navigation or shop opening); game paused and muted
  on `adStarted` (not on request) and resumed on `adFinished`/`adError`; rewarded: reward only on
  `adFinished`, decline the same size/font/colour, video icon, not on the active gameplay screen, not every
  death, a coin alternative, hidden (not dead) under adblock / Basic Launch; English + SDK-locale fallback;
  PEGI 12; original name and assets; no cross-promotion or app-store links.
- **AUDIT MODE - a compliance report at the gates** (WP-QA below): the skill's report format
  (PASS / FAIL with FIX / WARNING / CANNOT VERIFY, summary counts), written to `docs/CG_QA_AUDIT.md`,
  run by `crazygames-compliance-auditor` at Gate 2 (prototype, technical + gameplay only), Gate 3, Gate 6
  and Gate 8 (Full Launch, every category incl. ads and covers). A FAIL there blocks the gate like a
  `npm run qa` FAIL.

## Packages

| ID | Goal | Owner | Files it may touch | Depends on | Status |
|---|---|---|---|---|---|
| WP-00 | Market research + competitor teardowns | game-market-researcher | docs/RESEARCH.md, qa/research/** | - | done (teardowns in progress) |
| WP-01 | Concepts, brief, originality, project profile | game-concept-designer | docs/CONCEPTS.md, GAME_BRIEF.md, ORIGINALITY.md, project.json | WP-00 | in progress (brief) |
| WP-10 | Merge-snake arena core + Comet Chain rules (planets, 90 s rounds, respawn, rank payout, pointer lock, Offline Arena) | threejs-game-engineer | src/game/**, src/main.js, src/ui/ui.js, src/ui/styles.css, src/config.js, src/core/i18n.js, src/render/palette.js, tools/qa/sim-health.mjs, tools/qa/browser-qa.mjs (adapters only) | owner's direction 2026-09-26 | done |
| WP-02 | (SHELVED with Skip Legend) Grey-box prototype of the core verb: throw, tap-per-skip timing judge, micro reward, shore bins, retry | threejs-game-engineer | src/** (game, view, main, ui, config, i18n), tools/qa/sim-health.mjs, tools/qa/browser-qa.mjs (phase/hook adapters only) | WP-01 | todo |
| WP-03 | Cold playtest of the prototype (blind, fresh context) | gauntlet-critic | docs/QA_REPORT.md (playtest section) | WP-02 | todo |
| WP-04 | Playtest build for the owner (Gate 2: the owner plays on PC and phone) | planner | dist/ -> published playtest page | WP-02 | todo |
| WP-QA | CrazyGames QA audit (crazygames-qa skill, audit mode) at each gate | crazygames-compliance-auditor | docs/CG_QA_AUDIT.md, qa/** | per gate | todo (first: Gate 2) |
| WP-21 | City restyle from hit references (Holey.io, Slice Master, Cubes 2048.io, Paper.io 2, Tile Jumper 3D, Harvest.io covers/frames): toy-like chunky clean city, calm unlit vs bright lit, simple props; UI unchanged | game-feel-artist | src/render/**, src/fx/**, lookdemo.html | WP-20 | in progress |
| WP-20 | Premium look kit (tone mapping, light rig + soft shadows, env lighting, bloom on high tier, material/palette kit, particle kit, number pops, UI refresh) + a 3D Volt City hero-frame demo (lookdemo.html) for the owner's look approval | game-feel-artist | src/render/**, src/fx/**, src/ui/styles.css, src/core/quality.js, lookdemo.html | - | done (owner: UI great, city too AI-looking -> WP-21) |
| WP-30 | Volt City core, 3D: city generator, charge/release strike, hop/fork chain, lighting windows, % powered, jackpot plates, result + claim, QA hooks | threejs-game-engineer | src/game/**, src/main.js, src/ui/ui.js, src/config.js, src/core/i18n.js, index.html, tools/qa/sim-health.mjs, tools/qa/browser-qa.mjs (adapters) | WP-01f brief (numbers) | done |
| WP-31 | Wire the look kit into Volt City + juice pass (bolts, window waves, hit-stop, camera swoop, result sweep) + ZzFX sound set | game-feel-artist | src/game/view.js (+ view helpers), src/game/sfx.js, src/render/**, src/fx/** | WP-20, WP-30 | todo |
| WP-32 | Meta + offers + shop for Volt City (5 upgrades, 12 bolt skins, 7 rewarded surfaces, daily gift, midgame from level 4, completion %, save) | threejs-game-engineer | src/main.js, src/ui/ui.js, src/config.js, src/game/meta.js, src/game/offers.js, src/core/i18n.js | WP-30 | todo |
| WP-11 | (SHELVED with Comet Chain) Meta + offers + shop: payout with rank crates, 3 upgrades, 12 trail skins, daily gift, all 7 rewarded surfaces with caps, midgame from round 3, Data-module save | threejs-game-engineer | src/main.js, src/ui/ui.js, src/ui/styles.css, src/config.js (OFFERS/economy), src/game/meta.js, src/game/offers.js, src/core/i18n.js | WP-10 | todo |
| WP-12 | (SHELVED with Comet Chain) Juice + audio: fusion pops, swallow bursts, trails, hit-stop, shake, counter punch, podium confetti; ZzFX sound set with pitch ladder | game-feel-artist | src/game/view.js, src/fx/**, src/game/feel.js (new, feel constants), src/game/sounds.js (new), src/render/** | WP-10 | todo |
| WP-13 | Launch package (Volt City): covers 1920x1080 / 800x1200 / 800x800, preview videos landscape + portrait, STORE_METADATA, portal checklist, upload zip | game-launch-manager | tools/launch/**, submission/**, docs/STORE_METADATA.md, src/ (capture modes only) | WP-31, WP-32 | todo |

Status values: todo · in progress · review (returned, planner checking) · done · blocked (why).

Production packages (vertical slice: meta, shop, offers, juice, art, audio, platform) are added after
Gate 2, when the owner has played the prototype and the fun moment is named.

## WP-10 - Merge-snake arena core (grey-box, theme-neutral)

- **Goal:** a playable arena where the player steers a chain of numbered value blocks; loose low-value
  blocks spawn; eating one appends it; equal values merge and double down the chain (2+2=4 -> 4+4=8 ...);
  heads with a lower value than yours are eaten on contact (their chain drops as loose blocks), a bigger head
  kills you; hold/click/Space = boost that costs a little; 10-15 labelled bots; a live rank list; death ->
  result -> retry in < 2 s. Every eat/merge prints its number and plays a pitched tick from day one.
- **Why theme-neutral:** the owner fixed the family (Cubes 2048.io, 2026-09-26); the designer is choosing the
  original twist (theme, round structure, one rule change) in parallel. Build the core so a twist can sit on
  top: values, merge ladder, colours per value and object shape live in config/palette, not hard-coded.
- **Constraints:** as WP-02 below (pure deterministic sim with fixed step + seeded RNG + sim-health; QA
  contract `__GS_QA__` with phases ready -> run -> won | failed, start/setAutopilot/forceWin/forceFail/
  renderInfo/sceneStats/feedback; one click on the ready screen starts; profile M budgets with instancing -
  one InstancedMesh for all blocks; CrazyGames QA build-mode constraints). Steering: pointer position
  relative to the head (mouse) / drag direction (touch) / arrows + WASD via event.code; mouse steering must
  not need pointer lock. Bots are clearly bots (names like "Bot Kiwi"; an "offline arena" label), never
  presented as real players.
- **Done when:** build exits 0; sim-health --selftest PASS; browser-qa --only
  boot,sdk-events,no-sdk,touch,poly-budget,dead-air,tab-hidden,viewports PASS; screenshots at 1280x720 and
  450x800 of: start, mid-run with merges popping, a bot eaten, death/result; a 20-s autopilot run where the
  chain visibly grows.

- **Planner review (2026-09-26):** re-ran `npm run build` (exit 0), `sim-health --selftest` (PASS, drift 0.45%, planted bug caught at 20%), browser-qa boot, sdk-events, no-sdk, touch, poly-budget (19.9k tris / 19 draw calls), dead-air (longest silence 1.1 s), tab-hidden, viewports, ads-basic-launch, adblock, revive-offer, ad-ui -> 0 FAIL, 2 UNVERIFIED (looked: viewport-800x450 legible; ad-ui revive and result buttons equal size with video icon). Looked at ready/auto20/result at 1280x720 and auto20 at 450x800. Verdict: done. Carry-overs to WP-11/12: Magnet + Boost tank upgrades, remove template Income, 12 named trails, start boost x4 floor 62, daily gift, try-a-trail, revive ring 5 s with auto Respawn at 0 and only when the chain is worth keeping, planets should read more like planets (surface bands/craters, atmosphere), brighter comet head, fewer NEW WORLD cards in round 1.

## WP-30 planner review (2026-09-27)
Re-ran: `npm run build` ok; `sim-health --selftest` PASS (drift 0.00%, planted bug caught at 37.5%); browser-qa boot, sdk-events, no-sdk, touch, poly-budget (15.9k tris / 13 draw calls), dead-air (longest silence 0.7 s), tab-hidden, viewports, revive-offer, ad-ui, ads-basic-launch, adblock, persistence -> 0 FAIL, 2 UNVERIFIED (looked). Looked at qa/wp30/fork-1280x720 (forked chain lights buildings, FORK x4 pop) and result-450x800 (plates x2/x3/x5/x10, Claim / Claim x3 equal). City intentionally plain until WP-21/WP-31. Verdict: done.

## WP-02 - (shelved) Grey-box prototype of the core verb

- **Goal:** answer "is tap-per-skip fun?" - a playable grey-box throw where every water contact asks for a
  tap, judged PERFECT / GOOD / miss, paying a number and a pitched plink each time, ending on the far shore's
  x-bins or in a sink with the distance shown, and a retry under 2 s.
- **Read first:** docs/GAME_BRIEF.md (core loop, controls, timing judge, first-30-s beat sheet, difficulty
  numbers for levels 1-5, hook cadence), docs/CONCEPTS.md C1, the skill's workflows/03-prototype.md,
  references/design/hypercasual-hits.md, references/design/game-feel-juice.md,
  references/threejs/visual-style.md (profile M); the template's src/game/sim.js, src/main.js,
  src/core/*.js, tools/qa/sim-health.mjs, tools/qa/browser-qa.mjs.
- **May touch:** src/game/** (replace the crowd-runner demo), src/main.js, src/ui/ui.js, src/ui/styles.css,
  src/config.js, src/core/i18n.js (strings), src/render/palette.js, tools/qa/sim-health.mjs,
  tools/qa/browser-qa.mjs (only to adapt phase names / QA hooks to the new game - keep every scenario).
- **Must not touch:** src/platform/**, src/core/ads.js, save.js, pause.js, gameplay-events.js (the platform
  skeleton stays as is), tools/qa/report.mjs, requirements.json, docs/** except a short dev note in
  docs/QA_REPORT.md.
- **Constraints:**
  - Pure deterministic sim (`step(state, dt, input)`, rates x dt, seeded RNG, no Math.random / clock in
    the sim). The timing judge uses input-event timestamps converted to sim time, never frame counts, so
    PERFECT feels identical at 30/60/120 Hz (CG-GAME-003) - sim-health must cover the skip physics.
  - Keep the QA contract: `window.__GS_QA__` with `state.phase` in ready -> run -> finish -> won | failed,
    `start`, `setAutopilot` (autopilot taps on time so dead-air measures real play), `forceWin`,
    `forceFail(at)`, `renderInfo`, `sceneStats`, `feedback`. One tap/click on the ready screen throws
    (phase leaves "ready") - the harness's startRun relies on it.
  - Land in gameplay (CG-GAME-001): the home screen IS the jetty and the water; first tap throws.
  - First "+1" within 4 s of the first input; no feedback gap over 3 s (dead-air budget).
  - Profile M budgets from project.json (<= 2,000 tris per geometry, <= 60k per frame, <= 60 draw calls).
  - Controls: tap / left click / Space (event.code) - same verb everywhere; no Escape.
  - CrazyGames QA build-mode constraints (section above) apply; the ones this package must already meet:
    <= 1 click to gameplay, readable at DPR 1 at 821x462 and 800x450, no fullscreen button, `user-select: none`,
    iOS audio resume on touchend, `gameplayStart` on the throw / `gameplayStop` at the result, delta-time
    physics, relative paths.
  - Landscape 1280x720 and portrait 450x800 both playable; camera look-ahead keeps the next contact on screen.
  - The existing meta (coins, upgrades, skins, offers) may stay wired as-is or be stubbed for the prototype;
    do not build the Skip Legend shop yet. Coins earned per throw must still bank so a retry shows progress.
- **Done when:**
  - `npm run build` exits 0; `node tools/qa/sim-health.mjs --selftest` PASS for the new sim.
  - `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/browser-qa.mjs --serve --only boot,sdk-events,no-sdk,touch,poly-budget,dead-air,tab-hidden,viewports`
    -> PASS (tab-hidden also failed on the template demo: fix the save flush on hide or report why not).
  - Screenshots (planner looks at them): first frame 1280x720 and 450x800, mid-skip with "+1 PERFECT" and a
    ring, the shore bins, the result.
  - A player would notice: the stone leaves on the first tap; each contact shows a shrinking ring cue; a
    good tap keeps speed, a miss visibly loses it; the plinks climb in pitch with the streak; the skips get
    faster as the stone slows; reaching the shore feels like a jackpot; sinking shows "X m short".
- **Return:** files changed, commands with their real results, screenshot paths, the tuning numbers used
  (windows in ms, speed kept per grade, level 1 shore distance), open problems, NEEDS USER.
- **Planner review** (date, what was re-run and seen, verdict):

## WP-03 - Cold playtest (gauntlet-critic, fresh)

- **Goal:** a blind "WOULD QUIT AT / BIGGEST REASON" verdict on the prototype, playing it through the
  harness at 1280x720 and 450x800 with real taps (not the autopilot).
- **Done when:** a short verdict with timestamps and screenshots is in docs/QA_REPORT.md (playtest section).

## WP-04 - Owner playtest (Gate 2)

- **Goal:** the owner plays the prototype on PC and phone and answers: what did you try first, when did it
  get fun (if at all), when did you want to stop.
- **How:** build `dist/` and publish it as a private playtest page (the game must run without the SDK there),
  or run `npm run dev -- --host` where the owner can reach it.
