import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsStats } from '@/lib/analytics-server';
import { rateLimiter } from '@/lib/rate-limit';

const limiter = rateLimiter({ limit: 30, windowMs: 60_000 });

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = limiter.check(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    // Get days parameter from query string (default 30)
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    const stats = await getAnalyticsStats(days);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
