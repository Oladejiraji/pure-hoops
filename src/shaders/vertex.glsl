uniform float uTime;
uniform float uIntensity;
uniform float uCurveDistance;

varying vec2 vUv;
varying vec2 relativeUv;

float PI = 3.141592653589793;

void main() {

  vec3 pos = position;

  vec4 modelPos = modelMatrix * vec4(vec3(position), 1.0);
  vec4 viewPos = viewMatrix * modelPos;
  vec4 clipSpacePosition = projectionMatrix * viewPos;

  float ndcPositionX = clipSpacePosition.x / clipSpacePosition.w;
  float ndcPositionY = clipSpacePosition.y / clipSpacePosition.w;

  float xCenterFactor = 1.0 - abs(ndcPositionX);
  xCenterFactor = smoothstep(uCurveDistance, 1.0, xCenterFactor);

  float yCenterFactor = 1.0 - abs(ndcPositionY);
  yCenterFactor = smoothstep(0.1, 1.0, yCenterFactor);

  pos.z += sin(PI / 2.0) * uIntensity * xCenterFactor;
  // pos.z += sin(PI * (xCenterFactor / 2.0)) * uIntensity;

  vec4 modelPosition = modelMatrix * vec4(vec3(pos), 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  vUv = uv;
  // relativeUv = vec2(normalizedPosX, normalizedPosY);
}
