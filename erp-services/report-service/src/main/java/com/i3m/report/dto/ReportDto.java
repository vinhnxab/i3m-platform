package com.i3m.report.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public class ReportDto {
    private UUID id;
    
    @NotBlank(message = "Report name is required")
    @Size(max = 200, message = "Report name must not exceed 200 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Tenant ID is required")
    private UUID tenantId;
    
    private String type; // FINANCIAL, OPERATIONAL, ANALYTICS, CUSTOM
    private String status; // DRAFT, PUBLISHED, ARCHIVED
    private String format; // PDF, EXCEL, CSV, JSON
    private Map<String, Object> parameters;
    private String query;
    private String template;
    private UUID createdBy;
    private UUID lastModifiedBy;
    private LocalDateTime scheduledAt;
    private String frequency; // DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY
    private boolean isPublic;
    private boolean isScheduled;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastGeneratedAt;
    
    // Constructors
    public ReportDto() {}
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }
    
    public Map<String, Object> getParameters() { return parameters; }
    public void setParameters(Map<String, Object> parameters) { this.parameters = parameters; }
    
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    
    public String getTemplate() { return template; }
    public void setTemplate(String template) { this.template = template; }
    
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    
    public UUID getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(UUID lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
    
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
    
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    
    public boolean isScheduled() { return isScheduled; }
    public void setScheduled(boolean isScheduled) { this.isScheduled = isScheduled; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getLastGeneratedAt() { return lastGeneratedAt; }
    public void setLastGeneratedAt(LocalDateTime lastGeneratedAt) { this.lastGeneratedAt = lastGeneratedAt; }
}
