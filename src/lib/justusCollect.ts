import { CVOrder } from '@/types/admin';

const JUSTUS_API_URL = 'https://api.justuscollect.nl/v1';

function getApiKey(): string | null {
  return process.env.JUSTUS_API_KEY || null;
}

export interface JustusCreateCaseResult {
  success: boolean;
  caseId?: string;
  caseNumber?: string;
  error?: string;
}

export interface JustusWithdrawResult {
  success: boolean;
  error?: string;
}

export async function createCase(order: CVOrder): Promise<JustusCreateCaseResult> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('Justus API key niet geconfigureerd');
    return {
      success: false,
      error: 'Justus API key niet geconfigureerd',
    };
  }

  try {
    const response = await fetch(`${JUSTUS_API_URL}/cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        reference: order.dossier_number,
        debtor: {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone || undefined,
          address: {
            street: order.customer_address || undefined,
            house_number: order.customer_house_number || undefined,
            postal_code: order.customer_postal_code || undefined,
            city: order.customer_city || undefined,
            country: 'NL',
          },
        },
        claim: {
          amount: 42.0,
          currency: 'EUR',
          description: `CV Download Service - ${order.dossier_number}`,
          original_amount: order.amount,
          invoice_date: order.created_at,
        },
        webhook_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/justus/webhook`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Justus API error:', response.status, errorData);
      return {
        success: false,
        error: `Justus API fout: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      caseId: data.id,
      caseNumber: data.case_number,
    };
  } catch (error) {
    console.error('Justus API request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Onbekende fout bij Justus API',
    };
  }
}

export async function withdrawCase(caseId: string): Promise<JustusWithdrawResult> {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('Justus API key niet geconfigureerd');
    return {
      success: false,
      error: 'Justus API key niet geconfigureerd',
    };
  }

  try {
    const response = await fetch(`${JUSTUS_API_URL}/cases/${caseId}/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        reason: 'Betaling direct ontvangen',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Justus withdraw error:', response.status, errorData);
      return {
        success: false,
        error: `Justus API fout bij intrekken: ${response.status}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Justus withdraw request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Onbekende fout bij intrekken Justus case',
    };
  }
}
