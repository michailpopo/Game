# QA report - Working Title

## Automated runs
| Date | Build | `npm run qa` result | Compliance verdict | Notes |
|---|---|---|---|---|

## Playtest sessions
| Date | Who | Device / browser / viewport | Fresh or returning | Duration | Biggest problem named |
|---|---|---|---|---|---|

## Device matrix
| Device | Browser | Result | Frame feel | Notes |
|---|---|---|---|---|
| Dev PC | Chrome | | | |
| Dev PC | Edge | | | CG-TECH-007 |
| Low-end laptop / Chromebook (if available) | Chrome | | | CG-TECH-008 |
| Android phone | Chrome | | | touch |
| iPhone (if available) | Safari | | | audio resume, safe areas |

## Screenshot review (Claude looks at qa/shots)
| Screenshot | Checked for | Verdict |
|---|---|---|
| viewport-800x450.png | legibility at minimum size | |
| viewport-821x462.png | legibility | |
| viewport-1080x1620.png | portrait framing | |
| ads-slow-fill-blocked.png | blocker over UI | |
| adblock-result.png | notice, no dead button | |

## Issues
| Id | Severity | Found | Steps | Status |
|---|---|---|---|---|
Severity: P0 blocker (crash, softlock, lost progress, compliance fail) · P1 major · P2 ordinary · P3 polish.
No P0/P1 may be open at the launch package gate.

## WP-10 dev notes (threejs-game-engineer, 2026-09-26)
Comet Chain core on the merge-snake engine (`src/game/`), numbers from docs/GAME_BRIEF.md in `ARENA` (src/config.js).
- **Mouse control (CG-QUAL-008):** pointer lock is requested on the PLAY / arena click (a user gesture) and on any later
  arena click while a round runs unlocked. Mouse movement moves a virtual cursor ring kept within 6 u of the head
  (`ARENA.controls.cursorRadius`), drawn in the arena. Unlock: P or Tab (event.code), or the browser's native Escape
  (never bound) -> "Paused - click to resume" overlay. Lock lost while the page has focus (P/Tab/Escape/pause button)
  holds `Reason.DIALOG` (a gameplay break: gameplayStop); lost with the window focus holds a custom `"lock"` reason
  (sim paused, no gameplayStop - CrazyGames handles focus). Menus (death offer, result, shop) always run unlocked.
  Fallback when the lock is refused/unavailable: the plain pointer steers (same ring), the OS cursor is a crosshair
  and a "Click the arena to lock the mouse" pill shows. HUD sound/pause stay above the pause overlay; M = mute.
  Headless Chromium grants the lock, so the harness exercises the locked path.
- **Timed rounds:** a death is not the end of the round. Without an allowed revive the player respawns after 2 s with
  8-4-2 (no dialog, gameplay keeps reporting); with one (once per session, >= 30 s into the round) the "Keep chain"
  (video) / "Respawn" dialog pauses the round (MENU -> gameplayStop). The round ends at 0:00 -> phase `won` ->
  podium + Claim / Claim x3 -> next round (midgame from round 3).
- **Harness adapters (tools/qa/browser-qa.mjs, scenarios kept):** `revive-offer` - an early death and the second death
  of a session now assert "no revive dialog + automatic respawn to phase run" instead of a Retry dialog; after
  "Respawn" (still `data-id="retry"`) it waits for phase `run`, not `ready`. `mute-priority` - presses P first when
  the pointer is locked (HUD buttons cannot receive clicks under pointer lock), then clicks the sound button.
- **tab-hidden fix:** `main.js` onHide now always marks the save dirty (lastSeenAt + best chain) before `save.flush()`,
  so the hide flush writes even when the debounced write already went out. `save.js` unchanged.
- **Loop:** `GameLoop({ maxStepsPerFrame: 8 })` keeps the 90 s clock real-time down to ~8 fps (this container renders
  with SwiftShader at ~9 fps; the template demo runs at 3 fps here - environment, not a Chromebook measurement).
- **Measured here (SwiftShader, 1280x720, DPR 1):** 19-20 draw calls, max 15.5k triangles/frame over 6 s of play,
  heaviest geometry 930 tris (ribbons strip), 18 geometries / 7 textures stable over 4 rounds; dead-air longest
  silence 1.2 s (13 feedback events/s autopiloted).
- **Sim:** `sim-health --selftest` samples the player's head, heading, mass and tail planet at 30/60/120/240 Hz
  (0.45% drift); bots are covered by the exact determinism replay (their decisions are discrete events). Pickups use
  a swept test so a pickup grazed between two steps counts at every step size.

