from typing import Literal, TypedDict, Optional, Dict, Any, List
from langgraph.graph import MessagesState
from src.config import TEAM_MEMBERS
from datetime import datetime

# Define routing options
OPTIONS = TEAM_MEMBERS + ["FINISH"]

class Router(TypedDict):
    """Worker to route to next. If no workers needed, route to FINISH."""
    next: Literal[*OPTIONS]
    confidence: float = 1.0  # How confident the supervisor is about this decision (0-1)
    reasoning: str = ""     # Brief explanation of why this agent was chosen
    estimated_steps_remaining: int = 0  # Estimate of remaining workflow steps

class AgentProgress(TypedDict):
    """Structure to track the progress of individual agents."""
    completion_status: int       # 0-100 percentage
    contributions: List[str]     # List of contribution descriptions
    last_updated: str            # Timestamp

class TaskStatus(TypedDict):
    """Structure to track individual tasks."""
    name: str
    status: Literal["pending", "in_progress", "completed", "blocked"]
    assigned_to: str
    created_at: str
    completed_at: Optional[str]

class CareerState(MessagesState):
    """State for the career agent system, extends MessagesState with additional fields."""
    next: str
    full_plan: str
    deep_thinking_mode: bool
    search_before_planning: bool
    user_profile: Optional[Dict[str, Any]]
    document_context: Optional[Dict[str, Any]]
    recursion_count: int = 0     # Track recursions
    agent_progress: Dict[str, AgentProgress] = {}  # Track progress per agent
    overall_completion: int = 0  # Overall task completion percentage
    task_registry: List[TaskStatus] = []  # Registry of all subtasks
    completed_tasks: List[str] = []  # Names of completed tasks
    task_notes: str = ""  # Accumulated notes about the task
