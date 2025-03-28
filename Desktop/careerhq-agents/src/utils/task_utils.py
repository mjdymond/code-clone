"""Utility functions for task management and progress tracking."""

import re
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

def register_task(state: Dict[str, Any], task_name: str, agent: str) -> None:
    """Register a new task in the task registry.
    
    Args:
        state: The current workflow state
        task_name: Name of the task to register
        agent: The agent assigned to this task
    """
    state["task_registry"] = state.get("task_registry", []) + [{
        "name": task_name,
        "status": "pending",
        "assigned_to": agent,
        "created_at": datetime.now().isoformat(),
        "completed_at": None
    }]
    
def update_task_status(state: Dict[str, Any], task_name: str, new_status: str) -> None:
    """Update the status of a task in the registry.
    
    Args:
        state: The current workflow state
        task_name: Name of the task to update
        new_status: New status to set ("pending", "in_progress", "completed", "blocked")
    """
    for task in state.get("task_registry", []):
        if task["name"] == task_name:
            task["status"] = new_status
            if new_status == "completed":
                task["completed_at"] = datetime.now().isoformat()
                if task_name not in state.get("completed_tasks", []):
                    state["completed_tasks"] = state.get("completed_tasks", []) + [task_name]
            break

def complete_task(state: Dict[str, Any], task_name: str) -> None:
    """Mark a task as completed in the registry.
    
    Args:
        state: The current workflow state
        task_name: Name of the task to mark as completed
    """
    update_task_status(state, task_name, "completed")

def extract_completion_info(response_content: str) -> Dict[str, Any]:
    """Extract completion information from agent response.
    
    Args:
        response_content: The content of the agent's response
        
    Returns:
        Dict containing completion percentage, contribution, and remaining work
    """
    # Default values
    result = {
        "completion_percentage": 50,
        "contribution": "Task contribution",
        "remaining_work": []
    }
    
    # Try to extract structured JSON if present
    json_pattern = r'```json\s*(.*?)\s*```'
    json_match = re.search(json_pattern, response_content, re.DOTALL)
    if json_match:
        try:
            json_data = json.loads(json_match.group(1))
            if isinstance(json_data, dict):
                if "completion_percentage" in json_data:
                    result["completion_percentage"] = json_data["completion_percentage"]
                if "contribution" in json_data:
                    result["contribution"] = json_data["contribution"]
                if "remaining_work" in json_data:
                    result["remaining_work"] = json_data["remaining_work"]
        except json.JSONDecodeError:
            pass
    
    # Fallback pattern matching if JSON not found or invalid
    completion_match = re.search(r"completion:?\s*(\d+)%", response_content, re.IGNORECASE)
    if completion_match:
        result["completion_percentage"] = int(completion_match.group(1))
    
    contribution_match = re.search(r"contribution:?\s*(.+?)(?=\n|$)", response_content, re.IGNORECASE)
    if contribution_match:
        result["contribution"] = contribution_match.group(1).strip()
    
    # Look for task completion indicators
    if "task complete" in response_content.lower() or "completed" in response_content.lower():
        result["completion_percentage"] = 100
    
    return result

def extract_planned_tasks(plan_content: str) -> List[Dict[str, str]]:
    """Extract planned tasks from the planner's response.
    
    Args:
        plan_content: The content of the planner's response
        
    Returns:
        List of dict objects with task name and assigned agent
    """
    tasks = []
    
    # Try to parse as JSON first
    try:
        data = json.loads(plan_content)
        if "tasks" in data and isinstance(data["tasks"], list):
            return data["tasks"]
    except (json.JSONDecodeError, ValueError, TypeError):
        pass
    
    # Fallback to regex pattern matching for task list
    task_pattern = r"(?:^|\n)(?:[\d#*+-]+[\s.)]*)?(.*?):\s*(.*?)(?:\n|$)"
    for match in re.finditer(task_pattern, plan_content):
        agent_name = match.group(1).strip().lower()
        task_desc = match.group(2).strip()
        
        # Map agent name to actual agent if possible
        agent = "unassigned"
        if "resume" in agent_name:
            agent = "resume_agent"
        elif "job" in agent_name or "search" in agent_name:
            agent = "job_search_agent"
        elif "application" in agent_name or "apply" in agent_name:
            agent = "application_agent"
        elif "interview" in agent_name:
            agent = "interview_agent"
        elif "salary" in agent_name or "compensation" in agent_name:
            agent = "salary_agent"
        
        tasks.append({
            "name": task_desc,
            "agent": agent
        })
    
    return tasks

def update_agent_progress(state: Dict[str, Any], agent_name: str, response_content: str) -> None:
    """Update the progress information for an agent based on their response.
    
    Args:
        state: The current workflow state
        agent_name: Name of the agent
        response_content: The agent's response content
    """
    # Extract completion information
    completion_info = extract_completion_info(response_content)
    
    # Get current agent progress or initialize
    agent_progress = state.get("agent_progress", {})
    current_agent_progress = agent_progress.get(agent_name, {
        "completion_status": 0,
        "contributions": [],
        "last_updated": datetime.now().isoformat()
    })
    
    # Update agent progress
    agent_progress[agent_name] = {
        "completion_status": completion_info["completion_percentage"],
        "contributions": current_agent_progress.get("contributions", []) + [completion_info["contribution"]],
        "last_updated": datetime.now().isoformat()
    }
    
    # Update state
    state["agent_progress"] = agent_progress
    
    # Add notes if available
    if "contribution" in completion_info and completion_info["contribution"]:
        existing_notes = state.get("task_notes", "")
        new_note = f"[{agent_name}] {completion_info['contribution']}"
        if existing_notes:
            state["task_notes"] = f"{existing_notes}\n{new_note}"
        else:
            state["task_notes"] = new_note
    
    # Calculate overall completion
    all_agents = list(agent_progress.keys())
    if all_agents:
        overall_completion = sum(agent_progress[agent].get("completion_status", 0) for agent in all_agents) / len(all_agents)
        state["overall_completion"] = int(overall_completion)
