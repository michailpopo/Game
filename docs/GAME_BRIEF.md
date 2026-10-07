# Game brief - Storm Grid (concept T1 "Volt City", renamed 2026-09-26)

Status: Gate 1 passed 2026-09-26. The owner picked T1 Volt City (docs/CONCEPTS.md "Round 3 decision") and kept the name
(see the **name warning** under Risks). The owner's constraint: **"It must be 3d game"**.
Last updated: 2026-09-26 · Author: game-concept-designer.
Previous briefs: `docs/shelved/SKIP_LEGEND_BRIEF.md` and `docs/shelved/COMET_CHAIN_BRIEF.md`.

**Where the numbers come from:** a Monte Carlo of the exact chain rule below (seeded cities, 3 player profiles, a greedy
upgrade buyer, 20-30 campaigns each, 2026-09-26). The model is described in "Economy", so the engineer can port it as a
Node balance test.

## One-line pitch
A 3D city lies in blackout. Hold to charge a storm, release to strike a rooftop, and watch the lightning **leap from
antenna to antenna, forking as it goes**, while every building it touches lights up window by window and pays. Power
the whole city for the x10 jackpot.

## Loops
| Loop | Length | Description (verbs) |
|---|---|---|
| Core | 1-6 s per strike | **hold** (aim with the press position, the charge ring fills) -> **release** (in the SUPERCHARGE band for max power) -> the bolt hits the chosen antenna and **chains** through the city in 3D, forking; each lit building pays "+N"; whole districts light for a bonus |
| Session (one city) | 15-35 s | 3-6 strikes per city -> % powered -> jackpot plate (x2 / x3 / x5 / x10 FULL POWER) -> Claim or Claim x3 -> upgrades -> next city (>= 60% powered) or retry |
| Meta | days | coins -> 5 upgrades (Voltage, Fork, Strikes, Capacitor, Gold rods) that visibly change the storm; 40 cities in 8 themed districts; 12 bolt skins; daily gift with a forgiving streak; after city 40, the endless "Storm Season" (Should) |

## First 30 seconds (beat by beat, cold start)
| Time | What the player sees | What they do | Feedback |
|---|---|---|---|
| 0-2 s | The first frame is the level. A small dark 3D city of 24 buildings in 2x2 blocks, seen from an elevated 3/4 camera slowly drifting. A purple storm cloud rumbles overhead, one tall rooftop antenna pulses, and a hand icon shows "hold". A "0% POWERED" meter sits at the top. No menu. | - | distant thunder, a soft hum |
| 2-3 s | - | press and hold anywhere (the target ring snaps to the nearest antenna) | the charge ring fills around the target (1.2 s to full), the hum rises, sparks gather in the cloud |
| ~3 s | The ring enters the gold SUPERCHARGE band (80-95%); the first city ever widens it to 60-95% and slows the fill to 1.6 s | release | "SUPERCHARGE!" ding, a white-cyan bolt slams the antenna: 60 ms hit-stop, flash, camera kick |
| 3-6 s | Two bolts leave the impact and leap rooftop to rooftop through 3D space | watch | each hop crackles on a rising pitch ladder, the building lights gold window by window, "+2 +2 +3 ...". **First "+N" within ~1 s of the release** |
| 6-8 s | A whole block lights up | - | "BLOCK POWERED" chord, streetlights flash on, "+25%" |
| 8-20 s | Strikes 2 and 3 on the dark parts of the city | hold / release | "FORK x2", meter climbs 40% -> 75% -> 94% |
| 20-24 s | The meter lands; the camera orbits the lit city | - | jackpot plate x5 slams down, coins fly in (~170 on city 1) |
| 24-30 s | Result: Claim (city 1 has no video offer), the Voltage upgrade card glows affordable (60), "Next city" | tap Claim, tap the Voltage card | upgrade pop: "+2 hops"; city 2 builds itself block by block |

No ad of any kind before city 4. The first city is tuned so every player gets at least the x3 plate (assist above).

## Controls
| Device | Input | Action |
|---|---|---|
| Touch | **press and hold** anywhere on the city = charge. The target ring snaps to the antenna nearest the finger (screen distance, max 80 px; otherwise the nearest unlit building to the ground point under the finger). Dragging while holding moves the target. **Release** = strike. A second finger is ignored. | aim + charge + strike |
| Mouse | **left button hold / release**, the same rules; the target follows the cursor while holding | same |
| Keyboard (physical keys, `KeyboardEvent.code`) | `ArrowUp/Down/Left/Right` and `KeyW/A/S/D` move a crosshair between antennas (snap to the nearest in that screen direction); **hold / release `Space` or `Enter`** = charge / strike; `KeyP` pause; `KeyM` mute. `e.repeat` ignored; no Escape; no Ctrl combos. | same |

