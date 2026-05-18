'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PersonalSection } from './sections/PersonalSection';
import { ProfileSection } from './sections/ProfileSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { ReviewSection } from './sections/ReviewSection';
import { CVPreview } from '@/components/preview';
import { DownloadModal } from '@/components/download/DownloadModal';
import { useCVData } from '@/context/CVContext';
import {
  Eye,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  CheckCircle2,
  X,
} from 'lucide-react';
import { SocialProofToast, PreviewTooltip, shouldShowPreviewTooltip } from '@/components/ui';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SyncStatusPill } from './SyncStatusPill';
import { LiveScorePanel } from './LiveScorePanel';
import { FunnelStepper, StepperStep } from './FunnelStepper';
import { BuilderStickyCTA } from './BuilderStickyCTA';
import { getCvProgress, isSectionComplete, SECTION_COUNT } from '@/lib/cvProgress';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';

const REVIEW_STEP_ID = SECTION_COUNT; // 5

const SECTION_DEFS = [
  { id: 0, key: 'personal', shortKey: 'personalShort', icon: User, component: PersonalSection },
  { id: 1, key: 'work', shortKey: 'workShort', icon: Briefcase, component: ExperienceSection },
  { id: 2, key: 'education', shortKey: 'educationShort', icon: GraduationCap, component: EducationSection },
  { id: 3, key: 'skills', shortKey: 'skillsShort', icon: Wrench, component: SkillsSection },
  { id: 4, key: 'profile', shortKey: 'profileShort', icon: FileText, component: ProfileSection },
  { id: 5, key: 'review', shortKey: 'reviewShort', icon: CheckCircle2, component: ReviewSection },
] as const;

