import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user-auth';
import { getAccessState } from '@/lib/vacancy-access';
import { vacanciesEnabled } from '@/lib/vacancies-flag';

export const runtime = 'nodejs';

/**
 * GET /api/vacancies/status
 * Tells the frontend whether the visitor is logged in and whether they have an
 * active Vacaturematch subscription, so it can pick paywall vs. vacancy list.
 */
export async function GET() {
  if (!vacanciesEnabled()) {
    return NextResponse.json({ enabled: false, loggedIn: false, access: null });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ enabled: true, loggedIn: false, access: null });
  }

  const access = await getAccessState(user.id);
  return NextResponse.json({
    enabled: true,
    loggedIn: true,
    email: user.email,
    access,
  });
}
