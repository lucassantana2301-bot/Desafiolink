'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export default function NeuralCore() {
  const corePointsRef = useRef<THREE.Points>(null);
  const coreLinesRef = useRef<THREE.LineSegments>(null);
  const coreGroupRef = useRef<THREE.Group>(null);
  const impulsePointsRef = useRef<THREE.Points>(null);

  const devicePerformance = useStore((state) => state.devicePerformance);

  // Dynamic node count based on Performance Tier
  const nodeCount = useMemo(() => {
    if (devicePerformance === 'low' || devicePerformance === 'unknown') return 70;
    if (devicePerformance === 'medium') return 130;
    return 200; // High tier
  }, [devicePerformance]);

  // Memoized buffer positions for synaptic nerve network
  const { positions, linePositions, impulsePositions } = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    const linePosList: number[] = [];

    // Organic non-spherical distribution of synaptic cluster
    for (let i = 0; i < nodeCount; i++) {
      const u = (i / nodeCount) * Math.PI * 2;
      const v = Math.acos((2 * (i % 30)) / 30 - 1);
      const rad = 0.45 + (Math.sin(i * 12.3) * 0.5 + 0.5) * 0.55;

      const x = rad * Math.sin(v) * Math.cos(u) * 1.1;
      const y = rad * Math.sin(v) * Math.sin(u) * 0.9;
      const z = rad * Math.cos(v) * 1.2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }

    // Connect close neighbors
    for (let i = 0; i < nodeCount; i++) {
      let connections = 0;
      for (let j = i + 1; j < nodeCount; j++) {
        if (connections >= 2) break;
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 0.42) {
          linePosList.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
          connections++;
        }
      }
    }

    // Active electrical firing nodes
    const impulseCount = Math.floor(nodeCount / 4);
    const impPos = new Float32Array(impulseCount * 3);
    for (let k = 0; k < impulseCount; k++) {
      const srcIdx = (k * 4) % nodeCount;
      impPos[k * 3] = pos[srcIdx * 3];
      impPos[k * 3 + 1] = pos[srcIdx * 3 + 1];
      impPos[k * 3 + 2] = pos[srcIdx * 3 + 2];
    }

    return {
      positions: pos,
      linePositions: new Float32Array(linePosList),
      impulsePositions: impPos,
    };
  }, [nodeCount]);

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;
    const time = state.clock.getElapsedTime();

    // Active from Scene 04 through early Scene 05 (0.42 to 0.78)
    const isVisible = scrollProgress >= 0.42 && scrollProgress <= 0.80;
    if (coreGroupRef.current) {
      coreGroupRef.current.visible = isVisible;
    }

    if (!isVisible) return;

    // Progressive growth of impulses (Scene 04 birth of electrical network)
    let coreActivity = 0;
    if (scrollProgress >= 0.45 && scrollProgress <= 0.75) {
      coreActivity = Math.sin(((scrollProgress - 0.45) / 0.30) * Math.PI);
    }

    if (coreGroupRef.current) {
      coreGroupRef.current.rotation.y = time * 0.3;
      coreGroupRef.current.rotation.x = time * 0.15;
      const scale = 0.7 + coreActivity * 0.6;
      coreGroupRef.current.scale.setScalar(scale);
    }

    if (corePointsRef.current) {
      const mat = corePointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.2 + coreActivity * 0.7, delta * 4);
    }

    if (coreLinesRef.current) {
      const mat = coreLinesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.12 + coreActivity * 0.5, delta * 4);
    }

    // Electrical Impulse Pulse
    if (impulsePointsRef.current) {
      const mat = impulsePointsRef.current.material as THREE.PointsMaterial;
      const spark = 0.5 + Math.sin(time * 8) * 0.5;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, (0.3 + spark * 0.7) * coreActivity, delta * 6);
      mat.size = 0.05 + spark * 0.03;
    }
  });

  return (
    <group ref={coreGroupRef} position={[0, 0, 0]}>
      {/* Synaptic Pathway Nodes */}
      <points ref={corePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#00F0FF"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
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
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Electrical Impulse Spark Points */}
      <points ref={impulsePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[impulsePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#FFFFFF"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

