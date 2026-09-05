'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import ConceptInspectorModal from './ConceptInspectorModal';

const SCENE_SHORTCUTS = [
  { id: 'scene-01', label: '01 HUMAN', progress: 0.05 },
  { id: 'scene-02', label: '02 SKIN', progress: 0.22 },
  { id: 'scene-03', label: '03 MACHINE', progress: 0.40 },
  { id: 'scene-04', label: '04 MIND', progress: 0.58 },
  { id: 'scene-05', label: '05 MATRIX', progress: 0.75 },
  { id: 'scene-06', label: '06 NEXUS', progress: 0.95 },
];

export default function Navbar() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const activeSceneId = useStore((state) => state.activeSceneId);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  useEffect(() => {
    // Direct store subscription for Fast Data (60fps DOM updates without React re-renders)
    const unsubscribe = useStore.subscribe((state) => {
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${state.scrollProgress * 100}%`;
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNavigateToScene = (progressTarget: number) => {
    if (typeof window !== 'undefined') {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetY = progressTarget * scrollHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex items-center justify-between pointer-events-auto select-none backdrop-blur-sm bg-[#050505]/40 border-b border-white/5">
        {/* Experimental Brand Identifier */}
        <div className="flex items-center space-x-4">
          <div className="w-2.5 h-2.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
          <span className="font-mono text-sm tracking-[0.3em] font-extrabold text-white uppercase">
            NEXUS
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-gray-500 tracking-widest border-l border-white/20 pl-3">
            NXS // 001
          </span>
        </div>

        {/* Center Scene Navigation Shortcuts */}
        <nav className="hidden xl:flex items-center space-x-1 font-mono text-[10px] tracking-widest uppercase">
          {SCENE_SHORTCUTS.map((scene) => {
            const isActive = activeSceneId === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => handleNavigateToScene(scene.progress)}
                className={`px-3 py-1 rounded transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00F0FF]/15 text-[#00F0FF] font-bold border border-[#00F0FF]/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-titanium-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {scene.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action & Telemetry Header */}
        <div className="flex items-center space-x-4 font-mono text-xs text-gray-300 tracking-widest uppercase">
          {/* Concept Inspector Action Button */}
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="flex items-center space-x-2 rounded border border-[#00F0FF]/40 bg-[#00F0FF]/10 px-3 py-1.5 text-[10px] font-bold text-[#00F0FF] transition-all hover:bg-[#00F0FF]/25 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF]" />
            <span>INSPECT PROTAGONIST</span>
          </button>

          {/* Progress Microbar */}
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-gray-500 text-[10px]">SYS_ONLINE</span>
            <div className="w-12 h-[2px] bg-white/20 relative overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-[#00F0FF]"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Concept Asset Inspector Drawer / Modal */}
      <ConceptInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    </>
  );
}
