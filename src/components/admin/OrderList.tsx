'use client';

import { CVOrder } from '@/types/admin';
import { StatusBadge } from './StatusBadge';
import { User, Mail, Calendar, ChevronRight, FileText } from 'lucide-react';

interface OrderListProps {
  orders: CVOrder[];
  selectedOrderId?: string;
  onSelectOrder: (order: CVOrder) => void;
  loading?: boolean;
}

export function OrderList({ orders, selectedOrderId, onSelectOrder, loading }: OrderListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500 font-medium">Geen orders gevonden</p>
        <p className="text-sm text-slate-400 mt-1">
          Pas de filters aan om resultaten te zien
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => {
        const isSelected = order.id === selectedOrderId;

        return (
          <button
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className={`w-full text-left bg-white rounded-lg border p-4 transition-all ${
              isSelected
                ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-slate-500" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-slate-900 truncate">
                    {order.customer_name}
                  </h3>
                  <StatusBadge status={order.status} size="sm" showIcon={false} />
                </div>

                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    {order.customer_email}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(order.created_at)}
                    </span>
                    {order.dossier_number && (
                      <span className="font-mono">{order.dossier_number}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {formatCurrency(order.amount)}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isSelected ? 'text-emerald-500' : 'text-slate-300'
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
