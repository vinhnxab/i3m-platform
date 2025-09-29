package com.i3m.analytics.service;

import com.i3m.analytics.dto.AnalyticsEventDto;
import com.i3m.analytics.dto.DashboardDto;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AnalyticsService {
    
    // In-memory storage for demo purposes
    private final Map<UUID, AnalyticsEventDto> events = new HashMap<>();
    private final Map<UUID, DashboardDto> dashboards = new HashMap<>();
    
    public AnalyticsService() {
        // Initialize with some sample data
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        UUID tenantId = UUID.fromString("00000000-0000-0000-0000-000000000000");
        
        // Sample event
        AnalyticsEventDto event = new AnalyticsEventDto();
        event.setId(UUID.randomUUID());
        event.setEventType("USER_ACTION");
        event.setEventName("login");
        event.setTenantId(tenantId);
        event.setUserId(UUID.randomUUID());
        event.setDescription("User login event");
        event.setTimestamp(LocalDateTime.now());
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        
        Map<String, Object> properties = new HashMap<>();
        properties.put("source", "web");
        properties.put("ip", "192.168.1.1");
        event.setProperties(properties);
        
        events.put(event.getId(), event);
        
        // Sample dashboard
        DashboardDto dashboard = new DashboardDto();
        dashboard.setId(UUID.randomUUID());
        dashboard.setName("Main Dashboard");
        dashboard.setDescription("Main analytics dashboard");
        dashboard.setTenantId(tenantId);
        dashboard.setCreatedBy(UUID.randomUUID());
        dashboard.setPublic(true);
        dashboard.setDefault(true);
        dashboard.setCreatedAt(LocalDateTime.now());
        dashboard.setUpdatedAt(LocalDateTime.now());
        
        dashboards.put(dashboard.getId(), dashboard);
    }
    
    public AnalyticsEventDto createEvent(UUID tenantId, AnalyticsEventDto eventDto) {
        eventDto.setId(UUID.randomUUID());
        eventDto.setTenantId(tenantId);
        eventDto.setTimestamp(LocalDateTime.now());
        eventDto.setCreatedAt(LocalDateTime.now());
        eventDto.setUpdatedAt(LocalDateTime.now());
        events.put(eventDto.getId(), eventDto);
        return eventDto;
    }
    
    public List<AnalyticsEventDto> getEvents(UUID tenantId, String eventType, UUID userId, 
                                           LocalDateTime startDate, LocalDateTime endDate) {
        List<AnalyticsEventDto> filteredEvents = new ArrayList<>(events.values());
        
        // Apply filters
        filteredEvents = filteredEvents.stream()
            .filter(event -> tenantId.equals(event.getTenantId()))
            .filter(event -> eventType == null || eventType.equals(event.getEventType()))
            .filter(event -> userId == null || userId.equals(event.getUserId()))
            .filter(event -> startDate == null || !event.getTimestamp().isBefore(startDate))
            .filter(event -> endDate == null || !event.getTimestamp().isAfter(endDate))
            .sorted(Comparator.comparing(AnalyticsEventDto::getTimestamp).reversed())
            .toList();
        
        return filteredEvents;
    }
    
    public AnalyticsEventDto getEvent(UUID tenantId, UUID eventId) {
        AnalyticsEventDto event = events.get(eventId);
        if (event == null || !tenantId.equals(event.getTenantId())) {
            throw new RuntimeException("Event not found with id: " + eventId);
        }
        return event;
    }
    
    public AnalyticsEventDto updateEvent(UUID tenantId, UUID eventId, AnalyticsEventDto eventDto) {
        AnalyticsEventDto existingEvent = events.get(eventId);
        if (existingEvent == null || !tenantId.equals(existingEvent.getTenantId())) {
            throw new RuntimeException("Event not found with id: " + eventId);
        }
        
        // Update fields
        existingEvent.setEventType(eventDto.getEventType());
        existingEvent.setEventName(eventDto.getEventName());
        existingEvent.setUserId(eventDto.getUserId());
        existingEvent.setSessionId(eventDto.getSessionId());
        existingEvent.setDescription(eventDto.getDescription());
        existingEvent.setProperties(eventDto.getProperties());
        existingEvent.setMetadata(eventDto.getMetadata());
        existingEvent.setUpdatedAt(LocalDateTime.now());
        
        events.put(eventId, existingEvent);
        return existingEvent;
    }
    
    public void deleteEvent(UUID tenantId, UUID eventId) {
        AnalyticsEventDto event = events.get(eventId);
        if (event == null || !tenantId.equals(event.getTenantId())) {
            throw new RuntimeException("Event not found with id: " + eventId);
        }
        events.remove(eventId);
    }
    
    public DashboardDto createDashboard(UUID tenantId, DashboardDto dashboardDto) {
        dashboardDto.setId(UUID.randomUUID());
        dashboardDto.setTenantId(tenantId);
        dashboardDto.setCreatedAt(LocalDateTime.now());
        dashboardDto.setUpdatedAt(LocalDateTime.now());
        dashboards.put(dashboardDto.getId(), dashboardDto);
        return dashboardDto;
    }
    
    public List<DashboardDto> getDashboards(UUID tenantId, UUID createdBy, Boolean isPublic) {
        List<DashboardDto> filteredDashboards = new ArrayList<>(dashboards.values());
        
        // Apply filters
        filteredDashboards = filteredDashboards.stream()
            .filter(dashboard -> tenantId.equals(dashboard.getTenantId()))
            .filter(dashboard -> createdBy == null || createdBy.equals(dashboard.getCreatedBy()))
            .filter(dashboard -> isPublic == null || isPublic.equals(dashboard.isPublic()))
            .sorted(Comparator.comparing(DashboardDto::getCreatedAt).reversed())
            .toList();
        
        return filteredDashboards;
    }
    
    public DashboardDto getDashboard(UUID tenantId, UUID dashboardId) {
        DashboardDto dashboard = dashboards.get(dashboardId);
        if (dashboard == null || !tenantId.equals(dashboard.getTenantId())) {
            throw new RuntimeException("Dashboard not found with id: " + dashboardId);
        }
        return dashboard;
    }
    
    public DashboardDto updateDashboard(UUID tenantId, UUID dashboardId, DashboardDto dashboardDto) {
        DashboardDto existingDashboard = dashboards.get(dashboardId);
        if (existingDashboard == null || !tenantId.equals(existingDashboard.getTenantId())) {
            throw new RuntimeException("Dashboard not found with id: " + dashboardId);
        }
        
        // Update fields
        existingDashboard.setName(dashboardDto.getName());
        existingDashboard.setDescription(dashboardDto.getDescription());
        existingDashboard.setPublic(dashboardDto.isPublic());
        existingDashboard.setDefault(dashboardDto.isDefault());
        existingDashboard.setWidgets(dashboardDto.getWidgets());
        existingDashboard.setSettings(dashboardDto.getSettings());
        existingDashboard.setFilters(dashboardDto.getFilters());
        existingDashboard.setUpdatedAt(LocalDateTime.now());
        
        dashboards.put(dashboardId, existingDashboard);
        return existingDashboard;
    }
    
    public void deleteDashboard(UUID tenantId, UUID dashboardId) {
        DashboardDto dashboard = dashboards.get(dashboardId);
        if (dashboard == null || !tenantId.equals(dashboard.getTenantId())) {
            throw new RuntimeException("Dashboard not found with id: " + dashboardId);
        }
        dashboards.remove(dashboardId);
    }
    
    public Map<String, Object> getAnalytics(UUID tenantId, String metric, String period) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Calculate basic analytics
        long totalEvents = events.values().stream()
            .filter(event -> tenantId.equals(event.getTenantId()))
            .count();
        
        long uniqueUsers = events.values().stream()
            .filter(event -> tenantId.equals(event.getTenantId()))
            .map(AnalyticsEventDto::getUserId)
            .distinct()
            .count();
        
        // Event type breakdown
        Map<String, Long> eventTypeCount = new HashMap<>();
        events.values().stream()
            .filter(event -> tenantId.equals(event.getTenantId()))
            .forEach(event -> {
                String eventType = event.getEventType();
                eventTypeCount.put(eventType, eventTypeCount.getOrDefault(eventType, 0L) + 1);
            });
        
        analytics.put("totalEvents", totalEvents);
        analytics.put("uniqueUsers", uniqueUsers);
        analytics.put("eventTypeBreakdown", eventTypeCount);
        analytics.put("metric", metric);
        analytics.put("period", period);
        analytics.put("timestamp", LocalDateTime.now());
        
        return analytics;
    }
    
    public Map<String, Object> getMetrics(UUID tenantId, String metric, String period) {
        Map<String, Object> metrics = new HashMap<>();
        
        // Calculate metrics based on events
        long totalEvents = events.values().stream()
            .filter(event -> tenantId.equals(event.getTenantId()))
            .count();
        
        double averageEventsPerUser = 0.0;
        long uniqueUsers = events.values().stream()
            .filter(event -> tenantId.equals(event.getTenantId()))
            .map(AnalyticsEventDto::getUserId)
            .distinct()
            .count();
        
        if (uniqueUsers > 0) {
            averageEventsPerUser = (double) totalEvents / uniqueUsers;
        }
        
        metrics.put("totalEvents", totalEvents);
        metrics.put("uniqueUsers", uniqueUsers);
        metrics.put("averageEventsPerUser", averageEventsPerUser);
        metrics.put("metric", metric);
        metrics.put("period", period);
        metrics.put("timestamp", LocalDateTime.now());
        
        return metrics;
    }
    
    // Additional methods required by controller
    public AnalyticsEventDto trackEvent(UUID tenantId, AnalyticsEventDto eventDto) {
        return createEvent(tenantId, eventDto);
    }
    
    public org.springframework.data.domain.Page<AnalyticsEventDto> getEvents(
            UUID tenantId, String eventType, String eventName, UUID userId, 
            String startDate, String endDate, org.springframework.data.domain.Pageable pageable) {
        
        List<AnalyticsEventDto> filteredEvents = getEvents(tenantId, eventType, userId, null, null);
        
        // Apply additional filters
        if (eventName != null && !eventName.trim().isEmpty()) {
            filteredEvents = filteredEvents.stream()
                .filter(event -> eventName.equals(event.getEventName()))
                .toList();
        }
        
        // Simple pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filteredEvents.size());
        List<AnalyticsEventDto> pageContent = start < filteredEvents.size() ? 
            filteredEvents.subList(start, end) : new ArrayList<>();
        
        return new org.springframework.data.domain.PageImpl<>(
            pageContent, pageable, filteredEvents.size());
    }
    
    public org.springframework.data.domain.Page<DashboardDto> getDashboards(
            UUID tenantId, String name, Boolean isPublic, UUID createdBy, 
            org.springframework.data.domain.Pageable pageable) {
        
        List<DashboardDto> filteredDashboards = getDashboards(tenantId, createdBy, isPublic);
        
        // Apply name filter
        if (name != null && !name.trim().isEmpty()) {
            filteredDashboards = filteredDashboards.stream()
                .filter(dashboard -> dashboard.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();
        }
        
        // Simple pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filteredDashboards.size());
        List<DashboardDto> pageContent = start < filteredDashboards.size() ? 
            filteredDashboards.subList(start, end) : new ArrayList<>();
        
        return new org.springframework.data.domain.PageImpl<>(
            pageContent, pageable, filteredDashboards.size());
    }
    
    public Map<String, Object> getDashboardData(UUID tenantId) {
        Map<String, Object> data = new HashMap<>();
        
        long totalDashboards = dashboards.values().stream()
            .filter(dashboard -> tenantId.equals(dashboard.getTenantId()))
            .count();
        
        long publicDashboards = dashboards.values().stream()
            .filter(dashboard -> tenantId.equals(dashboard.getTenantId()) && dashboard.isPublic())
            .count();
        
        data.put("totalDashboards", totalDashboards);
        data.put("publicDashboards", publicDashboards);
        data.put("privateDashboards", totalDashboards - publicDashboards);
        data.put("timestamp", LocalDateTime.now());
        
        return data;
    }
    
    public Map<String, Object> getKPIs(UUID tenantId, String period, String[] kpis) {
        Map<String, Object> kpiData = new HashMap<>();
        
        // Calculate KPIs based on events
        long totalEvents = events.values().stream()
            .filter(event -> tenantId.equals(event.getTenantId()))
            .count();
        
        long uniqueUsers = events.values().stream()
            .filter(event -> tenantId.equals(event.getTenantId()))
            .map(AnalyticsEventDto::getUserId)
            .distinct()
            .count();
        
        kpiData.put("totalEvents", totalEvents);
        kpiData.put("uniqueUsers", uniqueUsers);
        kpiData.put("period", period);
        kpiData.put("kpis", Arrays.asList(kpis));
        kpiData.put("timestamp", LocalDateTime.now());
        
        return kpiData;
    }
    
    public Map<String, Object> getMetrics(UUID tenantId, String metric, String period, String dimension) {
        Map<String, Object> metrics = getMetrics(tenantId, metric, period);
        metrics.put("dimension", dimension);
        return metrics;
    }
    
    public Map<String, Object> getReports(UUID tenantId, String reportType, String format, 
                                        String startDate, String endDate) {
        Map<String, Object> report = new HashMap<>();
        
        report.put("reportType", reportType);
        report.put("format", format);
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("status", "generated");
        report.put("timestamp", LocalDateTime.now());
        
        return report;
    }
    
    public Map<String, Object> generateReport(UUID tenantId, Map<String, Object> reportConfig) {
        Map<String, Object> report = new HashMap<>();
        
        report.put("reportId", UUID.randomUUID());
        report.put("status", "generated");
        report.put("config", reportConfig);
        report.put("timestamp", LocalDateTime.now());
        
        return report;
    }
    
    public Map<String, Object> getRealtimeMetrics(UUID tenantId) {
        Map<String, Object> metrics = new HashMap<>();
        
        // Get recent events (last hour)
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long recentEvents = events.values().stream()
            .filter(event -> tenantId.equals(event.getTenantId()))
            .filter(event -> event.getTimestamp().isAfter(oneHourAgo))
            .count();
        
        metrics.put("recentEvents", recentEvents);
        metrics.put("timestamp", LocalDateTime.now());
        
        return metrics;
    }
    
    public List<AnalyticsEventDto> getRealtimeEvents(UUID tenantId, int limit) {
        return events.values().stream()
            .filter(event -> tenantId.equals(event.getTenantId()))
            .sorted(Comparator.comparing(AnalyticsEventDto::getTimestamp).reversed())
            .limit(limit)
            .toList();
    }
    
    public Map<String, Object> exportEvents(UUID tenantId, String format, String startDate, String endDate) {
        Map<String, Object> export = new HashMap<>();
        
        List<AnalyticsEventDto> eventsToExport = getEvents(tenantId, null, null, null, null);
        
        export.put("exportId", UUID.randomUUID());
        export.put("format", format);
        export.put("eventCount", eventsToExport.size());
        export.put("status", "exported");
        export.put("timestamp", LocalDateTime.now());
        
        return export;
    }
    
    public Map<String, Object> exportDashboard(UUID tenantId, UUID dashboardId, String format) {
        Map<String, Object> export = new HashMap<>();
        
        DashboardDto dashboard = getDashboard(tenantId, dashboardId);
        
        export.put("exportId", UUID.randomUUID());
        export.put("dashboardId", dashboardId);
        export.put("dashboardName", dashboard.getName());
        export.put("format", format);
        export.put("status", "exported");
        export.put("timestamp", LocalDateTime.now());
        
        return export;
    }
    
    public Map<String, Object> getAnalyticsConfig(UUID tenantId) {
        Map<String, Object> config = new HashMap<>();
        
        config.put("tenantId", tenantId);
        config.put("trackingEnabled", true);
        config.put("retentionDays", 365);
        config.put("realTimeEnabled", true);
        config.put("timestamp", LocalDateTime.now());
        
        return config;
    }
    
    public Map<String, Object> updateAnalyticsConfig(UUID tenantId, Map<String, Object> config) {
        Map<String, Object> updatedConfig = new HashMap<>();
        
        updatedConfig.put("tenantId", tenantId);
        updatedConfig.putAll(config);
        updatedConfig.put("updatedAt", LocalDateTime.now());
        
        return updatedConfig;
    }
}
