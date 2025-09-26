FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN adduser --system --group observability
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chown -R observability:observability /app
USER observability
EXPOSE 3024
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3024/health || exit 1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3024"]
