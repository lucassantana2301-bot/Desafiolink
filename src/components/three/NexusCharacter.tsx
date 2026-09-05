'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { getCharacterState } from '@/lib/characterStateMachine';
import NexusPrototype from './NexusPrototype';

/**
 * NexusCharacter - Future GLB Model Pipeline Container
 * 
 * Manages character state transitions across the 5 narrative states:
 * 01_HUMAN | 02_SKIN_REVEAL | 03_HYBRID | 04_ANDROID | 05_NEXUS_FINAL
 */
export default function NexusCharacter() {
  const containerRef = useRef<THREE.Group>(null);
  const setCharacterState = useStore((state) => state.setCharacterState);
  const lastStateRef = useRef<string>('01_HUMAN');

  useFrame(() => {
    const scrollProgress = useStore.getState().scrollProgress;
    const currentState = getCharacterState(scrollProgress);

    // Update store ONLY on character state boundary changes (Slow Data update)
    if (currentState !== lastStateRef.current) {
      lastStateRef.current = currentState;
      setCharacterState(currentState);
    }
  });

  return (
    <group ref={containerRef} position={[0, 0, 0]}>
      {/* 
        Pre-GLB Phase: NexusPrototype handles abstract visual representation.
        When real GLBs arrive:
        <primitive object={humanHead.scene} visible={characterState === '01_HUMAN'} />
        <primitive object={hybridHead.scene} visible={characterState === '03_HYBRID' || characterState === '05_NEXUS_FINAL'} />
        <primitive object={androidHead.scene} visible={characterState === '04_ANDROID'} />
      */}
      <NexusPrototype />
    </group>
  );
}

export function preloadNexusGLBs() {
  // useGLTF.preload('/models/humanHead.glb');
  // useGLTF.preload('/models/hybridHead.glb');
  // useGLTF.preload('/models/androidHead.glb');
}
