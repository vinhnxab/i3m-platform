package com.i3m.healthcare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "medical_records", schema = "healthcare")
public class MedicalRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @NotNull
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    @NotNull
    @Column(name = "patient_id", nullable = false)
    private UUID patientId;
    
    @Column(name = "physician_id")
    private UUID physicianId;
    
    @NotNull
    @Column(name = "visit_date", nullable = false)
    private LocalDateTime visitDate;
    
    @NotNull
    @Column(name = "record_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private RecordType recordType;
    
    @Column(name = "chief_complaint", columnDefinition = "TEXT")
    private String chiefComplaint;
    
    @Column(name = "history_of_present_illness", columnDefinition = "TEXT")
    private String historyOfPresentIllness;
    
    @Column(name = "physical_examination", columnDefinition = "TEXT")
    private String physicalExamination;
    
    @Column(name = "vital_signs", columnDefinition = "TEXT")
    private String vitalSigns; // JSON: {"temperature": 98.6, "blood_pressure": "120/80", ...}
    
    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis;
    
    @Column(name = "icd_codes")
    private String icdCodes; // Comma-separated ICD-10 codes
    
    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan;
    
    @Column(name = "medications_prescribed", columnDefinition = "TEXT")
    private String medicationsPrescribed;
    
    @Column(name = "lab_orders", columnDefinition = "TEXT")
    private String labOrders;
    
    @Column(name = "imaging_orders", columnDefinition = "TEXT")
    private String imagingOrders;
    
    @Column(name = "follow_up_instructions", columnDefinition = "TEXT")
    private String followUpInstructions;
    
    @Column(name = "next_appointment")
    private LocalDateTime nextAppointment;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "attachments", columnDefinition = "TEXT")
    private String attachments; // JSON array of file references
    
    @NotNull
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private RecordStatus status = RecordStatus.DRAFT;
    
    @Column(name = "signed_at")
    private LocalDateTime signedAt;
    
    @Column(name = "signed_by")
    private UUID signedBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private UUID createdBy;
    
    @Column(name = "updated_by")
    private UUID updatedBy;
    
    public enum RecordType {
        CONSULTATION, FOLLOW_UP, EMERGENCY, SURGERY, LAB_RESULT, 
        IMAGING_RESULT, DISCHARGE_SUMMARY, REFERRAL
    }
    
    public enum RecordStatus {
        DRAFT, PENDING_REVIEW, SIGNED, AMENDED, ARCHIVED
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
    public MedicalRecord() {}
    
    public MedicalRecord(UUID tenantId, UUID patientId, LocalDateTime visitDate, RecordType recordType) {
        this.tenantId = tenantId;
        this.patientId = patientId;
        this.visitDate = visitDate;
        this.recordType = recordType;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    
    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }
    
    public UUID getPhysicianId() { return physicianId; }
    public void setPhysicianId(UUID physicianId) { this.physicianId = physicianId; }
    
    public LocalDateTime getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDateTime visitDate) { this.visitDate = visitDate; }
    
    public RecordType getRecordType() { return recordType; }
    public void setRecordType(RecordType recordType) { this.recordType = recordType; }
    
    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    
    public String getHistoryOfPresentIllness() { return historyOfPresentIllness; }
    public void setHistoryOfPresentIllness(String historyOfPresentIllness) { 
        this.historyOfPresentIllness = historyOfPresentIllness; 
    }
    
    public String getPhysicalExamination() { return physicalExamination; }
    public void setPhysicalExamination(String physicalExamination) { this.physicalExamination = physicalExamination; }
    
    public String getVitalSigns() { return vitalSigns; }
    public void setVitalSigns(String vitalSigns) { this.vitalSigns = vitalSigns; }
    
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    
    public String getIcdCodes() { return icdCodes; }
    public void setIcdCodes(String icdCodes) { this.icdCodes = icdCodes; }
    
    public String getTreatmentPlan() { return treatmentPlan; }
    public void setTreatmentPlan(String treatmentPlan) { this.treatmentPlan = treatmentPlan; }
    
    public String getMedicationsPrescribed() { return medicationsPrescribed; }
    public void setMedicationsPrescribed(String medicationsPrescribed) { 
        this.medicationsPrescribed = medicationsPrescribed; 
    }
    
    public String getLabOrders() { return labOrders; }
    public void setLabOrders(String labOrders) { this.labOrders = labOrders; }
    
    public String getImagingOrders() { return imagingOrders; }
    public void setImagingOrders(String imagingOrders) { this.imagingOrders = imagingOrders; }
    
    public String getFollowUpInstructions() { return followUpInstructions; }
    public void setFollowUpInstructions(String followUpInstructions) { 
        this.followUpInstructions = followUpInstructions; 
    }
    
    public LocalDateTime getNextAppointment() { return nextAppointment; }
    public void setNextAppointment(LocalDateTime nextAppointment) { this.nextAppointment = nextAppointment; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getAttachments() { return attachments; }
    public void setAttachments(String attachments) { this.attachments = attachments; }
    
    public RecordStatus getStatus() { return status; }
    public void setStatus(RecordStatus status) { this.status = status; }
    
    public LocalDateTime getSignedAt() { return signedAt; }
    public void setSignedAt(LocalDateTime signedAt) { this.signedAt = signedAt; }
    
    public UUID getSignedBy() { return signedBy; }
    public void setSignedBy(UUID signedBy) { this.signedBy = signedBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
}
