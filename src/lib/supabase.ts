
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use placeholder values in development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';

// Use a non-empty string as fallback for the anon key
// This will prevent the error but won't actually connect to Supabase
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if we're using placeholder values and log warnings
if (supabaseUrl === 'https://placeholder-project.supabase.co') {
  console.warn(
    'Using placeholder Supabase URL. Please set your VITE_SUPABASE_URL environment variable.'
  );
}

if (supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0') {
  console.warn(
    'Using placeholder Supabase Anon Key. Please set your VITE_SUPABASE_ANON_KEY environment variable.'
  );
}

// Mock implementation for functions.invoke when using placeholder credentials
const originalInvoke = supabase.functions.invoke;
supabase.functions.invoke = async (functionName: string, options?: any) => {
  if (supabaseUrl === 'https://placeholder-project.supabase.co' || 
      supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0') {
    console.warn(`Mock function call to "${functionName}". Connect to a real Supabase project to use this feature.`);
    
    // For the create-payment function, return a mock response
    if (functionName === 'create-payment') {
      if (options?.body?.customerInfo?.email?.includes('error')) {
        return { error: 'Payment error', status: 500 };
      }
      
      return { 
        data: { 
          url: '/returns?success=true',
          session_id: 'mock_session_id',
          order_id: 'mock_order_id'
        }, 
        status: 200 
      };
    }
    
    return { data: null, error: null };
  }
  
  return originalInvoke(functionName, options);
};
