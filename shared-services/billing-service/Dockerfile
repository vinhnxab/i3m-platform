# Multi-stage build for Java Spring Boot
FROM openjdk:17-jdk-alpine AS builder

WORKDIR /app

COPY pom.xml .
COPY src src

RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM openjdk:17-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl

RUN addgroup -g 1001 -S billing && adduser -S billing -u 1001 -G billing

COPY --from=builder /app/target/billing-service-*.jar app.jar
RUN chown -R billing:billing /app
USER billing

EXPOSE 3072
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3072/api/v1/billing/health || exit 1

CMD ["java", "-jar", "app.jar"]


