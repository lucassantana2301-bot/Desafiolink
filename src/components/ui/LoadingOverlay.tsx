'use client';

import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

export default function LoadingOverlay() {
  const { progress } = useProgress();
  const isLoaded = useStore((state) => state.isLoaded);
  const setIsLoaded = useStore((state) => state.setIsLoaded);

  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const current = Math.round(progress);

    const animationFrame = requestAnimationFrame(() => {
      setDisplayProgress((prev) => Math.max(prev, current));
    });

    if (current >= 100 && !isLoaded) {
      const timeout = setTimeout(() => {
        setIsLoaded(true);
      }, 400);
      return () => {
        cancelAnimationFrame(animationFrame);
        clearTimeout(timeout);
      };
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [progress, isLoaded, setIsLoaded]);

  // Fallback: Ensure loading completes if assets are cached or instantaneous
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(100);
      setIsLoaded(true);
    }, 800);
    return () => clearTimeout(timer);
  }, [setIsLoaded]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-between p-10 font-mono text-white select-none pointer-events-none"
        >
          {/* Header */}
          <div className="flex justify-between items-center text-xs tracking-[0.3em] text-gray-500 uppercase">
            <span className="text-[#00F0FF]">NEXUS // CORE</span>
            <span>SYSTEM CALIBRATION</span>
          </div>

          {/* Center Brand & Loading Progress */}
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-white uppercase font-sans">
              NEXUS
            </h1>
            <div className="space-y-2">
              <p className="text-xs text-[#00F0FF] tracking-[0.25em] uppercase animate-pulse">
                CALIBRATING NEURAL MATRIX
              </p>
              <div className="text-5xl font-extrabold tracking-tighter text-white">
                {String(displayProgress).padStart(3, '0')}%
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="w-full space-y-2">
            <div className="w-full h-[2px] bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#00F0FF] transition-all duration-200 ease-out shadow-[0_0_10px_#00F0FF]"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-600 tracking-widest">
              <span>SYNAPTIC_INITIALIZATION</span>
              <span>MEMORY_CHECK: OK</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
