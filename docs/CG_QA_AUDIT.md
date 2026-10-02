# CrazyGames Compliance Report - Storm Grid (the game; launch package not included)

## Target: Full Launch (SDK + rewarded/midgame ads; every Basic Launch rule is covered too)
## Engine: three.js r186 + Vite 8 (HTML5), single player, desktop + mobile (landscape and portrait)

Audit date 2026-10-02 · build fingerprint `9e15b0b06a33` (`dist/`, 6 files, 0.77 MB) · branch `claude/peaceful-allen-pphssd` ·
register `tools/qa/requirements.json` 2026.09.11 (CrazyGames docs researched 2026-09-11, review due 2026-11-11 - **re-read the live
docs before the real submission**). Machine-readable version: `COMPLIANCE_REPORT.md` (`node tools/qa/report.mjs`).

Scope: the game build only. The owner said "just the game, not the files for now", so covers, preview videos and store text
are listed as pending, not as failures. Claude audits and records; only CrazyGames approves a game, and Claude never uploads.

**Environment limits (read these before trusting a PASS):** everything ran in a cloud container with *software* WebGL
(0.3-1.2 s per frame), Chromium only, no sound output, no touch hardware, no CrazyGames SDK (the dev mock SDK stands in).
Frame times, fps, real-device smoothness, audio quality and fun cannot be judged here - those items are CANNOT VERIFY below.

### ✅ PASS - Technical
- Initial download <= 50 MB / mobile homepage <= 20 MB: **0.22 MB** transferred up to the first `gameplayStart` (`browser-qa boot`, ready in 3.6 s even with software WebGL).
- Total size <= 250 MB, file count <= 1500, relative paths, SDK v3 tag in `<head>` before game code, no source maps / mock SDK / localhost URLs / secrets: **0.77 MB, 6 files** (`check-bundle`).
- Mouse, keyboard and touch (CG-TECH-009): `input-strike` drives a real hold + release through the mouse, Space + arrows (read via `event.code`) and a CDP touch hold; `touch` taps on an 800x450 touch device.
- Playable in desktop landscape (CG-TECH-010): 12 viewport sizes from 800x450 to 1920x1080 plus 390x844 portrait show no scroll, overflow or overlap; screenshots `qa/shots/viewport-*.png` were looked at (smallest text 12 px).
- No orientation lock, `user-select: none` on body, Escape never bound, no popups / `window.open` / app-store links (`policy-scan`).
- Uses SDK `systemInfo` for locale and device type (CG-TECH-017).

### ✅ PASS - Gameplay
- New users land in gameplay with 0 extra clicks: no PLAY button, the city intro shows a pulsing "Hold to charge" hint and the first hold starts the run (CG-GAME-001).
- Legible at DPR 1 at the iframe sizes (CG-GAME-002) - looked at 800x450, 907x510, 1077x606, 1280x720, 1920x1080 and 390x844.
- Physics are frame-rate independent: fixed 60 Hz step, `sim-health` drift 0.00% at 30/60/120/240 Hz, no `Math.random` / clock in the simulation (CG-GAME-003).
- Loads fast, no errors or crashes: no console error in 28 browser scenarios, `sdk-init-hang` (SDK never answers) still playable after 11.7 s, `context-loss` (WebGL context lost + restored mid-run, picture unchanged), `no-webgl` (clear message instead of an endless loading bar), 20-city soak with key mashing / pauses / resizes / double clicks (heap 11 -> 13 MB, DOM 327 -> 287, GPU geometries 19 -> 19, textures 4 -> 4) (CG-GAME-004).
- English complete, language chosen from SDK locale with English fallback, no unreviewed translations shipped (CG-GAME-005).
- Original name, assets and content: no model / texture files, geometry from code, ZzFX sounds (MIT), Lilita One (OFL); a web search on 2026-10-01 found no game called "Storm Grid" (the first name, "Volt City", collided with a casino game and was dropped) (CG-GAME-007).
- No custom fullscreen button, no cross-promotion, PEGI-12-safe content, audience 13+ (CG-GAME-008/009/010).

### ✅ PASS - Quality guidelines
- Key bindings by physical code (AZERTY-safe), no browser-reserved keys, in-gameplay skippable visual onboarding (pulsing hint + a pill until the first SUPERCHARGE), honest buttons (video icon, equal size and style for accept and decline).

### ✅ PASS - SDK
- Order verified by `sdk-events`: init > loadingStart > hasAdblock > reportGameCompletedPercentage > loadingStop > gameplayStart > setGameContext > gameplayStop > clearGameContext > happytime. `gameplayStop` is not tied to focus loss, `settings.muteAudio` outranks the in-game toggle, the game runs with the SDK blocked, disabled, hanging, and with the Data module disabled (localStorage fallback).
- `happytime` only for the first FULL POWER ever and cities 20 / 40; completion percentage reported.

### ✅ PASS - Ads (Full Launch)
- Only SDK ads. The whole ad request pauses the game and blocks the UI, audio is muted only from `adStarted` to `adFinished` / `adError`, rewards are granted only after `adFinished` (and visible), `adError` continues the game.
- 7 rewarded surfaces, all optional, all marked with a video icon, all with a coin or play alternative, all capped (revive once per session at 85-99% only; boost after 2 runs + 120 s; free upgrade 180 s; shop cash 180 s with a visible timer; daily gift once a day). None is visible during active gameplay (checked at +0.3 s and +1.5 s of a run). A break gets a midgame **or** a rewarded continue, never both; no custom midgame cooldown (the SDK paces it); first midgame at city 4.
- Ad blocker (`adblock`) and ads disabled (`ads-basic-launch`): the offers disappear, the game stays fully playable.

