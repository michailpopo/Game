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

## WP-30 notes - Storm Grid 3D core (threejs-game-engineer, 2026-09-26)
Replaces Comet Chain in `src/game/` (body-mesh, controls, space-mesh, values deleted). Numbers from docs/GAME_BRIEF.md,
all in `src/config.js` `STORM` / `OFFERS`; the title lives in `GAME.title`, i18n `title` and index.html only.
- **Sim (`src/game/sim.js`, pure):** seeded generator (N = min(300, round(24 x 1.1^(c-1))), x0.85 on each theme's first
  city, 3x3 / 4x4-lot districts, 9 m lots +-1.2 m, avenues 4 -> 12 m, parks 10 -> 25%, heights 12 -> 24..60 m, tip =
  roof + 3 m; ramps hold after city 40, cities never run out). Which lots get the N buildings: park roll first, then
  the lots nearest the centre win (compact skyline) - the one rule the brief leaves open. Charge is a function of sim
  time since the press; WEAK / CHARGED / SUPERCHARGE (2 bolts x floor(1.3 E0)) / HOT; 0.35 s past full auto-fires a
  FIZZLE (3 hops, no forks) at its exact time, then the button must be let go. Event-timed cascade (nearest unlit tip
  within R in 3D, hop 0.08 + 0.07 x (1 - e/e_strike) s, forks ceil(0.6 (e-1)) each, gold x10 / always fork / +4).
- **sim-health:** 3 strikes (SUPERCHARGE, WEAK tap, hold-to-FIZZLE) at 30/60/120/240 Hz: drift 0.00%, determinism exact;
  selftest (charge +0.004 per step) detected at 37.5% drift.
- **Balance (Node sweep, QA autopilot = always SUPERCHARGE on the densest dark area, 20 seeds, the brief's typical
  upgrades):** city 1 94% (coins 343), city 5 93% (369), city 10 95% (1,267), city 20 92% (4,689), city 40 62%
  (8,842). Brief (average / skilled): 90-94 / 96-99%, city 40 56 / 60%. Cascades are short on small cities (city 1:
  ~7 hops, 0.6 s per strike) - the brief's hop times; `STORM.chain.hopFast/hopSlow` is the knob.
- **Browser QA (SwiftShader, this container):** required set boot, sdk-events, no-sdk, touch, poly-budget (max 16k tris /
  13 calls, heaviest = bolt ribbon pool 4,800 tris, the one hero geometry), dead-air (longest silence 1.0 s), tab-hidden,
  revive-offer, ad-ui PASS; viewports and ad-ui-style UNVERIFIED (looked at: no overlap, text >= 12 px). Full harness:
  0 FAIL. GPU memory stable over 5 city rebuilds (10 geometries, 5 textures).
- **Harness adapters (tools/qa/browser-qa.mjs):** revive-offer - "One more strike" is offered at `__GS_QA__.reviveAt`
  (85-99% powered), its decline is `finish`, and a low run goes to the city result (Retry) instead of a respawn;
  ad-ui - the fail moment uses `reviveAt`; ads-fill / ads-slow-fill - `runs=2` (the first city result has no video
  offer, GAME_BRIEF).
- **QA hooks added:** `reviveAt`, `setHold`, `setAim`, `freeze`, `freezeWhen({charge|bolts|district})`, `frozen`,
  `?up=v,f,s,c,g` fixture. Screenshots: qa/wp30/{ready,charging,fork,district,result}-{1280x720,450x800}.png.
