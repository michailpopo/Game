/**
 * Presentation for Storm Grid: turns simulation state + events into pixels, sound and juice.
 * It reads the simulation and drains `sim.events`; it never mutates game state.
 *
 * Look (WP-31): the WP-21 toy city (city-mesh.js), the premium look kit (src/render/look.js: dusk sky per theme,
 * soft static shadows, bloom only on the bolt core; AdaptiveQuality tiers drop bloom/shadows on weak devices),
 * FxKit bolts (white core + skin glow + a deep-blue outline so the bolt stays the most saturated thing on screen).
 *
 * Juice (skill references/design/game-feel-juice.md, feedback size matches event size):
 *   charge     the storm front flickers, a hum rises with the charge; SUPERCHARGE band: ding, gold ring and a gold
 *              pulse on the target; overcharge: buzz, red ring and red sparks (the fizzle warning)
 *   strike     the big bolt from the storm front, 60 ms hit-stop, FOV punch -4 deg for 120 ms, trauma shake,
 *              a flat shockwave on the roof, SUPERCHARGE! / FIZZLE
 *   hop        a forked bolt tip to tip, a halo and sparks at the arrival, the building floods with colour from the
 *              ground up (white flash), "+N", a crackle on a major-pentatonic ladder (one step per depth)
 *   fork       "FORK x2 / x4 / x8" as the bolt count doubles, a zap one step higher
 *   gold rod   gold halo, sparks and coins popping from the rod, a ping
 *   district   BLOCK POWERED card + chord, the block's pad warms up in a wave, its buildings pulse, a ring
 *   cascade    "+N" floats merge after the first few (<= ~12 on screen at 800x450); CHAIN xN + the strike total
 *   run end    FULL POWER: a flash sweeps the city, fireworks from the tallest towers, fanfare; the orbit
 *
 * Camera (GAME_BRIEF "Camera"): landscape FOV 45 at 38 deg pitch, portrait FOV 55 at 48 deg; the
 * city's bounding box is fitted inside the HUD-free part of the screen; exponential follow (3/s)
 * toward the active bolt fronts with a 15% dolly-in.
 */

import { Color, MathUtils, Mesh, MeshBasicMaterial, RingGeometry, Vector3 } from "three";
import { STORM } from "../config.js";
import { t } from "../core/i18n.js";
import { AdaptiveQuality } from "../core/quality.js";
import { CameraShake } from "../fx/shake.js";
import { FxKit } from "../fx/fx-kit.js";
import { ToonBolts } from "../fx/toon-bolts.js";
import { createNumberPops } from "../fx/number-pop.js";
import { applyLook } from "../render/look.js";
import { CityMesh } from "./city-mesh.js";
import { LOOK, THEMES, backdropFor, themeOf } from "./look.js";
import { bandOf, nearestBuilding } from "./sim.js";

const U = 2.4;                                   // FxKit preset unit in metres (bolt widths, halos, sparks)
const _a = new Vector3();
const _b = new Vector3();
const _o3 = new Vector3();
const _v = new Vector3();
const _w = new Vector3();
const _scr = { x: 0, y: 0, visible: false };
const _scr2 = { x: 0, y: 0, visible: false };
const _g = { x: 0, z: 0 };
const LADDER = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];   // major pentatonic, one step per hop depth
const FIRST_FLOATS = 5;                          // single "+N" floats per strike before they merge
const MERGE_SEC = 0.2;
const lerp = (a, b, k) => a + (b - a) * k;
const RAD = Math.PI / 180;
const FRAMING = {
  // yaw: landscape 35 deg (the brief); portrait turns the square city closer to face-on (15 deg), so its
  // silhouette is narrower and the width-limited framing can bring it closer.
  landscape: { fov: 45, pitch: 38, yaw: 35, mx: 0.92, ylo: -0.84, yhi: 0.62 },
  portrait: { fov: 55, pitch: 48, yaw: 15, mx: 0.95, ylo: -0.74, yhi: 0.66 },
};
const YAW = 35 * RAD;

