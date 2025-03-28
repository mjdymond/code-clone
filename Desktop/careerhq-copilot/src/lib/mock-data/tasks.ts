import { TaskRegistry } from '@/types/agent';

// Mock task registry data
export const mockTaskRegistry = {
  steps: [
    // Step 1: Initial state with resume analysis task
    {
      tasks: [
        {
          id: 'task-1',
          name: 'Analyze Resume',
          status: 'in_progress',
          assigned_to: 'resume_agent',
          completion_percentage: 25,
          created_at: new Date().toISOString(),
        }
      ],
      overall_completion: 10,
    } as TaskRegistry,
    
    // Step 2: Resume analysis progressing
    {
      tasks: [
        {
          id: 'task-1',
          name: 'Analyze Resume',
          status: 'in_progress',
          assigned_to: 'resume_agent',
          completion_percentage: 60,
          created_at: new Date().toISOString(),
        }
      ],
      overall_completion: 30,
    } as TaskRegistry,
    
    // Step 3: Resume analysis complete, waiting for approval
    {
      tasks: [
        {
          id: 'task-1',
          name: 'Analyze Resume',
          status: 'completed',
          assigned_to: 'resume_agent',
          completion_percentage: 100,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-2',
          name: 'Resume Improvement Approval',
          status: 'in_progress',
          assigned_to: 'human',
          completion_percentage: 0,
          created_at: new Date().toISOString(),
        }
      ],
      overall_completion: 45,
    } as TaskRegistry,
    
    // Step 4: Approval complete, job search starting
    {
      tasks: [
        {
          id: 'task-1',
          name: 'Analyze Resume',
          status: 'completed',
          assigned_to: 'resume_agent',
          completion_percentage: 100,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-2',
          name: 'Resume Improvement Approval',
          status: 'completed',
          assigned_to: 'human',
          completion_percentage: 100,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-3',
          name: 'Search for Matching Jobs',
          status: 'in_progress',
          assigned_to: 'job_search_agent',
          completion_percentage: 20,
          depends_on: ['task-1', 'task-2'],
          created_at: new Date().toISOString(),
        }
      ],
      overall_completion: 60,
    } as TaskRegistry,
    
    // Step 5: Job search progressing
    {
      tasks: [
        {
          id: 'task-1',
          name: 'Analyze Resume',
          status: 'completed',
          assigned_to: 'resume_agent',
          completion_percentage: 100,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-2',
          name: 'Resume Improvement Approval',
          status: 'completed',
          assigned_to: 'human',
          completion_percentage: 100,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-3',
          name: 'Search for Matching Jobs',
          status: 'in_progress',
          assigned_to: 'job_search_agent',
          completion_percentage: 70,
          depends_on: ['task-1', 'task-2'],
          created_at: new Date().toISOString(),
        }
      ],
      overall_completion: 75,
    } as TaskRegistry,
    
    // Step 6: Job search complete, job application approval needed
    {
      tasks: [
        {
          id: 'task-1',
          name: 'Analyze Resume',
          status: 'completed',
          assigned_to: 'resume_agent',
          completion_percentage: 100,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-2',
          name: 'Resume Improvement Approval',
          status: 'completed',
          assigned_to: 'human',
          completion_percentage: 100,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-3',
          name: 'Search for Matching Jobs',
          status: 'completed',
          assigned_to: 'job_search_agent',
          completion_percentage: 100,
          depends_on: ['task-1', 'task-2'],
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-4',
          name: 'Job Application Approval',
          status: 'in_progress',
          assigned_to: 'human',
          completion_percentage: 0,
          depends_on: ['task-3'],
          created_at: new Date().toISOString(),
        }
      ],
      overall_completion: 85,
    } as TaskRegistry,
    
    // Step 7: All tasks complete
    {
      tasks: [
        {
          id: 'task-1',
          name: 'Analyze Resume',
          status: 'completed',
          assigned_to: 'resume_agent',
          completion_percentage: 100,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-2',
          name: 'Resume Improvement Approval',
          status: 'completed',
          assigned_to: 'human',
          completion_percentage: 100,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-3',
          name: 'Search for Matching Jobs',
          status: 'completed',
          assigned_to: 'job_search_agent',
          completion_percentage: 100,
          depends_on: ['task-1', 'task-2'],
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-4',
          name: 'Job Application Approval',
          status: 'completed',
          assigned_to: 'human',
          completion_percentage: 100,
          depends_on: ['task-3'],
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          id: 'task-5',
          name: 'Submit Application',
          status: 'completed',
          assigned_to: 'job_search_agent',
          completion_percentage: 100,
          depends_on: ['task-4'],
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        }
      ],
      overall_completion: 100,
    } as TaskRegistry,
  ]
};
