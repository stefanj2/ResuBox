import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ShieldCheck, CheckCircle, FileText, Building2, Mail, Clock } from 'lucide-react';
import { getOrder } from '@/lib/orders';
import FaqAccordion from './FaqAccordion';

export const metadata: Metadata = {
  title: 'Betalen - ResuBox',
  description: 'Betaal veilig uw CV download via iDEAL, creditcard of Bancontact.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export default async function BetalenPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (order?.status === 'betaald') {
    redirect(`/betaald/${id}`);
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Betaallink niet gevonden</h1>
          <p className="text-slate-600 mb-6">Deze link is ongeldig of verlopen. Controleer de link in uw e-mail.</p>
          <Link href="/" className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
            Terug naar home
          </Link>
        </div>
      </main>
    );
  }

  const paymentDeadline = addDays(order.created_at, 14);
  const isOverdue = new Date() > new Date(paymentDeadline);
  const pi = order.cv_data?.personal;
  const cvName = pi ? `${pi.firstName} ${pi.lastName}`.trim() : order.customer_name;
  const street = order.customer_address || pi?.address || '';
  const houseNumber = order.customer_house_number || pi?.houseNumber || '';
  const postalCode = order.customer_postal_code || pi?.postalCode || '';
  const city = order.customer_city || pi?.city || '';

  const templateLabels: Record<string, string> = {
    modern: 'Modern',
    zakelijk: 'Zakelijk',
    creatief: 'Creatief',
    minimalist: 'Minimalist',
    executive: 'Executive',
    tech: 'Tech',
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e8e8]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <Image src="/resubox-logo.svg" alt="ResuBox" width={130} height={32} className="h-7 w-auto" priority />
          </Link>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Beveiligde betaling</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

          {/* LEFT: Invoice card */}
          <div className="bg-white rounded-lg border border-[#e0e0e0]">

            {/* Invoice header */}
            <div className="px-8 pt-7 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] text-slate-500">Factuur van ResuBox</p>
                  <p className="text-[14px] font-medium text-slate-700 mt-0.5">CV download</p>
                </div>
                <div className="text-right">
                  <p className="text-[38px] font-bold text-slate-900 leading-none">&euro;{order.amount.toFixed(2).replace('.', ',')}</p>
                  <p className="text-[12px] text-slate-400 mt-1">incl. BTW</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            {/* Groep 1: Contactgegevens debiteur */}
            <div className="px-8 pt-5 pb-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Contactgegevens</p>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[13px] text-slate-500 min-w-[160px]">Naam</span>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-slate-800">{order.customer_name}</p>
                    {street && <p className="text-[13px] text-slate-600">{street} {houseNumber}</p>}
                    {(postalCode || city) && <p className="text-[13px] text-slate-600">{postalCode} {city}</p>}
                    {!street && !postalCode && !city && <p className="text-[13px] text-slate-400 italic">Geen adres bekend</p>}
                  </div>
                </div>
                {order.customer_phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 min-w-[160px]">Telefoonnummer</span>
                    <span className="text-[13px] font-semibold text-slate-800">{order.customer_phone}</span>
                  </div>
                )}
                {pi?.dateOfBirth && (
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 min-w-[160px]">Geboortedatum</span>
                    <span className="text-[13px] font-semibold text-slate-800">{formatDate(pi.dateOfBirth)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            {/* Groep 2: CV details */}
            <div className="px-8 pt-5 pb-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">CV details</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-slate-500 min-w-[160px]">CV opgemaakt voor</span>
                  <span className="text-[13px] font-semibold text-slate-800">{cvName}</span>
                </div>
                {order.template_used && (
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 min-w-[160px]">Template</span>
                    <span className="text-[13px] font-semibold text-slate-800">{templateLabels[order.template_used] ?? order.template_used}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-slate-500 min-w-[160px]">Gedownload op</span>
                  <span className="text-[13px] font-semibold text-slate-800">{formatDate(order.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            {/* Groep 3: Factuurgegevens */}
            <div className="px-8 pt-5 pb-5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Factuur</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-slate-500 min-w-[160px]">Dossier</span>
                  <span className="text-[13px] font-semibold text-slate-800">{order.dossier_number ?? '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-slate-500 min-w-[160px]">Uiterlijke betaaldatum</span>
                  <span className={`text-[13px] font-semibold ${isOverdue ? 'text-red-600' : 'text-red-500'}`}>
                    {formatDate(paymentDeadline)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#f0f0f0]">
                  <span className="text-[14px] font-bold text-slate-800">Totaal</span>
                  <span className="text-[14px] font-bold text-slate-800">&euro;{order.amount.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#f0f0f0]" />

            {/* Payment method */}
            <div className="px-8 py-5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Betaalmethode</p>

              <div className="space-y-2">
                <div className="border border-emerald-500 rounded-lg px-4 py-3 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <Image src="/ideal-logo.svg" alt="iDEAL" width={36} height={36} className="w-9 h-9 flex-shrink-0" />
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">iDEAL</p>
                      <p className="text-[12px] text-slate-500">Betaal via uw eigen bank</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 bg-white">
                    <span className="text-[13px] text-slate-600">Creditcard</span>
                  </div>
                  <div className="flex-1 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 bg-white">
                    <span className="text-[13px] text-slate-600">Bancontact</span>
                  </div>
                </div>
              </div>

              {order.payment_link ? (
                <a
                  href={order.payment_link}
                  className="mt-3 flex items-center justify-center w-full py-3.5 bg-emerald-600 text-white font-semibold text-[15px] rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Betaal &euro;{order.amount.toFixed(2).replace('.', ',')}
                </a>
              ) : (
                <div className="mt-3 flex items-center justify-center w-full py-3.5 bg-slate-200 text-slate-400 font-semibold text-[15px] rounded-lg cursor-not-allowed">
                  Betaallink wordt aangemaakt…
                </div>
              )}

              <div className="mt-2.5 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> SSL beveiligd
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Stripe
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT column */}
          <div className="space-y-3">

            {/* Success banner */}
            <div className="bg-emerald-600 rounded-lg px-4 py-3.5 flex items-start gap-3">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">Uw CV is klaar</p>
                <p className="text-[12px] text-emerald-100 mt-0.5">ResuBox heeft uw CV professioneel opgemaakt.</p>
              </div>
            </div>

            {/* Social proof */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-3 flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <p className="text-[13px] text-slate-700"><strong>1.000+</strong> CV&apos;s succesvol opgemaakt</p>
            </div>

            {/* Bedrijfsgegevens */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-[13px] font-semibold text-slate-800">Bedrijfsgegevens</p>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">Officieel geregistreerd in Nederland</p>
              <div className="space-y-2">
                {[
                  ['Bedrijfsnaam', 'ResuBox'],
                  ['Adres', 'Keurenplein 41'],
                  ['Vestigingsplaats', '1069 CD Amsterdam'],
                  ['KvK nummer', '67332706'],
                  ['BTW nummer', 'NL224452794B01'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-[12px] text-slate-500">{label}</span>
                    <span className="text-[12px] font-semibold text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                Verifieer onze KvK-registratie op{' '}
                <a href="https://kvk.nl" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">kvk.nl</a>
              </p>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-4">
              <p className="text-[14px] font-semibold text-slate-800 mb-1">Veelgestelde vragen</p>
              <FaqAccordion />
            </div>

            {/* Niet betalen */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-4">
              <p className="text-[12px] text-slate-500 font-medium mb-3 flex items-center gap-1">
                <span className="text-slate-400">↗</span> Wat gebeurt er als u niet betaalt?
              </p>
              <div className="space-y-3">
                {[
                  { n: 1, title: 'Herinnering', desc: 'U ontvangt een betalingsherinnering per e-mail.' },
                  { n: 2, title: 'Incasso aanmelding', desc: 'Uw dossier wordt aangemeld bij een incassobureau.' },
                  { n: 3, title: 'Deurwaarder + extra kosten', desc: 'Er worden wettelijke incassokosten (€40+) in rekening gebracht.' },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-slate-500 mt-0.5">{n}</div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{title}</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-slate-50 rounded px-3 py-2">
                <p className="text-[11px] text-slate-500">
                  Betaal nu &euro;{order.amount.toFixed(2).replace('.', ',')} en voorkom extra kosten en verdere stappen.
                </p>
              </div>
            </div>

            {/* Hulp nodig */}
            <div className="bg-white rounded-lg border border-[#e0e0e0] px-4 py-4">
              <p className="text-[14px] font-semibold text-slate-800 mb-3">Hulp nodig?</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">E-mail</p>
                    <a href="mailto:info@resubox.nl" className="text-[13px] text-emerald-600 font-medium hover:underline">info@resubox.nl</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Openingstijden</p>
                    <p className="text-[13px] text-slate-700 font-medium">Ma – Vr, 09:00 – 17:00</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#e8e8e8] py-5 mt-4">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px] text-slate-400">
          <Image src="/resubox-logo.svg" alt="ResuBox" width={70} height={18} className="h-3.5 w-auto opacity-30" />
          <span className="hidden sm:inline">·</span>
          <span>&copy; {new Date().getFullYear()} ResuBox · KvK 67332706 · BTW NL224452794B01</span>
        </div>
      </footer>
    </main>
  );
}
