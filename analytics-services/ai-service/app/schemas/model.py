"""Pydantic schemas for AI Model data transfer and validation."""

import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any

from pydantic import BaseModel, Field, validator

from app.models.model import ModelType, ModelFramework, ModelStatus


class ModelBase(BaseModel):
    """Base schema for AI Model."""
    
    name: str = Field(..., min_length=1, max_length=255, description="Model name")
    description: Optional[str] = Field(None, description="Model description")
    version: str = Field("1.0.0", description="Model version")
    model_type: ModelType = Field(..., description="Type of the model")
    framework: ModelFramework = Field(..., description="ML framework used")
    training_dataset: Optional[str] = Field(None, description="Training dataset identifier")
    training_parameters: Optional[Dict[str, Any]] = Field(None, description="Training parameters")
    deployment_config: Optional[Dict[str, Any]] = Field(None, description="Deployment configuration")
    memory_requirement: Optional[int] = Field(None, ge=0, description="Memory requirement in MB")
    cpu_requirement: Optional[float] = Field(None, ge=0, description="CPU requirement in cores")
    gpu_requirement: Optional[int] = Field(None, ge=0, description="GPU memory requirement in MB")
    parent_model_id: Optional[uuid.UUID] = Field(None, description="Parent model ID for lineage")
    tags: Optional[List[str]] = Field(None, description="Model tags")
    notes: Optional[str] = Field(None, description="Additional notes")


class ModelCreate(ModelBase):
    """Schema for creating a new AI Model."""
    pass


class ModelUpdate(BaseModel):
    """Schema for updating an AI Model."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    version: Optional[str] = None
    model_status: Optional[ModelStatus] = None
    training_parameters: Optional[Dict[str, Any]] = None
    deployment_config: Optional[Dict[str, Any]] = None
    memory_requirement: Optional[int] = Field(None, ge=0)
    cpu_requirement: Optional[float] = Field(None, ge=0)
    gpu_requirement: Optional[int] = Field(None, ge=0)
    tags: Optional[List[str]] = None
    notes: Optional[str] = None


class ModelResponse(ModelBase):
    """Schema for AI Model response."""
    
    id: uuid.UUID
    tenant_id: uuid.UUID
    model_status: ModelStatus
    model_path: Optional[str]
    model_size: Optional[int]
    model_hash: Optional[str]
    
    # Training information
    training_duration: Optional[int]
    training_started_at: Optional[datetime]
    training_completed_at: Optional[datetime]
    
    # Performance metrics
    accuracy: Optional[float]
    precision: Optional[float]
    recall: Optional[float]
    f1_score: Optional[float]
    loss: Optional[float]
    custom_metrics: Optional[Dict[str, Any]]
    
    # Deployment information
    deployment_endpoint: Optional[str]
    deployed_at: Optional[datetime]
    
    # Usage statistics
    prediction_count: int
    last_prediction_at: Optional[datetime]
    average_response_time: Optional[float]
    
    # Audit fields
    created_at: datetime
    updated_at: datetime
    created_by: Optional[uuid.UUID]
    updated_by: Optional[uuid.UUID]
    
    # Status and metadata
    status: str
    is_deleted: bool
    metadata_: Optional[Dict[str, Any]] = Field(None, alias="metadata")
    
    class Config:
        from_attributes = True
        populate_by_name = True


class ModelListItem(BaseModel):
    """Schema for AI Model list item."""
    
    id: uuid.UUID
    name: str
    description: Optional[str]
    version: str
    model_type: ModelType
    framework: ModelFramework
    model_status: ModelStatus
    accuracy: Optional[float]
    prediction_count: int
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


class ModelsResponse(BaseModel):
    """Schema for paginated models response."""
    
    success: bool = True
    message: str = "Models retrieved successfully"
    data: List[ModelListItem]
    pagination: PaginationInfo


class ModelSingleResponse(BaseModel):
    """Schema for single model response."""
    
    success: bool = True
    message: str = "Model retrieved successfully"
    data: ModelResponse


# Experiment schemas
class ExperimentBase(BaseModel):
    """Base schema for Experiment."""
    
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None


class ExperimentCreate(ExperimentBase):
    """Schema for creating a new Experiment."""
    
    model_id: uuid.UUID


class ExperimentUpdate(BaseModel):
    """Schema for updating an Experiment."""
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    metrics: Optional[Dict[str, Any]] = None
    artifacts: Optional[Dict[str, Any]] = None


class ExperimentResponse(ExperimentBase):
    """Schema for Experiment response."""
    
    id: uuid.UUID
    tenant_id: uuid.UUID
    model_id: uuid.UUID
    metrics: Optional[Dict[str, Any]]
    artifacts: Optional[Dict[str, Any]]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    duration: Optional[int]
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Prediction schemas
class PredictionRequest(BaseModel):
    """Schema for prediction request."""
    
    input_data: Dict[str, Any] = Field(..., description="Input data for prediction")
    model_id: Optional[uuid.UUID] = Field(None, description="Specific model ID to use")
    return_confidence: bool = Field(False, description="Return confidence score")


class PredictionResponse(BaseModel):
    """Schema for prediction response."""
    
    success: bool = True
    message: str = "Prediction completed successfully"
    data: Dict[str, Any]
    confidence: Optional[float] = None
    model_id: uuid.UUID
    response_time: Optional[float] = None
    request_id: Optional[str] = None


class PredictionHistoryResponse(BaseModel):
    """Schema for prediction history response."""
    
    id: uuid.UUID
    model_id: uuid.UUID
    input_data: Dict[str, Any]
    output_data: Dict[str, Any]
    confidence: Optional[float]
    response_time: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Training schemas
class TrainingRequest(BaseModel):
    """Schema for model training request."""
    
    model_id: uuid.UUID
    training_data: Dict[str, Any] = Field(..., description="Training data configuration")
    parameters: Optional[Dict[str, Any]] = Field(None, description="Training parameters")
    validation_split: float = Field(0.2, ge=0.0, le=0.5, description="Validation data split ratio")


class TrainingResponse(BaseModel):
    """Schema for training response."""
    
    success: bool = True
    message: str = "Training started successfully"
    training_id: uuid.UUID
    estimated_duration: Optional[int] = None
