import logging
import json
from copy import deepcopy
from typing import Literal
from langchain_core.messages import HumanMessage, BaseMessage

from langgraph.types import Command

from src.agents import (
    resume_agent,
    job_search_agent,
    application_agent,
    interview_agent,
    salary_agent,
)
from src.llms.llm import get_llm_by_type
from src.config import TEAM_MEMBERS
from src.config.agents import AGENT_LLM_MAP
from src.prompts.template import apply_prompt_template
from src.utils.json_utils import repair_json_output
from .types import CareerState, Router

logger = logging.getLogger(__name__)

RESPONSE_FORMAT = "Response from {}:\n\n<response>\n{}\n</response>\n\n*Please execute the next step.*"

from src.utils.task_utils import update_agent_progress, complete_task

def resume_node(state: CareerState) -> Command[Literal["supervisor"]]:
    """Node for the resume agent that performs resume-related tasks."""
    logger.info("Resume agent starting task")
    
    # Check for completed tasks to avoid redundant work
    for task in state.get("task_registry", []):
        if task["assigned_to"] == "resume_agent" and task["status"] == "completed":
            logger.info(f"Skipping already completed task: {task['name']}")
    
    result = resume_agent.invoke(state)
    logger.info("Resume agent completed task")
    response_content = result["messages"][-1].content
    # Try to repair potential JSON output
    response_content = repair_json_output(response_content)
    logger.debug(f"Resume agent response: {response_content}")
    
    # Update agent progress in state
    update_agent_progress(state, "resume_agent", response_content)
    
    # Mark assigned tasks as completed
    for task in state.get("task_registry", []):
        if task["assigned_to"] == "resume_agent" and task["status"] == "in_progress":
            complete_task(state, task["name"])
            logger.info(f"Marked task as completed: {task['name']}")
    
    return Command(
        update={
            "messages": [
                HumanMessage(
                    content=response_content,
                    name="resume_agent",
                )
            ],
            "agent_progress": state.get("agent_progress", {}),
            "overall_completion": state.get("overall_completion", 0),
            "task_registry": state.get("task_registry", []),
            "completed_tasks": state.get("completed_tasks", []),
            "task_notes": state.get("task_notes", "")
        },
        goto="supervisor",
    )

def job_search_node(state: CareerState) -> Command[Literal["supervisor"]]:
    """Node for the job search agent that finds job listings."""
    logger.info("Job search agent starting task")
    result = job_search_agent.invoke(state)
    logger.info("Job search agent completed task")
    response_content = result["messages"][-1].content
    # Try to repair potential JSON output
    response_content = repair_json_output(response_content)
    logger.debug(f"Job search agent response: {response_content}")
    return Command(
        update={
            "messages": [
                HumanMessage(
                    content=response_content,
                    name="job_search_agent",
                )
            ]
        },
        goto="supervisor",
    )

def application_node(state: CareerState) -> Command[Literal["supervisor"]]:
    """Node for the application agent that manages job applications."""
    logger.info("Application agent starting task")
    result = application_agent.invoke(state)
    logger.info("Application agent completed task")
    response_content = result["messages"][-1].content
    # Try to repair potential JSON output
    response_content = repair_json_output(response_content)
    logger.debug(f"Application agent response: {response_content}")
    return Command(
        update={
            "messages": [
                HumanMessage(
                    content=response_content,
                    name="application_agent",
                )
            ]
        },
        goto="supervisor",
    )

def interview_node(state: CareerState) -> Command[Literal["supervisor"]]:
    """Node for the interview agent that prepares interview materials."""
    logger.info("Interview agent starting task")
    result = interview_agent.invoke(state)
    logger.info("Interview agent completed task")
    response_content = result["messages"][-1].content
    # Try to repair potential JSON output
    response_content = repair_json_output(response_content)
    logger.debug(f"Interview agent response: {response_content}")
    return Command(
        update={
            "messages": [
                HumanMessage(
                    content=response_content,
                    name="interview_agent",
                )
            ]
        },
        goto="supervisor",
    )

