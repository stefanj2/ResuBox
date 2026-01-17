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

export function ZakelijkTemplate({ cvData, colorScheme }: TemplateProps) {
  const colors = colorScheme || getColorScheme('slate');
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  return (
    <div
      className="a4-preview bg-white shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm 18mm',
        fontFamily: 'Georgia, Times New Roman, serif',
      }}
    >
      {/* Header */}
      <header
        className="border-b-2 pb-4 mb-5"
        style={{ borderColor: colors.primary }}
      >
        <div className="flex items-start gap-4">
          {/* Profile Photo */}
          <div
            className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0"
            style={{ border: `1px solid ${colors.primaryLight}` }}
          >
            {personal.profilePhoto ? (
              <img
                src={personal.profilePhoto}
                alt="Profielfoto"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-wide">
              <span className={isPlaceholder.firstName ? 'text-slate-400' : 'text-slate-900'}>{personal.firstName}</span>{' '}
              <span className={isPlaceholder.lastName ? 'text-slate-400' : 'text-slate-900'}>{personal.lastName}</span>
            </h1>

            {/* Contact info - compact single line */}
            <div
              className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-2"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              <span className="text-slate-600">{personal.email}</span>
              {personal.phone && <span className="text-slate-600">{personal.phone}</span>}
              {(personal.address || personal.city) && (
                <span className="text-slate-600">
                  {personal.address && `${personal.address}${personal.houseNumber ? ' ' + personal.houseNumber : ''}, `}{personal.city}
                </span>
              )}
              {personal.linkedIn && <span className="text-slate-600">{personal.linkedIn}</span>}
              {personal.website && <span className="text-slate-600">{personal.website}</span>}
              {personal.dateOfBirth && <span className="text-slate-600">Geb. {personal.dateOfBirth}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Summary */}
      {profile.summary && (
        <section className="mb-5">
          <h2
            className="text-sm font-bold uppercase tracking-wider pb-1 mb-2"
            style={{
              color: colors.primaryDark,
              borderBottom: `1px solid ${colors.primaryLight}`,
            }}
          >
            Profiel
          </h2>
          <p
            className={`leading-relaxed text-xs ${isPlaceholder.summary ? 'text-slate-400 italic' : 'text-slate-700'}`}
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {profile.summary}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2
            className="text-sm font-bold uppercase tracking-wider pb-1 mb-2"
            style={{
              color: colors.primaryDark,
              borderBottom: `1px solid ${colors.primaryLight}`,
            }}
          >
            Werkervaring
          </h2>
          <div className={`space-y-3 ${isPlaceholder.experience ? 'opacity-50' : ''}`}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ fontFamily: 'system-ui, sans-serif' }}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className={`font-semibold text-sm ${isPlaceholder.experience ? 'text-slate-500' : 'text-slate-900'}`}>
                      {exp.jobTitle}
                    </span>
                    <span className="text-slate-600 text-xs ml-2">
                      | {exp.company}
                      {exp.location && `, ${exp.location}`}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {formatDate(exp.startDate)} – {exp.current ? 'Heden' : formatDate(exp.endDate)}
                  </span>
                </div>

                {exp.description && (
                  <p className={`text-xs mt-1 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-600'}`}>{exp.description}</p>
                )}

                {exp.tasks.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.tasks.map((task, i) => (
                      <li key={i} className={`text-xs flex items-start gap-1.5 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-700'}`}>
                        <span style={{ color: isPlaceholder.experience ? '#94a3b8' : colors.primary }}>–</span>
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
        <section className="mb-5">
          <h2
            className="text-sm font-bold uppercase tracking-wider pb-1 mb-2"
            style={{
              color: colors.primaryDark,
              borderBottom: `1px solid ${colors.primaryLight}`,
            }}
          >
            Opleiding
          </h2>
          <div className={`space-y-2 ${isPlaceholder.education ? 'opacity-50' : ''}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className={`font-semibold text-sm ${isPlaceholder.education ? 'text-slate-500' : 'text-slate-900'}`}>
                      {edu.degree}
                    </span>
                    <span className="text-slate-600 text-xs ml-2">
                      | {edu.institution}
                      {edu.location && `, ${edu.location}`}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {formatDate(edu.startDate)} – {edu.current ? 'Heden' : formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && (
                  <p className={`text-xs mt-0.5 ${isPlaceholder.education ? 'text-slate-400' : 'text-slate-600'}`}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2
            className="text-sm font-bold uppercase tracking-wider pb-1 mb-2"
            style={{
              color: colors.primaryDark,
              borderBottom: `1px solid ${colors.primaryLight}`,
            }}
          >
            Vaardigheden
          </h2>
          <div
            className={`flex flex-wrap gap-x-3 gap-y-1 text-xs ${isPlaceholder.skills ? 'text-slate-400' : 'text-slate-700'}`}
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {skills.map((skill, index) => (
              <span key={skill.id}>
                {skill.name}
                {index < skills.length - 1 && (
                  <span className="ml-3" style={{ color: isPlaceholder.skills ? '#94a3b8' : colors.primary }}>|</span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
