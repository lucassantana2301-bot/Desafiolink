'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export default function NexusPrototype() {
  const groupRef = useRef<THREE.Group>(null);
  const outerShellGroupRef = useRef<THREE.Group>(null);
  const headSilhouetteRef = useRef<THREE.Mesh>(null);
  const wireframeLayerRef = useRef<THREE.Mesh>(null);
  const leftRingRef = useRef<THREE.Mesh>(null);
  const rightRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;
    const time = state.clock.getElapsedTime();

    // GPU Culling (Fix 05): Hide object completely when inside Scene 05 Neural World
    const isVisible = scrollProgress <= 0.70 || scrollProgress >= 0.84;
    if (groupRef.current) {
      groupRef.current.visible = isVisible;
    }

    if (!isVisible) return;

    // Subtle breathing motion for Scene 01
    const breath = Math.sin(time * 1.5) * 0.03;

    // Explode factor calculation for Scenes 02, 03 & 04 (scrollProgress 0.15 to 0.65)
    let explode = 0;
    if (scrollProgress > 0.15 && scrollProgress <= 0.65) {
      explode = (scrollProgress - 0.15) / 0.5;
    } else if (scrollProgress >= 0.84) {
      explode = (1.0 - scrollProgress) / 0.16; // re-converges in Scene 06
    }

    // Outer Shell Separation & Rotation
    if (outerShellGroupRef.current) {
      outerShellGroupRef.current.position.y = breath;
      outerShellGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        outerShellGroupRef.current.rotation.y,
        scrollProgress * Math.PI * 2.5,
        delta * 2.5
      );
    }

    // Head Silhouette Opacity and Blend
    if (headSilhouetteRef.current) {
      headSilhouetteRef.current.scale.setScalar(1.0 + breath * 0.5);
    }

    // Wireframe Layer Rotation & Explosion Offset
    if (wireframeLayerRef.current) {
      wireframeLayerRef.current.rotation.x = time * 0.2;
      wireframeLayerRef.current.rotation.z = time * 0.1;
      wireframeLayerRef.current.scale.setScalar(1.0 + explode * 0.4);
    }

    // Biomechanical Rings Exploded Movement
    if (leftRingRef.current && rightRingRef.current) {
      leftRingRef.current.position.x = THREE.MathUtils.lerp(
        leftRingRef.current.position.x,
        -0.9 - explode * 1.8,
        delta * 3.5
      );
      rightRingRef.current.position.x = THREE.MathUtils.lerp(
        rightRingRef.current.position.x,
        0.9 + explode * 1.8,
        delta * 3.5
      );

      leftRingRef.current.rotation.y = time * 0.5;
      rightRingRef.current.rotation.y = -time * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group ref={outerShellGroupRef}>
        {/* Abstract Head Silhouette (Stylized Titanium / Obsidian Head-like ellipsoid) */}
        <mesh ref={headSilhouetteRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshPhysicalMaterial
            color="#0F1115"
            roughness={0.2}
            metalness={0.9}
            clearcoat={0.4}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Wireframe Biomechanical Inner Layer */}
        <mesh ref={wireframeLayerRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.05, 3]} />
          <meshStandardMaterial
            color="#9CA8B6"
            wireframe={true}
            transparent={true}
            opacity={0.35}
          />
        </mesh>

        {/* Left Biomechanical Shell Ring */}
        <mesh ref={leftRingRef} position={[-0.9, 0, 0]}>
          <torusGeometry args={[0.65, 0.06, 16, 32]} />
          <meshStandardMaterial color="#00F0FF" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Right Biomechanical Shell Ring */}
        <mesh ref={rightRingRef} position={[0.9, 0, 0]}>
          <torusGeometry args={[0.65, 0.06, 16, 32]} />
          <meshStandardMaterial color="#9CA8B6" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Subtle Halo Rim Line */}
        <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.85, 0.015, 16, 64]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}
