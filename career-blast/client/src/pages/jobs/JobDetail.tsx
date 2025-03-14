import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';
import { Loader2, AlertCircle, ArrowLeft, Briefcase, Calendar, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { JobService } from '../../services/job.service';
import type { Job } from '@shared/types/supabase';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<Job | null>(null);
  const [parsedJob, setParsedJob] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  
  // Load job when component mounts
  useEffect(() => {
    if (id) {
      loadJob(id);
    }
  }, [id]);
  
  // Load job from the API
  const loadJob = async (jobId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { job, error } = await JobService.getJobById(jobId);
      
      if (error) {
        throw error;
      }
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      setJob(job);
      
      // Parse job description if available
      if (job.description) {
        try {
          // Simple parsing for responsibilities and qualifications
          const responsibilities = extractListItems(job.description, ['responsibilities', 'duties', 'what you\'ll do']);
          const qualifications = extractListItems(job.description, ['qualifications', 'requirements', 'skills', 'what you\'ll need']);
          
          setParsedJob({
            responsibilities,
            qualifications
          });
        } catch (parseError) {
          console.error('Error parsing job description:', parseError);
          // Continue with the raw description if parsing fails
        }
      }
    } catch (error) {
      console.error('Error loading job:', error);
      setError('Failed to load job. Please try again.');
      alert('Error loading job: There was a problem loading the job posting.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Extract list items from text based on section headers
  const extractListItems = (text: string, sectionKeywords: string[]) => {
    // Convert text to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    
    // Find the section based on keywords
    let sectionStart = -1;
    let sectionEnd = text.length;
    
    for (const keyword of sectionKeywords) {
      const index = lowerText.indexOf(keyword);
      if (index !== -1 && (sectionStart === -1 || index < sectionStart)) {
        sectionStart = index;
      }
    }
    
    if (sectionStart === -1) {
      return [];
    }
    
    // Find the next section header (if any) to determine the end of this section
    const commonSectionHeaders = [
      'responsibilities', 'duties', 'what you\'ll do',
      'qualifications', 'requirements', 'skills', 'what you\'ll need',
      'benefits', 'perks', 'what we offer',
      'about us', 'company', 'who we are',
      'application', 'how to apply', 'next steps'
    ];
    
    for (const header of commonSectionHeaders) {
      // Skip headers that match our current section
      if (sectionKeywords.includes(header)) {
        continue;
      }
      
      const headerIndex = lowerText.indexOf(header, sectionStart + 1);
      if (headerIndex !== -1 && headerIndex < sectionEnd) {
        sectionEnd = headerIndex;
      }
    }
    
    // Extract the section text
    const sectionText = text.substring(sectionStart, sectionEnd);
    
    // Extract list items (lines starting with bullets, numbers, or after line breaks)
    const listItemRegex = /(?:^|\n)\s*(?:[•\-*]|\d+\.)\s*([^\n]+)/g;
    const items: string[] = [];
    let match;
    
    while ((match = listItemRegex.exec(sectionText)) !== null) {
      if (match[1] && match[1].trim().length > 0) {
        items.push(match[1].trim());
      }
    }
    
    // If no bullet points found, try to split by newlines
    if (items.length === 0) {
      const lines = sectionText.split('\n').map(line => line.trim())
        .filter(line => line.length > 0 && line.length < 200);
      
      // Skip the first line (likely the header)
      return lines.slice(1, 10);
    }
    
    return items.slice(0, 10); // Limit to 10 items
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!job) return;
    
    if (!confirm('Are you sure you want to delete this job posting?')) {
      return;
    }
    
    try {
      const { success, error } = await JobService.deleteJob(job.id);
      
      if (error) {
        throw error;
      }
      
      if (success) {
        alert('Job deleted: The job posting has been deleted successfully.');
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Error deleting job: There was a problem deleting the job posting.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm text-muted-foreground">
                  {error || 'Job not found'}
                </p>
              </div>
            </div>
            <Button onClick={() => navigate('/jobs')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
              <div className="flex items-center mt-2 text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-1" />
                <span className="font-medium">{job.company}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDeleteJob}>
              Delete Job
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            {job.created_at && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Added on {formatDate(job.created_at)}
              </div>
            )}
            {job.url && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  View Original Posting
                </a>
              </div>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
              <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div className="prose max-w-none">
                {job.description ? (
                  <div style={{ whiteSpace: 'pre-line' }}>{job.description}</div>
                ) : (
                  <p className="text-muted-foreground">No description available</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="responsibilities" className="mt-4">
              {parsedJob?.responsibilities && parsedJob.responsibilities.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {parsedJob.responsibilities.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No specific responsibilities found. Check the full description for details.
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="qualifications" className="mt-4">
              {parsedJob?.qualifications && parsedJob.qualifications.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {parsedJob.qualifications.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No specific qualifications found. Check the full description for details.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
