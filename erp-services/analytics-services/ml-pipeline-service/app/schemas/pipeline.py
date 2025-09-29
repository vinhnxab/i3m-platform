"""Pydantic schemas for ML Pipeline data transfer and validation."""

import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any

from pydantic import BaseModel, Field, validator

from app.models.pipeline import PipelineType, PipelineStatus, StepStatus


class PipelineBase(BaseModel):
    """Base schema for ML Pipeline."""
    
    name: str = Field(..., min_length=1, max_length=255, description="Pipeline name")
    description: Optional[str] = Field(None, description="Pipeline description")
    version: str = Field("1.0.0", description="Pipeline version")
    pipeline_type: PipelineType = Field(..., description="Type of the pipeline")
    definition: Dict[str, Any] = Field(..., description="Pipeline definition")
    config: Optional[Dict[str, Any]] = Field(None, description="Pipeline configuration")
    timeout: Optional[int] = Field(None, ge=0, description="Pipeline timeout in seconds")
    retry_count: int = Field(3, ge=0, le=10, description="Number of retries")
    max_parallelism: int = Field(1, ge=1, le=10, description="Maximum parallel steps")
    memory_limit: Optional[int] = Field(None, ge=0, description="Memory limit in MB")
    cpu_limit: Optional[float] = Field(None, ge=0, description="CPU limit in cores")
    gpu_required: bool = Field(False, description="Whether GPU is required")
    is_scheduled: bool = Field(False, description="Whether pipeline is scheduled")
    cron_expression: Optional[str] = Field(None, description="Cron expression for scheduling")
    tags: Optional[List[str]] = Field(None, description="Pipeline tags")
    metadata_: Optional[Dict[str, Any]] = Field(None, alias="metadata", description="Additional metadata")


class PipelineCreate(PipelineBase):
    """Schema for creating a new ML Pipeline."""
    pass


