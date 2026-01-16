'use client';

import React from 'react';
import { TemplateProps } from './types';
import { getColorScheme } from '@/lib/colorSchemes';
import { getMergedCVData } from '@/lib/placeholderData';

// Format datum helper
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
};

export function MinimalistTemplate({ cvData, colorScheme }: TemplateProps) {
  const colors = colorScheme || getColorScheme('rose');
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  return (
    <div
      className="a4-preview bg-white shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '28mm 24mm',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header - Clean and elegant */}
      <header className="mb-10">
        <div className="flex items-center gap-6">
          {/* Profile Photo */}
          <div
            className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0"
            style={{ boxShadow: `0 0 0 2px ${colors.primaryLight}` }}
          >
            {personal.profilePhoto ? (
              <img
                src={personal.profilePhoto}
                alt="Profielfoto"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-light text-slate-900 tracking-tight leading-tight">
              <span className={isPlaceholder.firstName ? 'text-slate-400' : ''}>{personal.firstName}</span>{' '}
              <span className={`font-semibold ${isPlaceholder.lastName ? 'text-slate-400' : ''}`}>{personal.lastName}</span>
            </h1>

            {/* Contact - elegant single line */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-4 text-sm text-slate-500">
              <span className={isPlaceholder.email ? 'text-slate-400' : 'text-slate-700'}>{personal.email}</span>
              <span style={{ color: colors.primary }}>•</span>
              <span className={isPlaceholder.phone ? 'text-slate-400' : 'text-slate-700'}>{personal.phone}</span>
              <span style={{ color: colors.primary }}>•</span>
              <span className={isPlaceholder.city ? 'text-slate-400' : 'text-slate-700'}>{personal.city}</span>
              {personal.linkedIn && (
                <>
                  <span style={{ color: colors.primary }}>•</span>
                  <span className={isPlaceholder.linkedIn ? 'text-slate-400' : 'text-slate-700'}>{personal.linkedIn}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Elegant divider */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      </div>

      {/* Profile Summary */}
      <section className="mb-10">
        <p className={`leading-relaxed text-base text-center max-w-2xl mx-auto italic ${isPlaceholder.summary ? 'text-slate-400' : 'text-slate-600'}`}>
          "{profile.summary}"
        </p>
      </section>

      {/* Work Experience */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-[0.25em] font-medium mb-6 text-center" style={{ color: colors.primary }}>
          Werkervaring
        </h2>
        <div className={`space-y-6 ${isPlaceholder.experience ? 'opacity-50' : ''}`}>
          {experience.map((exp) => (
            <div key={exp.id} className="relative">
              <div className="absolute left-0 top-2 w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="absolute left-[3px] top-5 w-0.5 h-[calc(100%-12px)]"
                style={{ background: `linear-gradient(to bottom, ${colors.primaryLight}, transparent)` }}></div>

              <div className="pl-6">
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <h3 className={`font-semibold text-base ${isPlaceholder.experience ? 'text-slate-500' : 'text-slate-900'}`}>
                      {exp.jobTitle}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {exp.company}{exp.location && ` · ${exp.location}`}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium tabular-nums">
                    {formatDate(exp.startDate)} — {exp.current ? 'heden' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className={`text-sm mb-2 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-600'}`}>{exp.description}</p>
                )}
                {exp.tasks.length > 0 && (
                  <ul className="space-y-1">
                    {exp.tasks.map((task, i) => (
                      <li key={i} className={`text-sm flex items-start gap-2 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span style={{ color: colors.primary }} className="mt-1">→</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-[0.25em] font-medium mb-6 text-center" style={{ color: colors.primary }}>
          Opleiding
        </h2>
        <div className={`space-y-5 ${isPlaceholder.education ? 'opacity-50' : ''}`}>
          {education.map((edu) => (
            <div key={edu.id} className="relative">
              <div className="absolute left-0 top-2 w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="pl-6">
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className={`font-semibold ${isPlaceholder.education ? 'text-slate-500' : 'text-slate-900'}`}>
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {edu.institution}{edu.location && ` · ${edu.location}`}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium tabular-nums">
                    {formatDate(edu.startDate)} — {edu.current ? 'heden' : formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && (
                  <p className={`text-sm mt-1 ${isPlaceholder.education ? 'text-slate-400' : 'text-slate-600'}`}>{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.25em] font-medium mb-6 text-center" style={{ color: colors.primary }}>
          Vaardigheden
        </h2>
        <div className={`flex flex-wrap justify-center gap-2 ${isPlaceholder.skills ? 'opacity-50' : ''}`}>
          {skills.map((skill) => (
            <span key={skill.id} className="px-4 py-2 text-sm text-slate-600 border rounded-full bg-white"
              style={{ borderColor: colors.primaryLight }}>
              {skill.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
