# backend/app/scrapers.py

from typing import Dict, Optional
import aiohttp
import asyncio
from bs4 import BeautifulSoup
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class LinkedInJobScraper:
    """
    Scrapes job posting data from LinkedIn.
    Uses async/await for better performance.
    """
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    async def scrape_job_posting(self, job_id: str) -> Dict:
        """
        Scrapes a LinkedIn job posting and extracts relevant information.
        
        Args:
            job_id: LinkedIn job posting ID
            
        Returns:
            Dictionary containing job details
        """
        url = f"https://www.linkedin.com/jobs/view/{job_id}"
        
        try:
            async with aiohttp.ClientSession(headers=self.headers) as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        html = await response.text()
                        return self._parse_job_html(html)
                    else:
                        logger.error(f"Failed to fetch job posting: {response.status}")
                        return None
                        
        except Exception as e:
            logger.error(f"Error scraping job posting: {str(e)}")
            return None

    def _parse_job_html(self, html: str) -> Dict:
        """Parses LinkedIn job posting HTML and extracts relevant information."""
        soup = BeautifulSoup(html, 'html.parser')
        
        return {
            "title": self._extract_job_title(soup),
            "company": self._extract_company(soup),
            "location": self._extract_location(soup),
            "description": self._extract_description(soup),
            "requirements": self._extract_requirements(soup),
            "skills": self._extract_skills(soup),
            "metadata": {
                "scraped_at": datetime.now().isoformat(),
                "source": "linkedin"
            }
        }

    def _extract_job_title(self, soup: BeautifulSoup) -> Optional[str]:
        """Extracts job title from the posting."""
        title_elem = soup.find('h1', {'class': 'top-card-layout__title'})
        return title_elem.text.strip() if title_elem else None

    def _extract_company(self, soup: BeautifulSoup) -> Optional[str]:
        """Extracts company name from the posting."""
        company_elem = soup.find('a', {'class': 'topcard__org-name-link'})
        return company_elem.text.strip() if company_elem else None

    def _extract_location(self, soup: BeautifulSoup) -> Optional[str]:
        """Extracts job location from the posting."""
        location_elem = soup.find('span', {'class': 'topcard__flavor--bullet'})
        return location_elem.text.strip() if location_elem else None

    def _extract_description(self, soup: BeautifulSoup) -> Optional[str]:
        """Extracts job description from the posting."""
        desc_elem = soup.find('div', {'class': 'description__text'})
        return desc_elem.text.strip() if desc_elem else None

    def _extract_requirements(self, soup: BeautifulSoup) -> list:
        """Extracts job requirements from the description."""
        desc_text = self._extract_description(soup)
        if not desc_text:
            return []
            
        # Look for common requirement markers
        requirements = []
        lines = desc_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if line.startswith('•') or line.startswith('-') or \
               line.lower().startswith('required') or \
               line.lower().startswith('qualification'):
                requirements.append(line)
                
        return requirements

    def _extract_skills(self, soup: BeautifulSoup) -> list:
        """Extracts mentioned skills from the posting."""
        # This is a simplified version - we'll enhance this later
        skills = []
        desc_text = self._extract_description(soup)
        
        if desc_text:
            # Common technical skills to look for
            common_skills = [
                'python', 'java', 'javascript', 'react', 'node.js', 'sql',
                'aws', 'docker', 'kubernetes', 'machine learning', 'ai',
                'data analysis', 'project management', 'agile', 'scrum'
            ]
            
            desc_lower = desc_text.lower()
            for skill in common_skills:
                if skill in desc_lower:
                    skills.append(skill)
                    
        return list(set(skills))  # Remove duplicates