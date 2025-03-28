import { NextRequest, NextResponse } from 'next/server';

// This is a placeholder API route for demonstration
export async function POST(req: NextRequest) {
  try {
    // In a real implementation, this would connect to the CareerHQ backend
    const responseBody = {
      id: 'mock-response',
      response: 'This is a mock response from the CopilotKit API. In the full implementation, this would connect to the CareerHQ Agent System.',
      state: {
        task_registry: {
          tasks: [
            {
              name: 'analyze_resume',
              status: 'completed',
              assigned_to: 'resume_agent',
              created_at: new Date().toISOString(),
              completed_at: new Date().toISOString(),
            },
            {
              name: 'find_matching_jobs',
              status: 'in_progress',
              assigned_to: 'job_search_agent',
              created_at: new Date().toISOString(),
              completed_at: null,
            },
          ],
          completedTasks: [],
          overall_completion: 50,
        },
        resume_agent_progress: {
          completion_status: 100,
          analyzing: false,
          contributions: [],
          last_updated: new Date().toISOString(),
          strengths: ['Strong technical background', 'Clear project descriptions', 'Quantified achievements'],
          improvements: ['Add more keywords from job descriptions', 'Shorten bullet points', 'Add certifications section']
        },
        job_search_agent_progress: {
          completion_status: 30,
          searching: true,
          contributions: [],
          last_updated: new Date().toISOString(),
          currentAction: 'Searching for matching jobs...',
          thinking: 'Analyzing job requirements and comparing with resume keywords...'
        }
      }
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error('Error in CopilotKit API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
