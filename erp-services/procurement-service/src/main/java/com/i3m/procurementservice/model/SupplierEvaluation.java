package com.i3m.procurementservice.model;

import com.i3m.procurementservice.model.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "supplier_evaluations", schema = "procurement")
@EqualsAndHashCode(callSuper = true)
public class SupplierEvaluation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @NotNull
    @Column(name = "evaluation_period_start", nullable = false)
    private LocalDate evaluationPeriodStart;

    @NotNull
    @Column(name = "evaluation_period_end", nullable = false)
    private LocalDate evaluationPeriodEnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private Status status = Status.DRAFT;

    // Quality metrics (0-5 scale)
    @Column(name = "quality_score", precision = 3, scale = 2)
    private BigDecimal qualityScore;

    @Column(name = "quality_comments", columnDefinition = "TEXT")
    private String qualityComments;

    // Delivery metrics (0-5 scale)
    @Column(name = "delivery_score", precision = 3, scale = 2)
    private BigDecimal deliveryScore;

    @Column(name = "on_time_delivery_rate", precision = 5, scale = 2)
    private BigDecimal onTimeDeliveryRate; // percentage

    @Column(name = "delivery_comments", columnDefinition = "TEXT")
    private String deliveryComments;

    // Price competitiveness (0-5 scale)
    @Column(name = "price_score", precision = 3, scale = 2)
    private BigDecimal priceScore;

    @Column(name = "price_comments", columnDefinition = "TEXT")
    private String priceComments;

    // Service quality (0-5 scale)
    @Column(name = "service_score", precision = 3, scale = 2)
    private BigDecimal serviceScore;

    @Column(name = "service_comments", columnDefinition = "TEXT")
    private String serviceComments;

    // Communication (0-5 scale)
    @Column(name = "communication_score", precision = 3, scale = 2)
    private BigDecimal communicationScore;

    @Column(name = "communication_comments", columnDefinition = "TEXT")
    private String communicationComments;

    // Innovation and flexibility (0-5 scale)
    @Column(name = "innovation_score", precision = 3, scale = 2)
    private BigDecimal innovationScore;

    @Column(name = "innovation_comments", columnDefinition = "TEXT")
    private String innovationComments;

    // Overall scores
    @Column(name = "overall_score", precision = 3, scale = 2)
    private BigDecimal overallScore;

    @Column(name = "weighted_score", precision = 3, scale = 2)
    private BigDecimal weightedScore;

    @Size(max = 50)
    @Column(name = "grade", length = 50)
    private String grade; // A, B, C, D, F

    // Performance statistics
    @Column(name = "total_orders")
    private Integer totalOrders;

    @Column(name = "total_value", precision = 15, scale = 2)
    private BigDecimal totalValue;

    @Column(name = "defect_rate", precision = 5, scale = 2)
    private BigDecimal defectRate; // percentage

    @Column(name = "return_rate", precision = 5, scale = 2)
    private BigDecimal returnRate; // percentage

    @Column(name = "average_lead_time")
    private Integer averageLeadTime; // in days

    // Recommendations
    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "areas_for_improvement", columnDefinition = "TEXT")
    private String areasForImprovement;

    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "action_items", columnDefinition = "TEXT")
    private String actionItems;

    // Evaluator information
    @Column(name = "evaluated_by")
    private String evaluatedBy;

    @Column(name = "evaluation_date")
    private LocalDate evaluationDate;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "review_date")
    private LocalDate reviewDate;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approval_date")
    private LocalDate approvalDate;

    // Next evaluation
    @Column(name = "next_evaluation_date")
    private LocalDate nextEvaluationDate;

    @Column(name = "evaluation_frequency")
    private Integer evaluationFrequency; // in months

    // Additional notes
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Helper methods
    @PrePersist
    @PreUpdate
    protected void calculateOverallScore() {
        // Calculate overall score as weighted average
        BigDecimal total = BigDecimal.ZERO;
        BigDecimal weights = BigDecimal.ZERO;
        
        // Quality: 30%
        if (qualityScore != null) {
            total = total.add(qualityScore.multiply(BigDecimal.valueOf(0.30)));
            weights = weights.add(BigDecimal.valueOf(0.30));
        }
        
        // Delivery: 25%
        if (deliveryScore != null) {
            total = total.add(deliveryScore.multiply(BigDecimal.valueOf(0.25)));
            weights = weights.add(BigDecimal.valueOf(0.25));
        }
        
        // Price: 20%
        if (priceScore != null) {
            total = total.add(priceScore.multiply(BigDecimal.valueOf(0.20)));
            weights = weights.add(BigDecimal.valueOf(0.20));
        }
        
        // Service: 15%
        if (serviceScore != null) {
            total = total.add(serviceScore.multiply(BigDecimal.valueOf(0.15)));
            weights = weights.add(BigDecimal.valueOf(0.15));
        }
        
        // Communication: 10%
        if (communicationScore != null) {
            total = total.add(communicationScore.multiply(BigDecimal.valueOf(0.10)));
            weights = weights.add(BigDecimal.valueOf(0.10));
        }
        
        if (weights.compareTo(BigDecimal.ZERO) > 0) {
            weightedScore = total.divide(weights, 2, BigDecimal.ROUND_HALF_UP);
            overallScore = weightedScore;
            
            // Assign grade based on overall score
            if (overallScore.compareTo(BigDecimal.valueOf(4.5)) >= 0) {
                grade = "A";
            } else if (overallScore.compareTo(BigDecimal.valueOf(3.5)) >= 0) {
                grade = "B";
            } else if (overallScore.compareTo(BigDecimal.valueOf(2.5)) >= 0) {
                grade = "C";
            } else if (overallScore.compareTo(BigDecimal.valueOf(1.5)) >= 0) {
                grade = "D";
            } else {
                grade = "F";
            }
        }
    }

    public void complete(String evaluatedBy) {
        this.evaluatedBy = evaluatedBy;
        this.evaluationDate = LocalDate.now();
        this.status = Status.COMPLETED;
        calculateOverallScore();
        
        // Set next evaluation date
        if (evaluationFrequency != null) {
            nextEvaluationDate = LocalDate.now().plusMonths(evaluationFrequency);
        } else {
            nextEvaluationDate = LocalDate.now().plusMonths(12); // Default annual
        }
    }

    public void review(String reviewedBy) {
        this.reviewedBy = reviewedBy;
        this.reviewDate = LocalDate.now();
    }

    public void approve(String approvedBy) {
        this.approvedBy = approvedBy;
        this.approvalDate = LocalDate.now();
        this.status = Status.APPROVED;
    }

    public boolean isExcellent() {
        return "A".equals(grade);
    }

    public boolean isGood() {
        return "B".equals(grade);
    }

    public boolean isAverage() {
        return "C".equals(grade);
    }

    public boolean isPoor() {
        return "D".equals(grade) || "F".equals(grade);
    }
}
