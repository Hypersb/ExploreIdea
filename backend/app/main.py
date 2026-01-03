from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from app.routes import search, favorites, analytics
from app.services.clip_service import CLIPService
from app.services.cache_service import CacheService

# Load environment variables
load_dotenv()


# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Explore Ida API...")
    
    # Initialize services
    app.state.clip_service = CLIPService()
    app.state.cache_service = CacheService()
    
    print("✅ CLIP model loaded successfully")
    print("✅ Cache service initialized")
    
    yield
    
    # Shutdown
    print("👋 Shutting down Explore Ida API...")
    if hasattr(app.state, 'cache_service'):
        await app.state.cache_service.close()


# Create FastAPI app
app = FastAPI(
    title="Explore Ida API",
    description="AI-Powered Visual Search Engine using CLIP",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
# In production, set ALLOWED_ORIGINS env var to your Vercel domain
# Example: ALLOWED_ORIGINS=https://exploreidea.vercel.app,http://localhost:5173
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# Allow all origins in development, restrict in production
if os.getenv("ENVIRONMENT") == "production":
    allow_origins = origins
else:
    allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Explore Ida API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Explore Ida",
        "clip_model": app.state.clip_service.model_name if hasattr(app.state, 'clip_service') else "not loaded"
    }


# Include routers
app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(favorites.router, prefix="/api", tags=["Favorites"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if os.getenv("DEBUG") == "True" else "An unexpected error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "True") == "True"
    )
