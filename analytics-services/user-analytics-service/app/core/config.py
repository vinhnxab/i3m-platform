"""
Configuration settings for User Analytics Service.
"""
import os
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""
    
    # Basic settings
    DEBUG: bool = False
    TESTING: bool = False
    
    # Database settings
    DATABASE_URL: str = "postgresql+asyncpg://i3m_user:i3m_password@postgres:5432/i3m_user_analytics_db"
    
    # Redis settings
    REDIS_URL: str = "redis://:i3m_password@redis:6379/11"
    REDIS_POOL_SIZE: int = 10
    
    # JWT settings
    SECRET_KEY: str = "supersecretuseranalyticssecretkey"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",
    ]
    
    def get_cors_origins(self) -> List[str]:
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            if not self.BACKEND_CORS_ORIGINS.strip():
                return ["http://localhost:3000"]
            if self.BACKEND_CORS_ORIGINS.startswith("[") and self.BACKEND_CORS_ORIGINS.endswith("]"):
                try:
                    import json
                    return json.loads(self.BACKEND_CORS_ORIGINS)
                except json.JSONDecodeError:
                    return [i.strip().strip('"').strip("'") for i in self.BACKEND_CORS_ORIGINS[1:-1].split(",") if i.strip()]
            else:
                return [i.strip() for i in self.BACKEND_CORS_ORIGINS.split(",") if i.strip()]
        return self.BACKEND_CORS_ORIGINS
    
    # Service URLs
    AUTH_SERVICE_URL: str = "http://auth-service:3008"
    USER_SERVICE_URL: str = "http://user-service:3009"
    ANALYTICS_SERVICE_URL: str = "http://analytics-service:3018"
    
    # Object Storage settings
    S3_BUCKET: str = "i3m-user-analytics-bucket"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_ENDPOINT: str = "http://minio:9000"
    
    # User Analytics settings
    DEFAULT_TRACKING_WINDOW_DAYS: int = 30
    SESSION_TIMEOUT_MINUTES: int = 30
    MAX_EVENTS_PER_REQUEST: int = 1000
    CACHE_TTL_SECONDS: int = 300  # 5 minutes
    
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")


settings = Settings()
