package com.i3m.procurementservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "supplier_quotations", schema = "procurement",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"tenant_id", "quotation_number"})
       })
@EqualsAndHashCode(callSuper = true)
public class SupplierQuotation extends BaseEntity {

    @NotBlank
    @Size(max = 50)
    @Column(name = "quotation_number", nullable = false, length = 50)
    private String quotationNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "request_for_quotation_id", nullable = false)
    private RequestForQuotation requestForQuotation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @NotNull
    @Column(name = "quotation_date", nullable = false)
    private LocalDate quotationDate;

    @Column(name = "validity_date")
    private LocalDate validityDate;

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

    @Column(name = "delivery_lead_time")
    private Integer deliveryLeadTime; // in days

    @Column(name = "warranty_period")
    private Integer warrantyPeriod; // in months

    @Column(name = "warranty_terms", columnDefinition = "TEXT")
    private String warrantyTerms;

    @Column(name = "terms_and_conditions", columnDefinition = "TEXT")
    private String termsAndConditions;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Supplier contact information
    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    // Evaluation scores
    @Column(name = "technical_score", precision = 5, scale = 2)
    private BigDecimal technicalScore;

    @Column(name = "commercial_score", precision = 5, scale = 2)
    private BigDecimal commercialScore;

    @Column(name = "overall_score", precision = 5, scale = 2)
    private BigDecimal overallScore;

    @Column(name = "evaluation_notes", columnDefinition = "TEXT")
    private String evaluationNotes;

    // Workflow
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt;

    @Column(name = "evaluated_by")
    private String evaluatedBy;

    // Winner selection
    @Column(name = "is_selected")
    private Boolean isSelected = false;

    @Column(name = "selected_at")
    private LocalDateTime selectedAt;

    @Column(name = "selected_by")
    private String selectedBy;

    @Column(name = "selection_reason", columnDefinition = "TEXT")
    private String selectionReason;

    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "supplierQuotation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuotationItem> items;

    // Helper methods
    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (quotationNumber == null || quotationNumber.isEmpty()) {
            quotationNumber = generateQuotationNumber();
        }
        if (quotationDate == null) {
            quotationDate = LocalDate.now();
        }
        if (validityDate == null) {
            validityDate = quotationDate.plusDays(30); // Default 30 days validity
        }
    }

    private String generateQuotationNumber() {
        return "QUO" + System.currentTimeMillis();
    }

    public boolean canBeModified() {
        return Status.DRAFT.equals(this.status);
    }

    public boolean canBeSubmitted() {
        return Status.DRAFT.equals(this.status) && items != null && !items.isEmpty();
    }

    public boolean isExpired() {
        return validityDate != null && LocalDate.now().isAfter(validityDate);
    }

    public boolean isWinner() {
        return Boolean.TRUE.equals(isSelected);
    }

    public void submit() {
        if (canBeSubmitted()) {
            this.status = Status.PENDING;
            this.submittedAt = LocalDateTime.now();
            calculateTotals();
        }
    }

    public void evaluate(String evaluatedBy, BigDecimal technicalScore, BigDecimal commercialScore, String notes) {
        this.technicalScore = technicalScore;
        this.commercialScore = commercialScore;
        this.overallScore = calculateOverallScore(technicalScore, commercialScore);
        this.evaluationNotes = notes;
        this.evaluatedBy = evaluatedBy;
        this.evaluatedAt = LocalDateTime.now();
        this.status = Status.APPROVED;
    }

    public void selectAsWinner(String selectedBy, String reason) {
        this.isSelected = true;
        this.selectedBy = selectedBy;
        this.selectedAt = LocalDateTime.now();
        this.selectionReason = reason;
    }

    private BigDecimal calculateOverallScore(BigDecimal technical, BigDecimal commercial) {
        if (technical != null && commercial != null) {
            // Weighted average: 60% technical, 40% commercial
            return technical.multiply(BigDecimal.valueOf(0.6))
                    .add(commercial.multiply(BigDecimal.valueOf(0.4)));
        }
        return BigDecimal.ZERO;
    }

    @PreUpdate
    public void calculateTotals() {
        // Calculate totals from items
        if (items != null) {
            subtotal = items.stream()
                    .map(QuotationItem::getTotalPrice)
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
}
