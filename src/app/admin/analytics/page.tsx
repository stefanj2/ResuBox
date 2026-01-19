'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AnalyticsStats, FunnelStep } from '@/types/admin';
import { TrendingUp, TrendingDown, Users, Target, ArrowRight, RefreshCw } from 'lucide-react';

// Period options for filtering
const periodOptions = [
  { value: 7, label: 'Afgelopen 7 dagen' },
  { value: 14, label: 'Afgelopen 14 dagen' },
  { value: 30, label: 'Afgelopen 30 dagen' },
  { value: 90, label: 'Afgelopen 90 dagen' },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState(30);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/analytics/stats?days=${period}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader onRefresh={handleRefresh} refreshing={refreshing} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-500 mt-1">
              Gebruikersflow en conversie inzichten
            </p>
          </div>

          {/* Period Selector */}
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Totaal Sessies"
            value={stats?.totalSessions || 0}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Voltooide Downloads"
            value={stats?.completedSessions || 0}
            icon={Target}
            color="emerald"
          />
          <StatCard
            title="Conversiepercentage"
            value={`${(stats?.conversionRate || 0).toFixed(1)}%`}
            icon={stats?.conversionRate && stats.conversionRate > 5 ? TrendingUp : TrendingDown}
            color={stats?.conversionRate && stats.conversionRate > 5 ? 'emerald' : 'amber'}
          />
        </div>

        {/* Funnel Visualization */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Gebruikersfunnel
          </h2>

          {stats && stats.totalSessions > 0 ? (
            <div className="space-y-4">
              {stats.funnel.map((step, index) => (
                <FunnelStepRow
                  key={step.id}
                  step={step}
                  isLast={index === stats.funnel.length - 1}
                  totalSessions={stats.totalSessions}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Insights Section */}
        {stats && stats.totalSessions > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Inzichten
            </h2>
            <InsightsPanel funnel={stats.funnel} totalSessions={stats.totalSessions} />
          </div>
        )}
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'emerald' | 'amber';
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-slate-500">{title}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

interface FunnelStepRowProps {
  step: FunnelStep;
  isLast: boolean;
  totalSessions: number;
}

function FunnelStepRow({ step, isLast, totalSessions }: FunnelStepRowProps) {
  const widthPercentage = totalSessions > 0 ? (step.count / totalSessions) * 100 : 0;
  const barWidth = Math.max(widthPercentage, 5); // Minimum 5% for visibility

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        {/* Step Number */}
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600 flex-shrink-0">
          {step.id + 1}
        </div>

        {/* Step Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-slate-900">{step.name}</span>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-slate-900">{step.count}</span>
              <span className="text-slate-500">
                ({step.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg transition-all duration-500 ease-out"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Drop-off indicator */}
      {!isLast && step.dropOffCount > 0 && (
        <div className="ml-12 mt-2 mb-4 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-red-400 rotate-90" />
          <span className="text-sm text-red-500">
            -{step.dropOffCount} uitgevallen ({step.dropOffPercentage.toFixed(1)}%)
          </span>
        </div>
      )}
    </div>
  );
}

interface InsightsPanelProps {
  funnel: FunnelStep[];
  totalSessions: number;
}

function InsightsPanel({ funnel, totalSessions }: InsightsPanelProps) {
  // Find the step with highest drop-off
  const worstStep = funnel.reduce((worst, current) =>
    current.dropOffPercentage > worst.dropOffPercentage ? current : worst
  , funnel[0]);

  // Find completion rate from first step to download
  const downloadStep = funnel.find(s => s.name === 'Download');
  const firstStep = funnel[0];

  const overallDropOff = firstStep && downloadStep
    ? ((firstStep.count - downloadStep.count) / firstStep.count) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Biggest Drop-off */}
      {worstStep && worstStep.dropOffPercentage > 0 && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <h3 className="font-medium text-red-800 mb-1">
            Grootste Uitval
          </h3>
          <p className="text-sm text-red-600">
            <strong>{worstStep.dropOffPercentage.toFixed(1)}%</strong> van de gebruikers
            haakt af na <strong>{worstStep.name}</strong>.
          </p>
          <p className="text-xs text-red-500 mt-2">
            Overweeg deze stap te vereenvoudigen of meer begeleiding toe te voegen.
          </p>
        </div>
      )}

      {/* Overall Stats */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-1">
          Totale Funnel
        </h3>
        <p className="text-sm text-blue-600">
          Van de <strong>{totalSessions}</strong> bezoekers bereikt{' '}
          <strong>{downloadStep?.count || 0}</strong> de download stap.
        </p>
        <p className="text-xs text-blue-500 mt-2">
          Totale uitval: {overallDropOff.toFixed(1)}%
        </p>
      </div>

      {/* Recommendation */}
      {worstStep && worstStep.dropOffPercentage > 30 && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 md:col-span-2">
          <h3 className="font-medium text-amber-800 mb-1">
            Aanbeveling
          </h3>
          <p className="text-sm text-amber-600">
            De stap &quot;{worstStep.name}&quot; heeft een hoge uitval. Mogelijke verbeteringen:
          </p>
          <ul className="text-xs text-amber-500 mt-2 list-disc list-inside space-y-1">
            {worstStep.id === 0 && (
              <>
                <li>Voeg meer begeleiding toe bij het invullen van persoonlijke gegevens</li>
                <li>Maak het formulier korter of splits het op in substappen</li>
              </>
            )}
            {worstStep.id === 1 && (
              <>
                <li>Bied voorbeelden van werkervaring beschrijvingen</li>
                <li>Maak het toevoegen van ervaring optioneel voor starters</li>
              </>
            )}
            {worstStep.id === 2 && (
              <>
                <li>Vereenvoudig het toevoegen van opleidingen</li>
                <li>Voeg suggesties toe voor veelvoorkomende opleidingen</li>
              </>
            )}
            {worstStep.id === 3 && (
              <>
                <li>Bied een lijst met suggesties voor vaardigheden</li>
                <li>Verlaag het minimum aantal vereiste vaardigheden</li>
              </>
            )}
            {worstStep.id === 4 && (
              <>
                <li>Genereer automatisch een profiel suggestie op basis van ingevulde data</li>
                <li>Bied templates voor profielteksten</li>
              </>
            )}
            {worstStep.id === 5 && (
              <>
                <li>Maak de prijs duidelijker zichtbaar eerder in het proces</li>
                <li>Overweeg een gratis preview of watermerk optie</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <TrendingUp className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-1">
        Nog geen data beschikbaar
      </h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto">
        Er zijn nog geen analytics events geregistreerd in de geselecteerde periode.
        Data wordt verzameld zodra gebruikers de CV builder gebruiken.
      </p>
    </div>
  );
}
