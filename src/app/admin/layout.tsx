'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { isAuthenticated, extendSession } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();

      // If on login page and authenticated, redirect to admin
      if (pathname === '/admin/login' && isAuth) {
        router.replace('/admin');
        return;
      }

      // If not on login page and not authenticated, redirect to login
      if (pathname !== '/admin/login' && !isAuth) {
        router.replace('/admin/login');
        return;
      }

      // Extend session on activity
      if (isAuth) {
        extendSession();
      }

      setAuthenticated(isAuth);
      setChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking authentication
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm text-slate-500">Laden...</p>
        </div>
      </div>
    );
  }

  // On login page, render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Not authenticated and not on login page (should redirect)
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Authenticated, render admin pages
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}