def salary_node(state: CareerState) -> Command[Literal["supervisor"]]:
    """Node for the salary agent that analyzes compensation."""
    logger.info("Salary agent starting task")
    result = salary_agent.invoke(state)
    logger.info("Salary agent completed task")
    response_content = result["messages"][-1].content
    # Try to repair potential JSON output
    response_content = repair_json_output(response_content)
    logger.debug(f"Salary agent response: {response_content}")
    return Command(
        update={
            "messages": [
                HumanMessage(
                    content=response_content,
                    name="salary_agent",
                )
            ]
        },
        goto="supervisor",
    )

from src.utils.task_utils import update_task_status

def supervisor_node(state: CareerState) -> Command[Literal[*TEAM_MEMBERS, "__end__"]]:
    """Supervisor node that decides which agent should act next."""
    logger.info("Supervisor evaluating next action")
    messages = apply_prompt_template("supervisor", state)
    # Preprocess messages to make supervisor execute better
    messages = deepcopy(messages)
    for message in messages:
        if isinstance(message, BaseMessage) and message.name in TEAM_MEMBERS:
            message.content = RESPONSE_FORMAT.format(message.name, message.content)
    response = (
        get_llm_by_type(AGENT_LLM_MAP["supervisor"])
        .with_structured_output(schema=Router, method="json_mode")
        .invoke(messages)
    )
    goto = response["next"]
    logger.debug(f"Current state messages: {len(state['messages'])} messages")
    logger.debug(f"Supervisor response: {response}")
    
    # Check for completion signals
    completion_signals = [
        goto == "FINISH",
        "task complete" in state.get("task_notes", "").lower(),
        state.get("overall_completion", 0) >= 95,
        state.get("recursion_count", 0) >= 5 and response.get("confidence", 1.0) < 0.7,
        response.get("estimated_steps_remaining", 5) <= 0
    ]

    # Check for completion condition
    if any(completion_signals):
        goto = "__end__"
        reason = "Workflow completed "
        if completion_signals[0]:
            reason += "(FINISH signal received)"
        elif completion_signals[1]:
            reason += "(task completion noted)"
        elif completion_signals[2]:
            reason += f"(overall completion at {state.get('overall_completion', 0)}%)"
        elif completion_signals[3]:
            reason += f"(recursion limit with low confidence: {response.get('confidence', 1.0):.2f})"
        elif completion_signals[4]:
            reason += "(no estimated steps remaining)"
        logger.info(reason)
    else:
        # Check for circular delegation pattern
        agent_history = [msg.name for msg in state.get("messages", []) 
                        if isinstance(msg, BaseMessage) and hasattr(msg, "name") and msg.name in TEAM_MEMBERS]
        recent_history = agent_history[-4:] if len(agent_history) >= 4 else []
        
        # Check if we have a pattern like A→B→A→B which indicates circular delegation
        circular_pattern = len(recent_history) >= 4 and recent_history[0] == recent_history[2] and recent_history[1] == recent_history[3]
        
        if circular_pattern and state.get("recursion_count", 0) >= 3:
            goto = "__end__"
            logger.info(f"Workflow completed (circular delegation pattern detected: {recent_history})")
        else:
            # Add recursion counter to state
            new_count = state.get("recursion_count", 0) + 1
            state["recursion_count"] = new_count
            
            # Update task status if a task is being assigned
            for task in state.get("task_registry", []):
                if task["assigned_to"] == goto and task["status"] == "pending":
                    update_task_status(state, task["name"], "in_progress")
            
            confidence = response.get("confidence", 1.0)
            steps_remaining = response.get("estimated_steps_remaining", "unknown")
            logger.info(f"Supervisor delegating to: {goto} (recursion {new_count}/5, confidence: {confidence:.2f}, steps remaining: {steps_remaining})")

    # Make sure to include all tracking fields in update
    return Command(goto=goto, update={
        "next": goto, 
        "recursion_count": state.get("recursion_count", 0),
        "task_registry": state.get("task_registry", []),
        "completed_tasks": state.get("completed_tasks", []),
        "task_notes": state.get("task_notes", "")
    })

from src.utils.task_utils import extract_planned_tasks, register_task

