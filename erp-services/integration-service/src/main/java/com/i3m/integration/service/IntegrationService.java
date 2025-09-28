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
        dataSyncDto.setLastSync(LocalDateTime.now());
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
                updatedDataSyncDto.setLastSync(dataSyncs.get(i).getLastSync());
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
                                               integration.getStatus().toLowerCase().contains(lowerCaseQuery))
                          .collect(Collectors.toList());
    }
}