class PipelineUpdate(BaseModel):
    """Schema for updating an ML Pipeline."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    version: Optional[str] = None
    status: Optional[PipelineStatus] = None
    definition: Optional[Dict[str, Any]] = None
    config: Optional[Dict[str, Any]] = None
    timeout: Optional[int] = Field(None, ge=0)
    retry_count: Optional[int] = Field(None, ge=0, le=10)
    max_parallelism: Optional[int] = Field(None, ge=1, le=10)
    memory_limit: Optional[int] = Field(None, ge=0)
    cpu_limit: Optional[float] = Field(None, ge=0)
    gpu_required: Optional[bool] = None
    is_scheduled: Optional[bool] = None
    cron_expression: Optional[str] = None
    tags: Optional[List[str]] = None
    metadata_: Optional[Dict[str, Any]] = Field(None, alias="metadata")


class PipelineResponse(PipelineBase):
    """Schema for ML Pipeline response."""
    
    id: uuid.UUID
    tenant_id: uuid.UUID
    status: PipelineStatus
    next_run_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    created_by: Optional[uuid.UUID]
    updated_by: Optional[uuid.UUID]
    is_deleted: bool
    
    class Config:
        from_attributes = True
        populate_by_name = True


class PipelineListItem(BaseModel):
    """Schema for Pipeline list item."""
    
    id: uuid.UUID
    name: str
    description: Optional[str]
    version: str
    pipeline_type: PipelineType
    status: PipelineStatus
    is_scheduled: bool
    next_run_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PaginationInfo(BaseModel):
    """Pagination information schema."""
    
    page: int = Field(..., ge=1)
    page_size: int = Field(..., ge=1, le=100)
    total_items: int = Field(..., ge=0)
    total_pages: int = Field(..., ge=0)
    has_next: bool
    has_prev: bool


class PipelinesResponse(BaseModel):
    """Schema for paginated pipelines response."""
    
    success: bool = True
    message: str = "Pipelines retrieved successfully"
    data: List[PipelineListItem]
    pagination: PaginationInfo


class PipelineSingleResponse(BaseModel):
    """Schema for single pipeline response."""
    
    success: bool = True
    message: str = "Pipeline retrieved successfully"
    data: PipelineResponse


# Pipeline Execution schemas
class ExecutionRequest(BaseModel):
    """Schema for pipeline execution request."""
    
    pipeline_id: uuid.UUID
    config_override: Optional[Dict[str, Any]] = Field(None, description="Override pipeline config")
    context: Optional[Dict[str, Any]] = Field(None, description="Execution context")
    priority: int = Field(0, ge=0, le=10, description="Execution priority")


class ExecutionResponse(BaseModel):
    """Schema for pipeline execution response."""
    
    success: bool = True
    message: str = "Pipeline execution started"
    data: Dict[str, Any]
    execution_id: str


class ExecutionStatus(BaseModel):
    """Schema for execution status."""
    
    id: uuid.UUID
    execution_id: str
    pipeline_id: uuid.UUID
    status: PipelineStatus
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    duration: Optional[int]
    result: Optional[Dict[str, Any]]
    metrics: Optional[Dict[str, Any]]
    error_message: Optional[str]
    retry_count: int
    
    class Config:
        from_attributes = True


class ExecutionHistoryResponse(BaseModel):
    """Schema for execution history response."""
    
    success: bool = True
    message: str = "Execution history retrieved successfully"
    data: List[ExecutionStatus]
    pagination: PaginationInfo


# Pipeline Step schemas
class StepBase(BaseModel):
    """Base schema for Pipeline Step."""
    
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    step_type: str = Field(..., min_length=1, max_length=100)
    order: int = Field(..., ge=0)
    config: Dict[str, Any] = Field(..., description="Step configuration")
    depends_on: Optional[List[str]] = Field(None, description="Dependencies")
    condition: Optional[str] = Field(None, description="Execution condition")
    memory_limit: Optional[int] = Field(None, ge=0)
    cpu_limit: Optional[float] = Field(None, ge=0)
    timeout: Optional[int] = Field(None, ge=0)
    retry_count: int = Field(3, ge=0, le=10)


class StepCreate(StepBase):
    """Schema for creating a pipeline step."""
    
    pipeline_id: uuid.UUID


class StepUpdate(BaseModel):
    """Schema for updating a pipeline step."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    step_type: Optional[str] = Field(None, min_length=1, max_length=100)
    order: Optional[int] = Field(None, ge=0)
    config: Optional[Dict[str, Any]] = None
    depends_on: Optional[List[str]] = None
    condition: Optional[str] = None
    memory_limit: Optional[int] = Field(None, ge=0)
    cpu_limit: Optional[float] = Field(None, ge=0)
    timeout: Optional[int] = Field(None, ge=0)
    retry_count: Optional[int] = Field(None, ge=0, le=10)


class StepResponse(StepBase):
    """Schema for Pipeline Step response."""
    
    id: uuid.UUID
    tenant_id: uuid.UUID
    pipeline_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class StepExecutionResponse(BaseModel):
    """Schema for step execution response."""
    
    id: uuid.UUID
    step_id: uuid.UUID
    pipeline_execution_id: uuid.UUID
    status: StepStatus
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    duration: Optional[int]
    result: Optional[Dict[str, Any]]
    error_message: Optional[str]
    log_output: Optional[str]
    memory_used: Optional[int]
    cpu_used: Optional[float]
    retry_count: int
    
    class Config:
        from_attributes = True


# Pipeline Statistics schemas
class PipelineStats(BaseModel):
    """Schema for pipeline statistics."""
    
    total_pipelines: int
    active_pipelines: int
    scheduled_pipelines: int
    total_executions: int
    successful_executions: int
    failed_executions: int
    average_execution_time: Optional[float]
    pipelines_by_type: Dict[str, int]
    executions_by_status: Dict[str, int]


class PipelineStatsResponse(BaseModel):
    """Schema for pipeline stats response."""
    
    success: bool = True
    message: str = "Pipeline statistics retrieved successfully"
    data: PipelineStats
