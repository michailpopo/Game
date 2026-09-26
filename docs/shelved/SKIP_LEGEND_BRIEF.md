# Game brief - Skip Legend

Status: Gate 1 passed 2026-09-26 (the owner picked C1 "Skip Legend" and kept the title). Brief v1 for the
Gate 2 grey-box prototype (WP-02) and the vertical slice.
Last updated: 2026-09-26 · Author: game-concept-designer · Supersedes the rough numbers in `docs/CONCEPTS.md` C1.

Changes from CONCEPTS.md C1, applying the researcher's teardowns (RESEARCH.md "What Skip Legend (C1) must do
differently"):
- The launch is a **sidearm swing released on the beat**, not a power needle. Rocket Fling launches with a horizontal
  bar and a PERFECT box.
- Upgrades are **objects on the jetty**, not a row of cards.
- The grade words are **PERFECT / GOOD / SPLASH**, and the streak shows on the stone's **trail** (no "COMBO xN" banner).
- The ducks are **rubber ducks** (toys, and secondary).
- There is no beach or sand: the far shore is a grassy **Bank** with crates.

## One-line pitch
Swing, release on the beat, then tap every time your stone kisses the water. Every skip pays, perfect taps keep it
flying, and a stone that reaches the far bank slides into the x2 / x3 / x5 crates.

## Loops
| Loop | Length | Description (verbs) |
|---|---|---|
| Core | 7-60 s per throw (grows with level) | **tap on the beat**: tap when the swing ring closes (release) -> the stone skips; tap when each landing ring closes (PERFECT / GOOD / SPLASH) -> every PERFECT/GOOD pays +N and keeps speed; 5 PERFECTs turn the trail gold (x2), 10 turn it white-cyan (x3); land on a rubber duck for a boost, pass through coin rings; the throw ends in the Bank's crates (x2/x3/x5) or sinks "X m short" |
| Session | 1-3 min (3-8 throws) | throw -> result (count-up, Claim / Claim x3) -> spend on the jetty objects (Arm, Flat, Spin) -> throw again; a level (one water) takes 1-4 throws; every 5 levels a new world palette and one new water rule |
| Meta | days | 30 levels in 6 worlds (campaign; completion % = level/30); 12 skippers (cosmetic) in the Skipper Box; upgrade objects that visibly grow; daily gift with a forgiving 7-day streak; after level 30 the endless "Legend Sea" record (Should) |

## First 30 seconds (beat by beat, cold start)
| Time | What the player sees | What they do | Feedback |
|---|---|---|---|
| 0-2 s | The jetty scene is the home. The thrower (a bean figure) stands on the jetty and swings a flat stone sidearm on a slow, steady beat (1.3 s per swing on the first throw ever). A white ring closes around the stone at each forward swing. The far bank and its three crates (x2 x3 x5) are visible 42 m away. A hand pictogram taps on the beat. No menu, no text wall. | nothing yet (or taps) | soft swing tick on every forward swing |
| 2-3 s | - | first tap anywhere (click / Space / touch) | the stone leaves the hand with a whoosh. The first ever throw always counts as a CLEAN release (assist). Word "CLEAN!" |
| 3-4 s | The stone arcs 9 m. A ring on the water shrinks to the landing point. Time runs at 0.6x for the first 3 contacts of the first throw. | tap as the ring closes | **first "+1" by ~3.5 s** at the ripple, a plink, a spray burst, the coin counter punches. PERFECT / GOOD word at the stone |
| 4-10 s | Hops shorten, and the contact rings come faster (1.1 s -> 0.7 s apart). Coin rings float on the path. A rubber duck bobs ahead. | tap each contact | +1 / +1 / +1 on a rising pitch ladder. The duck landing gives a squeak, a 60 ms hit-stop, +20% speed and "+5" |
| 10-15 s | 5 PERFECTs in a row: the stone's trail turns gold. The bank comes close. | keep tapping | payouts read "+2" now. A brighter plink register. The trail is the only streak indicator |
| ~12-15 s | The stone reaches the bank and slides up the grass into a crate. Level 1 always gets there on the first throw (assist: release counts CLEAN, every contact counts at least GOOD, both ducks sit on its landing points). | - | the crate lid pops, x3 or x5 flashes, confetti on x5, count-up "84" with coins flying to the pill |
| 15-25 s | Result card over the scene. "Claim" only: no video offer before the first result is banked (the first x3 appears from throw 2). | tap Claim | coins fly in; the Arm dumbbell on the jetty glows "60 - UPGRADE" (affordable: endowed progress) |
| 25-30 s | Back on the jetty (<= 1.5 s after Claim), level 2 ("47 m"), the swing already running. | tap the dumbbell or just throw | dumbbell plate pop + "ARM 2"; or the next throw starts |

No ad of any kind in the first run. The first midgame can only be requested from level 4 (see Monetization).

## Controls
| Device | Input | Action |
|---|---|---|
| Desktop keyboard (physical keys, `KeyboardEvent.code`) | `Space`, `Enter`, `NumpadEnter` = the tap (release / contact); `KeyP` = pause; `KeyM` = mute toggle. `e.repeat` is ignored. Space and arrows never scroll the page. No Escape, no Ctrl/Cmd combos. | same single verb everywhere |
| Mouse | left button **pointerdown** anywhere on the canvas = the tap (judged on the `pointerdown` timestamp, not `click`). DOM buttons (Claim, jetty tags, shop) sit above the canvas, and their events never reach the tap handler. | same |
| Touch | pointerdown anywhere on the canvas = the tap. With multi-touch, one tap per 60 ms counts (two fingers do not double-tap). `touch-action: none`, `user-select: none`, no magnification. | same |

