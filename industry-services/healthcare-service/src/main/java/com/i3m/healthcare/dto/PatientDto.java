package com.i3m.healthcare.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class PatientDto {
    private UUID id;
    
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;
    
    @NotBlank(message = "MRN is required")
    @Size(max = 50, message = "MRN must not exceed 50 characters")
    private String mrn; // Medical Record Number
    
    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;
    
    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(MALE|FEMALE|OTHER|UNKNOWN)$", message = "Gender must be MALE, FEMALE, OTHER, or UNKNOWN")
    private String gender;
    
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be valid")
    private String phoneNumber;
    
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;
    
    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;
    
    @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "ZIP code must be valid")
    private String zipCode;
    
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;
    
    @Pattern(regexp = "^(ACTIVE|INACTIVE|DECEASED|DISCHARGED)$", message = "Status must be ACTIVE, INACTIVE, DECEASED, or DISCHARGED")
    private String status;
    
    private UUID primaryPhysicianId;
    private String primaryPhysicianName;
    
    @Size(max = 1000, message = "Medical history must not exceed 1000 characters")
    private String medicalHistory;
    
    @Size(max = 1000, message = "Allergies must not exceed 1000 characters")
    private String allergies;
    
    @Size(max = 1000, message = "Current medications must not exceed 1000 characters")
    private String currentMedications;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID createdBy;
    private UUID updatedBy;
    
    // Constructors
    public PatientDto() {}
    
    public PatientDto(UUID id, String firstName, String lastName, String mrn, LocalDate dateOfBirth, 
                     String gender, String email, String phoneNumber, String status) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mrn = mrn;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.status = status;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getMrn() { return mrn; }
    public void setMrn(String mrn) { this.mrn = mrn; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public UUID getPrimaryPhysicianId() { return primaryPhysicianId; }
    public void setPrimaryPhysicianId(UUID primaryPhysicianId) { this.primaryPhysicianId = primaryPhysicianId; }
    
    public String getPrimaryPhysicianName() { return primaryPhysicianName; }
    public void setPrimaryPhysicianName(String primaryPhysicianName) { this.primaryPhysicianName = primaryPhysicianName; }
    
    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    
    public String getCurrentMedications() { return currentMedications; }
    public void setCurrentMedications(String currentMedications) { this.currentMedications = currentMedications; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }
    
    public UUID getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UUID updatedBy) { this.updatedBy = updatedBy; }
}
