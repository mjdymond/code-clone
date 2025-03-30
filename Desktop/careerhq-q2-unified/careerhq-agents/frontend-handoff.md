# CareerHQ Agent System - Frontend Integration Guide

*Last Updated: March 28, 2025*

## Overview

This document provides comprehensive instructions for integrating the CareerHQ Agent System with the frontend application. The agent system exposes several API endpoints that enable real-time communication, streaming responses, and state management for the specialized agents.

#requirements
# Core dependencies
langchain>=0.1.8
langchain-openai>=0.0.5
langgraph>=0.0.20
langchain-core>=0.1.24

# LLM providers
openai>=1.69.0

# Web framework
fastapi>=0.109.2
uvicorn>=0.27.1
sse-starlette>=1.6.5

# Utilities
python-dotenv>=1.0.1
pydantic>=2.6.1
json-repair>=0.6.0

# Data handling
pandas>=2.2.0
chromadb>=0.4.22

# Async
aiohttp>=3.9.3
asyncio>=3.4.3

# Web scraping (for job posts and research)
beautifulsoup4>=4.12.3
requests>=2.31.0
selenium>=4.18.1
webdriver-manager>=4.0.1


## API Endpoints

### Base URL

```
http://localhost:8000/api
```

For production deployments, replace with the appropriate domain.

## Core Endpoints

### 1. Chat Stream Endpoint

**Endpoint:** `/chat/stream`

**Method:** POST

**Description:** Primary endpoint for streaming agent responses. Uses Server-Sent Events (SSE) to provide real-time updates as agents process requests.

**Request Body:**

```json
{
  "message": "Analyze my resume for a senior software engineer position at TechCorp",
  "history": [
    {"role": "user", "content": "Previous message content"},
    {"role": "assistant", "content": "Previous response content"}
  ],
  "context": {
    "resume_id": "resume-123",
    "job_id": "job-456",
    "user_id": "user-789"
  },
  "documents": {
    "resume": "Full resume text or reference",
    "job_description": "Job description text or reference"
  },
  "stream": true
}
```

**Response:**

SSE stream with the following event types:

- `thinking`: Agent's intermediate thoughts during processing
- `agent_change`: Notification when processing moves to a different agent
- `partial`: Partial response chunks as they're generated
- `final`: Complete response when processing is finished
- `error`: Error information if processing fails
- `state_update`: Updates to the workflow state
- `task_update`: Updates to task registry and progress

**Example Event:**

```
event: partial
data: {"content": "I'm analyzing your resume against the job description...", "agent": "resume_agent"}

```

### 2. Agent State Endpoint

**Endpoint:** `/agent/state`

**Method:** GET

**Description:** Retrieves the current state of a specific agent.

**Query Parameters:**

- `agent_name`: Name of the agent (e.g., `resume_agent`, `job_search_agent`)
- `session_id`: Optional session identifier for retrieving state from a specific session

**Response:**

```json
{
  "agent_name": "resume_agent",
  "state": {
    "completion_status": 75,
    "current_task": "analyzing_keywords",
    "thinking": "Comparing resume keywords against job description...",
    "results": {
      "strengths": ["Strong technical background", "..."],
      "missing_keywords": ["agile", "..."]
    }
  }
}
```

### 3. Workflow Status Endpoint

**Endpoint:** `/workflow/status`

**Method:** GET

**Description:** Retrieves comprehensive status information about the current workflow.

**Query Parameters:**

- `session_id`: Optional session identifier for retrieving status from a specific session

**Response:**

```json
{
  "session_id": "session-123",
  "status": "in_progress",
  "started_at": "2025-03-28T13:45:30Z",
  "current_agent": "job_search_agent",
  "completed_agents": ["resume_agent"],
  "pending_agents": ["application_agent"],
  "overall_completion": 65
}
```

### 4. Tasks Endpoint

**Endpoint:** `/tasks`

**Method:** GET

**Description:** Retrieves the task registry and progress information.

**Query Parameters:**

- `session_id`: Optional session identifier for retrieving tasks from a specific session

**Response:**

```json
{
  "tasks": [
    {
      "name": "analyze_resume",
      "status": "completed",
      "assigned_to": "resume_agent",
      "created_at": "2025-03-28T13:45:30Z",
      "completed_at": "2025-03-28T13:47:40Z"
    },
    {
      "name": "find_matching_jobs",
      "status": "in_progress",
      "assigned_to": "job_search_agent",
      "created_at": "2025-03-28T13:47:45Z",
      "completed_at": null
    }
  ],
  "overall_completion": 65
}
```

### 5. Human-in-the-Loop Endpoint

**Endpoint:** `/hitl`

**Method:** POST

**Description:** Provides human input to an in-progress workflow that is waiting for user feedback.

**Request Body:**

