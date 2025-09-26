"""Application configuration settings."""

import secrets
from typing import Any, Dict, List, Optional, Union

from pydantic import AnyHttpUrl, EmailStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore"
    )
    
    # Basic app settings
    APP_NAME: str = "ML Pipeline Service"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "I3M Platform ML Pipeline Service - Machine Learning Pipeline Orchestration"
    DEBUG: bool = False
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 3017
    WORKERS: int = 1
    
    # Security settings
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    
    # Database settings
    DATABASE_URL: str = "postgresql+asyncpg://i3m_user:i3m_password@postgres:5432/i3m_ml_pipeline_db"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 0
    DATABASE_POOL_PRE_PING: bool = True
    DATABASE_ECHO: bool = False
    
    # Redis settings
    REDIS_URL: str = "redis://:i3m_password@redis:6379/7"
    REDIS_POOL_SIZE: int = 10
    REDIS_CACHE_TTL: int = 3600  # 1 hour
    
    # CORS settings
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:8000"
    
    def get_cors_origins(self) -> List[str]:
        """Get parsed CORS origins as list."""
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]
        return self.BACKEND_CORS_ORIGINS
    
    # External service URLs
    AUTH_SERVICE_URL: str = "http://auth-service:3008"
    USER_SERVICE_URL: str = "http://user-service:3009"
    AI_SERVICE_URL: str = "http://ai-service:3016"
    
    # MLflow settings
    MLFLOW_TRACKING_URI: str = "http://mlflow:5000"
    MLFLOW_EXPERIMENT_NAME: str = "i3m_ml_pipelines"
    MLFLOW_ARTIFACT_ROOT: str = "s3://mlflow-artifacts"
    
    # Pipeline execution settings
    MAX_CONCURRENT_PIPELINES: int = 5
    PIPELINE_TIMEOUT: int = 3600  # 1 hour
    PIPELINE_RETRY_COUNT: int = 3
    
    # Celery settings (for async pipeline execution)
    CELERY_BROKER_URL: str = "redis://:i3m_password@redis:6379/8"
    CELERY_RESULT_BACKEND: str = "redis://:i3m_password@redis:6379/9"
    
    # File storage settings
    STORAGE_TYPE: str = "local"  # local, s3, minio
    STORAGE_BUCKET: str = "i3m-ml-pipelines"
    STORAGE_ACCESS_KEY: Optional[str] = None
    STORAGE_SECRET_KEY: Optional[str] = None
    STORAGE_ENDPOINT: Optional[str] = None
    
    # Pipeline workspace settings
    PIPELINE_WORKSPACE: str = "/app/workspace"
    PIPELINE_ARTIFACTS_PATH: str = "/app/artifacts"
    PIPELINE_LOGS_PATH: str = "/app/logs/pipelines"
    
    # Prefect settings (alternative orchestrator)
    PREFECT_API_URL: Optional[str] = None
    PREFECT_API_KEY: Optional[str] = None
    
    # Airflow settings (alternative orchestrator)
    AIRFLOW_API_URL: Optional[str] = None
    AIRFLOW_USERNAME: Optional[str] = None
    AIRFLOW_PASSWORD: Optional[str] = None
    
    # Logging settings
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # Rate limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # 1 minute
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # Business settings
    DEFAULT_TIMEZONE: str = "UTC"
    DEFAULT_LANGUAGE: str = "en"
    
    # Monitoring settings
    ENABLE_METRICS: bool = True
    METRICS_PATH: str = "/metrics"
    
    # Feature flags
    ENABLE_SWAGGER: bool = True
    ENABLE_REDOC: bool = True
    ENABLE_DISTRIBUTED_EXECUTION: bool = False
    ENABLE_GPU_SUPPORT: bool = False


# Create global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get application settings."""
    return settings
