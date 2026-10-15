# Quality pass after the CrazyGames rejection (2026-10-15)

**Rejection** (Developer Portal, submitted 13.10.2026, Basic): "The overall quality of the game does not yet meet the
expectations of our platform." No more detail was given.
**Guidelines read:** https://docs.crazygames.com/requirements/quality/ (fetched 2026-10-15 in this session).

## What a reviewer most likely saw in the rejected build (checked in this session, screenshots in the scratchpad)

1. **The game did not look like its store cover.** The cover is a glowing neon night city with lightning; the game was
   a daytime green field with grey-purple boxes, and the bolt barely showed against the bright scene. The guidelines say
   "the name and imagery presented on CrazyGames should reflect accurately the type of game the player will experience".
2. **New players could fail the first city.** A Node simulation of naive players (`tools/balance/naive-players.mjs`)
   showed quick clickers clearing city 1 only 58% of the time, and failing every time from city 2. The landing screen
   explained the controls in two lines of text.
3. **The HUD read like debug output.** A stats box ("3/3 Strikes · 0/4 Blocks · 0 Best chain") and no visible goal.
4. **WP-31 / WP-32 (look, juice, sounds, shop, offers) shipped unverified**; 9 of 21 browser checks failed at the handoff.
5. **Audio:** four effects clipped above 0 dBFS (the strike thunder, played on every strike, peaked at +1.8 dBFS),
   and there was no music.

## Guideline -> what changed

| Guideline (quality page) | Change | Where |
|---|---|---|
| Onboarding: land in a simple onboarding in gameplay; visuals over text; show the controls with mouse gestures / a keyboard overlay; skippable | An animated hand over the best dark building: press -> ring fills -> turns gold -> "LET GO!" -> bolt. Keyboard players see a SPACE key cap instead. It never blocks: any press plays. It stays until the player lands a SUPERCHARGE of their own | `src/main.js` `tutorStep`, `src/ui/ui.js` `showTutor`, styles "Quality pass" block |
| Onboarding: focus on the core so users can start | City 1's first strike is a guaranteed SUPERCHARGE and city 1 has longer hops: the first release lights ~75% of the city (median). Naive policies now clear city 1 every time (tool output below) | `src/game/sim.js` `assist`, `STORM.strike.firstCity.range` |
| General: clear goals; easy to understand | Meter labels GOAL (60%) / x3 / x5 that light up with a "CITY CLEARED!" / "JACKPOT xN!" pop when reached; "Goal: light up 60% of the city" on the intro; "Hold longer!" / "Let go in the GOLD!" after a weak or late release in the first runs | `src/ui/ui.js`, `src/main.js` `hud`, `src/game/view.js` |
| Display layout comfortable and intuitive | The stats box is gone during play; a small CITY chip under the coins; the BLOCK POWERED card no longer peeks out behind dialogs | `src/ui/ui.js` `setPanel` / `showResult` |
| Aesthetics: high quality, consistent, attractive; name and imagery reflect the game | Night storm look that matches the cover: dark blacked-out city, buildings flood with candy colour and warm glowing windows, streetlights switch on per powered block, rain, a storm deck with sheet lightning, every strike flashes the sky and throws a coloured light on the roofs around the cascade. 8 themed night skies | `src/game/look.js`, `src/game/city-mesh.js`, `src/render/look.js` `setFlash`, `src/fx/rain.js`, `src/game/view.js` `#lights` |
| Audio comfortable, consistent levels, music complements the visuals | Procedural music (96 BPM, Am-F-C-G; calm layer on menus, rhythm layer during strikes), rain bed, distant thunder with the cloud flashes, a master limiter; clipping effects lowered. Measured: no sound peaks above -0.5 dBFS, music ~11 dB under the median effect | `src/game/music.js`, `src/core/audio.js`, `src/game/sfx.js`, `tools/qa/audio-levels.mjs` |
| Game responds quickly | Unchanged (hold/release in the fixed-step sim); the first frame no longer shows an empty sky while shaders compile: they compile behind the boot screen, which now shows the title | `src/main.js` boot, `index.html` |
| Restricted keys / AZERTY | Unchanged and still fine: physical keys via `event.code`, no Escape, no Ctrl combos | `src/core/input.js` |

## Evidence (this session)

- `node tools/balance/naive-players.mjs 1,2,3 300` (median / p10 / pass rate per policy) - city 1 after the change:
  tapper 100% / 92% / 100%, holder 100% / 100% / 100%, random 100% / 96% / 100%. Before (no assist, 16 m hops):
  tapper 63% / 50% / 58%.
- `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/qa/audio-levels.mjs` -> PASS (no clipping; music bed 10.8 dB
  under the median effect).
- `node tools/qa/sim-health.mjs --selftest` -> PASS. `npm run build` -> OK.
- Browser harness (full run + re-runs): 19 PASS after fixes, 3 UNVERIFIED that need eyes (viewports and ad-UI looked at
  by Claude; performance needs a real device) - details in HANDOFF.md section 8.
- Bugs found and fixed on the way: a negative frame time froze the simulation after a long block (`src/core/loop.js`);
  `renderer.compileAsync` polls forever without `KHR_parallel_shader_compile`; the revive countdown ran on capped frame
  time; the QA harness left crashed pages running (the cascade of failures at the 09-28 handoff).
- Covers rendered from the real game in the new look: `submission/covers/`.

## Needs the owner (Claude cannot do these)

1. **Listen**: the new music loop, the rain, the distant thunder and the re-levelled thunder/fail sounds.
2. **Play** city 1-5 on PC and phone (the onboarding hand, the first-strike SUPERCHARGE, the new look).
3. **Covers**: the store cover already shows a night city; the game now matches it. Fresh covers rendered from the real
   game can be made with `npm run launch:covers` (they show the new look) - pick which to upload.
4. **Re-submit** in the Developer Portal (Claude never logs in or uploads). Mention in the notes that the look, the
   onboarding and the audio were reworked after the quality feedback.