**Mouse-control rule check (CG-QUAL-008): no.** This is click-to-target: the player chooses a point by pressing on it,
and nothing follows mouse movement continuously. The rule's own text says "Click-on-UI games need no confinement". No
pointer lock, and `project.json` `mouse-gesture = false`. The hold uses pointer capture, so a release outside the
frame still fires the strike and cannot click the page.

## The charge meter
The fill is linear, 0 -> 100% in **1.2 s**. The first city ever: 1.6 s, with a band of 60-95%.

| Charge at release | Name | Strike energy (hops) | Extra |
|---|---|---|---|
| 0-40% | WEAK | 0.5 x E0 | - |
| 40% - band start | CHARGED | E0 x (0.5 + 1.25 x (c - 0.4)), rising to E0 | - |
| **band start - 95%** | **SUPERCHARGE** (gold ring) | **1.3 x E0 per bolt, two bolts leave the impact** | "SUPERCHARGE!" + a guaranteed fork at impact |
| 95-100% | HOT | E0 | - |
| > 100% | OVERCHARGE (the ring flashes red) | if still held 0.35 s after full (1.55 s), the strike auto-fires as a **FIZZLE**: energy 3, no forks | sputter sound |

- The band is 80-95% at Capacitor 0. Each Capacitor level widens it downward by 3 points (max level 5: 65-95%).
- `E0 = 8 + 2 x Voltage` hops (Voltage 0-15 -> 8-38).

## The chain algorithm (deterministic, seeded; runs in the fixed-step sim)
- **Hop:** a bolt at building i with energy e > 0 jumps to the **nearest unlit antenna within range R**, measured in 3D
  between antenna tips. So tall towers are hubs, and a tall neighbour can be out of reach.
  - `R = 16 m + 0.5 m x Voltage` (16 -> 23.5 m).
  - Each hop costs 1 energy and lights that building.
  - If no unlit antenna is within R, the bolt **grounds out**: a spark into the street, and that bolt ends.
- **Hop timing:** `0.08 s + 0.07 s x (1 - e / e_strike)`. Fresh bolts leap fast; the last hops slow down (the
  "running out of juice" read).
  - A cascade of 20-40 hops with forks lasts ~2-5 s.
  - Bolts advance in parallel; each hop is an event the view animates (jagged ribbon from tip to tip, halo at arrival).
- **Fork:** on each hop, with chance `F = 5% + 3% x Fork` (5% -> 35%), the bolt splits in two.
  - **Both children carry `ceil(0.6 x (e - 1))`**, so a fork adds ~20% energy and doubles the spread.
  - Bolts on screen go 1 -> 2 -> 4 -> 8.
- **Gold rods** (Gold rods upgrade: 1-5 per city, from city 3): a gold antenna pays **x10**, always forks, and gives
  **+4 energy** to the arriving bolt.
- **"+N" per lit building:** `N = round((1 + floors / 8) x 1.06^(city-1) x min(2, 1 + 0.02 x depth)) x (10 if gold)`.
  - `floors = height / 4 m` (3-15).
  - `depth` = hops since the strike's impact, so deep chains pay more. The numbers climb visibly within a cascade.
- **BLOCK POWERED:** when every building of a district is lit, that district pays **+25% of its buildings' value**,
  plays a major chord, and its streetlights come on.
- **% powered** = lit buildings / all buildings (count).

## City generation (3D, procedural, seeded per city)

| City | Buildings | Districts | Avenue extra gap | Park chance | Tallest | Theme |
|---|---|---|---|---|---|---|
| 1 | 24 | 2x2 | 4.0 m | 10% | 24 m | Downtown |
| 5 | 35 | 3x3 | 4.8 m | 11.5% | 28 m | Downtown |
| 10 | 57 | 3x3 | 5.8 m | 13.5% | 32 m | Harbour |
| 20 | 147 | 4x4 | 7.9 m | 17% | 41 m | Hill Towers |
| 40 | 300 | 5x5 | 12 m | 25% | 60 m | Sky Port |

Formulas:
- **Buildings:** `N = min(300, round(24 x 1.10^(city-1)))`.
- **Districts:** blocks of 3x3 lots (N <= 40) or 4x4 lots; the district count is `ceil(sqrt(N / (lots² x (1 - park))))`
  per side.
- **Lots:** 9 m apart with +-1.2 m jitter. **Avenues** between districts add `4 + 8 x (city-1)/39` m (4 -> 12 m). This
  is the key difficulty knob: wide avenues stop bolts, so strikes must be placed per district.
