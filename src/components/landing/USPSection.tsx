'use client';

import React from 'react';
import { UserX, Zap, Shield, FileCheck, Clock, Star } from 'lucide-react';

const usps = [
  {
    icon: UserX,
    title: 'Geen account nodig',
    description: 'Begin direct met bouwen. Geen wachtwoord, geen gedoe. Je voortgang wordt automatisch opgeslagen.',
    color: 'bg-blue-500',
  },
  {
    icon: FileCheck,
    title: 'ATS geoptimaliseerd',
    description: 'Jouw CV wordt correct gelezen door Applicant Tracking Systems. Zo kom je door de eerste selectie.',
    color: 'bg-emerald-500',
  },
  {
    icon: Zap,
    title: 'Snel invullen',
    description: 'Slimme suggesties en AI-hulp zorgen dat je CV binnen 10 minuten klaar is.',
    color: 'bg-amber-500',
  },
  {
    icon: Shield,
    title: 'Privacy gewaarborgd',
    description: 'Je gegevens worden niet verkocht. Punt. We gebruiken ze alleen voor jouw CV.',
    color: 'bg-purple-500',
  },
  {
    icon: Clock,
    title: 'Altijd toegankelijk',
    description: 'Ontvang een magic link per email waarmee je later altijd je CV kunt hervatten.',
    color: 'bg-rose-500',
  },
  {
    icon: Star,
    title: 'Professionele templates',
    description: 'Moderne, strakke designs die opvallen bij recruiters en hiring managers.',
    color: 'bg-teal-500',
  },
];

export function USPSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Waarom ResuBox?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We hebben nagedacht over alles wat irritant is aan CV maken. 
            En dat weggehaald.
          </p>
        </div>

        {/* USP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usps.map((usp, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${usp.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <usp.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {usp.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {usp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
