'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, Loader2, ArrowRight } from 'lucide-react';
import { useCoverLetter } from '@/context/CoverLetterContext';
import { ModernCoverLetterTemplate } from '@/components/cover-letter/ModernCoverLetterTemplate';

export default function CoverLetterEditor() {
  const { data, updateSender, updateRecipient, updateField } = useCoverLetter();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-cover-letter-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `PDF mislukt (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `Motivatiebrief_${data.sender.firstName || 'Naam'}_${data.sender.lastName || ''}.pdf`.replace(/[^\w\-]/g, '_');
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onverwachte fout');
    } finally {
      setDownloading(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';
  const labelCls = 'block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1';

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Image src="/resubox-logo.svg" alt="ResuBox" width={140} height={32} className="h-8 w-auto" priority />
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/builder" className="text-sm text-slate-600 hover:text-slate-900">
                CV maken
              </Link>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-60"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? 'Downloaden…' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Motivatiebrief</h1>
          <p className="text-slate-600">
            Vul de gegevens in. Het preview rechts updatet live. Druk op Download zodra je klaar bent.
          </p>
          {error && <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
          {/* Editor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            {/* Sender */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Jouw gegevens</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Voornaam</label>
                  <input className={inputCls} value={data.sender.firstName} onChange={(e) => updateSender('firstName', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Achternaam</label>
                  <input className={inputCls} value={data.sender.lastName} onChange={(e) => updateSender('lastName', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>E-mail</label>
                  <input className={inputCls} type="email" value={data.sender.email} onChange={(e) => updateSender('email', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Telefoon</label>
                  <input className={inputCls} value={data.sender.phone} onChange={(e) => updateSender('phone', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Adres</label>
                  <input className={inputCls} value={data.sender.address} onChange={(e) => updateSender('address', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Postcode</label>
                  <input className={inputCls} value={data.sender.postalCode} onChange={(e) => updateSender('postalCode', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Woonplaats</label>
                  <input className={inputCls} value={data.sender.city} onChange={(e) => updateSender('city', e.target.value)} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Geadresseerde</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Contactpersoon</label>
                  <input
                    className={inputCls}
                    placeholder="Bijv. mevrouw Jansen"
                    value={data.recipient.contactName}
                    onChange={(e) => updateRecipient('contactName', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Functie geadresseerde</label>
                  <input
                    className={inputCls}
                    placeholder="HR Manager (optioneel)"
                    value={data.recipient.contactTitle}
                    onChange={(e) => updateRecipient('contactTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Bedrijf</label>
                  <input className={inputCls} value={data.recipient.company} onChange={(e) => updateRecipient('company', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Vestigingsplaats bedrijf</label>
                  <input className={inputCls} value={data.recipient.city} onChange={(e) => updateRecipient('city', e.target.value)} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Vacature</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Functietitel</label>
                  <input
                    className={inputCls}
                    placeholder="Bijv. Senior Backend Developer"
                    value={data.vacancyTitle}
                    onChange={(e) => updateField('vacancyTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Referentienummer</label>
                  <input className={inputCls} placeholder="Optioneel" value={data.vacancyReference} onChange={(e) => updateField('vacancyReference', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Datum</label>
                  <input className={inputCls} type="date" value={data.date} onChange={(e) => updateField('date', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Plaats van schrijven</label>
                  <input className={inputCls} value={data.letterCity} onChange={(e) => updateField('letterCity', e.target.value)} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Brief</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Aanhef</label>
                  <input
                    className={inputCls}
                    placeholder="Geachte mevrouw Jansen,"
                    value={data.greeting}
                    onChange={(e) => updateField('greeting', e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">Laat leeg voor automatische aanhef</p>
                </div>
                <div>
                  <label className={labelCls}>Opening</label>
                  <textarea
                    className={`${inputCls} min-h-[80px] resize-y`}
                    placeholder="Met veel interesse heb ik kennis genomen van de vacature voor [functie]. Via [bron] kwam ik deze tegen…"
                    value={data.opening}
                    onChange={(e) => updateField('opening', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Body — waarom jij past</label>
                  <textarea
                    className={`${inputCls} min-h-[140px] resize-y`}
                    placeholder="In mijn huidige rol als [rol] bij [bedrijf] heb ik 5 jaar ervaring opgedaan met… Mijn expertise sluit aan op de gevraagde competenties omdat…"
                    value={data.body}
                    onChange={(e) => updateField('body', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Afsluiting</label>
                  <textarea
                    className={`${inputCls} min-h-[80px] resize-y`}
                    placeholder="Ik licht mijn motivatie graag toe in een persoonlijk gesprek. Ik ben beschikbaar vanaf [datum]…"
                    value={data.closing}
                    onChange={(e) => updateField('closing', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Groet</label>
                  <input className={inputCls} value={data.signature} onChange={(e) => updateField('signature', e.target.value)} />
                </div>
              </div>
            </section>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-slate-100 rounded-2xl p-4 sm:p-6">
              <div className="flex justify-center">
                <div className="origin-top scale-[0.45] sm:scale-[0.6] -mb-[180px] sm:-mb-[110px]">
                  <ModernCoverLetterTemplate data={data} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-2">
              <span>Live preview</span>
              <Link href="/builder" className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
                Maak ook een CV <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
