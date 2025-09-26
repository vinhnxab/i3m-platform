package com.i3m.procurementservice.service;

import com.i3m.procurementservice.dto.PageResponse;
import com.i3m.procurementservice.dto.SupplierDto;
import com.i3m.procurementservice.exception.DuplicateResourceException;
import com.i3m.procurementservice.exception.ResourceNotFoundException;
import com.i3m.procurementservice.model.Supplier;
import com.i3m.procurementservice.model.enums.Status;
import com.i3m.procurementservice.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public PageResponse<SupplierDto> getSuppliers(String tenantId, String search, String status, Pageable pageable) {
        UUID tenantUUID = UUID.fromString(tenantId);
        Page<Supplier> suppliers = supplierRepository.findByTenantId(tenantUUID, pageable);
        
        Page<SupplierDto> supplierDtos = suppliers.map(this::convertToDto);
        
        return new PageResponse<>(
            supplierDtos.getContent(),
            supplierDtos.getNumber(),
            supplierDtos.getSize(),
            supplierDtos.getTotalElements(),
            supplierDtos.getTotalPages(),
            supplierDtos.isLast()
        );
    }

    @Transactional(readOnly = true)
    public SupplierDto getSupplier(String tenantId, UUID id) {
        UUID tenantUUID = UUID.fromString(tenantId);
        Supplier supplier = supplierRepository.findByIdAndTenantId(id, tenantUUID)
            .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        
        return convertToDto(supplier);
    }

    public SupplierDto createSupplier(String tenantId, String userId, SupplierDto supplierDto) {
        UUID tenantUUID = UUID.fromString(tenantId);
        // Check for duplicate code
        if (supplierRepository.existsByTenantIdAndCode(tenantUUID, supplierDto.getCode())) {
            throw new DuplicateResourceException("Supplier with code '" + supplierDto.getCode() + "' already exists");
        }

        Supplier supplier = convertToEntity(supplierDto);
        supplier.setTenantId(tenantUUID);
        supplier.setCreatedBy(userId);
        supplier.setUpdatedBy(userId);
        supplier.setCreatedAt(LocalDateTime.now());
        supplier.setUpdatedAt(LocalDateTime.now());

        Supplier savedSupplier = supplierRepository.save(supplier);
        return convertToDto(savedSupplier);
    }

    public SupplierDto updateSupplier(String tenantId, String userId, UUID id, SupplierDto supplierDto) {
        UUID tenantUUID = UUID.fromString(tenantId);
        Supplier existingSupplier = supplierRepository.findByIdAndTenantId(id, tenantUUID)
            .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        // Check for duplicate code (excluding current supplier)
        if (!existingSupplier.getCode().equals(supplierDto.getCode()) &&
            supplierRepository.existsByTenantIdAndCodeAndIdNot(tenantUUID, supplierDto.getCode(), id)) {
            throw new DuplicateResourceException("Supplier with code '" + supplierDto.getCode() + "' already exists");
        }

        // Check for duplicate email (excluding current supplier)
        if (supplierDto.getEmail() != null && 
            !supplierDto.getEmail().equals(existingSupplier.getEmail()) &&
            supplierRepository.existsByTenantIdAndEmailAndIdNot(tenantUUID, supplierDto.getEmail(), id)) {
            throw new DuplicateResourceException("Supplier with email '" + supplierDto.getEmail() + "' already exists");
        }

        updateSupplierFromDto(existingSupplier, supplierDto);
        existingSupplier.setUpdatedBy(userId);
        existingSupplier.setUpdatedAt(LocalDateTime.now());

        Supplier updatedSupplier = supplierRepository.save(existingSupplier);
        return convertToDto(updatedSupplier);
    }

    public void deleteSupplier(String tenantId, String userId, UUID id) {
        UUID tenantUUID = UUID.fromString(tenantId);
        Supplier supplier = supplierRepository.findByIdAndTenantId(id, tenantUUID)
            .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        supplierRepository.delete(supplier);
    }

    public SupplierDto deactivateSupplier(String tenantId, String userId, UUID id) {
        return updateSupplierStatus(tenantId, userId, id, Status.INACTIVE);
    }

    public SupplierDto activateSupplier(String tenantId, String userId, UUID id) {
        return updateSupplierStatus(tenantId, userId, id, Status.ACTIVE);
    }

    private SupplierDto updateSupplierStatus(String tenantId, String userId, UUID id, Status status) {
        UUID tenantUUID = UUID.fromString(tenantId);
        Supplier supplier = supplierRepository.findByIdAndTenantId(id, tenantUUID)
            .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        supplier.setStatus(status);
        supplier.setUpdatedBy(userId);
        supplier.setUpdatedAt(LocalDateTime.now());

        Supplier updatedSupplier = supplierRepository.save(supplier);
        return convertToDto(updatedSupplier);
    }

    private SupplierDto convertToDto(Supplier supplier) {
        return SupplierDto.builder()
            .id(supplier.getId())
            .code(supplier.getCode())
            .name(supplier.getName())
            .contactPerson(supplier.getContactPerson())
            .email(supplier.getEmail())
            .phone(supplier.getPhone())
            .address(supplier.getAddress())
            .city(supplier.getCity())
            .state(supplier.getState())
            .country(supplier.getCountry())
            .postalCode(supplier.getPostalCode())
            .status(supplier.getStatus())
            .creditLimit(supplier.getCreditLimit())
            .rating(supplier.getRating())
            .paymentTerms(supplier.getPaymentTerms())
            .notes(supplier.getNotes())
            .createdAt(supplier.getCreatedAt())
            .updatedAt(supplier.getUpdatedAt())
            .createdBy(supplier.getCreatedBy())
            .updatedBy(supplier.getUpdatedBy())
            .build();
    }

    private Supplier convertToEntity(SupplierDto dto) {
        return Supplier.builder()
            .code(dto.getCode())
            .name(dto.getName())
            .contactPerson(dto.getContactPerson())
            .email(dto.getEmail())
            .phone(dto.getPhone())
            .address(dto.getAddress())
            .city(dto.getCity())
            .state(dto.getState())
            .country(dto.getCountry())
            .postalCode(dto.getPostalCode())
            .status(dto.getStatus() != null ? dto.getStatus() : Status.ACTIVE)
            .creditLimit(dto.getCreditLimit())
            .rating(dto.getRating())
            .paymentTerms(dto.getPaymentTerms())
            .notes(dto.getNotes())
            .build();
    }

    private void updateSupplierFromDto(Supplier supplier, SupplierDto dto) {
        supplier.setCode(dto.getCode());
        supplier.setName(dto.getName());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setAddress(dto.getAddress());
        supplier.setCity(dto.getCity());
        supplier.setState(dto.getState());
        supplier.setCountry(dto.getCountry());
        supplier.setPostalCode(dto.getPostalCode());
        if (dto.getStatus() != null) {
            supplier.setStatus(dto.getStatus());
        }
        supplier.setCreditLimit(dto.getCreditLimit());
        supplier.setRating(dto.getRating());
        supplier.setPaymentTerms(dto.getPaymentTerms());
        supplier.setNotes(dto.getNotes());
    }
}
