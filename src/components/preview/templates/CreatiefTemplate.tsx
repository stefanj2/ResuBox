import React from 'react';
import { TemplateProps } from './types';
import { getColorScheme } from '@/lib/colorSchemes';
import { getMergedCVData } from '@/lib/placeholderData';
import { fonts, palette, formatYearRange, formatPostcode } from './tokens';
import { getTemplateLabels, formatDateRangeLocalized } from './labels';

const c = palette.default;

/**
 * Creatief — editorial magazine layout (NYT magazine / Apricot vibes).
 * Oversized italic serif name banner with accent strip, then an asymmetric
 * 60/40 two-column grid: left content stream (profile, experience,
 * education), right tinted sidecar (skills as pills + at-a-glance contact).
 * Reading order is preserved (Personal → Profile → Experience → Education →
 * Skills) because the main column comes first in source order.
 */
export function CreatiefTemplate({ cvData, colorScheme, locale }: TemplateProps) {
  const scheme = colorScheme || getColorScheme('violet');
  const accent = scheme.primary;
  const accentLight = scheme.primaryLight;
  const labels = getTemplateLabels(locale);
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;
  const formatDateRange = (s: string, e: string, current: boolean) =>
    formatDateRangeLocalized(s, e, current, locale);

  // Build short headline under the name
  const currentRole = experience.find((e) => e.current) || experience[0];
  const headlineParts: string[] = [];
  if (currentRole && currentRole.jobTitle) headlineParts.push(currentRole.jobTitle);
  if (personal.city) headlineParts.push(personal.city);
  const headline = headlineParts.join(' · ');

  // Contact row in banner
  const bannerContact: string[] = [];
  if (personal.email) bannerContact.push(personal.email);
  if (personal.phone) bannerContact.push(personal.phone);
  if (personal.linkedIn) bannerContact.push(personal.linkedIn);
  if (personal.website) bannerContact.push(personal.website);

  // Sidecar contact (compact stacked)
  const sidecarContact: Array<{ value: string; placeholder?: boolean }> = [];
  if (personal.email) sidecarContact.push({ value: personal.email, placeholder: isPlaceholder.email });
  if (personal.phone) sidecarContact.push({ value: personal.phone, placeholder: isPlaceholder.phone });
  const street = [personal.address, personal.houseNumber].filter(Boolean).join(' ');
  const cityLine = [formatPostcode(personal.postalCode), personal.city].filter(Boolean).join(' ');
  if (street) sidecarContact.push({ value: street, placeholder: isPlaceholder.address });
  if (cityLine) sidecarContact.push({ value: cityLine, placeholder: isPlaceholder.city });
  if (personal.linkedIn) sidecarContact.push({ value: personal.linkedIn, placeholder: isPlaceholder.linkedIn });
  if (personal.website) sidecarContact.push({ value: personal.website, placeholder: isPlaceholder.website });

  // Serif uppercase section heading used in main column
  const SerifHeading = ({ children }: { children: React.ReactNode }) => (
    <h2
      style={{
        fontFamily: fonts.serif,
        fontSize: '10pt',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        color: accent,
        margin: '0 0 10pt 0',
      }}
    >
      {children}
    </h2>
  );

  // Sidecar heading (smaller, sits inside tinted panel)
  const SideHeading = ({ children }: { children: React.ReactNode }) => (
    <h3
      style={{
        fontFamily: fonts.serif,
        fontSize: '9.5pt',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        color: c.ink,
        margin: '0 0 8pt 0',
      }}
    >
      {children}
    </h3>
  );

  return (
    <div
      className="a4-preview bg-white shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '16mm 0 16mm 0',
        backgroundColor: c.page,
        fontFamily: fonts.sans,
        color: c.body,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* TOP BANNER */}
      <header
        style={{
          padding: '0 18mm 18pt 18mm',
          borderBottom: `2pt solid ${accent}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14pt' }}>
          <h1
            style={{
              flex: 1,
              fontFamily: fonts.serif,
              fontSize: '40pt',
              fontWeight: 500,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              color: c.ink,
              margin: 0,
              lineHeight: 1.02,
            }}
          >
            <span style={{ color: isPlaceholder.firstName ? c.placeholder : c.ink }}>{personal.firstName}</span>
            {personal.firstName && personal.lastName ? ' ' : ''}
            <span style={{ color: isPlaceholder.lastName ? c.placeholder : c.ink }}>{personal.lastName}</span>
          </h1>
          {personal.profilePhoto && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={personal.profilePhoto}
              alt=""
              style={{
                width: '28mm',
                height: '28mm',
                borderRadius: '4pt',
                objectFit: 'cover',
                flexShrink: 0,
                border: `1.5pt solid ${accent}`,
              }}
            />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginTop: '10pt',
            gap: '14pt',
          }}
        >
          {headline && (
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: '10.5pt',
                fontWeight: 500,
                color: c.body,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {headline}
            </div>
          )}
          {bannerContact.length > 0 && (
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: '9pt',
                color: c.muted,
                textAlign: 'right',
                marginLeft: 'auto',
                lineHeight: 1.5,
              }}
            >
              {bannerContact.map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ color: c.faint, margin: '0 6pt' }}>·</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* TWO-COLUMN GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 70mm',
          gap: '10mm',
          padding: '22pt 18mm 0 18mm',
        }}
      >
        {/* LEFT — MAIN STREAM */}
        <div style={{ minWidth: 0 }}>
          {/* PROFILE */}
          {profile.summary && (
            <section style={{ marginBottom: '22pt' }}>
              <SerifHeading>{labels.profile}</SerifHeading>
              <p
                style={{
                  fontFamily: fonts.serif,
                  fontSize: '14pt',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  lineHeight: 1.45,
                  color: isPlaceholder.summary ? c.placeholder : c.ink,
                  margin: 0,
                  letterSpacing: '-0.005em',
                }}
              >
                {profile.summary}
              </p>
            </section>
          )}

          {/* WERKERVARING */}
          {experience.length > 0 && (
            <section style={{ marginBottom: '22pt' }}>
              <SerifHeading>{labels.experience}</SerifHeading>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14pt',
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
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: fonts.serif,
                          fontSize: '13pt',
                          fontWeight: 600,
                          color: c.ink,
                          margin: 0,
                          lineHeight: 1.3,
                          letterSpacing: '-0.005em',
                        }}
                      >
                        {exp.jobTitle}
                      </h3>
                      <span
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: '9pt',
                          color: accent,
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          fontVariantNumeric: 'tabular-nums',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: fonts.serif,
                        fontSize: '11pt',
                        fontStyle: 'italic',
                        color: c.muted,
                        marginTop: '2pt',
                        marginBottom: exp.description || exp.tasks.length > 0 ? '6pt' : 0,
                      }}
                    >
                      <span style={{ color: c.body }}>{exp.company}</span>
                      {exp.location && <span style={{ color: c.faint }}>{` · ${exp.location}`}</span>}
                    </div>
                    {exp.description && (
                      <p
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: '9.5pt',
                          lineHeight: 1.55,
                          color: c.body,
                          margin: 0,
                          marginBottom: exp.tasks.length > 0 ? '6pt' : 0,
                        }}
                      >
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
                            <span
                              style={{ position: 'absolute', left: '-12pt', color: accent }}
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

          {/* OPLEIDING */}
          {education.length > 0 && (
            <section>
              <SerifHeading>{labels.education}</SerifHeading>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10pt',
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
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: fonts.serif,
                          fontSize: '11.5pt',
                          fontWeight: 600,
                          color: c.ink,
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {edu.degree}
                      </h3>
                      <span
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: '9pt',
                          color: accent,
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          fontVariantNumeric: 'tabular-nums',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: fonts.serif,
                        fontSize: '10.5pt',
                        fontStyle: 'italic',
                        color: c.muted,
                        marginTop: '2pt',
                      }}
                    >
                      <span style={{ color: c.body }}>{edu.institution}</span>
                      {edu.location && <span style={{ color: c.faint }}>{` · ${edu.location}`}</span>}
                    </div>
                    {edu.description && (
                      <p
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: '9.5pt',
                          lineHeight: 1.55,
                          color: c.body,
                          margin: '4pt 0 0 0',
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
        </div>

        {/* RIGHT — TINTED SIDECAR */}
        <aside
          style={{
            backgroundColor: accentLight,
            padding: '14pt 14pt',
            alignSelf: 'start',
            borderTop: `2pt solid ${accent}`,
          }}
        >
          {/* SKILLS as tagged pills */}
          {skills.length > 0 && (
            <section style={{ marginBottom: sidecarContact.length > 0 ? '18pt' : 0 }}>
              <SideHeading>{labels.skills}</SideHeading>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4pt',
                  opacity: isPlaceholder.skills ? 0.6 : 1,
                }}
              >
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: '8.5pt',
                      color: c.ink,
                      padding: '2pt 6pt',
                      border: `1pt solid ${accent}`,
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255,255,255,0.55)',
                      lineHeight: 1.3,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* CONTACT (at-a-glance card) */}
          {sidecarContact.length > 0 && (
            <section>
              <SideHeading>{labels.contact}</SideHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5pt' }}>
                {sidecarContact.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: '8.5pt',
                      lineHeight: 1.4,
                      color: item.placeholder ? c.placeholder : c.body,
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.value}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION quick-glance years (optional extra at-a-glance) */}
          {education.length > 0 && (
            <section style={{ marginTop: '18pt', opacity: isPlaceholder.education ? 0.6 : 1 }}>
              <SideHeading>{labels.education}</SideHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6pt' }}>
                {education.slice(0, 3).map((edu) => (
                  <div key={edu.id}>
                    <div
                      style={{
                        fontFamily: fonts.sans,
                        fontSize: '8.5pt',
                        color: accent,
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {formatYearRange(edu.startDate, edu.endDate, edu.current, labels.present)}
                    </div>
                    <div
                      style={{
                        fontFamily: fonts.serif,
                        fontSize: '9pt',
                        color: c.ink,
                        marginTop: '1pt',
                        lineHeight: 1.3,
                      }}
                    >
                      {edu.degree}
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
