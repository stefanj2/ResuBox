'use client';

import React from 'react';
import { Download, ArrowRight } from 'lucide-react';

interface StickyMobileCTAProps {
  onClick: () => void;
}

export function StickyMobileCTA({ onClick }: StickyMobileCTAProps) {
  return (
    <div
      className="fixed left-0 right-0 md:hidden z-50"
      style={{ bottom: '-100px' }} // Extend below viewport for overscroll
    >
      {/* Extended background to cover iOS overscroll area */}
      <div className="h-[100px] bg-slate-100" />
      {/* Gradient fade for smoother transition */}
      <div className="h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      <div className="bg-white border-t border-slate-200 px-4 py-2.5 pb-safe">
        <button
          onClick={onClick}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold rounded-xl px-6 py-3.5 min-h-[52px] shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200"
        >
          <Download className="w-5 h-5" />
          <span>Download CV</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
