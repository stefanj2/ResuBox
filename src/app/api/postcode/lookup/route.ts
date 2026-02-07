import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limit';

const limiter = rateLimiter({ limit: 30, windowMs: 60_000 });

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const searchParams = request.nextUrl.searchParams;
  const postcode = searchParams.get('postcode')?.replace(/\s/g, '').toUpperCase();
  const huisnummer = searchParams.get('huisnummer');

  if (!postcode || !huisnummer) {
    return NextResponse.json(
      { error: 'Postcode en huisnummer zijn verplicht' },
      { status: 400 }
    );
  }

  // Validate postcode format (Dutch: 4 digits + 2 letters)
  const postcodeRegex = /^[1-9][0-9]{3}[A-Z]{2}$/;
  if (!postcodeRegex.test(postcode)) {
    return NextResponse.json(
      { error: 'Ongeldige postcode format' },
      { status: 400 }
    );
  }

  try {
    // Use PDOK Locatieserver API (free, Dutch government)
    const query = `${postcode} ${huisnummer}`;
    const response = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(query)}&rows=1&fq=type:adres`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('PDOK API error');
    }

    const data = await response.json();

    if (data.response?.docs?.length > 0) {
      const doc = data.response.docs[0];

      return NextResponse.json({
        straat: doc.straatnaam || '',
        woonplaats: doc.woonplaatsnaam || '',
        gemeente: doc.gemeentenaam || '',
        provincie: doc.provincienaam || '',
      });
    }

    return NextResponse.json(
      { error: 'Adres niet gevonden' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Postcode lookup error:', error);
    return NextResponse.json(
      { error: 'Er ging iets mis bij het opzoeken van het adres' },
      { status: 500 }
    );
  }
}
