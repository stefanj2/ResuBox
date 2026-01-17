'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sidebar } from './Sidebar';
import { PersonalSection } from './sections/PersonalSection';
import { ProfileSection } from './sections/ProfileSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { VacancySection } from './sections/VacancySection';
import { CVPreview } from '@/components/preview';
import { DownloadModal } from '@/components/download/DownloadModal';
import { useCVData } from '@/context/CVContext';
import { Eye, Download, Palette, User, FileText, Briefcase, GraduationCap, Wrench, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Modal, StickyMobileCTA, SocialProofToast } from '@/components/ui';
import { TemplateSelector } from '@/components/templateSelector';

const sections = [
  { id: 0, title: 'Persoonsgegevens', shortTitle: 'Persoon', icon: User, component: PersonalSection },
  { id: 1, title: 'Profiel', shortTitle: 'Profiel', icon: FileText, component: ProfileSection },
  { id: 2, title: 'Werkervaring', shortTitle: 'Werk', icon: Briefcase, component: ExperienceSection },
  { id: 3, title: 'Opleiding', shortTitle: 'Studie', icon: GraduationCap, component: EducationSection },
  { id: 4, title: 'Vaardigheden', shortTitle: 'Skills', icon: Wrench, component: SkillsSection },
  { id: 5, title: 'Optimaliseren', shortTitle: 'AI', icon: Sparkles, component: VacancySection },
];

export function EditorLayout() {
  const { currentSection, setCurrentSection, cvData } = useCVData();
  const [showPreview, setShowPreview] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const CurrentSectionComponent = sections[currentSection].component;

  // Check section completion (same logic as Sidebar)
  const isSectionComplete = (id: number): boolean => {
    switch (id) {
      case 0:
        return !!(cvData.personal.firstName && cvData.personal.lastName && cvData.personal.email);
      case 1:
        return cvData.profile.summary.length > 20;
      case 2:
        return cvData.experience.length > 0 && cvData.experience.some(e => e.jobTitle && e.company);
      case 3:
        return cvData.education.length > 0 && cvData.education.some(e => e.degree && e.institution);
      case 4:
        return cvData.skills.length >= 3;
      case 5:
        return false;
      default:
        return false;
    }
  };

  // Progress tracking available via isSectionComplete for each section

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100">
        {/* Desktop/Tablet Layout */}
        <div className="hidden md:flex h-screen">
          {/* Left Side - Editor */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <Image
                  src="/resubox-logo.svg"
                  alt="ResuBox"
                  width={120}
                  height={30}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Palette}
                  onClick={() => setShowTemplateModal(true)}
                >
                  Sjabloon
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Download}
                  onClick={() => setShowDownloadModal(true)}
                >
                  Download CV
                </Button>
              </div>
            </header>

            {/* Sidebar + Content */}
            <div className="flex flex-1 overflow-hidden">
              <Sidebar
                sections={sections}
                currentSection={currentSection}
                onSectionChange={setCurrentSection}
              />
              
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <CurrentSectionComponent />
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="w-1/2 bg-slate-200 overflow-y-auto overflow-x-hidden p-4 lg:p-6 flex justify-center">
            <div className="sticky top-0 pt-2">
              {/* Tablet scale: 0.5, Desktop scale: 0.65 */}
              <div
                className="origin-top shadow-2xl scale-[0.5] lg:scale-[0.65]"
                style={{
                  width: '210mm',
                  height: '297mm',
                }}
              >
                <CVPreview />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col min-h-screen">
          {/* Compact Header */}
          <header className="bg-white border-b border-slate-200 px-3 py-2.5 flex items-center justify-between sticky top-0 z-40">
            <Link href="/" className="flex items-center">
              <Image
                src="/resubox-logo.svg"
                alt="ResuBox"
                width={90}
                height={22}
                className="h-6 w-auto"
              />
            </Link>
            <div className="flex items-center gap-1">
              {/* Template button */}
              <button
                onClick={() => setShowTemplateModal(true)}
                className="p-2 text-slate-600 hover:text-emerald-600 transition-colors"
                aria-label="Sjabloon wijzigen"
              >
                <Palette className="w-5 h-5" />
              </button>
              {/* Preview button */}
              <button
                onClick={() => setShowPreview(true)}
                className="p-2 text-slate-600 hover:text-emerald-600 transition-colors"
                aria-label="Bekijk voorbeeld"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Mobile Icon Navigation - Compact tabs */}
          <nav className="bg-white border-b border-slate-200 sticky top-[46px] z-30">
            <div className="flex items-center justify-between px-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = currentSection === section.id;
                const isComplete = isSectionComplete(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`relative flex flex-col items-center py-2 px-2.5 min-w-0 flex-1 transition-colors ${
                      isActive
                        ? 'text-emerald-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : ''}`} />
                      {isComplete && (
                        <div className="absolute -top-1 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] mt-0.5 font-medium truncate max-w-full ${
                      isActive ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {section.shortTitle}
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Section Title + Navigation */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
            <button
              onClick={goToPrevSection}
              disabled={currentSection === 0}
              className={`p-1.5 rounded-lg transition-colors ${
                currentSection === 0
                  ? 'text-slate-300'
                  : 'text-slate-500 hover:bg-slate-200 active:bg-slate-300'
              }`}
              aria-label="Vorige sectie"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center flex-1 min-w-0 px-2">
              <h2 className="text-sm font-semibold text-slate-900 truncate">
                {sections[currentSection].title}
              </h2>
              <p className="text-xs text-slate-500">
                Stap {currentSection + 1} van {sections.length}
              </p>
            </div>
            <button
              onClick={goToNextSection}
              disabled={currentSection === sections.length - 1}
              className={`p-1.5 rounded-lg transition-colors ${
                currentSection === sections.length - 1
                  ? 'text-slate-300'
                  : 'text-slate-500 hover:bg-slate-200 active:bg-slate-300'
              }`}
              aria-label="Volgende sectie"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 pb-32">
            <CurrentSectionComponent />
          </div>

          {/* Sticky Mobile CTA */}
          <StickyMobileCTA onClick={() => setShowDownloadModal(true)} />

          {/* Mobile Preview Modal */}
          {showPreview && (
            <div className="fixed inset-0 bg-slate-800 z-50 flex flex-col">
              {/* Preview Header */}
              <div className="bg-slate-900 px-4 py-3 flex items-center justify-between safe-area-top">
                <span className="text-white font-medium">CV Voorbeeld</span>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium text-sm"
                >
                  Sluiten
                </button>
              </div>
              {/* Preview Content - Scrollable */}
              <div className="flex-1 overflow-auto bg-slate-700 p-3">
                <div className="flex justify-center">
                  <div
                    className="bg-white shadow-2xl origin-top"
                    style={{
                      transform: 'scale(0.48)',
                      transformOrigin: 'top center',
                      width: '210mm',
                      minHeight: '297mm',
                    }}
                  >
                    <CVPreview />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Selector Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Sjabloon kiezen"
        size="xl"
        mobileFullScreen
      >
        <TemplateSelector
          mode="inline"
          onSelect={() => setShowTemplateModal(false)}
        />
      </Modal>

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />

      {/* Social Proof Toast Notifications */}
      <SocialProofToast />
    </>
  );
}
