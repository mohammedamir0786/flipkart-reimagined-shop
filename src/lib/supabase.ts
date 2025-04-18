
import { createClient } from '@supabase/supabase-js'

// Get environment variables or use default values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
