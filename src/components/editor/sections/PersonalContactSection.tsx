'use client';

import React, { useCallback, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui';
import { useCVData } from '@/context/CVContext';

const ADDRESS_LOOKUP_LOCALES = new Set(['nl']);

/** Second personal sub-step: email, phone, address. Fits one viewport. */
export function PersonalContactSection() {
  const { cvData, updatePersonal, triggerMagicLink, magicLinkSent } = useCVData();
  const t = useTranslations('Builder.personalSection');
  const tip = useTranslations('Builder.personalSection.tooltips');
  const tStep = useTranslations('Builder.personalContact');
  const locale = useLocale();
  const [emailTouched, setEmailTouched] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);
  const [lookingUpAddress, setLookingUpAddress] = useState(false);
  const [addressError, setAddressError] = useState('');

  const supportsAddressLookup = ADDRESS_LOOKUP_LOCALES.has(locale);

  const lookupAddress = useCallback(async (postcode: string, houseNumber: string) => {
    if (!supportsAddressLookup) return;
    const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();
    if (cleanPostcode.length < 6 || !houseNumber.trim()) return;
    const postcodeRegex = /^[1-9][0-9]{3}[A-Z]{2}$/;
    if (!postcodeRegex.test(cleanPostcode)) return;

    setLookingUpAddress(true);
    setAddressError('');

    try {
      const response = await fetch(
        `/api/postcode/lookup?postcode=${encodeURIComponent(cleanPostcode)}&huisnummer=${encodeURIComponent(houseNumber.trim())}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.straat) updatePersonal('address', data.straat);
        if (data.woonplaats) updatePersonal('city', data.woonplaats);
      } else if (response.status === 404) {
        setAddressError(t('addressNotFound'));
      }
    } catch (error) {
      console.error('Address lookup error:', error);
    } finally {
      setLookingUpAddress(false);
    }
  }, [updatePersonal, supportsAddressLookup, t]);

  const handlePostcodeChange = (value: string) => {
    updatePersonal('postalCode', value);
    if (cvData.personal.houseNumber) lookupAddress(value, cvData.personal.houseNumber);
  };

  const handleHouseNumberChange = (value: string) => {
    updatePersonal('houseNumber', value);
    if (cvData.personal.postalCode) lookupAddress(cvData.personal.postalCode, value);
  };

  const handleEmailBlur = async () => {
    setEmailTouched(true);
    if (
      cvData.personal.email &&
      cvData.personal.email.includes('@') &&
      !magicLinkSent &&
      !sendingMagicLink
    ) {
      setSendingMagicLink(true);
      await triggerMagicLink(cvData.personal.email);
      setSendingMagicLink(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">{tStep('title')}</h2>
        <p className="text-slate-600">{tStep('subtitle')}</p>
      </div>

      <div>
        <Input
          type="email"
          label={t('email')}
          icon={Mail}
          value={cvData.personal.email}
          onChange={(e) => updatePersonal('email', e.target.value)}
          onBlur={handleEmailBlur}
          required
          tooltip={tip('email')}
          showValidCheck={!magicLinkSent}
          success={magicLinkSent && emailTouched}
          successMessage={t('magicLinkSentInfo')}
        />
        {sendingMagicLink && (
          <p className="mt-1.5 text-sm text-slate-500 flex items-center gap-1">
            <Loader2 className="animate-spin w-4 h-4" />
            {t('sendingMagicLink')}
          </p>
        )}
      </div>

      <Input
        type="tel"
        label={`${t('phone')} ${t('optionalSuffix')}`}
        icon={Phone}
        value={cvData.personal.phone}
        onChange={(e) => updatePersonal('phone', e.target.value)}
        tooltip={tip('phone')}
      />

      <div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={`${t('postalCode')} ${t('optionalSuffix')}`}
            icon={MapPin}
            value={cvData.personal.postalCode}
            onChange={(e) => handlePostcodeChange(e.target.value)}
            tooltip={supportsAddressLookup ? tip('postalCode') : undefined}
          />
          <Input
            label={`${t('houseNumber')} ${t('optionalSuffix')}`}
            value={cvData.personal.houseNumber}
            onChange={(e) => handleHouseNumberChange(e.target.value)}
            tooltip={supportsAddressLookup ? tip('houseNumber') : undefined}
          />
        </div>

        {!supportsAddressLookup && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input
              label={`${t('address')} ${t('optionalSuffix')}`}
              value={cvData.personal.address}
              onChange={(e) => updatePersonal('address', e.target.value)}
            />
            <Input
              label={`${t('city')} ${t('optionalSuffix')}`}
              value={cvData.personal.city}
              onChange={(e) => updatePersonal('city', e.target.value)}
            />
          </div>
        )}

        {supportsAddressLookup && lookingUpAddress && (
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t('lookingUpAddress')}</span>
          </div>
        )}
        {supportsAddressLookup && !lookingUpAddress && cvData.personal.address && cvData.personal.city && (
          <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600">
            <CheckCircle className="w-4 h-4" />
            <span>{cvData.personal.address} {cvData.personal.houseNumber}, {cvData.personal.city}</span>
          </div>
        )}
        {addressError && (
          <div className="mt-2 text-sm text-amber-600">{addressError}</div>
        )}
      </div>
    </div>
  );
}
