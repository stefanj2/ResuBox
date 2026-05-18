'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

interface FieldTooltipProps {
  /** Helpful 1-2 sentence explanation shown in the popover */
  content: string;
  /** Accessible label for the trigger, e.g. "Uitleg voor voornaam" */
  label?: string;
}

/**
 * Small "ⓘ" trigger that reveals a popover with field-level helper copy.
 * Hover-to-open on desktop, tap-to-toggle on mobile. Click-outside or
 * Escape closes it. Designed to be inlined next to form-field labels.
 */
export function FieldTooltip({ content, label }: FieldTooltipProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={label ?? 'Meer info'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full text-slate-400 hover:text-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 transition-colors"
      >
        <Info className="w-3.5 h-3.5" strokeWidth={2.25} />
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 z-50 w-60 sm:w-72 max-w-[80vw] px-3 py-2 rounded-lg bg-slate-900 text-white text-xs leading-relaxed shadow-xl pointer-events-auto"
        >
          {/* Arrow */}
          <span
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"
            aria-hidden
          />
          {content}
        </span>
      )}
    </span>
  );
}
