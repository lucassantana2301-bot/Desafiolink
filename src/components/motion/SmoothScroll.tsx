'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/store/useStore';
import { getActiveScene } from '@/data/scenes';
import { detectDevicePerformance, checkPrefersReducedMotion } from '@/lib/performanceDetector';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const setActiveSceneId = useStore((state) => state.setActiveSceneId);
  const setDevicePerformance = useStore((state) => state.setDevicePerformance);
  const setPrefersReducedMotion = useStore((state) => state.setPrefersReducedMotion);

  useEffect(() => {
    // 1. Initial Device Performance & Motion Preference Detection
    const perfTier = detectDevicePerformance();
    const reducedMotion = checkPrefersReducedMotion();

    setDevicePerformance(perfTier);
    setPrefersReducedMotion(reducedMotion);

    // 2. Realtime OS prefers-reduced-motion Change Listener (Fix E)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
    } else {
      mediaQuery.addListener(handleMotionChange);
    }

    // 3. Initialize Lenis Smooth Scroll (Disabled if prefers-reduced-motion is active)
    const lenis = new Lenis({
      duration: reducedMotion ? 0 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reducedMotion,
    });

    // 4. Stable GSAP Ticker Callback (Fix 01)
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // 5. GSAP ScrollTrigger timeline binding
    let lastSceneId = 'scene-01';
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);

          // Update activeSceneId ONLY when scene boundary changes
          const currentScene = getActiveScene(progress);
          if (currentScene.id !== lastSceneId) {
            lastSceneId = currentScene.id;
            setActiveSceneId(currentScene.id);
          }
        },
      });
    });

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        mediaQuery.removeListener(handleMotionChange);
      }
      gsap.ticker.remove(updateTicker);
      ctx.revert();
      lenis.destroy();
    };
  }, [setScrollProgress, setActiveSceneId, setDevicePerformance, setPrefersReducedMotion]);

  return <div ref={containerRef} className="relative w-full">{children}</div>;
}
