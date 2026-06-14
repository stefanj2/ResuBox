import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user-auth';
import { getCVAccessState } from '@/lib/cv-access';
import { cvSubscriptionEnabled } from '@/lib/cv-subscription-flag';

export const runtime = 'nodejs';

/**
 * GET /api/cv/status
 * Tells the frontend whether the visitor has an active CV-download
 * subscription so the download modal can skip the paywall.
 */
export async function GET() {
  if (!cvSubscriptionEnabled()) {
    return NextResponse.json({ enabled: false, loggedIn: false, access: null });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ enabled: true, loggedIn: false, access: null });
  }

  const access = await getCVAccessState(user.id);
  return NextResponse.json({
    enabled: true,
    loggedIn: true,
    email: user.email,
    access,
  });
}
