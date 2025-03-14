-- Drop all existing tables and functions to start fresh
DROP TABLE IF EXISTS public.rewrites CASCADE;
DROP TABLE IF EXISTS public.analyses CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.resume_versions CASCADE;
DROP TABLE IF EXISTS public.resumes CASCADE;
DROP FUNCTION IF EXISTS public.create_analysis;

-- Create tables

-- Resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB,
  file_type TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume versions table
CREATE TABLE IF NOT EXISTS public.resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  content JSONB,
  version_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT,
  description TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyses table
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  score INTEGER,
  feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rewrites table
CREATE TABLE IF NOT EXISTS public.rewrites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  original_content TEXT,
  suggested_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewrites ENABLE ROW LEVEL SECURITY;

-- Create policies for resumes table
CREATE POLICY "Users can view their own resumes" 
  ON public.resumes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes" 
  ON public.resumes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" 
  ON public.resumes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" 
  ON public.resumes FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for resume_versions table
CREATE POLICY "Users can view their own resume versions" 
  ON public.resume_versions FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM public.resumes WHERE id = resume_id));

CREATE POLICY "Users can insert their own resume versions" 
  ON public.resume_versions FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.resumes WHERE id = resume_id));

-- Create policies for jobs table
CREATE POLICY "Users can view their own jobs" 
  ON public.jobs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jobs" 
  ON public.jobs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" 
  ON public.jobs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs" 
  ON public.jobs FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for analyses table
CREATE POLICY "Users can view their own analyses" 
  ON public.analyses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" 
  ON public.analyses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" 
  ON public.analyses FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policies for rewrites table
CREATE POLICY "Users can view their own rewrites" 
  ON public.rewrites FOR SELECT 
  USING (auth.uid() = (SELECT user_id FROM public.analyses WHERE id = analysis_id));

CREATE POLICY "Users can insert their own rewrites" 
  ON public.rewrites FOR INSERT 
  WITH CHECK (auth.uid() = (SELECT user_id FROM public.analyses WHERE id = analysis_id));

-- Create a stored procedure to create analyses
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
