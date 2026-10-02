# Compliance report - Storm Grid

Generated 2026-10-02 15:14 UTC · build `1e4c4dd4a1d7` · target stage **full** · register 2026.09.11 (researched 2026-09-11)

## Verdict: NOT VERIFIED - 10 mandatory requirements lack current evidence

This is a record of what was checked, how and when. It is not an approval: only CrazyGames approves a submission.

| PASS | FAIL | WARN | UNVERIFIED | PORTAL | STALE | N/A |
|---|---|---|---|---|---|---|
| 52 | 0 | 0 | 11 | 2 | 0 | 0 |

Legend: PORTAL = can only be confirmed in the Developer Portal preview or by CrazyGames QA · STALE = manual evidence recorded for a different build · UNVERIFIED = no evidence yet.

## technical

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-TECH-001 | Initial download <= 50 MB | mandatory | both | **PASS** | PASS: ready in 2816 ms; 0.22 MB transferred up to first gameplayStart (limit 50 MB, mobile homepage 20 MB) _(browser-qa)_ |
| CG-TECH-002 | Total size <= 250 MB (<= 50 MB without SDK) | mandatory | both | **PASS** | PASS: 0.76 MB (limit 250 MB, SDK integrated) _(check-bundle)_ |
| CG-TECH-003 | File count <= 1500 | mandatory | both | **PASS** | PASS: 6 files (limit 1500) _(check-bundle)_ |
| CG-TECH-004 | Mobile homepage eligibility: initial download <= 20 MB | mandatory | both | **PASS** | PASS: ready in 2816 ms; 0.22 MB transferred up to first gameplayStart (limit 50 MB, mobile homepage 20 MB) _(browser-qa)_ |
| CG-TECH-005 | Relative paths only | mandatory | both | **PASS** | PASS: no absolute asset paths _(check-bundle)_ |
| CG-TECH-007 | Works on Chrome and Edge | mandatory | both | **UNVERIFIED** |  |
| CG-TECH-008 | Smooth on a 4 GB RAM Chromebook | mandatory | both | **UNVERIFIED** | UNVERIFIED: 4x CPU throttle: p50 433.3 ms, p95 499.9 ms, 18 draw calls, 7853 tris, DPR 1 - dev GPU, not a 4 GB Chromebook _(browser-qa)_ |
| CG-TECH-009 | Mouse, keyboard, and touch if mobile is supported | mandatory | both | **PASS** | PASS: tap on 800x450 touch device starts the run: phase=run _(browser-qa)_<br>PASS: hold + release strikes through the mouse, the keyboard (Space + arrows, event.code) and a touch hold _(browser-qa)_ |
| CG-TECH-010 | Playable in landscape on desktop | mandatory | both | **PASS** | UNVERIFIED: no scroll/overflow/overlap at 12 sizes (returning player's ready screen), smallest text 12px - LOOK at qa/shots/viewport-*.png to judge legi _(browser-qa)_<br>PASS: Looked at the intro screen at 800x450, 907x510, 1280x720 (landscape) and 390x844: nothing clipped or overlapping, text readable; result and  _(manual (browser-qa viewports (12 sizes) + looked at qa/shots/viewport-*.png and ad-ui-*.png))_ |
| CG-TECH-011 | No orientation lock logic | mandatory | both | **PASS** | PASS: no orientation lock _(policy-scan)_ |
| CG-TECH-012 | user-select: none on body | mandatory | both | **PASS** | PASS: user-select: none on body _(policy-scan)_ |
| CG-TECH-013 | Safe areas inside the CrazyGames App | mandatory | both | **UNVERIFIED** |  |
| CG-TECH-016 | Resume audio after iOS interruptions | mandatory | both | **UNVERIFIED** |  |
| CG-TECH-017 | Use SDK system info for device-specific experiences | guideline | both | **PASS** | PASS: platform.js reads SDK user.systemInfo (locale, device.type, applicationType); main.js uses device.type for the touch hint and locale for the _(manual (code read: src/platform/platform.js:222, src/main.js:122,132))_ |

## gameplay

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-GAME-001 | New users land in gameplay (max 1 click) | mandatory | full | **PASS** | PASS: No PLAY button: the city intro shows a pulsing hold hint and the first hold starts the run (0 extra clicks); touch scenario: one tap on an 8 _(manual (browser-qa touch + input-strike scenarios; qa/shots/viewport-800x450.png))_ |
| CG-GAME-002 | Legible at devicePixelRatio 1 at the named iframe sizes | mandatory | both | **PASS** | UNVERIFIED: no scroll/overflow/overlap at 12 sizes (returning player's ready screen), smallest text 12px - LOOK at qa/shots/viewport-*.png to judge legi _(browser-qa)_<br>PASS: Looked at the CrazyGames iframe sizes 800x450, 907x510 and 1280x720 at DPR 1 and 390x844 portrait: title, hint, upgrade cards and both butto _(manual (browser-qa viewports + looked at qa/shots/viewport-*.png))_ |
| CG-GAME-003 | Physics consistent across refresh rates | mandatory | both | **PASS** | PASS: simulation is free of Math.random/clock reads _(policy-scan)_<br>PASS: determinism exact, step-size drift 0.00% at 30/60/120/240 Hz _(sim-health)_ |
| CG-GAME-004 | Loads quickly, no errors or crashes | mandatory | both | **PASS** | PASS: init never resolves: game playable after 10401 ms _(browser-qa)_<br>PASS: pauses + silences + flushes save on hide, no gameplayStop, resumes on return _(browser-qa)_<br>PASS: WebGL context lost and restored mid-run: frames resumed after the restore (1 -> 20), luminance 115 -> 104, run still going _(browser-qa)_<br>WARN: KNOWN ISSUE, left unfixed on purpose (without WebGL the loading bar never ends and says nothing; fix: commit e7cbd85 (src/main.js boot().cat _(browser-qa)_<br>UNVERIFIED: 4x CPU throttle: p50 433.3 ms, p95 499.9 ms, 18 draw calls, 7853 tris, DPR 1 - dev GPU, not a 4 GB Chromebook _(browser-qa)_<br>PASS: no console errors or page errors across all scenarios _(browser-qa)_<br>PASS: no source maps, mock SDK, localhost URLs or secrets _(check-bundle)_ |
| CG-GAME-005 | English localization; accurate translations from SDK locale | mandatory | both | **PASS** | PASS: English is the complete string table; initI18n(systemInfo.locale) picks a shipped language and falls back to English; no other language is s _(manual (code read: src/core/i18n.js, src/main.js:122))_ |
| CG-GAME-006 | Intuitive controls on each device type | mandatory | both | **UNVERIFIED** |  |
| CG-GAME-007 | Original name, assets and content | mandatory | both | **PASS** | PASS: 0 shipped asset files, all in the manifest _(check-licenses)_<br>PASS: 3 manifest rows, none with a forbidden license _(check-licenses)_<br>PASS: no custom-license (tier C) assets _(check-licenses)_<br>PASS: all rows have source, license and tier _(check-licenses)_<br>PASS: every runtime dependency has a license notice _(check-licenses)_<br>PASS: Own game: no shipped model/texture files (0 assets in manifest), geometry from code, ZzFX procedural sounds (MIT), Lilita One font (OFL); we _(manual (check-licenses.mjs + check-poly.mjs PASS; docs/ORIGINALITY.md; web search))_ |
| CG-GAME-008 | No custom fullscreen button | mandatory | both | **PASS** | PASS: no custom fullscreen _(policy-scan)_ |
| CG-GAME-009 | No cross-promotion (narrow exceptions) | mandatory | both | **PASS** | PASS: no window.open _(policy-scan)_<br>PASS: no app store links _(policy-scan)_<br>WARN: external URL (cross-promotion or externally loaded asset?): src/core/zzfx.js:3: https://github.com/KilledByAPixel/ZzFX _(policy-scan)_ |
| CG-GAME-010 | PEGI 12, audience 13+, not targeted at kids | mandatory | both | **PASS** | PASS: Content is a toy city lit by cartoon lightning: no people, blood, weapons, gambling, real money or horror; no chat; suits PEGI 3-7 content,  _(manual (content review of all screens (qa/shots) and the string table))_ |

## quality

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-QUAL-001 | Avoid browser-reserved keys | guideline | both | **PASS** | PASS: hold + release strikes through the mouse, the keyboard (Space + arrows, event.code) and a touch hold _(browser-qa)_<br>PASS: Escape not bound _(policy-scan)_ |
| CG-QUAL-002 | Key bindings adapt to keyboard layout | guideline | both | **PASS** | PASS: movement keys read via KeyboardEvent.code _(policy-scan)_ |
| CG-QUAL-003 | In-gameplay, skippable, visual onboarding | guideline | both | **PASS** | PASS: Onboarding happens inside the first run: pulsing hold hint on the intro, an onboarding pill while charging until the first SUPERCHARGE relea _(manual (code read src/main.js (hint, pill); screenshot qa/shots/viewport-800x450.png))_ |
| CG-QUAL-004 | Honest buttons | guideline | both | **PASS** | UNVERIFIED: 4 offers on ready/win/fail screens: video icon, shared .btn, decline in the same frame with equal size/font/colours - LOOK at qa/shots/ad-ui _(browser-qa)_<br>PASS: Rewarded buttons carry a video icon and the reward text (+2 strikes, Claim x3); the coin alternative has the same size/font/gradient and the _(manual (browser-qa ad-ui-style (equal size/font/colours) + looked at qa/shots/ad-ui-win.png and viewport-800x450.png))_ |
| CG-QUAL-005 | Fun-experience principles | guideline | both | **UNVERIFIED** |  |
| CG-QUAL-006 | Unique, honest identity | guideline | both | **UNVERIFIED** |  |
| CG-QUAL-007 | Consistent high-quality visuals and audio | guideline | both | **UNVERIFIED** |  |

## sdk

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-SDK-001 | SDK required for Full Launch (HTML5 v3) | mandatory | full | **PASS** | PASS: SDK v3 tag in <head> before game code _(check-bundle)_ |
| CG-SDK-002 | First gameplayStart marks a real playable state | mandatory | both | **PASS** | PASS: ready in 2816 ms; 0.22 MB transferred up to first gameplayStart (limit 50 MB, mobile homepage 20 MB) _(browser-qa)_<br>PASS: order ok: mockInstalled > init > loadingStart > hasAdblock > reportGameCompletedPercentage > loadingStop > gameplayStart > setGameContext >  _(browser-qa)_ |
| CG-SDK-003 | gameplayStart/gameplayStop on real breaks, not on focus loss | mandatory | full | **PASS** | PASS: order ok: mockInstalled > init > loadingStart > hasAdblock > reportGameCompletedPercentage > loadingStop > gameplayStart > setGameContext >  _(browser-qa)_<br>PASS: overlay + pause on request, muted only from adStarted to adFinished, reward after adFinished, coins 470 -> 1410 _(browser-qa)_<br>PASS: pauses + silences + flushes save on hide, no gameplayStop, resumes on return _(browser-qa)_<br>PASS: gameplayStop not tied to focus/visibility _(policy-scan)_ |
| CG-SDK-004 | settings.muteAudio outranks the in-game toggle | mandatory | full | **PASS** | PASS: ?muteAudio=true + in-game toggles: gain=0; muteAudio flipped mid-game: gain=0 _(browser-qa)_ |
| CG-SDK-005 | Handle SDK environments | mandatory | both | **PASS** | PASS: SDK script blocked: platform=none, phase=run, errors=0 _(browser-qa)_<br>PASS: environment "disabled": platform=none, phase=run, errors=0 _(browser-qa)_<br>PASS: init never resolves: game playable after 10401 ms _(browser-qa)_ |
| CG-SDK-006 | loadingStart/loadingStop (optional) | guideline | full | **PASS** | PASS: order ok: mockInstalled > init > loadingStart > hasAdblock > reportGameCompletedPercentage > loadingStop > gameplayStart > setGameContext >  _(browser-qa)_ |
| CG-SDK-007 | Report completion percentage | guideline | full | **PASS** | PASS: order ok: mockInstalled > init > loadingStart > hasAdblock > reportGameCompletedPercentage > loadingStop > gameplayStart > setGameContext >  _(browser-qa)_ |
| CG-SDK-008 | Attach game context to player feedback | guideline | full | **PASS** | PASS: setGameContext({city}) is called when a city starts and cleared on leaving; the sdk-events scenario saw setGameContext > gameplayStop > clea _(manual (browser-qa sdk-events; src/main.js (tryStartRun)))_ |
| CG-SDK-009 | happytime sparingly | guideline | full | **PASS** | PASS: happytime fires only for the first FULL POWER ever and for reaching city 20 and city 40, never per city or per item _(manual (code read: src/main.js (happytime call); browser-qa sdk-events saw it once))_ |

## ads

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-ADS-001 | Only CrazyGames SDK ads | mandatory | both | **PASS** | PASS: no third-party ad networks _(policy-scan)_ |
| CG-ADS-002 | Video ads never interrupt gameplay | mandatory | full | **PASS** | PASS: Midgame is requested only with a break context (level-complete-next / retry) from city 4 on, never during active gameplay and not on menu/sh _(manual (code read src/core/ads.js, src/main.js; browser-qa ads-fill + ad-ui PASS))_ |
| CG-ADS-003 | Pause and block UI for the whole ad request | mandatory | full | **PASS** | PASS: overlay + pause on request, muted only from adStarted to adFinished, reward after adFinished, coins 470 -> 1410 _(browser-qa)_<br>PASS: 4 s fill: blocker visible=true, pause=menu+ad, still on level 1 _(browser-qa)_ |
| CG-ADS-004 | Mute on adStarted, unmute on finish/error | mandatory | full | **PASS** | PASS: overlay + pause on request, muted only from adStarted to adFinished, reward after adFinished, coins 470 -> 1410 _(browser-qa)_ |
| CG-ADS-005 | Handle adError and continue | mandatory | full | **PASS** | PASS: ads disabled: reward granted on error=false, dead offer removed=true, note="", next level playable=true _(browser-qa)_ |
| CG-ADS-006 | No custom midgame cooldown needed | mandatory | full | **PASS** | PASS: No custom midgame cooldown in the code: ads.midgame asks at every break from city 4 and the SDK paces it; only the first-midgame level (rete _(manual (code read src/core/ads.js, src/config.js))_ |
| CG-ADS-007 | Rewarded offers are clearly optional and marked as video | mandatory | full | **PASS** | UNVERIFIED: 4 offers on ready/win/fail screens: video icon, shared .btn, decline in the same frame with equal size/font/colours - LOOK at qa/shots/ad-ui _(browser-qa)_<br>PASS: Every rewarded button shows a video icon and the reward; none has a hidden or delayed close; all offers can simply be ignored _(manual (browser-qa ad-ui-style; looked at qa/shots/ad-ui-win.png, ad-ui-ready.png, ad-ui-fail-revive.png))_ |
| CG-ADS-008 | Decline option looks the same as accept | mandatory | full | **PASS** | UNVERIFIED: 4 offers on ready/win/fail screens: video icon, shared .btn, decline in the same frame with equal size/font/colours - LOOK at qa/shots/ad-ui _(browser-qa)_<br>PASS: Claim and Claim x3 are the same .btn (size, font, gradient); +2 strikes (video) sits next to +2 strikes 60 coins in equal size; the harness  _(manual (browser-qa ad-ui-style + screenshots ad-ui-win.png / viewport-800x450.png))_ |
| CG-ADS-009 | No rewarded button on active gameplay screens | mandatory | full | **PASS** | PASS: no rewarded offer visible during active gameplay (checked at +0.3 s and +1.5 s of a run) _(browser-qa)_<br>PASS: No rewarded offer is visible during active gameplay (checked at +0.3 s and +1.5 s of a run); offers live on the intro, result, near-miss and _(manual (browser-qa ad-ui scenario))_ |
| CG-ADS-010 | No ad chaining | mandatory | full | **PASS** | PASS: Every reward needs at most one rewarded ad; offers are independent and capped per session/cooldown; the midgame is skipped for the break if  _(manual (code read: src/core/ads.js, src/main.js (rewardedShown)))_ |
| CG-ADS-011 | Not too often, not too aggressive | mandatory | full | **PASS** | PASS: Caps: revive once per session and only at 85-99% powered, boost after 2 runs and 120 s cooldown, free upgrade 180 s, shop cash 180 s with a  _(manual (code read src/config.js; browser-qa revive-offer + shop))_ |
| CG-ADS-012 | A non-ad alternative exists | mandatory | full | **PASS** | PASS: All 7 rewarded surfaces have a coin or play alternative (Claim, +2 strikes for coins, upgrades for coins, bolts unlocked with coins); ad blo _(manual (browser-qa ads-basic-launch, adblock, shop, ad-ui-style))_ |
| CG-ADS-013 | Reward only on adFinished; make it visible | mandatory | full | **PASS** | PASS: ads disabled: reward granted on error=false, dead offer removed=true, note="", next level playable=true _(browser-qa)_<br>PASS: overlay + pause on request, muted only from adStarted to adFinished, reward after adFinished, coins 470 -> 1410 _(browser-qa)_ |
| CG-ADS-014 | No out-of-lives offer on every death | mandatory | full | **PASS** | PASS: no revive at 5% powered (result + retry); ring 5 -> 4 then the offer expired without an ad request; one revive watched, none offered after;  _(browser-qa)_<br>PASS: The one-more-strike revive is limited to once per session and only at 85-99% powered; none at 5% powered; the offer expires without an ad re _(manual (browser-qa revive-offer scenario))_ |
| CG-ADS-015 | Midgame OR continue-rewarded between two levels, not both | mandatory | full | **PASS** | PASS: A break gets a midgame OR a rewarded continue: ads.js refuses the second one, and main.js skips the midgame when a rewarded ad was shown on  _(manual (code read src/core/ads.js, src/main.js))_ |
| CG-ADS-018 | Adblock users can play normally | mandatory | full | **PASS** | PASS: adblock: rewarded offer shown=false, notice="Unavailable with an ad blocker", keeps playing=true _(browser-qa)_ |
| CG-ADS-019 | Game runs smoothly with ads disabled (Basic Launch) | mandatory | basic | **PASS** | PASS: ads disabled: reward granted on error=false, dead offer removed=true, note="", next level playable=true _(browser-qa)_ |

## data

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-DATA-001 | Cloud progress save when progress applies | mandatory | full | **PASS** | PASS: reload keeps level 2 / 470 coins via crazygames-data; Data module disabled -> localStorage _(browser-qa)_ |
| CG-DATA-002 | Data module: rely on it fully; 1 MB; debounced | mandatory | full | **PASS** | PASS: reload keeps level 2 / 470 coins via crazygames-data; Data module disabled -> localStorage _(browser-qa)_<br>PASS: Save goes through the SDK data module with a localStorage fallback; reload keeps city 2 and 470 coins; the save is 369 bytes (limit 1 MB); w _(manual (browser-qa persistence + tab-hidden; src/core/save.js))_ |
| CG-DATA-003 | Enable Progress Save in the submission | mandatory | full | **PORTAL** |  |

## submission

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-SUB-001 | Three cover images | mandatory | both | **UNVERIFIED** | check with: check-submission |
| CG-SUB-002 | Cover content restrictions | mandatory | both | **PASS** | PASS: 0 shipped asset files, all in the manifest _(check-licenses)_<br>PASS: 3 manifest rows, none with a forbidden license _(check-licenses)_<br>PASS: no custom-license (tier C) assets _(check-licenses)_<br>PASS: all rows have source, license and tier _(check-licenses)_<br>PASS: every runtime dependency has a license notice _(check-licenses)_ |
| CG-SUB-003 | Preview videos | mandatory | both | **UNVERIFIED** | check with: check-submission + watch the video |
| CG-SUB-004 | Qualitative metadata | mandatory | both | **UNVERIFIED** | check with: docs/STORE_METADATA.md |
| CG-SUB-005 | Test in the Developer Portal preview | mandatory | both | **PORTAL** |  |
