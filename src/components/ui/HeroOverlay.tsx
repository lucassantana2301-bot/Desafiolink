'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { getActiveScene } from '@/data/scenes';

export default function HeroOverlay() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const activeScene = getActiveScene(scrollProgress);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-14 select-none">
      {/* HUD Corner Reticles */}
      <div className="absolute top-6 left-6 font-mono text-[10px] text-white/30">
        +[001_TL]
      </div>
      <div className="absolute top-6 right-6 font-mono text-[10px] text-white/30">
        +[002_TR]
      </div>
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/30">
        +[003_BL]
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-white/30">
        +[004_BR]
      </div>

      {/* Top Spacer for Navbar */}
      <div className="h-16" />

      {/* Main Narrative Editorial Typography Area */}
      <div className="flex-1 flex flex-col justify-center items-start max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Scene Subtitle / Tag */}
            <div className="flex items-center space-x-3 font-mono text-xs text-[#FF5500] tracking-[0.3em] uppercase">
              <span className="w-2 h-2 bg-[#FF5500]" />
              <span>{activeScene.subtitle}</span>
            </div>

            {/* Editorial Scene Main Title */}
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tight uppercase leading-none font-sans">
              {activeScene.title}
            </h1>

            {/* Technical Description */}
            <p className="font-mono text-xs md:text-sm text-gray-400 max-w-lg tracking-wider leading-relaxed">
              {activeScene.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* HUD Live Metrics Footer */}
      <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-4 font-mono text-[11px] text-gray-400 tracking-widest uppercase">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">SCENE:</span>
            <span className="text-white font-bold">{activeScene.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">STATE:</span>
            <span className="text-[#00F0FF]">{activeScene.objectState}</span>
          </div>
        </div>

        {/* Real-time Scroll Progress Bar */}
        <div className="w-full md:w-64 mt-4 md:mt-0 space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-500">PROGRESS</span>
            <span className="text-white font-bold">
              {(scrollProgress * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1 bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#FF5500] transition-all duration-75"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
