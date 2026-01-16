import { CVOrder } from '@/types/admin';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://resubox.com';

// Base email template wrapper
function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ResuBox</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px; text-align: center; background-color: #059669;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">ResuBox</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b; text-align: center;">
                © ${new Date().getFullYear()} ResuBox. Alle rechten voorbehouden.<br>
                <a href="${siteUrl}/privacy" style="color: #059669;">Privacybeleid</a> |
                <a href="${siteUrl}/voorwaarden" style="color: #059669;">Algemene voorwaarden</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Bevestigingsmail (4 uur na bestelling)
export function getConfirmationEmail(order: CVOrder): { subject: string; html: string } {
  const subject = `Bevestiging van je CV download - ${order.dossier_number}`;

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px;">Beste ${order.customer_name},</h2>

    <p style="margin: 0 0 16px; color: #475569; line-height: 1.6;">
      Bedankt voor het gebruiken van ResuBox! Je CV is succesvol gegenereerd en gedownload.
    </p>

    <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px; color: #166534; font-size: 16px;">Ordergegevens</h3>
      <table style="width: 100%;">
        <tr>
          <td style="padding: 4px 0; color: #475569;">Dossiernummer:</td>
          <td style="padding: 4px 0; color: #1e293b; font-weight: 600; text-align: right;">${order.dossier_number}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #475569;">Bedrag:</td>
          <td style="padding: 4px 0; color: #1e293b; font-weight: 600; text-align: right;">€${order.amount.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <p style="margin: 0 0 16px; color: #475569; line-height: 1.6;">
      Je ontvangt binnen 24 uur een factuur met een betaallink. Na betaling wordt je dossier gesloten.
    </p>

    <p style="margin: 0; color: #475569; line-height: 1.6;">
      Heb je vragen? Neem dan contact met ons op via <a href="mailto:support@resubox.com" style="color: #059669;">support@resubox.com</a>.
    </p>

    <p style="margin: 24px 0 0; color: #475569;">
      Met vriendelijke groet,<br>
      <strong>Het ResuBox Team</strong>
    </p>
  `;

  return {
    subject,
    html: emailWrapper(content),
  };
}

// Factuur email (24 uur na bestelling)
export function getInvoiceEmail(order: CVOrder): { subject: string; html: string } {
  const subject = `Factuur voor je CV download - ${order.dossier_number}`;
  const paymentUrl = order.payment_link || `${siteUrl}/betalen/${order.id}`;

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px;">Beste ${order.customer_name},</h2>

    <p style="margin: 0 0 16px; color: #475569; line-height: 1.6;">
      Hierbij ontvang je de factuur voor je CV download via ResuBox.
    </p>

    <div style="background-color: #faf5ff; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px; color: #7e22ce; font-size: 16px;">Factuurgegevens</h3>
      <table style="width: 100%;">
        <tr>
          <td style="padding: 4px 0; color: #475569;">Factuurnummer:</td>
          <td style="padding: 4px 0; color: #1e293b; font-weight: 600; text-align: right;">${order.dossier_number}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #475569;">Omschrijving:</td>
          <td style="padding: 4px 0; color: #1e293b; text-align: right;">CV Download Service</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #475569;">Bedrag (excl. BTW):</td>
          <td style="padding: 4px 0; color: #1e293b; text-align: right;">€${(order.amount / 1.21).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #475569;">BTW (21%):</td>
          <td style="padding: 4px 0; color: #1e293b; text-align: right;">€${(order.amount - order.amount / 1.21).toFixed(2)}</td>
        </tr>
        <tr style="border-top: 2px solid #e9d5ff;">
          <td style="padding: 12px 0 4px; color: #475569; font-weight: 600;">Totaal te betalen:</td>
          <td style="padding: 12px 0 4px; color: #7e22ce; font-weight: 700; font-size: 18px; text-align: right;">€${order.amount.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${paymentUrl}" style="display: inline-block; padding: 14px 32px; background-color: #059669; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Nu betalen
      </a>
    </div>

    <p style="margin: 0 0 16px; color: #64748b; font-size: 14px; text-align: center;">
      Betaaltermijn: 14 dagen na factuurdatum
    </p>

    <p style="margin: 24px 0 0; color: #475569;">
      Met vriendelijke groet,<br>
      <strong>Het ResuBox Team</strong>
    </p>
  `;

  return {
    subject,
    html: emailWrapper(content),
  };
}

// 1e Herinnering (7 dagen na bestelling)
export function getReminder1Email(order: CVOrder): { subject: string; html: string } {
  const subject = `Herinnering: Openstaande factuur ${order.dossier_number}`;
  const paymentUrl = order.payment_link || `${siteUrl}/betalen/${order.id}`;

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px;">Beste ${order.customer_name},</h2>

    <p style="margin: 0 0 16px; color: #475569; line-height: 1.6;">
      Onze administratie laat zien dat de factuur met nummer <strong>${order.dossier_number}</strong> nog niet is betaald. Mogelijk is dit aan je aandacht ontsnapt.
    </p>

    <div style="background-color: #fff7ed; border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #f97316;">
      <h3 style="margin: 0 0 12px; color: #c2410c; font-size: 16px;">Openstaand bedrag</h3>
      <p style="margin: 0; color: #c2410c; font-size: 24px; font-weight: 700;">€${order.amount.toFixed(2)}</p>
    </div>

    <p style="margin: 0 0 16px; color: #475569; line-height: 1.6;">
      Wij verzoeken je vriendelijk om het openstaande bedrag zo spoedig mogelijk te voldoen via onderstaande knop.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${paymentUrl}" style="display: inline-block; padding: 14px 32px; background-color: #f97316; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Direct betalen
      </a>
    </div>

    <p style="margin: 0 0 16px; color: #475569; line-height: 1.6;">
      Heb je al betaald? Dan kun je deze email als niet verzonden beschouwen. Het kan even duren voordat de betaling in ons systeem is verwerkt.
    </p>

    <p style="margin: 24px 0 0; color: #475569;">
      Met vriendelijke groet,<br>
      <strong>Het ResuBox Team</strong>
    </p>
  `;

  return {
    subject,
    html: emailWrapper(content),
  };
}

// 2e Herinnering / WIK-brief (14 dagen na bestelling)
export function getReminder2Email(order: CVOrder): { subject: string; html: string } {
  const subject = `LAATSTE AANMANING: Factuur ${order.dossier_number} - Direct actie vereist`;
  const paymentUrl = order.payment_link || `${siteUrl}/betalen/${order.id}`;

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px;">Beste ${order.customer_name},</h2>

    <div style="background-color: #fef2f2; border-radius: 8px; padding: 20px; margin: 0 0 24px; border: 2px solid #ef4444;">
      <h3 style="margin: 0 0 8px; color: #dc2626; font-size: 18px;">⚠️ LAATSTE AANMANING</h3>
      <p style="margin: 0; color: #7f1d1d; line-height: 1.6;">
        Dit is een veertiendagenbrief conform artikel 6:96 BW (Wet Incassokosten).
      </p>
    </div>

    <p style="margin: 0 0 16px; color: #475569; line-height: 1.6;">
      Ondanks eerdere herinneringen hebben wij nog geen betaling ontvangen voor factuur <strong>${order.dossier_number}</strong>.
    </p>

    <div style="background-color: #fef2f2; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <table style="width: 100%;">
        <tr>
          <td style="padding: 4px 0; color: #475569;">Oorspronkelijk bedrag:</td>
          <td style="padding: 4px 0; color: #1e293b; font-weight: 600; text-align: right;">€${order.amount.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #475569;">Incassokosten (bij niet-betaling):</td>
          <td style="padding: 4px 0; color: #dc2626; text-align: right;">€40,00</td>
        </tr>
        <tr style="border-top: 2px solid #fecaca;">
          <td style="padding: 12px 0 4px; color: #475569; font-weight: 600;">Nu te betalen:</td>
          <td style="padding: 12px 0 4px; color: #dc2626; font-weight: 700; font-size: 18px; text-align: right;">€${order.amount.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <p style="margin: 0 0 16px; color: #475569; line-height: 1.6;">
      <strong>Betaal binnen 14 dagen</strong> om extra kosten te voorkomen. Na deze termijn zijn wij genoodzaakt de vordering uit handen te geven aan een incassobureau, waarbij de wettelijke incassokosten (minimaal €40) in rekening worden gebracht.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${paymentUrl}" style="display: inline-block; padding: 14px 32px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Nu betalen en kosten voorkomen
      </a>
    </div>

    <p style="margin: 0 0 16px; color: #64748b; font-size: 14px; line-height: 1.6;">
      Als je van mening bent dat deze vordering onterecht is, neem dan binnen 7 dagen contact met ons op via <a href="mailto:support@resubox.com" style="color: #059669;">support@resubox.com</a>.
    </p>

    <p style="margin: 24px 0 0; color: #475569;">
      Met vriendelijke groet,<br>
      <strong>Het ResuBox Team</strong>
    </p>
  `;

  return {
    subject,
    html: emailWrapper(content),
  };
}

// Betaling ontvangen bevestiging
export function getPaymentReceivedEmail(order: CVOrder): { subject: string; html: string } {
  const subject = `Betaling ontvangen - ${order.dossier_number}`;

  const content = `
    <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px;">Beste ${order.customer_name},</h2>

    <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin: 0 0 24px; text-align: center;">
      <div style="width: 48px; height: 48px; background-color: #059669; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;">
        <span style="color: white; font-size: 24px;">✓</span>
      </div>
      <h3 style="margin: 0 0 8px; color: #166534; font-size: 18px;">Betaling ontvangen!</h3>
      <p style="margin: 0; color: #166534; font-size: 24px; font-weight: 700;">€${order.amount.toFixed(2)}</p>
    </div>

    <p style="margin: 0 0 16px; color: #475569; line-height: 1.6;">
      Wij hebben je betaling voor factuur <strong>${order.dossier_number}</strong> in goede orde ontvangen. Je dossier is hiermee gesloten.
    </p>

    <p style="margin: 0 0 16px; color: #475569; line-height: 1.6;">
      Bedankt voor het gebruiken van ResuBox. We wensen je veel succes met je sollicitaties!
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${siteUrl}/builder" style="display: inline-block; padding: 14px 32px; background-color: #059669; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Maak nog een CV
      </a>
    </div>

    <p style="margin: 24px 0 0; color: #475569;">
      Met vriendelijke groet,<br>
      <strong>Het ResuBox Team</strong>
    </p>
  `;

  return {
    subject,
    html: emailWrapper(content),
  };
}

// Get email template by type
export function getEmailTemplate(
  order: CVOrder,
  type: 'confirmation' | 'invoice' | 'reminder_1' | 'reminder_2' | 'payment_received'
): { subject: string; html: string } {
  switch (type) {
    case 'confirmation':
      return getConfirmationEmail(order);
    case 'invoice':
      return getInvoiceEmail(order);
    case 'reminder_1':
      return getReminder1Email(order);
    case 'reminder_2':
      return getReminder2Email(order);
    case 'payment_received':
      return getPaymentReceivedEmail(order);
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}
