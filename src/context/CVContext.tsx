'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CVData, createEmptyCVData, Experience, Education, Skill, TemplateId, ColorSchemeId } from '@/types/cv';

const STORAGE_KEY = 'cv-builder-session';
const SESSIONS_KEY = 'cv-builder-sessions';

interface CVContextType {
  cvData: CVData;
  // Update functies
  updatePersonal: (field: keyof CVData['personal'], value: string) => void;
  updateProfile: (summary: string) => void;
  // Experience
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  // Education
  addEducation: (education: Education) => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  // Skills
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  // Meta
  updateMeta: (updates: Partial<CVData['meta']>) => void;
  // Account sync state — null = working in localStorage only;
  // string = ID of the user_cvs row this CV is synced to
  serverCvId: string | null;
  syncStatus: 'idle' | 'saving' | 'saved' | 'error';
  /** Save current CV to user's account as a new entry. Returns new cv id. */
  saveToAccount: (name: string) => Promise<string | null>;
  // Template
  setTemplate: (templateId: TemplateId) => void;
  // Color scheme
  setColorScheme: (colorSchemeId: ColorSchemeId) => void;
  // Session management
  saveSession: () => void;
  loadSession: (token: string) => boolean;
  resetCV: () => void;
  // Magic Link
  triggerMagicLink: (email: string) => Promise<boolean>;
  magicLinkSent: boolean;
  // Huidige sectie
  currentSection: number;
  setCurrentSection: (section: number) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [cvData, setCVData] = useState<CVData>(createEmptyCVData);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [serverCvId, setServerCvId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const serverSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncedHashRef = useRef<string>('');

  // Laad data uit LocalStorage of server bij initialisatie
  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const cvIdParam = urlParams.get('cvId');
        const token = urlParams.get('token');

        // ?cvId=X — load this CV from the user's account (server-side)
        if (cvIdParam) {
          try {
            const res = await fetch(`/api/user/cvs/${cvIdParam}`, { credentials: 'include' });
            if (res.ok) {
              const json = await res.json();
              const cv = json?.cv;
              if (cv?.cv_data) {
                const data = cv.cv_data as CVData;
                // Migration for legacy CVs without template/color
                if (data.meta && !data.meta.selectedTemplate) data.meta.selectedTemplate = 'modern';
                if (data.meta && !data.meta.selectedColorScheme) data.meta.selectedColorScheme = 'emerald';
                setCVData(data);
                setServerCvId(cv.id);
                setSyncStatus('saved');
                lastSyncedHashRef.current = JSON.stringify(data);
                // Clean cvId out of the URL — keep it tidy
                window.history.replaceState({}, '', window.location.pathname);
                setIsInitialized(true);
                return;
              }
            }
            // 401/404 → fall through to localStorage
          } catch (err) {
            console.error('Failed to load CV from account:', err);
          }
        }

        if (token) {
          const sessions = localStorage.getItem(SESSIONS_KEY);
          if (sessions) {
            const sessionsData = JSON.parse(sessions);
            if (sessionsData[token]) {
              const sessionData = sessionsData[token];
              // Migratie: voeg selectedTemplate en selectedColorScheme toe als ze ontbreken
              if (sessionData.meta && !sessionData.meta.selectedTemplate) {
                sessionData.meta.selectedTemplate = 'modern';
              }
              if (sessionData.meta && !sessionData.meta.selectedColorScheme) {
                sessionData.meta.selectedColorScheme = 'emerald';
              }
              setCVData(sessionData);
              // Verwijder token uit URL zonder page reload
              window.history.replaceState({}, '', window.location.pathname);
              setIsInitialized(true);
              return;
            }
          }
        }
        
        // Anders laad normale sessie
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Migratie: voeg selectedTemplate en selectedColorScheme toe als ze ontbreken (voor bestaande gebruikers)
          if (parsed.meta && !parsed.meta.selectedTemplate) {
            parsed.meta.selectedTemplate = 'modern';
          }
          if (parsed.meta && !parsed.meta.selectedColorScheme) {
            parsed.meta.selectedColorScheme = 'emerald';
          }
          setCVData(parsed);
        } else {
          // Nieuw ID genereren voor nieuwe sessie
          const newData = createEmptyCVData();
          newData.id = crypto.randomUUID();
          setCVData(newData);
        }
      } catch (error) {
        console.error('Fout bij laden sessie:', error);
        const newData = createEmptyCVData();
        newData.id = crypto.randomUUID();
        setCVData(newData);
      }
      setIsInitialized(true);
    };

    loadFromStorage();
  }, []);

  // Auto-save naar LocalStorage (debounced)
  const saveToStorage = useCallback(() => {
    if (!isInitialized) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      const dataToSave = {
        ...cvData,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, 300);
  }, [cvData, isInitialized]);

  useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  // Auto-save to server when this CV is linked to a user_cvs row.
  // Longer debounce (1.5s) than localStorage to reduce API load.
  useEffect(() => {
    if (!isInitialized || !serverCvId) return;
    const serialized = JSON.stringify(cvData);
    if (serialized === lastSyncedHashRef.current) return;

    if (serverSaveTimeoutRef.current) clearTimeout(serverSaveTimeoutRef.current);
    setSyncStatus('saving');
    serverSaveTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/user/cvs/${serverCvId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ cv_data: cvData }),
        });
        if (res.ok) {
          lastSyncedHashRef.current = serialized;
          setSyncStatus('saved');
        } else if (res.status === 401) {
          // Session expired — detach from server, keep localStorage working
          setServerCvId(null);
          setSyncStatus('idle');
        } else {
          setSyncStatus('error');
        }
      } catch (err) {
        console.error('Server save failed:', err);
        setSyncStatus('error');
      }
    }, 1500);

    return () => {
      if (serverSaveTimeoutRef.current) clearTimeout(serverSaveTimeoutRef.current);
    };
  }, [cvData, serverCvId, isInitialized]);

  // Save current CV to user's account as a new entry.
  // Subsequent edits will auto-sync because serverCvId is set.
  const saveToAccount = useCallback(async (name: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/user/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: name.trim() || 'Naamloos CV', cv_data: cvData }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          console.warn('Not logged in — cannot save to account');
        }
        return null;
      }
      const json = await res.json();
      const newId = json?.cv?.id;
      if (newId) {
        setServerCvId(newId);
        setSyncStatus('saved');
        lastSyncedHashRef.current = JSON.stringify(cvData);
        return newId;
      }
      return null;
    } catch (err) {
      console.error('Save to account failed:', err);
      return null;
    }
  }, [cvData]);

  // Update functies
  const updatePersonal = useCallback((field: keyof CVData['personal'], value: string) => {
    setCVData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateProfile = useCallback((summary: string) => {
    setCVData(prev => ({
      ...prev,
      profile: { summary },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Experience CRUD
  const addExperience = useCallback((experience: Experience) => {
    setCVData(prev => ({
      ...prev,
      experience: [...prev.experience, experience],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<Experience>) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Education CRUD
  const addEducation = useCallback((education: Education) => {
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, education],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<Education>) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Skills CRUD
  const addSkill = useCallback((skill: Skill) => {
    setCVData(prev => ({
      ...prev,
      skills: [...prev.skills, skill],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, ...updates } : skill
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Meta update
  const updateMeta = useCallback((updates: Partial<CVData['meta']>) => {
    setCVData(prev => ({
      ...prev,
      meta: { ...prev.meta, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Template selectie
  const setTemplate = useCallback((templateId: TemplateId) => {
    setCVData(prev => ({
      ...prev,
      meta: { ...prev.meta, selectedTemplate: templateId },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Color scheme selectie
  const setColorScheme = useCallback((colorSchemeId: ColorSchemeId) => {
    setCVData(prev => ({
      ...prev,
      meta: { ...prev.meta, selectedColorScheme: colorSchemeId },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Session management
  const saveSession = useCallback(() => {
    const dataToSave = {
      ...cvData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [cvData]);

  const loadSession = useCallback((token: string): boolean => {
    try {
      const sessions = localStorage.getItem(SESSIONS_KEY);
      if (sessions) {
        const sessionsData = JSON.parse(sessions);
        if (sessionsData[token]) {
          setCVData(sessionsData[token]);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const resetCV = useCallback(() => {
    const newData = createEmptyCVData();
    newData.id = crypto.randomUUID();
    setCVData(newData);
    setMagicLinkSent(false);
    setCurrentSection(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Magic Link functionaliteit
  const triggerMagicLink = useCallback(async (email: string): Promise<boolean> => {
    try {
      // Genereer token
      const token = crypto.randomUUID();
      
      // Update meta met token
      const updatedData = {
        ...cvData,
        personal: { ...cvData.personal, email },
        meta: {
          ...cvData.meta,
          magicLinkToken: token,
          magicLinkSentAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };
      
      setCVData(updatedData);
      
      // Sla op in sessions storage (gesimuleerd als backend)
      const sessions = localStorage.getItem(SESSIONS_KEY);
      const sessionsData = sessions ? JSON.parse(sessions) : {};
      sessionsData[token] = updatedData;
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessionsData));
      
      // Sla ook op als huidige sessie
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      // Simuleer email versturen (in productie zou dit een API call zijn)
      const magicLinkUrl = `${window.location.origin}/builder?token=${token}`;
      console.log('📧 Magic Link verstuurd naar:', email);
      console.log('🔗 Link:', magicLinkUrl);
      
      // In development: toon de link in een alert (verwijder in productie)
      if (process.env.NODE_ENV === 'development') {
        console.log('%c✨ MAGIC LINK (kopieer deze voor testen):', 'color: green; font-weight: bold');
        console.log(magicLinkUrl);
      }
      
      setMagicLinkSent(true);
      return true;
    } catch (error) {
      console.error('Fout bij magic link:', error);
      return false;
    }
  }, [cvData]);

  const value: CVContextType = {
    cvData,
    updatePersonal,
    updateProfile,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    updateMeta,
    serverCvId,
    syncStatus,
    saveToAccount,
    setTemplate,
    setColorScheme,
    saveSession,
    loadSession,
    resetCV,
    triggerMagicLink,
    magicLinkSent,
    currentSection,
    setCurrentSection,
  };

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
}

export function useCVData() {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCVData moet binnen CVProvider gebruikt worden');
  }
  return context;
}
