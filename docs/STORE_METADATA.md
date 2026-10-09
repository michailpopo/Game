# Store metadata - Storm Grid

Texts and settings for the CrazyGames Developer Portal submission (filled 2026-10-07). The portal's exact form fields
are not documented publicly: copy each block into the field that asks for it and note any field this file lacks.
The owner submits; Claude never logs in or uploads.

## Title
**Storm Grid**

Name check 2026-10-07: CrazyGames search API `q=storm grid` -> no results, `crazygames.com/game/storm-grid` -> 404;
web search `"Storm Grid" game` -> no game of that name (nearest: "Grid Legion, Storm" on Steam, a card game; "Storm
Grill", a browser incremental game - different words and genre). Details: `docs/ORIGINALITY.md`.

## Short description (1-2 sentences)
Hold to charge a thunderstorm, release to strike a rooftop - and watch your lightning leap from building to building,
forking across a dark 3D city until the whole grid lights up.

## Full description
Storm Grid is a one-button arcade game about chain lightning.

A city has lost its power. You are the storm. Hold to charge, aim at a rooftop and let go: your bolt slams into the
antenna, then jumps from roof to roof on its own, splitting into 2, 4, 8 bolts. Every building it touches lights up in
bright colours and pays coins. Light a whole block for a BLOCK POWERED bonus.

Release in the gold SUPERCHARGE band for a double bolt - but hold too long and your storm fizzles out. You only get a
few strikes per city, so pick your targets: the more of the city you power, the bigger the jackpot (x2, x3, x5, or
x10 for FULL POWER).

Spend your coins on upgrades that visibly change your storm - more hops, more forks, extra strikes, a wider charge band
and golden lightning rods that pay ten times as much. Collect 12 bolt colours, and come back every day for a growing gift.

Cities keep getting bigger and wider, and the world changes as you go: harbours on islands, an old town among fields,
snowy peaks, desert spires, a neon bay, and a city floating above the clouds.

## Controls
| Device | Controls |
|---|---|
| Desktop (mouse) | Hold the left mouse button on a building to charge, release to strike. |
| Desktop (keyboard) | Arrow keys or WASD (ZQSD on AZERTY) move the target, hold Space or Enter to charge, release to strike. P pauses. |
| Mobile / tablet | Touch and hold a building to charge, lift your finger to strike. |

## Submission settings to choose in the portal
| Setting | Value | Why |
|---|---|---|
| Launch type | Basic Launch first (the usual path); Full Launch when offered | ads only run at Full Launch; the game works with ads off |
| Orientation(s) | Landscape **and** portrait (both supported, layout adapts) | the website enforces the choice; no lock logic in game (CG-TECH-011) |
| Progress save | **Data module ON ("Progress Save")** | needed for cloud saves (CG-DATA-003); with it off the game keeps progress in localStorage on that device |
| Mobile support | Yes (touch, safe areas, ~0.25 MB to first play) | |
| Multiplayer | No | single player |
| Languages included | English | the only language in the build (CG-GAME-005) |
| Category / tags (suggestion) | Casual / Arcade; tags: lightning, 3D, one button, upgrade, city | the owner picks from the portal's lists |
| PEGI / audience | 13+ (no violence against people, no gambling, no chat) | CrazyGames audience |

## Assets
- Covers: `submission/covers/landscape-1920x1080.png`, `portrait-800x1200.png`, `square-800x800.png`
- Preview videos (no sound, 15-20 s): `submission/video/landscape-1920x1080.mp4`, `portrait-1080x1620.mp4`
- Build: the folder `submission/storm-grid-build/` = the contents of `dist/` (index.html, assets/, LICENSES/; relative
  paths only). **No zip:** the portal rejects archives ("Archive files are not supported, please drag and drop the files directly", owner 2026-10-09).

## Upload steps (the owner does these; Claude never logs in)
1. Log in at developer.crazygames.com (your own account; never share the password).
2. Create a new game, choose **HTML5**.
3. Open the folder `submission/storm-grid-build/`, select **everything inside it** (`index.html`, `assets`, `LICENSES`)
   and drag it into the upload zone. Do not upload a zip - the portal rejects archives. `index.html` must sit at the top
   level, so drag the folder's contents, not the folder itself.
4. Open the **preview** and play a few cities on desktop and on your phone. Check the SDK messages the preview shows.
   Listen to the sounds (Claude cannot hear them). Tell Claude anything that looks or sounds wrong.
5. Paste title, short and full description and controls from this file.
6. Upload the three covers and the two videos from `submission/`.
7. Settings: orientations landscape + portrait, mobile yes, **Progress Save = Data Module ON**, multiplayer no.
8. Submit and keep the confirmation. Basic Launch usually runs 7-21 days without ads; paste the QA feedback to Claude.
