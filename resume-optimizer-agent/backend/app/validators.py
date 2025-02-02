# backend/app/validators.py

from urllib.parse import urlparse, parse_qs
import re
from typing import Optional, Tuple, Dict

class JobURLValidator:
    """
    A class to handle validation and information extraction from job posting URLs.
    This centralizes our URL processing logic and makes it easy to add support for new job sites.
    """
    
    # Define patterns for different job sites
    URL_PATTERNS = {
        'linkedin.com': {
            'pattern': r'linkedin\.com/jobs/view/(\d+)',
            'example': 'https://www.linkedin.com/jobs/view/123456789'
        },
        'indeed.com': {
            'pattern': r'indeed\.com/.*?jk=([a-zA-Z0-9]+)',
            'example': 'https://www.indeed.com/viewjob?jk=abc123def456'
        },
        'glassdoor.com': {
            'pattern': r'glassdoor\.com/job-listing/.*?/(\d+)',
            'example': 'https://www.glassdoor.com/job-listing/software-engineer-company-12345'
        }
    }

    def __init__(self):
        # Compile regex patterns for better performance
        self.compiled_patterns = {
            domain: re.compile(info['pattern'])
            for domain, info in self.URL_PATTERNS.items()
        }

    def validate_and_extract(self, url: str) -> Tuple[bool, Optional[Dict]]:
        """
        Validates a job posting URL and extracts relevant information.
        
        Args:
            url: The URL to validate and process
            
        Returns:
            Tuple containing:
            - Boolean indicating if URL is valid
            - Dictionary with extracted information (None if invalid)
        """
        try:
            # Parse the URL to get its components
            parsed_url = urlparse(url)
            
            # Clean the domain (remove www. if present)
            domain = parsed_url.netloc.replace('www.', '')
            
            # Check if this is a supported job site
            for supported_domain, pattern in self.compiled_patterns.items():
                if supported_domain in domain:
                    # Try to extract job ID using the corresponding pattern
                    match = pattern.search(url)
                    if match:
                        job_id = match.group(1)
                        return True, {
                            'platform': self._get_platform_name(domain),
                            'job_id': job_id,
                            'original_url': url,
                            'cleaned_url': self._clean_url(url, domain)
                        }
            
            # If we get here, the URL didn't match any supported pattern
            return False, {
                'error': 'Invalid job posting URL format',
                'valid_examples': self._get_examples()
            }
            
        except Exception as e:
            return False, {
                'error': f'URL validation error: {str(e)}',
                'valid_examples': self._get_examples()
            }

    def _get_platform_name(self, domain: str) -> str:
        """Converts domain to platform name."""
        platform_mapping = {
            'linkedin.com': 'linkedin',
            'indeed.com': 'indeed',
            'glassdoor.com': 'glassdoor'
        }
        return platform_mapping.get(domain, 'unknown')

    def _clean_url(self, url: str, domain: str) -> str:
        """
        Cleans the URL by removing unnecessary parameters and standardizing format.
        Different for each platform due to their URL structures.
        """
        if 'linkedin.com' in domain:
            # LinkedIn URLs are already clean
            return url
        elif 'indeed.com' in domain:
            # Indeed URLs - keep only the job key
            parsed = urlparse(url)
            params = parse_qs(parsed.query)
            if 'jk' in params:
                return f"https://www.indeed.com/viewjob?jk={params['jk'][0]}"
        elif 'glassdoor.com' in domain:
            # Glassdoor URLs - keep only the job listing path
            match = self.compiled_patterns['glassdoor.com'].search(url)
            if match:
                return f"https://www.glassdoor.com/job-listing/{match.group(1)}"
        
        return url

    def _get_examples(self) -> Dict[str, str]:
        """Returns example URLs for each supported platform."""
        return {
            platform: info['example']
            for platform, info in self.URL_PATTERNS.items()
        }