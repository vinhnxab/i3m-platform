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
import java.util.UUID;

@Data
@Entity
@Table(name = "purchase_requisitions", schema = "procurement",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"tenant_id", "requisition_number"})
       })
@EqualsAndHashCode(callSuper = true)
public class PurchaseRequisition extends BaseEntity {

    @NotBlank
    @Size(max = 50)
    @Column(name = "requisition_number", nullable = false, length = 50)
    private String requisitionNumber;

    @NotBlank
    @Size(max = 200)
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(name = "requested_date", nullable = false)
    private LocalDate requestedDate;

    @Column(name = "required_date")
    private LocalDate requiredDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", length = 20)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private Status status = Status.DRAFT;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "cost_center", length = 50)
    private String costCenter;

    @Column(name = "budget_code", length = 50)
    private String budgetCode;

    @Column(name = "estimated_total", precision = 15, scale = 2)
    private BigDecimal estimatedTotal = BigDecimal.ZERO;

    @Size(max = 3)
    @Column(name = "currency", length = 3)
    private String currency = "USD";

    @Column(name = "justification", columnDefinition = "TEXT")
    private String justification;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Approval workflow
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejected_by")
    private String rejectedBy;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    // Preferred supplier
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preferred_supplier_id")
    private Supplier supplier;

    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "purchaseRequisition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PurchaseRequisitionItem> items;

    @JsonIgnore
    @OneToMany(mappedBy = "purchaseRequisition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RequestForQuotation> requestForQuotations;

    @JsonIgnore
    @OneToMany(mappedBy = "purchaseRequisition", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PurchaseOrder> purchaseOrders;

    // Helper methods
    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (requisitionNumber == null || requisitionNumber.isEmpty()) {
            requisitionNumber = generateRequisitionNumber();
        }
    }

    private String generateRequisitionNumber() {
        return "PR" + System.currentTimeMillis();
    }

    public boolean canBeModified() {
        return Status.DRAFT.equals(this.status) || Status.REJECTED.equals(this.status);
    }

    public boolean canBeSubmitted() {
        return Status.DRAFT.equals(this.status) && items != null && !items.isEmpty();
    }

    public boolean canBeApproved() {
        return Status.PENDING.equals(this.status);
    }

    public void submit() {
        if (canBeSubmitted()) {
            this.status = Status.PENDING;
            this.submittedAt = LocalDateTime.now();
        }
    }

    public void approve(String approvedBy) {
        if (canBeApproved()) {
            this.status = Status.APPROVED;
            this.approvedBy = approvedBy;
            this.approvedAt = LocalDateTime.now();
        }
    }

    public void reject(String rejectedBy, String reason) {
        if (canBeApproved()) {
            this.status = Status.REJECTED;
            this.rejectedBy = rejectedBy;
            this.rejectedAt = LocalDateTime.now();
            this.rejectionReason = reason;
        }
    }

    public void cancel() {
        if (!Status.COMPLETED.equals(this.status)) {
            this.status = Status.CANCELLED;
        }
    }
}
