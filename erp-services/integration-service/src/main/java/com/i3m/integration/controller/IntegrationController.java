package com.i3m.integration.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/integrations")
@CrossOrigin(origins = "*")
public class IntegrationController {

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Object> health() {
        return ResponseEntity.ok().body(java.util.Map.of(
            "service", "Integration Service",
            "status", "healthy",
            "timestamp", java.time.Instant.now(),
            "version", "1.0.0"
        ));
    }

    // Simple test endpoint
    @GetMapping
    public ResponseEntity<Object> getAllIntegrations(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        return ResponseEntity.ok().body(java.util.Map.of(
            "message", "Integration Service is working",
            "tenantId", tenantId.toString(),
            "integrations", java.util.List.of()
        ));
    }
}