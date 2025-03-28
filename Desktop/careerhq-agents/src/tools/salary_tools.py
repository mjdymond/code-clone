import logging
from typing import Dict, List, Any, Optional
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from .decorators import log_tool_use

logger = logging.getLogger(__name__)

@tool
@log_tool_use
def estimate_salary(
    job_title: str,
    location: str,
    experience_years: int,
    skills: Optional[List[str]] = None,
    industry: Optional[str] = None
) -> Dict[str, Any]:
    """
    Estimates salary for the given position based on market data.
    
    Args:
        job_title: Job title or role
        location: Geographic location
        experience_years: Years of experience
        skills: Optional list of key skills
        industry: Optional industry sector
        
    Returns:
        Salary estimation and market data
    """
    logger.info(f"Estimating salary for {job_title} in {location} with {experience_years} years experience")
    
    # In a real implementation, this would query salary APIs or databases
    # This is a simplified example with mock data
    
    # Basic salary ranges based on experience level
    # These would be more sophisticated in a real implementation
    base_ranges = {
        "Software Engineer": {"min": 80000, "max": 160000},
        "Data Scientist": {"min": 90000, "max": 170000},
        "Product Manager": {"min": 85000, "max": 180000},
        "Designer": {"min": 70000, "max": 140000},
        "Marketing Manager": {"min": 65000, "max": 130000},
        "Financial Analyst": {"min": 60000, "max": 120000},
        "HR Specialist": {"min": 55000, "max": 110000},
    }
    
    # Location multipliers
    location_multipliers = {
        "San Francisco": 1.5,
        "New York": 1.4,
        "Seattle": 1.3,
        "Boston": 1.2,
        "Austin": 1.1,
        "Chicago": 1.0,
        "Remote": 0.9
    }
    
    # Experience multipliers
    if experience_years < 2:
        experience_multiplier = 0.7  # Entry level
    elif experience_years < 5:
        experience_multiplier = 0.9  # Mid level
    elif experience_years < 10:
        experience_multiplier = 1.2  # Senior level
    else:
        experience_multiplier = 1.5  # Principal/Lead level
    
    # Find closest matching job title
    closest_title = job_title
    for title in base_ranges.keys():
        if title.lower() in job_title.lower():
            closest_title = title
            break
    
    # Find closest matching location
    closest_location = "Chicago"  # Default to middle-range city
    for loc in location_multipliers.keys():
        if loc.lower() in location.lower():
            closest_location = loc
            break
    
    # Calculate salary range
    base_range = base_ranges.get(closest_title, {"min": 60000, "max": 120000})
    location_multiplier = location_multipliers.get(closest_location, 1.0)
    
    min_salary = int(base_range["min"] * location_multiplier * experience_multiplier)
    max_salary = int(base_range["max"] * location_multiplier * experience_multiplier)
    median_salary = int((min_salary + max_salary) / 2)
    
    # Additional skill premium
    skill_premium = 0
    if skills:
        high_value_skills = ["machine learning", "ai", "cloud", "react", "leadership", "architecture"]
        matching_high_value = [skill for skill in skills if any(hvs in skill.lower() for hvs in high_value_skills)]
        skill_premium = len(matching_high_value) * 5000
    
    # Result
    result = {
        "job_title": job_title,
        "matched_title": closest_title,
        "location": location,
        "matched_location": closest_location,
        "experience_years": experience_years,
        "estimated_salary_range": {
            "min": min_salary,
            "median": median_salary,
            "max": max_salary,
            "skill_premium": skill_premium,
            "total_max": max_salary + skill_premium
        },
        "market_insights": [
            f"The job market for {closest_title} in {closest_location} is currently competitive",
            f"Professionals with {experience_years}+ years of experience are in demand",
            f"Salary ranges can vary significantly based on company size and funding stage"
        ],
        "data_sources": [
            "Note: This is mock data for demonstration purposes"
        ]
    }
    
    return result

