/**
 * Steering for Comet Chain: mouse (pointer lock + virtual cursor ring), 8-way keys and a
 * floating touch joystick, all turned into ONE per-step intent for the simulation:
 * { hasDir, dirX, dirZ, boost } (see sim.js makeInput). Presentation-side only.
 *
 * CG-QUAL-008 (top-view game steered by mouse gestures): lock and confine the pointer, show
 * a custom pointer, give an unlock shortcut, keep buttons reachable.
 *   - requestLock() is called from the PLAY click (a user gesture) and from any later click
 *     on the arena while a round runs unlocked; never before a gesture
 *   - locked: mouse movement moves a virtual cursor kept within controls.cursorRadius of the
 *     head (a world-space offset the view draws as a ring); the comet steers toward it
 *   - unlock: P or Tab (event.code; Escape is never bound - the browser releases the lock on
 *     Escape by itself); losing the lock during a round calls onUnlock -> pause overlay
 *   - fallback when the lock is refused or unavailable: the plain pointer position steers
 *     (clamped to the same ring); a later click on the arena tries the lock again
 * Keys (event.code, AZERTY-safe): WASD / arrows = 8-way screen-relative direction; Space or
 * ShiftLeft (or a held left button) = boost. Touch: the first finger on the left part of the
 * screen opens a joystick where it lands; a second finger, a first finger on the right part,
 * or the on-screen boost button = boost.
 */

import { ARENA } from "../config.js";

const C = ARENA.controls;

export class Controls {
  mode = "mouse";              // last used: "mouse" | "keys" | "touch"
  locked = false;
  lockRefused = false;
  mouseDown = false;
  touchBoost = false;          // the on-screen boost button
  /** Virtual cursor as a world offset from the head (drawn as a ring). */
  cursor = { x: 3, z: 0, shown: false };
  stick = { id: -1, ox: 0, oy: 0, x: 0, y: 0 };

  #canvas; #input; #onUnlock; #onPauseKey;
  #expectUnlock = false;
  #pointer = { x: 0, y: 0, seen: false };
  #boostTouches = new Set();
  #worldPerPx = 0.03;
  #running = false;

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {import("../core/input.js").Input} input  keyboard state (bindings by event.code)
   * @param {{ onUnlock?: (focused:boolean)=>void, onPauseKey?: ()=>void }} [cb]
   */
  constructor(canvas, input, { onUnlock, onPauseKey } = {}) {
    this.#canvas = canvas;
    this.#input = input;
    this.#onUnlock = onUnlock;
    this.#onPauseKey = onPauseKey;
  }

