# Compliance report - Working Title

Generated 2026-09-26 19:18 UTC · build `d344882ed1fc` · target stage **full** · register 2026.09.11 (researched 2026-09-11)

## Verdict: NOT VERIFIED - 39 mandatory requirements lack current evidence

This is a record of what was checked, how and when. It is not an approval: only CrazyGames approves a submission.

| PASS | FAIL | WARN | UNVERIFIED | PORTAL | STALE | N/A |
|---|---|---|---|---|---|---|
| 16 | 0 | 0 | 46 | 3 | 0 | 0 |

Legend: PORTAL = can only be confirmed in the Developer Portal preview or by CrazyGames QA · STALE = manual evidence recorded for a different build · UNVERIFIED = no evidence yet.

## technical

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-TECH-001 | Initial download <= 50 MB | mandatory | both | **UNVERIFIED** | check with: browser-qa boot |
| CG-TECH-002 | Total size <= 250 MB (<= 50 MB without SDK) | mandatory | both | **PASS** | PASS: 0.64 MB (limit 250 MB, SDK integrated) _(check-bundle)_ |
| CG-TECH-003 | File count <= 1500 | mandatory | both | **PASS** | PASS: 6 files (limit 1500) _(check-bundle)_ |
| CG-TECH-004 | Mobile homepage eligibility: initial download <= 20 MB | mandatory | both | **UNVERIFIED** | check with: browser-qa boot |
| CG-TECH-005 | Relative paths only | mandatory | both | **PASS** | PASS: no absolute asset paths _(check-bundle)_ |
| CG-TECH-007 | Works on Chrome and Edge | mandatory | both | **UNVERIFIED** |  |
| CG-TECH-008 | Smooth on a 4 GB RAM Chromebook | mandatory | both | **UNVERIFIED** | check with: browser-qa performance (evidence only) |
| CG-TECH-009 | Mouse, keyboard, and touch if mobile is supported | mandatory | both | **UNVERIFIED** | check with: browser-qa touch |
| CG-TECH-010 | Playable in landscape on desktop | mandatory | both | **UNVERIFIED** | check with: browser-qa viewports |
| CG-TECH-011 | No orientation lock logic | mandatory | both | **PASS** | PASS: no orientation lock _(policy-scan)_ |
| CG-TECH-012 | user-select: none on body | mandatory | both | **PASS** | PASS: user-select: none on body _(policy-scan)_ |
| CG-TECH-013 | Safe areas inside the CrazyGames App | mandatory | both | **UNVERIFIED** |  |
| CG-TECH-016 | Resume audio after iOS interruptions | mandatory | both | **UNVERIFIED** |  |
| CG-TECH-017 | Use SDK system info for device-specific experiences | guideline | both | **UNVERIFIED** |  |

## gameplay

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-GAME-001 | New users land in gameplay (max 1 click) | mandatory | full | **UNVERIFIED** |  |
| CG-GAME-002 | Legible at devicePixelRatio 1 at the named iframe sizes | mandatory | both | **UNVERIFIED** | check with: browser-qa viewports + look at screenshots |
| CG-GAME-003 | Physics consistent across refresh rates | mandatory | both | **PASS** | PASS: simulation is free of Math.random/clock reads _(policy-scan)_<br>PASS: determinism exact, step-size drift 0.73% at 30/60/120/240 Hz _(sim-health)_ |
| CG-GAME-004 | Loads quickly, no errors or crashes | mandatory | both | **PASS** | PASS: no source maps, mock SDK, localhost URLs or secrets _(check-bundle)_ |
| CG-GAME-005 | English localization; accurate translations from SDK locale | mandatory | both | **UNVERIFIED** |  |
| CG-GAME-006 | Intuitive controls on each device type | mandatory | both | **UNVERIFIED** |  |
| CG-GAME-007 | Original name, assets and content | mandatory | both | **PASS** | PASS: 0 shipped asset files, all in the manifest _(check-licenses)_<br>PASS: 3 manifest rows, none with a forbidden license _(check-licenses)_<br>PASS: no custom-license (tier C) assets _(check-licenses)_<br>PASS: all rows have source, license and tier _(check-licenses)_<br>PASS: every runtime dependency has a license notice _(check-licenses)_ |
| CG-GAME-008 | No custom fullscreen button | mandatory | both | **PASS** | PASS: no custom fullscreen _(policy-scan)_ |
| CG-GAME-009 | No cross-promotion (narrow exceptions) | mandatory | both | **PASS** | PASS: no window.open _(policy-scan)_<br>PASS: no app store links _(policy-scan)_<br>WARN: external URL (cross-promotion or externally loaded asset?): src/core/zzfx.js:3: https://github.com/KilledByAPixel/ZzFX _(policy-scan)_ |
| CG-GAME-010 | PEGI 12, audience 13+, not targeted at kids | mandatory | both | **UNVERIFIED** |  |

