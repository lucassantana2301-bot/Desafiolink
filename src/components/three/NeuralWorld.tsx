'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

// Deterministic pseudo-random generator for pure rendering
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function NeuralWorld() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const worldGroupRef = useRef<THREE.Group>(null);

  const devicePerformance = useStore((state) => state.devicePerformance);
  const prefersReducedMotion = useStore((state) => state.prefersReducedMotion);

  // Balanced node count for clean, high-precision geometry
  const count = useMemo(() => {
    if (devicePerformance === 'low' || devicePerformance === 'unknown') return 90;
    if (devicePerformance === 'medium') return 180;
    return 320; // High tier: organized, clean and crisp
  }, [devicePerformance]);

  const { positions, linePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const linePosList: number[] = [];

    for (let i = 0; i < count; i++) {
      // Concentrated corona surrounding and behind the head (radius 1.15 to 3.8)
      const u = pseudoRandom(i * 3 + 1);
      const v = pseudoRandom(i * 3 + 2);
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      
      const radius = 1.25 + Math.pow(pseudoRandom(i * 3 + 3), 1.6) * 2.8;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) + 0.1;
      let z = radius * Math.cos(phi);

      // Facial clearance: push nodes away from front ocular zone (X: [-0.6, 0.6], Y: [-0.4, 0.5], Z > 0.4)
      if (Math.abs(x) < 0.65 && y > -0.4 && y < 0.55 && z > 0.3) {
        z = -Math.abs(z) - 0.4; // shift behind the head
      }

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }

    // Connect only close neighbors to form structured crystalline neural pathways
    for (let i = 0; i < count; i++) {
      let connections = 0;
      for (let j = i + 1; j < count; j++) {
        if (connections >= 3) break; // limit max degree per node to prevent clutter

        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 1.15) {
          linePosList.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
          connections++;
        }
      }
    }

    return {
      positions: pos,
      linePositions: new Float32Array(linePosList),
    };
  }, [count]);

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;
    const time = state.clock.getElapsedTime();

    // Matrix active from Scene 04 through Scene 06 NEXUS Convergence
    const isVisible = scrollProgress >= 0.55;
    if (worldGroupRef.current) {
      worldGroupRef.current.visible = isVisible;
    }

    if (!isVisible) return;

    let opacity = 0;
    if (scrollProgress >= 0.58) {
      if (scrollProgress < 0.65) {
        opacity = (scrollProgress - 0.58) / 0.07;
      } else if (scrollProgress >= 0.65 && scrollProgress <= 0.88) {
        opacity = 1.0;
      } else if (scrollProgress > 0.88 && scrollProgress <= 0.96) {
        // Scene 06 Convergence into Protagonist
        opacity = 0.85;
      } else {
        // Final frame serene quiet at 98-100%
        opacity = Math.max(0.15, 0.85 - (scrollProgress - 0.96) * 15);
      }
    }

    // Convergence funnel into the protagonist in Scene 06
    let convergenceScale = 1.0;
    if (scrollProgress > 0.88) {
      const convNorm = Math.min(1, (scrollProgress - 0.88) / 0.10);
      convergenceScale = 1.0 - convNorm * 0.35; // strands funnel inwards into head/neck
    }

    // Gentle, hypnotic rotation around the protagonist
    if (worldGroupRef.current) {
      worldGroupRef.current.rotation.y = time * 0.035;
      worldGroupRef.current.scale.setScalar(convergenceScale);
      
      if (!prefersReducedMotion) {
        const pointer = state.pointer;
        worldGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          worldGroupRef.current.rotation.x,
          pointer.y * 0.06,
          delta * 2
        );
        worldGroupRef.current.position.x = THREE.MathUtils.lerp(
          worldGroupRef.current.position.x,
          pointer.x * 0.08,
          delta * 2
        );
      }
    }

    // Slow, breathing neural pulse wave
    const wavePulse = 0.85 + Math.sin(time * 1.8 + scrollProgress * 6) * 0.15;

    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = opacity * 0.85 * wavePulse;
      mat.size = (scrollProgress > 0.88 ? 0.04 : 0.05) * wavePulse;
    }

    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = opacity * 0.22 * wavePulse;
    }
  });

  return (
    <group ref={worldGroupRef} position={[0, 0.05, 0]}>
      {/* 3D Neural Corona Synaptic Nodes */}
      <points ref={pointsRef}>
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
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Synaptic Geometric Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}


