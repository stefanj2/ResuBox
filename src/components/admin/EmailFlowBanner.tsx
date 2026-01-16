'use client';

import { Mail, FileText, Bell, AlertTriangle, ChevronRight } from 'lucide-react';

interface EmailFlowBannerProps {
  testMode?: boolean;
}

export function EmailFlowBanner({ testMode }: EmailFlowBannerProps) {
  const steps = testMode
    ? [
        { label: 'Bevestiging', time: '10s', icon: Mail, color: 'text-blue-600 bg-blue-100' },
        { label: 'Factuur', time: '30s', icon: FileText, color: 'text-purple-600 bg-purple-100' },
        { label: '1e Herinnering', time: '1m', icon: Bell, color: 'text-orange-600 bg-orange-100' },
        { label: 'WIK-brief', time: '2m', icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
      ]
    : [
        { label: 'Bevestiging', time: '4 uur', icon: Mail, color: 'text-blue-600 bg-blue-100' },
        { label: 'Factuur', time: '24 uur', icon: FileText, color: 'text-purple-600 bg-purple-100' },
        { label: '1e Herinnering', time: '7 dagen', icon: Bell, color: 'text-orange-600 bg-orange-100' },
        { label: 'WIK-brief', time: '14 dagen', icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
      ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h3 className="text-sm font-medium text-slate-700 mb-4">
        Automatische Email Flow
        {testMode && (
          <span className="ml-2 text-xs font-normal text-amber-600">(Test modus)</span>
        )}
      </h3>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`p-2.5 rounded-lg ${step.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-700">{step.label}</p>
                <p className="text-xs text-slate-400">{step.time}</p>
              </div>
              {!isLast && (
                <ChevronRight className="w-5 h-5 text-slate-300 mx-2 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
