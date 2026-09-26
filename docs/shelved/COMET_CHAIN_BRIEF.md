# Game brief - Comet Chain

Status: Gate 1 passed 2026-09-26. The owner picked R1 Comet Chain (docs/CONCEPTS.md "Round 2 decision") and kept the
title. Bots are labelled by the mode name "Offline Arena" only. Brief v1 for an upload-ready v1 this session.
Last updated: 2026-09-26 · Author: game-concept-designer · The engine is the theme-neutral merge-snake core in
`src/game/` (`ARENA` in `src/config.js`); every rule below names the config key it sets or the rule it adds.

## One-line pitch
Steer a comet through a pastel nebula, swallow stardust and smaller comets, and fuse equal planets into ever bigger
worlds, from pebble to sun. Every round lasts 90 seconds, and your rank at the bell pays out.

## Loops
| Loop | Length | Description (verbs) |
|---|---|---|
| Core | 0.3-5 s | **steer** (mouse / touch joystick / WASD) toward stardust -> **eat** (+value) -> equal planets **fuse** and evolve to the next world (pebble -> moon -> ice world ...) -> **swallow** comets whose head is smaller, **dodge** bigger ones, **boost** to chase or escape |
| Session | 90 s rounds, ~100 s with the result | round starts on one tap -> grow and fight -> die = respawn in 2 s with a starter chain, the clock keeps running -> last 15 s golden finale (stardust worth 2x) -> at 0:00 rank by chain total -> podium payout (x5 / x3 / x2 / x1) -> Claim or Claim x3 -> upgrade / shop -> next round |
| Meta | days | coins -> 3 upgrades (Start size, Magnet, Boost tank) + 12 trail skins; arena tier 1-20 adapts to results; best rank and biggest world reached; daily gift with a forgiving streak |

