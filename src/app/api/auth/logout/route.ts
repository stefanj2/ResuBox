import { NextResponse } from 'next/server';
import { logout } from '@/lib/user-auth';

export const runtime = 'nodejs';

export async function POST() {
  await logout();
  return NextResponse.json({ success: true });
}
