# backend/app/platforms/linkedin.py
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import asyncio
from functools import partial
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from typing import Dict, List, Optional, Tuple
import re
import logging
import json
import random
from urllib.parse import urlencode
import time
from datetime import datetime
from .base import BasePlatform
from ..models.job_data import (
    JobPosting,
    JobRequirement,
    JobSkill,
    JobMetadata,
    JobProcessingResult
)


# Set up logging
logging.basicConfig(level=logging.DEBUG)  # Changed to DEBUG for more info
logger = logging.getLogger(__name__)

class LinkedInJobAnalyzer:
    """Analyzes LinkedIn job postings to extract structured data"""
    
    # Common patterns for identifying requirements
    REQUIREMENT_PATTERNS = [
        r"requirements?:",
        r"qualifications?:",
        r"what you'll need:",
        r"what you need:",
        r"what we're looking for:",
        r"skills needed:",
        r"minimum qualifications:",
    ]
    
    # Technical skill categories and their common terms
    TECH_SKILLS = {
        "programming_languages": ["python", "java", "javascript", "c++", "ruby", "golang"],
        "frameworks": ["react", "angular", "vue", "django", "flask", "spring"],
        "databases": ["sql", "mongodb", "postgresql", "mysql", "redis"],
        "cloud": ["aws", "azure", "gcp", "kubernetes", "docker"],
        "tools": ["git", "jenkins", "jira", "docker", "kubernetes"]
    }
    
    # Experience level indicators
    SENIORITY_PATTERNS = {
        "entry": ["entry level", "junior", "0-2 years", "graduate"],
        "mid": ["mid level", "intermediate", "3-5 years"],
        "senior": ["senior", "lead", "5+ years", "principal"],
        "executive": ["executive", "director", "head of", "vp", "chief"]
    }

    def extract_requirements(self, text: str) -> List[JobRequirement]:
        """Extract structured requirements from job description"""
        requirements = []
        sections = self._split_into_sections(text)
        
        for section, content in sections.items():
            items = self._extract_bullet_points(content)
            for item in items:
                req_type = self._classify_requirement(item)
                is_required = self._is_required_requirement(item)
                requirements.append(JobRequirement(
                    text=item,
                    type=req_type,
                    required=is_required,
                    context=section
                ))
        return requirements

    def extract_skills(self, text: str) -> List[JobSkill]:
        """Extract and categorize skills from job description"""
        skills = []
        text_lower = text.lower()
        
        for category, terms in self.TECH_SKILLS.items():
            for term in terms:
                mentions = len(re.findall(r'\b' + term + r'\b', text_lower))
                if mentions > 0:
                    contexts = self._find_skill_contexts(text_lower, term)
                    confidence = self._calculate_skill_confidence(mentions, contexts)
                    skills.append(JobSkill(
                        name=term,
                        category=category,
                        confidence=confidence,
                        mentions=mentions,
                        context=contexts
                    ))
        return skills

    def detect_seniority(self, text: str) -> str:
        """Detect the seniority level of the position"""
        text_lower = text.lower()
        scores = {level: 0 for level in self.SENIORITY_PATTERNS.keys()}
        
        for level, patterns in self.SENIORITY_PATTERNS.items():
            for pattern in patterns:
                if pattern in text_lower:
                    scores[level] += 1
        
        return max(scores.items(), key=lambda x: x[1])[0]

    def extract_metadata(self, soup: BeautifulSoup) -> JobMetadata:
        """Extract job metadata from the posting"""
        return JobMetadata(
            employment_type=self._extract_employment_type(soup),
            experience_level=self._extract_experience_level(soup),
            industry=self._extract_industry(soup),
            company_size=self._extract_company_size(soup),
            remote_policy=self._extract_remote_policy(soup)
        )

    # Helper methods (internal)
    def _split_into_sections(self, text: str) -> Dict[str, str]:
        sections = {}
        current_section = "general"
        for line in text.split('\n'):
            if self._is_section_header(line):
                current_section = line.strip().lower()
                sections[current_section] = ""
            elif current_section in sections:
                sections[current_section] += line + "\n"
            else:
                sections["general"] = sections.get("general", "") + line + "\n"
        return sections

    def _extract_bullet_points(self, text: str) -> List[str]:
        items = []
        for line in text.split('\n'):
            line = line.strip()
            if line.startswith(('•', '-', '∙', '○', '●', '*')):
                items.append(line[1:].strip())
            elif line:
                sentences = re.split(r'[.!?]+', line)
                items.extend([s.strip() for s in sentences if s.strip()])
        return items

    def _classify_requirement(self, text: str) -> str:
        text_lower = text.lower()
        if any(tech in text_lower for techs in self.TECH_SKILLS.values() for tech in techs):
            return "technical"
        elif any(edu in text_lower for edu in ["degree", "education", "certification"]):
            return "education"
        elif any(exp in text_lower for exp in ["experience", "years", "background"]):
            return "experience"
        else:
            return "soft_skill"

    def _find_skill_contexts(self, text: str, skill: str) -> List[str]:
        contexts = []
        for match in re.finditer(r'\b' + skill + r'\b', text):
            start = max(0, match.start() - 50)
            end = min(len(text), match.end() + 50)
            contexts.append(text[start:end].strip())
        return contexts

    def _calculate_skill_confidence(self, mentions: int, contexts: List[str]) -> float:
        base_score = min(mentions * 0.2, 0.6)
        context_bonus = min(len(contexts) * 0.1, 0.4)
        return min(base_score + context_bonus, 1.0)

    def _is_section_header(self, line: str) -> bool:
        line = line.strip().lower()
        return (line.endswith(':') and
                len(line) < 50 and
                any(word in line for word in ["requirements", "qualifications", "about", "responsibilities"]))

    def _is_required_requirement(self, text: str) -> bool:
        text_lower = text.lower()
        required_terms = ["must", "required", "essential", "need to have"]
        preferred_terms = ["nice to have", "preferred", "plus", "bonus"]
        
        if any(term in text_lower for term in required_terms):
            return True
        if any(term in text_lower for term in preferred_terms):
            return False
        return True

