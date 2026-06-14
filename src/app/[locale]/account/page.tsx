import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/user-auth';
import { getCVAccessState } from '@/lib/cv-access';
import { cvSubscriptionEnabled } from '@/lib/cv-subscription-flag';
import { AccountClient } from './AccountClient';

export const runtime = 'nodejs';

/**
 * /account — minimal subscription management page for CV-download subscribers.
 * Server-renders the current subscription state (read from the cv_subscriptions
 * table) and hands it to a small client island that can open the Stripe billing
 * portal to change payment method or cancel.
 */
export default async function AccountPage() {
  if (!cvSubscriptionEnabled()) {
    redirect('/');
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const access = await getCVAccessState(user.id);

  return <AccountClient email={user.email} access={access} />;
}
