"""FastAPI endpoints for AI Model management."""

import uuid
from typing import Optional

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.services.model_service import ModelService
from app.schemas.model import (
    ModelCreate,
    ModelUpdate,
    ModelsResponse,
    ModelSingleResponse,
    ModelListItem,
    PaginationInfo
)
from app.models.model import ModelStatus

logger = structlog.get_logger(__name__)

router = APIRouter()


def get_tenant_and_user_ids(
    x_tenant_id: str = Header(..., alias="X-Tenant-ID"),
    x_user_id: Optional[str] = Header(None, alias="X-User-ID")
) -> tuple[uuid.UUID, Optional[uuid.UUID]]:
    """Extract tenant and user IDs from headers."""
    try:
        tenant_id = uuid.UUID(x_tenant_id)
        user_id = uuid.UUID(x_user_id) if x_user_id else None
        return tenant_id, user_id
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid UUID format: {e}")


@router.get("/", response_model=ModelsResponse)
async def get_models(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    model_type: Optional[str] = Query(None, description="Filter by model type"),
    status: Optional[str] = Query(None, description="Filter by model status"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Get paginated list of AI models."""
    tenant_id, _ = tenant_user_ids
    
    try:
        service = ModelService(db)
        models, total = await service.get_models(
            tenant_id=tenant_id,
            skip=skip,
            limit=limit,
            model_type=model_type,
            status=status,
            search=search
        )
        
        # Convert to response format
        model_items = [
            ModelListItem(
                id=model.id,
                name=model.name,
                description=model.description,
                version=model.version,
                model_type=model.model_type,
                framework=model.framework,
                model_status=model.model_status,
                accuracy=model.accuracy,
                prediction_count=model.prediction_count,
                created_at=model.created_at,
                updated_at=model.updated_at
            )
            for model in models
        ]
        
        # Calculate pagination info
        total_pages = (total + limit - 1) // limit
        current_page = (skip // limit) + 1
        
        pagination = PaginationInfo(
            page=current_page,
            page_size=limit,
            total_items=total,
            total_pages=total_pages,
            has_next=current_page < total_pages,
            has_prev=current_page > 1
        )
        
        return ModelsResponse(
            data=model_items,
            pagination=pagination
        )
        
    except Exception as e:
        logger.error("Failed to get models", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve models")


@router.get("/stats")
async def get_model_stats(
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Get AI model statistics."""
    tenant_id, _ = tenant_user_ids
    
    try:
        service = ModelService(db)
        stats = await service.get_model_stats(tenant_id)
        
        return {
            "success": True,
            "message": "Model statistics retrieved successfully",
            "data": stats
        }
        
    except Exception as e:
        logger.error("Failed to get model stats", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve model statistics")


@router.get("/{model_id}", response_model=ModelSingleResponse)
async def get_model(
    model_id: uuid.UUID,
    include_experiments: bool = Query(False, description="Include experiment data"),
    include_predictions: bool = Query(False, description="Include prediction history"),
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific AI model by ID."""
    tenant_id, _ = tenant_user_ids
    
    try:
        service = ModelService(db)
        model = await service.get_model_by_id(
            tenant_id=tenant_id,
            model_id=model_id,
            include_experiments=include_experiments,
            include_predictions=include_predictions
        )
        
        if not model:
            raise HTTPException(status_code=404, detail="Model not found")
        
        return ModelSingleResponse(data=model)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get model", model_id=str(model_id), error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve model")


@router.post("/", response_model=ModelSingleResponse, status_code=201)
async def create_model(
    model_data: ModelCreate,
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Create a new AI model."""
    tenant_id, user_id = tenant_user_ids
    
    try:
        service = ModelService(db)
        model = await service.create_model(
            tenant_id=tenant_id,
            model_data=model_data,
            user_id=user_id
        )
        
        return ModelSingleResponse(
            message="Model created successfully",
            data=model
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to create model", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to create model")


@router.put("/{model_id}", response_model=ModelSingleResponse)
async def update_model(
    model_id: uuid.UUID,
    model_data: ModelUpdate,
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Update an AI model."""
    tenant_id, user_id = tenant_user_ids
    
    try:
        service = ModelService(db)
        model = await service.update_model(
            tenant_id=tenant_id,
            model_id=model_id,
            model_data=model_data,
            user_id=user_id
        )
        
        if not model:
            raise HTTPException(status_code=404, detail="Model not found")
        
        return ModelSingleResponse(
            message="Model updated successfully",
            data=model
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update model", model_id=str(model_id), error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update model")


@router.delete("/{model_id}")
async def delete_model(
    model_id: uuid.UUID,
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Delete an AI model."""
    tenant_id, user_id = tenant_user_ids
    
    try:
        service = ModelService(db)
        success = await service.delete_model(
            tenant_id=tenant_id,
            model_id=model_id,
            user_id=user_id
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="Model not found")
        
        return {
            "success": True,
            "message": "Model deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to delete model", model_id=str(model_id), error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete model")


@router.put("/{model_id}/status", response_model=ModelSingleResponse)
async def update_model_status(
    model_id: uuid.UUID,
    status: ModelStatus,
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Update AI model status."""
    tenant_id, user_id = tenant_user_ids
    
    try:
        service = ModelService(db)
        model = await service.update_model_status(
            tenant_id=tenant_id,
            model_id=model_id,
            status=status,
            user_id=user_id
        )
        
        if not model:
            raise HTTPException(status_code=404, detail="Model not found")
        
        return ModelSingleResponse(
            message="Model status updated successfully",
            data=model
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Failed to update model status",
            model_id=str(model_id),
            status=status,
            error=str(e),
            exc_info=True
        )
        raise HTTPException(status_code=500, detail="Failed to update model status")
