package com.i3m.agriculture.controller;

import com.i3m.agriculture.dto.FarmDto;
import com.i3m.agriculture.dto.CropDto;
import com.i3m.agriculture.service.AgricultureService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/agriculture")
@CrossOrigin(origins = "*")
public class AgricultureController {

    @Autowired
    private AgricultureService agricultureService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "Agriculture Service",
            "version", "1.0.0",
            "features", "Farm tracking, Weather integration, Crop monitoring",
            "timestamp", System.currentTimeMillis()
        ));
    }

    // Farm Management
    @PostMapping("/farms")
    public ResponseEntity<FarmDto> createFarm(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody FarmDto farmDto) {
        FarmDto created = agricultureService.createFarm(tenantId, farmDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/farms")
    public ResponseEntity<Page<FarmDto>> getFarms(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID ownerId,
            Pageable pageable) {
        Page<FarmDto> farms = agricultureService.getFarms(tenantId, status, search, ownerId, pageable);
        return ResponseEntity.ok(farms);
    }

    @GetMapping("/farms/{id}")
    public ResponseEntity<FarmDto> getFarm(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        FarmDto farm = agricultureService.getFarm(tenantId, id);
        return ResponseEntity.ok(farm);
    }

    @PutMapping("/farms/{id}")
    public ResponseEntity<FarmDto> updateFarm(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @Valid @RequestBody FarmDto farmDto) {
        FarmDto updated = agricultureService.updateFarm(tenantId, id, farmDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/farms/{id}")
    public ResponseEntity<Void> deleteFarm(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        agricultureService.deleteFarm(tenantId, id);
        return ResponseEntity.noContent().build();
    }

    // Crop Management
    @PostMapping("/farms/{farmId}/crops")
    public ResponseEntity<CropDto> createCrop(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID farmId,
            @Valid @RequestBody CropDto cropDto) {
        CropDto created = agricultureService.createCrop(tenantId, farmId, cropDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/farms/{farmId}/crops")
    public ResponseEntity<Page<CropDto>> getFarmCrops(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID farmId,
            @RequestParam(required = false) String cropType,
            @RequestParam(required = false) String growthStage,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Page<CropDto> crops = agricultureService.getFarmCrops(
            tenantId, farmId, cropType, growthStage, status, pageable);
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/crops/{id}")
    public ResponseEntity<CropDto> getCrop(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        CropDto crop = agricultureService.getCrop(tenantId, id);
        return ResponseEntity.ok(crop);
    }

    @PutMapping("/crops/{id}")
    public ResponseEntity<CropDto> updateCrop(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @Valid @RequestBody CropDto cropDto) {
        CropDto updated = agricultureService.updateCrop(tenantId, id, cropDto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/crops/{id}/growth-stage")
    public ResponseEntity<CropDto> updateCropGrowthStage(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam String growthStage) {
        CropDto updated = agricultureService.updateCropGrowthStage(tenantId, id, growthStage);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/crops/{id}/harvest")
    public ResponseEntity<CropDto> harvestCrop(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam Double actualYield,
            @RequestParam(required = false) Double revenue) {
        CropDto harvested = agricultureService.harvestCrop(tenantId, id, actualYield, revenue);
        return ResponseEntity.ok(harvested);
    }

    // Weather Integration
    @GetMapping("/farms/{farmId}/weather")
    public ResponseEntity<Map<String, Object>> getFarmWeather(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID farmId) {
        Map<String, Object> weather = agricultureService.getFarmWeather(tenantId, farmId);
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/farms/{farmId}/weather/forecast")
    public ResponseEntity<Map<String, Object>> getWeatherForecast(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID farmId,
            @RequestParam(defaultValue = "7") int days) {
        Map<String, Object> forecast = agricultureService.getWeatherForecast(tenantId, farmId, days);
        return ResponseEntity.ok(forecast);
    }

    @PostMapping("/weather/alerts")
    public ResponseEntity<Map<String, Object>> createWeatherAlert(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam UUID farmId,
            @RequestParam String alertType,
            @RequestParam String conditions) {
        Map<String, Object> alert = agricultureService.createWeatherAlert(tenantId, farmId, alertType, conditions);
        return ResponseEntity.ok(alert);
    }

    // Irrigation Management
    @PostMapping("/farms/{farmId}/irrigation/schedule")
    public ResponseEntity<Map<String, Object>> scheduleIrrigation(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID farmId,
            @RequestBody Map<String, Object> schedule) {
        Map<String, Object> result = agricultureService.scheduleIrrigation(tenantId, farmId, schedule);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/farms/{farmId}/irrigation/status")
    public ResponseEntity<Map<String, Object>> getIrrigationStatus(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID farmId) {
        Map<String, Object> status = agricultureService.getIrrigationStatus(tenantId, farmId);
        return ResponseEntity.ok(status);
    }

    // Sensor Data & Monitoring
    @PostMapping("/farms/{farmId}/sensors/data")
    public ResponseEntity<Map<String, Object>> recordSensorData(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID farmId,
            @RequestBody Map<String, Object> sensorData) {
        Map<String, Object> result = agricultureService.recordSensorData(tenantId, farmId, sensorData);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/farms/{farmId}/sensors/data")
    public ResponseEntity<Map<String, Object>> getSensorData(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID farmId,
            @RequestParam(required = false) String sensorType,
            @RequestParam(required = false) String timeRange) {
        Map<String, Object> data = agricultureService.getSensorData(tenantId, farmId, sensorType, timeRange);
        return ResponseEntity.ok(data);
    }

    // Analytics & Reports
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> dashboard = agricultureService.getDashboardData(tenantId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/analytics/yield-prediction")
    public ResponseEntity<Map<String, Object>> getYieldPrediction(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam UUID cropId) {
        Map<String, Object> prediction = agricultureService.getYieldPrediction(tenantId, cropId);
        return ResponseEntity.ok(prediction);
    }

    @GetMapping("/analytics/profitability")
    public ResponseEntity<Map<String, Object>> getProfitabilityAnalysis(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) UUID farmId,
            @RequestParam(required = false) String cropType,
            @RequestParam(required = false) String period) {
        Map<String, Object> analysis = agricultureService.getProfitabilityAnalysis(
            tenantId, farmId, cropType, period);
        return ResponseEntity.ok(analysis);
    }

    // Pest & Disease Management
    @PostMapping("/crops/{cropId}/pest-disease")
    public ResponseEntity<Map<String, Object>> reportPestDisease(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID cropId,
            @RequestBody Map<String, Object> report) {
        Map<String, Object> result = agricultureService.reportPestDisease(tenantId, cropId, report);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/crops/{cropId}/pest-disease")
    public ResponseEntity<Map<String, Object>> getPestDiseaseHistory(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID cropId) {
        Map<String, Object> history = agricultureService.getPestDiseaseHistory(tenantId, cropId);
        return ResponseEntity.ok(history);
    }

    // Sustainability & Certification
    @GetMapping("/farms/{farmId}/sustainability")
    public ResponseEntity<Map<String, Object>> getSustainabilityReport(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID farmId) {
        Map<String, Object> report = agricultureService.getSustainabilityReport(tenantId, farmId);
        return ResponseEntity.ok(report);
    }

    @PostMapping("/farms/{farmId}/certification")
    public ResponseEntity<Map<String, Object>> applyCertification(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID farmId,
            @RequestParam String certificationType) {
        Map<String, Object> result = agricultureService.applyCertification(tenantId, farmId, certificationType);
        return ResponseEntity.ok(result);
    }
}
