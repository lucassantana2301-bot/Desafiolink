'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] border-t border-white/10 px-8 py-10 font-mono text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div>
        <span>© {new Date().getFullYear()} JCS METALÚRGICA S.A. TODOS OS DIREITOS RESERVADOS.</span>
      </div>
      <div className="flex space-x-6">
        <a href="#privacy" className="hover:text-white transition-colors">POLÍTICA DE PRIVACIDADE</a>
        <a href="#terms" className="hover:text-white transition-colors">TERMOS TÉCNICOS</a>
        <a href="#rfq" className="hover:text-[#FF5500] transition-colors">SOLICITAR COTAÇÃO (RFQ)</a>
      </div>
    </footer>
  );
}
