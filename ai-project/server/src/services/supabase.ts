import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side supabase (for user operations with RLS)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin supabase (bypasses RLS - use carefully)
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;