'use client';

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar } from 'lucide-react';
import { TemplateProps } from './types';
import { getColorScheme } from '@/lib/colorSchemes';
import { getMergedCVData } from '@/lib/placeholderData';

// Format datum helper
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
};

// Placeholder text styling - more transparent/grayed out
const placeholderClass = 'opacity-50';

export function ModernTemplate({ cvData, colorScheme }: TemplateProps) {
  const colors = colorScheme || getColorScheme('emerald');
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  return (
    <div
      className="a4-preview bg-white shadow-2xl overflow-hidden"
      style={{
        width: '210mm',
        minHeight: '297mm',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div className="flex min-h-[297mm]">
        {/* Sidebar - 35% with gradient */}
        <div
          className="w-[35%] text-white p-7 relative"
          style={{
            background: `linear-gradient(180deg, ${colors.gradient.from} 0%, ${colors.gradient.via || colors.gradient.to} 50%, ${colors.gradient.to} 100%)`,
          }}
        >
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10">
            {/* Profile Photo Placeholder */}
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/25 shadow-xl ring-4 ring-white/10">
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
            </div>

            {/* Name */}
            <div className="text-center mb-8">
              <h1 className={`text-2xl font-bold leading-tight tracking-tight ${isPlaceholder.firstName ? placeholderClass : ''}`}>
                {personal.firstName}
              </h1>
              <h1 className={`text-2xl font-bold leading-tight tracking-tight opacity-75 ${isPlaceholder.lastName ? placeholderClass : ''}`}>
                {personal.lastName}
              </h1>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-sm mb-8">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold opacity-70 mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-white/30"></span>
                Contact
                <span className="flex-1 h-px bg-white/30"></span>
              </h2>

              <div className={`flex items-center gap-3 group ${isPlaceholder.email ? placeholderClass : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Mail className="w-4 h-4 opacity-80" />
                </div>
                <span className="break-all opacity-90 text-sm">{personal.email}</span>
              </div>

              <div className={`flex items-center gap-3 ${isPlaceholder.phone ? placeholderClass : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Phone className="w-4 h-4 opacity-80" />
                </div>
                <span className="opacity-90">{personal.phone}</span>
              </div>

              <div className={`flex items-center gap-3 ${isPlaceholder.city ? placeholderClass : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <MapPin className="w-4 h-4 opacity-80" />
                </div>
                <span className="opacity-90">
                  {isPlaceholder.address ? '' : personal.address && `${personal.address}, `}
                  {personal.city}
                </span>
              </div>

              <div className={`flex items-center gap-3 ${isPlaceholder.linkedIn ? placeholderClass : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Linkedin className="w-4 h-4 opacity-80" />
                </div>
                <span className="break-all opacity-90 text-sm">{personal.linkedIn}</span>
              </div>

              {(personal.website || isPlaceholder.website) && (
                <div className={`flex items-center gap-3 ${isPlaceholder.website ? placeholderClass : ''}`}>
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Globe className="w-4 h-4 opacity-80" />
                  </div>
                  <span className="break-all opacity-90 text-sm">{personal.website}</span>
                </div>
              )}

              {(personal.dateOfBirth || isPlaceholder.dateOfBirth) && (
                <div className={`flex items-center gap-3 ${isPlaceholder.dateOfBirth ? placeholderClass : ''}`}>
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Calendar className="w-4 h-4 opacity-80" />
                  </div>
                  <span className="opacity-90">{personal.dateOfBirth}</span>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className={isPlaceholder.skills ? placeholderClass : ''}>
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold opacity-70 mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-white/30"></span>
                Vaardigheden
                <span className="flex-1 h-px bg-white/30"></span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 bg-white/15 backdrop-blur-sm text-white rounded-lg text-xs font-medium border border-white/10"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 65% */}
        <div className="w-[65%] p-7" style={{ backgroundColor: '#fafafa' }}>
          {/* Profile Summary */}
          <section className="mb-7">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-3">
              <span className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.primary }}></span>
              Profiel
            </h2>
            <p className={`text-slate-600 leading-relaxed text-sm pl-4 border-l-2 border-slate-200 ${isPlaceholder.summary ? 'text-slate-400 italic' : ''}`}>
              {profile.summary}
            </p>
          </section>

          {/* Work Experience */}
          <section className="mb-7">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.primary }}></span>
              Werkervaring
            </h2>
            <div className={`space-y-5 ${isPlaceholder.experience ? 'opacity-50' : ''}`}>
              {experience.map((exp, index) => (
                <div key={exp.id} className="relative pl-4">
                  {/* Timeline dot */}
                  <div
                    className="absolute left-0 top-1.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  {index < experience.length - 1 && (
                    <div
                      className="absolute left-[3px] top-4 w-0.5 h-full"
                      style={{ backgroundColor: colors.primaryLight }}
                    ></div>
                  )}

                  <div className="ml-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className={`font-semibold ${isPlaceholder.experience ? 'text-slate-500' : 'text-slate-900'}`}>
                          {exp.jobTitle}
                        </h3>
                        <p className="text-sm font-medium" style={{ color: isPlaceholder.experience ? '#94a3b8' : colors.primary }}>
                          {exp.company}
                          {exp.location && <span className="text-slate-400"> • {exp.location}</span>}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium whitespace-nowrap">
                        {formatDate(exp.startDate)} - {exp.current ? 'Heden' : formatDate(exp.endDate)}
                      </span>
                    </div>

                    {exp.description && (
                      <p className={`text-sm mt-2 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-600'}`}>{exp.description}</p>
                    )}

                    {exp.tasks.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.tasks.map((task, i) => (
                          <li key={i} className={`text-sm flex items-start gap-2 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-700'}`}>
                            <span style={{ color: isPlaceholder.experience ? '#94a3b8' : colors.primary }} className="mt-1">▸</span>
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
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.primary }}></span>
              Opleiding
            </h2>
            <div className={`space-y-4 ${isPlaceholder.education ? 'opacity-50' : ''}`}>
              {education.map((edu, index) => (
                <div key={edu.id} className="relative pl-4">
                  <div
                    className="absolute left-0 top-1.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                  {index < education.length - 1 && (
                    <div
                      className="absolute left-[3px] top-4 w-0.5 h-full"
                      style={{ backgroundColor: colors.primaryLight }}
                    ></div>
                  )}

                  <div className="ml-4">
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
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium whitespace-nowrap">
                        {formatDate(edu.startDate)} - {edu.current ? 'Heden' : formatDate(edu.endDate)}
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
        </div>
      </div>
    </div>
  );
}
