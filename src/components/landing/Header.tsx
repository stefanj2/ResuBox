'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, LogIn } from 'lucide-react';
import { Button } from '@/components/ui';
import { MagicLinkModal } from './MagicLinkModal';

export function Header() {
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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setShowMagicLinkModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Inloggen</span>
              </button>
              <Link href="/builder" className="flex items-center gap-2">
                <Button size="md" icon={ArrowRight} iconPosition="right">
                  Start gratis
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
              aria-label={isMobileMenuOpen ? 'Sluit menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
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
                key={link.href}
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
              <span>Inloggen</span>
            </button>
            <Link
              href="/builder"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block"
            >
              <Button fullWidth size="md" icon={ArrowRight} iconPosition="right">
                Start gratis
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