export class GameView {
  constructor(stage, { audio, ui, loop }) {
    this.stage = stage;
    this.audio = audio;
    this.ui = ui;
    this.loop = loop;
    // The look (WP-21 settings): applyLook swaps stage.render/resize in place, so main.js keeps calling them.
    this.look = applyLook(stage, {
      backdrop: backdropFor(THEMES[0]), toneMapping: "neutral", exposure: 1.08, shadowsStatic: true, shadowArea: 60,
      keyDir: [-0.75, 0.62, 0.5], rimDir: [0.2, 0.6, -1], bloom: { strength: 0.6, radius: 0.25, threshold: 2.2 },
    });
    this.look.key.shadow.radius = 5;
    const quality = AdaptiveQuality.of(stage.renderer);
    if (quality) quality.subscribe((tier) => this.look.setQuality(tier));
    // QA only (?qa=1): the look, so the harness can force a shadow-map refresh frame and read its cost.
    if (typeof location !== "undefined" && new URLSearchParams(location.search).get("qa") === "1") { window.__GS_LOOK__ = this.look; window.__GS_VIEW__ = this; }
    this.boltStyle = "classic";        // "classic" (glow bolts, ribbons.js, the default) | "toon" (outlined bolts, toon-bolts.js)
    this.toon = null;                  // created the first time the toon style is used
    this.cityMesh = new CityMesh(stage.scene);
    this.fx = new FxKit(stage.scene, { unit: U, sprites: 1400, ribbons: 30, outline: { color: LOOK.boltOutline, alpha: 0.55 } });
    const root = typeof document !== "undefined" ? document.getElementById("ui") : null;
    this.pops = root ? createNumberPops(root, { max: 8 }) : null;
    this.shake = new CameraShake({ maxOffset: 4, maxRoll: 0, decay: 1.4 });
    this.time = 0;
    this.boltHex = LOOK.boltGlow;
    this.boltColor = new Color(LOOK.boltGlow);
    this.yaw = YAW;
    this.camLook = new Vector3();
    this.camPos = new Vector3(0, 80, 80);
    this.follow = new Vector3();       // smoothed centroid of the active bolt fronts
    this.followW = 0;
    this.punch = 0;                    // FOV punch timer (s)
    this.orbitT = 0;                   // seconds since the run ended
    this.fit = { key: "", dist: 100, ty: 0, shift: 0, side: 0, fov: 45, pitch: 38 * RAD, yaw: YAW };
    this.floats = { n: 0, pending: 0, at: -9, x: 0, y: 0, z: 0 };
    this.forkShown = 1;
    this.lastHum = 0;
    this.lastCue = 0;
    this.aim = { index: -1, visible: false };
    this.chargeView = { x: 0, y: 0, charge: 0, lo: 0, hi: 0, band: "" };   // reused: no per-frame objects
    this.cameraOverride = null;
    this.safe = null;                  // setSafeArea(): screen space the UI leaves free for the city
    this.fxScale = 1;

    const ringGeo = new RingGeometry(0.86, 1.1, 40);
    ringGeo.rotateX(-Math.PI / 2);
    this.marker = new Mesh(ringGeo, new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false }));
    this.marker.name = "aim-marker";
    this.marker.renderOrder = 6;
    this.marker.visible = false;
    stage.scene.add(this.marker);
    if (typeof location !== "undefined" && new URLSearchParams(location.search).get("bolt") === "toon") this.setBoltStyle("toon");
  }

  // ------------------------------------------------------------------ bolt style (playtest comparison: classic vs toon)
  /** "classic" = the glow bolts (default, untouched); "toon" = the outlined alternative. */
  setBoltStyle(style) {
    this.boltStyle = style === "toon" ? "toon" : "classic";
    if (this.boltStyle === "toon") this.#toon();
    return this.boltStyle;
  }

  toggleBoltStyle() { return this.setBoltStyle(this.boltStyle === "toon" ? "classic" : "toon"); }

  #toon() {
    if (!this.toon) { this.toon = new ToonBolts(this.stage.scene, this.stage.camera); this.toon.setSkin(this.boltHex); }
    return this.toon;
  }

  setCameraOverride(o) { this.cameraOverride = o; }

  /**
   * Keep the city inside the screen area the UI leaves free: { top, bottom, left, right } in px from
   * each edge (the city intro's cards and offers), or null for the run framing. The camera eases over.
   */
  setSafeArea(a) {
    const r = (v) => Math.round(Math.max(0, v || 0) / 8) * 8;   // 8 px steps: no refit on sub-pixel layout noise
    this.safe = a ? { top: r(a.top), bottom: r(a.bottom), left: r(a.left), right: r(a.right) } : null;
  }

  build(sim) {
    const theme = themeOf(sim.city);
    this.theme = theme;
    this.look.setBackdrop(backdropFor(theme));
    this.fx.clear();
    this.toon?.clear();
    this.cityMesh.build(sim.city, sim.seed, theme, this.fx);
    const r = Math.max(sim.city.width, sim.city.depth) * 0.62 + 14;
    this.look.setFocus(0, 0, 0, r);
    this.look.refreshShadows();
    this.shake.trauma = 0;
    this.followW = 0;
    this.forkShown = 1;
    this.orbitT = 0;
    this.floats.n = 0;
    this.floats.pending = 0;
    this.fit.key = "";
    this.pops?.clear();
    this.snapCamera(sim);
  }

  /** The equipped (or tried) bolt skin: its glow colour; the core stays white, the outline deep blue. */
  recolor(hex) { this.boltHex = hex || LOOK.boltGlow; this.boltColor.set(this.boltHex); this.toon?.setSkin(this.boltHex); }

  toScreen(x, y, z, out = { x: 0, y: 0, visible: false }) {
    _v.set(x, y, z).project(this.stage.camera);
    out.x = (_v.x * 0.5 + 0.5) * this.stage.size.width;
    out.y = (-_v.y * 0.5 + 0.5) * this.stage.size.height;
    out.visible = _v.z > -1 && _v.z < 1 && Math.abs(_v.x) < 1.05 && Math.abs(_v.y) < 1.05;
    return out;
  }

  /** The ground point (y = 0) under a screen point (canvas px). */
  screenToGround(sx, sy, out) {
    const cam = this.stage.camera;
    _v.set((sx / this.stage.size.width) * 2 - 1, -(sy / this.stage.size.height) * 2 + 1, 0.5).unproject(cam);
    _w.copy(_v).sub(cam.position);
    if (Math.abs(_w.y) < 1e-6) return false;
    const k = -cam.position.y / _w.y;
    if (k < 0) return false;
    out.x = cam.position.x + _w.x * k;
    out.z = cam.position.z + _w.z * k;
    return true;
  }

  /**
   * Aim from a screen point (canvas px): the antenna nearest on screen within STORM.input.snapPx;
   * otherwise the nearest UNLIT building to the ground point under the finger (every press strikes).
   */
  pick(sim, sx, sy) {
    let best = -1, bd = Infinity;
    for (const b of sim.city.buildings) {
      this.toScreen(b.x, b.tipY, b.z, _scr);
      const d = (_scr.x - sx) ** 2 + (_scr.y - sy) ** 2;
      if (d < bd) { bd = d; best = b.id; }
    }
    if (bd <= STORM.input.snapPx ** 2) return best;
    if (this.screenToGround(sx, sy, _g)) {
      const u = nearestBuilding(sim, _g.x, _g.z, true);
      if (u >= 0) return u;
    }
    return best;
  }

  /** Keyboard crosshair: the antenna nearest in a screen direction from the current target. */
  stepAim(sim, from, dx, dy) {
    const bs = sim.city.buildings;
    if (from < 0 || from >= bs.length) return this.pick(sim, this.stage.size.width / 2, this.stage.size.height / 2);
    const a = bs[from];
    this.toScreen(a.x, a.tipY, a.z, _scr2);
    const len = Math.hypot(dx, dy) || 1;
    let best = from, bs2 = Infinity;
    for (const b of bs) {
      if (b.id === from) continue;
      this.toScreen(b.x, b.tipY, b.z, _scr);
      const ex = _scr.x - _scr2.x, ey = _scr.y - _scr2.y;
      const dist = Math.hypot(ex, ey) || 1;
      const cos = (ex * dx + ey * dy) / (dist * len);
      if (cos < 0.5) continue;                       // within 60 deg of the key's direction
      const score = dist * (1 + 2.5 * (1 - cos));
      if (score < bs2) { bs2 = score; best = b.id; }
    }
    return best;
  }

  snapCamera(sim) { this.#frame(sim, 0, true); }

  update(sim, alpha, rawDt) {
    const dt = rawDt * this.fxScale;       // 0 = effects frozen (QA screenshot staging only)
    this.time += dt;
    this.#events(sim);
    this.cityMesh.update(sim, this.time, this.stage.camera.quaternion, sim.charge, sim.holding);
    this.shake.update(dt);
    this.#flushFloats(false);
    this.#hum(sim);
    this.#frame(sim, dt, false);
    this.#marker(sim);
    this.#chargeRing(sim);
    this.#chargeCue(sim);
    this.fx.update(dt, this.stage.camera);
    this.toon?.update(dt, this.stage.camera);
  }

  // ------------------------------------------------------------------ bolts (the events call these; the bolt lab in tools/qa/shoot.mjs too)
  /**
   * The strike: the big bolt from the storm front onto a rooftop rod. band = weak | charged | super | hot | fizzle.
   * `life` (s) overrides the default so the QA bolt lab can hold a bolt at full strength.
   */
  strikeBolt(b, band, life) {
    if (this.boltStyle === "toon") return this.#strikeToon(b, band, life);
    // CLASSIC (the owner's liked look): exactly the original values.
    const fx = this.fx, glow = this.boltHex;
    const fizzle = band === "fizzle", sup = band === "super";
    this.cityMesh.strikeOrigin(b, _o3);
    _a.set(b.x, b.tipY, b.z);
    fx.strike(_o3, _a, {
      color: sup ? LOOK.super : glow, width: fizzle ? 0.9 : sup ? 3.2 : 2.6, forks: fizzle ? 0 : sup ? 3 : 2, forkLength: 0.25,
      arc: 0, jag: 0.09, life: life ?? 0.55, intensity: 1.5, core: 3.2, haloSize: fizzle ? 1.4 : sup ? 3 : 2.4, sparks: fizzle ? 8 : 34, sparkSize: 0.2, ringDrop: 3, beads: 3,
    });
    if (sup) fx.bolt(_o3, _a, { color: glow, width: 1.8, forks: 1, jag: 0.14, life: life ?? 0.5, fromHalo: false, beads: 0 });
  }

  /** One hop from rooftop tip to rooftop tip: the bolt, a flash and sparks where it lands. `gen` = fork generation. */
  hopBolt(a, b, gen = 0, life) {
    if (this.boltStyle === "toon") return this.#hopToon(a, b, gen, life);
    // CLASSIC (the owner's liked look): exactly the original values.
    const fx = this.fx, glow = this.boltHex;
    const g = Math.min(4, gen);
    _a.set(a.x, a.tipY, a.z); _b.set(b.x, b.tipY, b.z);
    fx.bolt(_a, _b, { color: glow, width: 2.1 + g * 0.12, forks: 1, forkLength: 0.3, arc: 1.4, jag: 0.12, life: life ?? 0.6, intensity: 1.5, core: 3.2, beads: 2, fromHalo: false, haloSize: 2 });
    fx.glow(_b, { color: glow, size: 2.6, grow: 1.5, life: 0.4, intensity: 2.2 });
    fx.sparks(_b, { count: 6, color: LOOK.spark, speed: 5, up: 3, size: 0.18, life: 0.45 });
  }

  /** TOON strike: a chunky outlined zig-zag (white core, skin colour, dark outline), a flat ring and sparks on the roof. */
  #strikeToon(b, band, life = 0.42) {
    const fizzle = band === "fizzle", sup = band === "super";
    this.cityMesh.strikeOrigin(b, _o3);
    _a.set(b.x, b.tipY, b.z);
    const toon = this.#toon();
    toon.strike(_o3, _a, { color: sup ? LOOK.super : this.boltHex, width: (fizzle ? 0.8 : sup ? 2.5 : 2.1) * U, forks: fizzle ? 0 : sup ? 3 : 2, forkLength: 0.2, jag: 0.045, segs: 9, life, flicker: 0.09 });
    if (sup) toon.strike(_o3, _a, { color: this.boltHex, width: 1.2 * U, forks: 1, forkLength: 0.2, jag: 0.07, segs: 9, life: life * 0.9, flicker: 0.09 });
    if (!fizzle) this.#flash(sup ? 0.34 : 0.26);
    this.fx.impact(_a, { color: "#ffffff", size: fizzle ? 1.4 : sup ? 3 : 2.4, sparks: fizzle ? 8 : 34, sparkSize: 0.2, ringDrop: 3 });
  }

  /** TOON strike only: a short white flash over the whole picture (once per strike, <= 0.34 alpha, 0.14 s - well under 3 flashes/s). */
  #flash(alpha) {
    if (typeof document === "undefined") return;
    if (!this.flashEl) {
      const root = document.getElementById("ui");
      if (!root) return;
      const el = document.createElement("div");
      el.style.cssText = "position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:2";
      root.prepend(el);
      this.flashEl = el;
    }
    this.flashEl.animate([{ opacity: alpha }, { opacity: 0 }], { duration: 140, easing: "ease-out" });
  }

  /** TOON hop: a short, sharp, outlined zig-zag; a white flash, a flat ring on the roof and sparks where it lands. */
  #hopToon(a, b, gen, life = 0.3) {
    const g = Math.min(4, gen);
    _a.set(a.x, a.tipY, a.z); _b.set(b.x, b.tipY, b.z);
    this.#toon().strike(_a, _b, { color: this.boltHex, width: (1.6 + g * 0.1) * U, forks: 1, forkLength: 0.3, jag: 0.15, arc: 0.9 * U, segs: 5, life, flicker: 0.09 });
    this.fx.glow(_b, { color: "#ffffff", size: 2.0, grow: 1.4, life: 0.22, intensity: 2.2 });
    this.fx.ring(_o3.set(b.x, b.h + 0.8, b.z), { color: this.boltHex, from: 0.5, to: Math.max(b.w, b.d) / U, life: 0.26, thickness: 0.14, intensity: 1.0, normal: [0, 1, 0] });
    this.fx.sparks(_b, { count: 6, color: LOOK.spark, speed: 5, up: 3, size: 0.18, life: 0.45 });
  }

  // ------------------------------------------------------------------ events -> juice
  #events(sim) {
    const bs = sim.city.buildings;
    const fx = this.fx, glow = this.boltHex;
    for (const ev of sim.events) {
      switch (ev.type) {
        case "chargeStart":
          this.audio.play("charge", { pitch: 1 });
          this.lastHum = this.time;
          break;
        case "band":
          if (ev.band === "super") {
            this.audio.play("ding");
            const b = this.aim.index >= 0 ? bs[this.aim.index] : null;
            if (b) { fx.impact(_a.set(b.x, b.tipY, b.z), { color: LOOK.super, size: 2.2, sparks: 14, sparkSize: 0.18, ringDrop: 3 }); }
          } else this.audio.play("buzz");
          break;
        case "strike": {
          const b = bs[ev.target];
          const fizzle = ev.band === "fizzle";
          const sup = ev.band === "super";
          this.strikeBolt(b, ev.band);
          this.shake.add(fizzle ? 0.08 : sup ? 0.18 : 0.13);
          this.shake.trauma = Math.min(0.32, this.shake.trauma);
          this.punch = fizzle ? 0 : 0.12;
          if (!fizzle) this.loop.freeze(60);
          this.audio.play("thunder", { pitch: sup ? 1.1 : fizzle ? 0.7 : 0.9 });
          this.forkShown = ev.bolts > 1 ? 2 : 1;
          this.floats.n = 0;
          this.floats.pending = 0;
          this.follow.set(b.x, b.tipY, b.z);
          const s = this.toScreen(b.x, b.tipY + 4, b.z, _scr);
          if (sup) this.#floatAt(s.x, s.y - 40, t("supercharge"), "gold");
          else if (fizzle) { this.#floatAt(s.x, s.y - 40, t("fizzle"), "bad"); this.audio.play("fizzle"); }
          break;
        }
        case "hop": {
          this.hopBolt(bs[ev.from], bs[ev.to], ev.gen);
          // Crackle on a major-pentatonic ladder: one step per depth, +-3% detune.
          const semis = LADDER[Math.min(LADDER.length - 1, Math.max(0, ev.depth - 1))];
          this.audio.play("crackle", { pitch: 2 ** (semis / 12) * (0.97 + Math.random() * 0.06), minGap: 0.03, maxVoices: 6, volume: 0.8 });
          break;
        }
        case "light": {
          const b = bs[ev.b];
          if (ev.gold) {
            _a.set(b.x, b.tipY, b.z);
            fx.impact(_a, { color: LOOK.gold, size: 3.4, sparks: 26, sparkSize: 0.22, ringDrop: 3 });
            fx.coinBurst(_a, { count: 8, speed: 3, size: 0.7, life: 1.4 });
            this.audio.play("gold");
          }
          this.#float(b, ev.value, ev.gold);
          break;
        }
        case "fork": {
          const b = bs[ev.at];
          fx.glow(_a.set(b.x, b.tipY, b.z), { color: "#ffffff", size: 2.4, grow: 1.4, life: 0.3, intensity: 2.4 });
          if (ev.bolts >= this.forkShown * 2) {
            this.forkShown = 2 ** Math.floor(Math.log2(ev.bolts));
            const s = this.toScreen(b.x, b.tipY + 6, b.z, _scr);
            if (s.visible) this.#floatAt(s.x, s.y - 30, t("fork_x", { n: this.forkShown }), "merge");
            const step = Math.min(LADDER.length - 1, Math.floor(Math.log2(ev.bolts)) + 1);
            this.audio.play("fork", { pitch: 2 ** (LADDER[step] / 12), minGap: 0.05 });
          }
          break;
        }
        case "boltEnd": {
          const b = bs[ev.at];
          if (ev.grounded) {
            _a.set(b.x, b.tipY, b.z); _b.set(b.x + 3, 0.4, b.z + 2);
            fx.bolt(_a, _b, { color: glow, width: 0.25, forks: 0, arc: 0, life: 0.25, beads: 0, fromHalo: false });
            fx.sparks(_b, { count: 5, color: glow, speed: 3, up: 2, size: 0.16, life: 0.35 });
          }
          break;
        }
        case "district": {
          this.#flushFloats(true);
          const d = sim.city.districts[ev.d];
          this.cityMesh.districtWave(ev.d, this.time);
          fx.ring(_a.set(d.x, 0.6, d.z), { color: LOOK.super, from: 0.5, to: (d.w * 0.5) / U, life: 0.7, thickness: 0.1, intensity: 1.3, normal: [0, 1, 0] });
          this.ui.showWorld(t("block_powered"), `+${ev.bonus}`);
          this.audio.play("district");
          this.shake.add(0.1);
          this.shake.trauma = Math.min(0.3, this.shake.trauma);
          break;
        }
        case "cascadeEnd": {
          this.#flushFloats(true);
          const s = this.toScreen(this.follow.x, this.cityMesh.top * 0.8, this.follow.z, _scr);
          const x = s.visible ? s.x : this.stage.size.width / 2, y = s.visible ? s.y - 40 : this.stage.size.height * 0.3;
          const cx = Math.min(this.stage.size.width * 0.8, Math.max(this.stage.size.width * 0.2, x));
          const cy = Math.max(this.stage.size.height * 0.24, y);
          if (ev.hops >= 6) {
            if (this.pops) this.pops.combo(cx, cy, t("chain_x", { n: ev.hops }), { size: 0.85, duration: 1300 });
            else this.#floatAt(cx, cy, t("chain_x", { n: ev.hops }), "gold");
          }
          if (ev.value > 0 && ev.hops >= FIRST_FLOATS) {
            if (this.pops) this.pops.pop(cx, cy + 46, `+${ev.value}`, { kind: "gold", size: 0.9, duration: 1200 });
            else this.#floatAt(cx, cy + 44, `+${ev.value}`, "merge");
          }
          break;
        }
        case "runEnd":
          this.orbitT = 0;
          if (ev.share >= 1) {
            this.cityMesh.sweep(this.time);
            const tall = [...bs].sort((p, q) => q.tipY - p.tipY).slice(0, 5);
            tall.forEach((b, i) => {
              // fireworks: radial bursts high above the tallest towers, staggered by height
              _a.set(b.x, b.tipY + 14 + i * 3, b.z);
              const col = this.theme?.lit[i % this.theme.lit.length] ?? LOOK.gold;
              fx.sparks(_a, { count: 30, colors: [col, "#ffffff", LOOK.gold], speed: 9, up: 0, size: 0.3, life: 1.3, gravity: 2.5, stretch: 0.03 });
              fx.glow(_a, { color: col, size: 5, grow: 1.6, life: 0.5, intensity: 2 });
              fx.sparks(_b.set(b.x, b.tipY, b.z), { count: 10, color: LOOK.gold, speed: 5, up: 6, size: 0.22, life: 0.9 });
            });
            this.audio.play("powerSweep");
            this.audio.play("fanfare", { volume: 0.9 });
          } else this.audio.play(ev.phase === "won" ? "win" : "fail", { pitch: ev.phase === "won" ? 1 : 0.9 });
          break;
        case "extraStrike":
          this.audio.play("charge", { pitch: 1.4 });
          break;
        default:
          break;
      }
    }
    sim.events.length = 0;
  }

  /** ui.floatText kept inside the readable part of the screen (never under the HUD or off an edge). */
  #floatAt(x, y, text, kind) {
    const W = this.stage.size.width, H = this.stage.size.height;
    this.ui.floatText(Math.min(W * 0.9, Math.max(W * 0.1, x)), Math.min(H * 0.86, Math.max(H * 0.2, y)), text, kind);
  }

  /** Charge cues on the target: a gold pulse in the SUPERCHARGE band, red sparks when overcharged. */
  #chargeCue(sim) {
    const b = this.aim.index >= 0 ? sim.city.buildings[this.aim.index] : null;
    if (!b || !sim.holding || sim.phase !== "run" || this.time - this.lastCue < 0.14) return;
    const band = bandOf(sim, sim.charge);
    if (band !== "super" && band !== "over") return;
    this.lastCue = this.time;
    _a.set(b.x, b.tipY, b.z);
    if (band === "super") {
      this.fx.glow(_a, { color: LOOK.super, size: 3.4, grow: 1.3, life: 0.22, intensity: 2.2 });
      this.fx.ring(_b.set(b.x, b.h + 0.8, b.z), { color: LOOK.super, from: 0.6, to: Math.max(b.w, b.d) / U, life: 0.3, thickness: 0.25, intensity: 1.6, normal: [0, 1, 0] });
    }
    else this.fx.sparks(_a, { count: 6, color: LOOK.over, speed: 4, up: 3, size: 0.2, life: 0.35 });
  }

  /** "+N" at a rooftop: the first few of a strike one by one, then merged every MERGE_SEC. */
  #float(b, value, gold) {
    const f = this.floats;
    f.n++;
    if (f.n <= FIRST_FLOATS || gold) {
      const s = this.toScreen(b.x, b.tipY + 3, b.z, _scr);
      if (s.visible) this.#floatAt(s.x, s.y, `+${value}`, gold ? "gold" : "good");
      return;
    }
    f.pending += value;
    f.x = b.x; f.y = b.tipY; f.z = b.z;
  }

  #flushFloats(force) {
    const f = this.floats;
    if (f.pending <= 0 || (!force && this.time - f.at < MERGE_SEC)) return;
    const s = this.toScreen(f.x, f.y + 3, f.z, _scr);
    if (s.visible) this.#floatAt(s.x, s.y, `+${f.pending}`, f.pending >= 20 ? "gold" : "good");
    f.pending = 0;
    f.at = this.time;
  }

  /** The charge hum: re-triggered short tones whose pitch (1 -> 2) and volume (0.3 -> 0.8) follow the charge. */
  #hum(sim) {
    if (!sim.holding || this.time - this.lastHum < 0.11) return;
    this.lastHum = this.time;
    const c = Math.min(1, sim.charge);
    this.audio.play("hum", { pitch: 1 + c, volume: 0.3 + 0.5 * c, maxVoices: 2 });
  }

  #marker(sim) {
    const a = this.aim;
    const b = a.index >= 0 ? sim.city.buildings[a.index] : null;
    const show = !!b && a.visible && (sim.phase === "ready" || sim.phase === "run");
    this.marker.visible = show;
    if (!show) return;
    const c = sim.holding ? sim.charge : 0;
    const band = sim.holding ? bandOf(sim, c) : "weak";
    const s = (Math.max(b.w, b.d) * 0.62 + 1) * (sim.holding ? 1.25 - Math.min(1, c) * 0.45 : 1 + Math.sin(this.time * 4) * 0.06);
    this.marker.position.set(b.x, b.h + 0.4, b.z);
    this.marker.scale.set(s, 1, s);
    this.marker.material.color.set(band === "over" ? LOOK.over : band === "super" ? LOOK.super : "#ffffff");
    this.marker.material.opacity = sim.holding ? 1 : 0.65;
  }

  /** The DOM charge ring around the target (ui.setCharge): fill, gold band, red overcharge. */
  #chargeRing(sim) {
    const a = this.aim;
    const b = a.index >= 0 ? sim.city.buildings[a.index] : null;
    if (!b || !sim.holding || sim.phase !== "run") { this.ui.setCharge(null); return; }
    const s = this.toScreen(b.x, b.tipY, b.z, _scr);
    const p = sim.params, c = this.chargeView;
    c.x = s.x; c.y = s.y; c.charge = sim.charge; c.lo = p.bandLo; c.hi = p.bandHi; c.band = bandOf(sim, sim.charge);
    this.ui.setCharge(c);
  }

  // ------------------------------------------------------------------ camera
  /**
   * Fit the city inside the HUD-free part of the screen (cached per size and city): the district pads'
   * corners and every roof corner + antenna tip must project inside the framing's NDC box.
   */
  #fitCity(sim, portrait, aspect) {
    const F = portrait ? FRAMING.portrait : FRAMING.landscape;
    const city = sim.city;
    const sa = this.safe;
    const key = `${this.stage.size.width}x${this.stage.size.height}:${city.level}:${sim.seed}:${sa ? `${sa.top},${sa.bottom},${sa.left},${sa.right}` : ""}`;
    if (this.fit.key === key) return this.fit;
    // The free NDC box: the framing's own margins, tightened by the UI's safe area when one is set.
    const W = this.stage.size.width || 1, H = this.stage.size.height || 1;
    const xlo = Math.max(-F.mx, sa ? -1 + (2 * sa.left) / W : -1), xhi = Math.min(F.mx, sa ? 1 - (2 * sa.right) / W : 1);
    const yhi = Math.min(F.yhi, sa ? 1 - (2 * sa.top) / H : 1), ylo = Math.max(F.ylo, sa ? -1 + (2 * sa.bottom) / H : -1);
    const pts = [];
    for (const d of city.districts) {
      const hw = d.w / 2 + 0.8, hd = d.d / 2 + 0.8;
      pts.push(d.x - hw, 0, d.z - hd, d.x + hw, 0, d.z - hd, d.x - hw, 0, d.z + hd, d.x + hw, 0, d.z + hd);
    }
    let top = 0;
    for (const b of city.buildings) {
      const hw = b.w / 2, hd = b.d / 2;
      pts.push(b.x - hw, b.h, b.z - hd, b.x + hw, b.h, b.z - hd, b.x - hw, b.h, b.z + hd, b.x + hw, b.h, b.z + hd, b.x, b.tipY, b.z);
      top = Math.max(top, b.tipY);
    }
    const pitch = F.pitch * RAD, yaw = F.yaw * RAD;
    const tv = Math.tan((F.fov * RAD) / 2), th = tv * aspect;
    // camera basis for this yaw / pitch: dir from target to camera, right, up (forward = -dir)
    const dx = Math.sin(yaw) * Math.cos(pitch), dy = Math.sin(pitch), dz = Math.cos(yaw) * Math.cos(pitch);
    const rx = Math.cos(yaw), rz = -Math.sin(yaw);
    const ux = -Math.sin(pitch) * Math.sin(yaw), uy = Math.cos(pitch), uz = -Math.sin(pitch) * Math.cos(yaw);
    const ty = top * 0.2;
    const span = (d) => {
      let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity, zc = 0;
      for (let i = 0; i < pts.length; i += 3) {
        const vx = pts[i] - dx * d, vy = pts[i + 1] - ty - dy * d, vz = pts[i + 2] - dz * d;
        const z = -(vx * dx + vy * dy + vz * dz);
        const x = (vx * rx + vz * rz) / (z * th);
        const y = (vx * ux + vy * uy + vz * uz) / (z * tv);
        xmin = Math.min(xmin, x); xmax = Math.max(xmax, x); ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); zc += z;
      }
      return { xmin, xmax, ymin, ymax, zc: zc / (pts.length / 3) };
    };
    let lo = 5, hi = 5000;
    for (let it = 0; it < 40; it++) {
      const mid = (lo + hi) / 2;
      const r = span(mid);
      if (r.xmax - r.xmin <= Math.max(0.2, xhi - xlo) && r.ymax - r.ymin <= Math.max(0.2, yhi - ylo)) hi = mid; else lo = mid;
    }
    const r = span(hi);
    // Centre the city in the free box: shift the target along the camera's up and right axes.
    const shift = ((r.ymin + r.ymax) / 2 - (ylo + yhi) / 2) * r.zc * tv;
    const side = ((r.xmin + r.xmax) / 2 - (xlo + xhi) / 2) * r.zc * th;
    Object.assign(this.fit, { key, dist: hi, fov: F.fov, pitch, yaw, ty, shift, side });
    return this.fit;
  }

  /** Elevated 3/4 view over the whole city; follows the bolt fronts, punches on impact, orbits at the end. */
  #frame(sim, dt, snap) {
    const cam = this.stage.camera;
    const aspect = this.stage.size.aspect || 16 / 9;
    const portrait = aspect < 1;
    const fit = this.#fitCity(sim, portrait, aspect);
    // FOV punch on impact.
    this.punch = Math.max(0, this.punch - dt);
    const fov = fit.fov - 4 * (this.punch / 0.12);
    if (Math.abs(cam.fov - fov) > 1e-3) { cam.fov = fov; cam.updateProjectionMatrix(); }
    if (this.cameraOverride) {
      const o = this.cameraOverride;
      cam.position.set(o.pos[0], o.pos[1], o.pos[2]);
      cam.lookAt(o.look[0], o.look[1], o.look[2]);
      return;
    }
    const done = sim.phase === "won" || sim.phase === "failed";
    this.cityMesh.setCloudYaw(this.yaw - fit.yaw);
    if (done) {
      this.orbitT += dt;
      this.yaw += dt * (this.orbitT < 3 ? 20 : 4) * RAD;       // result orbit
    } else if (sim.phase === "ready") this.yaw = fit.yaw + Math.sin(this.time * 0.25) * 8 * RAD;   // idle drift (<= 2 deg/s)
    else this.yaw = lerp(this.yaw, fit.yaw, 1 - Math.exp(-1.2 * dt));
    // Follow the active bolt fronts.
    let n = 0, cx = 0, cz = 0;
    for (const b of sim.bolts) { const bb = sim.city.buildings[b.at]; cx += bb.x; cz += bb.z; n++; }
    if (n) {
      const k = 1 - Math.exp(-3 * dt);
      this.follow.x = lerp(this.follow.x, cx / n, k);
      this.follow.z = lerp(this.follow.z, cz / n, k);
      this.followW = Math.min(1, this.followW + dt * 3);
    } else this.followW = Math.max(0, this.followW - dt * 0.8);
    const w = snap ? 0 : MathUtils.smoothstep(this.followW, 0, 1);
    const dist = fit.dist * (1 - 0.15 * w);
    // The fit's vertical shift is along the camera's up axis, which turns with the yaw.
    const sp = Math.sin(fit.pitch), cp = Math.cos(fit.pitch);
    const tx = -sp * Math.sin(this.yaw) * fit.shift + Math.cos(this.yaw) * fit.side + this.follow.x * 0.3 * w;
    const ty = fit.ty + cp * fit.shift;
    const tz = -sp * Math.cos(this.yaw) * fit.shift - Math.sin(this.yaw) * fit.side + this.follow.z * 0.3 * w;
    const px = tx + Math.sin(this.yaw) * Math.cos(fit.pitch) * dist;
    const py = ty + Math.sin(fit.pitch) * dist;
    const pz = tz + Math.cos(this.yaw) * Math.cos(fit.pitch) * dist;
    const k = snap ? 1 : 1 - Math.exp(-3 * dt);
    this.camPos.x = lerp(this.camPos.x, px, k); this.camPos.y = lerp(this.camPos.y, py, k); this.camPos.z = lerp(this.camPos.z, pz, k);
    this.camLook.x = lerp(this.camLook.x, tx, k); this.camLook.y = lerp(this.camLook.y, ty, k); this.camLook.z = lerp(this.camLook.z, tz, k);
    this.shake.maxOffset = fit.dist * 0.05;
    const o = this.shake.offset;
    cam.position.set(this.camPos.x + o.x, this.camPos.y + o.y, this.camPos.z + o.z);
    cam.lookAt(this.camLook);
    const far = fit.dist * 4;
    if (Math.abs(cam.far - far) > 1) { cam.far = far; cam.near = Math.max(0.1, fit.dist * 0.01); cam.updateProjectionMatrix(); }
    const fog = this.stage.scene.fog;
    if (fog) { fog.near = fit.dist * LOOK.fogNear; fog.far = fit.dist * LOOK.fogFar; }
  }
}