## WP-20 notes - premium look kit (game-feel-artist, 2026-09-26)
Concept-agnostic render + FX + UI kit, proven on a real-3D Storm Grid hero frame (`lookdemo.html`, not in the game build:
`npx vite --port 5174` -> http://127.0.0.1:5174/lookdemo.html, `?scene=kit` for the material/FX swatch; `?still=1`
deterministic frame, `?quality=low|medium|high|ultra`, `?stats=1`, `?panel=1`, `?backdrop=storm|space|sunset|candy|ocean`).
- **Modules (API documented at the top of each):** `src/render/look.js` `applyLook(stage, opts)` (tone mapping, analytic
  backdrop that follows the real horizon, hemi + key with soft PCF shadows + rim, palette PMREM environment, optional
  shadow catcher, static-shadow mode, EffectComposer -> RenderPass -> UnrealBloomPass -> OutputPass on MSAA HalfFloat,
  swaps `stage.render/resize` in place); `src/core/quality.js` levels low/medium/high/ultra (DPR + shadows + bloom +
  MSAA; `onTier` callback, `?quality=` pin; old `new AdaptiveQuality(renderer)` behaves as before for DPR);
  `src/render/materials.js` `MATERIALS.candy/crystal/glass/core/metal/gold/neon/facade/facadeReflection/wetStreet` +
  `enhance()` (rim + inner glow); `src/render/palette.js` `BACKDROPS` (storm, space, sunset, candy, ocean), `ACCENTS`,
  `GEM_COLORS`, `BOLT_COLORS` (Comet Chain exports untouched); `src/fx/particles.js` `FxSprites` (sparks/glows/rings,
  1 draw call) + `Debris` (shards/coins/gems) next to the unchanged `Particles`; `src/fx/ribbons.js` `Ribbons` + `Bolts`
  (forked flickering lightning, trails); `src/fx/fx-kit.js` `FxKit` presets strike/shatter/impact/coinBurst/gemBurst/
  sparkle; `src/fx/number-pop.js` DOM pops + combo labels + `punch()`; `src/ui/styles.css` refresh (chunky `.btn` with
  outline, gloss, depth slab and press squash - no hover styles so offer and decline can never differ; outlined
  `.stroke`; contrast pills; `.pop`, `.big-meter`, `.glow-cyan`, `.punch`).
- **Budgets, hero frame 1280x720 (profile M: <= 60 calls, <= 60k tris):** low 12 calls / 31.0k tris (DPR 1, no post, no
  shadow map); medium 12 / 31.0k steady, 14 / 39.3k on a shadow-refresh frame (DPR 1.25); high 26 (12 scene + 14 post)
  / 31.0k, 28 / 39.3k on a shadow refresh (DPR 1.5, bloom quarter-res, MSAA 4x); ultra same counts at DPR 2, 2048 shadow
  map. Animated strike sequence max 26 calls / 31.0k. Heaviest geometry: ribbon pool 1,920 tris (default 30 x 33
  points), all others <= 180. Kit swatch at high: 38 calls (24 scene incl. dynamic shadow pass + 14 post) / 9.9k tris.
- **Tone mapping (qa/wp20/hero vs tonemap-*):** Neutral is the kit default - it keeps #4df3ff cyan and #ffd166 gold
  saturated; ACES bleaches the bolt and windows toward white; AgX greys the whole frame (the owner's "washed out"
  complaint) and showed black NaN fringes on HDR ribbons (fixed: ribbon profile clamped). ACES/AgX stay selectable.
- **Allocations:** FX kit update with ~100 live sprites, bolts and debris: 20-26 B per update steady state with
  `--enable-precise-memory-info` (was ~400 B: three.js empties `updateRanges` after each upload, so the sprite pool now
  uploads whole buffers); heap returns to baseline after GC.
- **Checks:** `npm run build` exit 0 (lookdemo.html is dev-only, the game bundle does not include the kit yet);
  browser-qa boot, poly-budget (15.9k tris / 13 calls in the current game build), console-errors PASS; ad-ui PASS and
  ad-ui-style finds no size/font/colour difference with the new `.btn` (LOOK: qa/wp20/game-ui-*.png).
- **Environment caveat:** SwiftShader software WebGL here (~1-5 fps) - frames judged as stills; no frame-time claim.
- **Open:** WP-31 wires `applyLook` + `FxKit` + pops into the game view (the WIP game still uses its own bolt mesh and
  the plain stage); the demo's city generator is demo-only.
