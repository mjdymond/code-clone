-- Drop and recreate the analyses table to fix schema cache issues
DROP TABLE IF EXISTS public.analyses CASCADE;

-- Recreate the analyses table with the correct structure
CREATE TABLE public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    score INTEGER,
    feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add row-level security policies
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Users can view their own analyses
CREATE POLICY "Users can view their own analyses"
    ON public.analyses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users can insert their own analyses"
    ON public.analyses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses
CREATE POLICY "Users can update their own analyses"
    ON public.analyses
    FOR UPDATE
    USING (auth.uid() = user_id);
