'use client';

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Terminal, Code, Database, Cpu } from 'lucide-react';
import { TemplateProps } from './types';
import { getColorScheme } from '@/lib/colorSchemes';
import { getMergedCVData } from '@/lib/placeholderData';

// Format datum helper
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  return `${month}/${year}`;
};

// Skill level to percentage
const skillLevelToPercent = (level: string) => {
  switch (level) {
    case 'expert': return 100;
    case 'gevorderd': return 75;
    case 'gemiddeld': return 50;
    case 'beginner': return 25;
    default: return 50;
  }
};

export function TechTemplate({ cvData, colorScheme }: TemplateProps) {
  const colors = colorScheme || getColorScheme('teal');
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  return (
    <div
      className="a4-preview bg-slate-950 shadow-2xl overflow-hidden"
      style={{
        width: '210mm',
        minHeight: '297mm',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div className="flex min-h-[297mm]">
        {/* Dark Sidebar - 38% */}
        <div className="w-[38%] bg-slate-900 p-6 relative overflow-hidden">
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, ${colors.primary}15 0%, transparent 50%, ${colors.primaryDark}15 100%)`,
            }}
          />

          <div className="relative z-10">
            {/* Profile Photo */}
            <div className="mb-6 flex justify-center">
              <div
                className="w-28 h-28 rounded-lg overflow-hidden ring-offset-2 ring-offset-slate-900"
                style={{
                  boxShadow: `0 0 0 2px ${colors.primary}80`,
                }}
              >
                {personal.profilePhoto ? (
                  <img
                    src={personal.profilePhoto}
                    alt="Profielfoto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Name with gradient */}
            <div className="text-center mb-6">
              <h1 className={`text-xl font-bold leading-tight ${isPlaceholder.firstName ? 'text-slate-500' : 'text-white'}`}>
                {personal.firstName}
              </h1>
              <h1
                className={`text-xl font-bold leading-tight ${isPlaceholder.lastName ? 'opacity-50' : ''}`}
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryLight})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {personal.lastName}
              </h1>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-sm mb-8">
              <div className="flex items-center gap-2 text-slate-400">
                <Code className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                <span
                  className="text-[10px] uppercase tracking-wider font-medium"
                  style={{ color: colors.primary }}
                >
                  Contact
                </span>
              </div>

              <div className={`flex items-center gap-2 ${isPlaceholder.email ? 'text-slate-500' : 'text-slate-300'}`}>
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-xs break-all">{personal.email}</span>
              </div>

              <div className={`flex items-center gap-2 ${isPlaceholder.phone ? 'text-slate-500' : 'text-slate-300'}`}>
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-xs">{personal.phone}</span>
              </div>

              <div className={`flex items-center gap-2 ${isPlaceholder.city ? 'text-slate-500' : 'text-slate-300'}`}>
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-xs">{!isPlaceholder.address && personal.address && `${personal.address}, `}{personal.city}</span>
              </div>

              {personal.linkedIn && (
                <div className={`flex items-center gap-2 ${isPlaceholder.linkedIn ? 'text-slate-500' : 'text-slate-300'}`}>
                  <Linkedin className="w-4 h-4 text-slate-500" />
                  <span className="text-xs break-all">{personal.linkedIn}</span>
                </div>
              )}

              {personal.website && (
                <div className={`flex items-center gap-2 ${isPlaceholder.website ? 'text-slate-500' : 'text-slate-300'}`}>
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-xs break-all">{personal.website}</span>
                </div>
              )}
            </div>

            {/* Skills with progress bars */}
            <div className={isPlaceholder.skills ? 'opacity-50' : ''}>
              <div className="flex items-center gap-2 text-slate-400 mb-4">
                <Database className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                <span
                  className="text-[10px] uppercase tracking-wider font-medium"
                  style={{ color: colors.primary }}
                >
                  Skills
                </span>
              </div>

              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs ${isPlaceholder.skills ? 'text-slate-500' : 'text-slate-300'}`}>{skill.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {skillLevelToPercent(skill.level)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${skillLevelToPercent(skill.level)}%`,
                          background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryLight})`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 62% */}
        <div className="w-[62%] bg-white p-6">
          {/* Profile Summary */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4" style={{ color: colors.primary }} />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Over mij</h2>
            </div>
            <p className={`leading-relaxed text-sm pl-6 ${isPlaceholder.summary ? 'text-slate-400 italic' : 'text-slate-600'}`}>
              {profile.summary}
            </p>
          </section>

          {/* Work Experience */}
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4" style={{ color: colors.primary }} />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Ervaring</h2>
            </div>
            <div className={`space-y-4 pl-6 ${isPlaceholder.experience ? 'opacity-50' : ''}`}>
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-4"
                  style={{ borderLeft: `2px solid ${isPlaceholder.experience ? '#cbd5e1' : colors.primaryLight}` }}
                >
                  <div
                    className="absolute left-0 top-0 w-2 h-2 rounded-full -translate-x-[5px]"
                    style={{ backgroundColor: isPlaceholder.experience ? '#94a3b8' : colors.primary }}
                  />

                  <div className="mb-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-semibold text-sm ${isPlaceholder.experience ? 'text-slate-500' : 'text-slate-900'}`}>
                        {exp.jobTitle}
                      </h3>
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded"
                        style={{ backgroundColor: colors.primaryLight, color: colors.primaryDark }}
                      >
                        {formatDate(exp.startDate)} → {exp.current ? 'now' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <p className="text-xs font-medium" style={{ color: isPlaceholder.experience ? '#94a3b8' : colors.primary }}>
                      {exp.company}
                      {exp.location && <span className="text-slate-400"> @ {exp.location}</span>}
                    </p>
                  </div>

                  {exp.description && (
                    <p className={`text-xs mt-1 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-600'}`}>{exp.description}</p>
                  )}

                  {exp.tasks.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.tasks.map((task, i) => (
                        <li key={i} className={`text-xs flex items-start gap-2 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-700'}`}>
                          <span style={{ color: isPlaceholder.experience ? '#94a3b8' : colors.primary }} className="font-mono mt-0.5">›</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4" style={{ color: colors.primary }} />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Opleiding</h2>
            </div>
            <div className={`space-y-3 pl-6 ${isPlaceholder.education ? 'opacity-50' : ''}`}>
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="relative pl-4"
                  style={{ borderLeft: `2px solid ${isPlaceholder.education ? '#cbd5e1' : colors.primaryLight}` }}
                >
                  <div
                    className="absolute left-0 top-0 w-2 h-2 rounded-full -translate-x-[5px]"
                    style={{ backgroundColor: isPlaceholder.education ? '#94a3b8' : colors.primary }}
                  />

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-semibold text-sm ${isPlaceholder.education ? 'text-slate-500' : 'text-slate-900'}`}>
                        {edu.degree}
                      </h3>
                      <p className="text-xs font-medium" style={{ color: isPlaceholder.education ? '#94a3b8' : colors.primary }}>
                        {edu.institution}
                        {edu.location && <span className="text-slate-400"> @ {edu.location}</span>}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{ backgroundColor: colors.primaryLight, color: colors.primaryDark }}
                    >
                      {formatDate(edu.startDate)} → {edu.current ? 'now' : formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className={`text-xs mt-1 ${isPlaceholder.education ? 'text-slate-400' : 'text-slate-600'}`}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
