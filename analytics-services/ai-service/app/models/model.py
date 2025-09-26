"""AI Model management models."""

import enum
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, Integer, Float, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel, SoftDeleteMixin, StatusMixin, MetadataMixin


class ModelType(str, enum.Enum):
    """Model type enumeration."""
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    CLUSTERING = "clustering"
    NLP = "nlp"
    COMPUTER_VISION = "computer_vision"
    TIME_SERIES = "time_series"
    RECOMMENDATION = "recommendation"
    ANOMALY_DETECTION = "anomaly_detection"
    REINFORCEMENT_LEARNING = "reinforcement_learning"
    DEEP_LEARNING = "deep_learning"


class ModelFramework(str, enum.Enum):
    """Model framework enumeration."""
    TENSORFLOW = "tensorflow"
    PYTORCH = "pytorch"
    SCIKIT_LEARN = "scikit_learn"
    XGBOOST = "xgboost"
    LIGHTGBM = "lightgbm"
    CATBOOST = "catboost"
    HUGGINGFACE = "huggingface"
    ONNX = "onnx"
    CUSTOM = "custom"


class ModelStatus(str, enum.Enum):
    """Model status enumeration."""
    DRAFT = "draft"
    TRAINING = "training"
    TRAINED = "trained"
    VALIDATING = "validating"
    VALIDATED = "validated"
    DEPLOYING = "deploying"
    DEPLOYED = "deployed"
    SERVING = "serving"
    DEPRECATED = "deprecated"
    FAILED = "failed"
    ARCHIVED = "archived"


class AIModel(BaseModel, StatusMixin, SoftDeleteMixin, MetadataMixin):
    """AI Model entity."""
    
    __tablename__ = "ai_models"
    
    # Basic information
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )
    
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    version: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="1.0.0"
    )
    
    # Model classification
    model_type: Mapped[ModelType] = mapped_column(
        nullable=False,
        index=True
    )
    
    framework: Mapped[ModelFramework] = mapped_column(
        nullable=False
    )
    
    model_status: Mapped[ModelStatus] = mapped_column(
        nullable=False,
        default=ModelStatus.DRAFT,
        index=True
    )
    
    # Model files and storage
    model_path: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    
    model_size: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Model size in bytes"
    )
    
    model_hash: Mapped[Optional[str]] = mapped_column(
        String(64),
        nullable=True,
        comment="SHA-256 hash of model file"
    )
    
    # Training information
    training_dataset: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    
    training_parameters: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True
    )
    
    training_duration: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Training duration in seconds"
    )
    
    training_started_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    
    training_completed_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    
    # Model performance metrics
    accuracy: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True
    )
    
    precision: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True
    )
    
    recall: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True
    )
    
    f1_score: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True
    )
    
    loss: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True
    )
    
    custom_metrics: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True
    )
    
    # Deployment information
    deployment_endpoint: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    
    deployment_config: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True
    )
    
    deployed_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    
    # Usage statistics
    prediction_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )
    
    last_prediction_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    
    average_response_time: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="Average response time in milliseconds"
    )
    
    # Resource requirements
    memory_requirement: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Memory requirement in MB"
    )
    
    cpu_requirement: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="CPU requirement in cores"
    )
    
    gpu_requirement: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="GPU memory requirement in MB"
    )
    
    # Model lineage
    parent_model_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ai_models.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # Relationships
    parent_model = relationship("AIModel", remote_side="AIModel.id")
    experiments = relationship("Experiment", back_populates="model")
    predictions = relationship("Prediction", back_populates="model")


class Experiment(BaseModel, StatusMixin, SoftDeleteMixin, MetadataMixin):
    """ML Experiment tracking."""
    
    __tablename__ = "experiments"
    
    # Basic information
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )
    
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # Experiment configuration
    parameters: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True
    )
    
    # Results
    metrics: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True
    )
    
    artifacts: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True
    )
    
    # Timing
    started_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        nullable=True
    )
    
    duration: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Duration in seconds"
    )
    
    # Foreign keys
    model_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ai_models.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Relationships
    model = relationship("AIModel", back_populates="experiments")


class Prediction(BaseModel, SoftDeleteMixin):
    """Prediction tracking."""
    
    __tablename__ = "predictions"
    
    # Input data
    input_data: Mapped[dict] = mapped_column(
        JSON,
        nullable=False
    )
    
    # Output data
    output_data: Mapped[dict] = mapped_column(
        JSON,
        nullable=False
    )
    
    # Prediction metadata
    confidence: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True
    )
    
    response_time: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="Response time in milliseconds"
    )
    
    # Request information
    request_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
        index=True
    )
    
    user_agent: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    
    ip_address: Mapped[Optional[str]] = mapped_column(
        String(45),
        nullable=True
    )
    
    # Foreign keys
    model_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ai_models.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Relationships
    model = relationship("AIModel", back_populates="predictions")
