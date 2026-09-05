'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import CameraRig from './CameraRig';
import MetallicHeroObject from './MetallicHeroObject';
import IndustrialEnvironment from './IndustrialEnvironment';

export default function SceneCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-[#050505]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050505']} />
        
        <Suspense fallback={null}>
          <CameraRig />
          <IndustrialEnvironment />
          <MetallicHeroObject />

          <EffectComposer enableNormalPass={false}>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.7}
              luminanceSmoothing={0.3}
            />
            <Vignette eskil={false} offset={0.2} darkness={0.9} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
