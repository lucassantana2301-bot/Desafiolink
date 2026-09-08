'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export interface ConceptItem {
  id: string;
  name: string;
  stateKey: string;
  imagePath: string;
  type: string;
  status: string;
  role: string;
  scrollRange: string;
  budgetTris: string;
  description: string;
}

export const CONCEPT_ITEMS: ConceptItem[] = [
  {
    id: '01_HUMAN',
    name: '01 // HUMAN ANATOMY',
    stateKey: '01_HUMAN',
    imagePath: '/images/nexus/nexus-human.png',
    type: 'PRIMARY IDENTITY REFERENCE',
    status: 'APPROVED // MASTER REFERENCE',
    role: 'Master visual reference for the NEXUS protagonist (biological pure form).',
    scrollRange: '0.00 -> 0.15',
    budgetTris: '80.000 Tris',
    description: 'Aparência facial humana com textura epidérmica natural, olhar direto e expressão clínica serena.',
  },
  {
    id: '02_SKIN_REVEAL',
    name: '02 // SKIN REVEAL',
    stateKey: '02_SKIN_REVEAL',
    imagePath: '/images/nexus/nexus-skin-reveal.png',
    type: 'TRANSFORMATION REFERENCE',
    status: 'APPROVED',
    role: 'Biomechanical skin opening and subcutaneous exposure reference.',
    scrollRange: '0.15 -> 0.32',
    budgetTris: '100.000 Tris',
    description: 'Fissura cirúrgica revelando as camadas de cerâmica e circuitos subjacentes sob a pele biológica.',
  },
  {
    id: '03_HYBRID',
    name: '03 // HYBRID SHIFT',
    stateKey: '03_HYBRID',
    imagePath: '/images/nexus/nexus-hybrid.png',
    type: 'HUMAN / MACHINE MATERIAL REFERENCE',
    status: 'APPROVED',
    role: '50/50 transition reference between organic tissue, titanium and matte ceramic.',
    scrollRange: '0.32 -> 0.50',
    budgetTris: '120.000 Tris',
    description: 'Estrutura simétrica 50% humano / 50% máquina com placas biomecânicas de ligas metálicas.',
  },
  {
    id: '04_ANDROID',
    name: '04 // ANDROID CHASSIS',
    stateKey: '04_ANDROID',
    imagePath: '/images/nexus/nexus-android.png',
    type: 'MECHANICAL STRUCTURE REFERENCE',
    status: 'APPROVED',
    role: 'Full synthetic mechanical architecture, dark titanium joints & synaptic core.',
    scrollRange: '0.50 -> 0.88',
    budgetTris: '150.000 Tris',
    description: 'Chassi sintético completo com ligas de titânio escuro e sensores ópticos oculares android.',
  },
  {
    id: '05_NEXUS_FINAL',
    name: '05 // NEXUS CONVERGENCE',
    stateKey: '05_NEXUS_FINAL',
    imagePath: '/images/nexus/nexus-final.png',
    type: 'FINAL CONVERGENCE REFERENCE',
    status: 'APPROVED',
    role: 'Final entity reborn — human identity reconstructed over synthetic architecture.',
    scrollRange: '0.88 -> 1.00',
    budgetTris: '150.000 Tris',
    description: 'Convergência final das partículas neurais na entidade híbrida renascida. O limiar biológico/sintético desaparece.',
  },
];