- **Parks** (empty lots, trees): `10% -> 25%`.
- **Heights:** uniform 12 m to `24 + 36 x (city-1)/39` m. **Antenna tip** = roof + 3 m.
- **Themes (8 x 5 cities):** Downtown, Harbour, Old Town, Hill Towers, Neon Bay, Snow Peak, Desert Spires, Sky Port.
  Each has its own window colour and skyline silhouettes; the rules stay the same.

## Run structure
- **Strikes per city:** 3 (+1 per Strikes level, max 6). The city ends after the last cascade, or earlier when 100%
  is reached.
- **Jackpot plate** on the run's coins:

  | % powered | Plate |
  |---|---|
  | < 60% | x1 (retry this city, with the true near-miss line "57% - 3% short of the next city") |
  | >= 60% | **x2**, city cleared |
  | >= 80% | **x3** |
  | >= 95% | **x5** |
  | 100% | **x10 FULL POWER** |

- The pass threshold `passPct = 0.60` is the main tuning knob. Raising it to 0.80 lengthens the mid-game (see Risks).

## Progression and difficulty (average player, from the Monte Carlo)

> **Rebalanced 2026-10-07** (owner: "too fast progress, too few levels, I maxed everything after a few minutes").
> Measured with `node tools/qa/economy-sim.mjs` on the real sim and prices (no ads, no gift): before, all upgrades
> were maxed after 6-7 min and a hard wall stood at city ~37-50 from minute ~15. Now: 79 upgrade levels (Voltage 30,
> Fork 30, Strikes 4, Capacitor 10, Gold 5) with the same per-level storm power spread over 2x the levels (Voltage
> +1 hop/+0.25 m, Fork +1%, Capacitor +1.5 points) plus a 4th Strikes level as the end goal; prices
> base x growth^n x lateGrowth^(n - lateFrom); the share needed to CLEAR a city climbs 60% -> 70% over cities 8-35
> (`passFor`, plates unchanged); the difficulty ramp runs to city 70 (was 40); coins grow 4% per city (was 6%).
> Skilled / average simulated player: city ~21 / 18 at 5 min, ~50 / 43 at 30 min, ~63 / 62 at 1 h, all upgrades at
> ~98 / 119 min, then slow endless progress (city ~111 / 92 at 4 h). The table below is the original design.
| City | Buildings | Typical upgrades on arrival (Volt/Fork/Strikes/Cap/Gold) | E0 / SUPERCHARGE per bolt | R | Fork | Strikes | % powered (novice / avg / skilled) | Avg plate (avg) | Tries to clear (novice / avg) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 24 | 0/0/0/0/0 | 8 / 10 | 16 m | 5% | 3 | 80 / 90 / 96% | x4.8 | 1.1 / 1.0 |
| 5 | 35 | 4/2/0/1/0 | 16 / 20 | 18 m | 11% | 3 | 84 / 93 / 96% | x5.3 | 1.0 / 1.0 |
| 10 | 57 | 7/5/0/3/1 | 22 / 28 | 19.5 m | 20% | 3 | 75 / 94 / 99% | x5.0 | 1.3 / 1.0 |
| 20 | 147 | 11/8/2/5/4 | 30 / 39 | 21.5 m | 29% | 5 | 70 / 92 / 96% | x3.9 | 1.4 / 1.0 |
| 40 | 300 | max 15/10/3/5/5 | 38 / 49 | 23.5 m | 35% | 6 | 45 / 56 / 60% | x1.3 | 13.6 / 3.3 ("Legend City", the campaign's final wall) |

- **Runs to reach:** city 10 after ~9 runs (novice ~10), city 20 after ~19 (novice ~21), city 40 after ~41 (novice
  ~69). One run is ~25-40 s including the result, so city 20 comes at ~10-12 min.
- **New idea introduced at:**
  - city 1: hold / release, SUPERCHARGE;
  - city 2: upgrades;
  - city 3: gold rods (if bought) and the shop;
  - city 4: the first midgame break, try-skin;
  - city 6: the first 3x3 city with wide avenues ("strike each district");
  - every 5th city: a new theme.
- **Peaks and relief:**
  - Peaks: every SUPERCHARGE, the first fork, BLOCK POWERED, FULL POWER, and each theme's 5th city (the widest
    avenues of that theme).
  - Relief: the first city of each theme is smaller (x0.85 buildings).

## Economy (numbers)
**Coins per run:** the plate is included; no ads; from the Monte Carlo.

