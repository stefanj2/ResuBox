'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { login, isAuthenticated } from '@/lib/auth';
import { Button, Input } from '@/components/ui';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    if (isAuthenticated()) {
      router.replace('/admin');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      router.replace('/admin');
    } else {
      setError(result.error || 'Inloggen mislukt');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 animate-fadeIn">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/resubox-logo.svg"
              alt="ResuBox"
              width={140}
              height={40}
              priority
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Log in om door te gaan</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Gebruikersnaam"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={User}
              placeholder="admin"
              required
              autoComplete="username"
              disabled={loading}
            />

            <Input
              label="Wachtwoord"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Inloggen
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              ResuBox Admin Dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
