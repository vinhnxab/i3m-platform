# User Analytics Service Dockerfile
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r useranalytics && useradd -r -g useranalytics useranalytics

# Set working directory
WORKDIR /app

# Development stage
FROM base as development

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Change ownership to useranalytics user
RUN chown -R useranalytics:useranalytics /app

# Switch to non-root user
USER useranalytics

# Expose port
EXPOSE 3019

# Command for development
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3019", "--reload"]

# Production stage
FROM base as production

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p logs workspace artifacts uploads \
    && chown -R useranalytics:useranalytics /app

# Switch to non-root user
USER useranalytics

# Expose port
EXPOSE 3019

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3019/health || exit 1

# Command for production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3019", "--workers", "4"]
