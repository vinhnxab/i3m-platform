package com.i3m.procurementservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@RequiredArgsConstructor
public class HealthController {

    private final DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("service", "procurement-service");
        health.put("version", "1.0.0");
        health.put("status", "healthy");
        health.put("timestamp", LocalDateTime.now());
        health.put("environment", "production");
        
        Map<String, Object> checks = new HashMap<>();
        checks.put("database", checkDatabase());
        checks.put("memory", checkMemory());
        checks.put("disk", checkDisk());
        
        health.put("checks", checks);
        
        // Determine overall status
        boolean allHealthy = checks.values().stream()
            .allMatch(check -> {
                if (check instanceof Map) {
                    return "healthy".equals(((Map<?, ?>) check).get("status"));
                }
                return false;
            });
        
        health.put("status", allHealthy ? "healthy" : "degraded");
        
        return ResponseEntity.ok(health);
    }


    private Map<String, Object> checkDatabase() {
        Map<String, Object> dbHealth = new HashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(1)) {
                dbHealth.put("status", "healthy");
                dbHealth.put("message", "Database connection successful");
                dbHealth.put("url", connection.getMetaData().getURL());
            } else {
                dbHealth.put("status", "unhealthy");
                dbHealth.put("message", "Database connection invalid");
            }
        } catch (Exception e) {
            dbHealth.put("status", "unhealthy");
            dbHealth.put("message", "Database connection failed: " + e.getMessage());
        }
        return dbHealth;
    }

    private Map<String, Object> checkMemory() {
        Map<String, Object> memoryHealth = new HashMap<>();
        Runtime runtime = Runtime.getRuntime();
        
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;
        
        double usagePercentage = (double) usedMemory / maxMemory * 100;
        
        memoryHealth.put("status", usagePercentage < 80 ? "healthy" : "warning");
        memoryHealth.put("usage_percentage", Math.round(usagePercentage * 100.0) / 100.0);
        memoryHealth.put("used_mb", usedMemory / 1024 / 1024);
        memoryHealth.put("max_mb", maxMemory / 1024 / 1024);
        
        return memoryHealth;
    }

    private Map<String, Object> checkDisk() {
        Map<String, Object> diskHealth = new HashMap<>();
        try {
            java.io.File root = new java.io.File("/");
            long totalSpace = root.getTotalSpace();
            long freeSpace = root.getFreeSpace();
            long usedSpace = totalSpace - freeSpace;
            
            double usagePercentage = (double) usedSpace / totalSpace * 100;
            
            diskHealth.put("status", usagePercentage < 90 ? "healthy" : "warning");
            diskHealth.put("usage_percentage", Math.round(usagePercentage * 100.0) / 100.0);
            diskHealth.put("free_gb", freeSpace / 1024 / 1024 / 1024);
            diskHealth.put("total_gb", totalSpace / 1024 / 1024 / 1024);
        } catch (Exception e) {
            diskHealth.put("status", "unknown");
            diskHealth.put("message", "Could not check disk space: " + e.getMessage());
        }
        return diskHealth;
    }
}