**Mouse-control rule check (CG-QUAL-008): no.** Nothing follows mouse gestures: no steering, drag or aim. The verb is a
click at the right moment, and the rule says click-on-screen games "need no confinement". No pointer lock (the template's
`pointerLock` stays false) and `project.json` `mouse-gesture = false`. If a later feature adds drag or steer, this
decision is reopened.

## The throw and the timing judge (numbers for WP-02)
**Launch (ours, not a power bar):**
- The arm swings sidearm in a steady pendulum: 0.9 s per forward swing (1.3 s on the first throw ever).
- A ring closes around the stone at each forward point. Every tap throws (<= 1 click to gameplay); the timing only sets
  the quality:
  - **CLEAN** (|Δ| <= 80 ms): launch speed x1.00, and the first hop leaves at the flat "magic" skim angle (about 20°
    in real stone skipping, REPORTED: Clanet et al., Nature 2004; used as flavour, not physics).
  - **GOOD** (|Δ| <= 180 ms): x0.93.
  - **WILD** (any other moment): x0.85.

**Hops (analytic, deterministic):**
- Launch speed: `v0 = 8.4 m/s x 1.055^Arm x release factor (x 1.25 with Golden Arm)`. Arm 0..30 gives 8.4..41.9 m/s.
- Hop time: `T(v) = 1.1 s x sqrt(v / 8.4)`, capped at 2.4 s. Hop length: `v x T(v)`.
- Each touchdown **skims 120 ms** (spray) before lift-off, and the next hop is computed at lift-off. Positions in
  between are pure functions of time, so no per-frame integration drifts.
- Speed kept per contact: `v' = v x (0.900 + 0.0025 x Flat) x grade`, with grade PERFECT 1.00 / GOOD 0.95 / SPLASH 0.82.
  Flat 0..20 gives a base keep of 0.900..0.950.
- The stone **sinks** when `v < 1.0 m/s`. The last hop is then >= 0.38 s, so contacts are always >= 0.50 s apart.

**Contact judge:**
- `Δ = t_tap - t_touchdown`. `t_touchdown` is computed at the previous lift-off, in sim time.

| Grade | Window | Effect | Word / sound |
|---|---|---|---|
| PERFECT | \|Δ\| <= 70 ms + 4 ms x Spin (Spin 0..10 -> 70..110 ms) | keep x1.00, streak +1, pays skip value x multiplier | "PERFECT" white, bright plink on the ladder |
| GOOD | -170 ms <= Δ <= +120 ms (outside PERFECT) | keep x0.95, streak held, pays skip value x multiplier | "GOOD" pale cyan, soft plink |
| SPLASH (early) | -300 ms <= Δ < -170 ms | keep x0.82, streak reset, pays 0 (anti-mash) | "SPLASH" grey-blue, splash noise |
| SPLASH (no tap) | nothing by Δ = +120 ms | keep x0.82, streak reset, pays 0 | same |
| ignored | Δ < -300 ms | no effect | none |

**Judge rules:**
- Only the first tap in a contact's window counts. The windows of neighbouring contacts cannot overlap: the GOOD span
  is 290 ms and the minimum spacing is 500 ms.

**Identical at 30 / 60 / 120 / 144 / 165 Hz (CG-GAME-003):**
- Input handlers record `event.timeStamp`, which is on the `performance.now()` clock.
- The loop keeps the mapping `(wallAtFrame, simAtFrame, timeScale, frozen)`. A tap is converted to
  `simT = simAtFrame + (timeStamp - wallAtFrame) / 1000 x timeScale`, or to the freeze instant during a hit-stop, and
  judged at the next fixed step. Frame boundaries never decide a grade.
- The template's `src/core/input.js` has no timestamps yet. This is new work in WP-02.
- sim-health test: scripted taps at Δ = -301, -299, -171, -169, -111, -71, -69, 0, +69, +71, +119, +121 ms under
  frame pacing of 30/60/120/144/165 Hz must give identical grades, coins and distance.

**Cue:**
- A thin ring appears on the water at the predicted touchdown point, up to 0.6 s before the contact (or at lift-off
  if the hop is shorter). It shrinks to the stone's footprint exactly at `t_touchdown`.
- The launch uses the same ring language: one visual rule for the whole game.

**Assist:**
- The first throw ever: time scale 0.6 for its first 3 contacts (wall-clock windows x1.67), release counts CLEAN,
  and contacts floor at GOOD.
- After that there is no assist. Hit-stops (60 ms) are never started within 250 ms before a touchdown.

## Fail, retry, reward
- **How the player loses, and how they know why within 0.5 s:**
  - The stone sinks before the bank: its speed runs out. The last hops visibly shrink and it sinks with a bloop.
  - Every SPLASH already showed its word at the contact.
  - The result card names the cause with the true distance: "6 m short - 3 SPLASHES: tap when the ring closes" or
    "6 m short - a rock took your speed: keep the gold trail to smash rocks".
- **Retry time:** after a sink, the result card appears 0.6 s later, and the count-up (1.0 s) can be skipped with a
  tap. Retry is one tap and brings back the jetty with the arm already swinging within 1.0 s. Sink to playing again,
  declining everything: <= 2.5 s.
  - When the once-per-session revive dialog is eligible, it adds up to 5 s. Its decline is immediate.
