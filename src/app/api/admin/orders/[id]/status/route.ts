import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/orders';
import type { OrderStatus } from '@/types/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const ALLOWED_STATUSES: OrderStatus[] = [
  'nieuw',
  'bevestigd',
  'factuur_verstuurd',
  'herinnering_1',
  'herinnering_2',
  'incasso_overgedragen',
  'betaald',
  'afgeboekt',
];

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { status, performedBy } = await request.json();

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Ongeldige status' }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status, performedBy ?? 'admin');
    if (!updated) return NextResponse.json({ error: 'Order niet gevonden' }, { status: 404 });
    return NextResponse.json({ order: updated });
  } catch (err) {
    console.error('PATCH status error:', err);
    return NextResponse.json({ error: 'Fout bij bijwerken status' }, { status: 500 });
  }
}
