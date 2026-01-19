import { NextRequest, NextResponse } from 'next/server';
import { saveEvent } from '@/lib/analytics-server';
import { AnalyticsEvent } from '@/types/admin';

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json();

    // Validate required fields
    if (!event.id || !event.session_id || !event.event_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save event to database
    const result = await saveEvent(event);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
