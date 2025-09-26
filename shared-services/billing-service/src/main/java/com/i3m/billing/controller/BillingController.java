package com.i3m.billing.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/billing")
@CrossOrigin(origins = "*")
public class BillingController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "Billing Service",
            "version", "1.0.0",
            "timestamp", System.currentTimeMillis()
        ));
    }
}


