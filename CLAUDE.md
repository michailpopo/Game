# Storm Grid - rules for every Claude session

This repo is a CrazyGames 3D browser game (three.js + Vite). The owner restarts chats often to keep the context small.

1. **Start:** read `HANDOFF.md` (state, links, the owner's wishes, what is left). Then only the doc sections it names.
   Do not read `docs/CONCEPTS.md` rounds 1-2, `docs/RESEARCH.md` or `docs/shelved/` unless asked.
2. **Work:** use the `game-studio` skill and the `crazygames-qa` skill (build mode in every change, audit report at
   the gates). Be economical: small fixes directly, at most one specialist agent at a time.
3. **Owner rules:** change only what he asks for (the city/buildings and the UI stay as they are unless he says so).
   One change per commit so `git revert` is clean - he often says "mach zurück". Show before/after stills in the
   chat (he cannot open `qa/`), republish the private playtest page after every visible change
   (`tools/playtest/make-page.mjs`, link in HANDOFF section 2), keep replies short, answer in his language
   (German or English).
4. **Cloud container env:** browser tools need `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`; Node web fetches need
   `NODE_USE_ENV_PROXY=1`. WebGL is software-rendered: judge stills and draw calls, not fps. Blocked hosts: ask the
   owner to allow them in the environment's Network access settings.
5. **Before you stop (every session):** update `HANDOFF.md` (sections 2, 4, 5 and the first job) and
   `docs/PROJECT_STATUS.md` (what changed, what was verified with which command, what is next), then commit and push
   to the working branch.
6. Never upload, submit, log in or pay for the owner. The owner plays and listens; Claude cannot hear sounds.