| City | Novice | Average | Skilled |
|---|---|---|---|
| 1 | 118 | 174 | 270 |
| 5 | 272 | 394 | 545 |
| 10 | 482 | 1,043 | 1,771 |
| 20 | 1,776 | 4,044 | 5,960 |
| 40 | 3,811 | 6,065 | 7,203 |

**Upgrades since 2026-10-07** (src/config.js ECONOMY.upgrades; prices from src/game/meta.js upgradeCost):

| Upgrade | Effect per level | Levels | First prices ... last | Total |
|---|---|---|---|---|
| **Voltage** | +1 hop per bolt, +0.25 m range | 30 | 60, 75, 95, 115, 145 ... 66,800, 88,550, 117,300 | 478,525 |
| **Fork** | +1% fork chance (5% -> 35%) | 30 | 90, 115, 140, 175 ... 100,250, 132,800, 175,950 | 717,785 |
| **Strikes** | +1 strike per city (3 -> 7) | 4 | 1,500, 12,000, 96,000, 768,000 | 877,500 |
| **Capacitor** | SUPERCHARGE band 1.5 points wider (80-95% -> 65-95%) | 10 | 150, 285, 540, 1,050 ... 62,200, 147,700 | 255,775 |
| **Gold rods** | +1 gold antenna per city | 5 | 400, 1,700, 7,400, 31,800, 136,750 | 178,050 |

Saves from before (v3) are migrated to v4 with equal power (Voltage x2, Fork x3, Capacitor x2 levels).

**Original upgrades** (until 2026-10-07; rounded to 5 below 1,000, to 50 above; shown as objects on the storm-control rooftop in the result screen):

| Upgrade | Effect per level | Price | Max | Prices | Total |
|---|---|---|---|---|---|
| **Voltage** | +2 hops per bolt (E0), +0.5 m range | 60 x 1.45^n | 15 | 60, 85, 125, 185, 265, 385, 560, 810, 1,150, 1,700, 2,450, 3,550, 5,200, 7,500, 10,900 | 34,925 |
| **Fork** | +3% fork chance (5% -> 35%) | 100 x 1.55^n | 10 | 100, 155, 240, 370, 575, 895, 1,400, 2,150, 3,350, 5,150 | 14,385 |
| **Strikes** | +1 strike per city (3 -> 6) | 600 x 3^n | 3 | 600, 1,800, 5,400 | 7,800 |
| **Capacitor** | SUPERCHARGE band +3 points wider (80-95% -> 65-95%) | 150 x 1.9^n | 5 | 150, 285, 540, 1,050, 1,950 | 3,975 |
| **Gold rods** | +1 gold antenna per city (x10 pay, always fork, +4 energy) | 300 x 2.1^n | 5 | 300, 630, 1,300, 2,800, 5,850 | 10,880 |

**Bolt skins** (12, cosmetic only: bolt core/glow colour, spark shape, crackle timbre; no stat changes):
- Storm Cyan (owned), Magenta, Solar Gold, Plasma Green, Ember, Frost, Violet, Ruby, Neon Rainbow, Void, Aurora,
  Legend White-Gold.
- "Unlock random" (always new) at `250 x 1.45^(n-1)`: 250, 365, 525, 760, 1,105, 1,600, 2,320, 3,365, 4,880, 7,075,
  10,260 (total ~32,500).

**Pace:**
- The first upgrade (Voltage 60) is affordable after city 1.
- Cities 1-10: an upgrade after almost every run. Cities 10-20: every 1-2 runs. All upgrades max near city 30 for an
  average player.
- A skin every ~3-5 runs if saved for.
- The model's buyer spends only on upgrades; skins, daily gifts and videos are not in it.

**What one video is worth (average player):**

| Offer | City 1-3 | City ~5 | City ~10 | City ~20 |
|---|---|---|---|---|
| Claim x3 (extra over Claim) | +350 | +790 | +2,090 | +8,090 |
| Free upgrade (the cheapest unaffordable level) | 60-125 | 185-240 | 560-600 | 2,450-3,350 |
| Shop cash (22% of the next skin) | +55 | +80-115 | +165-240 | +510-740 |
| Supercharged start (+2 strikes this city) | +67% energy: typically one plate step up (e.g. x3 -> x5), worth +40-100% of the run | same | same | same (+40% at 5 strikes) |
| One more strike (>= 85% powered) | usually lifts to x5 or FULL POWER x10 | same | same | same |
| Daily gift x2 (base = 2 x average run coins at the best city x streak 1.0-2.0) | +350 | +790 | +2,090 | +8,090 |

