'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { getCharacterTransition } from '@/utils/nexusTransitions';

// Paths to the 5 official concept art images in public/images/nexus/
const CONCEPT_IMAGE_PATHS = {
  human: '/images/nexus/nexus-human.png',
  skinReveal: '/images/nexus/nexus-skin-reveal.png',
  hybrid: '/images/nexus/nexus-hybrid.png',
  android: '/images/nexus/nexus-android.png',
  final: '/images/nexus/nexus-final.png',
} as const;

/**
 * Holographic 3D Concept Plane Component
 * Renders textured plane with subtle scanline holographic shaders and smooth opacity crossfades.
 */
export default function HolographicConceptDisplay() {
  const groupRef = useRef<THREE.Group>(null);
  const meshHumanRef = useRef<THREE.Mesh>(null);
  const meshSkinRef = useRef<THREE.Mesh>(null);
  const meshHybridRef = useRef<THREE.Mesh>(null);
  const meshAndroidRef = useRef<THREE.Mesh>(null);
  const meshFinalRef = useRef<THREE.Mesh>(null);

  // Pre-load all 5 concept art textures via Drei useTexture
  const [texHuman, texSkin, texHybrid, texAndroid, texFinal] = useTexture([
    CONCEPT_IMAGE_PATHS.human,
    CONCEPT_IMAGE_PATHS.skinReveal,
    CONCEPT_IMAGE_PATHS.hybrid,
    CONCEPT_IMAGE_PATHS.android,
    CONCEPT_IMAGE_PATHS.final,
  ]);

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;
    const transition = getCharacterTransition(scrollProgress);
    const time = state.clock.getElapsedTime();

    // Floating breathing effect
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 1.2) * 0.04;
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
    }

    // Hide inside Scene 05 Neural World matrix to preserve culling
    const isVisible = scrollProgress <= 0.65 || scrollProgress >= 0.86;
    if (groupRef.current) {
      groupRef.current.visible = isVisible;
    }
    if (!isVisible) return;

    // Smooth opacity targets based on active narrative state
    let opHuman = 0;
    let opSkin = 0;
    let opHybrid = 0;
    let opAndroid = 0;
    let opFinal = 0;

    switch (transition.activeState) {
      case '01_HUMAN':
        opHuman = 0.95;
        break;
      case '02_SKIN_REVEAL':
        opHuman = 1.0 - transition.dissolveProgress;
        opSkin = transition.dissolveProgress;
        break;
      case '03_HYBRID':
        opHybrid = 0.95;
        break;
      case '04_ANDROID':
        opHybrid = 1.0 - transition.dissolveProgress;
        opAndroid = transition.dissolveProgress;
        break;
      case '05_NEXUS_FINAL':
        opFinal = 0.95;
        break;
    }

    // Apply smooth damp interpolation for opacity
    const damp = (matRef: React.RefObject<THREE.Mesh | null>, targetOp: number) => {
      if (matRef.current) {
        const mat = matRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOp, delta * 5);
        matRef.current.visible = mat.opacity > 0.01;
      }
    };

    damp(meshHumanRef, opHuman);
    damp(meshSkinRef, opSkin);
    damp(meshHybridRef, opHybrid);
    damp(meshAndroidRef, opAndroid);
    damp(meshFinalRef, opFinal);
  });

  return (
    <group ref={groupRef} position={[0, 0.1, 0.2]}>
      {/* 01_HUMAN Plane */}
      <mesh ref={meshHumanRef} position={[0, 0, 0]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          map={texHuman}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 02_SKIN_REVEAL Plane */}
      <mesh ref={meshSkinRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          map={texSkin}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 03_HYBRID Plane */}
      <mesh ref={meshHybridRef} position={[0, 0, 0.02]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          map={texHybrid}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 04_ANDROID Plane */}
      <mesh ref={meshAndroidRef} position={[0, 0, 0.03]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          map={texAndroid}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 05_NEXUS_FINAL Plane */}
      <mesh ref={meshFinalRef} position={[0, 0, 0.04]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          map={texFinal}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Futuristic Holographic Framing Reticle */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[2.35, 2.35]} />
        <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}
