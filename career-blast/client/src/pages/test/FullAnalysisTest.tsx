import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import { Textarea } from '../../components/common/Textarea';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { AnalysisService } from '../../services/analysis.service';
import { ParserService } from '../../services/parser.service';

export default function FullAnalysisTest() {
  const [resumeContent, setResumeContent] = useState<string>('Sample resume content for testing');
  const [jobDescription, setJobDescription] = useState<string>('Sample job description for testing');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFullAnalysis = async () => {
    setIsLoading(true);
    setSuccess(null);
    setResult(null);
    setLogs([]);
    
    try {
      addLog('Starting full analysis test');
      addLog(`Resume content length: ${resumeContent.length}`);
      addLog(`Job description length: ${jobDescription.length}`);
      
      // Create mock resume and job data
      const mockResumeData = {
        content: resumeContent,
        resume_versions: [{ content: resumeContent }]
      };
      
      const mockJobData = {
        description: jobDescription
      };
      
      addLog('Calling ParserService.analyzeResume directly');
      const analysisResult = await ParserService.analyzeResume(mockResumeData, mockJobData);
      
      addLog('Analysis completed');
      setResult(analysisResult);
      setSuccess(true);
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Full analysis test error:', error);
      setSuccess(false);
      setResult({
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Full Analysis Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Resume Content</label>
            <Textarea
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              className="min-h-[150px]"
              placeholder="Enter resume content"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Job Description</label>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[150px]"
              placeholder="Enter job description"
            />
          </div>
          
          <Button
            onClick={testFullAnalysis}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Full Analysis...
              </>
            ) : (
              'Test Full Analysis'
            )}
          </Button>
        </CardContent>
      </Card>
      
      {success !== null && (
        <Card className={`mb-6 ${success ? 'border-green-500' : 'border-red-500'}`}>
          <CardHeader className="flex flex-row items-center gap-2">
            {success ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <CardTitle>
              {success ? 'Full Analysis Test Successful' : 'Full Analysis Test Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Success/failure message content */}
          </CardContent>
        </Card>
      )}
      
      {logs.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              {logs.map((log, index) => (
                <div key={index} className="font-mono text-sm">{log}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Test Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-[400px]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
