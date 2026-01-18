'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CVOrder, OrderStatus, OrderWithActions, OrderStatistics } from '@/types/admin';
import { CVData } from '@/types/cv';
import {
  getOrders,
  getOrderWithActions,
  updateOrderStatus,
  getOrderStatistics,
  addOrderAction,
} from '@/lib/orders';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ViewTabs, ViewMode } from '@/components/admin/ViewTabs';
import { StatisticsGrid } from '@/components/admin/StatisticsGrid';
import { FilterSection } from '@/components/admin/FilterSection';
import { OrderList } from '@/components/admin/OrderList';
import { OrderDetailPanel } from '@/components/admin/OrderDetailPanel';
import { CVPreview } from '@/components/preview';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

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
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cvDataForPdf, setCvDataForPdf] = useState<CVData | null>(null);
  const [mounted, setMounted] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleViewModeChange = (view: ViewMode) => {
    setViewMode(view);
    // Reset status filter when changing view
    setStatusFilter('all');
  };

  // Filter orders based on view mode
  const filteredOrders = orders.filter((order) => {
    if (viewMode === 'betaald') {
      return order.status === 'betaald';
    }
    if (viewMode === 'debiteurs') {
      // Debiteurenbeheer: all unpaid orders (excluding afgeboekt)
      return !['betaald', 'afgeboekt'].includes(order.status);
    }
    return true; // 'all' view shows everything
  });

  // Calculate view counts
  const viewCounts = {
    all: orders.length,
    debiteurs: orders.filter((o) => !['betaald', 'afgeboekt'].includes(o.status)).length,
    betaald: orders.filter((o) => o.status === 'betaald').length,
  };

  const handleDownloadCV = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId) || selectedOrder;
    if (!order?.cv_data) return;

    // Set the CV data to trigger rendering
    setCvDataForPdf(order.cv_data);

    // Wait for the component to render
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const element = pdfContainerRef.current;
    if (!element) {
      setCvDataForPdf(null);
      return;
    }

    try {
      // Temporarily make element visible for capture
      const originalStyle = element.style.cssText;
      element.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: 210mm;
        min-height: 297mm;
        background-color: white;
        z-index: 9999;
        overflow: visible;
      `;

      // Wait for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Create PNG from the template
      const imgData = await toPng(element, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true,
      });

      // Restore original positioning
      element.style.cssText = originalStyle;

      // A4 dimensions in mm
      const a4Width = 210;
      const a4Height = 297;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Create image to get dimensions
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imgData;
      });

      // Calculate scaling to fit A4
      const imgWidth = a4Width;
      const imgHeight = (img.height * a4Width) / img.width;

      // Handle pagination
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= a4Height;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= a4Height;
      }

      // Download PDF
      const fileName = `CV_${order.customer_name.replace(/\s+/g, '_')}_${order.dossier_number}.pdf`;
      pdf.save(fileName);

      // Log the action
      await addOrderAction(orderId, 'manual_action', 'CV PDF gedownload door admin', 'admin');

      // Refresh selected order to show the action
      if (selectedOrder?.id === orderId) {
        const updated = await getOrderWithActions(orderId);
        setSelectedOrder(updated);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setCvDataForPdf(null);
    }
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

        {/* View Tabs */}
        <div className="mb-6">
          <ViewTabs
            activeView={viewMode}
            onViewChange={handleViewModeChange}
            counts={viewCounts}
          />
        </div>

        {/* Statistics - only show on 'all' view */}
        {viewMode === 'all' && (
        <div className="mb-6">
          <StatisticsGrid
            statistics={statistics}
            onStatusClick={handleStatusFilterClick}
            activeStatus={statusFilter}
          />
        </div>
        )}

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
              orders={filteredOrders}
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
                onDownloadCV={handleDownloadCV}
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

      {/* Hidden container for PDF generation */}
      {mounted && cvDataForPdf && createPortal(
        <div
          ref={pdfContainerRef}
          id="admin-pdf-export-container"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '210mm',
            minHeight: '297mm',
            backgroundColor: 'white',
            overflow: 'visible',
            zIndex: -1,
          }}
        >
          <CVPreview dataOverride={cvDataForPdf} />
        </div>,
        document.body
      )}
    </div>
  );
}
