# User Service Dockerfile
FROM maven:3.8.4-openjdk-17-slim AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src src
RUN mvn clean package -DskipTests

# Final stage
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Install curl for health checks
RUN apk --no-cache add curl

# Copy the JAR file from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Copy application.properties
COPY src/main/resources/application.properties application.properties

# Create a simple application.properties with Redis configuration
RUN echo "spring.redis.host=redis" > /app/application-redis.properties && \
    echo "spring.redis.port=6379" >> /app/application-redis.properties && \
    echo "spring.redis.password=i3m_password" >> /app/application-redis.properties && \
    echo "spring.redis.database=0" >> /app/application-redis.properties && \
    echo "server.port=3009" >> /app/application-redis.properties

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3009/actuator/health || exit 1

EXPOSE 3009
CMD ["java", "-jar", "app.jar", "--spring.redis.host=redis", "--spring.redis.port=6379", "--spring.redis.password=i3m_password", "--spring.redis.database=0", "--server.port=3009"]