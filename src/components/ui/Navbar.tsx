'use client';

import React from 'react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-5 flex items-center justify-between pointer-events-auto mix-blend-difference">
      {/* Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-3 h-3 bg-[#FF5500] animate-pulse" />
        <span className="font-mono text-sm tracking-[0.25em] font-bold text-white uppercase">
          JCS // METALÚRGICA
        </span>
      </div>

      {/* Technical Status Readout */}
      <div className="hidden md:flex items-center space-x-6 font-mono text-[11px] text-gray-400 tracking-widest uppercase">
        <span>SYS_STATUS: ONLINE</span>
        <span className="text-[#00F0FF]">PRECISION: HIGH_TOLERANCE</span>
        <span>LAT: -23.5505 / LON: -46.6333</span>
      </div>

      {/* Action Button */}
      <button className="px-4 py-2 border border-white/20 hover:border-[#FF5500] font-mono text-xs text-white tracking-widest uppercase transition-colors duration-300">
        CONFIGURADOR 3D
      </button>
    </header>
  );
}
