import httpx
import os
from typing import List, Dict, Any, Optional
from app.models import ImageResult, ImageMetadata
import asyncio


class ImageService:
    """
    Service for fetching images from external APIs (Unsplash, Pexels)
    """
    
    def __init__(self):
        self.unsplash_access_key = os.getenv("UNSPLASH_ACCESS_KEY", "")
        self.pexels_api_key = os.getenv("PEXELS_API_KEY", "")
        
        self.unsplash_base_url = "https://api.unsplash.com"
        self.pexels_base_url = "https://api.pexels.com/v1"
    
    async def search_unsplash(
        self, 
        query: str, 
        per_page: int = 20, 
        page: int = 1
    ) -> List[Dict[str, Any]]:
        """
        Search images from Unsplash API
        
        Args:
            query: Search query
            per_page: Number of results per page
            page: Page number
            
        Returns:
            List of image data dictionaries
        """
        if not self.unsplash_access_key:
            print("Warning: Unsplash API key not configured")
            return []
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.unsplash_base_url}/search/photos",
                    params={
                        "query": query,
                        "per_page": per_page,
                        "page": page,
                        "orientation": "landscape"
                    },
                    headers={
                        "Authorization": f"Client-ID {self.unsplash_access_key}"
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return self._parse_unsplash_results(data.get("results", []))
                else:
                    print(f"Unsplash API error: {response.status_code}")
                    return []
        
        except Exception as e:
            print(f"Error fetching from Unsplash: {e}")
            return []
    
    async def search_pexels(
        self, 
        query: str, 
        per_page: int = 20, 
        page: int = 1
    ) -> List[Dict[str, Any]]:
        """
        Search images from Pexels API
        
        Args:
            query: Search query
            per_page: Number of results per page
            page: Page number
            
        Returns:
            List of image data dictionaries
        """
        if not self.pexels_api_key:
            print("Warning: Pexels API key not configured")
            return []
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.pexels_base_url}/search",
                    params={
                        "query": query,
                        "per_page": per_page,
                        "page": page
                    },
                    headers={
                        "Authorization": self.pexels_api_key
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return self._parse_pexels_results(data.get("photos", []))
                else:
                    print(f"Pexels API error: {response.status_code}")
                    return []
        
        except Exception as e:
            print(f"Error fetching from Pexels: {e}")
            return []
    
    async def search_all_sources(
        self, 
        query: str, 
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """
        Search images from all available sources
        
        Args:
            query: Search query
            limit: Total number of results desired
            
        Returns:
            Combined list of image data dictionaries
        """
        # Calculate per-source limit
        per_source = limit // 2
        
        # Fetch from both sources concurrently
        unsplash_task = self.search_unsplash(query, per_source)
        pexels_task = self.search_pexels(query, per_source)
        
        unsplash_results, pexels_results = await asyncio.gather(
            unsplash_task, 
            pexels_task,
            return_exceptions=True
        )
        
        # Handle exceptions
        if isinstance(unsplash_results, Exception):
            print(f"Unsplash error: {unsplash_results}")
            unsplash_results = []
        
        if isinstance(pexels_results, Exception):
            print(f"Pexels error: {pexels_results}")
            pexels_results = []
        
        # Combine results
        all_results = unsplash_results + pexels_results
        
        return all_results[:limit]
    
    def _parse_unsplash_results(self, results: List[Dict]) -> List[Dict[str, Any]]:
        """Parse Unsplash API results into standardized format"""
        parsed = []
        
        for item in results:
            try:
                parsed_item = {
                    "id": f"unsplash_{item['id']}",
                    "url": item['urls']['regular'],
                    "thumbnail_url": item['urls']['small'],
                    "download_url": item['links']['download'],
                    "metadata": {
                        "title": item.get('description') or item.get('alt_description', 'Untitled'),
                        "description": item.get('description', ''),
                        "photographer": item['user']['name'],
                        "location": item.get('location', {}).get('name'),
                        "tags": [tag['title'] for tag in item.get('tags', [])],
                        "source": "unsplash",
                        "width": item['width'],
                        "height": item['height'],
                        "color": item.get('color', '#000000')
                    }
                }
                parsed.append(parsed_item)
            except KeyError as e:
                print(f"Error parsing Unsplash result: {e}")
                continue
        
        return parsed
    
    def _parse_pexels_results(self, results: List[Dict]) -> List[Dict[str, Any]]:
        """Parse Pexels API results into standardized format"""
        parsed = []
        
        for item in results:
            try:
                parsed_item = {
                    "id": f"pexels_{item['id']}",
                    "url": item['src']['large'],
                    "thumbnail_url": item['src']['medium'],
                    "download_url": item['src']['original'],
                    "metadata": {
                        "title": item.get('alt', 'Untitled'),
                        "description": item.get('alt', ''),
                        "photographer": item['photographer'],
                        "location": None,
                        "tags": [],
                        "source": "pexels",
                        "width": item['width'],
                        "height": item['height'],
                        "color": item.get('avg_color', '#000000')
                    }
                }
                parsed.append(parsed_item)
            except KeyError as e:
                print(f"Error parsing Pexels result: {e}")
                continue
        
        return parsed
    
    def create_image_result(
        self, 
        image_data: Dict[str, Any], 
        similarity_score: float
    ) -> ImageResult:
        """
        Create ImageResult object from image data
        
        Args:
            image_data: Raw image data dictionary
            similarity_score: CLIP similarity score
            
        Returns:
            ImageResult object
        """
        metadata = ImageMetadata(**image_data['metadata'])
        
        return ImageResult(
            id=image_data['id'],
            url=image_data['url'],
            thumbnail_url=image_data['thumbnail_url'],
            similarity_score=similarity_score,
            metadata=metadata,
            download_url=image_data.get('download_url')
        )
