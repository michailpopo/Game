# Research - Working Title

Date: 2026-09-26 · Package: WP-00 · Researcher: game-market-researcher

**Question:** which one-verb hypercasual mechanic should a new, simple, minimal-poly three.js single-player
game on CrazyGames use, so that it (a) has proven demand, (b) is not already well served by browser-native
games on CrazyGames, and (c) naturally carries many *wanted* rewarded offers (claim x3, revive, start boost,
shop cash, free upgrade, try skin, daily) plus midgames at short natural breaks?
**Decision it informs:** the concept shortlist for phase 2 (CONCEPTS.md).

Labels (mandatory on every claim): **MEASURED** (fetched/observed, cite) · **PROXY** (stand-in, say for what)
· **REPORTED** (third party, name them) · **HYPOTHESIS** (ours, say what would test it).

### Evidence limits of this pass (read first)
- The cloud container's egress policy blocks `crazygames.com` (www, api, docs), `poki.com`, `youtube.com`, and
  also every other research site tested on 2026-09-26 (`appmagic.rocks`, `gamigion.com`, `mobidictum.com`,
  `pocketgamer.biz`, `mobilegamer.biz`, `sensortower.com`, `play.google.com`, `apps.apple.com`, `itch.io`,
  `wikipedia.org`, `reddit.com`). WebFetch returned `EGRESS_BLOCKED` for crazygames.com and the three analytics
  sites. Only GitHub answered.
- So the only working instrument was **WebSearch** (result titles, URLs and a search-engine summary of each page).
  - Mobile numbers below are **REPORTED via search summary**: the underlying article was *not* opened, so a
    figure may be misquoted. Treat them as order-of-magnitude.
  - "Which CrazyGames games exist in a niche" is a **PROXY** (search-index hits on `crazygames.com/game/...`)
    for the niche's real size: the index is incomplete and can be stale, and it carries **no rating, votes,
    date, tech or tag gamesCount**. Absence from search is weak evidence of absence.
- The only CrazyGames **MEASURED** numbers are the 2026-09-22 snapshot already in the skill
  (`references/design/hypercasual-hits.md`), reused with that date.