## Hook cadence (default target: references/design/hypercasual-hits.md)
| Scale | Interval | What happens | Feedback |
|---|---|---|---|
| micro | 0.08-0.15 s per hop during cascades; the charge between | a building lights, "+N" | crackle on a pentatonic ladder that climbs with depth, windows fill gold, the % meter ticks |
| streak | every fork (several per cascade from Fork 3+) | "FORK x2 / x4 / x8", bolt count doubles | a fork zap one step up the ladder, the bolt colour brightens |
| peak | every strike (3-8 s) | SUPERCHARGE impact, BLOCK POWERED, gold rod x10 | 60 ms hit-stop, flash, camera kick; chord; a big gold "+N x10" |
| run end | 15-35 s | % powered -> jackpot plate x2 / x3 / x5 / **x10 FULL POWER** | camera orbit of the lit city, the plate slams, coin fly-in, **Claim / Claim x3** |
| meta | every 1-2 runs | an upgrade visibly changes the storm (more hops, more forks, gold rods, more strikes); a new city every run; a theme every 5 | upgrade pop on the storm-control rooftop; the next city builds itself |
| return | daily | gift and streak | **Collect / Collect x2** |

- **First reward after the first input:** "+N" ~1 s after the first release (release at ~3 s): <= 4 s from load.
- **Near-miss:** "57% - 3% short of the next city", "96% - one building from FULL POWER" (true values); the One-more-strike
  offer appears only then (>= 85%).
- **The 3-second clip:** a finger holds, the cloud crackles, release -> a white-cyan bolt slams a rooftop, splits and
  splits again across the 3D skyline, and a wave of gold windows lights up behind it, "+8 +8 +16 +32, FORK x8".

## Reason to come back tomorrow (D1)
- **Unfinished business:** the next theme's silhouette ("Neon Bay at city 21"), the next upgrade 70-90% paid (shown on
  the result), the best plate per city (a star row: x2 / x3 / x5 / x10, "FULL POWER 12/20").
- **The skin collection** ("3/12").
- **The daily gift** with a forgiving 7-day streak (x1.0, 1.15, 1.3, 1.45, 1.6, 1.8, 2.0; a missed day steps back one
  day).
- **Save:** all progress in the Data module.

## Art direction (3D)
- **Style profile:** M minimal-poly with a premium light kit (the look kit being built in WP-20).
  - Budgets (`project.json`): <= 2,000 tris per geometry, <= 60,000 tris and <= 60 draw calls per frame, no model
    files, canvas textures only.
- **Geometry:**
  - buildings: instanced `BoxGeometry` (12 tris) with per-instance scale; ~300 max;
  - roof details: parapet boxes and antenna cylinders (6 segments, 24 tris);
  - streets: one ground plane with a canvas road texture; parks: instanced cone trees;
  - skyline backdrop: large low boxes;
  - bolts: camera-facing ribbons along jagged 3D polylines (6-10 kinks per hop), regenerated every 50 ms for flicker;
  - halos: instanced additive quads at every arrival point;
  - sparks: instanced particles (<= 250).
  - Estimate: ~20-25k tris, <= 20 draw calls before post.
