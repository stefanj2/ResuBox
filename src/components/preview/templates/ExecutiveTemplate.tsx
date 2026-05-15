import React from 'react';
import { TemplateProps } from './types';
import { getMergedCVData } from '@/lib/placeholderData';
import { fonts, palette, space, formatYearRange } from './tokens';
import { getTemplateLabels } from './labels';

const c = palette.executive;

export function ExecutiveTemplate({ cvData, locale }: TemplateProps) {
  const labels = getTemplateLabels(locale);
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;
  const yearRange = (s: string, e: string, current: boolean) =>
    formatYearRange(s, e, current, labels.present);

  const contact: string[] = [];
  if (personal.email) contact.push(personal.email);
  if (personal.phone) contact.push(personal.phone);
  if (personal.city) contact.push(personal.city);
  if (personal.linkedIn) contact.push(personal.linkedIn);

  const Heading = ({ label }: { label: string }) => (
    <h2
      style={{
        fontFamily: fonts.sans,
        fontSize: '9pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.22em',
        color: c.ink,
        margin: 0,
        paddingBottom: '6pt',
        borderBottom: `1pt solid ${c.ink}`,
      }}
    >
      {label}
    </h2>
  );

  const ItemRow = ({
    date,
    title,
    subtitle,
    description,
    bullets,
  }: {
    date: string;
    title: string;
    subtitle?: React.ReactNode;
    description?: string;
    bullets?: string[];
  }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '38mm 1fr', gap: '12pt', alignItems: 'baseline' }}>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: '9pt',
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: c.muted,
          fontVariantNumeric: 'tabular-nums',
          paddingTop: '1pt',
        }}
      >
        {date}
      </div>
      <div>
        <h3 style={{ fontFamily: fonts.sans, fontSize: '11.5pt', fontWeight: 600, color: c.ink, margin: 0, lineHeight: 1.3 }}>
          {title}
        </h3>
        {subtitle && (
          <div style={{ fontFamily: fonts.sans, fontSize: '10pt', color: c.body, marginTop: '2pt' }}>{subtitle}</div>
        )}
        {description && (
          <p style={{ fontFamily: fonts.sans, fontSize: '9.5pt', lineHeight: 1.55, color: c.body, margin: '6pt 0 0 0' }}>
            {description}
          </p>
        )}
        {bullets && bullets.length > 0 && (
          <ul style={{ margin: '6pt 0 0 0', paddingLeft: '14pt', listStyle: 'none' }}>
            {bullets.map((b, i) => (
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
                <span style={{ position: 'absolute', left: '-12pt', color: c.muted }} aria-hidden>—</span>
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
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
      <header style={{ marginBottom: space.sectionGap, borderBottom: `1pt solid ${c.ink}`, paddingBottom: '14pt' }}>
        <h1
          style={{
            fontFamily: fonts.sans,
            fontSize: '26pt',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: c.ink,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: isPlaceholder.firstName ? c.placeholder : c.ink }}>{personal.firstName}</span>
          {personal.firstName && personal.lastName ? ' ' : ''}
          <span style={{ color: isPlaceholder.lastName ? c.placeholder : c.ink, fontWeight: 700 }}>{personal.lastName}</span>
        </h1>
        {contact.length > 0 && (
          <div style={{ fontFamily: fonts.sans, fontSize: '9.5pt', color: c.muted, marginTop: '10pt', letterSpacing: '0.02em' }}>
            {contact.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: c.faint, margin: '0 10pt' }}>|</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {profile.summary && (
        <section style={{ marginBottom: space.sectionGap }}>
          <Heading label={labels.executiveSummary} />
          <p
            style={{
              fontFamily: fonts.serif,
              fontSize: '12pt',
              lineHeight: 1.5,
              color: isPlaceholder.summary ? c.placeholder : c.ink,
              margin: '12pt 0 0 0',
              maxWidth: '155mm',
            }}
          >
            {profile.summary}
          </p>
        </section>
      )}

      {experience.length > 0 && (
        <section style={{ marginBottom: space.sectionGap }}>
          <Heading label={labels.experience} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16pt', marginTop: '14pt', opacity: isPlaceholder.experience ? 0.5 : 1 }}>
            {experience.map((exp) => (
              <ItemRow
                key={exp.id}
                date={yearRange(exp.startDate, exp.endDate, exp.current)}
                title={exp.jobTitle}
                subtitle={
                  <>
                    <span style={{ fontWeight: 600, color: c.ink }}>{exp.company}</span>
                    {exp.location && <span style={{ color: c.muted }}>{' · '}{exp.location}</span>}
                  </>
                }
                description={exp.description}
                bullets={exp.tasks}
              />
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section style={{ marginBottom: space.sectionGap }}>
          <Heading label={labels.education} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12pt', marginTop: '14pt', opacity: isPlaceholder.education ? 0.5 : 1 }}>
            {education.map((edu) => (
              <ItemRow
                key={edu.id}
                date={yearRange(edu.startDate, edu.endDate, edu.current)}
                title={edu.degree}
                subtitle={
                  <>
                    <span style={{ fontWeight: 600, color: c.ink }}>{edu.institution}</span>
                    {edu.location && <span style={{ color: c.muted }}>{' · '}{edu.location}</span>}
                  </>
                }
                description={edu.description}
              />
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <Heading label={labels.coreCompetencies} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '38mm 1fr',
              gap: '12pt',
              marginTop: '14pt',
              opacity: isPlaceholder.skills ? 0.6 : 1,
            }}
          >
            <div />
            <p
              style={{
                fontFamily: fonts.sans,
                fontSize: '9.5pt',
                lineHeight: 1.7,
                color: isPlaceholder.skills ? c.placeholder : c.body,
                margin: 0,
              }}
            >
              {skills.map((s) => s.name).join('  ·  ')}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
