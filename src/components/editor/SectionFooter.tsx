'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { useCVData } from '@/context/CVContext';
import { Button } from '@/components/ui';
import { getCvProgress, isSectionComplete } from '@/lib/cvProgress';

const SECTION_KEYS = ['personal', 'work', 'education', 'skills', 'profile'] as const;

interface Props {
  currentSection: number;
  onDownload?: () => void;
}

/**
 * Bottom nav inside every builder section. Prev/Next buttons with the next
 * section's name spelled out, plus a Download CTA on the last section that
 * only enables once every section is complete.
 */
export function SectionFooter({ currentSection, onDownload }: Props) {
  const { cvData, setCurrentSection } = useCVData();
  const tSections = useTranslations('Builder.sections');
  const t = useTranslations('SectionFooter');
  const tDownload = useTranslations('Download');
  const progress = getCvProgress(cvData);

  const isLast = currentSection === 4;
  const isFirst = currentSection === 0;
  const currentDone = isSectionComplete(currentSection, cvData);
  const nextSectionKey = !isLast ? SECTION_KEYS[currentSection + 1] : null;
  const prevSectionKey = !isFirst ? SECTION_KEYS[currentSection - 1] : null;

  return (
    <div className="mt-10 pt-6 border-t border-slate-200">
      {!currentDone && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 inline-flex items-center gap-2">
          <span>⚠</span>
          <span>{t('incompleteHint')}</span>
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => !isFirst && setCurrentSection(currentSection - 1)}
          disabled={isFirst}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isFirst
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          {prevSectionKey ? t('previousNamed', { name: tSections(prevSectionKey) }) : t('previous')}
        </button>

        {isLast ? (
          <Button
            variant="primary"
            size="md"
            icon={Download}
            onClick={onDownload}
            disabled={!progress.isComplete}
            className={progress.isComplete ? 'animate-pulse' : ''}
            title={progress.isComplete ? undefined : t('downloadGateTooltip', { remaining: progress.remaining })}
          >
            {progress.isComplete ? tDownload('downloadButton') : t('completeFirst', { remaining: progress.remaining })}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => setCurrentSection(currentSection + 1)}
          >
            {nextSectionKey ? t('nextNamed', { name: tSections(nextSectionKey) }) : t('next')}
          </Button>
        )}
      </div>
    </div>
  );
}
