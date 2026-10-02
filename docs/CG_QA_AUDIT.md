# CrazyGames Compliance Report - Storm Grid (the game as the owner liked it; launch package not included)

## Target: Full Launch (SDK + rewarded/midgame ads; every Basic Launch rule is covered too)
## Engine: three.js r186 + Vite 8 (HTML5), single player, desktop + mobile (landscape and portrait)

Audit date 2026-10-02 · build fingerprint `1e4c4dd4a1d7` (`dist/`, 6 files, 0.76 MB) · branch `claude/peaceful-allen-pphssd` ·
register `tools/qa/requirements.json` 2026.09.11 (CrazyGames docs researched 2026-09-11, review due 2026-11-11 - **re-read the live
docs before the real submission**). Machine-readable version: `COMPLIANCE_REPORT.md` (`node tools/qa/report.mjs`).

**What was audited:** the game exactly as it was at the 2026-09-28 handoff (commit `d575418`: classic glow bolt, dusk look,
centred dialogs, original sounds). The owner asked to keep it that way ("the old version of the game was good, make it like it
was"), so none of the 2026-10-01 look / sound / UI changes is in this build. The only code difference to `d575418` is two
QA-only hooks in `src/main.js` (`?qa=1&renderEvery=` and `loopFrames` in the QA state), inert for players
(`git diff d575418 -- src`).

Scope: the game build only. Covers, preview videos and store text are listed as pending, not as failures. Claude audits and
records; only CrazyGames approves a game, and Claude never uploads.

**Environment limits (read these before trusting a PASS):** everything ran in a cloud container with *software* WebGL
(0.3-1.2 s per frame), Chromium only, no sound output, no touch hardware, no CrazyGames SDK (the dev mock SDK stands in).
Frame times, fps, real-device smoothness, audio quality and fun cannot be judged here - those items are CANNOT VERIFY below.

### ✅ PASS - Technical
- Initial download <= 50 MB / mobile homepage <= 20 MB: **0.22 MB** transferred up to the first `gameplayStart` (`browser-qa boot`, ready in 2.8 s even with software WebGL).
- Total size <= 250 MB, file count <= 1500, relative paths, SDK v3 tag in `<head>` before game code, no source maps / mock SDK / localhost URLs / secrets: **0.76 MB, 6 files** (`check-bundle`).
- Mouse, keyboard and touch (CG-TECH-009): `input-strike` drives a real hold + release through the mouse, Space + arrows (read via `event.code`) and a CDP touch hold; `touch` taps on an 800x450 touch device.
- Playable in desktop landscape (CG-TECH-010): 12 viewport sizes from 800x450 to 1920x1080 plus 390x844 portrait show no scroll, overflow or overlap (smallest text 12 px); the screenshots `qa/shots/viewport-*.png` were looked at.
- No orientation lock, `user-select: none` on body, Escape never bound, no popups / `window.open` / app-store links (`policy-scan`).
- Uses SDK `systemInfo` for locale and device type (CG-TECH-017).

### ✅ PASS - Gameplay
- New users land in gameplay with 0 extra clicks: no PLAY button, the city intro shows a pulsing "Hold to charge" hint and the first hold starts the run (CG-GAME-001).
- Legible at DPR 1 at the iframe sizes (CG-GAME-002) - looked at 800x450, 907x510, 1280x720 and 390x844.
- Physics are frame-rate independent: fixed 60 Hz step, `sim-health` drift 0.00% at 30/60/120/240 Hz, no `Math.random` / clock in the simulation (CG-GAME-003).
- Loads fast, no errors or crashes: no console error in 27 browser scenarios, `sdk-init-hang` (SDK never answers) still playable after 10.4 s, `context-loss` (WebGL context lost + restored mid-run: rendering resumes, run goes on), 20-city soak with key mashing / pauses / resizes / double clicks (heap 11 -> 12 MB, DOM 327 -> 287, GPU geometries 19 -> 19, textures 4 -> 4) (CG-GAME-004).
- English complete, language chosen from SDK locale with English fallback, no unreviewed translations shipped (CG-GAME-005).
- Original name, assets and content: no model / texture files, geometry from code, ZzFX sounds (MIT), Lilita One (OFL); a web search on 2026-10-01 found no game called "Storm Grid" (the first name, "Volt City", collided with a casino game and was dropped) (CG-GAME-007).
- No custom fullscreen button, no cross-promotion, PEGI-12-safe content, audience 13+ (CG-GAME-008/009/010).

### ✅ PASS - Quality guidelines
- Key bindings by physical code (AZERTY-safe), no browser-reserved keys, in-gameplay skippable visual onboarding (pulsing hint + a pill until the first SUPERCHARGE), honest buttons (video icon, equal size and style for accept and decline - looked at the result, near-miss and intro screens).

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
- none (27 browser checks, sim-health, policy-scan, licenses, poly, bundle, soak).

### ⚠️ WARNING - known issues in the game that were left as they are on purpose
The owner asked for the old game unchanged, so these real findings were **not** fixed. Each has a ready fix in the git history
(`git show <commit> -- src`), and the harness scenario that finds it reports WARN until it is applied (then it turns PASS by itself;
the entry in `KNOWN_ISSUES` in `tools/qa/browser-qa.mjs` can then be deleted).
1. **P pauses a run but cannot resume it** (scenario `pause-keys`). A paused game does not step, so the key handler inside the game loop never sees the second P. Click / tap on the overlay resumes, and the overlay says "Click to resume", so nobody is stuck - but a reviewer who presses P twice will see it fail. Fix: commit `1ab9a22` (key handler in `src/main.js`, about 3 lines).
2. **No WebGL = endless loading bar with no message** (scenario `no-webgl`). Players with hardware acceleration off get nothing to read. Fix: commit `e7cbd85` (`boot().catch` in `src/main.js`, a message). Affects few players; it is a CG-GAME-004 "no crashes" edge case.
3. **Two sounds clip.** Raw sample peaks (ZzFX, before the 0.9 SFX gain): `thunder` (every strike) 1.45 = +2.3 dBFS after the gain, `fail` (city dark) 1.62 = +3.3 dBFS (`gateBad` is 1.65 raw but is played at volume 0.5, so it stays below 0 dBFS). Web Audio hard-clips above 0 dBFS, which can sound gritty. Nobody has listened to the sounds yet (Claude cannot hear). Fix: commit `926cb82` (`src/core/audio.js`, limiter + per-sound ceiling). Decide after the owner's listening test.
4. After a WebGL context loss and restore, the picture is about 10% darker (mean luminance 115 -> 104; the scenario passes at >= 70%). Fix: the context-restore handler in `e7cbd85` (`src/game/view.js`) restored 115 -> 115. Rare (GPU reset on low-end devices).
5. `policy-scan` external-urls: `src/core/zzfx.js:3` contains a GitHub link **in a comment** (credit for ZzFX). Nothing is loaded from it; harmless.
6. CG-SUB-002 (cover content restrictions) is green only because no assets are shipped - there are no covers yet. Re-check it when the launch package exists.
7. Frame time is not measured: `cpu-cost` (4x CPU throttle, 358 frames of a busy city) shows **2.7 ms/frame** of script + style + layout against a 16.7 ms budget, and the 3D scene is 35 draw calls / 9.5k triangles at the high tier (budget 60 / 60k) - strong proxies, but the 3D draw itself could not be timed. The game has an adaptive quality governor (low / medium / high), which helps on weak GPUs.

### 📋 CANNOT VERIFY
- CG-TECH-007 Chrome **and Edge**: only Chromium was available. Edge shares the engine, but open it once.
- CG-TECH-008 smooth on a 4 GB Chromebook: needs a real low-end device (or a Chromebook in the Developer Portal preview). Proxies above.
- CG-TECH-013 safe areas inside the CrazyGames app and CG-TECH-016 audio resume after iOS interruptions: need the app / an iPhone. The code uses `env(safe-area-inset-*)` and pauses + mutes on `visibilitychange` / `pagehide`; unproven on a device.
- CG-GAME-006 intuitive controls on each device, CG-QUAL-005 fun, CG-QUAL-007 consistent visuals **and audio**: need the owner's play and ears.
- CG-SDK-002 / CG-DATA-003 / CG-SUB-005 (portal): confirm in the Developer Portal preview that the first `gameplayStart` is a real playable state, **enable Progress Save**, set orientation to both, and test the preview on desktop and phone.
- CG-SUB-001 / 003 / 004 / CG-QUAL-006: covers (1920x1080, 800x1200, 800x800), preview videos, store text - the launch package (WP-13), deliberately not started.
- Real rewarded / midgame ad **fill** and the SDK's own pacing: the mock SDK always grants; only the live portal shows real behaviour (and ads only run at Full Launch).

---
## Summary
- Passed: **43 / 53** mandatory items (9 / 12 guidelines)
- Failed: **0** items
- Warnings: 7 (the first 4 are real defects left unfixed on purpose, see above; none blocks upload, but items 1 and 2 are cheap to fix)
- Unverified: **8** mandatory (Edge, Chromebook, app safe areas, iOS audio, intuitive controls, covers, videos, store text) + 2 portal-only (Progress Save, portal preview) + 3 guidelines (fun, identity, audio/visual consistency)
- Verdict: the **game as it was is clean against everything that can be checked in a container**. It is not "approved": the open items need the owner (play + sounds + phone), the Developer Portal, and the launch package.

## Evidence (all re-runnable)
| What | Command | Result 2026-10-02 |
|---|---|---|
| Browser harness, 27 checks | `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/browser-qa.mjs --serve` | 0 FAIL, 2 WARN (known issues 1 and 2), 3 "need eyes" (viewports, ad-ui-style, performance) - looked at, recorded under CG-TECH-010 / GAME-002 / QUAL-004 / ADS-007 / ADS-008; performance stays open |
| Soak (20 cities, abuse) | `node tools/qa/soak.mjs --serve --cities 20` | PASS, 221 s, no growth, no console error (pauses resume by click: known issue 1) |
| Simulation health | `node tools/qa/sim-health.mjs --selftest` | PASS (deterministic, planted bug caught) |
| Policy scan / licenses / poly / bundle | `node tools/qa/policy-scan.mjs` (+ `check-licenses`, `check-poly`, `check-bundle`) | PASS (1 harmless WARN) |
| Manual evidence for this build | `bash tools/qa/manual-evidence.sh` then `node tools/qa/report.mjs` | 22 entries, tied to build `1e4c4dd4a1d7`; re-run after every build |
| Measurements | boot 2.8 s / 0.22 MB; 9.5k tris, 35 calls (high tier); 2.7 ms/frame main thread at 4x throttle; longest silence in play 0.4 s (budget 3 s); dist 0.76 MB | |
