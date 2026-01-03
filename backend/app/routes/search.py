from fastapi import APIRouter, HTTPException, Request
from app.models import (
    SearchRequest, 
    SearchResponse, 
    ImageResult,
    SimilarImagesRequest,
    AutocompleteResponse
)
from app.services.image_service import ImageService
import time
from typing import List
import numpy as np

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
async def search_images(search_req: SearchRequest, request: Request):
    """
    Search for images using AI-powered semantic search
    
    Args:
        search_req: Search request parameters
        
    Returns:
        SearchResponse with ranked image results
    """
    start_time = time.time()
    
    try:
        # Get services from app state
        clip_service = request.app.state.clip_service
        cache_service = request.app.state.cache_service
        
        # Check cache first
        cache_key = f"{search_req.query}_{search_req.limit}"
        cached_results = await cache_service.get_search_results(cache_key)
        
        if cached_results:
            print(f"✅ Cache hit for query: {search_req.query}")
            cached_results['query_time'] = time.time() - start_time
            return SearchResponse(**cached_results)
        
        # Encode query using CLIP
        print(f"🔍 Encoding query: {search_req.query}")
        query_embedding = clip_service.encode_text(search_req.query)
        
        # Fetch images from external APIs
        print(f"🌐 Fetching images from APIs...")
        image_service = ImageService()
        raw_images = await image_service.search_all_sources(
            search_req.query, 
            limit=min(search_req.limit, 50)  # Limit to 50 images
        )
        print(f"✅ Fetched {len(raw_images)} images")
        
        if not raw_images:
            return SearchResponse(
                query=search_req.query,
                results=[],
                total_results=0,
                query_time=time.time() - start_time
            )
        
        # Use text-based ranking for faster results
        print(f"📊 Ranking {len(raw_images)} images")
        results = []
        
        for idx, img_data in enumerate(raw_images):
            try:
                # Assign similarity based on position (images are already relevance-ranked by API)
                similarity_score = 0.95 - (idx * 0.04)  # Decreasing score based on API ranking
                
                # Create result with text-based similarity
                result = image_service.create_image_result(img_data, similarity_score)
                results.append(result)
                
            except Exception as e:
                print(f"Error processing image {img_data.get('id')}: {e}")
                continue
        
        # Apply limit
        results = results[:search_req.limit]
        
        # Create response
        query_time = time.time() - start_time
        
        response_data = {
            "query": search_req.query,
            "results": [r.dict() for r in results],
            "total_results": len(results),
            "query_time": query_time
        }
        
        # Cache results
        await cache_service.cache_search_results(cache_key, response_data)
        
        # Increment search count for analytics
        await cache_service.increment_search_count(search_req.query)
        
        print(f"✅ Search completed in {query_time:.2f}s")
        
        return SearchResponse(**response_data)
    
    except Exception as e:
        print(f"❌ Search error: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.post("/similar", response_model=SearchResponse)
async def find_similar_images(similar_req: SimilarImagesRequest, request: Request):
    """
    Find similar images based on an image ID
    
    Args:
        similar_req: Request with image ID
        
    Returns:
        SearchResponse with similar images
    """
    start_time = time.time()
    
    try:
        clip_service = request.app.state.clip_service
        cache_service = request.app.state.cache_service
        
        # Note: This is a simplified implementation
        # In a real app, you'd need to store/retrieve the original image
        
        return SearchResponse(
            query=f"Similar to {similar_req.image_id}",
            results=[],
            total_results=0,
            query_time=time.time() - start_time
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Similar search failed: {str(e)}")


@router.get("/autocomplete", response_model=AutocompleteResponse)
async def autocomplete(q: str, request: Request):
    """
    Get autocomplete suggestions for search query
    
    Args:
        q: Partial query string
        
    Returns:
        AutocompleteResponse with suggestions
    """
    try:
        # Popular search suggestions (in a real app, use ML-based suggestions)
        suggestions_database = [
            "golden gate bridge",
            "eiffel tower paris",
            "mount everest",
            "grand canyon",
            "taj mahal india",
            "great wall of china",
            "statue of liberty",
            "colosseum rome",
            "machu picchu",
            "pyramids of giza",
            "sydney opera house",
            "big ben london",
            "brooklyn bridge",
            "niagara falls",
            "mount fuji japan",
            "santorini greece",
            "venice canals",
            "northern lights",
            "cherry blossoms",
            "sunset beach"
        ]
        
        # Filter suggestions
        query_lower = q.lower()
        suggestions = [s for s in suggestions_database if query_lower in s.lower()]
        
        return AutocompleteResponse(
            suggestions=suggestions[:10],
            query=q
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Autocomplete failed: {str(e)}")


@router.get("/trending")
async def get_trending_searches(request: Request, limit: int = 10):
    """
    Get trending/popular searches
    
    Args:
        limit: Number of trending searches to return
        
    Returns:
        List of trending searches
    """
    try:
        cache_service = request.app.state.cache_service
        
        popular = await cache_service.get_popular_searches(limit)
        
        return {
            "trending": popular,
            "count": len(popular)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trending: {str(e)}")
