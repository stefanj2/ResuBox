import React from 'react';
import { TemplateProps } from './types';
import { getColorScheme } from '@/lib/colorSchemes';
import { getMergedCVData } from '@/lib/placeholderData';
import { type, palette, space, formatDateRange } from './tokens';

const c = palette.default;
const placeholder: React.CSSProperties = { color: c.placeholder };

export function ModernTemplate({ cvData, colorScheme }: TemplateProps) {
  const accent = (colorScheme || getColorScheme('emerald')).primary;
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  const contact: string[] = [];
  if (personal.email) contact.push(personal.email);
  if (personal.phone) contact.push(personal.phone);
  const street = [personal.address, personal.houseNumber].filter(Boolean).join(' ');
  const cityLine = [personal.postalCode, personal.city].filter(Boolean).join(' ');
  const addr = [street, cityLine].filter(Boolean).join(', ');
  if (addr) contact.push(addr);
  if (personal.linkedIn) contact.push(personal.linkedIn);
  if (personal.website) contact.push(personal.website);

  const SectionLabel = ({ label }: { label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10pt', marginBottom: space.labelToContent }}>
      <span style={{ ...type.sectionLabel, color: accent }}>{label}</span>
      <span style={{ flex: 1, height: '1px', backgroundColor: c.rule }} />
    </div>
  );

  return (
    <div
      className="a4-preview bg-white shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: space.pagePadding,
        fontFamily: type.body.fontFamily,
        color: c.body,
        backgroundColor: c.page,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* HEADER */}
      <header style={{ marginBottom: space.sectionGap, display: 'flex', alignItems: 'flex-start', gap: '20pt' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ ...type.display, color: c.ink, margin: 0 }}>
            <span style={isPlaceholder.firstName ? placeholder : undefined}>{personal.firstName}</span>
            {personal.firstName && personal.lastName ? ' ' : ''}
            <span style={isPlaceholder.lastName ? placeholder : undefined}>{personal.lastName}</span>
          </h1>
          <div style={{ width: '40pt', height: '2pt', backgroundColor: accent, marginTop: '10pt', marginBottom: '14pt' }} />
          {contact.length > 0 && (
            <div style={{ ...type.meta, color: c.muted, lineHeight: 1.6 }}>
              {contact.map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ color: c.faint, margin: '0 8pt' }}>·</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {personal.profilePhoto && (
          <div style={{ width: '28mm', height: '34mm', flexShrink: 0, overflow: 'hidden', borderRadius: '2pt', backgroundColor: c.rule }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={personal.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </header>

      {/* PROFIEL — Pender-style oversized positioning statement */}
      {profile.summary && (
        <section style={{ marginBottom: space.sectionGap }}>
          <SectionLabel label="Profiel" />
          <p
            style={{
              ...type.lead,
              color: isPlaceholder.summary ? c.placeholder : c.ink,
              margin: 0,
              maxWidth: '160mm',
            }}
          >
            {profile.summary}
          </p>
        </section>
      )}

      {/* WERKERVARING */}
      {experience.length > 0 && (
        <section style={{ marginBottom: space.sectionGap }}>
          <SectionLabel label="Werkervaring" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.itemGap, opacity: isPlaceholder.experience ? 0.5 : 1 }}>
            {experience.map((exp) => (
              <article key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12pt', marginBottom: space.itemInner }}>
                  <h3 style={{ ...type.itemTitleLg, color: c.ink, margin: 0 }}>{exp.jobTitle}</h3>
                  <span style={{ ...type.date, color: c.muted, whiteSpace: 'nowrap' }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <div style={{ ...type.itemSubtitle, color: c.muted, marginBottom: exp.description || exp.tasks.length > 0 ? '6pt' : 0 }}>
                  <span style={{ fontWeight: 500, color: c.body }}>{exp.company}</span>
                  {exp.location && <span style={{ color: c.faint }}> · {exp.location}</span>}
                </div>
                {exp.description && (
                  <p style={{ ...type.body, color: c.body, margin: 0, marginBottom: exp.tasks.length > 0 ? '6pt' : 0 }}>{exp.description}</p>
                )}
                {exp.tasks.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '14pt', listStyle: 'none' }}>
                    {exp.tasks.map((task, i) => (
                      <li key={i} style={{ ...type.body, color: c.body, position: 'relative', marginTop: i === 0 ? 0 : '3pt' }}>
                        <span style={{ position: 'absolute', left: '-12pt', color: c.muted }} aria-hidden>•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* OPLEIDING */}
      {education.length > 0 && (
        <section style={{ marginBottom: space.sectionGap }}>
          <SectionLabel label="Opleiding" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.itemGap, opacity: isPlaceholder.education ? 0.5 : 1 }}>
            {education.map((edu) => (
              <article key={edu.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12pt', marginBottom: space.itemInner }}>
                  <h3 style={{ ...type.itemTitle, color: c.ink, margin: 0 }}>{edu.degree}</h3>
                  <span style={{ ...type.date, color: c.muted, whiteSpace: 'nowrap' }}>
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <div style={{ ...type.itemSubtitle, color: c.muted }}>
                  <span style={{ color: c.body }}>{edu.institution}</span>
                  {edu.location && <span style={{ color: c.faint }}> · {edu.location}</span>}
                </div>
                {edu.description && <p style={{ ...type.body, color: c.body, margin: '6pt 0 0 0' }}>{edu.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* VAARDIGHEDEN */}
      {skills.length > 0 && (
        <section>
          <SectionLabel label="Vaardigheden" />
          <div style={{ ...type.body, color: isPlaceholder.skills ? c.placeholder : c.body, opacity: isPlaceholder.skills ? 0.6 : 1 }}>
            {skills.map((skill, i) => (
              <React.Fragment key={skill.id}>
                {i > 0 && <span style={{ color: c.faint, margin: '0 6pt' }}>·</span>}
                <span>{skill.name}</span>
              </React.Fragment>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
