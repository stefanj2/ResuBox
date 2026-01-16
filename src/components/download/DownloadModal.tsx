'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, CheckCircle, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { CVPreview } from '@/components/preview';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const { cvData } = useCVData();
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Ensure we're mounted on client for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  const generatePDF = useCallback(async () => {
    if (!pdfContainerRef.current) {
      console.error('PDF container ref is null');
      return;
    }

    // Wait for template to fully render
    await new Promise(resolve => setTimeout(resolve, 2000));

    const element = pdfContainerRef.current;

    // Debug: log element dimensions and content
    console.log('PDF container dimensions:', element.offsetWidth, element.offsetHeight);
    console.log('PDF container innerHTML length:', element.innerHTML.length);
    console.log('cvData being used:', JSON.stringify({
      firstName: cvData.personal.firstName,
      lastName: cvData.personal.lastName,
      template: cvData.meta.selectedTemplate,
      experienceCount: cvData.experience.length,
    }));

    // Temporarily make element visible for capture
    const originalStyle = element.style.cssText;
    element.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 210mm;
      min-height: 297mm;
      background-color: white;
      z-index: 9999;
      overflow: visible;
    `;

    // Wait a bit for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create PNG from the template using html-to-image
    const imgData = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: true,
    });

    // Restore original positioning
    element.style.cssText = originalStyle;

    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Create image to get dimensions
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imgData;
    });

    // Calculate scaling to fit A4
    const imgWidth = a4Width;
    const imgHeight = (img.height * a4Width) / img.width;

    // If content is longer than one page, we need to handle pagination
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= a4Height;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= a4Height;
    }

    return pdf;
  }, [cvData]);

  const handleDownload = async () => {
    if (!agreed) {
      setErrorMessage('Je moet akkoord gaan met de voorwaarden om te downloaden.');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      // Generate PDF
      const pdf = await generatePDF();

      if (!pdf) {
        throw new Error('PDF generation failed');
      }

      // Download PDF
      const fileName = `CV_${cvData.personal.firstName || 'Naam'}_${cvData.personal.lastName || 'Achternaam'}.pdf`;
      pdf.save(fileName);

      // Log download (in productie: stuur naar analytics)
      console.log('📥 CV gedownload voor:', cvData.personal.email);

      setStatus('success');
    } catch (error) {
      console.error('Download error:', error);
      setErrorMessage('Er ging iets mis bij het downloaden. Probeer het opnieuw.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'processing') return; // Prevent closing while processing
    setStatus('idle');
    setAgreed(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <>
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Download gestart!
            </h2>
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
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Download je CV
              </h2>
              <p className="text-slate-600">
                Je CV is klaar om te downloaden. Je ontvangt de PDF ook per e-mail op <strong>{cvData.personal.email || 'je opgegeven e-mailadres'}</strong>.
              </p>
            </div>

            {/* CV Preview - scaled version of actual template */}
            <div
              ref={previewRef}
              className="flex justify-center bg-slate-50 rounded-xl p-4 mb-6"
            >
              <div
                className="relative overflow-hidden bg-white rounded-lg shadow-md border border-slate-200"
                style={{
                  width: '52.5mm', // 210mm * 0.25
                  height: '74.25mm', // 297mm * 0.25
                }}
              >
                <div
                  className="pointer-events-none origin-top-left"
                  style={{
                    transform: 'scale(0.25)',
                    width: '210mm',
                    height: '297mm',
                  }}
                >
                  <CVPreview dataOverride={cvData} />
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="mb-6">
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
                  <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${
                    agreed
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
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

            {/* Error message */}
            {errorMessage && (
              <div className="flex items-center gap-2 text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Button */}
            <Button
              variant="primary"
              onClick={handleDownload}
              icon={status === 'processing' ? Loader2 : Download}
              disabled={!agreed || status === 'processing'}
              loading={status === 'processing'}
              className="w-full"
            >
              {status === 'processing' ? 'Even geduld...' : 'Downloaden'}
            </Button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Beveiligde verbinding
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% veilig
              </span>
            </div>
          </>
        )}
      </div>
    </Modal>

      {/* Hidden container for PDF generation - rendered via portal outside modal */}
      {mounted && isOpen && createPortal(
        <div
          ref={pdfContainerRef}
          id="pdf-export-container"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '210mm',
            minHeight: '297mm',
            backgroundColor: 'white',
            overflow: 'visible',
            zIndex: -1,
          }}
        >
          <CVPreview dataOverride={cvData} />
        </div>,
        document.body
      )}
    </>
  );
}
