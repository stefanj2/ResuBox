import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getCurrentUser } from '@/lib/user-auth';
import { listUserCvs } from '@/lib/user-cvs';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';
import DashboardClient from './DashboardClient';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard' });
  return {
    title: t('pageTitle'),
    robots: { index: false, follow: false },
  };
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(locale === 'nl' ? '/login' : `/${locale}/login`);

  const cvs = await listUserCvs(user.id);
  const serialized = cvs.map((c) => ({
    id: c.id,
    name: c.name,
    created_at: c.created_at,
    updated_at: c.updated_at,
    cv_data: c.cv_data,
  }));

  const t = await getTranslations({ locale, namespace: 'Dashboard' });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="text-sm text-slate-600">
                <span className="hidden sm:inline">{t('loggedInAs')} </span>
                <span className="font-medium text-slate-900">{user.email}</span>
              </div>
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
