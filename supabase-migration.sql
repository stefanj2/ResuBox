-- CV Orders table
CREATE TABLE IF NOT EXISTS cv_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(50) NOT NULL DEFAULT 'nieuw',

  -- Klantgegevens (uit CVData)
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),

  -- Adresgegevens (voor debiteurenbeheer/brieven)
  customer_address VARCHAR(255),
  customer_house_number VARCHAR(20),
  customer_postal_code VARCHAR(10),
  customer_city VARCHAR(100),

  -- CV referentie
  cv_id VARCHAR(255),
  template_used VARCHAR(50),
  cv_data JSONB, -- Full CV data for PDF regeneration

  -- Financieel
  amount DECIMAL(10, 2) DEFAULT 42.00,
  dossier_number VARCHAR(50) UNIQUE,

  -- Mollie betaling
  mollie_payment_id VARCHAR(255),
  mollie_payment_status VARCHAR(50),
  payment_link VARCHAR(500),
  paid_at TIMESTAMPTZ,

  -- Email tracking
  confirmation_sent_at TIMESTAMPTZ,
  invoice_sent_at TIMESTAMPTZ,
  reminder_1_sent_at TIMESTAMPTZ,
  reminder_2_sent_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Actie historie
CREATE TABLE IF NOT EXISTS order_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES cv_orders(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  action_description TEXT NOT NULL,
  performed_by VARCHAR(255) DEFAULT 'system',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes voor performance
CREATE INDEX IF NOT EXISTS idx_cv_orders_status ON cv_orders(status);
CREATE INDEX IF NOT EXISTS idx_cv_orders_email ON cv_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_cv_orders_created ON cv_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_actions_order ON order_actions(order_id);

-- Row Level Security (RLS) - uitschakelen voor service role
ALTER TABLE cv_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_actions ENABLE ROW LEVEL SECURITY;

-- Policy voor service role (volledige toegang)
CREATE POLICY "Service role has full access to cv_orders" ON cv_orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to order_actions" ON order_actions
  FOR ALL USING (true) WITH CHECK (true);

-- Migration: Add address columns to existing cv_orders table
-- Run these if the table already exists without address columns
ALTER TABLE cv_orders ADD COLUMN IF NOT EXISTS customer_address VARCHAR(255);
ALTER TABLE cv_orders ADD COLUMN IF NOT EXISTS customer_house_number VARCHAR(20);
ALTER TABLE cv_orders ADD COLUMN IF NOT EXISTS customer_postal_code VARCHAR(10);
ALTER TABLE cv_orders ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100);

-- Migration: Add cv_data column for storing full CV data
ALTER TABLE cv_orders ADD COLUMN IF NOT EXISTS cv_data JSONB;
