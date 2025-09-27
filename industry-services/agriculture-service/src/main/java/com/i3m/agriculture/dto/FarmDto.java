package com.i3m.agriculture.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.UUID;

public class FarmDto {
    private UUID id;
    
    @NotBlank(message = "Farm name is required")
    @Size(max = 200, message = "Farm name must not exceed 200 characters")
    private String farmName;
    
    @NotBlank(message = "Location is required")
    @Size(max = 500, message = "Location must not exceed 500 characters")
    private String location;
    
    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;
    
    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;
    
    @NotNull(message = "Area is required")
    @DecimalMin(value = "0.0", message = "Area must be positive")
    private Double area; // in hectares
    
    @Pattern(regexp = "^(SMALL|MEDIUM|LARGE|ENTERPRISE)$", 
             message = "Farm size must be SMALL, MEDIUM, LARGE, or ENTERPRISE")
    private String farmSize;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @Pattern(regexp = "^(ORGANIC|CONVENTIONAL|HYBRID|SUSTAINABLE)$", 
             message = "Farming type must be ORGANIC, CONVENTIONAL, HYBRID, or SUSTAINABLE")
    private String farmingType;
    
    @Size(max = 100, message = "Climate zone must not exceed 100 characters")
    private String climateZone;
    
    @Size(max = 100, message = "Soil type must not exceed 100 characters")
    private String soilType;
    
    @Size(max = 100, message = "Water source must not exceed 100 characters")
    private String waterSource;
    
    @Pattern(regexp = "^(ACTIVE|INACTIVE|MAINTENANCE|SEASONAL)$", 
             message = "Status must be ACTIVE, INACTIVE, MAINTENANCE, or SEASONAL")
    private String status;
    
    private LocalDateTime establishedDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID createdBy;
    private UUID updatedBy;
    
    // Constructors
    public FarmDto() {}
    
    public FarmDto(UUID id, String farmName, String location, Double latitude, Double longitude, 
                  Double area, String farmingType, String status) {
        this.id = id;
        this.farmName = farmName;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.area = area;
        this.farmingType = farmingType;
        this.status = status;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    public Double getArea() { return area; }
    public void setArea(Double area) { this.area = area; }
    
    public String getFarmSize() { return farmSize; }
    public void setFarmSize(String farmSize) { this.farmSize = farmSize; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getFarmingType() { return farmingType; }
    public void setFarmingType(String farmingType) { this.farmingType = farmingType; }
    
    public String getClimateZone() { return climateZone; }
    public void setClimateZone(String climateZone) { this.climateZone = climateZone; }
    
    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }
    
    public String getWaterSource() { return waterSource; }
    public void setWaterSource(String waterSource) { this.waterSource = waterSource; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getEstablishedDate() { return establishedDate; }
    public void setEstablishedDate(LocalDateTime establishedDate) { this.establishedDate = establishedDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
}
