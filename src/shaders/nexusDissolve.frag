uniform float uTime;
uniform float uProgress;
uniform float uNoiseScale;
uniform float uEdgeWidth;
uniform vec3 uEdgeColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Simple 2D noise generator for dissolve edge calculation
float pseudoNoise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  float noise = pseudoNoise(vUv * uNoiseScale + vec2(uTime * 0.1));
  
  // Dissolve threshold evaluation
  if (noise < uProgress) {
    discard;
  }

  // Edge glow region
  float edge = smoothstep(uProgress, uProgress + uEdgeWidth, noise);
  vec3 baseColor = vec3(0.06, 0.07, 0.09); // Titanium Dark
  vec3 finalColor = mix(uEdgeColor, baseColor, edge);

  gl_FragColor = vec4(finalColor, 1.0);
}
