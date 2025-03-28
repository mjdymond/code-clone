import { NextRequest, NextResponse } from 'next/server';
import { mockTaskRegistry } from '@/lib/mock-data/tasks';

export async function GET(req: NextRequest) {
  try {
    // Return initial state of task registry
    return NextResponse.json({
      tasks: [],
      overall_completion: 0,
    });
  } catch (error) {
    console.error('Error fetching task registry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task registry' },
      { status: 500 }
    );
  }
}
