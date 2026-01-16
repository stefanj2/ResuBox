'use client';

import { OrderStatus } from '@/types/admin';
import { ORDER_STATUS_CONFIG } from '@/lib/orderStatusConfig';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${config.bgColor} ${config.color} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}
