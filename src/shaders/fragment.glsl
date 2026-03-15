// precision mediump float;

uniform sampler2D uTexture;
uniform float uOffset;
uniform float uTime;
uniform vec2 uImageRes;
uniform vec2 uPlaneSize;
uniform vec2 uRgbOffset;

varying vec2 vUv;
// varying vec2 relativeUv;

vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
  float rs = s.x / s.y; // Aspect screen size
  float ri = i.x / i.y; // Aspect image size
  vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x); // New st
  vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st; // Offset
  return u * s / st + o;
}

// ONLY RED IS SEPARATED
// vec3 rgbShift(sampler2D utexture, vec2 uv, vec2 offset) {
//   float r = texture(utexture, uv + offset).r;

//   vec2 gb = texture(utexture, uv).gb;
//   return vec3(r, gb);
// }

//  RED AND BLUE SEPARATED
vec3 rgbShift(sampler2D utexture, vec2 uv, vec2 offset) {
  float r = texture(utexture, uv + offset).r;
  float b = texture(utexture, uv - offset).b;

  float g = texture(utexture, uv).g;
  return vec3(r, g, b);

}

void main() {

  // vec2 mixedUV = mix(relativeUv, vUv, pow(uTextureProgress, 3.0));
  vec2 uv = CoverUV(vUv, uPlaneSize, uImageRes);
  // vec3 tex = texture2D(uTexture, vUv).rgb;
  vec3 texRgb = rgbShift(uTexture, uv, uRgbOffset);
  gl_FragColor = vec4(texRgb, 1.0);

  #include <tonemapping_fragment>
	#include <colorspace_fragment>
}