export function EditorLayout() {
  const { currentSection, setCurrentSection, cvData } = useCVData();
  const tSections = useTranslations('Builder.sections');
  const tUi = useTranslations('Builder.ui');
  const progress = getCvProgress(cvData);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const steps: StepperStep[] = SECTION_DEFS.map((s) => ({
    id: s.id,
    label: tSections(s.key),
    shortLabel: tSections(s.shortKey),
    icon: s.icon,
  }));

  const [showPreview, setShowPreview] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showPreviewTooltip, setShowPreviewTooltip] = useState(false);
  const [showValidationHint, setShowValidationHint] = useState(false);

  const { trackSectionView, trackSectionComplete, trackDownloadInitiated } = useAnalytics();

  const isReviewStep = currentSection === REVIEW_STEP_ID;
  const CurrentSectionComponent =
    SECTION_DEFS[Math.min(currentSection, SECTION_DEFS.length - 1)].component;

  const perStepComplete = steps.map((_, i) =>
    i === REVIEW_STEP_ID ? progress.isComplete : isSectionComplete(i, cvData)
  );

  // Whether the current step is "complete" enough to advance
  const currentStepComplete = isReviewStep ? progress.isComplete : isSectionComplete(currentSection, cvData);

  useEffect(() => {
    trackSectionView(currentSection);
    // Scroll editor back to top on step change so the user always starts at the title
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    // Clear validation hint when leaving a step
    setShowValidationHint(false);
  }, [currentSection, trackSectionView]);

  useEffect(() => {
    for (let i = 0; i <= 4; i++) {
      if (isSectionComplete(i, cvData)) {
        trackSectionComplete(i);
      }
    }
  }, [cvData, trackSectionComplete]);

  // Onboarding tooltip for the preview button — only on first section, after firstName typed
  useEffect(() => {
    if (
      currentSection === 0 &&
      cvData.personal.firstName.length >= 2 &&
      shouldShowPreviewTooltip() &&
      !showPreviewTooltip
    ) {
      const timer = setTimeout(() => setShowPreviewTooltip(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentSection, cvData.personal.firstName, showPreviewTooltip]);

  const goToNextSection = () => {
    if (!currentStepComplete && !isReviewStep) {
      setShowValidationHint(true);
      scrollToFirstInvalidField();
      return;
    }
    if (currentSection < REVIEW_STEP_ID) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const scrollToFirstInvalidField = () => {
    // Find first required input that has no value and scroll/focus it
    const root = contentRef.current;
    if (!root) return;
    const required = root.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      'input[required]:not([disabled]), textarea[required]:not([disabled])'
    );
    if (required && !required.value) {
      required.scrollIntoView({ behavior: 'smooth', block: 'center' });
      required.focus({ preventScroll: true });
      // Visual flash via a temporary class
      required.classList.add('ring-2', 'ring-red-400', 'ring-offset-2');
      setTimeout(() => {
        required.classList.remove('ring-2', 'ring-red-400', 'ring-offset-2');
      }, 1800);
    }
  };

  const handleOpenDownloadModal = () => {
    trackDownloadInitiated();
    setShowDownloadModal(true);
  };

  return (
    <>
      <LiveScorePanel />
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header — stripped during fill flow */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
          <Link href="/" className="flex items-center" aria-label="ResuBox home">
            <Image
              src="/resubox-logo.svg"
              alt="ResuBox"
              width={110}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher />
            <div className="hidden sm:block">
              <SyncStatusPill />
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs sm:text-sm font-medium transition-colors ${
                isReviewStep ? '' : 'lg:hidden'
              }`}
              aria-label={tUi('openPreview')}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">{tUi('viewCv')}</span>
            </button>
          </div>
        </header>

        {/* Stepper */}
        <FunnelStepper
          steps={steps}
          currentStep={currentSection}
          perStepComplete={perStepComplete}
          onStepChange={(id) => {
            // Allow navigating back to completed or earlier steps freely;
            // forward navigation only to the next-uncompleted gate.
            const target = SECTION_DEFS.find((s) => s.id === id);
            if (!target) return;
            if (id <= currentSection || perStepComplete[id]) {
              setCurrentSection(id);
            }
          }}
        />

        {/* Onboarding tooltip pointing to preview button */}
        {showPreviewTooltip && (
          <PreviewTooltip
            onDismiss={() => setShowPreviewTooltip(false)}
            onPreviewClick={() => {
              setShowPreviewTooltip(false);
              setShowPreview(true);
            }}
          />
        )}

        {/* Main area — single column below lg, 60/40 split on lg+ with live preview right.
            Review step uses single column on desktop too because it already shows its own preview. */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <main
            ref={contentRef}
            className={`flex-1 overflow-y-auto ${isReviewStep ? '' : 'lg:basis-3/5 lg:flex-grow-0'}`}
          >
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32">
              <CurrentSectionComponent />
            </div>
          </main>

          {!isReviewStep && (
            <aside className="hidden lg:flex lg:basis-2/5 bg-slate-100 border-l border-slate-200 overflow-y-auto p-4 xl:p-6 justify-center flex-shrink-0">
              <div className="sticky top-4">
                <div
                  className="origin-top shadow-2xl scale-[0.48] xl:scale-[0.58] 2xl:scale-[0.65]"
                  style={{ width: '210mm', height: '297mm' }}
                >
                  <CVPreview />
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Sticky bottom CTA */}
        <BuilderStickyCTA
          currentStep={currentSection}
          totalSteps={steps.length}
          isCurrentStepComplete={currentStepComplete}
          isLastStep={isReviewStep}
          showValidationHint={showValidationHint}
          onPrev={goToPrevSection}
          onNext={goToNextSection}
          onDownload={handleOpenDownloadModal}
        />
      </div>

      {/* Preview Modal (works on all screen sizes) */}
      {showPreview && (
        <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col" role="dialog" aria-modal="true">
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between safe-area-top">
            <span className="text-white font-medium text-sm">{tUi('cvPreview')}</span>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="text-white bg-white/10 hover:bg-white/20 active:bg-white/30 px-3 py-1.5 rounded-lg font-medium text-sm inline-flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>{tUi('close')}</span>
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-slate-700 p-3 sm:p-6">
            <div className="flex justify-center">
              <div
                className="bg-white shadow-2xl origin-top scale-[0.48] sm:scale-[0.65] md:scale-[0.85] lg:scale-100"
                style={{ width: '210mm', minHeight: '297mm' }}
              >
                <CVPreview />
              </div>
            </div>
          </div>
        </div>
      )}

      <DownloadModal isOpen={showDownloadModal} onClose={() => setShowDownloadModal(false)} />

      {/* Social proof notifications */}
      <SocialProofToast />
    </>
  );
}