- **What a lost throw still gives:**
  - All contact coins earned (about 30-50% of a reached throw's coins, before the crate multiplier).
  - Progress on the distance record for that water (a "best" marker buoy stays on the water).
  - Usually an affordable upgrade, so every throw feels useful.

## Progression and difficulty
**Curve (formulas):**
- Shore distance `shore(L) = 42 m x 1.13^(L-1)` up to level 20, then `x 1.10` per level.
- Skip value `sv(L) = 1.10^(L-1)` coins per contact.
- Rubber ducks per water: 2 (L1-4), 3 (L5-9), 4 (L10+). Each is placed at 10-85% of the water. Landing within
  1.5 m of one gives +20% speed (capped at launch speed) and +5 x sv.
- Coin rings per water: `10 + 2L`, collected when the arc passes through.
- Rocks from L6. Per 100 m: 1.5 (L6-10), 2 (L11-20), 2.5 (L21-30); 30% of them sit in the last 15% of the water
  (the true near-miss gate). A landing within 1.0 m of a rock:
  - without a gold trail: CLACK, speed x0.70, streak reset
  - with a gold trail (streak >= 5): SMASH, speed kept, +5 x sv, 60 ms hit-stop
- Windows only change with Spin; difficulty comes from distance, hazards and the accelerating final contacts.

| Level | World | Shore | Ducks | Coin rings | Rocks | PERFECT window (typical Spin) | GOOD window | Typical throw (avg player) | Throws to clear (avg / novice) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Mill Pond | 42 m | 2 | 12 | 0 | ±70 ms (first throw ±117 ms wall-clock at 0.6x) | -170/+120 ms | ~7 s, ~7 contacts | 1 (assisted) |
| 5 | Mill Pond | 68 m | 3 | 20 | 0 | ±70 ms (Spin 0) | same | ~11 s, ~12 contacts | 1.5 / 2.5 |
| 10 | River Bend | 126 m | 4 | 30 | 2 | ±74 ms (Spin 1) | same | ~16 s, ~18 contacts | 2 / 3.2 |
| 20 | Fjord | 428 m | 4 | 50 | 9 | ±94 ms (Spin 6) | same | ~36 s, ~36 contacts | 4 / 5 |
| 30 | Sunset Harbour | 1,111 m | 4 | 70 | 28 | ±110 ms (Spin 10, max) | same | ~61 s, ~53 contacts | 4 / 5.5 |

**Worlds** (5 levels each), each bringing one new idea:
1. **Mill Pond** (L1-5): ducks and coin rings.
2. **River Bend** (L6-10): **rocks** (the gold trail smashes them).
3. **Mountain Lake** (L11-15): floating **logs** as ramps; a landing on a log makes the next hop 1.5x longer (Should
   for the slice).
4. **Fjord** (L16-20): **whirlpools**, a landing inside costs x0.5 speed (Should).
5. **Night Lake** (L21-25): dark water where the cue rings glow and lantern rings pay double.
6. **Sunset Harbour** (L26-30): moored boats; a deck landing gives a double bounce.

After level 30 comes "Legend Sea": endless, for the record distance (Should).
- **New idea introduced at:** level 6 (rocks), 11 (logs), 16 (whirlpools), 21 (lantern rings), 26 (boats). Nothing
  new in levels 1-5: they teach the beat only.
- **Peaks and relief:**
  - Peak: each water ends in a rock cluster from L6, and the final contacts accelerate in every throw (the crescendo).
  - Relief: the first level of each new world has no hazards in its first half, plus a palette change.
  - A world clear (L5, 10, 15, 20, 25, 30) gets a longer celebration and `happytime()`: 6 times in the whole game,
    as "sparingly" asks (CG-SDK-009).

## Economy (numbers)
**Coins per contact:**
- PERFECT and GOOD pay `sv(L) x multiplier`. The multiplier is x1, x2 while the trail is gold (streak 5-9), x3 while it
  is white-cyan (streak >= 10). SPLASH pays 0.
- Each coin ring pays `sv`, each duck `5 x sv`, each rock smash `5 x sv`.
- **The Bank crates** multiply the whole throw by leftover speed `v / v_launch` at the bank: >= 0.40 -> x5,
  >= 0.22 -> x3, otherwise x2.
- A sink gets no multiplier.
- There is **no "income" upgrade**: Rocket Fling and Splash Sliders both sell one. Ours are all physical.

**Coins per throw and prices, average player** (60% PERFECT / 32% GOOD / 8% SPLASH, +2% PERFECT per Spin level):

| Level | Upgrades typical on arrival (Arm/Flat/Spin) | Launch speed | Coins, reached (avg crate) | Coins, sank | Next upgrade price | Throws per new upgrade |
|---|---|---|---|---|---|---|
| 1 | 0/0/0 | 8.4 m/s | ~84 (x4.3) | ~25 | Arm 60 | 1 (affordable after throw 1) |
| 5 | 4/1/0 | 10.4 m/s | ~176 (x3.9) | ~52 | ~120-135 | ~1 |
| 10 | 8/4/1 | 12.9 m/s | ~400 (x3.5) | ~125 | ~240-295 | ~1 |
| 20 | 18/13/6 | 22.0 m/s | ~1,700 (x3.0) | ~815 | ~1,900-2,150 | ~2 |
| 30 | 25/20/10 | 32 m/s | ~6,100 (x2.9) | ~3,270 | Arm ~8,650 | ~2-3 |

**Upgrade price curves** (rounded to 5 below 1,000 and to 50 above):

| Object on the jetty | Effect per level | Price | Max | Full price list | Total |
|---|---|---|---|---|---|
| **Arm** (a dumbbell; a plate is added every 5 levels) | launch speed x1.055 (~ +8% distance) | 60 x 1.22^n | 30 | 60, 75, 90, 110, 135, 160, 200, 240, 295, 360, 440, 535, 650, 795, 970, 1,200, 1,450, 1,750, 2,150, 2,600, 3,200, 3,900, 4,750, 5,800, 7,100, 8,650, 10,550, 12,900, 15,700, 19,150 | 105,965 |
| **Flat** (a grinding wheel that grows) | +0.0025 speed kept per contact | 95 x 1.26^n | 20 | 95, 120, 150, 190, 240, 300, 380, 480, 605, 760, 960, 1,200, 1,500, 1,900, 2,400, 3,050, 3,850, 4,850, 6,100, 7,650 | 36,780 |
| **Spin** (a spinning top that gains stripes) | PERFECT window +4 ms | 180 x 1.50^n | 10 | 180, 270, 405, 610, 910, 1,350, 2,050, 3,100, 4,600, 6,900 | 20,375 |

**Skippers** (12 cosmetic stones, Skipper Box):
- One is owned from the start (Classic Stone). The other 11: Slate, Speckled Pebble, Pancake, Cookie, Vinyl Record,
  Pizza, Frisbee, Hubcap, Manhole Cover, Lily Pad, Legend Stone.
- "Unlock random" always gives an unowned skipper. Price `250 x 1.5^(n-1)`: 250, 380, 560, 840, 1,270, 1,900, 2,850,
  4,270, 6,410, 9,610, 14,420 (total 42,760). This is the template's `skinUnlockCost` formula.
- A skipper changes the look, the trail tint and the plink timbre only. **Stats are identical**: no pay-to-win.
- At the level where a player usually reaches each price, the next skipper costs 1-4 throws of income.

**Pacing, from a Monte Carlo of the rules above:**
- The model: no ads, all coins spent on the cheapest upgrade, 7 s of menus per throw.

| Player | Level 5 | Level 10 | Level 20 | Level 30 cleared |
|---|---|---|---|---|
| novice (40/40/20) | 7 throws | 24 throws (~7 min) | 87 throws (~38 min) | ~159 throws |
| average (60/32/8) | 4 throws (~1 min) | 13 throws (~4 min) | 43 throws (~20 min) | ~86 throws (~45 min) |
| skilled (85/13/2) | 4 throws | 9 throws | 28 throws | ~58 throws |
| average + 30% of results claimed x3 | 4 throws | 11 throws | 29 throws (~12 min) | ~55 throws |

- The model does not yet include rocks, skipper spending, daily gifts or the other offers.
- **Re-run it with rocks in the slice**, and tune by playtest. The meta is pure functions (`src/game/meta.js`), so the
  balance can be tested in Node.

**What one video is worth:**

| Offer | Levels 1-5 | Level 10 | Level 20 |
|---|---|---|---|
| Claim x3 (extra coins over "Claim") | +170 to +350 (~2-3 upgrade levels) | ~ +800 (~3 levels) | ~ +3,400 (~1.7 levels) |
| Free upgrade (one level of the unaffordable object) | 60-135 (~1 throw) | 240-295 (~1 throw) | 1,900-2,150 (~2 throws) |
| Shop cash (22% of the next skipper) | +55 to +125 | +125 to +185 | +420 to +630 |
| Golden Arm (+25% launch speed, one throw) | ~ +40% distance = ~4 Arm levels for one throw | same (4 Arm levels ~ 1,630 coins of upgrades) | same (~ 11,850 coins of upgrades) |
| Second wind (revive) | the stone rises again at 60% of launch speed: ~ +46% of a full throw from the sink point | same | same |
| Daily gift x2 (base = 2 x average throw coins at the best level, min 50) | +50 to +350 | ~ +530 | ~ +2,000 |

## Hook cadence (default target: references/design/hypercasual-hits.md)
| Scale | Interval | What happens | Feedback |
|---|---|---|---|
| micro | 0.5-2.5 s between contacts (shrinking within each throw) | every PERFECT/GOOD contact pays +N; coin rings | ring closes, plink on a rising pitch ladder, spray burst, "+N" floats at the ripple, the coin counter punches |
| streak | 5 PERFECTs (~3-6 s) | trail turns gold (x2), then white-cyan at 10 (x3) | trail colour and width change, the plink ladder register rises, a short shimmer. The streak shows on the trail only |
| peak | every 5-20 s, and every throw's end | rubber duck boost, rock smash (L6+), the final crescendo of fast contacts | 60 ms hit-stop + 120 ms slow-mo (never within 250 ms before a touchdown), camera punch, a bigger number |
| run end | 7-60 s | the Bank: the stone slides into x2 / x3 / x5, count-up; or sink "X m short" | crate lid pop, x5 confetti, coin fly-in to the pill, **Claim / Claim x3** |
| meta | every 1-3 throws | an upgrade (its jetty object visibly grows); a level every 1-4 throws; a world every 5 levels; a skipper | object level-up pop, "ARM 5"; skipper silhouette -> colour reveal, "NEW!" |
| return | daily | gift box bobbing by the jetty, streak day 1-7 | "Collect" / "Collect x2" (video) |

- **First reward after the first input:** the first contact comes ~1.1 s after the throw tap (0.6x slow-mo), so
  "+1" lands by ~3.5 s of page time when the player taps at ~2 s. The target is <= 4 s.
- **Near-miss moment:** sinking within 15% of the bank shows "6 m short!" with the true distance. From L6, a rock
  cluster guards the last 15% of every water.
- **The 3-second clip:** a sidearm swing -> the stone leaves -> ring closes, plink "+1" -> ring, plink "+1" -> the
  trail turns gold, "+2 +2" -> a rubber duck squeaks it higher -> rapid final contacts -> it slides up the grass into
  the glowing x5 crate -> confetti.

## Reason to come back tomorrow (D1)
- **Unfinished business by design:** the session ends with the far bank visibly close ("best: 6 m short") and the next
  jetty upgrade 70-90% paid. The result card shows the next upgrade's progress bar.
- **The world map:** "River Bend: rocks!" is teased at level 5, and a world is only 5 levels long.
- **The Skipper Box:** a silhouette grid, "3/12".
- **The daily gift** by the jetty with a streak that forgives: a missed day steps back one day, it never resets to 0.
  - Base amounts by streak day 1-7: x1.0, 1.15, 1.3, 1.45, 1.6, 1.8, 2.0 of the base gift.
  - All progress is saved through the CrazyGames Data module, so a guest who comes back keeps everything.

## Art direction
- **Style profile:** M minimal-poly. Budgets are in `project.json` `budgets` (<= 2,000 tris per geometry, one hero
  <= 5,000, <= 60,000 tris and <= 60 draw calls per frame, no model files, no downloaded textures).
- **Primitives per object** (heaviest geometry: the rubber duck body, 352 tris):
  - stone and skippers: `CylinderGeometry(r, r, 0.07, 16)` (64 tris) plus one detail primitive, <= 400 tris each
  - thrower: bean capsule `CapsuleGeometry(r,l,4,8)` (144) + head sphere (16,12) (352) + swinging-arm capsule (144)
  - jetty: instanced plank boxes (12) and post cylinders (8 segments, 32)
  - Arm dumbbell: 3 cylinders (~150)
  - Flat grinding wheel: cylinder 24 (96) on box legs
  - Spin top: cone 12 + cylinder (~80)
  - rubber duck: sphere (16,12) 352 + head sphere (12,8) ~168 + beak cone(8) 16, instanced <= 4
  - coin ring: `TorusGeometry(0.5, 0.06, 6, 16)` (192), instanced
  - ripples and cue rings: `RingGeometry(0.9, 1, 24)` (48), instanced <= 40
  - rock: `IcosahedronGeometry(1, 0)` (20) flat-shaded, instanced
  - log: cylinder (12)
  - boat: 3 boxes
  - the Bank: sloped box + 3 crates (boxes) with canvas-texture labels
  - scenery: instanced cone trees and reeds, low icosahedron hills
  - water: one gradient plane
  - Estimate: < 20,000 tris and < 30 draw calls per frame.
- **Palette (hex):**
  - Player (stone): `#b9b2a6` with a light top `#e8e2d6`. Trail: `#ffffff` (x1) -> gold `#ffd23f` (x2) ->
    white-cyan `#9ff3ff` (x3).
  - Good: coins and rings `#ffd23f`. PERFECT white `#ffffff` with a dark outline `#1a2340`, GOOD `#bdf4ff`,
    SPLASH `#7d8aa8`.
  - Bad (hazards only): rocks and whirlpools in charcoal-violet `#3a3550` / `#4a4e5a`. Nothing friendly uses them.
  - World: jetty wood `#c98a4b`, grass bank `#7ddc6a`, crates `#8a5a2b`. Sky gradients per world, e.g. day
    `#bfe9ff` -> `#fef6e4`.
  - Water per world:

    | World | Shallow | Deep |
    |---|---|---|
    | Mill Pond | `#3fb6c8` | `#1e7f9a` |
    | River Bend | `#4cc3b0` | `#1f8a7a` |
    | Mountain Lake | `#4f9fe0` | `#1d5ea8` |
    | Fjord | `#3d7fb8` | `#1b3f6b` |
    | Night Lake | `#24356e` | `#0f1838` |
    | Sunset Harbour | `#e98a6b` | `#6a3d7a` |

  - UI accent: crate labels x2 `#3fb6ff`, x3 `#ff8a1f`, x5 `#ff3fa4`. The fat outlined UI font is Lilita One
    (bundled, OFL).
- **Shape language:** friendly things are round and flat (stones, lily pads, rings, ducks, crates with rounded
  labels). Hazards are angular (flat-shaded icosahedron rocks, a spiral whirlpool). Scenery is tall and thin (cones,
  reeds). The signature visual is **concentric rings on water**: every cue, every contact, the logo.
- **Camera** (both orientations keep the next touchdown ring on screen, look-ahead = the next landing point):
  - **Landscape (desktop and mobile landscape):**
    - Chase camera 1.2 m above the water and 5 m behind the stone, slightly to the right. FOV 55.
    - It aims 12-18 m ahead and keeps the stone at ~35% from the left. The predicted touchdown point is clamped
      inside the middle 70% of the frame.
    - At launch: over the thrower's shoulder on the jetty, with the far bank visible.
  - **Portrait (mobile):**
    - Camera 2.2 m high and 7 m back, tilted 12° down, vertical FOV 62.
    - The stone sits in the lower third and the next touchdown ring in the middle third.
    - The HUD (coin pill top-left, level/progress top-centre, pause top-right) is padded into
      `env(safe-area-inset-*)`.
  - Exponential follow. A small punch (FOV -3) on crate hits and smashes.
- **Reference games and what we take (not copy):**
  - Slice Master: a number at every hit; multiplier bins at the end (ours are crates up a grass bank, chosen by
    leftover speed); a silhouette collection grid.
  - Cubes 2048.io: offer and decline as two equal buttons.
  - Bouncemasters: the excitement of a chain of bounces with coins along the path. Its words (OUCH / NOT BAD / COMBO
    xN), animals and 2D side view are not used.
  - Rocket Fling: the lesson of what it lacks (per-second pay, a revive, a collection, a jackpot end). Its power bar,
    catapult, stats card and card row are not used.
  - Real stone skipping: the skim angle and ever-shorter hops.

## Audio direction
Procedural ZzFX sounds (zero files). **Claude cannot hear: the owner auditions every sound** in the ZzFX designer
and in game before it ships.
- **Plink (the core):**
  - A short bright blip on a **major-pentatonic ladder**: steps 0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24 semitones,
    `pitch = 2^(step/12)`.
  - One step up per PERFECT/GOOD. SPLASH resets to the root.
  - PERFECT is full volume and bright; GOOD is -4 dB and duller.
  - +-2% random detune so repeats do not machine-gun. Max 4 voices.
  - Played in the input handler for zero added latency. The grade is known at that moment for taps inside a window;
    a no-tap SPLASH sounds at +120 ms.
- **The crescendo** is emergent: contacts come faster as the stone slows and the ladder keeps climbing. The last 3
  contacts add a rising airy whoosh layer, and the throw ends either with a low **bloop** (sink) or with the grass
  slide + crate fanfare (x2 short, x3 medium, x5 full + confetti pop).
- **Others:**
  - swing tick (a soft metronome on each forward swing)
  - release whoosh; "CLEAN" chime
  - squeak (rubber duck)
  - rock clack (dry click) vs rock smash (crunch + shimmer)
  - coin-ring tink
  - count-up ticks
  - UI click
- **Music:** none in the prototype. The slice gets one light CC0 loop at -12 dB under the SFX. It starts after the first
  interaction and dips during the final crescendo.
- **Mute rules** (template AudioService): platform `muteAudio` > ad playing > tab hidden > the player's toggle. The
  AudioContext resumes on touchend/click for iOS (CG-TECH-016/017).

## Monetization plan - ad-surface plan (must work with ads off and with an ad blocker)
Target: 7 wanted rewarded surfaces plus a midgame at natural breaks from level 4. At most **2 video buttons per screen**
(`OFFERS.maxVideoOffersPerScreen = 2`). Every offer has a coin or play path (Rocket Fling's ad-only booster is the
counter-example; RESEARCH teardowns).

| # | Moment | Ad type | Reward and size (vs next goal) | Cap / cooldown | Non-ad path | Template mapping | Rules |
|---|---|---|---|---|---|---|---|
| 1 | Result card after every throw (reached or sank), after the count-up; not on throw 1 | rewarded **Claim x3** next to **Claim** (same component, same size/font/colour, video icon on the offer) | x3 the throw's coins; base always granted. ~2-3 upgrade levels early, ~1.7 at L20 | a fresh choice every result from throw 2 | "Claim" | exists: level-complete `claim` / `claim_x` flow in `main.js`, extended to the sank result | 007, 008, 010, 013 |
| 2 | The stone sinks past 50% of the water, from level 3 | rewarded **Second wind** with a 5 s ring countdown that *declines* at 0 | the stone rises at 60% of launch speed, next contact auto-PERFECT; ~ +46% of a throw | **once per session** | "No thanks" -> result -> retry | exists: `reviveOffer` (`revivesPerSession 1`); config `reviveMinProgress 0.2 -> 0.5`, `reviveCountdownSec 6 -> 5`, new `reviveMinLevel 3`; `isContinue` blocks the midgame at that break | 009, 014, 015 |
| 3 | Jetty (ready), a golden arm-band tag on the thrower | rewarded **Golden Arm**, plus a coin button of the same style | +25% launch speed for one throw (~4 Arm levels, ~ +40% distance) | hidden in throws 1-2; then every 2nd throw or 120 s cooldown | buy the same Golden Arm for coins (price = the next Arm level), or upgrade Arm permanently | exists: `boostOffer` (`boostAfterRuns 2`, `boostCooldownSec 120`); `boostFactor` becomes new `boostLaunchFactor 1.25`; coin price is new | 009, 011, 012 |
| 4 | Skipper Box open and the next unlock not affordable | rewarded **+coins** | +22% of the next skipper's price | 180 s cooldown with a visible timer | earn coins by throwing | exists: `cashOffer` (`cashCooldownSec 180`); `cashShare 0.25 -> 0.22` | 011, 012 |
| 5 | A jetty object (Arm/Flat/Spin) whose price is not affordable | rewarded **FREE** tag on that object (only the cheapest one if the Golden Arm tag is visible) | one level of that object | 180 s cooldown | coins | exists: `freeUpgradeOffer` (`freeUpgradeCooldownSec 180`) | 011, 012 |
| 6 | Skipper Box, a locked skipper selected, from throw 4 | rewarded **Try it** | use that skipper for the next throw (look, trail, plink timbre; no stat change) | once per skipper (`save.tried[]`) | unlock with coins | **new**: `trySkipperOffer(save, {available, id})` + `trySkipperAfterRuns 3` | 011, 012 |
| 7 | First visit of a local day, a gift box bobbing by the jetty; opens only when tapped, never before the first throw of a new player's first session | rewarded **Collect x2** next to **Collect** | double the daily gift (2 x average throw coins at the best level x streak factor 1.0-2.0) | 1 per day | "Collect" (base gift) | **new**: `dailyGiftOffer(save, {available, today})`, save fields `lastGiftDay`, `giftStreak` | 011, 012 |

**Midgame (interstitial):**
- Requested on **"Next"** (after a reached-bank result) and on **"Retry"** (after a sink result), from **level 4**
  (`GAME.firstMidgameLevel 3 -> 4`).
- Never right after a rewarded video at the same break: that is the template's `rewardedShown` / `isContinue` guard,
  CG-ADS-015.
- Never on navigation, shop opening or upgrade purchases (CG-ADS guidance). No custom cooldown: the SDK paces it to at
  most 1 per 3 min (CG-ADS-006).
- Throws of 7-60 s give a natural break roughly every 15-70 s, so the SDK's cap is the limit, not the design.

**Banners:** none in v1. Screens are open < 5 s on average in this loop, and banners are off in the CrazyGames app and
in Basic Launch. Re-evaluate for the Skipper Box after launch data.

**Ads off / adblock / no fill:**
- Every video button is hidden, never left dead (template `rewardedAvailability`). The result card and Skipper Box show
  the template's notice text.
- The Golden Arm coin button stays.
- The game is complete without any video.

## Platform profile (mirrors project.json)
- target stage: full
- mobile: yes (touch, portrait and landscape; initial download target < 5 MB, far below the 20 MB mobile-homepage
  limit)
- orientation: both (landscape on desktop; portrait or landscape on mobile, set in the submission; no in-game
  orientation lock, CG-TECH-011)
- progress save: Data module (coins, levels, upgrade levels, skippers owned/tried, offer timestamps, gift day/streak,
  mute; debounced, far below 1 MB)
- accounts: none (guests play; the Data module migrates guest progress on login)
- multiplayer: no
- leaderboard (invite-only): no
- IAP (invite-only): no

## CrazyGames QA constraints (crazygames-qa skill checklist, applied in BUILD MODE)
| Item | How Skip Legend meets it | Conflict? |
|---|---|---|
| <= 1 click to gameplay (Full Launch) | The jetty is the first frame and the home; the first tap anywhere throws. No title screen, name field or daily dialog before the first throw. | none |
| Readable at devicePixelRatio 1 at 907x510, 821x462, 800x450 (up to 1920x1080) | UI font sizes are set in CSS px with a minimum: floating "+N" and grade words >= 18 px, buttons >= 16 px text with >= 44 px hit areas, jetty price tags >= 14 px, at 800x450 and DPR 1. The viewport QA scenario screenshots every listed size. | **watch**: the jetty-object tags must stay readable and not overlap at 800x450 landscape. Tags stack in a bottom rail when space is short |
| Landscape on desktop; portrait on mobile with safe areas | Both orientations are designed (cameras above). The HUD uses `env(safe-area-inset-*)`. The orientation choice is left to the submission (no lock logic). | none |
| No custom fullscreen button | none in the UI (only pause, sound and the Skipper Box) | none |
| No Escape / Ctrl+W | the verb is Space/Enter/click/tap; pause `KeyP`; Escape never bound (template refuses it) | none |
| `event.code` for AZERTY | all bindings are physical codes (Space, Enter, KeyP, KeyM), which are layout-independent | none |
| iOS audio resume | template AudioService resumes on touchend/click | none |
| Consistent physics at 60/144/165 Hz | analytic hops + fixed-step sim + timestamp judge (see "The throw and the timing judge"); sim-health test at 30/60/120/144/165 Hz | none |
| Midgame only at natural breaks, never on navigation/shop | only on Next / Retry from level 4; never on the Skipper Box, upgrades, pause or gift | none |
| Paused + muted on adStarted, resumed on adFinished/adError | template ads.js + pause.js + AudioService (mute on adStarted, not on request) | none |
| Rewarded: decline same size/font/colour, video icon | every offer is the template's `.btn` pair (Claim / Claim x3, Collect / Collect x2, Revive / No thanks); the Golden Arm pair is video + coin buttons of one style | none |
| Rewarded: not on the active gameplay screen | offers appear only on the jetty before the throw (gameplayStart fires at the throw), on result cards and in the Skipper Box. During a throw there are no buttons except pause. | **watch**: the jetty is both the offer screen and the "tap anywhere to throw" screen. A tap on an offer or tag must never throw, and a throw tap must never hit an offer (DOM buttons stop propagation; the `ad-ui` QA scenario gets a check) |
| Revive not on every death | once per session, only past 50% of the water, only from level 3 | none |
| Coin alternative for every reward | table above: every row has a coin or play path, including Golden Arm (coin price) | none |
| Hidden under adblock / Basic Launch | template `rewardedAvailability` hides the video buttons; notices on result + Skipper Box | none |
| No reward on adError; visible reward on adFinished | template ads.js grants only on finish; coins fly in, Golden Arm shows a gold arm band, revive shows the stone rising | none |
| No ad chaining | one video = one reward, never two in a row for one reward | none |
| Data-module progress save | the template save.js on `SDK.data` | none |
| English + SDK locale fallback | English strings in `src/core/i18n.js`; SDK `systemInfo.locale` with English fallback; no partial translations shipped | none |
| PEGI 12, not aimed at kids | no violence. Rubber ducks are toys, not animals being hit. The rock "smash" is stone on stone. No gambling visuals: the crates are chosen by speed, never random; "unlock random" never repeats and costs earned coins only. Tone: stylish for a 13+ audience, not a toddler style. | **watch**: keep the art direction teen-friendly (not nursery pastel) so the game does not read as kids' content |
| Original name and assets | name search log in `docs/ORIGINALITY.md`; all art is primitives, all sound ZzFX, font OFL (logged in ASSET_MANIFEST) | none |
| No cross-promotion, no app-store links | none in the game | none |
| gameplayStart / gameplayStop | `gameplayStart` at the throw (release) and on revive; `gameplayStop` when the result card opens, on pause and on the Skipper Box | none |
| Completion % | `reportGameCompletedPercentage(round((bestLevel-1)/30 x 100))`, forward only | none |

No design element conflicts with a mandatory rule. The three **watch** items are verified by QA scenarios at Gate 2
and later (see `docs/BUILD_PLAN.md`, section "CrazyGames QA").

## Scope
| Area | Must (Gate 2 prototype -> vertical slice) | Should | Nice | Cut (stays cut) |
|---|---|---|---|---|
| Core verb | **Prototype:** swing-release throw on one tap; analytic hops with skim; timestamp timing judge (PERFECT/GOOD/SPLASH, windows above); cue rings; "+N" per contact; streak trail x2/x3; plink pitch ladder; sink with "X m short"; the Bank with x2/x3/x5 crates; first-throw assist; retry <= 2.5 s | logs (W3), whirlpools (W4), lantern rings (W5), boats (W6) | Legend Sea endless record mode | steering, drag aim, a power bar/needle launch, slingshots |
| Content | **Prototype:** levels 1-5 (Mill Pond), rubber ducks, coin rings. **Slice:** levels 1-10 (Mill Pond, River Bend with rocks + gold-trail smash) | levels 11-30 (worlds 3-6) | seasonal waters | beach/sand/floatie imagery |
| Meta | **Slice:** Arm/Flat/Spin as jetty objects with price tags and visible growth; coins banked per throw; Data-module save; Skipper Box with 12 skippers and "Unlock random"; daily gift with forgiving streak; completion % | x10 top crate on each world's last level | stats page | energy/lives, loot boxes, paid randomness, an "income" upgrade, offline earnings |
| Monetization | **Slice:** all 7 rewarded surfaces with the caps above; midgame on Next/Retry from L4; ads-off/adblock paths; max 2 video buttons per screen | per-surface funnel review in playtests | - | IAP, banners in v1, pressure tactics (delayed declines, fake timers) |
| Platform | **Prototype:** landscape 1280x720 + portrait 450x800, keyboard/mouse/touch, gameplayStart/Stop, readable at 800x450 DPR 1. **Slice:** safe areas, mute rules, happytime at world clears only, English + locale fallback | haptics on Android (10 ms on PERFECT) | DE/FR/ES/PT strings | login, leaderboards, multiplayer, custom fullscreen button |
| Presentation | **Prototype:** grey-box profile M, ring language, basic plink/splash/bloop sounds. **Slice:** full palette per world 1-2, thrower bean, crate fanfare, confetti, coin fly-in | music loop (CC0), world palettes 3-6 | photo mode | "COMBO xN" banners, character voice-overs |

## Risks
| Risk | Type | Mitigation |
|---|---|---|
| Tapping every contact feels repetitive or arbitrary | design | Gate 2 prototype + blind critic + owner playtest. Kill or pivot to C4 if fewer than 3 of 4 testers throw again on their own within 3 s, or if PERFECT feels unfair at 30/120 Hz |
| Early throws are short (7-11 s in levels 1-5, below the formula's 20 s) | design | fast wins are intended for the first minute; throws lengthen with upgrades (16 s at L10, 36 s at L20). If playtests call early throws "too quick", raise the level-1 contacts (lower `T0` or add coin-ring chains) |
| The swing-release launch still reads like a timing bar | originality | it is in-world (the arm moves, the ring closes on the stone), not a HUD bar; the side-by-side test vs Rocket Fling at Gate 2 decides; fallback: tap-to-release on a continuous wind-up spin (no bar either) |
| The economy is too fast or slow (the model has no rocks or skipper spending) | design | re-run the Monte Carlo with rocks in the slice; per-level throw targets 1-1.5 (L1-5), ~2 (L10), ~4 (L20); tune `shore` growth first, prices second |
| x3 claims compress progression too much (30% acceptance: L20 in 29 vs 43 throws) | monetization | acceptable (the no-ad path stays complete); if D1 drops, raise the price growth, not the ad caps |
| Input latency on low-end Android and Bluetooth audio makes PERFECT feel late | tech | judge on event timestamps; a hidden `inputOffsetMs` (default 0) if playtests show a systematic bias; the sound fires in the input handler |
| Camera look-ahead fails in portrait on long hops (the next ring off-screen) | tech | clamp the touchdown point inside the middle 70%; widen the FOV up to +8° during long hops |
| The launch family is crowded (Rocket Fling, Bouncemasters, Splash Sliders) | market | win on the verb, per-contact pay and the jackpot bank; re-measure competitors ~2026-10-10 |
| Skip It! footage never seen (blocked); closer than REPORTED | originality | NEEDS USER footage; the verb difference is documented in ORIGINALITY.md |
| Jetty tap-anywhere + offers on the same screen causes mis-taps | platform | DOM buttons stop propagation; offers in fixed rails away from the centre; `ad-ui` QA check |
| Hit-stops or slow-mo shift the perceived beat | design | no hit-stop within 250 ms before a touchdown; the judge maps taps through the freeze |
| Content beyond level 30 is thin (Legend Sea is only Should) | retention | measure D1/D7 first. Levels 11-30 are rule-generated (cheap); Legend Sea follows if players reach L30 |

## Evidence
- `docs/RESEARCH.md`:
  - "Niche B - launch and upgrade for distance": MEASURED demand (Rocket Fling 66.3/day since BL, Obby Plane 85.0,
    Build A Plane 78.9)
  - "Teardowns (MEASURED 2026-09-26)": Rocket Fling live play, Splash Sliders and Bouncemasters trailers
  - "What Skip Legend (C1) must do differently, and the gap claim": no stone-skipping game on CrazyGames; none of the
    observed launch games makes a per-contact rhythm tap the core verb; Bouncemasters 315.8/day is the strongest
    signal and is bounce-centred
- `docs/CONCEPTS.md`: C1 scored 91/100 (the highest; runner-up C4 89). Decision recorded 2026-09-26.
- The economy numbers above come from a Monte Carlo model of these exact rules (40-200 seeded campaigns per player
  profile, 2026-09-26); the model is described in "Economy" so WP-02 can re-implement it as a Node balance test.
