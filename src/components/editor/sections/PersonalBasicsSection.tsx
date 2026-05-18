'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { User, Camera, X } from 'lucide-react';
import { Input } from '@/components/ui';
import { useCVData } from '@/context/CVContext';

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

/** First personal sub-step: photo + first/last name. Fits one viewport. */
export function PersonalBasicsSection() {
  const { cvData, updatePersonal } = useCVData();
  const t = useTranslations('Builder.personalSection');
  const tip = useTranslations('Builder.personalSection.tooltips');
  const tStep = useTranslations('Builder.personalBasics');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">{tStep('title')}</h2>
        <p className="text-slate-600">{tStep('subtitle')}</p>
      </div>

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
          <p className="text-sm font-medium text-slate-700 mb-1">
            {t('photo')} <span className="text-slate-400 font-normal">{t('optionalSuffix')}</span>
          </p>
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
          tooltip={tip('firstName')}
          showValidCheck
        />
        <Input
          label={t('lastName')}
          value={cvData.personal.lastName}
          onChange={(e) => updatePersonal('lastName', e.target.value)}
          required
          tooltip={tip('lastName')}
          showValidCheck
        />
      </div>
    </div>
  );
}
