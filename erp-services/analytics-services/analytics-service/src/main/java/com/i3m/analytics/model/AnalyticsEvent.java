package com.i3m.analytics.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "analytics_events", schema = "analytics")
public class AnalyticsEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @NotNull
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    @NotNull
    @Column(name = "event_type", nullable = false)
    private String eventType;
    
    @NotNull
    @Column(name = "event_name", nullable = false)
    private String eventName;
    
    @Column(name = "user_id")
    private UUID userId;
    
    @Column(name = "session_id")
    private String sessionId;
    
    @Column(name = "properties", columnDefinition = "TEXT")
    private String properties; // JSON string
    
    @Column(name = "context", columnDefinition = "TEXT")
    private String context; // JSON string
    
    @NotNull
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "referrer")
    private String referrer;
    
    @Column(name = "page_url")
    private String pageUrl;
    
    @Column(name = "page_title")
    private String pageTitle;
    
    @Column(name = "device_type")
    private String deviceType;
    
    @Column(name = "browser")
    private String browser;
    
    @Column(name = "os")
    private String os;
    
    @Column(name = "country")
    private String country;
    
    @Column(name = "city")
    private String city;
    
    @Column(name = "value")
    private Double value;
    
    @Column(name = "currency")
    private String currency;
    
    @NotNull
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.PENDING;
    
    public enum EventStatus {
        PENDING, PROCESSED, FAILED, IGNORED
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
    
    // Constructors
    public AnalyticsEvent() {}
    
    public AnalyticsEvent(UUID tenantId, String eventType, String eventName) {
        this.tenantId = tenantId;
        this.eventType = eventType;
        this.eventName = eventName;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    
    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }
    
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    public String getProperties() { return properties; }
    public void setProperties(String properties) { this.properties = properties; }
    
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    
    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }
    
    public String getPageUrl() { return pageUrl; }
    public void setPageUrl(String pageUrl) { this.pageUrl = pageUrl; }
    
    public String getPageTitle() { return pageTitle; }
    public void setPageTitle(String pageTitle) { this.pageTitle = pageTitle; }
    
    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
    
    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }
    
    public String getOs() { return os; }
    public void setOs(String os) { this.os = os; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
    
    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }
}
