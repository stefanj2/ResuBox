import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getCurrentUser } from '@/lib/user-auth';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';
import LoginForm from './LoginForm';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Login' });
  return {
    title: `${t('title')} | ResuBox`,
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (user) redirect(locale === 'nl' ? '/dashboard' : `/${locale}/dashboard`);

  const t = await getTranslations({ locale, namespace: 'Login' });

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('title')}</h1>
            <p className="text-sm text-slate-600 mb-6">
              {t('subtitle')}
            </p>
            <LoginForm />
          </div>
          <p className="text-sm text-center text-slate-500 mt-6">
            {t('noAccount')}{' '}
            <Link href="/builder" className="text-emerald-600 hover:text-emerald-700">
              {t('createCvFirst')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
