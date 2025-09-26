package com.i3m.procurementservice.controller;

import com.i3m.procurementservice.dto.ApiResponse;
import com.i3m.procurementservice.dto.PageResponse;
import com.i3m.procurementservice.dto.SupplierDto;
import com.i3m.procurementservice.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/suppliers")
public class SuppliersController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public ResponseEntity<PageResponse<SupplierDto>> getSuppliers(
            @RequestHeader("X-Tenant-ID") String tenantId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        
        PageResponse<SupplierDto> response = supplierService.getSuppliers(tenantId, search, status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierDto>> getSupplier(
            @RequestHeader("X-Tenant-ID") String tenantId,
            @PathVariable UUID id) {
        
        SupplierDto supplier = supplierService.getSupplier(tenantId, id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Supplier retrieved successfully", supplier));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SupplierDto>> createSupplier(
            @RequestHeader("X-Tenant-ID") String tenantId,
            @RequestHeader("X-User-ID") String userId,
            @Valid @RequestBody SupplierDto supplierDto) {
        
        SupplierDto createdSupplier = supplierService.createSupplier(tenantId, userId, supplierDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Supplier created successfully", createdSupplier));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierDto>> updateSupplier(
            @RequestHeader("X-Tenant-ID") String tenantId,
            @RequestHeader("X-User-ID") String userId,
            @PathVariable UUID id,
            @Valid @RequestBody SupplierDto supplierDto) {
        
        SupplierDto updatedSupplier = supplierService.updateSupplier(tenantId, userId, id, supplierDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Supplier updated successfully", updatedSupplier));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSupplier(
            @RequestHeader("X-Tenant-ID") String tenantId,
            @RequestHeader("X-User-ID") String userId,
            @PathVariable UUID id) {
        
        supplierService.deleteSupplier(tenantId, userId, id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Supplier deleted successfully", null));
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<SupplierDto>> deactivateSupplier(
            @RequestHeader("X-Tenant-ID") String tenantId,
            @RequestHeader("X-User-ID") String userId,
            @PathVariable UUID id) {
        
        SupplierDto supplier = supplierService.deactivateSupplier(tenantId, userId, id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Supplier deactivated successfully", supplier));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<SupplierDto>> activateSupplier(
            @RequestHeader("X-Tenant-ID") String tenantId,
            @RequestHeader("X-User-ID") String userId,
            @PathVariable UUID id) {
        
        SupplierDto supplier = supplierService.activateSupplier(tenantId, userId, id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Supplier activated successfully", supplier));
    }

    @GetMapping("/status")
    public ResponseEntity<String> statusEndpoint() {
        return ResponseEntity.ok("Procurement Service is running!");
    }
}
