'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CoverLetterData, createEmptyCoverLetter, CoverLetterTemplateId } from '@/types/cover-letter';
import { ColorSchemeId } from '@/types/cv';

const STORAGE_KEY = 'cover-letter-session';

interface CoverLetterContextType {
  data: CoverLetterData;
  updateSender: (field: keyof CoverLetterData['sender'], value: string) => void;
  updateRecipient: (field: keyof CoverLetterData['recipient'], value: string) => void;
  updateField: <K extends keyof CoverLetterData>(field: K, value: CoverLetterData[K]) => void;
  setTemplate: (id: CoverLetterTemplateId) => void;
  setColorScheme: (id: ColorSchemeId) => void;
  prefillFromCV: (cvData: { personal: Partial<CoverLetterData['sender']> }) => void;
  resetLetter: () => void;
}

const CoverLetterContext = createContext<CoverLetterContextType | undefined>(undefined);

export function CoverLetterProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CoverLetterData>(createEmptyCoverLetter);
  const [initialized, setInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        // Try to prefill sender block from CV builder session
        const cvSession = localStorage.getItem('cv-builder-session');
        const fresh = createEmptyCoverLetter();
        fresh.id = crypto.randomUUID();
        if (cvSession) {
          try {
            const cv = JSON.parse(cvSession);
            if (cv?.personal) {
              fresh.sender.firstName = cv.personal.firstName ?? '';
              fresh.sender.lastName = cv.personal.lastName ?? '';
              fresh.sender.email = cv.personal.email ?? '';
              fresh.sender.phone = cv.personal.phone ?? '';
              fresh.sender.address = cv.personal.address ?? '';
              fresh.sender.city = cv.personal.city ?? '';
              fresh.sender.postalCode = cv.personal.postalCode ?? '';
              fresh.letterCity = cv.personal.city ?? '';
            }
          } catch {
            // ignore
          }
        }
        setData(fresh);
      }
    } catch (err) {
      console.error('Failed to load cover letter:', err);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, updatedAt: new Date().toISOString() }));
    }, 300);
  }, [data, initialized]);

  const updateSender = useCallback((field: keyof CoverLetterData['sender'], value: string) => {
    setData((prev) => ({ ...prev, sender: { ...prev.sender, [field]: value } }));
  }, []);

  const updateRecipient = useCallback((field: keyof CoverLetterData['recipient'], value: string) => {
    setData((prev) => ({ ...prev, recipient: { ...prev.recipient, [field]: value } }));
  }, []);

  const updateField = useCallback(<K extends keyof CoverLetterData>(field: K, value: CoverLetterData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setTemplate = useCallback((id: CoverLetterTemplateId) => {
    setData((prev) => ({ ...prev, meta: { ...prev.meta, selectedTemplate: id } }));
  }, []);

  const setColorScheme = useCallback((id: ColorSchemeId) => {
    setData((prev) => ({ ...prev, meta: { ...prev.meta, selectedColorScheme: id } }));
  }, []);

  const prefillFromCV = useCallback((cvData: { personal: Partial<CoverLetterData['sender']> }) => {
    setData((prev) => ({
      ...prev,
      sender: { ...prev.sender, ...cvData.personal },
    }));
  }, []);

  const resetLetter = useCallback(() => {
    const fresh = createEmptyCoverLetter();
    fresh.id = crypto.randomUUID();
    setData(fresh);
  }, []);

  return (
    <CoverLetterContext.Provider
      value={{ data, updateSender, updateRecipient, updateField, setTemplate, setColorScheme, prefillFromCV, resetLetter }}
    >
      {children}
    </CoverLetterContext.Provider>
  );
}

export function useCoverLetter() {
  const ctx = useContext(CoverLetterContext);
  if (!ctx) throw new Error('useCoverLetter must be used within CoverLetterProvider');
  return ctx;
}
