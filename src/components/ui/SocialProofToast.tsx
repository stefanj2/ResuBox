'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Download, X, MapPin } from 'lucide-react';

const CITIES_BY_LOCALE: Record<string, string[]> = {
  nl: ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven', 'Groningen', 'Breda', 'Nijmegen', 'Tilburg', 'Almere', 'Haarlem', 'Arnhem'],
  en: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Bristol', 'Edinburgh', 'Glasgow', 'Sheffield', 'Cardiff', 'Newcastle', 'Nottingham'],
  de: ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dresden', 'Hannover', 'Wien', 'Zürich'],
  sv: ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Örebro', 'Västerås', 'Helsingborg', 'Lund', 'Umeå'],
  da: ['København', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Frederiksberg', 'Randers', 'Kolding', 'Vejle', 'Horsens'],
};

const NAMES_BY_LOCALE: Record<string, string[]> = {
  nl: ['Emma', 'Liam', 'Sophie', 'Noah', 'Julia', 'Daan', 'Tess', 'Sem', 'Anna', 'Lucas', 'Mila', 'Finn'],
  en: ['Oliver', 'Olivia', 'George', 'Amelia', 'Harry', 'Isla', 'Jack', 'Ava', 'Charlie', 'Mia', 'Thomas', 'Grace'],
  de: ['Maximilian', 'Sophie', 'Felix', 'Marie', 'Lukas', 'Hannah', 'Jonas', 'Lena', 'Paul', 'Emma', 'Leon', 'Anna'],
  sv: ['Lars', 'Anna', 'Erik', 'Emma', 'Karl', 'Maria', 'Johan', 'Sofia', 'Oscar', 'Linnea', 'Gustav', 'Astrid'],
  da: ['Mads', 'Sofie', 'Frederik', 'Mette', 'Anders', 'Emma', 'Mikkel', 'Anna', 'Magnus', 'Ida', 'Jakob', 'Freja'],
};

export function SocialProofToast() {
  const t = useTranslations('SocialProof');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentCity, setCurrentCity] = useState('');
  const [currentName, setCurrentName] = useState('');

  const cities = CITIES_BY_LOCALE[locale] ?? CITIES_BY_LOCALE.nl;
  const names = NAMES_BY_LOCALE[locale] ?? NAMES_BY_LOCALE.nl;

  const hideToast = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
    }, 200);
  }, []);

  const showToast = useCallback(() => {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    setCurrentCity(city);
    setCurrentName(name);
    setIsVisible(true);
    setIsExiting(false);

    setTimeout(() => {
      hideToast();
    }, 3500);
  }, [hideToast, cities, names]);

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      showToast();
    }, 15000);

    const interval = setInterval(() => {
      const randomDelay = Math.floor(Math.random() * 30000) + 30000;
      setTimeout(() => {
        showToast();
      }, randomDelay);
    }, 45000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [showToast]);

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`hidden md:block fixed top-6 right-6 z-50 transition-all duration-200 ${
          isExiting ? 'opacity-0 translate-x-4' : 'animate-toast-slide-in'
        }`}
      >
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 px-4 py-3 flex items-center gap-3 max-w-sm">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {t('desktopMessage', { name: currentName, city: currentCity })}
            </p>
            <p className="text-xs text-slate-500">{t('justNow')}</p>
          </div>
          <button
            onClick={hideToast}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            aria-label={tCommon('close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed bottom-[105px] left-3 right-3 z-50 transition-all duration-200 ${
          isExiting ? 'opacity-0 translate-y-4' : 'animate-toast-slide-in-mobile'
        }`}
      >
        <div className="bg-slate-900 rounded-xl shadow-xl px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Download className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {t('mobileMessage', { name: currentName })}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {currentCity} • {t('justNow')}
            </p>
          </div>
          <button
            onClick={hideToast}
            className="p-1.5 text-slate-400 hover:text-white transition-colors flex-shrink-0 -mr-1"
            aria-label={tCommon('close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
