'use client';

import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, FileText, Loader2, FileType } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { CVPreview } from '@/components/preview';
import { createOrder } from '@/lib/api/orders';

type Format = 'pdf' | 'docx';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const { cvData } = useCVData();
  const [agreed, setAgreed] = useState(false);
  const [format, setFormat] = useState<Format>('pdf');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDownload = async () => {
    if (!agreed) {
      setErrorMessage('Je moet akkoord gaan met de voorwaarden om te downloaden.');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      const filename = `CV_${cvData.personal.firstName || 'Naam'}_${cvData.personal.lastName || 'Achternaam'}`;
      const endpoint = format === 'pdf' ? '/api/generate-pdf' : '/api/generate-docx';
      const payload =
        format === 'pdf'
          ? {
              cvData,
              templateId: cvData.meta.selectedTemplate,
              colorSchemeId: cvData.meta.selectedColorScheme,
              filename,
            }
          : {
              cvData,
              colorSchemeId: cvData.meta.selectedColorScheme,
              filename,
            };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let detail = '';
        try {
          const j = await response.json();
          detail = j?.error || j?.details || '';
        } catch {
          // ignore
        }
        throw new Error(detail || `${format.toUpperCase()} generatie mislukt (${response.status})`);
      }

      // Trigger browser download from the returned PDF blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Create order in the system (non-blocking)
      const customerName = `${cvData.personal.firstName || ''} ${cvData.personal.lastName || ''}`.trim() || 'Onbekend';
      const customerEmail = cvData.personal.email || 'onbekend@email.nl';

      try {
        await createOrder({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: cvData.personal.phone,
          customer_address: cvData.personal.address,
          customer_house_number: cvData.personal.houseNumber,
          customer_postal_code: cvData.personal.postalCode,
          customer_city: cvData.personal.city,
          cv_id: cvData.id,
          template_used: cvData.meta.selectedTemplate,
          cv_data: cvData,
        });
      } catch (orderError) {
        console.error('Order creation error:', orderError);
      }

      // Conversion tracking
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag;
        gtag('event', 'purchase', {
          transaction_id: cvData.id,
          value: 42.0,
          currency: 'EUR',
          items: [
            {
              item_name: 'CV Download',
              item_category: cvData.meta.selectedTemplate,
              price: 42.0,
              quantity: 1,
            },
          ],
        });
        gtag('event', 'manual_event_PURCHASE', {
          value: 42.0,
          currency: 'EUR',
          transaction_id: cvData.id,
        });
      }

      setStatus('success');
    } catch (error) {
      console.error('Download error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Er ging iets mis bij het downloaden. Probeer het opnieuw.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'processing') return;
    setStatus('idle');
    setAgreed(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" mobileFullScreen title="Download CV">
      <div className="p-4 sm:p-6">
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Download gestart!</h2>
            <p className="text-slate-600 mb-6">
              Je professionele CV wordt nu gedownload. Veel succes met je sollicitatie!
            </p>
            <div className="bg-emerald-50 rounded-lg p-4 text-left mb-6">
              <h4 className="font-medium text-emerald-800 mb-2">Tips voor je sollicitatie:</h4>
              <ul className="text-sm text-emerald-700 space-y-1 list-disc list-inside">
                <li>Pas je CV aan voor elke vacature</li>
                <li>Gebruik relevante trefwoorden uit de vacaturetekst</li>
                <li>Voeg een persoonlijke motivatiebrief toe</li>
              </ul>
            </div>
            <Button variant="primary" onClick={handleClose}>
              Sluiten
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-3 sm:mb-6">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Download je CV</h2>
              <p className="text-slate-600 text-sm sm:text-base hidden sm:block">
                Je CV is klaar om te downloaden. Je ontvangt de PDF ook per e-mail op{' '}
                <strong>{cvData.personal.email || 'je opgegeven e-mailadres'}</strong>.
              </p>
            </div>

            <div className="flex justify-center bg-slate-50 rounded-xl p-2 pb-1 sm:p-4 sm:pb-2 mb-2 sm:mb-6">
              <div className="origin-top scale-[0.55] sm:scale-100 -mb-[126px] sm:mb-0">
                <div
                  className="relative overflow-hidden bg-white rounded-lg shadow-md border border-slate-200"
                  style={{ width: '52.5mm', height: '74.25mm' }}
                >
                  <div
                    className="pointer-events-none origin-top-left"
                    style={{ transform: 'scale(0.25)', width: '210mm', height: '297mm' }}
                  >
                    <CVPreview dataOverride={cvData} />
                  </div>
                </div>
              </div>
            </div>

            {/* Format selector */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Bestandsformaat
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('pdf')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-all text-left ${
                    format === 'pdf'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <FileText className={`w-5 h-5 flex-shrink-0 ${format === 'pdf' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">PDF</p>
                    <p className="text-xs text-slate-500">Aanbevolen — gekleurd, A4</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('docx')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-all text-left ${
                    format === 'docx'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <FileType className={`w-5 h-5 flex-shrink-0 ${format === 'docx' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Word (.docx)</p>
                    <p className="text-xs text-slate-500">Bewerkbaar in Word</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-3 sm:mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      setErrorMessage('');
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                      agreed
                        ? 'bg-emerald-600 border-emerald-600'
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {agreed && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-700 leading-relaxed">
                  <strong>Ja, ik wil mijn CV downloaden</strong>. Ik ga akkoord met de{' '}
                  <a href="/voorwaarden" target="_blank" className="text-emerald-600 underline hover:text-emerald-700">
                    algemene voorwaarden
                  </a>{' '}
                  en het{' '}
                  <a href="/privacy" target="_blank" className="text-emerald-600 underline hover:text-emerald-700">
                    privacybeleid
                  </a>
                  . Ik begrijp dat voor het downloaden van mijn CV een vergoeding van tweeënveertig eu in rekening wordt gebracht en dat het CV naar mijn e-mailadres wordt gestuurd.
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={!agreed || status === 'processing'}
              className={`w-full flex flex-col items-center justify-center gap-0.5 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                !agreed || status === 'processing'
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/25'
              }`}
            >
              <span className="flex items-center gap-2">
                {status === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {status === 'processing' ? 'Even geduld...' : 'Downloaden'}
              </span>
              <span className="text-[10px] font-normal opacity-40">betaalverplichting</span>
            </button>

            <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 mt-3 sm:mt-6 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Beveiligde verbinding
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                100% veilig
              </span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
