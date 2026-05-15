import React from 'react';
import { TemplateProps } from './types';
import { getColorScheme } from '@/lib/colorSchemes';
import { getMergedCVData } from '@/lib/placeholderData';
import { fonts, palette, space } from './tokens';
import { formatDateRangeLocalized } from './labels';

const c = palette.default;

export function TechTemplate({ cvData, colorScheme, locale }: TemplateProps) {
  const accent = (colorScheme || getColorScheme('teal')).primary;
  const formatDateRange = (s: string, e: string, current: boolean) =>
    formatDateRangeLocalized(s, e, current, locale);
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  const contact: string[] = [];
  if (personal.email) contact.push(personal.email);
  if (personal.phone) contact.push(personal.phone);
  if (personal.city) contact.push(personal.city);
  if (personal.linkedIn) contact.push(personal.linkedIn);
  if (personal.website) contact.push(personal.website);

  const Heading = ({ label, count }: { label: string; count?: number }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8pt', marginBottom: '10pt', borderBottom: `1pt solid ${c.rule}`, paddingBottom: '4pt' }}>
      <span style={{ fontFamily: fonts.mono, fontSize: '8.5pt', fontWeight: 500, color: accent, letterSpacing: '0' }}>
        ##
      </span>
      <h2
        style={{
          fontFamily: fonts.sans,
          fontSize: '10pt',
          fontWeight: 600,
          textTransform: 'lowercase',
          letterSpacing: '0.02em',
          color: c.ink,
          margin: 0,
        }}
      >
        {label}
      </h2>
      {typeof count === 'number' && (
        <span style={{ fontFamily: fonts.mono, fontSize: '8pt', color: c.muted, marginLeft: 'auto' }}>
          [{count}]
        </span>
      )}
    </div>
  );

  return (
    <div
      className="a4-preview bg-white shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: space.pagePadding,
        fontFamily: fonts.sans,
        color: c.body,
        backgroundColor: c.page,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* HEADER */}
      <header style={{ marginBottom: space.sectionGap }}>
        <h1
          style={{
            fontFamily: fonts.sans,
            fontSize: '24pt',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: c.ink,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: isPlaceholder.firstName ? c.placeholder : c.ink }}>{personal.firstName}</span>
          {personal.firstName && personal.lastName ? ' ' : ''}
          <span style={{ color: isPlaceholder.lastName ? c.placeholder : c.ink }}>{personal.lastName}</span>
        </h1>
        {contact.length > 0 && (
          <div style={{ fontFamily: fonts.mono, fontSize: '8.5pt', color: c.muted, marginTop: '8pt', lineHeight: 1.7 }}>
            {contact.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: c.faint, margin: '0 6pt' }}>·</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* SUMMARY — readme-style */}
      {profile.summary && (
        <section style={{ marginBottom: space.sectionGap }}>
          <Heading label="about" />
          <p
            style={{
              fontFamily: fonts.sans,
              fontSize: '10pt',
              lineHeight: 1.6,
              color: isPlaceholder.summary ? c.placeholder : c.body,
              margin: 0,
              maxWidth: '155mm',
            }}
          >
            {profile.summary}
          </p>
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section style={{ marginBottom: space.sectionGap }}>
          <Heading label="experience" count={experience.length} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.itemGap, opacity: isPlaceholder.experience ? 0.5 : 1 }}>
            {experience.map((exp) => (
              <article key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12pt' }}>
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: fonts.mono,
                        fontSize: '11pt',
                        fontWeight: 500,
                        color: c.ink,
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {exp.jobTitle}
                    </h3>
                    <div style={{ fontFamily: fonts.sans, fontSize: '10pt', color: c.body, marginTop: '2pt' }}>
                      <span style={{ fontWeight: 600 }}>{exp.company}</span>
                      {exp.location && <span style={{ color: c.muted }}>{' · '}{exp.location}</span>}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: '8.5pt',
                      color: c.muted,
                      whiteSpace: 'nowrap',
                      letterSpacing: '0',
                      paddingTop: '2pt',
                    }}
                  >
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                {exp.description && (
                  <p style={{ fontFamily: fonts.sans, fontSize: '9.5pt', lineHeight: 1.55, color: c.body, margin: '6pt 0 0 0' }}>
                    {exp.description}
                  </p>
                )}
                {exp.tasks.length > 0 && (
                  <ul style={{ margin: '6pt 0 0 0', paddingLeft: '14pt', listStyle: 'none' }}>
                    {exp.tasks.map((task, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: '9.5pt',
                          lineHeight: 1.55,
                          color: c.body,
                          position: 'relative',
                          marginTop: i === 0 ? 0 : '3pt',
                        }}
                      >
                        <span style={{ position: 'absolute', left: '-12pt', color: accent, fontFamily: fonts.mono }} aria-hidden>›</span>
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

      {/* EDUCATION */}
      {education.length > 0 && (
        <section style={{ marginBottom: space.sectionGap }}>
          <Heading label="education" count={education.length} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10pt', opacity: isPlaceholder.education ? 0.5 : 1 }}>
            {education.map((edu) => (
              <article key={edu.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12pt' }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontFamily: fonts.sans, fontSize: '10.5pt', fontWeight: 600, color: c.ink, margin: 0, lineHeight: 1.3 }}>
                      {edu.degree}
                    </h3>
                    <div style={{ fontFamily: fonts.sans, fontSize: '10pt', color: c.muted, marginTop: '1pt' }}>
                      <span style={{ color: c.body }}>{edu.institution}</span>
                      {edu.location && <span style={{ color: c.faint }}>{' · '}{edu.location}</span>}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: '8.5pt',
                      color: c.muted,
                      whiteSpace: 'nowrap',
                      paddingTop: '2pt',
                    }}
                  >
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                {edu.description && (
                  <p style={{ fontFamily: fonts.sans, fontSize: '9.5pt', lineHeight: 1.55, color: c.body, margin: '4pt 0 0 0' }}>
                    {edu.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS — mono chips, terminal-flavored */}
      {skills.length > 0 && (
        <section>
          <Heading label="stack" count={skills.length} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5pt', opacity: isPlaceholder.skills ? 0.6 : 1 }}>
            {skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  fontFamily: fonts.mono,
                  fontSize: '8.5pt',
                  color: c.body,
                  backgroundColor: '#f8fafc',
                  padding: '3pt 7pt',
                  borderRadius: '3pt',
                  border: `0.75pt solid ${c.rule}`,
                  letterSpacing: '0',
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
