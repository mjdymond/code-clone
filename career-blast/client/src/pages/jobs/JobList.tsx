import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Loader2, Plus, FileText, Briefcase, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { JobService } from '../../services/job.service';
import type { Job } from '@shared/types/supabase';

export default function JobList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load jobs when component mounts
  useEffect(() => {
    loadJobs();
  }, [user]);
  
  // Load jobs from the API
  const loadJobs = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { jobs, error } = await JobService.getUserJobs(user.id);
      
      if (error) {
        throw error;
      }
      
      setJobs(jobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) {
      return;
    }
    
    try {
      const { success, error } = await JobService.deleteJob(jobId);
      
      if (error) {
        throw error;
      }
      
      if (success) {
        // Remove the job from the state
        setJobs(jobs.filter(job => job.id !== jobId));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Job Postings</h1>
        <Button onClick={() => navigate('/jobs/upload')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : jobs.length === 0 ? (
        <Card className="mb-6">
          <CardContent className="pt-6 pb-4 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Job Postings Yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first job posting to start comparing with your resumes.
            </p>
            <Button onClick={() => navigate('/jobs/upload')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Job Posting
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">
                  <Link to={`/jobs/${job.id}`} className="hover:underline">
                    {job.title}
                  </Link>
                </CardTitle>
                <CardContent className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.company}
                </CardContent>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  Added on {formatDate(job.created_at)}
                </div>
                
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {job.description?.substring(0, 150)}...
                </p>
              </CardContent>
              
              <CardContent className="flex justify-between pt-3">
                <Button variant="outline" size="sm" onClick={() => handleDeleteJob(job.id)}>
                  Delete
                </Button>
                <Button size="sm" asChild>
                  <Link to={`/jobs/${job.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
