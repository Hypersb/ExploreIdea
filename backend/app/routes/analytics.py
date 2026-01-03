from fastapi import APIRouter, HTTPException, Request
from app.models import AnalyticsResponse
from datetime import datetime, timedelta
from typing import Dict, List

router = APIRouter()

# In-memory analytics storage (use MongoDB in production)
analytics_db = {
    "searches": [],
    "query_times": []
}


@router.get("/analytics", response_model=AnalyticsResponse)
async def get_analytics(request: Request, days: int = 7):
    """
    Get search analytics and statistics
    
    Args:
        days: Number of days to analyze
        
    Returns:
        AnalyticsResponse with metrics
    """
    try:
        cache_service = request.app.state.cache_service
        
        # Get popular searches from cache
        popular_searches = await cache_service.get_popular_searches(limit=20)
        
        # Calculate metrics
        total_searches = sum(s['count'] for s in popular_searches)
        unique_queries = len(popular_searches)
        
        # Mock average query time (in production, track actual times)
        avg_time = 0.35
        
        # Popular categories (mock data)
        categories = ["landmarks", "nature", "architecture", "cities", "culture"]
        
        return AnalyticsResponse(
            top_searches=popular_searches[:10],
            search_count=total_searches,
            unique_queries=unique_queries,
            avg_query_time=avg_time,
            popular_categories=categories,
            time_period=f"last_{days}_days"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")


@router.get("/analytics/queries")
async def get_query_stats(request: Request):
    """
    Get detailed query statistics
    
    Returns:
        Query statistics and patterns
    """
    try:
        cache_service = request.app.state.cache_service
        
        popular = await cache_service.get_popular_searches(limit=50)
        
        # Calculate stats
        total_count = sum(s['count'] for s in popular)
        
        stats = {
            "total_queries": total_count,
            "unique_queries": len(popular),
            "top_10": popular[:10],
            "query_distribution": {
                "high_frequency": len([s for s in popular if s['count'] > 10]),
                "medium_frequency": len([s for s in popular if 5 < s['count'] <= 10]),
                "low_frequency": len([s for s in popular if s['count'] <= 5])
            }
        }
        
        return stats
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get query stats: {str(e)}")


@router.get("/analytics/performance")
async def get_performance_metrics(request: Request):
    """
    Get system performance metrics
    
    Returns:
        Performance metrics
    """
    try:
        # Mock performance data (in production, track real metrics)
        metrics = {
            "avg_response_time": 0.32,
            "cache_hit_rate": 0.65,
            "api_success_rate": 0.98,
            "total_requests": 1247,
            "uptime_percentage": 99.7,
            "status": "healthy"
        }
        
        return metrics
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get performance metrics: {str(e)}")
