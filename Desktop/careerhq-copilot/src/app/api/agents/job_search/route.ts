import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { criteria } = body;
    
    // In a real implementation, this would send the search criteria to the backend
    // and initiate a job search, but for the mock we just return a success
    
    return NextResponse.json({ 
      taskId: 'task-3',
      message: 'Job search initiated with provided criteria.' 
    });
  } catch (error) {
    console.error('Error in job search:', error);
    return NextResponse.json(
      { error: 'Failed to initiate job search' },
      { status: 500 }
    );
  }
}
