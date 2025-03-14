// Export services
export { AuthService } from './auth.service';
export { ResumeService } from './resume.service';
export { JobService } from './job.service';
export { AnalysisService } from './analysis.service';
export { ParserService } from './parser.service';

// Export types from auth service
export type {
  AuthResponse,
  UserCredentials,
  UserRegistration,
} from './auth.service';

// Export types from resume service
export type {
  ResumeUploadResponse,
  ResumeVersionResponse,
  ResumeListResponse,
  ResumeVersionListResponse,
  FileUploadResponse,
  ResumeParseResponse,
  ResumeData,
  ResumeVersionData,
} from './resume.service';

// Export types from job service
export type {
  JobResponse,
  JobListResponse,
  JobScrapeResponse,
  JobParseResponse,
  JobData,
} from './job.service';

// Export types from analysis service
export type {
  AnalysisResponse,
  RewriteResponse,
  AnalysisListResponse,
  RewriteListResponse,
  AnalysisResultResponse,
  RewriteSuggestionResponse,
  AnalysisData,
  RewriteData,
} from './analysis.service';

// Export types from parser service
export type {
  ParsedDocumentResponse,
} from './parser.service';

// Export common types that appear in multiple services
// By exporting from a single location, we avoid duplicate exports
export interface DeleteResponse {
  success: boolean;
  error: Error | null;
}
