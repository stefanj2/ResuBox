'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { Input, TextArea, Button, Card } from '@/components/ui';
import { useCVData } from '@/context/CVContext';
import { createEmptyEducation } from '@/types/cv';

export function EducationSection() {
  const { cvData, addEducation, updateEducation, removeEducation } = useCVData();
  const [expandedId, setExpandedId] = useState<string | null>(
    cvData.education.length > 0 ? cvData.education[0].id : null
  );

  const handleAddEducation = () => {
    const newEdu = createEmptyEducation();
    addEducation(newEdu);
    setExpandedId(newEdu.id);
  };

  // Suggesties voor opleidingen
  const degreeSuggestions = [
    'HBO Bachelor',
    'WO Bachelor',
    'WO Master',
    'MBO Niveau 4',
    'VWO',
    'HAVO',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Opleiding</h2>
        <p className="text-slate-600">
          Voeg je opleidingen toe, beginnend met de hoogste of meest recente.
        </p>
      </div>

      {/* Quick add suggestions */}
      {cvData.education.length === 0 && (
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-sm font-medium text-slate-700 mb-3">Snel toevoegen:</p>
          <div className="flex flex-wrap gap-2">
            {degreeSuggestions.map((degree) => (
              <button
                key={degree}
                onClick={() => {
                  const newEdu = createEmptyEducation();
                  newEdu.degree = degree;
                  addEducation(newEdu);
                  setExpandedId(newEdu.id);
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
              >
                {degree}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Education Cards */}
      <div className="space-y-4">
        {cvData.education.map((edu, index) => (
          <Card key={edu.id} padding="none" className="overflow-hidden">
            {/* Header - Always visible */}
            <button
              onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">
                    {edu.degree || 'Nieuwe opleiding'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {edu.institution || 'Onderwijsinstelling'}
                    {edu.startDate && ` • ${edu.startDate}`}
                    {edu.endDate && ` - ${edu.endDate}`}
                    {edu.current && ' - Heden'}
                  </p>
                </div>
              </div>
              {expandedId === edu.id ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Expanded Content */}
            {expandedId === edu.id && (
              <div className="px-4 pb-4 space-y-4 border-t border-slate-100 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Opleiding / Diploma"
                    placeholder="HBO Bachelor Bedrijfskunde"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    required
                  />
                  <Input
                    label="Onderwijsinstelling"
                    placeholder="Hogeschool van Amsterdam"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Locatie"
                  placeholder="Amsterdam"
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="month"
                    label="Startdatum"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                  />
                  <div>
                    <Input
                      type="month"
                      label="Einddatum"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      disabled={edu.current}
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => updateEducation(edu.id, { 
                          current: e.target.checked,
                          endDate: e.target.checked ? '' : edu.endDate
                        })}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-600">Ik volg deze opleiding nog</span>
                    </label>
                  </div>
                </div>

                <TextArea
                  label="Extra informatie (optioneel)"
                  placeholder="Bijv. specialisatie, minor, gemiddeld cijfer, relevante vakken..."
                  value={edu.description}
                  onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                  rows={3}
                />

                {/* Delete button */}
                <div className="pt-4 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Verwijder deze opleiding
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add Education Button */}
      <Button
        variant="outline"
        icon={Plus}
        onClick={handleAddEducation}
        fullWidth
      >
        Opleiding toevoegen
      </Button>
    </div>
  );
}
