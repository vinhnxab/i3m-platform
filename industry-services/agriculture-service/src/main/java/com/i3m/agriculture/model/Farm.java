package com.i3m.agriculture.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "farms", schema = "agriculture")
public class Farm {
    
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
    
    @NotNull
    @Column(name = "location", nullable = false, columnDefinition = "TEXT")
    private String location; // JSON: {"latitude": 40.7128, "longitude": -74.0060, "address": "..."}
    
    @Positive
    @Column(name = "total_area", precision = 10, scale = 2)
    private BigDecimal totalArea; // in hectares
    
    @Column(name = "soil_type")
    private String soilType;
    
    @Column(name = "climate_zone")
    private String climateZone;
    
    @Column(name = "water_source")
    private String waterSource;
    
    @Column(name = "irrigation_system")
    @Enumerated(EnumType.STRING)
    private IrrigationSystem irrigationSystem;
    
    @NotNull
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private FarmStatus status = FarmStatus.ACTIVE;
    
    @Column(name = "owner_id")
    private UUID ownerId;
    
    @Column(name = "manager_id")
    private UUID managerId;
    
    @Column(name = "certification", columnDefinition = "TEXT")
    private String certification; // JSON array: ["Organic", "Fair Trade", etc.]
    
    @Column(name = "equipment", columnDefinition = "TEXT")
    private String equipment; // JSON array of farm equipment
    
    @Column(name = "sensors", columnDefinition = "TEXT")
    private String sensors; // JSON array of IoT sensors
    
    @Column(name = "weather_station_id")
    private String weatherStationId;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private UUID createdBy;
    
    @Column(name = "updated_by")
    private UUID updatedBy;
    
    public enum IrrigationSystem {
        DRIP, SPRINKLER, FLOOD, PIVOT, MANUAL, NONE
    }
    
    public enum FarmStatus {
        ACTIVE, INACTIVE, SEASONAL, MAINTENANCE
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
    public Farm() {}
    
    public Farm(UUID tenantId, String name, String location) {
        this.tenantId = tenantId;
        this.name = name;
        this.location = location;
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
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public BigDecimal getTotalArea() { return totalArea; }
    public void setTotalArea(BigDecimal totalArea) { this.totalArea = totalArea; }
    
    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }
    
    public String getClimateZone() { return climateZone; }
    public void setClimateZone(String climateZone) { this.climateZone = climateZone; }
    
    public String getWaterSource() { return waterSource; }
    public void setWaterSource(String waterSource) { this.waterSource = waterSource; }
    
    public IrrigationSystem getIrrigationSystem() { return irrigationSystem; }
    public void setIrrigationSystem(IrrigationSystem irrigationSystem) { this.irrigationSystem = irrigationSystem; }
    
    public FarmStatus getStatus() { return status; }
    public void setStatus(FarmStatus status) { this.status = status; }
    
    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }
    
    public UUID getManagerId() { return managerId; }
    public void setManagerId(UUID managerId) { this.managerId = managerId; }
    
    public String getCertification() { return certification; }
    public void setCertification(String certification) { this.certification = certification; }
    
    public String getEquipment() { return equipment; }
    public void setEquipment(String equipment) { this.equipment = equipment; }
    
    public String getSensors() { return sensors; }
    public void setSensors(String sensors) { this.sensors = sensors; }
    
    public String getWeatherStationId() { return weatherStationId; }
    public void setWeatherStationId(String weatherStationId) { this.weatherStationId = weatherStationId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
}
