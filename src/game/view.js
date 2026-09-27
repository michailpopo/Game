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
const _o = { x: 0, y: 0, z: 0 };
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
    this.cityMesh = new CityMesh(stage.scene);
    this.bolts = new BoltMesh(stage.scene, { unit: U });
    this.shake = new CameraShake({ maxOffset: 4, maxRoll: 0, decay: 1.4 });
    this.time = 0;
    this.boltColor = new Color(LOOK.boltGlow);
    this.hot = new Color(LOOK.boltCore);
    this.gold = new Color(LOOK.gold);
    this.superCol = new Color(LOOK.super);
    this.spark = new Color(LOOK.spark);
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

    // Night: dim the template's day lights (the look kit brings its own rig).
    stage.scene.traverse((o) => {
      if (o.isHemisphereLight) o.intensity = LOOK.hemiIntensity;
      if (o.isDirectionalLight) { o.intensity = LOOK.sunIntensity; o.color.set(LOOK.sunColor); }
    });
    if ("environmentIntensity" in stage.scene) stage.scene.environmentIntensity = 0.12;
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
    this.stage.setTheme({ ...LOOK, fog: theme.fog });
    this.cityMesh.build(sim.city, sim.seed);
    this.bolts.clear();
    this.shake.trauma = 0;
    this.followW = 0;
    this.forkShown = 1;
    this.orbitT = 0;
    this.floats.n = 0;
    this.floats.pending = 0;
    this.fit.key = "";
    this.snapCamera(sim);
  }

  /** The equipped bolt skin. */
  recolor(hex) { this.boltColor.set(hex || LOOK.boltGlow); }

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
    this.bolts.update(dt, this.stage.camera, this.time);
    this.shake.update(dt);
    this.#flushFloats(false);
    this.#hum(sim);
    this.#frame(sim, dt, false);
    this.#marker(sim);
    this.#chargeRing(sim);
  }

  // ------------------------------------------------------------------ events -> juice
  #events(sim) {
    const bs = sim.city.buildings;
    for (const ev of sim.events) {
      switch (ev.type) {
        case "chargeStart":
          this.audio.play("charge", { pitch: 1 });
          this.lastHum = this.time;
          break;
        case "band":
          if (ev.band === "super") this.audio.play("ding");
          else this.audio.play("buzz");
          break;
        case "strike": {
          const b = bs[ev.target];
          const fizzle = ev.band === "fizzle";
          const sup = ev.band === "super";
          this.cityMesh.strikeOrigin(b, _o);
          // The main bolt: storm front -> rooftop, in three jagged legs.
          const mx = lerp(_o.x, b.x, 0.45) + (b.x - _o.x) * 0.08, my = lerp(_o.y, b.tipY, 0.45) + 8, mz = lerp(_o.z, b.z, 0.5);
          const nx = lerp(_o.x, b.x, 0.78), ny = lerp(_o.y, b.tipY, 0.8), nz = lerp(_o.z, b.z, 0.8) + 4;
          const w = (fizzle ? 0.35 : sup ? 1.1 : 0.75) * U;
          const col = sup ? this.superCol : this.boltColor;
          this.bolts.segment(_o.x, _o.y, _o.z, mx, my, mz, col, w, 0.55, ev.n * 11);
          this.bolts.segment(mx, my, mz, nx, ny, nz, col, w, 0.55, ev.n * 11 + 3);
          this.bolts.segment(nx, ny, nz, b.x, b.tipY, b.z, col, w, 0.55, ev.n * 11 + 7);
          this.bolts.halo(b.x, b.tipY, b.z, (fizzle ? 4 : 11) * U, this.hot, 0.5);
          this.bolts.halo(b.x, b.tipY, b.z, (fizzle ? 6 : 18) * U, col, 0.35);
          this.bolts.sparks(b.x, b.tipY, b.z, fizzle ? 8 : 34, this.spark, 8 * U, 0.22 * U);
          this.shake.add(fizzle ? 0.08 : sup ? 0.15 : 0.12);
          this.shake.trauma = Math.min(0.3, this.shake.trauma);
          this.punch = fizzle ? 0 : 0.12;
          if (!fizzle) this.loop.freeze(60);
          this.audio.play("thunder", { pitch: sup ? 1.1 : fizzle ? 0.7 : 0.9 });
          this.forkShown = ev.bolts > 1 ? 2 : 1;
          this.floats.n = 0;
          this.floats.pending = 0;
          this.follow.set(b.x, b.tipY, b.z);
          const s = this.toScreen(b.x, b.tipY + 4, b.z, _scr);
          if (sup) this.ui.floatText(s.x, s.y - 40, t("supercharge"), "gold");
          else if (fizzle) { this.ui.floatText(s.x, s.y - 40, t("fizzle"), "bad"); this.audio.play("fizzle"); }
          break;
        }
        case "hop": {
          const a = bs[ev.from], b = bs[ev.to];
          const gen = Math.min(4, ev.gen);
          const col = gen >= 2 ? _mix(this.boltColor, this.hot, 0.2 * (gen - 1)) : this.boltColor;
          this.bolts.segment(a.x, a.tipY, a.z, b.x, b.tipY, b.z, col, (0.5 + gen * 0.08) * U, 0.7, ev.bolt * 31 + ev.depth);
          this.bolts.halo(b.x, b.tipY, b.z, (4.5 + gen * 0.5) * U, col, 0.4);
          this.bolts.sparks(b.x, b.tipY, b.z, 5, this.spark, 5 * U, 0.14 * U, 0.45);
          // Crackle on a major-pentatonic ladder: one step per depth, +-3% detune.
          const semis = LADDER[Math.min(LADDER.length - 1, Math.max(0, ev.depth - 1))];
          this.audio.play("crackle", { pitch: 2 ** (semis / 12) * (0.97 + Math.random() * 0.06), minGap: 0.03, maxVoices: 6, volume: 0.8 });
          break;
        }
        case "light": {
          const b = bs[ev.b];
          if (ev.gold) {
            this.bolts.halo(b.x, b.tipY, b.z, 14 * U, this.gold, 0.6);
            this.bolts.sparks(b.x, b.tipY, b.z, 26, this.gold, 7 * U, 0.24 * U);
            this.audio.play("gold");
          }
          this.#float(b, ev.value, ev.gold);
          break;
        }
        case "fork": {
          const b = bs[ev.at];
          this.bolts.halo(b.x, b.tipY, b.z, 6 * U, this.hot, 0.35);
          if (ev.bolts >= this.forkShown * 2) {
            this.forkShown = 2 ** Math.floor(Math.log2(ev.bolts));
            const s = this.toScreen(b.x, b.tipY + 6, b.z, _scr);
            if (s.visible) this.ui.floatText(s.x, s.y - 30, t("fork_x", { n: this.forkShown }), "merge");
            const step = Math.min(LADDER.length - 1, Math.floor(Math.log2(ev.bolts)) + 1);
            this.audio.play("fork", { pitch: 2 ** (LADDER[step] / 12), minGap: 0.05 });
          }
          break;
        }
        case "boltEnd": {
          const b = bs[ev.at];
          if (ev.grounded) this.bolts.segment(b.x, b.tipY, b.z, b.x + 2, 0.3, b.z + 1.5, this.boltColor, 0.2 * U, 0.3, ev.bolt * 7);
          this.bolts.sparks(b.x, ev.grounded ? 0.5 : b.tipY, b.z, 4, this.boltColor, 3 * U, 0.1 * U, 0.35);
          break;
        }
        case "district":
          this.#flushFloats(true);
          this.ui.showWorld(t("block_powered"), `+${ev.bonus}`);
          this.audio.play("district");
          this.shake.add(0.1);
          this.shake.trauma = Math.min(0.3, this.shake.trauma);
          break;
        case "cascadeEnd": {
          this.#flushFloats(true);
          const s = this.toScreen(this.follow.x, this.cityMesh.top * 0.8, this.follow.z, _scr);
          const x = s.visible ? s.x : this.stage.size.width / 2, y = s.visible ? s.y - 40 : this.stage.size.height * 0.3;
          if (ev.hops >= 6) this.ui.floatText(x, y, t("chain_x", { n: ev.hops }), "gold");
          if (ev.value > 0 && ev.hops >= FIRST_FLOATS) this.ui.floatText(x, y + 44, `+${ev.value}`, "merge");
          break;
        }
        case "runEnd":
          this.orbitT = 0;
          if (ev.share >= 1) {
            for (const b of bs) if ((b.id % 3) === 0) this.bolts.sparks(b.x, b.tipY, b.z, 4, this.gold, 6 * U, 0.2 * U, 1.2);
            this.audio.play("fanfare");
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

  /** "+N" at a rooftop: the first few of a strike one by one, then merged every MERGE_SEC. */
  #float(b, value, gold) {
    const f = this.floats;
    f.n++;
    if (f.n <= FIRST_FLOATS || gold) {
      const s = this.toScreen(b.x, b.tipY + 3, b.z, _scr);
      if (s.visible) this.ui.floatText(s.x, s.y, `+${value}`, gold ? "gold" : "good");
      return;
    }
    f.pending += value;
    f.x = b.x; f.y = b.tipY; f.z = b.z;
  }

  #flushFloats(force) {
    const f = this.floats;
    if (f.pending <= 0 || (!force && this.time - f.at < MERGE_SEC)) return;
    const s = this.toScreen(f.x, f.y + 3, f.z, _scr);
    if (s.visible) this.ui.floatText(s.x, s.y, `+${f.pending}`, f.pending >= 20 ? "gold" : "good");
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

const _mixC = new Color();
function _mix(a, b, k) { return _mixC.copy(a).lerp(b, Math.min(1, k)); }
