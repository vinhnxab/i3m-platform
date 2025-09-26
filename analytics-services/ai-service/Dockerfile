# Multi-stage build for AI Service
FROM python:3.11-slim as base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r ai && useradd -r -g ai ai

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
FROM base as dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM dependencies as production

# Copy application code
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p logs models uploads \
    && chown -R ai:ai /app

# Switch to non-root user
USER ai

# Expose port
EXPOSE 3016

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3016/health || exit 1

# Run the application
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3016"]
