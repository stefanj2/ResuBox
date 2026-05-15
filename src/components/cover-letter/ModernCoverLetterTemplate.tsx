import React from 'react';
import { CoverLetterData } from '@/types/cover-letter';
import { ColorScheme } from '@/types/cv';
import { getColorScheme } from '@/lib/colorSchemes';
import { fonts, palette, space } from '@/components/preview/templates/tokens';

const c = palette.default;

interface Props {
  data: CoverLetterData;
  colorScheme?: ColorScheme;
}

function formatDate(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function defaultGreeting(recipient: CoverLetterData['recipient']): string {
  if (recipient.contactName) return `Geachte ${recipient.contactName},`;
  if (recipient.company) return `Geachte heer/mevrouw,`;
  return 'Geachte heer/mevrouw,';
}

export function ModernCoverLetterTemplate({ data, colorScheme }: Props) {
  const accent = (colorScheme || getColorScheme(data.meta.selectedColorScheme)).primary;
  const { sender, recipient } = data;
  const fullName = [sender.firstName, sender.lastName].filter(Boolean).join(' ') || 'Voor- en achternaam';
  const greeting = data.greeting || defaultGreeting(recipient);
  const subject = data.vacancyTitle
    ? `Sollicitatie ${data.vacancyTitle}${data.vacancyReference ? ` — ref. ${data.vacancyReference}` : ''}`
    : 'Sollicitatiebrief';

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
        fontSize: '10.5pt',
        lineHeight: 1.55,
        WebkitFontSmoothing: 'antialiased',
        whiteSpace: 'pre-wrap',
      }}
    >
      {/* Header — sender block top-right */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20pt' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: fonts.serif, fontSize: '24pt', fontWeight: 500, color: c.ink, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            {fullName}
          </h1>
          <div style={{ width: '32pt', height: '2pt', backgroundColor: accent, marginTop: '8pt' }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '9pt', color: c.muted, lineHeight: 1.5 }}>
          {sender.email && <div>{sender.email}</div>}
          {sender.phone && <div>{sender.phone}</div>}
          {(sender.address || sender.city) && (
            <div>
              {sender.address}
              {sender.postalCode && `, ${sender.postalCode}`}
              {sender.city && ` ${sender.city}`}
            </div>
          )}
        </div>
      </header>

      {/* Recipient block */}
      {(recipient.company || recipient.contactName) && (
        <div style={{ marginBottom: '20pt', fontSize: '10pt' }}>
          {recipient.contactName && <div style={{ color: c.ink }}>{recipient.contactName}</div>}
          {recipient.contactTitle && <div style={{ color: c.muted }}>{recipient.contactTitle}</div>}
          {recipient.company && <div style={{ color: c.ink, fontWeight: 500 }}>{recipient.company}</div>}
          {recipient.city && <div style={{ color: c.muted }}>{recipient.city}</div>}
        </div>
      )}

      {/* Place + date */}
      <div style={{ marginBottom: '18pt', fontSize: '10pt', color: c.muted }}>
        {data.letterCity && `${data.letterCity}, `}
        {formatDate(data.date)}
      </div>

      {/* Subject line */}
      <div style={{ marginBottom: '16pt', fontSize: '10.5pt', fontWeight: 600, color: c.ink }}>
        Betreft: {subject}
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '14pt' }}>{greeting}</div>

      {/* Body */}
      {data.opening && <p style={{ margin: '0 0 12pt 0' }}>{data.opening}</p>}
      {data.body && <p style={{ margin: '0 0 12pt 0' }}>{data.body}</p>}
      {data.closing && <p style={{ margin: '0 0 18pt 0' }}>{data.closing}</p>}

      {/* Signature */}
      <div style={{ marginTop: '12pt' }}>
        <div>{data.signature || 'Met vriendelijke groet,'}</div>
        <div style={{ marginTop: '32pt', fontWeight: 500, color: c.ink }}>{fullName}</div>
      </div>
    </div>
  );
}
