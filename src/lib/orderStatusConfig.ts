import {
  Clock,
  FileText,
  Send,
  AlertTriangle,
  CheckCircle,
  Ban,
  Gavel,
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
    label: '2e Herinnering',
    color: 'text-orange-800',
    bgColor: 'bg-orange-100',
    icon: Send,
    description: 'Tweede herinnering + SMS verstuurd',
  },
  herinnering_3: {
    label: '3e Herinnering (WIK)',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: AlertTriangle,
    description: 'WIK-aanmaning (laatste formele waarschuwing) + SMS verstuurd',
  },
  incasso_overgedragen: {
    label: 'Incasso',
    color: 'text-red-900',
    bgColor: 'bg-red-200',
    icon: Gavel,
    description: 'Dossier overgedragen aan incassobureau (Justus Collect)',
  },
  incasso_manual_review: {
    label: 'Incasso (handmatig)',
    color: 'text-purple-900',
    bgColor: 'bg-purple-100',
    icon: AlertTriangle,
    description: 'Klaar voor incasso, wacht op handmatige overdracht (geen partner in dit land)',
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
  'herinnering_3',
  'incasso_overgedragen',
  'incasso_manual_review',
  'betaald',
  'afgeboekt',
];

// Email flow timing (in milliseconds)
// Email + SMS flow timing (offset from order created_at, in milliseconds).
// Mirrors the globalopzegging / Quitivo flow: invoice T+24h, then four
// touchpoints with two interleaved SMS reminders, then collections at T+28d.
export const EMAIL_FLOW_TIMING = {
  invoice: 24 * 60 * 60 * 1000, // T+24h — factuur met betaallink
  reminder_1: 3 * 24 * 60 * 60 * 1000, // T+3d — vriendelijke herinnering
  reminder_2: 7 * 24 * 60 * 60 * 1000, // T+7d — 2e herinnering (+ SMS 1)
  reminder_3: 10 * 24 * 60 * 60 * 1000, // T+10d — pre-aanmaning (laatste waarschuwing voor WIK)
  wik: 14 * 24 * 60 * 60 * 1000, // T+14d — formele WIK-aanmaning (+ SMS 2). 14d grace start hier.
  incasso: 28 * 24 * 60 * 60 * 1000, // T+28d — overdracht aan Justus Collect (alleen NL)
  sms_1: 7 * 24 * 60 * 60 * 1000, // T+7d — SMS reminder 1 (parallel met reminder_2 email)
  sms_2: 14 * 24 * 60 * 60 * 1000, // T+14d — SMS reminder 2 (parallel met WIK email)
};

// For test mode (much shorter intervals)
export const EMAIL_FLOW_TIMING_TEST = {
  invoice: 10 * 1000, // 10 seconds
  reminder_1: 20 * 1000, // 20 seconds
  reminder_2: 30 * 1000, // 30 seconds
  reminder_3: 45 * 1000, // 45 seconds
  wik: 60 * 1000, // 60 seconds
  incasso: 90 * 1000, // 90 seconds
  sms_1: 30 * 1000, // 30 seconds (parallel met reminder_2)
  sms_2: 60 * 1000, // 60 seconds (parallel met wik)
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
    'herinnering_3',
    'incasso_overgedragen',
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
    'incasso_overgedragen',
  ];

  const fromIndex = flowOrder.indexOf(from);
  const toIndex = flowOrder.indexOf(to);

  // Can only go forward in the flow, or directly to next step
  return toIndex === fromIndex + 1;
}
