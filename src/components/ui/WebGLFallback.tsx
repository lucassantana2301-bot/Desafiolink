'use client';

import React from 'react';

export default function WebGLFallback() {
  return (
    <div className="fixed inset-0 z-40 bg-[#050505] text-white flex flex-col justify-between p-10 font-mono select-none">
      <div className="flex justify-between items-center text-xs tracking-[0.3em] text-red-400 uppercase">
        <span>NEXUS // HARDWARE ERROR</span>
        <span>WEBGL UNAVAILABLE</span>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-white uppercase font-sans">
          NEXUS
        </h1>
        <div className="space-y-3 border border-red-500/30 bg-red-950/20 p-6">
          <p className="text-xs text-red-400 tracking-[0.25em] uppercase font-bold">
            WEBGL INTERFACE UNAVAILABLE
          </p>
          <p className="text-xs text-gray-400 tracking-wider leading-relaxed">
            THIS EXPERIENCE REQUIRES HARDWARE ACCELERATION AND WEBGL2 CAPABILITIES TO RENDER THE 3D NEURAL MATRIX.
          </p>
        </div>
      </div>

      <div className="flex justify-between text-[10px] text-gray-600 tracking-widest uppercase">
        <span>PLEASE ENABLE HARDWARE ACCELERATION IN YOUR BROWSER</span>
        <span>STATUS: FALLBACK_MODE</span>
      </div>
    </div>
  );
}
