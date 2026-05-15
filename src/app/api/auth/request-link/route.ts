import { NextRequest, NextResponse } from 'next/server';
import { findOrCreateUser, createMagicLink } from '@/lib/user-auth';
import { sendEmail } from '@/lib/resend';
import { rateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const limiter = rateLimiter({ limit: 5, windowMs: 5 * 60_000 });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.resubox.com';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Te veel pogingen. Probeer over 5 minuten opnieuw.' }, { status: 429 });

  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 });
    }

    const user = await findOrCreateUser(email);
    const token = await createMagicLink(user.id);
    const link = `${siteUrl}/auth/verify?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Inloggen bij ResuBox',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #0f172a; font-size: 24px; margin: 0 0 16px 0;">Welkom bij ResuBox</h1>
          <p style="color: #334155; font-size: 15px; line-height: 1.5;">
            Klik op de knop hieronder om in te loggen op je account. De link blijft 15 minuten geldig.
          </p>
          <p style="margin: 24px 0;">
            <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; font-weight: 600; text-decoration: none; border-radius: 8px;">
              Log in op ResuBox
            </a>
          </p>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
            Werkt de knop niet? Plak deze link in je browser:<br>
            <span style="word-break: break-all; color: #475569;">${link}</span>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          <p style="color: #94a3b8; font-size: 12px;">
            Heb je geen inlogpoging gedaan? Negeer deze e-mail. De link werkt pas als je hem zelf opent.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Magic link verzonden naar je e-mailadres.' });
  } catch (err) {
    console.error('[auth/request-link] error:', err);
    return NextResponse.json({ error: 'Kon link niet versturen' }, { status: 500 });
  }
}
