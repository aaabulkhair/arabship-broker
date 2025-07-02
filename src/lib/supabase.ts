import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables with safe fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a safe client that won't crash in development
let supabase: SupabaseClient<Database>;

try {
  if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
    console.warn('⚠️ Supabase environment variables not found. Using mock client for development.');
    
    // Create a comprehensive mock client for development
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: (callback: any) => {
          // Call callback immediately with null session
          callback('SIGNED_OUT', null);
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        signOut: () => Promise.resolve({ error: null }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: null }),
        signUp: () => Promise.resolve({ data: null, error: null }),
      },
      from: (_table: string) => ({
        select: (_columns: string = '*') => ({
          eq: (_column: string, _value: any) => ({
            single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
            order: (_column: string, _options?: any) => Promise.resolve({ data: [], error: null }),
          }),
          or: (_conditions: string) => ({
            order: (_column: string, _options?: any) => Promise.resolve({ data: [], error: null }),
          }),
          order: (_column: string, _options?: any) => Promise.resolve({ data: [], error: null }),
        }),
        insert: (_data: any) => ({
          select: (_columns?: string) => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        update: (_data: any) => ({
          eq: (_column: string, _value: any) => Promise.resolve({ data: null, error: null }),
        }),
        delete: () => ({
          eq: (_column: string, _value: any) => Promise.resolve({ data: null, error: null }),
        }),
      }),
    } as SupabaseClient<Database>;
  } else {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Fallback to mock client
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        callback('SIGNED_OUT', null);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signOut: () => Promise.resolve({ error: null }),
    },
    from: (_table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
    }),
  } as SupabaseClient<Database>;
}

export { supabase };

export type Database = {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: number;
          name: string;
          email: string;
          company: string | null;
          phone: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          email: string;
          company?: string | null;
          phone?: string | null;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          company?: string | null;
          phone?: string | null;
          message?: string;
          created_at?: string;
        };
      };
      cargo_listings: {
        Row: {
          id: number;
          cargo_type: string;
          origin_port: string;
          destination_port: string;
          cargo_weight: number | null;
          cargo_volume: number | null;
          preferred_vessel_type: string | null;
          loading_date: string | null;
          contact_name: string;
          contact_email: string;
          contact_phone: string | null;
          company: string | null;
          additional_details: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          cargo_type: string;
          origin_port: string;
          destination_port: string;
          cargo_weight?: number | null;
          cargo_volume?: number | null;
          preferred_vessel_type?: string | null;
          loading_date?: string | null;
          contact_name: string;
          contact_email: string;
          contact_phone?: string | null;
          company?: string | null;
          additional_details?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          cargo_type?: string;
          origin_port?: string;
          destination_port?: string;
          cargo_weight?: number | null;
          cargo_volume?: number | null;
          preferred_vessel_type?: string | null;
          loading_date?: string | null;
          contact_name?: string;
          contact_email?: string;
          contact_phone?: string | null;
          company?: string | null;
          additional_details?: string | null;
          created_at?: string;
        };
      };
      vessel_listings: {
        Row: {
          id: number;
          vessel_name: string;
          vessel_type: string;
          dwt: number | null;
          length: number | null;
          beam: number | null;
          draft: number | null;
          year_built: number | null;
          flag: string | null;
          current_location: string | null;
          availability_date: string | null;
          daily_rate: number | null;
          owner_name: string;
          owner_email: string;
          owner_phone: string | null;
          company: string | null;
          additional_specs: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          vessel_name: string;
          vessel_type: string;
          dwt?: number | null;
          length?: number | null;
          beam?: number | null;
          draft?: number | null;
          year_built?: number | null;
          flag?: string | null;
          current_location?: string | null;
          availability_date?: string | null;
          daily_rate?: number | null;
          owner_name: string;
          owner_email: string;
          owner_phone?: string | null;
          company?: string | null;
          additional_specs?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          vessel_name?: string;
          vessel_type?: string;
          dwt?: number | null;
          length?: number | null;
          beam?: number | null;
          draft?: number | null;
          year_built?: number | null;
          flag?: string | null;
          current_location?: string | null;
          availability_date?: string | null;
          daily_rate?: number | null;
          owner_name?: string;
          owner_email?: string;
          owner_phone?: string | null;
          company?: string | null;
          additional_specs?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          company: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          company?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          company?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cargo: {
        Row: {
          id: string;
          owner_id: string;
          cargo_name: string;
          quantity: string;
          quantity_unit: string;
          imsbc_type: string;
          stowage_factor: string | null;
          loading_port: string;
          discharging_port: string;
          laycan_from: string;
          laycan_to: string;
          target_freight: string | null;
          status: 'active' | 'matched' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          cargo_name: string;
          quantity: string;
          quantity_unit: string;
          imsbc_type: string;
          stowage_factor?: string | null;
          loading_port: string;
          discharging_port: string;
          laycan_from: string;
          laycan_to: string;
          target_freight?: string | null;
          status?: 'active' | 'matched' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          cargo_name?: string;
          quantity?: string;
          quantity_unit?: string;
          imsbc_type?: string;
          stowage_factor?: string | null;
          loading_port?: string;
          discharging_port?: string;
          laycan_from?: string;
          laycan_to?: string;
          target_freight?: string | null;
          status?: 'active' | 'matched' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      vessels: {
        Row: {
          id: string;
          owner_id: string;
          vessel_name: string;
          vessel_type: string;
          dwt: string;
          year_built: string;
          flag: string;
          has_gear: boolean;
          gear_details: string | null;
          fuel_consumption: string | null;
          current_location: string;
          availability: string;
          preferred_trade: string | null;
          target_rate: string | null;
          status: 'active' | 'matched' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          vessel_name: string;
          vessel_type: string;
          dwt: string;
          year_built: string;
          flag: string;
          has_gear: boolean;
          gear_details?: string | null;
          fuel_consumption?: string | null;
          current_location: string;
          availability: string;
          preferred_trade?: string | null;
          target_rate?: string | null;
          status?: 'active' | 'matched' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          vessel_name?: string;
          vessel_type?: string;
          dwt?: string;
          year_built?: string;
          flag?: string;
          has_gear?: boolean;
          gear_details?: string | null;
          fuel_consumption?: string | null;
          current_location?: string;
          availability?: string;
          preferred_trade?: string | null;
          target_rate?: string | null;
          status?: 'active' | 'matched' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          cargo_id: string;
          vessel_id: string;
          score: number;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cargo_id: string;
          vessel_id: string;
          score: number;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cargo_id?: string;
          vessel_id?: string;
          score?: number;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          subscribed_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          subscribed_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          subscribed_at?: string;
          is_active?: boolean;
        };
      };
    };
  };
};