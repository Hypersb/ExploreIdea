from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class QueryType(str, Enum):
    TEXT = "text"
    IMAGE = "image"


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    limit: int = Field(default=20, ge=1, le=100, description="Number of results")
    offset: int = Field(default=0, ge=0, description="Pagination offset")
    query_type: QueryType = Field(default=QueryType.TEXT)
    
    @validator('query')
    def validate_query(cls, v):
        # Basic security validation
        dangerous_chars = ['<', '>', '{', '}', '`']
        if any(char in v for char in dangerous_chars):
            raise ValueError('Query contains invalid characters')
        return v.strip()


class ImageMetadata(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    photographer: Optional[str] = None
    location: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    source: str = "unsplash"  # unsplash, pexels, etc.
    width: Optional[int] = None
    height: Optional[int] = None
    color: Optional[str] = None


class ImageResult(BaseModel):
    id: str
    url: str
    thumbnail_url: str
    similarity_score: float = Field(ge=0.0, le=1.0)
    metadata: ImageMetadata
    download_url: Optional[str] = None


class SearchResponse(BaseModel):
    query: str
    results: List[ImageResult]
    total_results: int
    query_time: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SimilarImagesRequest(BaseModel):
    image_id: str
    limit: int = Field(default=10, ge=1, le=50)


class FavoriteRequest(BaseModel):
    image_id: str
    image_url: str
    thumbnail_url: str
    metadata: Dict[str, Any]


class FavoriteResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    image_id: str
    image_url: str
    thumbnail_url: str
    metadata: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AnalyticsResponse(BaseModel):
    top_searches: List[Dict[str, Any]]
    search_count: int
    unique_queries: int
    avg_query_time: float
    popular_categories: List[str]
    time_period: str = "last_7_days"


class AutocompleteResponse(BaseModel):
    suggestions: List[str]
    query: str


class ErrorResponse(BaseModel):
    error: str
    message: str
    status_code: int
