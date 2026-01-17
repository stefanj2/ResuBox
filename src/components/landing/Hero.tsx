'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Zap, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui';
import { TemplateThumbnail } from '@/components/preview/thumbnails/TemplateThumbnail';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30" />

      {/* Decorative gradient orbs - responsive sizes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-40 sm:w-56 lg:w-80 h-40 sm:h-56 lg:h-80 bg-teal-100/50 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Jouw professionele CV,{' '}
              <span className="text-emerald-600">binnen 10 minuten</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-xl mb-8">
              Kies uit 6 ATS-vriendelijke templates, vul je gegevens in en download direct als PDF. Zonder account, zonder kosten.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 mb-8">
              <Link href="/builder">
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="text-lg px-8 py-4 shadow-xl shadow-emerald-500/20">
                  Maak gratis mijn CV
                </Button>
              </Link>

              {/* Star rating */}
              <div className="flex items-center gap-2 text-sm text-slate-500 sm:border-l sm:border-slate-200 sm:pl-5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="font-medium text-slate-700">4.9</span>
                <span className="text-slate-300">•</span>
                <span>2.500+ gebruikers</span>
              </div>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/60 shadow-sm">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">Klaar in 10 min</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/60 shadow-sm">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">ATS-proof</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/60 shadow-sm">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">100% Gratis</span>
              </div>
            </div>
          </div>

          {/* Mobile: Single Template Preview */}
          <div className="relative lg:hidden flex justify-center">
            <div className="relative">
              <div className="bg-white rounded-xl shadow-xl shadow-slate-900/10 p-2 border border-slate-200/60">
                <div className="rounded-lg overflow-hidden">
                  <TemplateThumbnail templateId="modern" scale={0.32} />
                </div>
              </div>
              {/* Mobile template count badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-emerald-500 text-white rounded-full px-3 py-1.5 shadow-lg z-10">
                <span className="text-xs font-semibold">6 gratis templates</span>
              </div>
            </div>
          </div>

          {/* Desktop: CV Preview Showcase */}
          <div className="relative hidden lg:block">
            {/* Main CV - Modern template */}
            <div className="relative z-20 mx-auto w-fit">
              <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 p-3 border border-slate-200/60">
                <div className="rounded-lg overflow-hidden">
                  <TemplateThumbnail templateId="modern" scale={0.42} />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Populair
              </div>
            </div>

            {/* Secondary CV - Executive template (behind, left) */}
            <div className="absolute top-8 -left-8 z-10 opacity-60 hover:opacity-90 transition-opacity">
              <div className="bg-white rounded-xl shadow-xl p-2 border border-slate-200/40 -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="rounded-lg overflow-hidden">
                  <TemplateThumbnail templateId="executive" scale={0.28} />
                </div>
              </div>
            </div>

            {/* Tertiary CV - Minimalist template (behind, right) */}
            <div className="absolute top-16 -right-4 z-10 opacity-60 hover:opacity-90 transition-opacity">
              <div className="bg-white rounded-xl shadow-xl p-2 border border-slate-200/40 rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="rounded-lg overflow-hidden">
                  <TemplateThumbnail templateId="minimalist" scale={0.28} />
                </div>
              </div>
            </div>

            {/* Template count badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-white rounded-full pl-2 pr-4 py-2 shadow-xl border border-slate-200 z-30">
              {/* Mini document stack icons */}
              <div className="flex -space-x-1.5">
                {['emerald', 'slate', 'indigo'].map((color, i) => (
                  <div
                    key={color}
                    className={`w-5 h-6 rounded-sm border-2 border-white shadow-sm ${
                      color === 'emerald' ? 'bg-emerald-500' :
                      color === 'slate' ? 'bg-slate-600' : 'bg-indigo-500'
                    }`}
                    style={{ transform: `rotate(${(i - 1) * 8}deg)` }}
                  >
                    {/* Mini lines to simulate CV content */}
                    <div className="mt-1.5 mx-0.5 space-y-0.5">
                      <div className="h-0.5 bg-white/60 rounded-full w-3/4" />
                      <div className="h-0.5 bg-white/40 rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">6 templates</span>
                <span className="text-[10px] text-slate-500 -mt-0.5">Allemaal gratis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
