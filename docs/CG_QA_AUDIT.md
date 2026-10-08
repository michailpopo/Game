# CrazyGames Compliance Report - Storm Grid

Audit date: **2026-10-08** (launch gate) · Build: repo HEAD `dfb2848` (bundle `index-BuQj-bDC.js`) · Method: `crazygames-qa` skill, audit mode
Docs read: docs.crazygames.com/requirements (register 2026.09.11; technical page re-read 2026-10-07, see W5)

This is a record of what was checked, how and when. It is **not** an approval: only CrazyGames approves a game.
Everything browser-based ran against the **mock SDK** in headless Chromium 141 with **software WebGL** (1-9 fps),
so frame rates mean nothing here; draw calls, triangles, layout and event order do.

## Target: Basic Launch first, built for Full Launch
## Engine: three.js r186 + Vite (HTML5), single player, desktop + mobile

---

## Summary

- **Passed: 42 / 45 mandatory items**
- **Failed: 0.** The four FAILs of 2026-10-02 (covers and preview videos missing) are fixed: all five files exist and pass
  `npm run launch:check`, and were looked at by eye.
- **Cannot verify: 3** - Edge, a 4 GB Chromebook, safe areas inside the CrazyGames app (need hardware / the portal).
- **Warnings: 3** (W2, W5, W6). W1 (save lost with the Data module off), W3 (stale name docs) and W4 (harness scenarios
  failing) from 2026-10-02 and W7 (a timing-sensitive harness check, found 2026-10-08) are **fixed**.
- `npm run qa` **exits 0** on the final code (2026-10-08, HEAD `dfb2848`): static checks, build, bundle and 22 browser
  checks, 0 FAIL, 3 UNVERIFIED by design (viewports, ad-ui-style, performance - all three looked at, see below). The same
  suite also exited 0 on 2026-10-07 (HEAD `1cdf795`, before the end-orbit cloud change).

---

### ✅ PASS - Technical (12 of 15 mandatory)

- **Total size ≤ 250 MB / file count ≤ 1500**: 0.94 MB, 20 files (`check-bundle`); upload zip 378 KB.
- **Initial download ≤ 50 MB, and ≤ 20 MB for the mobile homepage**: 0.25 MB transferred up to the first `gameplayStart`
  (`browser-qa boot`). The 20 sound files (≈150 KB) load after the first input; the real SDK script is not counted (mock).
- **Relative paths only**: `check-bundle relative-paths` PASS; the only absolute URL is the required SDK `<script>`.
- **Landscape on desktop**: 12 viewports, no scroll/overflow/overlap (`viewports`); 800x450, 1920x1080, 390x844 and
  1080x1620 looked at by eye on 2026-10-07: title, hint, upgrade cards and offer buttons readable, nothing cut.
- **Mouse, keyboard, touch**: `touch` PASS (tap on an 800x450 touch device starts the run); keyboard: Space/Enter charge,
  arrows/WASD aim via `KeyboardEvent.code`, P pauses (`policy-scan key-not-code`).
- **Mobile CSS** `user-select: none` on `body`: `policy-scan` PASS.
- **iOS audio resume on a user gesture**: `src/core/audio.js` resumes a suspended/interrupted context on `pointerdown`,
  `touchend`, `keydown`, `click`. Code review only; not tested on an iPhone.
- **Physics identical at 60/144/165 Hz**: fixed-step simulation, `sim-health` determinism exact, step-size drift 0.00%.
- **SDK `gameplayStart` / `gameplayStop`** at real boundaries: `sdk-events` PASS (init > loadingStart > hasAdblock >
  loadingStop > gameplayStart > gameplayStop > happytime); `tab-hidden` PASS (no `gameplayStop` on focus loss; pauses,
  silences, flushes the save).
- **Data module (progress save)**: `persistence` PASS both ways - Data module on: reload keeps city 2 / 470 coins via
  `crazygames-data`; Data module disabled: reload keeps city 2 / 470 coins via `localStorage` (this is the W1 fix; the
  same check FAILED on the old code, so it would catch a regression).
