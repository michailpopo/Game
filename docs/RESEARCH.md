# Research - Working Title

Date: 2026-09-26 (pass 2, same day: CrazyGames, Poki and YouTube were unblocked) · Package: WP-00 ·
Researcher: game-market-researcher

**Question:** which one-verb hypercasual mechanic should a new, simple, minimal-poly three.js single-player
game on CrazyGames use, so that it (a) has proven demand, (b) is not already well served by a strong
browser-native version on CrazyGames, and (c) naturally carries many *wanted* rewarded offers (claim x3, revive,
start boost, shop cash, free upgrade, try skin, daily) plus midgames at short natural breaks?
**Decision it informs:** the concept shortlist for phase 2 (CONCEPTS.md).

Labels (mandatory on every claim): **MEASURED** (fetched/observed, cite) · **PROXY** (stand-in, say for what)
· **REPORTED** (third party, name them) · **HYPOTHESIS** (ours, say what would test it).

### How to read the numbers
- CrazyGames numbers are **MEASURED 2026-09-26** with `cg-game.mjs` (page `__NEXT_DATA__`), raw output in
  `qa/research-{crowd,launch,sort,other,5min}.md|json`. **Votes/day is a PROXY for traction**; compare within
  one category (most games below are *Arcade*; puzzle games vote differently).
- `cg-game.mjs` divides by days since `addedOn` (Full Launch). A game that just left Basic Launch shows an
  inflated rate (few days, new-games carousel boost). For those the table also shows **votes/day since
  `basicLaunchOn`** ("since BL"), which is the fairer figure.
- Mobile figures stay **REPORTED via search summary** from pass 1 (analytics sites were still blocked).
- Technical note: Node fetch needs `NODE_USE_ENV_PROXY=1`. Client-rendered tag pages carry their full list in
  `__NEXT_DATA__.props.pageProps.games` (read with curl + python). The search API
  `api.crazygames.com/v3/en_US/search?q=` answers. Playwright could not render pages because
  `builds.crazygames.com` and `imgs.crazygames.com` are still blocked.

## Sources checked
| Source | URL / command | Date | What it gave |
|---|---|---|---|
| CrazyGames game pages | `NODE_USE_ENV_PROXY=1 node <skill>/scripts/research/cg-game.mjs <98 slugs> --md --json` -> `qa/research-*.md` | 2026-09-26 | MEASURED rating, votes, dates, tech, tags for all competitors below |
| CrazyGames listings | `cg-list.mjs new hot t/one-button t/cannon ...` -> `qa/research-cg-list.md`; full tag lists from `__NEXT_DATA__` | 2026-09-26 | `/new` 70, `/hot` 40 slugs; tag totals: 5-minute fun 24, One Button 81, Cannon 21, Sorting 55; `t/upgrade`, `t/launch`, `t/flying` redirect to home (no such tags); `t/crowd`, `t/marble`, `t/conveyor`, `t/plane` 404 |
| CrazyGames search API | `api.crazygames.com/v3/en_US/search?q=` for mob, crowd, count masters, launch, fling, toss, plane, rocket, marble, conveyor, pixel blast, sand, ball sort -> `qa/research-cg-search.md` | 2026-09-26 | niche membership (fuzzy matching) |
| YouTube | `yt-dlp "ytsearch20:<q>" --flat-playlist` -> `qa/research-youtube.md` | 2026-09-26 | view counts for the top mechanics |
| Poki | `curl https://poki.com/en/` (149 game slugs server-rendered) | 2026-09-26 | Hole.io, Slice Master, Count Control Legends, Perfect Landing Plane Pilot on the home grid; Learn to Fly 3 redirects to kids.poki.com (blocked) |
| Skill references | `references/design/hypercasual-hits.md` (2026-09-22), `references/crazygames/launch-and-metrics.md` (2026-09-11) | as dated | earlier cohort snapshot; CrazyGames genre metrics |
| Mobile market (pass 1) | AppMagic hybridcasual Q2/Q3 2025 and H1 2026 (via GamerBraves, gamedevreports, PocketGamer.biz summaries); Gamigion 2025 standouts and "Voodoo's new big three"; NextBigGames on Marble Sort (2026-03-28); PocketGamer.biz most downloaded 2025; Innovecs 2026; game-solver.com (Epic Plane Evolution) | 2026-09-26 | REPORTED mobile demand (see "Outside CrazyGames") |

## Competitors on CrazyGames (MEASURED 2026-09-26)

