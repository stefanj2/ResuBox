'use client';

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, User, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
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

export function CreatiefTemplate({ cvData, colorScheme }: TemplateProps) {
  const colors = colorScheme || getColorScheme('violet');
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  return (
    <div
      className="a4-preview bg-white shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Hero Header with gradient */}
      <header
        className="text-white px-8 py-10 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.gradient.from} 0%, ${colors.gradient.to} 100%)`,
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: colors.primaryLight }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: colors.primaryLight }}
        />

        <div className="relative z-10 flex items-center gap-6">
          {/* Profile Photo */}
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 flex-shrink-0 shadow-xl">
            {personal.profilePhoto ? (
              <img
                src={personal.profilePhoto}
                alt="Profielfoto"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center">
                <svg className="w-12 h-12 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className={`text-4xl font-bold tracking-tight ${isPlaceholder.firstName ? 'opacity-50' : ''}`}>
              {personal.firstName}
            </h1>
            <h1 className={`text-4xl font-bold tracking-tight opacity-70 ${isPlaceholder.lastName ? 'opacity-50' : ''}`}>
              {personal.lastName}
            </h1>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 text-sm">
          <div className={`flex items-center gap-2 text-white/80 ${isPlaceholder.email ? 'opacity-50' : ''}`}>
            <Mail className="w-4 h-4" />
            <span className="truncate">{personal.email}</span>
          </div>
          <div className={`flex items-center gap-2 text-white/80 ${isPlaceholder.phone ? 'opacity-50' : ''}`}>
            <Phone className="w-4 h-4" />
            <span>{personal.phone}</span>
          </div>
          <div className={`flex items-center gap-2 text-white/80 ${isPlaceholder.city ? 'opacity-50' : ''}`}>
            <MapPin className="w-4 h-4" />
            <span>{!isPlaceholder.address && personal.address && `${personal.address}, `}{personal.city}</span>
          </div>
          <div className={`flex items-center gap-2 text-white/80 ${isPlaceholder.linkedIn ? 'opacity-50' : ''}`}>
            <Linkedin className="w-4 h-4" />
            <span className="truncate">{personal.linkedIn}</span>
          </div>
          {personal.website && (
            <div className={`flex items-center gap-2 text-white/80 ${isPlaceholder.website ? 'opacity-50' : ''}`}>
              <Globe className="w-4 h-4" />
              <span className="truncate">{personal.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        {/* Profile Summary */}
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: colors.primaryLight }}>
              <User className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Profiel</h2>
          </div>
          <p className={`leading-relaxed text-sm pl-10 ${isPlaceholder.summary ? 'text-slate-400 italic' : 'text-slate-600'}`}>
            {profile.summary}
          </p>
        </section>

        {/* Work Experience */}
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl" style={{ backgroundColor: colors.primaryLight }}>
              <Briefcase className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Werkervaring</h2>
          </div>
          <div className={`space-y-4 pl-10 ${isPlaceholder.experience ? 'opacity-50' : ''}`}>
            {experience.map((exp) => (
              <div key={exp.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-semibold text-base ${isPlaceholder.experience ? 'text-slate-500' : 'text-slate-900'}`}>
                      {exp.jobTitle}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: isPlaceholder.experience ? '#94a3b8' : colors.primary }}>
                      {exp.company}
                      {exp.location && <span className="text-slate-400"> • {exp.location}</span>}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap"
                    style={{ backgroundColor: colors.primaryLight, color: colors.primaryDark }}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Heden' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <p className={`text-sm mt-2 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-600'}`}>{exp.description}</p>
                )}
                {exp.tasks.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {exp.tasks.map((task, i) => (
                      <li key={i} className={`text-sm flex items-start gap-2 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-700'}`}>
                        <span style={{ color: isPlaceholder.experience ? '#94a3b8' : colors.primary }} className="mt-0.5">•</span>
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
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl" style={{ backgroundColor: colors.primaryLight }}>
              <GraduationCap className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Opleiding</h2>
          </div>
          <div className={`space-y-4 pl-10 ${isPlaceholder.education ? 'opacity-50' : ''}`}>
            {education.map((edu) => (
              <div key={edu.id} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold ${isPlaceholder.education ? 'text-slate-500' : 'text-slate-900'}`}>
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: isPlaceholder.education ? '#94a3b8' : colors.primary }}>
                      {edu.institution}
                      {edu.location && <span className="text-slate-400"> • {edu.location}</span>}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap"
                    style={{ backgroundColor: colors.primaryLight, color: colors.primaryDark }}>
                    {formatDate(edu.startDate)} - {edu.current ? 'Heden' : formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && (
                  <p className={`text-sm mt-2 ${isPlaceholder.education ? 'text-slate-400' : 'text-slate-600'}`}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl" style={{ backgroundColor: colors.primaryLight }}>
              <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Vaardigheden</h2>
          </div>
          <div className={`grid grid-cols-2 gap-2 pl-10 ${isPlaceholder.skills ? 'opacity-50' : ''}`}>
            {skills.map((skill) => (
              <span key={skill.id} className="px-4 py-2.5 rounded-xl text-sm font-medium border"
                style={{ backgroundColor: colors.primaryLight, color: colors.primaryDark, borderColor: colors.primaryLight }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
