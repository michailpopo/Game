# Asset manifest - Working Title

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

Credits for tier B assets also go into `public/LICENSES/THIRD_PARTY_NOTICES.txt` (and an in-game
credits line for CC BY art/audio).
