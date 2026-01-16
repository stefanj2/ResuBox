'use client';

import { useState, useEffect, useCallback } from 'react';
import { CVOrder, OrderStatus, OrderWithActions } from '@/types/admin';
import {
  getOrders,
  getOrderWithActions,
  updateOrderStatus,
  addOrderAction,
} from '@/lib/orders';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TestModePanel } from '@/components/admin/TestModePanel';
import { EmailFlowBanner } from '@/components/admin/EmailFlowBanner';
import { PipelineStep } from '@/components/admin/PipelineStep';
import { OrderDetailPanel } from '@/components/admin/OrderDetailPanel';

// Pipeline statuses (excluding betaald and afgeboekt)
const PIPELINE_STATUSES: OrderStatus[] = [
  'nieuw',
  'bevestigd',
  'factuur_verstuurd',
  'herinnering_1',
  'herinnering_2',
];

export default function DebiteurenbeheerPage() {
  const [ordersByStatus, setOrdersByStatus] = useState<Record<OrderStatus, CVOrder[]>>({
    nieuw: [],
    bevestigd: [],
    factuur_verstuurd: [],
    herinnering_1: [],
    herinnering_2: [],
    betaald: [],
    afgeboekt: [],
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderWithActions | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const orders = await getOrders();

      // Group orders by status
      const grouped: Record<OrderStatus, CVOrder[]> = {
        nieuw: [],
        bevestigd: [],
        factuur_verstuurd: [],
        herinnering_1: [],
        herinnering_2: [],
        betaald: [],
        afgeboekt: [],
      };

      orders.forEach((order) => {
        grouped[order.status].push(order);
      });

      setOrdersByStatus(grouped);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh in test mode
  useEffect(() => {
    if (testMode) {
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [testMode, fetchData]);

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
    await fetchData();

    // Update selected order
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
        body: JSON.stringify({ orderId, emailType, testMode }),
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

  const handleTestModeToggle = (enabled: boolean) => {
    setTestMode(enabled);
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_test_mode', enabled.toString());
    }
  };

  // Load test mode from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('admin_test_mode');
      if (stored === 'true') {
        setTestMode(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader onRefresh={handleRefresh} refreshing={refreshing} />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Debiteurenbeheer</h1>
          <p className="text-slate-500 mt-1">Pipeline view van de betalingsflow</p>
        </div>

        {/* Test Mode & Email Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <TestModePanel
            enabled={testMode}
            onToggle={handleTestModeToggle}
            onOrderCreated={fetchData}
          />
          <EmailFlowBanner testMode={testMode} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Pipeline */}
          <div className="xl:col-span-3">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {PIPELINE_STATUSES.map((status) => (
                <PipelineStep
                  key={status}
                  status={status}
                  orders={ordersByStatus[status]}
                  onSelectOrder={handleSelectOrder}
                  selectedOrderId={selectedOrder?.id}
                />
              ))}
            </div>

            {/* Completed/Closed section */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-emerald-800">Betaald</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    {ordersByStatus.betaald.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {ordersByStatus.betaald.slice(0, 5).map((order) => (
                    <button
                      key={order.id}
                      onClick={() => handleSelectOrder(order)}
                      className="w-full text-left text-sm p-2 bg-white rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <span className="font-medium text-slate-900">{order.customer_name}</span>
                      <span className="text-slate-500 ml-2">€{order.amount}</span>
                    </button>
                  ))}
                  {ordersByStatus.betaald.length > 5 && (
                    <p className="text-xs text-emerald-600 text-center">
                      +{ordersByStatus.betaald.length - 5} meer
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-700">Afgeboekt</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-600">
                    {ordersByStatus.afgeboekt.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {ordersByStatus.afgeboekt.slice(0, 5).map((order) => (
                    <button
                      key={order.id}
                      onClick={() => handleSelectOrder(order)}
                      className="w-full text-left text-sm p-2 bg-white rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <span className="font-medium text-slate-900">{order.customer_name}</span>
                      <span className="text-slate-400 ml-2 line-through">€{order.amount}</span>
                    </button>
                  ))}
                  {ordersByStatus.afgeboekt.length > 5 && (
                    <p className="text-xs text-slate-500 text-center">
                      +{ordersByStatus.afgeboekt.length - 5} meer
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="xl:col-span-1">
            {selectedOrder ? (
              <div className="sticky top-24">
                <OrderDetailPanel
                  order={selectedOrder}
                  onClose={handleCloseDetail}
                  onStatusChange={handleStatusChange}
                  onSendEmail={handleSendEmail}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-500">
                  Selecteer een order om details te bekijken
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
