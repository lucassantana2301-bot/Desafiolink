'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { SCENES } from '@/data/scenes';
import ConceptInspectorModal, { CONCEPT_ITEMS } from './ConceptInspectorModal';
import { nexusAudio } from '@/lib/nexusAudio';

// Target scroll points for each of the 5 narrative keyframe stages
const KEYFRAME_TARGETS = [
  { id: '01_HUMAN', label: 'HUMAN', scroll: 0.05, idx: 0 },
  { id: '02_SKIN_REVEAL', label: 'REVEAL', scroll: 0.22, idx: 1 },
  { id: '03_HYBRID', label: 'HYBRID', scroll: 0.40, idx: 2 },
  { id: '04_ANDROID', label: 'ANDROID', scroll: 0.68, idx: 3 },
  { id: '05_NEXUS_FINAL', label: 'CONVERGENCE', scroll: 0.94, idx: 4 },
];

const BACKDROP_WORDS: Record<string, string> = {
  'scene-01': 'HUMAN',
  'scene-02': 'SKIN',
  'scene-03': 'MACHINE',
  'scene-04': 'MIND',
  'scene-05': 'MATRIX',
  'scene-06': 'NEXUS',
};

export default function HeroOverlay() {
  const activeSceneId = useStore((state) => state.activeSceneId);
  const prefersReducedMotion = useStore((state) => state.prefersReducedMotion);
  const activeScene = SCENES.find((s) => s.id === activeSceneId) || SCENES[0];

  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [selectedConceptIndex, setSelectedConceptIndex] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Fast Data DOM Refs (Zero React re-renders per frame)
  const hudContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const coordTextRef = useRef<HTMLDivElement>(null);
  const loadTextRef = useRef<HTMLDivElement>(null);
  const heartRateRef = useRef<HTMLSpanElement>(null);
  const integrationRef = useRef<HTMLSpanElement>(null);
  const humanIndexRef = useRef<HTMLSpanElement>(null);
  const pipelineLineRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const climaxDotRef = useRef<HTMLDivElement>(null);
  const finalQuietRef = useRef<HTMLDivElement>(null);
  const finalBoundaryTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Direct store subscription for Fast Data (60fps DOM updates without React reconciler)
    const unsubscribe = useStore.subscribe((state) => {
      const scrollProgress = state.scrollProgress;
      const pct = (scrollProgress * 100).toFixed(1);

      // Audio engine update
      nexusAudio.updateScrollAudio(scrollProgress);

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.innerText = `${pct}%`;
      }
      if (pipelineLineRef.current) {
        pipelineLineRef.current.style.width = `${Math.min(100, scrollProgress * 100)}%`;
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

      // Live Biometric Signals Simulation
      if (heartRateRef.current) {
        const hr = Math.max(0, Math.round(74 - scrollProgress * 74));
        heartRateRef.current.innerText = hr > 0 ? `${hr} BPM` : 'SYNTHETIC';
      }
      if (integrationRef.current) {
        const integration = (scrollProgress * 100).toFixed(0);
        integrationRef.current.innerText = `${integration}%`;
      }
      if (humanIndexRef.current) {
        const humanIdx = Math.max(0, Math.round(100 - scrollProgress * 100));
        humanIndexRef.current.innerText = `${humanIdx}%`;
      }

      // Climax Blackout & Cyan Spark Trigger (Scene 05 -> Scene 06 boundary: 0.855 - 0.895)
      if (blackoutRef.current && climaxDotRef.current) {
        if (scrollProgress >= 0.855 && scrollProgress <= 0.885) {
          blackoutRef.current.style.opacity = '1';
          climaxDotRef.current.style.opacity = '0';
        } else if (scrollProgress > 0.885 && scrollProgress <= 0.905) {
          blackoutRef.current.style.opacity = '0.9';
          climaxDotRef.current.style.opacity = '1';
          const dotScale = 1.0 + (scrollProgress - 0.885) * 80;
          climaxDotRef.current.style.transform = `scale(${dotScale})`;
        } else {
          blackoutRef.current.style.opacity = '0';
          climaxDotRef.current.style.opacity = '0';
        }
      }

      // Final 10% Cinematic Quiet (Fade HUD telemetry out on scroll >= 0.96)
      if (hudContainerRef.current) {
        if (scrollProgress >= 0.965) {
          const fadeOut = Math.max(0, 1 - (scrollProgress - 0.965) * 28);
          hudContainerRef.current.style.opacity = `${fadeOut}`;
        } else {
          hudContainerRef.current.style.opacity = '1';
        }
      }

      // Final Philosophical Revelation (97% - 100%)
      if (finalQuietRef.current && finalBoundaryTextRef.current) {
        if (scrollProgress >= 0.965) {
          finalQuietRef.current.style.opacity = '1';
          if (scrollProgress >= 0.985) {
            finalBoundaryTextRef.current.innerText = 'THE BOUNDARY NO LONGER EXISTS. SYSTEM // ONLINE';
          } else {
            finalBoundaryTextRef.current.innerText = 'WHERE DOES HUMAN END AND MACHINE BEGIN?';
          }
        } else {
          finalQuietRef.current.style.opacity = '0';
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenConcept = (index: number) => {
    setSelectedConceptIndex(index);
    setIsInspectorOpen(true);
    nexusAudio.playTelemetryClick();
  };

  const handleToggleAudio = () => {
    const active = nexusAudio.toggle();
    setIsAudioActive(active);
  };

  const handleScrollToKeyframe = (targetProgress: number) => {
    nexusAudio.playTelemetryClick();
    if (typeof window !== 'undefined') {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: targetProgress * maxScroll,
        behavior: 'smooth',
      });
    }
  };

  // Motion variants respecting prefers-reduced-motion
  const motionProps = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -15 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      };

  const backdropWord = BACKDROP_WORDS[activeSceneId] || 'NEXUS';

  return (
    <>
      {/* Climax Instantaneous Blackout & Cyan Spark Layer */}
      <div
        ref={blackoutRef}
        className="fixed inset-0 z-30 bg-[#050505] pointer-events-none opacity-0 transition-opacity duration-150 flex items-center justify-center"
      >
        <div
          ref={climaxDotRef}
          className="w-3 h-3 bg-[#00F0FF] rounded-full shadow-[0_0_30px_#00F0FF] opacity-0 transition-all duration-200"
        />
      </div>

      {/* Monumental Backdrop Typography Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center select-none opacity-[0.04] sm:opacity-[0.055]">
        <AnimatePresence mode="wait">
          <motion.span
            key={backdropWord}
            initial={{ opacity: 0, scale: 0.92, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, scale: 1, letterSpacing: '0.35em' }}
            exit={{ opacity: 0, scale: 1.08, letterSpacing: '0.45em' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="font-black text-[22vw] sm:text-[28vw] uppercase leading-none text-white tracking-widest whitespace-nowrap font-sans drop-shadow-2xl"
          >
            {backdropWord}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Final 10% Philosophical Stillness Layer (97% - 100%) */}
      <div
        ref={finalQuietRef}
        className="fixed inset-0 z-20 pointer-events-none flex flex-col items-center justify-end pb-24 px-6 text-center opacity-0 transition-opacity duration-500 select-none"
      >
        <div className="space-y-2 max-w-xl">
          <p
            ref={finalBoundaryTextRef}
            className="font-mono text-sm sm:text-base text-white tracking-[0.35em] uppercase font-bold drop-shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300"
          >
            WHERE DOES HUMAN END AND MACHINE BEGIN?
          </p>
          <div className="flex items-center justify-center space-x-2 font-mono text-[10px] text-[#00F0FF] tracking-[0.4em] uppercase pt-1">
            <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full shadow-[0_0_8px_#00F0FF]" />
            <span>NEXUS // CONVERGENCE COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Main HUD Telemetry Container (Fades during final stillness) */}
      <div
        ref={hudContainerRef}
        className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none transition-opacity duration-300"
      >
        {/* HUD Top-Left Narrative Telemetry */}
        <div className="absolute top-20 left-8 font-mono text-[10px] text-white/50 tracking-widest uppercase flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full animate-ping" />
          {activeSceneId === 'scene-01' ? (
            <span>SUBJECT // 001 — BIOLOGICAL STATE [HUMAN]</span>
          ) : (
            <span>NXS // TELEMETRY [ACTIVE]</span>
          )}
        </div>

        {/* Top-Right Biometric Telemetry */}
        <div className="absolute top-20 right-8 font-mono text-[10px] text-white/50 tracking-widest uppercase hidden md:flex flex-col items-end space-y-1.5">
          <div className="flex items-center space-x-3 text-titanium-300">
            <span>
              BIOLOGY: <span ref={humanIndexRef} className="text-[#00F0FF] font-bold">100%</span>
            </span>
            <span>|</span>
            <span>
              MACHINE: <span ref={integrationRef} className="text-white font-bold">0%</span>
            </span>
            <span>|</span>
            <span>
              HEART: <span ref={heartRateRef} className="text-red-400 font-bold">74 BPM</span>
            </span>
          </div>

          {/* Realtime Animated ECG / EEG Waveform */}
          <div className="w-36 h-4 border border-white/10 bg-black/40 px-1 py-0.5 rounded overflow-hidden flex items-center">
            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path
                d="M 0 10 L 20 10 L 25 3 L 30 17 L 35 7 L 40 10 L 60 10 L 65 2 L 70 18 L 75 10 L 100 10"
                fill="none"
                stroke="#00F0FF"
                strokeWidth="1.2"
                strokeDasharray="100"
                strokeDashoffset="0"
                className="animate-[pulse_2s_infinite]"
              />
            </svg>
          </div>
        </div>

        <div
          ref={loadTextRef}
          className="absolute bottom-20 sm:bottom-16 left-8 font-mono text-[10px] text-white/40 tracking-widest uppercase"
        >
          COGNITIVE_LOAD: 12.0%
        </div>
        <div
          ref={coordTextRef}
          className="absolute bottom-20 sm:bottom-16 right-8 font-mono text-[10px] text-white/40 tracking-widest uppercase hidden sm:block"
        >
          COORD [X: 0.00 / Y: 0.18]
        </div>

        {/* Top Spacer for Navbar */}
        <div className="h-20" />

        {/* Narrative Editorial Text & Telemetry Grid (Slow Data) */}
        <div className="flex-1 flex flex-col lg:flex-row justify-center lg:justify-between items-start lg:items-center max-w-7xl w-full pointer-events-auto gap-8">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScene.id}
                {...motionProps}
                className="space-y-3"
              >
                {/* Scene Subtitle / Tag */}
                <div className="flex items-center space-x-3 font-mono text-xs text-[#00F0FF] tracking-[0.3em] uppercase">
                  <span className="w-1.5 h-1.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                  <span>{activeScene.subtitle}</span>
                </div>

                {/* Editorial Scene Main Title */}
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase leading-[0.92] font-sans drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)] max-w-xl">
                  {activeScene.title}
                </h1>

                {/* Technical Narrative Description */}
                <p className="font-mono text-xs md:text-sm text-titanium-300 max-w-lg tracking-wider leading-relaxed pt-2">
                  {activeScene.description}
                </p>

                {/* Interactive CTA buttons in Hero section */}
                {activeSceneId === 'scene-01' && (
                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => handleOpenConcept(0)}
                      className="flex items-center space-x-2 rounded border border-[#00F0FF]/40 bg-[#00F0FF]/10 px-4 py-2 font-mono text-xs text-white tracking-widest uppercase transition-all hover:border-[#00F0FF] hover:bg-[#00F0FF]/25 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                    >
                      <span>EXPLORE 5 LINKED CONCEPTS</span>
                      <span className="text-[#00F0FF]">→</span>
                    </button>

                    <button
                      onClick={handleToggleAudio}
                      className="flex items-center space-x-2 rounded border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-titanium-300 tracking-widest uppercase transition-all hover:text-white hover:border-white/30"
                    >
                      <span className={`w-2 h-2 rounded-full ${isAudioActive ? 'bg-[#00F0FF] animate-pulse shadow-[0_0_8px_#00F0FF]' : 'bg-titanium-500'}`} />
                      <span>AUDIO: {isAudioActive ? 'ACTIVE' : 'MUTED'}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scene 05 Minimalist Right Technical Column */}
          {activeSceneId === 'scene-05' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:flex flex-col items-end space-y-4 font-mono text-[10px] tracking-widest text-titanium-400 pl-8 border-r border-[#00F0FF]/20 pr-4"
            >
              <div className="space-y-0.5 text-right">
                <span className="text-[9px] text-titanium-500 uppercase block">BIOLOGICAL RESIDUAL</span>
                <span className="text-white font-bold">14.2%</span>
              </div>
              <div className="space-y-0.5 text-right">
                <span className="text-[9px] text-titanium-500 uppercase block">SYNTHETIC CHASSIS</span>
                <span className="text-[#00F0FF] font-bold">85.8% [TITANIUM]</span>
              </div>
              <div className="space-y-0.5 text-right">
                <span className="text-[9px] text-titanium-500 uppercase block">SYNAPTIC DENSITY</span>
                <span className="text-white font-bold">1.48 × 10⁹ / mm³</span>
              </div>
              <div className="space-y-0.5 text-right">
                <span className="text-[9px] text-titanium-500 uppercase block">COGNITIVE INTEGRATION</span>
                <span className="text-[#00F0FF] font-bold">ACTIVE CONVERGENCE</span>
              </div>
            </motion.div>
          )}

          {/* Scene 06 NEXUS Minimalist Right Technical Column */}
          {activeSceneId === 'scene-06' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:flex flex-col items-end space-y-3 font-mono text-[10px] tracking-widest text-titanium-400 pl-8 border-r border-[#00F0FF]/30 pr-4"
            >
              <div className="space-y-0.5 text-right">
                <span className="text-[9px] text-[#00F0FF] uppercase block font-bold">NEXUS CORE // V6.0.1</span>
                <span className="text-white text-[11px] font-bold">CONVERGENCE</span>
              </div>
              <div className="space-y-1 text-right pt-1 w-32">
                <div className="flex justify-between text-[9px]">
                  <span className="text-titanium-500">BIOLOGIA</span>
                  <span className="text-white font-bold">0%</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-titanium-500">MÁQUINA</span>
                  <span className="text-[#00F0FF] font-bold">100%</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-titanium-500">SÍNTESE</span>
                  <span className="text-[#00F0FF] font-bold">100%</span>
                </div>
              </div>
              <div className="space-y-0.5 text-right pt-1">
                <span className="text-[9px] text-titanium-500 uppercase block">ESTADO</span>
                <span className="text-[#00F0FF] font-bold">CONVERGENTE</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Scene 01 Interactive Scroll Cue */}
        {activeSceneId === 'scene-01' && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 font-mono text-[10px] text-titanium-400 tracking-[0.25em] uppercase animate-bounce">
            <span>SCROLL TO INITIATE TRANSFORMATION</span>
            <div className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Interconnected 5-Concept HUD Pipeline Bar */}
        <div className="pointer-events-auto my-2 hidden md:block">
          <div className="relative flex items-center justify-between rounded border border-white/5 bg-black/30 backdrop-blur-sm px-4 py-2 max-w-2xl transition-all duration-300 hover:border-white/15">
            {/* Background bus connector line */}
            <div className="absolute top-1/2 left-6 right-6 h-[1px] -translate-y-1/2 bg-white/10 z-0" />
            {/* Active live fill line */}
            <div
              ref={pipelineLineRef}
              className="absolute top-1/2 left-6 h-[1px] -translate-y-1/2 bg-gradient-to-r from-[#00F0FF] to-cyan-400 z-0 transition-all duration-75 shadow-[0_0_6px_#00F0FF]"
              style={{ width: '0%' }}
            />

            {KEYFRAME_TARGETS.map((kf) => {
              const item = CONCEPT_ITEMS[kf.idx];
              return (
                <div
                  key={kf.id}
                  className="relative z-10 flex flex-col items-center group cursor-pointer"
                  onClick={() => handleScrollToKeyframe(kf.scroll)}
                  onDoubleClick={() => handleOpenConcept(kf.idx)}
                  title={`Click to scroll to ${kf.label} | Double click to inspect`}
                >
                  <div className="relative w-8 h-8 rounded overflow-hidden border border-white/10 bg-black group-hover:border-[#00F0FF] group-hover:scale-110 transition-all duration-200">
                    <Image
                      src={item.imagePath}
                      alt={kf.label}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                    <div className="absolute inset-0 bg-[#00F0FF]/0 group-hover:bg-[#00F0FF]/15 transition-colors" />
                  </div>
                  <span className="font-mono text-[8px] text-titanium-400 group-hover:text-[#00F0FF] mt-1 tracking-wider uppercase">
                    0{kf.idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

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
        initialIndex={selectedConceptIndex}
      />
    </>
  );
}


