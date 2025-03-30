# CareerHQ Agent System - Technical Handoff Document

*Last Updated: March 27, 2025*

## System Overview

The CareerHQ Agent System is a sophisticated multi-agent AI framework built using LangGraph and LangChain that provides comprehensive career assistance through specialized agents. The system implements a directed graph workflow pattern based on the LangManus architecture, which enables coordinated interaction between different specialized agents to provide holistic career guidance and assistance.

## Architecture

The system is structured as a directed graph of agents, where each agent is specialized for a specific domain of career assistance. The architecture follows a hub-and-spoke model with central orchestration agents that delegate tasks to specialized domain agents.

### Agent Types

1. **Orchestration Agents**:
   - **Coordinator**: Primary user interface that processes requests and returns responses
   - **Planner**: Creates structured execution plans for complex tasks
   - **Supervisor**: Orchestrates the workflow by delegating to specialized agents
   - **Reporter**: Summarizes findings and creates comprehensive reports

2. **Domain-Specific Agents**:
   - **Resume Agent**: Analyzes and optimizes resumes for specific job opportunities
   - **Job Search Agent**: Finds and filters job listings based on user criteria
   - **Application Agent**: Manages application tracking and generates cover letters
   - **Interview Agent**: Prepares interview questions and provides feedback
   - **Salary Agent**: Analyzes market compensation and offers negotiation strategies

### Workflow Pattern

The system implements a directed workflow graph where:

1. User requests enter through the coordinator agent
2. For complex tasks, the planner creates a structured execution plan
3. The supervisor delegates tasks to specialized agents based on the plan
4. Specialized agents execute their tasks using domain-specific tools
5. The supervisor routes between agents based on task dependencies
6. The reporter may compile findings into a comprehensive report
7. Results stream back to the user in real-time

## Implementation Details

### Technology Stack

- **Backend**: FastAPI, Uvicorn, SSE-Starlette
- **Agent Framework**: LangGraph for orchestration, LangChain for agent implementation
- **LLM Integration**: Configurable models per agent (via LangChain)
- **Streaming**: Real-time updates during agent execution using SSE

### Key Components

#### 1. Agent Definitions (src/agents/agents.py)

Agents are created using LangGraph's `create_react_agent` function, which implements a ReAct pattern (Reasoning + Acting). Each agent is configured with:

- A specific LLM model from the configuration
- Domain-specific tools
- A prompt template that defines the agent's behavior

```python
# Example of agent definition
resume_agent = create_react_agent(
    get_llm_by_type(AGENT_LLM_MAP["resume_agent"]),
    tools=[analyze_resume, optimize_resume, check_ats_compatibility],
    prompt=lambda state: apply_prompt_template("resume_agent", state),
)
```

#### 2. Graph Structure (src/graph/builder.py)

The workflow is implemented as a `StateGraph` with a defined state type (`CareerState`). The graph builder:

- Adds nodes for each agent
- Defines edges that determine the flow between agents
- Compiles the graph for execution

```python
# Example of graph building
builder = StateGraph(CareerState)
builder.add_node("coordinator", coordinator_node)
builder.add_node("planner", planner_node)
# ... more nodes
builder.add_edge(START, "coordinator")
builder.add_edge("coordinator", "planner")
# ... more edges
return builder.compile()
```

#### 3. Node Implementation (src/graph/nodes.py)

Each node in the graph corresponds to an agent function that:

- Invokes the appropriate agent with the current state
- Processes the agent's response
- Returns a command that updates the state and determines the next node

```python
# Example of a node implementation
def resume_node(state: CareerState) -> Command[Literal["supervisor"]]:
    result = resume_agent.invoke(state)
    response_content = result["messages"][-1].content
    response_content = repair_json_output(response_content)
    return Command(
        update={"messages": [HumanMessage(content=response_content, name="resume_agent")]},
        goto="supervisor",
    )
```

The supervisor node is particularly important as it routes between specialized agents based on the task requirements:

```python
# Simplified supervisor node
def supervisor_node(state: CareerState) -> Command[Literal[*TEAM_MEMBERS, "__end__"]]:
    messages = apply_prompt_template("supervisor", state)
    response = get_llm_by_type(AGENT_LLM_MAP["supervisor"])
        .with_structured_output(schema=Router, method="json_mode")
        .invoke(messages)
    goto = response["next"]
    if goto == "FINISH":
        goto = "__end__"
    return Command(goto=goto, update={"next": goto})
```

#### 4. Tools Implementation (src/tools/*.py)

Tools are specialized functions that agents use to perform specific tasks. They are implemented using LangChain's `@tool` decorator and often include structured outputs using Pydantic models:

```python
# Example of a tool implementation
@tool
@log_tool_use
def analyze_resume(resume_text: str, job_description: str = None) -> Dict[str, Any]:
    # Tool implementation
    result = {
        "strengths": [...],
        "weaknesses": [...],
        "match_score": 75,
        # ...
    }
    return result
```

