import { Suspense } from 'react';
import { JobSearchForm } from '@/components/jobs/JobSearchForm';
import { JobSearchVisualizer } from '@/components/jobs/JobSearchVisualizer';
import { JobApplicationApproval } from '@/components/jobs/JobApplicationApproval';
import { JobComparisonModal } from '@/components/jobs/JobComparisonModal';
import { TaskDashboard } from '@/components/common/TaskDashboard';

export default function JobsPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Job Search</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg" />}>
            <JobSearchForm />
          </Suspense>
          
          <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg" />}>
            <JobSearchVisualizer />
          </Suspense>
          
          <Suspense fallback={<div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg" />}>
            <JobApplicationApproval />
          </Suspense>
        </div>
        
        <div>
          <Suspense fallback={<div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg" />}>
            <TaskDashboard />
          </Suspense>
        </div>
      </div>
      
      {/* Fixed position comparison modal button */}
      <JobComparisonModal />
    </div>
  );
}
