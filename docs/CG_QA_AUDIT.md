# CrazyGames Compliance Report - Storm Grid

Audit date: **2026-10-02** · Build: `dist` hash `8ef33913ddb4` (repo HEAD `d575418` + report refresh) · Method: `crazygames-qa` skill, audit mode
Docs read: docs.crazygames.com/requirements (technical re-fetched 2026-10-02; register 2026.09.11, see W5)

This is a record of what was checked, how and when. It is **not** an approval: only CrazyGames approves a game.
Everything browser-based ran against the **mock SDK** in headless Chromium 141 with **software WebGL** (1-9 fps),
so frame rates mean nothing here; draw calls, triangles, layout and event order do.

## Target: Full Launch
## Engine: three.js r186 + Vite (HTML5), single player, desktop + mobile

---

## Summary

- **Passed: 38 / 45 mandatory items**
- **Failed: 4** - all four are the cover/video submission assets that do not exist yet (WP-13). No code requirement fails.
- **Cannot verify: 3** - Edge, a 4 GB Chromebook, safe areas inside the CrazyGames app (need hardware / the portal).
- **Warnings: 6** - the one that matters for players is **W1** (progress lost when the Data module is off).
- Corrects the 2026-09-28 handoff: `ads-fill` is **not** a game bug and `persistence`, `poly-budget` and the other crashes
  are **not** WP-31/32 regressions (see "Test-tool findings"). Verdict on the code: no mandatory CrazyGames rule is violated.

How each check was made: `npm run qa:fast` (static), `tools/qa/browser-qa.mjs` (full run, then `--only` re-runs),
screenshots in `qa/shots/*.png` read by eye, and four throw-away Playwright probes for event order, keyboard play and
the Data-module fallback (described under each item; they are not in the repo).

---

### ✅ PASS - Technical (12 of 15 mandatory)

- **Total size ≤ 250 MB / file count ≤ 1500**: 0.76 MB, 6 files (`check-bundle`, 2026-10-02).
- **Initial download ≤ 50 MB, and ≤ 20 MB for the mobile homepage**: 0.22 MB transferred up to the first `gameplayStart`
  (`browser-qa boot`). The real SDK script is not counted (mock), a few KB at most.
- **Relative paths only**: `check-bundle relative-paths` PASS; the only absolute URL is the required SDK `<script>` in `index.html`.
- **Landscape on desktop**: all desktop viewports render the game full-frame, no scroll/overflow/overlap at 12 sizes (`viewports`).
- **Mouse, keyboard, touch**: touch tap on 800x450 starts the run (`touch` PASS). Keyboard-only probe: Space held ->
  run starts, `gameplayStart` reported; released -> strike fires (strikes 3 -> 2, 3 buildings lit); arrows aim; P pauses.
- **Mobile CSS** `user-select: none` on `body` (+ `-webkit-touch-callout`, tap highlight off): `policy-scan` PASS, `index.html:13`.
- **iOS audio resume on a user gesture**: `src/core/audio.js:93-99` resumes a suspended/interrupted context on
  `pointerdown`, `touchend`, `keydown`, `click`. **Code review only; not tested on an iPhone.**
- **Physics identical at 60/144/165 Hz**: fixed-step simulation, `sim-health` determinism exact, step-size drift 0.00% at
  30/60/120/240 Hz; policy scan: no `Math.random`/clock reads in the simulation.
- **SDK `gameplayStart` / `gameplayStop`** at real boundaries: `sdk-events` PASS (order: init > loadingStart > hasAdblock >
  loadingStop > gameplayStart > gameplayStop); `tab-hidden` PASS (no `gameplayStop` on focus loss; pauses, silences, flushes the save).
- **Data module (progress save)**: with the Data module on, reload keeps level and coins (probe: coins 470, level 2, provider
  `crazygames-data` before and after reload). **Its fallback is broken - see W1.**
- Also PASS: `no-sdk`, `sdk-disabled`, `sdk-init-hang` (game playable after ~12 s when init never resolves), `console-errors` (0 errors across all scenarios).
- N/A: sitelock (none implemented), User module / accounts (`has-accounts: false`), user-consent notice (no analytics, no
  `fetch`/XHR, no personal data beyond SDK events).

### ✅ PASS - Gameplay (11 of 11 mandatory)

