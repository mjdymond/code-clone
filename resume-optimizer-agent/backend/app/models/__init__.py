# backend/app/models/__init__.py
from .job_data import JobPosting, JobRequirement, JobSkill, JobMetadata, JobProcessingResult

__all__ = [
    'JobPosting',
    'JobRequirement',
    'JobSkill',
    'JobMetadata',
    'JobProcessingResult'
]