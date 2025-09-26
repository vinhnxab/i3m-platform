package com.i3m.procurementservice.model;

import com.i3m.procurementservice.model.enums.Status;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "suppliers", schema = "procurement",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tenant_id", "code"}),
        @UniqueConstraint(columnNames = {"tenant_id", "email"})
    })
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier extends BaseEntity {
    
    @Column(name = "code", nullable = false, length = 20)
    private String code;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "contact_person")
    private String contactPerson;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "city")
    private String city;
    
    @Column(name = "state")
    private String state;
    
    @Column(name = "country")
    private String country;
    
    @Column(name = "postal_code", length = 20)
    private String postalCode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private Status status = Status.ACTIVE;
    
    @Column(name = "credit_limit", precision = 15, scale = 2)
    private BigDecimal creditLimit;
    
    @Column(name = "rating")
    private Double rating;
    
    @Column(name = "payment_terms")
    private String paymentTerms;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
