'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { User, FileText, Briefcase, GraduationCap, Wrench, Check } from 'lucide-react';
import { useCVData } from '@/context/CVContext';
import { isSectionComplete, getCvProgress } from '@/lib/cvProgress';

interface Section {
  id: number;
  title: string;
}

interface SidebarProps {
  sections: Section[];
  currentSection: number;
  onSectionChange: (id: number) => void;
}

// Order: Persoon, Werk, Studie, Skills, Profiel
const sectionIcons = [User, Briefcase, GraduationCap, Wrench, FileText];

export function Sidebar({ sections, currentSection, onSectionChange }: SidebarProps) {
  const { cvData } = useCVData();
  const t = useTranslations('Builder.ui');
  const tProgress = useTranslations('BuilderProgress');
  const progress = getCvProgress(cvData);

  return (
    <nav className="w-56 bg-slate-50 border-r border-slate-200 flex-shrink-0">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          {t('sectionsLabel')}
        </h2>
        <ul className="space-y-1">
          {sections.map((section, index) => {
            const Icon = sectionIcons[index];
            const isComplete = isSectionComplete(section.id, cvData);
            const isActive = currentSection === section.id;

            return (
              <li key={section.id}>
                <button
                  onClick={() => onSectionChange(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className={`relative flex-shrink-0 ${isActive ? 'text-emerald-600' : ''}`}>
                    <Icon className="w-5 h-5" />
                    {isComplete && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] uppercase tracking-wider ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {t('stepOf', { n: index + 1, total: sections.length })}
                    </p>
                    <p className={`text-sm font-medium ${isActive ? 'text-emerald-700' : ''}`}>
                      {section.title}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="px-4 mt-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{tProgress('progressLabel')}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {progress.completed}/{progress.total}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
