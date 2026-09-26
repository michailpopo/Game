# QA report - Working Title

## Automated runs
| Date | Build | `npm run qa` result | Compliance verdict | Notes |
|---|---|---|---|---|

## Playtest sessions
| Date | Who | Device / browser / viewport | Fresh or returning | Duration | Biggest problem named |
|---|---|---|---|---|---|

## Device matrix
| Device | Browser | Result | Frame feel | Notes |
|---|---|---|---|---|
| Dev PC | Chrome | | | |
| Dev PC | Edge | | | CG-TECH-007 |
| Low-end laptop / Chromebook (if available) | Chrome | | | CG-TECH-008 |
| Android phone | Chrome | | | touch |
| iPhone (if available) | Safari | | | audio resume, safe areas |

## Screenshot review (Claude looks at qa/shots)
| Screenshot | Checked for | Verdict |
|---|---|---|
| viewport-800x450.png | legibility at minimum size | |
| viewport-821x462.png | legibility | |
| viewport-1080x1620.png | portrait framing | |
| ads-slow-fill-blocked.png | blocker over UI | |
| adblock-result.png | notice, no dead button | |

## Issues
| Id | Severity | Found | Steps | Status |
|---|---|---|---|---|
Severity: P0 blocker (crash, softlock, lost progress, compliance fail) · P1 major · P2 ordinary · P3 polish.
No P0/P1 may be open at the launch package gate.
