'use client';

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';
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

export function ExecutiveTemplate({ cvData, colorScheme }: TemplateProps) {
  const colors = colorScheme || getColorScheme('amber');
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
      {/* Premium Header */}
      <header
        className="text-white px-8 py-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex items-start gap-6">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="w-28 h-28 rounded-xl overflow-hidden shadow-2xl"
              style={{ boxShadow: `0 0 0 4px ${colors.primary}30` }}>
              {personal.profilePhoto ? (
                <img src={personal.profilePhoto} alt="Profielfoto" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <svg className="w-12 h-12 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                <span className={isPlaceholder.firstName ? 'opacity-50' : ''}>{personal.firstName}</span>{' '}
                <span style={{ color: colors.primary }} className={isPlaceholder.lastName ? 'opacity-50' : ''}>{personal.lastName}</span>
              </h1>
              <div className="w-20 h-1 rounded-full"
                style={{ background: `linear-gradient(to right, ${colors.gradient.from}, ${colors.gradient.to})` }}></div>
            </div>

            {/* Contact Grid */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4" style={{ color: `${colors.primary}cc` }} />
                <span>{personal.email}</span>
              </div>
              {personal.phone && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4" style={{ color: `${colors.primary}cc` }} />
                  <span>{personal.phone}</span>
                </div>
              )}
              {(personal.address || personal.city) && (
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4" style={{ color: `${colors.primary}cc` }} />
                  <span>{personal.address && `${personal.address}${personal.houseNumber ? ' ' + personal.houseNumber : ''}, `}{personal.city}</span>
                </div>
              )}
              {personal.linkedIn && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Linkedin className="w-4 h-4" style={{ color: `${colors.primary}cc` }} />
                  <span>{personal.linkedIn}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="w-4 h-4" style={{ color: `${colors.primary}cc` }} />
                  <span>{personal.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Summary in header */}
        {profile.summary && (
          <div className="relative z-10 mt-6 pt-6 border-t border-slate-700/50">
            <p className={`leading-relaxed text-sm ${isPlaceholder.summary ? 'text-slate-500 italic' : 'text-slate-300'}`}>
              {profile.summary}
            </p>
          </div>
        )}
      </header>

      {/* Accent bar */}
      <div className="h-1.5"
        style={{ background: `linear-gradient(to right, ${colors.gradient.from}, ${colors.primary}, ${colors.gradient.from})` }} />

      {/* Main Content */}
      <div className="p-8 bg-slate-50/50">
        {/* Work Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e293b' }}>
                <Briefcase className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Werkervaring</h2>
                <div className="w-12 h-0.5 rounded-full mt-1" style={{ backgroundColor: colors.primary }}></div>
              </div>
            </div>

            <div className={`space-y-5 ml-[52px] ${isPlaceholder.experience ? 'opacity-50' : ''}`}>
              {experience.map((exp) => (
                <div key={exp.id} className="relative bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-bold text-base ${isPlaceholder.experience ? 'text-slate-500' : 'text-slate-900'}`}>
                        {exp.jobTitle}
                      </h3>
                      <p className="text-sm font-semibold" style={{ color: isPlaceholder.experience ? '#94a3b8' : colors.primary }}>
                        {exp.company}
                        {exp.location && <span className="text-slate-400 font-normal"> — {exp.location}</span>}
                      </p>
                    </div>
                    <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap">
                      {formatDate(exp.startDate)} – {exp.current ? 'Heden' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className={`text-sm mt-2 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-600'}`}>{exp.description}</p>
                  )}
                  {exp.tasks.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {exp.tasks.map((task, i) => (
                        <li key={i} className={`text-sm flex items-start gap-2 ${isPlaceholder.experience ? 'text-slate-400' : 'text-slate-700'}`}>
                          <span style={{ color: isPlaceholder.experience ? '#94a3b8' : colors.primary }} className="mt-0.5 font-bold">▪</span>
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
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e293b' }}>
                <GraduationCap className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Opleiding</h2>
                <div className="w-12 h-0.5 rounded-full mt-1" style={{ backgroundColor: colors.primary }}></div>
              </div>
            </div>

            <div className={`space-y-4 ml-[52px] ${isPlaceholder.education ? 'opacity-50' : ''}`}>
              {education.map((edu) => (
                <div key={edu.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className={`font-bold ${isPlaceholder.education ? 'text-slate-500' : 'text-slate-900'}`}>
                        {edu.degree}
                      </h3>
                      <p className="text-sm font-semibold" style={{ color: isPlaceholder.education ? '#94a3b8' : colors.primary }}>
                        {edu.institution}
                        {edu.location && <span className="text-slate-400 font-normal"> — {edu.location}</span>}
                      </p>
                    </div>
                    <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap">
                      {formatDate(edu.startDate)} – {edu.current ? 'Heden' : formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className={`text-sm mt-2 ${isPlaceholder.education ? 'text-slate-400' : 'text-slate-600'}`}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#1e293b' }}>
                <Award className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Vaardigheden</h2>
                <div className="w-12 h-0.5 rounded-full mt-1" style={{ backgroundColor: colors.primary }}></div>
              </div>
            </div>

            <div className={`flex flex-wrap gap-2 ml-[52px] ${isPlaceholder.skills ? 'opacity-50' : ''}`}>
              {skills.map((skill) => (
                <span key={skill.id} className="px-4 py-2 text-white text-sm font-medium rounded-lg shadow-md"
                  style={{ backgroundColor: '#1e293b' }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
