import { supabase } from '../lib/supabase';
import type { Job } from '@shared/types/supabase';
import { ParserService } from './parser.service';

export interface JobResponse {
  job: Job | null;
  error: Error | null;
}

export interface JobListResponse {
  jobs: Job[];
  error: Error | null;
}

export interface JobScrapeResponse {
  title: string | null;
  company: string | null;
  description: string | null;
  error: Error | null;
}

export interface JobParseResponse {
  parsedContent: Record<string, any> | null;
  error: Error | null;
}

export interface DeleteResponse {
  success: boolean;
  error: Error | null;
}

export interface JobData {
  title: string;
  company: string;
  description: string;
  url?: string;
  userId: string;
}

export const JobService = {
  /**
   * Create a new job posting
   * @param jobData - Data for the new job posting
   */
  async createJob(jobData: JobData): Promise<JobResponse> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            title: jobData.title,
            company: jobData.company,
            description: jobData.description,
            url: jobData.url,
            user_id: jobData.userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { job: data as Job, error: null };
    } catch (error) {
      console.error('Error creating job:', error);
      return { job: null, error: error as Error };
    }
  },

  /**
   * Get all jobs for a user
   * @param userId - User ID to fetch jobs for
   */
  async getUserJobs(userId: string): Promise<JobListResponse> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { jobs: data as Job[], error: null };
    } catch (error) {
      console.error('Error getting user jobs:', error);
      return { jobs: [], error: error as Error };
    }
  },

  /**
   * Get a job by ID
   * @param jobId - Job ID to fetch
   */
  async getJobById(jobId: string): Promise<JobResponse> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;

      return { job: data as Job, error: null };
    } catch (error) {
      console.error('Error getting job by ID:', error);
      return { job: null, error: error as Error };
    }
  },

  /**
   * Update a job
   * @param jobId - Job ID to update
   * @param updates - Fields to update
   */
  async updateJob(jobId: string, updates: Partial<Job>): Promise<JobResponse> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;

      return { job: data as Job, error: null };
    } catch (error) {
      console.error('Error updating job:', error);
      return { job: null, error: error as Error };
    }
  },

  /**
   * Delete a job
   * @param jobId - Job ID to delete
   */
  async deleteJob(jobId: string): Promise<DeleteResponse> {
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting job:', error);
      return { success: false, error: error as Error };
    }
  },

  /**
   * Scrape a job posting from a URL
   * @param url - URL to scrape job posting from
   */
  async scrapeJobPosting(url: string): Promise<JobScrapeResponse> {
    // Delegate to the ParserService for job scraping
    return ParserService.scrapeJobPosting(url);
  },

  /**
   * Parse and structure job description
   * @param description - Job description text to parse
   */
  async parseJobDescription(description: string): Promise<JobParseResponse> {
    try {
      // Delegate to the ParserService for job description parsing
      const parsedContent = await ParserService.parseJobDescription(description);
      return { parsedContent, error: null };
    } catch (error) {
      console.error('Error parsing job description:', error);
      return { parsedContent: null, error: error as Error };
    }
  },
};
