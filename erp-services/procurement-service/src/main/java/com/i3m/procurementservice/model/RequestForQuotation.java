package com.i3m.procurementservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.i3m.procurementservice.model.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "request_for_quotations", schema = "procurement",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"tenant_id", "rfq_number"})
       })
@EqualsAndHashCode(callSuper = true)
public class RequestForQuotation extends BaseEntity {

    @NotBlank
    @Size(max = 50)
    @Column(name = "rfq_number", nullable = false, length = 50)
    private String rfqNumber;

    @NotBlank
    @Size(max = 200)
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @NotNull
    @Column(name = "closing_date", nullable = false)
    private LocalDate closingDate;

    @Column(name = "validity_date")
    private LocalDate validityDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private Status status = Status.DRAFT;

    @Size(max = 3)
    @Column(name = "currency", length = 3)
    private String currency = "USD";

    @Column(name = "terms_and_conditions", columnDefinition = "TEXT")
    private String termsAndConditions;

    @Column(name = "delivery_requirements", columnDefinition = "TEXT")
    private String deliveryRequirements;

    @Column(name = "payment_terms", length = 100)
    private String paymentTerms;

    @Column(name = "evaluation_criteria", columnDefinition = "TEXT")
    private String evaluationCriteria;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Source purchase requisition
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_requisition_id")
    private PurchaseRequisition purchaseRequisition;

    // Target supplier
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    // Workflow
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "published_by")
    private String publishedBy;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(name = "closed_by")
    private String closedBy;

    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "requestForQuotation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RfqItem> items;

    @JsonIgnore
    @OneToMany(mappedBy = "requestForQuotation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SupplierQuotation> quotations;

    // Helper methods
    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (rfqNumber == null || rfqNumber.isEmpty()) {
            rfqNumber = generateRfqNumber();
        }
        if (issueDate == null) {
            issueDate = LocalDate.now();
        }
        if (closingDate == null) {
            closingDate = issueDate.plusDays(14); // Default 2 weeks
        }
        if (validityDate == null) {
            validityDate = closingDate.plusDays(30); // Default 30 days validity
        }
    }

    private String generateRfqNumber() {
        return "RFQ" + System.currentTimeMillis();
    }

    public boolean canBeModified() {
        return Status.DRAFT.equals(this.status);
    }

    public boolean canBePublished() {
        return Status.DRAFT.equals(this.status) && items != null && !items.isEmpty();
    }

    public boolean canBeClosed() {
        return Status.PENDING.equals(this.status) && LocalDate.now().isAfter(closingDate);
    }

    public boolean isExpired() {
        return validityDate != null && LocalDate.now().isAfter(validityDate);
    }

    public void publish(String publishedBy) {
        if (canBePublished()) {
            this.status = Status.PENDING;
            this.publishedBy = publishedBy;
            this.publishedAt = LocalDateTime.now();
        }
    }

    public void close(String closedBy) {
        if (canBeClosed()) {
            this.status = Status.COMPLETED;
            this.closedBy = closedBy;
            this.closedAt = LocalDateTime.now();
        }
    }

    public void cancel() {
        if (!Status.COMPLETED.equals(this.status)) {
            this.status = Status.CANCELLED;
        }
    }
}
