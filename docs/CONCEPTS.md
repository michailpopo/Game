# Concepts - 2026-09-26

Package WP-01 (phase 2, steps 1-4) · Author: game-concept-designer · Inputs: `docs/RESEARCH.md` (pass 2),
the owner's brief ("a game for CrazyGames that is simple yet it will make me money"; research-and-propose,
desktop + mobile, single-player) and the skill's hypercasual formula (one verb, a reward every 0.5-2 s,
runs of 20-90 s, instant retry, run-end jackpot, visible collection, >= 5 wanted rewarded surfaces,
minimal-poly profile M). "Simple" is scored: a small team must be able to finish and polish it.

Five different core loops (the verbs: **tap on the beat**, **hold-and-slide to pour**, **hold/release to
zigzag**, **steer to dig**, **draw then topple**). All five are one-verb, minimal-poly concepts.
Scores prioritise work; they do **not** predict approval, rank or revenue.

Labels: **MEASURED** (fetched, cited) · **PROXY** · **REPORTED** (third party) · **HYPOTHESIS** (ours).
"RESEARCH" = a number from `docs/RESEARCH.md` (MEASURED 2026-09-26). "DESIGNER" = measured today by the
concept designer with the same tools (`cg-game.mjs`, the CrazyGames search API, yt-dlp); those rows are
listed in "Evidence added in this pass" at the end, and still need to be folded into RESEARCH.md.
Votes/day is a PROXY for traction; "since BL" divides by days since Basic Launch.

## Concept list

### C1 - Skip Legend (stone skipping, tap on every touch of the water)
- **Pitch:** Throw a flat stone and tap every time it touches the water. A perfect tap keeps its speed,
  every skip pays, and the skips come faster and faster as the stone slows, until the last rapid-fire
  skips and the splash. Reach the far shore and the stone slides into jackpot bins on the beach. Sink
  short, and spend the coins on a stronger arm, a flatter stone and more spin, then try the next, wider water.
- **Core loop (verbs):** one verb, *tap on time*. Tap to throw while the power needle is in the green ->
  tap at each water contact (PERFECT / GOOD / miss: speed kept 97% / 88% / 70%) -> perfect streak raises the
  coin multiplier (x2 at 5, x3 at 10) -> reach the shore (bins x2/x3/x5, chosen by the speed left) or sink
  -> count-up -> upgrades (Arm = launch speed, Flat = speed kept per skip, Spin = wider perfect window) and
  skippers (cosmetic) -> next throw. One skill decision: a perfect tap gives a long hop and an early tap a
  short one, so a player can shorten a hop to land on a duck (boost) or clear a rock (speed loss), at the
  cost of the streak. The water is generated per level: ducks, lily pads, logs (ramps), rocks,
  whirlpools (late levels), buoys every 25 m. The shore distance grows ~12% per level, 5 waters per world
  (Pond, River, Lake, Bay, Ocean, Ice Sea, ...).
- **First 30 s:** 0-2 s the home screen is the level: stone in hand on a jetty, far shore and its bins
  visible, the power needle swinging, a hand icon. 2-4 s first tap -> throw whoosh -> first contact
  with a big shrinking ring and "TAP!". The first three contacts of level 1 run at 0.6x time and have
  a wide window, so the first "+1 PERFECT" lands by ~3.5 s. 4-15 s: skip-skip-skip, the counter
  climbs, a duck boings the stone forward (+5). 15-25 s: the skips speed up, x2 streak, and level 1's
  shore (60 m) is always reachable. The stone slides into the x3 bin -> confetti -> count-up. 25-30 s: the
  result shows "Arm Lv 2 - 30" already affordable (endowed progress), one tap to the next water. No ad
  of any kind in the first run.
- **Why play again:** the shore is visible and was "6 m short!" (true near-miss). Each upgrade visibly
  lengthens the throw. The perfect streak is a skill you get better at. A new water every level,
  new world palettes every 5, and 12 skippers to collect (pizza, vinyl record, pancake, frisbee,
  manhole cover, ...), all discs of different primitives.
- **Thumbnail moment:** a low camera at water level: a flat stone in mid-air over turquoise water, a trail
  of shrinking ripple rings behind it, "+2 +2 +3 PERFECT x12" popping, a duck mid-boing, and glowing
  x5 bins on the beach ahead.
