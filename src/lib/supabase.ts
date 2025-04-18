
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use placeholder values in development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Console warning if using placeholder values
if (supabaseUrl === 'https://your-project.supabase.co') {
  console.warn(
    'Missing Supabase URL. Please set your VITE_SUPABASE_URL environment variable.'
  );
}

if (!supabaseAnonKey) {
  console.warn(
    'Missing Supabase Anon Key. Please set your VITE_SUPABASE_ANON_KEY environment variable.'
  );
}
