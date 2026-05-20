'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, ArrowRight, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui';
import { MagicLinkModal } from './MagicLinkModal';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const t = useTranslations('Header');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMagicLinkModal, setShowMagicLinkModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { href: { pathname: '/' | '/faq'; hash?: string }; label: string }[] = [
    { href: { pathname: '/', hash: 'templates' }, label: t('templates') },
    { href: { pathname: '/', hash: 'hoe-het-werkt' }, label: t('howItWorks') },
    { href: { pathname: '/', hash: 'reviews' }, label: t('reviews') },
    { href: { pathname: '/faq' }, label: t('faq') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-safe ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image
                src="/resubox-logo.svg"
                alt="ResuBox"
                width={160}
                height={40}
                className="h-8 sm:h-10 w-auto transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => setShowMagicLinkModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('login')}</span>
              </button>
              <Link href="/builder" className="flex items-center gap-2">
                <Button size="md" icon={ArrowRight} iconPosition="right">
                  {t('ctaPrimary')}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-1">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                aria-label={isMobileMenuOpen ? t('closeMenu') : t('openMenu')}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-slate-100 px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-3 border-slate-100" />
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setShowMagicLinkModal(true);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg font-medium transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('login')}</span>
            </button>
            <Link
              href="/builder"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block"
            >
              <Button fullWidth size="md" icon={ArrowRight} iconPosition="right">
                {t('ctaPrimary')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <MagicLinkModal
        isOpen={showMagicLinkModal}
        onClose={() => setShowMagicLinkModal(false)}
      />
    </>
  );
}
