import { supabase } from '../lib/supabase';
import type { Resume, ResumeVersion } from '@shared/types/supabase';
import { ParserService } from './parser.service';

// Type definitions
export interface ResumeUploadResponse {
  resume: Resume | null;
  error: Error | null;
}

export interface ResumeVersionResponse {
  version: ResumeVersion | null;
  error: Error | null;
}

export interface ResumeListResponse {
  resumes: Resume[];
  error: Error | null;
}

export interface ResumeVersionListResponse {
  versions: ResumeVersion[];
  error: Error | null;
}

export interface FileUploadResponse {
  filePath: string | null;
  error: Error | null;
}

export interface ResumeParseResponse {
  content: string | null;
  parsedContent: Record<string, any> | null;
  error: Error | null;
}

export interface DeleteResponse {
  success: boolean;
  error: Error | null;
}

export interface ResumeData {
  title: string;
  originalFileName: string;
  fileType: string;
  content?: string;
  parsedContent?: Record<string, any>;
  userId?: string;
}

export interface ResumeVersionData {
  resumeId: string;
  filePath: string;
  content: string;
  parsedContent: Record<string, any>;
}

// Resume Service organized into logical sections
export const ResumeService = {
  // ==========================================
  // Resume CRUD Operations
  // ==========================================
  
  /**
   * Create a new resume
   * @param resumeData - Data for the new resume
   */
  async createResume(resumeData: ResumeData): Promise<ResumeUploadResponse> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      console.log('Creating resume with data:', {
        title: resumeData.title,
        file_type: resumeData.fileType,
        user_id: resumeData.userId || user.id,
      });
      
      const { data, error } = await supabase
        .from('resumes')
        .insert([
          {
            title: resumeData.title,
            original_file_name: resumeData.originalFileName,
            file_type: resumeData.fileType,
            content: resumeData.content || '',
            user_id: resumeData.userId || user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error from Supabase:', error);
        throw error;
      }

      return { resume: data as Resume, error: null };
    } catch (error) {
      console.error('Error creating resume:', error);
      return { resume: null, error: error as Error };
    }
  },

  /**
   * Get all resumes for a user
   * @param userId - User ID to fetch resumes for
   */
  async getUserResumes(userId: string): Promise<ResumeListResponse> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { resumes: data as Resume[], error: null };
    } catch (error) {
      console.error('Error getting user resumes:', error);
      return { resumes: [], error: error as Error };
    }
  },

  /**
   * Get a resume by ID
   * @param resumeId - Resume ID to fetch
   */
  async getResumeById(resumeId: string): Promise<ResumeUploadResponse> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*, resume_versions(*)')
        .eq('id', resumeId)
        .single();

      if (error) throw error;

      return { resume: data as Resume, error: null };
    } catch (error) {
      console.error('Error getting resume by ID:', error);
      return { resume: null, error: error as Error };
    }
  },

  /**
   * Update a resume
   * @param resumeId - Resume ID to update
   * @param updates - Fields to update
   */
  async updateResume(resumeId: string, updates: Partial<Resume>): Promise<ResumeUploadResponse> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .update(updates)
        .eq('id', resumeId)
        .select()
        .single();

      if (error) throw error;

      return { resume: data as Resume, error: null };
    } catch (error) {
      console.error('Error updating resume:', error);
      return { resume: null, error: error as Error };
    }
  },

  /**
   * Delete a resume and all its versions
   * @param resumeId - Resume ID to delete
   */
  async deleteResume(resumeId: string): Promise<DeleteResponse> {
    try {
      // First get the resume to get file paths for storage cleanup
      const { resume, error: getError } = await this.getResumeById(resumeId);
      if (getError) throw getError;

      if (resume && resume.resume_versions) {
        // Delete all files from storage
        await this._cleanupResumeFiles(resume.resume_versions);
      }

      // Delete the resume (cascade will delete versions)
      const { error } = await supabase.from('resumes').delete().eq('id', resumeId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting resume:', error);
      return { success: false, error: error as Error };
    }
  },

  // ==========================================
  // File Operations
  // ==========================================

  /**
   * Upload a resume file to storage
   * @param file - File to upload
   * @param userId - User ID
   * @param resumeId - Resume ID
   */
  async uploadResumeFile(file: File, userId: string, resumeId: string): Promise<FileUploadResponse> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${resumeId}/${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error } = await supabase.storage.from('documents').upload(filePath, file);

      if (error) throw error;

      // Make sure the file is accessible
      supabase.storage.from('documents').getPublicUrl(filePath);

      return { filePath, error: null };
    } catch (error) {
      console.error('Error uploading resume file:', error);
      return { filePath: null, error: error as Error };
    }
  },

  /**
   * Parse a resume file and extract content
   * @param file - File to parse
   */
  async parseResumeFile(file: File): Promise<ResumeParseResponse> {
    // Delegate to the ParserService for document parsing
    return ParserService.parseDocument(file);
  },

  // ==========================================
  // Version Management
  // ==========================================

  /**
   * Create a new resume version
   * @param versionData - Version data
   */
  async createResumeVersion(versionData: ResumeVersionData): Promise<ResumeVersionResponse> {
    try {
      const { data, error } = await supabase
        .from('resume_versions')
        .insert([
          {
            resume_id: versionData.resumeId,
            file_path: versionData.filePath,
            content: versionData.content,
            parsed_content: versionData.parsedContent,
            version_number: 1, // Initial version
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { version: data as ResumeVersion, error: null };
    } catch (error) {
      console.error('Error creating resume version:', error);
      return { version: null, error: error as Error };
    }
  },

  /**
   * Get all versions of a resume
   * @param resumeId - Resume ID to get versions for
   */
  async getResumeVersions(resumeId: string): Promise<ResumeVersionListResponse> {
    try {
      const { data, error } = await supabase
        .from('resume_versions')
        .select('*')
        .eq('resume_id', resumeId)
        .order('version_number', { ascending: false });

      if (error) throw error;

      return { versions: data as ResumeVersion[], error: null };
    } catch (error) {
      console.error('Error getting resume versions:', error);
      return { versions: [], error: error as Error };
    }
  },

  /**
   * Get a specific version of a resume
   * @param versionId - Version ID to fetch
   */
  async getResumeVersion(versionId: string): Promise<ResumeVersionResponse> {
    try {
      const { data, error } = await supabase
        .from('resume_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (error) throw error;

      return { version: data as ResumeVersion, error: null };
    } catch (error) {
      console.error('Error getting resume version:', error);
      return { version: null, error: error as Error };
    }
  },

  // ==========================================
  // Private Helper Methods
  // ==========================================

  /**
   * Clean up resume files from storage
   * @private
   * @param versions - Resume versions to clean up files for
   */
  async _cleanupResumeFiles(versions: ResumeVersion[]): Promise<void> {
    for (const version of versions) {
      if (version.file_path) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([version.file_path]);
        
        if (storageError) console.error('Error removing file:', storageError);
      }
    }
  }
};
