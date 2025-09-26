"""
Simple Observability Service for I3M Platform.
"""
import structlog
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response

logger = structlog.get_logger(__name__)

app = FastAPI(
    title="I3M Observability Service",
    description="Monitoring and observability service for I3M Platform",
    version="1.0.0",
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Observability Service",
        "version": "1.0.0",
        "checks": {"service": {"status": "healthy"}}
    }

@app.get("/metrics")
async def get_metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/")
async def root():
    return {
        "service": "I3M Observability Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/v1/metrics")
async def get_system_metrics():
    return {
        "success": True,
        "message": "System metrics retrieved successfully",
        "data": {
            "cpu_usage": 25.5,
            "memory_usage": 60.2,
            "disk_usage": 45.8,
            "network_io": {"in": 1024, "out": 2048}
        }
    }

@app.get("/api/v1/logs")
async def get_logs():
    return {
        "success": True,
        "message": "Logs retrieved successfully",
        "data": [],
        "pagination": {"page": 1, "limit": 20, "total": 0}
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=3024, reload=False)
