'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { getCharacterState } from '@/lib/characterStateMachine';
import { getCharacterTransition, ModelType } from '@/utils/nexusTransitions';
import HolographicConceptDisplay from './HolographicConceptDisplay';

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
function disposeObject3D(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    const material = mesh.material;
    if (material) {
      const materials = Array.isArray(material) ? material : [material];
      materials.forEach((mat) => {
        Object.values(mat).forEach((value) => {
          if (value instanceof THREE.Texture) {
            value.dispose();
          }
        });
        mat.dispose();
      });
    }
  });
}

function GLBHeadInstance({ path, visible }: GLBModelInstanceProps) {
  const { scene } = useGLTF(path);
  const clone = React.useMemo(() => scene.clone(true), [scene]);

  // Release cloned geometries/materials/textures when this instance goes away
  // (e.g. hasGLBModels flips back to false, or the whole container unmounts).
  React.useEffect(() => {
    return () => disposeObject3D(clone);
  }, [clone]);

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
  const lastTransitionKeyRef = useRef<string>('human|');

  // Track if GLB assets are available in public/models/nexus/
  const [hasGLBModels, setHasGLBModels] = useState<boolean>(false);
  const [transitionData, setTransitionData] = useState(() => getCharacterTransition(0));

  // Computed once: avoids allocating + dispatching a CustomEvent every frame
  // when nobody (DebugHUD, ?debug3d=1) is listening.
  const [isDebugActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('debug3d') === '1';
  });

  // Check if ALL THREE GLBs are present on runtime (Pre-production fallback check).
  // Requiring all three (not just humanHead) avoids a partial-asset drop breaking
  // the experience: useGLTF on a missing file throws past Suspense into the
  // ErrorBoundary, which would blank the entire 3D canvas over one missing file.
  useEffect(() => {
    let isMounted = true;
    async function checkGLBAvailability() {
      try {
        const results = await Promise.all(
          Object.values(GLB_MODEL_PATHS).map((path) =>
            fetch(path, { method: 'HEAD' }).then((res) => res.ok).catch(() => false)
          )
        );
        if (isMounted) {
          setHasGLBModels(results.every(Boolean));
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

    // Evaluate transition parameters, but only push a React state update when the
    // primary/secondary model pairing actually changes (a handful of times across
    // the whole scroll) - NOT on every frame's continuous dissolveProgress value.
    // GLBHeadInstance only needs the boolean `visible` derived from this; any future
    // per-frame dissolve uniform should be read via useStore.getState() inside its
    // own useFrame, the same pattern used by CameraRig/MetallicHeroObject.
    const transition = getCharacterTransition(scrollProgress);
    const transitionKey = `${transition.primaryModel}|${transition.secondaryModel ?? ''}`;
    if (transitionKey !== lastTransitionKeyRef.current) {
      lastTransitionKeyRef.current = transitionKey;
      setTransitionData(transition);
    }

    // Telemetry dispatch for DebugHUD - skipped entirely unless ?debug3d=1 is
    // active, to avoid allocating + dispatching a CustomEvent on every frame.
    if (isDebugActive && state.gl.info) {
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
        // Fallback is itself wrapped in its own Suspense: HolographicConceptDisplay's
        // useTexture calls can suspend independently (e.g. cold cache on a slow
        // connection right as hasGLBModels flips true), and without this inner
        // boundary that suspense would bubble past this one to the canvas-root
        // Suspense in SceneCanvas.tsx, blanking CameraRig/Lights/NeuralCore/NeuralWorld
        // too - the exact cascade the isolated-Suspense fix in PROJECT_STATUS.md #8
        // was meant to prevent.
        <React.Suspense fallback={
          <React.Suspense fallback={null}>
            <HolographicConceptDisplay />
          </React.Suspense>
        }>
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
        /* Cinematic Protagonist Integration: Approved official concept art as central hero */
        <React.Suspense fallback={null}>
          <HolographicConceptDisplay />
        </React.Suspense>
      )}
    </group>
  );
}
