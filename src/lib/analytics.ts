import { AnalyticsEvent, AnalyticsEventType } from '@/types/admin';

const STORAGE_KEY = 'cv_analytics_events';

// Section names for the funnel
const SECTION_NAMES = [
  'Persoonsgegevens',
  'Werkervaring',
  'Opleiding',
  'Vaardigheden',
  'Profiel',
  'Download',
];

// Generate UUID for session/event IDs
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Get or create session ID (stored in sessionStorage)
export function getSessionId(): string {
  if (typeof window === 'undefined') return generateId();

  let sessionId = sessionStorage.getItem('cv_analytics_session');
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem('cv_analytics_session', sessionId);
  }
  return sessionId;
}

// Track an analytics event (client-side)
export async function trackEvent(
  eventType: AnalyticsEventType,
  sectionId?: number,
  metadata?: Record<string, unknown>
): Promise<void> {
  const event: AnalyticsEvent = {
    id: generateId(),
    session_id: getSessionId(),
    event_type: eventType,
    section_id: sectionId,
    section_name: sectionId !== undefined ? SECTION_NAMES[sectionId] : undefined,
    metadata,
    created_at: new Date().toISOString(),
  };

  try {
    // Try to send to API
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch {
    // Fallback: store in localStorage if API fails
    storeEventLocally(event);
  }
}

// Store event in localStorage (fallback)
function storeEventLocally(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;

  const events = getLocalEvents();
  events.push(event);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// Get events from localStorage
function getLocalEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
