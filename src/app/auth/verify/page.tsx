import { redirect } from 'next/navigation';
import Link from 'next/link';
import { exchangeMagicLink, setSessionCookie } from '@/lib/user-auth';

interface PageProps {
  searchParams: Promise<{ token?: string; next?: string }>;
}

export default async function AuthVerifyPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token;
  const next = params.next && params.next.startsWith('/') ? params.next : '/dashboard';

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Geen link gevonden</h1>
          <p className="text-slate-600 mb-4">Deze pagina opent alleen via de inloglink in je e-mail.</p>
          <Link href="/login" className="text-emerald-600 hover:text-emerald-700">Vraag opnieuw aan</Link>
        </div>
      </main>
    );
  }

  const result = await exchangeMagicLink(token);

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Link niet meer geldig</h1>
          <p className="text-slate-600 mb-4">De inloglink is verlopen of al gebruikt. Vraag een nieuwe link aan.</p>
          <Link href="/login" className="inline-block px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">
            Naar inloggen
          </Link>
        </div>
      </main>
    );
  }

  await setSessionCookie(result.sessionToken);
  redirect(next);
}
