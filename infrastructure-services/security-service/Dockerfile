# Multi-stage build for Go
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install git for go mod download
RUN apk add --no-cache git

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Production stage
FROM alpine:latest

WORKDIR /app

# Install ca-certificates and curl for health checks
RUN apk --no-cache add ca-certificates curl

# Create non-root user
RUN addgroup -g 1001 -S security && \
    adduser -S security -u 1001 -G security

# Copy the binary from builder
COPY --from=builder /app/main .

# Change ownership
RUN chown -R security:security /app

USER security

EXPOSE 3040

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3040/health || exit 1

CMD ["./main"]
