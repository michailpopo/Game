/**
 * Material kit (WP-20 premium look) - ready materials that look glossy/glowing under the look.js rig.
 * Every factory returns a NEW material; share one per InstancedMesh and vary colour per instance with
 * `mesh.setColorAt(i, color)` (pass colour 0xffffff to the factory for instanced use: the instance
 * colour multiplies it, and the rim / inner glow below pick it up too).
 *
 *   import { MATERIALS } from "./render/materials.js";
 *   MATERIALS.candy("#ff2d95")                 glossy candy plastic (clearcoat) - heroes, pickups, UI-like 3D
 *   MATERIALS.crystal(0xffffff, { inner })     opaque faceted crystal/gem: facets glow with their own colour + rim
 *   MATERIALS.glass("#4df3ff")                 transparent faceted glass shell (pair it with a `core` inside)
 *   MATERIALS.core("#4df3ff", 4)               unlit HDR emissive core - the part that blooms
 *   MATERIALS.metal("#c9d3ff") / gold()        polished metal / gold (needs scene.environment - look.js sets it)
 *   MATERIALS.neon("#ff2d95", 3)               unlit HDR neon (tubes, rings, lines, beacons)
 *   MATERIALS.facade({ litColor })             city building: procedural windows lit per instance (see below)
 *   MATERIALS.facadeReflection(facade)         the same windows mirrored below a wet street (fake reflection)
 *   MATERIALS.wetStreet()                      dark glossy street/floor (transparent so the reflection shows)
 *   enhance(material, { rim, rimPower, rimColor, rimTint, inner })  add rim light + inner glow to any
 *                                              MeshStandard/MeshPhysical material (flat or smooth shaded)
 *
 * Bloom: look.js blooms linear values above ~0.9, so `core`/`neon` (intensity > 1), the facade's lit
 * windows (litIntensity ~2) and specular glints bloom; ordinary lit surfaces do not.
 *
 * Facade (buildings as instanced boxes, one draw call for a whole city):
 *   const geo = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);          // base at y = 0 - REQUIRED
 *   geo.setAttribute("aLit", new InstancedBufferAttribute(new Float32Array(n), 1));   // 0..1 windows lit
 *   geo.setAttribute("aSeed", new InstancedBufferAttribute(seeds, 1));                // 0..1 per building
 *   const city = new InstancedMesh(geo, MATERIALS.facade(), n);   // scale each instance to w x h x d
 *   city.setColorAt(i, charcoal);  aLit.array[i] = 0.7; aLit.needsUpdate = true;      // light-up wave
 * Windows are computed in the shader from the instance scale (world-sized, never stretched), light
 * window by window in a stable random order as aLit rises, and skip the ground floor and the parapet.
 */

import {
  AdditiveBlending, Color, DoubleSide, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, ShaderMaterial,
  UniformsLib, UniformsUtils, Vector2,
} from "three";

const hdr = (color, k) => new Color(color).multiplyScalar(k);

// ------------------------------------------------------------------ rim light + inner glow
const RIM_FRAGMENT = /* glsl */`
#include <emissivemap_fragment>
{
  vec3 gsView = normalize( vViewPosition );
  float gsFres = pow( 1.0 - clamp( abs( dot( normal, gsView ) ), 0.0, 1.0 ), gsRimPower );
  vec3 gsTint = mix( gsRimColor, diffuseColor.rgb, gsRimTint );
  totalEmissiveRadiance += gsTint * gsFres * gsRim + diffuseColor.rgb * gsInner * ( 1.0 - 0.7 * gsFres );
}
`;

/**
 * Adds a view-dependent rim (fresnel) and an inner glow to a MeshStandard/MeshPhysical material.
 * rim: strength (0.3 subtle, 1.5 strong); rimPower: edge tightness (2 wide .. 5 thin);
 * rimColor: rim colour; rimTint: 0 = rimColor, 1 = the surface (instance) colour;
 * inner: self-glow in the surface colour (0.4 = "lit from inside", > 1 blooms).
 * The values live in `material.userData.gs` (uniform objects) - change `.value` at runtime.
 */