## Sources checked
| Source | URL / command | Date | What it gave |
|---|---|---|---|
| Skill reference (MEASURED earlier) | `references/design/hypercasual-hits.md` s.1 (cg-game.mjs + Browser, 2026-09-22) | 2026-09-22 | Votes/day of Slice Master, Cubes 2048.io and the "5-minute fun" / "One Button" cohorts |
| Skill reference | `references/crazygames/launch-and-metrics.md` (CrazyGames docs read 2026-09-11) | 2026-09-11 | Genre playtime / D1 / impressions per play |
| WebFetch test | `https://www.crazygames.com/game/slice-master` | 2026-09-26 | `EGRESS_BLOCKED` |
| curl test of 13 research hosts | proxy status `recentRelayFailures` | 2026-09-26 | only github.com reachable |
| AppMagic Top 10 Hybridcasual Q2 2025 (via GamerBraves / gamedevreports summaries) | https://gamedevreports.substack.com/p/appmagic-top-10-hybrid-casual-games · https://www.gamerbraves.com/appmagic-reveals-top-10-hybridcasual-games-in-q2-2025/ | 2026-09-26 | Top 10 by revenue: Color Block Jam, Screwdom, All in Hole, Pocket Champs, Mob Control, Hole People, Screw Sort Puzzle, Tower War, Epic Plane Evolution, Knit Out |
| AppMagic Top 10 Hybridcasual Q3 2025 | https://appmagic.rocks/blog/q3hybrid2025 · https://www.gamerbraves.com/appmagic-reveals-top-10-hybridcasual-games-in-q3-2025-and-the-innovations-behind-them/ | 2026-09-26 | Puzzle >60% of hybridcasual revenue in Q3 2025; Screwdom, Coin Sort named |
| AppMagic Casual Games Report H1 2026 (via summaries) | https://appmagic.rocks/research/casual-report-H12026/ · https://www.pocketgamer.biz/puzzle-accounts-for-44-of-casual-mobile-earnings-in-h1-2026/ | 2026-09-26 | Screw Jam, Color Block Jam lead hybridcasual; Marble Sort + Sand Loop (Voodoo) $17M+ IAP; Point Out: Color Escape (Lion) ~$8M; sort revenue tripled; >2,000 block-puzzle releases |
| Gamigion "These 9 Hypercasual Games stood out in 2025" | https://www.gamigion.com/these-9-hypercasual-games-stood-out-in-2025/ | 2026-09-26 | Arrows (Miniclip), Knit Out (Rollic), Wiggle Escape, This is Blast (Voodoo, "most iterated game of the year"), Cook Sort, XP Hero, ... |
| Gamigion "Voodoo's new big three" | https://www.gamigion.com/voodoos-new-big-three-castle-busters-marble-sort-sand-loop/ | 2026-09-26 | Castle Busters, Marble Sort, Sand Loop |
| NextBigGames on Marble Sort | https://nextbiggames.com/2026/03/28/marble-sort-by-voodoo-conveyor-puzzle-scaling/ | 2026-09-26 | 13.7M lifetime downloads, $10.8M IAP; tap marbles onto a circular conveyor into 3-slot colour boxes |
| PocketGamer.biz most downloaded 2025 | https://www.pocketgamer.biz/the-most-downloaded-mobile-games-of-2025/ | 2026-09-26 | Block Blast #1 (356.2M); Hole.io had a record install year in 2025 |
| Innovecs "Hyper-casual games in 2026" | https://www.innovecsgames.com/blog/hyper-casual-games/ | 2026-09-26 | Mob Control and Pocket Champs among top-grossing hypercasual 2025; Voodoo moved teams off pure hypercasual in March 2026 |
| Epic Plane Evolution store/guide pages | https://game-solver.com/epic-plane-evolution/ · https://apps.apple.com/us/app/epic-plane-evolution/id6504122823 | 2026-09-26 | Voodoo, launched 2024-06-11, 12.5M+ downloads; slingshot launch + in-flight pitch + upgrades |
| Castle Busters | https://www.appbrain.com/app/castle-busters/com.epicoro.castleclashers | 2026-09-26 | 16M downloads; real-time 1v1 PvP (out of scope: multiplayer) |
| Pocket Champs | https://naavik.co/deep-dives/evolution-of-hybridcasual-deepdive/ · https://play.google.com/store/apps/details?id=com.pocketchamps.game | 2026-09-26 | idle racing: train champ, upgrade gadgets, race bots/players |
| 10 WebSearches restricted to crazygames.com | queries per niche (arrows, pixel blast, hole, yarn, mob/crowd, plane/launch, screw/block jam, marble/sand, idle race, wave) | 2026-09-26 | competitor names + URLs per niche (PROXY for saturation) |

## Competitors on CrazyGames
**MEASURED 2026-09-22** (reused from `hypercasual-hits.md`; cg-game.mjs; votes/day = PROXY for traction, compare within category):

| Game | Rating | Votes | Added | Votes/day (PROXY) | Tech | Orientation | Mobile port | Tags (gamesCount) |
|---|---|---|---|---|---|---|---|---|
| Slice Master | 8.6 | 101,051 | 2024-04-22 | 114 | HTML5 (iframe) | n/r | n/r | One Button, Mobile, 5-minute fun (24), Avoid, 3D |
| Cubes 2048.io | 8.2 | 156,646 | 2022-12-19 | 114 | HTML5 (iframe) | n/r | n/r | Mobile, 5-minute fun (24), 3D, Top-Down, Arena |
| Count Masters (5-minute fun) | n/r | n/r | n/r | **392** | Unity | n/r | yes (Unity mobile port) | 5-minute fun |
| Bridge Race / Smash Badminton / Sky Riders / Aquapark.io / Stone Grass | n/r | n/r | n/r | 172 / 120 / 119 / 105 / 85 | Unity | n/r | yes | 5-minute fun |
| Holey.io Battle Royale / Stellar Swarm / Paper.io 2 / Draw Climber | n/r | n/r | Stellar Swarm 2026-04-09 | 86 / 95 / 57 / 56 | browser-native | Stellar Swarm portrait | n/r | 5-minute fun |
| Space Waves | n/r | n/r | n/r | **1,010** (outlier) | n/r | n/r | n/r | One Button (86) |

