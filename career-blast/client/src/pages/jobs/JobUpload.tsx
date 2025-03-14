import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { TextArea } from '../../components/common/TextArea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Label } from '../../components/common/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';
import { Loader2, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { JobService } from '../../services/job.service';

export default function JobUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Manual entry form state
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  
  // URL scraping form state
  const [jobUrl, setJobUrl] = useState('');
  
  // Handle URL scraping
  const handleScrapeJob = async () => {
    if (!jobUrl) {
      setError('Please enter a job posting URL');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { title, company, description, error } = await JobService.scrapeJobPosting(jobUrl);
      
      if (error) {
        throw error;
      }
      
      // Auto-fill the manual form fields with scraped data
      setTitle(title || '');
      setCompany(company || '');
      setDescription(description || '');
      
      // Switch to manual tab to review and edit
      setActiveTab('manual');
      
      alert('Job posting scraped successfully! You can now review and edit the details before saving.');
    } catch (error) {
      console.error('Error scraping job posting:', error);
      setError('Failed to scrape job posting. Please try again or enter details manually.');
      alert('Error scraping job: There was a problem scraping the job posting. Please try again or enter details manually.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle manual job creation
  const handleCreateJob = async () => {
    if (!title || !company) {
      setError('Please enter a job title and company');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to create a job');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { job, error } = await JobService.createJob({
        title,
        company,
        description,
        userId: user.id,
        url: jobUrl || undefined
      });
      
      if (error) {
        throw error;
      }
      
      if (job) {
        alert('Job created: The job posting has been saved successfully.');
        navigate(`/jobs/${job.id}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Failed to create job. Please try again.');
      alert('Error creating job: There was a problem saving the job posting.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Add Job Posting</h1>
        <Button variant="outline" onClick={() => navigate('/jobs')}>
          Back to Jobs
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add a New Job Posting</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="url">Scrape from URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4 mt-4">
              {error && (
                <div className="flex items-start space-x-2 p-3 bg-destructive/10 text-destructive rounded-md mb-4">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Inc"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <TextArea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={10}
                  disabled={isLoading}
                />
              </div>
              
              <div className="pt-4">
                <Button onClick={handleCreateJob} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save Job Posting</>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="space-y-4 mt-4">
              {error && (
                <div className="flex items-start space-x-2 p-3 bg-destructive/10 text-destructive rounded-md mb-4">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job Posting URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="jobUrl"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://example.com/jobs/frontend-developer"
                    disabled={isLoading}
                  />
                  <Button onClick={handleScrapeJob} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Scrape
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the URL of a job posting to automatically extract job details
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
