'use client';

import React from 'react';
import { TemplateProps } from './types';
import { getColorScheme } from '@/lib/colorSchemes';
import { getMergedCVData } from '@/lib/placeholderData';
import { type, colors, space, formatDateRange } from './tokens';

const PLACEHOLDER_STYLE: React.CSSProperties = { color: colors.placeholder };

export function ModernTemplate({ cvData, colorScheme }: TemplateProps) {
  const accent = (colorScheme || getColorScheme('emerald')).primary;
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  // Build a compact, comma-separated contact line — recruiters scan this in 1s.
  const contactItems: string[] = [];
  if (personal.email) contactItems.push(personal.email);
  if (personal.phone) contactItems.push(personal.phone);
  const addressParts = [personal.address, personal.houseNumber].filter(Boolean).join(' ');
  const cityPart = [personal.postalCode, personal.city].filter(Boolean).join(' ');
  if (addressParts || cityPart) contactItems.push([addressParts, cityPart].filter(Boolean).join(', '));
  if (personal.linkedIn) contactItems.push(personal.linkedIn);
  if (personal.website) contactItems.push(personal.website);

  const renderSectionLabel = (label: string) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10pt',
        marginBottom: space.labelToContent,
      }}
    >
      <span style={{ ...type.sectionLabel, color: accent }}>{label}</span>
      <span style={{ flex: 1, height: '1px', backgroundColor: colors.rule }} />
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
        color: colors.body,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* HEADER */}
      <header style={{ marginBottom: space.sectionGap }}>
        <h1
          style={{
            ...type.display,
            color: colors.ink,
            margin: 0,
          }}
        >
          <span style={isPlaceholder.firstName ? PLACEHOLDER_STYLE : undefined}>
            {personal.firstName}
          </span>
          {personal.firstName && personal.lastName ? ' ' : ''}
          <span style={isPlaceholder.lastName ? PLACEHOLDER_STYLE : undefined}>
            {personal.lastName}
          </span>
        </h1>

        {/* Accent rule under name — sole place color is used boldly */}
        <div
          style={{
            width: '40pt',
            height: '2pt',
            backgroundColor: accent,
            marginTop: '10pt',
            marginBottom: '14pt',
          }}
        />

        {/* Contact: one line, separated by middots */}
        {contactItems.length > 0 && (
          <div style={{ ...type.meta, color: colors.muted, lineHeight: 1.6 }}>
            {contactItems.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span style={{ color: colors.faint, margin: '0 8pt' }}>·</span>
                )}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* PROFIEL */}
      {profile.summary && (
        <section style={{ marginBottom: space.sectionGap }}>
          {renderSectionLabel('Profiel')}
          <p
            style={{
              ...type.body,
              color: isPlaceholder.summary ? colors.placeholder : colors.body,
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
          {renderSectionLabel('Werkervaring')}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: space.itemGap,
              opacity: isPlaceholder.experience ? 0.5 : 1,
            }}
          >
            {experience.map((exp) => (
              <article key={exp.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '12pt',
                    marginBottom: space.itemInner,
                  }}
                >
                  <h3 style={{ ...type.itemTitle, color: colors.ink, margin: 0 }}>
                    {exp.jobTitle}
                  </h3>
                  <span style={{ ...type.date, color: colors.muted, whiteSpace: 'nowrap' }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <div
                  style={{
                    ...type.itemSubtitle,
                    color: colors.muted,
                    marginBottom: exp.description || exp.tasks.length > 0 ? '6pt' : 0,
                  }}
                >
                  {exp.company}
                  {exp.location && (
                    <span style={{ color: colors.faint }}> · {exp.location}</span>
                  )}
                </div>

                {exp.description && (
                  <p
                    style={{
                      ...type.body,
                      color: colors.body,
                      margin: 0,
                      marginBottom: exp.tasks.length > 0 ? '6pt' : 0,
                    }}
                  >
                    {exp.description}
                  </p>
                )}

                {exp.tasks.length > 0 && (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '14pt',
                      listStyle: 'none',
                    }}
                  >
                    {exp.tasks.map((task, i) => (
                      <li
                        key={i}
                        style={{
                          ...type.body,
                          color: colors.body,
                          position: 'relative',
                          marginTop: i === 0 ? 0 : '3pt',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: '-12pt',
                            color: colors.muted,
                          }}
                          aria-hidden
                        >
                          •
                        </span>
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
          {renderSectionLabel('Opleiding')}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: space.itemGap,
              opacity: isPlaceholder.education ? 0.5 : 1,
            }}
          >
            {education.map((edu) => (
              <article key={edu.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '12pt',
                    marginBottom: space.itemInner,
                  }}
                >
                  <h3 style={{ ...type.itemTitle, color: colors.ink, margin: 0 }}>
                    {edu.degree}
                  </h3>
                  <span style={{ ...type.date, color: colors.muted, whiteSpace: 'nowrap' }}>
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <div style={{ ...type.itemSubtitle, color: colors.muted }}>
                  {edu.institution}
                  {edu.location && (
                    <span style={{ color: colors.faint }}> · {edu.location}</span>
                  )}
                </div>
                {edu.description && (
                  <p
                    style={{
                      ...type.body,
                      color: colors.body,
                      margin: '6pt 0 0 0',
                    }}
                  >
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
          {renderSectionLabel('Vaardigheden')}
          <div
            style={{
              ...type.body,
              color: isPlaceholder.skills ? colors.placeholder : colors.body,
              opacity: isPlaceholder.skills ? 0.6 : 1,
            }}
          >
            {skills.map((skill, i) => (
              <React.Fragment key={skill.id}>
                {i > 0 && <span style={{ color: colors.faint, margin: '0 6pt' }}>·</span>}
                <span>{skill.name}</span>
              </React.Fragment>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
