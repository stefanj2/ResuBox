'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
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
              De makkelijkste manier om een professioneel CV te maken.
              Ontworpen voor de Nederlandse arbeidsmarkt.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="/builder" className="hover:text-white transition-colors">
                  CV Maken
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors">
                  Veelgestelde vragen
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@resubox.nl" className="hover:text-white transition-colors">
                  info@resubox.nl
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <a href="/privacy" className="hover:text-white transition-colors">
                  Privacybeleid
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} ResuBox. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="/voorwaarden" className="hover:text-white transition-colors">
              Algemene voorwaarden
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="/privacy#cookies" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
