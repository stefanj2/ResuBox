import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/orders';
import type { OrderFilters, OrderStatus } from '@/types/admin';

// TODO: add server-side auth (currently matches existing client-side-only trust model).

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const status = (url.searchParams.get('status') ?? 'all') as OrderFilters['status'];
    const search = url.searchParams.get('search') ?? '';

    const allowedStatuses: OrderFilters['status'][] = [
      'all',
      'nieuw',
      'bevestigd',
      'factuur_verstuurd',
      'herinnering_1',
      'herinnering_2',
      'incasso_overgedragen',
      'betaald',
      'afgeboekt',
    ];
    if (!allowedStatuses.includes(status as OrderStatus | 'all')) {
      return NextResponse.json({ error: 'Ongeldige status' }, { status: 400 });
    }

    const orders = await getOrders({ status, search });
    return NextResponse.json({ orders });
  } catch (err) {
    console.error('GET /api/admin/orders error:', err);
    return NextResponse.json({ error: 'Fout bij ophalen orders' }, { status: 500 });
  }
}
