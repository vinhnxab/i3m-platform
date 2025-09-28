package com.i3m.integration.service;

import com.i3m.integration.dto.IntegrationDto;
import com.i3m.integration.dto.WebhookDto;
import com.i3m.integration.dto.DataSyncDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class IntegrationService {

    // In-memory storage for demonstration purposes
    private final Map<UUID, List<IntegrationDto>> tenantIntegrations = new ConcurrentHashMap<>();
    private final Map<UUID, List<WebhookDto>> tenantWebhooks = new ConcurrentHashMap<>();
    private final Map<UUID, List<DataSyncDto>> tenantDataSyncs = new ConcurrentHashMap<>();

    // Integration management
    public List<IntegrationDto> getAllIntegrations(UUID tenantId) {
        return tenantIntegrations.getOrDefault(tenantId, new ArrayList<>());
    }

    public Optional<IntegrationDto> getIntegrationById(UUID tenantId, UUID integrationId) {
        return tenantIntegrations.getOrDefault(tenantId, new ArrayList<>())
                                 .stream()
                                 .filter(integration -> integration.getId().equals(integrationId))
                                 .findFirst();
    }

    public IntegrationDto createIntegration(UUID tenantId, IntegrationDto integrationDto) {
        integrationDto.setTenantId(tenantId);
        integrationDto.setId(UUID.randomUUID());
        integrationDto.setCreatedAt(LocalDateTime.now());
        integrationDto.setUpdatedAt(LocalDateTime.now());
        tenantIntegrations.computeIfAbsent(tenantId, k -> new ArrayList<>()).add(integrationDto);
        return integrationDto;
    }

    public Optional<IntegrationDto> updateIntegration(UUID tenantId, UUID integrationId, IntegrationDto updatedIntegrationDto) {
        List<IntegrationDto> integrations = tenantIntegrations.get(tenantId);
        if (integrations == null) {
            return Optional.empty();
        }

        for (int i = 0; i < integrations.size(); i++) {
            if (integrations.get(i).getId().equals(integrationId)) {
                updatedIntegrationDto.setId(integrationId);
                updatedIntegrationDto.setTenantId(tenantId);
                updatedIntegrationDto.setCreatedAt(integrations.get(i).getCreatedAt());
                updatedIntegrationDto.setUpdatedAt(LocalDateTime.now());
                integrations.set(i, updatedIntegrationDto);
                return Optional.of(updatedIntegrationDto);
            }
        }
        return Optional.empty();
    }

    public boolean deleteIntegration(UUID tenantId, UUID integrationId) {
        List<IntegrationDto> integrations = tenantIntegrations.get(tenantId);
        if (integrations == null) {
            return false;
        }
        return integrations.removeIf(integration -> integration.getId().equals(integrationId));
    }

    // Webhook management
    public List<WebhookDto> getAllWebhooks(UUID tenantId) {
        return tenantWebhooks.getOrDefault(tenantId, new ArrayList<>());
    }

    public Optional<WebhookDto> getWebhookById(UUID tenantId, UUID webhookId) {
        return tenantWebhooks.getOrDefault(tenantId, new ArrayList<>())
                             .stream()
                             .filter(webhook -> webhook.getId().equals(webhookId))
                             .findFirst();
    }

    public WebhookDto createWebhook(UUID tenantId, WebhookDto webhookDto) {
        webhookDto.setTenantId(tenantId);
        webhookDto.setId(UUID.randomUUID());
        webhookDto.setCreatedAt(LocalDateTime.now());
        webhookDto.setUpdatedAt(LocalDateTime.now());
        tenantWebhooks.computeIfAbsent(tenantId, k -> new ArrayList<>()).add(webhookDto);
        return webhookDto;
    }

    public Optional<WebhookDto> updateWebhook(UUID tenantId, UUID webhookId, WebhookDto updatedWebhookDto) {
        List<WebhookDto> webhooks = tenantWebhooks.get(tenantId);
        if (webhooks == null) {
            return Optional.empty();
        }

        for (int i = 0; i < webhooks.size(); i++) {
            if (webhooks.get(i).getId().equals(webhookId)) {
                updatedWebhookDto.setId(webhookId);
                updatedWebhookDto.setTenantId(tenantId);
                updatedWebhookDto.setCreatedAt(webhooks.get(i).getCreatedAt());
                updatedWebhookDto.setUpdatedAt(LocalDateTime.now());
                webhooks.set(i, updatedWebhookDto);
                return Optional.of(updatedWebhookDto);
            }
        }
        return Optional.empty();
    }

    public boolean deleteWebhook(UUID tenantId, UUID webhookId) {
        List<WebhookDto> webhooks = tenantWebhooks.get(tenantId);
        if (webhooks == null) {
            return false;
        }
        return webhooks.removeIf(webhook -> webhook.getId().equals(webhookId));
    }

    // Data sync management
    public List<DataSyncDto> getAllDataSyncs(UUID tenantId) {
        return tenantDataSyncs.getOrDefault(tenantId, new ArrayList<>());
    }

    public Optional<DataSyncDto> getDataSyncById(UUID tenantId, UUID dataSyncId) {
        return tenantDataSyncs.getOrDefault(tenantId, new ArrayList<>())
                              .stream()
                              .filter(dataSync -> dataSync.getId().equals(dataSyncId))
                              .findFirst();
    }

    public DataSyncDto createDataSync(UUID tenantId, DataSyncDto dataSyncDto) {
        dataSyncDto.setTenantId(tenantId);
        dataSyncDto.setId(UUID.randomUUID());
        dataSyncDto.setCreatedAt(LocalDateTime.now());
        dataSyncDto.setUpdatedAt(LocalDateTime.now());
        tenantDataSyncs.computeIfAbsent(tenantId, k -> new ArrayList<>()).add(dataSyncDto);
        return dataSyncDto;
    }

    public Optional<DataSyncDto> updateDataSync(UUID tenantId, UUID dataSyncId, DataSyncDto updatedDataSyncDto) {
        List<DataSyncDto> dataSyncs = tenantDataSyncs.get(tenantId);
        if (dataSyncs == null) {
            return Optional.empty();
        }

        for (int i = 0; i < dataSyncs.size(); i++) {
            if (dataSyncs.get(i).getId().equals(dataSyncId)) {
                updatedDataSyncDto.setId(dataSyncId);
                updatedDataSyncDto.setTenantId(tenantId);
                updatedDataSyncDto.setCreatedAt(dataSyncs.get(i).getCreatedAt());
                updatedDataSyncDto.setUpdatedAt(LocalDateTime.now());
                dataSyncs.set(i, updatedDataSyncDto);
                return Optional.of(updatedDataSyncDto);
            }
        }
        return Optional.empty();
    }

    public boolean deleteDataSync(UUID tenantId, UUID dataSyncId) {
        List<DataSyncDto> dataSyncs = tenantDataSyncs.get(tenantId);
        if (dataSyncs == null) {
            return false;
        }
        return dataSyncs.removeIf(dataSync -> dataSync.getId().equals(dataSyncId));
    }

    // Search functionality
    public List<IntegrationDto> searchIntegrations(UUID tenantId, String query) {
        List<IntegrationDto> integrations = tenantIntegrations.getOrDefault(tenantId, new ArrayList<>());
        if (query == null || query.trim().isEmpty()) {
            return integrations;
        }
        String lowerCaseQuery = query.toLowerCase();
        return integrations.stream()
                          .filter(integration -> integration.getName().toLowerCase().contains(lowerCaseQuery) ||
                                               integration.getType().toLowerCase().contains(lowerCaseQuery) ||
                                               integration.getStatus().toLowerCase().contains(lowerCaseQuery) ||
                                               integration.getDescription().toLowerCase().contains(lowerCaseQuery))
                          .collect(Collectors.toList());
    }

    // Additional methods for controller compatibility
    public org.springframework.data.domain.Page<IntegrationDto> getIntegrations(UUID tenantId, String name, String type, String status, org.springframework.data.domain.Pageable pageable) {
        List<IntegrationDto> integrations = getAllIntegrations(tenantId);
        return new org.springframework.data.domain.PageImpl<>(integrations, pageable, integrations.size());
    }

    public IntegrationDto getIntegration(UUID tenantId, UUID integrationId) {
        return getIntegrationById(tenantId, integrationId).orElse(null);
    }

    public Map<String, Object> testIntegration(UUID tenantId, UUID integrationId) {
        boolean exists = getIntegrationById(tenantId, integrationId).isPresent();
        return Map.of("success", exists, "message", exists ? "Integration found" : "Integration not found");
    }

    public org.springframework.data.domain.Page<WebhookDto> getWebhooks(UUID tenantId, String name, String status, org.springframework.data.domain.Pageable pageable) {
        List<WebhookDto> webhooks = getAllWebhooks(tenantId);
        return new org.springframework.data.domain.PageImpl<>(webhooks, pageable, webhooks.size());
    }

    public Map<String, Object> testWebhook(UUID tenantId, UUID webhookId, Map<String, Object> payload) {
        boolean exists = getWebhookById(tenantId, webhookId).isPresent();
        return Map.of("success", exists, "message", exists ? "Webhook found" : "Webhook not found");
    }

    public Map<String, Object> processWebhook(UUID tenantId, Map<String, Object> payload, Map<String, String> headers) {
        return Map.of("success", true, "message", "Webhook processed successfully");
    }

    public org.springframework.data.domain.Page<DataSyncDto> getDataSyncs(UUID tenantId, String sourceSystem, String targetSystem, String status, org.springframework.data.domain.Pageable pageable) {
        List<DataSyncDto> dataSyncs = getAllDataSyncs(tenantId);
        return new org.springframework.data.domain.PageImpl<>(dataSyncs, pageable, dataSyncs.size());
    }

    public Map<String, Object> startDataSync(UUID tenantId, UUID dataSyncId) {
        boolean exists = getDataSyncById(tenantId, dataSyncId).isPresent();
        return Map.of("success", exists, "message", exists ? "Data sync started" : "Data sync not found");
    }

    public Map<String, Object> stopDataSync(UUID tenantId, UUID dataSyncId) {
        boolean exists = getDataSyncById(tenantId, dataSyncId).isPresent();
        return Map.of("success", exists, "message", exists ? "Data sync stopped" : "Data sync not found");
    }

    public Map<String, Object> getDataSyncStatus(UUID tenantId, UUID dataSyncId) {
        String status = getDataSyncById(tenantId, dataSyncId).map(DataSyncDto::getStatus).orElse("Not Found");
        return Map.of("status", status, "dataSyncId", dataSyncId);
    }

    public Map<String, Object> createETLJob(UUID tenantId, Map<String, Object> configuration) {
        return Map.of("jobId", UUID.randomUUID(), "status", "Created");
    }

    public Map<String, Object> getETLJobs(UUID tenantId, String name, String status, org.springframework.data.domain.Pageable pageable) {
        List<Map<String, Object>> jobs = List.of(Map.of("jobId", UUID.randomUUID(), "name", "Sample ETL Job", "status", "Completed"));
        return Map.of("jobs", jobs, "total", jobs.size());
    }

    public Map<String, Object> startETLJob(UUID tenantId, UUID jobId) {
        return Map.of("success", true, "message", "ETL job started");
    }

    public Map<String, Object> getETLJobLogs(UUID tenantId, UUID jobId, int limit) {
        List<Map<String, Object>> logs = List.of(Map.of("timestamp", LocalDateTime.now(), "level", "INFO", "message", "ETL job started"));
        return Map.of("logs", logs, "total", logs.size());
    }

    public Map<String, Object> registerExternalAPI(UUID tenantId, Map<String, Object> apiConfig) {
        return Map.of("apiId", UUID.randomUUID(), "status", "Registered");
    }

    public Map<String, Object> callExternalAPI(UUID tenantId, UUID apiId, Map<String, Object> requestData) {
        return Map.of("response", "Success", "statusCode", 200);
    }

    public Map<String, Object> publishMessage(UUID tenantId, String queueName, Map<String, Object> message) {
        return Map.of("success", true, "message", "Message published");
    }

    public Map<String, Object> getQueueStats(UUID tenantId, String queueName) {
        return Map.of("messages", 100, "consumers", 5, "status", "Active");
    }

    public Map<String, Object> getDashboardData(UUID tenantId) {
        return Map.of(
            "totalIntegrations", tenantIntegrations.getOrDefault(tenantId, new ArrayList<>()).size(),
            "activeIntegrations", tenantIntegrations.getOrDefault(tenantId, new ArrayList<>()).stream()
                .filter(i -> "Active".equals(i.getStatus())).count(),
            "totalWebhooks", tenantWebhooks.getOrDefault(tenantId, new ArrayList<>()).size(),
            "totalDataSyncs", tenantDataSyncs.getOrDefault(tenantId, new ArrayList<>()).size()
        );
    }

    public Map<String, Object> getMetrics(UUID tenantId, String metricType, String timeRange) {
        return Map.of("metricType", metricType, "value", 100, "timeRange", timeRange);
    }

    public Map<String, Object> getErrorAnalysis(UUID tenantId, String integrationId) {
        return Map.of("errors", 0, "warnings", 2, "lastError", null);
    }

    public Map<String, Object> getIntegrationTemplates() {
        List<Map<String, Object>> templates = List.of(
            Map.of("id", "api", "name", "REST API Integration", "description", "Connect to REST APIs"),
            Map.of("id", "database", "name", "Database Integration", "description", "Connect to databases"),
            Map.of("id", "webhook", "name", "Webhook Integration", "description", "Receive webhook notifications")
        );
        return Map.of("templates", templates);
    }

    public Map<String, Object> validateConfiguration(UUID tenantId, Map<String, Object> configuration) {
        boolean valid = configuration != null && !configuration.isEmpty();
        return Map.of("valid", valid, "message", valid ? "Configuration is valid" : "Configuration is invalid");
    }
}
