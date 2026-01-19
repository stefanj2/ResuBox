import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsStats } from '@/lib/analytics-server';

export async function GET(request: NextRequest) {
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
