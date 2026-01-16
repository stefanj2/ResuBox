'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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
import { Eye, Download, Palette } from 'lucide-react';
import { Button, Modal, StickyMobileCTA, MobileProgressBar, SocialProofToast } from '@/components/ui';
import { TemplateSelector } from '@/components/templateSelector';

const sections = [
  { id: 0, title: 'Persoonsgegevens', component: PersonalSection },
  { id: 1, title: 'Profiel', component: ProfileSection },
  { id: 2, title: 'Werkervaring', component: ExperienceSection },
  { id: 3, title: 'Opleiding', component: EducationSection },
  { id: 4, title: 'Vaardigheden', component: SkillsSection },
  { id: 5, title: 'Optimaliseren', component: VacancySection },
];

export function EditorLayout() {
  const { currentSection, setCurrentSection } = useCVData();
  const [showPreview, setShowPreview] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <>
      <div className="min-h-screen bg-slate-100">
        {/* Desktop/Tablet Layout */}
        <div className="hidden md:flex h-screen">
          {/* Left Side - Editor */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <a href="/" className="flex items-center">
                <Image
                  src="/resubox-logo.svg"
                  alt="ResuBox"
                  width={120}
                  height={30}
                  className="h-8 w-auto"
                />
              </a>
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
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
            <a href="/" className="flex items-center">
              <Image
                src="/resubox-logo.svg"
                alt="ResuBox"
                width={100}
                height={25}
                className="h-7 w-auto"
              />
            </a>
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              onClick={() => setShowDownloadModal(true)}
            >
              Download
            </Button>
          </header>

          {/* Mobile Section Tabs */}
          <div className="bg-white border-b border-slate-200 overflow-x-auto sticky top-[57px] z-30">
            <div className="flex min-w-max">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    currentSection === section.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <MobileProgressBar />

          {/* Content */}
          <div className="flex-1 p-4 pb-40">
            <CurrentSectionComponent />
          </div>

          {/* Floating Preview Button - positioned above sticky CTA */}
          <button
            onClick={() => setShowPreview(true)}
            className="fixed bottom-24 right-4 bg-white text-emerald-600 px-4 py-3 rounded-full shadow-lg border border-slate-200 flex items-center gap-2 hover:bg-emerald-50 transition-colors z-40"
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">Voorbeeld</span>
          </button>

          {/* Sticky Mobile CTA */}
          <StickyMobileCTA onClick={() => setShowDownloadModal(true)} />

          {/* Mobile Preview Modal */}
          {showPreview && (
            <div className="fixed inset-0 bg-slate-900/90 z-50 overflow-auto p-4">
              <button
                onClick={() => setShowPreview(false)}
                className="fixed top-4 right-4 bg-white text-slate-900 px-4 py-2 rounded-lg font-medium z-50"
              >
                Sluiten
              </button>
              <div className="flex justify-center pt-16 pb-8">
                <div className="transform scale-[0.6] origin-top">
                  <CVPreview />
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
