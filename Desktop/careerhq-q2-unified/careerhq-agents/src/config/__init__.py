from .env import (
    # OpenAI Configuration
    OPENAI_API_KEY,
    # Basic LLM
    BASIC_MODEL,
    # Reasoning LLM
    REASONING_MODEL,
    # Vector DB
    VECTOR_DB_DIR,
)
from .tools import (
    SEARCH_MAX_RESULTS,
)

# Team configuration
TEAM_MEMBER_CONFIGURATIONS = {
    "resume_agent": {
        "name": "resume_agent",
        "desc": "Analyzes and optimizes resumes to match job requirements",
        "is_optional": False,
    },
    "job_search_agent": {
        "name": "job_search_agent",
        "desc": "Searches for job listings based on user criteria",
        "is_optional": False,
    },
    "application_agent": {
        "name": "application_agent",
        "desc": "Manages job applications and generates cover letters",
        "is_optional": True,
    },
    "interview_agent": {
        "name": "interview_agent",
        "desc": "Prepares interview questions and provides feedback",
        "is_optional": True,
    },
    "salary_agent": {
        "name": "salary_agent",
        "desc": "Analyzes compensation and provides negotiation strategies",
        "is_optional": True,
    },
    "reporter": {
        "name": "reporter",
        "desc": "Summarizes findings and creates final reports",
        "is_optional": False,
    },
}

TEAM_MEMBERS = list(TEAM_MEMBER_CONFIGURATIONS.keys())

__all__ = [
    # Models
    "BASIC_MODEL",
    "REASONING_MODEL",
    "OPENAI_API_KEY",
    # Team configuration
    "TEAM_MEMBERS",
    "TEAM_MEMBER_CONFIGURATIONS",
    # Tool configuration
    "SEARCH_MAX_RESULTS",
    "VECTOR_DB_DIR",
]
