package com.i3m.healthcare.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.UUID;

public class MedicalRecordDto {
    private UUID id;
    
    @NotNull(message = "Patient ID is required")
    private UUID patientId;
    
    @NotBlank(message = "Record type is required")
    @Pattern(regexp = "^(CONSULTATION|DIAGNOSIS|TREATMENT|LAB_RESULT|IMAGING|PRESCRIPTION|PROCEDURE|VITAL_SIGNS|EMERGENCY)$", 
             message = "Record type must be valid")
    private String recordType;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(max = 10000, message = "Content must not exceed 10000 characters")
    private String content;
    
    @NotNull(message = "Date of record is required")
    private LocalDateTime recordDate;
    
    @NotNull(message = "Physician ID is required")
    private UUID physicianId;
    
    @NotBlank(message = "Physician name is required")
    @Size(max = 200, message = "Physician name must not exceed 200 characters")
    private String physicianName;
    
    @Pattern(regexp = "^(DRAFT|PENDING_REVIEW|APPROVED|SIGNED|ARCHIVED)$", 
             message = "Status must be DRAFT, PENDING_REVIEW, APPROVED, SIGNED, or ARCHIVED")
    private String status;
    
    @Size(max = 1000, message = "Diagnosis must not exceed 1000 characters")
    private String diagnosis;
    
    @Size(max = 1000, message = "Treatment plan must not exceed 1000 characters")
    private String treatmentPlan;
    
    @Size(max = 1000, message = "Medications must not exceed 1000 characters")
    private String medications;
    
    @Size(max = 1000, message = "Vital signs must not exceed 1000 characters")
    private String vitalSigns;
    
    @Size(max = 1000, message = "Lab results must not exceed 1000 characters")
    private String labResults;
    
    @Size(max = 1000, message = "Imaging results must not exceed 1000 characters")
    private String imagingResults;
    
    @Size(max = 1000, message = "Follow-up instructions must not exceed 1000 characters")
    private String followUpInstructions;
    
    private LocalDateTime nextAppointment;
    
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
    
    private Boolean isSigned;
    private LocalDateTime signedAt;
    private UUID signedBy;
    private String signedByName;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID createdBy;
    private UUID updatedBy;
    
    // Constructors
    public MedicalRecordDto() {}
    
    public MedicalRecordDto(UUID id, UUID patientId, String recordType, String title, String content, 
                          LocalDateTime recordDate, UUID physicianId, String physicianName, String status) {
        this.id = id;
        this.patientId = patientId;
        this.recordType = recordType;
        this.title = title;
        this.content = content;
        this.recordDate = recordDate;
        this.physicianId = physicianId;
        this.physicianName = physicianName;
        this.status = status;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }
    
    public String getRecordType() { return recordType; }
    public void setRecordType(String recordType) { this.recordType = recordType; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public LocalDateTime getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDateTime recordDate) { this.recordDate = recordDate; }
    
    public UUID getPhysicianId() { return physicianId; }
    public void setPhysicianId(UUID physicianId) { this.physicianId = physicianId; }
    
    public String getPhysicianName() { return physicianName; }
    public void setPhysicianName(String physicianName) { this.physicianName = physicianName; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    
    public String getTreatmentPlan() { return treatmentPlan; }
    public void setTreatmentPlan(String treatmentPlan) { this.treatmentPlan = treatmentPlan; }
    
    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }
    
    public String getVitalSigns() { return vitalSigns; }
    public void setVitalSigns(String vitalSigns) { this.vitalSigns = vitalSigns; }
    
    public String getLabResults() { return labResults; }
    public void setLabResults(String labResults) { this.labResults = labResults; }
    
    public String getImagingResults() { return imagingResults; }
    public void setImagingResults(String imagingResults) { this.imagingResults = imagingResults; }
    
    public String getFollowUpInstructions() { return followUpInstructions; }
    public void setFollowUpInstructions(String followUpInstructions) { this.followUpInstructions = followUpInstructions; }
    
    public LocalDateTime getNextAppointment() { return nextAppointment; }
    public void setNextAppointment(LocalDateTime nextAppointment) { this.nextAppointment = nextAppointment; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public Boolean getIsSigned() { return isSigned; }
    public void setIsSigned(Boolean isSigned) { this.isSigned = isSigned; }
    
    public LocalDateTime getSignedAt() { return signedAt; }
    public void setSignedAt(LocalDateTime signedAt) { this.signedAt = signedAt; }
    
    public UUID getSignedBy() { return signedBy; }
    public void setSignedBy(UUID signedBy) { this.signedBy = signedBy; }
    
    public String getSignedByName() { return signedByName; }
    public void setSignedByName(String signedByName) { this.signedByName = signedByName; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
}
