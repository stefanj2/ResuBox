'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, LayoutDashboard, Users, RefreshCw, BarChart3 } from 'lucide-react';
import { logout } from '@/lib/auth';
import { Button } from '@/components/ui';

interface AdminHeaderProps {
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function AdminHeader({ onRefresh, refreshing }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.replace('/admin/login');
  };

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: BarChart3,
      active: pathname === '/admin/analytics',
    },
    {
      href: '/admin/debiteurenbeheer',
      label: 'Debiteurenbeheer',
      icon: Users,
      active: pathname === '/admin/debiteurenbeheer',
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/resubox-logo.svg"
              alt="ResuBox"
              width={120}
              height={32}
              priority
            />
            <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
              Admin
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={refreshing}
                icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
              >
                <span className="hidden sm:inline">Vernieuwen</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Uitloggen</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden items-center gap-1 pb-3 -mx-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  item.active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
