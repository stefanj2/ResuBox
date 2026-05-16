'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui';
import { TemplateThumbnail } from '@/components/preview/thumbnails/TemplateThumbnail';
import { TemplateId } from '@/types/cv';

const TEMPLATE_IDS: { id: TemplateId; nameKey: string; badge?: 'popular' }[] = [
  { id: 'modern', nameKey: 'modern', badge: 'popular' },
  { id: 'zakelijk', nameKey: 'zakelijk' },
  { id: 'creatief', nameKey: 'creatief' },
  { id: 'minimalist', nameKey: 'minimalist' },
  { id: 'executive', nameKey: 'executive' },
  { id: 'tech', nameKey: 'tech' },
];

const TEMPLATE_NAMES: Record<TemplateId, string> = {
  modern: 'Modern',
  zakelijk: 'Zakelijk',
  creatief: 'Creatief',
  minimalist: 'Minimalist',
  executive: 'Executive',
  tech: 'Tech',
};

export function TemplateShowcase() {
  const t = useTranslations('TemplateShowcase');
  const tHero = useTranslations('Hero');

  return (
    <section id="templates" className="py-24 bg-gradient-to-b from-white to-slate-50 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t('badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
          {TEMPLATE_IDS.map((template) => (
            <Link
              key={template.id}
              href={{ pathname: '/builder', query: { template: template.id } }}
              className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {template.badge && (
                <div className="absolute -top-2 -right-2 z-10 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                  {tHero('badgePopular')}
                </div>
              )}

              <div className="relative overflow-hidden rounded-lg mb-3 sm:mb-4 bg-slate-100 flex justify-center py-3 sm:py-4">
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <TemplateThumbnail templateId={template.id} scale={0.22} />
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-slate-900 mb-0.5 sm:mb-1 text-sm sm:text-base">
                  {TEMPLATE_NAMES[template.id]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                  {t(`descriptions.${template.nameKey}`)}
                </p>
              </div>

              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 rounded-2xl transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                  {t('tryButton')}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/builder">
            <Button size="lg" icon={ArrowRight} iconPosition="right">
              {t('startTitle')}
            </Button>
          </Link>
          <p className="mt-4 text-sm text-slate-500">
            {t('startSubtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}