- **Legible at devicePixelRatio 1**: read by eye at 821x462, 907x510, 1080x607, 800x450, 1216x684, 1280x720, 1920x1080
  (landscape), 390x844 and 1080x1620 (portrait). Smallest UI text is 12 px (upgrade cards, FREE chip); title, hint and
  buttons are clearly readable. Not looked at individually: 1077x606, 1366x768, 1536x864 (same layout, between sizes already seen).
- **English localization**: English-only (`src/core/i18n.js`), SDK locale read with English fallback. No translations, so nothing to be inaccurate.
- **Controls / restricted keys**: Escape and Ctrl combos are never bound; Space/Enter, arrows/WASD via `KeyboardEvent.code`
  (AZERTY safe), P, M (`policy-scan`).
- **Original assets**: 0 shipped asset files; ZzFX (MIT), three.js (MIT), Lilita One (OFL via @fontsource) all in `docs/ASSET_MANIFEST.md`, notices in `public/LICENSES/`.
- **Original name**: "Storm Grid" - CrazyGames search API and Poki sitemap showed no game of that name on 2026-09-26
  (`docs/ORIGINALITY.md`). Eight days old, not re-checked today - see W3.
- **No custom fullscreen button**, **no cross-promotion** (`window.open` absent), **no app-store links**: `policy-scan` PASS. The only external URL string is a comment in `zzfx.js`.
- **PEGI 12**: content review of all strings and visuals - lightning on a toy city, no people, violence, gambling, drugs or
  language. The "Random" bolt unlock costs earned in-game coins only (no IAP, `iap: false`). CrazyGames makes the final call.
- **Land in gameplay in ≤ 1 click**: the page opens on the live city; the first press on the city starts the run and the
  first charge in the same press (`boot` + `boot-first-run.png`). 0 menu clicks.

### ✅ PASS - Advertisements (15 of 15 mandatory; banners N/A)

- **Only CrazyGames SDK ads**: no third-party ad network in source or bundle.
- **Never interrupts gameplay / natural breaks only**: ads are requested only from the result dialog ("Claim", "Retry"),
  the pre-run city intro, the shop and the post-cascade "One more strike" offer, where `gameplayStop` has already been
  sent. Midgame only on "Next city"/"Retry" from city 4, never on navigation or opening the shop (`src/main.js:459`, `ads.js`).
- **Paused and blocked during an ad**: `ads-slow-fill` PASS - 4 s fill: blocker visible, pause reasons `menu+ad`, a click is eaten, still on level 1.
- **Muted on `adStarted`, not on request; unmuted on finish/error**: **PASS, proven by an event-ordered probe** (mock ad,
  2.5 s delay): `adRequested` -> `adMute=false`; `adStarted` -> `adMute=true`; `adFinished` -> `adMute=false`. On
  `adError`: never muted. Code: `ads.js:117-123` mutes only from `onStarted`. The harness scenario `ads-fill` fails for a test-timing reason (see below).
- **`adError` / unfilled -> game continues, no reward**: probe, `adError` mode: coins 470 -> 470 and play continues; `ads-basic-launch` PASS (reward granted on error = false, dead offer removed).
- **Rewarded rules**: 7 surfaces, each with a cap or cooldown (`src/game/offers.js`); reward granted only inside `adFinished`
  (`ads.js:92-94`); probe with a filled ad: coins 470 -> 1410 (x3). No chaining: one ad in flight, and a midgame never
  follows a rewarded in the same break (`CG-ADS-010/015`; `revive-offer` funnel `shown > expired > shown > rewarded`).
- **Rewarded button not on an active gameplay screen**: `ad-ui` PASS - no offer visible at +0.3 s and +1.5 s of a run (but see W2).
- **A non-video alternative always exists**: Claim (no video), coin price for upgrades, "+2 strikes 60 coins" next to the
  video, "Random 250 coins" next to "+55" in the shop (`shop` PASS, `ad-ui-win.png`, `shop.png`).
- **Decline same size/font/colour, video icon on every video button, no hidden or delayed skip**: seen in
  `ad-ui-win.png` (Claim / Claim ×3), `ad-ui-fail-revive.png` (Finish / One more strike - the ring only removes the offer,
  "Finish" is visible from the first frame), `ad-ui-ready.png`, `shop.png`. At most 2 video buttons per screen (`maxVideoOffersPerScreen`, enforced at `main.js:495`).
