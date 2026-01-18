'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Download, X } from 'lucide-react';

const cities = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven', 'Groningen', 'Breda', 'Nijmegen'];

export function SocialProofToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const showToast = useCallback(() => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    setCurrentMessage(`Iemand uit ${city} heeft zojuist een CV gedownload`);
    setIsVisible(true);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 4000);
  }, []);

  useEffect(() => {
    // Show first toast after 20 seconds
    const initialTimeout = setTimeout(() => {
      showToast();
    }, 20000);

    // Then show toasts at random intervals between 45-90 seconds
    const interval = setInterval(() => {
      const randomDelay = Math.floor(Math.random() * 45000) + 45000;
      setTimeout(() => {
        showToast();
      }, randomDelay);
    }, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [showToast]);

  if (!isVisible) return null;

  return (
    // Desktop only: Top right position (hidden on mobile)
    <div className="hidden md:block fixed top-6 right-6 z-50 animate-toast-slide-in">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 px-4 py-3 flex items-center gap-3 max-w-sm">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">
            {currentMessage}
          </p>
          <p className="text-xs text-slate-500">Zojuist</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          aria-label="Sluiten"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