- **Look kit (WP-20):**
  - tone mapping (the kit's choice, Neutral or AgX), exposure ~1.1;
  - `HemisphereLight` (sky `#3a3f8f`, ground `#0b0d1f`) plus a cool moonlight `DirectionalLight` `#9fb7ff` with one soft
    PCF shadow map (1024) over the city (buildings cast, ground receives); the low tier uses blob shadows;
  - **emissive window texture**: a canvas atlas of window grids (lit `#ffd166`, dark `#1a1d33`). The lit state is per
    instance (two instanced meshes or a per-instance attribute), so a building "fills" from the ground up over
    0.3 s;
  - **bloom on the high quality tier only**: half-resolution UnrealBloom, strength ~0.9, radius ~0.4, threshold ~0.75.
    Medium and low tiers get the glow from **additive halo sprites** and bright emissive colours.
- **Palette:**
  - sky gradient `#0a0e2a` -> `#2a1a5e` with a magenta horizon glow `#ff3fa4`;
  - wet streets `#12152b` (roughness 0.3);
  - unlit buildings `#1b1f3b`, lit facades `#2b2f55` with windows gold `#ffd166`, with per-theme accents (coral
    `#ff8a5b`, cyan `#7cf3ff`);
  - bolt core `#ffffff`, glow `#4df3ff` (skin colour);
  - gold rods `#ffcc33` with an emissive tip;
  - plates: x2 `#4df3ff`, x3 `#7cff7a`, x5 `#ffcc33`, x10 `#ff3fa4`;
  - UI: bold white numerals with a cyan outer glow; the big % meter at the top centre.
- **Camera (perspective):**
  - **Landscape:** FOV 45°, elevated 3/4 (pitch 38° down, yaw 35°), distance so the city's bounding radius x 1.15
    fills the frame.
  - **Portrait:** FOV 55° (vertical), pitch 48°, the city framed taller, the % meter top, strikes left and upgrades at
    the bottom.
  - Idle: a slow 2°/s drift.
  - On impact: FOV punch -4° for 120 ms + trauma 0.15 shake.
  - During cascades: exponential follow (3/s) toward the centroid of the active bolt fronts, a 15% dolly-in, and a
    small tilt toward forks.
  - Result: a 20°/s orbit around the lit city for 3 s while the plate counts.
  - Comfort: no roll, shake capped at trauma 0.3.
- **Hero frame (cover and the first second):** an elevated 3/4 view of a dense 3D downtown at night. The left half
  blazes gold, window by window, with streetlights on; the right half is still dark. A forked white-cyan bolt is
  mid-leap between two tall towers under a purple storm cloud, with glowing halos on the antennas and "97% POWERED" huge
  on top. It reads at 200 px as "lightning lights up a city".
- **Reference games and what we take:**
  - Slice Master: a number every hit, a jackpot multiplier at the end, a silhouette collection.
  - Chain-reaction clickers (Boomshine family): one trigger -> a cascade. Nothing else is taken; there is no game with
    this fantasy to copy.

## Audio direction
**Since 2026-10-07 (owner: "better sounds, free ones"):** recorded CC0 sounds from Kenney's packs (src/assets/sfx/,
20 MP3s, ~150 KB, built and loudness-matched by tools/audio/build-sfx.mjs; the thunder is layered from a crack, a crunchy
blast, a low boom and a generated rumble). The ZzFX sounds below remain the fallback while a file loads. The owner
auditions every sound.

Original direction: procedural ZzFX, zero files. **Claude cannot hear: the owner auditions every sound** in the ZzFX designer and in game.
- **Charge hum:** a looped low tone whose pitch rises 1.0 -> 2.0 and volume 0.3 -> 0.8 with the charge.
- **Supercharge ding:** a bright bell + shimmer when entering the band. **Overcharge:** a warning buzz. **Fizzle:** a
  sputter.
- **Strike boom:** a thunder crack (noise + low sine + slide) with the hit-stop.
- **Per-hop crackle:** a short electric zap on a **major-pentatonic ladder**, climbing one step per depth (steps 0, 2,
  4, 7, 9, 12, 14, 16, 19, 21, 24), +-3% detune, <= 6 voices, 30 ms min gap. The cascade sounds like a rising arpeggio.
- **Fork zap:** a double zap one ladder step above.
- **Block powered:** a 3-note major chord + a streetlight hum.
- **Gold rod:** a bell ping.
- **Full power fanfare:** a swell + fanfare over the orbit.
- **Coin count:** ticks.
- **Music:** none in v1 (Should: a CC0 synthwave loop at -12 dB after the first interaction).
- **Mute priority:** platform `muteAudio` > ad > hidden tab > the player's toggle. iOS resume on touchend.

## Monetization plan - ad-surface plan (must work with ads off and with an ad blocker)
At most **2 video buttons per screen** (`OFFERS.maxVideoOffersPerScreen = 2`). Every offer has a coin or play path.

| # | Moment | Ad type | Reward (vs next goal) | Cap / cooldown | Non-ad path | Template mapping | Rules |
|---|---|---|---|---|---|---|---|
| 1 | City intro (before the first strike) | rewarded **Supercharged start** + a coin button of the same style | +2 strikes this city (one plate step, typically) | hidden in runs 1-2; then every 2nd run or 120 s | buy for coins (price = the next Voltage level), or the Strikes upgrade | `boostOffer`: `boostAfterRuns 2`, `boostCooldownSec 120`; new `boostStrikes 2` replaces `boostFactor` | 009, 011, 012 |
| 2 | After the last strike, powered 85-99% | rewarded **One more strike** vs **Finish** (same size), 5 s ring that picks Finish at 0 | one extra strike, auto-SUPERCHARGE | **once per session** | Finish (the result stands); the Strikes upgrade | `reviveOffer`: `revivesPerSession 1`, `reviveMinProgress 0.2 -> 0.85` (progress = % powered, offered only < 1.0), `reviveCountdownSec 6 -> 5`; `isContinue` blocks the midgame at that break | 009, 014, 015 |
| 3 | Result, after the plate and count-up | rewarded **Claim x3** next to **Claim** | x3 the run's coins (base always granted) | every result from run 2 | "Claim" | level-complete `claim` / `claim_x` flow | 007, 008, 010, 013 |
| 4 | An upgrade whose price is not affordable | rewarded **FREE** | one level | 180 s | coins | `freeUpgradeOffer` (`freeUpgradeCooldownSec 180`); `UPGRADES` become Voltage / Fork / Strikes / Capacitor / Gold rods | 011, 012 |
| 5 | Skin shop, next skin not affordable | rewarded **+coins** | +22% of the next skin's price | 180 s with a visible timer | coins | `cashOffer` (`cashCooldownSec 180`, `cashShare 0.25 -> 0.22`) | 011, 012 |
| 6 | Skin shop, a locked skin selected, from run 4 | rewarded **Try it** | one city with it | once per skin (`save.tried[]`) | unlock with coins | **new** `trySkinOffer` | 011, 012 |
| 7 | First session of a local day: a gift icon on the result screen (never before the first strike) | rewarded **Collect x2** next to **Collect** | double the daily gift | 1 per day | "Collect" | **new** `dailyGiftOffer`, save `lastGiftDay`, `giftStreak` | 011, 012 |

