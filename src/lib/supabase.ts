import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create client for browser usage (uses anon key)
let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured. Using localStorage fallback.');
    return null;
  }

  if (!browserClient && supabaseUrl && supabaseAnonKey) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}

// Create admin client for server-side usage (uses service role key)
let serverClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase service role not configured.');
    return null;
  }

  if (!serverClient) {
    serverClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return serverClient;
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      cv_orders: {
        Row: {
          id: string;
          status: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          customer_address: string | null;
          customer_house_number: string | null;
          customer_postal_code: string | null;
          customer_city: string | null;
          cv_id: string | null;
          template_used: string | null;
          cv_data: Record<string, unknown> | null;
          amount: number;
          dossier_number: string | null;
          mollie_payment_id: string | null;
          mollie_payment_status: string | null;
          payment_link: string | null;
          paid_at: string | null;
          confirmation_sent_at: string | null;
          invoice_sent_at: string | null;
          reminder_1_sent_at: string | null;
          reminder_2_sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cv_orders']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['cv_orders']['Row']>;
      };
      order_actions: {
        Row: {
          id: string;
          order_id: string;
          action_type: string;
          action_description: string;
          performed_by: string;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_actions']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['order_actions']['Row']>;
      };
      analytics_events: {
        Row: {
          id: string;
          session_id: string;
          event_type: string;
          section_id: number | null;
          section_name: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['analytics_events']['Row'], 'created_at'> & {
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['analytics_events']['Row']>;
      };
    };
  };
}
