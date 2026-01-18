import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight, FileText, Mail } from 'lucide-react';
import { getSupabaseServerClient } from '@/lib/supabase';
import { CVOrder } from '@/types/admin';

export const metadata: Metadata = {
  title: 'Betaling Geslaagd - ResuBox',
  description: 'Je betaling is succesvol verwerkt.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string): Promise<CVOrder | null> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('cv_orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as CVOrder;
}

export default async function BetaaldPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 sm:h-20">
            <Link href="/">
              <Image
                src="/resubox-logo.svg"
                alt="ResuBox"
                width={160}
                height={40}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-8">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Betaling geslaagd!
          </h1>

          <p className="text-lg text-slate-600 mb-8">
            Bedankt voor je betaling. Je factuur is nu volledig voldaan.
          </p>

          {/* Order Details Card */}
          {order && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 mb-8 text-left">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Betalingsdetails
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Factuurnummer</span>
                  <span className="font-medium text-slate-900">{order.dossier_number}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Naam</span>
                  <span className="font-medium text-slate-900">{order.customer_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Bedrag</span>
                  <span className="font-medium text-emerald-600">&euro;{order.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Betaald
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Email Confirmation Note */}
          <div className="bg-blue-50 rounded-xl p-4 mb-8 flex items-start gap-3 text-left">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Je ontvangt binnen enkele minuten een bevestigingsmail op{' '}
              {order ? (
                <span className="font-medium">{order.customer_email}</span>
              ) : (
                'je e-mailadres'
              )}
              .
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Nieuw CV maken
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Terug naar home
            </Link>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} ResuBox. Alle rechten voorbehouden.</p>
        </div>
      </footer>
    </main>
  );
}
