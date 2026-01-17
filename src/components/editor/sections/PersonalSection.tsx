'use client';

import React, { useState, useRef, useCallback } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Globe, Linkedin, CheckCircle, Camera, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui';
import { useCVData } from '@/context/CVContext';

export function PersonalSection() {
  const { cvData, updatePersonal, triggerMagicLink, magicLinkSent } = useCVData();
  const [emailTouched, setEmailTouched] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);
  const [lookingUpAddress, setLookingUpAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-lookup address based on postcode and house number
  const lookupAddress = useCallback(async (postcode: string, houseNumber: string) => {
    // Clean postcode (remove spaces)
    const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();

    // Validate: need at least 6 chars for postcode and a house number
    if (cleanPostcode.length < 6 || !houseNumber.trim()) {
      return;
    }

    // Validate postcode format
    const postcodeRegex = /^[1-9][0-9]{3}[A-Z]{2}$/;
    if (!postcodeRegex.test(cleanPostcode)) {
      return;
    }

    setLookingUpAddress(true);
    setAddressError('');

    try {
      const response = await fetch(
        `/api/postcode/lookup?postcode=${encodeURIComponent(cleanPostcode)}&huisnummer=${encodeURIComponent(houseNumber.trim())}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.straat) {
          updatePersonal('address', data.straat);
        }
        if (data.woonplaats) {
          updatePersonal('city', data.woonplaats);
        }
      } else if (response.status === 404) {
        setAddressError('Adres niet gevonden');
      }
    } catch (error) {
      console.error('Address lookup error:', error);
    } finally {
      setLookingUpAddress(false);
    }
  }, [updatePersonal]);

  const handlePostcodeChange = (value: string) => {
    updatePersonal('postalCode', value);
    // Trigger lookup if house number is already filled
    if (cvData.personal.houseNumber) {
      lookupAddress(value, cvData.personal.houseNumber);
    }
  };

  const handleHouseNumberChange = (value: string) => {
    updatePersonal('houseNumber', value);
    // Trigger lookup if postcode is already filled
    if (cvData.personal.postalCode) {
      lookupAddress(cvData.personal.postalCode, value);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('De foto is te groot. Maximaal 2MB toegestaan.');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Alleen afbeeldingen zijn toegestaan.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      updatePersonal('profilePhoto', base64);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updatePersonal('profilePhoto', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmailBlur = async () => {
    setEmailTouched(true);
    
    // Alleen magic link sturen als:
    // 1. Email is ingevuld en valid
    // 2. Er nog geen magic link is gestuurd
    // 3. We zijn niet al bezig met versturen
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Persoonsgegevens</h2>
        <p className="text-slate-600">
          Vul je contactgegevens in zodat recruiters je kunnen bereiken.
        </p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {cvData.personal.profilePhoto ? (
            <div className="relative">
              <img
                src={cvData.personal.profilePhoto}
                alt="Profielfoto"
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
              />
              <button
                onClick={removePhoto}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Foto verwijderen"
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
              <span className="text-xs text-slate-500 mt-1">Foto</span>
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
          <p className="text-sm font-medium text-slate-700 mb-1">Profielfoto</p>
          <p className="text-xs text-slate-500 mb-2">
            Voeg een professionele foto toe aan je CV. Max 2MB.
          </p>
          {cvData.personal.profilePhoto ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Andere foto kiezen
            </button>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Upload foto
            </button>
          )}
        </div>
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Voornaam"
          placeholder="Jan"
          icon={User}
          value={cvData.personal.firstName}
          onChange={(e) => updatePersonal('firstName', e.target.value)}
          required
        />
        <Input
          label="Achternaam"
          placeholder="de Vries"
          value={cvData.personal.lastName}
          onChange={(e) => updatePersonal('lastName', e.target.value)}
          required
        />
      </div>

      {/* Email with Magic Link trigger */}
      <div>
        <Input
          type="email"
          label="Emailadres"
          placeholder="jan@voorbeeld.nl"
          icon={Mail}
          value={cvData.personal.email}
          onChange={(e) => updatePersonal('email', e.target.value)}
          onBlur={handleEmailBlur}
          required
          success={magicLinkSent && emailTouched}
          successMessage="Handig: we hebben een herstel-link naar dit adres gestuurd. Hiermee kun je later altijd verdergaan waar je gebleven was."
        />
        {sendingMagicLink && (
          <p className="mt-1.5 text-sm text-slate-500 flex items-center gap-1">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Even geduld, we sturen je een herstel-link...
          </p>
        )}
      </div>

      {/* Phone */}
      <Input
        type="tel"
        label="Telefoonnummer"
        placeholder="06 12345678"
        icon={Phone}
        value={cvData.personal.phone}
        onChange={(e) => updatePersonal('phone', e.target.value)}
      />

      {/* Address */}
      <div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Postcode"
            placeholder="1234 AB"
            icon={MapPin}
            value={cvData.personal.postalCode}
            onChange={(e) => handlePostcodeChange(e.target.value)}
          />
          <Input
            label="Huisnummer"
            placeholder="12a"
            value={cvData.personal.houseNumber}
            onChange={(e) => handleHouseNumberChange(e.target.value)}
          />
        </div>

        {/* Address lookup result */}
        {lookingUpAddress && (
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Adres opzoeken...</span>
          </div>
        )}
        {!lookingUpAddress && cvData.personal.address && cvData.personal.city && (
          <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600">
            <CheckCircle className="w-4 h-4" />
            <span>{cvData.personal.address} {cvData.personal.houseNumber}, {cvData.personal.city}</span>
          </div>
        )}
        {addressError && (
          <div className="mt-2 text-sm text-amber-600">
            {addressError}
          </div>
        )}
      </div>

      {/* Optional fields */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-medium text-slate-500 mb-4">Optioneel</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Geboortedatum"
            icon={Calendar}
            value={cvData.personal.dateOfBirth}
            onChange={(e) => updatePersonal('dateOfBirth', e.target.value)}
          />
          <Input
            label="Nationaliteit"
            placeholder="Nederlands"
            value={cvData.personal.nationality}
            onChange={(e) => updatePersonal('nationality', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input
            label="LinkedIn"
            placeholder="linkedin.com/in/jannaam"
            icon={Linkedin}
            value={cvData.personal.linkedIn}
            onChange={(e) => updatePersonal('linkedIn', e.target.value)}
          />
          <Input
            label="Website"
            placeholder="www.jouwwebsite.nl"
            icon={Globe}
            value={cvData.personal.website}
            onChange={(e) => updatePersonal('website', e.target.value)}
          />
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="flex items-center gap-2 text-sm text-slate-500 pt-4">
        <CheckCircle className="w-4 h-4 text-emerald-500" />
        <span>Wijzigingen worden automatisch opgeslagen</span>
      </div>
    </div>
  );
}
