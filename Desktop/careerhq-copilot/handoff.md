# CareerHQ CopilotKit UI Integration Project Handoff

## Project Overview

The CareerHQ CopilotKit UI Integration project creates a modern, agent-native frontend application that provides unprecedented transparency and human-in-the-loop control over AI agent workflows for career assistance. This application transforms the traditional chatbot experience into a collaborative workspace where users can see agent thinking, provide guidance at critical decision points, and maintain control throughout the career optimization process.

The frontend integrates with a LangGraph-powered backend system called "CareerHQ Agent System" which orchestrates multiple specialized AI agents for various career-related tasks (resume analysis, job search, interview preparation, and salary negotiation).

## Core Technology Stack

- **Frontend Framework**: Next.js with TypeScript, React 18+
- **Styling**: Tailwind CSS with Shadcn UI components
- **State Management**: Zustand for client-state
- **Agent Integration**: Custom hooks based on CopilotKit patterns
- **Backend Communication**: Server-Sent Events (SSE) for real-time updates
- **Form Handling**: React Hook Form with Zod

## Project Architecture

### Directory Structure

```
/careerhq-copilot
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/                # API routes for backend communication
│   │   ├── resume/             # Resume analysis page
│   │   ├── jobs/               # Job search page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── common/             # Shared components
│   │   ├── resume/             # Resume-specific components
│   │   ├── jobs/               # Job search components
│   │   └── ui/                 # Base UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and services
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── prd.md                      # Product Requirements Document
├── project-status.md           # Current project status
└── README.md                   # Project documentation
```

### Key Files

- **API Integration**: `src/lib/api.ts` - Service for communication with CareerHQ backend
- **State Management**: `src/lib/store.ts` - Zustand store for client-side state
- **Type Definitions**: `src/types/agent.ts` - TypeScript interfaces for agent states
- **Custom Hooks**:
  - `src/hooks/useCareerHQConnection.ts` - Manages SSE connection to backend
  - `src/hooks/useCareerAgent.ts` - Bidirectional state sharing with agents
  - `src/hooks/useCareerAgentRenderer.ts` - Renders UI based on agent state
  - `src/hooks/useCareerApproval.ts` - Human-in-the-loop approval workflows

## Core Concepts

### Agent-Native Architecture

The application is designed around the concept of "agent-native" interfaces, which provide:

1. **State Visibility**: Real-time visualization of agent states and thinking processes
2. **Human-in-the-Loop Controls**: Interactive interfaces for human oversight and guidance
3. **Bidirectional Communication**: Two-way flow of information between the UI and agents
4. **Task Tracking**: Visualization of task progress and dependencies

### Agent State Model

Each agent in the system has a well-defined state structure:

```typescript
interface AgentState {
  name: string;
  status: 'idle' | 'thinking' | 'waiting' | 'complete' | 'error';
  completion_percentage: number;
  current_task?: string;
  thinking?: string;
  results?: any;
  error?: string;
  waiting_for_approval?: boolean;
  approval_type?: string;
}
```

Specialized agents extend this base interface with domain-specific properties:

- **Resume Agent**: Adds strengths, weaknesses, keyword matches, and ATS scores
- **Job Search Agent**: Adds search criteria, job listings, and match scores

### Task Registry

The system maintains a registry of tasks across all agents:

```typescript
interface TaskRegistry {
  tasks: Task[];
  overall_completion: number;
}

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';
  assigned_to: string;
  depends_on?: string[];
  completion_percentage: number;
  created_at: string;
  completed_at?: string;
  result?: any;
}
```

This registry enables visualization of the overall workflow progress and dependencies between tasks.

### Human-in-the-Loop Approvals

The system implements approval workflows for critical decisions:

```typescript
type ApprovalData = ResumeApprovalData | JobApplicationApprovalData;

interface ResumeApprovalData {
  type: 'resume_improvements';
  improvements: ResumeImprovement[];
  originalResume: string;
  improvedResume: string;
}
```

