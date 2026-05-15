import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user-auth';
import { listUserCvs, createUserCv } from '@/lib/user-cvs';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  const cvs = await listUserCvs(user.id);
  return NextResponse.json({
    cvs: cvs.map((c) => ({
      id: c.id,
      name: c.name,
      cv_data: c.cv_data,
      created_at: c.created_at,
      updated_at: c.updated_at,
    })),
  });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  try {
    const { name, cv_data } = await request.json();
    if (!name || !cv_data) {
      return NextResponse.json({ error: 'name en cv_data zijn vereist' }, { status: 400 });
    }
    const created = await createUserCv(user.id, name, cv_data);
    return NextResponse.json({ cv: created });
  } catch (err) {
    console.error('[POST /api/user/cvs] error:', err);
    return NextResponse.json({ error: 'Aanmaken mislukt' }, { status: 500 });
  }
}
