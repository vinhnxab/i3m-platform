package com.i3m.procurementservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "purchase_order_items", schema = "procurement")
@EqualsAndHashCode(callSuper = true)
public class PurchaseOrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quotation_item_id")
    private QuotationItem quotationItem;

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
    @Column(name = "ordered_quantity", nullable = false)
    private BigDecimal orderedQuantity;

    @Column(name = "received_quantity")
    private BigDecimal receivedQuantity = BigDecimal.ZERO;

    @Column(name = "cancelled_quantity")
    private BigDecimal cancelledQuantity = BigDecimal.ZERO;

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

    @Column(name = "part_number", length = 100)
    private String partNumber;

    @Column(name = "catalog_number", length = 100)
    private String catalogNumber;

    // Delivery information
    @Column(name = "expected_delivery_date")
    private LocalDate expectedDeliveryDate;

    @Column(name = "actual_delivery_date")
    private LocalDate actualDeliveryDate;

    @Column(name = "delivery_location", length = 200)
    private String deliveryLocation;

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
    @Column(name = "quality_inspection_required")
    private Boolean qualityInspectionRequired = false;

    @Column(name = "inspection_status", length = 50)
    private String inspectionStatus;

    @Column(name = "inspection_notes", columnDefinition = "TEXT")
    private String inspectionNotes;

    @Column(name = "warranty_period")
    private Integer warrantyPeriod; // in months

    @Column(name = "warranty_terms", columnDefinition = "TEXT")
    private String warrantyTerms;

    // Budget allocation
    @Column(name = "cost_center", length = 50)
    private String costCenter;

    @Column(name = "budget_line", length = 100)
    private String budgetLine;

    @Column(name = "gl_account", length = 50)
    private String glAccount;

    @Column(name = "notes", length = 500)
    private String notes;

    // Receiving information
    @Column(name = "is_fully_received")
    private Boolean isFullyReceived = false;

    @Column(name = "last_received_date")
    private LocalDate lastReceivedDate;

    @Column(name = "receiving_notes", columnDefinition = "TEXT")
    private String receivingNotes;

    @PrePersist
    @PreUpdate
    protected void calculateTotalPrice() {
        if (orderedQuantity != null && unitPrice != null) {
            totalPrice = orderedQuantity.multiply(unitPrice);
            
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
        if (orderedQuantity != null && unitPrice != null) {
            return orderedQuantity.multiply(unitPrice);
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

    public BigDecimal getPendingQuantity() {
        if (orderedQuantity == null) return BigDecimal.ZERO;
        BigDecimal received = receivedQuantity != null ? receivedQuantity : BigDecimal.ZERO;
        BigDecimal cancelled = cancelledQuantity != null ? cancelledQuantity : BigDecimal.ZERO;
        return orderedQuantity.subtract(received).subtract(cancelled);
    }

    public boolean isFullyReceived() {
        return Boolean.TRUE.equals(isFullyReceived) || 
               (receivedQuantity != null && orderedQuantity != null && 
                receivedQuantity.compareTo(orderedQuantity) >= 0);
    }

    public boolean isPartiallyReceived() {
        return receivedQuantity != null && 
               receivedQuantity.compareTo(BigDecimal.ZERO) > 0 && 
               !isFullyReceived();
    }

    public boolean isPending() {
        return !isFullyReceived() && getPendingQuantity().compareTo(BigDecimal.ZERO) > 0;
    }

    public boolean isOverdue() {
        return expectedDeliveryDate != null && 
               LocalDate.now().isAfter(expectedDeliveryDate) && 
               !isFullyReceived();
    }

    public void receiveQuantity(BigDecimal quantity, String notes) {
        if (quantity != null && quantity.compareTo(BigDecimal.ZERO) > 0) {
            if (receivedQuantity == null) {
                receivedQuantity = BigDecimal.ZERO;
            }
            receivedQuantity = receivedQuantity.add(quantity);
            lastReceivedDate = LocalDate.now();
            
            if (notes != null && !notes.trim().isEmpty()) {
                if (receivingNotes == null || receivingNotes.trim().isEmpty()) {
                    receivingNotes = notes;
                } else {
                    receivingNotes += "\n" + LocalDate.now() + ": " + notes;
                }
            }
            
            // Check if fully received
            if (receivedQuantity.compareTo(orderedQuantity) >= 0) {
                isFullyReceived = true;
            }
        }
    }
}
