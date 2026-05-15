import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/user-auth';
import { listUserCvs } from '@/lib/user-cvs';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Mijn CV\'s | ResuBox',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const cvs = await listUserCvs(user.id);
  const serialized = cvs.map((c) => ({
    id: c.id,
    name: c.name,
    created_at: c.created_at,
    updated_at: c.updated_at,
    cv_data: c.cv_data,
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <div className="text-sm text-slate-600">
              <span className="hidden sm:inline">Ingelogd als </span>
              <span className="font-medium text-slate-900">{user.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DashboardClient cvs={serialized} />
      </div>
    </main>
  );
}
