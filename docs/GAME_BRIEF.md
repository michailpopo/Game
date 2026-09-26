# Game brief - Merge-snake arena (working title TBD)

Status: DRAFT · Gate 1 (concept) not passed yet
Last updated: 2026-09-26

> Fill every section with specifics. "TBD" is allowed only in Risks. Gate 1 fails while any other
> section is vague.

## One-line pitch
_A sentence a player would understand, with the verb and the hook._

## Loops
| Loop | Length | Description (verbs) |
|---|---|---|
| Core | 5-30 s | |
| Session | 1-3 min | |
| Meta | days | |

## First 30 seconds (beat by beat, cold start)
| Time | What the player sees | What they do | Feedback |
|---|---|---|---|
| 0-3 s | | | |
| 3-10 s | | | |
| 10-30 s | | | |

## Controls
| Device | Input | Action |
|---|---|---|
| Desktop keyboard (physical keys, `KeyboardEvent.code`) | | |
| Mouse | | |
| Touch (if mobile) | | |
Mouse-control rule check (CG-QUAL-008): is the character steered by mouse gestures? yes / no - why.

## Fail, retry, reward
- How the player loses, and how they know why within 0.5 s:
- Retry time (target < 2 s):
- What a lost run still gives:

## Progression and difficulty
- Curve (numbers per level or per minute):
- New idea introduced at: level ...
- Peaks and relief:

## Hook cadence (default target: references/design/hypercasual-hits.md)
| Scale | Interval | What happens | Feedback |
|---|---|---|---|
| micro | 0.5-2 s | | |
| streak | 5-15 s | | |
| peak | 20-40 s | | |
| run end | 30-90 s | | |
| meta | every 3-5 runs | | |
| return | daily | | |
First reward after the first input: ... s (target <= 4 s) · near-miss moment: ... · the 3-second clip: ...

## Reason to come back tomorrow (D1)

## Art direction
- Style profile: M minimal-poly (default) / S scenic - budgets copied into project.json `budgets`
- Primitives per object (name each: box, cylinder 12, torus 8x20 ...) and the heaviest geometry's triangles:
- Palette (hex): player / good / bad / world / UI accent
- Shape language:
- Reference games and **what we take** (not copy):

## Audio direction

## Monetization plan - ad-surface plan (must work with ads off and with an ad blocker)
Target: >= 5 rewarded surfaces players want + a midgame at every natural break from run/level 3-4;
<= 2 video buttons per screen (references/crazygames/monetization-playbook.md, "Ad-view maximisation").
| Moment | Ad type | Reward and size (vs next goal) | Cap / cooldown | Non-ad path | Rules |
|---|---|---|---|---|---|
| | midgame / rewarded / banner | | | | CG-ADS-... |

## Platform profile (mirrors project.json)
target stage: basic/full · mobile: · orientation: · progress save: Data module · accounts: · multiplayer: · leaderboard (invite-only): · IAP (invite-only):

## Scope
| Must | Should | Nice | Cut (stays cut) |
|---|---|---|---|
| | | | |

## Risks
| Risk | Type | Mitigation |
|---|---|---|
| | design / tech / originality / performance / monetization | |

## Evidence
Links to `docs/RESEARCH.md` sections and `docs/CONCEPTS.md` scores that justify this concept.
