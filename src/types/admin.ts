// Admin Dashboard Types for CV Orders

import { CVData } from './cv';

export type OrderStatus =
  | 'nieuw'
  | 'bevestigd'
  | 'factuur_verstuurd'
  | 'herinnering_1'
  | 'herinnering_2'
  | 'herinnering_3'
  | 'incasso_overgedragen'
  | 'incasso_manual_review'
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

  // Locale at download time — drives email/SMS/checkout/collections language
  locale: string;

  // Financial
  amount: number;
  dossier_number?: string;

  // Stripe payment
  stripe_session_id?: string;
  stripe_payment_status?: string;
  payment_link?: string;
  paid_at?: string;

  // Email tracking
  confirmation_sent_at?: string;
  invoice_sent_at?: string;
  reminder_1_sent_at?: string;
  reminder_2_sent_at?: string;
  reminder_3_sent_at?: string;
  incasso_sent_at?: string;
  // SMS tracking (7d after invoice, then 7d later)
  sms_1_sent_at?: string;
  sms_2_sent_at?: string;

  // Justus Collect (incasso)
  justus_case_id?: string;
  justus_case_number?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export type ActionType =
  | 'order_created'
  | 'status_changed'
  | 'email_sent'
  | 'sms_sent'
  | 'sms_failed'
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
