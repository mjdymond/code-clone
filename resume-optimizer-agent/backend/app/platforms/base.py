# backend/app/platforms/base.py

from abc import ABC, abstractmethod
from typing import Dict, Optional, Tuple
from datetime import datetime
import re

from ..models.job_data import JobProcessingResult

class BasePlatform(ABC):
    """Base class for all job platform implementations"""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    @property
    @abstractmethod
    def platform_name(self) -> str:
        """Return the platform name (e.g., 'linkedin')"""
        pass
    
    @abstractmethod
    async def validate_url(self, url: str) -> Tuple[bool, Optional[str]]:
        """Validate if URL belongs to this platform and extract job ID"""
        pass
    
    @abstractmethod
    async def scrape_job_posting(self, job_id: str, url: str) -> JobProcessingResult:
        """Scrape job posting details"""
        pass
    
    @abstractmethod
    def clean_url(self, url: str) -> str:
        """Clean the URL by removing unnecessary parameters"""
        pass
