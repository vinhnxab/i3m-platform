# Multi-stage build for ML Pipeline Service
FROM python:3.11-slim as base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r mlpipeline && useradd -r -g mlpipeline mlpipeline

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
RUN mkdir -p logs workspace artifacts uploads \
    && chown -R mlpipeline:mlpipeline /app

# Switch to non-root user
USER mlpipeline

# Expose port
EXPOSE 3018

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3018/health || exit 1

# Run the application
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3018"]
