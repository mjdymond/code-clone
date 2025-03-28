import json
import logging
import re
import json_repair

logger = logging.getLogger(__name__)

def repair_json_output(text: str) -> str:
    """
    Attempts to repair JSON output that may be malformed.
    
    Args:
        text (str): Potentially malformed JSON text
        
    Returns:
        str: Repaired text that might be valid JSON
    """
    # Try to extract JSON if it's embedded in markdown code blocks
    json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if json_match:
        json_str = json_match.group(1)
        try:
            # Parse and re-serialize to ensure valid JSON
            json_obj = json.loads(json_str)
            return json.dumps(json_obj, ensure_ascii=False)
        except json.JSONDecodeError:
            # If the extracted JSON is invalid, try to repair it
            try:
                repaired = json_repair.loads(json_str)
                return json.dumps(repaired, ensure_ascii=False)
            except Exception as e:
                logger.warning(f"Failed to repair extracted JSON: {e}")
    
    # If no JSON in code blocks or repair failed, try to repair the full text
    try:
        repaired = json_repair.loads(text)
        return json.dumps(repaired, ensure_ascii=False)
    except Exception as e:
        logger.warning(f"Failed to repair full text as JSON: {e}")
    
    # If all repair attempts fail, return the original text
    return text
