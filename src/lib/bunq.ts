/**
 * bunq Payment Client for ResuBox
 *
 * Uses bunq.me tabs for payment requests.
 * Description format: "ResuBox by Dune Legal - RB-2026-XXXX"
 */

import {
  bunqRequest,
  isBunqConfigured as isBunqConfiguredAuth,
  getBunqUserId,
  getBunqMonetaryAccountId,
} from './bunq-auth';

// Description parsing regex
const DESCRIPTION_REF_REGEX = /-\s+([A-Z]{2,4}-\d{4}-[A-Z0-9]+)/i;
const DESCRIPTION_REF_REGEX_FALLBACK = /\b([A-Z]{2,4}-\d{4}-[A-Z0-9]{3,})\b/i;

// bunq API response types
interface BunqMeTabEntry {
  uuid: string;
  amount_inquired: {
    value: string;
    currency: string;
  };
  description: string;
  status: 'WAITING_FOR_PAYMENT' | 'CANCELLED' | 'EXPIRED' | 'PAID';
  redirect_url?: string;
  bunqme_tab_share_url?: string;
  time_created: string;
  time_updated: string;
}

interface BunqMeTab {
  id: number;
  bunqme_tab_entry: BunqMeTabEntry;
  bunqme_tab_share_url: string;
}

interface BunqApiResponse<T> {
  Response: Array<{ [key: string]: T }>;
}

export interface CreatePaymentParams {
  orderId: string;
  amount: number;
  description: string;
  customerEmail: string;
  customerName: string;
  redirectUrl: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  paymentUrl?: string;
  error?: string;
}

/**
 * Check if bunq is configured
 */
export function isBunqConfigured(): boolean {
  return isBunqConfiguredAuth();
}

/**
 * Parse dossier number from payment description.
 * bunq appends ", paid with bunq.me by [name]" to descriptions.
 */
export function parseDossierFromDescription(description: string): string | null {
  // Strip bunq suffix
  const cleanDesc = description
    .replace(/",?\s*paid with bunq\.me.*$/i, '')
    .replace(/^"|"$/g, '');

  const refMatch = cleanDesc.match(DESCRIPTION_REF_REGEX)
    || cleanDesc.match(DESCRIPTION_REF_REGEX_FALLBACK);

  return refMatch?.[1] || null;
}

/**
 * Create a bunq.me tab (payment request)
 */
export async function createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
  if (!isBunqConfigured()) {
    return {
      success: false,
      error: 'bunq is niet geconfigureerd',
    };
  }

  try {
    const userId = getBunqUserId();
    const accountId = getBunqMonetaryAccountId();

    // Ensure description starts with "ResuBox"
    const description = params.description.startsWith('ResuBox')
      ? params.description
      : `ResuBox by Dune Legal - ${params.description}`;

    // Create bunq.me tab
    const response = await bunqRequest<BunqApiResponse<{ id: number }>>(
      'POST',
      `/user/${userId}/monetary-account/${accountId}/bunqme-tab`,
      {
        bunqme_tab_entry: {
          amount_inquired: {
            value: params.amount.toFixed(2),
            currency: 'EUR',
          },
          description,
          redirect_url: params.redirectUrl,
        },
      }
    );

    // Extract tab ID
    let tabId: number | null = null;
    for (const item of response.Response || []) {
      if (item.Id) {
        tabId = (item.Id as unknown as { id: number }).id;
        break;
      }
    }

    if (!tabId) {
      return { success: false, error: 'Geen tab ID ontvangen van bunq' };
    }

    // Fetch created tab to get the share URL
    const tabResponse = await bunqRequest<BunqApiResponse<BunqMeTab>>(
      'GET',
      `/user/${userId}/monetary-account/${accountId}/bunqme-tab/${tabId}`
    );

    let checkoutUrl: string | undefined;
    for (const item of tabResponse.Response || []) {
      if (item.BunqMeTab) {
        checkoutUrl = item.BunqMeTab.bunqme_tab_share_url;
        break;
      }
    }

    console.log(`[bunq] Created payment tab ${tabId}: ${checkoutUrl}`);

    return {
      success: true,
      paymentId: String(tabId),
      paymentUrl: checkoutUrl,
    };
  } catch (error) {
    console.error('[bunq] Error creating payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Onbekende fout bij aanmaken betaling',
    };
  }
}

/**
 * Get payment status by bunq.me tab ID
 */
export async function getPaymentStatus(tabId: string): Promise<'open' | 'paid' | 'expired' | null> {
  if (!isBunqConfigured()) return null;

  try {
    const userId = getBunqUserId();
    const accountId = getBunqMonetaryAccountId();

    const response = await bunqRequest<BunqApiResponse<BunqMeTab>>(
      'GET',
      `/user/${userId}/monetary-account/${accountId}/bunqme-tab/${tabId}`
    );

    for (const item of response.Response || []) {
      if (item.BunqMeTab) {
        const status = item.BunqMeTab.bunqme_tab_entry.status;
        switch (status) {
          case 'PAID':
            return 'paid';
          case 'WAITING_FOR_PAYMENT':
            return 'open';
          case 'CANCELLED':
          case 'EXPIRED':
            return 'expired';
        }
      }
    }

    return null;
  } catch (error) {
    console.error('[bunq] Error fetching payment status:', error);
    return null;
  }
}
