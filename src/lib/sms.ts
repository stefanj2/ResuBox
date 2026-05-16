/**
 * SMS reminders — locale-aware short payment nudges.
 *
 * Provider: Bird.com (the rebrand of MessageBird). The legacy REST endpoint
 * at `rest.messagebird.com` still serves bird.com customers and is what we
 * use here — same as globalopzegging / Quitivo.
 *
 * Required env vars to enable real sending:
 *   BIRD_API_KEY        — your Bird.com access key
 *   BIRD_ORIGINATOR     — sender name shown to recipient (default 'ResuBox')
 *
 * Without `BIRD_API_KEY` the lib falls back to `console.log` so dev / staging
 * still flow through without provider credentials.
 */

import 'server-only';
import type { Locale } from '@/i18n/routing';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.resubox.com';
const BIRD_API_KEY = process.env.BIRD_API_KEY ?? process.env.MESSAGEBIRD_API_KEY;
const BIRD_ORIGINATOR = process.env.BIRD_ORIGINATOR ?? process.env.MESSAGEBIRD_ORIGINATOR ?? 'ResuBox';

// ─── Locale-aware SMS copy ─────────────────────────────────────────────────
// Plain text. SMS = max 160 chars per segment, bird.com splits longer
// messages but each segment costs separately, so we keep these short.

interface SmsTemplate {
  reminder_1: (firstName: string, amount: string, paymentUrl: string) => string;
  reminder_2: (firstName: string, amount: string, paymentUrl: string) => string;
}

const SMS_TEMPLATES: Record<Locale, SmsTemplate> = {
  nl: {
    reminder_1: (n, a, url) =>
      `Hi ${n}, je ResuBox factuur van ${a} staat nog open. Betaal hier: ${url} — voorkom extra kosten. Team ResuBox.`,
    reminder_2: (n, a, url) =>
      `${n}, laatste herinnering ResuBox factuur ${a}. Betaal binnen 14 dagen om incassokosten (€40) te voorkomen: ${url}`,
  },
  en: {
    reminder_1: (n, a, url) =>
      `Hi ${n}, your ResuBox invoice of ${a} is still outstanding. Pay here: ${url} — avoid extra fees. Team ResuBox.`,
    reminder_2: (n, a, url) =>
      `${n}, final reminder ResuBox invoice ${a}. Pay within 14 days to avoid collection fees (£40): ${url}`,
  },
  de: {
    reminder_1: (n, a, url) =>
      `Hallo ${n}, Ihre ResuBox-Rechnung über ${a} ist noch offen. Zahlen Sie hier: ${url} — vermeiden Sie Zusatzkosten. Team ResuBox.`,
    reminder_2: (n, a, url) =>
      `${n}, letzte Mahnung ResuBox-Rechnung ${a}. Zahlen Sie binnen 14 Tagen, um Inkassokosten (40 €) zu vermeiden: ${url}`,
  },
  sv: {
    reminder_1: (n, a, url) =>
      `Hej ${n}, din ResuBox-faktura på ${a} är fortfarande obetald. Betala här: ${url} — undvik extra avgifter. Team ResuBox.`,
    reminder_2: (n, a, url) =>
      `${n}, sista påminnelse ResuBox-faktura ${a}. Betala inom 14 dagar för att undvika inkassoavgifter (180 kr): ${url}`,
  },
  da: {
    reminder_1: (n, a, url) =>
      `Hej ${n}, din ResuBox-faktura på ${a} er stadig ubetalt. Betal her: ${url} — undgå ekstra gebyrer. Team ResuBox.`,
    reminder_2: (n, a, url) =>
      `${n}, sidste påmindelse ResuBox-faktura ${a}. Betal inden 14 dage for at undgå inkassogebyrer (100 kr): ${url}`,
  },
};

// ─── Public API ────────────────────────────────────────────────────────────

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface OrderForSms {
  id: string;
  customer_phone?: string;
  customer_name: string;
  amount: number;
  cv_data?: { meta?: { locale?: string }; personal?: { firstName?: string } };
}

