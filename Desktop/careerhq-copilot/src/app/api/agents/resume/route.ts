import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, jobDescription } = body;
    
    // In a real implementation, this would send the resume to the backend
    // and initiate an analysis, but for the mock we just return a success
    
    return NextResponse.json({ 
      taskId: 'task-1',
      message: 'Resume upload successful. Analysis started.' 
    });
  } catch (error) {
    console.error('Error in resume upload:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}
