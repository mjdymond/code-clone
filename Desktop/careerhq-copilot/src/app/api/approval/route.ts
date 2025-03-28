import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { approvalId, approved, feedback } = body;
    
    // In a real implementation, this would send the approval decision to the backend
    // but for the mock we just return a success
    
    return NextResponse.json({ 
      success: true,
      message: approved ? 'Approval confirmed.' : 'Changes rejected.'
    });
  } catch (error) {
    console.error('Error submitting approval:', error);
    return NextResponse.json(
      { error: 'Failed to submit approval decision' },
      { status: 500 }
    );
  }
}
