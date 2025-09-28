package com.i3m.integration.dto;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public class DataSyncDto {
    private UUID id;
    private UUID tenantId;
    private String sourceSystem;
    private String targetSystem;
    private String syncType; // full, incremental, real-time
    private Map<String, Object> mapping;
    private String status; // pending, running, completed, failed
    private LocalDateTime lastSync;
    private LocalDateTime nextSync;
    private String errorMessage;

    public DataSyncDto() {
        this.id = UUID.randomUUID();
        this.lastSync = LocalDateTime.now();
    }

    public DataSyncDto(UUID tenantId, String sourceSystem, String targetSystem, String syncType, Map<String, Object> mapping, String status) {
        this();
        this.tenantId = tenantId;
        this.sourceSystem = sourceSystem;
        this.targetSystem = targetSystem;
        this.syncType = syncType;
        this.mapping = mapping;
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

    public Map<String, Object> getMapping() {
        return mapping;
    }

    public void setMapping(Map<String, Object> mapping) {
        this.mapping = mapping;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getLastSync() {
        return lastSync;
    }

    public void setLastSync(LocalDateTime lastSync) {
        this.lastSync = lastSync;
    }

    public LocalDateTime getNextSync() {
        return nextSync;
    }

    public void setNextSync(LocalDateTime nextSync) {
        this.nextSync = nextSync;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    @Override
    public String toString() {
        return "DataSyncDto{" +
               "id=" + id +
               ", tenantId=" + tenantId +
               ", sourceSystem='" + sourceSystem + '\'' +
               ", targetSystem='" + targetSystem + '\'' +
               ", syncType='" + syncType + '\'' +
               ", mapping=" + mapping +
               ", status='" + status + '\'' +
               ", lastSync=" + lastSync +
               ", nextSync=" + nextSync +
               ", errorMessage='" + errorMessage + '\'' +
               '}';
    }
}