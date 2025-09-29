"""Models package initialization."""

from app.models.base import Base, BaseModel, SoftDeleteMixin, StatusMixin, MetadataMixin
from app.models.model import (
    AIModel,
    Experiment,
    Prediction,
    ModelType,
    ModelFramework,
    ModelStatus,
)

__all__ = [
    # Base classes
    "Base",
    "BaseModel",
    "SoftDeleteMixin", 
    "StatusMixin",
    "MetadataMixin",
    
    # AI Model entities
    "AIModel",
    "Experiment", 
    "Prediction",
    
    # Enums
    "ModelType",
    "ModelFramework",
    "ModelStatus",
]
