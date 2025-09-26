package com.i3m.crm.controller;

import com.i3m.crm.dto.LeadDto;
import com.i3m.crm.service.CrmService;
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
@RequestMapping("/api/v1/crm")
@CrossOrigin(origins = "*")
public class CrmController {

    @Autowired
    private CrmService crmService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "CRM Service",
            "version", "1.0.0",
            "timestamp", System.currentTimeMillis()
        ));
    }

    // Lead Management
    @PostMapping("/leads")
    public ResponseEntity<LeadDto> createLead(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody LeadDto leadDto) {
        LeadDto created = crmService.createLead(tenantId, leadDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/leads")
    public ResponseEntity<Page<LeadDto>> getLeads(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) UUID assignedTo,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<LeadDto> leads = crmService.getLeads(tenantId, status, source, assignedTo, search, pageable);
        return ResponseEntity.ok(leads);
    }

    @GetMapping("/leads/{id}")
    public ResponseEntity<LeadDto> getLead(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        LeadDto lead = crmService.getLead(tenantId, id);
        return ResponseEntity.ok(lead);
    }

    @PutMapping("/leads/{id}")
    public ResponseEntity<LeadDto> updateLead(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @Valid @RequestBody LeadDto leadDto) {
        LeadDto updated = crmService.updateLead(tenantId, id, leadDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/leads/{id}")
    public ResponseEntity<Void> deleteLead(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        crmService.deleteLead(tenantId, id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/leads/{id}/status")
    public ResponseEntity<LeadDto> updateLeadStatus(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam String status) {
        LeadDto updated = crmService.updateLeadStatus(tenantId, id, status);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/leads/{id}/assign")
    public ResponseEntity<LeadDto> assignLead(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam UUID assignedTo) {
        LeadDto updated = crmService.assignLead(tenantId, id, assignedTo);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/leads/{id}/convert")
    public ResponseEntity<Map<String, Object>> convertLead(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        Map<String, Object> result = crmService.convertLead(tenantId, id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/leads/{id}/contact")
    public ResponseEntity<LeadDto> recordContact(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestBody Map<String, String> contactData) {
        LeadDto updated = crmService.recordContact(tenantId, id, contactData);
        return ResponseEntity.ok(updated);
    }

    // Analytics & Reports
    @GetMapping("/analytics/pipeline")
    public ResponseEntity<Map<String, Object>> getPipelineAnalytics(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> analytics = crmService.getPipelineAnalytics(tenantId);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/conversion")
    public ResponseEntity<Map<String, Object>> getConversionAnalytics(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String period) {
        Map<String, Object> analytics = crmService.getConversionAnalytics(tenantId, period);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/sources")
    public ResponseEntity<Map<String, Object>> getSourceAnalytics(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> analytics = crmService.getSourceAnalytics(tenantId);
        return ResponseEntity.ok(analytics);
    }

    // Follow-up Management
    @GetMapping("/follow-ups")
    public ResponseEntity<Page<LeadDto>> getFollowUps(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) UUID assignedTo,
            @RequestParam(defaultValue = "false") boolean overdue,
            Pageable pageable) {
        Page<LeadDto> followUps = crmService.getFollowUps(tenantId, assignedTo, overdue, pageable);
        return ResponseEntity.ok(followUps);
    }

    @PutMapping("/leads/{id}/follow-up")
    public ResponseEntity<LeadDto> scheduleFollowUp(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam String followUpDate) {
        LeadDto updated = crmService.scheduleFollowUp(tenantId, id, followUpDate);
        return ResponseEntity.ok(updated);
    }

    // HubSpot Integration
    @PostMapping("/hubspot/sync")
    public ResponseEntity<Map<String, Object>> syncWithHubSpot(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> result = crmService.syncWithHubSpot(tenantId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/leads/{id}/hubspot")
    public ResponseEntity<LeadDto> pushToHubSpot(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        LeadDto updated = crmService.pushToHubSpot(tenantId, id);
        return ResponseEntity.ok(updated);
    }
}
