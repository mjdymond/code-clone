import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Loader2, AlertCircle, ArrowLeft, FileText, Briefcase } from 'lucide-react';
import { AnalysisService } from '../../services/analysis.service';
import { ResumeService } from '../../services/resume.service';
import { JobService } from '../../services/job.service';
import { useAuth } from '../../context/AuthContext';
import type { Resume, Job } from '@shared/types/supabase';

export default function NewAnalysis() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      loadResumes();
      loadJobs();
    }
  }, [user]);
  
  const loadResumes = async () => {
    setIsLoadingResumes(true);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { resumes, error } = await ResumeService.getUserResumes(user.id);
      
      if (error) {
        throw error;
      }
      
      setResumes(resumes);
      
      // Auto-select the first resume if available
      if (resumes.length > 0 && !selectedResumeId) {
        setSelectedResumeId(resumes[0].id);
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
      setError('Failed to load resumes. Please try again.');
    } finally {
      setIsLoadingResumes(false);
    }
  };
  
  const loadJobs = async () => {
    setIsLoadingJobs(true);
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { jobs, error } = await JobService.getUserJobs(user.id);
      
      if (error) {
        throw error;
      }
      
      setJobs(jobs);
      
      // Auto-select the first job if available
      if (jobs.length > 0 && !selectedJobId) {
        setSelectedJobId(jobs[0].id);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setIsLoadingJobs(false);
    }
  };
  
  const handleCreateAnalysis = async () => {
    setIsCreating(true);
    setError(null);
    setDebugInfo('Starting analysis creation...');
    console.log('Starting analysis creation process');
    
    try {
      // Validate user authentication
      if (!user) {
        const errorMsg = 'User not authenticated';
        console.error(errorMsg);
        setDebugInfo(`Error: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      // Log user information
      console.log('User information:', { id: user.id, email: user.email });
      setDebugInfo(`User ID: ${user.id}`);
      
      // Validate resume selection
      if (!selectedResumeId) {
        const errorMsg = 'Please select a resume';
        console.error(errorMsg);
        setDebugInfo(`Error: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      // Log resume information
      const selectedResume = resumes.find(r => r.id === selectedResumeId);
      console.log('Selected resume:', selectedResume);
      setDebugInfo(prev => `${prev}\nSelected Resume: ${selectedResume?.title} (${selectedResumeId})`);
      
      // Validate job selection
      if (!selectedJobId) {
        const errorMsg = 'Please select a job';
        console.error(errorMsg);
        setDebugInfo(prev => `${prev}\nError: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      // Log job information
      const selectedJob = jobs.find(j => j.id === selectedJobId);
      console.log('Selected job:', selectedJob);
      setDebugInfo(prev => `${prev}\nSelected Job: ${selectedJob?.title} (${selectedJobId})`);
      
      // Prepare analysis data
      const analysisData = {
        resumeId: selectedResumeId,
        jobId: selectedJobId,
        userId: user.id
      };
      
      console.log('Creating analysis with data:', analysisData);
      setDebugInfo(prev => `${prev}\nCreating analysis with SQL-based approach...`);
      
      // Create the analysis
      const { analysis, error } = await AnalysisService.createAnalysis(analysisData);
      
      // Check for errors
      if (error) {
        console.error('Analysis creation error:', error);
        setDebugInfo(prev => `${prev}\nError from service: ${error.message}\nStack: ${(error as Error).stack || 'No stack trace'}`);
        throw error;
      }
      
      // Validate analysis result
      if (!analysis) {
        const errorMsg = 'Failed to create analysis - no analysis returned';
        console.error(errorMsg);
        setDebugInfo(prev => `${prev}\n${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      // Log successful creation
      console.log('Analysis created successfully:', analysis);
      setDebugInfo(prev => `${prev}\nAnalysis created successfully with ID: ${analysis.id}\nStatus: ${analysis.status}`);
      
      // Navigate to the analysis detail page with more detailed logging
      console.log('Navigating to analysis detail page:', `/analysis/${analysis.id}`);
      try {
        navigate(`/analysis/${analysis.id}`);
        console.log('Navigation initiated');
      } catch (navError) {
        console.error('Navigation error:', navError);
        setDebugInfo(prev => `${prev}\nNavigation error: ${navError instanceof Error ? navError.message : String(navError)}`);
      }
    } catch (error) {
      console.error('Error creating analysis:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create analysis. Please try again.';
      setError(errorMessage);
      setDebugInfo(prev => `${prev}\nFinal error: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  const isLoading = isLoadingResumes || isLoadingJobs;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/analysis')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Analyses
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">New Analysis</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 rounded-md">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {debugInfo && (
            <div className="mb-6 p-4 bg-yellow-100 rounded-md">
              <h3 className="font-medium mb-2">Debug Information:</h3>
              <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Resume Selection */}
            <div>
              <h3 className="text-lg font-medium mb-4">Select Resume</h3>
              
              {resumes.length === 0 ? (
                <div className="text-center py-6 border rounded-md">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No resumes found</p>
                  <Button onClick={() => navigate('/upload')}>
                    Upload Resume
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumes.map((resume) => (
                    <div 
                      key={resume.id}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedResumeId === resume.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedResumeId(resume.id)}
                    >
                      <div className="flex items-start">
                        <FileText className={`h-5 w-5 mr-2 shrink-0 mt-0.5 ${
                          selectedResumeId === resume.id ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <div>
                          <h4 className="font-medium">{resume.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {resume.file_type.toUpperCase()} • {resume.original_file_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Job Selection */}
            <div>
              <h3 className="text-lg font-medium mb-4">Select Job</h3>
              
              {jobs.length === 0 ? (
                <div className="text-center py-6 border rounded-md">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No jobs found</p>
                  <Button onClick={() => navigate('/jobs/new')}>
                    Add Job
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job) => (
                    <div 
                      key={job.id}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedJobId === job.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedJobId(job.id)}
                    >
                      <div className="flex items-start">
                        <Briefcase className={`h-5 w-5 mr-2 shrink-0 mt-0.5 ${
                          selectedJobId === job.id ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {job.company || 'No company'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleCreateAnalysis} 
                disabled={isCreating || !selectedResumeId || !selectedJobId}
                className="w-full"
              >
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCreating ? 'Creating Analysis...' : 'Create Analysis'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
