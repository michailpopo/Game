# Build plan - Skip Legend

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

## Packages

| ID | Goal | Owner | Files it may touch | Depends on | Status |
|---|---|---|---|---|---|
| WP-00 | Market research + competitor teardowns | game-market-researcher | docs/RESEARCH.md, qa/research/** | - | done (teardowns in progress) |
| WP-01 | Concepts, brief, originality, project profile | game-concept-designer | docs/CONCEPTS.md, GAME_BRIEF.md, ORIGINALITY.md, project.json | WP-00 | in progress (brief) |
| WP-02 | Grey-box prototype of the core verb: throw, tap-per-skip timing judge, micro reward, shore bins, retry | threejs-game-engineer | src/** (game, view, main, ui, config, i18n), tools/qa/sim-health.mjs, tools/qa/browser-qa.mjs (phase/hook adapters only) | WP-01 | todo |
| WP-03 | Cold playtest of the prototype (blind, fresh context) | gauntlet-critic | docs/QA_REPORT.md (playtest section) | WP-02 | todo |
| WP-04 | Playtest build for the owner (Gate 2: the owner plays on PC and phone) | planner | dist/ -> published playtest page | WP-02 | todo |

Status values: todo · in progress · review (returned, planner checking) · done · blocked (why).

Production packages (vertical slice: meta, shop, offers, juice, art, audio, platform) are added after
Gate 2, when the owner has played the prototype and the fun moment is named.

## WP-02 - Grey-box prototype of the core verb

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