- **Closest existing games and the twist:**
  - [Skip It!](https://www.snokido.com/game/skip-it) (1Games.IO, web portals, released 2026-03-02,
    REPORTED via search summary): stone-skipping launch-and-upgrade, *hold* for power, then *drag to
    steer* around logs and buoys through power gates, with upgrades and offline earnings. **Not on
    CrazyGames** (DESIGNER: search API "skip it", "stone skip", "skipper", "skim" return nothing).
  - [Splash Sliders](https://www.crazygames.com/game/splash-sliders) (Unity 3D, BL 2026-08-11, ~29.2
    votes/day since BL, DESIGNER): slingshot a floatie across beach levels, with upgrades.
  - [Bouncemasters](https://www.crazygames.com/game/bouncemasters) (HTML5 2D, 315.7/day over 114 days,
    DESIGNER): a bat launches a penguin that bounces off animals. [Rocket Fling](https://www.crazygames.com/game/rocket-fling)
    (HTML5 3D, 66.3/day since BL, RESEARCH): catapult a rocket, pick things up mid-air, steer.
  - Stone Skipper Dash (mobile, Animetra, REPORTED via search): throw stones, ramps, upgrades.
  - **Ours:** the whole game is one rhythm verb, a tap at every contact (the others steer or only
    time the launch). A perfect-streak multiplier, level-by-level far shores ending in jackpot bins, a
    skipper collection, and the accelerating skip crescendo as the signature moment.
- **Natural ad breaks + non-ad paths:** every throw ends in 10-45 s at a result screen. Midgame on
  "Next"/"Retry" from level 4 (the SDK paces to at most 1 per 3 min, never right after a rewarded
  video). Every rewarded offer below has a coin path. With ads off (Basic Launch, adblock) the offers
  hide and the game is complete.
- **The 3-second clip:** thumb taps -> the stone leaves the hand -> plink, a ring, "+1" -> plink, ring,
  "+1" -> a duck bounces it high -> the last skips come rapid-fire -> it slides into a glowing "x5" bin
  on the sand -> confetti. Readable with the sound off.
- **Reward cadence:**

  | Scale | Interval | What happens |
  |---|---|---|
  | micro | 0.25-1.2 s (hops shorten as the stone slows) | "+1"/"+2" at the ripple, a plink on a rising pitch ladder, a ring burst, the counter punches |
  | streak | 5-10 perfects (~3-6 s) | "x2 STREAK" -> "x3", the trail turns gold, the pitch base rises |
  | peak | every 5-15 s, plus the end of every throw | duck boing / log ramp: 60 ms hit-stop + 120 ms slow-mo + "+15"; the final crescendo of rapid skips |
  | run end | 10-45 s | shore bins x2/x3/x5 (or "sank 6 m short" + distance coins) -> coin fly-in -> **x3 offer** |
  | meta | every 1-3 runs / every world | an upgrade level; a skipper silhouette turns to colour; a new water palette |
  | return | daily | daily gift (a small coin pile) with a **x2 offer** |

- **Ad-surface plan (7):**

  | # | Surface | Moment | Reward vs next goal | Cap | Non-ad path |
  |---|---|---|---|---|---|
  | 1 | Claim x3 | result, after the count-up | x3 the throw's coins (base always granted), about one extra upgrade level at that stage | every result | "Claim" |
  | 2 | Revive "Second wind" (5 s ring countdown that declines at 0) | the stone sinks past 50% of the water | the stone pops back up at 60% launch speed, next contact auto-perfect | once per session | "No thanks" -> result -> retry |
  | 3 | Start boost "Golden arm" | ready screen | +40% launch speed for one throw (about 3 Arm levels, ~1 min of progress) | hidden in runs 1-2; then every 2nd run or 120 s cooldown | Arm upgrade with coins |
  | 4 | Shop cash | shop, next skipper not affordable | +22% of the next skipper's price | 180 s cooldown with a visible timer | earn coins by playing |
  | 5 | Free upgrade | an unaffordable upgrade card | one level of Arm/Flat/Spin | 180 s cooldown | coins |
  | 6 | Try a skipper | shop/home, a locked skipper | use it for the next throw (its trail + sound) | once per skipper | unlock with coins |
  | 7 | Daily gift x2 | first session of the day | double the daily gift (~1-2 runs of coins) | 1/day | the base gift |

- **Poly fit:** stone = `CylinderGeometry(r,r,0.12,16)` (64 tris). Water = a gradient plane (2 tris)
  with instanced `RingGeometry` ripples (48 tris each, <= 40 alive). Duck = sphere (352) + head sphere
  (~170) + cone beak (16), instanced, <= 10. Buoy = cylinder + cone. Rock = `IcosahedronGeometry(r,1)` (80,
  flat-shaded). Log = cylinder. Boat = 3 boxes. Shore = boxes + cone trees. Bins = boxes with canvas labels.
  Skippers = cylinders/tori with a second colour. Estimate < 15k tris and < 25 draw calls per frame.
- **Tech risk:** low. The timing judge must use input-event timestamps in ms, never frames, and feel
  identical at 30/60/120 Hz (CG-GAME-003). The camera needs look-ahead so the next contact is always
  on screen, in portrait and landscape. Good water without a shader: gradient plane, ripples and
  sparkle particles. Build size is tiny: no models, no textures.
- **Smallest prototype that answers the feel question:** grey-box throw + 30 contacts + the timing judge +
  plink pitch ladder (1-2 days). Pass if 3 of 4 testers throw again within 3 s on their own, and the
  perfect window feels fair at 30 and 120 Hz.

### C2 - Blob Barrage (crowd cannon push with merge gates)
- **Pitch:** Hold to pour a stream of jelly blobs out of your cannon and slide to aim them through x2 and
  +10 gates. A MERGE gate squashes every 5 blobs into one big blob that takes 5 hits. Push through the
  enemy's blobs and pop their tower before their stream reaches your cannon.
- **Core loop (verbs):** one input, *hold and slide*. Hold = fire (about 8 blobs/s), slide = aim -> blobs run
  up through gates (some move) and multiply -> merge gates trade count for size -> head-on clashes (1 hit
  pops 1 blob) -> the survivors hit the tower (HP bar) -> win: tower crumbles; lose: enemy blobs reach
  the cannon. Every 20 hits charge a Giant (tap-release to fire). Coins -> upgrades (fire rate, start value,
  giant charge) and cannon skins.
- **First 30 s:** 0-2 s: the cannon, gates and the red tower are visible, with a "hold" hand hint. 2-4 s:
  hold -> blobs pour -> the first x2 gate doubles them with pops. 4-15 s: blobs hit the tower, its HP
  drops, a thin enemy trickle pops against yours. 15-30 s: first merge gate -> big blobs -> the tower
  crumbles (level 1 always wins) -> count-up.
- **Why play again:** the next tower is one level up; upgrades visibly thicken the stream; a merged
  Giant flattening a wave is the moment players chase; cannon skins.
- **Thumbnail moment:** a river of blue blobs pouring through a glowing "x3" gate and merging into
  one huge blob that smashes a red tower.
- **Closest existing games and the twist:**
  - Mob Control (Voodoo, mobile; hybridcasual #5 in AppMagic Q2 2025, REPORTED in RESEARCH). The loop is
    its signature.
  - [Mob Rush](https://www.crazygames.com/game/mob-rush) (HTML5, portrait, 2026-09-01, 104.8/day,
    RESEARCH): "guide your army through the right gates", a Mob-Control-like already on CrazyGames.
  - [Count Masters](https://www.crazygames.com/game/count-masters-stickman-games) (Unity crowd runner,
    381.6/day, RESEARCH).
  - **Ours:** merge gates and value-sized blobs (1 / 5 / 25) put a count-vs-size decision into the pour.
    Landscape and portrait. Jelly blobs instead of stickmen. HYPOTHESIS that this reads as clearly
    distinct from Mob Control.
- **Natural ad breaks + non-ad paths:** level end every 30-60 s (win or lose). Midgame on
  "Next"/"Retry" from level 4. Every offer has a coin path.
- **The 3-second clip:** a finger holds -> blobs pour -> a x2 gate doubles them -> a MERGE gate squashes
  five into one big blob -> the big blob bowls through red blobs -> the tower's HP bar drops.
- **Reward cadence:**

  | Scale | Interval | What happens |
  |---|---|---|
  | micro | 0.1-0.5 s | blob pops through a gate (+1 tick, pitch by gain), clash pops, tower hit numbers |
  | streak | 5-10 s | a moving x3 gate hit in a row, "x3 x3 x3", merge chains |
  | peak | 20-30 s | the Giant fired (hit-stop, shake), the tower crumbling in slabs |
  | run end | 30-60 s | stars by blobs left, coin count-up, **x3 offer** |
  | meta | every 2-3 levels | an upgrade level, a new cannon skin, a new arena every 10 levels |
  | return | daily | daily gift, **x2 offer** |

- **Ad-surface plan (7):**

  | # | Surface | Moment | Reward vs next goal | Cap | Non-ad path |
  |---|---|---|---|---|---|
  | 1 | Claim x3 | level result | x3 the level's coins | every result | "Claim" |
  | 2 | Revive "Last stand" (5 s ring) | enemy blobs reach the cannon after the tower is >= 20% damaged | clears the enemy wave near the cannon + 3 s shield | once per session | "No thanks" -> retry |
  | 3 | Start boost "Start with a Giant" | ready screen | a charged Giant at level start (~1 min of progress) | hidden in runs 1-2; then every 2nd run or 120 s | Giant-charge upgrade |
  | 4 | Shop cash | shop, next skin not affordable | +22% of its price | 180 s cooldown, visible timer | coins |
  | 5 | Free upgrade | an unaffordable upgrade card | one level | 180 s cooldown | coins |
  | 6 | Try a cannon | shop, a locked cannon | one level with it | once per cannon | unlock with coins |
  | 7 | Daily gift x2 | first session of the day | double the gift | 1/day | base gift |

- **Poly fit:** blob = `IcosahedronGeometry(r,1)` (80 tris) instanced, capped at 300 visible (24k). Cannon
  = cylinders + box. Gates = boxes with canvas labels. Tower = stacked boxes that fall apart. Ground =
  one plane. Both teams in 2 draw calls. Estimate ~35k tris and ~30 draw calls.
- **Tech risk:** medium. Two crowds with separation plus pairwise clashes need a spatial hash to hold 60 fps
  on a 4 GB Chromebook with 600 agents. Balancing waves against gates is the long pole. The camera has to fit
  portrait and landscape lanes. The template's crowd mesh and gates help.
- **Smallest prototype:** 250 vs 250 blobs clashing with one merge gate, measured on a low-end device,
  plus 3 testers asked "what did the MERGE gate do?".

### C3 - Grazeline (3D one-button wave dodge that pays for close shaves)
- **Pitch:** Hold to climb, let go to dive. A comet zigzags through a neon canyon of spikes and sliding
  blocks, and the closer you shave a wall the more coins spray off it. Reach 100% to clear the level.
- **Core loop (verbs):** one verb, *hold/release*. Hold = 45° up, release = 45° down. Grazing within
  0.4 m of geometry pays +1 every 0.25 s with sparks. Portals change speed and size. A hit = death at X% ->
  instant retry (checkpoints in practice mode) -> coins buy comet/trail skins and shields.
- **First 30 s:** 0-2 s: the comet idles at the level start, "hold" hint. 2-4 s: first climb and dive
  through a wide gap, first graze sparks "+1". 4-15 s: rhythm sections, % bar climbs. 15-30 s: first
  death near 30%, retry in under a second, a new best.
- **Why play again:** "73%!" and new bests; beat a level, unlock the next; graze skill = more coins.
- **Thumbnail moment:** a glowing comet trail zigzagging a hair's width past neon spikes, sparks
  flying, "GRAZE x12".
- **Closest existing games and the twist:**
  - [Space Waves](https://www.crazygames.com/game/space-waves) (Unity, 989/day),
    [Wave Dash: Geometry Arrow](https://www.crazygames.com/game/wave-dash-geometry-arrow) (Unity, 2026,
    258.2/day), [Hyper Wave Challenge](https://www.crazygames.com/game/hyper-wave-trial) (GameMaker HTML5,
    102.1/day since BL) - all 2D (RESEARCH). The verb is Geometry Dash's wave mode.
  - **Ours:** 3D depth (lanes weave in front of and behind the camera plane as decoration; the play plane stays
    2D so it stays readable), and graze income that turns risk into the reward engine. HYPOTHESIS that this is
    distinct enough: the clone risk is the highest of the five.
- **Natural ad breaks + non-ad paths:** deaths every 5-40 s and level ends every 60-90 s. Midgame only on
  "Retry" after a result screen, from level 3, paced by the SDK. Never interrupt a streak of instant retries
  (a retry loop is gameplay).
- **The 3-second clip:** a comet zigzags between spikes, sparks fly where it grazes, "+1 +1 +1", the %
  bar jumps, it slips through a one-block gap.
- **Reward cadence:**

  | Scale | Interval | What happens |
  |---|---|---|
  | micro | 0.25-1 s | graze sparks "+1", pickup orbs, % ticks |
  | streak | 5-10 s | "GRAZE x10", trail brightens |
  | peak | 20-40 s | a tight gap cleared (slow-mo 100 ms), speed portal, checkpoint flag |
  | run end | 5-90 s | "73% - new best!" or level clear, coin count-up, **x3 offer** |
  | meta | every 3-5 runs | a new comet/trail, the next level unlocked |
  | return | daily | daily gift, **x2 offer**; a daily level |

- **Ad-surface plan (6):**

  | # | Surface | Moment | Reward vs next goal | Cap | Non-ad path |
  |---|---|---|---|---|---|
  | 1 | Revive (5 s ring) | death past 30% of a level | continue from the death point + 2 s ghost | once per session | "No thanks" -> retry |
  | 2 | Claim x3 | result screen | x3 the run's coins | every result | "Claim" |
  | 3 | Start shield | ready screen | one free hit this attempt | hidden in runs 1-2; every 2nd run or 120 s | buy a shield for 150 coins |
  | 4 | Shop cash | shop, next skin not affordable | +22% of its price | 180 s | coins |
  | 5 | Try a comet | shop | one attempt with it | once per skin | unlock |
  | 6 | Daily gift x2 | first session of the day | double | 1/day | base gift |

  Weak spot: coins only buy cosmetics and shields, so the x3 and cash offers are less wanted than in an
  upgrade game.
- **Poly fit:** comet = icosahedron (80) + ribbon trail (~200 tris). Walls = instanced boxes (12 tris
  each). Spikes = instanced cones (16). Portals = tori. Background = gradient + a few big boxes. Estimate
  < 15k tris and < 20 draw calls.
- **Tech risk:** low for rendering, high for design. Hitboxes must be exact and fair. The 3D camera must not
  hurt readability. Levels are handmade (the genre's quality bar) or come from a generator with a fairness
  check. Input latency matters most here.
- **Smallest prototype:** one 60-s level in the 3D camera. Do first-timers pass 20% within 3 tries, and do
  they read the depth as decoration and not as a hazard?

### C4 - Core Diver (drill down to the planet's core)
- **Pitch:** Your drill falls through the planet on its own. Slide left and right to chew through glowing
  ore and dodge lava pockets and granite while the fuel gauge drains. Winch back up, sell the haul,
  upgrade, and dive deeper until you punch into the core.
- **Core loop (verbs):** one verb, *steer*. Drag left/right while auto-descending through a 13-column
  block grid -> soft blocks break fast, hard ones slow you and cost fuel, ores pay, fuel cans refill, lava
  damages the hull, gas pockets blast a 3x3 hole (good), caves give free fall -> fuel 0 -> the winch pulls you
  up -> the haul counts up with a depth bonus -> upgrades (drill power, tank, hull, magnet) -> dive again.
  Strata every ~150 m (Soil, Clay, Rock, Crystal Caverns, Magma, Mantle, Core at 3,000 m).
- **First 30 s:** 0-2 s: the drill spins on the surface over a cut-away of coloured strata with the core
  glowing at the bottom, "drag" hint. 2-4 s: it drops, dirt crunches, the first copper "+3". 4-15 s:
  steady ore, a fuel can, a lava pocket to dodge. 15-30 s: fuel runs out 12 m above the next stratum
  ("12 m to Clay!"), winch up, haul count-up, first upgrade affordable.
- **Why play again:** the next stratum is visibly just below; the core is the visible finish line; the
  tank upgrade converts straight into depth.
- **Thumbnail moment:** a cut-away planet, the drill tunnelling through bright strata, gems popping,
  the red-hot core below.
- **Closest existing games and the twist:**
  - [Galactic Drill](https://www.crazygames.com/game/galactic-drill) (HTML5 2D pixel, 27.6/day since BL,
    DESIGNER): "drill downward through layered terrain, extract valuable ores ... sell them ... to upgrade
    your rig". The same loop, already on CrazyGames.
  - [Miner, Dig It All](https://www.crazygames.com/game/miner-dig-it-all) (HTML5 2D, 11.5/day since BL,
    DESIGNER): "one tank of fuel. See how deep the pit lets you get!".
  - [Digging Simulator: Hole Craft](https://www.crazygames.com/game/digging-simulator-hole-craft) (Unity 3D,
    2026-07-30, 214.3/day, DESIGNER). Deep Delve (HTML5 2D, 15.0/day since BL), Motherload (Flash
    classic).
  - **Ours:** auto-descent with one steering verb (a vertical runner rather than free digging), a 3D
    minimal-poly cut-away look, and the core as the visible goal. Honest: the loop is this genre's
    convention.
- **Natural ad breaks + non-ad paths:** every dive ends in 20-60 s at the surface sale. Midgame on
  "Dive" from dive 4. Coin paths for every offer.
- **The 3-second clip:** the drill drops, blocks shatter in a column, gems fly to the counter, the strata
  colour changes, "CRYSTAL CAVERNS 450 m".
- **Reward cadence:**

  | Scale | Interval | What happens |
  |---|---|---|
  | micro | 0.1-0.3 s blocks, 0.5-1.5 s ore | crunch tick + debris; ore "+3" on a pitch ladder |
  | streak | 5-10 s | "VEIN x5" for consecutive ore |
  | peak | 20-40 s | a stratum breakthrough banner (hit-stop, shake), a gas blast, a geode |
  | run end | 20-60 s | winch up, haul count-up with depth bonus, **x3 offer** |
  | meta | every 1-3 runs | an upgrade level; a new stratum; drill skins (12) |
  | return | daily | daily gift, **x2 offer** |

- **Ad-surface plan (7):**

  | # | Surface | Moment | Reward vs next goal | Cap | Non-ad path |
  |---|---|---|---|---|---|
  | 1 | Claim x3 | surface sale | x3 the haul (base always granted) | every result | "Claim" |
  | 2 | Refuel (5 s ring) | fuel out below 60% of the best depth | +40% of the tank, continue | once per session | "No thanks" -> sale |
  | 3 | Drop pod | ready screen | start at 50% of the best depth (~1 min of progress) | hidden in runs 1-2; every 2nd run or 120 s | tank upgrade |
  | 4 | Shop cash | shop, next drill not affordable | +22% of its price | 180 s | coins |
  | 5 | Free upgrade | unaffordable card | one level | 180 s | coins |
  | 6 | Try a drill | shop | one dive | once per drill | unlock |
  | 7 | Daily gift x2 | first session of the day | double | 1/day | base gift |

- **Poly fit:** blocks = instanced boxes (12 tris; ~300 visible = 3.6k). Ores = `IcosahedronGeometry(r,0)`
  (20). Drill = cone + cylinders + box (~150). Lava = emissive boxes. The cut-away background = a few
  large boxes. Estimate < 10k tris and < 20 draw calls.
- **Tech risk:** low. Swap-remove on InstancedMesh for broken blocks; procedural strata with seeded rng.
  Design risk: whether steering is a real choice (ore vs. hard rock vs. hazards) or just holding still.
- **Smallest prototype:** 13-column grid, soft/hard/ore/lava blocks, fuel, one upgrade. Is steering
  meaningful within 3 dives?

### C5 - Topple Line (draw a domino line, then watch it fall)
- **Pitch:** Draw a line with your finger and dominoes pop up along it. Let go and watch them fall: every
  clack pays, dominoes standing on x2 and x3 tiles pay double and triple, and the last one has to ring
  the giant bell. Longer lines, better tiles, bigger bells.
- **Core loop (verbs):** one verb, *draw* (drag). Draw a path from the start domino (up to the stock,
  e.g. 60) -> release -> the chain topples (about 12 dominoes/s) -> each fall +1 x the tile multiplier ->
  toppling props (cup towers, a pre-built domino spiral worth +50) -> ring the bell = level clear and
  jackpot; the chain stops short = near-miss result -> coins -> upgrades (stock, domino value) and domino
  sets (cookies, books, phones, cards).
  The choice: zig-zag through multiplier tiles, or keep enough stock to reach the bell.
- **First 30 s:** 0-2 s: a tabletop diorama, start domino, bell, a dotted suggested path, finger hint.
  2-4 s: dominoes pop in under the finger with rising ticks. 4-12 s: release, clack cascade, "+1 +1 +2",
  the bell rings (level 1 always reaches it). 12-30 s: level 2 adds a x2 tile and the first stock limit.
- **Why play again:** "1 domino short of the bell!", better paths through x3 tiles, bigger dioramas,
  domino sets.
- **Thumbnail moment:** a rainbow spiral of dominoes mid-topple sweeping into a giant bell, "x3" tiles
  glowing under them.
- **Closest existing games and the twist:**
  - No domino-toppling game on CrazyGames (DESIGNER: search API "domino", "dominoes", "topple",
    "chain reaction", 2026-09-26: only the tile games Domino Battle and Domino Duel).
  - The drawing verb: [Draw Climber](https://www.crazygames.com/game/draw-climber) (HTML5, 54.3/day,
    RESEARCH). A small Android game "Domino Line!" exists (seen only as a YouTube walkthrough title,
    unverified).
  - **Ours:** a draw-then-topple puzzle-arcade with multiplier tiles and a stock economy. HYPOTHESIS that
    CrazyGames players want it: no measured demand.
- **Natural ad breaks + non-ad paths:** a level every 15-30 s. Midgame on "Next" from level 4. Coin paths
  everywhere.
- **The 3-second clip:** a finger draws a curve, dominoes spring up along it, the release, a wave of
  clacks sweeping through glowing x3 tiles into a bell that rings.
- **Reward cadence:**

  | Scale | Interval | What happens |
  |---|---|---|
  | micro | 0.08 s per domino while falling; per placed domino while drawing | clack + "+1", the counter spins, placement ticks |
  | streak | a run over a multiplier tile (1-3 s) | gold dominoes, "x3!", rising pitch |
  | peak | end of every level | the pre-built spiral topples, the bell rings (slow-mo) |
  | run end | 15-30 s | coin count-up, stars, **x3 offer** |
  | meta | every 2-3 levels | an upgrade; a new domino set; a new diorama theme every 10 |
  | return | daily | daily gift, **x2 offer**; a daily diorama |

- **Ad-surface plan (7):**

  | # | Surface | Moment | Reward vs next goal | Cap | Non-ad path |
  |---|---|---|---|---|---|
  | 1 | Claim x3 | level result | x3 the coins | every result | "Claim" |
  | 2 | "+10 dominoes" (5 s ring) | the chain stopped short with >= 80% of the path covered | continue the line by 10 and re-tip | once per session | "No thanks" -> retry |
  | 3 | Start boost | ready screen | +50% stock this level | hidden in runs 1-2; every 2nd level or 120 s | stock upgrade |
  | 4 | Shop cash | shop | +22% of the next set | 180 s | coins |
  | 5 | Free upgrade | unaffordable card | one level | 180 s | coins |
  | 6 | Try a set | shop | one level | once per set | unlock |
  | 7 | Daily gift x2 | first session of the day | double | 1/day | base gift |

- **Poly fit:** domino = box (12 tris), instanced, <= 400 (4.8k). Table and props = boxes and cylinders.
  Bell = cylinder + cone. Tiles = flat boxes with canvas labels. Estimate < 12k tris and < 20 draw calls.
- **Tech risk:** medium-low. Path-to-domino placement (spacing, overlaps, gaps, table edges). Kinematic
  sequential topple, including props. A level generator with a solvability check. On small phones the
  finger hides the line, so place dominoes a little ahead of the finger.
- **Smallest prototype:** one diorama, draw + topple + tiles + bell. Do testers want to redraw after
  watching, or does watching feel passive?

## Scores (1-5, one line of reasoning each in the notes below)
The template's 17 rows plus three rubric rows it left out (content scalability, time to gameplay,
monetization fit), so every dimension of `checklists/concept-scoring.md` is covered.

| Dimension | C1 Skip Legend | C2 Blob Barrage | C3 Grazeline | C4 Core Diver | C5 Topple Line |
|---|---|---|---|---|---|
| Core-loop strength | 4 | 4 | 4 | 4 | 3 |
| Clarity in 5 seconds | 5 | 4 | 4 | 5 | 5 |
| First-session quality | 5 | 5 | 4 | 5 | 4 |
| Replayability | 3 | 3 | 3 | 4 | 3 |
| Skill headroom | 4 | 3 | 5 | 3 | 4 |
| Originality (distance from closest game) | 3 | 2 | 2 | 2 | 4 |
| Thumbnail identity | 4 | 4 | 3 | 4 | 5 |
| Hook density | 5 | 5 | 4 | 5 | 4 |
| 3-second clip | 5 | 5 | 4 | 5 | 5 |
| *Experience subtotal (of 45)* | *38* | *35* | *33* | *37* | *37* |
| Production simplicity (5 = simple) | 5 | 3 | 4 | 4 | 4 |
| Performance risk (5 = safe) | 5 | 4 | 5 | 5 | 4 |
| Poly fit, profile M | 5 | 5 | 5 | 5 | 5 |
| Mobile/touch fit | 5 | 5 | 5 | 5 | 5 |
| Content scalability | 5 | 3 | 3 | 5 | 3 |
| *Production subtotal (of 25)* | *25* | *20* | *22* | *24* | *21* |
| Time to gameplay | 5 | 5 | 5 | 5 | 5 |
| Ad-break fit | 5 | 5 | 4 | 5 | 5 |
| Retention hooks | 4 | 4 | 3 | 5 | 4 |
| Monetization fit | 5 | 5 | 3 | 5 | 4 |
| Ad-surface count | 5 | 5 | 3 | 5 | 5 |
| Market gap evidence (label!) | 4 | 3 | 4 | 3 | 2 |
| *Platform subtotal (of 30)* | *28* | *27* | *22* | *28* | *25* |
| **Total (of 100)** | **91** | **82** | **77** | **89** | **83** |

No concept hits a send-back rule: no core-loop <= 2, no hook density <= 2, no ad-surface count <= 2.

### Score notes
**C1 Skip Legend**
- Core loop 4: a timing tap at every contact, with a rhythm that speeds up as the stone slows, gives a skill beat every 0.25-1.2 s on top of the upgrade pull; the feel is unproven, so not 5 before the prototype.
- Clarity 5: everyone knows stone skipping; ring + tap needs no text.
- First session 5: the throw at ~2 s, the first "+1 PERFECT" by ~3.5 s, the first shore by ~25 s.
- Replayability 3: generated waters vary the props, but throw 2 feels like throw 1 until upgrades and new worlds change it.
- Skill headroom 4: perfect streaks (x3 coins) and the short-hop choice visibly beat mashing.
- Originality 3: launch-upgrade is a genre; Skip It! (web portals, not CrazyGames) already does stone-skip + upgrades with steering; the per-contact rhythm, streak multiplier, shore bins and skippers are ours.
- Thumbnail 4: stone mid-skip with shrinking rings reads at 200 px, but water scenes are common.
- Hook density 5: a number every skip, streaks, a peak every 5-15 s, jackpot bins, a collection.
- 3-second clip 5: throw, plink-plink-plink, bin, confetti - no narration needed.
- Production 5: one system (a hop sequence + timing judge); the template's shop, offers, save and flow do the rest.
- Performance 5: a plane, rings and a few props.
- Poly fit 5: every object is a named primitive (disc, ring, sphere, cone, box).
- Mobile 5: one tap anywhere (Space/click on desktop).
- Content scalability 5: shore distance, prop density and palette come from rules.
- Time to gameplay 5: the home screen is the jetty; one tap throws.
- Ad-break fit 5: a result every 10-45 s.
- Retention 4: upgrades, the next shore, worlds and skippers; no rank/social hook.
- Monetization fit 5: the upgrade loop makes x3 coins and free upgrades genuinely wanted.
- Ad-surface count 5: seven surfaces, each with a cap and a coin path.
- Market 4: the launch-and-upgrade family carries MEASURED 2026 traction on CrazyGames, including HTML5 entries (Bouncemasters 315.7/day over 114 days, DESIGNER; Rocket Fling 66.3/day since BL, Obby Plane 85.0, Build A Plane 78.9, RESEARCH), and no CrazyGames game uses stone skipping (DESIGNER search); the gap is the verb, not the niche, so not 5.

**C2 Blob Barrage**
- Core loop 4: Mob Control's pour-through-gates loop is proven; merge adds a real decision.
- Clarity 4: gates and towers read instantly; the merge gate needs one look.
- First session 5: x2 pops within 3 s, a tower falls by 30 s.
- Replayability 3: layouts and waves change, the feel stays the same.
- Skill headroom 3: aiming at moving gates and timing the Giant; modest.
- Originality 2: the signature loop of Mob Control, and Mob Rush already brings it to CrazyGames in HTML5.
- Thumbnail 4: a blob river merging into a giant is readable but genre-typical.
- Hook density 5: pops, clashes and tower hits every fraction of a second.
- 3-second clip 5: hold, pour, x2, merge, smash.
- Production 3: two crowds, clashes, tower HP, enemy waves, moving gates - several interlocking systems.
- Performance 4: 600 instanced agents with a spatial hash is manageable but must be measured on a Chromebook.
- Poly fit 5: 80-tri blobs, boxes, cylinders.
- Mobile 5: hold and slide.
- Content scalability 3: wave/gate balance needs tuning per level.
- Time to gameplay 5: hold to play.
- Ad-break fit 5: level boundaries every 30-60 s.
- Retention 4: upgrades and skins; no distinct long goal.
- Monetization fit 5: upgrades and a Giant boost fit the fiction.
- Ad-surface count 5: seven surfaces.
- Market 3: the strongest single demand signal (Count Masters 381.6/day; Mob Rush 104.8/day in 26 days, RESEARCH), but Mob Rush has narrowed the browser-native gap (RESEARCH "gap MEDIUM").

**C3 Grazeline**
- Core loop 4: hold/release zigzag is proven (Space Waves 989/day, RESEARCH); graze pay rewards risk.
- Clarity 4: the zigzag reads; 3D depth could confuse at first.
- First session 4: fun at once, but early deaths frustrate part of a casual audience.
- Replayability 3: fixed or generated levels, the same feel.
- Skill headroom 5: pure skill with visible mastery.
- Originality 2: Geometry Dash's wave mode, with three wave games already on CrazyGames; 3D and graze income are small distances.
- Thumbnail 3: a neon zigzag looks like the existing 2D ones.
- Hook density 4: graze ticks and % progress, but deaths break the cadence.
- 3-second clip 4: the zigzag is obvious; grazing reads better with sound.
- Production 4: simple systems; fair level design is the work.
- Performance 5: very light.
- Poly fit 5: boxes, cones, a ribbon.
- Mobile 5: hold anywhere.
- Content scalability 3: the genre's quality bar needs handmade levels or a checked generator.
- Time to gameplay 5: instant.
- Ad-break fit 4: many deaths, but midgames inside a retry streak would hurt flow.
- Retention 3: levels and skins, no upgrade pull.
- Monetization fit 3: upgrades would break skill fairness, so coins only buy cosmetics and shields.
- Ad-surface count 3: six surfaces, but only revive is strongly wanted.
- Market 4: MEASURED demand for the exact mechanic is the highest on the site, and every entry is 2D (RESEARCH "open for 3D"); the clone risk shows in originality, not here.

**C4 Core Diver**
- Core loop 4: steering between ore, hard rock and hazards while fuel drains gives constant small choices plus a strong upgrade pull.
- Clarity 5: a drill boring down through coloured layers.
- First session 5: digging at 2 s, ore at 3 s, first upgrade after dive 1.
- Replayability 4: procedural strata, rare veins and "what is below" curiosity.
- Skill headroom 3: route choice matters, upgrades dominate.
- Originality 2: the same loop is already on CrazyGames in HTML5 (Galactic Drill, Miner Dig It All); ours differs in 3D look, auto-descent and the core goal.
- Thumbnail 4: a cut-away planet is striking, but Galactic Drill and others own the drill image.
- Hook density 5: a block every 0.1-0.3 s, ore every second, strata banners, the core.
- 3-second clip 5: drop, crunch, gems, new stratum.
- Production 4: grid + hardness + fuel + hazards + winch/sale: a few more systems than C1.
- Performance 5: ~300 instanced boxes.
- Poly fit 5: boxes and low icosahedra.
- Mobile 5: drag.
- Content scalability 5: strata rules generate everything.
- Time to gameplay 5: instant.
- Ad-break fit 5: a sale every 20-60 s.
- Retention 5: the core is a visible finish line; the next stratum is always just below.
- Monetization fit 5: fuel and drill upgrades make every offer wanted.
- Ad-surface count 5: seven surfaces.
- Market 3: the mining niche is hot in 2026 (Digging Simulator 214.3/day Unity, Obby Dig Down 72.2 and Obby Stronger Drill 52.5 since BL, DESIGNER), but the browser-native same-loop entries only reach 11-28/day since BL (Galactic Drill, Miner Dig It All, Deep Delve, DESIGNER) and they already occupy the loop.

**C5 Topple Line**
- Core loop 3: drawing and then watching your own chain fall is satisfying, but the agency is front-loaded; unproven.
- Clarity 5: everyone knows dominoes.
- First session 4: a topple within 10 s, but the first levels are gentle puzzles.
- Replayability 3: dioramas change; the rhythm per level is similar.
- Skill headroom 4: path optimisation through multiplier tiles with a limited stock.
- Originality 4: no toppling game on CrazyGames (DESIGNER search); draw-then-topple with multiplier tiles has no clear precedent.
- Thumbnail 5: a rainbow domino spiral mid-fall is unmistakable at 200 px.
- Hook density 4: dense clacks while falling, thinner while drawing.
- 3-second clip 5: draw, release, cascade, bell.
- Production 4: placement validity, the topple kinematics and prop reactions are more than C1's single system.
- Performance 4: several hundred animated instances per level; fine, but more per-frame JS than C1.
- Poly fit 5: boxes.
- Mobile 5: drag; small screens need the look-ahead placement.
- Content scalability 3: dioramas need a generator with a solvability check or handmade levels.
- Time to gameplay 5: draw immediately.
- Ad-break fit 5: a level every 15-30 s.
- Retention 4: level map, sets, daily diorama.
- Monetization fit 4: stock boosts fit; a puzzle economy is weaker than an upgrade loop.
- Ad-surface count 5: seven surfaces.
- Market 2: HYPOTHESIS only. Domino videos show the fantasy's appeal (PROXY, DESIGNER: YouTube "domino line game" 12 of 20 >= 100k views, top 153M - real-footage videos, not games), but there is no game demand evidence.

## Decision
**Recommended: C1 Skip Legend** (the launch-and-upgrade family, with stone skipping and a tap at every
touch of the water).

Why it wins for this owner ("simple yet it will make me money"):
1. **Simplest to finish and polish.** The whole game is one system: a sequence of hops plus a timing judge. Upgrades,
   shop, save, offers and the result flow come from the template. A small team can spend its time on
   feel (the plink ladder, the ring, the crescendo, the bins) instead of on systems.
2. **The richest wanted ad map.** Seven surfaces. Because the loop is "throw -> coins -> upgrade", the x3 claim and the
   free upgrade are what the player wants anyway, and a result every 10-45 s gives the SDK a natural midgame
   break every minute or two.
3. **Demand where it is measured, in a verb nobody on the site uses.** The launch-and-upgrade family has the broadest
   2026 traction on CrazyGames, including HTML5 games (Bouncemasters 315.7/day over 114 days; Rocket Fling
   66.3/day since BL), and no CrazyGames game skips stones or times every contact (DESIGNER search).
4. **Skill inside an incremental game.** Perfect streaks give mastery a visible payoff, so it is more than a
   waiting game.

Why it beat the runners-up:
- **C4 Core Diver** (89) has better retention (the core as a finish line) and replayability. But the exact
  loop already runs on CrazyGames in HTML5 (Galactic Drill, Miner, Dig It All), those browser entries only reach
  11-28 votes/day since BL, and it needs more systems. The planner's drill idea is sound design in a crowded
  lane: keep it as the fallback if C1's prototype fails.
- **C5 Topple Line** (83) is the most original with the best thumbnail, but its demand is HYPOTHESIS only and
  watching a topple may feel passive (core loop 3).
- **C2 Blob Barrage** (82) has the strongest single demand number. But it is Mob Control's signature loop,
  Mob Rush already does it in HTML5 on CrazyGames, and two clashing crowds are the most production and
  performance risk of the five.
- **C3 Grazeline** (77) sits on the biggest demand (Space Waves), but has the highest clone risk and the weakest money
  design: no upgrade loop, so the offers are wanted less.

**Biggest risk of C1 and how we find out cheaply:** that tapping at every contact feels repetitive, or too
easy or too hard, and that early throws are short (10-15 s in level 1, under the formula's 20 s; they
lengthen with upgrades). A 1-2 day grey-box prototype (throw + 30 contacts + timing judge + plink ladder) answers it.
Kill or pivot to C4 if fewer than 3 of 4 testers throw again within 3 s on their own, or if the perfect window feels
arbitrary at 30/120 Hz. Second risk: the launch family is crowded (Rocket Fling, Bouncemasters, Splash Sliders), so
polish and the verb must carry it. Re-measure those three around 2026-10-10.

**Top 3 for the owner:**
1. **C1 Skip Legend** - Throw a stone, tap each time it touches the water, and reach the far shore's jackpot
   bins. *Fun moment:* the last skips come rapid-fire, plink-plink-plink, and the stone slides into the x5
   bin. *Earns because:* throw -> coins -> upgrade is the loop, so x3, free upgrade and "golden arm" offers are
   wanted, and a result lands every 10-45 s. *Risk:* the tap-per-skip feel is unproven, and the launch family is crowded.
2. **C4 Core Diver** - Steer a falling drill through coloured strata, grab ore, race the fuel gauge, upgrade,
   and reach the core. *Fun moment:* breaking into a new stratum with a vein of gems. *Earns because:* fuel
   and drill upgrades plus a visible finish line pull players back. *Risk:* the same loop already exists on
   CrazyGames in HTML5 (Galactic Drill, Miner Dig It All).
3. **C5 Topple Line** - Draw a domino line and watch it fall through x2/x3 tiles into a giant bell. *Fun
   moment:* the cascade sweeping into the bell. *Earns because:* levels are 15-30 s with stock boosts and
   x3 claims. *Risk:* no measured demand, and watching may feel passive.
   (C2 Blob Barrage is the "demand first" alternative: strongest numbers, but the most production and clone risk.)

**Rejected ideas (kept for later):**
- Snowball roll-and-grow: [Roll King](https://www.crazygames.com/game/roll-king) (HTML5 3D, BL 2026-07-24,
  14.9/day since BL, DESIGNER) already does "stick anything smaller onto your growing ball".
- Glass-smash corridor (tap to throw balls at glass): too close to Smash Hit's signature. Break the Glass is on
  CrazyGames (1.8/day).
- Ball-Blast-style cannon vs numbered rocks: weak on CrazyGames (Ball Blast 0.5/day, Cannon Ball Blast
  0.4/day, DESIGNER).
- Marble conveyor sort and screw/block jam: low CrazyGames demand (RESEARCH).

**Name check for the recommendation (log line; the full ORIGINALITY.md comes after the pick):**
2026-09-26 "Skip Legend". CrazyGames search API: "skip legend", "skipper", "skip it", "stone skipper",
"stone skip", "skim", "ripple" all return no results. WebSearch `"Skip Legend" game app` and
`"Skip Legend" OR "Skipping Legend" stone game` find no game of that name. Near names: "Legend of Stone
Skipping" (a course in Infinity Nikki), "Skip It!" (1Games.IO web game), "Stone Skipper Dash" (mobile),
and itch.io jam games "Skipping Stones" / "Stone Skipping". Rejected alternates: "Ripple Rush" (a 2020
board game by Stronghold Games) and anything with "Splash" (too close to Splash Sliders). Honest name
ideas for the others (CrazyGames search API, no hits): Blob Barrage, Grazeline, Core Diver, Topple Line.

**NEEDS USER:**
1. Pick one concept at Gate 1: C1 is recommended, C4 is the fallback, and C5 or C2 are the alternatives.
2. Approve or replace the working title "Skip Legend".
3. Optional but valuable: a 30-60 s screen recording of **Skip It!** (e.g. snokido.com/game/skip-it) and of
   **Splash Sliders** and **Bouncemasters** on CrazyGames. This confirms C1 is clearly distinct before the
   originality review. For C4, record **Galactic Drill**; for C2, **Mob Rush**.
4. Accept a prototype gate before production: C1's feel is a HYPOTHESIS until testers play the grey box.

User approval: _open - the owner has not picked yet (Gate 1)_

## Evidence added in this pass (DESIGNER, MEASURED 2026-09-26)
Commands: `NODE_USE_ENV_PROXY=1 node <skill>/scripts/research/cg-game.mjs <slugs> --md --json`; the
CrazyGames search API `api.crazygames.com/v3/en_US/search?q=`; `yt-dlp "ytsearch20:<q>" --flat-playlist`;
WebSearch. The raw output sits in the session scratchpad, not in the repo. To do: fold these rows into
RESEARCH.md (researcher; this package may only touch CONCEPTS.md).

| Game | Rating | Votes | Added (BL) | Votes/day (since BL) | Tech | Note |
|---|---|---|---|---|---|---|
| Bouncemasters | 8.8 | 35,988 | 2026-06-05 (none) | 315.7 | HTML5 2D | bat-launch a penguin, bounce off animals, upgrades |
| Splash Sliders | 8.9 | 1,343 | 2026-09-08 (08-11) | 70.7 (~29.2) | Unity 3D | slingshot a floatie across beach levels, upgrades |
| Digging Simulator: Hole Craft | 8.7 | 12,621 | 2026-07-30 (none) | 214.3 | Unity 3D | drilling machines, ores, upgrades |
| Obby: Dig Down | 9.1 | 6,284 | 2026-07-21 (07-01) | 92.4 (72.2) | Unity 6 | obby + incremental digging |
| Obby: Stronger Drill, Deeper Mine | 9.2 | 3,204 | 2026-08-19 (07-27) | 82.2 (52.5) | Unity 6 | drilling tycoon |
| Galactic Drill | 9.1 | 3,611 | 2026-06-11 (05-18) | 33.4 (27.6) | HTML5 2D pixel | drill down layered terrain, sell ore, upgrade (same loop as C4) |
| Miner, Dig It All | 9.2 | 597 | 2026-08-26 (08-05) | 18.7 (11.5) | HTML5 2D | one tank of fuel, how deep |
| Deep Delve | 9.1 | 1,214 | 2026-07-24 (07-07) | 18.7 (15.0) | HTML5 2D | mining |
| Hole Digger / Dig and Descend / Aqua Miner / Drill Quest | 8.6-9.3 | 318-10,034 | 2024-2026 | 32.8 / 24.7 / 5.0 / 0.4 | Unity / Unity / HTML5 / HTML5 | more of the mining niche (Mining tag: 79 games) |
| Roll King | 9.0 | 954 | 2026-09-01 (07-24) | 36.7 (14.9) | HTML5 3D | Katamari-like roll-and-grow |
| Ball Blast / Cannon Ball Blast / Break the Glass | 8.0-8.7 | 92-707 | 2023-2026 | 0.5 / 0.4 / 1.8 | mixed | weak |
| Stone skipping on CrazyGames | - | - | - | - | - | none (search: "stone skip", "skipping", "skip it", "skipper", "skim", "pebble") |
| Domino toppling on CrazyGames | - | - | - | - | - | none (search: "domino", "dominoes", "topple", "chain reaction") |
| Skip It! (off CrazyGames) | - | - | 2026-03-02 | - | HTML5 | REPORTED via WebSearch summaries: 1Games.IO; hold for power, drag to steer, power gates, upgrades incl. offline earning; on many web portals |
