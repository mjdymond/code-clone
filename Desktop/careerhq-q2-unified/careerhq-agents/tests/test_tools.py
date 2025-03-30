import unittest
import sys
import os

# Add the project root directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.tools.resume_tools import analyze_resume, optimize_resume, check_ats_compatibility
from src.tools.job_search_tools import search_jobs, match_jobs
from src.tools.application_tools import generate_cover_letter, track_application, suggest_follow_up
from src.tools.interview_tools import prepare_interview_questions, analyze_interview_response, mock_interview_session
from src.tools.salary_tools import estimate_salary, analyze_offer, negotiate_strategies, compare_benefits

class TestResumeTools(unittest.TestCase):
    """Test cases for resume tools."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.sample_resume = """
        John Doe
        Software Engineer
        
        EXPERIENCE
        Senior Developer, ABC Tech (2018-Present)
        - Developed web applications using React and Node.js
        - Managed team of 3 junior developers
        
        Junior Developer, XYZ Inc (2015-2018)
        - Assisted in backend development using Python
        - Collaborated on database design
        
        EDUCATION
        BS Computer Science, State University (2015)
        
        SKILLS
        JavaScript, Python, React, Node.js, SQL
        """
        
        self.sample_job = """
        Senior Frontend Engineer
        
        Requirements:
        - 5+ years experience with React and modern JavaScript
        - Experience with TypeScript and state management libraries
        - Knowledge of CI/CD pipelines and testing frameworks
        - Bachelor's degree in Computer Science or related field
        """
    
    def test_analyze_resume(self):
        """Test resume analysis functionality."""
        # Call the function directly instead of as a tool
        result = analyze_resume.func(self.sample_resume, self.sample_job)
        
        # Verify result structure
        self.assertIn("strengths", result)
        self.assertIn("weaknesses", result)
        self.assertIn("match_score", result)
        self.assertIn("missing_keywords", result)
        self.assertIn("improvement_suggestions", result)
        
        # Verify types
        self.assertIsInstance(result["strengths"], list)
        self.assertIsInstance(result["match_score"], int)
        
        # Verify constraints
        self.assertTrue(0 <= result["match_score"] <= 100)
    
    def test_optimize_resume(self):
        """Test resume optimization functionality."""
        # Call the function directly instead of as a tool
        result = optimize_resume.func(self.sample_resume, self.sample_job)
        
        # Verify result structure
        self.assertIn("summary", result)
        self.assertIn("skills", result)
        self.assertIn("experience_bullets", result)
        
        # Verify types
        self.assertIsInstance(result["skills"], list)
        self.assertIsInstance(result["experience_bullets"], dict)
    
    def test_check_ats_compatibility(self):
        """Test ATS compatibility checking."""
        # Call the function directly instead of as a tool
        result = check_ats_compatibility.func(self.sample_resume)
        
        # Verify result structure
        self.assertIn("ats_compatibility_score", result)
        self.assertIn("issues", result)
        self.assertIn("recommended_fixes", result)
        
        # Verify types
        self.assertIsInstance(result["issues"], list)
        self.assertIsInstance(result["recommended_fixes"], list)

class TestJobSearchTools(unittest.TestCase):
    """Test cases for job search tools."""
    
    def test_search_jobs(self):
        """Test job search functionality."""
        # Call the function directly instead of as a tool
        result = search_jobs.func("Software Engineer", "San Francisco", True)
        
        # Verify result is a string containing job listings
        self.assertIsInstance(result, str)
        self.assertIn("Job Search Results", result)
        self.assertIn("Location", result)
    
    def test_match_jobs(self):
        """Test job matching functionality."""
        sample_resume = "Experienced software engineer with 5 years of React, Python development"
        job_listings = ["job1", "job2"]
        
        # Call the function directly instead of as a tool
        result = match_jobs.func(sample_resume, job_listings)
        
        # Verify result structure
        self.assertIn("matches", result)
        self.assertIn("best_match", result)
        
        # Verify types
        self.assertIsInstance(result["matches"], list)
        self.assertTrue(len(result["matches"]) > 0)

class TestSalaryTools(unittest.TestCase):
    """Test cases for salary tools."""
    
    def test_estimate_salary(self):
        """Test salary estimation functionality."""
        # Call the function directly instead of as a tool
        result = estimate_salary.func(
            job_title="Software Engineer",
            location="San Francisco", 
            experience_years=5,
            skills=["React", "Python", "Cloud"]
        )
        
        # Verify result structure
        self.assertIn("estimated_salary_range", result)
        self.assertIn("market_insights", result)
        
        # Verify salary range
        salary_range = result["estimated_salary_range"]
        self.assertIn("min", salary_range)
        self.assertIn("median", salary_range)
        self.assertIn("max", salary_range)
        
        # Verify constraints
        self.assertTrue(salary_range["min"] > 0)
        self.assertTrue(salary_range["min"] <= salary_range["median"] <= salary_range["max"])
    
    def test_analyze_offer(self):
        """Test offer analysis functionality."""
        # Call the function directly instead of as a tool
        result = analyze_offer.func(
            base_salary=120000,
            bonus_percentage=10,
            equity_value=20000,
            benefits_value=15000,
            job_title="Software Engineer",
            location="San Francisco",
            experience_years=5
        )
        
        # Verify result structure
        self.assertIn("compensation_breakdown", result)
        self.assertIn("structure_analysis", result)
        self.assertIn("negotiation_suggestions", result)
        
        # Verify compensation breakdown
        comp_breakdown = result["compensation_breakdown"]
        self.assertIn("total_compensation", comp_breakdown)
        
        # Verify constraints
        self.assertEqual(comp_breakdown["total_compensation"], 
                        comp_breakdown["base_salary"] + 
                        comp_breakdown["bonus"] + 
                        comp_breakdown["equity_value"] + 
                        comp_breakdown["benefits_value"])

class TestInterviewTools(unittest.TestCase):
    """Test cases for interview tools."""
    
    def test_prepare_interview_questions(self):
        """Test interview question preparation."""
        sample_job = "Senior Software Engineer position requiring 5+ years experience with Python and cloud technologies."
        
        # Call the function directly instead of as a tool
        result = prepare_interview_questions.func(sample_job, "senior")
        
        # Verify result structure
        self.assertIsInstance(result, list)
        self.assertTrue(len(result) > 0)
        
        # Verify question format
        first_question = result[0]
        self.assertIn("question", first_question)
        self.assertIn("answer_tips", first_question)
    
    def test_analyze_interview_response(self):
        """Test interview response analysis."""
        question = "Tell me about a challenging project you worked on."
        response = "I led the development of a high-traffic e-commerce platform that needed to handle seasonal traffic spikes. We implemented a scalable architecture using microservices and cloud infrastructure that successfully handled a 500% increase in traffic during holiday sales."
        
        # Call the function directly instead of as a tool
        result = analyze_interview_response.func(question, response)
        
        # Verify result structure
        self.assertIn("overall_score", result)
        self.assertIn("content_score", result)
        self.assertIn("content_feedback", result)
        self.assertIn("improvement_suggestions", result)
        
        # Verify constraints
        self.assertTrue(0 <= result["overall_score"] <= 10)
        self.assertIsInstance(result["improvement_suggestions"], list)
    
    def test_mock_interview_session(self):
        """Test mock interview session creation."""
        sample_job = "Data Scientist position requiring expertise in machine learning, Python, and data visualization."
        
        # Call the function directly instead of as a tool
        result = mock_interview_session.func(sample_job, 3)
        
        # Verify result structure
        self.assertIn("job_title", result)
        self.assertIn("questions", result)
        self.assertIn("preparation_tips", result)
        
        # Verify number of questions
        self.assertEqual(len(result["questions"]), 3)

class TestApplicationTools(unittest.TestCase):
    """Test cases for application tools."""
    
    def test_generate_cover_letter(self):
        """Test cover letter generation."""
        sample_resume = "Experienced software developer with 7 years in full-stack development."
        sample_job = "Senior Developer position at innovative tech company."
        
        # Call the function directly instead of as a tool
        result = generate_cover_letter.func(sample_resume, sample_job)
        
        # Verify result is a non-empty string
        self.assertIsInstance(result, str)
        self.assertTrue(len(result) > 0)
        
        # Verify structure (simple check)
        self.assertIn("Dear", result)
        self.assertIn("Sincerely", result)
    
    def test_track_application(self):
        """Test application tracking."""
        # Valid application ID
        # Call the function directly instead of as a tool
        result = track_application.func("app123")
        
        # Verify result structure
        self.assertIn("job_title", result)
        self.assertIn("company", result)
        self.assertIn("current_status", result)
        
        # Invalid application ID
        result = track_application.func("invalid_id")
        
        # Verify error handling
        self.assertIn("error", result)
        self.assertIn("valid_ids", result)
    
    def test_suggest_follow_up(self):
        """Test follow-up suggestion."""
        # Call the function directly instead of as a tool
        result = suggest_follow_up.func("app123", 7)
        
        # Verify result structure
        self.assertIn("appropriate_action", result)
        self.assertIn("urgency", result)
        self.assertIn("template_email", result)
        self.assertIn("additional_suggestions", result)

if __name__ == "__main__":
    unittest.main()
