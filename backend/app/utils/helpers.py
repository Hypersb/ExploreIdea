from datetime import datetime
from typing import Any, Dict, List


def format_timestamp(dt: datetime) -> str:
    """Format datetime to ISO string"""
    return dt.isoformat()


def calculate_relevance_score(similarity: float, metadata: Dict[str, Any]) -> float:
    """
    Calculate overall relevance score combining similarity and metadata
    
    Args:
        similarity: CLIP similarity score
        metadata: Image metadata
        
    Returns:
        Combined relevance score
    """
    # Base score from similarity
    score = similarity
    
    # Boost for images with rich metadata
    if metadata.get('description'):
        score += 0.02
    
    if metadata.get('tags') and len(metadata.get('tags', [])) > 3:
        score += 0.03
    
    # Normalize to 0-1 range
    return min(score, 1.0)


def truncate_text(text: str, max_length: int = 100) -> str:
    """
    Truncate text to maximum length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        
    Returns:
        Truncated text with ellipsis
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length - 3] + '...'


def deduplicate_results(results: List[Dict], key: str = 'id') -> List[Dict]:
    """
    Remove duplicate results based on key
    
    Args:
        results: List of result dictionaries
        key: Key to check for duplicates
        
    Returns:
        Deduplicated list
    """
    seen = set()
    unique = []
    
    for item in results:
        if item.get(key) not in seen:
            seen.add(item.get(key))
            unique.append(item)
    
    return unique


def parse_query_categories(query: str) -> List[str]:
    """
    Extract categories from search query
    
    Args:
        query: Search query string
        
    Returns:
        List of detected categories
    """
    categories = {
        'landmarks': ['tower', 'bridge', 'monument', 'statue', 'building'],
        'nature': ['mountain', 'beach', 'forest', 'lake', 'ocean', 'sunset'],
        'cities': ['city', 'street', 'urban', 'downtown', 'skyline'],
        'culture': ['temple', 'church', 'museum', 'art', 'festival'],
        'architecture': ['modern', 'ancient', 'historic', 'structure']
    }
    
    detected = []
    query_lower = query.lower()
    
    for category, keywords in categories.items():
        if any(keyword in query_lower for keyword in keywords):
            detected.append(category)
    
    return detected if detected else ['general']
