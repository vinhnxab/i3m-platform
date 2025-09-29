"""Main API router for version 1 endpoints."""

from fastapi import APIRouter

from app.api.v1.endpoints import models, predictions, experiments

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(models.router, prefix="/models", tags=["models"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(experiments.router, prefix="/experiments", tags=["experiments"])