**Midgame:**
- Requested on **"Next city"** and **"Retry"** from city 4 (`GAME.firstMidgameLevel 3 -> 4`).
- Never after a rewarded video at the same break (CG-ADS-015). Never on shop, upgrades, pause or gift.
- The SDK caps it at 1 per 3 min (CG-ADS-006), about every 5-6th run with runs of 25-40 s.

**Banners:** none in v1 (screens are open < 5 s on average; banners are off in the CrazyGames app and Basic Launch).

**Ads off / adblock / no fill:** every video button is hidden (template `rewardedAvailability`), with the notice on
the result and in the shop. The coin buttons stay, and the game is complete.

## Platform profile (mirrors project.json)
- target stage: full
- mobile: yes (hold / release anywhere; portrait + landscape)
- orientation: both (set in the submission; no lock logic)
- progress save: Data module (coins, city, best plate per city, upgrades, skins owned/tried, offer timestamps, gift
  day/streak, mute)
- accounts: none
- multiplayer: no
- leaderboard (invite-only): no
- IAP (invite-only): no

## CrazyGames QA constraints (crazygames-qa skill checklist, BUILD MODE)
| Item | How Volt City meets it | Conflict? |
|---|---|---|
| <= 1 click to gameplay | the city is the first frame; the first hold is the first strike | none |
| Readable at DPR 1 at 907x510, 821x462, 800x450 (to 1920x1080) | % meter >= 28 px, "+N" floats >= 18 px, buttons >= 16 px text / 44 px targets; viewport QA screenshots every size | **watch**: "+N" floats over a busy lit city need a dark outline and must be capped at ~12 visible at once (older ones fade) |
| Landscape on desktop, portrait on mobile, safe areas | both framings designed; HUD in `env(safe-area-inset-*)` | none |
| Mouse control (CG-QUAL-008) | click-to-target; no gesture following, so no lock needed (the rule exempts click-on-screen games); pointer capture during the hold | none |
| No custom fullscreen button | none | none |
| No Escape / Ctrl+W | never bound | none |
| `event.code` / AZERTY | all keys by code | none |
| iOS audio resume | template AudioService | none |
| Consistent physics 60/144/165 Hz | the chain runs in the fixed-step sim with seeded RNG; the charge uses sim time; hop timing in sim seconds; sim-health covers a scripted strike at several step sizes | none |
| Midgame only at natural breaks | only on Next city / Retry from city 4 | none |
| Paused + muted on adStarted | template ads.js / pause.js / AudioService | none |
| Rewarded: decline same size/font/colour, video icon | template `.btn` pairs (Claim / Claim x3, One more strike / Finish, Collect / Collect x2; Supercharged start video + coins) | none |
| Rewarded not on active gameplay | offers at the city intro (before the first strike; gameplayStart fires on the first press), after the last strike, and in menus; never during a cascade | **watch**: the city intro is both "hold anywhere" and the Supercharged-start offer screen. A tap on the offer must never start a charge (DOM buttons stop propagation, offers in a bottom rail). The `ad-ui` QA scenario checks it |
| Revive-type offer not on every run | once per session, only at 85-99% powered | none |
| Coin alternative for every reward | every row above | none |
| Hidden under adblock / Basic Launch | template `rewardedAvailability` | none |
| Reward only on adFinished; no chaining | template ads.js | none |
| Data-module save | template save.js | none |
| English + SDK locale fallback | English strings; `systemInfo.locale` fallback | none |
| PEGI 12 / not aimed at kids | no violence: lightning powers a city (restoring light), no people harmed, no gambling visuals. The plate is earned by % powered, never random | **watch**: the name collides with a casino brand (see Risks) |
| Original name and assets | `docs/ORIGINALITY.md`; primitives + canvas textures + ZzFX + OFL font | **conflict: the name.** "Volt City" is an existing Volt Casino meta-game (2019-20), so CG-QUAL-006 ("not easily confused ... identifiers you do not own") argues for a rename |
| No cross-promotion / app-store links | none | none |
| gameplayStart / Stop | start at the first press in a city; stop at the result, pause and the One-more-strike dialog | none |
| Completion % | `reportGameCompletedPercentage(round((bestCity-1)/40 x 100))`, forward only | none |
| happytime sparingly | first ever FULL POWER, city 20, city 40 | none |