export function enhance(material, { rim = 0.5, rimPower = 3, rimColor = "#ffffff", rimTint = 0.5, inner = 0 } = {}) {
  const u = {
    gsRim: { value: rim }, gsRimPower: { value: rimPower }, gsRimColor: { value: new Color(rimColor) },
    gsRimTint: { value: rimTint }, gsInner: { value: inner },
  };
  material.userData.gs = u;
  const prev = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    prev?.call(material, shader, renderer);
    Object.assign(shader.uniforms, u);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float gsRim;\nuniform float gsRimPower;\nuniform vec3 gsRimColor;\nuniform float gsRimTint;\nuniform float gsInner;")
      .replace("#include <emissivemap_fragment>", RIM_FRAGMENT);
  };
  const key = material.customProgramCacheKey.bind(material);
  material.customProgramCacheKey = () => `gs-rim|${key()}`;
  return material;
}

// ------------------------------------------------------------------ city facade (procedural windows)
const WINDOW_GLSL = /* glsl */`
uniform vec2 fcCell;        // window cell size in world units (width, storey height)
uniform vec2 fcMargin;      // empty border inside a cell (fraction)
uniform vec3 fcLit;         // lit window colour (linear, HDR via fcLitIntensity)
uniform float fcLitIntensity;
uniform vec3 fcGlass;       // unlit window glass
uniform float fcDim;        // fraction of windows faintly lit in a dark building
uniform float fcSpill;      // warm glow on the walls of a lit building
varying vec3 vFcLocal;
varying vec3 vFcNormal;
varying vec3 vFcScale;
varying float vFcLit;
varying float vFcSeed;
float fcHash( vec2 p ) { p = fract( p * vec2( 123.34, 456.21 ) ); p += dot( p, p + 45.32 ); return fract( p.x * p.y ); }
// x: window mask 0..1, y: lit 0..1, z: per-window brightness variation
vec3 fcWindows() {
  if ( abs( vFcNormal.y ) > 0.5 ) return vec3( 0.0 );
  float u = abs( vFcNormal.x ) > 0.5 ? vFcLocal.z : vFcLocal.x;
  float faceW = abs( vFcNormal.x ) > 0.5 ? vFcScale.z : vFcScale.x;
  // centre the column grid on the face so windows never get cut at a corner
  float cols = max( 1.0, floor( faceW / fcCell.x ) );
  float cw = faceW / cols;
  vec2 g = vec2( ( u + faceW * 0.5 ) / cw, vFcLocal.y / fcCell.y );
  vec2 cell = floor( g );
  vec2 f = fract( g );
  vec2 aa = max( fwidth( g ) * 1.1, vec2( 0.001 ) );
  vec2 lo = smoothstep( fcMargin - aa, fcMargin + aa, f );
  vec2 hi = 1.0 - smoothstep( 1.0 - fcMargin - aa, 1.0 - fcMargin + aa, f );
  float m = lo.x * lo.y * hi.x * hi.y;
  float storeys = floor( vFcScale.y / fcCell.y );
  m *= step( 0.5, cell.y ) * step( cell.y, storeys - 1.5 );       // no ground floor, no parapet storey
  vec2 key = cell + vec2( vFcSeed * 97.0 + vFcNormal.x * 13.0, vFcNormal.z * 7.0 );
  float h = fcHash( key );
  float lit = step( h, vFcLit * 1.0001 );
  float dim = step( fcHash( key + 3.7 ), fcDim ) * 0.22 * ( 1.0 - lit );
  return vec3( m, max( lit, dim ), 0.7 + 0.6 * fcHash( key + 9.1 ) );
}
`;

const FACADE_VERTEX_PARS = /* glsl */`
attribute float aLit;
attribute float aSeed;
varying vec3 vFcLocal;
varying vec3 vFcNormal;
varying vec3 vFcScale;
varying float vFcLit;
varying float vFcSeed;
`;
const FACADE_VERTEX = /* glsl */`
#include <begin_vertex>
#ifdef USE_INSTANCING
  vFcScale = vec3( length( instanceMatrix[ 0 ].xyz ), length( instanceMatrix[ 1 ].xyz ), length( instanceMatrix[ 2 ].xyz ) );
#else
  vFcScale = vec3( 1.0 );
#endif
vFcLocal = position * vFcScale;
vFcNormal = normal;
vFcLit = aLit;
vFcSeed = aSeed;
`;

