package com.i3m.procurementservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class RootController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "procurement-service");
        response.put("version", "1.0.0");
        response.put("description", "I3M Platform Procurement Service - Procurement Management System");
        response.put("status", "running");
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api/v1/purchase-orders")
    public ResponseEntity<Map<String, Object>> purchaseOrders() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Purchase Orders endpoint - Coming soon");
        response.put("data", new Object[0]);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api/v1/rfq")
    public ResponseEntity<Map<String, Object>> requestForQuotations() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Request for Quotations endpoint - Coming soon");
        response.put("data", new Object[0]);
        
        return ResponseEntity.ok(response);
    }
}
