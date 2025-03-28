import { Suspense } from 'react';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { ResumeAnalysisVisualizer } from '@/components/resume/ResumeAnalysisVisualizer';
import { ResumeImprovementApproval } from '@/components/resume/ResumeImprovementApproval';
import { TaskDashboard } from '@/components/common/TaskDashboard';
import RecruiterProgressTracker from '@/components/agent/RecruiterProgressTracker';

export default function ResumePage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Resume Optimization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg" />}>
            <ResumeUpload />
          </Suspense>
          
          <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg" />}>
            <ResumeAnalysisVisualizer />
          </Suspense>
          
          <Suspense fallback={<div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg" />}>
            <ResumeImprovementApproval />
          </Suspense>
        </div>
        
        <div className="space-y-6">
          <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg" />}>
            <TaskDashboard />
          </Suspense>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Recruiting Progress</h2>
            <RecruiterProgressTracker agentName="resume_agent" />
          </div>
        </div>
      </div>
    </div>
  );
}
