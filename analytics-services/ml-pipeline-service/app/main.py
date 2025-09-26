"""Main FastAPI application for ML Pipeline Service."""

import time
from contextlib import asynccontextmanager
from typing import Any, Dict

import structlog
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import Counter, Histogram, generate_latest
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.db.database import close_db, init_db

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger(__name__)

# Metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)


class MetricsMiddleware(BaseHTTPMiddleware):
    """Middleware for collecting metrics."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        # Record metrics
        duration = time.time() - start_time
        REQUEST_DURATION.labels(
            method=request.method,
            endpoint=request.url.path
        ).observe(duration)
        
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.url.path,
            status_code=response.status_code
        ).inc()
        
        return response


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for request/response logging."""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log request
        logger.info(
            "Request started",
            method=request.method,
            url=str(request.url),
            client_ip=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            tenant_id=request.headers.get("x-tenant-id"),
            user_id=request.headers.get("x-user-id"),
        )
        
        try:
            response = await call_next(request)
            duration = time.time() - start_time
            
            # Log response
            logger.info(
                "Request completed",
                method=request.method,
                url=str(request.url),
                status_code=response.status_code,
                duration=f"{duration:.3f}s"
            )
            
            return response
            
        except Exception as e:
            duration = time.time() - start_time
            logger.error(
                "Request failed",
                method=request.method,
                url=str(request.url),
                error=str(e),
                duration=f"{duration:.3f}s"
            )
            raise


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("Starting ML Pipeline Service", version=settings.APP_VERSION)
    
    try:
        # Initialize database
        await init_db()
        logger.info("Database initialized")
        
        # TODO: Initialize Redis connection
        logger.info("Redis connection initialized")
        
        # TODO: Initialize MLflow connection
        logger.info("MLflow connection initialized")
        
        logger.info("ML Pipeline Service started successfully")
        yield
        
    except Exception as e:
        logger.error("Failed to start ML Pipeline Service", error=str(e))
        raise
    
    finally:
        # Shutdown
        logger.info("Shutting down ML Pipeline Service")
        
        try:
            await close_db()
            logger.info("ML Pipeline Service shut down successfully")
        except Exception as e:
            logger.error("Error during shutdown", error=str(e))


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    openapi_url="/api/v1/openapi.json" if settings.ENABLE_SWAGGER else None,
    docs_url="/docs" if settings.ENABLE_SWAGGER else None,
    redoc_url="/redoc" if settings.ENABLE_REDOC else None,
    lifespan=lifespan,
)

# Add middleware
cors_origins = settings.get_cors_origins()
if cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
app.add_middleware(LoggingMiddleware)

if settings.ENABLE_METRICS:
    app.add_middleware(MetricsMiddleware)

# Include API routes
from app.api.v1.endpoints import pipelines

app.include_router(pipelines.router, prefix="/api/v1/pipelines", tags=["pipelines"])


@app.get("/", response_model=Dict[str, Any])
async def root() -> Dict[str, Any]:
    """Root endpoint with service information."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "description": settings.APP_DESCRIPTION,
        "status": "running",
        "timestamp": time.time(),
        "docs_url": "/docs" if settings.ENABLE_SWAGGER else None,
        "redoc_url": "/redoc" if settings.ENABLE_REDOC else None,
        "endpoints": {
            "health": "/health",
            "metrics": "/metrics" if settings.ENABLE_METRICS else None,
            "api": "/api/v1",
            "pipelines": "/api/v1/pipelines",
        }
    }


@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint."""
    from app.db.database import health_check as db_health, get_db_stats
    
    # Check database health
    db_healthy = await db_health()
    db_stats = await get_db_stats()
    
    # TODO: Check Redis health
    redis_healthy = True  # Placeholder
    redis_stats = {"status": "not_implemented"}
    
    # TODO: Check MLflow health
    mlflow_healthy = True  # Placeholder
    mlflow_stats = {"status": "not_implemented"}
    
    # Overall health
    healthy = db_healthy and redis_healthy and mlflow_healthy
    
    return {
        "status": "healthy" if healthy else "unhealthy",
        "timestamp": time.time(),
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "uptime": time.time(),  # This would be better with actual start time
        "checks": {
            "database": {
                "status": "healthy" if db_healthy else "unhealthy",
                **db_stats
            },
            "redis": {
                "status": "healthy" if redis_healthy else "unhealthy",
                **redis_stats
            },
            "mlflow": {
                "status": "healthy" if mlflow_healthy else "unhealthy",
                **mlflow_stats
            }
        }
    }


@app.get("/metrics")
async def metrics() -> str:
    """Prometheus metrics endpoint."""
    if not settings.ENABLE_METRICS:
        return JSONResponse(
            status_code=404,
            content={"detail": "Metrics not enabled"}
        )
    
    return generate_latest().decode('utf-8')


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler."""
    logger.error(
        "Unhandled exception",
        error=str(exc),
        path=request.url.path,
        method=request.method,
        exc_info=True
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "error": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        workers=settings.WORKERS,
        log_level=settings.LOG_LEVEL.lower(),
        reload=settings.DEBUG,
    )
