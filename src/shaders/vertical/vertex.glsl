uniform float uTime;
uniform float uIntensity;
uniform float uCurveDistance;

varying vec2 vUv;
varying vec2 relativeUv;

float PI = 3.141592653589793;

mat2 rotate2d(float radians) {
  float c = cos(radians);
  float s = sin(radians);
  return mat2(c, -s, s, c);
}

void main() {

  vec3 pos = position;

  vec4 modelPos = modelMatrix * vec4(vec3(position), 1.0);
  vec4 viewPos = viewMatrix * modelPos;
  vec4 clipSpacePosition = projectionMatrix * viewPos;

  float ndcPositionY = clipSpacePosition.y / clipSpacePosition.w;

  float yCenterFactor = 1.0 - abs(ndcPositionY);
  yCenterFactor = smoothstep(uCurveDistance, 1.0, yCenterFactor);

  pos.z += sin(PI / 2.0) * uIntensity * yCenterFactor;

  vec4 modelPosition = modelMatrix * vec4(vec3(pos), 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  vUv = uv;
  // relativeUv = vec2(normalizedPosX, normalizedPosY);
}
