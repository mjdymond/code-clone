export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: Json
          original_file_name: string
          file_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: Json
          original_file_name: string
          file_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: Json
          original_file_name?: string
          file_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      resume_versions: {
        Row: {
          id: string
          resume_id: string
          version_number: number
          file_path: string
          content: string | null
          parsed_content: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          resume_id: string
          version_number: number
          file_path: string
          content?: string | null
          parsed_content?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          resume_id?: string
          version_number?: number
          file_path?: string
          content?: string | null
          parsed_content?: Json | null
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          user_id: string
          title: string
          company: string
          description: string
          responsibilities: string[]
          qualifications: string[]
          url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          company: string
          description: string
          responsibilities?: string[]
          qualifications?: string[]
          url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          company?: string
          description?: string
          responsibilities?: string[]
          qualifications?: string[]
          url?: string
          created_at?: string
          updated_at?: string
        }
      }
      analyses: {
        Row: {
          id: string
          user_id: string
          resume_id: string
          job_id: string
          status: string
          match_score: number | null
          keyword_matches: Json | null
          skill_gaps: string[] | null
          recommendations: string[] | null
          created_at: string
          resume?: Resume
          job?: Job
        }
        Insert: {
          id?: string
          user_id: string
          resume_id: string
          job_id: string
          status: string
          match_score?: number | null
          keyword_matches?: Json | null
          skill_gaps?: string[] | null
          recommendations?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_id?: string
          job_id?: string
          status?: string
          match_score?: number | null
          keyword_matches?: Json | null
          skill_gaps?: string[] | null
          recommendations?: string[] | null
          created_at?: string
        }
      }
      rewrites: {
        Row: {
          id: string
          analysis_id: string
          section: string
          original_content: string
          suggested_content: string
          created_at: string
        }
        Insert: {
          id?: string
          analysis_id: string
          section: string
          original_content: string
          suggested_content: string
          created_at?: string
        }
        Update: {
          id?: string
          analysis_id?: string
          section?: string
          original_content?: string
          suggested_content?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Exported types for use in services
export type Resume = Database['public']['Tables']['resumes']['Row'] & {
  resume_versions?: ResumeVersion[]
}

export type ResumeVersion = Database['public']['Tables']['resume_versions']['Row']

export type Job = Database['public']['Tables']['jobs']['Row']

export type Analysis = Database['public']['Tables']['analyses']['Row']

export type Rewrite = Database['public']['Tables']['rewrites']['Row']
