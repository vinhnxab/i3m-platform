package com.i3m.healthcare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "patients", schema = "healthcare")
public class Patient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    @NotNull
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    @NotNull
    @Column(name = "medical_record_number", nullable = false, unique = true)
    private String medicalRecordNumber;
    
    @NotNull
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @NotNull
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Past
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @NotNull
    @Column(name = "gender", nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    @Email
    @Column(name = "email")
    private String email;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "address", columnDefinition = "TEXT")
    private String address; // JSON string for structured address
    
    @Column(name = "emergency_contact", columnDefinition = "TEXT")
    private String emergencyContact; // JSON string
    
    @Column(name = "insurance_info", columnDefinition = "TEXT")
    private String insuranceInfo; // JSON string - encrypted
    
    @Column(name = "social_security_number")
    private String socialSecurityNumber; // Encrypted
    
    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;
    
    @Column(name = "medical_conditions", columnDefinition = "TEXT")
    private String medicalConditions;
    
    @Column(name = "medications", columnDefinition = "TEXT")
    private String medications;
    
    @Column(name = "blood_type")
    private String bloodType;
    
    @NotNull
    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private PatientStatus status = PatientStatus.ACTIVE;
    
    @Column(name = "primary_physician_id")
    private UUID primaryPhysicianId;
    
    @Column(name = "consent_forms", columnDefinition = "TEXT")
    private String consentForms; // JSON array of consent documents
    
    @Column(name = "hipaa_authorization")
    private Boolean hipaaAuthorization = false;
    
    @Column(name = "last_visit_date")
    private LocalDateTime lastVisitDate;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private UUID createdBy;
    
    @Column(name = "updated_by")
    private UUID updatedBy;
    
    public enum Gender {
        MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    }
    
    public enum PatientStatus {
        ACTIVE, INACTIVE, DECEASED, TRANSFERRED
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (medicalRecordNumber == null) {
            medicalRecordNumber = "MRN-" + System.currentTimeMillis();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Patient() {}
    
    public Patient(UUID tenantId, String firstName, String lastName, LocalDate dateOfBirth, Gender gender) {
        this.tenantId = tenantId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public UUID getTenantId() { return tenantId; }
    public void setTenantId(UUID tenantId) { this.tenantId = tenantId; }
    
    public String getMedicalRecordNumber() { return medicalRecordNumber; }
    public void setMedicalRecordNumber(String medicalRecordNumber) { 
        this.medicalRecordNumber = medicalRecordNumber; 
    }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    
    public String getInsuranceInfo() { return insuranceInfo; }
    public void setInsuranceInfo(String insuranceInfo) { this.insuranceInfo = insuranceInfo; }
    
    public String getSocialSecurityNumber() { return socialSecurityNumber; }
    public void setSocialSecurityNumber(String socialSecurityNumber) { 
        this.socialSecurityNumber = socialSecurityNumber; 
    }
    
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    
    public String getMedicalConditions() { return medicalConditions; }
    public void setMedicalConditions(String medicalConditions) { this.medicalConditions = medicalConditions; }
    
    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }
    
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    
    public PatientStatus getStatus() { return status; }
    public void setStatus(PatientStatus status) { this.status = status; }
    
    public UUID getPrimaryPhysicianId() { return primaryPhysicianId; }
    public void setPrimaryPhysicianId(UUID primaryPhysicianId) { this.primaryPhysicianId = primaryPhysicianId; }
    
    public String getConsentForms() { return consentForms; }
    public void setConsentForms(String consentForms) { this.consentForms = consentForms; }
    
    public Boolean getHipaaAuthorization() { return hipaaAuthorization; }
    public void setHipaaAuthorization(Boolean hipaaAuthorization) { this.hipaaAuthorization = hipaaAuthorization; }
    
    public LocalDateTime getLastVisitDate() { return lastVisitDate; }
    public void setLastVisitDate(LocalDateTime lastVisitDate) { this.lastVisitDate = lastVisitDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
    
    // Helper methods
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public int getAge() {
        if (dateOfBirth == null) return 0;
        return LocalDate.now().getYear() - dateOfBirth.getYear();
    }
}
