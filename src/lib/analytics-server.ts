import { AnalyticsEvent, AnalyticsStats, FunnelStep } from '@/types/admin';
import { getSupabaseServerClient, isSupabaseConfigured } from './supabase';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Section names for the funnel
const SECTION_NAMES = [
  'Persoonsgegevens',
  'Werkervaring',
  'Opleiding',
  'Vaardigheden',
  'Profiel',
  'Download',
];

// File-based storage for when Supabase is not configured (development fallback)
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

// Save event debug info
interface SaveEventResult {
  success: boolean;
  savedTo: 'supabase' | 'file';
  error?: string;
}

// Server-side: Save event to Supabase or file-based fallback
export async function saveEvent(event: AnalyticsEvent): Promise<SaveEventResult> {
  const supabase = getSupabaseServerClient();

  if (supabase && isSupabaseConfigured) {
    try {
      // Don't pass id - let Supabase generate UUID automatically
      const { error } = await supabase.from('analytics_events').insert({
        session_id: event.session_id,
        event_type: event.event_type,
        section_id: event.section_id,
        section_name: event.section_name,
        metadata: event.metadata,
        created_at: event.created_at,
      });

      // If Supabase fails (e.g., table doesn't exist), fall back to file
      if (error) {
        console.warn('Supabase insert failed, using file fallback:', error.message);
        const events = getFileEvents();
        events.push(event);
        saveFileEvents(events);
        return { success: true, savedTo: 'file', error: error.message };
      }
      return { success: true, savedTo: 'supabase' };
    } catch (e) {
      // Fallback on any error
      const events = getFileEvents();
      events.push(event);
      saveFileEvents(events);
      return { success: true, savedTo: 'file', error: e instanceof Error ? e.message : 'Unknown error' };
    }
  } else {
    // Fallback: store in file for development
    const events = getFileEvents();
    events.push(event);
    saveFileEvents(events);
    return { success: true, savedTo: 'file', error: 'Supabase not configured' };
  }
}

// Debug info interface
interface DebugInfo {
  supabaseClientExists: boolean;
  isSupabaseConfigured: boolean;
  supabaseEventsCount: number | null;
  supabaseError: string | null;
  fileEventsCount: number;
  usedSource: 'supabase' | 'file';
}

// Server-side: Get analytics statistics
export async function getAnalyticsStats(days: number = 30): Promise<AnalyticsStats & { _debug?: DebugInfo }> {
  const periodEnd = new Date();
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - days);

  const supabase = getSupabaseServerClient();

  const debug: DebugInfo = {
    supabaseClientExists: !!supabase,
    isSupabaseConfigured: isSupabaseConfigured,
    supabaseEventsCount: null,
    supabaseError: null,
    fileEventsCount: getFileEvents().length,
    usedSource: 'file',
  };

  let events: AnalyticsEvent[] = [];

  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', periodStart.toISOString())
        .lte('created_at', periodEnd.toISOString())
        .order('created_at', { ascending: true });

      debug.supabaseEventsCount = data?.length ?? null;
      debug.supabaseError = error?.message ?? null;

      if (error || !data) {
        // Fallback to file if Supabase fails
        debug.usedSource = 'file';
        events = getFileEvents().filter((e) => {
          const eventDate = new Date(e.created_at);
          return eventDate >= periodStart && eventDate <= periodEnd;
        });
      } else {
        debug.usedSource = 'supabase';
        events = data as AnalyticsEvent[];
      }
    } catch (e) {
      // Fallback to file on any error
      debug.supabaseError = e instanceof Error ? e.message : 'Unknown error';
      debug.usedSource = 'file';
      events = getFileEvents().filter((e) => {
        const eventDate = new Date(e.created_at);
        return eventDate >= periodStart && eventDate <= periodEnd;
      });
    }
  } else {
    // Fallback: use file-based events for development
    debug.usedSource = 'file';
    events = getFileEvents().filter((e) => {
      const eventDate = new Date(e.created_at);
      return eventDate >= periodStart && eventDate <= periodEnd;
    });
  }

  const stats = calculateFunnelStats(events, periodStart, periodEnd);
  return { ...stats, _debug: debug };
}

// Calculate funnel statistics from events
function calculateFunnelStats(
  events: AnalyticsEvent[],
  periodStart: Date,
  periodEnd: Date
): AnalyticsStats {
  // Group events by session
  const sessionEvents = new Map<string, AnalyticsEvent[]>();

  for (const event of events) {
    const sessionId = event.session_id;
    if (!sessionEvents.has(sessionId)) {
      sessionEvents.set(sessionId, []);
    }
    sessionEvents.get(sessionId)!.push(event);
  }

  const totalSessions = sessionEvents.size;

  // Count sessions that reached each step
  // Step 0-4: form sections viewed
  // Step 5: download initiated/completed
  const stepCounts = [0, 0, 0, 0, 0, 0];
  let completedSessions = 0;

  for (const [, sessionEventList] of sessionEvents) {
    // Track which sections were viewed in this session
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

    // Count step progression (only count if previous steps were completed)
    // For sections, count if viewed
    for (let i = 0; i <= 4; i++) {
      if (sectionsViewed.has(i)) {
        stepCounts[i]++;
      }
    }

    // Download step
    if (downloadInitiated || downloadCompleted) {
      stepCounts[5]++;
    }
  }

  // Build funnel data
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
