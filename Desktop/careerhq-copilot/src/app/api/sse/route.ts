import { NextRequest } from 'next/server';
import { MockEventSource } from '@/lib/mock-data/eventSource';

export async function GET(req: NextRequest) {
  // Create a new readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send headers and initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode('event: connection\ndata: {"status":"connected"}\n\n'));
      
      // Create a mock event source to simulate agent updates
      const mockSource = new MockEventSource(controller);
      
      // Start sending events
      mockSource.start();
    },
    cancel() {
      // Connection closed
      console.log('SSE connection closed');
    },
  });

  // Return the stream with appropriate headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'X-Accel-Buffering': 'no' // Prevents proxy buffering
    },
  });
}
