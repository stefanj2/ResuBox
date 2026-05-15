import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/user-auth';
import { getUserCv, updateUserCv, deleteUserCv } from '@/lib/user-cvs';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  const { id } = await params;
  const cv = await getUserCv(user.id, id);
  if (!cv) return NextResponse.json({ error: 'CV niet gevonden' }, { status: 404 });
  return NextResponse.json({ cv });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await updateUserCv(user.id, id, {
      name: typeof body.name === 'string' ? body.name : undefined,
      cv_data: body.cv_data,
    });
    if (!updated) return NextResponse.json({ error: 'CV niet gevonden' }, { status: 404 });
    return NextResponse.json({ cv: updated });
  } catch (err) {
    console.error('[PATCH /api/user/cvs/[id]] error:', err);
    return NextResponse.json({ error: 'Bijwerken mislukt' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });

  const { id } = await params;
  await deleteUserCv(user.id, id);
  return NextResponse.json({ success: true });
}
