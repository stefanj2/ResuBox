import createMollieClient, { Payment } from '@mollie/api-client';

// Create Mollie client
const mollieApiKey = process.env.MOLLIE_API_KEY;

function getMollieClient() {
  if (!mollieApiKey) {
    console.warn('Mollie API key not configured');
    return null;
  }
  return createMollieClient({ apiKey: mollieApiKey });
}

export interface CreatePaymentParams {
  orderId: string;
  amount: number;
  description: string;
  customerEmail: string;
  customerName: string;
  redirectUrl: string;
  webhookUrl: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  paymentUrl?: string;
  error?: string;
}

export async function createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
  const mollieClient = getMollieClient();

  if (!mollieClient) {
    return {
      success: false,
      error: 'Mollie is niet geconfigureerd',
    };
  }

  try {
    // Zorg ervoor dat description altijd begint met "ResuBox"
    const description = params.description.startsWith('ResuBox')
      ? params.description
      : `ResuBox - ${params.description}`;

    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: params.amount.toFixed(2),
      },
      description,
      redirectUrl: params.redirectUrl,
      webhookUrl: params.webhookUrl,
      metadata: {
        orderId: params.orderId,
        customerEmail: params.customerEmail,
        customerName: params.customerName,
      },
    });

    return {
      success: true,
      paymentId: payment.id,
      paymentUrl: payment.getCheckoutUrl() || undefined,
    };
  } catch (error) {
    console.error('Mollie create payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Onbekende fout bij aanmaken betaling',
    };
  }
}

export async function getPayment(paymentId: string): Promise<Payment | null> {
  const mollieClient = getMollieClient();

  if (!mollieClient) {
    return null;
  }

  try {
    const payment = await mollieClient.payments.get(paymentId);
    return payment;
  } catch (error) {
    console.error('Mollie get payment error:', error);
    return null;
  }
}

export function isPaymentPaid(payment: Payment): boolean {
  return payment.status === 'paid';
}

export function isPaymentFailed(payment: Payment): boolean {
  return ['failed', 'canceled', 'expired'].includes(payment.status);
}

export function isPaymentPending(payment: Payment): boolean {
  return ['open', 'pending', 'authorized'].includes(payment.status);
}