When an agent requires human approval, it sets its state to `waiting_for_approval` and provides the necessary data. The UI then renders an appropriate approval interface.

## Backend Integration

### API Services

The frontend communicates with the CareerHQ backend through a set of API services:

```typescript
export const api = {
  getAgentState: (agentName: string) => ...,
  getTaskRegistry: () => ...,
  sendAgentMessage: (agentName: string, message: string) => ...,
  uploadResume: (resume: string, jobDescription?: string) => ...,
  searchJobs: (criteria: JobSearchCriteria) => ...,
  submitApproval: (approvalId: string, approved: boolean, feedback?: string) => ...,
  connectToSSE: (onAgentUpdate, onTaskUpdate, onApprovalRequest, onError) => ...
};
```

### Server-Sent Events (SSE)

Real-time updates from the backend are received through an SSE connection:

```typescript
function createSSEConnection(
  endpoint: string,
  onEvent: (event: any) => void,
  onError: (error: any) => void
): () => void {
  const eventSource = new EventSource(`${API_URL}${endpoint}`);
  // Event handling...
  return () => eventSource.close();
}
```

The connection handles three types of events:
- `agent_update`: Updates to agent state
- `task_update`: Updates to the task registry
- `approval_request`: Requests for human approval

## User Flows

### Resume Optimization Flow

1. User uploads or pastes resume content
2. System shows real-time analysis progress with thinking visualization
3. Results display with strengths, weaknesses, and keyword matches
4. System proposes specific improvements with before/after comparison
5. User approves or rejects changes
6. System applies approved changes and delivers optimized resume

### Job Search Flow

1. User enters job search criteria or allows system to extract from resume
2. System displays search progress with thinking visualization
3. Results appear with match scores and relevance indicators
4. User can refine search criteria based on initial results
5. User selects jobs for detailed comparison
6. User initiates application process for selected positions
7. System requests approval before submitting applications

## Key Components

### Resume Components

1. **ResumeUpload**: Allows users to upload or paste resume content
   - File upload with drag-and-drop
   - Text input area
   - Optional job description input

2. **ResumeAnalysisVisualizer**: Displays real-time analysis progress
   - Progress indicator with percentage
   - Agent thinking visualization
   - Strengths and weaknesses lists
   - Keyword match display
   - ATS compatibility score

3. **ResumeImprovementApproval**: Human-in-the-loop approval for changes
   - List of suggested improvements with impact levels
   - Side-by-side comparison of original and improved text
   - Before/after view of the entire resume
   - Feedback input field
   - Approve/reject buttons

### Job Search Components (Planned)

1. **JobSearchForm**: Input for job search criteria
   - Role, location, skills, experience level
   - Remote work options
   - Salary range preferences

2. **JobSearchVisualizer**: Displays search progress and results
   - Progress indicator with percentage
   - Agent thinking visualization
   - Search criteria summary
   - List of matching jobs with scores

3. **JobCard**: Display of individual job listings
   - Job title, company, location
   - Salary information
   - Match score with detailed breakdown
   - Quick actions (view details, apply)

4. **JobApplicationApproval**: Confirmation before application submission
   - Job details summary
   - Cover letter preview
   - Resume confirmation
   - Application details
   - Approve/reject buttons

### Common Components

1. **TaskDashboard**: Visualization of overall workflow progress
   - Overall completion percentage
   - List of tasks with status indicators
   - Agent assignments
   - Progress tracking for in-progress tasks

2. **AgentThinking**: Real-time display of agent reasoning
   - Current thinking process
   - Formatted output for readability
   - Visual distinction from regular UI

## Current Status

The project has made significant progress with the implementation of core architecture components and specialized agent interfaces:

- **Completed**: 
  - Core project setup and configuration
  - Type definitions and state management
  - Custom hooks for agent integration
  - UI component library
  - Task tracking dashboard
  - Agent thinking visualization
  - Resume-related components (upload, analysis, approval)

