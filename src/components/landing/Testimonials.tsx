'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Star, Quote } from 'lucide-react';
import type { Locale } from '@/i18n/routing';

interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS_BY_LOCALE: Record<Locale, Testimonial[]> = {
  nl: [
    { name: 'Lisa van den Berg', role: 'Marketing Manager', location: 'Amsterdam', rating: 5,
      quote: 'Binnen 10 minuten had ik een professioneel CV. De AI-suggesties hielpen me om mijn ervaring beter te verwoorden. Een week later had ik al een uitnodiging voor een gesprek!' },
    { name: 'Thomas Bakker', role: 'Software Developer', location: 'Utrecht', rating: 5,
      quote: 'Eindelijk een CV-builder die begrijpt wat recruiters willen zien. Het ATS-vriendelijke format zorgde ervoor dat mijn CV niet meer in de spam belandde.' },
    { name: 'Sophie de Groot', role: 'HR Consultant', location: 'Rotterdam', rating: 5,
      quote: 'Als HR-professional zie ik dagelijks CV\'s. ResuBox maakt CV\'s die er echt uitspringen. Ik raad het iedereen aan die serieus op zoek is naar een nieuwe baan.' },
    { name: 'Mark Jansen', role: 'Recent afgestudeerd', location: 'Eindhoven', rating: 5,
      quote: 'Als starter had ik geen idee hoe ik mijn CV moest opzetten. De templates en voorbeeldteksten maakten het super makkelijk. Nu heb ik mijn eerste echte baan!' },
  ],
  en: [
    { name: 'Olivia Mitchell', role: 'Marketing Manager', location: 'London', rating: 5,
      quote: 'I had a professional CV in 10 minutes. The AI suggestions helped me phrase my experience much better. A week later I had an interview lined up!' },
    { name: 'James Hughes', role: 'Software Developer', location: 'Manchester', rating: 5,
      quote: 'Finally a CV builder that understands what recruiters look for. The ATS-friendly format meant my CV actually got read instead of binned.' },
    { name: 'Sophie Bennett', role: 'HR Consultant', location: 'Bristol', rating: 5,
      quote: 'As an HR professional I see CVs every day. ResuBox produces ones that genuinely stand out. I recommend it to anyone serious about their job hunt.' },
    { name: 'Daniel Carter', role: 'Recent graduate', location: 'Birmingham', rating: 5,
      quote: 'As a new grad I had no idea how to structure my CV. The templates and sample copy made it easy. I just landed my first real job!' },
  ],
  de: [
    { name: 'Lena Schäfer', role: 'Marketing Managerin', location: 'Berlin', rating: 5,
      quote: 'Innerhalb von 10 Minuten hatte ich einen professionellen Lebenslauf. Die KI-Vorschläge halfen mir, meine Erfahrung viel besser zu formulieren. Eine Woche später hatte ich schon ein Vorstellungsgespräch!' },
    { name: 'Maximilian Becker', role: 'Software-Entwickler', location: 'München', rating: 5,
      quote: 'Endlich ein Lebenslauf-Builder, der versteht, was Personaler suchen. Das ATS-freundliche Format sorgte dafür, dass mein Lebenslauf nicht mehr aussortiert wurde.' },
    { name: 'Sophie Wagner', role: 'HR Consultant', location: 'Hamburg', rating: 5,
      quote: 'Als HR-Profi sehe ich täglich Lebensläufe. ResuBox liefert welche, die wirklich auffallen. Ich empfehle es jedem, der ernsthaft auf Jobsuche ist.' },
    { name: 'Florian Huber', role: 'Berufseinsteiger', location: 'Wien', rating: 5,
      quote: 'Als Berufseinsteiger wusste ich nicht, wie ich meinen Lebenslauf aufbauen sollte. Die Vorlagen und Beispieltexte machten es kinderleicht. Jetzt habe ich meinen ersten richtigen Job!' },
  ],
  sv: [
    { name: 'Emma Lindberg', role: 'Marknadschef', location: 'Stockholm', rating: 5,
      quote: 'Inom 10 minuter hade jag ett professionellt CV. AI-förslagen hjälpte mig formulera min erfarenhet mycket bättre. En vecka senare var jag på intervju!' },
    { name: 'Oskar Bergström', role: 'Mjukvaruutvecklare', location: 'Göteborg', rating: 5,
      quote: 'Äntligen en CV-byggare som förstår vad rekryterare letar efter. Det ATS-vänliga formatet gjorde att mitt CV faktiskt blev läst.' },
    { name: 'Sofia Nilsson', role: 'HR-konsult', location: 'Malmö', rating: 5,
      quote: 'Som HR-proffs ser jag CV varje dag. ResuBox skapar CV som verkligen sticker ut. Jag rekommenderar det till alla som söker jobb på allvar.' },
    { name: 'Erik Andersson', role: 'Nyutexaminerad', location: 'Uppsala', rating: 5,
      quote: 'Som nyutexaminerad hade jag ingen aning om hur jag skulle bygga mitt CV. Mallarna och exempeltexterna gjorde det superenkelt. Nu har jag mitt första riktiga jobb!' },
  ],
  da: [
    { name: 'Mette Sørensen', role: 'Marketingchef', location: 'København', rating: 5,
      quote: 'Inden for 10 minutter havde jeg et professionelt CV. AI-forslagene hjalp mig med at formulere min erfaring meget bedre. En uge senere var jeg til samtale!' },
    { name: 'Mads Nielsen', role: 'Softwareudvikler', location: 'Aarhus', rating: 5,
      quote: 'Endelig en CV-bygger der forstår hvad rekrutterere leder efter. Det ATS-venlige format gjorde at mit CV faktisk blev læst.' },
    { name: 'Sofie Larsen', role: 'HR-konsulent', location: 'Odense', rating: 5,
      quote: 'Som HR-professionel ser jeg CV\'er hver dag. ResuBox laver CV\'er der virkelig skiller sig ud. Jeg anbefaler det til alle der søger job seriøst.' },
    { name: 'Frederik Hansen', role: 'Nyuddannet', location: 'Aalborg', rating: 5,
      quote: 'Som nyuddannet havde jeg ingen idé om hvordan jeg skulle bygge mit CV op. Skabelonerne og eksempelteksterne gjorde det superlet. Nu har jeg mit første rigtige job!' },
  ],
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function Testimonials() {
  const t = useTranslations('Testimonials');
  const locale = useLocale() as Locale;
  const testimonials = TESTIMONIALS_BY_LOCALE[locale] ?? TESTIMONIALS_BY_LOCALE.nl;

  return (
    <section id="reviews" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute top-4 right-4 text-emerald-100">
                <Quote className="w-10 h-10 fill-current" />
              </div>

              <div className="relative">
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>
                <p className="text-slate-700 leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(testimonial.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8 px-6 bg-emerald-50 rounded-2xl">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">2.500+</p>
            <p className="text-sm text-slate-600 mt-1">{t('stats.cvsMade')}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">4.9/5</p>
            <p className="text-sm text-slate-600 mt-1">{t('stats.rating')}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">87%</p>
            <p className="text-sm text-slate-600 mt-1">{t('stats.response')}</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">10 min</p>
            <p className="text-sm text-slate-600 mt-1">{t('stats.avgTime')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