n/r = not recorded in the reference.

**Found 2026-09-26 by search only - NOT measured** (page existence = PROXY for niche size; ratings, votes, dates,
tech and tags could not be fetched because crazygames.com is blocked):

| Niche | CrazyGames games found (slug) |
|---|---|
| Crowd / gates / cannon push | Mob Rush (`mob-rush`, the only Mob-Control-like hit), Count Masters: Stickman Games, Stickman Crowd Fight (`cartoon-crowd-clash`), Man Runner 2048, Merge Cannon: Number Blast |
| Launch & upgrade for distance | Learn To Fly, Toss the Turtle, Kitten Cannon, Burrito Bison, Burrito Bison: Launcha Libre, Burrito Bison Revenge, Yeetcat, Wonder Rocket, FlyCraft, Obby Plane Power Challenge: Fly, Boe Wings |
| Conveyor colour blast / sort | Pixel Blast (`pixel-blast`, cannons + conveyor, This-is-Blast-like), Pixel Pop (`pixel-pop-thr`, tanks on a loop conveyor), Color Cube Puzzle (cube conveyors); sand: Sand Blocks, SandTrix; tube sort: Bubble Sorting, Sort It, Hexa Sort. **No Marble-Sort-style (marbles falling onto a circular belt into 3-slot boxes) found.** |
| Hole swallow | Holey.io Battle Royale, Voxel Hole: Black Hole, Yumy.io, Mega Hole Attack, Black Hole Blitz, Vortex.io, Color Hole, Stickhole.io |
| Arrow / tap-away escape | Arrow Escape: Puzzle, Arrow Escape (`arrow-exit-puzzle`), Arrows (`arrows-bmj`), Arrow Slide Puzzle, ARROW, Unpuzzle: Tap Away, Tap Out: Block Escape, Tap 3D Wood Block Away, Tape Escape |
| Screw / block jam | Toolbox Screw Jam Puzzle, Wood Screw: Bolts Puzzle, Screw Out: Bolts and Nuts, Unscrew Jam 3D, Get a Screw: 3D Puzzle!, Nuts Puzzle: Sort By Color, Color Nuts & Bolts Puzzle, Screw Sorting, Block Puzzle Slide - Block Jam, Wood Blocks Jam |
| Yarn / thread | Yarn Fever! Unravel Puzzle, Wool Mania - Sort Puzzle 3D, Yarnglen, Thread Fever |
| Idle race / trainer | Run Idle, Race Clicker, Race Clicker: Tap Tap Game, Athletic Runners: Idle Clicker, Idle Racing, Idle Clicker Runner |
| One-button wave | Space Waves, Wave Dash: Geometry Arrow, Hyper Wave Challenge, Geometry Dash Subzero / Meltdown / Online |