- **Out-of-lives rewarded not every time**: "One more strike" once per session and only at 85-99% powered; `revive-offer` PASS.
- **AdBlocker**: `adblock` PASS - video offers hidden, notice "Unavailable with an ad blocker", game fully playable (`adblock-result.png`).
- **Works with ads disabled (Basic Launch)**: `ads-basic-launch` PASS.
- N/A: in-game banners (none in v1).

---

### ❌ FAIL - Game covers and preview video (4 mandatory, not produced)

- **Landscape cover 1920x1080, portrait cover 800x1200, square cover 800x800**: do not exist (`submission/` folder is absent; `tools/launch/capture-covers.mjs` exists but was never run).
  → FIX: `npm run launch:covers`, then look at all three (no borders, no "Play" text, only the title, not blurry, same style).
- **Preview video, landscape 1080p and portrait 1080x1620, 15-20 s, ≤ 50 MB, no sound, no cursor, no promo text**: not produced.
  → FIX: `npm run launch:video`, then `npm run launch:check`. This is WP-13, which needs the owner's visual sign-off first (HANDOFF section 3, items 1-3).
- `docs/STORE_METADATA.md` is still the unfilled template ("Working Title"). → FIX: fill title, descriptions, controls and the portal settings (Progress Save **on**, orientations, mobile).

### 📋 CANNOT VERIFY (3 mandatory)

- **Works on Chrome and Edge**: tested only in headless Chromium 141. Edge shares the engine but was not run. → open the build once in Edge.
- **Smooth on a 4 GB RAM Chromebook**: not testable here. Evidence only: 18-32 draw calls and 7.9k-10.5k triangles per frame
  (budget 60 / 60k), pixel ratio 1, adaptive quality present. The 4x-throttle timing (p95 1133 ms) is from a software
  renderer and says nothing about real hardware (`performance` stays UNVERIFIED by design). → test on a Chromebook or in the portal preview.
- **Safe areas inside the CrazyGames app**: `env(safe-area-inset-*)` is applied (`styles.css:25,162`; `in-app` class), but
  its effect on a notched phone in the app can only be seen there. → check in the portal preview / app.
- Not mandatory but also unverified: all sounds (Claude cannot hear - the owner must audition them), touch feel on a real phone,
  real-SDK behaviour (only the portal preview shows that CrazyGames accepts the integration), Safari/iOS.

---

### ⚠️ WARNING

- **W1 - Progress is lost on reload when the Data module is off (P2, 3-line fix).** `src/core/save.js`. If the submission has
  "Progress Save" off (or the Data module is unavailable), the first read fails, the service silently falls back to
  `localStorage` for **writes**, but on the next start it picks the Data module again, its read fails again, and the game
  starts from defaults while the real save sits unread in `localStorage`. Reproduced: session 1 ends with 470 coins / city 2
  in `localStorage`; after reload the game boots with provider `crazygames-data`, `loadedFrom: defaults`, 0 coins, while
  `localStorage` still holds the 470. The `persistence` test cannot catch this: it only checks the provider name after one session.
  Does **not** break a CrazyGames rule while Progress Save is enabled (verified: reload keeps progress through the Data module),
  but it silently wipes every player's progress if that checkbox is forgotten.
  → FIX (not applied, audit only): in `SaveService.init`, after `this.load()`, add
  `if (this.#provider instanceof DataModuleProvider && !platform.dataAvailable) { this.#pickProvider(); this.load(); }`.
  → ALSO: tick **Progress Save** in the portal submission.
- **W2 - Rewarded buttons sit on the city intro screen (borderline, low risk).** "+2 strikes" (video), "FREE" upgrade and the
  daily-gift icon are shown over the live city before the first strike. `gameplayStart` has not fired yet and the simulation
  is idle, so this is a pre-run menu state and `ad-ui` agrees; a CrazyGames reviewer could still read the live city as the
  "gameplay screen". → SUGGESTION: if CrazyGames objects, move the offers behind one "Boost" button; no change needed now.
- **W3 - Stale docs and a name check that is 8 days old.** `docs/ORIGINALITY.md` is still titled "Volt City (name under
  review)" and its side-by-side test was never done; `docs/ASSET_MANIFEST.md` and `docs/STORE_METADATA.md` still say "Working Title".
  → FIX: update them, re-run the name search for "Storm Grid" right before upload (CrazyGames search + a web search), and do the side-by-side with City Surge.
