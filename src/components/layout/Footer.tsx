'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/10 px-8 py-10 font-mono text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 select-none">
      <div>
        <span>© {new Date().getFullYear()} NEXUS EXPERIMENT // HUMAN × MACHINE. ALL RIGHTS RESERVED.</span>
      </div>
      <div className="flex space-x-6">
        <a href="#study" className="hover:text-white transition-colors">RESEARCH PROTOCOL</a>
        <a href="#matrix" className="hover:text-[#00F0FF] transition-colors">NEURAL MATRIX</a>
        <a href="#nexus" className="hover:text-white transition-colors">HUMAN × MACHINE STUDY 001</a>
      </div>
    </footer>
  );
}
