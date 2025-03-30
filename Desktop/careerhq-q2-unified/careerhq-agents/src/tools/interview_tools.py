import logging
from typing import List, Dict, Any, Optional
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from .decorators import log_tool_use

logger = logging.getLogger(__name__)

@tool
@log_tool_use
def prepare_interview_questions(job_description: str, experience_level: Optional[str] = "mid") -> List[Dict[str, str]]:
    """
    Prepares relevant interview questions based on job description.
    
    Args:
        job_description: The job description text
        experience_level: Optional experience level (entry, mid, senior)
        
    Returns:
        List of likely interview questions with sample answers
    """
    logger.info(f"Preparing interview questions for job (length: {len(job_description)}) at {experience_level} level")
    
    # In a real implementation, this would generate job-specific questions using LLM
    # This is a simplified example with mock data
    
    # Basic questions for all levels
    basic_questions = [
        {
            "question": "Tell me about yourself and your background in this field.",
            "answer_tips": "Focus on relevant experience and skills that match the job description. Keep it concise and professional."
        },
        {
            "question": "Why are you interested in this position?",
            "answer_tips": "Mention specific aspects of the role and company that appeal to you. Show that you've researched the organization."
        },
        {
            "question": "What are your strengths and weaknesses?",
            "answer_tips": "Highlight strengths relevant to the job. For weaknesses, choose something non-critical and explain how you're working to improve."
        }
    ]
    
    # Technical questions based on job description
    # In a real implementation, these would be extracted from the job description
    technical_questions = [
        {
            "question": "Describe your experience with [key technology from job].",
            "answer_tips": "Provide specific examples of projects where you've used this technology. Quantify impact when possible."
        },
        {
            "question": "How do you approach [key responsibility from job]?",
            "answer_tips": "Outline your methodology and process. Highlight successful outcomes from past experiences."
        }
    ]
    
    # Experience level specific questions
    level_specific_questions = []
    if experience_level.lower() == "entry":
        level_specific_questions = [
            {
                "question": "What relevant coursework or projects have prepared you for this role?",
                "answer_tips": "Focus on academic projects, internships, or volunteer work that demonstrate relevant skills."
            },
            {
                "question": "How do you plan to contribute to our team despite having limited professional experience?",
                "answer_tips": "Emphasize transferable skills, quick learning ability, and fresh perspectives."
            }
        ]
    elif experience_level.lower() == "mid":
        level_specific_questions = [
            {
                "question": "Describe a challenging project you worked on and how you overcame obstacles.",
                "answer_tips": "Use the STAR method (Situation, Task, Action, Result) to structure your response."
            },
            {
                "question": "How have you grown professionally in your career so far?",
                "answer_tips": "Highlight increased responsibilities, new skills acquired, and lessons learned."
            }
        ]
    elif experience_level.lower() == "senior":
        level_specific_questions = [
            {
                "question": "How have you mentored or led teams in previous roles?",
                "answer_tips": "Provide examples of leadership, teaching moments, and team success stories."
            },
            {
                "question": "Describe how you've influenced strategic decisions in your previous roles.",
                "answer_tips": "Focus on situations where your expertise led to important business decisions."
            }
        ]
    
    # Combine all questions
    all_questions = basic_questions + technical_questions + level_specific_questions
    
    return all_questions

@tool
@log_tool_use
def analyze_interview_response(question: str, response: str) -> Dict[str, Any]:
    """
    Analyzes an interview response and provides feedback.
    
    Args:
        question: The interview question
        response: The candidate's response
        
    Returns:
        Analysis and feedback on the response
    """
    logger.info(f"Analyzing interview response for question: {question[:50]}...")
    
    # In a real implementation, this would use LLM to analyze responses
    # This is a simplified example
    
    # Mock analysis
    response_length = len(response)
    
    if response_length < 50:
        content_score = "Low"
        content_feedback = "Response is too brief. Consider providing more detail and specific examples."
    elif response_length < 200:
        content_score = "Medium"
        content_feedback = "Response has good length but could include more specific details and achievements."
    else:
        content_score = "High"
        content_feedback = "Response has good detail and specificity."
    
    # Check for STAR method elements (in a real implementation, this would be more sophisticated)
    has_star = (
        "situation" in response.lower() or 
        "context" in response.lower() or
        "task" in response.lower() or
        "action" in response.lower() or
        "result" in response.lower() or
        "outcome" in response.lower()
    )
    
    structure_feedback = "Response follows STAR method well." if has_star else "Consider structuring your answer using the STAR method (Situation, Task, Action, Result)."
    
    # Return analysis
    analysis = {
        "overall_score": 7 if content_score == "High" else (5 if content_score == "Medium" else 3),
        "content_score": content_score,
        "content_feedback": content_feedback,
        "structure_feedback": structure_feedback,
        "improvement_suggestions": [
            "Quantify achievements with specific metrics when possible",
            "Keep responses focused and relevant to the question",
            "Prepare 2-3 strong examples for common behavioral questions"
        ]
    }
    
    return analysis

@tool
@log_tool_use
def mock_interview_session(job_description: str, number_of_questions: int = 5) -> Dict[str, Any]:
    """
    Creates a complete mock interview session with multiple questions.
    
    Args:
        job_description: The job description text
        number_of_questions: Number of questions to include
        
    Returns:
        A structured mock interview session
    """
    logger.info(f"Creating mock interview session with {number_of_questions} questions")
    
    # In a real implementation, this would create tailored questions
    # This is a simplified example
    
    # Generate questions (limiting to requested number)
    questions = prepare_interview_questions(job_description)[:number_of_questions]
    
    # Create session structure
    session = {
        "job_title": "Position from Job Description",  # In real implementation, extract from job_description
        "session_duration": f"{number_of_questions * 5} minutes",
        "questions": questions,
        "preparation_tips": [
            "Research the company's recent news and projects",
            "Practice your responses out loud or with a friend",
            "Prepare concise examples demonstrating relevant skills",
            "Come prepared with thoughtful questions to ask the interviewer"
        ],
        "common_mistakes": [
            "Not providing specific examples",
            "Speaking too generally without concrete details",
            "Focusing too much on skills rather than accomplishments",
            "Not researching the company adequately"
        ]
    }
    
    return session
