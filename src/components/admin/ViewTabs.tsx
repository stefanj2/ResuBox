'use client';

import { Users, AlertCircle, CheckCircle } from 'lucide-react';

export type ViewMode = 'all' | 'debiteurs' | 'betaald';

interface ViewTabsProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  counts: {
    all: number;
    debiteurs: number;
    betaald: number;
  };
}

export function ViewTabs({ activeView, onViewChange, counts }: ViewTabsProps) {
  const tabs = [
    {
      id: 'all' as const,
      label: 'Alle Orders',
      icon: Users,
      count: counts.all,
      color: 'slate',
    },
    {
      id: 'debiteurs' as const,
      label: 'Debiteurenbeheer',
      icon: AlertCircle,
      count: counts.debiteurs,
      color: 'amber',
      description: 'Openstaande facturen',
    },
    {
      id: 'betaald' as const,
      label: 'Betaald',
      icon: CheckCircle,
      count: counts.betaald,
      color: 'emerald',
      description: 'Afgeronde betalingen',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-1 inline-flex gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
              isActive
                ? tab.color === 'emerald'
                  ? 'bg-emerald-100 text-emerald-700'
                  : tab.color === 'amber'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-700'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                isActive
                  ? tab.color === 'emerald'
                    ? 'bg-emerald-200 text-emerald-800'
                    : tab.color === 'amber'
                    ? 'bg-amber-200 text-amber-800'
                    : 'bg-slate-200 text-slate-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
