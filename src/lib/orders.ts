import 'server-only';
import { v4 as uuidv4 } from 'uuid';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import {
  CVOrder,
  OrderAction,
  ActionType,
  OrderStatus,
  OrderWithActions,
  OrderStatistics,
  OrderFilters,
} from '@/types/admin';
import { CVData } from '@/types/cv';
import { db } from './db';
import { cvOrders, orderActions, type CvOrderRow, type OrderActionRow } from '@/db/schema';

function generateDossierNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RB-${year}-${random}`;
}

function rowToOrder(row: CvOrderRow): CVOrder {
  return {
    id: row.id,
    status: row.status,
    customer_name: row.customer_name,
    customer_email: row.customer_email,
    customer_phone: row.customer_phone ?? undefined,
    customer_address: row.customer_address ?? undefined,
    customer_house_number: row.customer_house_number ?? undefined,
    customer_postal_code: row.customer_postal_code ?? undefined,
    customer_city: row.customer_city ?? undefined,
    cv_id: row.cv_id ?? undefined,
    template_used: row.template_used ?? undefined,
    cv_data: row.cv_data ?? undefined,
    amount: typeof row.amount === 'string' ? parseFloat(row.amount) : row.amount,
    dossier_number: row.dossier_number ?? undefined,
    stripe_session_id: row.stripe_session_id ?? undefined,
    stripe_payment_status: row.stripe_payment_status ?? undefined,
    payment_link: row.payment_link ?? undefined,
    paid_at: row.paid_at ?? undefined,
    confirmation_sent_at: row.confirmation_sent_at ?? undefined,
    invoice_sent_at: row.invoice_sent_at ?? undefined,
    reminder_1_sent_at: row.reminder_1_sent_at ?? undefined,
    reminder_2_sent_at: row.reminder_2_sent_at ?? undefined,
    incasso_sent_at: row.incasso_sent_at ?? undefined,
    justus_case_id: row.justus_case_id ?? undefined,
    justus_case_number: row.justus_case_number ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function rowToAction(row: OrderActionRow): OrderAction {
  return {
    id: row.id,
    order_id: row.order_id,
    action_type: row.action_type,
    action_description: row.action_description,
    performed_by: row.performed_by,
    metadata: row.metadata ?? undefined,
    created_at: row.created_at,
  };
}

async function getExistingOrderByEmail(email: string): Promise<CVOrder | null> {
  const rows = await db
    .select()
    .from(cvOrders)
    .where(eq(cvOrders.customer_email, email.toLowerCase()))
    .limit(1);

  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function createOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  customer_house_number?: string;
  customer_postal_code?: string;
  customer_city?: string;
  cv_id?: string;
  template_used?: string;
  cv_data?: CVData;
}): Promise<CVOrder> {
  const existing = await getExistingOrderByEmail(orderData.customer_email);
  if (existing) {
    console.log('📋 Order bestaat al voor:', orderData.customer_email, '- geen nieuwe order aangemaakt');
    return existing;
  }

  const id = uuidv4();
  const dossier_number = generateDossierNumber();

  const [inserted] = await db
    .insert(cvOrders)
    .values({
      id,
      status: 'nieuw',
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email.toLowerCase(),
      customer_phone: orderData.customer_phone,
      customer_address: orderData.customer_address,
      customer_house_number: orderData.customer_house_number,
      customer_postal_code: orderData.customer_postal_code,
      customer_city: orderData.customer_city,
      cv_id: orderData.cv_id,
      template_used: orderData.template_used,
      cv_data: orderData.cv_data,
      amount: '42.00',
      dossier_number,
    })
    .returning();

  const order = rowToOrder(inserted);
  await addOrderAction(order.id, 'order_created', 'Order aangemaakt', 'system');
  return order;
}

const ORDER_LIST_COLUMNS = {
  id: cvOrders.id,
  status: cvOrders.status,
  customer_name: cvOrders.customer_name,
  customer_email: cvOrders.customer_email,
  customer_phone: cvOrders.customer_phone,
  customer_address: cvOrders.customer_address,
  customer_house_number: cvOrders.customer_house_number,
  customer_postal_code: cvOrders.customer_postal_code,
  customer_city: cvOrders.customer_city,
  cv_id: cvOrders.cv_id,
  template_used: cvOrders.template_used,
  amount: cvOrders.amount,
  dossier_number: cvOrders.dossier_number,
  stripe_session_id: cvOrders.stripe_session_id,
  stripe_payment_status: cvOrders.stripe_payment_status,
  payment_link: cvOrders.payment_link,
  paid_at: cvOrders.paid_at,
  confirmation_sent_at: cvOrders.confirmation_sent_at,
  invoice_sent_at: cvOrders.invoice_sent_at,
  reminder_1_sent_at: cvOrders.reminder_1_sent_at,
  reminder_2_sent_at: cvOrders.reminder_2_sent_at,
  incasso_sent_at: cvOrders.incasso_sent_at,
  justus_case_id: cvOrders.justus_case_id,
  justus_case_number: cvOrders.justus_case_number,
  created_at: cvOrders.created_at,
  updated_at: cvOrders.updated_at,
};

export async function getOrders(filters?: OrderFilters): Promise<CVOrder[]> {
  const conditions = [];

  if (filters?.status && filters.status !== 'all') {
    conditions.push(eq(cvOrders.status, filters.status));
  }

  if (filters?.search) {
    const pattern = `%${filters.search}%`;
    const searchCondition = or(
      ilike(cvOrders.customer_name, pattern),
      ilike(cvOrders.customer_email, pattern),
      ilike(cvOrders.dossier_number, pattern)
    );
    if (searchCondition) conditions.push(searchCondition);
  }

  const baseQuery = db
    .select({ ...ORDER_LIST_COLUMNS, cv_data: sql<null>`NULL`.as('cv_data') })
    .from(cvOrders);

  const rows = await (conditions.length
    ? baseQuery.where(and(...conditions))
    : baseQuery
  )
    .orderBy(desc(cvOrders.created_at))
    .limit(200);

  return rows.map((r) => rowToOrder(r as CvOrderRow));
}

export async function getOrder(id: string): Promise<CVOrder | null> {
  const rows = await db.select().from(cvOrders).where(eq(cvOrders.id, id)).limit(1);
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function getOrderByJustusCaseId(caseId: string): Promise<CVOrder | null> {
  const rows = await db
    .select()
    .from(cvOrders)
    .where(eq(cvOrders.justus_case_id, caseId))
    .limit(1);
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function getOrdersDueForAction(): Promise<CVOrder[]> {
  const rows = await db
    .select({ ...ORDER_LIST_COLUMNS, cv_data: sql<null>`NULL`.as('cv_data') })
    .from(cvOrders)
    .where(
      and(
        sql`${cvOrders.status} != 'betaald'`,
        sql`${cvOrders.status} != 'afgeboekt'`
      )
    );
  return rows.map((r) => rowToOrder(r as CvOrderRow));
}

export async function getOrderWithActions(id: string): Promise<OrderWithActions | null> {
  const order = await getOrder(id);
  if (!order) return null;

  const actions = await getOrderActions(id);
  return { ...order, actions };
}

type OrderUpdate = Partial<Omit<CVOrder, 'id' | 'created_at' | 'amount'>> & { amount?: number };

export async function updateOrder(id: string, updates: OrderUpdate): Promise<CVOrder | null> {
  const now = new Date().toISOString();

  const dbUpdates: Record<string, unknown> = { updated_at: now };
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) continue;
    if (key === 'amount' && typeof value === 'number') {
      dbUpdates.amount = value.toFixed(2);
    } else {
      dbUpdates[key] = value;
    }
  }

  const [updated] = await db
    .update(cvOrders)
    .set(dbUpdates)
    .where(eq(cvOrders.id, id))
    .returning();

  return updated ? rowToOrder(updated) : null;
}

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  performedBy: string = 'admin'
): Promise<CVOrder | null> {
  const order = await getOrder(id);
  if (!order) return null;

  const oldStatus = order.status;
  const updatedOrder = await updateOrder(id, { status: newStatus });

  if (updatedOrder) {
    await addOrderAction(
      id,
      'status_changed',
      `Status gewijzigd van "${oldStatus}" naar "${newStatus}"`,
      performedBy,
      { oldStatus, newStatus }
    );
  }

  return updatedOrder;
}

export async function deleteOrder(id: string): Promise<boolean> {
  await db.delete(cvOrders).where(eq(cvOrders.id, id));
  return true;
}

export async function addOrderAction(
  orderId: string,
  actionType: ActionType,
  description: string,
  performedBy: string = 'system',
  metadata?: Record<string, unknown>
): Promise<OrderAction> {
  const [inserted] = await db
    .insert(orderActions)
    .values({
      order_id: orderId,
      action_type: actionType,
      action_description: description,
      performed_by: performedBy,
      metadata,
    })
    .returning();

  return rowToAction(inserted);
}

export async function getOrderActions(orderId: string): Promise<OrderAction[]> {
  const rows = await db
    .select()
    .from(orderActions)
    .where(eq(orderActions.order_id, orderId))
    .orderBy(desc(orderActions.created_at));

  return rows.map(rowToAction);
}

export async function getOrderStatistics(): Promise<OrderStatistics> {
  const orders = await getOrders();

  const stats: OrderStatistics = {
    total: orders.length,
    byStatus: {
      nieuw: 0,
      bevestigd: 0,
      factuur_verstuurd: 0,
      herinnering_1: 0,
      herinnering_2: 0,
      incasso_overgedragen: 0,
      betaald: 0,
      afgeboekt: 0,
    },
    totalRevenue: 0,
    paidRevenue: 0,
    pendingRevenue: 0,
  };

  orders.forEach((order) => {
    stats.byStatus[order.status]++;
    stats.totalRevenue += order.amount;

    if (order.status === 'betaald') {
      stats.paidRevenue += order.amount;
    } else if (order.status !== 'afgeboekt') {
      stats.pendingRevenue += order.amount;
    }
  });

  return stats;
}

export async function getOrdersByStatus(status: OrderStatus): Promise<CVOrder[]> {
  return getOrders({ search: '', status });
}

export async function markEmailSent(
  orderId: string,
  emailType: 'confirmation' | 'invoice' | 'reminder_1' | 'reminder_2' | 'incasso'
): Promise<CVOrder | null> {
  const now = new Date().toISOString();
  const fieldMap = {
    confirmation: 'confirmation_sent_at',
    invoice: 'invoice_sent_at',
    reminder_1: 'reminder_1_sent_at',
    reminder_2: 'reminder_2_sent_at',
    incasso: 'incasso_sent_at',
  } as const;

  const field = fieldMap[emailType];
  return updateOrder(orderId, { [field]: now });
}
