"""Template Marketplace Service for I3M Platform."""
from fastapi import FastAPI, HTTPException, Header, Query
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response
from typing import Optional, List
import uuid
from datetime import datetime

app = FastAPI(title="I3M Template Marketplace Service", version="1.0.0")

# Mock data for demonstration
templates = [
    {
        "id": "template-1",
        "name": "Business Dashboard Template",
        "description": "Professional business dashboard with analytics charts",
        "category": "business",
        "author": {"name": "John Doe", "email": "john@example.com"},
        "pricing": {"type": "free", "price": 0},
        "status": "approved",
        "featured": True,
        "ratings": {"average": 4.5, "count": 25},
        "downloadCount": 150,
        "created_at": "2023-01-01T00:00:00Z"
    },
    {
        "id": "template-2", 
        "name": "E-commerce Store Template",
        "description": "Modern e-commerce template with shopping cart",
        "category": "ecommerce",
        "author": {"name": "Jane Smith", "email": "jane@example.com"},
        "pricing": {"type": "paid", "price": 49.99},
        "status": "approved",
        "featured": True,
        "ratings": {"average": 4.8, "count": 40},
        "downloadCount": 200,
        "created_at": "2023-01-15T00:00:00Z"
    }
]

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Template Marketplace Service", "version": "1.0.0"}

@app.get("/metrics")
async def get_metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/")
async def root():
    return {"service": "I3M Template Marketplace Service", "version": "1.0.0", "status": "running"}

@app.get("/api/v1/templates")
async def get_templates(
    x_tenant_id: Optional[str] = Header(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None)
):
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="Tenant ID is required")
    
    filtered_templates = templates.copy()
    
    if category:
        filtered_templates = [t for t in filtered_templates if t["category"] == category]
    
    if featured is not None:
        filtered_templates = [t for t in filtered_templates if t["featured"] == featured]
    
    total = len(filtered_templates)
    start = (page - 1) * limit
    end = start + limit
    page_templates = filtered_templates[start:end]
    
    return {
        "success": True,
        "message": "Templates retrieved successfully",
        "data": page_templates,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": (total + limit - 1) // limit,
            "hasNext": end < total,
            "hasPrev": page > 1
        }
    }

@app.get("/api/v1/templates/featured")
async def get_featured_templates(
    x_tenant_id: Optional[str] = Header(None),
    limit: int = Query(10, ge=1, le=50)
):
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="Tenant ID is required")
    
    featured_templates = [t for t in templates if t["featured"]][:limit]
    
    return {
        "success": True,
        "message": "Featured templates retrieved successfully", 
        "data": featured_templates
    }

@app.get("/api/v1/templates/{template_id}")
async def get_template(
    template_id: str,
    x_tenant_id: Optional[str] = Header(None)
):
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="Tenant ID is required")
    
    template = next((t for t in templates if t["id"] == template_id), None)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return {
        "success": True,
        "message": "Template retrieved successfully",
        "data": template
    }

@app.post("/api/v1/templates")
async def create_template(
    template_data: dict,
    x_tenant_id: Optional[str] = Header(None)
):
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="Tenant ID is required")
    
    new_template = {
        "id": str(uuid.uuid4()),
        "tenant_id": x_tenant_id,
        "name": template_data.get("name", ""),
        "description": template_data.get("description", ""),
        "category": template_data.get("category", "other"),
        "author": template_data.get("author", {}),
        "pricing": template_data.get("pricing", {"type": "free", "price": 0}),
        "status": "pending",
        "featured": False,
        "ratings": {"average": 0, "count": 0},
        "downloadCount": 0,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    
    templates.append(new_template)
    
    return {
        "success": True,
        "message": "Template created successfully",
        "data": new_template
    }

@app.post("/api/v1/templates/{template_id}/download")
async def download_template(
    template_id: str,
    x_tenant_id: Optional[str] = Header(None)
):
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="Tenant ID is required")
    
    template = next((t for t in templates if t["id"] == template_id), None)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Increment download count
    template["downloadCount"] += 1
    
    return {
        "success": True,
        "message": "Template download initiated",
        "data": {
            "downloadUrl": f"/downloads/{template_id}.zip",
            "fileName": f"{template['name']}.zip"
        }
    }

@app.get("/api/v1/templates/categories/{category}")
async def get_templates_by_category(
    category: str,
    x_tenant_id: Optional[str] = Header(None),
    limit: int = Query(20, ge=1, le=100)
):
    if not x_tenant_id:
        raise HTTPException(status_code=400, detail="Tenant ID is required")
    
    category_templates = [t for t in templates if t["category"] == category][:limit]
    
    return {
        "success": True,
        "message": f"Templates in {category} category retrieved successfully",
        "data": category_templates
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=3028, reload=False)
