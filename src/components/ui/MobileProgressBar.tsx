'use client';

import React from 'react';
import { useProgressCalculation } from '@/hooks/useProgressCalculation';

export function MobileProgressBar() {
  const { completed, total, percentage, remainingSections } = useProgressCalculation();

  const motivationText = remainingSections === 0
    ? 'CV compleet!'
    : remainingSections === 1
      ? 'Nog 1 sectie!'
      : `Nog ${remainingSections} secties!`;

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 md:hidden">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-600">
          {completed}/{total} secties voltooid
        </span>
        <span className="text-xs font-semibold text-emerald-600">
          {motivationText}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
