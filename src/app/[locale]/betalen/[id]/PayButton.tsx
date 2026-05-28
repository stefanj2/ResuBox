'use client';

import { useState } from 'react';

interface PayButtonProps {
  orderId: string;
  locale: string;
  payNowLabel: string;
  creatingLabel: string;
  errorLabel: string;
}

// Mints a FRESH Stripe Checkout Session on click instead of linking to the
// stored session URL. Checkout Sessions expire after 24h, so a link embedded
// in a dunning email (sent days later) would otherwise be dead. Creating the
// session at click-time guarantees a valid payment link regardless of order age.
export default function PayButton({
  orderId,
  locale,
  payNowLabel,
  creatingLabel,
  errorLabel,
}: PayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || 'no checkout url');
      }
      // Navigate to the fresh Stripe Checkout. Keep `loading` true: the page
      // is leaving, so we don't want the button to look clickable again.
      window.location.href = data.checkoutUrl;
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="mt-3 flex items-center justify-center w-full py-3.5 bg-emerald-600 text-white font-semibold text-[15px] rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-wait"
      >
        {loading ? creatingLabel : payNowLabel}
      </button>
      {error && (
        <p className="mt-2 text-[12px] text-red-600 text-center">{errorLabel}</p>
      )}
    </>
  );
}
