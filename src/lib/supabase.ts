import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseEnvironment = Boolean(supabaseUrl || supabaseAnonKey);
export const supabaseConfigurationError =
  hasSupabaseEnvironment && !(supabaseUrl && supabaseAnonKey)
    ? 'Set both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or remove both to use preview mode.'
    : null;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
