# Multi-stage build for Java Spring Boot
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

COPY pom.xml .
COPY src src

RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl

RUN addgroup -g 1001 -S workflow && adduser -S workflow -u 1001 -G workflow

COPY --from=builder /app/target/workflow-service-*.jar app.jar
RUN chown -R workflow:workflow /app
USER workflow

EXPOSE 3071
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3071/api/v1/workflow/health || exit 1

CMD ["java", "-jar", "app.jar"]


