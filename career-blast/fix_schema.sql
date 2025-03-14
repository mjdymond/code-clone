-- Add status column to analyses table if it doesn't exist
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Force refresh of schema cache
COMMENT ON TABLE public.analyses IS 'Table for storing resume analysis results';