## Scope
| Area | Must (upload-ready v1 today) | Should | Nice | Cut (stays cut) |
|---|---|---|---|---|
| Core | charge meter (fill, band, overcharge fizzle), target snap, strike, chain algorithm (range in 3D, hop timing, forks, grounding, gold rods), BLOCK POWERED, % powered, plates, pass 60% | "One more strike" tuning after playtest | - | aiming by drag-steer, real-time avoidance |
| City | procedural 3D city (lots, districts, avenues, parks, heights), 40 cities, 8 theme palettes (colour sets only) | theme silhouettes/props per theme | night-to-dawn result sky | hand-made levels |
| Look | WP-20 look kit: tone mapping, soft shadow, emissive windows filling up, bolt ribbons, halos, sparks, bloom on the high tier, camera kick/follow/orbit | per-theme skyline backdrops | rain particles | flat outlined polygons, pastel wash-out |
| Meta | coins, 5 upgrades, 12 skins with unlock random, Data-module save, best plate per city, daily gift | Storm Season endless after city 40 | skin trails in the menu | IAP, loot boxes, paid randomness |
| Monetization | all 7 surfaces with caps; midgame from city 4; ads-off paths; <= 2 video buttons per screen | per-surface funnel review | - | banners in v1, pressure tactics |
| Platform/launch | SDK events, completion %, happytime rules, English, safe areas, readable at 800x450, covers 1920x1080 / 800x1200 / 800x800 + 15-20 s preview video (landscape + portrait) | DE/FR/ES/PT strings | - | login, leaderboards, custom fullscreen |
| Audio | the ZzFX set above | synthwave loop | - | - |

## Risks
| Risk | Type | Mitigation |
|---|---|---|
| **The name "Volt City" is taken by Volt Casino's "Volt City" meta-game** (2019-20, same "blackout" premise), a gambling brand | originality / platform | **NEEDS USER: rename.** Proposed "Storm Grid" (no game or brand of that exact name found; CrazyGames search and slug clear; Poki clear). See ORIGINALITY.md. Not legal advice |
| An itch.io game "City Surge" (sammyvaughan86) also lights buildings with electricity (speed-tap clicker) | originality | ours is a charged strike + 3D chain lightning with forks; documented in ORIGINALITY.md; avoid "Surge" in the name |
| The chain may not feel exciting in 3D (bolts hard to follow, cascade too fast or slow) | design | a prototype of one city + one strike first; tune hop time (0.08-0.15 s), camera follow, halos; the look test with the owner (WP-20) |
| The campaign is short for an average player (~41 runs to city 40, about 25 min), and passing is easy (1 try per city until ~30) | design / retention | the plates carry the skill (FULL POWER stars per city); `passPct` 0.60 -> 0.80 would lengthen the mid-game; Storm Season endless (Should) |
| Bloom and shadows on a 4 GB Chromebook | performance | bloom only on the high tier; halos elsewhere; shadow map 1024 on high, blob on low; ~20-25k tris |
| The economy is model numbers (the Monte Carlo has no skins, daily or video income) | design | port the model as a Node balance test; calibrate with the playtest |
| Busy "+N" floats hurt readability at 800x450 | platform | cap visible floats, outline, merge floats per cascade ("+312" at the end) |
| Portrait framing of a wide city | design | pitch 48°, FOV 55°, the camera frames by bounding radius; the QA viewport check |
| Scope today | schedule | Must = one algorithm + generator + look kit + existing meta/offers; the rest is Should |

## Evidence
- `docs/CONCEPTS.md` "Round 3": T1 scored 91 (weighted 110) against 87 / 81. The owner's pick is recorded there.
- Originality checks: CrazyGames search API and Poki sitemap show no chain-lightning / light-up-the-city game
  (CONCEPTS Round 3; ORIGINALITY.md).
- The economy and difficulty tables above come from the Monte Carlo of this chain rule (2026-09-26), with 20-30 seeded
  campaigns per player profile.
