import { NextRequest, NextResponse } from 'next/server';
import { addOrderAction } from '@/lib/orders';
import type { ActionType } from '@/types/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const ALLOWED_ACTIONS: ActionType[] = [
  'order_created',
  'status_changed',
  'email_sent',
  'payment_created',
  'payment_received',
  'payment_failed',
  'manual_action',
  'note_added',
];

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { actionType, description, performedBy, metadata } = await request.json();

    if (!ALLOWED_ACTIONS.includes(actionType)) {
      return NextResponse.json({ error: 'Ongeldig actietype' }, { status: 400 });
    }
    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'description vereist' }, { status: 400 });
    }

    const action = await addOrderAction(id, actionType, description, performedBy ?? 'admin', metadata);
    return NextResponse.json({ action });
  } catch (err) {
    console.error('POST action error:', err);
    return NextResponse.json({ error: 'Fout bij toevoegen actie' }, { status: 500 });
  }
}
