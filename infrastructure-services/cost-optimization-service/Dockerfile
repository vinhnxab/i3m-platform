# Multi-stage build for Go
FROM golang:1.21-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Production stage
FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates curl

RUN addgroup -g 1001 -S costopt && \
    adduser -S costopt -u 1001 -G costopt

COPY --from=builder /app/main .
RUN chown -R costopt:costopt /app

USER costopt

EXPOSE 3042

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3042/health || exit 1

CMD ["./main"]