- **W4 - Two harness scenarios still fail on a correct game (`npm run qa` exits 1).** See "Test-tool findings".
- **W5 - CrazyGames docs changed since the register (2026.09.11).** `check-docs-freshness` reports `cg-technical` and
  `cg-sitelock` as changed. I re-read the technical page: every number and rule in `references/technical.md` still matches
  (250 MB, 1500 files, 50/20 MB, Chrome/Edge, 4 GB Chromebook, user-select, safe areas, iOS audio). One wording shift: the
  live page now marks the **User module** as optional and no longer marks **loadingStart/Stop** as optional; the game
  already sends both (`sdk-events` PASS). The sitelock page has no effect (no sitelock). The register in the skill folder
  was not changed or bumped.
- **W6 - Flashing effects (advisory, not a CrazyGames rule).** FULL POWER sweeps a white flash over the city and bolts flash
  on every strike. Fine for PEGI 12, but worth a look at frequency/area for photosensitive players when the owner plays it.

### Quality guidelines (advisory)

- Onboarding is in gameplay and cannot be blocked (hint "Hold to charge, release to strike" over the live city); controls are shown per input type (mouse / finger / keys).
- Goal is visible (% powered, plates x2 / x3 / x5 / x10); retry is instant; buttons are honestly labelled (offer and decline look the same).
- AZERTY: aiming keys are physical, the hint shows the layout's labels.
- Open for the owner, not for Claude: how the audio sounds and feels, whether the bolt is bright enough and the lit buildings read as candy colours (HANDOFF section 3 items 1-3 were not re-judged here), whether it is fun.

---

## Test-tool findings (the handoff's "regressions" were not regressions)

The 2026-09-28 handoff recorded 9 FAIL. Re-run on 2026-10-02: the same set fails in the full run (`touch` now passes), but
each failure was traced:

| Scenario | Full run | Cause found | Game behaviour |
|---|---|---|---|
| `ads-fill` | FAIL | Fixed `sleep()`s in the scenario sample the "requested" state after `page.click` has already returned late (software renderer); evidence shows `adMute` already true at the first sample and false at the second, i.e. the whole ad passed between samples | Correct: event-ordered probe shows mute after `adStarted` only |
| `persistence` | FAIL | The scenario keeps page 1 open while page 2 starts; two live WebGL pages starve each other in software GL (page 2's result dialog: 49 s with page 1 open, 6.2 s with it closed, harness waits 8 s). The crash also skips `ctx.close()`, so two WebGL pages stay alive for the rest of the run | Reload keeps level/coins with the Data module on (OK). Its Data-module-off half is too weak and hides W1 |
| `poly-budget`, `dead-air`, `ad-ui`, `revive-offer`, `shop`, `performance` | FAIL (30 s boot timeout) | Cascade from the leaked pages above | All PASS when re-run without `persistence` (see numbers below) |

Re-run results (`--only poly-budget,dead-air,ad-ui,revive-offer,shop,performance`, 2026-10-02): poly-budget PASS (max 10,541 tris
/ 32 draw calls, budget 60,000 / 60), dead-air PASS (3.2 feedback events/s, longest silence 1.5 s, budget 3 s), ad-ui PASS,
ad-ui-style looked at and OK, revive-offer PASS, shop PASS, performance UNVERIFIED (software renderer), console-errors PASS.

→ FIX (not applied, audit only): in `browser-qa.mjs` close page 1 / its context before opening page 2 in `persistence` and add a
reload assertion for the Data-module-off case (it would have caught W1); in `ads-fill` replace the fixed sleeps with an
event-ordered check (poll `audio.adMute` against the mock's `__CG_MOCK_ON_RECORD__` hook, or use `mockAdDelay` ≥ 3000);
wrap each scenario's context in `try/finally` so a crash cannot starve later scenarios.

---

## Next actions (in order)

1. Owner decides whether I apply the three small fixes: W1 in `save.js`, the two harness fixes. Then `npm run qa` should exit 0.
2. Owner looks at the bolt/colour items from HANDOFF section 3 and plays a build (Gate 2): first try, when it got fun, when they wanted to stop; audition the sounds.
3. Launch package (WP-13): covers, videos, `STORE_METADATA`, name re-check; then re-run the covers section of this audit.
4. Owner uploads (Claude never logs in or submits): tick Progress Save, choose orientations, check the portal preview in Edge and the CrazyGames app.