interface ConceptInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function ConceptInspectorModal({ isOpen, onClose, initialIndex = 0 }: ConceptInspectorModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);

  // Synchronize state on prop change during render (React recommended pattern)
  if (isOpen !== prevIsOpen || initialIndex !== prevInitialIndex) {
    setPrevIsOpen(isOpen);
    setPrevInitialIndex(initialIndex);
    if (isOpen) {
      setSelectedIndex(initialIndex);
    }
  }

  // Keyboard navigation support (Arrow keys + Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSelectedIndex((prev) => (prev + 1) % CONCEPT_ITEMS.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSelectedIndex((prev) => (prev - 1 + CONCEPT_ITEMS.length) % CONCEPT_ITEMS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const selectedConcept = CONCEPT_ITEMS[selectedIndex] || CONCEPT_ITEMS[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + CONCEPT_ITEMS.length) % CONCEPT_ITEMS.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % CONCEPT_ITEMS.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050508]/90 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-lg border border-[#00F0FF]/30 bg-[#0A0D14] p-5 text-white shadow-[0_0_50px_rgba(0,240,255,0.15)] md:p-8"
          >
            {/* Header Telemetry Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <span className="h-2 w-2 animate-pulse bg-[#00F0FF]" />
                <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-[#00F0FF]">
                  NEXUS // CONNECTED CONCEPTS PIPELINE ({selectedIndex + 1}/{CONCEPT_ITEMS.length})
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline font-mono text-[10px] text-titanium-400">
                  [USE ← / → KEYS TO NAVIGATE]
                </span>
                <button
                  onClick={onClose}
                  className="font-mono text-xs tracking-widest text-titanium-300 transition-colors hover:text-white"
                >
                  [ CLOSE // ESC ]
                </button>
              </div>
            </div>

            {/* Visual Connected Keyframes Timeline Bar */}
            <div className="relative py-4 my-2 border-b border-white/5">
              {/* Connecting glowing circuit line */}
              <div className="absolute top-1/2 left-4 right-4 h-[2px] -translate-y-1/2 bg-white/10 hidden sm:block" />
              <div
                className="absolute top-1/2 left-4 h-[2px] -translate-y-1/2 bg-gradient-to-r from-[#00F0FF] to-cyan-400 transition-all duration-300 hidden sm:block shadow-[0_0_8px_#00F0FF]"
                style={{
                  width: `${(selectedIndex / (CONCEPT_ITEMS.length - 1)) * 92}%`,
                }}
              />

              <div className="relative grid grid-cols-5 gap-2 sm:gap-4 z-10">
                {CONCEPT_ITEMS.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={`flex flex-col items-center p-2 rounded transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#00F0FF]/15 border border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                          : 'bg-black/40 border border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded overflow-hidden border border-white/20 mb-1">
                        <Image
                          src={item.imagePath}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 40px, 56px"
                        />
                      </div>
                      <span className="font-mono text-[9px] sm:text-[10px] text-white truncate max-w-full text-center">
                        0{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-6 py-4 lg:grid-cols-12">
              {/* Left Column: Interactive Thumbnail Selector */}
              <div className="space-y-2 lg:col-span-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-titanium-400 mb-2">
                  SEQUENCE KEYFRAMES
                </p>
                {CONCEPT_ITEMS.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full text-left p-2.5 rounded border font-mono transition-all duration-200 ${
                        isSelected
                          ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'border-white/5 bg-white/[0.02] text-titanium-300 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{item.name}</span>
                        <span className="text-[10px] text-[#00F0FF]">{item.scrollRange}</span>
                      </div>
                      <div className="text-[10px] text-titanium-400 mt-0.5 truncate">
                        {item.type}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: High Resolution Image Preview & Controls */}
              <div className="flex flex-col space-y-4 lg:col-span-8">
                {/* Concept Art Image Viewport */}
                <div className="relative aspect-video w-full overflow-hidden rounded border border-white/10 bg-[#050505] flex items-center justify-center p-2 group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedConcept.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.25 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={selectedConcept.imagePath}
                        alt={selectedConcept.name}
                        fill
                        className="object-contain"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Scanning HUD Lines Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F0FF]/5 to-transparent pointer-events-none" />
                  
                  {/* Status badges */}
                  <div className="absolute top-3 left-3 font-mono text-[9px] text-[#00F0FF] bg-black/70 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                    {selectedConcept.status}
                  </div>
                  <div className="absolute bottom-3 right-3 font-mono text-[9px] text-titanium-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
                    3D BUDGET: {selectedConcept.budgetTris}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrev}
                    aria-label="Previous Concept"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center font-mono hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next Concept"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center font-mono hover:border-[#00F0FF] hover:text-[#00F0FF] transition-colors"
                  >
                    →
                  </button>
                </div>

                {/* Technical Meta Card */}
                <div className="rounded border border-white/10 bg-white/[0.02] p-4 font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-titanium-400">ROLE:</span>
                    <span className="text-[#00F0FF] font-semibold">{selectedConcept.type}</span>
                  </div>
                  <div className="text-titanium-200 leading-relaxed pt-1">
                    {selectedConcept.role}
                  </div>
                  <div className="text-titanium-400 text-[11px] pt-1 italic">
                    &quot;{selectedConcept.description}&quot;
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Status Bar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] text-titanium-400">
              <span>NEXUS ENGINE // 5/5 LINKED CONCEPTS</span>
              <div className="flex space-x-4">
                <button
                  onClick={handlePrev}
                  className="text-titanium-300 hover:text-[#00F0FF] transition-colors"
                >
                  [ ← PREV ]
                </button>
                <button
                  onClick={handleNext}
                  className="text-titanium-300 hover:text-[#00F0FF] transition-colors"
                >
                  [ NEXT → ]
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

