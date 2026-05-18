'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { User, Mail, Phone, MapPin, Calendar, Globe, Linkedin, CheckCircle, Camera, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui';
import { useCVData } from '@/context/CVContext';

const ADDRESS_LOOKUP_LOCALES = new Set(['nl']);

const PROFILE_PHOTO_MAX_DIMENSION = 600;
const PROFILE_PHOTO_JPEG_QUALITY = 0.85;

async function resizeProfilePhoto(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('FileReader error'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not decode image'));
    image.src = dataUrl;
  });

  const scale = Math.min(1, PROFILE_PHOTO_MAX_DIMENSION / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', PROFILE_PHOTO_JPEG_QUALITY);
}

export function PersonalSection() {
  const { cvData, updatePersonal, triggerMagicLink, magicLinkSent } = useCVData();
  const t = useTranslations('Builder.personalSection');
  const locale = useLocale();
  const [emailTouched, setEmailTouched] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);
  const [lookingUpAddress, setLookingUpAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(t('onlyImages'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      const resized = await resizeProfilePhoto(file);
      updatePersonal('profilePhoto', resized);
    } catch (err) {
      console.error('Photo resize failed:', err);
      alert(t('photoUploadFailed'));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removePhoto = () => {
    updatePersonal('profilePhoto', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('title')}</h2>
        <p className="text-slate-600">{t('subtitle')}</p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {cvData.personal.profilePhoto ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cvData.personal.profilePhoto}
                alt={t('photo')}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
              />
              <button
                onClick={removePhoto}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                title={t('removePhoto')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:bg-slate-50 hover:border-emerald-500 transition-colors cursor-pointer"
            >
              <Camera className="w-6 h-6 text-slate-400" />
              <span className="text-xs text-slate-500 mt-1">{t('photo')}</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-700 mb-1">{t('photo')}</p>
          <p className="text-xs text-slate-500 mb-2">{t('photoHint')}</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {cvData.personal.profilePhoto ? t('chooseOtherPhoto') : t('uploadPhoto')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('firstName')}
          icon={User}
          value={cvData.personal.firstName}
          onChange={(e) => updatePersonal('firstName', e.target.value)}
          required
        />
        <Input
          label={t('lastName')}
          value={cvData.personal.lastName}
          onChange={(e) => updatePersonal('lastName', e.target.value)}
          required
        />
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
        label={t('phone')}
        icon={Phone}
        value={cvData.personal.phone}
        onChange={(e) => updatePersonal('phone', e.target.value)}
      />

      <div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('postalCode')}
            icon={MapPin}
            value={cvData.personal.postalCode}
            onChange={(e) => handlePostcodeChange(e.target.value)}
          />
          <Input
            label={t('houseNumber')}
            value={cvData.personal.houseNumber}
            onChange={(e) => handleHouseNumberChange(e.target.value)}
          />
        </div>

        {!supportsAddressLookup && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Input
              label={t('address')}
              value={cvData.personal.address}
              onChange={(e) => updatePersonal('address', e.target.value)}
            />
            <Input
              label={t('city')}
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

      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-medium text-slate-500 mb-4">{t('optionalSection')}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            label={t('dateOfBirth')}
            icon={Calendar}
            value={cvData.personal.dateOfBirth}
            onChange={(e) => updatePersonal('dateOfBirth', e.target.value)}
          />
          <Input
            label={t('nationality')}
            value={cvData.personal.nationality}
            onChange={(e) => updatePersonal('nationality', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input
            label={t('linkedIn')}
            icon={Linkedin}
            value={cvData.personal.linkedIn}
            onChange={(e) => updatePersonal('linkedIn', e.target.value)}
          />
          <Input
            label={t('website')}
            icon={Globe}
            value={cvData.personal.website}
            onChange={(e) => updatePersonal('website', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
