'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { getActiveScene } from '@/data/scenes';

export default function HeroOverlay() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const activeScene = getActiveScene(scrollProgress);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-14 select-none">
      {/* HUD Corner Reticles & Technical Telemetry */}
      <div className="absolute top-8 left-8 font-mono text-[10px] text-white/30 tracking-widest uppercase">
        NXS // 01 [NEURAL_STATUS: NOMINAL]
      </div>
      <div className="absolute top-8 right-8 font-mono text-[10px] text-white/30 tracking-widest uppercase hidden md:block">
        VISION // 01 | MEMORY // 02 | REASONING // 03
      </div>
      <div className="absolute bottom-8 left-8 font-mono text-[10px] text-white/30 tracking-widest uppercase">
        COGNITIVE_LOAD: {(scrollProgress * 84 + 12).toFixed(1)}%
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-[10px] text-white/30 tracking-widest uppercase hidden sm:block">
        COORD [X: {(Math.sin(scrollProgress * Math.PI) * 0.42).toFixed(2)} / Y: {(Math.cos(scrollProgress * Math.PI) * 0.18).toFixed(2)}]
      </div>

      {/* Top Spacer for Navbar */}
      <div className="h-16" />

      {/* Narrative Editorial Text Container */}
      <div className="flex-1 flex flex-col justify-center items-start max-w-5xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0, y: 25, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Scene Subtitle / Tag */}
            <div className="flex items-center space-x-3 font-mono text-xs text-[#00F0FF] tracking-[0.3em] uppercase">
              <span className="w-1.5 h-1.5 bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
              <span>{activeScene.subtitle}</span>
            </div>

            {/* Editorial Scene Main Title */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight uppercase leading-[0.9] font-sans">
              {activeScene.title}
            </h1>

            {/* Technical Narrative Description */}
            <p className="font-mono text-xs md:text-sm text-gray-400 max-w-xl tracking-wider leading-relaxed pt-2">
              {activeScene.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Real-time Progress Bar & Scene Telemetry Footer */}
      <div className="flex justify-between items-end border-t border-white/10 pt-4 font-mono text-[11px] text-gray-400 tracking-widest uppercase">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">SCENE:</span>
          <span className="text-white font-bold">{activeScene.name}</span>
          <span className="text-gray-600 hidden sm:inline">[{activeScene.objectState}]</span>
        </div>

        {/* Discrete Horizontal Scroll Progress Bar */}
        <div className="w-48 md:w-64 space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">SYNAPTIC_PROGRESS</span>
            <span className="text-[#00F0FF] font-bold">
              {(scrollProgress * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-[2px] bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#00F0FF] transition-all duration-75 shadow-[0_0_8px_#00F0FF]"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
