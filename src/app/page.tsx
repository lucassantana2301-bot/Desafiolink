'use client';

import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Navbar from '@/components/ui/Navbar';
import HeroOverlay from '@/components/ui/HeroOverlay';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

// Dynamic import for WebGL Canvas with SSR disabled
const SceneCanvas = dynamic(() => import('@/components/three/SceneCanvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      {/* 3D WebGL Canvas Viewport (Fixed Fullscreen) */}
      <SceneCanvas />

      {/* Loading Calibration System (Fix 08) */}
      <LoadingOverlay />

      {/* 2D HUD Navigation and Narrative Telemetry */}
      <Navbar />
      <HeroOverlay />

      {/* ~600vh Cinematic Scroll Timeline Container for GSAP ScrollTrigger */}
      <SmoothScroll>
        <div className="relative z-10 w-full">
          {/* Section 01: HUMAN (0vh - 100vh) */}
          <section className="h-screen w-full flex items-center justify-center pointer-events-none" />

          {/* Section 02: BENEATH THE SKIN (100vh - 200vh) */}
          <section className="h-screen w-full flex items-center justify-center pointer-events-none" />

          {/* Section 03: MACHINE (200vh - 300vh) */}
          <section className="h-screen w-full flex items-center justify-center pointer-events-none" />

          {/* Section 04: THE MIND (300vh - 400vh) */}
          <section className="h-screen w-full flex items-center justify-center pointer-events-none" />

          {/* Section 05: NEURAL WORLD (400vh - 500vh) */}
          <section className="h-screen w-full flex items-center justify-center pointer-events-none" />

          {/* Section 06: NEXUS (500vh - 600vh) */}
          <section className="h-screen w-full flex items-center justify-center pointer-events-none" />
        </div>
      </SmoothScroll>
    </main>
  );
}
