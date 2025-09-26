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
@Table(name = "purchase_requisition_items", schema = "procurement")
@EqualsAndHashCode(callSuper = true)
public class PurchaseRequisitionItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "purchase_requisition_id", nullable = false)
    private PurchaseRequisition purchaseRequisition;

    @Column(name = "line_number")
    private Integer lineNumber;

    // Product reference (from inventory service)
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

    @Column(name = "estimated_unit_price", precision = 15, scale = 4)
    private BigDecimal estimatedUnitPrice;

    @Column(name = "estimated_total_price", precision = 15, scale = 2)
    private BigDecimal estimatedTotalPrice;

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

    @Column(name = "notes", length = 500)
    private String notes;

    // Delivery requirements
    @Column(name = "delivery_location", length = 200)
    private String deliveryLocation;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    // Budget allocation
    @Column(name = "budget_line", length = 100)
    private String budgetLine;

    @Column(name = "cost_center", length = 50)
    private String costCenter;

    @PrePersist
    @PreUpdate
    protected void calculateTotalPrice() {
        if (quantity != null && estimatedUnitPrice != null) {
            estimatedTotalPrice = quantity.multiply(estimatedUnitPrice);
        }
    }

    // Helper methods
    public BigDecimal getTotalPrice() {
        if (quantity != null && estimatedUnitPrice != null) {
            return quantity.multiply(estimatedUnitPrice);
        }
        return BigDecimal.ZERO;
    }
}
