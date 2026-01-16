'use client';

import { Search, Filter } from 'lucide-react';
import { OrderStatus } from '@/types/admin';
import { ORDER_STATUS_CONFIG, ORDER_STATUSES } from '@/lib/orderStatusConfig';
import { Input } from '@/components/ui';

interface FilterSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: OrderStatus | 'all';
  onStatusChange: (status: OrderStatus | 'all') => void;
}

export function FilterSection({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: FilterSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="flex-1">
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Zoeken op naam, email of dossiernummer..."
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Filter className="w-4 h-4 text-slate-400" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as OrderStatus | 'all')}
          className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-lg text-sm bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[180px]"
        >
          <option value="all">Alle statussen</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_CONFIG[status].label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
