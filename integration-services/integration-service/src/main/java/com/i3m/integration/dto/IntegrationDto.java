package com.i3m.integration.dto;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public class IntegrationDto {
    private UUID id;
    private UUID tenantId;
    private String name;
    private String type; // e.g., "API", "Database", "File", "Webhook"
    private String status; // e.g., "Active", "Inactive", "Error"
    private Map<String, Object> configuration;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IntegrationDto() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public IntegrationDto(UUID tenantId, String name, String type, String status, Map<String, Object> configuration, String description) {
        this();
        this.tenantId = tenantId;
        this.name = name;
        this.type = type;
        this.status = status;
        this.configuration = configuration;
        this.description = description;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, Object> getConfiguration() {
        return configuration;
    }

    public void setConfiguration(Map<String, Object> configuration) {
        this.configuration = configuration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
        return "IntegrationDto{" +
               "id=" + id +
               ", tenantId=" + tenantId +
               ", name='" + name + '\'' +
               ", type='" + type + '\'' +
               ", status='" + status + '\'' +
               ", configuration=" + configuration +
               ", description='" + description + '\'' +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}
