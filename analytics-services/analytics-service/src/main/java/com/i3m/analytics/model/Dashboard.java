package com.i3m.analytics.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dashboards", schema = "analytics")
public class Dashboard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @NotNull
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "layout", columnDefinition = "TEXT")
    private String layout; // JSON string for dashboard layout
    
    @Column(name = "widgets", columnDefinition = "TEXT")
    private String widgets; // JSON array of widget configurations
    
    @Column(name = "filters", columnDefinition = "TEXT")
    private String filters; // JSON object of applied filters
    
    @NotNull
    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = false;
    
    @Column(name = "owner_id")
    private UUID ownerId;
    
    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // JSON array of tags
    
    @Column(name = "refresh_interval_seconds")
    private Integer refreshIntervalSeconds = 300; // 5 minutes default
    
    @Column(name = "auto_refresh")
    private Boolean autoRefresh = true;
    
    @NotNull
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private DashboardStatus status = DashboardStatus.ACTIVE;
    
    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;
    
    @Column(name = "view_count")
    private Long viewCount = 0L;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private UUID createdBy;
    
    @Column(name = "updated_by")
    private UUID updatedBy;
    
    public enum DashboardStatus {
        ACTIVE, INACTIVE, ARCHIVED, DRAFT
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Dashboard() {}
    
    public Dashboard(UUID tenantId, String name) {
        this.tenantId = tenantId;
        this.name = name;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getLayout() { return layout; }
    public void setLayout(String layout) { this.layout = layout; }
    
    public String getWidgets() { return widgets; }
    public void setWidgets(String widgets) { this.widgets = widgets; }
    
    public String getFilters() { return filters; }
    public void setFilters(String filters) { this.filters = filters; }
    
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    
    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    public Integer getRefreshIntervalSeconds() { return refreshIntervalSeconds; }
    public void setRefreshIntervalSeconds(Integer refreshIntervalSeconds) { 
        this.refreshIntervalSeconds = refreshIntervalSeconds; 
    }
    
    public Boolean getAutoRefresh() { return autoRefresh; }
    public void setAutoRefresh(Boolean autoRefresh) { this.autoRefresh = autoRefresh; }
    
    public DashboardStatus getStatus() { return status; }
    public void setStatus(DashboardStatus status) { this.status = status; }
    
    public LocalDateTime getLastAccessedAt() { return lastAccessedAt; }
    public void setLastAccessedAt(LocalDateTime lastAccessedAt) { this.lastAccessedAt = lastAccessedAt; }
    
    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
}
