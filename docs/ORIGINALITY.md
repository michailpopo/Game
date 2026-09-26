# Originality review - Volt City (name under review)

Date: 2026-09-26 · See the skill's `references/design/originality.md`. Not legal advice.
The Comet Chain review is in git history (commit f357f8c and earlier).

## Closest existing games
| Game | Where (link) | What is similar | How ours is clearly different |
|---|---|---|---|
| City Surge (sammyvaughan86) | https://sammyvaughan86.itch.io/city-surge (itch.io browser game) | the fantasy of lighting up buildings with electricity | theirs is a speed-tapping clicker against a timer. Ours is one charged strike -> 3D chain lightning with forks across a city, a push-your-luck charge band, % powered jackpot plates, and upgrades that change the storm |
| Boomshine family (Boomshine, a 2007 Flash game; chain-reaction clickers) | no current link verified (Flash era; not on CrazyGames or Poki per the searches below) | one trigger starts a chain reaction | abstract expanding circles vs our physical lightning hopping rooftop antennas in 3D, with forks, energy, range, districts and grounding |
| Power / wire puzzles ("light the houses" tile-rotation puzzles, e.g. Energy: Anti-Stress Loops on mobile) | mobile stores (not reachable from here; not on CrazyGames per the searches below) | lighting things by electricity | theirs are rotate-the-tile puzzles with no chain, strike or timing; ours is an arcade strike |
| Tesla-tower / chain-lightning weapons in tower defence and action games | genre convention | chain lightning as an effect | there it is a weapon hitting enemies; here it is the whole game and its payoff is light, not damage |
| Slice Master | https://www.crazygames.com/game/slice-master | a number every hit, an end multiplier, a silhouette collection | genre conventions only; a different verb, object and world |

The CrazyGames search API ("volt", "volt city", "lightning", "chain lightning", "storm", "blackout", "power grid",
"city lights", "chain reaction", "boomshine") and the Poki EN sitemap (1,502 games: no "volt", "thunder", "electric",
"lightning", "city-light" slug) show **no game with this core** (2026-09-26).

## Shared genre conventions (fine to share)
- One-tap/hold hypercasual input with a timing sweet spot (a charge meter).
- A chain reaction from one trigger; a number per event; a combo/fork counter.
- A % goal with end-of-level multiplier plates; coins, upgrades, cosmetic skins with "unlock random", daily gift,
  rewarded x3 and "one more try".
- A 3D city made of boxes, lit windows at night.

## Distinctively ours (at least two)
- **Verb / control / combination:** hold to charge with a **SUPERCHARGE band and an overcharge fizzle**, release on a
  chosen rooftop, then **3D chain lightning that hops antenna to antenna**. Energy, 3D range, forks that split energy,
  gold rods and grounding decide how far it goes.
- **Setting that changes the rules:** a blacked-out 3D city.
  - Height matters: tall towers are hubs because range is 3D.
  - Wide avenues between districts stop bolts, so each strike is placed per district.
  - "BLOCK POWERED" pays whole districts.
- **Art direction:** a night city filling with gold light window by window; white-cyan bolts with glow halos and
  bloom; an elevated 3/4 camera that kicks, follows the bolt fronts and orbits the lit city at the end.
- **Meta:** upgrades that visibly change the storm (hops, forks, strikes, band width, gold rods), 40 cities in 8
  themes, best plate per city (FULL POWER stars).

## Side-by-side test
Not possible yet: there is no build (the engineer starts the core today, 2026-09-26). The test is part of the WP-20
look test and the first playable build:
- Put a 1280x720 frame next to City Surge and a Boomshine screenshot.
- Ask: "would a player think it is the same game, a sequel or an official version?"
- **Pass criteria:** a 3D city (not 2D), lightning hopping in 3D, our own HUD (% meter, charge ring, plates), our own
  wordmark.
- The answer and screenshots are added here at that review.

## Name search
| Name candidate | CrazyGames | Poki | App/Play store | Web | Trademark concern? | Verdict |
|---|---|---|---|---|---|---|
| **Volt City** (the owner's current name) | search API "volt city": no results; "volt": Voltspire (tower defence) and fuzzy matches; `crazygames.com/game/volt-city` and `volt-city-3d` return 404 | no "volt" slug in the EN games sitemap | not reachable (proxy 403) | WebSearch `"Volt City" game`: **"Volt City" is an existing meta-game of Volt Casino** (online casino, Malta), previewed at SiGMA 2019, press 2020-02-19 (europeangaming.eu, intergameonline.com). Players "save the humans suffering from the blackout" and earn casino rewards | **high**: an existing game name owned by a gambling brand, with the same blackout premise. CG-QUAL-006 asks for names not easily confused and no identifiers you do not own; a casino association also sits badly with PEGI 12. Not legal advice | **rename recommended** (NEEDS USER) |
| **Storm Grid** (proposed) | search API "storm grid": no results; `crazygames.com/game/storm-grid` 404 | no "grid" slug | not reachable | WebSearch `"Storm Grid" game`: no game of that exact name (near: "Grid Legion, Storm", a Steam card game; "Grid Seeker: Project Storm Hammer", a 1992 Taito shooter) | low | **preferred alternate** |
| Blackout Bolt | search API: no results; slug 404 | no "bolt" game slug except a screw puzzle | not reachable | not searched on the web | not checked | spare (needs a web check) |
| Surge City / City Surge | search API "surge city": no results | no "surge" game slug | not reachable | **taken**: "Surge City" (itch.io metroidvania) and "City Surge" (itch.io electricity city clicker, the closest game) | confusion risk | reject |

## Assets
All shipped assets are listed with licenses in `docs/ASSET_MANIFEST.md`: three.js primitives, canvas textures, ZzFX
sounds and the Lilita One font (OFL, via @fontsource). No assets, names, characters, UI or level layouts were taken
from another game.

## Rename (2026-09-26)
The owner renamed the game to **Storm Grid** after the "Volt City" casino collision above. Planner re-check the same
day: CrazyGames search API `q=storm grid` -> no results. The designer's checks for Storm Grid (slug 404, Poki sitemap,
WebSearch) are logged above in the name search section.
