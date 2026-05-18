'use client';

import React, { useCallback, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui';
import { useCVData } from '@/context/CVContext';

const ADDRESS_LOOKUP_LOCALES = new Set(['nl']);

/**
 * Second personal sub-step: email, phone, address. Email/phone/city are
 * required because recruiters can't reach the candidate without them.
 * Postcode + house number remain helpers — they auto-fill street and city
 * via PDOK lookup on NL, but the candidate can also type the address
 * manually if the lookup fails or doesn't apply to their locale.
 */
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
        <p className="text-slate-600 text-sm">{tStep('subtitle')}</p>
      </div>

      {/* Email + phone — primary contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <Loader2 className="animate-spin w-3.5 h-3.5" />
              {t('sendingMagicLink')}
            </p>
          )}
        </div>

        <Input
          type="tel"
          label={t('phone')}
          icon={Phone}
          value={cvData.personal.phone}
          onChange={(e) => updatePersonal('phone', e.target.value)}
          required
          tooltip={tip('phone')}
          showValidCheck
        />
      </div>

      {/* Address — postcode + house number trigger auto-lookup, street + city
          remain visible and editable so the candidate can always correct or
          enter the address manually. */}
      <div>
        {supportsAddressLookup && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input
              label={t('postalCode')}
              icon={MapPin}
              value={cvData.personal.postalCode}
              onChange={(e) => handlePostcodeChange(e.target.value)}
              tooltip={tip('postalCode')}
            />
            <Input
              label={t('houseNumber')}
              value={cvData.personal.houseNumber}
              onChange={(e) => handleHouseNumberChange(e.target.value)}
              tooltip={tip('houseNumber')}
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={t('address')}
            icon={supportsAddressLookup ? undefined : MapPin}
            value={cvData.personal.address}
            onChange={(e) => updatePersonal('address', e.target.value)}
          />
          <Input
            label={t('city')}
            value={cvData.personal.city}
            onChange={(e) => updatePersonal('city', e.target.value)}
            required
            showValidCheck
          />
        </div>

        {supportsAddressLookup && lookingUpAddress && (
          <p className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {t('lookingUpAddress')}
          </p>
        )}
        {addressError && (
          <p className="mt-2 text-xs text-amber-700">{addressError}</p>
        )}
      </div>
    </div>
  );
}
