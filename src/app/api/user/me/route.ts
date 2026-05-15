import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user-auth';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: { id: user.id, email: user.email, created_at: user.created_at },
  });
}
