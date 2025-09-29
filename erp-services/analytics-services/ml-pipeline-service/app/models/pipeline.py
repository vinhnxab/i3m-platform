"""ML Pipeline models."""

import enum
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List

from sqlalchemy import String, Text, Integer, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSON, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class PipelineStatus(str, enum.Enum):
    """Pipeline execution status enumeration."""
    DRAFT = "draft"
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PAUSED = "paused"
    RETRYING = "retrying"


class PipelineType(str, enum.Enum):
    """Pipeline type enumeration."""
    TRAINING = "training"
    INFERENCE = "inference"
    BATCH_PREDICTION = "batch_prediction"
    DATA_PREPROCESSING = "data_preprocessing"
    FEATURE_ENGINEERING = "feature_engineering"
    MODEL_EVALUATION = "model_evaluation"
    HYPERPARAMETER_TUNING = "hyperparameter_tuning"
    DATA_VALIDATION = "data_validation"
    CUSTOM = "custom"


class StepStatus(str, enum.Enum):
    """Pipeline step status enumeration."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"
    CANCELLED = "cancelled"


class Pipeline(Base):
    """ML Pipeline entity."""
    
    __tablename__ = "pipelines"
    
    # Primary key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    # Multi-tenancy
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True
    )
    
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
    
    # Pipeline classification
    pipeline_type: Mapped[PipelineType] = mapped_column(
        nullable=False,
        index=True
    )
    
    status: Mapped[PipelineStatus] = mapped_column(
        nullable=False,
        default=PipelineStatus.DRAFT,
        index=True
    )
    
    # Pipeline definition
    definition: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        nullable=False,
        comment="Pipeline definition in JSON format"
    )
    
    # Configuration
    config: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
        comment="Pipeline configuration parameters"
    )
    
    # Execution settings
    timeout: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Pipeline timeout in seconds"
    )
    
    retry_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=3
    )
    
    max_parallelism: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )
    
    # Resource requirements
    memory_limit: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Memory limit in MB"
    )
    
    cpu_limit: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="CPU limit in cores"
    )
    
    gpu_required: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False
    )
    
    # Scheduling
    is_scheduled: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False
    )
    
    cron_expression: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    
    next_run_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    # Tags and metadata
    tags: Mapped[Optional[List[str]]] = mapped_column(
        JSON,
        nullable=True
    )
    
    metadata_: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        "metadata",
        JSON,
        nullable=True
    )
    
    # Audit fields
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        nullable=True
    )
    
    updated_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        nullable=True
    )
    
    # Soft delete
    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        index=True
    )
    
    # Relationships
    executions = relationship("PipelineExecution", back_populates="pipeline")
    steps = relationship("PipelineStep", back_populates="pipeline")


class PipelineExecution(Base):
    """Pipeline execution tracking."""
    
    __tablename__ = "pipeline_executions"
    
    # Primary key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    # Multi-tenancy
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True
    )
    
    # Execution information
    execution_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
        comment="Unique execution identifier"
    )
    
    status: Mapped[PipelineStatus] = mapped_column(
        nullable=False,
        default=PipelineStatus.QUEUED,
        index=True
    )
    
    # Timing
    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    duration: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Execution duration in seconds"
    )
    
    # Results and metrics
    result: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True
    )
    
    metrics: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True
    )
    
    # Error information
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    error_details: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True
    )
    
    # Execution context
    execution_context: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True
    )
    
    # Artifacts
    artifacts: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True
    )
    
    # Logs
    log_path: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    
    # Resource usage
    memory_used: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Peak memory usage in MB"
    )
    
    cpu_used: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        comment="Average CPU usage"
    )
    
    # Retry information
    retry_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )
    
    # Audit fields
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    # Foreign keys
    pipeline_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pipelines.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Relationships
    pipeline = relationship("Pipeline", back_populates="executions")
    step_executions = relationship("StepExecution", back_populates="pipeline_execution")


class PipelineStep(Base):
    """Pipeline step definition."""
    
    __tablename__ = "pipeline_steps"
    
    # Primary key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    # Multi-tenancy
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True
    )
    
    # Step information
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    step_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )
    
    order: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    
    # Step configuration
    config: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        nullable=False
    )
    
    # Dependencies
    depends_on: Mapped[Optional[List[str]]] = mapped_column(
        JSON,
        nullable=True,
        comment="List of step names this step depends on"
    )
    
    # Conditional execution
    condition: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
        comment="Condition expression for step execution"
    )
    
    # Resource requirements
    memory_limit: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True
    )
    
    cpu_limit: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True
    )
    
    timeout: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True
    )
    
    # Retry settings
    retry_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=3
    )
    
    # Audit fields
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    # Foreign keys
    pipeline_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pipelines.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Relationships
    pipeline = relationship("Pipeline", back_populates="steps")
    step_executions = relationship("StepExecution", back_populates="step")


class StepExecution(Base):
    """Pipeline step execution tracking."""
    
    __tablename__ = "step_executions"
    
    # Primary key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    # Multi-tenancy
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False,
        index=True
    )
    
    # Step execution information
    status: Mapped[StepStatus] = mapped_column(
        nullable=False,
        default=StepStatus.PENDING,
        index=True
    )
    
    # Timing
    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    
    duration: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Step execution duration in seconds"
    )
    
    # Results
    result: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True
    )
    
    # Error information
    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    error_details: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True
    )
    
    # Logs
    log_output: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    # Resource usage
    memory_used: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True
    )
    
    cpu_used: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True
    )
    
    # Retry information
    retry_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0
    )
    
    # Audit fields
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow
    )
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    # Foreign keys
    pipeline_execution_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pipeline_executions.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    step_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("pipeline_steps.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Relationships
    pipeline_execution = relationship("PipelineExecution", back_populates="step_executions")
    step = relationship("PipelineStep", back_populates="step_executions")
