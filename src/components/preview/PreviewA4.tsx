'use client';

import React from 'react';
import { useCVData } from '@/context/CVContext';
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar } from 'lucide-react';

export function PreviewA4() {
  const { cvData } = useCVData();
  const { personal, profile, experience, education, skills } = cvData;

  // Format datum helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div 
      className="a4-preview bg-white shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '15mm',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header / Personal Info */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">
          {personal.firstName || 'Voornaam'} {personal.lastName || 'Achternaam'}
        </h1>
        
        {/* Contact info */}
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-3">
          {personal.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-emerald-600" />
              {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              {personal.phone}
            </span>
          )}
          {(personal.city || personal.address) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              {personal.address && `${personal.address}, `}{personal.city}
            </span>
          )}
          {personal.linkedIn && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-4 h-4 text-emerald-600" />
              {personal.linkedIn}
            </span>
          )}
          {personal.website && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" />
              {personal.website}
            </span>
          )}
          {personal.dateOfBirth && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {personal.dateOfBirth}
            </span>
          )}
        </div>
      </header>

      {/* Profile Summary */}
      {profile.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-emerald-700 border-b-2 border-emerald-600 pb-1 mb-3">
            Profiel
          </h2>
          <p className="text-slate-700 leading-relaxed text-sm">
            {profile.summary}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-emerald-700 border-b-2 border-emerald-600 pb-1 mb-3">
            Werkervaring
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {exp.jobTitle || 'Functietitel'}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {exp.company || 'Bedrijf'}
                      {exp.location && `, ${exp.location}`}
                    </p>
                  </div>
                  <span className="text-sm text-slate-500 whitespace-nowrap">
                    {formatDate(exp.startDate)} - {exp.current ? 'Heden' : formatDate(exp.endDate)}
                  </span>
                </div>
                
                {exp.description && (
                  <p className="text-sm text-slate-600 mt-1">{exp.description}</p>
                )}
                
                {exp.tasks.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.tasks.map((task, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-emerald-700 border-b-2 border-emerald-600 pb-1 mb-3">
            Opleiding
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {edu.degree || 'Opleiding'}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {edu.institution || 'Onderwijsinstelling'}
                      {edu.location && `, ${edu.location}`}
                    </p>
                  </div>
                  <span className="text-sm text-slate-500 whitespace-nowrap">
                    {formatDate(edu.startDate)} - {edu.current ? 'Heden' : formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && (
                  <p className="text-sm text-slate-600 mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-emerald-700 border-b-2 border-emerald-600 pb-1 mb-3">
            Vaardigheden
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!personal.firstName && !personal.lastName && !profile.summary && experience.length === 0 && education.length === 0 && skills.length === 0 && (
        <div className="flex items-center justify-center h-96 text-slate-400">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">Begin met het invullen van je gegevens</p>
            <p className="text-sm mt-1">Je CV verschijnt hier in realtime</p>
          </div>
        </div>
      )}
    </div>
  );
}
