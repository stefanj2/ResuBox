import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { exchangeMagicLink, setSessionCookie } from '@/lib/user-auth';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; next?: string }>;
}

export default async function AuthVerifyPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const token = sp.token;
  const localePrefix = locale === 'nl' ? '' : `/${locale}`;
  const next = sp.next && sp.next.startsWith('/') ? sp.next : `${localePrefix}/dashboard`;

  const t = await getTranslations({ locale, namespace: 'AuthVerify' });

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('noTokenTitle')}</h1>
          <p className="text-slate-600 mb-4">{t('noTokenBody')}</p>
          <Link href="/login" className="text-emerald-600 hover:text-emerald-700">{t('requestAgain')}</Link>
        </div>
      </main>
    );
  }

  const result = await exchangeMagicLink(token);

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('expiredTitle')}</h1>
          <p className="text-slate-600 mb-4">{t('expiredBody')}</p>
          <Link href="/login" className="inline-block px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">
            {t('toLogin')}
          </Link>
        </div>
      </main>
    );
  }

  await setSessionCookie(result.sessionToken);
  redirect(next);
}
