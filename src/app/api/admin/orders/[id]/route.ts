import { NextRequest, NextResponse } from 'next/server';
import { deleteOrder, getOrderWithActions, updateOrder } from '@/lib/orders';
import type { CVOrder } from '@/types/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const order = await getOrderWithActions(id);
    if (!order) return NextResponse.json({ error: 'Order niet gevonden' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    console.error('GET /api/admin/orders/[id] error:', err);
    return NextResponse.json({ error: 'Fout bij ophalen order' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<CVOrder>;
    const updated = await updateOrder(id, body);
    if (!updated) return NextResponse.json({ error: 'Order niet gevonden' }, { status: 404 });
    return NextResponse.json({ order: updated });
  } catch (err) {
    console.error('PATCH /api/admin/orders/[id] error:', err);
    return NextResponse.json({ error: 'Fout bij bijwerken order' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await deleteOrder(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/admin/orders/[id] error:', err);
    return NextResponse.json({ error: 'Fout bij verwijderen order' }, { status: 500 });
  }
}
