'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { SCENES } from '@/data/scenes';
import ConceptInspectorModal from './ConceptInspectorModal';

export default function HeroOverlay() {
  const activeSceneId = useStore((state) => state.activeSceneId);
  const prefersReducedMotion = useStore((state) => state.prefersReducedMotion);
  const activeScene = SCENES.find((s) => s.id === activeSceneId) || SCENES[0];

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Fast Data DOM Refs (Zero React re-renders per frame)
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const coordTextRef = useRef<HTMLDivElement>(null);
  const loadTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Direct store subscription for Fast Data (60fps DOM updates without React reconciler)
    const unsubscribe = useStore.subscribe((state) => {
      const scrollProgress = state.scrollProgress;
      const pct = (scrollProgress * 100).toFixed(1);

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.innerText = `${pct}%`;
      }
      if (coordTextRef.current) {
        const x = (Math.sin(scrollProgress * Math.PI) * 0.42).toFixed(2);
        const y = (Math.cos(scrollProgress * Math.PI) * 0.18).toFixed(2);
        coordTextRef.current.innerText = `COORD [X: ${x} / Y: ${y}]`;
      }
      if (loadTextRef.current) {
        const load = (scrollProgress * 84 + 12).toFixed(1);
        loadTextRef.current.innerText = `COGNITIVE_LOAD: ${load}%`;
      }
    });

    return () => unsubscribe();
  }, []);

  // Motion variants respecting prefers-reduced-motion
  const motionProps = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: 25 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <>
      <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none">
        {/* HUD Corner Reticles & Technical Telemetry */}
        <div className="absolute top-20 left-8 font-mono text-[10px] text-white/40 tracking-widest uppercase flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full animate-ping" />
          <span>NXS // 01 [NEURAL_STATUS: NOMINAL]</span>
        </div>
        <div className="absolute top-20 right-8 font-mono text-[10px] text-white/40 tracking-widest uppercase hidden md:flex items-center space-x-3">
          <span>VISION // 01</span>
          <span>|</span>
          <span>MEMORY // 02</span>
          <span>|</span>
          <span>REASONING // 03</span>
        </div>
        <div
          ref={loadTextRef}
          className="absolute bottom-16 left-8 font-mono text-[10px] text-white/40 tracking-widest uppercase"
        >
          COGNITIVE_LOAD: 12.0%
        </div>
        <div
          ref={coordTextRef}
          className="absolute bottom-16 right-8 font-mono text-[10px] text-white/40 tracking-widest uppercase hidden sm:block"
        >
          COORD [X: 0.00 / Y: 0.18]
        </div>

        {/* Top Spacer for Navbar */}
        <div className="h-20" />

        {/* Narrative Editorial Text Container (Slow Data) */}
        <div className="flex-1 flex flex-col justify-center items-start max-w-5xl pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene.id}
              {...motionProps}
              className="space-y-4"
            >
              {/* Scene Subtitle / Tag */}
              <div className="flex items-center space-x-3 font-mono text-xs text-[#00F0FF] tracking-[0.3em] uppercase">
                <span className="w-1.5 h-1.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                <span>{activeScene.subtitle}</span>
              </div>

              {/* Editorial Scene Main Title */}
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight uppercase leading-[0.9] font-sans drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                {activeScene.title}
              </h1>

              {/* Technical Narrative Description */}
              <p className="font-mono text-xs md:text-sm text-titanium-300 max-w-xl tracking-wider leading-relaxed pt-2">
                {activeScene.description}
              </p>

              {/* Interactive CTA buttons in Hero section */}
              {activeSceneId === 'scene-01' && (
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setIsInspectorOpen(true)}
                    className="flex items-center space-x-2 rounded border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs text-white tracking-widest uppercase transition-all hover:border-[#00F0FF] hover:bg-[#00F0FF]/15 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                  >
                    <span>EXPLORE CONCEPT REFERENCES</span>
                    <span className="text-[#00F0FF]">→</span>
                  </button>

                  <button
                    onClick={() => setIsAudioActive(!isAudioActive)}
                    className="flex items-center space-x-2 rounded border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-titanium-300 tracking-widest uppercase transition-all hover:text-white"
                  >
                    <span className={`w-2 h-2 rounded-full ${isAudioActive ? 'bg-[#00F0FF] animate-pulse' : 'bg-titanium-500'}`} />
                    <span>AUDIO AMBIENCE: {isAudioActive ? 'ACTIVE' : 'MUTED'}</span>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scene 01 Interactive Scroll Cue */}
        {activeSceneId === 'scene-01' && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 font-mono text-[10px] text-titanium-400 tracking-[0.25em] uppercase animate-bounce">
            <span>SCROLL TO INITIATE SYNAPTIC SHIFT</span>
            <div className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Fast Data Progress Bar & Scene Telemetry Footer */}
        <div className="flex justify-between items-end border-t border-white/10 pt-4 font-mono text-[11px] text-gray-400 tracking-widest uppercase pointer-events-auto">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">SCENE:</span>
            <span className="text-white font-bold">{activeScene.name}</span>
            <span className="text-gray-600 hidden sm:inline">[{activeScene.objectState}]</span>
          </div>

          {/* Discrete Horizontal Scroll Progress Bar */}
          <div className="w-48 md:w-64 space-y-1.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-500">SYNAPTIC_PROGRESS</span>
              <span ref={progressTextRef} className="text-[#00F0FF] font-bold">
                0.0%
              </span>
            </div>
            <div className="w-full h-[2px] bg-white/10 overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-[#00F0FF] transition-all duration-75 shadow-[0_0_8px_#00F0FF]"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Concept Inspector Modal */}
      <ConceptInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    </>
  );
}
