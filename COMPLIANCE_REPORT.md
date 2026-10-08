# Compliance report - Storm Grid

Generated 2026-10-08 23:19 UTC · build `5d21e1e4f272` · target stage **full** · register 2026.09.11 (researched 2026-09-11)

## Verdict: NOT VERIFIED - 23 mandatory requirements lack current evidence

This is a record of what was checked, how and when. It is not an approval: only CrazyGames approves a submission.

| PASS | FAIL | WARN | UNVERIFIED | PORTAL | STALE | N/A |
|---|---|---|---|---|---|---|
| 32 | 0 | 0 | 31 | 2 | 0 | 0 |

Legend: PORTAL = can only be confirmed in the Developer Portal preview or by CrazyGames QA · STALE = manual evidence recorded for a different build · UNVERIFIED = no evidence yet.

## technical

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-TECH-001 | Initial download <= 50 MB | mandatory | both | **PASS** | PASS: ready in 3774 ms; 0.25 MB transferred up to first gameplayStart (limit 50 MB, mobile homepage 20 MB) _(browser-qa)_ |
| CG-TECH-002 | Total size <= 250 MB (<= 50 MB without SDK) | mandatory | both | **PASS** | PASS: 0.94 MB (limit 250 MB, SDK integrated) _(check-bundle)_ |
| CG-TECH-003 | File count <= 1500 | mandatory | both | **PASS** | PASS: 20 files (limit 1500) _(check-bundle)_ |
| CG-TECH-004 | Mobile homepage eligibility: initial download <= 20 MB | mandatory | both | **PASS** | PASS: ready in 3774 ms; 0.25 MB transferred up to first gameplayStart (limit 50 MB, mobile homepage 20 MB) _(browser-qa)_ |
| CG-TECH-005 | Relative paths only | mandatory | both | **PASS** | PASS: no absolute asset paths _(check-bundle)_ |
| CG-TECH-007 | Works on Chrome and Edge | mandatory | both | **UNVERIFIED** |  |
| CG-TECH-008 | Smooth on a 4 GB RAM Chromebook | mandatory | both | **UNVERIFIED** | UNVERIFIED: 4x CPU throttle: p50 1116.7 ms, p95 1166.6 ms, 28 draw calls, 18767 tris, DPR 1 - dev GPU, not a 4 GB Chromebook _(browser-qa)_ |
| CG-TECH-009 | Mouse, keyboard, and touch if mobile is supported | mandatory | both | **PASS** | PASS: tap on 800x450 touch device starts the run: phase=run _(browser-qa)_ |
| CG-TECH-010 | Playable in landscape on desktop | mandatory | both | **UNVERIFIED** | UNVERIFIED: no scroll/overflow/overlap at 12 sizes (returning player's ready screen), smallest text 12px - LOOK at qa/shots/viewport-*.png to judge legi _(browser-qa)_ |
| CG-TECH-011 | No orientation lock logic | mandatory | both | **PASS** | PASS: no orientation lock _(policy-scan)_ |
| CG-TECH-012 | user-select: none on body | mandatory | both | **PASS** | PASS: user-select: none on body _(policy-scan)_ |
| CG-TECH-013 | Safe areas inside the CrazyGames App | mandatory | both | **UNVERIFIED** |  |
| CG-TECH-016 | Resume audio after iOS interruptions | mandatory | both | **UNVERIFIED** |  |
| CG-TECH-017 | Use SDK system info for device-specific experiences | guideline | both | **UNVERIFIED** |  |

## gameplay

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-GAME-001 | New users land in gameplay (max 1 click) | mandatory | full | **UNVERIFIED** |  |
| CG-GAME-002 | Legible at devicePixelRatio 1 at the named iframe sizes | mandatory | both | **UNVERIFIED** | UNVERIFIED: no scroll/overflow/overlap at 12 sizes (returning player's ready screen), smallest text 12px - LOOK at qa/shots/viewport-*.png to judge legi _(browser-qa)_ |
| CG-GAME-003 | Physics consistent across refresh rates | mandatory | both | **PASS** | PASS: simulation is free of Math.random/clock reads _(policy-scan)_<br>PASS: determinism exact, step-size drift 0.00% at 30/60/120/240 Hz _(sim-health)_ |
| CG-GAME-004 | Loads quickly, no errors or crashes | mandatory | both | **PASS** | PASS: init never resolves: game playable after 11825 ms _(browser-qa)_<br>PASS: pauses + silences + flushes save on hide, no gameplayStop, resumes on return _(browser-qa)_<br>UNVERIFIED: 4x CPU throttle: p50 1116.7 ms, p95 1166.6 ms, 28 draw calls, 18767 tris, DPR 1 - dev GPU, not a 4 GB Chromebook _(browser-qa)_<br>PASS: no console errors or page errors across all scenarios _(browser-qa)_<br>PASS: no source maps, mock SDK, localhost URLs or secrets _(check-bundle)_ |
| CG-GAME-005 | English localization; accurate translations from SDK locale | mandatory | both | **UNVERIFIED** |  |
| CG-GAME-006 | Intuitive controls on each device type | mandatory | both | **UNVERIFIED** |  |
| CG-GAME-007 | Original name, assets and content | mandatory | both | **PASS** | PASS: 20 shipped asset files, all in the manifest _(check-licenses)_<br>PASS: 4 manifest rows, none with a forbidden license _(check-licenses)_<br>PASS: no custom-license (tier C) assets _(check-licenses)_<br>PASS: all rows have source, license and tier _(check-licenses)_<br>PASS: every runtime dependency has a license notice _(check-licenses)_ |
| CG-GAME-008 | No custom fullscreen button | mandatory | both | **PASS** | PASS: no custom fullscreen _(policy-scan)_ |
| CG-GAME-009 | No cross-promotion (narrow exceptions) | mandatory | both | **PASS** | PASS: no window.open _(policy-scan)_<br>PASS: no app store links _(policy-scan)_<br>WARN: external URL (cross-promotion or externally loaded asset?): src/core/zzfx.js:3: https://github.com/KilledByAPixel/ZzFX _(policy-scan)_ |
| CG-GAME-010 | PEGI 12, audience 13+, not targeted at kids | mandatory | both | **UNVERIFIED** |  |

## quality

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-QUAL-001 | Avoid browser-reserved keys | guideline | both | **PASS** | PASS: Escape not bound _(policy-scan)_ |
| CG-QUAL-002 | Key bindings adapt to keyboard layout | guideline | both | **PASS** | PASS: movement keys read via KeyboardEvent.code _(policy-scan)_ |
| CG-QUAL-003 | In-gameplay, skippable, visual onboarding | guideline | both | **UNVERIFIED** |  |
| CG-QUAL-004 | Honest buttons | guideline | both | **UNVERIFIED** | UNVERIFIED: 4 offers on ready/win/fail screens: video icon, shared .btn, decline in the same frame with equal size/font/colours - LOOK at qa/shots/ad-ui _(browser-qa)_ |
| CG-QUAL-005 | Fun-experience principles | guideline | both | **UNVERIFIED** |  |
| CG-QUAL-006 | Unique, honest identity | guideline | both | **UNVERIFIED** |  |
| CG-QUAL-007 | Consistent high-quality visuals and audio | guideline | both | **UNVERIFIED** |  |

## sdk

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-SDK-001 | SDK required for Full Launch (HTML5 v3) | mandatory | full | **PASS** | PASS: SDK v3 tag in <head> before game code _(check-bundle)_ |
| CG-SDK-002 | First gameplayStart marks a real playable state | mandatory | both | **PASS** | PASS: ready in 3774 ms; 0.25 MB transferred up to first gameplayStart (limit 50 MB, mobile homepage 20 MB) _(browser-qa)_<br>PASS: order ok: mockInstalled > init > loadingStart > hasAdblock > reportGameCompletedPercentage > loadingStop > gameplayStart > setGameContext >  _(browser-qa)_ |
| CG-SDK-003 | gameplayStart/gameplayStop on real breaks, not on focus loss | mandatory | full | **PASS** | PASS: order ok: mockInstalled > init > loadingStart > hasAdblock > reportGameCompletedPercentage > loadingStop > gameplayStart > setGameContext >  _(browser-qa)_<br>PASS: overlay during request, mute only between adStarted and adFinished, coins 480 -> 1440 _(browser-qa)_<br>PASS: pauses + silences + flushes save on hide, no gameplayStop, resumes on return _(browser-qa)_<br>PASS: gameplayStop not tied to focus/visibility _(policy-scan)_ |
| CG-SDK-004 | settings.muteAudio outranks the in-game toggle | mandatory | full | **PASS** | PASS: ?muteAudio=true + in-game toggles: gain=0; muteAudio flipped mid-game: gain=0 _(browser-qa)_ |
| CG-SDK-005 | Handle SDK environments | mandatory | both | **PASS** | PASS: SDK script blocked: platform=none, phase=run, errors=0 _(browser-qa)_<br>PASS: environment "disabled": platform=none, phase=run, errors=0 _(browser-qa)_<br>PASS: init never resolves: game playable after 11825 ms _(browser-qa)_ |
| CG-SDK-006 | loadingStart/loadingStop (optional) | guideline | full | **UNVERIFIED** | check with: browser-qa sdk-events |
| CG-SDK-007 | Report completion percentage | guideline | full | **UNVERIFIED** |  |
| CG-SDK-008 | Attach game context to player feedback | guideline | full | **UNVERIFIED** |  |
| CG-SDK-009 | happytime sparingly | guideline | full | **UNVERIFIED** |  |

## ads

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-ADS-001 | Only CrazyGames SDK ads | mandatory | both | **PASS** | PASS: no third-party ad networks _(policy-scan)_ |
| CG-ADS-002 | Video ads never interrupt gameplay | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-003 | Pause and block UI for the whole ad request | mandatory | full | **PASS** | PASS: overlay during request, mute only between adStarted and adFinished, coins 480 -> 1440 _(browser-qa)_<br>PASS: 4 s fill: blocker visible=true, pause=menu+ad, still on level 1 _(browser-qa)_ |
| CG-ADS-004 | Mute on adStarted, unmute on finish/error | mandatory | full | **PASS** | PASS: overlay during request, mute only between adStarted and adFinished, coins 480 -> 1440 _(browser-qa)_ |
| CG-ADS-005 | Handle adError and continue | mandatory | full | **PASS** | PASS: ads disabled: reward granted on error=false, dead offer removed=true, note="", next level playable=true _(browser-qa)_ |
| CG-ADS-006 | No custom midgame cooldown needed | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-007 | Rewarded offers are clearly optional and marked as video | mandatory | full | **UNVERIFIED** | UNVERIFIED: 4 offers on ready/win/fail screens: video icon, shared .btn, decline in the same frame with equal size/font/colours - LOOK at qa/shots/ad-ui _(browser-qa)_ |
| CG-ADS-008 | Decline option looks the same as accept | mandatory | full | **UNVERIFIED** | UNVERIFIED: 4 offers on ready/win/fail screens: video icon, shared .btn, decline in the same frame with equal size/font/colours - LOOK at qa/shots/ad-ui _(browser-qa)_ |
| CG-ADS-009 | No rewarded button on active gameplay screens | mandatory | full | **PASS** | PASS: no rewarded offer visible during active gameplay (checked at +0.3 s and +1.5 s of a run) _(browser-qa)_ |
| CG-ADS-010 | No ad chaining | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-011 | Not too often, not too aggressive | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-012 | A non-ad alternative exists | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-013 | Reward only on adFinished; make it visible | mandatory | full | **PASS** | PASS: ads disabled: reward granted on error=false, dead offer removed=true, note="", next level playable=true _(browser-qa)_<br>PASS: overlay during request, mute only between adStarted and adFinished, coins 480 -> 1440 _(browser-qa)_ |
| CG-ADS-014 | No out-of-lives offer on every death | mandatory | full | **PASS** | PASS: no revive at 5% powered (result + retry); ring 4 -> 3 then the offer expired without an ad request; one revive watched, none offered after;  _(browser-qa)_ |
| CG-ADS-015 | Midgame OR continue-rewarded between two levels, not both | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-018 | Adblock users can play normally | mandatory | full | **UNVERIFIED** | check with: browser-qa adblock |
| CG-ADS-019 | Game runs smoothly with ads disabled (Basic Launch) | mandatory | basic | **UNVERIFIED** | check with: browser-qa ads-basic-launch |

## data

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-DATA-001 | Cloud progress save when progress applies | mandatory | full | **PASS** | PASS: Data module on: reload keeps level 2 / 480 coins via crazygames-data; disabled: localStorage -> reload keeps level 2 / 480 coins (localStora _(browser-qa)_ |
| CG-DATA-002 | Data module: rely on it fully; 1 MB; debounced | mandatory | full | **PASS** | PASS: Data module on: reload keeps level 2 / 480 coins via crazygames-data; disabled: localStorage -> reload keeps level 2 / 480 coins (localStora _(browser-qa)_ |
| CG-DATA-003 | Enable Progress Save in the submission | mandatory | full | **PORTAL** |  |

## submission

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-SUB-001 | Three cover images | mandatory | both | **PASS** | PASS: 1920x1080 (need 1920x1080), 1444 KB _(check-submission)_<br>PASS: 800x1200 (need 800x1200), 984 KB _(check-submission)_<br>PASS: 800x800 (need 800x800), 710 KB _(check-submission)_ |
| CG-SUB-002 | Cover content restrictions | mandatory | both | **PASS** | PASS: 20 shipped asset files, all in the manifest _(check-licenses)_<br>PASS: 4 manifest rows, none with a forbidden license _(check-licenses)_<br>PASS: no custom-license (tier C) assets _(check-licenses)_<br>PASS: all rows have source, license and tier _(check-licenses)_<br>PASS: every runtime dependency has a license notice _(check-licenses)_<br>UNVERIFIED: look: title is the only text, no borders, no icons/store logos, sharp, consistent across the 3 sizes _(check-submission)_ |
| CG-SUB-003 | Preview videos | mandatory | both | **PASS** | PASS: 1920x1080, 18.6 s, 17.7 MB, silent _(check-submission)_<br>PASS: 1080x1620, 18.6 s, 18.6 MB, silent _(check-submission)_<br>UNVERIFIED: watch: cover as first frame, no black intro/bars, no cursor, no promo text/icons, not sped up, shows the best moments _(check-submission)_ |
| CG-SUB-004 | Qualitative metadata | mandatory | both | **UNVERIFIED** | check with: docs/STORE_METADATA.md |
| CG-SUB-005 | Test in the Developer Portal preview | mandatory | both | **PORTAL** |  |
