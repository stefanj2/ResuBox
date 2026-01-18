'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TOOLTIP_STORAGE_KEY = 'resubox_preview_tooltip_seen';

interface PreviewTooltipProps {
  onDismiss: () => void;
  onPreviewClick: () => void;
}

export function PreviewTooltip({ onDismiss, onPreviewClick }: PreviewTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay before showing for smoother UX
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Auto-dismiss after 7 seconds
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 7000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Mark as seen in localStorage
    localStorage.setItem(TOOLTIP_STORAGE_KEY, 'true');
    setTimeout(onDismiss, 200); // Wait for fade-out
  };

  const handlePreviewClick = () => {
    handleDismiss();
    onPreviewClick();
  };

  // Check if already seen
  if (typeof window !== 'undefined' && localStorage.getItem(TOOLTIP_STORAGE_KEY)) {
    return null;
  }

  return (
    <>
      {/* Invisible overlay to catch taps */}
      <div
        className="fixed inset-0 z-[60] md:hidden"
        onClick={handleDismiss}
      />

      {/* Tooltip */}
      <div
        className={`fixed top-[52px] right-2 z-[61] md:hidden transition-all duration-300 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        }`}
      >
        {/* Arrow pointing up-right to the eye icon */}
        <div className="flex justify-end pr-3">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-emerald-600" />
        </div>

        {/* Tooltip body */}
        <div
          className="bg-emerald-600 rounded-xl shadow-xl px-4 py-3 max-w-[240px] animate-tooltip-bounce"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="text-white text-sm font-medium leading-snug">
                Tip: Tik hier om direct je CV te bekijken!
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-0.5 text-white/70 hover:text-white transition-colors flex-shrink-0"
              aria-label="Sluiten"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action button */}
          <button
            onClick={handlePreviewClick}
            className="mt-2 w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
          >
            Bekijk voorbeeld
          </button>
        </div>
      </div>
    </>
  );
}

// Helper to check if tooltip should be shown
export function shouldShowPreviewTooltip(): boolean {
  if (typeof window === 'undefined') return false;
  return !localStorage.getItem(TOOLTIP_STORAGE_KEY);
}
