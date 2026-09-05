'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export default function IndustrialEnvironment() {
  const sparksRef = useRef<THREE.Points>(null);

  // Generate spark particle positions
  const sparkCount = 400;
  const positions = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;

    if (sparksRef.current) {
      sparksRef.current.rotation.y += delta * 0.15;
      sparksRef.current.rotation.x += delta * 0.05;
      
      // Spark intensity increases around fly-through (Scene 04: scroll 0.55 - 0.75)
      const sparkVisibility = Math.max(0.1, Math.sin(scrollProgress * Math.PI));
      (sparksRef.current.material as THREE.PointsMaterial).opacity = sparkVisibility;
    }
  });

  return (
    <>
      {/* Dark Ambient Atmosphere */}
      <ambientLight intensity={0.3} color="#151A21" />

      {/* Primary Key Light - Cold Industrial White */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={3.5}
        color="#E6F0FF"
        castShadow
      />

      {/* Rim Light - Hot Metallurgical Spark Accent */}
      <spotLight
        position={[-6, -4, -4]}
        intensity={6.0}
        color="#FF5500"
        angle={0.6}
        penumbra={0.8}
      />

      {/* Top Studio Downlight */}
      <pointLight position={[0, 6, 0]} intensity={2.0} color="#00F0FF" />

      {/* Metallic Sparks System */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#FF7700"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Technical Blueprint Floor Grid */}
      <gridHelper
        args={[30, 30, '#2A2F36', '#121417']}
        position={[0, -2.5, 0]}
      />
    </>
  );
}
