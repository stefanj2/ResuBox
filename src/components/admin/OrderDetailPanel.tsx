'use client';

import { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Euro,
  CreditCard,
  Send,
  ExternalLink,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { OrderWithActions, OrderStatus } from '@/types/admin';
import { ORDER_STATUS_CONFIG, ORDER_STATUSES } from '@/lib/orderStatusConfig';
import { StatusBadge } from './StatusBadge';
import { ActionHistory } from './ActionHistory';
import { Button } from '@/components/ui';

interface OrderDetailPanelProps {
  order: OrderWithActions;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>;
  onSendEmail: (orderId: string, emailType: string) => Promise<void>;
  onDownloadCV?: (orderId: string) => Promise<void>;
}

export function OrderDetailPanel({
  order,
  onClose,
  onStatusChange,
  onSendEmail,
  onDownloadCV,
}: OrderDetailPanelProps) {
  const [changingStatus, setChangingStatus] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [downloadingCV, setDownloadingCV] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    if (newStatus === order.status) return;

    setChangingStatus(true);
    try {
      await onStatusChange(order.id, newStatus);
    } finally {
      setChangingStatus(false);
    }
  };

  const handleSendEmail = async (emailType: string) => {
    setSendingEmail(emailType);
    try {
      await onSendEmail(order.id, emailType);
    } finally {
      setSendingEmail(null);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadCV = async () => {
    if (!onDownloadCV || !order.cv_data) return;
    setDownloadingCV(true);
    try {
      await onDownloadCV(order.id);
    } finally {
      setDownloadingCV(false);
    }
  };

  const emailButtons = [
    { type: 'confirmation', label: 'Bevestiging', sentAt: order.confirmation_sent_at },
    { type: 'invoice', label: 'Factuur', sentAt: order.invoice_sent_at },
    { type: 'reminder_1', label: '1e Herinnering', sentAt: order.reminder_1_sent_at },
    { type: 'reminder_2', label: 'WIK-brief', sentAt: order.reminder_2_sent_at },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">{order.customer_name}</h2>
            <p className="text-xs text-slate-500 font-mono">{order.dossier_number}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Status Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-700">Status</h3>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <select
              value={order.status}
              onChange={handleStatusChange}
              disabled={changingStatus}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  Wijzig naar: {ORDER_STATUS_CONFIG[status].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Customer Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-700">Klantgegevens</h3>
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4" />
                <span>{order.customer_email}</span>
              </div>
              <button
                onClick={() => copyToClipboard(order.customer_email, 'email')}
                className="p-1 hover:bg-slate-200 rounded transition-colors"
                title="Kopieer email"
              >
                {copiedField === 'email' ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
            {order.customer_phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4" />
                <span>{order.customer_phone}</span>
              </div>
            )}
            {(order.customer_address || order.customer_city) && (
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  {order.customer_address && (
                    <span>
                      {order.customer_address}
                      {order.customer_house_number && ` ${order.customer_house_number}`}
                    </span>
                  )}
                  {order.customer_address && order.customer_city && <br />}
                  {(order.customer_postal_code || order.customer_city) && (
                    <span>
                      {order.customer_postal_code && `${order.customer_postal_code} `}
                      {order.customer_city}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>Aangemaakt: {formatDate(order.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-700">Financieel</h3>
          <div className={`rounded-lg p-4 space-y-3 ${order.status === 'betaald' ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Euro className="w-4 h-4" />
                <span>Bedrag</span>
              </div>
              <span className="font-semibold text-slate-900">
                {formatCurrency(order.amount)}
              </span>
            </div>
            {order.payment_link && order.status !== 'betaald' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CreditCard className="w-4 h-4" />
                  <span>Betaallink</span>
                </div>
                <a
                  href={order.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  Openen <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {order.status === 'betaald' && (
              <div className="border-t border-emerald-200 pt-3 mt-3 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <Check className="w-5 h-5" />
                  <span>Betaling ontvangen via iDEAL</span>
                </div>
                <div className="text-sm text-emerald-600 space-y-1">
                  <p>Betaald op: {formatDate(order.paid_at)}</p>
                  {order.mollie_payment_id && (
                    <p className="font-mono text-xs">Mollie ID: {order.mollie_payment_id}</p>
                  )}
                  {order.mollie_payment_status && (
                    <p>Status: <span className="capitalize font-medium">{order.mollie_payment_status}</span></p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-700">Email Acties</h3>
          <div className="grid grid-cols-2 gap-2">
            {emailButtons.map((email) => (
              <Button
                key={email.type}
                variant={email.sentAt ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => handleSendEmail(email.type)}
                loading={sendingEmail === email.type}
                disabled={sendingEmail !== null}
                icon={email.sentAt ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              >
                {email.label}
              </Button>
            ))}
          </div>
          <div className="text-xs text-slate-500 space-y-1">
            {emailButtons.map(
              (email) =>
                email.sentAt && (
                  <p key={email.type}>
                    {email.label}: {formatDate(email.sentAt)}
                  </p>
                )
            )}
          </div>
        </div>

        {/* CV Details */}
        {(order.cv_id || order.template_used || order.cv_data) && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-700">CV Details</h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              {order.template_used && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FileText className="w-4 h-4" />
                  <span>Template: {order.template_used}</span>
                </div>
              )}
              {order.cv_id && (
                <div className="flex items-center gap-2 text-sm text-slate-500 font-mono text-xs">
                  <span>ID: {order.cv_id}</span>
                </div>
              )}
              {order.cv_data && onDownloadCV && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadCV}
                  loading={downloadingCV}
                  icon={<Download className="w-4 h-4" />}
                  fullWidth
                >
                  Download CV (PDF)
                </Button>
              )}
              {!order.cv_data && (
                <p className="text-xs text-slate-400 italic">
                  CV data niet beschikbaar (oude order)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action History */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-700">Actie Historie</h3>
          <ActionHistory actions={order.actions} />
        </div>
      </div>
    </div>
  );
}
