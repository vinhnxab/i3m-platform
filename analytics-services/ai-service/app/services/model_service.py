"""Service layer for AI Model business logic."""

import uuid
from typing import List, Optional, Tuple, Dict, Any
from datetime import datetime

import structlog
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.model import AIModel, ModelStatus, Experiment, Prediction
from app.schemas.model import ModelCreate, ModelUpdate, PredictionRequest
from app.db.redis import cached

logger = structlog.get_logger(__name__)


class ModelService:
    """Service for AI Model operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_models(
        self,
        tenant_id: uuid.UUID,
        skip: int = 0,
        limit: int = 20,
        model_type: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[AIModel], int]:
        """Get paginated list of models for a tenant."""
        try:
            # Build query
            query = select(AIModel).where(
                and_(
                    AIModel.tenant_id == tenant_id,
                    AIModel.is_deleted == False
                )
            )
            
            # Apply filters
            if model_type:
                query = query.where(AIModel.model_type == model_type)
            
            if status:
                query = query.where(AIModel.model_status == status)
            
            if search:
                search_term = f"%{search}%"
                query = query.where(
                    AIModel.name.ilike(search_term) |
                    AIModel.description.ilike(search_term)
                )
            
            # Get total count
            count_query = select(func.count()).select_from(query.subquery())
            count_result = await self.db.execute(count_query)
            total = count_result.scalar() or 0
            
            # Apply pagination and ordering
            query = query.order_by(AIModel.updated_at.desc())
            query = query.offset(skip).limit(limit)
            
            # Execute query
            result = await self.db.execute(query)
            models = result.scalars().all()
            
            logger.info(
                "Retrieved models",
                tenant_id=str(tenant_id),
                count=len(models),
                total=total,
                filters={"model_type": model_type, "status": status, "search": search}
            )
            
            return list(models), total
            
        except Exception as e:
            logger.error(
                "Failed to retrieve models",
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    async def get_model_by_id(
        self,
        tenant_id: uuid.UUID,
        model_id: uuid.UUID,
        include_experiments: bool = False,
        include_predictions: bool = False
    ) -> Optional[AIModel]:
        """Get a model by ID."""
        try:
            query = select(AIModel).where(
                and_(
                    AIModel.id == model_id,
                    AIModel.tenant_id == tenant_id,
                    AIModel.is_deleted == False
                )
            )
            
            # Include related data if requested
            if include_experiments:
                query = query.options(selectinload(AIModel.experiments))
            
            if include_predictions:
                query = query.options(selectinload(AIModel.predictions))
            
            result = await self.db.execute(query)
            model = result.scalar_one_or_none()
            
            if model:
                logger.info("Model retrieved", model_id=str(model_id), tenant_id=str(tenant_id))
            else:
                logger.warning("Model not found", model_id=str(model_id), tenant_id=str(tenant_id))
            
            return model
            
        except Exception as e:
            logger.error(
                "Failed to retrieve model",
                model_id=str(model_id),
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    async def create_model(
        self,
        tenant_id: uuid.UUID,
        model_data: ModelCreate,
        user_id: Optional[uuid.UUID] = None
    ) -> AIModel:
        """Create a new model."""
        try:
            # Check for duplicate model name within tenant
            existing_query = select(AIModel).where(
                and_(
                    AIModel.tenant_id == tenant_id,
                    AIModel.name == model_data.name,
                    AIModel.version == model_data.version,
                    AIModel.is_deleted == False
                )
            )
            existing_result = await self.db.execute(existing_query)
            if existing_result.scalar_one_or_none():
                raise ValueError(f"Model with name '{model_data.name}' and version '{model_data.version}' already exists")
            
            # Create new model
            model = AIModel(
                tenant_id=tenant_id,
                name=model_data.name,
                description=model_data.description,
                version=model_data.version,
                model_type=model_data.model_type,
                framework=model_data.framework,
                training_dataset=model_data.training_dataset,
                training_parameters=model_data.training_parameters,
                deployment_config=model_data.deployment_config,
                memory_requirement=model_data.memory_requirement,
                cpu_requirement=model_data.cpu_requirement,
                gpu_requirement=model_data.gpu_requirement,
                parent_model_id=model_data.parent_model_id,
                tags=model_data.tags,
                notes=model_data.notes,
                created_by=user_id,
                updated_by=user_id,
                model_status=ModelStatus.DRAFT
            )
            
            self.db.add(model)
            await self.db.commit()
            await self.db.refresh(model)
            
            logger.info(
                "Model created",
                model_id=str(model.id),
                name=model.name,
                tenant_id=str(tenant_id),
                user_id=str(user_id) if user_id else None
            )
            
            return model
            
        except Exception as e:
            await self.db.rollback()
            logger.error(
                "Failed to create model",
                name=model_data.name,
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    async def update_model(
        self,
        tenant_id: uuid.UUID,
        model_id: uuid.UUID,
        model_data: ModelUpdate,
        user_id: Optional[uuid.UUID] = None
    ) -> Optional[AIModel]:
        """Update a model."""
        try:
            # Get existing model
            model = await self.get_model_by_id(tenant_id, model_id)
            if not model:
                return None
            
            # Update fields
            update_data = model_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(model, field, value)
            
            model.updated_by = user_id
            
            await self.db.commit()
            await self.db.refresh(model)
            
            logger.info(
                "Model updated",
                model_id=str(model_id),
                tenant_id=str(tenant_id),
                user_id=str(user_id) if user_id else None,
                updated_fields=list(update_data.keys())
            )
            
            return model
            
        except Exception as e:
            await self.db.rollback()
            logger.error(
                "Failed to update model",
                model_id=str(model_id),
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    async def delete_model(
        self,
        tenant_id: uuid.UUID,
        model_id: uuid.UUID,
        user_id: Optional[uuid.UUID] = None
    ) -> bool:
        """Soft delete a model."""
        try:
            model = await self.get_model_by_id(tenant_id, model_id)
            if not model:
                return False
            
            # Soft delete
            model.soft_delete(user_id)
            
            await self.db.commit()
            
            logger.info(
                "Model deleted",
                model_id=str(model_id),
                tenant_id=str(tenant_id),
                user_id=str(user_id) if user_id else None
            )
            
            return True
            
        except Exception as e:
            await self.db.rollback()
            logger.error(
                "Failed to delete model",
                model_id=str(model_id),
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
    
    async def update_model_status(
        self,
        tenant_id: uuid.UUID,
        model_id: uuid.UUID,
        status: ModelStatus,
        user_id: Optional[uuid.UUID] = None
    ) -> Optional[AIModel]:
        """Update model status."""
        try:
            model = await self.get_model_by_id(tenant_id, model_id)
            if not model:
                return None
            
            old_status = model.model_status
            model.model_status = status
            model.updated_by = user_id
            
            # Update deployment timestamp if deploying
            if status == ModelStatus.DEPLOYED:
                model.deployed_at = datetime.utcnow()
            
            await self.db.commit()
            await self.db.refresh(model)
            
            logger.info(
                "Model status updated",
                model_id=str(model_id),
                tenant_id=str(tenant_id),
                old_status=old_status,
                new_status=status,
                user_id=str(user_id) if user_id else None
            )
            
            return model
            
        except Exception as e:
            await self.db.rollback()
            logger.error(
                "Failed to update model status",
                model_id=str(model_id),
                tenant_id=str(tenant_id),
                status=status,
                error=str(e),
                exc_info=True
            )
            raise
    
    @cached(ttl=300)  # Cache for 5 minutes
    async def get_model_stats(self, tenant_id: uuid.UUID) -> Dict[str, Any]:
        """Get model statistics for a tenant."""
        try:
            # Total models
            total_query = select(func.count()).where(
                and_(
                    AIModel.tenant_id == tenant_id,
                    AIModel.is_deleted == False
                )
            )
            total_result = await self.db.execute(total_query)
            total_models = total_result.scalar() or 0
            
            # Models by status
            status_query = select(
                AIModel.model_status,
                func.count()
            ).where(
                and_(
                    AIModel.tenant_id == tenant_id,
                    AIModel.is_deleted == False
                )
            ).group_by(AIModel.model_status)
            
            status_result = await self.db.execute(status_query)
            status_counts = dict(status_result.all())
            
            # Models by type
            type_query = select(
                AIModel.model_type,
                func.count()
            ).where(
                and_(
                    AIModel.tenant_id == tenant_id,
                    AIModel.is_deleted == False
                )
            ).group_by(AIModel.model_type)
            
            type_result = await self.db.execute(type_query)
            type_counts = dict(type_result.all())
            
            # Total predictions
            predictions_query = select(func.count()).select_from(
                select(Prediction.id).join(AIModel).where(
                    and_(
                        AIModel.tenant_id == tenant_id,
                        AIModel.is_deleted == False
                    )
                ).subquery()
            )
            predictions_result = await self.db.execute(predictions_query)
            total_predictions = predictions_result.scalar() or 0
            
            stats = {
                "total_models": total_models,
                "total_predictions": total_predictions,
                "models_by_status": status_counts,
                "models_by_type": type_counts,
                "active_models": status_counts.get(ModelStatus.SERVING, 0),
                "deployed_models": status_counts.get(ModelStatus.DEPLOYED, 0),
            }
            
            logger.info("Model stats retrieved", tenant_id=str(tenant_id), stats=stats)
            return stats
            
        except Exception as e:
            logger.error(
                "Failed to get model stats",
                tenant_id=str(tenant_id),
                error=str(e),
                exc_info=True
            )
            raise
