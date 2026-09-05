'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { getCharacterTransition } from '@/utils/nexusTransitions';

interface RendererInfo {
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
}

export default function DebugHUD() {
  // Synchronously compute initial debug state from URL parameters
  const [isDebugActive] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('debug3d') === '1';
    }
    return false;
  });

  const [rendererInfo, setRendererInfo] = useState<RendererInfo | null>(null);

  const scrollProgress = useStore((state) => state.scrollProgress);
  const characterState = useStore((state) => state.characterState);
  const devicePerformance = useStore((state) => state.devicePerformance);

  // Compute transition info dynamically during render pass (No effect setState needed)
  const transitionInfo = getCharacterTransition(scrollProgress);

  // Listen to custom WebGL renderer telemetry events
  useEffect(() => {
    if (!isDebugActive) return;
    const handleInfo = (e: Event) => {
      const customEvent = e as CustomEvent<RendererInfo>;
      if (customEvent.detail) {
        setRendererInfo(customEvent.detail);
      }
    };
    window.addEventListener('nexus:webgl-info', handleInfo);
    return () => window.removeEventListener('nexus:webgl-info', handleInfo);
  }, [isDebugActive]);

  if (!isDebugActive) return null;

  return (
    <aside
      className="fixed bottom-4 right-4 z-50 pointer-events-none select-none rounded border border-[rgba(0,243,255,0.2)] bg-[rgba(5,5,8,0.85)] p-3 font-mono text-[10px] tracking-wider text-titanium-100 shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md"
      aria-label="NEXUS WebGL Telemetry Debug HUD"
    >
      <div className="mb-2 flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-1">
        <span className="font-bold text-[#00f3ff]">NEXUS TELEMETRY HUD</span>
        <span className="animate-pulse rounded bg-[#00f3ff]/20 px-1 py-0.5 text-[9px] text-[#00f3ff]">
          DEBUG 3D
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-titanium-300">State:</span>
          <span className="font-semibold text-white">{characterState}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-titanium-300">Scroll Progress:</span>
          <span className="text-[#00f3ff]">{(scrollProgress * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-titanium-300">Primary Model:</span>
          <span className="text-titanium-100">{transitionInfo.primaryModel}.glb</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-titanium-300">Secondary Model:</span>
          <span className="text-titanium-100">
            {transitionInfo.secondaryModel ? `${transitionInfo.secondaryModel}.glb` : 'NONE'}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-titanium-300">Dissolve uProgress:</span>
          <span className="text-[#00f3ff]">{transitionInfo.dissolveProgress.toFixed(3)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-titanium-300">Local State Progress:</span>
          <span className="text-titanium-100">{(transitionInfo.localProgress * 100).toFixed(0)}%</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-white/5 pt-1">
          <span className="text-titanium-300">DPR / Perf Tier:</span>
          <span className="text-titanium-100">{devicePerformance.toUpperCase()}</span>
        </div>

        {rendererInfo && (
          <div className="space-y-1 border-t border-white/5 pt-1">
            <div className="flex justify-between gap-4">
              <span className="text-titanium-300">Draw Calls:</span>
              <span className="text-amber-400">{rendererInfo.drawCalls}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-titanium-300">Triangles:</span>
              <span className="text-titanium-100">{rendererInfo.triangles.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
