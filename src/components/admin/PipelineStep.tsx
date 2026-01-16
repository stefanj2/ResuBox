'use client';

import { CVOrder, OrderStatus } from '@/types/admin';
import { ORDER_STATUS_CONFIG } from '@/lib/orderStatusConfig';
import { OrderCard } from './OrderCard';

interface PipelineStepProps {
  status: OrderStatus;
  orders: CVOrder[];
  onSelectOrder: (order: CVOrder) => void;
  selectedOrderId?: string;
}

export function PipelineStep({
  status,
  orders,
  onSelectOrder,
  selectedOrderId,
}: PipelineStepProps) {
  const config = ORDER_STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="flex-1 min-w-[280px] bg-slate-50 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <h3 className="font-medium text-slate-900">{config.label}</h3>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
        >
          {orders.length}
        </span>
      </div>

      {/* Order Cards */}
      <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            Geen orders
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => onSelectOrder(order)}
              selected={order.id === selectedOrderId}
            />
          ))
        )}
      </div>
    </div>
  );
}
