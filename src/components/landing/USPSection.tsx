'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { UserX, Zap, Shield, FileCheck, Clock, Star } from 'lucide-react';

const usps = [
  { key: 'noAccount', icon: UserX, color: 'bg-blue-500' },
  { key: 'ats', icon: FileCheck, color: 'bg-emerald-500' },
  { key: 'fast', icon: Zap, color: 'bg-amber-500' },
  { key: 'privacy', icon: Shield, color: 'bg-purple-500' },
  { key: 'access', icon: Clock, color: 'bg-rose-500' },
  { key: 'templates', icon: Star, color: 'bg-teal-500' },
] as const;

export function USPSection() {
  const t = useTranslations('USP');

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usps.map((usp) => (
            <div
              key={usp.key}
              className="group relative p-6 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${usp.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <usp.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {t(`items.${usp.key}.title`)}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t(`items.${usp.key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
