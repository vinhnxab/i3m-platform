# Multi-stage build for Java Spring Boot
FROM openjdk:17-jdk-alpine AS builder

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src src

# Install Maven
RUN apk add --no-cache maven

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:17-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S analytics && \
    adduser -S analytics -u 1001 -G analytics

# Copy the built JAR
COPY --from=builder /app/target/analytics-service-*.jar app.jar

# Change ownership
RUN chown -R analytics:analytics /app

USER analytics

EXPOSE 3019

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3019/api/v1/analytics/health || exit 1

CMD ["java", "-jar", "app.jar"]
