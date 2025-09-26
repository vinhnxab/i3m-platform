package com.i3m.crm.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "leads", schema = "crm")
public class Lead {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @NotNull
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    @NotNull
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Email
    @Column(name = "email")
    private String email;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "company")
    private String company;
    
    @Column(name = "job_title")
    private String jobTitle;
    
    @NotNull
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private LeadStatus status = LeadStatus.NEW;
    
    @Column(name = "source")
    private String source;
    
    @Column(name = "campaign")
    private String campaign;
    
    @Column(name = "estimated_value", precision = 19, scale = 2)
    private BigDecimal estimatedValue;
    
    @Column(name = "probability")
    private Integer probability; // 0-100
    
    @Column(name = "assigned_to")
    private UUID assignedTo;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "tags")
    private String tags; // Comma-separated tags
    
    @Column(name = "last_contacted_at")
    private LocalDateTime lastContactedAt;
    
    @Column(name = "next_follow_up_at")
    private LocalDateTime nextFollowUpAt;
    
    @Column(name = "converted_at")
    private LocalDateTime convertedAt;
    
    @Column(name = "converted_to_customer_id")
    private UUID convertedToCustomerId;
    
    @Column(name = "hubspot_contact_id")
    private String hubspotContactId;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum LeadStatus {
        NEW, CONTACTED, QUALIFIED, PROPOSAL_SENT, NEGOTIATION, 
        CONVERTED, LOST, UNQUALIFIED
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Lead() {}
    
    public Lead(UUID tenantId, String firstName, String email) {
        this.tenantId = tenantId;
        this.firstName = firstName;
        this.email = email;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    
    public LeadStatus getStatus() { return status; }
    public void setStatus(LeadStatus status) { this.status = status; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public String getCampaign() { return campaign; }
    public void setCampaign(String campaign) { this.campaign = campaign; }
    
    public BigDecimal getEstimatedValue() { return estimatedValue; }
    public void setEstimatedValue(BigDecimal estimatedValue) { this.estimatedValue = estimatedValue; }
    
    public Integer getProbability() { return probability; }
    public void setProbability(Integer probability) { this.probability = probability; }
    
    public UUID getAssignedTo() { return assignedTo; }
    public void setAssignedTo(UUID assignedTo) { this.assignedTo = assignedTo; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    
    public LocalDateTime getLastContactedAt() { return lastContactedAt; }
    public void setLastContactedAt(LocalDateTime lastContactedAt) { this.lastContactedAt = lastContactedAt; }
    
    public LocalDateTime getNextFollowUpAt() { return nextFollowUpAt; }
    public void setNextFollowUpAt(LocalDateTime nextFollowUpAt) { this.nextFollowUpAt = nextFollowUpAt; }
    
    public LocalDateTime getConvertedAt() { return convertedAt; }
    public void setConvertedAt(LocalDateTime convertedAt) { this.convertedAt = convertedAt; }
    
    public UUID getConvertedToCustomerId() { return convertedToCustomerId; }
    public void setConvertedToCustomerId(UUID convertedToCustomerId) { 
        this.convertedToCustomerId = convertedToCustomerId; 
    }
    
    public String getHubspotContactId() { return hubspotContactId; }
    public void setHubspotContactId(String hubspotContactId) { this.hubspotContactId = hubspotContactId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public String getFullName() {
        return firstName + (lastName != null ? " " + lastName : "");
    }
}
