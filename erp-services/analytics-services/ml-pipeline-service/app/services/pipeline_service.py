"""Service layer for ML Pipeline business logic."""

import uuid
from typing import List, Optional, Tuple, Dict, Any
from datetime import datetime

import structlog
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.pipeline import Pipeline, PipelineExecution, PipelineStep, PipelineStatus
from app.schemas.pipeline import PipelineCreate, PipelineUpdate, ExecutionRequest
from app.db.redis import cached

logger = structlog.get_logger(__name__)


class PipelineService:
    """Service for ML Pipeline operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_pipelines(
        self,
        tenant_id: uuid.UUID,
        skip: int = 0,
        limit: int = 20,
        pipeline_type: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Pipeline], int]:
        """Get paginated list of pipelines for a tenant."""
        try:
            # Build query
            query = select(Pipeline).where(
                and_(
                    Pipeline.tenant_id == tenant_id,
                    Pipeline.is_deleted == False
                )
            )
            
            # Apply filters
            if pipeline_type:
                query = query.where(Pipeline.pipeline_type == pipeline_type)
            
            if status:
                query = query.where(Pipeline.status == status)
            
            if search:
                search_term = f"%{search}%"
                query = query.where(
                    Pipeline.name.ilike(search_term) |
                    Pipeline.description.ilike(search_term)
                )
            
            # Get total count
            count_query = select(func.count()).select_from(query.subquery())
            count_result = await self.db.execute(count_query)
            total = count_result.scalar() or 0
            
            # Apply pagination and ordering
            query = query.order_by(Pipeline.updated_at.desc())
            query = query.offset(skip).limit(limit)
            
            # Execute query
            result = await self.db.execute(query)
            pipelines = result.scalars().all()
            
            logger.info(
                "Retrieved pipelines",
                tenant_id=str(tenant_id),
                count=len(pipelines),
                total=total,
                filters={"pipeline_type": pipeline_type, "status": status, "search": search}
            )
            
            return list(pipelines), total
            
        except Exception as e:
            logger.error(
                "Failed to retrieve pipelines",
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    async def get_pipeline_by_id(
        self,
        tenant_id: uuid.UUID,
        pipeline_id: uuid.UUID,
        include_steps: bool = False,
        include_executions: bool = False
    ) -> Optional[Pipeline]:
        """Get a pipeline by ID."""
        try:
            query = select(Pipeline).where(
                and_(
                    Pipeline.id == pipeline_id,
                    Pipeline.tenant_id == tenant_id,
                    Pipeline.is_deleted == False
                )
            )
            
            # Include related data if requested
            if include_steps:
                query = query.options(selectinload(Pipeline.steps))
            
            if include_executions:
                query = query.options(selectinload(Pipeline.executions))
            
            result = await self.db.execute(query)
            pipeline = result.scalar_one_or_none()
            
            if pipeline:
                logger.info("Pipeline retrieved", pipeline_id=str(pipeline_id), tenant_id=str(tenant_id))
            else:
                logger.warning("Pipeline not found", pipeline_id=str(pipeline_id), tenant_id=str(tenant_id))
            
            return pipeline
            
        except Exception as e:
            logger.error(
                "Failed to retrieve pipeline",
                pipeline_id=str(pipeline_id),
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    async def create_pipeline(
        self,
        tenant_id: uuid.UUID,
        pipeline_data: PipelineCreate,
        user_id: Optional[uuid.UUID] = None
    ) -> Pipeline:
        """Create a new pipeline."""
        try:
            # Check for duplicate pipeline name within tenant
            existing_query = select(Pipeline).where(
                and_(
                    Pipeline.tenant_id == tenant_id,
                    Pipeline.name == pipeline_data.name,
                    Pipeline.version == pipeline_data.version,
                    Pipeline.is_deleted == False
                )
            )
            existing_result = await self.db.execute(existing_query)
            if existing_result.scalar_one_or_none():
                raise ValueError(f"Pipeline with name '{pipeline_data.name}' and version '{pipeline_data.version}' already exists")
            
            # Create new pipeline
            pipeline = Pipeline(
                tenant_id=tenant_id,
                name=pipeline_data.name,
                description=pipeline_data.description,
                version=pipeline_data.version,
                pipeline_type=pipeline_data.pipeline_type,
                definition=pipeline_data.definition,
                config=pipeline_data.config,
                timeout=pipeline_data.timeout,
                retry_count=pipeline_data.retry_count,
                max_parallelism=pipeline_data.max_parallelism,
                memory_limit=pipeline_data.memory_limit,
                cpu_limit=pipeline_data.cpu_limit,
                gpu_required=pipeline_data.gpu_required,
                is_scheduled=pipeline_data.is_scheduled,
                cron_expression=pipeline_data.cron_expression,
                tags=pipeline_data.tags,
                metadata_=pipeline_data.metadata_,
                created_by=user_id,
                updated_by=user_id,
                status=PipelineStatus.DRAFT
            )
            
            self.db.add(pipeline)
            await self.db.commit()
            await self.db.refresh(pipeline)
            
            logger.info(
                "Pipeline created",
                pipeline_id=str(pipeline.id),
                name=pipeline.name,
                tenant_id=str(tenant_id),
                user_id=str(user_id) if user_id else None
            )
            
            return pipeline
            
        except Exception as e:
            await self.db.rollback()
            logger.error(
                "Failed to create pipeline",
                name=pipeline_data.name,
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    async def update_pipeline(
        self,
        tenant_id: uuid.UUID,
        pipeline_id: uuid.UUID,
        pipeline_data: PipelineUpdate,
        user_id: Optional[uuid.UUID] = None
    ) -> Optional[Pipeline]:
        """Update a pipeline."""
        try:
            # Get existing pipeline
            pipeline = await self.get_pipeline_by_id(tenant_id, pipeline_id)
            if not pipeline:
                return None
            
            # Update fields
            update_data = pipeline_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                if field == "metadata_":
                    field = "metadata_"
                setattr(pipeline, field, value)
            
            pipeline.updated_by = user_id
            
            await self.db.commit()
            await self.db.refresh(pipeline)
            
            logger.info(
                "Pipeline updated",
                pipeline_id=str(pipeline_id),
                tenant_id=str(tenant_id),
                user_id=str(user_id) if user_id else None,
                updated_fields=list(update_data.keys())
            )
            
            return pipeline
            
        except Exception as e:
            await self.db.rollback()
            logger.error(
                "Failed to update pipeline",
                pipeline_id=str(pipeline_id),
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    async def delete_pipeline(
        self,
        tenant_id: uuid.UUID,
        pipeline_id: uuid.UUID,
        user_id: Optional[uuid.UUID] = None
    ) -> bool:
        """Soft delete a pipeline."""
        try:
            pipeline = await self.get_pipeline_by_id(tenant_id, pipeline_id)
            if not pipeline:
                return False
            
            # Soft delete
            pipeline.is_deleted = True
            pipeline.updated_by = user_id
            
            await self.db.commit()
            
            logger.info(
                "Pipeline deleted",
                pipeline_id=str(pipeline_id),
                tenant_id=str(tenant_id),
                user_id=str(user_id) if user_id else None
            )
            
            return True
            
        except Exception as e:
            await self.db.rollback()
            logger.error(
                "Failed to delete pipeline",
                pipeline_id=str(pipeline_id),
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    async def update_pipeline_status(
        self,
        tenant_id: uuid.UUID,
        pipeline_id: uuid.UUID,
        status: PipelineStatus,
        user_id: Optional[uuid.UUID] = None
    ) -> Optional[Pipeline]:
        """Update pipeline status."""
        try:
            pipeline = await self.get_pipeline_by_id(tenant_id, pipeline_id)
            if not pipeline:
                return None
            
            old_status = pipeline.status
            pipeline.status = status
            pipeline.updated_by = user_id
            
            await self.db.commit()
            await self.db.refresh(pipeline)
            
            logger.info(
                "Pipeline status updated",
                pipeline_id=str(pipeline_id),
                tenant_id=str(tenant_id),
                old_status=old_status,
                new_status=status,
                user_id=str(user_id) if user_id else None
            )
            
            return pipeline
            
        except Exception as e:
            await self.db.rollback()
            logger.error(
                "Failed to update pipeline status",
                pipeline_id=str(pipeline_id),
                tenant_id=str(tenant_id),
                status=status,
                error=str(e),
                exc_info=True
            )
            raise
    
    async def execute_pipeline(
        self,
        tenant_id: uuid.UUID,
        execution_request: ExecutionRequest,
        user_id: Optional[uuid.UUID] = None
    ) -> str:
        """Start pipeline execution."""
        try:
            # Get pipeline
            pipeline = await self.get_pipeline_by_id(tenant_id, execution_request.pipeline_id)
            if not pipeline:
                raise ValueError("Pipeline not found")
            
            # Generate execution ID
            execution_id = f"exec_{uuid.uuid4().hex[:8]}_{int(datetime.utcnow().timestamp())}"
            
            # Create execution record
            execution = PipelineExecution(
                tenant_id=tenant_id,
                pipeline_id=execution_request.pipeline_id,
                execution_id=execution_id,
                status=PipelineStatus.QUEUED,
                execution_context=execution_request.context,
                created_at=datetime.utcnow()
            )
            
            self.db.add(execution)
            await self.db.commit()
            await self.db.refresh(execution)
            
            # TODO: Queue pipeline execution (integrate with Celery/Prefect/Airflow)
            # For now, just update status to running
            execution.status = PipelineStatus.RUNNING
            execution.started_at = datetime.utcnow()
            await self.db.commit()
            
            logger.info(
                "Pipeline execution started",
                pipeline_id=str(execution_request.pipeline_id),
                execution_id=execution_id,
                tenant_id=str(tenant_id),
                user_id=str(user_id) if user_id else None
            )
            
            return execution_id
            
        except Exception as e:
            await self.db.rollback()
            logger.error(
                "Failed to execute pipeline",
                pipeline_id=str(execution_request.pipeline_id),
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    @cached(ttl=300)  # Cache for 5 minutes
    async def get_pipeline_stats(self, tenant_id: uuid.UUID) -> Dict[str, Any]:
        """Get pipeline statistics for a tenant."""
        try:
            # Total pipelines
            total_query = select(func.count()).where(
                and_(
                    Pipeline.tenant_id == tenant_id,
                    Pipeline.is_deleted == False
                )
            )
            total_result = await self.db.execute(total_query)
            total_pipelines = total_result.scalar() or 0
            
            # Active pipelines
            active_query = select(func.count()).where(
                and_(
                    Pipeline.tenant_id == tenant_id,
                    Pipeline.is_deleted == False,
                    Pipeline.status.in_([PipelineStatus.RUNNING, PipelineStatus.QUEUED])
                )
            )
            active_result = await self.db.execute(active_query)
            active_pipelines = active_result.scalar() or 0
            
            # Scheduled pipelines
            scheduled_query = select(func.count()).where(
                and_(
                    Pipeline.tenant_id == tenant_id,
                    Pipeline.is_deleted == False,
                    Pipeline.is_scheduled == True
                )
            )
            scheduled_result = await self.db.execute(scheduled_query)
            scheduled_pipelines = scheduled_result.scalar() or 0
            
            # Pipelines by type
            type_query = select(
                Pipeline.pipeline_type,
                func.count()
            ).where(
                and_(
                    Pipeline.tenant_id == tenant_id,
                    Pipeline.is_deleted == False
                )
            ).group_by(Pipeline.pipeline_type)
            
            type_result = await self.db.execute(type_query)
            type_counts = dict(type_result.all())
            
            # Total executions
            exec_query = select(func.count()).select_from(
                select(PipelineExecution.id).join(Pipeline).where(
                    and_(
                        Pipeline.tenant_id == tenant_id,
                        Pipeline.is_deleted == False
                    )
                ).subquery()
            )
            exec_result = await self.db.execute(exec_query)
            total_executions = exec_result.scalar() or 0
            
            stats = {
                "total_pipelines": total_pipelines,
                "active_pipelines": active_pipelines,
                "scheduled_pipelines": scheduled_pipelines,
                "total_executions": total_executions,
                "successful_executions": 0,  # TODO: Calculate from executions
                "failed_executions": 0,      # TODO: Calculate from executions
                "average_execution_time": None,  # TODO: Calculate from executions
                "pipelines_by_type": type_counts,
                "executions_by_status": {},  # TODO: Calculate from executions
            }
            
            logger.info("Pipeline stats retrieved", tenant_id=str(tenant_id), stats=stats)
            return stats
            
        except Exception as e:
            logger.error(
                "Failed to get pipeline stats",
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
