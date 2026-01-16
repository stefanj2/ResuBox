'use client';

import { CVOrder } from '@/types/admin';
import { User, Clock } from 'lucide-react';

interface OrderCardProps {
  order: CVOrder;
  onClick: () => void;
  selected?: boolean;
}

export function OrderCard({ order, onClick, selected }: OrderCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Nu';
    if (diffMins < 60) return `${diffMins}m geleden`;
    if (diffHours < 24) return `${diffHours}u geleden`;
    if (diffDays < 7) return `${diffDays}d geleden`;
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-lg border p-3 transition-all ${
        selected
          ? 'border-emerald-500 ring-2 ring-emerald-100'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-900 truncate">
            {order.customer_name}
          </h4>
          <p className="text-xs text-slate-500 truncate">{order.customer_email}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(order.created_at)}
            </span>
            <span className="text-xs font-medium text-slate-600">
              {formatCurrency(order.amount)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