def planner_node(state: CareerState) -> Command[Literal["supervisor", "__end__"]]:
    """Planner node that generates the full plan."""
    logger.info("Planner generating full plan")
    messages = apply_prompt_template("planner", state)
    # Use reasoning mode if deep thinking is enabled
    llm = get_llm_by_type("basic")
    if state.get("deep_thinking_mode"):
        llm = get_llm_by_type("reasoning")
        
    # Get response from LLM
    response = llm.invoke(messages)
    full_response = response.content
    logger.debug(f"Current state messages: {len(state['messages'])} messages")
    logger.debug(f"Planner response: {full_response}")

    # Try to extract and repair JSON content
    if full_response.startswith("```json"):
        full_response = full_response.removeprefix("```json")

    if full_response.endswith("```"):
        full_response = full_response.removesuffix("```")

    goto = "supervisor"
    try:
        # Try to parse as JSON to ensure valid format
        json.loads(full_response)
        
        # Extract planned tasks and register them
        planned_tasks = extract_planned_tasks(full_response)
        logger.info(f"Extracted {len(planned_tasks)} tasks from planner response")
        
        # Register all tasks in the state
        for task in planned_tasks:
            register_task(state, task["name"], task.get("agent", "unassigned"))
            logger.debug(f"Registered task: {task['name']} assigned to {task.get('agent', 'unassigned')}")
        
    except json.JSONDecodeError:
        logger.warning("Planner response is not a valid JSON")
        goto = "__end__"

    # Initialize overall completion to 0%
    state["overall_completion"] = 0
    
    # Initialize task notes with plan summary
    state["task_notes"] = f"[planner] Generated plan with {len(state.get('task_registry', []))} tasks"

    return Command(
        update={
            "messages": [HumanMessage(content=full_response, name="planner")],
            "full_plan": full_response,
            "task_registry": state.get("task_registry", []),
            "overall_completion": state.get("overall_completion", 0),
            "task_notes": state.get("task_notes", "")
        },
        goto=goto,
    )

def coordinator_node(state: CareerState) -> Command[Literal["planner", "__end__"]]:
    """Coordinator node that communicates with users."""
    logger.info("Coordinator talking")
    messages = apply_prompt_template("coordinator", state)
    response = get_llm_by_type(AGENT_LLM_MAP["coordinator"]).invoke(messages)
    logger.debug(f"Current state messages: {len(state['messages'])} messages")
    response_content = response.content
    # Try to repair potential JSON output
    response_content = repair_json_output(response_content)
    logger.debug(f"Coordinator response: {response_content}")

    goto = "__end__"
    if "handoff_to_planner" in response_content:
        goto = "planner"

    # Update response.content with repaired content
    response.content = response_content
    
    # For the coordinator, we want to return the response to the user
    # so we add it to the messages list
    return Command(
        update={
            "messages": state.get("messages", []) + [response],
        },
        goto=goto,
    )

def reporter_node(state: CareerState) -> Command[Literal["supervisor"]]:
    """Reporter node that writes a final report."""
    logger.info("Reporter writing final report")
    messages = apply_prompt_template("reporter", state)
    response = get_llm_by_type(AGENT_LLM_MAP["reporter"]).invoke(messages)
    logger.debug(f"Current state messages: {len(state['messages'])} messages")
    response_content = response.content
    # Try to repair potential JSON output
    response_content = repair_json_output(response_content)
    logger.debug(f"Reporter response: {response_content}")

    # Update task notes to indicate task completion
    existing_notes = state.get("task_notes", "")
    completion_note = "[reporter] Task complete. Final report generated."
    if existing_notes:
        state["task_notes"] = f"{existing_notes}\n{completion_note}"
    else:
        state["task_notes"] = completion_note
    
    # Set overall completion to 100%
    state["overall_completion"] = 100
    
    # Force workflow to end after reporter
    state["next"] = "FINISH"
    
    return Command(
        update={
            "messages": [
                HumanMessage(
                    content=response_content,
                    name="reporter",
                )
            ],
            "next": "FINISH",  # This should signal the supervisor to end
            "overall_completion": 100,
            "task_notes": state.get("task_notes", "") 
        },
        goto="supervisor",
    )
