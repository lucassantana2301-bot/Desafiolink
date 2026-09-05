'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useStore } from '@/store/useStore';
import CameraRig from './CameraRig';
import NexusPrototype from './NexusPrototype';
import NeuralCore from './NeuralCore';
import NeuralWorld from './NeuralWorld';
import LightsEnvironment from './LightsEnvironment';

export default function SceneCanvas() {
  const devicePerformance = useStore((state) => state.devicePerformance);

  // Dynamic DPR scaling based on Performance Tier (Fix 03)
  const dpr: [number, number] | number =
    devicePerformance === 'high'
      ? [1, 2]
      : devicePerformance === 'medium'
      ? [1, 1.25]
      : 1.0;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-[#050505]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={dpr}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050505']} />
        
        <Suspense fallback={null}>
          <CameraRig />
          <LightsEnvironment />
          <NexusPrototype />
          <NeuralCore />
          <NeuralWorld />

          {/* Selective Postprocessing based on Performance Tier (Fix 03 & Fix 10) */}
          {devicePerformance !== 'low' && (
            <EffectComposer enableNormalPass={false}>
              <Bloom
                intensity={devicePerformance === 'high' ? 0.45 : 0.25}
                luminanceThreshold={0.85} // High threshold to prevent titanium over-glow
                luminanceSmoothing={0.2}
              />
              <Vignette eskil={false} offset={0.25} darkness={0.85} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
