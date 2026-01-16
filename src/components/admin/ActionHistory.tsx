'use client';

import { OrderAction } from '@/types/admin';
import {
  FileText,
  Mail,
  CreditCard,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface ActionHistoryProps {
  actions: OrderAction[];
}

const ACTION_ICONS: Record<string, typeof FileText> = {
  order_created: Plus,
  status_changed: RefreshCw,
  email_sent: Mail,
  payment_created: CreditCard,
  payment_received: CheckCircle,
  payment_failed: XCircle,
  manual_action: AlertCircle,
  note_added: MessageSquare,
};

const ACTION_COLORS: Record<string, string> = {
  order_created: 'text-blue-600 bg-blue-50',
  status_changed: 'text-purple-600 bg-purple-50',
  email_sent: 'text-emerald-600 bg-emerald-50',
  payment_created: 'text-amber-600 bg-amber-50',
  payment_received: 'text-emerald-600 bg-emerald-50',
  payment_failed: 'text-red-600 bg-red-50',
  manual_action: 'text-orange-600 bg-orange-50',
  note_added: 'text-slate-600 bg-slate-50',
};

export function ActionHistory({ actions }: ActionHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (actions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Geen acties gevonden</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {actions.map((action, index) => {
          const Icon = ACTION_ICONS[action.action_type] || FileText;
          const colorClasses = ACTION_COLORS[action.action_type] || 'text-slate-600 bg-slate-50';
          const isLast = index === actions.length - 1;

          return (
            <li key={action.id}>
              <div className="relative pb-8">
                {/* Connector line */}
                {!isLast && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  {/* Icon */}
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${colorClasses}`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1.5">
                    <p className="text-sm text-slate-900">{action.action_description}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span>{formatDate(action.created_at)}</span>
                      <span>•</span>
                      <span className="capitalize">{action.performed_by}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
