'use client';

import { useState } from 'react';
import { FlaskConical, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { createOrder } from '@/lib/orders';

interface TestModePanelProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onOrderCreated: () => void;
}

export function TestModePanel({ enabled, onToggle, onOrderCreated }: TestModePanelProps) {
  const [creating, setCreating] = useState(false);

  const handleCreateTestOrder = async () => {
    setCreating(true);
    try {
      // Generate random test data
      const testNames = [
        'Jan de Vries',
        'Maria van den Berg',
        'Pieter Jansen',
        'Anna Bakker',
        'Thomas Visser',
      ];
      const testEmails = [
        'jan@example.com',
        'maria@example.com',
        'pieter@example.com',
        'anna@example.com',
        'thomas@example.com',
      ];
      const templates = ['modern', 'zakelijk', 'creatief', 'minimalist', 'executive', 'tech'];

      const randomIndex = Math.floor(Math.random() * testNames.length);
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

      await createOrder({
        customer_name: testNames[randomIndex],
        customer_email: testEmails[randomIndex],
        customer_phone: `06-${Math.floor(10000000 + Math.random() * 90000000)}`,
        cv_id: `test-${Date.now()}`,
        template_used: randomTemplate,
      });

      onOrderCreated();
    } catch (error) {
      console.error('Error creating test order:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className={`rounded-xl border-2 border-dashed p-4 transition-colors ${
        enabled
          ? 'border-amber-300 bg-amber-50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              enabled ? 'bg-amber-100' : 'bg-slate-100'
            }`}
          >
            <FlaskConical
              className={`w-5 h-5 ${enabled ? 'text-amber-600' : 'text-slate-500'}`}
            />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">Test Modus</h3>
            <p className="text-xs text-slate-500">
              {enabled
                ? 'Versnelde email flow (10s → 30s → 1m → 2m)'
                : 'Normale email flow (4u → 24u → 7d → 14d)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {enabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateTestOrder}
              disabled={creating}
              icon={
                creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )
              }
            >
              Test Order
            </Button>
          )}

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
