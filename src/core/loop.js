/**
 * Fixed-timestep loop with interpolated rendering.
 *
 * CG-GAME-003: physics must behave the same on 60 Hz and 144/165 Hz monitors.
 * `x += v * dt` with the browser's variable dt still drifts (jump height, drag,
 * tunnelling all depend on step size). So the simulation advances in identical
 * steps and only the render is interpolated.
 *
 *   update(dt)            simulation, called 0..maxSteps times per frame, dt constant
 *   render(alpha, realDt) drawing; alpha in [0,1) blends previous -> current sim state
 *
 * Game-feel hooks that must not break determinism:
 *   freeze(ms)   hit-stop: simulation holds, rendering continues
 *   timeScale    slow motion: scales how much real time feeds the accumulator
 */

export class GameLoop {
  #update; #render; #step; #maxSteps;
  #raf = 0; #last = 0; #acc = 0; #running = false;
  #simPaused = false; #freezeMs = 0;
  #emaFrameMs = 16.7;
  #stats = { frames: 0, steps: 0, longFrames: 0, spiralGuards: 0 };

  timeScale = 1;

  constructor({ update, render, step = 1 / 60, maxStepsPerFrame = 5 }) {
    this.#update = update;
    this.#render = render;
    this.#step = step;
    this.#maxSteps = maxStepsPerFrame;
  }

  get step() { return this.#step; }
  get frameMs() { return this.#emaFrameMs; }
  get stats() { return { ...this.#stats, frameMs: +this.#emaFrameMs.toFixed(2), fps: Math.round(1000 / this.#emaFrameMs) }; }

  start() {
    if (this.#running) return;
    this.#running = true;
    this.#last = performance.now();
    this.#acc = 0;
    this.#raf = requestAnimationFrame(this.#frame);
  }

  stop() {
    this.#running = false;
    cancelAnimationFrame(this.#raf);
  }

  /** Pause the simulation while rendering continues. Resuming never fast-forwards. */
  setSimPaused(paused) {
    if (this.#simPaused && !paused) this.#acc = 0;
    this.#simPaused = paused;
  }

  freeze(ms) { this.#freezeMs = Math.max(this.#freezeMs, ms); }

  #frame = (now) => {
    if (!this.#running) return;
    this.#raf = requestAnimationFrame(this.#frame);

    const frameMs = Math.min(now - this.#last, 250);
    this.#last = now;
    this.#stats.frames++;
    this.#emaFrameMs += (frameMs - this.#emaFrameMs) * 0.05;
    if (frameMs > 34) this.#stats.longFrames++;

    if (this.#freezeMs > 0) {
      this.#freezeMs -= frameMs;
    } else if (!this.#simPaused) {
      this.#acc += Math.min((frameMs / 1000) * this.timeScale, this.#step * this.#maxSteps);
      let n = 0;
      while (this.#acc >= this.#step) {
        this.#update(this.#step);
        this.#acc -= this.#step;
        this.#stats.steps++;
        if (++n >= this.#maxSteps) { this.#acc = 0; this.#stats.spiralGuards++; break; }
      }
    }

    this.#render(this.#simPaused ? 1 : this.#acc / this.#step, frameMs / 1000);
  };
}
