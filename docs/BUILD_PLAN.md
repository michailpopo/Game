# Build plan - Working Title

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

## Packages

| ID | Goal | Owner | Files it may touch | Depends on | Status |
|---|---|---|---|---|---|
| WP-01 | | threejs-game-engineer | | - | todo |
| WP-02 | | game-feel-artist | | WP-01 | todo |

Status values: todo · in progress · review (returned, planner checking) · done · blocked (why).

## WP-01 - title

- **Goal** (one sentence):
- **Read first:** docs/GAME_BRIEF.md sections ..., files ...
- **May touch:** ...
- **Must not touch:** ...
- **Constraints:** budgets (project.json), rule ids (CG-...), feel targets (hook cadence rows ...)
- **Done when:**
  - `npm run build` exits 0
  - `node tools/qa/browser-qa.mjs --serve --only <scenarios>` -> PASS
  - screenshots to take and look at: ...
  - behaviour a player would notice: ...
- **Return:** files changed, commands with their real results, screenshot paths, open problems, NEEDS USER
- **Planner review** (date, what was re-run and seen, verdict):
