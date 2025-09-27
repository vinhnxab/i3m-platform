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
    APP_NAME: str = "AI Service"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "I3M Platform AI Service - Machine Learning and Artificial Intelligence"
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
    DATABASE_URL: str = "postgresql+asyncpg://i3m_user:i3m_password@postgres:5432/i3m_ai_db"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 0
    DATABASE_POOL_PRE_PING: bool = True
    DATABASE_ECHO: bool = False
    
    # Redis settings
    REDIS_URL: str = "redis://:i3m_password@redis:6379/6"
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
    CRM_SERVICE_URL: str = "http://crm-service:3015"
    
    # ML/AI specific settings
    MODEL_STORAGE_PATH: str = "/app/models"
    MODEL_CACHE_SIZE: int = 5  # Number of models to keep in memory
    
    # MLflow settings
    MLFLOW_TRACKING_URI: str = "http://mlflow:5000"
    MLFLOW_EXPERIMENT_NAME: str = "i3m_ai_experiments"
    
    # Model serving settings
    MAX_BATCH_SIZE: int = 32
    MODEL_TIMEOUT: int = 30  # seconds
    
    # File storage settings
    STORAGE_TYPE: str = "local"  # local, s3, minio
    STORAGE_BUCKET: str = "i3m-ai-models"
    STORAGE_ACCESS_KEY: Optional[str] = None
    STORAGE_SECRET_KEY: Optional[str] = None
    STORAGE_ENDPOINT: Optional[str] = None
    
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
    ENABLE_GPU: bool = False
    ENABLE_DISTRIBUTED_TRAINING: bool = False


# Create global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get application settings."""
    return settings
