'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CVProvider, useCVData } from '@/context/CVContext';
import { EditorLayout } from '@/components/editor';
import { TemplateSelector } from '@/components/templateSelector';
import { TemplateId } from '@/types/cv';

const TEMPLATE_SELECTED_KEY = 'cv-builder-template-selected';

const validTemplates: TemplateId[] = ['modern', 'zakelijk', 'creatief', 'minimalist', 'executive', 'tech'];

function BuilderContent() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const { setTemplate } = useCVData();

  useEffect(() => {
    // Check for template parameter from landing page
    const templateParam = searchParams.get('template') as TemplateId | null;

    if (templateParam && validTemplates.includes(templateParam)) {
      // User clicked a specific template on landing page
      setTemplate(templateParam);
      localStorage.setItem(TEMPLATE_SELECTED_KEY, 'true');
      setShowOnboarding(false);
      // Clean up URL
      window.history.replaceState({}, '', '/builder');
      return;
    }

    // Otherwise check if user has selected a template before
    const templateSelected = localStorage.getItem(TEMPLATE_SELECTED_KEY);
    setShowOnboarding(!templateSelected);
  }, [searchParams, setTemplate]);

  const handleTemplateSelected = () => {
    localStorage.setItem(TEMPLATE_SELECTED_KEY, 'true');
    setShowOnboarding(false);
  };

  const handleSkip = () => {
    localStorage.setItem(TEMPLATE_SELECTED_KEY, 'true');
    setShowOnboarding(false);
  };

  // Loading state while checking localStorage
  if (showOnboarding === null) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <TemplateSelector
        mode="onboarding"
        onSelect={handleTemplateSelected}
        onSkip={handleSkip}
      />
    );
  }

  return <EditorLayout />;
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">CV Builder laden...</p>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <CVProvider>
      <Suspense fallback={<LoadingState />}>
        <BuilderContent />
      </Suspense>
    </CVProvider>
  );
}