## Observed gameplay (Browser pane / video)
No new observation possible this pass (no Browser pane; CrazyGames and YouTube blocked). The two existing
teardowns remain the reference: Slice Master and Cubes 2048.io, `hypercasual-hits.md` section 2 (MEASURED from
the user's screen recordings, 2026-09-22).

| Game | Core loop | First 30 s | Meta | Ad placements seen | Juice worth noting | Evidence |
|---|---|---|---|---|---|---|
| Mob Rush, Pixel Blast, Learn To Fly, Toss the Turtle, Yeetcat | not observed | - | - | - | - | NEEDS USER (see bottom) |

## Outside CrazyGames (Poki, YouTube, mobile)
| Signal | Evidence | Label |
|---|---|---|
| Pure hypercasual downloads still grow; money moved to hybridcasual | ~22B hypercasual installs in 2025, only segment growing downloads; hybridcasual IAP +20% to $4.2B (Innovecs / Genzopia summaries). Voodoo moved teams off pure hypercasual in March 2026 (Innovecs). | REPORTED (search summary) |
| Puzzle dominates hybridcasual money | >60% of hybridcasual revenue in Q3 2025 (AppMagic via GamerBraves); puzzle 44% of casual IAP in H1 2026 (AppMagic via PocketGamer.biz) | REPORTED |
| **Conveyor colour-sort/blast is the 2025-26 rising format** | This is Blast "most iterated game of 2025" (Gamigion); Marble Sort 13.7M downloads / $10.8M IAP (NextBigGames 2026-03-28); Marble Sort + Sand Loop $17M+ IAP, Voodoo's "new big three" (AppMagic H1 2026, Gamigion) | REPORTED |
| **Mob Control (crowd cannon push) still earns** | #5 in AppMagic hybridcasual Q2 2025 top 10 ($6.5M); named top-grossing hypercasual 2025 (Innovecs) | REPORTED |
| **Launch-and-upgrade is alive on mobile** | Epic Plane Evolution (Voodoo, 2024-06-11, 12.5M+ downloads, game-solver.com) in AppMagic hybridcasual Q2 2025 top 10 | REPORTED |
| Hole swallow keeps pulling installs | Hole.io record install year 2025 (PocketGamer.biz); All in Hole ($22.3M) and Hole People in Q2 2025 top 10 (AppMagic) | REPORTED |
| Screw / block jam / arrows = biggest puzzle earners | Color Block Jam ($42M, 21.8M installs, Q2 2025), Screwdom ($27.1M), Screw Jam (H1 2026); Arrows (Miniclip) 2025 standout; Point Out: Color Escape ~$8M | REPORTED |
| Idle race trainer | Pocket Champs #4 in Q2 2025 top 10 ($8.2M), top-grossing hypercasual 2025 | REPORTED |
| Numbers vary by source | Block Blast 2025 downloads: 356.2M (PocketGamer.biz) vs 368M (Innovecs) | REPORTED - shows the error margin |
| Mobile revenue is IAP-heavy; CrazyGames is ad revenue | the IAP figures show demand for the *mechanic*, not ad yield on the web | HYPOTHESIS (the ad yield is what the Basic Launch would test) |

## Ranked candidate mechanics (5-8), with evidence strength
Ad surfaces (monetization playbook): **C** claim x3 · **R** revive · **B** start boost · **$** shop cash ·
**U** free upgrade · **S** try skin · **D** daily. "Natural" = the surface exists because of the loop, not bolted on.
Fit = profile M (<= 60k tris, <= 60 draw calls), touch + mouse, runs of 20-90 s.

| # | Mechanic (one verb) | Mobile demand | CrazyGames gap | Ad surfaces natural | Build fit (three.js, profile M) | Evidence strength |
|---|---|---|---|---|---|---|
| 1 | **Crowd cannon push** (hold/drag to aim a cannon; units stream through x2/+10 gates and push into an enemy base) - Mob Control family | Strong - REPORTED (AppMagic Q2 2025 #5; top-grossing 2025) | Adjacent crowd-runner Count Masters is the **top of the 5-minute-fun cohort at 392 votes/day** and is a Unity port - MEASURED 2026-09-22. Only one Mob-Control-like game found (Mob Rush) - PROXY | 7/7: C at base destroyed; R "+50 units" once when your base is about to fall; B "start with a giant / double cannon"; U cannon rate, unit HP; $; S unit skin; D | Good: units = one InstancedMesh of low-poly capsules (1-2 draw calls, ~200 x 80 tris = 16k); gates = quads + canvas text; steering without physics engine. Medium effort (crowd steering, gate math) | **Medium-high** (adjacent MEASURED CG demand + REPORTED mobile; direct gap PROXY only) |
| 2 | **Launch & upgrade for distance** (pull-release launch, hold to pitch; land in x-multiplier bins; spend coins on upgrades) - Epic Plane Evolution / Learn to Fly family | Medium-strong - REPORTED (EPE 12.5M+ dl, Q2 2025 top 10) | Niche exists on CG (11 titles found) but the names are classic 2D launch games (Learn To Fly, Toss the Turtle, Kitten Cannon, Burrito Bison); only Yeetcat / Wonder Rocket / Obby Plane look newer - PROXY; "mostly old 2D, no strong 3D minimal-poly take" is HYPOTHESIS (kill it if cg-game.mjs shows a recent 3D HTML5 hit with high votes/day) | **7/7, best fit of all**: C every landing; U is the core loop (cooldown free upgrade); B "rocket start"; R "second wind" once mid-flight; $; S plane/character; D. Runs 10-40 s = many natural breaks for midgames | Excellent: ramp, plane from boxes, instanced coins/rings, endless terrain strips; lowest build risk | **Medium** (mobile REPORTED; CG demand unmeasured) |
| 3 | **Conveyor colour-sort physics toy** (tap a tray, marbles fall on a circular belt into 3-slot colour boxes) - Marble Sort / Sand Loop / This is Blast family | Strong and **newest** - REPORTED (13.7M dl, $17M+ with Sand Loop, 2026 "fastest-scaling") | Blast variant already on CG (Pixel Blast, Pixel Pop); **no Marble-Sort-style game found** - PROXY (search absence only) | 6/7: R "+1 slot / clear the belt" at the jam (very high desire); B booster before a level; C at level end; $; S marble/box theme; D. U weak | Good: instanced spheres (1 draw call), belt = torus/boxes; physics can be faked on a path (no engine). Needs a level generator (~50+ levels) = medium effort | **Medium** (strong recent mobile signal; CG gap unverified; it is a puzzle, less "hypercasual action") |
| 4 | Hole swallow with a level goal (All in Hole / Hole People twist) | Strong - REPORTED | Crowded: 8 hole games found incl. Holey.io (86 votes/day, browser-native, MEASURED 2026-09-22) - PROXY | 7/7 (B "start bigger" is proven by Cubes 2048.io's x16) | Good: fake fall via scale + sink, instanced props | **Medium-low** (demand yes, gap no; needs a strong twist) |
| 5 | Idle race trainer (tap to train, race bots, upgrade gadgets) - Pocket Champs family | Medium - REPORTED | Moderate: 6 clicker/idle race games found - PROXY | 6/7 (U, C, B natural; R weak) | Good, but playtime depends on long upgrade content | **Low-medium** |
| 6 | One-button wave dodge (hold = up, release = down) | CG: Space Waves 1,010 votes/day - MEASURED 2026-09-22 | Crowded around one dominant leader + 5 Geometry-Dash-likes - PROXY | 4/7 (R, C, S, D; U/B/$ fight the skill loop) | Excellent | **Low-medium** (huge demand, but a winner exists and ad surfaces are thin) |
| 7 | Yarn unravel / thread sort - Knit Out family | Medium - REPORTED (Q2 2025 top 10, 2025 standout) | 4 yarn games found - PROXY | 5/7 | Medium (thread rendering is fiddly in minimal-poly) | **Low-medium** |
| 8 | Tap-away escape / screw / block-jam puzzles (Arrows, Screw Jam, Color Block Jam) | Very strong - REPORTED | **Saturated**: 9 arrow/tap-away + 10 screw/block-jam games found - PROXY | 5/7 | Easy | **Low** (the bar and the crowd are both high; not hypercasual action) |

Why the knife-flip / slice mechanic is not on the list: Slice Master itself is browser-native, 8.6 with
114 votes/day (MEASURED 2026-09-22) - the reference, not a gap; a close copy risks the clone rule (CG-GAME-007).

## Gaps and opportunities
| Opportunity | Why we believe it (label) | What would disprove it |
|---|---|---|
| **A. Browser-native, minimal-poly crowd-cannon push** with a merge twist (units that collide after a gate merge into a bigger unit - the "combine two loops" move) | Count Masters is the strongest 5-minute-fun signal on CG (392 votes/day, Unity port, MEASURED 2026-09-22); Mob Control still top 10 on mobile (REPORTED); only one Mob-Control-like game found on CG (PROXY); a 1-5 MB three.js build loads faster than Unity ports (HYPOTHESIS that this lifts conversion) | cg-game.mjs shows Mob Rush (or another Mob-Control-like) with high votes/day and a recent date; or `/t/cannon` + `/t/crowd` hold several strong HTML5 versions |
| **B. 3D launch-and-upgrade with x-multiplier landing bins** (Slice-Master-style jackpot at the end of every 10-40 s flight) | The loop *is* the ad map: every run ends in a count-up (x3), upgrades are the goal (free upgrade, shop cash), boosts are obvious (rocket start) - HYPOTHESIS strongly supported by the playbook; EPE proves current mobile demand (REPORTED); CG niche exists but the found titles look like older 2D games (PROXY) | cg-game.mjs shows a recent 3D HTML5 launch game with strong votes/day; or the older titles (Learn To Fly etc.) show very high votes/day, meaning the bar is set by a loved classic |
| **C. Marble-Sort-style conveyor physics toy**, minimal-poly, short levels | Newest proven mobile format (REPORTED 2026); no Marble-Sort-style game surfaced on CG (PROXY); the jam moment creates the most wanted revive offer ("+1 slot"); puzzle has CG's highest published rewarded impressions per play (4.2) and playtime (21 min) (CrazyGames docs, MEASURED 2026-09-11) | A search of CG in the Browser for "marble", "conveyor", "sort" shows several such games; or Pixel Blast / Pixel Pop show low votes/day (the conveyor family does not travel to web) |

**Recommendation for the concept phase (HYPOTHESIS):** develop A, B and C to one-page concepts; B is the
lowest build risk and the cleanest ad map, A has the strongest measured CrazyGames demand signal, C is the
freshest trend. Run the three cg-game.mjs checks below before committing - they can move the ranking.

## Could not verify / need from the user
**Could not verify (blocked on 2026-09-26):**
- Rating, votes, addedOn, technology (HTML5 vs Unity), tags and gamesCount of every competitor found by
  search this pass (crazygames.com blocked for scripts and WebFetch).
- Whether a Marble-Sort-style or a recent 3D launch-and-upgrade game exists on CG (search absence only).
- Poki's catalogue for the same niches (poki.com blocked); YouTube demand and footage (youtube.com blocked).
- Every mobile number: read from search summaries, the articles themselves could not be opened.
- Whether Epic Plane Evolution and Mob Control still rank in 2026 (latest ranked list seen is Q2 2025).

**NEEDS USER:**
1. Run on your own PC (your network is not blocked) and paste the output - it turns the PROXY rows into MEASURED:
   `node <skill>/scripts/research/cg-game.mjs mob-rush count-masters-stickman-games cartoon-crowd-clash man-runner-2048 learn-to-fly toss-the-turtle kitten-cannon burrito-bison-launcha-libre yeetcat wonder-rocket flycraft--crazy-flying-machines pixel-blast pixel-pop-thr color-cube-puzzle voxel-hole-black-hole-game --md`
2. Screenshots (or copied lists) of CrazyGames search for "marble", "conveyor", "launch" and of the tag pages
   `/t/cannon`, `/t/upgrade`, `/t/sorting` (game count + first rows).
3. A 30-60 s screen recording or YouTube link each of Mob Control, Epic Plane Evolution and Marble Sort gameplay
   (first run, first fail, first ad offer) for teardowns.
4. Optional, for future research in the cloud: in the environment's settings (cloud environment menu in the
   session title bar -> Edit -> Network access) allow `www.crazygames.com`, `api.crazygames.com`, `poki.com`,
   `www.youtube.com` (or pick a broader access level).
