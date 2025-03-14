import { supabase } from '../lib/supabase';
// import { supabaseAnonKey } from '../lib/supabase'; // Not needed anymore
import type { Analysis, Rewrite } from '@shared/types/supabase';
import { ParserService } from './parser.service';

export interface AnalysisResponse {
  analysis: Analysis | null;
  error: Error | null;
}

export interface RewriteResponse {
  rewrite: Rewrite | null;
  error: Error | null;
}

export interface AnalysisListResponse {
  analyses: Analysis[];
  error: Error | null;
}

export interface RewriteListResponse {
  rewrites: Rewrite[];
  error: Error | null;
}

export interface AnalysisResultResponse {
  result: Record<string, any> | null;
  error: Error | null;
}

export interface RewriteSuggestionResponse {
  suggestion: string | null;
  error: Error | null;
}

export interface DeleteResponse {
  success: boolean;
  error: Error | null;
}

export interface AnalysisData {
  resumeId: string;
  jobId: string;
  userId: string;
}

export interface RewriteData {
  analysisId: string;
  section: string;
  originalContent: string;
  suggestedContent: string;
}

export const AnalysisService = {
  /**
   * Create a new analysis comparing a resume to a job
   * @param analysisData - Data for the new analysis
   */
  async createAnalysis(analysisData: AnalysisData): Promise<AnalysisResponse> {
    console.log('Starting createAnalysis with data:', analysisData);
    try {
      // Use direct insert approach without relying on RPC functions
      // This avoids schema cache issues with both tables and functions
      const { data, error } = await supabase
        .from('analyses')
        .insert({
          resume_id: analysisData.resumeId,
          job_id: analysisData.jobId,
          user_id: analysisData.userId,
          // Do not include status field to avoid schema cache issues
          // The default value 'pending' will be set by the database
        })
        .select()
        .single();

      console.log('Direct insert result:', { data, error });

      if (error) {
        console.error('Insert error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // If the direct insert fails, try a more minimal approach
        if (error.message.includes('status')) {
          console.log('Attempting minimal insert without schema cache fields...');
          const { data: minimalData, error: minimalError } = await supabase
            .from('analyses')
            .insert({
              resume_id: analysisData.resumeId,
              job_id: analysisData.jobId,
              user_id: analysisData.userId
            })
            .select('id, resume_id, job_id, user_id, created_at, updated_at')
            .single();
            
          if (minimalError) {
            console.error('Minimal insert error:', minimalError);
            throw new Error(`Database error: ${minimalError.message}`);
          }
          
          if (!minimalData) {
            throw new Error('No data returned from minimal insert operation');
          }
          
          // Create a complete analysis object with default values for missing fields
          const analysis = {
            ...minimalData,
            status: 'pending',
            match_score: null,
            keyword_matches: {},
            skill_gaps: [],
            recommendations: []
          } as unknown as Analysis;
          
          console.log('Analysis created with minimal approach:', analysis);
          return { analysis, error: null };
        }
        
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from insert operation');
      }

      console.log('Analysis created successfully:', data);
      return { analysis: data as Analysis, error: null };
    } catch (error) {
      console.error('Error creating analysis:', error);
      return { analysis: null, error: error as Error };
    }
  },

  /**
   * Get an analysis by ID
   * @param analysisId - Analysis ID to fetch
   */
  async getAnalysisById(analysisId: string): Promise<AnalysisResponse> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*, resume:resumes(*), job:jobs(*)')
        .eq('id', analysisId)
        .single();

      if (error) throw error;

      return { analysis: data as Analysis, error: null };
    } catch (error) {
      console.error('Error getting analysis by ID:', error);
      return { analysis: null, error: error as Error };
    }
  },

  /**
   * Get all analyses for a user
   * @param userId - User ID to fetch analyses for
   */
  async getUserAnalyses(userId: string): Promise<AnalysisListResponse> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*, resume:resumes(title), job:jobs(title, company)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { analyses: data as Analysis[], error: null };
    } catch (error) {
      console.error('Error getting user analyses:', error);
      return { analyses: [], error: error as Error };
    }
  },

  /**
   * Update an analysis
   * @param analysisId - Analysis ID to update
   * @param updates - Fields to update
   */
  async updateAnalysis(analysisId: string, updates: Partial<Analysis>): Promise<AnalysisResponse> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .update(updates)
        .eq('id', analysisId)
        .select()
        .single();

      if (error) throw error;

      return { analysis: data as Analysis, error: null };
    } catch (error) {
      console.error('Error updating analysis:', error);
      return { analysis: null, error: error as Error };
    }
  },

  /**
   * Delete an analysis
   * @param analysisId - Analysis ID to delete
   */
  async deleteAnalysis(analysisId: string): Promise<DeleteResponse> {
    try {
      const { error } = await supabase.from('analyses').delete().eq('id', analysisId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting analysis:', error);
      return { success: false, error: error as Error };
    }
  },

  /**
   * Create a rewrite suggestion for a resume section
   * @param rewriteData - Data for the new rewrite suggestion
   */
  async createRewrite(rewriteData: RewriteData): Promise<RewriteResponse> {
    try {
      const { data, error } = await supabase
        .from('rewrites')
        .insert([
          {
            analysis_id: rewriteData.analysisId,
            section: rewriteData.section,
            original_content: rewriteData.originalContent,
            suggested_content: rewriteData.suggestedContent,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { rewrite: data as Rewrite, error: null };
    } catch (error) {
      console.error('Error creating rewrite:', error);
      return { rewrite: null, error: error as Error };
    }
  },

  /**
   * Get all rewrites for an analysis
   * @param analysisId - Analysis ID to fetch rewrites for
   */
  async getAnalysisRewrites(analysisId: string): Promise<RewriteListResponse> {
    try {
      const { data, error } = await supabase
        .from('rewrites')
        .select('*')
        .eq('analysis_id', analysisId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { rewrites: data as Rewrite[], error: null };
    } catch (error) {
      console.error('Error getting analysis rewrites:', error);
      return { rewrites: [], error: error as Error };
    }
  },

  /**
   * Generate an analysis comparing a resume to a job
   * @param resumeId - Resume ID to analyze
   * @param jobId - Job ID to compare against
   */
  async generateAnalysis(resumeId: string, jobId: string): Promise<AnalysisResultResponse> {
    try {
      // Get resume and job data
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('*, resume_versions(content, parsed_content)')
        .eq('id', resumeId)
        .single();

      if (resumeError) throw resumeError;

      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      // Delegate analysis to ParserService
      const result = await ParserService.analyzeResume(resumeData, jobData);
      
      return {
        result,
        error: null,
      };
    } catch (error) {
      console.error('Error generating analysis:', error);
      return { result: null, error: error as Error };
    }
  },

  /**
   * Generate rewrite suggestions for a resume section
   * @param section - Resume section to rewrite
   * @param content - Original content of the section
   * @param jobDescription - Job description to tailor the rewrite to
   */
  async generateRewriteSuggestion(section: string, content: string, jobDescription: string): Promise<RewriteSuggestionResponse> {
    try {
      // Delegate rewrite suggestion to ParserService
      const suggestion = await ParserService.generateRewriteSuggestion(section, content, jobDescription);
      
      return {
        suggestion,
        error: null,
      };
    } catch (error) {
      console.error('Error generating rewrite suggestion:', error);
      return { suggestion: null, error: error as Error };
    }
  },

  /**
   * Test the analyze-resume edge function directly
   * @param resumeContent - Raw resume content to analyze
   * @param jobDescription - Job description to compare against
   */
  async testEdgeFunction(resumeContent: string, jobDescription: string): Promise<any> {
    try {
      console.log('TEST: Starting edge function test with:');
      console.log('- Resume content length:', resumeContent?.length || 0);
      console.log('- Job description length:', jobDescription?.length || 0);
      
      // Try with the Supabase client's functions.invoke method first
      try {
        console.log('TEST: Attempting to invoke edge function with Supabase client');
        
        // Add a timestamp to prevent caching issues
        const timestamp = new Date().getTime();
        
        const { data, error } = await supabase.functions.invoke(
          'analyze-resume',
          {
            body: { 
              resumeContent: resumeContent || 'Sample resume content for testing',
              jobDescription: jobDescription || 'Sample job description for testing',
              timestamp // Add timestamp to prevent caching
            }
          }
        );
        
        if (error) {
          console.error('TEST: Edge function error with Supabase client:', error);
          // Continue to the fallback approach
          throw error;
        }
        
        console.log('TEST: Edge function response successful with Supabase client');
        return { 
          success: true, 
          data,
          method: 'supabase-client'
        };
      } catch (supabaseError) {
        // If the Supabase client approach fails, try with a direct fetch
        console.log('TEST: Supabase client approach failed, trying direct fetch');
        console.error('TEST: Supabase error details:', supabaseError);
        
        // Use direct fetch as a fallback
        const functionUrl = 'https://tircatiycsdtccomxxzs.functions.supabase.co/analyze-resume';
        console.log('TEST: Attempting direct fetch to:', functionUrl);
        
        // Get the anon key from the Supabase configuration
        const { supabaseAnonKey } = await import('../lib/supabase');
        console.log('TEST: Using anon key for authorization');
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            resumeContent: resumeContent || 'Sample resume content for testing',
            jobDescription: jobDescription || 'Sample job description for testing',
            timestamp: new Date().getTime()
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('TEST: Direct fetch error:', response.status, response.statusText);
          console.error('TEST: Error response body:', errorText);
          
          return {
            success: false,
            error: `HTTP error ${response.status}: ${response.statusText}`,
            errorDetails: errorText,
            method: 'direct-fetch'
          };
        }
        
        const data = await response.json();
        console.log('TEST: Direct fetch successful');
        
        return {
          success: true,
          data,
          method: 'direct-fetch'
        };
      }
    } catch (error: unknown) {
      console.error('TEST: All approaches failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : 'No stack trace';
      
      return {
        success: false,
        error: errorMessage,
        stack: errorStack,
        method: 'all-failed'
      };
    }
  },
};
