'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, LOCALE_LABELS, LOCALE_COUNTRIES, type Locale } from '@/i18n/routing';
import { Globe, ChevronDown } from 'lucide-react';

interface Props {
  variant?: 'compact' | 'full';
}

export function LanguageSwitcher({ variant = 'compact' }: Props) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const change = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    // Forward dynamic route params (e.g. functie slug, order id) so next-intl
    // rewrites the URL correctly under the target locale's pathnames.
    const dynamicParams = Object.fromEntries(
      Object.entries(params ?? {}).filter(([k]) => k !== 'locale')
    );
    // The pathname type is the union of all defined pathnames; the router
    // accepts it but TypeScript can't narrow which branch we hit at runtime.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace({ pathname: pathname as any, params: dynamicParams as any }, { locale: next });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-50 font-medium transition-colors"
        aria-label="Change language"
      >
        {variant === 'compact' ? (
          <>
            <span className="text-base leading-none">{LOCALE_COUNTRIES[locale]}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </>
        ) : (
          <>
            <Globe className="w-4 h-4" />
            <span>{LOCALE_LABELS[locale]}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[160px] z-50">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => change(loc as Locale)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${
                loc === locale ? 'text-emerald-600 font-semibold' : 'text-slate-700'
              }`}
            >
              <span className="text-base leading-none">{LOCALE_COUNTRIES[loc]}</span>
              <span>{LOCALE_LABELS[loc]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
