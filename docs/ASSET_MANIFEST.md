# Asset manifest - Storm Grid

Every shipped file (images, models, audio, fonts, vendored code) gets a row **before** it is committed.
`node tools/qa/check-licenses.mjs` fails on any file under `src/assets/` or `public/` (except
`public/LICENSES/`) without a row, and on forbidden licenses.

Tiers: **A** free use (CC0, MIT, Unlicense, Quaternius Asset License) · **B** credit required (CC BY,
OFL) · **C** custom license the user explicitly approved · **X** never (NonCommercial, personal use,
editorial, no license, ripped, GPL art).

A row may cover a folder with a trailing `/*` when every file in it has the same source and license.

| File | Source | Author | License | Tier | Modified | Added |
|---|---|---|---|---|---|---|
| src/core/zzfx.js | https://github.com/KilledByAPixel/ZzFX v1.3.2 | Frank Force | MIT | A | yes: sample generator only | 2026-09-26 |
| (npm) three, bundled by Vite | https://www.npmjs.com/package/three | three.js authors | MIT | A | no | 2026-09-26 |
| (npm) @fontsource/lilita-one, bundled by Vite | https://www.npmjs.com/package/@fontsource/lilita-one | Juan Montoreano | OFL-1.1 | B | no | 2026-09-26 |
| src/game/music.js (background music) | written for this game in code, rendered at runtime with the Web Audio API (no samples, no external material) | this project | project's own | A | n/a | 2026-10-08 |
| src/assets/sfx/* | Kenney audio packs, https://kenney.nl/assets/ : sci-fi-sounds, digital-audio, impact-sounds, interface-sounds, music-jingles, casino-audio, ui-audio (zips downloaded 2026-10-07; License.txt in each pack and the asset pages: "Creative Commons CC0"; copy in public/LICENSES/KENNEY_LICENSE.txt). Source file per sound and every edit: tools/audio/build-sfx.mjs | Kenney (www.kenney.nl) | CC0 1.0 | A | yes: trimmed, faded, mono, loudness-matched, MP3 80 kbps; thunder.mp3 is layered from laserSmall_001 + explosionCrunch_000 + lowFrequency_explosion_000 + generated brown-noise rumble | 2026-10-07 |

Credits for tier B assets also go into `public/LICENSES/THIRD_PARTY_NOTICES.txt` (and an in-game
credits line for CC BY art/audio).
