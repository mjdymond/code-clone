'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Upload, FileText, FilePlus } from 'lucide-react';

export function ResumeUpload() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const setAgentState = useStore(state => state.setAgentState);
  const setResumeTextStore = useStore(state => state.setResumeText);
  const setJobDescriptionStore = useStore(state => state.setJobDescription);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };
  
  const processFile = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      // Read the file as text
      const text = await file.text();
      setResumeText(text);
    } catch (err) {
      setError('Failed to read file. Please try again.');
      console.error('File reading error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async () => {
    if (!resumeText.trim()) {
      setError('Please upload or paste your resume');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Update the resume agent state
      setAgentState('resume_agent', {
        name: 'resume_agent',
        status: 'thinking',
        completion_percentage: 0,
        current_task: 'Analyzing resume',
        thinking: 'Starting resume analysis...',
      });
      
      // Store resume text and job description
      setResumeTextStore(resumeText);
      setJobDescriptionStore(jobDescription);
      
      // Submit to API
      await api.uploadResume(resumeText, jobDescription || undefined);
    } catch (err) {
      console.error('Resume upload error:', err);
      setError('Failed to analyze resume. Please try again.');
      
      // Update agent state to reflect error
      setAgentState('resume_agent', {
        name: 'resume_agent',
        status: 'error',
        completion_percentage: 0,
        error: 'Failed to analyze resume. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Upload Your Resume</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div 
          className={`
            border-2 border-dashed rounded-md p-6 text-center cursor-pointer
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          `}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-blue-500 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Drag and drop your resume file, or click to browse
            </p>
            <p className="text-xs text-gray-500">
              Supports TXT, PDF, DOC, DOCX
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="resume-text">Or paste your resume text</Label>
          <Textarea
            id="resume-text"
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="job-description">
            Job Description (Optional)
          </Label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description to optimize your resume for a specific role..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <Button 
          onClick={handleSubmit} 
          disabled={loading || !resumeText.trim()} 
          className="w-full flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Resume...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Analyze Resume
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
