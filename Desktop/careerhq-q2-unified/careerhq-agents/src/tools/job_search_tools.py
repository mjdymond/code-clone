import logging
from typing import List, Dict, Any, Optional
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from .decorators import log_tool_use

logger = logging.getLogger(__name__)

class JobSearchInput(BaseModel):
    """Input model for job search tool."""
    query: str = Field(..., description="Job search query")
    location: Optional[str] = Field(None, description="Optional location")
    remote: Optional[bool] = Field(False, description="Whether to search for remote jobs")
    experience_level: Optional[str] = Field(None, description="Experience level")

@tool
@log_tool_use
def search_jobs(query: str, location: str = None, remote: bool = False, 
               experience_level: str = None) -> str:
    """
    Searches for jobs matching the criteria.
    
    Args:
        query: Job search query (e.g., "software engineer")
        location: Optional location specification
        remote: Whether to search for remote jobs
        experience_level: Experience level (e.g., "entry", "mid", "senior")
        
    Returns:
        Formatted job listings in markdown format
    """
    logger.info(f"Searching jobs with query: {query}, location: {location}, remote: {remote}, experience: {experience_level}")
    
    # In a real implementation, this would query job APIs or web search
    # This is a simplified example with mock data
    
    # Construct search query
    search_query = query
    if location:
        search_query += f" in {location}"
    if remote:
        search_query += " remote"
    if experience_level:
        search_query += f" {experience_level} level"
    
    logger.info(f"Constructed search query: {search_query}")
    
    # Mock job results
    mock_results = [
        {
            "title": "Senior Software Engineer",
            "company": "TechCorp",
            "location": "San Francisco, CA" if location == "San Francisco" else ("Remote" if remote else "New York, NY"),
            "url": "https://example.com/job1",
            "description": "Looking for a senior engineer with 5+ years experience in React and Node.js.",
            "salary": "$140,000 - $180,000"
        },
        {
            "title": "Frontend Developer",
            "company": "WebSolutions",
            "location": "Remote" if remote else (location if location else "Boston, MA"),
            "url": "https://example.com/job2",
            "description": "Seeking frontend developer for e-commerce platform development.",
            "salary": "$110,000 - $140,000"
        },
        {
            "title": "Full Stack Engineer",
            "company": "GrowthStartup",
            "location": "Remote" if remote else (location if location else "Austin, TX"),
            "url": "https://example.com/job3",
            "description": "Join our fast-growing team building innovative products using modern technologies.",
            "salary": "$120,000 - $160,000"
        }
    ]
    
    # Filter by experience level if provided
    if experience_level:
        if experience_level.lower() == "senior":
            mock_results = [job for job in mock_results if "Senior" in job["title"] or "Lead" in job["title"]]
        elif experience_level.lower() == "mid":
            mock_results = [job for job in mock_results if "Senior" not in job["title"] and "Junior" not in job["title"]]
        elif experience_level.lower() == "entry":
            mock_results = [job for job in mock_results if "Junior" in job["title"] or "Associate" in job["title"]]
    
    # Format results as markdown
    formatted_results = f"# Job Search Results for '{search_query}'\n\n"
    
    if not mock_results:
        formatted_results += "No jobs found matching your criteria. Try broadening your search."
    else:
        for i, job in enumerate(mock_results, 1):
            formatted_results += f"## {i}. {job['title']} at {job['company']}\n"
            formatted_results += f"**Location**: {job['location']}\n"
            if job.get("salary"):
                formatted_results += f"**Salary Range**: {job['salary']}\n"
            formatted_results += f"**URL**: {job['url']}\n\n"
            formatted_results += f"**Description**:\n{job['description']}\n\n"
            formatted_results += "---\n\n"
    
    return formatted_results

@tool
@log_tool_use
def match_jobs(resume_text: str, job_ids: List[str]) -> Dict[str, Any]:
    """
    Compares resume against specific job listings and provides match scores.
    
    Args:
        resume_text: The text of the resume
        job_ids: List of job IDs to match against
        
    Returns:
        Match scores and recommendations
    """
    logger.info(f"Matching resume (length: {len(resume_text)}) against {len(job_ids)} jobs")
    
    # In a real implementation, this would retrieve job details and perform analysis
    # This is a simplified example with mock data
    
    mock_job_details = {
        "job1": {
            "title": "Senior Software Engineer",
            "company": "TechCorp",
            "requirements": ["React", "Node.js", "AWS", "5+ years experience"]
        },
        "job2": {
            "title": "Frontend Developer",
            "company": "WebSolutions",
            "requirements": ["HTML/CSS", "JavaScript", "React", "3+ years experience"]
        },
        "job3": {
            "title": "Full Stack Engineer",
            "company": "GrowthStartup",
            "requirements": ["JavaScript", "Python", "SQL", "4+ years experience"]
        }
    }
    
    matches = []
    for job_id in job_ids:
        if job_id in mock_job_details:
            job = mock_job_details[job_id]
            
            # Generate a mock match score
            match_score = 85 if "Senior" in job["title"] else (75 if "Full Stack" in job["title"] else 65)
            
            # Generate mock matching/missing skills
            matching_skills = ["JavaScript", "React"] if "React" in job.get("requirements", []) else ["JavaScript"]
            missing_skills = ["AWS"] if "AWS" in job.get("requirements", []) else ["Python"]
            
            matches.append({
                "job_id": job_id,
                "job_title": job["title"],
                "company": job["company"],
                "match_score": match_score,
                "matching_skills": matching_skills,
                "missing_skills": missing_skills,
                "recommendations": [
                    "Highlight your React experience more prominently",
                    "Add more quantifiable achievements"
                ]
            })
        else:
            matches.append({
                "job_id": job_id,
                "error": f"Job ID {job_id} not found"
            })
    
    result = {
        "matches": matches,
        "best_match": max(matches, key=lambda x: x.get("match_score", 0)) if matches else None,
        "average_match_score": sum(match.get("match_score", 0) for match in matches) / len(matches) if matches else 0
    }
    
    return result
