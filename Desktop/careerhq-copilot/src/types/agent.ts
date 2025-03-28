export type AgentStatus = 'idle' | 'thinking' | 'waiting' | 'complete' | 'error';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';

export interface AgentState {
  name: string;
  status: AgentStatus;
  completion_percentage: number; // 0-100
  current_task?: string;
  thinking?: string;
  results?: any;
  error?: string;
  waiting_for_approval?: boolean;
  approval_type?: string;
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  assigned_to: string; // Agent name
  depends_on?: string[]; // Task IDs
  completion_percentage: number;
  created_at: string;
  completed_at?: string;
  result?: any;
}

export interface TaskRegistry {
  tasks: Task[];
  overall_completion: number; // 0-100
}

// Resume agent specific types
export interface ResumeStrength {
  text: string;
  confidence: number; // 0-100
  section?: string;
}

export interface ResumeWeakness {
  text: string;
  confidence: number; // 0-100
  section?: string;
  suggestion?: string;
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: number; // 0-100
  context?: string;
}

export interface ResumeImprovement {
  section: string;
  originalText: string;
  improvedText: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ResumeAgentState extends AgentState {
  strengths?: ResumeStrength[];
  weaknesses?: ResumeWeakness[];
  keywordMatches?: KeywordMatch[];
  improvements?: ResumeImprovement[];
  atsScore?: number; // 0-100
}

// Job search agent specific types
export interface JobSearchCriteria {
  role?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  remote?: boolean;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  remote?: boolean;
  salary?: string;
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirementsSummary?: string;
  matchScore: number; // 0-100
  matchDetails?: {
    roleMatch: number;
    skillsMatch: number;
    experienceMatch: number;
    locationMatch: number;
  };
  postedDate: string;
  applicationUrl?: string;
}

export interface JobSearchAgentState extends AgentState {
  searchCriteria?: JobSearchCriteria;
  results?: JobListing[];
  totalResults?: number;
}

// Agent approval types
export interface ResumeApprovalData {
  type: 'resume_improvements';
  improvements: ResumeImprovement[];
  originalResume: string;
  improvedResume: string;
}

export interface JobApplicationApprovalData {
  type: 'job_application';
  job: JobListing;
  coverLetter: string;
  resume: string;
  applicationDetails: {
    email: string;
    name: string;
    phone?: string;
    additionalQuestions?: Record<string, string>;
  };
}

export type ApprovalData = ResumeApprovalData | JobApplicationApprovalData;