- **Plain city (planner, 2026-09-26):** the facade window shader and streetlights are gone - one instanced box per
  building whose colour is its lit state (dark -> white flash -> the theme's lit colour), antenna tips, gold-rod glows.
  The view API for the restyle (buildings with position/size/`roof`/district, lit state, every event and its payload)
  is documented at the top of src/game/sim.js.
- **Known:** plain materials + own bolt mesh until WP-31 wires the look kit; the storm front is placeholder puffs; the
  result dialog covers the city in portrait (the orbit shows ~1.3 s before it); English only (German dropped rather than
  shipped unchecked); sounds are unauditioned ZzFX.

## WP-21 notes - city restyle from hit references (game-feel-artist, 2026-09-27)
Owner feedback on the WP-20 frame: "UI looks great, the city still looks too AI-generated - take inspo from liked HTML5 games,
do not overcomplicate". UI untouched; the city look was rebuilt as a toy city.
- **Reference study (reference only, never shipped; `qa/refs/`, gitignored):** cover + 3 preview-video frames each of
  Holey.io Battle Royale, Slice Master, Cubes 2048.io (video: Cubes 2048 Royale - the page only serves that clip), Paper.io 2,
  Tile Jumper 3D, Harvest.io, Smash Karts, PolyTrack (URLs from each page's `__NEXT_DATA__`, frames with imageio-ffmpeg).
  Contact sheet: `qa/refs/contact.png` (copy in `qa/wp21/refs-contact.png`).
- **Visual rules they share:**
  1. High-key, clean backdrop: a flat light floor or a simple sky; no haze, no fog veil, no bloom wash. 7 of 8 are bright;
     only Tile Jumper is dark neon.
  2. Few big flat colour areas: 3-5 hues per frame. The world is one or two calm colours (white/grey floor, navy, sand,
     grass); objects are saturated candy colours. No texture noise.
  3. Toy shape language: chunky primitives with rounded or bevelled edges (bombs, karts, cubes, donuts, tractors), big
     readable silhouettes, very little small detail, objects large on screen.
  4. Simple soft shading: flat-ish diffuse with one directional light and a clear soft shadow that grounds everything;
     glow only on the one special thing (none shows a bloom veil).
  5. Contrast: the interactive thing is the most saturated or brightest element, often ringed or outlined (Holey's green
     ring, Cubes' bright snake on navy, Harvest's purple tractor on yellow).
  6. Clean frames with negative space: big empty ground, few props (ball/cone trees, box cars), minimal HUD.
  7. Camera: elevated 3/4 or top-down, close enough that each object reads at thumbnail size; mild perspective.
- **Applied:** 55 chunky buildings in 6 types (chamfered bodies, 4 roof kinds: flat rim, stepped, dome, spire, plus
  pyramid-roof houses), window BANDS instead of grids; unlit = calm grey-blue #8690b6, lit = one candy colour per
  building (yellow, coral, pink, green, orange, purple - never cyan) that floods up from the ground with a bright fill
  line; dusk sky (deep blue over a peach horizon, `BACKDROPS.dusk`); green field with a tree ring; rounded sidewalks,
  lane dashes, 14 box cars, parks with ball/cone trees; one soft low sun shadow; bloom threshold 2.2 so only the bolt
  core and halos glow (at 1.05 the lit windows bloomed into a pink veil in portrait). The neon night city, wet-street
  reflection, beacons and window grids are gone from the demo (the materials stay in the kit).
- **Budgets (hero frame 1280x720, profile M <= 60 calls / 60k tris):** low 19 calls / 34.1k tris; medium 19 / 34.1k
  steady, 28 / 57.3k on a static-shadow refresh frame; high and ultra 33 (19 scene + 14 post) / 34.1k, 42 / 57.3k on a
  shadow refresh; animated strike max 33 / 34.8k. Heaviest geometry: ribbon pool 1,920; building types 132-534 tris.
  The outer tree ring does not cast shadows (with it casting, the refresh frame was 66.8k).
- **Checks:** `npm run build` exit 0; browser-qa boot, poly-budget, console-errors PASS (the game build does not import
  the kit yet); live demo runs without console errors.

## 2026-10-01/02 session notes - verification of WP-31/32 and polish (planner, direct work)

> **Update 2026-10-02 (later):** the owner asked for the old game back ("the old version of the game was good, make it like it was"). Every look /
> sound / UI change described below (toon bolt, bright light, docked dialogs, candy roofs, audio limiter, coin ticks, playtest switches) was
> reverted - `src/` is the 2026-09-28 game (`d575418`) plus two QA-only hooks; the changes live in git history (`d93d18d`, `e7cbd85`,
> `aa11079`, `1ab9a22`, `926cb82`). The harness / tool changes below stay. The final audit is in the last section.

**Why the last handoff showed 9 FAIL:** not game bugs. (1) The container draws WebGL in software (0.3 s per frame at the `low`
tier, 1.2 s at `high`), so the sim, the countdown rings and the harness's own waits drifted apart. (2) A scenario that crashed
never closed its browser page; the page kept drawing and starved the next scenario, which crashed too (the "cascade").
(3) `ads-fill` read the audio state after fixed sleeps, so a slow frame moved a reading across `adStarted` / `adFinished`.
(4) A second harness started by accident ran at the same time and halved everyone's CPU. Evidence: isolated `ads-fill`,
`persistence`, `poly-budget` all PASS on the unchanged game code once the harness was fixed.

**Harness changes (tools/qa/browser-qa.mjs):** every context is closed when its scenario ends; logic / UI scenarios open the
game in *lite mode* (`?quality=low&renderEvery=1500`: the 3D scene is drawn once per 1.5 s, the simulation runs in real time);
`gl: "low"` for the viewport shots, `gl: "full"` + `quality=high` for `poly-budget` (worst case: post passes count as draw
calls), `quality=low` for `performance`; `ads-fill` is event-driven (the page records audio mute / overlay / pause right after
each SDK ad event); long timeouts. New scenarios: `input-strike`, `context-loss`, `no-webgl`, `cpu-cost`, `pause-keys` (and a short-lived `bolt-styles`, removed with the toon bolt).
New tools: `tools/qa/shoot.mjs` (stills, 30 fps filmstrip, live look-dev tweaks), `tools/qa/soak.mjs`.

**Looked at (screenshots, not scripts):** ready / charge / supercharge / fork / block powered / result / so-close / shop /
returning-player screens at 1280x720, 800x450, 450x800 and the 12 CrazyGames viewport sizes; filmstrips of the first strike
for both bolt styles. Findings fixed: lit roofs and caps washed to dusty pastel (35-40% white mix) -> candy colour; centred
dark-veil dialogs and shop hid the lit city -> docked beside it with the camera framing the city; veils too heavy.
Findings left: the storm cloud is cut by the top edge in the run framing (reads as dark puffs, fine); the dark violet ground
plate is heavy (part of the established look - the optional `bright` light softens it).

**Not verifiable here (needs the owner / the portal):** sounds (nobody has heard them), real-device frame time (4 GB
Chromebook, phone), Edge / Safari / iOS audio resume, the CrazyGames app safe areas, Developer Portal preview and the
Progress Save toggle, whether the game is fun.

### 2026-10-02 final audit run on the restored old game (build `1e4c4dd4a1d7`)

- Full harness: **27 checks, 0 FAIL, 2 WARN**, 3 "need eyes" (viewports, ad-ui-style, performance). Viewport and ad-ui screenshots were
  looked at and recorded as manual evidence (`tools/qa/manual-evidence.sh`, 22 entries); `performance` stays open (no real low-end
  device). `docs/CG_QA_AUDIT.md` has the full report in the crazygames-qa format; `COMPLIANCE_REPORT.md` the register view
  (52 PASS, 0 FAIL, 11 UNVERIFIED, 2 PORTAL). Soak: 20 cities, 221 s, heap 11 -> 12 MB, DOM 327 -> 287, GPU geometries 19 -> 19,
  textures 4 -> 4, no console error.
- **Real defects in the old game, reported as WARN (`KNOWN_ISSUES` in `tools/qa/browser-qa.mjs`), not fixed:** (1) P pauses a run but cannot
  resume it - a paused game does not step, and the P handler lives in `update()`; click / tap resumes. Scenario `pause-keys` reproduces
  it (it also failed on the old code before the fix commit `1ab9a22`, and passed after). The first soak run "softlocked" in that pause;
  the soak now resumes by click. (2) No WebGL: endless loading bar with no message (`no-webgl`, fix `e7cbd85`). (3) `thunder` and `fail`
  clip (+2.3 / +3.3 dBFS), computed from the ZzFX sample peaks times the 0.9 SFX gain (fix `926cb82`). (4) After a WebGL context loss +
  restore the picture is ~10% darker (115 -> 104 mean luminance; `context-loss` passes at >= 70%; fix in `e7cbd85`).
- **Harness metric fixed:** `context-loss` compared three.js' render-frame counter with the value from before the loss, but three.js
  builds a fresh `WebGLInfo` when the context is restored, so the counter restarts at 0 (a false FAIL once); it now samples after the
  restore. Requirement mapping: `adblock` also covers CG-ADS-018, `ads-basic-launch` CG-ADS-019, `sdk-events` CG-SDK-006/007;
  `cpu-cost` no longer claims CG-TECH-008 (a proxy must not turn a Chromebook requirement green). The `bolt-styles` scenario and the
  `boltlab` screenshot shots were removed with the toon bolt.
- Numbers: boot 2.8 s / 0.22 MB; poly 9.5k tris / 35 calls (high tier); 2.7 ms/frame main thread at 4x CPU throttle; longest silence in
  play 0.4 s; dist 0.76 MB, 6 files.
