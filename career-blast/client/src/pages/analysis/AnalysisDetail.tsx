import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/common/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';
import { Loader2, AlertCircle, ArrowLeft, FileText, Briefcase, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { AnalysisService } from '../../services/analysis.service';
import { useAuth } from '../../context/AuthContext';
import type { Analysis, Rewrite } from '@shared/types/supabase';

export default function AnalysisDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [rewrites, setRewrites] = useState<Rewrite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Add console logs for debugging
  useEffect(() => {
    console.log('AnalysisDetail component mounted');
    console.log('ID from params:', id);
    console.log('User:', user);
    
    if (id) {
      console.log('Loading analysis with ID:', id);
      loadAnalysis(id);
    } else {
      console.error('No analysis ID provided in URL parameters');
      setError('No analysis ID provided');
      setIsLoading(false);
    }
  }, [id]);
  
  // Load analysis from the API
  const loadAnalysis = async (analysisId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching analysis with ID:', analysisId);
      // Get analysis details
      const { analysis, error } = await AnalysisService.getAnalysisById(analysisId);
      
      console.log('Analysis response:', { analysis, error });
      
      if (error) {
        console.error('Error from getAnalysisById:', error);
        throw error;
      }
      
      if (!analysis) {
        console.error('Analysis not found');
        throw new Error('Analysis not found');
      }
      
      console.log('Setting analysis state:', analysis);
      setAnalysis(analysis);
      
      // Get rewrites for this analysis
      console.log('Fetching rewrites for analysis ID:', analysisId);
      const { rewrites, error: rewritesError } = await AnalysisService.getAnalysisRewrites(analysisId);
      
      console.log('Rewrites response:', { rewrites, rewritesError });
      
      if (rewritesError) {
        console.error('Error loading rewrites:', rewritesError);
        // Continue with the analysis even if rewrites fail to load
      } else {
        console.log('Setting rewrites state:', rewrites);
        setRewrites(rewrites);
      }
      
      // If analysis is pending, trigger the analysis generation
      if (analysis.status === 'pending') {
        console.log('Analysis is pending, generating analysis...');
        generateAnalysis(analysis);
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
      setError('Failed to load analysis. Please try again.');
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  };
  
  // Generate analysis if it's in pending state
  const generateAnalysis = async (analysis: Analysis) => {
    try {
      console.log('Updating analysis status to in_progress');
      // Update status to in_progress
      await AnalysisService.updateAnalysis(analysis.id, { status: 'in_progress' });
      
      console.log('Generating analysis with resume ID:', analysis.resume_id, 'and job ID:', analysis.job_id);
      // Generate the analysis
      const { result, error } = await AnalysisService.generateAnalysis(
        analysis.resume_id,
        analysis.job_id
      );
      
      console.log('Analysis generation result:', { result, error });
      
      if (error) {
        console.error('Error generating analysis:', error);
        throw error;
      }
      
      if (!result) {
        console.error('No result returned from generateAnalysis');
        throw new Error('Failed to generate analysis results');
      }
      
      console.log('Updating analysis with results:', result);
      // Update the analysis with results
      const updates = {
        status: 'completed',
        match_score: result.match_score || 0,
        keyword_matches: result.keyword_matches || {},
        skill_gaps: result.skill_gaps || [],
        recommendations: result.recommendations || []
      };
      
      console.log('Calling updateAnalysis with updates:', updates);
      const { analysis: updatedAnalysis } = await AnalysisService.updateAnalysis(analysis.id, updates);
      
      console.log('Updated analysis:', updatedAnalysis);
      if (updatedAnalysis) {
        console.log('Setting analysis state with updated analysis');
        setAnalysis(updatedAnalysis);
        
        // Generate rewrites for key sections
        if (analysis.resume?.content) {
          console.log('Generating rewrites for resume sections');
          const resumeContent = typeof analysis.resume.content === 'string' 
            ? JSON.parse(analysis.resume.content) 
            : analysis.resume.content;
          
          const jobDescription = analysis.job?.description || '';
          
          // Generate rewrites for key sections
          const sections = ['summary', 'experience', 'skills'];
          
          for (const section of sections) {
            if (resumeContent[section]) {
              console.log('Generating rewrite suggestion for section:', section);
              const { suggestion } = await AnalysisService.generateRewriteSuggestion(
                section,
                resumeContent[section],
                jobDescription
              );
              
              if (suggestion) {
                console.log('Creating rewrite for section:', section);
                const { rewrite } = await AnalysisService.createRewrite({
                  analysisId: analysis.id,
                  section,
                  originalContent: resumeContent[section],
                  suggestedContent: suggestion
                });
                
                if (rewrite) {
                  console.log('Adding rewrite to state:', rewrite);
                  setRewrites(prev => [...prev, rewrite]);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
      
      console.log('Updating analysis status to failed');
      // Update status to failed
      await AnalysisService.updateAnalysis(analysis.id, { status: 'failed' });
      
      console.log('Reloading analysis to get updated status');
      // Reload the analysis to get the updated status
      loadAnalysis(analysis.id);
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
  
  // Handle deleting the analysis
  const handleDeleteAnalysis = async () => {
    if (!analysis) return;
    
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        const { success, error } = await AnalysisService.deleteAnalysis(analysis.id);
        
        if (error) {
          throw error;
        }
        
        if (success) {
          navigate('/analysis');
        }
      } catch (error) {
        console.error('Error deleting analysis:', error);
        alert('Failed to delete analysis. Please try again.');
      }
    }
  };
  
  console.log('Rendering AnalysisDetail with state:', { isLoading, error, analysis, rewrites });
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading analysis...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/analysis')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analyses
          </Button>
        </div>
        
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => id && loadAnalysis(id)}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!analysis) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/analysis')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analyses
          </Button>
        </div>
        
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Analysis Not Found</h3>
            <p className="text-muted-foreground mb-4">The requested analysis could not be found.</p>
            <Button onClick={() => navigate('/analysis')}>
              Back to Analyses
            </Button>
          </CardContent>
        </Card>
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
          <CardTitle className="text-2xl font-bold">
            {analysis.resume?.title || 'Unnamed Resume'} ↔ {analysis.job?.title || 'Unnamed Job'}
          </CardTitle>
          <CardDescription>
            Analysis {analysis.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              <span>{analysis.resume?.title || 'Unnamed Resume'}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>{analysis.job?.title || 'Unnamed Job'} at {analysis.job?.company || 'Unknown Company'}</span>
            </div>
            {analysis.created_at && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created on {formatDate(analysis.created_at)}
              </div>
            )}
          </div>
          
          {analysis.status === 'pending' || analysis.status === 'in_progress' ? (
            <div className="py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Analysis in progress</h3>
              <p className="text-muted-foreground">
                We're analyzing your resume against the job description.
                This may take a few moments.
              </p>
            </div>
          ) : analysis.status === 'failed' ? (
            <div className="py-8 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Analysis failed</h3>
              <p className="text-muted-foreground mb-4">
                There was an error generating your analysis.
                Please try again or contact support if the issue persists.
              </p>
              <Button onClick={() => loadAnalysis(analysis.id)}>
                Retry Analysis
              </Button>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="rewrites">Rewrites</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Match Score</h3>
                    <div className="bg-gray-100 rounded-full h-4 w-full">
                      <div 
                        className="bg-primary rounded-full h-4" 
                        style={{ width: `${analysis.match_score || 0}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your resume is a {Math.round(analysis.match_score || 0)}% match for this job.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Recommendations</h3>
                    {analysis.recommendations && analysis.recommendations.length > 0 ? (
                      <ul className="space-y-2">
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">
                        No specific recommendations available.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="keywords" className="mt-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">Keyword Matches</h3>
                  
                  {analysis.keyword_matches && Object.keys(analysis.keyword_matches as Record<string, any>).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(analysis.keyword_matches as Record<string, string[]>).map(([category, keywords]) => (
                        <Card key={category}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{category}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {keywords.map((keyword, index) => (
                                <span 
                                  key={index}
                                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No keyword matches found.
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="skills" className="mt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Skill Gaps</h3>
                    {analysis.skill_gaps && analysis.skill_gaps.length > 0 ? (
                      <ul className="space-y-2">
                        {analysis.skill_gaps.map((skill, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">
                        No significant skill gaps identified.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rewrites" className="mt-4">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">Resume Rewrite Suggestions</h3>
                  
                  {rewrites.length > 0 ? (
                    <div className="space-y-6">
                      {rewrites.map((rewrite) => (
                        <Card key={rewrite.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base capitalize">{rewrite.section}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Original</h4>
                                <div className="p-3 bg-gray-50 rounded-md text-sm">
                                  {rewrite.original_content}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Suggested</h4>
                                <div className="p-3 bg-primary/5 rounded-md text-sm border border-primary/20">
                                  {rewrite.suggested_content}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No rewrite suggestions available.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleDeleteAnalysis}>
          Delete Analysis
        </Button>
      </div>
    </div>
  );
}
