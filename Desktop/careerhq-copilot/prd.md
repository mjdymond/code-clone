# Product Requirements Document (PRD)

# CareerHQ Copilot Frontend (MVP)

## Document Information
**Author:** Product Manager  
**Last Updated:** March 27, 2025  
**Status:** Draft  
**Version:** 1.0  

## Overview

### Product Vision
CareerHQ Copilot is a modern, agent-native frontend application that provides unprecedented transparency and human-in-the-loop control over AI agent workflows for career assistance. It transforms the traditional chatbot experience into a collaborative workspace where users can see agent thinking, provide guidance at critical decision points, and maintain control throughout the career optimization process.

### User Problems & Opportunities
- Users lack visibility into how AI systems make career recommendations
- Traditional chatbots don't provide human oversight for important career decisions
- Career assistance requires nuanced collaboration between AI and humans
- Users need to understand agent reasoning to build trust in career recommendations

### Target Users
- Job seekers looking to optimize their job search experience
- Professionals seeking to improve their career materials
- Career changers needing guidance for transitions
- Recent graduates entering the job market

## MVP Scope

### Included Features

#### 1. Core Application Architecture
- Next.js with TypeScript foundation
- Tailwind CSS styling framework
- API integration with CareerHQ backend
- Bidirectional state management with CopilotKit
- Navigation between agent workspaces

#### 2. Resume Optimization Workspace
- Real-time resume analysis visualization
- Strength/weakness identification display
- Keyword match visualization
- Human approval workflow for resume changes
- Before/after comparison interface

#### 3. Job Search Workspace
- Job search progress visualization
- Match quality scoring indicators
- Basic job comparison interface
- Search criteria refinement controls
- Job application confirmation workflow

#### 4. Task Management System
- Cross-agent task registry visualization
- Progress tracking with status indicators
- Agent association for each task
- Overall workflow completion metrics

#### 5. Agent Thinking Transparency
- Real-time thinking process displays
- Intermediate reasoning visualization
- Confidence indicators for agent decisions
- Human feedback mechanisms

### Out of Scope (Future Versions)
- Interview preparation workspace
- Salary negotiation workspace
- Cover letter generation
- Advanced agent steering controls
- Multi-document comparison
- Progress tracking across sessions
- Job application tracking
- Performance analytics dashboards
- User accounts and authentication

## User Experience

### User Flows

#### Resume Optimization Flow
1. User uploads or pastes resume content
2. System shows real-time analysis progress with thinking visualization
3. Results display with strengths, weaknesses, and keyword matches
4. System proposes specific improvements with before/after comparison
5. User approves or rejects changes
6. System applies approved changes and delivers optimized resume

#### Job Search Flow
1. User enters job search criteria or allows system to extract from resume
2. System displays search progress with thinking visualization
3. Results appear with match scores and relevance indicators
4. User can refine search criteria based on initial results
5. User selects jobs for detailed comparison
6. User initiates application process for selected positions
7. System requests approval before submitting applications

### UI Components

#### Common Components
- Agent thinking visualization panel
- Task registry display
- Progress indicators
- Approval interfaces
- Agent chat interface
- Navigation header

#### Resume-Specific Components
- Resume analysis visualization
- Keyword match display
- Resume improvement approval interface
- Before/after comparison view

#### Job Search Components
- Search criteria input/refinement
- Job card with match scoring
- Job comparison interface
- Application confirmation workflow

## Technical Requirements

### API Integration

#### CareerHQ Backend Connection
- **Endpoint:** `/api/agents/[agent_name]`
- **Method:** POST
- **Content-Type:** application/json
- **Response Format:** Server-Sent Events (SSE)
- **Authentication:** Bearer token

#### Required Backend Endpoints
1. `/api/agents/coordinator` - Main entry point
2. `/api/agents/resume` - Resume analysis agent
3. `/api/agents/job_search` - Job search agent
4. `/api/tasks` - Task registry management
5. `/api/state/[agent_name]` - Agent state access
6. `/api/sse` - Event stream for real-time updates

### State Management

#### Agent State Structure
```typescript
interface AgentState {
  name: string; // Agent identifier
  status: 'idle' | 'thinking' | 'waiting' | 'complete' | 'error';
  completion_percentage: number; // 0-100
  current_task?: string;
  thinking?: string; // Current reasoning process
  results?: any; // Agent-specific results
  error?: string;
  waiting_for_approval?: boolean;
  approval_type?: string;
}
```

