// precision mediump float;

uniform sampler2D uTexture;
uniform float uOffset;
uniform float uTime;

varying vec2 vUv;
// varying vec2 relativeUv;

vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
  float rs = s.x / s.y; // Aspect screen size
  float ri = i.x / i.y; // Aspect image size
  vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x); // New st
  vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st; // Offset
  return u * s / st + o;
}

void main() {

  // gl_FragColor = vec4(relativeTex, 1.0);
  gl_FragColor = vec4(vec3(vUv, 1.0), 1.0);
  gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), 1.0);

}
