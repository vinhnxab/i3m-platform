package com.i3m.agriculture.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class CropDto {
    private UUID id;
    
    @NotNull(message = "Farm ID is required")
    private UUID farmId;
    
    @NotBlank(message = "Crop name is required")
    @Size(max = 200, message = "Crop name must not exceed 200 characters")
    private String cropName;
    
    @NotBlank(message = "Crop type is required")
    @Size(max = 100, message = "Crop type must not exceed 100 characters")
    private String cropType;
    
    @NotBlank(message = "Variety is required")
    @Size(max = 100, message = "Variety must not exceed 100 characters")
    private String variety;
    
    @NotNull(message = "Planting date is required")
    private LocalDate plantingDate;
    
    private LocalDate expectedHarvestDate;
    private LocalDate actualHarvestDate;
    
    @NotNull(message = "Area planted is required")
    @DecimalMin(value = "0.0", message = "Area planted must be positive")
    private Double areaPlanted; // in hectares
    
    @NotNull(message = "Expected yield is required")
    @DecimalMin(value = "0.0", message = "Expected yield must be positive")
    private Double expectedYield; // in tons per hectare
    
    private Double actualYield; // in tons per hectare
    
    @Pattern(regexp = "^(PLANNED|PLANTED|GROWING|FLOWERING|FRUITING|RIPENING|HARVESTED|COMPLETED|FAILED)$", 
             message = "Status must be valid crop status")
    private String status;
    
    @Size(max = 50, message = "Growth stage must not exceed 50 characters")
    private String growthStage;
    
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
    
    @Size(max = 500, message = "Fertilizer used must not exceed 500 characters")
    private String fertilizerUsed;
    
    @Size(max = 500, message = "Pesticides used must not exceed 500 characters")
    private String pesticidesUsed;
    
    @Size(max = 500, message = "Irrigation method must not exceed 500 characters")
    private String irrigationMethod;
    
    @DecimalMin(value = "0.0", message = "Water usage must be positive")
    private Double waterUsage; // in liters
    
    @DecimalMin(value = "0.0", message = "Cost must be positive")
    private Double totalCost;
    
    @DecimalMin(value = "0.0", message = "Revenue must be positive")
    private Double totalRevenue;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID createdBy;
    private UUID updatedBy;
    
    // Constructors
    public CropDto() {}
    
    public CropDto(UUID id, UUID farmId, String cropName, String cropType, String variety, 
                  LocalDate plantingDate, Double areaPlanted, String status) {
        this.id = id;
        this.farmId = farmId;
        this.cropName = cropName;
        this.cropType = cropType;
        this.variety = variety;
        this.plantingDate = plantingDate;
        this.areaPlanted = areaPlanted;
        this.status = status;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getFarmId() { return farmId; }
    public void setFarmId(UUID farmId) { this.farmId = farmId; }
    
    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }
    
    public String getCropType() { return cropType; }
    public void setCropType(String cropType) { this.cropType = cropType; }
    
    public String getVariety() { return variety; }
    public void setVariety(String variety) { this.variety = variety; }
    
    public LocalDate getPlantingDate() { return plantingDate; }
    public void setPlantingDate(LocalDate plantingDate) { this.plantingDate = plantingDate; }
    
    public LocalDate getExpectedHarvestDate() { return expectedHarvestDate; }
    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) { this.expectedHarvestDate = expectedHarvestDate; }
    
    public LocalDate getActualHarvestDate() { return actualHarvestDate; }
    public void setActualHarvestDate(LocalDate actualHarvestDate) { this.actualHarvestDate = actualHarvestDate; }
    
    public Double getAreaPlanted() { return areaPlanted; }
    public void setAreaPlanted(Double areaPlanted) { this.areaPlanted = areaPlanted; }
    
    public Double getExpectedYield() { return expectedYield; }
    public void setExpectedYield(Double expectedYield) { this.expectedYield = expectedYield; }
    
    public Double getActualYield() { return actualYield; }
    public void setActualYield(Double actualYield) { this.actualYield = actualYield; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getGrowthStage() { return growthStage; }
    public void setGrowthStage(String growthStage) { this.growthStage = growthStage; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getFertilizerUsed() { return fertilizerUsed; }
    public void setFertilizerUsed(String fertilizerUsed) { this.fertilizerUsed = fertilizerUsed; }
    
    public String getPesticidesUsed() { return pesticidesUsed; }
    public void setPesticidesUsed(String pesticidesUsed) { this.pesticidesUsed = pesticidesUsed; }
    
    public String getIrrigationMethod() { return irrigationMethod; }
    public void setIrrigationMethod(String irrigationMethod) { this.irrigationMethod = irrigationMethod; }
    
    public Double getWaterUsage() { return waterUsage; }
    public void setWaterUsage(Double waterUsage) { this.waterUsage = waterUsage; }
    
    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
    
    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
}
