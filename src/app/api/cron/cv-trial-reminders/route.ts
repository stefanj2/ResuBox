import { NextRequest, NextResponse } from 'next/server';
import { and, eq, gte, isNull, lte } from 'drizzle-orm';
import { db } from '@/lib/db';
import { cvSubscriptions, users } from '@/db/schema';
import { sendEmail } from '@/lib/resend';

export const runtime = 'nodejs';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * GET /api/cron/cv-trial-reminders
 *
 * Sends a "your trial ends in 2 days, €39/mo will be charged" reminder to
 * every CV-subscription trialist whose trial_end falls inside the next 24h-48h
 * window. Idempotent: trial_reminder_sent_at is set after the first send so a
 * row never gets reminded twice.
 *
 * Schedule once a day via Vercel Cron — the 24h window absorbs cron drift.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const secretFromQuery = request.nextUrl.searchParams.get('secret');
  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    secretFromQuery === process.env.CRON_SECRET;
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = Date.now();
  const windowStart = new Date(now + 24 * 60 * 60 * 1000).toISOString();
  const windowEnd = new Date(now + 48 * 60 * 60 * 1000).toISOString();

  const rows = await db
    .select({ sub: cvSubscriptions, email: users.email })
    .from(cvSubscriptions)
    .innerJoin(users, eq(users.id, cvSubscriptions.user_id))
    .where(
      and(
        eq(cvSubscriptions.status, 'trialing'),
        isNull(cvSubscriptions.trial_reminder_sent_at),
        gte(cvSubscriptions.trial_end, windowStart),
        lte(cvSubscriptions.trial_end, windowEnd)
      )
    );

  const results: Array<{ email: string; ok: boolean; error?: string }> = [];
  for (const { sub, email } of rows) {
    try {
      const template = getTrialReminderEmail(siteUrl);
      const sendResult = await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
      });
      if (sendResult.success) {
        await db
          .update(cvSubscriptions)
          .set({ trial_reminder_sent_at: new Date().toISOString() })
          .where(eq(cvSubscriptions.id, sub.id));
        results.push({ email, ok: true });
      } else {
        results.push({ email, ok: false, error: sendResult.error });
      }
    } catch (err) {
      results.push({
        email,
        ok: false,
        error: err instanceof Error ? err.message : 'Onbekende fout',
      });
    }
  }

  return NextResponse.json({ processed: rows.length, results });
}

function getTrialReminderEmail(siteUrl: string): { subject: string; html: string } {
  const accountUrl = `${siteUrl}/account`;
  return {
    subject: 'Je proefperiode eindigt over 2 dagen — €39/maand wordt afgeschreven',
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a; padding: 24px;">
        <h2 style="margin: 0 0 12px; font-size: 20px;">Je proefperiode loopt af</h2>
        <p style="line-height: 1.6; color: #334155;">
          Over <strong>2 dagen</strong> eindigt je gratis proefperiode bij ResuBox. Je krijgt dan
          automatisch toegang tot het volledige abonnement van <strong>€39/maand</strong> — onbeperkt
          CV's, alle templates en kleurschema's.
        </p>
        <p style="line-height: 1.6; color: #334155;">
          Wil je niet doorgaan? Geen probleem. Je kunt het abonnement op elk moment opzeggen,
          zonder kosten:
        </p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${accountUrl}"
             style="display: inline-block; padding: 12px 24px; background: #059669; color: white;
                    text-decoration: none; border-radius: 8px; font-weight: 600;">
            Beheer je abonnement
          </a>
        </p>
        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
          Doe je niets, dan wordt over 2 dagen €39 afgeschreven van de rekening waarmee je je hebt
          geverifieerd, en daarna iedere maand totdat je opzegt. Terugbetalingen kun je binnen
          8 weken bij je bank claimen.
        </p>
        <p style="font-size: 13px; color: #64748b;">— Het ResuBox-team</p>
      </div>
    `,
  };
}