#### 5. Service Layer (src/service/workflow_service.py)

The service layer provides a high-level interface to the agent system:

- Initializes the graph with the request state
- Processes requests through the graph
- Streams results back to the client
- Formats events for client consumption

```python
# Example of processing a request
async def process_request(
    self,
    request_text: str,
    config: Optional[Dict[str, Any]] = None
) -> AsyncGenerator[Dict[str, Any], None]:
    state = {
        "messages": [HumanMessage(content=request_text)],
        # ... more state initialization
    }
    async for event in self.graph.astream(state):
        formatted_event = self._format_event(event)
        yield formatted_event
```

#### 6. API Layer (src/api/endpoints.py)

The API layer exposes the agent system functionality through FastAPI:

- General purpose `/process` endpoint for any request
- Specialized endpoints for common tasks (resume analysis, job search, etc.)
- Uses Server-Sent Events (SSE) for streaming responses

```python
# Example of API endpoint
@router.post("/process")
async def process_request(request: Request):
    data = await request.json()
    text = data.get("text", "")
    config = data.get("config", {})
    
    async def event_generator():
        async for event in workflow_service.process_request(text, config):
            yield {
                "event": event["type"],
                "id": event.get("id", ""),
                "data": event
            }
    
    return EventSourceResponse(event_generator())
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

## Usage Examples

### Resume Analysis

```
User: "Analyze my resume for a senior software engineer position at TechCorp"

1. Coordinator identifies this as a complex task requiring planning
2. Planner creates execution plan with steps for Resume Agent
3. Supervisor delegates to Resume Agent
4. Resume Agent analyzes the resume against the job description
5. Resume Agent returns analysis to Supervisor
6. Supervisor determines next steps or completes the workflow
7. Results stream back to the user
```

### Job Search with Resume Matching

```
User: "Find backend developer jobs in Seattle that match my experience with Python and Django"

1. Coordinator identifies this requires both job search and resume matching
2. Planner creates execution plan with steps for Job Search Agent and Resume Agent
3. Supervisor delegates first task to Job Search Agent
4. Job Search Agent finds relevant listings
5. Supervisor routes to Resume Agent for matching analysis
6. Resume Agent compares user's resume against job listings
7. Reporter combines findings into a comprehensive report
8. Results stream back to the user
```

## Extending The System

### Adding a New Agent

1. Implement tools for the agent in `src/tools/new_agent_tools.py`
2. Define the agent in `src/agents/agents.py` using `create_react_agent`
3. Add a node implementation in `src/graph/nodes.py`
4. Update the graph in `src/graph/builder.py` to include the new agent
5. Add prompt templates for the new agent in `src/prompts/templates`

### Adding a New Tool

1. Implement the tool using the `@tool` decorator in the appropriate tool file
2. Define structured input/output using Pydantic models if needed
3. Add the tool to the appropriate agent's tool list in `agents.py`

## Configuration

The system uses a configuration system to manage different aspects:

- LLM models per agent in `src/config/agents.py`
- Team members list in `src/config/__init__.py`
- Environment variables in `.env`

## Deployment

The system can be deployed as a standalone API server:

```
python server.py
```

Or integrated with other services through the `WorkflowService` class.

## V2 Roadmap

The system is being enhanced with additional agents and capabilities:

- Career Path Advisor Agent
- Networking Strategy Agent
- Continuous Learning Agent
- Personal Brand Agent
- Industry Insights Agent
- Entrepreneurship Agent
- Work-Life Balance Coach Agent

Additionally, existing agents are being enhanced with new capabilities and tools, and system-wide improvements like cross-agent memory and multi-agent collaboration are being implemented.

## Development Guidelines

1. **Testing**: Add comprehensive tests for all new components
2. **Tool Implementation**: Ensure tools have clear documentation and error handling
3. **Agent Prompts**: Optimize prompts for specific tasks and clear delegations
4. **State Management**: Be careful with state updates to maintain context
5. **Error Handling**: Implement robust error handling, especially for LLM responses

## Common Issues and Solutions

1. **JSON Parsing Errors**: LLM responses may not always be valid JSON. Use the `repair_json_output` utility to fix common issues.
2. **State Overflow**: Complex workflows can lead to large state objects. Consider pruning older messages or using summarization.
3. **Tool Failures**: External tools may fail. Implement proper error handling and fallback strategies.
4. **LLM Hallucinations**: LLMs may generate incorrect information. Implement validation where possible and provide clear instructions in prompts.

## Conclusion

The CareerHQ Agent System provides a comprehensive, modular framework for career assistance using a multi-agent approach. By distributing tasks across specialized agents, the system can provide detailed, focused assistance for all aspects of career development, from resume creation to salary negotiation. The LangGraph-based architecture ensures robust orchestration, while the modular design allows for future expansion.

The project is on track for final V1 delivery ahead of the originally planned timeframe, with planning for V2 enhancements already underway. The modular architecture and extensible design provide a solid foundation for future expansion, with potential new agents and enhanced tools in the pipeline.
