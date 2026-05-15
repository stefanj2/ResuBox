import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/user-auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Inloggen | ResuBox',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
          </div>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Inloggen</h1>
            <p className="text-sm text-slate-600 mb-6">
              Vul je e-mailadres in en we sturen je een inloglink. Geen wachtwoord nodig.
            </p>
            <LoginForm />
          </div>
          <p className="text-sm text-center text-slate-500 mt-6">
            Nog geen account?{' '}
            <Link href="/builder" className="text-emerald-600 hover:text-emerald-700">
              Maak eerst een CV
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
