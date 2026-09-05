uniform float uTime;
uniform float uProgress;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 baseColor = vec3(0.7, 0.75, 0.8);
  float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
  vec3 finalColor = mix(baseColor, vec3(1.0, 0.35, 0.0), fresnel * uProgress);
  gl_FragColor = vec4(finalColor, 1.0);
}