@tool
@log_tool_use
def analyze_offer(
    base_salary: int, 
    bonus_percentage: Optional[float] = 0,
    equity_value: Optional[int] = 0,
    benefits_value: Optional[int] = 0,
    job_title: Optional[str] = None,
    location: Optional[str] = None,
    experience_years: Optional[int] = None
) -> Dict[str, Any]:
    """
    Analyzes a job offer package to determine its competitiveness and value.
    
    Args:
        base_salary: Annual base salary
        bonus_percentage: Annual bonus as percentage of base salary
        equity_value: Estimated annual value of equity grants
        benefits_value: Estimated annual value of benefits
        job_title: Optional job title for comparison
        location: Optional location for comparison
        experience_years: Optional years of experience for comparison
        
    Returns:
        Comprehensive analysis of the offer package
    """
    logger.info(f"Analyzing offer with base salary {base_salary}")
    
    # Calculate total compensation
    bonus_amount = int(base_salary * (bonus_percentage / 100)) if bonus_percentage else 0
    total_comp = base_salary + bonus_amount + equity_value + benefits_value
    
    # Compare to market if job details provided
    market_comparison = {}
    if job_title and location and experience_years is not None:
        # Call the estimate_salary function directly via .func instead of calling the tool
        market_data = estimate_salary.func(
            job_title=job_title, 
            location=location, 
            experience_years=experience_years
        )
        market_median = market_data["estimated_salary_range"]["median"]
        
        variance = ((total_comp - market_median) / market_median) * 100
        variance_text = f"{variance:.1f}% {'above' if variance >= 0 else 'below'} median"
        
        market_comparison = {
            "market_median": market_median,
            "variance_percentage": variance,
            "variance_text": variance_text,
            "competitiveness": "Highly Competitive" if variance > 10 else
                              ("Competitive" if variance >= -5 else
                               "Below Market")
        }
    
    # Analyze compensation structure
    structure_analysis = {
        "base_salary_percentage": (base_salary / total_comp) * 100 if total_comp > 0 else 0,
        "bonus_percentage": (bonus_amount / total_comp) * 100 if total_comp > 0 else 0,
        "equity_percentage": (equity_value / total_comp) * 100 if total_comp > 0 else 0,
        "benefits_percentage": (benefits_value / total_comp) * 100 if total_comp > 0 else 0
    }
    
    # Overall analysis
    result = {
        "compensation_breakdown": {
            "base_salary": base_salary,
            "bonus": bonus_amount,
            "equity_value": equity_value,
            "benefits_value": benefits_value,
            "total_compensation": total_comp
        },
        "structure_analysis": structure_analysis,
        "market_comparison": market_comparison,
        "negotiation_suggestions": [
            "Consider negotiating for a higher base salary if the offer is below market median",
            "Equity can be more valuable in early-stage companies with growth potential",
            "Don't overlook the value of benefits such as healthcare, retirement matching, and PTO"
        ]
    }
    
    return result

