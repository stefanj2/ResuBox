import React from 'react';
import { TemplateProps } from './types';
import { getMergedCVData } from '@/lib/placeholderData';
import { fonts, palette, space, formatDateRange } from './tokens';

// Minimalist uses absolutely no accent color — typography is the only voice.
const c = palette.default;

export function MinimalistTemplate({ cvData }: TemplateProps) {
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  const contact: string[] = [];
  if (personal.email) contact.push(personal.email);
  if (personal.phone) contact.push(personal.phone);
  if (personal.city) contact.push(personal.city);
  if (personal.linkedIn) contact.push(personal.linkedIn);
  if (personal.website) contact.push(personal.website);

  const Heading = ({ label }: { label: string }) => (
    <h2
      style={{
        fontFamily: fonts.sans,
        fontSize: '8.5pt',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.24em',
        color: c.ink,
        margin: '0 0 14pt 0',
      }}
    >
      {label}
    </h2>
  );

  const Item = ({
    title,
    subtitle,
    date,
    description,
    bullets,
  }: {
    title: string;
    subtitle?: React.ReactNode;
    date: string;
    description?: string;
    bullets?: string[];
  }) => (
    <article>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12pt' }}>
        <h3 style={{ fontFamily: fonts.sans, fontSize: '11pt', fontWeight: 600, color: c.ink, margin: 0, lineHeight: 1.3 }}>
          {title}
        </h3>
        <span style={{ fontFamily: fonts.sans, fontSize: '9pt', color: c.muted, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {date}
        </span>
      </div>
      {subtitle && (
        <div style={{ fontFamily: fonts.sans, fontSize: '10pt', color: c.muted, marginTop: '2pt' }}>{subtitle}</div>
      )}
      {description && (
        <p style={{ fontFamily: fonts.sans, fontSize: '9.5pt', lineHeight: 1.55, color: c.body, margin: '6pt 0 0 0' }}>
          {description}
        </p>
      )}
      {bullets && bullets.length > 0 && (
        <ul style={{ margin: '4pt 0 0 0', paddingLeft: '14pt', listStyle: 'none' }}>
          {bullets.map((b, i) => (
            <li
              key={i}
              style={{
                fontFamily: fonts.sans,
                fontSize: '9.5pt',
                lineHeight: 1.55,
                color: c.body,
                position: 'relative',
                marginTop: i === 0 ? 0 : '2pt',
              }}
            >
              <span style={{ position: 'absolute', left: '-12pt', color: c.muted }} aria-hidden>·</span>
              {b}
            </li>
          ))}
        </ul>
      )}
    </article>
  );

  return (
    <div
      className="a4-preview bg-white shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: space.pagePaddingWide,
        fontFamily: fonts.sans,
        color: c.body,
        backgroundColor: c.page,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <header style={{ marginBottom: '32pt' }}>
        <h1
          style={{
            fontFamily: fonts.sans,
            fontSize: '22pt',
            fontWeight: 600,
            letterSpacing: '-0.015em',
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
          <div style={{ fontFamily: fonts.sans, fontSize: '9.5pt', color: c.muted, marginTop: '8pt', lineHeight: 1.6 }}>
            {contact.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: c.faint, margin: '0 8pt' }}>·</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {profile.summary && (
        <section style={{ marginBottom: '28pt' }}>
          <Heading label="Profiel" />
          <p
            style={{
              fontFamily: fonts.sans,
              fontSize: '10.5pt',
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

      {experience.length > 0 && (
        <section style={{ marginBottom: '28pt' }}>
          <Heading label="Werkervaring" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16pt', opacity: isPlaceholder.experience ? 0.5 : 1 }}>
            {experience.map((exp) => (
              <Item
                key={exp.id}
                title={exp.jobTitle}
                subtitle={
                  <>
                    <span style={{ color: c.body }}>{exp.company}</span>
                    {exp.location && <span style={{ color: c.faint }}>{' · '}{exp.location}</span>}
                  </>
                }
                date={formatDateRange(exp.startDate, exp.endDate, exp.current)}
                description={exp.description}
                bullets={exp.tasks}
              />
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section style={{ marginBottom: '28pt' }}>
          <Heading label="Opleiding" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12pt', opacity: isPlaceholder.education ? 0.5 : 1 }}>
            {education.map((edu) => (
              <Item
                key={edu.id}
                title={edu.degree}
                subtitle={
                  <>
                    <span style={{ color: c.body }}>{edu.institution}</span>
                    {edu.location && <span style={{ color: c.faint }}>{' · '}{edu.location}</span>}
                  </>
                }
                date={formatDateRange(edu.startDate, edu.endDate, edu.current)}
                description={edu.description}
              />
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <Heading label="Vaardigheden" />
          <p
            style={{
              fontFamily: fonts.sans,
              fontSize: '10pt',
              lineHeight: 1.7,
              color: isPlaceholder.skills ? c.placeholder : c.body,
              margin: 0,
              opacity: isPlaceholder.skills ? 0.6 : 1,
            }}
          >
            {skills.map((s) => s.name).join('  ·  ')}
          </p>
        </section>
      )}
    </div>
  );
}
