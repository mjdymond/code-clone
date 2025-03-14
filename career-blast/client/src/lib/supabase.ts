import { createClient } from '@supabase/supabase-js';

// Use type-only import to avoid runtime dependency
type Database = any; // This is a temporary fix until we properly set up the types

// Use direct values from the Supabase environment file
export const supabaseUrl = 'https://tircatiycsdtccomxxzs.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcmNhdGl5Y3NkdGNjb214eHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzMyNjQsImV4cCI6MjA1NzQ0OTI2NH0.ufFAoLU-xprMESEwkEo74vAaE3k-qJExPyzN43YEHBM';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with minimal configuration
// Sometimes additional options can cause issues with edge function calls
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
