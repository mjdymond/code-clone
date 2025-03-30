# Configuration for agents and their LLM types

# Map agent types to LLM types
AGENT_LLM_MAP = {
    "coordinator": "basic",
    "planner": "reasoning",
    "supervisor": "basic",
    "resume_agent": "basic",
    "job_search_agent": "basic",
    "application_agent": "basic",
    "interview_agent": "basic",
    "salary_agent": "basic",
    "reporter": "basic",
}

# Agent chain types
AGENT_CHAIN_TYPES = {
    "coordinator": "llm",
    "planner": "llm",
    "supervisor": "react",
    "resume_agent": "react",
    "job_search_agent": "react",
    "application_agent": "react",
    "interview_agent": "react",
    "salary_agent": "react",
    "reporter": "llm",
}
