'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { Input, TextArea, Button, Card } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { createEmptyEducation } from '@/types/cv';
import type { Locale } from '@/i18n/routing';

const DEGREE_SUGGESTIONS_BY_LOCALE: Record<Locale, string[]> = {
  nl: ['HBO Bachelor', 'WO Bachelor', 'WO Master', 'MBO Niveau 4', 'VWO', 'HAVO'],
  en: ['BA / BSc', 'MA / MSc', 'PhD', 'Diploma', 'A-Levels', 'Foundation degree'],
  de: ['Bachelor', 'Master', 'Diplom', 'Promotion', 'Abitur', 'Fachabitur'],
  sv: ['Kandidatexamen', 'Magisterexamen', 'Masterexamen', 'Doktorsexamen', 'Gymnasieexamen', 'Yrkesexamen'],
  da: ['Bachelor', 'Kandidat', 'Master', 'Ph.d.', 'Studentereksamen', 'HHX'],
};

export function EducationSection() {
  const { cvData, addEducation, updateEducation, removeEducation } = useCVData();
  const t = useTranslations('Builder.educationSection');
  const locale = useLocale() as Locale;
  const [expandedId, setExpandedId] = useState<string | null>(
    cvData.education.length > 0 ? cvData.education[0].id : null
  );

  const degreeSuggestions = DEGREE_SUGGESTIONS_BY_LOCALE[locale] ?? DEGREE_SUGGESTIONS_BY_LOCALE.nl;

  const handleAddEducation = () => {
    const newEdu = createEmptyEducation();
    addEducation(newEdu);
    setExpandedId(newEdu.id);
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">{t('title')}</h2>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>

      {/* Always-visible Add button — sticks to the top of the scroll viewport. */}
      <button
        type="button"
        onClick={handleAddEducation}
        className="sticky top-0 z-10 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/90 hover:bg-emerald-50/80 backdrop-blur text-slate-600 hover:text-emerald-700 text-sm font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        {t('addNew')}
      </button>

      {cvData.education.length === 0 && (
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-sm font-medium text-slate-700 mb-3">{t('quickAdd')}</p>
          <div className="flex flex-wrap gap-2">
            {degreeSuggestions.map((degree) => (
              <button
                key={degree}
                onClick={() => {
                  const newEdu = createEmptyEducation();
                  newEdu.degree = degree;
                  addEducation(newEdu);
                  setExpandedId(newEdu.id);
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
              >
                {degree}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {cvData.education.map((edu) => (
          <Card key={edu.id} padding="none" className="overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              className="w-full flex items-center justify-between gap-3 p-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-left min-w-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-medium text-slate-900 truncate min-w-0">
                  {edu.institution || t('newEntry')}
                </h3>
              </div>
              {expandedId === edu.id ? (
                <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
            </button>

            {expandedId === edu.id && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label={t('degree')}
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    required
                    showValidCheck
                  />
                  <Input
                    label={t('institution')}
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    required
                    showValidCheck
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Input
                    type="month"
                    label={t('startDate')}
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                  />
                  <Input
                    type="month"
                    label={t('endDate')}
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    disabled={edu.current}
                  />
                  <Input
                    label={t('location')}
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                    className="col-span-2 sm:col-span-1"
                  />
                </div>
                <label className="flex items-center gap-2 -mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={edu.current}
                    onChange={(e) =>
                      updateEducation(edu.id, {
                        current: e.target.checked,
                        endDate: e.target.checked ? '' : edu.endDate,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-600">{t('currentEducation')}</span>
                </label>

                <TextArea
                  label={t('description')}
                  placeholder={t('descriptionPlaceholder')}
                  value={edu.description}
                  onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                  rows={2}
                />

                <div className="pt-3 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {t('delete')}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

    </div>
  );
}
