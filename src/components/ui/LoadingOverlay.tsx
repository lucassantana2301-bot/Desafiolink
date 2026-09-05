'use client';

import React, { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

export default function LoadingOverlay() {
  const { progress, active, errors } = useProgress();
  const isLoaded = useStore((state) => state.isLoaded);
  const setIsLoaded = useStore((state) => state.setIsLoaded);
  const prefersReducedMotion = useStore((state) => state.prefersReducedMotion);

  const hasErrors = errors.length > 0;
  const currentProgress = Math.round(progress);

  useEffect(() => {
    // Real asset loading resolution (Fix A)
    // Only set isLoaded = true when progress reaches 100%, active is false, and zero errors exist.
    if (!hasErrors && currentProgress >= 100 && !active && !isLoaded) {
      const timeout = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentProgress, active, hasErrors, isLoaded, setIsLoaded]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: prefersReducedMotion ? 'none' : 'blur(8px)' }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-between p-10 font-mono text-white select-none pointer-events-none"
        >
          {/* Header */}
          <div className="flex justify-between items-center text-xs tracking-[0.3em] text-gray-500 uppercase">
            <span className={hasErrors ? 'text-red-500 font-bold' : 'text-[#00F0FF]'}>
              {hasErrors ? 'NEXUS // CORE ERROR' : 'NEXUS // CORE'}
            </span>
            <span>{hasErrors ? 'ASSET LOADING FAILED' : 'SYSTEM CALIBRATION'}</span>
          </div>

          {/* Center Brand & Loading Progress */}
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-white uppercase font-sans">
              NEXUS
            </h1>

            {hasErrors ? (
              <div className="space-y-3 bg-red-950/40 border border-red-500/40 p-6 max-w-md">
                <p className="text-xs text-red-400 tracking-widest uppercase">
                  UNABLE TO RESOLVE NEURAL ASSETS
                </p>
                <div className="text-[10px] text-red-300/70 text-left font-mono overflow-auto max-h-24">
                  {errors.map((err, idx) => (
                    <div key={idx}>[{idx + 1}] {String(err)}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-[#00F0FF] tracking-[0.25em] uppercase animate-pulse">
                  {active ? 'LOADING NEURAL ASSETS' : 'CALIBRATING MATRIX'}
                </p>
                <div className="text-5xl font-extrabold tracking-tighter text-white">
                  {String(currentProgress).padStart(3, '0')}%
                </div>
              </div>
            )}
          </div>

          {/* Footer Progress Bar */}
          <div className="w-full space-y-2">
            <div className="w-full h-[2px] bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ease-out ${
                  hasErrors ? 'bg-red-500 shadow-[0_0_10px_#EF4444]' : 'bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]'
                }`}
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-600 tracking-widest">
              <span>SYNAPTIC_INITIALIZATION</span>
              <span>{hasErrors ? 'STATUS: CRITICAL' : 'MEMORY_CHECK: OK'}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
