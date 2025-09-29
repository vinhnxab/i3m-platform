# Content Service Dockerfile
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S content -u 1001

# Development stage
FROM base AS development

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs uploads && \
    chown -R content:nodejs /app

# Switch to non-root user
USER content

# Expose port
EXPOSE 3022

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3022/health || exit 1

# Start command
CMD ["dumb-init", "node", "src/app.js"]

# Production stage
FROM base AS production

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create necessary directories and set permissions
RUN mkdir -p logs uploads && \
    chown -R content:nodejs /app

# Switch to non-root user
USER content

# Expose port
EXPOSE 3022

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3022/health || exit 1

# Start command
CMD ["dumb-init", "node", "src/app.js"]
