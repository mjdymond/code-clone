# backend/app/utils/job_analysis.py

from typing import Dict, List, Set
from ..models.job_data import JobPosting, JobSkill
import spacy
import re

class JobAnalyzer:
    """Utility class for analyzing job postings"""
    
    def __init__(self):
        # Load spaCy model for NLP tasks
        self.nlp = spacy.load("en_core_web_sm")
        
        # Common technical terms and their variations
        self.tech_terms = {
            "frontend": {"front-end", "front end", "frontend", "ui", "user interface"},
            "backend": {"back-end", "back end", "backend", "server-side"},
            "fullstack": {"full-stack", "full stack", "fullstack"},
            "mobile": {"mobile", "ios", "android", "react native", "swift"},
            "data": {"data science", "machine learning", "ai", "artificial intelligence"},
            "devops": {"devops", "ci/cd", "deployment", "infrastructure"}
        }
    
    def analyze_job_complexity(self, job: JobPosting) -> Dict:
        """Analyze the complexity level of a job posting"""
        
        # Analyze technical requirements
        tech_score = self._calculate_technical_complexity(job)
        
        # Analyze responsibility level
        resp_score = self._calculate_responsibility_level(job)
        
        # Analyze experience requirements
        exp_score = self._calculate_experience_requirements(job)
        
        return {
            "technical_complexity": tech_score,
            "responsibility_level": resp_score,
            "experience_required": exp_score,
            "overall_complexity": (tech_score + resp_score + exp_score) / 3
        }
    
    def extract_key_technologies(self, job: JobPosting) -> Dict[str, List[str]]:
        """Extract and categorize key technologies from the job posting"""
        
        technologies = {
            "languages": [],
            "frameworks": [],
            "tools": [],
            "platforms": [],
            "methodologies": []
        }
        
        # Process skills
        for skill in job.skills:
            category = self._categorize_technology(skill.name)
            if category in technologies:
                technologies[category].append({
                    "name": skill.name,
                    "confidence": skill.confidence,
                    "mentions": skill.mentions
                })
        
        return technologies
    
    def identify_job_focus(self, job: JobPosting) -> List[str]:
        """Identify the main focus areas of the job"""
        focus_areas = []
        description_lower = job.description.lower()
        
        # Check for each focus area
        for area, terms in self.tech_terms.items():
            matches = sum(1 for term in terms if term in description_lower)
            if matches >= 2:  # Require multiple matches to confirm focus
                focus_areas.append(area)
        
        return focus_areas
    
    def extract_learning_opportunities(self, job: JobPosting) -> List[Dict]:
        """Extract potential learning opportunities from the job posting"""
        opportunities = []
        
        # Look for mentions of learning, growth, and development
        doc = self.nlp(job.description)
        
        learning_keywords = {
            "training", "learn", "grow", "develop", "mentor",
            "opportunity", "education", "certification"
        }
        
        for sent in doc.sents:
            if any(keyword in sent.text.lower() for keyword in learning_keywords):
                opportunities.append({
                    "type": self._classify_opportunity(sent.text),
                    "description": sent.text.strip(),
                    "relevance": self._calculate_opportunity_relevance(sent.text)
                })
        
        return opportunities
    
    def _calculate_technical_complexity(self, job: JobPosting) -> float:
        """Calculate technical complexity score (0-1)"""
        score = 0.0
        
        # Factor in number of technical skills required
        tech_skills = [s for s in job.skills if s.category in 
                      {"programming_languages", "frameworks", "tools"}]
        score += min(len(tech_skills) / 10, 0.4)  # Cap at 0.4
        
        # Factor in seniority level
        seniority_scores = {
            "entry": 0.1,
            "mid": 0.2,
            "senior": 0.3,
            "executive": 0.3
        }
        score += seniority_scores.get(job.seniority_level, 0.15)
        
        # Factor in complexity of requirements
        complex_terms = {"architect", "design", "optimize", "scale", "system"}
        desc_lower = job.description.lower()
        score += min(sum(term in desc_lower for term in complex_terms) * 0.06, 0.3)
        
        return min(score, 1.0)
    
    def _calculate_responsibility_level(self, job: JobPosting) -> float:
        """Calculate responsibility level score (0-1)"""
        score = 0.0
        text_lower = job.description.lower()
        
        # Leadership indicators
        leadership_terms = {"lead", "manage", "oversee", "direct", "responsible for"}
        score += min(sum(term in text_lower for term in leadership_terms) * 0.1, 0.3)
        
        # Decision-making indicators
        decision_terms = {"decide", "strategy", "plan", "determine", "evaluate"}
        score += min(sum(term in text_lower for term in decision_terms) * 0.1, 0.3)
        
        # Team interaction indicators
        team_terms = {"team", "collaborate", "coordinate", "mentor", "guide"}
        score += min(sum(term in text_lower for term in team_terms) * 0.08, 0.4)
        
        return min(score, 1.0)
    
    def _calculate_experience_requirements(self, job: JobPosting) -> float:
        """Calculate experience requirements score (0-1)"""
        # Implementation of experience scoring logic
        score = 0.0
        text_lower = job.description.lower()
        
        # Look for years of experience requirements
        years_pattern = r'(\d+)\+?\s*(?:years?|yrs?)'
        matches = re.findall(years_pattern, text_lower)
        if matches:
            years = max(int(y) for y in matches)
            score += min(years * 0.1, 0.5)
        
        # Add score for expertise level required
        expertise_terms = {
            "expert": 0.3,
            "advanced": 0.25,
            "intermediate": 0.15,
            "basic": 0.1
        }
        
        for term, value in expertise_terms.items():
            if term in text_lower:
                score += value
                break
                
        return min(score, 1.0)