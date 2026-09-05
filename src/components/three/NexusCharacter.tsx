'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { getCharacterState } from '@/lib/characterStateMachine';
import { getCharacterTransition, ModelType } from '@/utils/nexusTransitions';
import NexusPrototype from './NexusPrototype';

// Paths for the official 3D GLB Models (Production Assets)
export const GLB_MODEL_PATHS = {
  human: '/models/nexus/humanHead.glb',
  hybrid: '/models/nexus/hybridHead.glb',
  android: '/models/nexus/androidHead.glb',
} as const;

/**
 * Preload API for NEXUS GLB Models.
 * Call this function to prime the Drei cache once real GLB files are present.
 */
export function preloadNexusGLBs() {
  try {
    useGLTF.preload(GLB_MODEL_PATHS.human);
    useGLTF.preload(GLB_MODEL_PATHS.hybrid);
    useGLTF.preload(GLB_MODEL_PATHS.android);
  } catch {
    // Gracefully ignore missing GLB files during pre-production
  }
}

interface GLBModelInstanceProps {
  modelType: ModelType;
  path: string;
  visible: boolean;
  opacity?: number;
}

/**
 * Individual GLB Head Model Renderer
 * Keeps cached scenes in VRAM without unmounting to eliminate GC jank during scroll transitions.
 */
function GLBHeadInstance({ path, visible }: GLBModelInstanceProps) {
  const { scene } = useGLTF(path);
  const clone = React.useMemo(() => scene.clone(true), [scene]);

  return <primitive object={clone} visible={visible} />;
}

/**
 * NexusCharacter - Core 3D Protagonist Container & Transition Pipeline
 * 
 * Manages transitions across the 5 narrative states:
 * 01_HUMAN | 02_SKIN_REVEAL | 03_HYBRID | 04_ANDROID | 05_NEXUS_FINAL
 */
export default function NexusCharacter() {
  const containerRef = useRef<THREE.Group>(null);
  const setCharacterState = useStore((state) => state.setCharacterState);
  const lastStateRef = useRef<string>('01_HUMAN');

  // Track if GLB assets are available in public/models/nexus/
  const [hasGLBModels, setHasGLBModels] = useState<boolean>(false);
  const [transitionData, setTransitionData] = useState(() => getCharacterTransition(0));

  // Check if GLBs are present on runtime (Pre-production fallback check)
  useEffect(() => {
    let isMounted = true;
    async function checkGLBAvailability() {
      try {
        const res = await fetch(GLB_MODEL_PATHS.human, { method: 'HEAD' });
        if (res.ok && isMounted) {
          setHasGLBModels(true);
        }
      } catch {
        if (isMounted) setHasGLBModels(false);
      }
    }
    checkGLBAvailability();
    return () => { isMounted = false; };
  }, []);

  useFrame((state) => {
    const scrollProgress = useStore.getState().scrollProgress;
    const currentState = getCharacterState(scrollProgress);

    // Update store state on boundary changes
    if (currentState !== lastStateRef.current) {
      lastStateRef.current = currentState;
      setCharacterState(currentState);
    }

    // Evaluate transition parameters for frame-rate interpolation
    const transition = getCharacterTransition(scrollProgress);
    setTransitionData(transition);

    // Telemetry dispatch for DebugHUD if renderer info is available
    if (typeof window !== 'undefined' && state.gl.info) {
      const detail = {
        drawCalls: state.gl.info.render.calls,
        triangles: state.gl.info.render.triangles,
        geometries: state.gl.info.memory.geometries,
        textures: state.gl.info.memory.textures,
      };
      window.dispatchEvent(new CustomEvent('nexus:webgl-info', { detail }));
    }
  });

  return (
    <group ref={containerRef} position={[0, 0, 0]}>
      {hasGLBModels ? (
        <React.Suspense fallback={<NexusPrototype />}>
          <GLBHeadInstance
            modelType="human"
            path={GLB_MODEL_PATHS.human}
            visible={transitionData.primaryModel === 'human' || transitionData.secondaryModel === 'human'}
          />
          <GLBHeadInstance
            modelType="hybrid"
            path={GLB_MODEL_PATHS.hybrid}
            visible={transitionData.primaryModel === 'hybrid' || transitionData.secondaryModel === 'hybrid'}
          />
          <GLBHeadInstance
            modelType="android"
            path={GLB_MODEL_PATHS.android}
            visible={transitionData.primaryModel === 'android' || transitionData.secondaryModel === 'android'}
          />
        </React.Suspense>
      ) : (
        /* Fallback for Pre-GLB Phase: NexusPrototype handles abstract visual representation */
        <NexusPrototype />
      )}
    </group>
  );
}
