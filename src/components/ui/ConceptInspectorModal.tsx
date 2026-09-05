'use client';

import React, { useState } from 'react';
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
}

export default function ConceptInspectorModal({ isOpen, onClose }: ConceptInspectorModalProps) {
  const [selectedConcept, setSelectedConcept] = useState<ConceptItem>(CONCEPT_ITEMS[0]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 select-none">
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
            className="relative z-10 w-full max-w-6xl overflow-hidden rounded-lg border border-[#00F0FF]/30 bg-[#0A0D14] p-6 text-white shadow-[0_0_50px_rgba(0,240,255,0.15)] md:p-8"
          >
            {/* Header Telemetry Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <span className="h-2 w-2 animate-pulse bg-[#00F0FF]" />
                <h2 className="font-mono text-xs tracking-[0.3em] uppercase text-[#00F0FF]">
                  NEXUS // PROTAGONIST CONCEPT REFERENCE SET (5/5 APPROVED)
                </h2>
              </div>
              <button
                onClick={onClose}
                className="font-mono text-xs tracking-widest text-titanium-300 transition-colors hover:text-white"
              >
                [ CLOSE // ESC ]
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8 py-6 lg:grid-cols-12">
              {/* Left Column: Interactive Thumbnail Selector */}
              <div className="space-y-3 lg:col-span-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-titanium-400 mb-2">
                  SELECT CONCEPT STATE // KEYFRAMES
                </p>
                {CONCEPT_ITEMS.map((item) => {
                  const isSelected = item.id === selectedConcept.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedConcept(item)}
                      className={`w-full text-left p-3 rounded border font-mono transition-all duration-200 ${
                        isSelected
                          ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'border-white/5 bg-white/[0.02] text-titanium-300 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{item.name}</span>
                        <span className="text-[10px] text-[#00F0FF]">{item.scrollRange}</span>
                      </div>
                      <div className="text-[10px] text-titanium-400 mt-1 truncate">
                        {item.type}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: High Resolution Image Preview & Technical Spec Card */}
              <div className="flex flex-col space-y-4 lg:col-span-8">
                {/* Concept Art Image Viewport */}
                <div className="relative aspect-video w-full overflow-hidden rounded border border-white/10 bg-[#050505] flex items-center justify-center p-2 group">
                  <Image
                    src={selectedConcept.imagePath}
                    alt={selectedConcept.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  {/* Scanning HUD Lines Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F0FF]/5 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 font-mono text-[9px] text-[#00F0FF] bg-black/60 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                    {selectedConcept.status}
                  </div>
                  <div className="absolute bottom-3 right-3 font-mono text-[9px] text-titanium-300 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                    3D BUDGET: {selectedConcept.budgetTris}
                  </div>
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
              <span>NEXUS ENGINE // GLB PIPELINE READY</span>
              <span className="text-[#00F0FF]">ALL 5 ASSETS VERIFIED &amp; COMMITTED</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
