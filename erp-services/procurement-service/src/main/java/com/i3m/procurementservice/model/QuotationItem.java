package com.i3m.procurementservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Entity
@Table(name = "quotation_items", schema = "procurement")
@EqualsAndHashCode(callSuper = true)
public class QuotationItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "supplier_quotation_id", nullable = false)
    private SupplierQuotation supplierQuotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rfq_item_id")
    private RfqItem rfqItem;

    @Column(name = "line_number")
    private Integer lineNumber;

    // Product reference
    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "product_sku", length = 100)
    private String productSku;

    @NotBlank
    @Size(max = 200)
    @Column(name = "item_name", nullable = false, length = 200)
    private String itemName;

    @Column(name = "item_description", columnDefinition = "TEXT")
    private String itemDescription;

    @NotNull
    @Positive
    @Column(name = "quantity", nullable = false)
    private BigDecimal quantity;

    @NotBlank
    @Size(max = 20)
    @Column(name = "unit", nullable = false, length = 20)
    private String unit;

    @NotNull
    @Column(name = "unit_price", nullable = false, precision = 15, scale = 4)
    private BigDecimal unitPrice;

    @Column(name = "total_price", precision = 15, scale = 2)
    private BigDecimal totalPrice;

    @Size(max = 100)
    @Column(name = "brand", length = 100)
    private String brand;

    @Size(max = 100)
    @Column(name = "model", length = 100)
    private String model;

    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;

    @Column(name = "country_of_origin", length = 100)
    private String countryOfOrigin;

    @Column(name = "manufacturer", length = 200)
    private String manufacturer;

    @Column(name = "part_number", length = 100)
    private String partNumber;

    @Column(name = "catalog_number", length = 100)
    private String catalogNumber;

    // Delivery information
    @Column(name = "delivery_lead_time")
    private Integer deliveryLeadTime; // in days

    @Column(name = "availability_status", length = 50)
    private String availabilityStatus;

    // Pricing details
    @Column(name = "discount_percentage", precision = 5, scale = 2)
    private BigDecimal discountPercentage;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    private BigDecimal discountAmount;

    @Column(name = "tax_rate", precision = 5, scale = 2)
    private BigDecimal taxRate;

    @Column(name = "tax_amount", precision = 15, scale = 2)
    private BigDecimal taxAmount;

    // Quality and compliance
    @Column(name = "quality_certification", length = 200)
    private String qualityCertification;

    @Column(name = "compliance_standards", length = 500)
    private String complianceStandards;

    @Column(name = "warranty_period")
    private Integer warrantyPeriod; // in months

    @Column(name = "warranty_terms", columnDefinition = "TEXT")
    private String warrantyTerms;

    @Column(name = "notes", length = 500)
    private String notes;

    // Alternative options
    @Column(name = "is_alternative")
    private Boolean isAlternative = false;

    @Column(name = "alternative_reason", length = 500)
    private String alternativeReason;

    @PrePersist
    @PreUpdate
    protected void calculateTotalPrice() {
        if (quantity != null && unitPrice != null) {
            totalPrice = quantity.multiply(unitPrice);
            
            // Apply discount if any
            if (discountAmount != null) {
                totalPrice = totalPrice.subtract(discountAmount);
            } else if (discountPercentage != null) {
                BigDecimal discount = totalPrice.multiply(discountPercentage.divide(BigDecimal.valueOf(100)));
                totalPrice = totalPrice.subtract(discount);
                discountAmount = discount;
            }
            
            // Calculate tax if any
            if (taxRate != null) {
                taxAmount = totalPrice.multiply(taxRate.divide(BigDecimal.valueOf(100)));
            }
        }
    }

    // Helper methods
    public BigDecimal getTotalPrice() {
        if (totalPrice != null) {
            return totalPrice;
        }
        if (quantity != null && unitPrice != null) {
            return quantity.multiply(unitPrice);
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal getTotalPriceWithTax() {
        BigDecimal total = getTotalPrice();
        if (taxAmount != null) {
            total = total.add(taxAmount);
        }
        return total;
    }

    public boolean isAlternativeItem() {
        return Boolean.TRUE.equals(isAlternative);
    }
}
