/**
 * One-off setup for the Vacaturematch subscription Stripe Prices.
 *
 * Reads STRIPE_SECRET_KEY from .env.local, creates (test or live, depending on
 * the key) the two Prices the feature needs, and writes their IDs back into
 * .env.local:
 *   - STRIPE_PRICE_VACANCY_SUB         €17,25 / month (recurring)
 *   - STRIPE_PRICE_VACANCY_ACTIVATION  €1 one-time (the "real person" check)
 *
 * Usage:
 *   node scripts/setup-stripe-vacancies.mjs
 *   node scripts/setup-stripe-vacancies.mjs --force   # recreate even if set
 *
 * Idempotent by default: if both price IDs are already in .env.local it exits
 * without creating duplicates.
 */
import fs from 'node:fs';
import path from 'node:path';
import Stripe from 'stripe';

const ENV_PATH = path.resolve(process.cwd(), '.env.local');
const FORCE = process.argv.includes('--force');

function parseEnv(content) {
  const map = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) map[m[1]] = m[2];
  }
  return map;
}

function upsertEnv(content, key, value) {
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(content)) return content.replace(re, `${key}=${value}`);
  const sep = content.endsWith('\n') || content === '' ? '' : '\n';
  return `${content}${sep}${key}=${value}\n`;
}

async function main() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error('✗ .env.local niet gevonden. Maak het aan met STRIPE_SECRET_KEY=sk_test_...');
    process.exit(1);
  }

  let content = fs.readFileSync(ENV_PATH, 'utf8');
  const env = parseEnv(content);

  const secret = env.STRIPE_SECRET_KEY;
  if (!secret || !secret.startsWith('sk_')) {
    console.error('✗ Zet eerst STRIPE_SECRET_KEY=sk_test_... in .env.local en draai dit opnieuw.');
    process.exit(1);
  }

  const mode = secret.startsWith('sk_live_') ? 'LIVE' : 'TEST';

  if (!FORCE && env.STRIPE_PRICE_VACANCY_SUB && env.STRIPE_PRICE_VACANCY_ACTIVATION) {
    console.log('✓ Prices staan al in .env.local. Gebruik --force om opnieuw aan te maken.');
    console.log(`  STRIPE_PRICE_VACANCY_SUB=${env.STRIPE_PRICE_VACANCY_SUB}`);
    console.log(`  STRIPE_PRICE_VACANCY_ACTIVATION=${env.STRIPE_PRICE_VACANCY_ACTIVATION}`);
    return;
  }

  const stripe = new Stripe(secret);
  console.log(`Stripe Prices aanmaken in ${mode}-modus…`);

  // €17,25 / maand — abonnement
  const subProduct = await stripe.products.create({ name: 'ResuBox Vacaturematch — abonnement' });
  const subPrice = await stripe.prices.create({
    product: subProduct.id,
    currency: 'eur',
    unit_amount: 1725,
    recurring: { interval: 'month' },
  });

  // €1 eenmalig — activatie / echte-persoon-verificatie
  const actProduct = await stripe.products.create({ name: 'ResuBox Vacaturematch — activatie' });
  const actPrice = await stripe.prices.create({
    product: actProduct.id,
    currency: 'eur',
    unit_amount: 100,
  });

  content = upsertEnv(content, 'STRIPE_PRICE_VACANCY_SUB', subPrice.id);
  content = upsertEnv(content, 'STRIPE_PRICE_VACANCY_ACTIVATION', actPrice.id);
  fs.writeFileSync(ENV_PATH, content);

  console.log('✓ Aangemaakt en opgeslagen in .env.local:');
  console.log(`  STRIPE_PRICE_VACANCY_SUB=${subPrice.id}        (€17,25/mnd)`);
  console.log(`  STRIPE_PRICE_VACANCY_ACTIVATION=${actPrice.id}  (€1 eenmalig)`);
  console.log('\nHerstart nu de dev-server (npm run dev) zodat de nieuwe env geladen wordt.');
}

main().catch((err) => {
  console.error('✗ Fout:', err.message);
  process.exit(1);
});