@tool
@log_tool_use
def negotiate_strategies(
    current_offer: Dict[str, Any],
    market_data: Optional[Dict[str, Any]] = None,
    priorities: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Provides tailored negotiation strategies based on current offer and market data.
    
    Args:
        current_offer: Current offer details
        market_data: Optional market salary data for comparison
        priorities: Optional list of candidate's priorities (e.g., ["base_salary", "remote_work"])
        
    Returns:
        Negotiation strategies and scripts
    """
    logger.info("Generating negotiation strategies")
    
    # Default priorities if none specified
    if not priorities:
        priorities = ["base_salary", "total_compensation", "work_life_balance"]
    
    # Extract current offer details
    base_salary = current_offer.get("base_salary", 0)
    
    # Generate strategies based on priorities
    strategies = []
    talking_points = []
    
    for priority in priorities:
        if priority == "base_salary" or priority == "total_compensation":
            strategies.append({
                "focus": "Increase Base Salary",
                "approach": "Highlight market value and unique skills",
                "script": "Based on my research and experience, similar roles in this market are compensated in the range of $X-Y. Given my expertise in [specific skills], I believe a base salary of $Z would be more aligned with the value I'll bring to the role."
            })
            talking_points.append("Specific achievements that demonstrate your value")
        
        elif priority == "equity" or priority == "stock_options":
            strategies.append({
                "focus": "Improve Equity Compensation",
                "approach": "Show long-term commitment and interest in company success",
                "script": "I'm excited about the company's growth potential and would like to discuss the equity component of the offer. Given my commitment to contributing to long-term success, could we explore increasing the equity grant to better align our interests?"
            })
            talking_points.append("Questions about vesting schedule and valuation")
        
        elif priority == "work_life_balance" or priority == "remote_work" or priority == "flexibility":
            strategies.append({
                "focus": "Enhance Work Flexibility",
                "approach": "Emphasize productivity and results orientation",
                "script": "I've found that I'm most productive with a flexible work arrangement. Would it be possible to include [specific flexibility request] as part of the offer? I'm confident this would enhance my contributions while maintaining full accountability for results."
            })
            talking_points.append("Examples of past remote/flexible work success")
    
    # General negotiation framework
    negotiation_framework = {
        "preparation": [
            "Research industry and company compensation ranges",
            "Determine your walk-away point before negotiating",
            "Practice your talking points and anticipate counteroffers"
        ],
        "conversation_structure": [
            "Express enthusiasm for the role and company",
            "Thank them for the offer before discussing terms",
            "Present your counteroffer with specific justification",
            "Focus on mutual benefit rather than demands"
        ],
        "common_mistakes": [
            "Negotiating before receiving a formal offer",
            "Focusing only on salary and ignoring total compensation",
            "Providing an ultimatum or appearing inflexible",
            "Apologizing for negotiating or seeming uncertain"
        ]
    }
    
    # Email template
    email_template = """
Subject: Regarding the [Position] Offer

Dear [Hiring Manager's Name],

Thank you for offering me the [Position] role at [Company]. I'm excited about the opportunity to join your team and contribute to [specific company goals or projects].

I've been reflecting on the offer details and would like to discuss a few aspects of the compensation package. Based on my research on similar roles in the industry and the value I can bring with my experience in [key skills/experiences], I was hoping we could consider [specific request, e.g., "a base salary of $X"].

[Optional: One brief paragraph on why you're worth this, with specific accomplishments]

I'm confident that I can make significant contributions to [Company] and am enthusiastic about the role. I appreciate your consideration and am open to discussing this further at your convenience.

Thank you again for the opportunity.

Best regards,
[Your Name]
"""
    
    # Result
    result = {
        "priorities_analyzed": priorities,
        "targeted_strategies": strategies,
        "key_talking_points": talking_points,
        "negotiation_framework": negotiation_framework,
        "email_template": email_template,
        "additional_considerations": [
            "Negotiating multiple elements simultaneously can increase success rates",
            "Having a competing offer significantly strengthens your position",
            "Preparing fallback positions increases flexibility during negotiations"
        ]
    }
    
    return result

@tool
@log_tool_use
def compare_benefits(
    packages: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Compares multiple benefit packages to help evaluate total compensation.
    
    Args:
        packages: List of benefit package dictionaries
        
    Returns:
        Comparative analysis of benefit packages
    """
    logger.info(f"Comparing {len(packages)} benefit packages")
    
    # In a real implementation, this would perform more sophisticated analysis
    # This is a simplified example
    
    # Define benefit categories and their relative importance
    benefit_categories = {
        "health_insurance": 10,
        "retirement": 8,
        "pto": 7,
        "parental_leave": 6,
        "wellness": 5,
        "education": 5,
        "remote_work": 7,
        "stock_options": 8
    }
    
    # Analyze each package
    package_scores = []
    for i, package in enumerate(packages):
        score = 0
        package_analysis = {"package_id": i+1}
        
        for category, importance in benefit_categories.items():
            if category in package:
                value = package[category]
                # Calculate a simple score based on value and importance
                if isinstance(value, bool):
                    category_score = importance if value else 0
                elif isinstance(value, (int, float)):
                    # Normalize numeric values (e.g., PTO days, 401k match %)
                    normalized = min(value / 10, 1)  # Cap at 1.0
                    category_score = normalized * importance
                else:
                    # String values - just check if present
                    category_score = importance / 2
                
                score += category_score
                package_analysis[f"{category}_score"] = category_score
        
        package_analysis["total_score"] = score
        package_scores.append(package_analysis)
    
    # Rank packages
    ranked_packages = sorted(package_scores, key=lambda x: x["total_score"], reverse=True)
    
    # Generate recommendations
    recommendations = []
    if len(ranked_packages) > 1:
        best_package = ranked_packages[0]
        recommendations.append(f"Package {best_package['package_id']} offers the best overall benefits value")
        
        # Find category strengths for other packages
        for i, package in enumerate(ranked_packages[1:], 2):
            for category in benefit_categories:
                cat_score_key = f"{category}_score"
                if cat_score_key in package and cat_score_key in best_package:
                    if package[cat_score_key] > best_package[cat_score_key]:
                        recommendations.append(f"Package {package['package_id']} is stronger in {category.replace('_', ' ')} benefits")
    
    # Result
    result = {
        "ranked_packages": ranked_packages,
        "recommendations": recommendations,
        "considerations": [
            "The relative importance of benefits varies based on individual circumstances",
            "Quality of health plans can be more important than their cost structure",
            "Retirement benefits should be evaluated in context of vesting schedules"
        ]
    }
    
    return result
