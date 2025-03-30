from langgraph.graph import StateGraph, START

from .types import CareerState
from .nodes import (
    supervisor_node,
    resume_node,
    job_search_node,
    application_node,
    interview_node,
    salary_node,
    reporter_node,
    coordinator_node,
    planner_node,
)


def build_graph():
    """Build and return the agent workflow graph."""
    builder = StateGraph(CareerState)
    
    # Add nodes
    builder.add_node("coordinator", coordinator_node)
    builder.add_node("planner", planner_node)
    builder.add_node("supervisor", supervisor_node)
    builder.add_node("resume_agent", resume_node)
    builder.add_node("job_search_agent", job_search_node)
    builder.add_node("application_agent", application_node)
    builder.add_node("interview_agent", interview_node)
    builder.add_node("salary_agent", salary_node)
    builder.add_node("reporter", reporter_node)
    
    # Entry point edge
    builder.add_edge(START, "coordinator")
    
    # Coordinator edges
    builder.add_edge("coordinator", "planner")
    builder.add_edge("coordinator", "__end__")
    
    # Planner edges
    builder.add_edge("planner", "supervisor")
    builder.add_edge("planner", "__end__")
    
    # Supervisor edges - routes to specialized agents or end
    builder.add_edge("supervisor", "resume_agent")
    builder.add_edge("supervisor", "job_search_agent")
    builder.add_edge("supervisor", "application_agent")
    builder.add_edge("supervisor", "interview_agent")
    builder.add_edge("supervisor", "salary_agent")
    builder.add_edge("supervisor", "reporter")
    builder.add_edge("supervisor", "__end__")
    
    # Specialized agent edges - all return to supervisor
    builder.add_edge("resume_agent", "supervisor")
    builder.add_edge("job_search_agent", "supervisor")
    builder.add_edge("application_agent", "supervisor")
    builder.add_edge("interview_agent", "supervisor")
    builder.add_edge("salary_agent", "supervisor")
    builder.add_edge("reporter", "supervisor")
    
    # Compile the graph
    return builder.compile()
