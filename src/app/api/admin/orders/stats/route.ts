import { NextResponse } from 'next/server';
import { getOrderStatistics } from '@/lib/orders';

export async function GET() {
  try {
    const stats = await getOrderStatistics();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error('GET /api/admin/orders/stats error:', err);
    return NextResponse.json({ error: 'Fout bij ophalen statistieken' }, { status: 500 });
  }
}
