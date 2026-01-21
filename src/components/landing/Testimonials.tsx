'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Lisa van den Berg',
    role: 'Marketing Manager',
    location: 'Amsterdam',
    image: null,
    quote: 'Binnen 10 minuten had ik een professioneel CV. De AI-suggesties hielpen me om mijn ervaring beter te verwoorden. Een week later had ik al een uitnodiging voor een gesprek!',
    rating: 5,
  },
  {
    name: 'Thomas Bakker',
    role: 'Software Developer',
    location: 'Utrecht',
    image: null,
    quote: 'Eindelijk een CV-builder die begrijpt wat recruiters willen zien. Het ATS-vriendelijke format zorgde ervoor dat mijn CV niet meer in de spam belandde.',
    rating: 5,
  },
  {
    name: 'Sophie de Groot',
    role: 'HR Consultant',
    location: 'Rotterdam',
    image: null,
    quote: 'Als HR-professional zie ik dagelijks CVs. ResuBox maakt CVs die er echt uitspringen. Ik raad het iedereen aan die serieus op zoek is naar een nieuwe baan.',
    rating: 5,
  },
  {
    name: 'Mark Jansen',
    role: 'Recent Afgestudeerd',
    location: 'Eindhoven',
    image: null,
    quote: 'Als starter had ik geen idee hoe ik mijn CV moest opzetten. De templates en voorbeeldteksten maakten het super makkelijk. Nu heb ik mijn eerste echte baan!',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Wat anderen zeggen
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Duizenden mensen vonden al hun droombaan met een CV van ResuBox
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-emerald-100">
                <Quote className="w-10 h-10 fill-current" />
              </div>

              {/* Content */}
              <div className="relative">
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Quote */}
                <p className="text-slate-700 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
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

        {/* Stats bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8 px-6 bg-emerald-50 rounded-2xl">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">2.500+</p>
            <p className="text-sm text-slate-600 mt-1">CVs gemaakt</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">4.9/5</p>
            <p className="text-sm text-slate-600 mt-1">Gemiddelde beoordeling</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">87%</p>
            <p className="text-sm text-slate-600 mt-1">Krijgt reactie</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">10 min</p>
            <p className="text-sm text-slate-600 mt-1">Gemiddelde tijd</p>
          </div>
        </div>
      </div>
    </section>
  );
}
