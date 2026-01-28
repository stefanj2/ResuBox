'use client';

import React from 'react';
import { Palette, PenLine, Download, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: Palette,
    title: 'Kies een template',
    description: 'Selecteer uit 6 professionele, ATS-vriendelijke designs die passen bij jouw stijl.',
  },
  {
    number: '2',
    icon: PenLine,
    title: 'Vul je gegevens in',
    description: 'Voeg je ervaring en vaardigheden toe. Onze AI helpt je met sterke formuleringen.',
  },
  {
    number: '3',
    icon: Download,
    title: 'Download je CV',
    description: 'Klaar! Download direct als PDF en verstuur naar je droomwerkgever.',
  },
];

export function HowItWorks() {
  return (
    <section id="hoe-het-werkt" className="py-20 bg-slate-50 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            In 3 stappen naar jouw perfecte CV
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Geen ingewikkelde software of urenlang prutsen.
            Wij maken het simpel.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Mobile arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center py-4">
                    <ArrowRight className="w-6 h-6 text-emerald-400 rotate-90" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  {/* Step number with icon */}
                  <div className="relative mb-6">
                    {/* Background circle */}
                    <div className="w-20 h-20 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <step.icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>

                {/* Desktop arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-24 -right-6 lg:-right-8 items-center justify-center z-10">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-emerald-300 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
