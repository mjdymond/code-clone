import logging
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.api.endpoints import router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="CareerHQ Agent API",
    description="API for CareerHQ Agent System",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(router, prefix="/api")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Add root route
@app.get("/")
async def root():
    return {
        "message": "CareerHQ Agent API",
        "docs": "/docs",
        "status": "online",
    }

# Entry point to run the server
if __name__ == "__main__":
    logger.info("Starting CareerHQ Agent API server")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
