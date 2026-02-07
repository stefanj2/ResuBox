import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limit';

const limiter = rateLimiter({ limit: 5, windowMs: 15 * 60_000 });

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
      // Generate a simple token
      const token = crypto.randomUUID();

      return NextResponse.json({
        success: true,
        token,
        message: 'Inloggen gelukt',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Ongeldige gebruikersnaam of wachtwoord',
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Er is een fout opgetreden',
      },
      { status: 500 }
    );
  }
}
