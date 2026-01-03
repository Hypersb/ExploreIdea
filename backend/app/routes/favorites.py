from fastapi import APIRouter, HTTPException, Request
from app.models import FavoriteRequest, FavoriteResponse
from typing import List
from datetime import datetime

router = APIRouter()

# In-memory storage (in production, use MongoDB)
favorites_db = {}


@router.post("/favorites", response_model=FavoriteResponse)
async def add_favorite(favorite: FavoriteRequest, request: Request):
    """
    Add image to favorites
    
    Args:
        favorite: Favorite request data
        
    Returns:
        FavoriteResponse with saved data
    """
    try:
        # Generate unique ID
        fav_id = f"fav_{len(favorites_db) + 1}"
        
        # Create favorite record
        favorite_data = {
            "id": fav_id,
            "user_id": None,  # Add user authentication later
            "image_id": favorite.image_id,
            "image_url": favorite.image_url,
            "thumbnail_url": favorite.thumbnail_url,
            "metadata": favorite.metadata,
            "created_at": datetime.utcnow()
        }
        
        # Store in database
        favorites_db[fav_id] = favorite_data
        
        return FavoriteResponse(**favorite_data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add favorite: {str(e)}")


@router.get("/favorites", response_model=List[FavoriteResponse])
async def get_favorites(request: Request):
    """
    Get all favorites for current user
    
    Returns:
        List of FavoriteResponse objects
    """
    try:
        # In production, filter by user_id
        favorites = list(favorites_db.values())
        
        return [FavoriteResponse(**fav) for fav in favorites]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get favorites: {str(e)}")


@router.delete("/favorites/{favorite_id}")
async def delete_favorite(favorite_id: str, request: Request):
    """
    Delete a favorite by ID
    
    Args:
        favorite_id: ID of favorite to delete
        
    Returns:
        Success message
    """
    try:
        if favorite_id not in favorites_db:
            raise HTTPException(status_code=404, detail="Favorite not found")
        
        del favorites_db[favorite_id]
        
        return {"message": "Favorite deleted successfully", "id": favorite_id}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete favorite: {str(e)}")


@router.get("/favorites/{favorite_id}", response_model=FavoriteResponse)
async def get_favorite(favorite_id: str, request: Request):
    """
    Get a specific favorite by ID
    
    Args:
        favorite_id: ID of favorite
        
    Returns:
        FavoriteResponse object
    """
    try:
        if favorite_id not in favorites_db:
            raise HTTPException(status_code=404, detail="Favorite not found")
        
        return FavoriteResponse(**favorites_db[favorite_id])
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get favorite: {str(e)}")
