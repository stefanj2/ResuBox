import { Resend } from 'resend';

// Create Resend client
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@resubox.nl';

// Kill-switch: emails are OFF unless explicitly enabled. This gates EVERY send
// (cron dunning, Stripe/Justus webhooks, manual admin send) at the single
// chokepoint. Set EMAILS_ENABLED="true" in the env to actually send.
const emailsEnabled = process.env.EMAILS_ENABLED === 'true';

function getResendClient() {
  if (!resendApiKey) {
    console.warn('Resend API key not configured');
    return null;
  }
  return new Resend(resendApiKey);
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
  attachments?: { filename: string; content: Buffer | string }[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<EmailResult> {
  if (!emailsEnabled) {
    // Kill-switch active: do not send. Log and return a stub success so callers
    // (cron, webhooks) keep advancing state without erroring.
    console.log('=== EMAIL (not sent - EMAILS_ENABLED is not "true") ===');
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    console.log('========================================================');

    return {
      success: true,
      messageId: `disabled-${Date.now()}`,
    };
  }

  const resend = getResendClient();

  if (!resend) {
    // In development, log email instead of sending
    console.log('=== EMAIL (not sent - Resend not configured) ===');
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    console.log('HTML:', params.html.substring(0, 500) + '...');
    console.log('================================================');

    return {
      success: true,
      messageId: `dev-${Date.now()}`,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: params.from || fromEmail,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
      attachments: params.attachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error('Resend send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Onbekende fout bij versturen email',
    };
  }
}

export async function sendBatchEmails(
  emails: SendEmailParams[]
): Promise<EmailResult[]> {
  return Promise.all(emails.map((email) => sendEmail(email)));
}
