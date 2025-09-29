package com.i3m.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class DashboardDto {
    private UUID id;
    
    @NotBlank(message = "Dashboard name is required")
    @Size(max = 200, message = "Dashboard name must not exceed 200 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Tenant ID is required")
    private UUID tenantId;
    
    private UUID createdBy;
    private boolean isPublic;
    private boolean isDefault;
    
    private List<WidgetDto> widgets;
    private Map<String, Object> settings;
    private Map<String, Object> filters;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public DashboardDto() {}
    
    public DashboardDto(UUID id, String name, String description, UUID tenantId, 
                       UUID createdBy, boolean isPublic, boolean isDefault,
                       List<WidgetDto> widgets, Map<String, Object> settings, 
                       Map<String, Object> filters, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tenantId = tenantId;
        this.createdBy = createdBy;
        this.isPublic = isPublic;
        this.isDefault = isDefault;
        this.widgets = widgets;
        this.settings = settings;
        this.filters = filters;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public UUID getTenantId() {
        return tenantId;
    }
    
    public void setTenantId(UUID tenantId) {
        this.tenantId = tenantId;
    }
    
    public UUID getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }
    
    public boolean isPublic() {
        return isPublic;
    }
    
    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
    
    public boolean isDefault() {
        return isDefault;
    }
    
    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }
    
    public List<WidgetDto> getWidgets() {
        return widgets;
    }
    
    public void setWidgets(List<WidgetDto> widgets) {
        this.widgets = widgets;
    }
    
    public Map<String, Object> getSettings() {
        return settings;
    }
    
    public void setSettings(Map<String, Object> settings) {
        this.settings = settings;
    }
    
    public Map<String, Object> getFilters() {
        return filters;
    }
    
    public void setFilters(Map<String, Object> filters) {
        this.filters = filters;
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
    
    // Inner class for Widget
    public static class WidgetDto {
        private UUID id;
        private String type;
        private String title;
        private Map<String, Object> config;
        private Map<String, Object> data;
        private int positionX;
        private int positionY;
        private int width;
        private int height;
        
        // Constructors
        public WidgetDto() {}
        
        public WidgetDto(UUID id, String type, String title, Map<String, Object> config,
                        Map<String, Object> data, int positionX, int positionY, 
                        int width, int height) {
            this.id = id;
            this.type = type;
            this.title = title;
            this.config = config;
            this.data = data;
            this.positionX = positionX;
            this.positionY = positionY;
            this.width = width;
            this.height = height;
        }
        
        // Getters and Setters
        public UUID getId() {
            return id;
        }
        
        public void setId(UUID id) {
            this.id = id;
        }
        
        public String getType() {
            return type;
        }
        
        public void setType(String type) {
            this.type = type;
        }
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public Map<String, Object> getConfig() {
            return config;
        }
        
        public void setConfig(Map<String, Object> config) {
            this.config = config;
        }
        
        public Map<String, Object> getData() {
            return data;
        }
        
        public void setData(Map<String, Object> data) {
            this.data = data;
        }
        
        public int getPositionX() {
            return positionX;
        }
        
        public void setPositionX(int positionX) {
            this.positionX = positionX;
        }
        
        public int getPositionY() {
            return positionY;
        }
        
        public void setPositionY(int positionY) {
            this.positionY = positionY;
        }
        
        public int getWidth() {
            return width;
        }
        
        public void setWidth(int width) {
            this.width = width;
        }
        
        public int getHeight() {
            return height;
        }
        
        public void setHeight(int height) {
            this.height = height;
        }
    }
}
