/**
 * Premium look (WP-20): turns a plain createStage() stage into a glossy, glowing, well-lit scene.
 *
 *   import { createStage } from "./render/stage.js";
 *   import { applyLook } from "./render/look.js";
 *   import { AdaptiveQuality } from "./core/quality.js";
 *
 *   const stage = createStage(canvas);
 *   const look = applyLook(stage, { backdrop: "storm", shadowArea: 26 });
 *   const quality = new AdaptiveQuality(stage.renderer, { onTier: (t) => look.setQuality(t) });
 *   // per frame, unchanged: stage.resize(); ...; quality.update(loop.frameMs, dt); stage.render();
 *
 * What it does (all verified against three r186):
 *  - tone mapping ("neutral" by default; "aces" | "agx") + sRGB output, exposure. Measured on the WP-20
 *    hero frame (qa/wp20/tonemap-*.png): Neutral keeps #4df3ff cyan and #ffd166 gold saturated; ACES
 *    bleaches bright cyan/gold toward white; AgX greys the whole frame (the "washed out" failure)
 *  - backdrop: an analytic full-screen gradient (vertical gradient, horizon band, two radial glows,
 *    stars, vignette, dithering) drawn behind everything - tone-mapped exactly like the scene on every
 *    tier, no texture, no banding; the band follows the camera's real horizon (alignHorizon) and the fog
 *    fades the ground into it, so there is never a visible "table edge"
 *  - light rig: hemisphere (sky/ground from the palette) + key directional with soft PCF shadows
 *    (shadow.radius Vogel-disk filter in r186; PCFSoftShadowMap is removed in r186 - not used) + a
 *    coloured rim light from behind
 *  - environment: a palette-tinted studio (gradient sphere + 3 HDR softboxes) through PMREMGenerator,
 *    so glossy/metal/glass materials reflect the backdrop's colours (RoomEnvironment: env: "room")
 *  - bloom: EffectComposer(MSAA HalfFloat target) -> RenderPass -> UnrealBloomPass -> OutputPass,
 *    only when the quality tier allows it; low/medium tiers render directly (no full-screen passes)
 *  - optional shadow catcher ground (ShadowMaterial) and static-shadow mode (render the shadow map
 *    once, e.g. a city that does not move: look.refreshShadows() after changes)
 *  - frame stats: renderer.info covers the WHOLE frame (scene + shadow + post passes); look.info()
 *    splits scene vs post
 *
 * API: look.setQuality(tier) · setBackdrop(nameOrPreset) · setFocus(x, y, z, radius) · refreshShadows()
 *      look.info() -> { calls, triangles, sceneCalls, sceneTriangles, postCalls, bloom, shadows, dpr }
 *      look.key / rim / hemi (lights) · look.bloomPass (strength/radius/threshold) · look.ground
 * `stage.render()` and `stage.resize()` keep working - applyLook swaps them in place.
 */

import {
  ACESFilmicToneMapping, AgXToneMapping, BackSide, BufferGeometry, Color, DirectionalLight, Float32BufferAttribute,
  Fog, HalfFloatType, Mesh, MeshBasicMaterial, NeutralToneMapping, PCFShadowMap, PMREMGenerator, PlaneGeometry,
  Scene, ShaderMaterial, ShadowMaterial, SphereGeometry, Vector2, Vector3, WebGLRenderTarget,
} from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { BACKDROPS } from "./palette.js";

const TONE = { aces: ACESFilmicToneMapping, agx: AgXToneMapping, neutral: NeutralToneMapping };

