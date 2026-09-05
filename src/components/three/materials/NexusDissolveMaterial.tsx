'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const nexusDissolveVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const nexusDissolveFragmentShader = `
uniform float uTime;
uniform float uProgress;
uniform float uNoiseScale;
uniform float uEdgeWidth;
uniform vec3 uEdgeColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

float pseudoNoise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  float noise = pseudoNoise(vUv * uNoiseScale + vec2(uTime * 0.1));
  
  if (noise < uProgress) {
    discard;
  }

  float edge = smoothstep(uProgress, uProgress + uEdgeWidth, noise);
  vec3 baseColor = vec3(0.06, 0.07, 0.09);
  vec3 finalColor = mix(uEdgeColor, baseColor, edge);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface NexusDissolveMaterialProps {
  progress?: number;
  noiseScale?: number;
  edgeWidth?: number;
  edgeColor?: string;
}

export default function NexusDissolveMaterial({
  progress = 0,
  noiseScale = 15.0,
  edgeWidth = 0.05,
  edgeColor = '#00F0FF',
}: NexusDissolveMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Memoize uniforms structure outside render loop (Fix J - Zero uniform allocations per frame)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: progress },
      uNoiseScale: { value: noiseScale },
      uEdgeWidth: { value: edgeWidth },
      uEdgeColor: { value: new THREE.Color(edgeColor) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uProgress.value = progress;
      materialRef.current.uniforms.uNoiseScale.value = noiseScale;
      materialRef.current.uniforms.uEdgeWidth.value = edgeWidth;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={nexusDissolveVertexShader}
      fragmentShader={nexusDissolveFragmentShader}
      uniforms={uniforms}
      transparent
      side={THREE.DoubleSide}
    />
  );
}