## First 30 seconds (beat by beat, cold start)
| Time | What the player sees | What they do | Feedback |
|---|---|---|---|
| 0-2 s | The live arena is the home. Pastel nebula, 12 comets already roaming and eating, header "OFFLINE ARENA". Your small comet (moon head + pebble) circles in the centre. A big PLAY button and a device hint (mouse icon / finger icon) | - | ambient twinkle |
| ~2 s | - | one tap/click on PLAY (<= 1 click, CG-GAME-001) | round clock ring "1:30" starts. Desktop: pointer lock + a custom cursor ring. Pill "Move to steer" |
| 2-4 s | Stardust within reach (the engine's food floor keeps >= 14 pickups within 13 u) | steer onto a pebble | **first "+2" by ~3 s**, tick sound, the chain gains a pebble |
| 4-8 s | - | eat another pebble | **first fusion**: 2 pebbles snap into a moon (pop, morph, flash). The leaderboard slice moves |
| 8-20 s | A smaller comet (a pebble head, placed by the engine's `stageEncounter` on round 1) crosses nearby | steer into it | "Swallowed Kiwi!" in the kill feed, its planets burst into stardust, you vacuum them up. Fusion cascade to an ice world |
| 20-25 s | A bigger comet appears with a red rim | turn away | pill "Hold click / Space to boost" (touch: the boost button pulses) |
| 25-30 s | Leaderboard slice "OFFLINE ARENA · you #4 of 13" | keep eating | rank ticks up. The clock ring drains. |

No ad before the third round has finished (the first midgame can come after ~5 min, CrazyGames guidance).

## Controls
| Device | Input | Action |
|---|---|---|
| Desktop keyboard (physical keys, `KeyboardEvent.code`) | `KeyW/KeyA/KeyS/KeyD` and arrows = 8-way screen-relative direction (engine `hasDir`); `Space` or `ShiftLeft` = boost (hold); `KeyP` = pause / release pointer; `Tab` = release pointer; `KeyM` = mute | steer, boost, pause |
| Mouse | After PLAY: **pointer lock** (requested on the PLAY click, never before a user gesture). Mouse movement moves a **virtual cursor ring** drawn in the arena, clamped to 6 u around the head, and the comet steers toward it. **Hold left button** = boost. Unlock: `P`/`Tab`, or the browser's native Escape (never bound by the game). On unlock the round pauses with a "Click to resume" overlay. Menus (result, shop, upgrades) always run unlocked with the normal cursor. | steer, boost |
| Touch | A **virtual joystick** appears where the first finger lands (left 70% of the screen); drag direction = heading. **Boost** = a second finger anywhere, or the round boost button bottom-right (72 px, inside the safe area). `touch-action: none`, `user-select: none`. | steer, boost |

**Mouse-control rule check (CG-QUAL-008): yes.** The comet follows mouse gestures in a top view, so:
- the pointer is locked and confined during the round;
- a custom pointer (the cursor ring) is shown;
- unlock shortcuts exist (P, Tab, native Escape);
- on-screen buttons stay keyboard-accessible (P pause, M mute) and become clickable whenever the pointer is unlocked.

`project.json` `mouse-gesture = true`.

## Round rules (numbers -> `ARENA`)
- **Round:** `round.mode = "timed"`, `round.durationSec = 90`. The round ends at 0:00 with phase `won` for everyone
  alive; the player is ranked even if dead at that moment (by the mass they died with).
- **Respawn (new rule):**
  - When the player's head is eaten, the round continues. After `round.respawnSec = 2` the player respawns at a safe
    spot with `round.respawnMass = 14` (chain 8-4-2) and `snake.protectSec = 2` (blinking, cannot eat or be eaten).
  - The dropped chain scatters as stardust for everyone.
  - Bots respawn as today (`bots.respawnSec = 2.5`).
- **Rank:** by chain total (mass) at 0:00 among the player + 12 bots (`playerRank` / `standings`). Ties go to the
  bigger head, then the earlier reach.
- **Golden finale (new rule):** at 0:15 left, fresh stardust spawns from `round.finaleWeights = [[4,0.6],[8,0.3],[16,0.1]]`
  (double the normal `loose.weights`). Gold tint, the clock turns gold, and ticks speed up.
- **Contact:** the engine default `contact.rule = "headVsAny"`: a head touching any block of another comet compares
  heads; the bigger eats, and equal heads bounce.
- **Arena:** `arena.shape = "circle"`, `halfSize = 40`. The edge is an asteroid belt, `wall = "block"` (slide along
  it, no death).
- **Bot names:** `bots.prefix = ""`, owner decision. Honesty comes from the mode label instead: "OFFLINE ARENA" is shown
  on the home, the round HUD header, the leaderboard slice header, the kill feed's first line and the podium ("Offline
  Arena results"). Remove "Comet" from `bots.names` (it is the player's fantasy).

## Bot AI difficulty ramp (numbers -> `ARENA.bots`)
The **arena tier** (1-20) adapts to results:
- +1 after a top-3 finish;
- -1 after rank 8 or worse (floor 1);
- unchanged otherwise.

It is saved, and it is passed to `createSim({ level: tier })`. Tiers keep the podium reachable for new players and
harder for good ones (bots only; no real players are affected).

| Tier | `aggression` (chase chance) | bot `startMass` pool | `capStart` | `capDoubleSec` | `capVsPlayer` | `thinkSec` | design target: median human rank |
|---|---|---|---|---|---|---|---|
| 1 | 0.30 | [6, 10, 14] | 8 | 60 | 1.5 | 0.30 | #2-3 (most first rounds end on the podium) |
| 5 | 0.40 | [6, 10, 14, 22, 30] | 8 | 50 | 2 | 0.24 | #3-4 |
| 10 | 0.525 | [10, 14, 22, 30, 46] | 16 | 45 | 2 | 0.20 | #4-5 |
| 20 | 0.775 | [14, 22, 30, 46, 62] | 32 | 40 | 2.5 | 0.18 | #5-6 |

Formulas:
- `aggression = 0.30 + 0.025 x (tier - 1)`, which replaces today's 0.45 + 0.07/level (that would pass 1.0 by tier 9).
- The other columns interpolate linearly between the rows.

**Measured ceiling:** the engine's own autopilot plays with perfect information and is superhuman. Driven for 12 rounds
of 90 s per tier in Node on 2026-09-26, it ended with a median mass of 2,100-3,500 and median rank #1-2. Human numbers
come from the first playtest; these tier numbers are the starting point.

## The planet ladder (the visible evolve axis; `values.base = 2`)
The size comes from the engine's `blockSize`: `1.0 + 0.08 x (step - 1)` world units, max 2.3. The value is a small
badge under the planet: >= 12 px at 800x450, white with a dark outline. There are no numbered cubes and no dark grid.

| Step | Value | World | Colour (body) | Size (u) | Ring / glow | Geometry |
|---|---|---|---|---|---|---|
| 1 | 2 | Pebble | `#b8b2c9` | 1.00 | - | `Icosahedron(r,0)` 20 tris |
| 2 | 4 | Moon | `#f1e9d2` | 1.08 | - | `Icosahedron(r,1)` 80 |
| 3 | 8 | Ice world | `#9fe7ff` | 1.16 | - | 80 |
| 4 | 16 | Desert world | `#ffc27a` | 1.24 | - | 80 |
| 5 | 32 | Ocean world | `#3fb6ff` | 1.32 | - | 80 |
| 6 | 64 | Jungle world | `#6fdc6a` | 1.40 | - | 80 |
| 7 | 128 | Lava world | `#ff6b4a` (emissive 0.3) | 1.48 | faint glow | 80 + halo quad 2 |
| 8 | 256 | Ringed giant | `#c9a0ff` | 1.56 | ring `#ffe8a3` | 80 + `Torus(6x16)` 192 |
| 9 | 512 | Storm giant | `#7a8cff` | 1.64 | ring `#d6f1ff` | 80 + 192 |
| 10 | 1,024 | Sun | `#ffd23f` (emissive) | 1.72 | glow halo | 80 + 2 |
| 11 | 2,048 | Red giant | `#ff5a5f` (emissive) | 1.80 | big glow | 80 + 2 |
| 12 | 4,096 | Blue giant | `#6fb8ff` (emissive) | 1.88 | glow + ring | 80 + 192 + 2 |
| 13 | 8,192 | Neutron star | `#ffffff` | 1.96 | pulsing ring | 80 + 192 |
| 14 | 16,384 | Nebula heart | `#ff3fa4` | 2.04 | glow + ring | 80 + 192 + 2 |
| 15+ | 32,768+ | Galaxy | `#fff0ff` core | 2.12-2.30 | two crossed rings | 80 + 384 |

The head (the biggest planet) wears the **comet coma**: a white-cyan glow `#bff6ff` plus a ribbon trail tinted by the
equipped skin. The rest of the chain trails behind it.

## Fail, retry, reward
- **How the player loses, and how they know why within 0.5 s:**
  - Being swallowed by a bigger head: freeze-frame 80 ms, the eater flashes red, and "Swallowed by Mango (1,024)" shows.
  - The chain bursts into stardust, and a 2 s respawn ring counts down in place. The round does **not** end.
  - The only "loss" is a lower rank at 0:00.
- **Retry time:**
  - Respawn: 2 s, automatic.
  - Between rounds: result count-up 1.2 s (skippable), then "Next round", then play <= 1.5 s later. The arena is
    already live behind the overlay.
- **What a weak round still gives:** coins for its mass and swallows (x1 crate at worst), XP toward the arena tier,
  progress on "biggest world reached". There are no zero-coin rounds.

## Progression and difficulty
- **Curve:**
  - The arena tier ramp above: bot aggression 0.30 -> 0.775, bot cap start 8 -> 32, cap doubling 60 -> 40 s.
  - Upgrades raise the player's mass per round (Start size, Magnet, Boost tank).
  - Within each round: bot caps double every 40-60 s, so the last 30 s are the most dangerous, and the golden finale
    is the richest.
- **New idea introduced at:**
  - round 1: steer + eat + fuse;
  - round 1, ~20 s: boost;
  - round 2: the upgrade cards appear;
  - round 3: the shop and "Start bigger" appear;
  - the first time the player reaches each new world: a "NEW WORLD: Ringed giant!" card, then the silhouette of the
    next one.
- **Peaks and relief:**
  - Peaks: the golden finale (last 15 s), a swallow, each new world step.
  - Relief: the respawn (2 s protected), and the result/podium pause every 90 s.

## Economy (numbers)
**Round payout:**
- `coins = (mass at 0:00 / 20 + 3 x swallows) x rank crate`.
- Rank crates: **#1 x5 · #2-3 x3 · #4-6 x2 · #7-13 x1**. Skill-based, never random.
- Also 1 XP per 10 coins.
- Human targets below; calibrate at the first playtest.

| Round (typical state) | Mass at 0:00 | Swallows | Base | #1 | #2-3 | #4-6 | #7-13 |
|---|---|---|---|---|---|---|---|
| 1 (tier 1, no upgrades) | ~700 | 4 | ~47 | 235 | 141 | 94 | 47 |
| 5 (tier ~3, Start 2 / Magnet 1) | ~1,000 | 6 | ~68 | 340 | 204 | 136 | 68 |
| 20 (tier ~8, upgrades ~5 each) | ~1,800 | 9 | ~117 | 585 | 351 | 234 | 117 |

**Upgrades** (rounded to 5; 3 cards on the result/home panel):

| Upgrade | Effect per level | Price | Max | Prices | Total |
|---|---|---|---|---|---|
| **Start size** | start chain mass: 6 -> 10 -> 14 -> 22 -> 30 -> 46 -> 62 -> 94 -> 126 -> 190 -> 254 (also the respawn mass if bigger than 14) | 50 x 1.45^n | 10 | 50, 70, 105, 150, 220, 320, 465, 675, 975, 1,400 | 4,430 |
| **Magnet** | `snake.magnetRadius` 1.7 -> +0.25 u per level (4.2 at max) | 40 x 1.40^n | 10 | 40, 55, 80, 110, 155, 215, 300, 420, 590, 825 | 2,790 |
| **Boost tank** | full bar 2.4 s -> +0.3 s per level (5.4 s at max), regen +0.01/s per level | 40 x 1.40^n | 10 | same as Magnet | 2,790 |

**12 trail skins** (cosmetic only: coma tint, ribbon, fusion sparkle):
- Classic Stardust (owned), Ember, Mint, Candy, Frost, Neon, Solar, Aurora Pink, Void, Rainbow, Galaxy, Legend.
- "Unlock random" always gives a new skin, for earned coins only. Price `150 x 1.4^(n-1)`: 150, 210, 295, 410, 575,
  805, 1,150, 1,600, 2,200, 3,100, 4,350 (total 14,845).

**Pace (no ads):**
- The first upgrade is affordable after round 1 (47-235 coins vs 40-50).
- Rounds 1-5: an upgrade every round. Rounds 10-20: every ~2 rounds.
- A skin every ~3-6 rounds if saved for.
- All upgrades maxed (10,010 coins) after ~40-50 rounds; everything owned after ~90 rounds (~2.5 h). Claiming x3 on
  ~30% of results cuts that by about a third.

**What one video is worth:**

| Offer | Rounds 1-3 | Round ~5 | Round ~20 |
|---|---|---|---|
| Claim x3 (extra over Claim) | +94 to +470 (1-5 upgrade levels) | +136 to +680 | +234 to +1,170 |
| Free upgrade (one level) | 40-70 | 80-150 | 300-1,100 |
| Shop cash (22% of the next skin) | +35 to +45 | +65 to +90 | +250 to +680 |
| Start bigger (this round) | start with mass max(62, 4 x Start size mass): a Ringed-giant-ready 32-head chain, ~the first 20-30 s of growth | same | same (at Start size 7+: 4x the upgraded start) |
| Keep your chain (revive) | respawn with the full chain you died with (typically 300-2,000 mass) instead of 14 | same | same |
| Daily gift x2 | base = 2 x average round coins at your tier x streak factor 1.0-2.0 (~100-300) | ~150-400 | ~250-700 |

## Hook cadence (default target: references/design/hypercasual-hits.md)
| Scale | Interval | What happens | Feedback |
|---|---|---|---|
| micro | 0.3-1 s | stardust eaten (+2 / +4 / +8), magnet pull | "+N" float at the head, tick on a pentatonic ladder that climbs while pickups come within 1.5 s, chain grows |
| streak | 3-8 s | fusion cascades (2+2 -> 4 -> 8 ...), "x3 FUSION" when 3+ fusions chain | each fusion pops with its own pitch, the planet morphs into the next world, the leaderboard slice moves |
| peak | 15-40 s | swallowing a comet; a new world step (first time: "NEW WORLD" card); the golden finale | 80 ms hit-stop, camera punch, burst of stardust, kill-feed line |
| run end | 90 s, fixed | podium: rank reveal #13 -> #1 in 1.2 s, crate multiplier slams onto the coin number | podium jingle by rank, confetti on #1, coins fly into the pill, **Claim / Claim x3** |
| meta | every 1-3 rounds | an upgrade level, a skin, a new tier, a new biggest world | card level pop, skin silhouette -> colour reveal |
| return | daily | gift by the PLAY button, streak day 1-7 | **Collect / Collect x2** |

- **First reward after the first input:** "+2" within ~1 s of PLAY (<= 4 s target).
- **Near-miss moment:** the result shows the true gap, "#4 - 212 mass short of the podium"; and mid-round "Swallowed
  by a comet only one world bigger".
- **The 3-second clip:** a comet with a glowing chain of planets sweeps through pastel stardust; two ice worlds fuse
  into a bigger world with a flash; it swallows a smaller comet, whose planets scatter as sparkles.

## Reason to come back tomorrow (D1)
- **Unfinished business:**
  - The arena tier and best rank ("Tier 6 · best #1").
  - The next unreached world shown as a silhouette ("Next: Red giant").
  - An upgrade 70-90% paid at session end (the result card shows its bar).
- **The skin collection** ("4/12").
- **The daily gift** with a forgiving 7-day streak (x1.0, 1.15, 1.3, 1.45, 1.6, 1.8, 2.0): a missed day steps back
  one day, never to 0.
- **Save:** everything in the Data module, so a guest keeps progress.

## Art direction
- **Style profile:** M minimal-poly (`project.json` budgets: <= 2,000 tris per geometry, <= 60,000 tris and <= 60 draw
  calls per frame, no model files, canvas textures only).
- **Primitives:**
  - planets: `IcosahedronGeometry(r,1)`, 80 tris, flat-shaded, one InstancedMesh with per-instance colour;
  - pebbles and loose stardust: `(r,0)`, 20;
  - rings: `TorusGeometry(r, t, 6, 16)`, 192, instanced;
  - glow halos and value badges: instanced quads from a canvas atlas, 2;
  - comet ribbon: a strip of <= 64 quads per comet;
  - asteroid-belt edge: instanced `(r,0)` rocks, ~160;
  - background: one gradient plane + star points.
  - Heaviest geometry: the ring, 192 tris.
  - Frame estimate: 13 chains x ~12 planets + ~250 loose + rings/halos, ~35k tris, ~15 draw calls.
- **Palette (hex):**
  - background nebula gradient lilac `#e9dcff` -> peach `#ffe6d9` -> sky `#d6f1ff`; stars `#ffffff` at 60%;
  - arena edge rocks `#9a8fb5` with a soft boundary glow `#ff9ff3`;
  - planets per the ladder table;
  - player coma `#bff6ff` with an arrow marker;
  - danger rim `#ff5a5f` on heads bigger than yours; prey rim `#6fdc6a` on smaller heads;
  - UI: Lilita One (bundled, OFL), white with `#2a2350` outline, accent `#ff3fa4`, coins `#ffd23f`.
- **Shape language:** everything round (worlds, rings, halos) on a soft gradient. The only angular shapes are the
  asteroid rocks at the edge (the wall).
- **Camera** (engine `ARENA.camera`):
  - pitch 60°; exponential follow 6/s; look-ahead 1.2 u (2.0 u while boosting);
  - zoom out 4.5% per head doubling (max x1.6);
  - **landscape:** half-width 12.5 u at the head;
  - **portrait:** half-width 7.6 u (the tall screen shows more ahead);
  - HUD in `env(safe-area-inset-*)`: clock ring top centre, coin pill top-left, leaderboard slice top-right (landscape)
    or under the clock (portrait), pause + sound top-right, boost button bottom-right on touch.
- **Reference games and what we take (not copy):**
  - Cubes 2048.io: the proven loop, bots, leaderboard slice, kill feed, equal-button revive. Not its cubes, numbers,
    navy grid, UI or name.
  - Harvest.io: the lesson that a complete fantasy change works.
  - Slice Master: a multiplier jackpot at the end (our rank crates).

## Audio direction
Procedural ZzFX, zero files. **Claude cannot hear: the owner auditions every sound** before it ships.
- **Stardust tick:** short bright blip on a major-pentatonic ladder, `pitch = 2^(step/12)` over steps 0, 2, 4, 7, 9,
  12, 14, 16, 19, 21, 24. It climbs one step per pickup inside a 1.5 s window and falls back after. +-2% detune, max 4
  voices, 45 ms min gap.
- **Fusion pop by ladder step:** pitch `1.5 x 0.93^step`, so bigger worlds sound deeper. Suns and up add a shimmer
  layer. A cascade plays its pops 70 ms apart.
- **Swallow crunch:** a crunch + rising whoosh when you eat. Being swallowed: a low thud + reversed whoosh.
- **Boost:** a quiet airy loop while held.
- **Countdown:** soft ticks from 0:10, louder at 3-2-1. A "golden finale" sting at 0:15.
- **Podium jingle:** #1 a full fanfare, #2-3 short, #4+ a friendly chord. Coin fly-in ticks. UI clicks.
- **Music:** none in v1 (Should: one CC0 loop at -12 dB after the first interaction).
- **Mute priority:** platform `muteAudio` > ad > hidden tab > the player's toggle. iOS resume on touchend.

## Monetization plan - ad-surface plan (must work with ads off and with an ad blocker)
At most **2 video buttons per screen** (`OFFERS.maxVideoOffersPerScreen = 2`). Every offer has a coin or play path.

| # | Moment | Ad type | Reward and size (vs next goal) | Cap / cooldown | Non-ad path | Template mapping | Rules |
|---|---|---|---|---|---|---|---|
| 1 | Home/between rounds, before PLAY | rewarded **Start bigger** + a coin button of the same style | this round starts with mass max(62, 4 x Start size mass) | hidden in rounds 1-2; then every 2nd round or 120 s | buy it for coins (price = the next Start size level), or upgrade Start size | `boostOffer`: `boostAfterRuns 2`, `boostCooldownSec 120`; `boostFactor 2 -> 4` with a floor of 62 (`setPlayerMass`); coin price new | 009, 011, 012 |
| 2 | Death after >= 30 s of the round | rewarded **Keep your chain** vs **Respawn** (same size), 5 s ring that picks Respawn at 0 | respawn with the full chain instead of 14 | **once per session** | the free 2 s respawn | `reviveOffer`: `revivesPerSession 1`, `reviveMinProgress 0.2 -> 0.33` (progress = t/90), `reviveCountdownSec 6 -> 5`; engine `revive()` already restores `deathMass` | 009, 014, 015 |
| 3 | Round result, after the count-up | rewarded **Claim x3** next to **Claim** | x3 the round's coins (base always granted) | every result from round 2 | "Claim" | level-complete `claim` / `claim_x` flow | 007, 008, 010, 013 |
| 4 | Shop, next skin not affordable | rewarded **+coins** | +22% of the next skin's price | 180 s with a visible timer | coins from rounds | `cashOffer`: `cashCooldownSec 180`, `cashShare 0.25 -> 0.22` | 011, 012 |
| 5 | An upgrade card whose price is not affordable | rewarded **FREE** | one level of that upgrade | 180 s | coins | `freeUpgradeOffer`: `freeUpgradeCooldownSec 180`; upgrades Start size / Magnet / Boost tank replace start / income | 011, 012 |
| 6 | Shop, a locked skin selected, from round 4 | rewarded **Try it** | play one round with that skin | once per skin (`save.tried[]`) | unlock with coins | **new** `trySkinOffer` | 011, 012 |
| 7 | First session of a local day, a gift icon next to PLAY (opens only when tapped, never before a new player's first round) | rewarded **Collect x2** next to **Collect** | double the daily gift | 1 per day | "Collect" | **new** `dailyGiftOffer`, save `lastGiftDay`, `giftStreak` | 011, 012 |

**Midgame:**
- Requested on **"Next round"** from round 3 (`GAME.firstMidgameLevel = 3`, counting rounds): after ~5 minutes of play.
- Never after a rewarded video at the same break (CG-ADS-015). Never on shop, upgrades, pause or gift.
- The SDK paces it to at most 1 per 3 min (CG-ADS-006), so about every 2nd round.

**Banners:** none in v1. Menus are open < 5 s on average; banners are off in the CrazyGames app and Basic Launch.

**Ads off / adblock / no fill:**
- All video buttons are hidden (template `rewardedAvailability`), with the notice on the result and in the shop.
- Coin buttons remain. The game is complete without video.

## Platform profile (mirrors project.json)
- target stage: full
- mobile: yes (touch joystick, portrait + landscape)
- orientation: both (set in the submission, no lock logic)
- progress save: Data module (coins, upgrades, skins owned/tried, tier, best rank, biggest world, offer timestamps,
  gift day/streak, mute)
- accounts: none (guests)
- multiplayer: no (single-player Offline Arena with bots)
- leaderboard (invite-only): no
- IAP (invite-only): no

## CrazyGames QA constraints (crazygames-qa skill checklist, BUILD MODE)
| Item | How Comet Chain meets it | Conflict? |
|---|---|---|
| <= 1 click to gameplay | the live arena is the first frame; one click on PLAY starts the round (and requests pointer lock) | none |
| Readable at DPR 1 at 907x510, 821x462, 800x450 (to 1920x1080) | badges >= 12 px, floats >= 18 px, buttons >= 16 px text / 44 px targets at 800x450; viewport QA screenshots every size | **watch**: value badges on the smallest planets at 800x450 portrait; the camera half-width 7.6 u keeps a 2-block ~50 px wide |
| Landscape on desktop, portrait on mobile, safe areas | both designed; HUD and boost button in `env(safe-area-inset-*)` | none |
| Mouse-gesture control (CG-QUAL-008) | pointer lock + confinement during rounds, custom cursor ring, unlock on P / Tab / native Escape, pause overlay on unlock, keyboard access to pause and mute | **watch**: pointer lock can fail inside the iframe or be refused. Fallback: unlocked mouse-follow with pointer capture plus the same cursor ring, and a "Click to lock" hint. Must never break play |
| No custom fullscreen button | none | none |
| No Escape / Ctrl+W bindings | Escape is only the browser's own pointer-lock release; never bound. No Ctrl combos | none |
| `event.code` / AZERTY | all keys by code (WASD = ZQSD positions on AZERTY) | none |
| iOS audio resume | template AudioService | none |
| Consistent physics 60/144/165 Hz | engine fixed-step sim + sim-health (rates x dt, seeded RNG) | none |
| Midgame only at natural breaks | only on "Next round" from round 3; never on navigation, shop or pause | none |
| Paused + muted on adStarted | template ads.js / pause.js / AudioService | none |
| Rewarded: decline same size/font/colour, video icon | all pairs use the template `.btn` pair (Claim / Claim x3, Keep your chain / Respawn, Collect / Collect x2; Start bigger video + coin buttons) | none |
| Rewarded not on active gameplay | offers only between rounds, on death (the round is paused for that dialog) and in menus; none during a round | **watch**: the Keep-your-chain dialog pauses the sim while it is open (the clock stops), so it is not on an active screen |
| Revive not on every death | once per session, only after >= 30 s of a round | none |
| Coin alternative for every reward | every row above has a coin or play path | none |
| Hidden under adblock / Basic Launch | template `rewardedAvailability` | none |
| Reward only on adFinished; no chaining | template ads.js | none |
| Data-module save | template save.js | none |
| English + SDK locale fallback | English strings; `systemInfo.locale` with English fallback | none |
| PEGI 12 / not aimed at kids | cartoon space, no gore; "swallow" is a star-eats-planet sparkle; pastel but with a sleek teen-friendly UI (not nursery) | none |
| Bots honest | the mode is "Offline Arena" on the home, HUD, leaderboard header, kill feed and podium; bots are never called players or friends | owner decision: no per-name tag; the label must be visible wherever names appear |
| Original name and assets | `docs/ORIGINALITY.md`; primitives + ZzFX + OFL font | none |
| No cross-promotion / app-store links | none | none |
| gameplayStart / Stop | start at PLAY (round start) and on resume; stop at the result, pause, pointer-lock pause and the revive dialog | none |
| Completion % | `reportGameCompletedPercentage(round(bestTier / 20 x 100))`, forward only | none |
| happytime sparingly | first ever #1 finish, first Sun reached, tier 20 | none |

## Scope
| Area | Must (upload-ready v1, buildable in a few hours on the engine) | Should | Nice | Cut (stays cut) |
|---|---|---|---|---|
| Round | timed 90 s (`round.mode "timed"`), player respawn 2 s with 14, rank at 0:00, golden finale, circle arena with asteroid edge | adaptive-tier fine tuning after playtest | daily challenge arena | shrinking zone / battle royale, last-one-standing |
| Controls | pointer lock + cursor ring + unlock/pause overlay (+ unlocked fallback), WASD/arrows, Space/Shift/hold-click boost, touch joystick + second-finger/boost button | haptics on Android | - | aim-by-drag without lock on desktop |
| Look | planet ladder visuals (colours, sizes, rings, halos, coma, ribbon), pastel nebula, value badges, danger/prey rims | more world steps art (glow polish) | photo mode | numbered cubes, a dark dot grid |
| Bots | tier ramp table, "Offline Arena" labels everywhere names appear, `bots.prefix ""` | smarter bot personalities | - | presenting bots as real players, real multiplayer |
| Meta | coins payout with rank crates, 3 upgrades, 12 skins with unlock random, Data-module save, tier + best rank, daily gift with streak | XP titles, "biggest world" collection page | seasonal skins | loot boxes, paid randomness, IAP |
| Monetization | all 7 surfaces with caps; midgame on Next round from round 3; ads-off paths; <= 2 video buttons per screen | per-surface funnel review | - | banners in v1, pressure tactics |
| Platform/launch | SDK events, completion %, happytime rules, English, safe areas, covers (1920x1080, 800x1200, 800x800) + 15-20 s preview video (landscape + portrait) | DE/FR/ES/PT strings | - | login, leaderboards, custom fullscreen |
| Update 1 | - | R2's cut rule: your comet cuts a smaller comet's tail and steals the planets | - | - |

## Risks
| Risk | Type | Mitigation |
|---|---|---|
| Bot difficulty is off for humans (the autopilot is superhuman, so there is no human data) | design | adaptive tier (+1 top 3 / -1 rank >= 8); watch the first playtest's ranks and deaths; tune `aggression` and `capVsPlayer` first |
| Pointer lock UX in the CrazyGames iframe (refusals, lost lock, Safari) | tech / platform | lock only on a click; pause overlay on unlock; unlocked fallback with pointer capture; QA on Chrome, Edge, Safari |
| Still perceived as a Cubes 2048.io clone | originality | complete fantasy swap (planets, nebula, comet coma), the evolve ladder, 90 s rounds with respawn and rank crates, our own UI; side-by-side check in ORIGINALITY.md at the first build |
| Planet types less readable than numbers when judging "can I eat that?" | design | value badge on every planet + red/green rims on heads; playtest question "which comet could you eat?" |
| Dying is cheap with respawns, so play becomes reckless | design | respawn resets to mass 14 and scatters your chain for others; rank uses the final mass |
| Performance with 13 chains + ~250 loose + halos on a 4 GB Chromebook | performance | single InstancedMesh per shape, halos as instanced quads, poly-budget QA; drop rings/halos on the low tier |
| Economy numbers are human targets, not measured | design | calibrate after the first playtest (mass at 0:00 by tier); the payout formula has one knob (`/ 20`) |
| "Offline Arena" only (no per-name tag) is judged too subtle | platform / honesty | the label shows on every screen with names; if a reviewer asks, add the tag (one config switch, `bots.prefix`) |
| The name "Comet Chain" evokes crypto ("chain"; several "Comet" crypto/software brands) | originality / naming | no game of that name found (ORIGINALITY.md); the cover and art make the space-merge game obvious; alternates listed there. Not legal advice |
| Scope for one session | schedule | Must is config + presentation on top of the engine; everything else is Should |

## Evidence
- `docs/RESEARCH.md` "Hit list: popular and simple (MEASURED 2026-09-26)":
  - Cubes 2048.io: 128,226 likes, 38,795 plays/day.
  - Numbered-cube clones get 2-13% of that.
  - Harvest.io, a full re-skin, gets 11,346 plays/day (29%).
- `docs/CONCEPTS.md` "Round 2": R1 87/100 (R2 84, R3 83); the owner's pick on 2026-09-26.
- Engine ceiling measured 2026-09-26: the engine's autopilot in timed 90 s rounds (12 seeds x tiers 1/5/20) ended with
  a median mass of 2,100-3,500 and median rank #1-2. That is an upper bound for the economy table.
