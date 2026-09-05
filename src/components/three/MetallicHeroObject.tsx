'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export default function MetallicHeroObject() {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const explodedGroupRef = useRef<THREE.Group>(null);
  const topPlateRef = useRef<THREE.Mesh>(null);
  const bottomPlateRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;

    // Continuous rotation + scroll multiplier
    const rotSpeed = 0.5 + scrollProgress * 3.0;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * rotSpeed;
      outerRingRef.current.rotation.x = THREE.MathUtils.lerp(
        outerRingRef.current.rotation.x,
        scrollProgress * Math.PI,
        delta * 3
      );
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * (rotSpeed * 1.5);
      innerCoreRef.current.rotation.z += delta * 0.2;
    }

    // Exploded view transition (Scenes 3 & 4: scrollProgress between 0.35 and 0.75)
    const explodeFactor = THREE.MathUtils.clamp((scrollProgress - 0.25) * 2.5, 0, 1);

    if (topPlateRef.current) {
      topPlateRef.current.position.y = THREE.MathUtils.lerp(
        topPlateRef.current.position.y,
        0.8 + explodeFactor * 1.5,
        delta * 4
      );
    }

    if (bottomPlateRef.current) {
      bottomPlateRef.current.position.y = THREE.MathUtils.lerp(
        bottomPlateRef.current.position.y,
        -0.8 - explodeFactor * 1.5,
        delta * 4
      );
    }

    if (explodedGroupRef.current) {
      explodedGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        explodedGroupRef.current.rotation.y,
        scrollProgress * Math.PI * 2,
        delta * 2
      );
    }
  });

  return (
    <group ref={explodedGroupRef} position={[0, 0, 0]}>
      {/* Central High-Precision Mechanical Core */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#B0C4DE"
          metalness={0.95}
          roughness={0.15}
          wireframe={false}
        />
      </mesh>

      {/* Outer Precision Machined Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.6, 0.18, 32, 64]} />
        <meshStandardMaterial
          color="#8A9EA7"
          metalness={1.0}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Top Exploded Component */}
      <mesh ref={topPlateRef} position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 0.15, 32]} />
        <meshStandardMaterial
          color="#D0D8E0"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Bottom Exploded Component */}
      <mesh ref={bottomPlateRef} position={[0, -0.8, 0]}>
        <cylinderGeometry args={[1.3, 1.1, 0.15, 32]} />
        <meshStandardMaterial
          color="#6C7A89"
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      {/* Industrial Accent Ring Bolts */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
        <mesh
          key={idx}
          position={[
            Math.cos(angle) * 1.6,
            0,
            Math.sin(angle) * 1.6,
          ]}
        >
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#FF5500" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}
