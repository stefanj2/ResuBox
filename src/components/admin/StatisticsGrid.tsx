'use client';

import { OrderStatistics, OrderStatus } from '@/types/admin';
import { ORDER_STATUS_CONFIG } from '@/lib/orderStatusConfig';
import { Euro, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface StatisticsGridProps {
  statistics: OrderStatistics;
  onStatusClick?: (status: OrderStatus | 'all') => void;
  activeStatus?: OrderStatus | 'all';
}

export function StatisticsGrid({ statistics, onStatusClick, activeStatus = 'all' }: StatisticsGridProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Main summary cards
  const summaryCards = [
    {
      label: 'Totaal Orders',
      value: statistics.total.toString(),
      icon: TrendingUp,
      color: 'text-slate-700',
      bgColor: 'bg-slate-50',
      status: 'all' as const,
    },
    {
      label: 'Openstaand',
      value: formatCurrency(statistics.pendingRevenue),
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Betaald',
      value: formatCurrency(statistics.paidRevenue),
      icon: CheckCircle,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      status: 'betaald' as const,
    },
    {
      label: 'Totaal Omzet',
      value: formatCurrency(statistics.totalRevenue),
      icon: Euro,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          const isClickable = card.status !== undefined;
          const isActive = card.status === activeStatus;

          return (
            <button
              key={card.label}
              onClick={() => isClickable && onStatusClick?.(card.status!)}
              disabled={!isClickable}
              className={`p-4 rounded-xl border transition-all text-left ${
                isActive
                  ? 'border-emerald-500 ring-2 ring-emerald-100'
                  : 'border-slate-200'
              } ${
                isClickable
                  ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm'
                  : 'cursor-default'
              } ${card.bgColor}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/60`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">{card.label}</p>
                  <p className={`text-lg font-semibold ${card.color}`}>{card.value}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Status Verdeling</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ORDER_STATUS_CONFIG) as OrderStatus[]).map((status) => {
            const config = ORDER_STATUS_CONFIG[status];
            const count = statistics.byStatus[status];
            const isActive = status === activeStatus;

            return (
              <button
                key={status}
                onClick={() => onStatusClick?.(status)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  config.bgColor
                } ${config.color} ${
                  isActive
                    ? 'ring-2 ring-offset-1 ring-current'
                    : 'hover:ring-1 hover:ring-offset-1 hover:ring-current'
                }`}
              >
                <span>{config.label}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/50 text-xs">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