#### Task Registry Structure
```typescript
interface Task {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';
  assigned_to: string; // Agent name
  depends_on?: string[]; // Task IDs
  completion_percentage: number;
  created_at: string;
  completed_at?: string;
  result?: any;
}

interface TaskRegistry {
  tasks: Task[];
  overall_completion: number; // 0-100
}
```

### Frontend Implementation

#### CopilotKit Integration
- Use `useCoAgent` for bidirectional state sharing
- Implement `useCoAgentStateRender` for visualization components
- Apply `useCopilotAction` with `renderAndWait` for approval flows

#### SSE Connection Management
- Establish persistent connection to backend
- Handle reconnection on network interruptions
- Process event streams for state updates
- Update local state from event data

## Implementation Plan

### Phase 1: Foundation (Week 1)
- Set up Next.js project with TypeScript
- Configure Tailwind CSS styling
- Create basic page structure and navigation
- Implement API service for backend communication
- Configure CopilotKit core hooks

### Phase 2: Resume Workspace (Week 2)
- Implement resume upload/input interface
- Create resume analysis visualization
- Build strength/weakness display
- Develop keyword match visualization
- Implement improvement approval workflow

### Phase 3: Job Search Workspace (Week 2-3)
- Create search criteria input interface
- Build job search progress visualization
- Implement job card with match scoring
- Develop job comparison interface
- Create application approval workflow

### Phase 4: Task Management & Thinking Display (Week 3)
- Implement task registry visualization
- Build cross-agent progress tracking
- Create agent thinking display components
- Develop confidence indicators

### Phase 5: Integration & Testing (Week 4)
- Connect all components to backend API
- Implement end-to-end testing
- Perform user testing
- Fix issues and optimize performance

## Metrics & Success Criteria

### Key Performance Indicators
1. **Completion Rate:** Percentage of users who complete the full optimization workflow
2. **Time Savings:** Reduction in time spent on resume optimization compared to manual methods
3. **Job Match Rate:** Quality of job matches as rated by users
4. **Trust Score:** User ratings of trust in agent recommendations
5. **Approval Rate:** Percentage of agent suggestions approved by users

### Success Criteria
- Users complete resume optimization workflow in under 20 minutes
- At least 70% of users approve suggested resume improvements
- Average job match rating of at least 4/5 stars
- 80% of users report increased trust in AI recommendations
- Overall user satisfaction rating of 4.2/5 or higher

## Rollout Strategy

### Testing Approach
1. **Internal Testing:** Engineering team verification (Week 4)
2. **Alpha Testing:** Limited internal users (Week 4)
3. **Beta Testing:** Select external users (Week 5)
4. **Limited Release:** Gradual rollout to existing users (Week 6)

### Launch Timeline
- **Alpha Launch:** End of Week 4
- **Beta Launch:** End of Week 5
- **Public MVP Launch:** End of Week 6

## Future Considerations

### Post-MVP Features
1. Interview preparation workspace
2. Salary negotiation assistant
3. Cover letter generation
4. Advanced agent steering controls
5. Application tracking system
6. Performance analytics dashboard
7. User accounts and session persistence

### Integration Opportunities
1. LinkedIn profile import
2. Job board API integrations
3. Calendaring for interview scheduling
4. Email notifications for job matches
5. ATS system connections for application tracking

## Appendix

### Technical Architecture Diagram
```
+-------------------+     +-------------------+     +-------------------+
| CareerHQ Frontend |<--->| CopilotKit Layer  |<--->| CareerHQ Backend  |
+-------------------+     +-------------------+     +-------------------+
        |                         |                         |
        v                         v                         v
+-------------------+     +-------------------+     +-------------------+
| React Components  |     | State Management  |     | Agent System      |
+-------------------+     +-------------------+     +-------------------+
        |                         |                         |
        v                         v                         v
+-------------------+     +-------------------+     +-------------------+
| UI Visualizations |     | Human-in-the-Loop |     | LangGraph Flow    |
+-------------------+     +-------------------+     +-------------------+
```

### Component Dependencies
```
- CopilotKit
  ├── useCoAgent
  ├── useCoAgentStateRender
  └── useCopilotAction
      
- UI Components
  ├── Resume Analysis
  │   ├── StrengthWeaknessDisplay
  │   ├── KeywordMatchVisualization
  │   └── BeforeAfterComparison
  │
  ├── Job Search
  │   ├── JobCard
  │   ├── MatchScoreIndicator
  │   └── JobComparisonInterface
  │
  └── Common
      ├── TaskRegistry
      ├── AgentThinkingDisplay
      └── ApprovalInterface
```
