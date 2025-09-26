# Multi-stage build for Go
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Production stage
FROM alpine:latest

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S installation && \
    adduser -S installation -u 1001 -G installation

# Copy the binary
COPY --from=builder /app/main .

# Change ownership
RUN chown -R installation:installation /app

USER installation

EXPOSE 3061

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3061/api/v1/health || exit 1

CMD ["./main"]
