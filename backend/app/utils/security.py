import re
from typing import Optional
from urllib.parse import urlparse
import validators


def validate_url(url: str) -> bool:
    """
    Validate if URL is safe and properly formatted
    
    Args:
        url: URL string to validate
        
    Returns:
        Boolean indicating if URL is valid
    """
    try:
        # Use validators library
        if not validators.url(url):
            return False
        
        # Parse URL
        parsed = urlparse(url)
        
        # Check scheme
        if parsed.scheme not in ['http', 'https']:
            return False
        
        # Check for suspicious patterns
        suspicious_patterns = [
            r'javascript:',
            r'data:',
            r'file:',
            r'<script',
            r'onclick',
            r'onerror'
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, url, re.IGNORECASE):
                return False
        
        return True
    
    except Exception:
        return False


def sanitize_query(query: str) -> str:
    """
    Sanitize user search query
    
    Args:
        query: Raw query string
        
    Returns:
        Sanitized query string
    """
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '{', '}', '`', '|', ';', '&']
    
    sanitized = query
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')
    
    # Remove extra whitespace
    sanitized = ' '.join(sanitized.split())
    
    # Limit length
    max_length = 500
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized.strip()


def validate_image_source(url: str) -> bool:
    """
    Check if image source is from trusted domains
    
    Args:
        url: Image URL
        
    Returns:
        Boolean indicating if source is trusted
    """
    trusted_domains = [
        'unsplash.com',
        'images.unsplash.com',
        'pexels.com',
        'images.pexels.com',
        'pixabay.com',
        'cloudinary.com',
        'amazonaws.com'
    ]
    
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        
        # Check if domain or subdomain matches trusted list
        for trusted in trusted_domains:
            if trusted in domain:
                return True
        
        return False
    
    except Exception:
        return False


def check_rate_limit(user_id: str, max_requests: int = 60) -> bool:
    """
    Check if user has exceeded rate limit
    
    Args:
        user_id: User identifier
        max_requests: Maximum requests per minute
        
    Returns:
        Boolean indicating if request is allowed
    """
    # TODO: Implement with Redis or similar
    # For now, always allow
    return True


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent directory traversal
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    # Remove path separators and dangerous characters
    dangerous = ['/', '\\', '..', '<', '>', ':', '"', '|', '?', '*']
    
    sanitized = filename
    for char in dangerous:
        sanitized = sanitized.replace(char, '_')
    
    return sanitized
