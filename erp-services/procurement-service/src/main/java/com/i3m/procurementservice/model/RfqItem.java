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
@Table(name = "rfq_items", schema = "procurement")
@EqualsAndHashCode(callSuper = true)
public class RfqItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "request_for_quotation_id", nullable = false)
    private RequestForQuotation requestForQuotation;

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

    @Size(max = 100)
    @Column(name = "category", length = 100)
    private String category;

    @Size(max = 100)
    @Column(name = "brand", length = 100)
    private String brand;

    @Size(max = 100)
    @Column(name = "model", length = 100)
    private String model;

    @Column(name = "specifications", columnDefinition = "TEXT")
    private String specifications;

    @Column(name = "technical_requirements", columnDefinition = "TEXT")
    private String technicalRequirements;

    @Column(name = "quality_standards", columnDefinition = "TEXT")
    private String qualityStandards;

    @Column(name = "delivery_requirements", columnDefinition = "TEXT")
    private String deliveryRequirements;

    @Column(name = "notes", length = 500)
    private String notes;

    // Target pricing (optional, for reference)
    @Column(name = "target_unit_price", precision = 15, scale = 4)
    private BigDecimal targetUnitPrice;

    @Column(name = "target_total_price", precision = 15, scale = 2)
    private BigDecimal targetTotalPrice;

    @PrePersist
    @PreUpdate
    protected void calculateTargetTotalPrice() {
        if (quantity != null && targetUnitPrice != null) {
            targetTotalPrice = quantity.multiply(targetUnitPrice);
        }
    }

    // Helper methods
    public BigDecimal getTargetTotal() {
        if (quantity != null && targetUnitPrice != null) {
            return quantity.multiply(targetUnitPrice);
        }
        return BigDecimal.ZERO;
    }
}