```json
{
  "session_id": "session-123",
  "task_id": "task-456",
  "input": {
    "decision": "approve",
    "feedback": "Looks good, proceed with this approach",
    "modifications": {}
  }
}
```

**Response:**

```json
{
  "status": "accepted",
  "message": "Workflow resumed with your input",
  "next_task": "generate_cover_letter"
}
```

## Integration Patterns

### 1. Basic Chat Interface

For a simple chat interface, implement the following pattern:

```javascript
// Example using JavaScript and EventSource
const sendMessage = async (message, history = []) => {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      history,
      stream: true
    })
  });
  
  // Get the response URL for streaming
  const { streamUrl } = await response.json();
  
  // Connect to the event stream
  const eventSource = new EventSource(streamUrl);
  
  // Handle different event types
  eventSource.addEventListener('thinking', (e) => {
    const data = JSON.parse(e.data);
    // Update UI with thinking state
    updateThinkingState(data);
  });
  
  eventSource.addEventListener('agent_change', (e) => {
    const data = JSON.parse(e.data);
    // Update UI to show which agent is active
    updateActiveAgent(data.agent);
  });
  
  eventSource.addEventListener('partial', (e) => {
    const data = JSON.parse(e.data);
    // Update UI with partial response
    appendPartialResponse(data.content);
  });
  
  eventSource.addEventListener('final', (e) => {
    const data = JSON.parse(e.data);
    // Update UI with final response
    setFinalResponse(data.content);
    // Close the event source
    eventSource.close();
  });
  
  eventSource.addEventListener('error', (e) => {
    const data = JSON.parse(e.data);
    // Handle error
    showError(data.message);
    eventSource.close();
  });
};
```

### 2. Advanced Agent Dashboard

For a more advanced interface showing agent states and task progress:

```javascript
// Polling for workflow status updates
const pollWorkflowStatus = (sessionId, interval = 2000) => {
  const statusInterval = setInterval(async () => {
    try {
      const response = await fetch(`/api/workflow/status?session_id=${sessionId}`);
      const status = await response.json();
      
      // Update dashboard with workflow status
      updateWorkflowStatus(status);
      
      // If workflow is complete, stop polling
      if (status.status === 'completed' || status.status === 'failed') {
        clearInterval(statusInterval);
      }
    } catch (error) {
      console.error('Error polling workflow status:', error);
    }
  }, interval);
  
  return () => clearInterval(statusInterval); // Return cleanup function
};

// Fetch task registry
const fetchTasks = async (sessionId) => {
  const response = await fetch(`/api/tasks?session_id=${sessionId}`);
  const tasks = await response.json();
  
  // Update task display
  updateTaskRegistry(tasks);
  
  return tasks;
};

// Get detailed agent state
const fetchAgentState = async (agentName, sessionId) => {
  const response = await fetch(`/api/agent/state?agent_name=${agentName}&session_id=${sessionId}`);
  const state = await response.json();
  
  // Update agent state display
  updateAgentState(agentName, state);
  
  return state;
};
```

### 3. Human-in-the-Loop Integration

For workflows requiring human approval or input:

```javascript
// Submit human feedback
const submitHumanFeedback = async (sessionId, taskId, input) => {
  const response = await fetch('/api/hitl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      session_id: sessionId,
      task_id: taskId,
      input
    })
  });
  
  const result = await response.json();
  
  // Update UI based on response
  if (result.status === 'accepted') {
    showSuccessMessage('Input accepted');
    // Resume polling or streaming
    resumeWorkflowMonitoring(sessionId);
  } else {
    showErrorMessage(result.message);
  }
  
  return result;
};
```

## Agent-Specific UI Components

Each specialized agent has unique UI requirements for optimal display of their outputs:

### Resume Agent

- Resume comparison view (before/after)
- Keyword highlighting
- Strength/weakness visualization
- ATS compatibility score display

### Job Search Agent

- Job listing cards with match scores
- Filter controls for job results
- Job detail expansion panels
- Relevance indicators

### Application Agent

- Cover letter preview with edit capabilities
- Application status tracking board
- Follow-up message templates
- Document attachment management

### Interview Agent

- Question/answer practice interface
- Feedback visualization
- Mock interview session controls
- Response quality indicators

### Salary Agent

- Compensation range visualizations
- Negotiation script templates
- Offer comparison tools
- Benefits value calculator

## Authentication and Security

All API endpoints require authentication. The agent system uses the same authentication mechanism as the main CareerHQ application:

1. **JWT Authentication**: Include the JWT token in the Authorization header
2. **CORS Configuration**: The API is configured to accept requests from the frontend domain
3. **Rate Limiting**: API endpoints have rate limiting to prevent abuse

```javascript
// Example of authenticated request
const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  // Handle authentication errors
  if (response.status === 401) {
    // Redirect to login or refresh token
    handleAuthError();
    return null;
  }
  
  return response;
};
```

