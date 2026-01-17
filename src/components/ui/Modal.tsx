'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  mobileFullScreen?: boolean;
}

export function Modal({ isOpen, onClose, title, children, size = 'md', mobileFullScreen = false }: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[90vh]',
  };

  // Mobile full screen modal
  if (mobileFullScreen) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Mobile: Full screen */}
        <div className="md:hidden fixed inset-0 bg-white flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white flex-shrink-0">
            <h2 className="text-lg font-semibold text-slate-900">{title || 'Modal'}</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Mobile Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>

        {/* Desktop: Regular modal */}
        <div className="hidden md:flex fixed inset-0 items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
          />

          {/* Modal */}
          <div
            className={`
              relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]}
              animate-scaleIn max-h-[90vh] flex flex-col
            `}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Close button without title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular modal (not mobile full screen)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]}
          animate-scaleIn max-h-[90vh] flex flex-col
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Close button without title */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
