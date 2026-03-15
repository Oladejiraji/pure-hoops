uniform sampler2D uTexture;
uniform sampler2D uNextTexture;
uniform float uTime;
uniform vec2 uImageResolution;
uniform vec2 uNextImageResolution;
uniform vec2 uCardSize;
uniform float uTransition;

varying vec2 vUv;

vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st;
  return u * s / st + o;
}

void main() {
  float uPixelSize = 30.0;

  // Pixelation intensity: peaks at midpoint of transition
  float pixelation = uTransition < 0.5
    ? uTransition * 2.0
    : (1.0 - uTransition) * 2.0;

  // Current texture
  vec2 coverUv = CoverUV(vUv, uCardSize, uImageResolution);
  vec2 pixelUv = floor(coverUv * uPixelSize) / uPixelSize;
  vec2 mixedUv = mix(coverUv, pixelUv, pixelation);
  vec3 currentColor = texture2D(uTexture, mixedUv).rgb;

  // Next texture
  vec2 nextCoverUv = CoverUV(vUv, uCardSize, uNextImageResolution);
  vec2 nextPixelUv = floor(nextCoverUv * uPixelSize) / uPixelSize;
  vec2 nextMixedUv = mix(nextCoverUv, nextPixelUv, pixelation);
  vec3 nextColor = texture2D(uNextTexture, nextMixedUv).rgb;

  // Crossfade at the midpoint (when fully pixelated)
  float texMix = smoothstep(0.45, 0.55, uTransition);
  vec3 finalColor = mix(currentColor, nextColor, texMix);

  gl_FragColor = vec4(finalColor, 1.0);
}
