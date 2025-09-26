package com.i3m.procurementservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.i3m.procurementservice.model.enums.Priority;
import com.i3m.procurementservice.model.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "purchase_orders", schema = "procurement",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"tenant_id", "po_number"})
       })
@EqualsAndHashCode(callSuper = true)
public class PurchaseOrder extends BaseEntity {

    @NotBlank
    @Size(max = 50)
    @Column(name = "po_number", nullable = false, length = 50)
    private String poNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_requisition_id")
    private PurchaseRequisition purchaseRequisition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_quotation_id")
    private SupplierQuotation supplierQuotation;

    @NotNull
    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "expected_delivery_date")
    private LocalDate expectedDeliveryDate;

    @Column(name = "requested_delivery_date")
    private LocalDate requestedDeliveryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", length = 20)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private Status status = Status.DRAFT;

    @Size(max = 3)
    @Column(name = "currency", length = 3)
    private String currency = "USD";

    @Column(name = "exchange_rate", precision = 10, scale = 6)
    private BigDecimal exchangeRate = BigDecimal.ONE;

    @Column(name = "subtotal", precision = 15, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "tax_rate", precision = 5, scale = 2)
    private BigDecimal taxRate = BigDecimal.ZERO;

    @Column(name = "tax_amount", precision = 15, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "shipping_cost", precision = 15, scale = 2)
    private BigDecimal shippingCost = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 15, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "payment_terms", length = 100)
    private String paymentTerms;

    @Column(name = "delivery_terms", length = 100)
    private String deliveryTerms;

    @Column(name = "delivery_address", columnDefinition = "TEXT")
    private String deliveryAddress;

    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress;

    @Column(name = "terms_and_conditions", columnDefinition = "TEXT")
    private String termsAndConditions;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "internal_notes", columnDefinition = "TEXT")
    private String internalNotes;

    // Workflow
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "submitted_by")
    private String submittedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "sent_to_supplier_at")
    private LocalDateTime sentToSupplierAt;

    @Column(name = "sent_by")
    private String sentBy;

    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancelled_by")
    private String cancelledBy;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    // Delivery tracking
    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @Column(name = "carrier", length = 100)
    private String carrier;

    // Department and budget information
    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "cost_center", length = 50)
    private String costCenter;

    @Column(name = "budget_code", length = 50)
    private String budgetCode;

    // Contact information
    @Column(name = "buyer_name", length = 100)
    private String buyerName;

    @Column(name = "buyer_email", length = 100)
    private String buyerEmail;

    @Column(name = "buyer_phone", length = 20)
    private String buyerPhone;

    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PurchaseOrderItem> items;

    // Helper methods
    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (poNumber == null || poNumber.isEmpty()) {
            poNumber = generatePoNumber();
        }
        if (orderDate == null) {
            orderDate = LocalDate.now();
        }
    }

    private String generatePoNumber() {
        return "PO" + System.currentTimeMillis();
    }

    public boolean canBeModified() {
        return Status.DRAFT.equals(this.status);
    }

    public boolean canBeSubmitted() {
        return Status.DRAFT.equals(this.status) && items != null && !items.isEmpty();
    }

    public boolean canBeApproved() {
        return Status.PENDING.equals(this.status);
    }

    public boolean canBeSentToSupplier() {
        return Status.APPROVED.equals(this.status);
    }

    public boolean canBeCancelled() {
        return !Status.COMPLETED.equals(this.status) && !Status.CANCELLED.equals(this.status);
    }

    public void submit(String submittedBy) {
        if (canBeSubmitted()) {
            this.status = Status.PENDING;
            this.submittedBy = submittedBy;
            this.submittedAt = LocalDateTime.now();
            calculateTotals();
        }
    }

    public void approve(String approvedBy) {
        if (canBeApproved()) {
            this.status = Status.APPROVED;
            this.approvedBy = approvedBy;
            this.approvedAt = LocalDateTime.now();
        }
    }

    public void sendToSupplier(String sentBy) {
        if (canBeSentToSupplier()) {
            this.sentBy = sentBy;
            this.sentToSupplierAt = LocalDateTime.now();
        }
    }

    public void acknowledge() {
        this.acknowledgedAt = LocalDateTime.now();
    }

    public void ship(String trackingNumber, String carrier) {
        this.trackingNumber = trackingNumber;
        this.carrier = carrier;
        this.shippedAt = LocalDateTime.now();
    }

    public void deliver() {
        this.deliveredAt = LocalDateTime.now();
        this.status = Status.COMPLETED;
    }

    public void cancel(String cancelledBy, String reason) {
        if (canBeCancelled()) {
            this.status = Status.CANCELLED;
            this.cancelledBy = cancelledBy;
            this.cancelledAt = LocalDateTime.now();
            this.cancellationReason = reason;
        }
    }

    @PreUpdate
    public void calculateTotals() {
        // Calculate totals from items
        if (items != null) {
            subtotal = items.stream()
                    .map(PurchaseOrderItem::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        // Calculate tax
        if (taxRate != null) {
            taxAmount = subtotal.multiply(taxRate.divide(BigDecimal.valueOf(100)));
        }

        // Calculate total
        totalAmount = subtotal
                .add(taxAmount != null ? taxAmount : BigDecimal.ZERO)
                .add(shippingCost != null ? shippingCost : BigDecimal.ZERO)
                .subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO);
    }

    public boolean isOverdue() {
        return expectedDeliveryDate != null && 
               LocalDate.now().isAfter(expectedDeliveryDate) && 
               !Status.COMPLETED.equals(this.status) &&
               !Status.CANCELLED.equals(this.status);
    }

    public boolean isDelivered() {
        return deliveredAt != null;
    }

    public boolean isShipped() {
        return shippedAt != null;
    }
}
