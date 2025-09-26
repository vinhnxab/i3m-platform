package com.i3m.healthcare.controller;

import com.i3m.healthcare.dto.PatientDto;
import com.i3m.healthcare.dto.MedicalRecordDto;
import com.i3m.healthcare.service.HealthcareService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/healthcare")
@CrossOrigin(origins = "*")
public class HealthcareController {

    @Autowired
    private HealthcareService healthcareService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "Healthcare Service",
            "version", "1.0.0",
            "compliance", "HIPAA Compliant",
            "timestamp", System.currentTimeMillis()
        ));
    }

    // Patient Management
    @PostMapping("/patients")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('PHYSICIAN')")
    public ResponseEntity<PatientDto> createPatient(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody PatientDto patientDto) {
        PatientDto created = healthcareService.createPatient(tenantId, patientDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/patients")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('PHYSICIAN') or hasRole('NURSE')")
    public ResponseEntity<Page<PatientDto>> getPatients(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID physicianId,
            Pageable pageable) {
        Page<PatientDto> patients = healthcareService.getPatients(tenantId, status, search, physicianId, pageable);
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/patients/{id}")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('PHYSICIAN') or hasRole('NURSE')")
    public ResponseEntity<PatientDto> getPatient(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        PatientDto patient = healthcareService.getPatient(tenantId, id);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/patients/mrn/{mrn}")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('PHYSICIAN') or hasRole('NURSE')")
    public ResponseEntity<PatientDto> getPatientByMRN(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable String mrn) {
        PatientDto patient = healthcareService.getPatientByMRN(tenantId, mrn);
        return ResponseEntity.ok(patient);
    }

    @PutMapping("/patients/{id}")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('PHYSICIAN')")
    public ResponseEntity<PatientDto> updatePatient(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @Valid @RequestBody PatientDto patientDto) {
        PatientDto updated = healthcareService.updatePatient(tenantId, id, patientDto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/patients/{id}/status")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('PHYSICIAN')")
    public ResponseEntity<PatientDto> updatePatientStatus(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam String status) {
        PatientDto updated = healthcareService.updatePatientStatus(tenantId, id, status);
        return ResponseEntity.ok(updated);
    }

    // Medical Records Management
    @PostMapping("/patients/{patientId}/records")
    @PreAuthorize("hasRole('PHYSICIAN') or hasRole('NURSE')")
    public ResponseEntity<MedicalRecordDto> createMedicalRecord(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID patientId,
            @Valid @RequestBody MedicalRecordDto recordDto) {
        MedicalRecordDto created = healthcareService.createMedicalRecord(tenantId, patientId, recordDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/patients/{patientId}/records")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('PHYSICIAN') or hasRole('NURSE')")
    public ResponseEntity<Page<MedicalRecordDto>> getPatientRecords(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID patientId,
            @RequestParam(required = false) String recordType,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Page<MedicalRecordDto> records = healthcareService.getPatientRecords(
            tenantId, patientId, recordType, status, pageable);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/records/{id}")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('PHYSICIAN') or hasRole('NURSE')")
    public ResponseEntity<MedicalRecordDto> getMedicalRecord(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        MedicalRecordDto record = healthcareService.getMedicalRecord(tenantId, id);
        return ResponseEntity.ok(record);
    }

    @PutMapping("/records/{id}")
    @PreAuthorize("hasRole('PHYSICIAN') or hasRole('NURSE')")
    public ResponseEntity<MedicalRecordDto> updateMedicalRecord(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @Valid @RequestBody MedicalRecordDto recordDto) {
        MedicalRecordDto updated = healthcareService.updateMedicalRecord(tenantId, id, recordDto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/records/{id}/sign")
    @PreAuthorize("hasRole('PHYSICIAN')")
    public ResponseEntity<MedicalRecordDto> signMedicalRecord(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        MedicalRecordDto signed = healthcareService.signMedicalRecord(tenantId, id);
        return ResponseEntity.ok(signed);
    }

    // HIPAA Compliance & Audit
    @GetMapping("/compliance/audit")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('COMPLIANCE_OFFICER')")
    public ResponseEntity<Map<String, Object>> getComplianceAudit(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> audit = healthcareService.getComplianceAudit(tenantId, startDate, endDate);
        return ResponseEntity.ok(audit);
    }

    @GetMapping("/compliance/hipaa-report")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('COMPLIANCE_OFFICER')")
    public ResponseEntity<Map<String, Object>> getHipaaComplianceReport(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> report = healthcareService.getHipaaComplianceReport(tenantId);
        return ResponseEntity.ok(report);
    }

    // Analytics & Reports
    @GetMapping("/analytics/dashboard")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('PHYSICIAN')")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> dashboard = healthcareService.getDashboardData(tenantId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/analytics/patient-demographics")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getPatientDemographics(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> demographics = healthcareService.getPatientDemographics(tenantId);
        return ResponseEntity.ok(demographics);
    }

    // EHR Integration
    @PostMapping("/ehr/sync")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN')")
    public ResponseEntity<Map<String, Object>> syncWithEHR(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam String ehrSystem) {
        Map<String, Object> result = healthcareService.syncWithEHR(tenantId, ehrSystem);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/patients/{patientId}/export-hl7")
    @PreAuthorize("hasRole('HEALTHCARE_ADMIN') or hasRole('PHYSICIAN')")
    public ResponseEntity<String> exportPatientDataHL7(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID patientId) {
        String hl7Data = healthcareService.exportPatientDataHL7(tenantId, patientId);
        return ResponseEntity.ok(hl7Data);
    }

    // Emergency Access
    @PostMapping("/emergency-access")
    @PreAuthorize("hasRole('EMERGENCY_PHYSICIAN')")
    public ResponseEntity<PatientDto> emergencyPatientAccess(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam String identifier,
            @RequestParam String emergencyCode) {
        PatientDto patient = healthcareService.emergencyPatientAccess(tenantId, identifier, emergencyCode);
        return ResponseEntity.ok(patient);
    }
}