class RateLimiter:
    """Rate limiter for API requests"""
    
    def __init__(self, requests_per_minute: int = 30):
        self.requests_per_minute = requests_per_minute
        self.requests = []
        self.lock = asyncio.Lock()
    
    async def acquire(self):
        async with self.lock:
            now = time.time()
            self.requests = [req_time for req_time in self.requests 
                           if now - req_time < 60]
            
            if len(self.requests) >= self.requests_per_minute:
                sleep_time = 60 - (now - self.requests[0])
                if sleep_time > 0:
                    await asyncio.sleep(sleep_time)
            
            self.requests.append(now)

class RetryHandler:
    """Handles retrying failed requests"""
    
    def __init__(self, max_retries: int = 3, delay: float = 1.0):
        self.max_retries = max_retries
        self.delay = delay
    
    async def retry_async(self, func, *args, **kwargs):
        last_exception = None
        for attempt in range(self.max_retries):
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                if attempt < self.max_retries - 1:
                    delay = self.delay * (2 ** attempt)
                    logger.warning(f"Retry attempt {attempt + 1} after {delay} seconds")
                    await asyncio.sleep(delay)
        raise last_exception

class LinkedInPlatform(BasePlatform):
    """LinkedIn job platform implementation with robust scraping"""
    
    def __init__(self):
        super().__init__()
        self.analyzer = LinkedInJobAnalyzer()
        self.rate_limiter = RateLimiter(requests_per_minute=5)  # Reduced rate
        self.retry_handler = RetryHandler()
        
        # More browser-like headers
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'DNT': '1'
        }

    @property
    def platform_name(self) -> str:
        return 'linkedin'

    async def validate_url(self, url: str) -> Tuple[bool, Optional[str]]:
        pattern = r'linkedin\.com/jobs/view/(\d+)'
        match = re.search(pattern, url)
        if match:
            return True, match.group(1)
        return False, None

    def clean_url(self, url: str) -> str:
        pattern = r'(linkedin\.com/jobs/view/\d+)'
        match = re.search(pattern, url)
        if match:
            return f"https://www.{match.group(1)}"
        return url

    async def scrape_job_posting(self, job_id: str, url: str) -> JobProcessingResult:
        try:
            await self.rate_limiter.acquire()
            start_time = time.time()
            
            # Add some randomization to look more human
            await asyncio.sleep(random.uniform(1, 3))
            
            # Construct URL with parameters
            params = {
                'trk': 'public_jobs_topcard',
                'originalSubdomain': 'www',
                'refId': f'testing_{random.randint(1000, 9999)}'
            }
            
            full_url = f"{url}?{urlencode(params)}"
            logger.debug(f"Attempting to fetch: {full_url}")
            
            # Custom session with cookie handling
            async with aiohttp.ClientSession(headers=self.headers) as session:
                async with session.get(full_url) as response:
                    if response.status != 200:
                        logger.error(f"Failed to fetch job posting: {response.status}")
                        return JobProcessingResult(
                            success=False,
                            error=f"Failed to fetch job posting: HTTP {response.status}",
                            processing_time=time.time() - start_time,
                            warnings=[]
                        )
                    
                    html = await response.text()
                    logger.debug("Successfully fetched HTML content")
            
            # Try multiple parsing methods
            job_data = None
            
            # First try structured data
            structured_data = self._extract_structured_data(html)
            if structured_data:
                job_data = self._parse_structured_data(structured_data, job_id, url)
            
            # Fall back to HTML parsing if structured data fails
            if not job_data:
                job_data = self._parse_html(html, job_id, url)
            
            if not job_data:
                return JobProcessingResult(
                    success=False,
                    error="Could not extract job data",
                    processing_time=time.time() - start_time,
                    warnings=[]
                )
            
            return JobProcessingResult(
                success=True,
                job_data=job_data,
                processing_time=time.time() - start_time,
                warnings=[]
            )
            
        except Exception as e:
            logger.error(f"Error processing job {job_id}: {str(e)}")
            return JobProcessingResult(
                success=False,
                error=str(e),
                processing_time=time.time() - start_time,
                warnings=[]
            )

    def _parse_html(self, html: str, job_id: str, url: str) -> Optional[JobPosting]:
        """Parse job data from HTML when structured data is not available"""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            
            # Extract basic information using multiple possible selectors
            title = (
                self._safe_extract(soup, 'h1', {'class': 'top-card-layout__title'}) or
                self._safe_extract(soup, 'h1', {'class': 'jobs-unified-top-card__job-title'})
            )
            
            company = (
                self._safe_extract(soup, 'a', {'class': 'topcard__org-name-link'}) or
                self._safe_extract(soup, 'span', {'class': 'jobs-unified-top-card__company-name'})
            )
            
            location = (
                self._safe_extract(soup, 'span', {'class': 'topcard__flavor--bullet'}) or
                self._safe_extract(soup, 'span', {'class': 'jobs-unified-top-card__bullet'})
            )
            
            description = (
                self._safe_extract(soup, 'div', {'class': 'description__text'}) or
                self._safe_extract(soup, 'div', {'class': 'jobs-description__content'})
            )
            
            if not description:
                return None
            
            # Process the description
            requirements = self.analyzer.extract_requirements(description)
            skills = self.analyzer.extract_skills(description)
            seniority = self.analyzer.detect_seniority(description)
            
            return JobPosting(
                job_id=job_id,
                platform=self.platform_name,
                url=url,
                title=title,
                company=company,
                location=location,
                description=description,
                requirements=requirements,
                skills=skills,
                metadata=JobMetadata(),
                seniority_level=seniority,
                tech_stack=[skill.name for skill in skills if skill.category == "programming_languages"],
                domain_areas=self._extract_domain_areas(description),
                scraped_at=datetime.now(),
                processed_at=datetime.now()
            )
            
        except Exception as e:
            logger.error(f"Error parsing HTML: {str(e)}")
            return None

    def _safe_extract(self, soup: BeautifulSoup, tag: str, attrs: Dict) -> Optional[str]:
        """Safely extract text from HTML elements"""
        try:
            element = soup.find(tag, attrs)
            return element.get_text(strip=True) if element else None
        except Exception:
            return None
        
    def _extract_structured_data(self, html: str) -> Optional[Dict]:
        """Extract structured data from LinkedIn's JSON-LD"""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            script_tags = soup.find_all('script', {'type': 'application/ld+json'})
            
            for script in script_tags:
                try:
                    data = json.loads(script.string)
                    # Verify this is job posting data
                    if isinstance(data, dict) and data.get('@type') == 'JobPosting':
                        return data
                except json.JSONDecodeError:
                    continue
            
            return None
        except Exception as e:
            logger.error(f"Error extracting structured data: {str(e)}")
            return None

    def _parse_structured_data(self, data: Dict, job_id: str, url: str) -> Optional[JobPosting]:
        """Parse LinkedIn's structured data into our JobPosting model"""
        try:
            # Extract basic information
            title = data.get('title', '')
            company = data.get('hiringOrganization', {}).get('name', '')
            location = data.get('jobLocation', {}).get('address', {}).get('addressLocality', '')
            description = data.get('description', '')
            
            # Process the description to extract requirements and skills
            requirements = self.analyzer.extract_requirements(description)
            skills = self.analyzer.extract_skills(description)
            
            # Extract employment type and other metadata
            employment_type = data.get('employmentType', '')
            
            # Create metadata
            metadata = JobMetadata(
                employment_type=employment_type,
                experience_level=self._extract_experience_level(description),
                industry=data.get('industry', ''),
                company_size=None,
                remote_policy=self._extract_remote_policy(description)
            )
            
            return JobPosting(
                job_id=job_id,
                platform=self.platform_name,
                url=url,
                title=title,
                company=company,
                location=location,
                description=description,
                requirements=requirements,
                skills=skills,
                metadata=metadata,
                seniority_level=self.analyzer.detect_seniority(description),
                tech_stack=[skill.name for skill in skills if skill.category == "programming_languages"],
                domain_areas=self._extract_domain_areas(description),
                scraped_at=datetime.now(),
                processed_at=datetime.now()
            )
        
        except Exception as e:
            logger.error(f"Error parsing structured data: {str(e)}")
            return None

    def _extract_experience_level(self, description: str) -> Optional[str]:
        """Extract experience level from description"""
        text_lower = description.lower()
        if 'senior' in text_lower or 'sr.' in text_lower:
            return 'senior'
        elif 'junior' in text_lower or 'jr.' in text_lower:
            return 'junior'
        elif 'mid' in text_lower or 'intermediate' in text_lower:
            return 'mid-level'
        return None

    def _extract_remote_policy(self, description: str) -> Optional[str]:
        """Extract remote work policy from description"""
        text_lower = description.lower()
        if 'remote' in text_lower:
            if 'fully remote' in text_lower:
                return 'fully remote'
            elif 'hybrid' in text_lower:
                return 'hybrid'
            return 'remote'
        elif 'on-site' in text_lower or 'onsite' in text_lower:
            return 'on-site'
        return None

# Initialize global instance
linkedin_platform = LinkedInPlatform()