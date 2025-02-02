# backend/app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import logging
from urllib.parse import urlparse
from .platforms import platform_registry
from .utils.job_analysis import JobAnalyzer


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class JobShare(BaseModel):
    url: str

class JobPlatformError(Exception):
    """Raised when there's an error processing a job platform"""
    pass

app = FastAPI(
    title="Resume Optimizer Agent",
    description="API for receiving and processing shared job postings",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database later)
shared_jobs = []

def detect_platform(url: str) -> str:
    """Detect job platform from URL"""
    domain = urlparse(url).netloc.replace('www.', '')
    
    # Map domains to platform names
    domain_mapping = {
        'linkedin.com': 'linkedin',
        'indeed.com': 'indeed',
        'glassdoor.com': 'glassdoor'
    }
    
    return domain_mapping.get(domain, 'unknown')

@app.post("/api/share")
async def receive_shared_job(job: JobShare):
    """
    Receive and process a shared job posting from any supported platform
    """
    try:
        logger.info(f"Received job share request: {job.url}")
        
        # Detect platform
        platform_name = detect_platform(job.url)
        platform = platform_registry.get_platform(platform_name)
        
        if not platform:
            return {
                "status": "error",
                "message": f"Unsupported job platform: {platform_name}",
                "supported_platforms": list(platform_registry.get_all_platforms().keys())
            }
        
        # Validate URL and get job ID
        is_valid, job_id = await platform.validate_url(job.url)
        if not is_valid:
            return {
                "status": "error",
                "message": "Invalid job posting URL",
                "platform": platform_name
            }
        
        # Clean the URL
        cleaned_url = platform.clean_url(job.url)
        
        # Scrape job details
        job_details = await platform.scrape_job_posting(job_id, cleaned_url)
        
        # Store the job
        job_data = {
            "platform": platform_name,
            "job_id": job_id,
            "original_url": job.url,
            "cleaned_url": cleaned_url,
            "details": job_details,
            "timestamp": datetime.now().isoformat()
        }
        shared_jobs.append(job_data)
        
        return {
            "status": "success",
            "message": f"Job posting received and processed successfully from {platform_name}",
            "data": {
                "job": job_data,
                "job_count": len(shared_jobs)
            }
        }
        
    except Exception as e:
        logger.error(f"Error processing shared job: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing shared job: {str(e)}"
        )

@app.get("/api/job/{job_id}/analysis")
async def get_job_analysis(job_id: str):
    # Get job from storage
    job = get_job(job_id)  # Implement this
    
    # Create analyzer
    analyzer = JobAnalyzer()
    
    # Perform analysis
    analysis = {
        "complexity": analyzer.analyze_job_complexity(job),
        "technologies": analyzer.extract_key_technologies(job),
        "focus_areas": analyzer.identify_job_focus(job),
        "learning_opportunities": analyzer.extract_learning_opportunities(job)
    }
    
    return analysis

@app.get("/api/platforms")
async def get_supported_platforms():
    """Get list of supported job platforms"""
    platforms = platform_registry.get_all_platforms()
    return {
        "status": "success",
        "message": "Retrieved supported platforms successfully",
        "data": {
            "platforms": list(platforms.keys())
        }
    }
