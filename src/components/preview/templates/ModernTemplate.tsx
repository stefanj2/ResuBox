import React from 'react';
import { TemplateProps } from './types';
import { getColorScheme } from '@/lib/colorSchemes';
import { getMergedCVData } from '@/lib/placeholderData';
import { fonts, palette, type, formatYearRange } from './tokens';
import { getTemplateLabels, formatDateRangeLocalized } from './labels';

const c = palette.default;
const placeholder: React.CSSProperties = { color: c.placeholder };

/**
 * Modern — coloured sidebar layout (Linear / Stripe vibes).
 * 35% accent-coloured rail on the left holds photo, contact, skills and
 * compact education. The right 65% column is white with profile + full
 * work experience. ATS-safe: section headings are plain text, reading
 * order Personal → Profile → Experience → Education → Skills is preserved
 * by source order (sidebar items render first but the textual flow still
 * leads with the name in the main column).
 */
export function ModernTemplate({ cvData, colorScheme, locale }: TemplateProps) {
  const scheme = colorScheme || getColorScheme('emerald');
  const accent = scheme.primary;
  const accentDark = scheme.primaryDark;
  const labels = getTemplateLabels(locale);
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;
  const formatDateRange = (s: string, e: string, current: boolean) =>
    formatDateRangeLocalized(s, e, current, locale);

  const initials = `${(personal.firstName || '').charAt(0)}${(personal.lastName || '').charAt(0)}`.toUpperCase();

  const street = [personal.address, personal.houseNumber].filter(Boolean).join(' ');
  const cityLine = [personal.postalCode, personal.city].filter(Boolean).join(' ');
  const fullAddress = [street, cityLine].filter(Boolean).join(', ');

  const contactItems: Array<{ label: string; value: string; placeholder?: boolean }> = [];
  if (personal.email) contactItems.push({ label: 'E', value: personal.email, placeholder: isPlaceholder.email });
  if (personal.phone) contactItems.push({ label: 'T', value: personal.phone, placeholder: isPlaceholder.phone });
  if (fullAddress) contactItems.push({ label: 'A', value: fullAddress, placeholder: isPlaceholder.address || isPlaceholder.city });
  if (personal.linkedIn) contactItems.push({ label: 'L', value: personal.linkedIn, placeholder: isPlaceholder.linkedIn });
  if (personal.website) contactItems.push({ label: 'W', value: personal.website, placeholder: isPlaceholder.website });

  const currentRole = experience.find((e) => e.current) || experience[0];

  // Sidebar label — white on accent
  const SideLabel = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        fontFamily: fonts.sans,
        fontSize: '8.5pt',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.22em',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: '10pt',
        paddingBottom: '6pt',
        borderBottom: '1pt solid rgba(255,255,255,0.25)',
      }}
    >
      {children}
    </div>
  );

  // Main column label — accent text + hairline
  const MainLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10pt', marginBottom: '12pt' }}>
      <h2
        style={{
          fontFamily: fonts.sans,
          fontSize: '9pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          color: accent,
          margin: 0,
        }}
      >
        {children}
      </h2>
      <span style={{ flex: 1, height: '1px', backgroundColor: c.rule }} />
    </div>
  );

  return (
    <div
      className="a4-preview bg-white shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: c.page,
        display: 'flex',
        fontFamily: fonts.sans,
        color: c.body,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* LEFT SIDEBAR — accent coloured */}
      <aside
        style={{
          width: '73mm',
          flexShrink: 0,
          backgroundColor: accent,
          color: '#ffffff',
          padding: '18mm 14mm',
          display: 'flex',
          flexDirection: 'column',
          gap: '20pt',
        }}
      >
        {/* PHOTO */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {personal.profilePhoto ? (
            <div
              style={{
                width: '90pt',
                height: '90pt',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '2pt solid rgba(255,255,255,0.4)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={personal.profilePhoto}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div
              style={{
                width: '90pt',
                height: '90pt',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.18)',
                border: '1.5pt solid rgba(255,255,255,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.serif,
                fontSize: '28pt',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: '0.02em',
              }}
            >
              {initials || ' '}
            </div>
          )}
        </div>

        {/* CONTACT */}
        {contactItems.length > 0 && (
          <section>
            <SideLabel>{labels.contact}</SideLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6pt' }}>
              {contactItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: '8.5pt',
                    lineHeight: 1.45,
                    color: item.placeholder ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.95)',
                    wordBreak: 'break-word',
                  }}
                >
                  {item.value}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section style={{ opacity: isPlaceholder.skills ? 0.7 : 1 }}>
            <SideLabel>{labels.skills}</SideLabel>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4pt' }}>
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: '9pt',
                    lineHeight: 1.4,
                    color: 'rgba(255,255,255,0.95)',
                    position: 'relative',
                    paddingLeft: '10pt',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      color: 'rgba(255,255,255,0.55)',
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

        {/* EDUCATION (compact in sidebar — max 3) */}
        {education.length > 0 && (
          <section style={{ opacity: isPlaceholder.education ? 0.7 : 1 }}>
            <SideLabel>{labels.education}</SideLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10pt' }}>
              {education.slice(0, 3).map((edu) => (
                <div key={edu.id}>
                  <div
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: '9.5pt',
                      fontWeight: 600,
                      color: '#ffffff',
                      lineHeight: 1.3,
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: '8.5pt',
                      color: 'rgba(255,255,255,0.8)',
                      marginTop: '1pt',
                      lineHeight: 1.35,
                    }}
                  >
                    {edu.institution}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: '8pt',
                      color: 'rgba(255,255,255,0.65)',
                      marginTop: '2pt',
                      letterSpacing: '0.04em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatYearRange(edu.startDate, edu.endDate, edu.current, labels.present)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* RIGHT MAIN COLUMN */}
      <main
        style={{
          flex: 1,
          padding: '18mm 18mm 18mm 14mm',
          minWidth: 0,
          backgroundColor: c.page,
        }}
      >
        {/* HEADER — name + role */}
        <header style={{ marginBottom: '20pt' }}>
          <h1
            style={{
              ...type.displaySans,
              fontSize: '28pt',
              color: c.ink,
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            <span style={isPlaceholder.firstName ? placeholder : undefined}>{personal.firstName}</span>
            {personal.firstName && personal.lastName ? ' ' : ''}
            <span style={isPlaceholder.lastName ? placeholder : undefined}>{personal.lastName}</span>
          </h1>
          {currentRole && currentRole.jobTitle && (
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: '12pt',
                fontWeight: 400,
                color: accentDark,
                marginTop: '4pt',
                letterSpacing: '0.01em',
              }}
            >
              {currentRole.jobTitle}
              {currentRole.company && (
                <span style={{ color: c.muted }}>{` · ${currentRole.company}`}</span>
              )}
            </div>
          )}
          <div
            style={{
              width: '32pt',
              height: '2pt',
              backgroundColor: accent,
              marginTop: '12pt',
            }}
          />
        </header>

        {/* PROFILE */}
        {profile.summary && (
          <section style={{ marginBottom: '20pt' }}>
            <MainLabel>{labels.profile}</MainLabel>
            <p
              style={{
                ...type.lead,
                fontSize: '12pt',
                lineHeight: 1.5,
                color: isPlaceholder.summary ? c.placeholder : c.ink,
                margin: 0,
              }}
            >
              {profile.summary}
            </p>
          </section>
        )}

        {/* WERKERVARING */}
        {experience.length > 0 && (
          <section>
            <MainLabel>{labels.experience}</MainLabel>
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
                        fontFamily: fonts.sans,
                        fontSize: '11.5pt',
                        fontWeight: 600,
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
                        color: accent,
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: '10pt',
                      color: c.muted,
                      marginTop: '2pt',
                      marginBottom: exp.description || exp.tasks.length > 0 ? '6pt' : 0,
                    }}
                  >
                    <span style={{ color: c.body, fontWeight: 500 }}>{exp.company}</span>
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
      </main>
    </div>
  );
}
