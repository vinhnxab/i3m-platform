package com.i3m.report.service;

import com.i3m.report.dto.ReportDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ReportService {
    
    // In-memory storage for demo purposes
    private final Map<UUID, ReportDto> reports = new HashMap<>();
    
    public ReportService() {
        // Initialize with some sample data
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        UUID tenantId = UUID.fromString("00000000-0000-0000-0000-000000000000");
        UUID userId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        
        ReportDto report1 = new ReportDto();
        report1.setId(UUID.randomUUID());
        report1.setName("Monthly Sales Report");
        report1.setDescription("Comprehensive monthly sales analysis");
        report1.setTenantId(tenantId);
        report1.setType("FINANCIAL");
        report1.setStatus("PUBLISHED");
        report1.setFormat("PDF");
        report1.setQuery("SELECT * FROM sales WHERE month = ?");
        report1.setTemplate("sales_template.html");
        report1.setCreatedBy(userId);
        report1.setLastModifiedBy(userId);
        report1.setScheduledAt(LocalDateTime.now().plusDays(1));
        report1.setFrequency("MONTHLY");
        report1.setPublic(true);
        report1.setScheduled(true);
        report1.setCreatedAt(LocalDateTime.now());
        report1.setUpdatedAt(LocalDateTime.now());
        report1.setLastGeneratedAt(LocalDateTime.now().minusDays(1));
        
        reports.put(report1.getId(), report1);
        
        ReportDto report2 = new ReportDto();
        report2.setId(UUID.randomUUID());
        report2.setName("Employee Performance Report");
        report2.setDescription("Quarterly employee performance metrics");
        report2.setTenantId(tenantId);
        report2.setType("OPERATIONAL");
        report2.setStatus("DRAFT");
        report2.setFormat("EXCEL");
        report2.setQuery("SELECT * FROM employees WHERE performance_score > ?");
        report2.setTemplate("performance_template.xlsx");
        report2.setCreatedBy(userId);
        report2.setLastModifiedBy(userId);
        report2.setScheduledAt(LocalDateTime.now().plusWeeks(1));
        report2.setFrequency("QUARTERLY");
        report2.setPublic(false);
        report2.setScheduled(true);
        report2.setCreatedAt(LocalDateTime.now());
        report2.setUpdatedAt(LocalDateTime.now());
        
        reports.put(report2.getId(), report2);
    }
    
    public List<ReportDto> getAllReports(UUID tenantId) {
        return reports.values().stream()
            .filter(report -> tenantId.equals(report.getTenantId()))
            .toList();
    }
    
    public ReportDto getReportById(UUID id, UUID tenantId) {
        ReportDto report = reports.get(id);
        if (report != null && tenantId.equals(report.getTenantId())) {
            return report;
        }
        return null;
    }
    
    public ReportDto createReport(ReportDto reportDto) {
        reportDto.setId(UUID.randomUUID());
        reportDto.setCreatedAt(LocalDateTime.now());
        reportDto.setUpdatedAt(LocalDateTime.now());
        reports.put(reportDto.getId(), reportDto);
        return reportDto;
    }
    
    public ReportDto updateReport(UUID id, ReportDto reportDto, UUID tenantId) {
        ReportDto existing = reports.get(id);
        if (existing != null && tenantId.equals(existing.getTenantId())) {
            reportDto.setId(id);
            reportDto.setCreatedAt(existing.getCreatedAt());
            reportDto.setUpdatedAt(LocalDateTime.now());
            reports.put(id, reportDto);
            return reportDto;
        }
        return null;
    }
    
    public boolean deleteReport(UUID id, UUID tenantId) {
        ReportDto report = reports.get(id);
        if (report != null && tenantId.equals(report.getTenantId())) {
            reports.remove(id);
            return true;
        }
        return false;
    }
    
    public List<ReportDto> getReportsByType(String type, UUID tenantId) {
        return reports.values().stream()
            .filter(report -> tenantId.equals(report.getTenantId()) && 
                             type.equals(report.getType()))
            .toList();
    }
    
    public List<ReportDto> getReportsByStatus(String status, UUID tenantId) {
        return reports.values().stream()
            .filter(report -> tenantId.equals(report.getTenantId()) && 
                             status.equals(report.getStatus()))
            .toList();
    }
    
    public List<ReportDto> getScheduledReports(UUID tenantId) {
        return reports.values().stream()
            .filter(report -> tenantId.equals(report.getTenantId()) && 
                             report.isScheduled())
            .toList();
    }
    
    public ReportDto generateReport(UUID id, UUID tenantId) {
        ReportDto report = reports.get(id);
        if (report != null && tenantId.equals(report.getTenantId())) {
            // Simulate report generation
            report.setLastGeneratedAt(LocalDateTime.now());
            report.setUpdatedAt(LocalDateTime.now());
            reports.put(id, report);
            return report;
        }
        return null;
    }
    
    public Map<String, Object> getReportStats(UUID tenantId) {
        List<ReportDto> tenantReports = reports.values().stream()
            .filter(report -> tenantId.equals(report.getTenantId()))
            .toList();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReports", tenantReports.size());
        stats.put("publishedReports", tenantReports.stream()
            .filter(report -> "PUBLISHED".equals(report.getStatus()))
            .count());
        stats.put("scheduledReports", tenantReports.stream()
            .filter(ReportDto::isScheduled)
            .count());
        stats.put("reportTypes", tenantReports.stream()
            .map(ReportDto::getType)
            .distinct()
            .count());
        
        return stats;
    }
}
