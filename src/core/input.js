/**
 * Input: keyboard, mouse, pen and touch behind one small API.
 *
 * CG-QUAL-002  Keys are read from KeyboardEvent.code, never .key. On AZERTY
 *              (France) the physical W key reports key "z" but code "KeyW".
 * CG-QUAL-001  Escape is never bound: the browser owns it (fullscreen, pointer lock).
 * CG common fixes (docs.crazygames.com/resources/html5/common-fixes):
 *              arrows/space must not scroll the page, wheel must not scroll,
 *              no context menu.
 * Mouse control (docs.crazygames.com/resources/mouse-control): games where the
 *              character follows mouse GESTURES must lock/confine the pointer.
 *              Default here is hold-and-drag with pointer capture, which cannot
 *              click outside the frame. `pointerLock: true` is available for
 *              games that steer by free mouse movement; lock only after a user
 *              gesture (docs: delay locking to avoid crashes).
 */

const DEFAULT_BINDINGS = {
  left: ["KeyA", "ArrowLeft"],
  right: ["KeyD", "ArrowRight"],
  up: ["KeyW", "ArrowUp"],
  down: ["KeyS", "ArrowDown"],
  action: ["Space", "Enter"],
};

const FORBIDDEN = new Set(["Escape"]);
const SWALLOW = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);

export class Input {
  #el; #bindings = {}; #down = new Set(); #pressed = new Set();
  #pointer = { id: null, down: false, x: 0, y: 0, dragX: 0, dragY: 0 };
  #firstInteraction = new Set(); #interacted = false;
  #pointerLock; #layout = null;

  /**
   * @param {HTMLElement} el  element that receives gameplay pointer input (the canvas)
   * @param {{ bindings?: Record<string,string[]>, pointerLock?: boolean }} [opts]
   */
  constructor(el, { bindings = {}, pointerLock = false } = {}) {
    this.#el = el;
    this.#pointerLock = pointerLock;
    for (const [action, codes] of Object.entries({ ...DEFAULT_BINDINGS, ...bindings })) {
      const clean = codes.filter((c) => !FORBIDDEN.has(c));
      if (clean.length !== codes.length) console.warn(`[input] refused browser-reserved key for "${action}"`);
      this.#bindings[action] = clean;
    }
  }

  attach() {
    const el = this.#el;
    el.style.touchAction = "none";

    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (SWALLOW.has(e.code)) e.preventDefault();
      if (!this.#down.has(e.code)) this.#pressed.add(e.code);
      this.#down.add(e.code);
      this.#markInteraction(e);
    }, { passive: false });
    window.addEventListener("keyup", (e) => this.#down.delete(e.code));

    el.addEventListener("pointerdown", (e) => {
      if (this.#pointer.id !== null && e.pointerId !== this.#pointer.id) return;
      this.#pointer.id = e.pointerId;
      this.#pointer.down = true;
      this.#pointer.x = e.clientX;
      this.#pointer.y = e.clientY;
      el.setPointerCapture?.(e.pointerId);
      if (this.#pointerLock && e.pointerType === "mouse") el.requestPointerLock?.()?.catch?.(() => {});
      this.#markInteraction(e);
      e.preventDefault();
    }, { passive: false });

    el.addEventListener("pointermove", (e) => {
      const locked = document.pointerLockElement === el;
      if (!locked && (!this.#pointer.down || e.pointerId !== this.#pointer.id)) return;
      const w = el.clientWidth || 1;
      const dx = locked ? e.movementX : e.clientX - this.#pointer.x;
      const dy = locked ? e.movementY : e.clientY - this.#pointer.y;
      this.#pointer.dragX += dx / w;
      this.#pointer.dragY += dy / w;
      this.#pointer.x = e.clientX;
      this.#pointer.y = e.clientY;
    }, { passive: true });

    const up = (e) => {
      if (e.pointerId !== this.#pointer.id) return;
      this.#pointer.down = false;
      this.#pointer.id = null;
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    // A keyup or pointerup lost while unfocused would leave input stuck.
    const clear = () => { this.#down.clear(); this.#pointer.down = false; this.#pointer.id = null; };
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", () => { if (document.hidden) clear(); });

    window.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    // Layout label for on-screen hints only; bindings already use physical codes.
    navigator.keyboard?.getLayoutMap?.().then((map) => {
      this.#layout = ["KeyW", "KeyA", "KeyS", "KeyD"].map((c) => (map.get(c) || "").toUpperCase()).join("");
    }).catch(() => {});
    return this;
  }

  /** Called once, on the first key or pointer press (a user gesture: unlock audio here). */
  onFirstInteraction(fn) {
    if (this.#interacted) fn();
    else this.#firstInteraction.add(fn);
  }

  held(action) { return (this.#bindings[action] || []).some((c) => this.#down.has(c)); }
  justPressed(action) { return (this.#bindings[action] || []).some((c) => this.#pressed.has(c)); }
  axis(neg, pos) { return (this.held(pos) ? 1 : 0) - (this.held(neg) ? 1 : 0); }

  /** Horizontal drag since the last call, as a fraction of the element width. */
  consumeDragX() { const v = this.#pointer.dragX; this.#pointer.dragX = 0; return v; }
  consumeDragY() { const v = this.#pointer.dragY; this.#pointer.dragY = 0; return v; }
  get pointerDown() { return this.#pointer.down; }

  /** Clear one-frame state. Call after the simulation consumed it. */
  endStep() { this.#pressed.clear(); }

  exitPointerLock() { if (document.pointerLockElement) document.exitPointerLock?.(); }

  get movementLabel() { return /^[A-Z]{4}$/.test(this.#layout || "") ? this.#layout : "WASD"; }
  get isTouch() { return matchMedia("(pointer: coarse)").matches; }

  #markInteraction() {
    if (this.#interacted) return;
    this.#interacted = true;
    for (const fn of this.#firstInteraction) { try { fn(); } catch (e) { console.error(e); } }
    this.#firstInteraction.clear();
  }
}