  attach() {
    const el = this.#canvas;
    document.addEventListener("pointerlockchange", () => {
      const now = document.pointerLockElement === el;
      const was = this.locked;
      this.locked = now;
      if (now) { this.lockRefused = false; return; }
      if (was && !this.#expectUnlock && this.#running) this.#onUnlock?.(document.hasFocus() && document.visibilityState === "visible");
      this.#expectUnlock = false;
    });
    document.addEventListener("pointerlockerror", () => { this.lockRefused = true; });

    el.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") {
        if (e.pointerId === this.stick.id) { this.stick.x = e.clientX; this.stick.y = e.clientY; }
        return;
      }
      if (this.locked) {
        // Screen pixels -> world units at the head (down on screen = +z).
        if (e.movementX || e.movementY) {
          if (this.mode !== "mouse") this.#reseedCursor();
          this.mode = "mouse";
          this.cursor.x += e.movementX * this.#worldPerPx;
          this.cursor.z += e.movementY * this.#worldPerPx * 1.15;
          this.#clampCursor();
        }
      } else {
        const moved = !this.#pointer.seen || Math.abs(e.clientX - this.#pointer.x) + Math.abs(e.clientY - this.#pointer.y) > 2;
        this.#pointer.x = e.clientX;
        this.#pointer.y = e.clientY;
        this.#pointer.seen = true;
        if (moved) this.mode = "mouse";
      }
    }, { passive: true });

    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") {
        this.mode = "touch";
        const w = el.clientWidth || 1;
        const r = el.getBoundingClientRect();
        if (this.stick.id < 0 && e.clientX - r.left < w * C.joystickArea) {
          this.stick.id = e.pointerId;
          this.stick.ox = this.stick.x = e.clientX;
          this.stick.oy = this.stick.y = e.clientY;
        } else {
          this.#boostTouches.add(e.pointerId);
        }
        return;
      }
      this.#pointer.x = e.clientX;
      this.#pointer.y = e.clientY;
      this.#pointer.seen = true;
      if (e.button === 0) this.mouseDown = true;
    });
    const up = (e) => {
      if (e.pointerType === "touch") {
        if (e.pointerId === this.stick.id) this.stick.id = -1;
        this.#boostTouches.delete(e.pointerId);
        return;
      }
      if (e.button === 0 || e.type === "pointercancel") this.mouseDown = false;
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", () => { this.mouseDown = false; this.stick.id = -1; this.#boostTouches.clear(); this.touchBoost = false; });

    // P / Tab: pause and release the pointer. Tab must not move focus out of the game mid-round.
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.code === "Tab" && this.#running) e.preventDefault();
      if ((e.code === "KeyP" || e.code === "Tab") && !e.repeat) this.#onPauseKey?.();
    });
    return this;
  }

  /** The round is running (lock losses then pause the game). */
  setRunning(on) {
    this.#running = !!on;
    if (!on) { this.mouseDown = false; this.stick.id = -1; this.#boostTouches.clear(); this.touchBoost = false; }
  }

  get running() { return this.#running; }

  /** Call from a user gesture (click / keydown). Harmless when unsupported or refused. */
  requestLock() {
    const el = this.#canvas;
    if (this.locked || !el.requestPointerLock || matchMedia("(pointer: coarse)").matches && !this.#pointer.seen) return;
    try {
      const r = el.requestPointerLock();
      if (r && typeof r.catch === "function") r.catch(() => { this.lockRefused = true; });
    } catch { this.lockRefused = true; }
  }

  releaseLock() {
    if (document.pointerLockElement === this.#canvas) {
      this.#expectUnlock = true;
      document.exitPointerLock?.();
    }
  }

  /** Put the cursor where a click landed (world offset from the head), so the first steer is where the player pointed. */
  aimAt(offX, offZ) {
    this.cursor.x = offX;
    this.cursor.z = offZ;
    this.#clampCursor();
  }

  #reseedCursor() {
    const len = Math.hypot(this.cursor.x, this.cursor.z);
    if (len < C.deadZone * 2) { this.cursor.x = 3; this.cursor.z = 0; }
  }

  #clampCursor() {
    const len = Math.hypot(this.cursor.x, this.cursor.z);
    if (len > C.cursorRadius) { this.cursor.x *= C.cursorRadius / len; this.cursor.z *= C.cursorRadius / len; }
  }

  /**
   * This step's intent.
   * @param {{ x:number, z:number, heading:number }} head the player's head (sim)
   * @param {{ screenToGround:(sx:number, sy:number, out:{x:number,z:number})=>boolean, worldPerPixel:()=>number, canvasRect:()=>DOMRect }} view
   * @param {ReturnType<import("./sim.js").makeInput>} out
   */
  intent(head, view, out) {
    this.#worldPerPx = view.worldPerPixel();
    const inp = this.#input;
    out.hasDir = false;
    out.turn = 0;

    // Keys: 8-way screen-relative direction.
    const kx = inp.axis("left", "right"), kz = inp.axis("up", "down");
    if (kx || kz) {
      this.mode = "keys";
      out.hasDir = true;
      out.dirX = kx;
      out.dirZ = kz;
    } else if (this.mode === "touch") {
      const s = this.stick;
      if (s.id >= 0) {
        const dx = s.x - s.ox, dy = s.y - s.oy;
        if (Math.hypot(dx, dy) > C.joystickDeadPx) { out.hasDir = true; out.dirX = dx; out.dirZ = dy; }
      }
    } else if (this.mode === "mouse") {
      if (!this.locked && this.#pointer.seen) {
        const r = view.canvasRect();
        const g = _g;
        if (view.screenToGround(this.#pointer.x - r.left, this.#pointer.y - r.top, g)) {
          this.cursor.x = g.x - head.x;
          this.cursor.z = g.z - head.z;
          this.#clampCursor();
        }
      }
      const len = Math.hypot(this.cursor.x, this.cursor.z);
      if (len > C.deadZone) { out.hasDir = true; out.dirX = this.cursor.x; out.dirZ = this.cursor.z; }
    }
    this.cursor.shown = this.mode === "mouse" && this.#running;
    out.boost = inp.held("boost") || this.mouseDown || this.touchBoost || this.#boostTouches.size > 0 || (this.stick.id >= 0 && this.#boostTouches.size > 0);
    return out;
  }

  /** Joystick state for the UI (null when hidden). */
  get stickView() {
    const s = this.stick;
    if (s.id < 0 || this.mode !== "touch") return null;
    let dx = s.x - s.ox, dy = s.y - s.oy;
    const len = Math.hypot(dx, dy);
    if (len > C.joystickRadiusPx) { dx *= C.joystickRadiusPx / len; dy *= C.joystickRadiusPx / len; }
    return { x: s.ox, y: s.oy, kx: dx, ky: dy };
  }
}

const _g = { x: 0, z: 0 };
