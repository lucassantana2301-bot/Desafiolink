'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export default function NeuralCore() {
  const corePointsRef = useRef<THREE.Points>(null);
  const coreLinesRef = useRef<THREE.LineSegments>(null);
  const coreGroupRef = useRef<THREE.Group>(null);

  const devicePerformance = useStore((state) => state.devicePerformance);

  // Dynamic node count based on Performance Tier (Fix C)
  const nodeCount = useMemo(() => {
    if (devicePerformance === 'low') return 70;
    if (devicePerformance === 'medium') return 120;
    return 180; // High / Unknown
  }, [devicePerformance]);

  // Memoized buffer positions (Recalculated ONLY when nodeCount / devicePerformance changes)
  const { positions, linePositions } = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    const linePosList: number[] = [];

    const radius = 0.75;
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 0.45) {
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
  }, [nodeCount]);

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;
    const time = state.clock.getElapsedTime();

    // GPU Culling: Hide NeuralCore when outside relevance range
    const isVisible = scrollProgress >= 0.40 && scrollProgress <= 0.92;
    if (coreGroupRef.current) {
      coreGroupRef.current.visible = isVisible;
    }

    if (!isVisible) return;

    let coreActivity = 0;
    if (scrollProgress >= 0.45 && scrollProgress <= 0.90) {
      coreActivity = Math.sin(((scrollProgress - 0.45) / 0.45) * Math.PI);
    }

    if (coreGroupRef.current) {
      coreGroupRef.current.rotation.y = time * 0.4;
      coreGroupRef.current.rotation.x = time * 0.2;
      const scale = 0.8 + coreActivity * 0.6;
      coreGroupRef.current.scale.setScalar(scale);
    }

    if (corePointsRef.current) {
      const mat = corePointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.2 + coreActivity * 0.8, delta * 4);
    }

    if (coreLinesRef.current) {
      const mat = coreLinesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.1 + coreActivity * 0.6, delta * 4);
    }
  });

  return (
    <group ref={coreGroupRef} position={[0, 0, 0]}>
      {/* Synaptic Nodes */}
      <points ref={corePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00F0FF"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Neural Synapse Connection Lines */}
      <lineSegments ref={coreLinesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Inner Glowing Synaptic Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
