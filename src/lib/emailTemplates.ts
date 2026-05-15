import { CVOrder } from '@/types/admin';

// ─── Config ────────────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://resubox.com';
const BRAND_NAME = 'ResuBox';
const CONTACT_EMAIL = 'info@resubox.nl';
const LOGO_URL = `${SITE_URL}/resubox-logo.jpeg`;
// ────────────────────────────────────────────────────────────────────────────

const EMAIL_STYLES = {
  container: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;',
  body: 'background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;',
  footer: 'background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 13px;',
  infoBox: 'background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;',
  warningBox: 'background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;',
  dangerBox: 'background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;',
  btnGreen: 'display: inline-block; background: #059669; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;',
  btnOrange: 'display: inline-block; background: #f59e0b; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;',
  btnRed: 'display: inline-block; background: #dc2626; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;',
};

// Witte logo-header (betere deliverability: logo op eigen domein)
const LOGO_HEADER = `
<div style="background: #ffffff; padding: 20px 30px; border-radius: 12px 12px 0 0; border: 1px solid #e5e7eb; border-bottom: none; text-align: center;">
  <img src="${LOGO_URL}" alt="${BRAND_NAME}" style="height: 44px; width: auto; display: block; margin: 0 auto;">
</div>`;

// Verborgen preheader-tekst voor inbox-preview
function preheader(text: string) {
  return `<span style="display:none;font-size:1px;color:#ffffff;max-height:0;overflow:hidden;opacity:0;">${text}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</span>`;
}

// Voetnoot footer
const FOOTER = `
<div style="${EMAIL_STYLES.footer}">
  <p style="margin: 0; font-weight: 600;">${BRAND_NAME}</p>
  <p style="margin: 6px 0 0;">Keurenplein 41, 1069 CD Amsterdam</p>
  <p style="margin: 4px 0 0; font-size: 11px; color: #9ca3af;">KvK 67332706 &middot; BTW NL224452794B01 &middot; ${SITE_URL.replace('https://', '')}</p>
  <p style="margin: 8px 0 0; font-size: 11px;">
    <a href="${SITE_URL}/privacy" style="color: #059669; text-decoration: none;">Privacybeleid</a>
    &nbsp;&middot;&nbsp;
    <a href="${SITE_URL}/voorwaarden" style="color: #059669; text-decoration: none;">Algemene voorwaarden</a>
  </p>
</div>`;