- Also PASS: `no-sdk`, `sdk-disabled`, `sdk-init-hang` (playable after 12 s when init never resolves), `console-errors`.
- N/A: sitelock (none), User module / accounts (none), user-consent notice (no analytics, no `fetch`/XHR beyond the
  game's own sound files, no personal data).

### ✅ PASS - Gameplay (11 of 11 mandatory)

- **Legible at devicePixelRatio 1**: see viewports above; smallest UI text 12 px (upgrade cards, FREE chip).
- **English localization**: English-only, SDK locale read with English fallback.
- **Controls / restricted keys**: Escape and Ctrl combos never bound (`policy-scan`); AZERTY safe.
- **Original assets**: everything 3D is built from code primitives; sounds are Kenney CC0 recordings
  (`src/assets/sfx/*`, built by `tools/audio/build-sfx.mjs`), ZzFX (MIT), three.js (MIT), Lilita One (OFL) - all in
  `docs/ASSET_MANIFEST.md`, notices in `public/LICENSES/` (`licenses` PASS: 20 shipped files, all in the manifest).
- **Original name**: "Storm Grid" re-checked 2026-10-07: CrazyGames search API `q=storm grid` -> no results,
  `crazygames.com/game/storm-grid` -> 404, web search -> no game of that name (`docs/ORIGINALITY.md`).
- **No custom fullscreen, no cross-promotion, no app-store links**: `policy-scan` PASS (the one external URL string is a
  comment in `zzfx.js`).
- **PEGI 12**: lightning on a toy city, no people harmed, no gambling with money, no chat. CrazyGames makes the final call.
- **Land in gameplay in ≤ 1 click**: the page opens on the live city; the first press starts the run and the first charge.

### ✅ PASS - Advertisements (15 of 15 mandatory; banners N/A)

- **Only CrazyGames SDK ads**: `policy-scan external-ads` PASS.
- **Never interrupts gameplay / natural breaks only**: rewarded offers only on the result dialog, the city intro, the
  shop and the post-cascade "One more strike" offer; midgame only on "Next city"/"Retry" from city 4.
- **Paused and blocked during an ad**: `ads-slow-fill` PASS (4 s fill: blocker visible, pause `menu+ad`, still city 1).
- **Muted on `adStarted`, not on request; unmuted after**: `ads-fill` PASS, now event-ordered (samples the state right
  after `adRequested`, `adStarted`, `adFinished`): overlay during the request, muted only between start and finish,
  coins 470 -> 1410 (x3 granted inside `adFinished`).
- **`adError` / unfilled -> game continues, no reward**: `ads-basic-launch` PASS (reward on error = false, dead offer removed).
- **Rewarded rules**: 7 surfaces, each capped (`src/game/offers.js`); one ad in flight; no midgame after a rewarded in
  the same break; `revive-offer` funnel `shown > expired > shown > rewarded`, none offered after.
- **Rewarded button not on an active gameplay screen**: `ad-ui` PASS (nothing at +0.3 s and +1.5 s of a run; see W2).
- **A non-video alternative always exists**, **decline same size/font/colour, video icon**: `shop` PASS;
  `ad-ui-win.png` (Claim / Claim ×3) and `ad-ui-fail-revive.png` (Finish / One more strike) looked at 2026-10-07: equal
  buttons, camera icon on the video one, "Finish" visible from the first frame.
- **AdBlocker**: `adblock` PASS (offers hidden, "Unavailable with an ad blocker", fully playable).
- **Works with ads disabled (Basic Launch)**: `ads-basic-launch` PASS.

### ✅ PASS - Game covers and preview video (4 of 4 mandatory, were FAIL)

- **Covers** `submission/covers/landscape-1920x1080.png`, `portrait-800x1200.png`, `square-800x800.png`
  (`npm run launch:covers`, 2026-10-07): the real game rendered at 2x and downscaled, city 12 half-powered with the
  forked bolts held on screen, the title as the only text, no borders, no logos, sharp. Looked at all three: same
  composition and style, readable at thumbnail size. `launch:check` PASS (exact sizes).
- **Preview videos** `submission/video/landscape-1920x1080.mp4`, `portrait-1080x1620.mp4` (`npm run launch:video`):
  the cover as the first 0.6 s, then deterministic real gameplay (city 12 cleared at 98%, then a cut to city 22, the neon
  bay island); no sound stream, no cursor (headless), no promo text, no black frames, not sped up. `launch:check` PASS
  (resolution, 15-20 s, ≤ 50 MB, silent).
- `docs/STORE_METADATA.md` filled: title, short and full description, controls, portal settings, upload steps.

### 📋 CANNOT VERIFY (3 mandatory)

- **Works on Chrome and Edge**: tested only in headless Chromium 141. → open the portal preview once in Edge.
- **Smooth on a 4 GB RAM Chromebook**: evidence only - ≤ 45 draw calls and ≤ 56.6k triangles per frame in a 300-building
  city (budget 60 / 60k; a one-off 65k frame when the static shadow map re-bakes after a quality change), pixel ratio
  capped, adaptive quality. `performance` stays UNVERIFIED by design (software renderer). → test on a Chromebook or the preview.
- **Safe areas inside the CrazyGames app**: `env(safe-area-inset-*)` applied; only visible in the app. → check there.
- Not mandatory but also unverified: **all sounds** (Claude cannot hear - the owner must audition them), touch feel on a
  real phone, real-SDK behaviour (the portal preview shows it), Safari/iOS.

---

### ⚠️ WARNING

- **W2 - Rewarded buttons sit on the city intro screen (borderline, low risk).** "+2 strikes" (video), "FREE" upgrade and
  the daily gift are shown over the live city before the first strike, while `gameplayStart` has not fired and the
  simulation is idle. A reviewer could still read the live city as the gameplay screen. → if CrazyGames objects, move the
  offers behind one "Boost" button; no change now.
- **W5 - CrazyGames docs changed since the register (2026.09.11).** `check-docs-freshness` flags `cg-technical` and
  `cg-sitelock`. The technical page body is identical to the 2026-10-02 copy; every number in `references/technical.md`
  still matches. The register in the skill folder was not bumped.
- **W6 - Flashing effects (advisory).** FULL POWER sweeps a white flash; every strike flashes. Fine for PEGI 12; worth a
  look at frequency/area for photosensitive players.
### Fixed since 2026-10-02

- **W1** save fallback (`src/core/save.js`): with the Data module unavailable the service now re-picks `localStorage`
  and reads it, so progress survives a reload. Proven by `persistence` (FAIL on the old code, PASS now).
- **W3** names: `ORIGINALITY.md`, `ASSET_MANIFEST.md`, `STORE_METADATA.md` say Storm Grid; name re-checked 2026-10-07.
- **W4** harness: `persistence` closes page 1 before page 2 and asserts the Data-module-off reload; `ads-fill` is
  event-ordered; `npm run qa` exits 0.
- **W7** harness timing (2026-10-08): after the container moved to a slower host, the result dialog took 7.9-8.3 s of
  wall time against an 8 s limit (the build before the cloud change failed the same way - not a game regression), and
  the crashed scenario's live WebGL page starved the rest (16 cascading FAILs). Now a crashed scenario's pages are always
  closed, game-time waits allow 30 s (`RESULT_MS`), and `revive-offer` polls for the countdown drop.

### Quality guidelines (advisory)

- Onboarding is in gameplay; controls shown per input type. Goals visible (% powered, plates x2/x3/x5/x10); retry instant.
- Progression (2026-10-07): an average player reaches city ~18 after 5 min and maxes all upgrades after ~2 h
  (`tools/qa/economy-sim.mjs`), cities never end.
- Open for the owner: how the sounds feel, whether it is fun over a long session.

---

## Next actions (the owner; Claude never logs in or uploads)

1. Upload `submission/storm-grid-build.zip` (or the contents of `dist/`) as a new HTML5 game; paste texts from
   `docs/STORE_METADATA.md`; upload the 3 covers and 2 videos.
2. Settings: landscape + portrait, mobile yes, **Progress Save = Data Module ON**, multiplayer no.
3. In the portal preview: play a few cities on desktop (also in **Edge**) and on a phone, **listen to every sound**,
   and read the preview's SDK messages. Paste any QA feedback to Claude.
