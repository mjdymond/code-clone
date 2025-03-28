import { NextRequest, NextResponse } from 'next/server';
import { mockResumeData } from '@/lib/mock-data/resume';
import { mockJobSearchData } from '@/lib/mock-data/jobSearch';

export async function GET(
  req: NextRequest,
  { params }: { params: { agent_name: string } }
) {
  try {
    const agentName = params.agent_name;
    
    // Return initial state based on agent name
    if (agentName === 'resume_agent') {
      return NextResponse.json({
        name: 'resume_agent',
        status: 'idle',
        completion_percentage: 0,
      });
    } else if (agentName === 'job_search_agent') {
      return NextResponse.json({
        name: 'job_search_agent',
        status: 'idle',
        completion_percentage: 0,
      });
    } else {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error fetching state for ${params.agent_name}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch agent state' },
      { status: 500 }
    );
  }
}