// ------------------------------------------------------------------ backdrop (full-screen triangle)
const BACKDROP_VERTEX = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4( position.xy, 1.0, 1.0 );
}`;

const BACKDROP_FRAGMENT = /* glsl */`
uniform vec3 uTop, uBottom, uHorizon, uGlow, uGlow2;
uniform vec2 uGlowAt, uGlow2At;
uniform float uGlowSize, uGlow2Size, uHorizonAt, uHorizonWidth, uVignette, uStars, uAspect;
varying vec2 vUv;
float bdHash( vec2 p ) { p = fract( p * vec2( 233.34, 851.73 ) ); p += dot( p, p + 23.45 ); return fract( p.x * p.y ); }
void main() {
  vec2 uv = vUv;
  vec3 c = mix( uBottom, uTop, smoothstep( 0.0, 1.0, uv.y ) );
  float hb = 1.0 - smoothstep( 0.0, uHorizonWidth, abs( uv.y - uHorizonAt ) );
  c += uHorizon * hb * hb;
  vec2 d1 = ( uv - uGlowAt ) * vec2( uAspect, 1.0 );
  c += uGlow * exp( - dot( d1, d1 ) / ( uGlowSize * uGlowSize ) );
  vec2 d2 = ( uv - uGlow2At ) * vec2( uAspect, 1.0 );
  c += uGlow2 * exp( - dot( d2, d2 ) / ( uGlow2Size * uGlow2Size ) );
  if ( uStars > 0.0 ) {
    vec2 p = uv * vec2( uAspect, 1.0 ) * 70.0;
    vec2 cell = floor( p );
    float h = bdHash( cell );
    vec2 o = vec2( bdHash( cell + 1.3 ), bdHash( cell + 7.1 ) ) - 0.5;
    float r = length( fract( p ) - 0.5 - o * 0.6 );
    float star = step( 1.0 - uStars * 0.12, h ) * smoothstep( 0.09, 0.0, r ) * ( 0.4 + 0.6 * bdHash( cell + 3.3 ) );
    c += vec3( 0.75, 0.8, 1.0 ) * star * smoothstep( uHorizonAt - 0.05, 1.0, uv.y ) * 0.6;
  }
  vec2 q = ( uv - 0.5 ) * vec2( 1.0, 1.15 );
  c *= 1.0 - uVignette * smoothstep( 0.18, 0.62, dot( q, q ) * 1.6 );
  c += ( bdHash( gl_FragCoord.xy ) - 0.5 ) / 255.0;
  gl_FragColor = vec4( max( c, 0.0 ), 1.0 );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

function createBackdropMesh() {
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const u = {
    uTop: { value: new Color() }, uBottom: { value: new Color() }, uHorizon: { value: new Color() },
    uGlow: { value: new Color() }, uGlow2: { value: new Color() },
    uGlowAt: { value: new Vector2(0.5, 0.5) }, uGlow2At: { value: new Vector2(0.5, 0.5) },
    uGlowSize: { value: 0.5 }, uGlow2Size: { value: 0.5 }, uHorizonAt: { value: 0.5 }, uHorizonWidth: { value: 0.2 },
    uVignette: { value: 0.4 }, uStars: { value: 0 }, uAspect: { value: 16 / 9 },
  };
  const mat = new ShaderMaterial({ uniforms: u, vertexShader: BACKDROP_VERTEX, fragmentShader: BACKDROP_FRAGMENT, depthWrite: false, depthTest: false });
  const mesh = new Mesh(geo, mat);
  mesh.name = "backdrop";
  mesh.frustumCulled = false;
  mesh.renderOrder = -1e9;
  return mesh;
}

// ------------------------------------------------------------------ palette environment
function buildEnvScene(b) {
  const scene = new Scene();
  const geo = new SphereGeometry(40, 24, 12);
  const top = new Color(b.env[0]), mid = new Color(b.env[1]), bot = new Color(b.env[2]);
  const pos = geo.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const c = new Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 40;
    if (y >= 0) c.copy(mid).lerp(top, Math.min(1, y / 0.55));
    else c.copy(mid).lerp(bot, Math.min(1, -y / 0.25));
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("color", new Float32BufferAttribute(col, 3));
  scene.add(new Mesh(geo, new MeshBasicMaterial({ vertexColors: true, side: BackSide })));
  // three HDR softboxes: top (broad), key side, rim back - the glints on glossy things
  const panel = new PlaneGeometry(1, 1);
  const boxes = [
    { color: b.envPanels[2], k: 3.2, pos: [0, 30, 4], size: [30, 16] },
    { color: b.envPanels[0], k: 4.5, pos: [-28, 10, 14], size: [10, 18] },
    { color: b.envPanels[1], k: 4.5, pos: [22, 6, -28], size: [14, 10] },
  ];
  for (const bx of boxes) {
    const m = new Mesh(panel, new MeshBasicMaterial({ color: new Color(bx.color).multiplyScalar(bx.k * (b.envPanelIntensity ?? 1)), side: BackSide }));
    m.position.set(...bx.pos);
    m.scale.set(bx.size[0], bx.size[1], 1);
    m.lookAt(0, 0, 0);
    scene.add(m);
  }
  return scene;
}

function disposeScene(scene) {
  scene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
}

// ------------------------------------------------------------------ applyLook
/**
 * @param {ReturnType<import("./stage.js").createStage>} stage
 * @param {{
 *   backdrop?: string|object, toneMapping?: "neutral"|"aces"|"agx", exposure?: number,
 *   bloom?: false|{ strength?: number, radius?: number, threshold?: number },
 *   shadows?: boolean, shadowArea?: number, shadowsStatic?: boolean,
 *   keyDir?: [number, number, number], rimDir?: [number, number, number],
 *   ground?: false|{ y?: number, size?: number, opacity?: number, color?: string },
 *   env?: "palette"|"room", fog?: boolean,
 *   quality?: { bloom: boolean, shadows: boolean, shadowMapSize: number, msaa: number },
 * }} [opts]
 */
export function applyLook(stage, opts = {}) {
  const { renderer, scene, camera, size } = stage;
  const o = {
    backdrop: "storm", toneMapping: "neutral", exposure: 1, shadows: true, shadowArea: 20, shadowsStatic: false,
    keyDir: [-0.55, 1, 0.45], rimDir: [0.35, 0.45, -1], ground: false, env: "palette", fog: true, alignHorizon: true, ...opts,
    bloom: opts.bloom === false ? false : { strength: 0.85, radius: 0.55, threshold: 0.9, ...(opts.bloom || {}) },
  };

  renderer.toneMapping = TONE[o.toneMapping] ?? NeutralToneMapping;
  renderer.toneMappingExposure = o.exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.info.autoReset = false;    // one frame = several renderer.render calls with bloom; reset in render()

  // --- backdrop replaces the sky texture
  scene.background = null;
  const backdrop = createBackdropMesh();
  scene.add(backdrop);

  // --- lights: reuse the stage's hemisphere + sun as hemi + key; add a rim
  const hemi = stage.lights.hemi;
  const key = stage.lights.sun;
  const rim = new DirectionalLight(0xffffff, 1);
  scene.add(rim, rim.target, key.target);
  const keyDir = new Vector3(...o.keyDir).normalize();
  const rimDir = new Vector3(...o.rimDir).normalize();
  const focus = new Vector3();
  let focusRadius = o.shadowArea;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  key.shadow.radius = 4;
  key.shadow.intensity = 0.85;

  function setFocus(x = 0, y = 0, z = 0, radius = focusRadius) {
    focus.set(x, y, z);
    focusRadius = radius;
    key.target.position.copy(focus);
    key.position.copy(focus).addScaledVector(keyDir, radius * 2.2);
    rim.target.position.copy(focus);
    rim.position.copy(focus).addScaledVector(rimDir, radius * 2);
    const cam = key.shadow.camera;
    cam.left = -radius; cam.right = radius; cam.top = radius; cam.bottom = -radius;
    cam.near = 0.5; cam.far = radius * 5;
    cam.updateProjectionMatrix();
    key.target.updateMatrixWorld();
    rim.target.updateMatrixWorld();
    renderer.shadowMap.needsUpdate = true;
  }
  setFocus(0, 0, 0, o.shadowArea);
  if (o.shadowsStatic) renderer.shadowMap.autoUpdate = false;

  // --- optional shadow catcher
  let ground = null;
  if (o.ground) {
    const g = { y: 0, size: 200, opacity: 0.35, color: "#000000", ...(o.ground === true ? {} : o.ground) };
    ground = new Mesh(new PlaneGeometry(g.size, g.size), new ShadowMaterial({ color: g.color, opacity: g.opacity }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = g.y;
    ground.receiveShadow = true;
    ground.name = "shadow-catcher";
    scene.add(ground);
  }

  // --- backdrop palette, fog, rig colours, environment
  let envTarget = null;
  const pmrem = new PMREMGenerator(renderer);
  let current = null;
  function setBackdrop(preset) {
    const b = typeof preset === "string" ? BACKDROPS[preset] ?? BACKDROPS.storm : preset;
    current = b;
    const u = backdrop.material.uniforms;
    u.uTop.value.set(b.top); u.uBottom.value.set(b.bottom); u.uHorizon.value.set(b.horizon);
    u.uGlow.value.set(b.glow); u.uGlow2.value.set(b.glow2 ?? "#000000");
    u.uGlowAt.value.set(...b.glowAt); u.uGlow2At.value.set(...(b.glow2At ?? [0.5, 0.5]));
    u.uGlowSize.value = b.glowSize; u.uGlow2Size.value = b.glow2Size ?? 0.5;
    u.uHorizonAt.value = b.horizonAt; u.uHorizonWidth.value = b.horizonWidth;
    u.uVignette.value = b.vignette; u.uStars.value = b.stars;
    if (o.fog) {
      if (!scene.fog) scene.fog = new Fog(b.fog, b.fogNear, b.fogFar);
      scene.fog.color.set(b.fog); scene.fog.near = b.fogNear; scene.fog.far = b.fogFar;
    } else scene.fog = null;
    hemi.color.set(b.hemiSky); hemi.groundColor.set(b.hemiGround); hemi.intensity = b.hemi;
    key.color.set(b.key); key.intensity = b.keyIntensity;
    rim.color.set(b.rim); rim.intensity = b.rimIntensity;
    // environment
    const envScene = o.env === "room" ? new RoomEnvironment() : buildEnvScene(b);
    const next = pmrem.fromScene(envScene, o.env === "room" ? 0.04 : 0.02);
    disposeScene(envScene);
    const old = scene.environment;
    scene.environment = next.texture;
    scene.environmentIntensity = b.envIntensity ?? 1;
    if (envTarget) envTarget.dispose(); else old?.dispose?.();
    envTarget = next;
    renderer.info.reset();          // the PMREM passes are not a frame's cost
  }
  setBackdrop(o.backdrop);

  // --- post-processing (created on demand by the tier)
  // HalfFloat colour targets need EXT_color_buffer_float/half_float (near-universal on WebGL2); else no bloom.
  const hdrOk = renderer.extensions.has("EXT_color_buffer_float") || renderer.extensions.has("EXT_color_buffer_half_float");
  let composer = null, renderPass = null, bloomPass = null, outputPass = null;
  let lastW = -1, lastH = -1, lastDpr = -1;
  let bloomScale = 0.5;
  const stats = { sceneCalls: 0, sceneTriangles: 0 };
  function ensureComposer(msaa) {
    if (composer) {
      if (composer.renderTarget1.samples !== msaa) {
        for (const rt of [composer.renderTarget1, composer.renderTarget2]) { rt.samples = msaa; rt.dispose(); }
      }
      return;
    }
    const rt = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: msaa });
    composer = new EffectComposer(renderer, rt);
    renderPass = new RenderPass(scene, camera);
    const renderScene = renderPass.render.bind(renderPass);
    renderPass.render = (...a) => {
      renderScene(...a);
      stats.sceneCalls = renderer.info.render.calls;
      stats.sceneTriangles = renderer.info.render.triangles;
    };
    bloomPass = new UnrealBloomPass(new Vector2(256, 256), o.bloom.strength, o.bloom.radius, o.bloom.threshold);
    const setBloomSize = bloomPass.setSize.bind(bloomPass);
    bloomPass.setSize = (w, h) => setBloomSize(Math.max(2, Math.round(w * bloomScale)), Math.max(2, Math.round(h * bloomScale)));
    outputPass = new OutputPass();
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);
    lastW = -1;
  }

  // --- tiers
  let tier = o.quality ?? { name: "high", bloom: true, shadows: true, shadowMapSize: 1024, msaa: 4 };
  let useComposer = false;
  function setQuality(t) {
    tier = t;
    useComposer = !!(t.bloom && o.bloom && hdrOk);
    if (useComposer) {
      bloomScale = t.name === "ultra" ? 1 : 0.5;     // UnrealBloomPass mip 0 is already half-res; high = quarter
      ensureComposer(t.msaa ?? 4);
      lastW = -1;
    }
    const cast = !!(t.shadows && o.shadows);
    key.castShadow = cast;
    const ms = t.shadowMapSize || 1024;
    if (cast && key.shadow.mapSize.x !== ms) {
      key.shadow.mapSize.set(ms, ms);
      key.shadow.map?.dispose();
      key.shadow.map = null;
    }
    renderer.shadowMap.needsUpdate = true;
  }
  setQuality(tier);

  // --- resize / render (replace the stage's in place)
  const baseResize = stage.resize;
  const baseRender = stage.render;
  function syncComposer() {
    if (!useComposer || !composer) return;
    const dpr = renderer.getPixelRatio();
    if (size.width === lastW && size.height === lastH && dpr === lastDpr) return;
    lastW = size.width; lastH = size.height; lastDpr = dpr;
    composer.setPixelRatio(dpr);
    composer.setSize(size.width, size.height);
  }
  function resize() {
    const changed = baseResize();
    backdrop.material.uniforms.uAspect.value = size.aspect || 1;
    return changed;
  }
  // Keep the backdrop's horizon band (and its glows, relative to it) on the real horizon of the
  // ground plane, so fogged ground meets the glow wherever the camera looks.
  const _fwd = new Vector3(), _far = new Vector3();
  function alignHorizon() {
    if (!o.alignHorizon || !current) return;
    camera.getWorldDirection(_fwd);
    _fwd.y = 0;
    if (_fwd.lengthSq() < 1e-6) return;
    _fwd.normalize();
    _far.copy(camera.position).addScaledVector(_fwd, 1e4).setY(0).project(camera);
    const h = Math.min(1.2, Math.max(-0.2, _far.y * 0.5 + 0.5));
    const u = backdrop.material.uniforms, b = current;
    u.uHorizonAt.value = h;
    u.uGlowAt.value.y = h + (b.glowAt[1] - b.horizonAt);
    u.uGlow2At.value.y = h + ((b.glow2At ?? b.glowAt)[1] - b.horizonAt);
  }
  function render() {
    renderer.info.reset();
    alignHorizon();
    if (useComposer) {
      syncComposer();
      composer.render();
    } else {
      renderer.render(scene, camera);
      stats.sceneCalls = renderer.info.render.calls;
      stats.sceneTriangles = renderer.info.render.triangles;
    }
  }
  stage.resize = resize;
  stage.render = render;
  resize();

  function info() {
    const r = renderer.info.render;
    return {
      tier: tier.name, dpr: renderer.getPixelRatio(), bloom: useComposer, shadows: key.castShadow,
      calls: r.calls, triangles: r.triangles, points: r.points, lines: r.lines,
      sceneCalls: stats.sceneCalls, sceneTriangles: stats.sceneTriangles, postCalls: r.calls - stats.sceneCalls,
    };
  }

  function dispose() {
    composer?.dispose?.();
    bloomPass?.dispose();
    outputPass?.dispose();
    envTarget?.dispose();
    pmrem.dispose();
    backdrop.geometry.dispose();
    backdrop.material.dispose();
    if (ground) { ground.geometry.dispose(); ground.material.dispose(); scene.remove(ground); }
    scene.remove(backdrop, rim, rim.target);
    stage.resize = baseResize;
    stage.render = baseRender;
  }

  return {
    get composer() { return composer; },
    get bloomPass() { return bloomPass; },
    get backdropPreset() { return current; },
    get tier() { return tier; },
    key, rim, hemi, ground, backdrop,
    setQuality, setBackdrop, setFocus, info, dispose, render, resize,
    /** Static shadows: re-render the shadow map on the next frame (after moving casters). */
    refreshShadows() { renderer.shadowMap.needsUpdate = true; },
  };
}
