package com.i3m.procurementservice.dto;

import com.i3m.procurementservice.model.enums.Status;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDto {
    private UUID id;
    
    @NotBlank(message = "Supplier code is required")
    @Size(max = 20, message = "Supplier code must not exceed 20 characters")
    private String code;
    
    @NotBlank(message = "Supplier name is required")
    @Size(max = 255, message = "Supplier name must not exceed 255 characters")
    private String name;
    
    @Size(max = 255, message = "Contact person must not exceed 255 characters")
    private String contactPerson;
    
    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;
    
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    
    private Status status;
    
    @DecimalMin(value = "0.0", message = "Credit limit must be non-negative")
    private BigDecimal creditLimit;
    
    @DecimalMin(value = "0.0", message = "Rating must be non-negative")
    @DecimalMax(value = "5.0", message = "Rating must not exceed 5.0")
    private Double rating;
    
    private String paymentTerms;
    private String notes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
}
