import { v4 as uuidv4 } from 'uuid';
import { CVOrder, OrderAction, OrderStatus, OrderWithActions, OrderStatistics, OrderFilters } from '@/types/admin';
import { CVData } from '@/types/cv';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const ORDERS_STORAGE_KEY = 'cv_orders';
const ACTIONS_STORAGE_KEY = 'order_actions';

// Helper to generate dossier number
function generateDossierNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `RB-${year}-${random}`;
}

// localStorage operations for fallback
function getLocalOrders(): CVOrder[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ORDERS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function setLocalOrders(orders: CVOrder[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function getLocalActions(): OrderAction[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ACTIONS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function setLocalActions(actions: OrderAction[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actions));
}

// Create a new order
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
  const now = new Date().toISOString();
  const newOrder: CVOrder = {
    id: uuidv4(),
    status: 'nieuw',
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    customer_phone: orderData.customer_phone,
    customer_address: orderData.customer_address,
    customer_house_number: orderData.customer_house_number,
    customer_postal_code: orderData.customer_postal_code,
    customer_city: orderData.customer_city,
    cv_id: orderData.cv_id,
    template_used: orderData.template_used,
    cv_data: orderData.cv_data,
    amount: 42.0,
    dossier_number: generateDossierNumber(),
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('cv_orders')
      .insert(newOrder)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      // Fallback to localStorage
      const orders = getLocalOrders();
      orders.push(newOrder);
      setLocalOrders(orders);
      await addOrderAction(newOrder.id, 'order_created', 'Order aangemaakt', 'system');
      return newOrder;
    }

    await addOrderAction(data.id, 'order_created', 'Order aangemaakt', 'system');
    return data as CVOrder;
  }

  // localStorage fallback
  const orders = getLocalOrders();
  orders.push(newOrder);
  setLocalOrders(orders);
  await addOrderAction(newOrder.id, 'order_created', 'Order aangemaakt', 'system');
  return newOrder;
}

// Get all orders with optional filters
export async function getOrders(filters?: OrderFilters): Promise<CVOrder[]> {
  const supabase = getSupabaseClient();

  let orders: CVOrder[];

  if (supabase && isSupabaseConfigured) {
    let query = supabase
      .from('cv_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(
        `customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,dossier_number.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      orders = getLocalOrders();
    } else {
      orders = (data || []) as CVOrder[];
    }
  } else {
    orders = getLocalOrders();
  }

  // Apply filters for localStorage data
  if (filters && !isSupabaseConfigured) {
    if (filters.status && filters.status !== 'all') {
      orders = orders.filter((o) => o.status === filters.status);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(search) ||
          o.customer_email.toLowerCase().includes(search) ||
          o.dossier_number?.toLowerCase().includes(search)
      );
    }
    // Sort by created_at descending
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return orders;
}

// Get a single order by ID
export async function getOrder(id: string): Promise<CVOrder | null> {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('cv_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch error:', error);
      const orders = getLocalOrders();
      return orders.find((o) => o.id === id) || null;
    }

    return data as CVOrder;
  }

  const orders = getLocalOrders();
  return orders.find((o) => o.id === id) || null;
}

// Get order with actions
export async function getOrderWithActions(id: string): Promise<OrderWithActions | null> {
  const order = await getOrder(id);
  if (!order) return null;

  const actions = await getOrderActions(id);
  return { ...order, actions };
}

// Update an order
export async function updateOrder(id: string, updates: Partial<CVOrder>): Promise<CVOrder | null> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('cv_orders')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      // Fallback to localStorage
      const orders = getLocalOrders();
      const index = orders.findIndex((o) => o.id === id);
      if (index === -1) return null;
      orders[index] = { ...orders[index], ...updates, updated_at: now };
      setLocalOrders(orders);
      return orders[index];
    }

    return data as CVOrder;
  }

  // localStorage fallback
  const orders = getLocalOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...updates, updated_at: now };
  setLocalOrders(orders);
  return orders[index];
}

// Update order status with action logging
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

// Delete an order
export async function deleteOrder(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    // First delete actions
    await supabase.from('order_actions').delete().eq('order_id', id);

    const { error } = await supabase.from('cv_orders').delete().eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      // Fallback to localStorage
      const orders = getLocalOrders();
      const filtered = orders.filter((o) => o.id !== id);
      setLocalOrders(filtered);
      const actions = getLocalActions();
      setLocalActions(actions.filter((a) => a.order_id !== id));
      return true;
    }

    return true;
  }

  // localStorage fallback
  const orders = getLocalOrders();
  const filtered = orders.filter((o) => o.id !== id);
  setLocalOrders(filtered);
  const actions = getLocalActions();
  setLocalActions(actions.filter((a) => a.order_id !== id));
  return true;
}

// Add an action to an order
export async function addOrderAction(
  orderId: string,
  actionType: OrderAction['action_type'],
  description: string,
  performedBy: string = 'system',
  metadata?: Record<string, unknown>
): Promise<OrderAction> {
  const action: OrderAction = {
    id: uuidv4(),
    order_id: orderId,
    action_type: actionType,
    action_description: description,
    performed_by: performedBy,
    metadata,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    const { error } = await supabase.from('order_actions').insert(action);

    if (error) {
      console.error('Supabase action insert error:', error);
      // Fallback to localStorage
      const actions = getLocalActions();
      actions.push(action);
      setLocalActions(actions);
    }
  } else {
    const actions = getLocalActions();
    actions.push(action);
    setLocalActions(actions);
  }

  return action;
}

// Get actions for an order
export async function getOrderActions(orderId: string): Promise<OrderAction[]> {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('order_actions')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase actions fetch error:', error);
      return getLocalActions().filter((a) => a.order_id === orderId);
    }

    return (data || []) as OrderAction[];
  }

  return getLocalActions()
    .filter((a) => a.order_id === orderId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// Get order statistics
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

// Get orders by status (for pipeline view)
export async function getOrdersByStatus(status: OrderStatus): Promise<CVOrder[]> {
  return getOrders({ search: '', status });
}

// Mark email as sent
export async function markEmailSent(
  orderId: string,
  emailType: 'confirmation' | 'invoice' | 'reminder_1' | 'reminder_2'
): Promise<CVOrder | null> {
  const now = new Date().toISOString();
  const fieldMap = {
    confirmation: 'confirmation_sent_at',
    invoice: 'invoice_sent_at',
    reminder_1: 'reminder_1_sent_at',
    reminder_2: 'reminder_2_sent_at',
  };

  const field = fieldMap[emailType] as keyof CVOrder;
  return updateOrder(orderId, { [field]: now });
}
