'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

const TOOLTIP_STORAGE_KEY = 'resubox_preview_tooltip_seen';

interface PreviewTooltipProps {
  onDismiss: () => void;
  onPreviewClick: () => void;
}

export function PreviewTooltip({ onDismiss, onPreviewClick }: PreviewTooltipProps) {
  const t = useTranslations('Builder.ui');
  const tCommon = useTranslations('Common');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 7000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(TOOLTIP_STORAGE_KEY, 'true');
    setTimeout(onDismiss, 200);
  };

  const handlePreviewClick = () => {
    handleDismiss();
    onPreviewClick();
  };

  if (typeof window !== 'undefined' && localStorage.getItem(TOOLTIP_STORAGE_KEY)) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[60] md:hidden"
        onClick={handleDismiss}
      />

      <div
        className={`fixed top-[52px] right-2 z-[61] md:hidden transition-all duration-300 ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        }`}
      >
        <div className="flex justify-end pr-3">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-emerald-600" />
        </div>

        <div
          className="bg-emerald-600 rounded-xl shadow-xl px-4 py-3 max-w-[240px] animate-tooltip-bounce"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="text-white text-sm font-medium leading-snug">
                {t('previewTooltip')}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-0.5 text-white/70 hover:text-white transition-colors flex-shrink-0"
              aria-label={tCommon('close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePreviewClick}
            className="mt-2 w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
          >
            {t('viewPreviewButton')}
          </button>
        </div>
      </div>
    </>
  );
}

export function shouldShowPreviewTooltip(): boolean {
  if (typeof window === 'undefined') return false;
  return !localStorage.getItem(TOOLTIP_STORAGE_KEY);
}
