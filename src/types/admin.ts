// Admin Dashboard Types for CV Orders

import { CVData } from './cv';

export type OrderStatus =
  | 'nieuw'
  | 'bevestigd'
  | 'factuur_verstuurd'
  | 'herinnering_1'
  | 'herinnering_2'
  | 'betaald'
  | 'afgeboekt';

export interface CVOrder {
  id: string;
  status: OrderStatus;

  // Customer data (from CVData)
  customer_name: string;
  customer_email: string;
  customer_phone?: string;

  // Address data (for debt collection letters)
  customer_address?: string;
  customer_house_number?: string;
  customer_postal_code?: string;
  customer_city?: string;

  // CV reference
  cv_id?: string;
  template_used?: string;
  cv_data?: CVData; // Full CV data for regenerating PDF

  // Financial
  amount: number;
  dossier_number?: string;

  // Mollie payment
  mollie_payment_id?: string;
  mollie_payment_status?: string;
  payment_link?: string;
  paid_at?: string;

  // Email tracking
  confirmation_sent_at?: string;
  invoice_sent_at?: string;
  reminder_1_sent_at?: string;
  reminder_2_sent_at?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export type ActionType =
  | 'order_created'
  | 'status_changed'
  | 'email_sent'
  | 'payment_created'
  | 'payment_received'
  | 'payment_failed'
  | 'manual_action'
  | 'note_added';

export interface OrderAction {
  id: string;
  order_id: string;
  action_type: ActionType;
  action_description: string;
  performed_by: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface OrderWithActions extends CVOrder {
  actions: OrderAction[];
}

export interface OrderFilters {
  search: string;
  status: OrderStatus | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface OrderStatistics {
  total: number;
  byStatus: Record<OrderStatus, number>;
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface AdminUser {
  username: string;
  authenticated: boolean;
}

// Analytics Types for User Journey Tracking
export type AnalyticsEventType =
  | 'session_start'
  | 'section_view'
  | 'section_complete'
  | 'download_initiated'
  | 'download_completed'
  | 'payment_started'
  | 'session_end';

export interface AnalyticsEvent {
  id: string;
  session_id: string;
  event_type: AnalyticsEventType;
  section_id?: number; // 0-4 for form sections
  section_name?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface FunnelStep {
  id: number;
  name: string;
  count: number;
  percentage: number;
  dropOffCount: number;
  dropOffPercentage: number;
}

export interface AnalyticsStats {
  totalSessions: number;
  completedSessions: number; // sessions that reached download
  conversionRate: number;
  funnel: FunnelStep[];
  periodStart: string;
  periodEnd: string;
}
