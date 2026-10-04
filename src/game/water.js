/**
 * Toy water for the island themes (look.js world.water): one flat plane, one shader, no reflections, no render targets.
 *
 * The technique the stylised-water references share (toon water with shoreline foam; the game-studio world template's
 * sea): the water knows how far it is from the shore and draws everything from that one number -
 *   - colour: light shallow water at the beach fading to the deep sea colour by ~10 m out
 *   - contact foam: a white line hugging every beach, gently wobbling
 *   - waves rolling in: thin foam bands every 3.4 m that travel towards the beach and break into arcs
 *   - open sea: a few soft, slowly drifting wave crests so the deep water never looks like paper
 * The distance comes from islands.js shoreField(), computed once per city into a small R8 texture. Many toon-water
 * shaders read the depth buffer for this (an extra depth pass every frame); here the islands are known shapes, so the
 * distance is exact and costs nothing per frame.
 *
 * Built on MeshStandardMaterial (onBeforeCompile), so the sea keeps the scene's light, shadows, fog and tone mapping
 * like every other surface. Cost: 1 draw call, 2 triangles, 1 texture fetch + 3 value-noise lookups per water pixel.
 */

import { ClampToEdgeWrapping, Color, DataTexture, LinearFilter, MeshStandardMaterial, RedFormat, UnsignedByteType } from "three";

const PARS = /* glsl */`
uniform sampler2D wtDist;
uniform float wtHalf;
uniform float wtMaxD;
uniform float wtTime;
uniform vec3 wtDeep;
uniform vec3 wtShallow;
uniform vec3 wtFoam;
varying vec3 vWtWorld;
float wtHash( vec2 p ) { p = fract( p * vec2( 123.34, 456.21 ) ); p += dot( p, p + 45.32 ); return fract( p.x * p.y ); }
float wtNoise( vec2 p ) {
  vec2 i = floor( p ), f = fract( p ), u = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( wtHash( i ), wtHash( i + vec2( 1.0, 0.0 ) ), u.x ), mix( wtHash( i + vec2( 0.0, 1.0 ) ), wtHash( i + vec2( 1.0, 1.0 ) ), u.x ), u.y );
}
`;

const WATER = /* glsl */`
#include <color_fragment>
{
  vec2 wp = vWtWorld.xz;
  vec2 uv = wp / ( 2.0 * wtHalf ) + 0.5;
  float d = wtMaxD;                                                  // metres from the nearest beach
  if ( uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0 ) d = texture2D( wtDist, uv ).r * wtMaxD;
  float t = wtTime;
  float wob = wtNoise( wp * 0.22 + vec2( t * 0.15, -t * 0.11 ) ) - 0.5;   // breaks every line up a little
  float dw = d + wob * 1.1;
  float aa = max( fwidth( dw ), 0.02 );

  vec3 col = mix( wtShallow, wtDeep, smoothstep( 0.6, 10.0, dw ) );

  // contact foam: a solid line along the beach
  float contact = 1.0 - smoothstep( 0.9 - aa, 0.9 + aa, dw );

  // waves rolling in: a thin band every 3.4 m, between the contact line and ~8 m out, broken into arcs
  float ph = fract( dw / 3.4 + t * 0.3 );
  float a2 = aa / 3.4;
  float band = 1.0 - smoothstep( 0.06 - a2, 0.06 + a2, abs( ph - 0.5 ) );
  band *= smoothstep( 1.3, 2.3, dw ) * ( 1.0 - smoothstep( 4.5, 8.5, dw ) );
  band *= smoothstep( 0.32, 0.5, wtNoise( wp * 0.12 + vec2( 3.1, -t * 0.05 ) ) );

  // open sea: small, sparse crests - short strokes along the swell, drifting slowly
  vec2 q = wp * vec2( 0.11, 0.3 ) + vec2( t * 0.06, t * 0.02 );
  float n = wtNoise( q ) * wtNoise( q * 1.9 + 7.7 );
  float a3 = max( fwidth( n ), 0.001 );
  float crest = smoothstep( 0.53 - a3, 0.53 + a3, n ) * smoothstep( 6.0, 12.0, dw );
  crest *= 1.0 - smoothstep( 0.12, 0.3, length( fwidth( q ) ) );   // gone where a crest would be a few pixels (no shimmer)

  col = mix( col, wtFoam, max( contact, band * 0.85 ) );
  col = mix( col, wtFoam, crest * 0.22 );
  diffuseColor.rgb = col;
}
`;

/**
 * @param {{ data: Uint8Array, res: number, half: number, maxD: number }} field  islands.js shoreField()
 * @param {{ deep: string, shallow: string, foam: string }} colors
 * @returns {MeshStandardMaterial}  set `material.userData.water.wtTime.value` every frame; dispose() also frees the texture
 */
export function createWaterMaterial(field, colors) {
  const tex = new DataTexture(field.data, field.res, field.res, RedFormat, UnsignedByteType);
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;

  const u = {
    wtDist: { value: tex }, wtHalf: { value: field.half }, wtMaxD: { value: field.maxD }, wtTime: { value: 0 },
    wtDeep: { value: new Color(colors.deep) }, wtShallow: { value: new Color(colors.shallow) }, wtFoam: { value: new Color(colors.foam) },
  };
  const material = new MeshStandardMaterial({ color: colors.deep, roughness: 0.7 });
  material.userData.water = u;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWtWorld;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvWtWorld = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${PARS}`)
      .replace("#include <color_fragment>", WATER);
  };
  material.customProgramCacheKey = () => "storm-grid-water";
  const dispose = material.dispose.bind(material);
  material.dispose = () => { tex.dispose(); dispose(); };
  return material;
}
