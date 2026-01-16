'use client';

import { useState, useEffect, useCallback } from 'react';
import { CVOrder, OrderStatus, OrderWithActions, OrderStatistics } from '@/types/admin';
import {
  getOrders,
  getOrderWithActions,
  updateOrderStatus,
  getOrderStatistics,
  addOrderAction,
} from '@/lib/orders';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatisticsGrid } from '@/components/admin/StatisticsGrid';
import { FilterSection } from '@/components/admin/FilterSection';
import { OrderList } from '@/components/admin/OrderList';
import { OrderDetailPanel } from '@/components/admin/OrderDetailPanel';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<CVOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithActions | null>(null);
  const [statistics, setStatistics] = useState<OrderStatistics>({
    total: 0,
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
  });
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [ordersData, statsData] = await Promise.all([
        getOrders({ search: searchValue, status: statusFilter }),
        getOrderStatistics(),
      ]);
      setOrders(ordersData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchValue, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSelectOrder = async (order: CVOrder) => {
    const orderWithActions = await getOrderWithActions(order.id);
    setSelectedOrder(orderWithActions);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus, 'admin');

    // Refresh data
    await fetchData();

    // Update selected order if it's the one being changed
    if (selectedOrder?.id === orderId) {
      const updated = await getOrderWithActions(orderId);
      setSelectedOrder(updated);
    }
  };

  const handleSendEmail = async (orderId: string, emailType: string) => {
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, emailType }),
      });

      if (response.ok) {
        await addOrderAction(
          orderId,
          'email_sent',
          `${emailType} email handmatig verstuurd`,
          'admin'
        );
        await fetchData();

        // Update selected order
        if (selectedOrder?.id === orderId) {
          const updated = await getOrderWithActions(orderId);
          setSelectedOrder(updated);
        }
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleStatusFilterClick = (status: OrderStatus | 'all') => {
    setStatusFilter(status);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader onRefresh={handleRefresh} refreshing={refreshing} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Beheer CV download orders</p>
        </div>

        {/* Statistics */}
        <div className="mb-6">
          <StatisticsGrid
            statistics={statistics}
            onStatusClick={handleStatusFilterClick}
            activeStatus={statusFilter}
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterSection
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Order List */}
          <div className="lg:col-span-2">
            <OrderList
              orders={orders}
              selectedOrderId={selectedOrder?.id}
              onSelectOrder={handleSelectOrder}
              loading={loading}
            />
          </div>

          {/* Order Detail */}
          <div className="lg:col-span-3">
            {selectedOrder ? (
              <OrderDetailPanel
                order={selectedOrder}
                onClose={handleCloseDetail}
                onStatusChange={handleStatusChange}
                onSendEmail={handleSendEmail}
              />
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">
                  Selecteer een order
                </h3>
                <p className="text-slate-500 text-sm max-w-xs">
                  Klik op een order in de lijst om de details te bekijken en acties uit te voeren
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
