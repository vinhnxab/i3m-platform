package com.i3m.analytics.controller;

import com.i3m.analytics.dto.AnalyticsEventDto;
import com.i3m.analytics.dto.DashboardDto;
import com.i3m.analytics.service.AnalyticsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "Analytics Service",
            "version", "1.0.0",
            "features", "BI, dashboards, KPI tracking, real-time analytics",
            "timestamp", System.currentTimeMillis()
        ));
    }

    // Event Tracking
    @PostMapping("/events")
    public ResponseEntity<AnalyticsEventDto> trackEvent(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody AnalyticsEventDto eventDto) {
        AnalyticsEventDto tracked = analyticsService.trackEvent(tenantId, eventDto);
        return new ResponseEntity<>(tracked, HttpStatus.CREATED);
    }

    @GetMapping("/events")
    public ResponseEntity<Page<AnalyticsEventDto>> getEvents(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) String eventName,
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            Pageable pageable) {
        Page<AnalyticsEventDto> events = analyticsService.getEvents(
            tenantId, eventType, eventName, userId, startDate, endDate, pageable);
        return ResponseEntity.ok(events);
    }

    // Dashboard Management
    @PostMapping("/dashboards")
    public ResponseEntity<DashboardDto> createDashboard(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody DashboardDto dashboardDto) {
        DashboardDto created = analyticsService.createDashboard(tenantId, dashboardDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/dashboards")
    public ResponseEntity<Page<DashboardDto>> getDashboards(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean isPublic,
            @RequestParam(required = false) UUID ownerId,
            Pageable pageable) {
        Page<DashboardDto> dashboards = analyticsService.getDashboards(
            tenantId, status, isPublic, ownerId, pageable);
        return ResponseEntity.ok(dashboards);
    }

    @GetMapping("/dashboards/{id}")
    public ResponseEntity<DashboardDto> getDashboard(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        DashboardDto dashboard = analyticsService.getDashboard(tenantId, id);
        return ResponseEntity.ok(dashboard);
    }

    @PutMapping("/dashboards/{id}")
    public ResponseEntity<DashboardDto> updateDashboard(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @Valid @RequestBody DashboardDto dashboardDto) {
        DashboardDto updated = analyticsService.updateDashboard(tenantId, id, dashboardDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/dashboards/{id}")
    public ResponseEntity<Void> deleteDashboard(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        analyticsService.deleteDashboard(tenantId, id);
        return ResponseEntity.noContent().build();
    }

    // Analytics & Reports
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> dashboard = analyticsService.getDashboardData(tenantId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> getKPIs(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String[] kpiNames) {
        Map<String, Object> kpis = analyticsService.getKPIs(tenantId, timeRange, kpiNames);
        return ResponseEntity.ok(kpis);
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String metricType,
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) String aggregation) {
        Map<String, Object> metrics = analyticsService.getMetrics(
            tenantId, metricType, timeRange, aggregation);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String reportType,
            @RequestParam(required = false) String format,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> reports = analyticsService.getReports(
            tenantId, reportType, format, startDate, endDate);
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/reports/generate")
    public ResponseEntity<Map<String, Object>> generateReport(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestBody Map<String, Object> reportConfig) {
        Map<String, Object> report = analyticsService.generateReport(tenantId, reportConfig);
        return ResponseEntity.ok(report);
    }

    // Real-time Analytics
    @GetMapping("/realtime/metrics")
    public ResponseEntity<Map<String, Object>> getRealtimeMetrics(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> metrics = analyticsService.getRealtimeMetrics(tenantId);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/realtime/events")
    public ResponseEntity<List<AnalyticsEventDto>> getRealtimeEvents(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(defaultValue = "100") int limit) {
        List<AnalyticsEventDto> events = analyticsService.getRealtimeEvents(tenantId, limit);
        return ResponseEntity.ok(events);
    }

    // Data Export
    @GetMapping("/export/events")
    public ResponseEntity<Map<String, Object>> exportEvents(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String format,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> export = analyticsService.exportEvents(
            tenantId, format, startDate, endDate);
        return ResponseEntity.ok(export);
    }

    @GetMapping("/export/dashboard/{id}")
    public ResponseEntity<Map<String, Object>> exportDashboard(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam(required = false) String format) {
        Map<String, Object> export = analyticsService.exportDashboard(tenantId, id, format);
        return ResponseEntity.ok(export);
    }

    // Analytics Configuration
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getAnalyticsConfig(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> config = analyticsService.getAnalyticsConfig(tenantId);
        return ResponseEntity.ok(config);
    }

    @PutMapping("/config")
    public ResponseEntity<Map<String, Object>> updateAnalyticsConfig(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestBody Map<String, Object> config) {
        Map<String, Object> updated = analyticsService.updateAnalyticsConfig(tenantId, config);
        return ResponseEntity.ok(updated);
    }
}
