# backend/app/models/job_data.py

from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class JobRequirement(BaseModel):
    """Individual job requirement with context"""
    text: str
    type: str  # "technical", "soft_skill", "experience", "education", etc.
    required: bool  # True if required, False if preferred
    context: Optional[str] = None

class JobSkill(BaseModel):
    """Individual skill with metadata"""
    name: str
    category: str  # "technical", "soft", "domain", etc.
    confidence: float  # How confident we are this is a required skill
    mentions: int  # How many times it's mentioned
    context: List[str]  # List of contexts where it appears

class JobMetadata(BaseModel):
    """Job posting metadata"""
    employment_type: Optional[str] = None
    experience_level: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    remote_policy: Optional[str] = None

class JobPosting(BaseModel):
    """Complete job posting data"""
    # Basic Information
    job_id: str
    platform: str
    url: str
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    
    # Detailed Content
    description: Optional[str] = None
    requirements: List[JobRequirement] = []
    skills: List[JobSkill] = []
    metadata: Optional[JobMetadata] = None
    
    # Analysis Results
    seniority_level: Optional[str] = None
    tech_stack: List[str] = []
    domain_areas: List[str] = []
    
    # Processing Metadata
    scraped_at: datetime
    processed_at: datetime
    processing_version: str = "1.0"

class JobProcessingResult(BaseModel):
    """Result of job processing operation"""
    success: bool
    job_data: Optional[JobPosting] = None  # Made optional with default None
    error: Optional[str] = None
    processing_time: float  # in seconds
    warnings: List[str] = []  # Added default empty list

    class Config:
        arbitrary_types_allowed = True