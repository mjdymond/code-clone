import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { TextArea } from '../../components/common/TextArea';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { AnalysisService } from '../../services/analysis.service';

export default function EdgeFunctionTest() {
  const [resumeContent, setResumeContent] = useState<string>('Sample resume content for testing');
  const [jobDescription, setJobDescription] = useState<string>('Sample job description for testing');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await AnalysisService.testEdgeFunction(resumeContent, jobDescription);
      console.log('Test response:', response);
      setResult(response);
      
      if (!response.success) {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Error in test:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edge Function Test</CardTitle>
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
          
          {result && result.success && (
            <div className="mb-6 p-4 bg-green-100 rounded-md">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-600">Edge function test successful!</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Resume Content</label>
              <TextArea
                value={resumeContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResumeContent(e.target.value)}
                rows={6}
                placeholder="Enter resume content to test"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Job Description</label>
              <TextArea
                value={jobDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                rows={6}
                placeholder="Enter job description to test"
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={handleTest} 
              disabled={isLoading || !resumeContent || !jobDescription}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Testing...' : 'Test Edge Function'}
            </Button>
          </div>
          
          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Test Result</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
