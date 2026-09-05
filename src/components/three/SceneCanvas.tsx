'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useStore } from '@/store/useStore';
import CameraRig from './CameraRig';
import NexusCharacter from './NexusCharacter';
import NeuralCore from './NeuralCore';
import NeuralWorld from './NeuralWorld';
import LightsEnvironment from './LightsEnvironment';
import WebGLFallback from '../ui/WebGLFallback';
import ErrorBoundary from '../ui/ErrorBoundary';

export default function SceneCanvas() {
  const devicePerformance = useStore((state) => state.devicePerformance);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Check WebGL hardware support on mount
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      try {
        const canvas = document.createElement('canvas');
        const webgl = !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
        setHasWebGL(webgl);
      } catch {
        setHasWebGL(false);
      }
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  // Initial Flash Prevention (Fix D): Default to conservative DPR 1.0 when performance tier is 'unknown'
  const dpr: [number, number] | number =
    devicePerformance === 'high'
      ? [1, 2]
      : devicePerformance === 'medium'
      ? [1, 1.25]
      : 1.0;

  const showPostprocessing = devicePerformance === 'high' || devicePerformance === 'medium';

  return (
    <ErrorBoundary fallback={<WebGLFallback />}>
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
            <NexusCharacter />
            <NeuralCore />
            <NeuralWorld />

            {showPostprocessing && (
              <EffectComposer enableNormalPass={false}>
                <Bloom
                  intensity={devicePerformance === 'high' ? 0.45 : 0.25}
                  luminanceThreshold={0.85}
                  luminanceSmoothing={0.2}
                />
                <Vignette eskil={false} offset={0.25} darkness={0.85} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}
