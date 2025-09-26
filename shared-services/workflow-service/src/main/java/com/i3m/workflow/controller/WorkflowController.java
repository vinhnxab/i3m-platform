package com.i3m.workflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/workflow")
@CrossOrigin(origins = "*")
public class WorkflowController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "Workflow Service",
            "version", "1.0.0",
            "timestamp", System.currentTimeMillis()
        ));
    }
}


