# Storm Grid - rules for every Claude session

This repo is a CrazyGames 3D browser game (three.js + Vite). The owner restarts chats often to keep the context small.

1. **Start:** read `HANDOFF.md` (the current state, the owner's wishes, what is left). Then only the doc sections it
   names. Do not read `docs/CONCEPTS.md` rounds 1-2, `docs/RESEARCH.md` or `docs/shelved/` unless asked.
2. **Work:** use the `game-studio` skill (planner + specialists) and the `crazygames-qa` skill (build mode in every
   change, audit report at the gates). Be economical: small fixes directly, at most one specialist agent at a time.
3. **Cloud container env:** browser QA needs `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`; Node web fetches need
   `NODE_USE_ENV_PROXY=1`. WebGL is software-rendered here: judge stills and draw calls, not fps.
4. **Before you stop (every session):** update `HANDOFF.md` sections 3, 4 and 8 and `docs/PROJECT_STATUS.md`
   (what changed, what was verified with which command, what is next), then commit and push to the working branch.
5. Never upload, submit, log in or pay for the owner. The owner plays and listens; Claude cannot hear sounds.
