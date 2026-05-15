// Client-safe fetch wrappers for order operations.
// These are drop-in replacements for the server-only helpers in @/lib/orders
// for use in client components.

import type {
  CVOrder,
  OrderAction,
  ActionType,
  OrderStatus,
  OrderWithActions,
  OrderStatistics,
  OrderFilters,
} from '@/types/admin';
import type { CVData } from '@/types/cv';

async function jsonFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
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
  const { order } = await jsonFetch<{ order: CVOrder }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return order;
}

export async function getOrders(filters?: OrderFilters): Promise<CVOrder[]> {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters?.search) params.set('search', filters.search);
  const query = params.toString();
  const { orders } = await jsonFetch<{ orders: CVOrder[] }>(
    `/api/admin/orders${query ? `?${query}` : ''}`
  );
  return orders;
}

export async function getOrder(id: string): Promise<CVOrder | null> {
  try {
    const { order } = await jsonFetch<{ order: OrderWithActions }>(`/api/admin/orders/${id}`);
    return order;
  } catch (err) {
    if (err instanceof Error && err.message.includes('niet gevonden')) return null;
    throw err;
  }
}

export async function getOrderWithActions(id: string): Promise<OrderWithActions | null> {
  try {
    const { order } = await jsonFetch<{ order: OrderWithActions }>(`/api/admin/orders/${id}`);
    return order;
  } catch (err) {
    if (err instanceof Error && err.message.includes('niet gevonden')) return null;
    throw err;
  }
}

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  performedBy: string = 'admin'
): Promise<CVOrder | null> {
  try {
    const { order } = await jsonFetch<{ order: CVOrder }>(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, performedBy }),
    });
    return order;
  } catch (err) {
    if (err instanceof Error && err.message.includes('niet gevonden')) return null;
    throw err;
  }
}

export async function updateOrder(id: string, updates: Partial<CVOrder>): Promise<CVOrder | null> {
  try {
    const { order } = await jsonFetch<{ order: CVOrder }>(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return order;
  } catch (err) {
    if (err instanceof Error && err.message.includes('niet gevonden')) return null;
    throw err;
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  await jsonFetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
  return true;
}

export async function addOrderAction(
  orderId: string,
  actionType: ActionType,
  description: string,
  performedBy: string = 'admin',
  metadata?: Record<string, unknown>
): Promise<OrderAction> {
  const { action } = await jsonFetch<{ action: OrderAction }>(
    `/api/admin/orders/${orderId}/actions`,
    {
      method: 'POST',
      body: JSON.stringify({ actionType, description, performedBy, metadata }),
    }
  );
  return action;
}

export async function getOrderStatistics(): Promise<OrderStatistics> {
  const { stats } = await jsonFetch<{ stats: OrderStatistics }>('/api/admin/orders/stats');
  return stats;
}

export async function getOrdersByStatus(status: OrderStatus): Promise<CVOrder[]> {
  return getOrders({ search: '', status });
}
