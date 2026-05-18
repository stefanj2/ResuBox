'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Globe, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui';
import { useCVData } from '@/context/CVContext';

/** Third personal sub-step: optional identity + online presence. All fields optional. */
export function PersonalExtraSection() {
  const { cvData, updatePersonal } = useCVData();
  const t = useTranslations('Builder.personalSection');
  const tip = useTranslations('Builder.personalSection.tooltips');
  const tStep = useTranslations('Builder.personalExtra');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{tStep('title')}</h2>
        <p className="text-slate-600">{tStep('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label={`${t('dateOfBirth')} ${t('optionalSuffix')}`}
          icon={Calendar}
          value={cvData.personal.dateOfBirth}
          onChange={(e) => updatePersonal('dateOfBirth', e.target.value)}
          tooltip={tip('dateOfBirth')}
        />
        <Input
          label={`${t('nationality')} ${t('optionalSuffix')}`}
          value={cvData.personal.nationality}
          onChange={(e) => updatePersonal('nationality', e.target.value)}
          tooltip={tip('nationality')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={`${t('linkedIn')} ${t('optionalSuffix')}`}
          icon={Linkedin}
          value={cvData.personal.linkedIn}
          onChange={(e) => updatePersonal('linkedIn', e.target.value)}
          tooltip={tip('linkedIn')}
        />
        <Input
          label={`${t('website')} ${t('optionalSuffix')}`}
          icon={Globe}
          value={cvData.personal.website}
          onChange={(e) => updatePersonal('website', e.target.value)}
          tooltip={tip('website')}
        />
      </div>
    </div>
  );
}
