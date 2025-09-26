package com.i3m.finance.dto;

import com.i3m.finance.model.Transaction;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class TransactionDto {
    
    private UUID id;
    
    @NotNull
    @Positive
    private BigDecimal amount;
    
    @NotNull
    private String currency;
    
    @NotNull
    private Transaction.TransactionType type;
    
    private String description;
    private String referenceId;
    private String stripePaymentIntentId;
    private Transaction.TransactionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime processedAt;
    
    // Constructors
    public TransactionDto() {}
    
    public TransactionDto(BigDecimal amount, String currency, 
                         Transaction.TransactionType type, String description) {
        this.amount = amount;
        this.currency = currency;
        this.type = type;
        this.description = description;
    }
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public Transaction.TransactionType getType() { return type; }
    public void setType(Transaction.TransactionType type) { this.type = type; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
    
    public String getStripePaymentIntentId() { return stripePaymentIntentId; }
    public void setStripePaymentIntentId(String stripePaymentIntentId) { 
        this.stripePaymentIntentId = stripePaymentIntentId; 
    }
    
    public Transaction.TransactionStatus getStatus() { return status; }
    public void setStatus(Transaction.TransactionStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
}
