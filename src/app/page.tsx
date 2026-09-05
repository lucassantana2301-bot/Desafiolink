'use client';

import dynamic from 'next/dynamic';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Navbar from '@/components/ui/Navbar';
import HeroOverlay from '@/components/ui/HeroOverlay';

// Dynamic import for WebGL Canvas with SSR disabled
const SceneCanvas = dynamic(() => import('@/components/three/SceneCanvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      {/* 3D WebGL Canvas Viewport */}
      <SceneCanvas />

      {/* 2D HUD Navigation and Narrative Telemetry */}
      <Navbar />
      <HeroOverlay />

      {/* ~300vh Scroll Timeline Container for GSAP ScrollTrigger */}
      <SmoothScroll>
        <div className="relative z-10 w-full">
          {/* Section 01: Hero (0vh - 100vh) */}
          <section className="h-screen w-full flex items-center justify-center pointer-events-none" />

          {/* Section 02: Approach & Details (100vh - 200vh) */}
          <section className="h-screen w-full flex items-center justify-center pointer-events-none" />

          {/* Section 03: Exploded View & Precision Engineering (200vh - 300vh) */}
          <section className="h-screen w-full flex items-center justify-center pointer-events-none" />
        </div>
      </SmoothScroll>
    </main>
  );
}
