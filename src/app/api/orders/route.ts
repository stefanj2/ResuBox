import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders';
import { rateLimiter } from '@/lib/rate-limit';
import type { CVData } from '@/types/cv';

const limiter = rateLimiter({ limit: 20, windowMs: 60_000 });

interface CreateOrderBody {
  customer_name?: unknown;
  customer_email?: unknown;
  customer_phone?: unknown;
  customer_address?: unknown;
  customer_house_number?: unknown;
  customer_postal_code?: unknown;
  customer_city?: unknown;
  cv_id?: unknown;
  template_used?: unknown;
  cv_data?: unknown;
}

function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const body = (await request.json()) as CreateOrderBody;

    const customer_name = asString(body.customer_name);
    const customer_email = asString(body.customer_email);

    if (!customer_name || !customer_email) {
      return NextResponse.json(
        { error: 'customer_name en customer_email zijn vereist' },
        { status: 400 }
      );
    }

    const order = await createOrder({
      customer_name,
      customer_email,
      customer_phone: asString(body.customer_phone),
      customer_address: asString(body.customer_address),
      customer_house_number: asString(body.customer_house_number),
      customer_postal_code: asString(body.customer_postal_code),
      customer_city: asString(body.customer_city),
      cv_id: asString(body.cv_id),
      template_used: asString(body.template_used),
      cv_data: body.cv_data as CVData | undefined,
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ error: 'Fout bij aanmaken order' }, { status: 500 });
  }
}
