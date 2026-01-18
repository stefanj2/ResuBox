import {
  Clock,
  FileText,
  Send,
  AlertTriangle,
  CheckCircle,
  Ban,
  LucideIcon,
} from 'lucide-react';
import { OrderStatus } from '@/types/admin';

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
  description: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  nieuw: {
    label: 'Nieuw',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: Clock,
    description: 'Order is aangemaakt, wacht op bevestiging',
  },
  bevestigd: {
    label: 'Bevestigd',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: FileText,
    description: 'Bevestigingsmail verstuurd',
  },
  factuur_verstuurd: {
    label: 'Factuur verstuurd',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: Send,
    description: 'Factuur met betaallink is verstuurd',
  },
  herinnering_1: {
    label: '1e Herinnering',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: Send,
    description: 'Eerste betalingsherinnering verstuurd',
  },
  herinnering_2: {
    label: '2e Herinnering (WIK)',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: AlertTriangle,
    description: 'WIK-brief (laatste aanmaning) verstuurd',
  },
  betaald: {
    label: 'Betaald',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    icon: CheckCircle,
    description: 'Betaling ontvangen',
  },
  afgeboekt: {
    label: 'Afgeboekt',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    icon: Ban,
    description: 'Order is afgeboekt (niet betaald)',
  },
};

export const ORDER_STATUSES: OrderStatus[] = [
  'nieuw',
  'bevestigd',
  'factuur_verstuurd',
  'herinnering_1',
  'herinnering_2',
  'betaald',
  'afgeboekt',
];

// Email flow timing (in milliseconds)
export const EMAIL_FLOW_TIMING = {
  invoice: 4 * 60 * 60 * 1000, // 4 hours after order - factuur met betaallink
  reminder_1: 7 * 24 * 60 * 60 * 1000, // 7 days after order
  reminder_2: 14 * 24 * 60 * 60 * 1000, // 14 days after order
};

// For test mode (much shorter intervals)
export const EMAIL_FLOW_TIMING_TEST = {
  invoice: 10 * 1000, // 10 seconds - factuur met betaallink
  reminder_1: 30 * 1000, // 30 seconds
  reminder_2: 60 * 1000, // 1 minute
};

export function getStatusConfig(status: OrderStatus): StatusConfig {
  return ORDER_STATUS_CONFIG[status];
}

export function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
  const flow: OrderStatus[] = [
    'nieuw',
    'bevestigd',
    'factuur_verstuurd',
    'herinnering_1',
    'herinnering_2',
  ];

  const currentIndex = flow.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === flow.length - 1) {
    return null;
  }
  return flow[currentIndex + 1];
}

export function canTransitionTo(from: OrderStatus, to: OrderStatus): boolean {
  // Always can mark as paid or afgeboekt
  if (to === 'betaald' || to === 'afgeboekt') {
    return from !== 'betaald' && from !== 'afgeboekt';
  }

  // Normal flow transitions
  const flowOrder: OrderStatus[] = [
    'nieuw',
    'bevestigd',
    'factuur_verstuurd',
    'herinnering_1',
    'herinnering_2',
  ];

  const fromIndex = flowOrder.indexOf(from);
  const toIndex = flowOrder.indexOf(to);

  // Can only go forward in the flow, or directly to next step
  return toIndex === fromIndex + 1;
}
