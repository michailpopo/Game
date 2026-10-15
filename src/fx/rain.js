/**
 * Rain - a box of falling streaks around the city in ONE draw call, animated entirely on the GPU
 * (the CPU only sets a time uniform per frame: no attribute uploads, no allocation).
 *
 *   const rain = new Rain(scene, { count: 700, size: 120, height: 70, color: "#9fb4ff" });
 *   rain.update(time);          // view seconds
 *   rain.setFlash(k);           // 0..1: a lightning flash lights the drops up
 *   rain.dispose();
 *
 * Each drop is a thin line from its head to head + length along the fall direction (a slight wind slant).
 * Opacity stays low: rain is atmosphere, never noise over the bolts or the "+N" numbers.
 */

import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, LineSegments, ShaderMaterial, Vector2 } from "three";

const VERTEX = /* glsl */`
attribute vec4 aDrop;     // x, z, start phase (0..1), speed factor
attribute float aEnd;     // 0 = head, 1 = tail
uniform float uTime, uHeight, uSpeed, uLength;
uniform vec2 uWind;
varying float vEnd;
varying float vFade;
void main() {
  float fall = uSpeed * aDrop.w;
  float y = uHeight * ( 1.0 - fract( aDrop.z + uTime * fall / uHeight ) );
  vec3 p = vec3( aDrop.x, y, aDrop.y );
  vec3 dir = normalize( vec3( uWind.x, -1.0, uWind.y ) );
  p -= dir * uLength * aEnd * aDrop.w;
  vEnd = aEnd;
  vFade = smoothstep( 0.0, 0.12, y / uHeight ) * ( 1.0 - smoothstep( 0.8, 1.0, y / uHeight ) );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}`;

const FRAGMENT = /* glsl */`
uniform vec3 uColor;
uniform float uAlpha, uFlash;
varying float vEnd;
varying float vFade;
void main() {
  float a = uAlpha * ( 1.0 - vEnd ) * vFade * ( 1.0 + uFlash * 1.2 );
  gl_FragColor = vec4( uColor * ( 1.0 + uFlash * 0.8 ), a );
  #include <colorspace_fragment>
}`;

export class Rain {
  /** @param {{ count?: number, size?: number, height?: number, color?: string, alpha?: number, speed?: number, length?: number, seed?: number }} [o] */
  constructor(scene, { count = 700, size = 120, height = 70, color = "#9fb4ff", alpha = 0.22, speed = 42, length = 2.6, seed = 1 } = {}) {
    let a = seed >>> 0;
    const rand = () => { a = (a + 0x6d2b79f5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const drop = new Float32Array(count * 2 * 4), end = new Float32Array(count * 2), pos = new Float32Array(count * 2 * 3);
    for (let i = 0; i < count; i++) {
      const x = (rand() - 0.5) * size, z = (rand() - 0.5) * size, ph = rand(), sp = 0.75 + rand() * 0.5;
      for (let k = 0; k < 2; k++) { drop.set([x, z, ph, sp], (i * 2 + k) * 4); end[i * 2 + k] = k; }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));   // unused by the shader; three needs it
    geo.setAttribute("aDrop", new Float32BufferAttribute(drop, 4));
    geo.setAttribute("aEnd", new Float32BufferAttribute(end, 1));
    this.material = new ShaderMaterial({
      vertexShader: VERTEX, fragmentShader: FRAGMENT, transparent: true, depthWrite: false, blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uHeight: { value: height }, uSpeed: { value: speed }, uLength: { value: length },
        uWind: { value: new Vector2(0.12, 0.05) }, uColor: { value: new Color(color) }, uAlpha: { value: alpha }, uFlash: { value: 0 },
      },
    });
    this.mesh = new LineSegments(geo, this.material);
    this.mesh.name = "rain";
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 5;
    scene.add(this.mesh);
  }

  update(time) { this.material.uniforms.uTime.value = time; }
  setFlash(k) { this.material.uniforms.uFlash.value = k; }

  dispose() {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