/**
 * Send SMS reminder #1 (T+7d). Friendly nudge.
 */
export async function sendSmsReminder1(order: OrderForSms, paymentUrl: string): Promise<SmsResult> {
  return sendReminder(order, paymentUrl, 'reminder_1');
}

/**
 * Send SMS reminder #2 (T+14d, parallel to WIK email). Final formal nudge.
 */
export async function sendSmsReminder2(order: OrderForSms, paymentUrl: string): Promise<SmsResult> {
  return sendReminder(order, paymentUrl, 'reminder_2');
}

async function sendReminder(
  order: OrderForSms,
  paymentUrl: string,
  kind: 'reminder_1' | 'reminder_2'
): Promise<SmsResult> {
  if (!order.customer_phone) {
    return { success: false, error: 'No phone number on order' };
  }

  const phone = normalizePhone(order.customer_phone);
  if (!phone) {
    return { success: false, error: `Could not normalize phone: ${order.customer_phone}` };
  }

  const locale = (order.cv_data?.meta?.locale ?? 'nl') as Locale;
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0] || '';
  const amount = formatPrice(order.amount, locale);
  const template = SMS_TEMPLATES[locale] ?? SMS_TEMPLATES.nl;
  const body = template[kind](firstName, amount, paymentUrl);

  return sendSmsRequest(phone, body);
}

// ─── Provider-specific send ────────────────────────────────────────────────

async function sendSmsRequest(toPhone: string, body: string): Promise<SmsResult> {
  if (!BIRD_API_KEY) {
    // Dev fallback — log and pretend it worked so the rest of the cron flow
    // can be tested without provider credentials.
    console.log(`[sms:dev] → ${toPhone}: ${body}`);
    return { success: true, messageId: `dev-${Date.now()}` };
  }

  try {
    // Bird.com still serves SMS via the legacy MessageBird REST endpoint —
    // same auth shape, same payload, just under the bird.com brand.
    const res = await fetch('https://rest.messagebird.com/messages', {
      method: 'POST',
      headers: {
        Authorization: `AccessKey ${BIRD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originator: BIRD_ORIGINATOR,
        recipients: [toPhone],
        body,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { success: false, error: `Bird ${res.status}: ${detail.slice(0, 200)}` };
    }

    const json = (await res.json()) as { id?: string };
    return { success: true, messageId: json.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Normalise a phone number to E.164. Falls back to null if the input doesn't
 * look like a valid mobile number. NL inputs like "06 1234 5678" → "+31612345678".
 */
function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('00')) return `+${cleaned.slice(2)}`;
  // NL mobile starts with 06, normalise to +316...
  if (cleaned.startsWith('06') && cleaned.length === 10) return `+31${cleaned.slice(1)}`;
  // UK mobile typically 07..., normalise to +447...
  if (cleaned.startsWith('07') && cleaned.length === 11) return `+44${cleaned.slice(1)}`;
  // DE mobile typically 01..., normalise to +491...
  if (cleaned.startsWith('01') && cleaned.length >= 10 && cleaned.length <= 12) return `+49${cleaned.slice(1)}`;
  // Already looks international without +
  if (/^[1-9]\d{8,14}$/.test(cleaned)) return `+${cleaned}`;
  return null;
}

const CURRENCY_FORMAT: Record<Locale, (a: number) => string> = {
  nl: (a) => `€${a.toFixed(2).replace('.', ',')}`,
  de: (a) => `${a.toFixed(2).replace('.', ',')} €`,
  en: (a) => `£${a.toFixed(2)}`,
  sv: (a) => `${Math.round(a)} kr`,
  da: (a) => `${Math.round(a)} kr`,
};

function formatPrice(amount: number, locale: Locale): string {
  return (CURRENCY_FORMAT[locale] ?? CURRENCY_FORMAT.nl)(amount);
}

// Touch SITE_URL so unused-var lint doesn't trip even though the lib doesn't
// currently link to it directly (callers build the paymentUrl).
void SITE_URL;
