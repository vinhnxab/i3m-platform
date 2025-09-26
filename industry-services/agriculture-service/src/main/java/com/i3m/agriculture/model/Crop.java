package com.i3m.agriculture.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "crops", schema = "agriculture")
public class Crop {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @NotNull
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    @NotNull
    @Column(name = "farm_id", nullable = false)
    private UUID farmId;
    
    @NotNull
    @Column(name = "crop_type", nullable = false)
    private String cropType;
    
    @Column(name = "variety")
    private String variety;
    
    @NotNull
    @Column(name = "planted_area", nullable = false, precision = 10, scale = 2)
    @Positive
    private BigDecimal plantedArea; // in hectares
    
    @NotNull
    @Column(name = "planting_date", nullable = false)
    private LocalDate plantingDate;
    
    @Column(name = "expected_harvest_date")
    private LocalDate expectedHarvestDate;
    
    @Column(name = "actual_harvest_date")
    private LocalDate actualHarvestDate;
    
    @NotNull
    @Column(name = "growth_stage", nullable = false)
    @Enumerated(EnumType.STRING)
    private GrowthStage growthStage = GrowthStage.PLANTED;
    
    @Column(name = "expected_yield", precision = 10, scale = 2)
    private BigDecimal expectedYield; // tons per hectare
    
    @Column(name = "actual_yield", precision = 10, scale = 2)
    private BigDecimal actualYield;
    
    @Column(name = "seed_cost", precision = 19, scale = 2)
    private BigDecimal seedCost;
    
    @Column(name = "fertilizer_cost", precision = 19, scale = 2)
    private BigDecimal fertilizerCost;
    
    @Column(name = "pesticide_cost", precision = 19, scale = 2)
    private BigDecimal pesticideCost;
    
    @Column(name = "irrigation_cost", precision = 19, scale = 2)
    private BigDecimal irrigationCost;
    
    @Column(name = "labor_cost", precision = 19, scale = 2)
    private BigDecimal laborCost;
    
    @Column(name = "total_cost", precision = 19, scale = 2)
    private BigDecimal totalCost;
    
    @Column(name = "revenue", precision = 19, scale = 2)
    private BigDecimal revenue;
    
    @Column(name = "profit", precision = 19, scale = 2)
    private BigDecimal profit;
    
    @NotNull
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private CropStatus status = CropStatus.ACTIVE;
    
    @Column(name = "field_location", columnDefinition = "TEXT")
    private String fieldLocation; // JSON: coordinates of the field
    
    @Column(name = "soil_conditions", columnDefinition = "TEXT")
    private String soilConditions; // JSON: pH, nutrients, etc.
    
    @Column(name = "weather_impact", columnDefinition = "TEXT")
    private String weatherImpact; // JSON: weather events affecting crop
    
    @Column(name = "pest_disease_history", columnDefinition = "TEXT")
    private String pestDiseaseHistory; // JSON array
    
    @Column(name = "fertilizer_schedule", columnDefinition = "TEXT")
    private String fertilizerSchedule; // JSON array
    
    @Column(name = "irrigation_schedule", columnDefinition = "TEXT")
    private String irrigationSchedule; // JSON array
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private UUID createdBy;
    
    @Column(name = "updated_by")
    private UUID updatedBy;
    
    public enum GrowthStage {
        PLANTED, GERMINATION, SEEDLING, VEGETATIVE, FLOWERING, 
        FRUITING, MATURITY, HARVEST, POST_HARVEST
    }
    
    public enum CropStatus {
        ACTIVE, HARVESTED, FAILED, ABANDONED
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        // Calculate profit when revenue and costs are updated
        if (revenue != null && totalCost != null) {
            profit = revenue.subtract(totalCost);
        }
    }
    
    // Constructors
    public Crop() {}
    
