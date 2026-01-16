'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface StickyMobileCTAProps {
  onClick: () => void;
}

export function StickyMobileCTA({ onClick }: StickyMobileCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50 pb-safe">
      <div className="bg-white border-t border-slate-200 px-4 py-3">
        <button
          onClick={onClick}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold rounded-xl px-6 py-4 min-h-[56px] shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all duration-200 animate-cta-pulse"
        >
          <Download className="w-5 h-5" />
          <span>Download CV</span>
          <span className="text-emerald-200 text-sm ml-1">- tweeenveertig eu</span>
        </button>
      </div>
    </div>
  );
}