- **In Progress**:
  - Job search components
  - Page layouts
  - Backend connectivity with test data

- **Planned**:
  - Complete UI components for job search
  - Implement page layouts
  - Create mock API for testing
  - Integrate with actual backend
  - UI/UX polish

## Implementation Details

### Custom Hooks

The project includes custom hooks that adapt CopilotKit patterns to our specific needs:

1. **useCareerAgent**: Provides bidirectional state sharing with agents
   ```typescript
   const { state, updateState, sendMessage } = useCareerAgent({
     name: 'resume_agent',
     initialState: { /* ... */ }
   });
   ```

2. **useCareerAgentRenderer**: Renders UI based on agent state
   ```typescript
   const renderedContent = useCareerAgentRenderer({
     name: 'resume_agent',
     render: ({ state }) => (
       // UI components based on state
     )
   });
   ```

3. **useCareerApproval**: Implements human-in-the-loop workflows
   ```typescript
   const approvalComponent = useCareerApproval({
     name: 'ResumeImprovementApproval',
     type: 'resume_improvements',
     renderAndWait: ({ args, handler }) => (
       // Approval UI with handler for user decisions
     )
   });
   ```

4. **useCareerHQConnection**: Manages the connection to the backend
   ```typescript
   const { closeConnection, reopenConnection } = useCareerHQConnection();
   ```

### State Management

The application uses Zustand for client-side state management:

```typescript
export const useStore = create<AppState>((set) => ({
  // Agents state
  agents: {},
  setAgentState: (agentName, state) => ...,
  
  // Task registry
  taskRegistry: { tasks: [], overall_completion: 0 },
  setTaskRegistry: (registry) => ...,
  
  // Additional state properties and actions
  // ...
}));
```

Specialized selectors provide type-safe access to agent states:

```typescript
export const useResumeAgentState = (): ResumeAgentState => {
  return useStore(state => (state.agents.resume_agent || {}) as ResumeAgentState);
};
```

## Technical Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| ESM Compatibility | Updated Next.js configuration with `transpilePackages` and `esmExternals: 'loose'` |
| Agent State Typing | Implemented comprehensive TypeScript interfaces with inheritance for specialized agents |
| Real-time Updates | Created SSE connection with auto-reconnect and error handling |
| State Synchronization | Used Zustand for local state with custom hooks for agent communication |
| Complex Approvals | Built flexible approval system with type-safe rendering |
| Task Dependencies | Implemented a task registry model with dependency tracking |

## Next Steps

To complete the project, the next developer should focus on:

1. **Finish Job Search Components**:
   - Implement JobSearchForm component
   - Create JobSearchVisualizer with match scoring
   - Build JobApplicationApproval workflow

2. **Complete Page Layouts**:
   - Finalize Resume page layout
   - Implement Job Search page
   - Create shared navigation components

3. **Backend Integration**:
   - Create mock API responses for testing
   - Implement error handling and reconnection logic
   - Test with simulated agent behaviors

4. **Polish UI/UX**:
   - Add loading states and transitions
   - Implement error handling displays
   - Ensure responsive design across devices
   - Add accessibility features

## Resources

- **CopilotKit Documentation**: Reference for understanding the core patterns
- **CareerHQ Agent System**: Backend documentation for API integration
- **Product Requirements Document**: `prd.md` - Detailed requirements and specifications
- **Project Status**: `project-status.md` - Current state and upcoming work

## Conclusion

The CareerHQ CopilotKit UI Integration project establishes a modern, transparent interface for AI-assisted career development. By implementing agent-native patterns, it provides unprecedented visibility into agent operations and ensures appropriate human oversight for critical decisions.

The foundation has been laid with core architecture components and resume-focused interfaces. The next phase involves completing the job search components and integrating with the backend for real-world testing. With the comprehensive documentation and well-structured codebase, the next developer should be able to quickly get up to speed and continue the implementation.
