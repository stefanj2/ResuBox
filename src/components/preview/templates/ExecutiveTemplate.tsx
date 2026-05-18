import React from 'react';
import { TemplateProps } from './types';
import { getMergedCVData } from '@/lib/placeholderData';
import { fonts, palette, type, formatYearRange } from './tokens';
import { getTemplateLabels, formatDateRangeLocalized } from './labels';

const c = palette.executive;
const GOLD = '#c9a25a';

export function ExecutiveTemplate({ cvData, colorScheme, locale }: TemplateProps) {
  const labels = getTemplateLabels(locale);
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  // Gold hairline can be tinted by colorScheme.primary, but default to the warm gold.
  const hairline = colorScheme?.primary || GOLD;

  const yearRange = (s: string, e: string, current: boolean) =>
    formatYearRange(s, e, current, labels.present);
  const formatDateRange = (s: string, e: string, current: boolean) =>
    formatDateRangeLocalized(s, e, current, locale);

  // Header sub-line: role from most recent experience + city
  const currentRole =
    experience.find((x) => x.current)?.jobTitle ??
    experience[0]?.jobTitle ??
    '';
  const headlineParts: string[] = [];
  if (currentRole) headlineParts.push(currentRole);
  if (personal.city) headlineParts.push(personal.city);
  const headline = headlineParts.join('  ·  ');

  // Contact rows
  const leftContact: string[] = [];
  if (personal.email) leftContact.push(personal.email);
  if (personal.phone) leftContact.push(personal.phone);

  const rightContact: string[] = [];
  if (personal.linkedIn) rightContact.push(personal.linkedIn);
  if (personal.website) rightContact.push(personal.website);
  if (personal.city && !headlineParts.includes(personal.city)) rightContact.push(personal.city);

  const SectionHeading = ({ label }: { label: string }) => (
    <h2
      style={{
        ...type.sectionLabel,
        color: c.ink,
        margin: '0 0 10pt 0',
      }}
    >
      {label}
    </h2>
  );

  const SidebarHeading = ({ label }: { label: string }) => (
    <h2
      style={{
        fontFamily: fonts.sans,
        fontSize: '8pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.22em',
        color: c.ink,
        margin: '0 0 8pt 0',
        paddingBottom: '4pt',
        borderBottom: `0.5pt solid ${c.rule}`,
      }}
    >
      {label}
    </h2>
  );

  // Pipe separator helper
  const renderPipeRow = (items: string[]) => (
    <span>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'rgba(255,255,255,0.35)', margin: '0 8pt' }}>|</span>}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </span>
  );

  return (
    <div
      className="a4-preview shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: c.page,
        fontFamily: fonts.sans,
        color: c.body,
        WebkitFontSmoothing: 'antialiased',
        position: 'relative',
      }}
    >
      {/* ============== HEADER BAND (top 80mm) ============== */}
      <header
        style={{
          height: '80mm',
          backgroundColor: c.ink,
          padding: '18mm 20mm',
          color: 'white',
          display: 'flex',
          gap: '18pt',
          borderBottom: `1pt solid ${hairline}`,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
        <div>
          <h1
            style={{
              fontFamily: fonts.sans,
              fontSize: '30pt',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'white',
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            <span style={{ color: isPlaceholder.firstName ? '#6b7689' : 'white' }}>
              {personal.firstName}
            </span>
            {personal.firstName && personal.lastName ? ' ' : ''}
            <span style={{ color: isPlaceholder.lastName ? '#6b7689' : 'white', fontWeight: 700 }}>
              {personal.lastName}
            </span>
          </h1>
          {headline && (
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: '10.5pt',
                fontWeight: 400,
                color: '#9ca3af',
                marginTop: '8pt',
                letterSpacing: '0.02em',
              }}
            >
              {headline}
            </div>
          )}
        </div>

        {/* Contact row at the bottom of the header */}
        {(leftContact.length > 0 || rightContact.length > 0) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '12pt',
              fontFamily: fonts.sans,
              fontSize: '9pt',
              color: '#d1d5db',
              letterSpacing: '0.02em',
            }}
          >
            <div>{leftContact.length > 0 && renderPipeRow(leftContact)}</div>
            <div style={{ textAlign: 'right' }}>
              {rightContact.length > 0 && renderPipeRow(rightContact)}
            </div>
          </div>
        )}
        </div>
        {personal.profilePhoto && (
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={personal.profilePhoto}
              alt=""
              style={{
                width: '34mm',
                height: '34mm',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2pt solid rgba(255,255,255,0.85)',
              }}
            />
          </div>
        )}
      </header>

      {/* ============== BODY (two columns) ============== */}
      <div
        style={{
          padding: '22pt 20mm 18mm 20mm',
          display: 'grid',
          gridTemplateColumns: '1fr 60mm',
          gap: '16mm',
        }}
      >
        {/* LEFT COLUMN — main content */}
        <main>
          {profile.summary && (
            <section style={{ marginBottom: '20pt' }}>
              <SectionHeading label={labels.executiveSummary || labels.profile} />
              <p
                style={{
                  fontFamily: fonts.serif,
                  fontSize: '11pt',
                  lineHeight: 1.55,
                  color: isPlaceholder.summary ? c.placeholder : c.body,
                  margin: 0,
                }}
              >
                {profile.summary}
              </p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <SectionHeading label={labels.experience} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16pt',
                  opacity: isPlaceholder.experience ? 0.55 : 1,
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
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: '12pt',
                          fontWeight: 700,
                          color: c.ink,
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {exp.jobTitle}
                      </h3>
                      <span
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: '9pt',
                          fontWeight: 500,
                          color: c.muted,
                          whiteSpace: 'nowrap',
                          fontVariantNumeric: 'tabular-nums',
                          letterSpacing: '0.04em',
                          textAlign: 'right',
                        }}
                      >
                        {exp.location && (
                          <span style={{ color: c.faint }}>
                            {exp.location}
                            <span style={{ margin: '0 6pt' }}>·</span>
                          </span>
                        )}
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: fonts.serif,
                        fontSize: '11pt',
                        fontStyle: 'italic',
                        color: c.body,
                        marginTop: '3pt',
                      }}
                    >
                      {exp.company}
                    </div>
                    {exp.description && (
                      <p
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: '9.5pt',
                          lineHeight: 1.55,
                          color: c.body,
                          margin: '7pt 0 0 0',
                        }}
                      >
                        {exp.description}
                      </p>
                    )}
                    {exp.tasks && exp.tasks.length > 0 && (
                      <ul
                        style={{
                          margin: '6pt 0 0 0',
                          paddingLeft: '14pt',
                          listStyle: 'none',
                        }}
                      >
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
                            <span
                              style={{
                                position: 'absolute',
                                left: '-12pt',
                                color: c.muted,
                              }}
                              aria-hidden
                            >
                              —
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
        </main>

        {/* RIGHT COLUMN — sidebar */}
        <aside>
          {skills.length > 0 && (
            <section style={{ marginBottom: '18pt' }}>
              <SidebarHeading label={labels.coreCompetencies} />
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  opacity: isPlaceholder.skills ? 0.6 : 1,
                }}
              >
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: '9.5pt',
                      lineHeight: 1.7,
                      color: isPlaceholder.skills ? c.placeholder : c.body,
                      position: 'relative',
                      paddingLeft: '10pt',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        color: c.muted,
                      }}
                      aria-hidden
                    >
                      ·
                    </span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {education.length > 0 && (
            <section style={{ marginBottom: '18pt' }}>
              <SidebarHeading label={labels.education} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10pt',
                  opacity: isPlaceholder.education ? 0.55 : 1,
                }}
              >
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div
                      style={{
                        fontFamily: fonts.sans,
                        fontSize: '10pt',
                        fontWeight: 600,
                        color: c.ink,
                        lineHeight: 1.3,
                      }}
                    >
                      {edu.degree}
                    </div>
                    <div
                      style={{
                        fontFamily: fonts.serif,
                        fontSize: '10pt',
                        fontStyle: 'italic',
                        color: c.body,
                        marginTop: '2pt',
                      }}
                    >
                      {edu.institution}
                    </div>
                    <div
                      style={{
                        fontFamily: fonts.sans,
                        fontSize: '8.5pt',
                        color: c.muted,
                        marginTop: '2pt',
                        letterSpacing: '0.04em',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {yearRange(edu.startDate, edu.endDate, edu.current)}
                      {edu.location && (
                        <>
                          <span style={{ color: c.faint, margin: '0 5pt' }}>·</span>
                          {edu.location}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