## Error Handling

The API uses standard HTTP status codes and provides detailed error information:

- **400 Bad Request**: Invalid input parameters
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side error

Error responses follow this format:

```json
{
  "error": {
    "code": "invalid_input",
    "message": "The request contains invalid parameters",
    "details": {
      "field": "message",
      "issue": "Message cannot be empty"
    }
  }
}
```

## Performance Considerations

1. **Long-Running Operations**: Some agent operations may take several seconds to complete. Use streaming for real-time feedback.

2. **Connection Management**: Implement proper connection handling for SSE streams, including reconnection logic.

3. **Caching**: Cache agent responses when appropriate to reduce redundant processing.

4. **Progressive Loading**: Implement progressive loading for large result sets.

## Development Environment

To set up a local development environment for testing the integration:

1. Clone the CareerHQ Agent System repository
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `python server.py`
4. The API will be available at `http://localhost:8000/api`

## Deployment Considerations

For production deployment, consider the following:

1. **Environment Variables**: Configure the agent system with appropriate environment variables for production
2. **CORS Settings**: Update CORS settings to allow requests from the production frontend domain
3. **SSL**: Ensure all communication uses HTTPS
4. **Load Balancing**: For high-traffic deployments, implement load balancing
5. **Monitoring**: Set up monitoring for API performance and errors

## Example Integration

A complete example of integrating with the Resume Agent:

```javascript
// Resume analysis component
const ResumeAnalysis = ({ resumeId, jobId }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [agentState, setAgentState] = useState(null);
  const [error, setError] = useState(null);
  
  const analyzeResume = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch resume and job description content
      const resumeContent = await fetchResumeContent(resumeId);
      const jobContent = await fetchJobContent(jobId);
      
      // Start the analysis
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          message: `Analyze this resume for the following job description`,
          documents: {
            resume: resumeContent,
            job_description: jobContent
          },
          context: {
            resume_id: resumeId,
            job_id: jobId
          },
          stream: true
        })
      });
      
      const { streamUrl, session_id } = await response.json();
      
      // Set up event source for streaming
      const eventSource = new EventSource(streamUrl);
      
      // Set up event handlers
      eventSource.addEventListener('thinking', (e) => {
        const data = JSON.parse(e.data);
        setAgentState(prev => ({
          ...prev,
          thinking: data.content
        }));
      });
      
      eventSource.addEventListener('state_update', (e) => {
        const data = JSON.parse(e.data);
        setAgentState(data.state);
      });
      
      eventSource.addEventListener('final', (e) => {
        const data = JSON.parse(e.data);
        setResult(data);
        setLoading(false);
        eventSource.close();
      });
      
      eventSource.addEventListener('error', (e) => {
        try {
          const data = JSON.parse(e.data);
          setError(data.message);
        } catch (err) {
          setError('Connection error');
        }
        setLoading(false);
        eventSource.close();
      });
      
      // Start polling for detailed agent state
      const pollInterval = setInterval(async () => {
        const stateResponse = await fetch(
          `/api/agent/state?agent_name=resume_agent&session_id=${session_id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          }
        );
        
        if (stateResponse.ok) {
          const stateData = await stateResponse.json();
          setAgentState(stateData.state);
        }
      }, 2000);
      
      // Clean up on unmount
      return () => {
        eventSource.close();
        clearInterval(pollInterval);
      };
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  // Render the component
  return (
    <div className="resume-analysis">
      <h2>Resume Analysis</h2>
      
      <button 
        onClick={analyzeResume} 
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
      
      {agentState && (
        <div className="agent-state">
          <h3>Analysis Progress: {agentState.completion_status}%</h3>
          <p>Current task: {agentState.current_task}</p>
          {agentState.thinking && (
            <div className="thinking">
              <h4>Agent is thinking:</h4>
              <p>{agentState.thinking}</p>
            </div>
          )}
          
          {agentState.results && agentState.results.strengths && (
            <div className="partial-results">
              <h4>Strengths Identified:</h4>
              <ul>
                {agentState.results.strengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {result && (
        <div className="analysis-result">
          <h3>Analysis Complete</h3>
          <div className="result-content">
            {/* Format the result based on its structure */}
            {/* This will depend on the specific format returned by the resume agent */}
          </div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};
```

## Support and Troubleshooting

For integration support or troubleshooting:

1. Check the API logs for detailed error information
2. Verify authentication credentials and permissions
3. Ensure correct formatting of request payloads
4. Test endpoints using tools like Postman before frontend integration
5. Contact the CareerHQ Agent System team for assistance with complex integration issues

## Changelog

- **March 28, 2025**: Initial documentation
- **March 27, 2025**: API specification finalized
- **March 26, 2025**: Streaming implementation completed
- **March 25, 2025**: Human-in-the-loop functionality added
