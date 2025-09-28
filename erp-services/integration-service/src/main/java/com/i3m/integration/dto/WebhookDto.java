package com.i3m.integration.dto;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public class WebhookDto {
    private UUID id;
    private UUID tenantId;
    private String name;
    private String url;
    private String method; // GET, POST, PUT, DELETE
    private Map<String, String> headers;
    private String payload;
    private String status; // active, inactive, error
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public WebhookDto() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public WebhookDto(UUID tenantId, String name, String url, String method, Map<String, String> headers, String payload, String status) {
        this();
        this.tenantId = tenantId;
        this.name = name;
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.payload = payload;
        this.status = status;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<String, String> headers) {
        this.headers = headers;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "WebhookDto{" +
               "id=" + id +
               ", tenantId=" + tenantId +
               ", name='" + name + '\'' +
               ", url='" + url + '\'' +
               ", method='" + method + '\'' +
               ", headers=" + headers +
               ", payload='" + payload + '\'' +
               ", status='" + status + '\'' +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}