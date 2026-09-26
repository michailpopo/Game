# Store metadata - Working Title

CrazyGames asks for a game description and controls with the submission, plus covers and videos
(requirements/intro). The exact Developer Portal form fields were **not** documented publicly when
this template was written - copy each text into whatever field the portal shows and note any field
this file lacks.

## Title
_Unique, not confusable, no trademarks (see ORIGINALITY.md)._

## Short description (1-2 sentences)

## Full description
_What the player does, the hook, progression, what makes it different. Plain, honest, no "best game
ever", no promises the game does not keep (CG-QUAL-006)._

## Controls
| Device | Controls |
|---|---|
| Desktop | e.g. "Hold left mouse button and drag to steer · A/D or arrow keys (Q/D on AZERTY)" |
| Mobile / tablet | e.g. "Touch and drag to steer" |

## Submission settings to choose in the portal
| Setting | Value | Why |
|---|---|---|
| Orientation(s) | | the website enforces it; no lock logic in game (CG-TECH-011) |
| Progress save | Data module | required for the Data module to work (CG-DATA-003) |
| Mobile support | | |
| Multiplayer lobby sizes | | only if multiplayer (CG-MP-005) |
| Languages included | English + ... | every language must be accurate (CG-GAME-005) |

## Assets
- `submission/covers/landscape-1920x1080.png`, `portrait-800x1200.png`, `square-800x800.png`
- `submission/video/landscape-1920x1080.mp4`, `portrait-1080x1620.mp4`
- Build: contents of `dist/` from the release-candidate commit (fill at release)
