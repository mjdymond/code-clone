# CareerHQ Agent System

*Last Updated: March 27, 2025 (Updated: Frontend Integration Plan Added)*

## Project Summary

The CareerHQ Agent System is a multi-agent AI framework built with LangGraph that provides comprehensive career assistance through specialized agents. The system orchestrates multiple AI agents, each focused on specific career-related tasks such as resume optimization, job searching, application tracking, interview preparation, and salary negotiation.

## Key Components

### Core Agents

- **Coordinator**: Primary user interface that processes requests and returns responses
- **Planner**: Creates structured execution plans for complex tasks
- **Supervisor**: Orchestrates the workflow by delegating to specialized agents
- **Resume Agent**: Analyzes and optimizes resumes for specific job opportunities
- **Job Search Agent**: Finds and filters job listings based on user criteria
- **Application Agent**: Manages application tracking and generates cover letters
- **Interview Agent**: Prepares interview questions and provides feedback
- **Salary Agent**: Analyzes market compensation and offers negotiation strategies
- **Reporter**: Summarizes findings and creates comprehensive reports

### Tools

- **Resume Tools**: Resume analysis, optimization, and ATS compatibility checking
- **Job Search Tools**: Job listing search and matching against user profiles
- **Application Tools**: Cover letter generation, tracking, and follow-up suggestions
- **Interview Tools**: Question preparation, response analysis, and mock interviews
- **Salary Tools**: Compensation estimation, offer analysis, and negotiation strategies

### Technical Stack

- **Backend**: FastAPI, Uvicorn, SSE-Starlette
- **Agent Framework**: LangGraph, LangChain
- **LLM Integration**: Configurable models per agent (via LangChain)
- **Vector Database**: For document storage and retrieval (planned)
- **Streaming**: Real-time updates during agent execution

## Architecture

The system follows a directed graph workflow where:

1. User requests enter through the coordinator agent
2. The planner creates a structured execution plan
3. The supervisor delegates tasks to specialized agents
4. Specialized agents execute their tasks and report back
5. Results stream back to the user in real-time

## File Structure

```
/careerhq-agents
├── src/                     # Source code
│   ├── agents/              # Agent definitions
│   ├── api/                 # API endpoints
│   ├── config/              # Configuration files
│   ├── graph/               # Workflow graph definitions
│   ├── llms/                # LLM interfaces
│   ├── prompts/             # Agent prompts
│   ├── service/             # Service layer
│   ├── tools/               # Tool implementations
│   └── utils/               # Utility functions
├── static/                  # Static files
├── tests/                   # Test files
├── examples/                # Example files for testing
├── Makefile                 # Common operations
├── requirements.txt         # Dependencies
├── server.py                # Server entry point
├── main.py                  # CLI entry point
└── run_tests.py             # Test runner
```

## Integration with CareerHQ

The agent system is designed to integrate with CareerHQ's existing modules:

| CareerHQ Module | Agent System Component |
|-----------------|------------------------|
| Resume Page     | Resume Agent           |
| Jobs Page       | Job Search Agent       |
| Applications Page | Application Agent     |
| Interviews Page | Interview Agent        |
| Salary Page     | Salary Agent           |
| File Hub        | Shared Resource Layer  |
| Profile Page    | User Context Manager   |

## Workflow Example

1. **User Request**: "Analyze my resume for a senior software engineer position at TechCorp"
2. **Coordinator**: Identifies complex task requiring planning
3. **Planner**: Creates execution plan with steps for Resume Agent and Job Search Agent
4. **Supervisor**: Delegates first task to Resume Agent
5. **Resume Agent**: Analyzes resume against job description
6. **Supervisor**: Routes to Job Search Agent based on results
7. **Job Search Agent**: Finds relevant job listings for comparison
8. **Reporter**: Combines findings into comprehensive report
9. **Coordinator**: Delivers final results to user

## Usage Scenarios

The system supports various career-related scenarios:

- **Resume Optimization**: Analyze and tailor resumes for specific job descriptions
- **Job Discovery**: Find and evaluate relevant job opportunities
- **Application Management**: Generate cover letters and track application status
- **Interview Preparation**: Create personalized interview question sets with feedback
- **Salary Negotiation**: Estimate appropriate compensation and develop negotiation strategies
- **Career Planning**: Generate comprehensive career development plans

## Interfaces

The system provides multiple interfaces for interaction:

