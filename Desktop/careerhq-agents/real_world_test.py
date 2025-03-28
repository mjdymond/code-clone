#!/usr/bin/env python3
"""
Real-world test script for the CareerHQ Agent System.
This script performs an actual test with LLM calls and database connections.
"""
import os
import sys
import asyncio
import json
import logging
from datetime import datetime
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(f"real_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
logger.info("Environment variables loaded")

# Import the workflow service
from src.service.workflow_service import WorkflowService

# Sample resume for testing
SAMPLE_RESUME = """
John Doe
Software Engineer

EXPERIENCE
Senior Developer, ABC Tech (2020-Present)
- Led development of a customer-facing portal using React and Node.js
- Implemented CI/CD pipelines reducing deployment time by 40%
- Managed a team of 3 junior developers

Software Engineer, XYZ Corp (2018-2020)
- Developed RESTful APIs using Python and Flask
- Implemented data processing pipelines with Pandas and NumPy
- Collaborated with UX team to improve application usability

EDUCATION
BS Computer Science, State University (2018)

SKILLS
Python, JavaScript, React, Node.js, SQL, AWS, Docker, Git
"""

# Sample job description for testing
SAMPLE_JOB = """
Senior Full Stack Engineer

We're looking for a Senior Full Stack Engineer to join our growing team. The ideal candidate will have:

Requirements:
- 3+ years of experience with modern JavaScript frameworks (React, Vue, or Angular)
- Strong knowledge of backend technologies (Node.js, Python, or Java)
- Experience with cloud platforms (AWS, GCP, or Azure)
- Experience with CI/CD pipelines and automated testing
- Bachelor's degree in Computer Science or related field

Responsibilities:
- Design and implement new features for our web application
- Work closely with product and design teams
- Mentor junior developers
- Contribute to architectural decisions
"""

async def test_resume_analysis():
    """Test resume analysis with real LLM calls."""
    logger.info("Starting resume analysis test")
    
    service = WorkflowService()
    request = f"Analyze this resume for a senior full stack engineer position:\n\n{SAMPLE_RESUME}\n\nFor this job description:\n\n{SAMPLE_JOB}"
    
    logger.info("Sending request to workflow service")
    results = []
    
    try:
        async for event in service.process_request(request, {"deep_thinking_mode": True}):
            logger.info(f"Received event: {event['type']} from {event['speaker']}")
            results.append(event)
            
            # Print content for debugging
            if event.get('content'):
                content_preview = event['content'][:100] + "..." if len(event['content']) > 100 else event['content']
                logger.info(f"Content preview: {content_preview}")
    
    except Exception as e:
        logger.error(f"Error during resume analysis: {str(e)}")
        raise
    
    # Save results to a file
    with open(f"resume_analysis_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    logger.info(f"Resume analysis test completed. Generated {len(results)} events.")
    return results

async def test_job_search():
    """Test job search with real LLM calls."""
    logger.info("Starting job search test")
    
    service = WorkflowService()
    request = "Find software engineering jobs in San Francisco with React and Python requirements"
    
    logger.info("Sending request to workflow service")
    results = []
    
    try:
        async for event in service.process_request(request):
            logger.info(f"Received event: {event['type']} from {event['speaker']}")
            results.append(event)
            
            # Print content for debugging
            if event.get('content'):
                content_preview = event['content'][:100] + "..." if len(event['content']) > 100 else event['content']
                logger.info(f"Content preview: {content_preview}")
    
    except Exception as e:
        logger.error(f"Error during job search: {str(e)}")
        raise
    
    # Save results to a file
    with open(f"job_search_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    logger.info(f"Job search test completed. Generated {len(results)} events.")
    return results

async def test_cover_letter_generation():
    """Test cover letter generation with real LLM calls."""
    logger.info("Starting cover letter generation test")
    
    service = WorkflowService()
    request = f"Generate a cover letter based on my resume and this job description.\n\nResume:\n{SAMPLE_RESUME}\n\nJob Description:\n{SAMPLE_JOB}"
    
    logger.info("Sending request to workflow service")
    results = []
    
    try:
        async for event in service.process_request(request):
            logger.info(f"Received event: {event['type']} from {event['speaker']}")
            results.append(event)
            
            # Print content for debugging
            if event.get('content'):
                content_preview = event['content'][:100] + "..." if len(event['content']) > 100 else event['content']
                logger.info(f"Content preview: {content_preview}")
    
    except Exception as e:
        logger.error(f"Error during cover letter generation: {str(e)}")
        raise
    
    # Save results to a file
    with open(f"cover_letter_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", "w") as f:
        json.dump(results, f, indent=2, default=str)
    
    logger.info(f"Cover letter generation test completed. Generated {len(results)} events.")
    return results

async def run_all_tests():
    """Run all real-world tests."""
    logger.info("Starting real-world tests")
    
    # Verify OpenAI API key is set
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY not found in environment variables")
        return
    
    logger.info("API key verification passed")
    
    # Run tests
    try:
        logger.info("Running resume analysis test")
        await test_resume_analysis()
        
        logger.info("Running job search test")
        await test_job_search()
        
        logger.info("Running cover letter generation test")
        await test_cover_letter_generation()
        
        logger.info("All tests completed successfully!")
    
    except Exception as e:
        logger.error(f"Test suite failed: {str(e)}")
        raise

if __name__ == "__main__":
    logger.info("Starting CareerHQ Agent System real-world test")
    asyncio.run(run_all_tests())
