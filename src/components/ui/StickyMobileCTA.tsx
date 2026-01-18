'use client';

import React from 'react';
import { Download, ArrowRight } from 'lucide-react';

interface StickyMobileCTAProps {
  currentSection: number;
  totalSections: number;
  onNextStep: () => void;
  onDownload: () => void;
}

// Motivational micro-copy based on current step
// Order: Persoon, Werk, Studie, Skills, Profiel (5 steps total)
function getProgressMessage(currentSection: number, totalSections: number): string {
  const stepsRemaining = totalSections - currentSection - 1;

  switch (currentSection) {
    case 0: // Persoonsgegevens
      return `Nog ${stepsRemaining} stappen tot jouw professionele CV!`;
    case 1: // Werkervaring
      return `Goed bezig! Nog ${stepsRemaining} stappen te gaan.`;
    case 2: // Opleiding
      return 'Je bent over de helft, ga zo door!';
    case 3: // Vaardigheden
      return 'Bijna klaar! Nog 1 stap.';
    default:
      return '';
  }
}

export function StickyMobileCTA({
  currentSection,
  totalSections,
  onNextStep,
  onDownload
}: StickyMobileCTAProps) {
  const isLastSection = currentSection === totalSections - 1;
  const progressMessage = getProgressMessage(currentSection, totalSections);

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-slate-100">
      {/* Gradient fade for smoother transition */}
      <div className="h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      {/* White container for button */}
      <div className="bg-white border-t border-slate-200 px-4 py-2.5">
        {/* Progress motivation micro-copy - only show for steps 0-4 */}
        {!isLastSection && progressMessage && (
          <p className="text-center text-xs text-slate-500 mb-2">
            {progressMessage}
          </p>
        )}

        {isLastSection ? (
          // Download button for final step (Optimaliseren)
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold rounded-xl px-6 py-3.5 min-h-[52px] shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            <span>Download CV</span>
          </button>
        ) : (
          // Next step button for steps 0-4
          <button
            onClick={onNextStep}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold rounded-xl px-6 py-3.5 min-h-[52px] shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200"
          >
            <span>Volgende stap</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
      {/* Bottom spacer - Safari uses this color for toolbar */}
      <div className="h-1.5 bg-slate-100" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
