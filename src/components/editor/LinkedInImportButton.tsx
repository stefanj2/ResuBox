'use client';

import React, { useRef, useState } from 'react';
import { Linkedin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useCVData } from '@/context/CVContext';

interface ImportResponse {
  success: boolean;
  data?: {
    personal?: Record<string, string | undefined>;
    profile?: { summary: string };
    experience?: unknown[];
    education?: unknown[];
    skills?: unknown[];
  };
  warning?: string;
  error?: string;
}

export function LinkedInImportButton() {
  const { bulkImport } = useCVData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleFile = async (file: File) => {
    setStatus('uploading');
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/import-linkedin', { method: 'POST', body: formData });
      const json = (await res.json()) as ImportResponse;

      if (!res.ok || !json.success || !json.data) {
        setStatus('error');
        setMessage(json.error ?? 'Import mislukt');
        return;
      }

      bulkImport({
        personal: json.data.personal as Parameters<typeof bulkImport>[0]['personal'],
        profile: json.data.profile,
        experience: json.data.experience as Parameters<typeof bulkImport>[0]['experience'],
        education: json.data.education as Parameters<typeof bulkImport>[0]['education'],
        skills: json.data.skills as Parameters<typeof bulkImport>[0]['skills'],
      });

      const counts = {
        exp: json.data.experience?.length ?? 0,
        edu: json.data.education?.length ?? 0,
        skills: json.data.skills?.length ?? 0,
      };
      setStatus('success');
      setMessage(
        json.warning ??
          `Geïmporteerd: ${counts.exp} werkervaring, ${counts.edu} opleiding, ${counts.skills} skills. Controleer en pas waar nodig aan.`
      );
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Onverwachte fout');
    }
  };

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Linkedin className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            Importeer vanaf LinkedIn
          </h3>
          <p className="text-xs text-slate-600 mb-3">
            Upload je LinkedIn-profiel als PDF en wij vullen werkervaring, opleiding en skills
            alvast in.{' '}
            <a
              href="https://www.linkedin.com/help/linkedin/answer/a541960"
              target="_blank"
              rel="noreferrer noopener"
              className="text-blue-600 underline hover:text-blue-700"
            >
              Hoe download ik mijn profiel?
            </a>
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={status === 'uploading'}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-blue-200 hover:border-blue-400 text-blue-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'uploading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Bezig met inlezen…
              </>
            ) : (
              <>
                <Linkedin className="w-4 h-4" /> Selecteer LinkedIn-PDF
              </>
            )}
          </button>

          {status === 'success' && (
            <div className="mt-3 flex items-start gap-2 text-sm text-emerald-700">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="mt-3 flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
