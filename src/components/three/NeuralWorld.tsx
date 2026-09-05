'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export default function NeuralWorld() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const worldGroupRef = useRef<THREE.Group>(null);

  // Generate a 3D matrix tunnel of neural synaptic nodes
  const count = 600;
  const { positions, linePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const linePosList: number[] = [];

    for (let i = 0; i < count; i++) {
      // Cylinder / tunnel distribution surrounding camera path
      const radius = 1.5 + Math.random() * 4.5;
      const angle = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 20; // 20 units deep tunnel

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = z;
    }

    // Connect close neighbors within tunnel
    for (let i = 0; i < count; i += 3) {
      for (let j = i + 1; j < count; j += 3) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 2.5) {
          linePosList.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }

    return {
      positions: pos,
      linePositions: new Float32Array(linePosList),
    };
  }, []);

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;
    const time = state.clock.getElapsedTime();

    // Fade-in neural matrix tunnel specifically in Scene 05 (scrollProgress 0.65 to 0.88)
    let opacity = 0;
    if (scrollProgress >= 0.58 && scrollProgress <= 0.92) {
      if (scrollProgress < 0.65) {
        opacity = (scrollProgress - 0.58) / 0.07;
      } else if (scrollProgress > 0.85) {
        opacity = (0.92 - scrollProgress) / 0.07;
      } else {
        opacity = 1.0;
      }
    }

    if (worldGroupRef.current) {
      worldGroupRef.current.rotation.z = time * 0.05;
    }

    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = opacity * 0.7;
    }

    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = opacity * 0.25;
    }
  });

  return (
    <group ref={worldGroupRef} position={[0, 0, -5]}>
      {/* 3D Matrix Tunnel Synaptic Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#00F0FF"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Synaptic Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#9CA8B6"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
