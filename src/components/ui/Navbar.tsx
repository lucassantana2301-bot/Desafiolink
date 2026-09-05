'use client';

import React from 'react';
import { useStore } from '@/store/useStore';

export default function Navbar() {
  const scrollProgress = useStore((state) => state.scrollProgress);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex items-center justify-between pointer-events-auto mix-blend-difference select-none">
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

      {/* Center Scientific Tagline */}
      <div className="hidden lg:flex items-center space-x-6 font-mono text-[11px] text-gray-400 tracking-[0.25em] uppercase">
        <span>HUMAN × MACHINE</span>
        <span className="text-[#00F0FF]">NEURAL MATRIX: ACTIVE</span>
      </div>

      {/* Right HUD Telemetry Readout */}
      <div className="flex items-center space-x-4 font-mono text-xs text-gray-300 tracking-widest uppercase">
        <span className="text-gray-500 text-[10px]">SYS_ONLINE</span>
        <div className="w-12 h-[2px] bg-white/20 relative overflow-hidden">
          <div
            className="h-full bg-[#00F0FF]"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
}
