'use client';

import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only active on desktop pointer devices
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let isHoveringInteractive = false;
    let currentLabel = '';

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check contextual targets
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveElement = target.closest('button, a, [data-cursor], [role="button"]');
      if (interactiveElement) {
        isHoveringInteractive = true;
        const customText = interactiveElement.getAttribute('data-cursor');
        if (customText) {
          currentLabel = customText;
        } else if (interactiveElement.tagName === 'BUTTON' || interactiveElement.tagName === 'A') {
          if (interactiveElement.textContent?.includes('INSPECT') || interactiveElement.textContent?.includes('EXPLORE') || interactiveElement.textContent?.includes('CONCEPT')) {
            currentLabel = 'INSPECT';
          } else {
            currentLabel = 'SELECT';
          }
        }
      } else {
        isHoveringInteractive = false;
        currentLabel = '';
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let rafId: number;
    const updateCursor = () => {
      // Smooth lerp tracking
      curX += (mouseX - curX) * 0.22;
      curY += (mouseY - curY) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      if (labelRef.current) {
        if (isHoveringInteractive && currentLabel) {
          labelRef.current.innerText = `[ ${currentLabel} ]`;
          labelRef.current.style.opacity = '1';
        } else {
          labelRef.current.style.opacity = '0';
        }
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block select-none">
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-[#00F0FF] rounded-full shadow-[0_0_6px_#00F0FF] will-change-transform"
      />

      {/* Outer Tactical Crosshair Reticle */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-[#00F0FF]/40 rounded-full flex items-center justify-center will-change-transform transition-[border-color,width,height] duration-200"
      >
        <div className="w-10 h-10 border border-white/10 rounded-full animate-ping opacity-25" />
        
        {/* Contextual Floating Technical Tag */}
        <span
          ref={labelRef}
          className="absolute left-6 top-6 font-mono text-[9px] tracking-widest text-[#00F0FF] bg-black/80 px-1.5 py-0.5 rounded border border-[#00F0FF]/30 whitespace-nowrap opacity-0 transition-opacity duration-150"
        >
          [ EXPLORE ]
        </span>
      </div>
    </div>
  );
}
