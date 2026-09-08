'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

// Paths to the 5 official concept art images in public/images/nexus/
const CONCEPT_IMAGE_PATHS = {
  human: '/images/nexus/nexus-human.png',
  skinReveal: '/images/nexus/nexus-skin-reveal.png',
  hybrid: '/images/nexus/nexus-hybrid.png',
  android: '/images/nexus/nexus-android.png',
  final: '/images/nexus/nexus-final.png',
} as const;

/**
 * Calculates continuous smooth crossfade weights (0.0 to 1.0) for all 5 images
 * across the entire scroll progress range [0.0, 1.0].
 */
function getConceptWeights(p: number) {
  const clamped = Math.max(0, Math.min(1, p));
  let wHuman = 0;
  let wSkin = 0;
  let wHybrid = 0;
  let wAndroid = 0;
  let wFinal = 0;

  if (clamped < 0.15) {
    // Scene 01: Human Pure Form
    wHuman = 1.0;
  } else if (clamped < 0.32) {
    // Scene 02: Human -> Skin Reveal
    const t = (clamped - 0.15) / 0.17;
    wHuman = 1.0 - t;
    wSkin = t;
  } else if (clamped < 0.48) {
    // Scene 03: Skin Reveal -> Hybrid
    const t = (clamped - 0.32) / 0.16;
    wSkin = 1.0 - t;
    wHybrid = t;
  } else if (clamped < 0.75) {
    // Scene 04: Hybrid -> Android
    const t = (clamped - 0.48) / 0.27;
    wHybrid = 1.0 - t;
    wAndroid = t;
  } else if (clamped < 0.88) {
    // Scene 05: Android Core
    wAndroid = 1.0;
  } else {
    // Scene 06: Android -> Nexus Final Convergence
    const t = (clamped - 0.88) / 0.12;
    wAndroid = 1.0 - t;
    wFinal = t;
  }

  return { wHuman, wSkin, wHybrid, wAndroid, wFinal };
}

/**
 * Holographic 3D Concept Display Component
 * Seamlessly links and blends all 5 official transformation concepts in 3D space
 * with scanlines and dynamic holographic projection reticles.
 */
export default function HolographicConceptDisplay() {
  const groupRef = useRef<THREE.Group>(null);
  const scanlineRef = useRef<THREE.Mesh>(null);

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
    const time = state.clock.getElapsedTime();

    // Floating breathing motion in sync with the scene
    if (groupRef.current) {
      groupRef.current.position.y = 0.1 + Math.sin(time * 1.2) * 0.03;
      groupRef.current.rotation.y = Math.sin(time * 0.6) * 0.04;
    }

    // Dynamic scanning laser sweep across the holographic plane
    if (scanlineRef.current) {
      scanlineRef.current.position.y = ((time * 0.8) % 2.4) - 1.2;
    }

    // Compute continuous seamless weights
    const weights = getConceptWeights(scrollProgress);

    // Smooth lerp for visual opacity
    const applyOpacity = (meshRef: React.RefObject<THREE.Mesh | null>, target: number) => {
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, target * 0.95, delta * 8);
        meshRef.current.visible = mat.opacity > 0.005;
      }
    };

    applyOpacity(meshHumanRef, weights.wHuman);
    applyOpacity(meshSkinRef, weights.wSkin);
    applyOpacity(meshHybridRef, weights.wHybrid);
    applyOpacity(meshAndroidRef, weights.wAndroid);
    applyOpacity(meshFinalRef, weights.wFinal);
  });

  return (
    <group ref={groupRef} position={[0, 0.08, 0.05]}>
      {/* 01_HUMAN Plane */}
      <mesh ref={meshHumanRef} position={[0, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          map={texHuman}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 02_SKIN_REVEAL Plane */}
      <mesh ref={meshSkinRef} position={[0, 0, 0.002]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          map={texSkin}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 03_HYBRID Plane */}
      <mesh ref={meshHybridRef} position={[0, 0, 0.004]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          map={texHybrid}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 04_ANDROID Plane */}
      <mesh ref={meshAndroidRef} position={[0, 0, 0.006]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          map={texAndroid}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 05_NEXUS_FINAL Plane */}
      <mesh ref={meshFinalRef} position={[0, 0, 0.008]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial
          map={texFinal}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle Holographic Laser Scanline */}
      <mesh ref={scanlineRef} position={[0, 0, 0.015]}>
        <planeGeometry args={[2.5, 0.02]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

