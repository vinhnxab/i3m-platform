package com.i3m.integration.dto;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public class DataSyncDto {
    private UUID id;
    private UUID tenantId;
    private String sourceSystem;
    private String targetSystem;
    private String syncType; // e.g., "Full", "Incremental", "Real-time"
    private String status; // e.g., "Running", "Completed", "Failed", "Scheduled"
    private Map<String, Object> configuration;
    private LocalDateTime lastSyncAt;
    private LocalDateTime nextSyncAt;
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DataSyncDto() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public DataSyncDto(UUID tenantId, String sourceSystem, String targetSystem, String syncType, String status, Map<String, Object> configuration) {
        this();
        this.tenantId = tenantId;
        this.sourceSystem = sourceSystem;
        this.targetSystem = targetSystem;
        this.syncType = syncType;
        this.status = status;
        this.configuration = configuration;
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

    public String getSourceSystem() {
        return sourceSystem;
    }

    public void setSourceSystem(String sourceSystem) {
        this.sourceSystem = sourceSystem;
    }

    public String getTargetSystem() {
        return targetSystem;
    }

    public void setTargetSystem(String targetSystem) {
        this.targetSystem = targetSystem;
    }

    public String getSyncType() {
        return syncType;
    }

    public void setSyncType(String syncType) {
        this.syncType = syncType;
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

    public LocalDateTime getLastSyncAt() {
        return lastSyncAt;
    }

    public void setLastSyncAt(LocalDateTime lastSyncAt) {
        this.lastSyncAt = lastSyncAt;
    }

    public LocalDateTime getNextSyncAt() {
        return nextSyncAt;
    }

    public void setNextSyncAt(LocalDateTime nextSyncAt) {
        this.nextSyncAt = nextSyncAt;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
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
        return "DataSyncDto{" +
               "id=" + id +
               ", tenantId=" + tenantId +
               ", sourceSystem='" + sourceSystem + '\'' +
               ", targetSystem='" + targetSystem + '\'' +
               ", syncType='" + syncType + '\'' +
               ", status='" + status + '\'' +
               ", configuration=" + configuration +
               ", lastSyncAt=" + lastSyncAt +
               ", nextSyncAt=" + nextSyncAt +
               ", errorMessage='" + errorMessage + '\'' +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}
