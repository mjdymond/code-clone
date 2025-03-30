from langgraph.prebuilt import create_react_agent

from src.prompts import apply_prompt_template
from src.tools.resume_tools import analyze_resume, optimize_resume, check_ats_compatibility
from src.tools.job_search_tools import search_jobs, match_jobs
from src.tools.application_tools import generate_cover_letter, track_application, suggest_follow_up
from src.tools.interview_tools import prepare_interview_questions, analyze_interview_response, mock_interview_session
from src.tools.salary_tools import estimate_salary, analyze_offer, negotiate_strategies, compare_benefits
from src.llms.llm import get_llm_by_type
from src.config.agents import AGENT_LLM_MAP

# Resume agent for analyzing and optimizing resumes
resume_agent = create_react_agent(
    get_llm_by_type(AGENT_LLM_MAP["resume_agent"]),
    tools=[analyze_resume, optimize_resume, check_ats_compatibility],
    prompt=lambda state: apply_prompt_template("resume_agent", state),
)

# Job search agent for finding job listings
job_search_agent = create_react_agent(
    get_llm_by_type(AGENT_LLM_MAP["job_search_agent"]),
    tools=[search_jobs, match_jobs],
    prompt=lambda state: apply_prompt_template("job_search_agent", state),
)

# Application agent for managing applications and generating cover letters
application_agent = create_react_agent(
    get_llm_by_type(AGENT_LLM_MAP["application_agent"]),
    tools=[generate_cover_letter, track_application, suggest_follow_up],
    prompt=lambda state: apply_prompt_template("application_agent", state),
)

# Interview agent for preparing interview questions and providing feedback
interview_agent = create_react_agent(
    get_llm_by_type(AGENT_LLM_MAP["interview_agent"]),
    tools=[prepare_interview_questions, analyze_interview_response, mock_interview_session],
    prompt=lambda state: apply_prompt_template("interview_agent", state),
)

# Salary agent for analyzing compensation and providing negotiation strategies
salary_agent = create_react_agent(
    get_llm_by_type(AGENT_LLM_MAP["salary_agent"]),
    tools=[estimate_salary, analyze_offer, negotiate_strategies, compare_benefits],
    prompt=lambda state: apply_prompt_template("salary_agent", state),
)

# Reporter agent doesn't use tools directly, just summarizes information
# It uses the output from other agents to create comprehensive reports
