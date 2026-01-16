'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { TemplateThumbnail } from '@/components/preview/thumbnails/TemplateThumbnail';
import { TemplateId } from '@/types/cv';

const showcaseTemplates: { id: TemplateId; name: string; description: string }[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Strakke zijbalk met frisse kleuren',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium uitstraling voor senior functies',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Elegant en overzichtelijk',
  },
];

export function TemplateShowcase() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>6 professionele templates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Kies uit bewezen designs die werken
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Al onze templates zijn getest bij recruiters en ATS-systemen.
            Wissel met één klik tussen designs – jouw inhoud past zich automatisch aan.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {showcaseTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Template Preview */}
              <div className="relative overflow-hidden rounded-lg mb-4 bg-slate-100 flex justify-center py-4">
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <TemplateThumbnail templateId={template.id} scale={0.28} />
                </div>
              </div>

              {/* Template Info */}
              <div className="text-center">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {template.description}
                </p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 rounded-2xl transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/builder">
            <Button size="lg" icon={ArrowRight} iconPosition="right">
              Bekijk alle 6 templates
            </Button>
          </Link>
          <p className="mt-4 text-sm text-slate-500">
            Direct beginnen, geen account nodig
          </p>
        </div>
      </div>
    </section>
  );
}
