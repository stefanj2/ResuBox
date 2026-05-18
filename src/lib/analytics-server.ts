import 'server-only';
import { and, asc, gte, lte } from 'drizzle-orm';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { AnalyticsEvent, AnalyticsStats, FunnelStep } from '@/types/admin';
import { db, isDbConfigured } from './db';
import { analyticsEvents } from '@/db/schema';

const SECTION_NAMES = [
  'Persoonlijk basis',
  'Persoonlijk contact',
  'Persoonlijk extra',
  'Werkervaring',
  'Opleiding',
  'Vaardigheden',
  'Profiel',
  'Controle',
];

const EVENTS_FILE = join(process.cwd(), '.analytics-events.json');

function getFileEvents(): AnalyticsEvent[] {
  try {
    if (existsSync(EVENTS_FILE)) {
      const data = readFileSync(EVENTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // Ignore errors
  }
  return [];
}

function saveFileEvents(events: AnalyticsEvent[]): void {
  try {
    writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
  } catch {
    // Ignore errors
  }
}

interface SaveEventResult {
  success: boolean;
  savedTo: 'db' | 'file';
  error?: string;
}

export async function saveEvent(event: AnalyticsEvent): Promise<SaveEventResult> {
  if (!isDbConfigured) {
    const events = getFileEvents();
    events.push(event);
    saveFileEvents(events);
    return { success: true, savedTo: 'file', error: 'DATABASE_URL not configured' };
  }

  try {
    await db.insert(analyticsEvents).values({
      session_id: event.session_id,
      event_type: event.event_type,
      section_id: event.section_id,
      section_name: event.section_name,
      metadata: event.metadata,
      created_at: event.created_at,
    });
    return { success: true, savedTo: 'db' };
  } catch (e) {
    const events = getFileEvents();
    events.push(event);
    saveFileEvents(events);
    return {
      success: true,
      savedTo: 'file',
      error: e instanceof Error ? e.message : 'Unknown error',
    };
  }
}

interface DebugInfo {
  dbConfigured: boolean;
  dbEventsCount: number | null;
  dbError: string | null;
  fileEventsCount: number;
  usedSource: 'db' | 'file';
}

export async function getAnalyticsStats(days: number = 30): Promise<AnalyticsStats & { _debug?: DebugInfo }> {
  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - days);

  const debug: DebugInfo = {
    dbConfigured: isDbConfigured,
    dbEventsCount: null,
    dbError: null,
    fileEventsCount: getFileEvents().length,
    usedSource: 'file',
  };

  let events: AnalyticsEvent[] = [];

  if (isDbConfigured) {
    try {
      const rows = await db
        .select()
        .from(analyticsEvents)
        .where(
          and(
            gte(analyticsEvents.created_at, periodStart.toISOString()),
            lte(analyticsEvents.created_at, periodEnd.toISOString())
          )
        )
        .orderBy(asc(analyticsEvents.created_at))
        .limit(10000);

      debug.dbEventsCount = rows.length;
      debug.usedSource = 'db';
      events = rows.map((r) => ({
        id: r.id,
        session_id: r.session_id,
        event_type: r.event_type,
        section_id: r.section_id ?? undefined,
        section_name: r.section_name ?? undefined,
        metadata: r.metadata ?? undefined,
        created_at: r.created_at,
      }));
    } catch (e) {
      debug.dbError = e instanceof Error ? e.message : 'Unknown error';
      debug.usedSource = 'file';
      events = getFileEvents().filter((e) => {
        const eventDate = new Date(e.created_at);
        return eventDate >= periodStart && eventDate <= periodEnd;
      });
    }
  } else {
    debug.usedSource = 'file';
    events = getFileEvents().filter((e) => {
      const eventDate = new Date(e.created_at);
      return eventDate >= periodStart && eventDate <= periodEnd;
    });
  }

  const stats = calculateFunnelStats(events, periodStart, periodEnd);
  return { ...stats, _debug: debug };
}

function calculateFunnelStats(
  events: AnalyticsEvent[],
  periodStart: Date,
  periodEnd: Date
): AnalyticsStats {
  const sessionEvents = new Map<string, AnalyticsEvent[]>();

  for (const event of events) {
    const sessionId = event.session_id;
    if (!sessionEvents.has(sessionId)) {
      sessionEvents.set(sessionId, []);
    }
    sessionEvents.get(sessionId)!.push(event);
  }

  const totalSessions = sessionEvents.size;

  const stepCounts = SECTION_NAMES.map(() => 0);
  const fillableCount = SECTION_NAMES.length - 1; // last entry is the download/review step
  let completedSessions = 0;

  for (const [, sessionEventList] of sessionEvents) {
    const sectionsViewed = new Set<number>();
    let downloadInitiated = false;
    let downloadCompleted = false;

    for (const event of sessionEventList) {
      if (event.event_type === 'section_view' && event.section_id !== undefined) {
        sectionsViewed.add(event.section_id);
      }
      if (event.event_type === 'download_initiated') {
        downloadInitiated = true;
      }
      if (event.event_type === 'download_completed') {
        downloadCompleted = true;
        completedSessions++;
      }
    }

    for (let i = 0; i < fillableCount; i++) {
      if (sectionsViewed.has(i)) {
        stepCounts[i]++;
      }
    }

    if (downloadInitiated || downloadCompleted) {
      stepCounts[fillableCount]++;
    }
  }

  const funnel: FunnelStep[] = SECTION_NAMES.map((name, id) => {
    const count = stepCounts[id];
    const prevCount = id === 0 ? totalSessions : stepCounts[id - 1];
    const percentage = totalSessions > 0 ? (count / totalSessions) * 100 : 0;
    const dropOffCount = prevCount - count;
    const dropOffPercentage = prevCount > 0 ? (dropOffCount / prevCount) * 100 : 0;

    return {
      id,
      name,
      count,
      percentage,
      dropOffCount,
      dropOffPercentage,
    };
  });

  return {
    totalSessions,
    completedSessions,
    conversionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
    funnel,
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
  };
}