1. **API Interface**: RESTful API endpoints for integration with web applications
2. **CLI Interface**: Command-line interface for direct interaction
3. **Streaming Events**: Real-time updates during agent processing

## Testing

The system includes a comprehensive testing framework:

1. **Unit Tests**: For individual components and tools
2. **Integration Tests**: For agent interactions and workflows
3. **Test Runner**: For automating test execution

## Frontend Integration

The CareerHQ Agent System is designed to integrate with a modern React frontend using CopilotKit components. The following integration points and modifications will ensure seamless communication between the backend agent system and the frontend UI.

### API Enhancements

1. **Event Streaming Modifications**:
   - Update the `/api/chat/stream` endpoint to include more detailed state information
   - Add specialized event types for agent state updates
   - Implement intermediate thinking state streaming
   - Expose task registry and progress information in events

2. **New API Endpoints**:
   - `/api/agent/state`: Get current state of specific agent
   - `/api/workflow/status`: Get comprehensive workflow status
   - `/api/tasks`: Get task registry and progress information
   - `/api/hitl`: Endpoint for human-in-the-loop interactions

### Backend Modifications

1. **State Exposure**:
   - Modify `CareerState` to include additional tracking fields accessible to the frontend
   - Enhance agent nodes to emit detailed progress information
   - Implement state history for agent steering capabilities

2. **Human-in-the-Loop Integration**:
   - Add pause points in workflow for human approval
   - Implement state freezing during user decision points
   - Create resumption mechanism after human input

3. **CORS and Security**:
   - Configure proper CORS headers for frontend integration
   - Implement authentication mechanism for API endpoints
   - Add rate limiting for production deployment

### Data Structures

1. **Agent State Format**:
   ```python
   {
     "agent_name": "resume_agent",
     "state": {
       "completion_status": 75,  # Percentage complete
       "current_task": "analyzing_keywords",
       "thinking": "Comparing resume keywords against job description...",
       "results": {  # Partial results as they become available
         "strengths": ["Strong technical background", ...],
         "missing_keywords": ["agile", ...]
       }
     }
   }
   ```

2. **Task Registry Format**:
   ```python
   {
     "tasks": [
       {
         "name": "analyze_resume",
         "status": "completed",  # pending, in_progress, completed, blocked
         "assigned_to": "resume_agent",
         "created_at": "2025-03-27T15:30:00Z",
         "completed_at": "2025-03-27T15:32:10Z"
       },
       {
         "name": "find_matching_jobs",
         "status": "in_progress",
         "assigned_to": "job_search_agent",
         "created_at": "2025-03-27T15:32:15Z",
         "completed_at": null
       }
     ],
     "overall_completion": 65  # Overall workflow completion percentage
   }
   ```

### Next Steps for Backend Team

1. **Immediate Tasks**:
   - Update `src/graph/types.py` to include new state fields
   - Modify `src/api/app.py` to enhance the event streaming format
   - Implement the new API endpoints for state access
   - Add human-in-the-loop breakpoints to agent workflow

2. **Testing Requirements**:
   - Create test cases for frontend-backend communication
   - Implement stub frontend for testing API modifications
   - Validate streaming performance under load
   - Test human intervention points with simulated delays

3. **Documentation**:
   - Document all API endpoints and expected formats
   - Create sequence diagrams for frontend-backend interactions
   - Document event types and their structure
   - Provide example code for frontend integration

These modifications will ensure that the CareerHQ Agent System's backend is fully prepared for integration with the CopilotKit-based frontend, enabling rich, interactive user experiences with transparent agent operations and human-in-the-loop capabilities.

## Future Development

The system is designed for extensibility, with plans for V2 enhancements:

- Additional specialized agents for new career domains
- Enhanced tools for existing agents
- Advanced integration with external data sources
- Learning capabilities for personalized assistance
- Advanced analytics for career insights
- Expanded frontend capabilities with agent steering
- Enhanced visualization of agent reasoning

## Conclusion

The CareerHQ Agent System provides a comprehensive, modular framework for career assistance using a multi-agent approach. By distributing tasks across specialized agents, the system can provide detailed, focused assistance for all aspects of career development, from resume creation to salary negotiation. The LangManus-inspired architecture ensures robust orchestration, while the modular design allows for future expansion. With the upcoming CopilotKit frontend integration, users will gain unprecedented visibility into agent operations and enjoy a more interactive, collaborative experience with the AI system.