## quality

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-QUAL-001 | Avoid browser-reserved keys | guideline | both | **PASS** | PASS: Escape not bound _(policy-scan)_ |
| CG-QUAL-002 | Key bindings adapt to keyboard layout | guideline | both | **PASS** | PASS: movement keys read via KeyboardEvent.code _(policy-scan)_ |
| CG-QUAL-003 | In-gameplay, skippable, visual onboarding | guideline | both | **UNVERIFIED** |  |
| CG-QUAL-004 | Honest buttons | guideline | both | **UNVERIFIED** |  |
| CG-QUAL-005 | Fun-experience principles | guideline | both | **UNVERIFIED** |  |
| CG-QUAL-006 | Unique, honest identity | guideline | both | **UNVERIFIED** |  |
| CG-QUAL-007 | Consistent high-quality visuals and audio | guideline | both | **UNVERIFIED** |  |

## sdk

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-SDK-001 | SDK required for Full Launch (HTML5 v3) | mandatory | full | **PASS** | PASS: SDK v3 tag in <head> before game code _(check-bundle)_ |
| CG-SDK-002 | First gameplayStart marks a real playable state | mandatory | both | **PORTAL** | check with: browser-qa sdk-events locally |
| CG-SDK-003 | gameplayStart/gameplayStop on real breaks, not on focus loss | mandatory | full | **PASS** | PASS: gameplayStop not tied to focus/visibility _(policy-scan)_ |
| CG-SDK-004 | settings.muteAudio outranks the in-game toggle | mandatory | full | **UNVERIFIED** | check with: browser-qa mute-priority |
| CG-SDK-005 | Handle SDK environments | mandatory | both | **UNVERIFIED** | check with: browser-qa no-sdk, sdk-disabled, sdk-init-hang |
| CG-SDK-006 | loadingStart/loadingStop (optional) | guideline | full | **UNVERIFIED** | check with: browser-qa sdk-events |
| CG-SDK-007 | Report completion percentage | guideline | full | **UNVERIFIED** |  |
| CG-SDK-008 | Attach game context to player feedback | guideline | full | **UNVERIFIED** |  |
| CG-SDK-009 | happytime sparingly | guideline | full | **UNVERIFIED** |  |

## ads

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-ADS-001 | Only CrazyGames SDK ads | mandatory | both | **PASS** | PASS: no third-party ad networks _(policy-scan)_ |
| CG-ADS-002 | Video ads never interrupt gameplay | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-003 | Pause and block UI for the whole ad request | mandatory | full | **UNVERIFIED** | check with: browser-qa ads-slow-fill |
| CG-ADS-004 | Mute on adStarted, unmute on finish/error | mandatory | full | **UNVERIFIED** | check with: browser-qa ads-fill |
| CG-ADS-005 | Handle adError and continue | mandatory | full | **UNVERIFIED** | check with: browser-qa ads-basic-launch |
| CG-ADS-006 | No custom midgame cooldown needed | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-007 | Rewarded offers are clearly optional and marked as video | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-008 | Decline option looks the same as accept | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-009 | No rewarded button on active gameplay screens | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-010 | No ad chaining | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-011 | Not too often, not too aggressive | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-012 | A non-ad alternative exists | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-013 | Reward only on adFinished; make it visible | mandatory | full | **UNVERIFIED** | check with: browser-qa ads-basic-launch, ads-fill |
| CG-ADS-014 | No out-of-lives offer on every death | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-015 | Midgame OR continue-rewarded between two levels, not both | mandatory | full | **UNVERIFIED** |  |
| CG-ADS-018 | Adblock users can play normally | mandatory | full | **UNVERIFIED** | check with: browser-qa adblock |
| CG-ADS-019 | Game runs smoothly with ads disabled (Basic Launch) | mandatory | basic | **UNVERIFIED** | check with: browser-qa ads-basic-launch |

## data

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-DATA-001 | Cloud progress save when progress applies | mandatory | full | **UNVERIFIED** | check with: browser-qa persistence (local); portal for cloud |
| CG-DATA-002 | Data module: rely on it fully; 1 MB; debounced | mandatory | full | **UNVERIFIED** |  |
| CG-DATA-003 | Enable Progress Save in the submission | mandatory | full | **PORTAL** |  |

## submission

| Id | Requirement | Type | Stage | Status | Evidence |
|---|---|---|---|---|---|
| CG-SUB-001 | Three cover images | mandatory | both | **UNVERIFIED** | check with: check-submission |
| CG-SUB-002 | Cover content restrictions | mandatory | both | **PASS** | PASS: 0 shipped asset files, all in the manifest _(check-licenses)_<br>PASS: 3 manifest rows, none with a forbidden license _(check-licenses)_<br>PASS: no custom-license (tier C) assets _(check-licenses)_<br>PASS: all rows have source, license and tier _(check-licenses)_<br>PASS: every runtime dependency has a license notice _(check-licenses)_ |
| CG-SUB-003 | Preview videos | mandatory | both | **UNVERIFIED** | check with: check-submission + watch the video |
| CG-SUB-004 | Qualitative metadata | mandatory | both | **UNVERIFIED** | check with: docs/STORE_METADATA.md |
| CG-SUB-005 | Test in the Developer Portal preview | mandatory | both | **PORTAL** |  |
