import React from 'react';
import { TemplateProps } from './types';
import { getMergedCVData } from '@/lib/placeholderData';
import { fonts, palette, space, formatPostcode } from './tokens';
import { getTemplateLabels, formatDateRangeLocalized, formatDateOfBirthLocalized } from './labels';

const c = palette.zakelijk;

export function ZakelijkTemplate({ cvData, locale }: TemplateProps) {
  const labels = getTemplateLabels(locale);
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;
  const formatDateRange = (s: string, e: string, current: boolean) =>
    formatDateRangeLocalized(s, e, current, locale);

  const contact: string[] = [];
  if (personal.email) contact.push(personal.email);
  if (personal.phone) contact.push(personal.phone);
  const street = [personal.address, personal.houseNumber].filter(Boolean).join(' ');
  const cityLine = [formatPostcode(personal.postalCode), personal.city].filter(Boolean).join(' ');
  if (street) contact.push(street);
  if (cityLine) contact.push(cityLine);
  else if (!street && personal.city) contact.push(personal.city);
  if (personal.linkedIn) contact.push(personal.linkedIn);
  if (personal.website) contact.push(personal.website);
  if (personal.dateOfBirth) contact.push(`${labels.dateOfBirth}: ${formatDateOfBirthLocalized(personal.dateOfBirth, locale)}`);
  if (personal.nationality) contact.push(`${labels.nationality}: ${personal.nationality}`);

  // Harvard-style section header: small-caps + hairline rule beneath
  const Heading = ({ label }: { label: string }) => (
    <h2
      style={{
        fontFamily: fonts.serif,
        fontSize: '11pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.10em',
        color: c.ink,
        margin: '0 0 6pt 0',
        paddingBottom: '4pt',
        borderBottom: `0.5pt solid ${c.ink}`,
      }}
    >
      {label}
    </h2>
  );

  return (
    <div
      className="a4-preview bg-white shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: space.pagePaddingTight,
        fontFamily: fonts.serif,
        color: c.body,
        backgroundColor: c.page,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* HEADER — centered, classic */}
      <header style={{ textAlign: 'center', marginBottom: '14pt' }}>
        {personal.profilePhoto && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10pt' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={personal.profilePhoto}
              alt=""
              style={{
                width: '24mm',
                height: '24mm',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `0.75pt solid ${c.muted}`,
              }}
            />
          </div>
        )}
        <h1
          style={{
            fontFamily: fonts.serif,
            fontSize: '20pt',
            fontWeight: 700,
            color: c.ink,
            margin: 0,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: isPlaceholder.firstName ? c.placeholder : c.ink }}>{personal.firstName}</span>
          {personal.firstName && personal.lastName ? ' ' : ''}
          <span style={{ color: isPlaceholder.lastName ? c.placeholder : c.ink }}>{personal.lastName}</span>
        </h1>
        {contact.length > 0 && (
          <div style={{ fontFamily: fonts.serif, fontSize: '10pt', color: c.body, marginTop: '6pt', lineHeight: 1.5 }}>
            {contact.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: c.muted, margin: '0 6pt' }}>·</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* PROFIEL */}
      {profile.summary && (
        <section style={{ marginBottom: '14pt' }}>
          <Heading label={labels.profile} />
          <p
            style={{
              fontFamily: fonts.serif,
              fontSize: '10.5pt',
              lineHeight: 1.5,
              margin: '4pt 0 0 0',
              color: isPlaceholder.summary ? c.placeholder : c.body,
              textAlign: 'justify',
            }}
          >
            {profile.summary}
          </p>
        </section>
      )}

      {/* WERKERVARING */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '14pt' }}>
          <Heading label={labels.experience} />
          <div style={{ opacity: isPlaceholder.experience ? 0.5 : 1, paddingTop: '4pt' }}>
            {experience.map((exp, idx) => (
              <article key={exp.id} style={{ marginBottom: idx === experience.length - 1 ? 0 : '10pt' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: fonts.serif, fontSize: '11pt', fontWeight: 700, color: c.ink }}>
                    {exp.company}
                  </span>
                  <span style={{ fontFamily: fonts.serif, fontSize: '10pt', color: c.body, fontVariantNumeric: 'tabular-nums' }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4pt' }}>
                  <span style={{ fontFamily: fonts.serif, fontSize: '10.5pt', fontStyle: 'italic', color: c.body }}>
                    {exp.jobTitle}
                  </span>
                  {exp.location && (
                    <span style={{ fontFamily: fonts.serif, fontSize: '10pt', fontStyle: 'italic', color: c.muted }}>
                      {exp.location}
                    </span>
                  )}
                </div>
                {exp.description && (
                  <p style={{ fontFamily: fonts.serif, fontSize: '10pt', lineHeight: 1.5, color: c.body, margin: '0 0 4pt 0' }}>
                    {exp.description}
                  </p>
                )}
                {exp.tasks.length > 0 && (
                  <ul style={{ margin: '2pt 0 0 0', paddingLeft: '14pt', listStyle: 'none' }}>
                    {exp.tasks.map((task, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: fonts.serif,
                          fontSize: '10pt',
                          lineHeight: 1.5,
                          color: c.body,
                          position: 'relative',
                          marginTop: i === 0 ? 0 : '2pt',
                        }}
                      >
                        <span style={{ position: 'absolute', left: '-12pt' }} aria-hidden>•</span>
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
        <section style={{ marginBottom: '14pt' }}>
          <Heading label={labels.education} />
          <div style={{ opacity: isPlaceholder.education ? 0.5 : 1, paddingTop: '4pt' }}>
            {education.map((edu, idx) => (
              <article key={edu.id} style={{ marginBottom: idx === education.length - 1 ? 0 : '8pt' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: fonts.serif, fontSize: '11pt', fontWeight: 700, color: c.ink }}>
                    {edu.institution}
                  </span>
                  <span style={{ fontFamily: fonts.serif, fontSize: '10pt', color: c.body, fontVariantNumeric: 'tabular-nums' }}>
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: fonts.serif, fontSize: '10.5pt', fontStyle: 'italic', color: c.body }}>
                    {edu.degree}
                  </span>
                  {edu.location && (
                    <span style={{ fontFamily: fonts.serif, fontSize: '10pt', fontStyle: 'italic', color: c.muted }}>
                      {edu.location}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <p style={{ fontFamily: fonts.serif, fontSize: '10pt', lineHeight: 1.5, color: c.body, margin: '4pt 0 0 0' }}>
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
          <p
            style={{
              fontFamily: fonts.serif,
              fontSize: '10pt',
              lineHeight: 1.6,
              color: isPlaceholder.skills ? c.placeholder : c.body,
              margin: '4pt 0 0 0',
              opacity: isPlaceholder.skills ? 0.6 : 1,
            }}
          >
            {skills.map((s) => s.name).join(', ')}
          </p>
        </section>
      )}
    </div>
  );
}
