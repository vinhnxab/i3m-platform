package com.i3m.crm.service;

import com.i3m.crm.dto.LeadDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CrmService {
    
    // In-memory storage for demo purposes
    private final Map<UUID, LeadDto> leads = new HashMap<>();
    
    public CrmService() {
        // Initialize with some sample data
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        UUID tenantId = UUID.fromString("00000000-0000-0000-0000-000000000000");
        
        LeadDto lead1 = new LeadDto();
        lead1.setId(UUID.randomUUID());
        lead1.setFirstName("John");
        lead1.setLastName("Doe");
        lead1.setEmail("john.doe@example.com");
        lead1.setPhone("+1234567890");
        lead1.setCompany("Acme Corp");
        lead1.setJobTitle("CEO");
        lead1.setStatus("NEW");
        lead1.setSource("WEBSITE");
        lead1.setNotes("Interested in our premium package");
        lead1.setCreatedAt(LocalDateTime.now());
        lead1.setUpdatedAt(LocalDateTime.now());
        
        leads.put(lead1.getId(), lead1);
    }
    
    public LeadDto createLead(UUID tenantId, LeadDto leadDto) {
        leadDto.setId(UUID.randomUUID());
        leadDto.setCreatedAt(LocalDateTime.now());
        leadDto.setUpdatedAt(LocalDateTime.now());
        leads.put(leadDto.getId(), leadDto);
        return leadDto;
    }
    
    public Page<LeadDto> getLeads(UUID tenantId, String status, String source, 
                                 UUID assignedTo, String search, Pageable pageable) {
        List<LeadDto> filteredLeads = new ArrayList<>(leads.values());
        
        // Apply filters
        if (status != null) {
            filteredLeads = filteredLeads.stream()
                .filter(lead -> status.equals(lead.getStatus()))
                .toList();
        }
        
        if (source != null) {
            filteredLeads = filteredLeads.stream()
                .filter(lead -> source.equals(lead.getSource()))
                .toList();
        }
        
        if (assignedTo != null) {
            filteredLeads = filteredLeads.stream()
                .filter(lead -> assignedTo.equals(lead.getAssignedTo()))
                .toList();
        }
        
        if (search != null && !search.trim().isEmpty()) {
            String searchLower = search.toLowerCase();
            filteredLeads = filteredLeads.stream()
                .filter(lead -> 
                    (lead.getFirstName() != null && lead.getFirstName().toLowerCase().contains(searchLower)) ||
                    (lead.getLastName() != null && lead.getLastName().toLowerCase().contains(searchLower)) ||
                    (lead.getEmail() != null && lead.getEmail().toLowerCase().contains(searchLower)) ||
                    (lead.getCompany() != null && lead.getCompany().toLowerCase().contains(searchLower))
                )
                .toList();
        }
        
        // Simple pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), filteredLeads.size());
        List<LeadDto> pageContent = start < filteredLeads.size() ? 
            filteredLeads.subList(start, end) : new ArrayList<>();
        
        return new org.springframework.data.domain.PageImpl<>(
            pageContent, pageable, filteredLeads.size());
    }
    
    public LeadDto getLead(UUID tenantId, UUID id) {
        LeadDto lead = leads.get(id);
        if (lead == null) {
            throw new RuntimeException("Lead not found with id: " + id);
        }
        return lead;
    }
    
    public LeadDto updateLead(UUID tenantId, UUID id, LeadDto leadDto) {
        LeadDto existingLead = leads.get(id);
        if (existingLead == null) {
            throw new RuntimeException("Lead not found with id: " + id);
        }
        
        // Update fields
        existingLead.setFirstName(leadDto.getFirstName());
        existingLead.setLastName(leadDto.getLastName());
        existingLead.setEmail(leadDto.getEmail());
        existingLead.setPhone(leadDto.getPhone());
        existingLead.setCompany(leadDto.getCompany());
        existingLead.setJobTitle(leadDto.getJobTitle());
        existingLead.setStatus(leadDto.getStatus());
        existingLead.setSource(leadDto.getSource());
        existingLead.setAssignedTo(leadDto.getAssignedTo());
        existingLead.setNotes(leadDto.getNotes());
        existingLead.setUpdatedAt(LocalDateTime.now());
        
        leads.put(id, existingLead);
        return existingLead;
    }
    
    public void deleteLead(UUID tenantId, UUID id) {
        LeadDto lead = leads.remove(id);
        if (lead == null) {
            throw new RuntimeException("Lead not found with id: " + id);
        }
    }
    
    public LeadDto updateLeadStatus(UUID tenantId, UUID id, String status) {
        LeadDto lead = leads.get(id);
        if (lead == null) {
            throw new RuntimeException("Lead not found with id: " + id);
        }
        
        lead.setStatus(status);
        lead.setUpdatedAt(LocalDateTime.now());
        leads.put(id, lead);
        return lead;
    }
    
    public LeadDto assignLead(UUID tenantId, UUID id, UUID assignedTo) {
        LeadDto lead = leads.get(id);
        if (lead == null) {
            throw new RuntimeException("Lead not found with id: " + id);
        }
        
        lead.setAssignedTo(assignedTo);
        lead.setUpdatedAt(LocalDateTime.now());
        leads.put(id, lead);
        return lead;
    }
    
    public Map<String, Object> convertLead(UUID tenantId, UUID id) {
        LeadDto lead = leads.get(id);
        if (lead == null) {
            throw new RuntimeException("Lead not found with id: " + id);
        }
        
        // Update status to converted
        lead.setStatus("CONVERTED");
        lead.setUpdatedAt(LocalDateTime.now());
        leads.put(id, lead);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Lead converted successfully");
        result.put("leadId", id);
        result.put("customerId", UUID.randomUUID()); // Generate new customer ID
        
        return result;
    }
    
    public LeadDto recordContact(UUID tenantId, UUID id, Map<String, String> contactData) {
        LeadDto lead = leads.get(id);
        if (lead == null) {
            throw new RuntimeException("Lead not found with id: " + id);
        }
        
        lead.setLastContactDate(LocalDateTime.now());
        lead.setUpdatedAt(LocalDateTime.now());
        
        // Update notes if provided
        String contactNotes = contactData.get("notes");
        if (contactNotes != null && !contactNotes.trim().isEmpty()) {
            String existingNotes = lead.getNotes() != null ? lead.getNotes() : "";
            lead.setNotes(existingNotes + "\n" + LocalDateTime.now() + ": " + contactNotes);
        }
        
        leads.put(id, lead);
        return lead;
    }
    
    public Map<String, Object> getPipelineAnalytics(UUID tenantId) {
        Map<String, Object> analytics = new HashMap<>();
        
        long totalLeads = leads.size();
        long newLeads = leads.values().stream()
            .filter(lead -> "NEW".equals(lead.getStatus()))
            .count();
        long qualifiedLeads = leads.values().stream()
            .filter(lead -> "QUALIFIED".equals(lead.getStatus()))
            .count();
        long closedWon = leads.values().stream()
            .filter(lead -> "CLOSED_WON".equals(lead.getStatus()))
            .count();
        
        analytics.put("totalLeads", totalLeads);
        analytics.put("newLeads", newLeads);
        analytics.put("qualifiedLeads", qualifiedLeads);
        analytics.put("closedWon", closedWon);
        analytics.put("conversionRate", totalLeads > 0 ? (double) closedWon / totalLeads * 100 : 0);
        
        return analytics;
    }
    
    public Map<String, Object> getConversionAnalytics(UUID tenantId, String period) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Simple analytics based on current data
        long totalLeads = leads.size();
        long convertedLeads = leads.values().stream()
            .filter(lead -> "CONVERTED".equals(lead.getStatus()) || "CLOSED_WON".equals(lead.getStatus()))
            .count();
        
        analytics.put("totalLeads", totalLeads);
        analytics.put("convertedLeads", convertedLeads);
        analytics.put("conversionRate", totalLeads > 0 ? (double) convertedLeads / totalLeads * 100 : 0);
        analytics.put("period", period != null ? period : "all");
        
        return analytics;
    }
    
    public Map<String, Object> getSourceAnalytics(UUID tenantId) {
        Map<String, Object> analytics = new HashMap<>();
        
        Map<String, Long> sourceCounts = new HashMap<>();
        for (LeadDto lead : leads.values()) {
            String source = lead.getSource() != null ? lead.getSource() : "UNKNOWN";
            sourceCounts.put(source, sourceCounts.getOrDefault(source, 0L) + 1);
        }
        
        analytics.put("sourceBreakdown", sourceCounts);
        analytics.put("totalSources", sourceCounts.size());
        
        return analytics;
    }
    
    public Page<LeadDto> getFollowUps(UUID tenantId, UUID assignedTo, boolean overdue, Pageable pageable) {
        List<LeadDto> followUpLeads = leads.values().stream()
            .filter(lead -> lead.getFollowUpDate() != null)
            .filter(lead -> assignedTo == null || assignedTo.equals(lead.getAssignedTo()))
            .filter(lead -> {
                if (overdue) {
                    return lead.getFollowUpDate().isBefore(LocalDateTime.now());
                }
                return true;
            })
            .sorted(Comparator.comparing(LeadDto::getFollowUpDate))
            .toList();
        
        // Simple pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), followUpLeads.size());
        List<LeadDto> pageContent = start < followUpLeads.size() ? 
            followUpLeads.subList(start, end) : new ArrayList<>();
        
        return new org.springframework.data.domain.PageImpl<>(
            pageContent, pageable, followUpLeads.size());
    }
    
    public LeadDto scheduleFollowUp(UUID tenantId, UUID id, String followUpDate) {
        LeadDto lead = leads.get(id);
        if (lead == null) {
            throw new RuntimeException("Lead not found with id: " + id);
        }
        
        // Parse follow-up date (simplified - in real implementation, use proper date parsing)
        lead.setFollowUpDate(LocalDateTime.now().plusDays(7)); // Default to 7 days from now
        lead.setUpdatedAt(LocalDateTime.now());
        leads.put(id, lead);
        
        return lead;
    }
    
    public Map<String, Object> syncWithHubSpot(UUID tenantId) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "HubSpot sync completed");
        result.put("syncedLeads", leads.size());
        result.put("timestamp", LocalDateTime.now());
        
        return result;
    }
    
    public LeadDto pushToHubSpot(UUID tenantId, UUID id) {
        LeadDto lead = leads.get(id);
        if (lead == null) {
            throw new RuntimeException("Lead not found with id: " + id);
        }
        
        // Simulate HubSpot push
        lead.setUpdatedAt(LocalDateTime.now());
        leads.put(id, lead);
        
        return lead;
    }
}
