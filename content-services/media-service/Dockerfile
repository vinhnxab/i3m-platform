# Media Service Dockerfile
FROM node:18-alpine AS base

WORKDIR /app

RUN apk add --no-cache dumb-init curl

RUN addgroup -g 1001 -S nodejs && \
    adduser -S media -u 1001

FROM base AS production

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN mkdir -p logs uploads && \
    chown -R media:nodejs /app

USER media

EXPOSE 3021

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3021/health || exit 1

CMD ["dumb-init", "node", "src/app.js"]
