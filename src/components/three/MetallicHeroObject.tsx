'use client';

import React, { forwardRef, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { getCharacterTransition } from '@/utils/nexusTransitions';
import {
  nexusDissolveVertexShader,
  nexusDissolveFragmentShader,
} from './materials/NexusDissolveMaterial';

interface MetallicHeroObjectProps {
  radius?: number;
}

/**
 * MetallicHeroObject - Procedural stand-in for the future GLB head models.
 *
 * Drives the same dissolve/fresnel shader that will later run on the real
 * humanHead/hybridHead/androidHead GLBs, so the visual language (titanium
 * base + cyan dissolve edge + metallic rim) is validated today, without
 * waiting on external assets. The silhouette must stay legible at all times
 * (DESIGN_SYSTEM.md), so the dissolve amount is capped and only rises during
 * an actual narrative transition (when a secondary model is queued in
 * getCharacterTransition), settling back to a solid metallic surface once
 * a state resolves.
 */
const MAX_VISUAL_DISSOLVE = 0.4;

const MetallicHeroObject = forwardRef<THREE.Mesh, MetallicHeroObjectProps>(
  function MetallicHeroObject({ radius = 0.9 }, forwardedRef) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(
      () => ({
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uNoiseScale: { value: 18.0 },
        uEdgeWidth: { value: 0.06 },
        uEdgeColor: { value: new THREE.Color('#00F0FF') },
      }),
      []
    );

    useFrame((state) => {
      const mat = materialRef.current;
      if (!mat) return;

      const { scrollProgress, prefersReducedMotion } = useStore.getState();
      const transition = getCharacterTransition(scrollProgress);

      // Triangular pulse (0 -> 1 -> 0) across a transition window, only while
      // a secondary model is actively queued. Settled states (no secondary
      // model) stay fully solid.
      const pulse = transition.secondaryModel
        ? 1 - Math.abs(transition.localProgress * 2 - 1)
        : 0;

      mat.uniforms.uTime.value = prefersReducedMotion ? 0 : state.clock.getElapsedTime();
      mat.uniforms.uProgress.value = pulse * MAX_VISUAL_DISSOLVE;
    });

    return (
      <mesh ref={forwardedRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={nexusDissolveVertexShader}
          fragmentShader={nexusDissolveFragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }
);

export default MetallicHeroObject;
