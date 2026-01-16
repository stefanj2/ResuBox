import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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