    public Crop(UUID tenantId, UUID farmId, String cropType, BigDecimal plantedArea, LocalDate plantingDate) {
        this.tenantId = tenantId;
        this.farmId = farmId;
        this.cropType = cropType;
        this.plantedArea = plantedArea;
        this.plantingDate = plantingDate;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    
    public UUID getFarmId() { return farmId; }
    public void setFarmId(UUID farmId) { this.farmId = farmId; }
    
    public String getCropType() { return cropType; }
    public void setCropType(String cropType) { this.cropType = cropType; }
    
    public String getVariety() { return variety; }
    public void setVariety(String variety) { this.variety = variety; }
    
    public BigDecimal getPlantedArea() { return plantedArea; }
    public void setPlantedArea(BigDecimal plantedArea) { this.plantedArea = plantedArea; }
    
    public LocalDate getPlantingDate() { return plantingDate; }
    public void setPlantingDate(LocalDate plantingDate) { this.plantingDate = plantingDate; }
    
    public LocalDate getExpectedHarvestDate() { return expectedHarvestDate; }
    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) { 
        this.expectedHarvestDate = expectedHarvestDate; 
    }
    
    public LocalDate getActualHarvestDate() { return actualHarvestDate; }
    public void setActualHarvestDate(LocalDate actualHarvestDate) { this.actualHarvestDate = actualHarvestDate; }
    
    public GrowthStage getGrowthStage() { return growthStage; }
    public void setGrowthStage(GrowthStage growthStage) { this.growthStage = growthStage; }
    
    public BigDecimal getExpectedYield() { return expectedYield; }
    public void setExpectedYield(BigDecimal expectedYield) { this.expectedYield = expectedYield; }
    
    public BigDecimal getActualYield() { return actualYield; }
    public void setActualYield(BigDecimal actualYield) { this.actualYield = actualYield; }
    
    public BigDecimal getSeedCost() { return seedCost; }
    public void setSeedCost(BigDecimal seedCost) { this.seedCost = seedCost; }
    
    public BigDecimal getFertilizerCost() { return fertilizerCost; }
    public void setFertilizerCost(BigDecimal fertilizerCost) { this.fertilizerCost = fertilizerCost; }
    
    public BigDecimal getPesticideCost() { return pesticideCost; }
    public void setPesticideCost(BigDecimal pesticideCost) { this.pesticideCost = pesticideCost; }
    
    public BigDecimal getIrrigationCost() { return irrigationCost; }
    public void setIrrigationCost(BigDecimal irrigationCost) { this.irrigationCost = irrigationCost; }
    
    public BigDecimal getLaborCost() { return laborCost; }
    public void setLaborCost(BigDecimal laborCost) { this.laborCost = laborCost; }
    
    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }
    
    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    
    public BigDecimal getProfit() { return profit; }
    public void setProfit(BigDecimal profit) { this.profit = profit; }
    
    public CropStatus getStatus() { return status; }
    public void setStatus(CropStatus status) { this.status = status; }
    
    public String getFieldLocation() { return fieldLocation; }
    public void setFieldLocation(String fieldLocation) { this.fieldLocation = fieldLocation; }
    
    public String getSoilConditions() { return soilConditions; }
    public void setSoilConditions(String soilConditions) { this.soilConditions = soilConditions; }
    
    public String getWeatherImpact() { return weatherImpact; }
    public void setWeatherImpact(String weatherImpact) { this.weatherImpact = weatherImpact; }
    
    public String getPestDiseaseHistory() { return pestDiseaseHistory; }
    public void setPestDiseaseHistory(String pestDiseaseHistory) { this.pestDiseaseHistory = pestDiseaseHistory; }
    
    public String getFertilizerSchedule() { return fertilizerSchedule; }
    public void setFertilizerSchedule(String fertilizerSchedule) { this.fertilizerSchedule = fertilizerSchedule; }
    
    public String getIrrigationSchedule() { return irrigationSchedule; }
    public void setIrrigationSchedule(String irrigationSchedule) { this.irrigationSchedule = irrigationSchedule; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
}
