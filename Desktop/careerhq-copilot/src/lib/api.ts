import { AgentState, ApprovalData, JobSearchCriteria, TaskRegistry } from "@/types/agent";

// For development/demo purposes, using a mock API url
// In production, this would be configured from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Mock authentication - in a real app, this would come from an auth service
const getAuthToken = () => 'mock-auth-token';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Base API request function
 */
async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
    ...headers
  };
  
  // Use relative URLs to avoid CORS issues in development
  const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Creates an SSE connection to the backend
 * @param endpoint The endpoint to connect to
 * @param onEvent Callback for processing events
 * @param onError Callback for handling errors
 * @returns A function to close the connection
 */
function createSSEConnection(
  endpoint: string,
  onEvent: (event: any) => void,
  onError: (error: any) => void
): () => void {
  try {
    // Create URL using the current origin and ensure we're using the /api prefix
    const url = new URL(`/api${endpoint}`, window.location.origin);
    console.log('Creating SSE connection to:', url.toString());
    
    const eventSource = new EventSource(url.toString(), {
      withCredentials: false // For same-origin requests
    });
    
    // Handle open event
    eventSource.onopen = () => {
      console.log('SSE connection opened successfully');
    };
    
    // Handle connection event
    eventSource.addEventListener('connection', (event) => {
      console.log('SSE connection established');
      try {
        const data = JSON.parse(event.data);
        console.log('Connection data:', data);
      } catch (error) {
        console.error('Error parsing connection event:', error);
      }
    });

    // Handle agent update events
    eventSource.addEventListener('agent_update', (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent({ type: 'agent_update', data });
      } catch (error) {
        onError(error);
      }
    });

    // Handle task update events
    eventSource.addEventListener('task_update', (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent({ type: 'task_update', data });
      } catch (error) {
        onError(error);
      }
    });

    // Handle approval request events
    eventSource.addEventListener('approval_request', (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent({ type: 'approval_request', data });
      } catch (error) {
        onError(error);
      }
    });

    // Fallback for general messages
    eventSource.onmessage = (event) => {
      try {
        console.log('Generic message received:', event.data);
        const data = JSON.parse(event.data);
        onEvent(data);
      } catch (error) {
        onError(error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      onError(error);
      
      // Log readyState for debugging
      const readyState = eventSource.readyState;
      console.log(`EventSource readyState: ${readyState} (${readyState === 0 ? 'CONNECTING' : readyState === 1 ? 'OPEN' : 'CLOSED'})`);
      
      // Auto-reconnect if connection is lost
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('Connection closed, reconnection will be handled by the hook');
        // Don't attempt to reconnect here, let the hook handle it
        eventSource.close();
      }
    };
    
    return () => {
      console.log('Closing SSE connection by request');
      eventSource.close();
    };
  } catch (error) {
    console.error('Failed to create SSE connection:', error);
    onError(error);
    return () => {}; // Return a no-op function
  }
}

// API service object with method for all the required endpoints
export const api = {
  /**
   * Get the current state of an agent
   */
  getAgentState: (agentName: string) => 
    apiRequest<AgentState>(`/state/${agentName}`),
  
  /**
   * Get the task registry
   */
  getTaskRegistry: () => 
    apiRequest<TaskRegistry>('/tasks'),
  
  /**
   * Send a message to an agent
   */
  sendAgentMessage: (agentName: string, message: string) => 
    apiRequest<{ messageId: string }>(`/agents/${agentName}`, {
      method: 'POST',
      body: { message }
    }),
  
  /**
   * Upload a resume for analysis
   */
  uploadResume: (resume: string, jobDescription?: string) => 
    apiRequest<{ taskId: string }>('/agents/resume', {
      method: 'POST',
      body: { resume, jobDescription }
    }),
  
  /**
   * Search for jobs
   */
  searchJobs: (criteria: JobSearchCriteria) => 
    apiRequest<{ taskId: string }>('/agents/job_search', {
      method: 'POST',
      body: { criteria }
    }),
  
  /**
   * Submit approval decision
   */
  submitApproval: (approvalId: string, approved: boolean, feedback?: string) => 
    apiRequest<{ success: boolean }>('/approval', {
      method: 'POST',
      body: { approvalId, approved, feedback }
    }),
  
  /**
   * Create an SSE connection for real-time updates
   */
  connectToSSE: (
    onAgentUpdate: (state: AgentState) => void,
    onTaskUpdate: (registry: TaskRegistry) => void,
    onApprovalRequest: (data: ApprovalData) => void,
    onError: (error: any) => void
  ) => {
    return createSSEConnection('/sse', (event) => {
      switch (event.type) {
        case 'agent_update':
          onAgentUpdate(event.data);
          break;
        case 'task_update':
          onTaskUpdate(event.data);
          break;
        case 'approval_request':
          onApprovalRequest(event.data);
          break;
        default:
          console.log('Unknown event type:', event.type);
      }
    }, onError);
  }
};