### Niche A - crowd / gates / cannon push (Mob Control, Count Masters)
| Game | Rating | Votes | Added (BL) | Votes/day (PROXY) | Tech | Orientation | Mobile port | Tags (gamesCount) |
|---|---|---|---|---|---|---|---|---|
| [Count Masters: Stickman Games](https://www.crazygames.com/game/count-masters-stickman-games) | 8.9 | 222,468 | 2025-02-21 | **381.6** | Unity 2022 | both | yes | 5-minute fun(24), Mobile |
| [Bridge Race](https://www.crazygames.com/game/bridge-race) | 8.7 | 106,355 | 2024-12-27 | 166.4 | Unity 2022 | both | yes | 5-minute fun |
| [Mob Rush](https://www.crazygames.com/game/mob-rush) (inlogic.sk; gates, units, enemy base, coin upgrades = Mob-Control-like) | 8.9 | 2,725 | **2026-09-01** (no BL) | **104.8** | **HTML5** | portrait | no | Mobile, Battle, Defense, Skill, Casual |
| [Man Runner 2048](https://www.crazygames.com/game/man-runner-2048) | 8.6 | 99,423 | 2023-08-18 | 87.5 | Unity 6 | portrait | yes | Cannon(21), Running, 2048 |
| Dino Crowd / Gravity Crowd / Merge Cannon / Cannon Clash / Crown & Cannon / Stickman Crowd Fight / Crowd Lumberjack / Tower Crush | 8.3-9.6 | 65-4,266 | 2020-2025 | 0-3.7 | mostly Unity | - | - | - |

### Niche B - launch and upgrade for distance (Epic Plane Evolution / Learn to Fly family)
| Game | Rating | Votes | Added (BL) | Votes/day (PROXY) | Tech | Orientation | Mobile port | Notes |
|---|---|---|---|---|---|---|---|---|
| [Rocket Fling](https://www.crazygames.com/game/rocket-fling) | 9.1 | 1,724 | **2026-09-22** (BL 2026-08-31) | 344.8 (**66.3 since BL**) | **HTML5** | both | no | "catapult liftoff, mid-air pickups, boosts, steer, **3D world**" (its description); tags Physics(397), Incremental(446). **A direct browser-native 3D version, 4 days on Full Launch** |
| [Build A Plane](https://www.crazygames.com/game/build-a-plane-xea) | 9.2 | 7,342 | 2026-07-20 (BL 06-25) | 106.4 (78.9 since BL) | Unity 6 | - | no | CrazyGames Originals; build-then-fly sandbox |
| [FlyCraft](https://www.crazygames.com/game/flycraft--crazy-flying-machines) | 9.1 | 506 | 2026-09-22 (BL 09-01) | 101.2 (20.2 since BL) | Defold (2D) | landscape | yes | build a flying machine, fly far, unlock parts |
| [Obby Plane Power Challenge: Fly](https://www.crazygames.com/game/obby-plane-power-challenge-fly) | 9.2 | 22,095 | 2026-01-30 (BL 01-09) | 92.1 (85.0 since BL) | Unity 6 | landscape | no | incremental "fly far", Airplane(35), Idle; has IAP |
| [Cannon Chaos: Silly Shots](https://www.crazygames.com/game/cannon-chaos-silly-shots) | 9.2 | 522 | 2026-09-23 (BL 08-14) | 130.5 (12.1 since BL) | Unity 6 | portrait | yes | aim-and-shoot targets (adjacent, not distance) |
| [Yeetcat](https://www.crazygames.com/game/yeetcat) | 9.1 | 670 | 2026-09-03 (BL 06-15) | 27.9 (6.5 since BL) | HTML5 | landscape | no | One Button, Cannon, launch a cat, upgrades |
| Crazy Plane Landing / Paperly / Base Jump Wing Suit / Build your Rocket | 8.9-9.4 | 1,337-9,061 | 2023-2024 | 1.1-9.7 | Unity | - | yes | older entries |
| Rocket Launch / Launch Idle / Infinite Launch / Boe Wings / Gaz to the Moon / Living Cannon DX | 8.3-9.2 | 50-387 | 2022-2025 | <= 0.6 | Unity/HTML5 | - | - | weak |
| Toss the Turtle | 9.4 | 565 | - | - | Ruffle (Flash) | - | - | only classic left |
| Learn To Fly, Wonder Rocket, Kitten Cannon, Burrito Bison, Burrito Bison: Launcha Libre, Burrito Bison Revenge | - | - | - | - | - | - | - | **not public any more** (pages redirect to category/tag pages) - pass-1 search index was stale |

### Niche C - conveyor colour sort / blast (Marble Sort, This is Blast, Pixel Flow)
| Game | Rating | Votes | Added (BL) | Votes/day (PROXY) | Tech | Orientation | Notes |
|---|---|---|---|---|---|---|---|
| [Pixel Blast](https://www.crazygames.com/game/pixel-blast) | 8.5 | 4,089 | not full-launched (BL 2026-03-16) | **21.1 since BL** | Unity 6 | portrait | This-is-Blast-like (cannons, conveyor) |
| [Color Cube Puzzle](https://www.crazygames.com/game/color-cube-puzzle) | 8.9 | 661 | 2026-06-15 (BL 05-08) | 6.4 (4.7) | HTML5 | portrait | cube conveyors |
| [Pixel Pop](https://www.crazygames.com/game/pixel-pop-thr) | 8.8 | 314 | 2026-03-27 (BL 02-24) | 1.7 (1.5) | HTML5 | portrait | tanks on a loop conveyor |
| [Marble Boom](https://www.crazygames.com/game/marble-boom) | 7.5 | 211 | 2026-07-03 | 2.5 | HTML5 | both | bubble shooter, not a sort |
| Puzzle yardsticks: Hexa Stack 95.7 (HTML5, Originals, 2026-07-31) · Goods Triple Match 3D 39.3 · Conveyor Idle 42.1 (clicker) · Sand Blocks 25.4 · Car OUT! 19.8 | | | | | | | |
| **No Marble-Sort-style game** (marbles dropping onto a circular belt into 3-slot boxes): search API for "marble", "conveyor", "ball sort" and the full Sorting tag (55 games) show none | | | | | | | MEASURED absence |

### Other candidate niches
| Game | Rating | Votes | Added (BL) | Votes/day (PROXY) | Tech | Notes |
|---|---|---|---|---|---|---|
| [Space Waves](https://www.crazygames.com/game/space-waves) | 8.8 | 884,131 | 2024-04-16 | **989** | **Unity 6** | one-button wave; not browser-native |
| [Wave Dash: Geometry Arrow](https://www.crazygames.com/game/wave-dash-geometry-arrow) | 8.6 | 50,344 | **2026-03-16** | **258.2** | Unity 6 | a 2026 Space-Waves-like entry |
| [Hyper Wave Challenge](https://www.crazygames.com/game/hyper-wave-trial) | 8.7 | 29,824 | 2026-01-06 (BL 2025-12-08) | 113 (102.1) | GameMaker (HTML5) | another 2026 entry |
| [Arrow Escape](https://www.crazygames.com/game/arrow-exit-puzzle) | 8.8 | 23,508 | 2026-01-21 | 94.4 | Unity 6 | puzzle; Arrows (Defold) 12.7 |
| [Holey.io Battle Royale](https://www.crazygames.com/game/holey-io-battle-royale) | 8.3 | 98,213 | 2023-08-16 | 86.3 | HTML5 | 2026 hole entries: Voxel Hole 24.6 (17.0 since BL), Mega Hole Attack 21.2; Yumy.io and Black Hole Blitz no longer public |
| Yarn Fever / Thread Sort / Wool Mania | 8.1-9.1 | 637-3,134 | 2025-2026 | 1.9-9.4 | Unity/Defold | weak |
| Race Clicker / Athletic Runners | 8.9-9.0 | 220-225 | 2023-2025 | 0.2-0.5 | - | Run Idle and Idle Racing no longer public |
| Screw / block jam (Unscrew Jam 3D, Toolbox Screw Jam, Block Jam) | 7.7-9.3 | 31-205 | 2024-2025 | <= 0.3 | Unity | weak on CrazyGames despite mobile revenue |

### Hit cohort "5-minute fun" (24 games) re-measured 2026-09-26
Unity mobile ports on top: Count Masters 381.6 · Bridge Race 166.4 · Smash Badminton 119.4 · Sky Riders 118.4 ·
Aquapark.io 103.1 · Stone Grass 85.6 · Pottery Master 54.1. Browser-native (HTML5): Ragdoll Archers 342.3
(since BL) · Cubes 2048.io 113.9 · Slice Master 111.8 · Stellar Swarm 93.6 · Holey.io 86.3 · Paper.io 2 55.6 ·
Draw Climber 54.3. Consistent with the 2026-09-22 snapshot (Slice Master 99,293 votes today vs 101,051 recorded
then: the vote count can go down, so treat single-day values as noisy).

## Observed gameplay (Browser pane / video)
See **Teardowns (MEASURED 2026-09-26)** below. Summary:

| Game | Core loop | First 30 s | Meta | Ad placements seen | Juice | Evidence |
|---|---|---|---|---|---|---|
| Rocket Fling | timed launch (power bar) -> hold boost + pitch -> slide -> result | lands in gameplay, 3 tutorial pills | 3 upgrade cards + booster | x2 claim, 3 "FREE" upgrades, booster "WATCH AD" | distance counter, PERFECT, BOUNCE xN, NEW RECORD | live play, `qa/research/teardown/rocket-fling/` |
| Mob Rush | hold to shoot a crowd through x2/x3 gates, slide to aim, charge a champion, destroy base | title "TAP TO CONTINUE", 3 tutorial pills | coins, levels | none reached (level 1 only) | crowd size, base HP bar | live play (partial), `.../mob-rush/` |
| Splash Sliders | slingshot a floatie, steer, click at ramps | not observed live | Launcher / Float / Income cards + Jump Boost | not in trailer | speed lines, "+4% Speed" | preview video only, `.../splash-sliders/` |
| Bouncemasters | bat a penguin, it bounces off animals for combos | not observed live | not in trailer | not in trailer | OUCH / NOT BAD hit rating, COMBO x13, coin formations | preview video only, `.../bouncemasters/` |

## Teardowns (MEASURED 2026-09-26)
**How captured:**
- Headless Chromium (Playwright, SwiftShader WebGL) opened each game through its CrazyGames page. The game iframe
  was stretched to fill the viewport, and the game was played with scripted mouse and keyboard input.
- Captures: screenshots at key moments, bursts at 0.7-2.5 s intervals, and a session video.
- An SDK hook in the game frame logged `gameplayStart/Stop` and `requestAd` calls. No rewarded or ad button was
  clicked, and no login was used.
- Preview videos come from `videos.crazygames.com`. These are developer trailers: edited, and they may hide ad
  buttons. They are MEASURED as trailers, not as live play.

**Timing caveat:** SwiftShader ran the games at 6-7 fps (at 640x360 and 450x800). Game time runs slower than real
time, so run lengths below are wall-clock under that load, not real play time. UI timings (for example, whether
both buttons exist in the first frame of a result screen) are still valid.

**Could not be driven:**
- Bouncemasters and Splash Sliders load from their own game-files hosts, which the proxy blocks:
  `bouncemasters.game-files.crazygames.com` and `splash-sliders.game-files.crazygames.com`. Those two are
  trailer-only.
- **Skip It!** is hosted on snokido.com and 1games.io, which are blocked (403). A YouTube search found no footage.
- **No stone-skipping game exists on CrazyGames.** The search API for "skip", "stone skipping", "skipping stone",
  "pebble" and "rock skip" returns nothing relevant (`qa/research-cg-search-skip.md`).

Numbers: Splash Sliders 8.9, 1,343 votes, BL 2026-08-11, 70.7/day since Full Launch (2026-09-08) and
**29.2/day since BL**, Unity 6. Bouncemasters (Famobi) 8.8, 36,004 votes, added 2026-06-05, **315.8/day**, HTML5 2D.

### Rocket Fling (live play, 3 runs + 1 upgrade; `qa/research/teardown/rocket-fling/`)
- **Core verb:**
  - *Launch:* tap while a needle sweeping a horizontal bar is inside a striped "PERFECT" box at the right end
    ("TAP AT THE TOP" / "TAP TO CHARGE").
  - *Flight:* hold Space or the flame button to boost (a fuel gauge that drains), and pitch with W/S or the mouse.
    The rocket bounces on the ground ("BOUNCE x2"), then slides to a stop.
  - The player acts during flight (boost, pitch), but ground bounces happen on their own.
- **Look:** flat-shaded low-poly 3D with real-time shadows: green hills, windmills, red farmhouses, dark fences, a
  wooden catapult, an orange rocket. In the trailer, zones change biome (desert, snow, purple) and a
  checkered-flag wall marks a zone end. Everything is primitives. This is the same "profile M" look we plan.
- **HUD:**
  - distance: large yellow outlined number, top centre
  - zone progress bar above it (rocket icon -> checkered flag, with a %)
  - coin pill top-right, sound top-left
  - speedometer dial bottom-left (km/h), round flame boost button bottom-right
  - tutorial pills bottom centre
- **First 30 s (wall-clock):**
  - The first frame is gameplay: the launch pad and power bar, with no menu.
  - Run 1: 81 m (weak launch). The rocket slid along the ground at 24-33 km/h for most of the run. Result screen
    after ~20 s wall-clock.
  - There is no per-second reward: coins are paid only on the result screen (12 / 30 / 22 coins for
    81 / 202 / 153 m).
- **Result / fail flow:** "LANDED" card: distance, "NEW RECORD!" or "48 m SHORT OF 202 m" (a true near-miss),
  stats (peak altitude, top speed, bounces, collected), coins.
  - Two stacked buttons of equal size: **DOUBLE REWARD [video, AD]** (yellow) and **WORKSHOP** (green). Both were
    present in the first captured result frame, so there is no delayed decline.
  - There is **no revive**: the run cannot fail, it only ends.
- **Workshop = home** (the launch pad scene):
  - Three upgrade cards with a star track: **LAUNCHER** (launch speed) 45 -> 58 after one level, **ROCKET**
    (fuel & glide) 70, **INCOME** (coins per run, x1.0) 95.
  - Each card has a permanent **"FREE [AD]"** button above it: 3 rewarded upgrade offers on every visit, with no
    cooldown shown.
  - Left: a **BOOSTER** card ("FLIGHT THRUST LVL 1/10, WATCH AD"), with no coin price visible.
  - "TAP TO FLY", "BEST 202 m", "SIGN IN", "?".
  - The first upgrade needed ~3 runs of coins.
- **Ad surfaces seen:** x2 claim (every result), free upgrade x3 (always visible), booster (start boost, ad only).
  - Not seen: revive, shop cash, try skin, daily.
  - SDK: `gameplayStart` at launch and `gameplayStop` at the result.
  - No `requestAd` (midgame) on run 3, the only run that was hooked, or on the result->workshop->launch
    transitions.
- **Rules to watch:**
  - The booster seems reachable only through an ad (CG-ADS-012; HYPOTHESIS, the card was not clicked).
  - The "FREE [AD]" buttons must hide or work with ads off (CG-ADS-012 / Basic Launch; not verified).
  - The result buttons are compliant: equal size, both shown at once.
- **Weaknesses we can beat:**
  - The first runs are slow and empty (a ground slide at ~30 km/h).
  - Coins come only at the end: no "+1" every second.
  - Ground bounces are passive.
  - The zone goal is far away (0.3-2% after 3 runs).
  - Heavy tutorial text.
  - The claim is x2, not a jackpot.
  - No revive and no collection.

### Mob Rush (live play, level 1 won, level 2 reached; `qa/research/teardown/mob-rush/`)
- **Look:** **3D**, stylised, portrait top-down: a canyon road, a blue cannon at the bottom, a red enemy base at
  the top with an HP bar (50 on L1, 100 on L2), blue x2/x3 gate panels (some slide sideways), red units streaming
  from the base. This settles the pass-2 unknown: it is 3D.
- **Verbs and onboarding:** a title screen "TAP TO CONTINUE" (one tap before play). Then three pills in turn:
  "HOLD TO SHOOT!" -> "SLIDE TO MOVE!" -> "DESTROY THE BASE!".
  - Holding streams units through the gates, where they multiply.
  - A side meter fills -> "RELEASE TO SUMMON CHAMPION" (a big unit).
- **Pacing:** L1 took ~5 min wall-clock at 6 fps. Real length is not measurable here.
- **After L1:** coins 0 -> 100 and a blue counter showing 50, then L2 began. No result or offer screen was
  captured: the transition fell between two captures.
- **Not reached:** the upgrade shop (the description says "earn coins, upgrade your units") and any ad offer.
- **What a new entry must do differently:** Mob Rush is already a 3D, polished, browser-native Mob Control. Our C2
  (Blob Barrage) would need the merge axis to be the visible core, plus landscape support, to avoid being the
  second clone. **Gap claim for niche A: narrowed further** (3D confirmed). This niche is dropped from priority
  since the owner picked C1.

### Splash Sliders (CrazyGames trailer only; `qa/research/teardown/splash-sliders/`)
- **Look:** bright, polished Unity 3D beach: a pink flamingo floatie with a cute egg character, palm trees, tiki
  posts, turquoise pools and channels, inflatable orange ramps, speed lines. "Level 1 - Taki Beach".
- **Launch:** a slingshot between two tiki posts. Drag down, release (camera behind).
- **Flight:** the player acts.
  - Steer left/right.
  - "Click to Boost" on inflatable ramps (a timing click = "jump boost").
  - "+4% Speed" pickups, coins.
  - Speed number on the left (km/h), distance above the floatie, a vertical level-progress bar on the right
    (0-40% seen, checkered flag at the top).
- **Home:** "Click To Slide", upgrade cards at the bottom: **Launcher** 620, **Float** 1,340, **Income** 1,930
  (x3.2, 40% bar). A round **Jump Boost** upgrade (lv 2, 1,500) sits on the right. Coins top-left.
- **Not shown in the trailer:** the result screen, ad offers.
- **Traction:** 29.2 votes/day since BL. Clearly weaker than Bouncemasters, despite the higher production value.

### Bouncemasters (CrazyGames trailer only; `qa/research/teardown/bouncemasters/`)
- **Look:** flat 2D vector, side view: a snowy landscape, blue sky turning to a purple aurora later, icebergs.
- **Launch:** a polar bear swings a bat at a penguin. A hit-quality word follows ("OUCH", "NOT BAD").
- **Flight:**
  - The penguin flies as a fire comet and later bounces off seals and other animals: **COMBO x2 ... x13**.
  - Coin formations in the air ("+1" per coin, "+10" / "+12" bursts), gems, gift boxes, rainbow beams.
- **HUD:**
  - pause top-left
  - coins and gems top-right
  - a trophy progress bar to the record
  - current distance (red pill) against the best (crown pill)
  - "NEW HIGH SCORE" banner
- **Player input during flight:** not verified. The controls text says only "Mouse = interact with the game UI".
- **Not shown:** result, shop, offers.
- **Traction:** **315.8 votes/day over 114 days**, the strongest launch-family signal on CrazyGames. Its hook is
  the combo chain of bounces with coins everywhere, not the upgrades.

### What Skip Legend (C1) must do differently, and the gap claim
| Competitor | Closest overlap with C1 | Skip Legend must |
|---|---|---|
| Rocket Fling | timed launch on a horizontal bar with a striped PERFECT box; 3-card upgrade row (Launcher / Rocket / Income); low-poly 3D look; "LANDED" stats card with a x2 button | **not** use a horizontal power bar with an end PERFECT box (use a sidearm flick or a swinging arm/arc instead: HYPOTHESIS); pay "+1" at every contact from the first second (RF pays only at the end); make level 1's shore always reachable, so run 1 is not a slow slide; end in jackpot bins + x3, not a stats card + x2; show upgrades as objects on the jetty, not a 3-card row |
| Splash Sliders | beach/water theme, a timing click at ramps, Launcher/Float/Income cards, a level-progress bar | avoid beach-floatie and slingshot imagery; keep the tap-on-contact rhythm as *the* verb (SS uses it only at ramps); a different world palette order (pond/river first, no sand) |
| Bouncemasters | bounce chain with COMBO xN, hit-quality words (OUCH / NOT BAD), coin formations in the air, NEW HIGH SCORE | use our own words (PERFECT / GOOD / SPLASH), a streak multiplier shown on the stone trail, not a "COMBO xN" banner; keep duck boings secondary (BM's core is animal bounces); 3D low water camera, not a 2D side view |
| Skip It! | same fantasy (stone skipping, upgrades) | not verifiable (blocked). C1's REPORTED differences stand: SI uses hold-for-power + drag-to-steer, ours is tap-at-every-contact. **NEEDS USER** footage before the concept is final |

**Gap claim for C1 (launch-and-upgrade family):**
- The **theme and verb gap holds**: no stone-skipping game exists on CrazyGames (MEASURED absence). None of the
  three observed launch games makes a per-contact rhythm tap the core verb. Rocket Fling (steer + boost) and
  Splash Sliders (steer + ramp click) were seen; Bouncemasters is not verified.
- **Demand is confirmed**, and the strongest example is the most bounce-centred one: Bouncemasters at 315.8/day,
  against Rocket Fling at 66.3 and Splash Sliders at 29.2 since BL.
- The **look is not a differentiator**: Rocket Fling already has the minimal-poly 3D look. C1 must win on the
  verb, the per-contact payout and the jackpot ending.

## Outside CrazyGames (Poki, YouTube, mobile)
| Signal | Evidence | Label |
|---|---|---|
| "Upgrade a plane" is a YouTube-creator format | `ytsearch20:epic plane evolution gameplay`: 10 of 20 videos >= 100k views, top 3.2M (GrayStillPlays), 1.7M, 1.5M; total 9.0M | MEASURED 2026-09-26 (`qa/research-youtube.md`) |
| Mob Control has YouTube reach | `ytsearch20:mob control gameplay`: 4 of 20 >= 100k, top 5.2M (KuGo), total 6.3M | MEASURED 2026-09-26 |
| Marble Sort has no creator appeal | `ytsearch20:marble sort gameplay`: 0 of 20 >= 100k, all level walkthroughs, max 30k | MEASURED 2026-09-26 |
| CrazyGames entrants have no YouTube footprint yet | "rocket fling crazygames" (results polluted by Rocket League), "mob rush crazygames": nothing about these games | MEASURED 2026-09-26 |
| Poki home grid | Hole.io, Slice Master, Count Control Legends (crowd), Perfect Landing Plane Pilot among 149 slugs | MEASURED 2026-09-26 (pages not analysed) |
| Mob Control still earns | AppMagic hybridcasual Q2 2025 #5 ($6.5M); top-grossing hypercasual 2025 (Innovecs) | REPORTED |
| Launch-and-upgrade alive on mobile | Epic Plane Evolution (Voodoo, 2024-06-11, 12.5M+ downloads, game-solver.com), AppMagic Q2 2025 top 10 | REPORTED |
| Conveyor sort is the 2025-26 mobile trend | Marble Sort 13.7M downloads / $10.8M IAP (NextBigGames 2026-03-28); Marble Sort + Sand Loop $17M+ (AppMagic H1 2026); This is Blast "most iterated game of 2025" (Gamigion) | REPORTED |
| Hole / screw / block-jam / arrows earn big on mobile | Hole.io record installs 2025 (PocketGamer.biz); Color Block Jam $42M, Screwdom $27.1M (Q2 2025); Arrows (Miniclip) 2025 standout | REPORTED |
| Mobile IAP success does not guarantee CrazyGames traction | screw/block-jam titles on CrazyGames all <= 0.3 votes/day; conveyor family best 21/day | MEASURED contrast, 2026-09-26 |

## Ranked candidate mechanics (re-ranked after pass 2)
Ad surfaces: **C** claim x3 · **R** revive · **B** start boost · **$** shop cash · **U** free upgrade · **S** try skin
· **D** daily. Fit = profile M (<= 60k tris, <= 60 draw calls), touch + mouse, runs of 20-90 s.

| # | Mechanic | CrazyGames demand (MEASURED 2026-09-26) | Gap for a browser-native 3D version | Ad surfaces | Build fit | Evidence strength | Change vs pass 1 |
|---|---|---|---|---|---|---|---|
| 1 | **Launch & upgrade for distance** | **Broad and rising**: 2026 entries, votes/day since BL: Obby Plane 85.0, Build A Plane 78.9, Rocket Fling 66.3 (344.8 over its first days of Full Launch, boost-inflated), FlyCraft 20.2; YouTube strongest (10/20 >= 100k) | **Narrowed**: Rocket Fling (HTML5, 3D, catapult + boost + incremental) went Full Launch 2026-09-22. The rest are Unity or 2D; the classic titles are no longer public | 7/7 - best (upgrades are the loop; C every landing; B rocket start; R once per session in flight; $; S; D); 10-40 s runs | Excellent (ramp, boxes, instanced pickups) | **Demand HIGH, gap MEDIUM-LOW** | demand upgraded from REPORTED to MEASURED; "no strong 3D version" **killed** by Rocket Fling |
| 2 | **Crowd cannon push** (Mob Control) | **Highest single signal**: Count Masters 381.6/day (Unity); Mob Rush 104.8/day in its first 26 days (HTML5, portrait) | **Narrowed**: Mob Rush is a browser-native Mob-Control-like (3D confirmed by the 2026-09-26 teardown, portrait only). Otherwise all Unity | 7/7 | Good (InstancedMesh crowd); medium effort (crowd steering, gates) | **Demand HIGH, gap MEDIUM** | demand confirmed; "only Unity" **killed** by Mob Rush (2026-09-01) |
| 3 | **One-button wave dodge** (hold = up, release = down) | **Very high**: Space Waves 989/day (Unity); 2026 imitators still win: Wave Dash 258/day (Unity), Hyper Wave 102/day since BL (GameMaker) | **Open for 3D / three.js**: all three leaders are 2D Unity/GameMaker; late entrants still reach 100+/day | 6/7 (R near-miss revive, B shield start, C, $ skin cash, S, D; U weak) - runs of 5-40 s = many midgame breaks | Excellent | **Demand HIGH, gap MEDIUM**; originality risk (Geometry Dash wave mode) | **new in top 3** (measured numbers) |
| 4 | Conveyor colour-sort (Marble Sort style) | **Weak on CrazyGames**: conveyor family best Pixel Blast 21.1/day since BL (Unity, puzzle); HTML5 entries 1.5-4.7; YouTube weak | **Open**: no Marble-Sort-style game (MEASURED absence) | 6/7 | Good; needs a level generator | **Demand LOW-MEDIUM on CG, gap HIGH** | **dropped from #3**: the mobile trend has not shown up on CrazyGames |
| 5 | Hole swallow with a level goal | Holey.io 86.3/day (2023); 2026 entrants 15-17/day since BL | Crowded; newcomers do not break out | 7/7 | Good | **Medium-low** | confirmed |
| 6 | Tap-away / arrow escape puzzles | Arrow Escape 94.4/day (Unity, 2026-01) | Several clones; puzzle category | 5/7 | Easy | **Low-medium** | slightly up (Arrow Escape) |
| 7 | Yarn / thread sort | 1.9-9.4/day | - | 5/7 | Medium | **Low** | confirmed low |
| 8 | Idle race trainer; screw / block jam | <= 0.5/day; several no longer public | - | 5-6/7 | Easy | **Low** | confirmed low |

Why not the knife-flip / slice mechanic: Slice Master itself (HTML5, 8.6, 111.8/day) is the leader, not a gap;
a close copy risks the clone rule (CG-GAME-007).

## Gaps and opportunities
| Opportunity | Why we believe it (label) | What would disprove it |
|---|---|---|
| **A. Launch & upgrade for distance, with a twist that is not "rocket from a catapult"** (e.g., a different object and launcher, a jackpot of multiplier bins on landing, "evolve" merges of parts) | MEASURED: the busiest arcade niche of 2026 among those checked (3 entries at 66-85/day since BL, plus FlyCraft 20.2), the old classics are gone, and YouTube rewards "upgrade X 1000 times" videos. HYPOTHESIS: a second 3D HTML5 entry with a clearly different fantasy and stronger juice can still win, as the wave niche shows (late clones at 100-258/day) | Rocket Fling's votes/day falls below ~20 within 4 weeks (the niche's appetite was only a new-games boost); or a teardown shows Rocket Fling already covers the twist we pick |
| **B. Crowd cannon push, landscape + portrait, 3D minimal-poly, with a merge axis** (units that pass a gate together merge into bigger units) | MEASURED: Count Masters 381.6/day is the strongest cohort signal; Mob Rush proves an HTML5 Mob-Control-like gets 104.8/day in its first month. HYPOTHESIS: a 3D, both-orientation version with a merge twist is distinct enough | Mob Rush sustains 100+/day and a teardown shows it is already 3D and polished (then we would be the clone); or a third HTML5 entry appears |
| **C. 3D one-button wave dodge** (three.js, minimal-poly, our own theme and obstacle vocabulary) | MEASURED: Space Waves 989/day and 2026 imitators at 102-258/day, all 2D and Unity/GameMaker. HYPOTHESIS: a 3D readable take is new on CrazyGames and gets the "rewarded revive after a near-miss" desire of a hard skill game | Originality review judges it a Geometry Dash / Space Waves clone; or the ad surfaces (no upgrade loop) give too few wanted offers in playtests |

**Recommendation for the concept phase (HYPOTHESIS):** take A, B and C to one-page concepts.
- **A** has the best ad map and the simplest build. It now needs the strongest twist, because Rocket Fling is 4 days old.
- **B** has the strongest single demand number.
- **C** has the widest open gap for a 3D build, but the weakest money design and the highest clone risk.

Re-measure Rocket Fling and Mob Rush around 2026-10-10: their votes/day after the new-game boost decides A vs B.

## Could not verify / need from the user
**Could not verify (2026-09-26):**
- Live play of Bouncemasters and Splash Sliders: their game-files hosts are blocked (`bouncemasters.game-files.crazygames.com`,
  `splash-sliders.game-files.crazygames.com`). Only their trailers were studied.
- Skip It! (snokido.com, 1games.io blocked; no YouTube footage found).
- Real-time timings: the teardowns ran at 6-7 fps (software WebGL), so run lengths are wall-clock under load.
- Rocket Fling: whether the booster has any non-ad path, and when (or if) it requests midgames.
- Mob Rush: its result, offer and upgrade screens (level 1 was won, but the transition was not captured).
- Plays, playtime, retention and revenue: never public; votes/day is only a PROXY.
- Mobile numbers: still REPORTED via search summaries (appmagic.rocks, gamigion.com, pocketgamer.biz, mobidictum.com
  blocked in pass 1).
- Poki game pages (only the home grid was read); kids.poki.com blocked.

**NEEDS USER:**
1. **Skip It!** (snokido.com/game/skip-it): a 60 s screen recording of one throw, the result screen and the upgrade
   screen. It is the only direct stone-skipping competitor, and nothing about it could be observed here.
2. **Bouncemasters**: does the player tap during flight (at bounces)? A 30 s recording, or one sentence from playing
   it. This decides whether our "tap at every contact" verb is new on CrazyGames.
3. Optional, so Claude can play them itself: allow `bouncemasters.game-files.crazygames.com` and
   `splash-sliders.game-files.crazygames.com` in Network access. Each CrazyGames game loads from its own
   `<slug>.game-files.crazygames.com` host.
