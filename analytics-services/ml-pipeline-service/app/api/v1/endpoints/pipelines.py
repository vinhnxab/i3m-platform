"""FastAPI endpoints for ML Pipeline management."""

import uuid
from typing import Optional

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.services.pipeline_service import PipelineService
from app.schemas.pipeline import (
    PipelineCreate,
    PipelineUpdate,
    PipelinesResponse,
    PipelineSingleResponse,
    PipelineListItem,
    PaginationInfo,
    ExecutionRequest,
    ExecutionResponse
)
from app.models.pipeline import PipelineStatus

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


@router.get("/", response_model=PipelinesResponse)
async def get_pipelines(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of records to return"),
    pipeline_type: Optional[str] = Query(None, description="Filter by pipeline type"),
    status: Optional[str] = Query(None, description="Filter by pipeline status"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Get paginated list of ML pipelines."""
    tenant_id, _ = tenant_user_ids
    
    try:
        service = PipelineService(db)
        pipelines, total = await service.get_pipelines(
            tenant_id=tenant_id,
            skip=skip,
            limit=limit,
            pipeline_type=pipeline_type,
            status=status,
            search=search
        )
        
        # Convert to response format
        pipeline_items = [
            PipelineListItem(
                id=pipeline.id,
                name=pipeline.name,
                description=pipeline.description,
                version=pipeline.version,
                pipeline_type=pipeline.pipeline_type,
                status=pipeline.status,
                is_scheduled=pipeline.is_scheduled,
                next_run_at=pipeline.next_run_at,
                created_at=pipeline.created_at,
                updated_at=pipeline.updated_at
            )
            for pipeline in pipelines
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
        
        return PipelinesResponse(
            data=pipeline_items,
            pagination=pagination
        )
        
    except Exception as e:
        logger.error("Failed to get pipelines", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve pipelines")


@router.get("/stats")
async def get_pipeline_stats(
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Get ML pipeline statistics."""
    tenant_id, _ = tenant_user_ids
    
    try:
        service = PipelineService(db)
        stats = await service.get_pipeline_stats(tenant_id)
        
        return {
            "success": True,
            "message": "Pipeline statistics retrieved successfully",
            "data": stats
        }
        
    except Exception as e:
        logger.error("Failed to get pipeline stats", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve pipeline statistics")


@router.get("/{pipeline_id}", response_model=PipelineSingleResponse)
async def get_pipeline(
    pipeline_id: uuid.UUID,
    include_steps: bool = Query(False, description="Include pipeline steps"),
    include_executions: bool = Query(False, description="Include execution history"),
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific ML pipeline by ID."""
    tenant_id, _ = tenant_user_ids
    
    try:
        service = PipelineService(db)
        pipeline = await service.get_pipeline_by_id(
            tenant_id=tenant_id,
            pipeline_id=pipeline_id,
            include_steps=include_steps,
            include_executions=include_executions
        )
        
        if not pipeline:
            raise HTTPException(status_code=404, detail="Pipeline not found")
        
        return PipelineSingleResponse(data=pipeline)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get pipeline", pipeline_id=str(pipeline_id), error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve pipeline")


@router.post("/", response_model=PipelineSingleResponse, status_code=201)
async def create_pipeline(
    pipeline_data: PipelineCreate,
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Create a new ML pipeline."""
    tenant_id, user_id = tenant_user_ids
    
    try:
        service = PipelineService(db)
        pipeline = await service.create_pipeline(
            tenant_id=tenant_id,
            pipeline_data=pipeline_data,
            user_id=user_id
        )
        
        return PipelineSingleResponse(
            message="Pipeline created successfully",
            data=pipeline
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("Failed to create pipeline", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to create pipeline")


@router.put("/{pipeline_id}", response_model=PipelineSingleResponse)
async def update_pipeline(
    pipeline_id: uuid.UUID,
    pipeline_data: PipelineUpdate,
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Update an ML pipeline."""
    tenant_id, user_id = tenant_user_ids
    
    try:
        service = PipelineService(db)
        pipeline = await service.update_pipeline(
            tenant_id=tenant_id,
            pipeline_id=pipeline_id,
            pipeline_data=pipeline_data,
            user_id=user_id
        )
        
        if not pipeline:
            raise HTTPException(status_code=404, detail="Pipeline not found")
        
        return PipelineSingleResponse(
            message="Pipeline updated successfully",
            data=pipeline
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update pipeline", pipeline_id=str(pipeline_id), error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update pipeline")


@router.delete("/{pipeline_id}")
async def delete_pipeline(
    pipeline_id: uuid.UUID,
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Delete an ML pipeline."""
    tenant_id, user_id = tenant_user_ids
    
    try:
        service = PipelineService(db)
        success = await service.delete_pipeline(
            tenant_id=tenant_id,
            pipeline_id=pipeline_id,
            user_id=user_id
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="Pipeline not found")
        
        return {
            "success": True,
            "message": "Pipeline deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to delete pipeline", pipeline_id=str(pipeline_id), error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete pipeline")


@router.put("/{pipeline_id}/status", response_model=PipelineSingleResponse)
async def update_pipeline_status(
    pipeline_id: uuid.UUID,
    status: PipelineStatus,
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Update ML pipeline status."""
    tenant_id, user_id = tenant_user_ids
    
    try:
        service = PipelineService(db)
        pipeline = await service.update_pipeline_status(
            tenant_id=tenant_id,
            pipeline_id=pipeline_id,
            status=status,
            user_id=user_id
        )
        
        if not pipeline:
            raise HTTPException(status_code=404, detail="Pipeline not found")
        
        return PipelineSingleResponse(
            message="Pipeline status updated successfully",
            data=pipeline
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Failed to update pipeline status",
            pipeline_id=str(pipeline_id),
            status=status,
            error=str(e),
            exc_info=True
        )
        raise HTTPException(status_code=500, detail="Failed to update pipeline status")


@router.post("/{pipeline_id}/execute", response_model=ExecutionResponse)
async def execute_pipeline(
    pipeline_id: uuid.UUID,
    execution_request: ExecutionRequest,
    tenant_user_ids: tuple = Depends(get_tenant_and_user_ids),
    db: AsyncSession = Depends(get_db)
):
    """Execute an ML pipeline."""
    tenant_id, user_id = tenant_user_ids
    
    # Ensure pipeline_id matches
    execution_request.pipeline_id = pipeline_id
    
    try:
        service = PipelineService(db)
        execution_id = await service.execute_pipeline(
            tenant_id=tenant_id,
            execution_request=execution_request,
            user_id=user_id
        )
        
        return ExecutionResponse(
            message="Pipeline execution started successfully",
            data={"pipeline_id": str(pipeline_id)},
            execution_id=execution_id
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(
            "Failed to execute pipeline",
            pipeline_id=str(pipeline_id),
            error=str(e),
            exc_info=True
        )
        raise HTTPException(status_code=500, detail="Failed to execute pipeline")
