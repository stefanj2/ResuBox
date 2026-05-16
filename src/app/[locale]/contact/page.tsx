'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Send, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/landing';
import { Link } from '@/i18n/navigation';
import { Button, Input, TextArea } from '@/components/ui';

export default function ContactPage() {
  const t = useTranslations('Contact');
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

    if (!formData.name.trim()) newErrors.name = t('errorName');
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = t('errorEmail');
    if (!formData.subject.trim()) newErrors.subject = t('errorSubject');
    if (!formData.message.trim()) newErrors.message = t('errorMessage');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('loading');
    try {
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {t('formTitle')}
              </h2>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {t('successTitle')}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {t('successBody')}
                  </p>
                  <Button variant="outline" onClick={() => setStatus('idle')}>
                    {t('newMessageButton')}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label={t('nameLabel')}
                    name="name"
                    placeholder={t('namePlaceholder')}
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />

                  <Input
                    type="email"
                    label={t('emailLabel')}
                    name="email"
                    placeholder={t('emailPlaceholder')}
                    icon={Mail}
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />

                  <Input
                    label={t('subjectLabel')}
                    name="subject"
                    placeholder={t('subjectPlaceholder')}
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    required
                  />

                  <TextArea
                    label={t('messageLabel')}
                    name="message"
                    placeholder={t('messagePlaceholder')}
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
                    {status === 'loading' ? t('sending') : t('sendButton')}
                  </Button>

                  {status === 'error' && (
                    <p className="text-red-600 text-sm text-center">
                      {t('errorGeneric')}
                    </p>
                  )}
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-emerald-50 rounded-2xl p-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {t('directEmailTitle')}
                </h3>
                <p className="text-slate-600 mb-4">
                  {t('directEmailBody')}
                </p>
                <a
                  href="mailto:info@resubox.com"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  info@resubox.com
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('responseTimeTitle')}
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{t('responseWeekdays')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{t('responseWeekends')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{t('responseUrgent')}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {t('faqTitle')}
                </h3>
                <p className="text-slate-600 mb-4">
                  {t('faqBody')}
                </p>
                <Link href="/faq">
                  <Button variant="outline" icon={ArrowRight} iconPosition="right">
                    {t('faqButton')}
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
