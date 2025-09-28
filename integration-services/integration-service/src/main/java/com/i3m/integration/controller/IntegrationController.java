package com.i3m.integration.controller;

import com.i3m.integration.dto.IntegrationDto;
import com.i3m.integration.dto.WebhookDto;
import com.i3m.integration.dto.DataSyncDto;
import com.i3m.integration.service.IntegrationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/integration")
@CrossOrigin(origins = "*")
public class IntegrationController {

    @Autowired
    private IntegrationService integrationService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "Integration Service",
            "version", "1.0.0",
            "features", "Webhooks, Data Sync, ETL, Message Queues, API Integration",
            "timestamp", System.currentTimeMillis()
        ));
    }

    // Integration Management
    @PostMapping("/integrations")
    public ResponseEntity<IntegrationDto> createIntegration(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody IntegrationDto integrationDto) {
        IntegrationDto created = integrationService.createIntegration(tenantId, integrationDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/integrations")
    public ResponseEntity<Page<IntegrationDto>> getIntegrations(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Page<IntegrationDto> integrations = integrationService.getIntegrations(
            tenantId, name, type, status, pageable);
        return ResponseEntity.ok(integrations);
    }

    @GetMapping("/integrations/{id}")
    public ResponseEntity<IntegrationDto> getIntegration(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        IntegrationDto integration = integrationService.getIntegration(tenantId, id);
        return ResponseEntity.ok(integration);
    }

    @PutMapping("/integrations/{id}")
    public ResponseEntity<IntegrationDto> updateIntegration(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @Valid @RequestBody IntegrationDto integrationDto) {
        Optional<IntegrationDto> updated = integrationService.updateIntegration(tenantId, id, integrationDto);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/integrations/{id}")
    public ResponseEntity<Void> deleteIntegration(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        integrationService.deleteIntegration(tenantId, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/integrations/{id}/test")
    public ResponseEntity<Map<String, Object>> testIntegration(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        Map<String, Object> result = integrationService.testIntegration(tenantId, id);
        return ResponseEntity.ok(result);
    }

    // Webhook Management
    @PostMapping("/webhooks")
    public ResponseEntity<WebhookDto> createWebhook(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody WebhookDto webhookDto) {
        WebhookDto created = integrationService.createWebhook(tenantId, webhookDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/webhooks")
    public ResponseEntity<Page<WebhookDto>> getWebhooks(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Page<WebhookDto> webhooks = integrationService.getWebhooks(tenantId, name, status, pageable);
        return ResponseEntity.ok(webhooks);
    }

    @PostMapping("/webhooks/{id}/test")
    public ResponseEntity<Map<String, Object>> testWebhook(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, Object> testPayload) {
        Map<String, Object> result = integrationService.testWebhook(tenantId, id, testPayload);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/webhooks/receive/{webhookId}")
    public ResponseEntity<Map<String, Object>> receiveWebhook(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID webhookId,
            @RequestBody Map<String, Object> payload,
            @RequestHeader Map<String, String> headers) {
        Map<String, Object> result = integrationService.processWebhook(tenantId, payload, headers);
        return ResponseEntity.ok(result);
    }

    // Data Synchronization
    @PostMapping("/sync")
    public ResponseEntity<DataSyncDto> createDataSync(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody DataSyncDto dataSyncDto) {
        DataSyncDto created = integrationService.createDataSync(tenantId, dataSyncDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/sync")
    public ResponseEntity<Page<DataSyncDto>> getDataSyncs(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String sourceSystem,
            @RequestParam(required = false) String targetSystem,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Page<DataSyncDto> syncs = integrationService.getDataSyncs(
            tenantId, sourceSystem, targetSystem, status, pageable);
        return ResponseEntity.ok(syncs);
    }

    @PostMapping("/sync/{id}/start")
    public ResponseEntity<Map<String, Object>> startDataSync(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        Map<String, Object> result = integrationService.startDataSync(tenantId, id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/sync/{id}/stop")
    public ResponseEntity<Map<String, Object>> stopDataSync(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        Map<String, Object> result = integrationService.stopDataSync(tenantId, id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/sync/{id}/status")
    public ResponseEntity<Map<String, Object>> getDataSyncStatus(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        Map<String, Object> status = integrationService.getDataSyncStatus(tenantId, id);
        return ResponseEntity.ok(status);
    }

    // ETL Operations
    @PostMapping("/etl/jobs")
    public ResponseEntity<Map<String, Object>> createETLJob(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestBody Map<String, Object> jobConfig) {
        Map<String, Object> job = integrationService.createETLJob(tenantId, jobConfig);
        return new ResponseEntity<>(job, HttpStatus.CREATED);
    }

    @GetMapping("/etl/jobs")
    public ResponseEntity<Map<String, Object>> getETLJobs(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Map<String, Object> jobs = integrationService.getETLJobs(tenantId, name, status, pageable);
        return ResponseEntity.ok(jobs);
    }

    @PostMapping("/etl/jobs/{id}/start")
    public ResponseEntity<Map<String, Object>> startETLJob(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        Map<String, Object> result = integrationService.startETLJob(tenantId, id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/etl/jobs/{id}/logs")
    public ResponseEntity<Map<String, Object>> getETLJobLogs(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam(defaultValue = "100") int limit) {
        Map<String, Object> logs = integrationService.getETLJobLogs(tenantId, id, limit);
        return ResponseEntity.ok(logs);
    }

    // External API Management
    @PostMapping("/external-apis")
    public ResponseEntity<Map<String, Object>> registerExternalAPI(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestBody Map<String, Object> apiConfig) {
        Map<String, Object> api = integrationService.registerExternalAPI(tenantId, apiConfig);
        return new ResponseEntity<>(api, HttpStatus.CREATED);
    }

    @PostMapping("/external-apis/{id}/call")
    public ResponseEntity<Map<String, Object>> callExternalAPI(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = integrationService.callExternalAPI(tenantId, id, request);
        return ResponseEntity.ok(response);
    }

    // Message Queue Operations
    @PostMapping("/queues/publish")
    public ResponseEntity<Map<String, Object>> publishMessage(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam String queue,
            @RequestBody Map<String, Object> message) {
        Map<String, Object> result = integrationService.publishMessage(tenantId, queue, message);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/queues/{queue}/stats")
    public ResponseEntity<Map<String, Object>> getQueueStats(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable String queue) {
        Map<String, Object> stats = integrationService.getQueueStats(tenantId, queue);
        return ResponseEntity.ok(stats);
    }

    // Analytics & Monitoring
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> dashboard = integrationService.getDashboardData(tenantId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/analytics/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String metricType,
            @RequestParam(required = false) String timeRange) {
        Map<String, Object> metrics = integrationService.getMetrics(tenantId, metricType, timeRange);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/analytics/errors")
    public ResponseEntity<Map<String, Object>> getErrorAnalysis(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String integrationId) {
        Map<String, Object> errors = integrationService.getErrorAnalysis(tenantId, integrationId);
        return ResponseEntity.ok(errors);
    }

    // Configuration Management
    @GetMapping("/config/templates")
    public ResponseEntity<Map<String, Object>> getIntegrationTemplates() {
        Map<String, Object> templates = integrationService.getIntegrationTemplates();
        return ResponseEntity.ok(templates);
    }

    @PostMapping("/config/validate")
    public ResponseEntity<Map<String, Object>> validateConfiguration(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestBody Map<String, Object> config) {
        Map<String, Object> validation = integrationService.validateConfiguration(tenantId, config);
        return ResponseEntity.ok(validation);
    }
}
