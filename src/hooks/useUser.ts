'use client';

import { useEffect, useState } from 'react';

interface SessionUser {
  id: string;
  email: string;
  created_at: string;
}

interface UseUserResult {
  user: SessionUser | null;
  loading: boolean;
}

let cache: { user: SessionUser | null; loadedAt: number } | null = null;
const CACHE_MS = 60_000;

export function useUser(): UseUserResult {
  const [user, setUser] = useState<SessionUser | null>(cache?.user ?? null);
  const [loading, setLoading] = useState(() => !cache);

  useEffect(() => {
    let active = true;
    if (cache && Date.now() - cache.loadedAt < CACHE_MS) {
      setUser(cache.user);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/user/me', { credentials: 'include' });
        const json = await res.json();
        if (!active) return;
        const next = (json.user as SessionUser | null) ?? null;
        cache = { user: next, loadedAt: Date.now() };
        setUser(next);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { user, loading };
}
