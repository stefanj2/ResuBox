'use client';

import { useCallback, useEffect, useRef } from 'react';
import { trackEvent, getSessionId } from '@/lib/analytics';
import { AnalyticsEventType } from '@/types/admin';

interface UseAnalyticsOptions {
  trackSessionStart?: boolean;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { trackSessionStart = true } = options;
  const hasTrackedSession = useRef(false);
  const trackedSections = useRef(new Set<number>());
  const completedSections = useRef(new Set<number>());

  // Track session start on mount
  useEffect(() => {
    if (trackSessionStart && !hasTrackedSession.current) {
      hasTrackedSession.current = true;
      trackEvent('session_start');
    }

    // Track session end on unmount/page leave
    const handleUnload = () => {
      // Use sendBeacon for reliable tracking on page leave
      const event = {
        id: crypto.randomUUID?.() || Math.random().toString(36).substr(2, 9),
        session_id: getSessionId(),
        event_type: 'session_end' as AnalyticsEventType,
        created_at: new Date().toISOString(),
      };

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/track',
          JSON.stringify(event)
        );
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [trackSessionStart]);

  // Track section view (only once per section per session)
  const trackSectionView = useCallback((sectionId: number) => {
    if (!trackedSections.current.has(sectionId)) {
      trackedSections.current.add(sectionId);
      trackEvent('section_view', sectionId);
    }
  }, []);

  // Track section completion
  const trackSectionComplete = useCallback((sectionId: number) => {
    if (!completedSections.current.has(sectionId)) {
      completedSections.current.add(sectionId);
      trackEvent('section_complete', sectionId);
    }
  }, []);

  // Track download initiated
  const trackDownloadInitiated = useCallback(() => {
    trackEvent('download_initiated', 5);
  }, []);

  // Track download completed
  const trackDownloadCompleted = useCallback((metadata?: Record<string, unknown>) => {
    trackEvent('download_completed', 5, metadata);
  }, []);

  // Track payment started
  const trackPaymentStarted = useCallback((metadata?: Record<string, unknown>) => {
    trackEvent('payment_started', undefined, metadata);
  }, []);

  return {
    trackSectionView,
    trackSectionComplete,
    trackDownloadInitiated,
    trackDownloadCompleted,
    trackPaymentStarted,
  };
}