### ✅ PASS - Data
- SDK Data module with localStorage fallback, 369-byte save (limit 1 MB), writes debounced 1 s and flushed on level end and tab hide; reload keeps progress (`persistence`, `tab-hidden`).

### ❌ FAIL
- none in the automated run (28 browser checks + sim-health, policy-scan, licenses, poly, bundle, soak).
- Found and fixed during this audit (kept here so they are not forgotten): the pause key **P could pause but not resume** (a paused game does not step, so the key was never read; click / tap worked) - fixed in `src/main.js`, guarded by the new scenario `pause-keys` (reproduced FAIL on the old code, PASS now); `thunder` peaked at +3 dBFS and clipped - a limiter and a per-sound peak ceiling were added to the mixer; three harness scenarios had been failing for environment reasons (see `docs/QA_REPORT.md`).

### ⚠️ WARNING
- `policy-scan` external-urls: `src/core/zzfx.js:3` contains a GitHub link **in a comment** (credit for ZzFX). Nothing is loaded from it; harmless.
- CG-SUB-002 (cover content restrictions) is green only because no assets are shipped - there are no covers yet. Re-check it when the launch package exists.
- Frame time is not measured: `cpu-cost` (4x CPU throttle, 358 frames of a busy city) shows **4.3 ms/frame** of script + style + layout against a 16.7 ms budget, and the 3D scene is 35 draw calls / 9.3k triangles at the high tier (budget 60 / 60k) - strong proxies, but the 3D draw itself could not be timed. The game has an adaptive quality governor (low / medium / high), which helps on weak GPUs.
- Both bolt styles and both lighting looks are still shipped for the owner's A/B choice (`?compare=1` or the hosted playtest page). They must be removed after the owner picks (HANDOFF section 3 cleanup list), then the harness re-run.

### 📋 CANNOT VERIFY
- CG-TECH-007 Chrome **and Edge**: only Chromium was available. Edge shares the engine, but open it once.
- CG-TECH-008 smooth on a 4 GB Chromebook: needs a real low-end device (or a Chromebook in the Developer Portal preview). Proxies above.
- CG-TECH-013 safe areas inside the CrazyGames app and CG-TECH-016 audio resume after iOS interruptions: need the app / an iPhone. The code uses `env(safe-area-inset-*)` and pauses + mutes on `visibilitychange` / `pagehide`; unproven on a device.
- CG-GAME-006 intuitive controls on each device, CG-QUAL-005 fun, CG-QUAL-007 consistent visuals **and audio**: need the owner's play and ears. Claude cannot hear the sounds; the mixer only limits their level.
- CG-SDK-002 / CG-DATA-003 / CG-SUB-005 (portal): confirm in the Developer Portal preview that the first `gameplayStart` is a real playable state, **enable Progress Save**, set orientation to both, and test the preview on desktop and phone.
- CG-SUB-001 / 003 / 004 / CG-QUAL-006: covers (1920x1080, 800x1200, 800x800), preview videos, store text - the launch package (WP-13), deliberately not started.
- Real rewarded / midgame ad **fill** and the SDK's own pacing: the mock SDK always grants; only the live portal shows real behaviour (and ads only run at Full Launch).

---
## Summary
- Passed: **43 / 53** mandatory items (9 / 12 guidelines)
- Failed: **0** items
- Warnings: 4 (all explained above, none blocks upload)
- Unverified: **8** mandatory (Edge, Chromebook, app safe areas, iOS audio, intuitive controls, covers, videos, store text) + 2 portal-only (Progress Save, portal preview) + 3 guidelines (fun, identity, audio/visual consistency)
- Verdict: the **game build is clean against everything that can be checked in a container**. It is not "approved": the open items need the owner (play + sounds + phone), the Developer Portal, and the launch package.

## Evidence (all re-runnable)
| What | Command | Result 2026-10-02 |
|---|---|---|
| Browser harness, 28 scenarios | `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/browser-qa.mjs --serve` | 0 FAIL; 3 "need eyes" (viewports, ad-ui-style, performance) - looked at, recorded under CG-TECH-010 / GAME-002 / QUAL-004 / ADS-007 / ADS-008; performance stays open |
| Soak (20 cities, abuse) | `node tools/qa/soak.mjs --serve --cities 20` | PASS, 253 s, no growth, no console error |
| Simulation health | `node tools/qa/sim-health.mjs --selftest` | PASS (deterministic, planted bug caught) |
| Policy scan / licenses / poly / bundle | `node tools/qa/policy-scan.mjs` (+ `check-licenses`, `check-poly`, `check-bundle`) | PASS (1 harmless WARN) |
| Manual evidence for this build | `bash tools/qa/manual-evidence.sh` then `node tools/qa/report.mjs` | 22 entries, tied to build `9e15b0b06a33`; re-run after every build |
| Measurements | boot 3.6 s / 0.22 MB; 9.3k tris, 35 calls (high tier); 4.3 ms/frame main thread at 4x throttle; longest silence in play 0.8 s (budget 3 s); dist 0.77 MB | |