function wrap(html: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 20px; background: #f3f4f6;">
  <div style="${EMAIL_STYLES.container}">
    ${LOGO_HEADER}
    <div style="${EMAIL_STYLES.body}">${html}</div>
    ${FOOTER}
  </div>
</body>
</html>`;
}

// ─── Shared helper: factuurgegevens tabel ────────────────────────────────────
function factuurTabel(order: CVOrder, boxStyle: string, color: string) {
  return `
<div style="${boxStyle}">
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="color: ${color}; padding: 5px 0;">Dossiernummer:</td>
      <td style="color: ${color}; text-align: right;">${order.dossier_number}</td>
    </tr>
    <tr>
      <td style="color: ${color}; padding: 5px 0;">Omschrijving:</td>
      <td style="color: ${color}; text-align: right;">CV download via ResuBox</td>
    </tr>
    <tr style="border-top: 2px solid rgba(0,0,0,0.08);">
      <td style="color: ${color}; padding: 10px 0 5px; font-size: 17px;"><strong>Openstaand bedrag:</strong></td>
      <td style="color: ${color}; text-align: right; font-size: 17px;"><strong>&euro;${order.amount.toFixed(2)}</strong></td>
    </tr>
  </table>
</div>`;
}

// ─── Email 1: Bevestiging (4u na bestelling) ─────────────────────────────────
export function getConfirmationEmail(order: CVOrder): { subject: string; html: string; text: string } {
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];

  const html = wrap(`
    ${preheader(`Je CV is klaar — dossiernummer ${order.dossier_number}`)}
    <h2 style="color: #111827; margin-top: 0;">Je CV is succesvol aangemaakt ✓</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Beste ${firstName},</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Goed nieuws! Je CV is succesvol opgemaakt en gedownload via ResuBox.
    </p>
    <div style="${EMAIL_STYLES.infoBox}">
      <p style="margin: 0; color: #166534;"><strong>Dossiernummer:</strong> ${order.dossier_number}</p>
      <p style="margin: 8px 0 0; color: #166534;"><strong>Status:</strong> CV succesvol gedownload</p>
    </div>
    <h3 style="color: #111827;">Wat gebeurt er nu?</h3>
    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; padding-left: 20px;">
      <li>Je ontvangt binnenkort een factuur per e-mail</li>
      <li>Betaal eenvoudig via iDEAL — betaaltermijn 14 dagen</li>
      <li>Na betaling is je dossier volledig afgerond</li>
    </ul>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Vragen? Stuur een e-mail naar <a href="mailto:${CONTACT_EMAIL}" style="color: #059669;">${CONTACT_EMAIL}</a>.
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      Met vriendelijke groet,<br><strong>Team ${BRAND_NAME}</strong>
    </p>
  `);

  const text = `
Je CV is succesvol aangemaakt!

Beste ${firstName},

Goed nieuws! Je CV is succesvol opgemaakt en gedownload via ResuBox.

Dossiernummer: ${order.dossier_number}
Status: CV succesvol gedownload

Wat gebeurt er nu?
- Je ontvangt binnenkort een factuur per e-mail
- Betaal eenvoudig via iDEAL — betaaltermijn 14 dagen
- Na betaling is je dossier volledig afgerond

Vragen? Mail naar ${CONTACT_EMAIL}.

Met vriendelijke groet,
Team ${BRAND_NAME}

---
${BRAND_NAME} | Keurenplein 41, 1069 CD Amsterdam | KvK 67332706
  `.trim();

  return {
    subject: `✓ Je CV is klaar — dossiernummer ${order.dossier_number}`,
    html,
    text,
  };
}

// ─── Email 2: Factuur (24u na bestelling) ────────────────────────────────────
export function getInvoiceEmail(order: CVOrder): { subject: string; html: string; text: string } {
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const paymentUrl = `${SITE_URL}/betalen/${order.id}`;

  const html = wrap(`
    ${preheader(`Factuur ${order.dossier_number} — €${order.amount.toFixed(2)} — betaaltermijn 14 dagen`)}
    <h2 style="color: #111827; margin-top: 0;">Factuur voor je CV download</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Beste ${firstName},</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Bedankt voor het gebruiken van ${BRAND_NAME}. Hierbij ontvang je de factuur voor je CV download.
    </p>
    <div style="${EMAIL_STYLES.infoBox}">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #166534; padding: 5px 0;">Factuurnummer:</td>
          <td style="color: #166534; text-align: right;">${order.dossier_number}</td>
        </tr>
        <tr>
          <td style="color: #166534; padding: 5px 0;">Omschrijving:</td>
          <td style="color: #166534; text-align: right;">CV download via ResuBox</td>
        </tr>
        <tr>
          <td style="color: #166534; padding: 5px 0;">Excl. BTW:</td>
          <td style="color: #166534; text-align: right;">&euro;${(order.amount / 1.21).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="color: #166534; padding: 5px 0;">BTW (21%):</td>
          <td style="color: #166534; text-align: right;">&euro;${(order.amount - order.amount / 1.21).toFixed(2)}</td>
        </tr>
        <tr style="border-top: 2px solid #bbf7d0;">
          <td style="color: #166534; padding: 10px 0 5px; font-size: 18px;"><strong>Totaal:</strong></td>
          <td style="color: #166534; text-align: right; font-size: 18px;"><strong>&euro;${order.amount.toFixed(2)}</strong></td>
        </tr>
      </table>
    </div>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Betaal eenvoudig en veilig via iDEAL:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="${EMAIL_STYLES.btnGreen}">Betaal nu &euro;${order.amount.toFixed(2)}</a>
    </p>
    <p style="color: #6b7280; font-size: 14px; text-align: center;">Betaaltermijn: 14 dagen na factuurdatum</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      Met vriendelijke groet,<br><strong>Team ${BRAND_NAME}</strong>
    </p>
  `);

  const text = `
Factuur voor je CV download

Beste ${firstName},

Hierbij ontvang je de factuur voor je CV download via ${BRAND_NAME}.

Factuurnummer: ${order.dossier_number}
Omschrijving: CV download via ResuBox
Totaal: €${order.amount.toFixed(2)} incl. BTW
Betaaltermijn: 14 dagen

Betaal via: ${paymentUrl}

Met vriendelijke groet,
Team ${BRAND_NAME}

---
${BRAND_NAME} | Keurenplein 41, 1069 CD Amsterdam | KvK 67332706
  `.trim();

  return {
    subject: `Factuur ${order.dossier_number} — €${order.amount.toFixed(2)} — ${BRAND_NAME}`,
    html,
    text,
  };
}

// ─── Email 3: 1e Herinnering (7 dagen na bestelling) ─────────────────────────
export function getReminder1Email(order: CVOrder): { subject: string; html: string; text: string } {
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const paymentUrl = `${SITE_URL}/betalen/${order.id}`;

  const html = wrap(`
    ${preheader(`Herinnering: openstaande factuur ${order.dossier_number} — €${order.amount.toFixed(2)}`)}
    <h2 style="color: #92400e; margin-top: 0;">Herinnering: openstaande factuur</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Beste ${firstName},</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Wij hebben nog geen betaling ontvangen voor onderstaande factuur. Mogelijk is dit aan uw aandacht ontsnapt.
    </p>
    ${factuurTabel(order, EMAIL_STYLES.warningBox, '#92400e')}
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; background: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
      Wij verzoeken u vriendelijk het openstaande bedrag te voldoen om verdere stappen te voorkomen.
    </p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="${EMAIL_STYLES.btnOrange}">Betaal nu &euro;${order.amount.toFixed(2)}</a>
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Heeft u al betaald? Dan kunt u dit bericht als niet verzonden beschouwen.
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      Met vriendelijke groet,<br><strong>Team ${BRAND_NAME}</strong>
    </p>
  `);

  const text = `
Herinnering: openstaande factuur

Beste ${firstName},

Wij hebben nog geen betaling ontvangen voor factuur ${order.dossier_number} (€${order.amount.toFixed(2)}).

Betaal via: ${paymentUrl}

Heeft u al betaald? Dan kunt u dit bericht als niet verzonden beschouwen.

Met vriendelijke groet,
Team ${BRAND_NAME}

---
${BRAND_NAME} | Keurenplein 41, 1069 CD Amsterdam | KvK 67332706
  `.trim();

  return {
    subject: `Herinnering: dossier ${order.dossier_number} — betaling nog openstaand`,
    html,
    text,
  };
}

// ─── Email 4: 2e Herinnering / WIK-brief (14 dagen na bestelling) ────────────
export function getReminder2Email(order: CVOrder): { subject: string; html: string; text: string } {
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const lastName = order.cv_data?.personal?.lastName || '';
  const paymentUrl = `${SITE_URL}/betalen/${order.id}`;

  const html = wrap(`
    ${preheader(`Aanmaning dossier ${order.dossier_number} — betaal binnen 14 dagen om incassokosten te voorkomen`)}
    <h2 style="color: #991b1b; margin-top: 0;">Aanmaning: openstaande vordering dossier ${order.dossier_number}</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Geachte ${firstName} ${lastName},</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Wij hebben geconstateerd dat ondanks ons eerdere betalingsverzoek het openstaande bedrag voor
      dossiernummer <strong>${order.dossier_number}</strong> tot op heden niet is voldaan.
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Wij sommeren u hierbij het openstaande bedrag <strong>binnen 14 dagen</strong> te voldoen.
    </p>
    <div style="${EMAIL_STYLES.dangerBox}">
      <p style="margin: 0 0 12px; color: #991b1b; font-weight: 600; font-size: 15px;">
        Consequenties bij niet-tijdige betaling
      </p>
      <p style="color: #7f1d1d; font-size: 15px; line-height: 1.7; margin: 0;">
        Indien wij binnen 14 dagen geen volledige betaling ontvangen, zijn wij genoodzaakt uw dossier
        over te dragen aan een incassobureau. Op grond van de Wet Incassokosten (WIK) worden in dat geval
        buitengerechtelijke incassokosten van <strong>&euro;40,00</strong> in rekening gebracht, bovenop het
        reeds openstaande bedrag.
      </p>
    </div>
    ${factuurTabel(order, EMAIL_STYLES.infoBox, '#166534')}
    <p style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="${EMAIL_STYLES.btnRed}">Betaal nu &euro;${order.amount.toFixed(2)}</a>
    </p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
      Heeft u al betaald? Dan verzoeken wij u dit bericht te negeren. Het is mogelijk dat onze
      administratie en uw betaling elkaar hebben gekruist.
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      Hoogachtend,<br><strong>Team ${BRAND_NAME}</strong>
    </p>
  `);

  const text = `
Aanmaning: openstaande vordering dossier ${order.dossier_number}

Geachte ${firstName} ${lastName},

Wij hebben geconstateerd dat het openstaande bedrag voor dossiernummer ${order.dossier_number} niet is voldaan.

Openstaand bedrag: €${order.amount.toFixed(2)}

Wij sommeren u het bedrag binnen 14 dagen te voldoen. Bij niet-betaling worden wettelijke incassokosten (€40,00) in rekening gebracht.

Betaal via: ${paymentUrl}

Heeft u al betaald? Dan kunt u dit bericht negeren.

Hoogachtend,
Team ${BRAND_NAME}

---
${BRAND_NAME} | Keurenplein 41, 1069 CD Amsterdam | KvK 67332706
  `.trim();

  return {
    subject: `Aanmaning: dossier ${order.dossier_number} — betaal binnen 14 dagen`,
    html,
    text,
  };
}

// ─── Email 5: Incasso overdracht (28 dagen na bestelling) ────────────────────
export function getIncassoEmail(order: CVOrder): { subject: string; html: string; text: string } {
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];
  const lastName = order.cv_data?.personal?.lastName || '';
  const paymentUrl = `${SITE_URL}/betalen/${order.id}`;

  const html = wrap(`
    ${preheader(`Dossier ${order.dossier_number} overgedragen aan incassobureau`)}
    <h2 style="color: #92400e; margin-top: 0;">Dossier overgedragen aan incassobureau</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Geachte ${firstName} ${lastName},</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Ondanks eerdere herinneringen en een aanmaning hebben wij geen betaling ontvangen voor
      dossiernummer <strong>${order.dossier_number}</strong>. Uw dossier is daarom overgedragen aan
      <strong>Justus Collect</strong> voor verdere incasso.
    </p>
    <div style="${EMAIL_STYLES.warningBox}">
      <p style="margin: 0 0 15px; color: #92400e; font-weight: bold; font-size: 17px;">Incasso-overzicht</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #92400e; padding: 5px 0;">Ons dossiernummer:</td>
          <td style="color: #92400e; text-align: right;">${order.dossier_number}</td>
        </tr>
        ${order.justus_case_number ? `<tr>
          <td style="color: #92400e; padding: 5px 0;">Justus zaaknummer:</td>
          <td style="color: #92400e; text-align: right;">${order.justus_case_number}</td>
        </tr>` : ''}
        <tr style="border-top: 2px solid #fcd34d;">
          <td style="color: #92400e; padding: 10px 0 5px; font-size: 19px;"><strong>Verschuldigd bedrag:</strong></td>
          <td style="color: #92400e; text-align: right; font-size: 19px;"><strong>&euro;${order.amount.toFixed(2)}</strong></td>
        </tr>
      </table>
    </div>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      U kunt nog steeds betalen om verdere kosten te voorkomen. Na ontvangst van uw betaling wordt het
      incassodossier onmiddellijk gesloten.
    </p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${paymentUrl}" style="${EMAIL_STYLES.btnOrange}">Betaal nu &euro;${order.amount.toFixed(2)}</a>
    </p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
      Voor vragen kunt u contact opnemen via <a href="mailto:incasso@resubox.nl" style="color: #059669;">incasso@resubox.nl</a>.
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      Met vriendelijke groet,<br><strong>Incasso Afdeling — ${BRAND_NAME}</strong>
    </p>
  `);

  const text = `
Dossier overgedragen aan incassobureau

Geachte ${firstName} ${lastName},

Ondanks eerdere herinneringen hebben wij geen betaling ontvangen voor dossiernummer ${order.dossier_number}.
Uw dossier is overgedragen aan Justus Collect voor verdere incasso.

Dossiernummer: ${order.dossier_number}
${order.justus_case_number ? `Justus zaaknummer: ${order.justus_case_number}\n` : ''}Verschuldigd bedrag: €${order.amount.toFixed(2)}

Betaal via: ${paymentUrl}

Voor vragen: incasso@resubox.nl

Met vriendelijke groet,
Incasso Afdeling — ${BRAND_NAME}

---
${BRAND_NAME} | Keurenplein 41, 1069 CD Amsterdam | KvK 67332706
  `.trim();

  return {
    subject: `Dossier ${order.dossier_number} overgedragen aan incassobureau`,
    html,
    text,
  };
}

// ─── Email 6: Betaling ontvangen ─────────────────────────────────────────────
export function getPaymentReceivedEmail(order: CVOrder): { subject: string; html: string; text: string } {
  const firstName = order.cv_data?.personal?.firstName || order.customer_name.split(' ')[0];

  const html = wrap(`
    ${preheader(`Betaling ontvangen voor dossier ${order.dossier_number} — bedankt!`)}
    <h2 style="color: #111827; margin-top: 0;">✓ Betaling ontvangen!</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Beste ${firstName},</p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Bedankt voor je betaling! Wij hebben deze in goede orde ontvangen.
    </p>
    <div style="${EMAIL_STYLES.infoBox}">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="color: #166534; padding: 5px 0;">Dossiernummer:</td>
          <td style="color: #166534; text-align: right;">${order.dossier_number}</td>
        </tr>
        <tr style="border-top: 2px solid #bbf7d0;">
          <td style="color: #166534; padding: 10px 0 5px; font-size: 18px;"><strong>Betaald:</strong></td>
          <td style="color: #166534; text-align: right; font-size: 18px;"><strong>&euro;${order.amount.toFixed(2)}</strong></td>
        </tr>
      </table>
    </div>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Je dossier is hiermee volledig afgerond. We wensen je veel succes met je sollicitaties!
    </p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${SITE_URL}/builder" style="${EMAIL_STYLES.btnGreen}">Maak nog een CV</a>
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
      Met vriendelijke groet,<br><strong>Team ${BRAND_NAME}</strong>
    </p>
  `);

  const text = `
Betaling ontvangen!

Beste ${firstName},

Bedankt voor je betaling! Wij hebben deze in goede orde ontvangen.

Dossiernummer: ${order.dossier_number}
Betaald: €${order.amount.toFixed(2)}

Je dossier is hiermee volledig afgerond. Veel succes met je sollicitaties!

Met vriendelijke groet,
Team ${BRAND_NAME}

---
${BRAND_NAME} | Keurenplein 41, 1069 CD Amsterdam | KvK 67332706
  `.trim();

  return {
    subject: `✓ Betaling ontvangen — dossier ${order.dossier_number}`,
    html,
    text,
  };
}

// ─── Router ──────────────────────────────────────────────────────────────────
export type EmailType = 'confirmation' | 'invoice' | 'reminder_1' | 'reminder_2' | 'incasso' | 'payment_received';

export function getEmailTemplate(
  order: CVOrder,
  type: EmailType
): { subject: string; html: string; text?: string } {
  switch (type) {
    case 'confirmation':    return getConfirmationEmail(order);
    case 'invoice':         return getInvoiceEmail(order);
    case 'reminder_1':      return getReminder1Email(order);
    case 'reminder_2':      return getReminder2Email(order);
    case 'incasso':         return getIncassoEmail(order);
    case 'payment_received': return getPaymentReceivedEmail(order);
    default: throw new Error(`Unknown email type: ${type}`);
  }
}
