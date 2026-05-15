'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/landing';
import { Button, Input, TextArea } from '@/components/ui';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vul je naam in';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vul je emailadres in';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Vul een geldig emailadres in';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Vul een onderwerp in';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Vul je bericht in';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('loading');

    try {
      // Simuleer API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Neem contact op
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Heb je een vraag, feedback, of kun je hulp gebruiken?
            We helpen je graag verder.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Stuur ons een bericht
              </h2>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Bericht verzonden!
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Bedankt voor je bericht. We reageren zo snel mogelijk,
                    meestal binnen 24 uur op werkdagen.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setStatus('idle')}
                  >
                    Nieuw bericht sturen
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Naam"
                    name="name"
                    placeholder="Je volledige naam"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />

                  <Input
                    type="email"
                    label="Emailadres"
                    name="email"
                    placeholder="jouw@email.nl"
                    icon={Mail}
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />

                  <Input
                    label="Onderwerp"
                    name="subject"
                    placeholder="Waar gaat je vraag over?"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    required
                  />

                  <TextArea
                    label="Bericht"
                    name="message"
                    placeholder="Schrijf hier je bericht..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    error={errors.message}
                    required
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    icon={status === 'loading' ? Loader2 : Send}
                    iconPosition="right"
                    loading={status === 'loading'}
                  >
                    {status === 'loading' ? 'Verzenden...' : 'Verstuur bericht'}
                  </Button>

                  {status === 'error' && (
                    <p className="text-red-600 text-sm text-center">
                      Er ging iets mis. Probeer het opnieuw of stuur een email.
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Email */}
              <div className="bg-emerald-50 rounded-2xl p-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Email ons direct
                </h3>
                <p className="text-slate-600 mb-4">
                  Liever direct een email sturen? Dat kan natuurlijk ook!
                </p>
                <a
                  href="mailto:info@resubox.nl"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  info@resubox.nl
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Response Time */}
              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Reactietijd
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Werkdagen: binnen 24 uur</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Weekenden: op de eerstvolgende werkdag</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Dringende vragen worden met voorrang behandeld</span>
                  </li>
                </ul>
              </div>

              {/* FAQ Link */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Veel gestelde vragen
                </h3>
                <p className="text-slate-600 mb-4">
                  Misschien staat het antwoord op je vraag al in onze FAQ.
                </p>
                <Link href="/faq">
                  <Button variant="outline" icon={ArrowRight} iconPosition="right">
                    Bekijk de FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
