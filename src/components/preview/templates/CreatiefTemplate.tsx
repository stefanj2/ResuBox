import React from 'react';
import { TemplateProps } from './types';
import { getColorScheme } from '@/lib/colorSchemes';
import { getMergedCVData } from '@/lib/placeholderData';
import { fonts, palette, space } from './tokens';
import { getTemplateLabels, formatDateRangeLocalized } from './labels';

const c = palette.default;

export function CreatiefTemplate({ cvData, colorScheme, locale }: TemplateProps) {
  const accent = (colorScheme || getColorScheme('rose')).primary;
  const labels = getTemplateLabels(locale);
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;
  const formatDateRange = (s: string, e: string, current: boolean) =>
    formatDateRangeLocalized(s, e, current, locale);

  const contact: string[] = [];
  if (personal.email) contact.push(personal.email);
  if (personal.phone) contact.push(personal.phone);
  if (personal.city) contact.push(personal.city);
  if (personal.linkedIn) contact.push(personal.linkedIn);
  if (personal.website) contact.push(personal.website);

  const Heading = ({ label }: { label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10pt', marginBottom: '12pt' }}>
      <span style={{ width: '6pt', height: '6pt', borderRadius: '50%', backgroundColor: accent, flexShrink: 0 }} />
      <h2
        style={{
          fontFamily: fonts.sans,
          fontSize: '9pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: c.ink,
          margin: 0,
        }}
      >
        {label}
      </h2>
      <span style={{ flex: 1, height: '1px', backgroundColor: c.rule }} />
    </div>
  );

  const DatePill = ({ children }: { children: React.ReactNode }) => (
    <span
      style={{
        fontFamily: fonts.sans,
        fontSize: '8.5pt',
        fontWeight: 500,
        color: accent,
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
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
      <header style={{ marginBottom: '20pt' }}>
        <div style={{ fontFamily: fonts.sans, fontSize: '8.5pt', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: accent, marginBottom: '6pt' }}>
          {labels.cvHeader}
        </div>
        <h1
          style={{
            fontFamily: fonts.serif,
            fontSize: '36pt',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: c.ink,
            margin: 0,
            lineHeight: 1.02,
          }}
        >
          <span style={{ color: isPlaceholder.firstName ? c.placeholder : c.ink }}>{personal.firstName}</span>
          {personal.firstName && personal.lastName ? <br /> : null}
          <span
            style={{
              color: isPlaceholder.lastName ? c.placeholder : c.ink,
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            {personal.lastName}
          </span>
        </h1>
      </header>

      {/* POSITIONING STATEMENT — Pender-style oversized lead */}
      {profile.summary && (
        <section style={{ marginBottom: space.sectionGap, paddingTop: '8pt', borderTop: `1pt solid ${c.rule}` }}>
          <p
            style={{
              fontFamily: fonts.serif,
              fontSize: '15pt',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.4,
              color: isPlaceholder.summary ? c.placeholder : c.ink,
              margin: '14pt 0 0 0',
              maxWidth: '155mm',
            }}
          >
            {profile.summary}
          </p>
        </section>
      )}

      {/* CONTACT */}
      {contact.length > 0 && (
        <section style={{ marginBottom: space.sectionGap }}>
          <Heading label={labels.contact} />
          <div style={{ fontFamily: fonts.sans, fontSize: '9.5pt', color: c.body, lineHeight: 1.7 }}>
            {contact.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: c.faint, margin: '0 8pt' }}>·</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {/* WERKERVARING */}
      {experience.length > 0 && (
        <section style={{ marginBottom: space.sectionGap }}>
          <Heading label={labels.experience} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.itemGap, opacity: isPlaceholder.experience ? 0.5 : 1 }}>
            {experience.map((exp) => (
              <article key={exp.id}>
                <div style={{ marginBottom: '4pt' }}>
                  <DatePill>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</DatePill>
                </div>
                <h3 style={{ fontFamily: fonts.serif, fontSize: '14pt', fontWeight: 500, color: c.ink, margin: 0, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                  {exp.jobTitle}
                </h3>
                <div style={{ fontFamily: fonts.sans, fontSize: '10pt', color: c.muted, marginTop: '2pt', marginBottom: exp.description || exp.tasks.length > 0 ? '6pt' : 0 }}>
                  <span style={{ color: c.body, fontWeight: 500 }}>{exp.company}</span>
                  {exp.location && <span style={{ color: c.faint }}>{' · '}{exp.location}</span>}
                </div>
                {exp.description && (
                  <p style={{ fontFamily: fonts.sans, fontSize: '9.5pt', lineHeight: 1.55, color: c.body, margin: 0, marginBottom: exp.tasks.length > 0 ? '6pt' : 0 }}>
                    {exp.description}
                  </p>
                )}
                {exp.tasks.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '14pt', listStyle: 'none' }}>
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
                        <span style={{ position: 'absolute', left: '-12pt', color: accent }} aria-hidden>—</span>
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
          <Heading label={labels.education} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.itemGap, opacity: isPlaceholder.education ? 0.5 : 1 }}>
            {education.map((edu) => (
              <article key={edu.id}>
                <div style={{ marginBottom: '4pt' }}>
                  <DatePill>{formatDateRange(edu.startDate, edu.endDate, edu.current)}</DatePill>
                </div>
                <h3 style={{ fontFamily: fonts.serif, fontSize: '13pt', fontWeight: 500, color: c.ink, margin: 0, lineHeight: 1.25 }}>
                  {edu.degree}
                </h3>
                <div style={{ fontFamily: fonts.sans, fontSize: '10pt', color: c.muted, marginTop: '2pt' }}>
                  <span style={{ color: c.body }}>{edu.institution}</span>
                  {edu.location && <span style={{ color: c.faint }}>{' · '}{edu.location}</span>}
                </div>
                {edu.description && (
                  <p style={{ fontFamily: fonts.sans, fontSize: '9.5pt', lineHeight: 1.55, color: c.body, margin: '6pt 0 0 0' }}>
                    {edu.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* VAARDIGHEDEN */}
      {skills.length > 0 && (
        <section>
          <Heading label={labels.skills} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6pt', opacity: isPlaceholder.skills ? 0.6 : 1 }}>
            {skills.map((skill) => (
              <span
                key={skill.id}
                style={{
                  fontFamily: fonts.sans,
                  fontSize: '9pt',
                  color: c.body,
                  padding: '3pt 9pt',
                  border: `0.75pt solid ${c.rule}`,
                  borderRadius: '999px',
                  letterSpacing: '0.01em',
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
