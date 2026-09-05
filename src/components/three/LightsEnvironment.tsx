'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

// Deterministic pseudo-random generator for React pure rendering
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function LightsEnvironment() {
  const particlesRef = useRef<THREE.Points>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const cyanRimLightRef = useRef<THREE.PointLight>(null);

  const devicePerformance = useStore((state) => state.devicePerformance);

  // Dynamic particle count based on performance tier.
  // 'unknown' (pre-detection) must stay conservative, matching DPR/postprocessing defaults.
  const particleCount = useMemo(() => {
    if (devicePerformance === 'low' || devicePerformance === 'unknown') return 50;
    if (devicePerformance === 'medium') return 150;
    return 350;
  }, [devicePerformance]);

  // Pure memoized particle buffer positions
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (pseudoRandom(i * 3 + 1) - 0.5) * 12;
      pos[i * 3 + 1] = (pseudoRandom(i * 3 + 2) - 0.5) * 12;
      pos[i * 3 + 2] = (pseudoRandom(i * 3 + 3) - 0.5) * 12;
    }
    return pos;
  }, [particleCount]);

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;
    const time = state.clock.getElapsedTime();

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.03;
      particlesRef.current.rotation.x += delta * 0.01;
      
      const opacity = 0.2 + Math.sin(scrollProgress * Math.PI) * 0.3;
      (particlesRef.current.material as THREE.PointsMaterial).opacity = opacity;
    }

    // Dynamic directional light orbit based on scroll
    if (dirLightRef.current) {
      dirLightRef.current.position.x = -6 + Math.sin(scrollProgress * Math.PI) * 4;
      dirLightRef.current.position.y = 4 + Math.cos(scrollProgress * Math.PI) * 2;
    }

    // Cyan Rim Light pulse in Neural Core & Neural World scenes
    if (cyanRimLightRef.current) {
      const pulse = 3.5 + Math.sin(time * 3) * 1.0;
      cyanRimLightRef.current.intensity = pulse;
    }
  });

  return (
    <>
      {/* Dark Ambient Tone */}
      <ambientLight intensity={0.25} color="#0F1115" />

      {/* Primary Cold Side Light */}
      <directionalLight
        ref={dirLightRef}
        position={[-6, 4, 5]}
        intensity={3.0}
        color="#F8FAFC"
      />

      {/* Subtle Cyan Rim Light */}
      <pointLight ref={cyanRimLightRef} position={[5, -3, -3]} intensity={4.0} color="#00F0FF" />

      {/* Deep Background Fill */}
      <pointLight position={[0, 6, -5]} intensity={1.5} color="#1E232B" />

      {/* Volumetric Atmosphere Dust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#9CA8B6"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}
