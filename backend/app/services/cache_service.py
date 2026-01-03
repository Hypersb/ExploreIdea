import redis
import json
import os
from typing import Optional, Any
import hashlib


class CacheService:
    """
    Service for caching search results using Redis
    """
    
    def __init__(self):
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.ttl = int(os.getenv("CACHE_TTL", 3600))  # Default 1 hour
        
        try:
            self.redis_client = redis.from_url(
                redis_url,
                decode_responses=True,
                socket_connect_timeout=5
            )
            # Test connection
            self.redis_client.ping()
            self.enabled = True
            print("✅ Redis cache connected")
        except Exception as e:
            print(f"⚠️  Redis not available: {e}")
            print("Running without cache")
            self.enabled = False
            self.redis_client = None
    
    def _generate_key(self, prefix: str, identifier: str) -> str:
        """
        Generate cache key with hash for long identifiers
        
        Args:
            prefix: Key prefix (e.g., 'search', 'image')
            identifier: Unique identifier (query, image_id, etc.)
            
        Returns:
            Cache key string
        """
        # Hash long identifiers
        if len(identifier) > 100:
            identifier = hashlib.md5(identifier.encode()).hexdigest()
        
        return f"exploreidea:{prefix}:{identifier}"
    
    async def get(self, key: str) -> Optional[Any]:
        """
        Get value from cache
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None
        """
        if not self.enabled:
            return None
        
        try:
            value = self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """
        Set value in cache
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live in seconds (optional)
            
        Returns:
            Success boolean
        """
        if not self.enabled:
            return False
        
        try:
            serialized = json.dumps(value)
            self.redis_client.setex(
                key,
                ttl or self.ttl,
                serialized
            )
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """
        Delete value from cache
        
        Args:
            key: Cache key
            
        Returns:
            Success boolean
        """
        if not self.enabled:
            return False
        
        try:
            self.redis_client.delete(key)
            return True
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False
    
    async def get_search_results(self, query: str) -> Optional[Any]:
        """Get cached search results"""
        key = self._generate_key("search", query.lower())
        return await self.get(key)
    
    async def cache_search_results(self, query: str, results: Any) -> bool:
        """Cache search results"""
        key = self._generate_key("search", query.lower())
        return await self.set(key, results)
    
    async def get_image_embedding(self, image_url: str) -> Optional[Any]:
        """Get cached image embedding"""
        key = self._generate_key("embedding", image_url)
        return await self.get(key)
    
    async def cache_image_embedding(self, image_url: str, embedding: Any) -> bool:
        """Cache image embedding"""
        key = self._generate_key("embedding", image_url)
        # Longer TTL for embeddings (7 days)
        return await self.set(key, embedding.tolist() if hasattr(embedding, 'tolist') else embedding, ttl=604800)
    
    async def increment_search_count(self, query: str) -> int:
        """Increment search count for analytics"""
        if not self.enabled:
            return 0
        
        try:
            key = self._generate_key("count", query.lower())
            return self.redis_client.incr(key)
        except Exception as e:
            print(f"Error incrementing count: {e}")
            return 0
    
    async def get_popular_searches(self, limit: int = 10) -> list:
        """Get most popular searches"""
        if not self.enabled:
            return []
        
        try:
            # Get all count keys
            pattern = self._generate_key("count", "*")
            keys = self.redis_client.keys(pattern)
            
            # Get counts
            searches = []
            for key in keys:
                count = int(self.redis_client.get(key) or 0)
                query = key.split(":")[-1]
                searches.append({"query": query, "count": count})
            
            # Sort by count
            searches.sort(key=lambda x: x["count"], reverse=True)
            
            return searches[:limit]
        except Exception as e:
            print(f"Error getting popular searches: {e}")
            return []
    
    async def close(self):
        """Close Redis connection"""
        if self.enabled and self.redis_client:
            self.redis_client.close()
            print("Redis connection closed")
