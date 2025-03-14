-- Ensure the status column exists in the analyses table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'analyses' 
                   AND column_name = 'status') THEN
        ALTER TABLE public.analyses ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END
$$;

-- Create or replace the create_analysis function
CREATE OR REPLACE FUNCTION public.create_analysis(
  p_resume_id UUID,
  p_job_id UUID,
  p_user_id UUID
) RETURNS SETOF public.analyses AS $$
BEGIN
  -- Insert the new analysis
  RETURN QUERY
  INSERT INTO public.analyses (resume_id, job_id, user_id, status, created_at, updated_at)
  VALUES (p_resume_id, p_job_id, p_user_id, 'pending', NOW(), NOW())
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
