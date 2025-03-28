#!/usr/bin/env python3
"""
Test script specifically for the Resume Agent.
This script will test the Resume Agent with real LLM calls.
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
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Add project root to path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Import the resume agent directly
from src.agents import resume_agent
from langchain_core.messages import HumanMessage

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

def test_resume_agent_direct():
    """Test the resume agent directly."""
    logger.info("Testing resume agent directly...")
    
    # Create input state
    input_state = {
        "messages": [
            HumanMessage(content=f"Analyze this resume for a senior full stack engineer position:\n\n{SAMPLE_RESUME}\n\nFor this job description:\n\n{SAMPLE_JOB}")
        ]
    }
    
    try:
        # Call the agent
        logger.info("Calling resume agent...")
        start_time = datetime.now()
        result = resume_agent.invoke(input_state)
        end_time = datetime.now()
        
        # Log execution time
        execution_time = (end_time - start_time).total_seconds()
        logger.info(f"Resume agent execution completed in {execution_time:.2f} seconds")
        
        # Process result
        if "messages" in result and len(result["messages"]) > 0:
            response = result["messages"][-1].content
            logger.info(f"Resume agent response received (length: {len(response)})")
            
            # Save the response to a file
            filename = f"resume_agent_response_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            with open(filename, "w") as f:
                f.write(response)
            logger.info(f"Response saved to {filename}")
            
            # Print a preview
            preview_length = min(300, len(response))
            logger.info(f"Response preview:\n{response[:preview_length]}...")
            
            return True
        else:
            logger.error("No response received from resume agent")
            return False
    
    except Exception as e:
        logger.error(f"Error during resume agent test: {str(e)}")
        return False

def test_resume_tools():
    """Test the individual resume tools."""
    logger.info("Testing resume tools...")
    
    try:
        # Import tools directly
        from src.tools.resume_tools import analyze_resume, optimize_resume, check_ats_compatibility
        
        # Test analyze_resume tool
        logger.info("Testing analyze_resume tool...")
        analyze_result = analyze_resume.func(SAMPLE_RESUME, SAMPLE_JOB)
        logger.info(f"analyze_resume result: {json.dumps(analyze_result, indent=2)}")
        
        # Test optimize_resume tool
        logger.info("Testing optimize_resume tool...")
        optimize_result = optimize_resume.func(SAMPLE_RESUME, SAMPLE_JOB)
        logger.info(f"optimize_resume result: {json.dumps(optimize_result, indent=2)}")
        
        # Test check_ats_compatibility tool
        logger.info("Testing check_ats_compatibility tool...")
        ats_result = check_ats_compatibility.func(SAMPLE_RESUME)
        logger.info(f"check_ats_compatibility result: {json.dumps(ats_result, indent=2)}")
        
        return True
    
    except Exception as e:
        logger.error(f"Error during resume tools test: {str(e)}")
        return False

async def test_resume_agent_workflow():
    """Test the resume agent through the workflow service."""
    logger.info("Testing resume agent through workflow service...")
    
    # Import the workflow service
    from src.service.workflow_service import WorkflowService
    service = WorkflowService()
    
    # Create request
    request = f"Analyze this resume for a senior full stack engineer position:\n\n{SAMPLE_RESUME}\n\nFor this job description:\n\n{SAMPLE_JOB}"
    
    try:
        # Process request
        logger.info("Sending request to workflow service...")
        events = []
        
        async for event in service.process_request(request, {"deep_thinking_mode": True}):
            logger.info(f"Received event: {event['type']} from {event['speaker']}")
            events.append(event)
            
            # Print content for debugging
            if event.get('content'):
                content_preview = event['content'][:100] + "..." if len(event['content']) > 100 else event['content']
                logger.info(f"Content preview: {content_preview}")
        
        # Save events to a file
        filename = f"resume_workflow_events_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, "w") as f:
            json.dump(events, f, indent=2, default=str)
        logger.info(f"Workflow events saved to {filename}")
        
        return True
    
    except Exception as e:
        logger.error(f"Error during workflow test: {str(e)}")
        return False

async def run_all_tests():
    """Run all resume agent tests."""
    logger.info("Starting resume agent tests")
    
    results = {
        "direct_agent_test": False,
        "tools_test": False,
        "workflow_test": False
    }
    
    # Test resume tools
    results["tools_test"] = test_resume_tools()
    
    # Test direct agent
    results["direct_agent_test"] = test_resume_agent_direct()
    
    # Test through workflow
    results["workflow_test"] = await test_resume_agent_workflow()
    
    # Print summary
    logger.info("\n" + "=" * 50)
    logger.info("Resume Agent Test Results:")
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        logger.info(f"{test_name}: {status}")
    
    all_passed = all(results.values())
    if all_passed:
        logger.info("\n🎉 All resume agent tests passed!")
    else:
        logger.error("\n❌ Some resume agent tests failed!")
    
    return all_passed

if __name__ == "__main__":
    logger.info("Starting CareerHQ Resume Agent test")
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)
