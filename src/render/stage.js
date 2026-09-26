/**
 * Renderer, scene, camera, lights, sky and fog.
 *
 * Choices and why:
 *  - WebGLRenderer, not WebGPURenderer: widest reach (Chromebooks, Safari, the
 *    CrazyGames iOS/Android apps). Revisit only with measured need.
 *  - NeutralToneMapping: keeps saturated hypercasual colours saturated
 *    (ACES shifts hues and crushes highlights).
 *  - RoomEnvironment through PMREM: soft glossy highlights on the characters
 *    with zero downloaded files.
 *  - No real-time shadow maps: blob shadows are drawn per unit instead
 *    (cheaper, stable on low-end GPUs, and they read better at small sizes).
 *  - Gradient sky as a background texture + matching Fog: depth for free.
 */

import {
  CanvasTexture, DirectionalLight, Fog, HemisphereLight, NeutralToneMapping,
  PMREMGenerator, PerspectiveCamera, SRGBColorSpace, Scene, WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export function createStage(canvas) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", stencil: false });
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 16 / 9, 0.1, 600);

  const hemi = new HemisphereLight(0xffffff, 0x555577, 2.1);
  const sun = new DirectionalLight(0xffffff, 1.9);
  sun.position.set(-6, 14, 8);
  scene.add(hemi, sun);

  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  room.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
  pmrem.dispose();
  if ("environmentIntensity" in scene) scene.environmentIntensity = 0.5;

  const skyCanvas = document.createElement("canvas");
  skyCanvas.width = 4;
  skyCanvas.height = 256;
  const sky = new CanvasTexture(skyCanvas);
  sky.colorSpace = SRGBColorSpace;
  scene.background = sky;
  scene.fog = new Fog(0x8e94dc, 38, 150);

  function setTheme(theme) {
    const ctx = skyCanvas.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, theme.skyTop);
    g.addColorStop(0.62, theme.fog);
    g.addColorStop(1, theme.skyBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 256);
    sky.needsUpdate = true;
    scene.fog.color.set(theme.fog);
    hemi.color.set(theme.hemiSky);
    hemi.groundColor.set(theme.hemiGround);
  }

  const size = { width: 0, height: 0, aspect: 1 };

  /** Cheap to call every frame: only does work when the canvas size changed. */
  function resize() {
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    if (w === size.width && h === size.height) return false;
    size.width = w;
    size.height = h;
    size.aspect = w / h;
    renderer.setSize(w, h, false);
    // Hold a roughly constant HORIZONTAL field of view so the track fits in
    // portrait (mobile) and does not look zoomed-out in landscape.
    const hfov = (64 * Math.PI) / 180;
    const vfov = (2 * Math.atan(Math.tan(hfov / 2) / size.aspect) * 180) / Math.PI;
    camera.fov = Math.min(78, Math.max(46, vfov));
    camera.aspect = size.aspect;
    camera.updateProjectionMatrix();
    return true;
  }

  return { renderer, scene, camera, size, setTheme, resize, render: () => renderer.render(scene, camera) };
}
