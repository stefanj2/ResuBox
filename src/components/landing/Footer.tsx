'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Mail, Shield } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src="/resubox-logo-white.svg"
                alt="ResuBox"
                width={140}
                height={35}
                className="h-9 w-auto"
              />
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              {t('tagline')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t('productHeader')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/builder" className="hover:text-white transition-colors">
                  {t('links.createCv')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  {t('links.faq')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t('supportHeader')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('links.contact')}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@resubox.com" className="hover:text-white transition-colors">
                  info@resubox.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t('links.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            {t('copyright', { year })}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/voorwaarden" className="hover:text-white transition-colors">
              {t('links.terms')}
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t('links.privacy')}
            </Link>
            <Link href={{ pathname: '/privacy', hash: 'cookies' }} className="hover:text-white transition-colors">
              {t('links.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
