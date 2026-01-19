-- Create analytics_events table for tracking user journey
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  section_id INTEGER,
  section_name TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow inserts for all" ON analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reads only from service role (for admin dashboard)
CREATE POLICY "Allow reads for service role" ON analytics_events
  FOR SELECT
  USING (auth.role() = 'service_role');

-- Add comment for documentation
COMMENT ON TABLE analytics_events IS 'Tracks user journey events for funnel analytics';
COMMENT ON COLUMN analytics_events.session_id IS 'Unique session identifier (generated per browser session)';
COMMENT ON COLUMN analytics_events.event_type IS 'Type of event: session_start, section_view, section_complete, download_initiated, download_completed, payment_started, session_end';
COMMENT ON COLUMN analytics_events.section_id IS 'Section index (0-4 for form sections, 5 for download)';
COMMENT ON COLUMN analytics_events.section_name IS 'Human readable section name';
