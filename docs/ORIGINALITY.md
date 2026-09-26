# Originality review - Comet Chain

Date: 2026-09-26 · See the skill's `references/design/originality.md`. Not legal advice.

## Closest existing games
| Game | Where (link) | What is similar | How ours is clearly different |
|---|---|---|---|
| Cubes 2048.io | https://www.crazygames.com/game/cubes-2048-io (HTML5, 128,226 likes, 38,795 plays/day, RESEARCH hit list) | the loop: steer a chain of value blocks, eat loose 2s, equal values merge and double, eat smaller heads, bots, leaderboard slice, kill feed, boost, revive with equal buttons, "start bigger" | planets in a pastel nebula instead of numbered cubes on a navy dot grid; a visible evolve ladder (pebble -> moon -> ... -> sun -> galaxy) with rings and glows; 90 s rounds with free respawns and a rank-crate payout instead of endless play until death; our own name, UI, podium and sounds |
| Cubes 2048 Royale | https://www.crazygames.com/game/cubes-2048-royale (HTML5, real multiplayer 2-5) | the same numbered-cube loop | theirs is a battle royale (last one standing). Ours has no shrinking zone and no elimination: timed rounds, respawns, a rank payout |
| Harvest.io - 3D Farming Arcade (Azur Games) | https://www.crazygames.com/game/harvest-io---3d-farming-arcade (HTML5, 2026-08-21, 11,346 plays/day) | the proof that a full re-skin of the loop works; bots | theirs is a tractor pulling a hay-bale trailer on a farm; ours is space, a comet pulling planets, and planets that merge and evolve. There is no vehicle or trailer |
| Snake.io | https://www.crazygames.com/game/snake-io | .io snake arena, grow by eating | no merge ladder there; ours merges and evolves, runs in timed rounds, and is single-player with labelled bots |
| Noob Snake 2048 | https://www.crazygames.com/game/noob-snake-2048 | numbered-block snake, portrait | numbers are not our object; the planet types are |
| slither.io | https://slither.io (2016, the original .io snake) | the snake-arena genre (grow, boost, eat the defeated) | pellets and death-on-body there; ours merges values, compares heads, respawns within a timed round |

## Shared genre conventions (fine to share)
- A chain that follows the head; grow by collecting loose pickups; equal values merge into double (the 2048 rule).
- Bigger heads eat smaller ones; the defeated chain drops as pickups; a boost with a cost.
- Bots in an arena, a leaderboard slice and a kill feed (bots are labelled: the mode is "Offline Arena").
- Coins, upgrades, cosmetic skins with "unlock random", revive with a countdown, a start boost, daily gift.
- A top-down 3D camera with minimal-poly shapes.

## Distinctively ours (at least two)
- **Verb / control / combination:** the 2048 merge becomes a visible **evolution of worlds**:
  - each fusion changes shape, colour, size and adds rings or glows;
  - the value is a small badge, not the object.
  - Combined with **timed 90 s rounds, free 2 s respawns and a rank-crate payout** (#1 x5, #2-3 x3, #4-6 x2), which
    none of the family's games has.
- **Setting that changes the rules:** space.
  - A comet whose biggest world wears the coma.
  - An asteroid-belt edge you slide along.
  - A **golden finale**: the last 15 s spawn stardust worth double.
- **Art direction:** a pastel nebula gradient (lilac -> peach -> sky), with glowing planets, rings and halos. It
  deliberately contrasts with Cubes 2048.io's dark navy dot grid and numbered boxes.
- **Meta:**
  - an adaptive arena tier (1-20) that moves with results;
  - a "biggest world reached" ladder with silhouettes of the next world;
  - Start size / Magnet / Boost tank upgrades.
- **Planned update:** R2's tail cut ("cut a smaller comet's tail and steal its planets") would add a combat rule the
  family does not have.

## Side-by-side test
Not possible yet: there is no build (the engine is being built today, 2026-09-26). The test is part of the first
playable build's review:
- Put a gameplay screenshot at 1280x720 next to a Cubes 2048.io frame (`hypercasual-hits.md` section 2) and a
  Harvest.io frame.
- Ask: "would a player think it is the same game, a sequel or an official version?"
- **Pass criteria:** no numbered cubes, no dark dot grid, no vehicle-with-trailer, our own HUD layout (clock ring at
  the top centre, podium result), our own wordmark.
- The answer and screenshots are added here at that review.

## Name search
| Name candidate | CrazyGames | Poki | App/Play store | Web | Trademark concern? | Verdict |
|---|---|---|---|---|---|---|
| **Comet Chain** | search API 2026-09-26: "comet chain" no results, "comet" only fuzzy-matches Cemetery Warrior 4; `crazygames.com/game/comet-chain` and `comet-chain-io` return 404 | EN games sitemap (`poki.com/en/sitemaps/games.xml`, 1,502 games): no slug with "comet"; "chain" only word-chains | App Store / Google Play not reachable (proxy 403); WebSearch for `"Comet Chain" app` found no app of that name | WebSearch `"Comet Chain" game` and `"Comet Chain" app OR io OR trademark`: no game of that name. Nearby: Happy Comet (itch.io), The Spinning Comet Escape (Phaser news), Comet (card game) | "Comet" is a crowded word in software and crypto (Comet ML vs Perplexity "Comet" browser, CometBFT, Comet Wallet); "chain" can read as blockchain. No game-class conflict found. Not legal advice | **keep** (the owner's choice); the cover must make the space-merge game obvious |
| Comet Merge (alternate) | "comet" fuzzy only | no "comet" slug | not checked (blocked) | not searched separately | same "Comet" crowding | spare |
| Planet Chain (alternate) | not searched | "planet-merge" exists on Poki | not checked | not searched | avoid: close to Poki's Planet Merge | reject |

## Assets
All shipped assets are listed with licenses in `docs/ASSET_MANIFEST.md`: three.js primitives, canvas textures, ZzFX
sounds and the Lilita One font (OFL, via @fontsource). No assets, names, characters, UI or level layouts were taken
from another game.