function facadeUniforms({ litColor, litIntensity, glass, cell, margin, dim, spill }) {
  return {
    fcCell: { value: new Vector2(cell[0], cell[1]) }, fcMargin: { value: new Vector2(margin[0], margin[1]) },
    fcLit: { value: new Color(litColor) }, fcLitIntensity: { value: litIntensity }, fcGlass: { value: new Color(glass) },
    fcDim: { value: dim }, fcSpill: { value: spill },
  };
}

/**
 * Lit, shadowed building material with procedural windows. Options:
 * litColor (warm gold), litIntensity (HDR; > 1 blooms), glass (unlit window colour), cell [w, h]
 * (window grid in world units), margin [x, y], dim (share of faintly lit windows in dark buildings),
 * spill (warm wash on the walls of lit buildings), rim (edge light strength).
 */
function facade({ litColor = "#ffd166", litIntensity = 2.2, glass = "#0b1030", cell = [0.46, 0.56], margin = [0.2, 0.22], dim = 0.05, spill = 0.06, rim = 0.35, roughness = 0.62, metalness = 0.15 } = {}) {
  const m = new MeshStandardMaterial({ color: 0xffffff, roughness, metalness });
  const u = facadeUniforms({ litColor, litIntensity, glass, cell, margin, dim, spill });
  m.userData.facade = u;
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${FACADE_VERTEX_PARS}`)
      .replace("#include <begin_vertex>", FACADE_VERTEX);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${WINDOW_GLSL}`)
      .replace("#include <color_fragment>", `#include <color_fragment>
        vec3 fcW = fcWindows();
        float fcRoof = step( 0.5, vFcNormal.y );
        diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * 1.35 + 0.02, fcRoof );
        diffuseColor.rgb = mix( diffuseColor.rgb, fcGlass, fcW.x );`)
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix( roughnessFactor, 0.18, fcW.x );")
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        totalEmissiveRadiance += fcLit * fcLitIntensity * fcW.x * fcW.y * fcW.z;
        totalEmissiveRadiance += fcLit * fcSpill * vFcLit * ( 1.0 - fcW.x ) * ( 1.0 - fcRoof );`);
  };
  m.customProgramCacheKey = () => "gs-facade";
  if (rim > 0) enhance(m, { rim, rimPower: 3.5, rimColor: "#ff4fc4", rimTint: 0.15 });
  return m;
}

/**
 * The facade's windows mirrored below the street (use on an InstancedMesh that shares the city's
 * geometry, instanceMatrix and instanceColor, with `mesh.scale.y = -1`). Unlit; fades with depth.
 */
function facadeReflection(facadeMaterial, { strength = 0.55, depthFade = 0.35, body = "#04040c" } = {}) {
  const u = facadeMaterial.userData.facade;
  return new ShaderMaterial({
    uniforms: UniformsUtils.merge([UniformsLib.fog, {
      rfStrength: { value: strength }, rfFade: { value: depthFade }, rfBody: { value: new Color(body) },
    }]),
    vertexShader: /* glsl */`
      ${FACADE_VERTEX_PARS}
      varying float vRfY;
      #include <common>
      #include <fog_pars_vertex>
      void main() {
        #include <begin_vertex>
        #ifdef USE_INSTANCING
          vFcScale = vec3( length( instanceMatrix[ 0 ].xyz ), length( instanceMatrix[ 1 ].xyz ), length( instanceMatrix[ 2 ].xyz ) );
          vec4 wp = modelMatrix * instanceMatrix * vec4( transformed, 1.0 );
        #else
          vFcScale = vec3( 1.0 );
          vec4 wp = modelMatrix * vec4( transformed, 1.0 );
        #endif
        vFcLocal = position * vFcScale;
        vFcNormal = normal;
        vFcLit = aLit;
        vFcSeed = aSeed;
        vRfY = wp.y;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */`
      ${WINDOW_GLSL}
      uniform float rfStrength;
      uniform float rfFade;
      uniform vec3 rfBody;
      varying float vRfY;
      #include <common>
      #include <fog_pars_fragment>
      void main() {
        vec3 w = fcWindows();
        float fade = exp( vRfY * rfFade );
        vec3 c = rfBody + fcLit * fcLitIntensity * w.x * w.y * w.z * rfStrength * fade;
        c += fcLit * fcSpill * vFcLit * rfStrength * fade * 0.6;
        gl_FragColor = vec4( c, 1.0 );
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
    fog: true,
  });
}

/** The reflection shares the facade's window uniform objects, so both stay in sync. */
function linkFacadeUniforms(reflection, facadeMaterial) {
  Object.assign(reflection.uniforms, facadeMaterial.userData.facade);
  return reflection;
}

// ------------------------------------------------------------------ the kit
export const MATERIALS = {
  /** Glossy candy plastic with a clearcoat and a soft white rim. */
  candy(color = "#ff2d95", { roughness = 0.28, rim = 0.35, inner = 0.05, flatShading = false } = {}) {
    return enhance(new MeshPhysicalMaterial({ color, roughness, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, flatShading }),
      { rim, rimPower: 3, rimColor: "#ffffff", rimTint: 0.3, inner });
  },

  /** Opaque faceted gem/crystal: facets lit from inside in their own colour + a coloured rim + sharp glints. */
  crystal(color = 0xffffff, { inner = 0.45, rim = 1.1, roughness = 0.12, iridescence = 0.35 } = {}) {
    return enhance(new MeshPhysicalMaterial({
      color, roughness, metalness: 0.05, flatShading: true, clearcoat: 1, clearcoatRoughness: 0.04, iridescence, iridescenceIOR: 1.6,
    }), { rim, rimPower: 2.4, rimColor: "#ffffff", rimTint: 0.7, inner });
  },

  /** Transparent faceted glass shell. Draw a `core` inside for the glowing heart (opaque cores render first). */
  glass(color = "#bff6ff", { opacity = 0.42, rim = 1.4, inner = 0.12 } = {}) {
    return enhance(new MeshPhysicalMaterial({
      color, roughness: 0.04, metalness: 0, flatShading: true, transparent: true, opacity, depthWrite: true,
      clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1, ior: 1.8,
    }), { rim, rimPower: 2.2, rimColor: "#ffffff", rimTint: 0.6, inner });
  },

  /** Unlit HDR core: intensity > 1 blooms on the high tier and reads as white-hot on low. */
  core(color = "#4df3ff", intensity = 4) {
    return new MeshBasicMaterial({ color: hdr(color, intensity) });
  },

  /** Polished metal; relies on scene.environment (look.js provides a palette environment). */
  metal(color = "#c9d3ff", { roughness = 0.22, rim = 0.25 } = {}) {
    return enhance(new MeshStandardMaterial({ color, metalness: 1, roughness }), { rim, rimPower: 3, rimColor: "#ffffff", rimTint: 0.8 });
  },

  gold({ roughness = 0.2, rim = 0.35 } = {}) {
    return enhance(new MeshStandardMaterial({ color: "#ffc83d", metalness: 1, roughness, emissive: "#3a2000" }),
      { rim, rimPower: 2.5, rimColor: "#fff2b0", rimTint: 0.2 });
  },

  /** Unlit HDR neon; additive = true for halo-like overlapping strokes. */
  neon(color = "#ff2d95", intensity = 3, { additive = false, doubleSided = false } = {}) {
    return new MeshBasicMaterial({
      color: hdr(color, intensity), blending: additive ? AdditiveBlending : undefined, transparent: additive,
      depthWrite: !additive, side: doubleSided ? DoubleSide : undefined,
    });
  },

  facade,

  facadeReflection(facadeMaterial, opts) { return linkFacadeUniforms(facadeReflection(facadeMaterial, opts), facadeMaterial); },

  /** Dark glossy street. Transparent so a mirrored reflection mesh below it shows through. */
  wetStreet({ color = "#0b0d22", roughness = 0.3, metalness = 0.25, opacity = 0.8 } = {}) {
    return new MeshStandardMaterial({ color, roughness, metalness, transparent: opacity < 1, opacity, depthWrite: true });
  },
};
