import React from 'react';
import { TemplateProps } from './types';
import { getColorScheme } from '@/lib/colorSchemes';
import { getMergedCVData } from '@/lib/placeholderData';
import { fonts, palette, formatPostcode } from './tokens';
import { getTemplateLabels, formatDateRangeLocalized, formatDateOfBirthLocalized } from './labels';
import type { SkillLevel } from '@/types/cv';

const c = palette.default;

const SIDEBAR_BG = '#0f172a';     // slate-900
const SIDEBAR_TEXT = '#e2e8f0';   // slate-200
const SIDEBAR_MUTED = '#94a3b8';  // slate-400
const SIDEBAR_FAINT = '#64748b';  // slate-500
const BAR_EMPTY = '#334155';      // slate-700

const SKILL_LEVEL_TO_BARS: Record<SkillLevel, number> = {
  beginner: 1,
  gemiddeld: 2,
  gevorderd: 3,
  expert: 4,
};

export function TechTemplate({ cvData, colorScheme, locale }: TemplateProps) {
  const labels = getTemplateLabels(locale);
  const accent = (colorScheme || getColorScheme('teal')).primary;
  const { data, isPlaceholder } = getMergedCVData(cvData);
  const { personal, profile, experience, education, skills } = data;

  const formatDateRange = (s: string, e: string, current: boolean) =>
    formatDateRangeLocalized(s, e, current, locale);

  // Derive headline from most recent experience (mirrors Executive)
  const currentRole =
    experience.find((x) => x.current)?.jobTitle ??
    experience[0]?.jobTitle ??
    '';

  // Build sidebar contact list (preserve order)
  const sidebarContact: string[] = [];
  if (personal.email) sidebarContact.push(personal.email);
  if (personal.phone) sidebarContact.push(personal.phone);
  if (personal.linkedIn) sidebarContact.push(personal.linkedIn);
  if (personal.website) sidebarContact.push(personal.website);
  const street = [personal.address, personal.houseNumber].filter(Boolean).join(' ');
  const cityLine = [formatPostcode(personal.postalCode), personal.city].filter(Boolean).join(' ');
  if (street) sidebarContact.push(street);
  if (cityLine) sidebarContact.push(cityLine);
  else if (personal.city) sidebarContact.push(personal.city);
  if (personal.dateOfBirth) sidebarContact.push(`${labels.dateOfBirth}: ${formatDateOfBirthLocalized(personal.dateOfBirth, locale)}`);
  if (personal.nationality) sidebarContact.push(`${labels.nationality}: ${personal.nationality}`);

  // === Sidebar section heading: "// label" comment-style ===
  const SidebarHeading = ({ label }: { label: string }) => (
    <h2
      style={{
        fontFamily: fonts.mono,
        fontSize: '9pt',
        fontWeight: 500,
        textTransform: 'lowercase',
        color: accent,
        margin: '0 0 8pt 0',
        letterSpacing: '0',
      }}
    >
      // {label}
    </h2>
  );

  // === Main heading: "## label" with mono prefix ===
  const MainHeading = ({ label }: { label: string }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '8pt',
        marginBottom: '10pt',
        borderBottom: `1pt solid ${c.rule}`,
        paddingBottom: '4pt',
      }}
    >
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: '10pt',
          fontWeight: 500,
          color: accent,
          letterSpacing: '0',
        }}
        aria-hidden
      >
        ##
      </span>
      <h2
        style={{
          fontFamily: fonts.sans,
          fontSize: '11pt',
          fontWeight: 600,
          textTransform: 'lowercase',
          letterSpacing: '0.01em',
          color: c.ink,
          margin: 0,
        }}
      >
        {label}
      </h2>
    </div>
  );

  // === Skill progress bar (5 segments) ===
  const SkillBar = ({ level }: { level: SkillLevel }) => {
    const filled = SKILL_LEVEL_TO_BARS[level] ?? 2;
    return (
      <span
        style={{
          display: 'inline-flex',
          gap: '2pt',
          width: '60pt',
          flexShrink: 0,
        }}
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: '5pt',
              backgroundColor: i < filled ? accent : BAR_EMPTY,
              borderRadius: '1pt',
            }}
          />
        ))}
      </span>
    );
  };

  return (
    <div
      className="a4-preview shadow-2xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: 'white',
        display: 'flex',
        fontFamily: fonts.sans,
        color: c.body,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* ============== LEFT SIDEBAR (80mm) ============== */}
      <aside
        style={{
          width: '80mm',
          minHeight: '297mm',
          backgroundColor: SIDEBAR_BG,
          color: SIDEBAR_TEXT,
          padding: '18mm 12mm',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        {personal.profilePhoto && (
          <div style={{ marginBottom: '14pt' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={personal.profilePhoto}
              alt=""
              style={{
                width: '36mm',
                height: '36mm',
                borderRadius: '2pt',
                objectFit: 'cover',
                border: `1pt solid ${accent}`,
                display: 'block',
              }}
            />
          </div>
        )}
        {/* Name as terminal prompt */}
        <div style={{ marginBottom: '16pt' }}>
          <h1
            style={{
              fontFamily: fonts.mono,
              fontSize: '14pt',
              fontWeight: 500,
              color: 'white',
              margin: 0,
              lineHeight: 1.25,
              letterSpacing: '0',
            }}
          >
            <span style={{ color: accent, marginRight: '6pt' }} aria-hidden>
              &gt;
            </span>
            <span style={{ color: isPlaceholder.firstName ? SIDEBAR_FAINT : 'white' }}>
              {personal.firstName}
            </span>
            {personal.firstName && personal.lastName ? ' ' : ''}
            <span style={{ color: isPlaceholder.lastName ? SIDEBAR_FAINT : 'white' }}>
              {personal.lastName}
            </span>
          </h1>
          {currentRole && (
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: '9pt',
                color: SIDEBAR_MUTED,
                marginTop: '5pt',
                letterSpacing: '0',
                lineHeight: 1.4,
              }}
            >
              {currentRole}
            </div>
          )}
        </div>

        {/* Contact */}
        {sidebarContact.length > 0 && (
          <section style={{ marginBottom: '18pt' }}>
            <SidebarHeading label="contact" />
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '3pt',
              }}
            >
              {sidebarContact.map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: '8.5pt',
                    color: SIDEBAR_TEXT,
                    letterSpacing: '0',
                    lineHeight: 1.4,
                    wordBreak: 'break-all',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Stack (skills with progress bars) */}
        {skills.length > 0 && (
          <section style={{ marginBottom: '18pt', opacity: isPlaceholder.skills ? 0.65 : 1 }}>
            <SidebarHeading label="stack" />
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '6pt',
              }}
            >
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8pt',
                  }}
                >
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: '8.5pt',
                      color: SIDEBAR_TEXT,
                      letterSpacing: '0',
                      lineHeight: 1.3,
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {skill.name}
                  </span>
                  <SkillBar level={skill.level} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Education (compact) */}
        {education.length > 0 && (
          <section style={{ opacity: isPlaceholder.education ? 0.65 : 1 }}>
            <SidebarHeading label={labels.education.toLowerCase()} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8pt',
              }}
            >
              {education.map((edu) => (
                <div key={edu.id}>
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: '8.5pt',
                      color: 'white',
                      fontWeight: 500,
                      lineHeight: 1.35,
                      letterSpacing: '0',
                    }}
                  >
                    {edu.degree}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: '8pt',
                      color: SIDEBAR_MUTED,
                      marginTop: '1pt',
                      lineHeight: 1.35,
                      letterSpacing: '0',
                    }}
                  >
                    {edu.institution}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: '7.5pt',
                      color: SIDEBAR_FAINT,
                      marginTop: '1pt',
                      letterSpacing: '0',
                    }}
                  >
                    {formatDateRange(edu.startDate, edu.endDate, edu.current).toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* ============== MAIN CONTENT (right) ============== */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: '18mm 16mm',
          backgroundColor: 'white',
          boxSizing: 'border-box',
        }}
      >
        {/* Profile / about */}
        {profile.summary && (
          <section style={{ marginBottom: '22pt' }}>
            <MainHeading label={labels.profile.toLowerCase()} />
            <p
              style={{
                fontFamily: fonts.sans,
                fontSize: '10pt',
                lineHeight: 1.6,
                color: isPlaceholder.summary ? c.placeholder : c.body,
                margin: 0,
              }}
            >
              {profile.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: '22pt' }}>
            <MainHeading label={labels.experience.toLowerCase()} />
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
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: '11pt',
                          fontWeight: 700,
                          color: c.ink,
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {exp.jobTitle}
                      </h3>
                      <div
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: '9.5pt',
                          color: c.body,
                          marginTop: '2pt',
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{exp.company}</span>
                        {exp.location && (
                          <span style={{ color: c.muted }}>
                            {' · '}
                            {exp.location}
                          </span>
                        )}
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
                        textTransform: 'lowercase',
                      }}
                    >
                      {formatDateRange(exp.startDate, exp.endDate, exp.current).toLowerCase()}
                    </span>
                  </div>
                  {exp.description && (
                    <p
                      style={{
                        fontFamily: fonts.sans,
                        fontSize: '9.5pt',
                        lineHeight: 1.55,
                        color: c.body,
                        margin: '6pt 0 0 0',
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                  {exp.tasks && exp.tasks.length > 0 && (
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
                          <span
                            style={{
                              position: 'absolute',
                              left: '-12pt',
                              color: accent,
                              fontFamily: fonts.mono,
                            }}
                            aria-hidden
                          >
                            ▸
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
