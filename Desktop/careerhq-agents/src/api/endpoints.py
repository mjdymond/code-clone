import logging
from typing import Dict, Any, Optional

from fastapi import APIRouter, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from sse_starlette.sse import EventSourceResponse

from src.service.workflow_service import WorkflowService

logger = logging.getLogger(__name__)
router = APIRouter()
workflow_service = WorkflowService()

@router.post("/process")
async def process_request(request: Request):
    """
    Process a request through the agent workflow.
    Returns a streaming response with events.
    """
    try:
        data = await request.json()
        
        # Extract request parameters
        text = data.get("text", "")
        config = data.get("config", {})
        
        if not text:
            return JSONResponse(
                status_code=400,
                content={"error": "No text provided in request"}
            )
        
        # Create event generator function
        async def event_generator():
            async for event in workflow_service.process_request(text, config):
                # Convert to SSE format
                yield {
                    "event": event["type"],
                    "id": event.get("id", ""),
                    "data": event
                }
        
        # Return streaming response
        return EventSourceResponse(event_generator())
    
    except Exception as e:
        logger.error(f"Error processing API request: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Internal server error: {str(e)}"}
        )

@router.post("/analyze-resume")
async def analyze_resume(request: Request, background_tasks: BackgroundTasks):
    """
    Specialized endpoint for resume analysis.
    """
    try:
        data = await request.json()
        
        # Extract request parameters
        resume_text = data.get("resume", "")
        job_description = data.get("job_description", "")
        
        if not resume_text:
            return JSONResponse(
                status_code=400,
                content={"error": "No resume text provided"}
            )
        
        # Construct appropriate request text
        request_text = f"Analyze this resume:\n\n{resume_text}"
        if job_description:
            request_text += f"\n\nFor this job description:\n\n{job_description}"
        
        # Create event generator function
        async def event_generator():
            async for event in workflow_service.process_request(
                request_text,
                {"deep_thinking_mode": True}
            ):
                yield {
                    "event": event["type"],
                    "id": event.get("id", ""),
                    "data": event
                }
        
        # Return streaming response
        return EventSourceResponse(event_generator())
    
    except Exception as e:
        logger.error(f"Error processing resume analysis: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Internal server error: {str(e)}"}
        )

@router.post("/search-jobs")
async def search_jobs(request: Request):
    """
    Specialized endpoint for job search.
    """
    try:
        data = await request.json()
        
        # Extract request parameters
        query = data.get("query", "")
        location = data.get("location", "")
        remote = data.get("remote", False)
        
        if not query:
            return JSONResponse(
                status_code=400,
                content={"error": "No query provided"}
            )
        
        # Construct appropriate request text
        request_text = f"Search for jobs matching: {query}"
        if location:
            request_text += f" in {location}"
        if remote:
            request_text += " with remote options"
        
        # Create event generator function
        async def event_generator():
            async for event in workflow_service.process_request(request_text):
                yield {
                    "event": event["type"],
                    "id": event.get("id", ""),
                    "data": event
                }
        
        # Return streaming response
        return EventSourceResponse(event_generator())
    
    except Exception as e:
        logger.error(f"Error processing job search: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Internal server error: {str(e)}"}
        )

@router.post("/generate-cover-letter")
async def generate_cover_letter(request: Request):
    """
    Specialized endpoint for cover letter generation.
    """
    try:
        data = await request.json()
        
        # Extract request parameters
        resume_text = data.get("resume", "")
        job_description = data.get("job_description", "")
        
        if not resume_text or not job_description:
            return JSONResponse(
                status_code=400,
                content={"error": "Both resume and job description are required"}
            )
        
        # Construct appropriate request text
        request_text = f"Generate a cover letter based on my resume and this job description. Resume:\n\n{resume_text}\n\nJob Description:\n\n{job_description}"
        
        # Create event generator function
        async def event_generator():
            async for event in workflow_service.process_request(request_text):
                yield {
                    "event": event["type"],
                    "id": event.get("id", ""),
                    "data": event
                }
        
        # Return streaming response
        return EventSourceResponse(event_generator())
    
    except Exception as e:
        logger.error(f"Error generating cover letter: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Internal server error: {str(e)}"}
        )
