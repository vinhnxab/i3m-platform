package com.i3m.finance.service;

import com.i3m.finance.dto.TransactionDto;
import com.i3m.finance.model.Transaction;
import com.i3m.finance.repository.TransactionRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class FinanceService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Value("${stripe.api-key}")
    private String stripeApiKey;

    @Value("${stripe.webhook-secret}")
    private String stripeWebhookSecret;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public TransactionDto createTransaction(UUID tenantId, TransactionDto dto) {
        Transaction transaction = new Transaction(
            tenantId, dto.getAmount(), dto.getCurrency(), 
            dto.getType(), dto.getDescription()
        );
        transaction.setReferenceId(dto.getReferenceId());
        
        Transaction saved = transactionRepository.save(transaction);
        return convertToDto(saved);
    }

    @Cacheable(value = "transactions", key = "#tenantId + '_' + #pageable.pageNumber")
    public Page<TransactionDto> getTransactions(UUID tenantId, Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findByTenantId(tenantId, pageable);
        return transactions.map(this::convertToDto);
    }

    public TransactionDto getTransaction(UUID tenantId, UUID id) {
        Transaction transaction = transactionRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return convertToDto(transaction);
    }

    public TransactionDto updateTransactionStatus(UUID tenantId, UUID id, String status) {
        Transaction transaction = transactionRepository.findByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        transaction.setStatus(Transaction.TransactionStatus.valueOf(status.toUpperCase()));
        if (transaction.getStatus() == Transaction.TransactionStatus.COMPLETED) {
            transaction.setProcessedAt(LocalDateTime.now());
        }
        
        Transaction updated = transactionRepository.save(transaction);
        return convertToDto(updated);
    }

    @Cacheable(value = "transaction-summary", key = "#tenantId")
    public Map<String, Object> getTransactionSummary(UUID tenantId) {
        Map<String, Object> summary = new HashMap<>();
        
        BigDecimal totalIncome = transactionRepository.getTotalAmountByTenantAndType(
            tenantId, Transaction.TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.getTotalAmountByTenantAndType(
            tenantId, Transaction.TransactionType.EXPENSE);
        
        Long pendingCount = transactionRepository.countByTenantIdAndStatus(
            tenantId, Transaction.TransactionStatus.PENDING);
        Long completedCount = transactionRepository.countByTenantIdAndStatus(
            tenantId, Transaction.TransactionStatus.COMPLETED);
        
        summary.put("totalIncome", totalIncome != null ? totalIncome : BigDecimal.ZERO);
        summary.put("totalExpense", totalExpense != null ? totalExpense : BigDecimal.ZERO);
        summary.put("netAmount", 
            (totalIncome != null ? totalIncome : BigDecimal.ZERO)
            .subtract(totalExpense != null ? totalExpense : BigDecimal.ZERO));
        summary.put("pendingTransactions", pendingCount);
        summary.put("completedTransactions", completedCount);
        
        return summary;
    }

    public String createStripePaymentIntent(UUID tenantId, BigDecimal amount, String currency) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("amount", amount.multiply(BigDecimal.valueOf(100)).longValue()); // Convert to cents
            params.put("currency", currency.toLowerCase());
            params.put("metadata", Map.of("tenantId", tenantId.toString()));

            PaymentIntent paymentIntent = PaymentIntent.create(params);
            
            // Create pending transaction
            Transaction transaction = new Transaction(
                tenantId, amount, currency, 
                Transaction.TransactionType.INCOME, 
                "Stripe Payment Intent: " + paymentIntent.getId()
            );
            transaction.setStripePaymentIntentId(paymentIntent.getId());
            transaction.setStatus(Transaction.TransactionStatus.PENDING);
            transactionRepository.save(transaction);
            
            return paymentIntent.getId();
        } catch (StripeException e) {
            throw new RuntimeException("Failed to create payment intent: " + e.getMessage());
        }
    }

    public void handleStripeWebhook(String payload, String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
            
            if ("payment_intent.succeeded".equals(event.getType())) {
                PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                    .getObject().orElse(null);
                
                if (paymentIntent != null) {
                    transactionRepository.findByStripePaymentIntentId(paymentIntent.getId())
                        .ifPresent(transaction -> {
                            transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
                            transaction.setProcessedAt(LocalDateTime.now());
                            transactionRepository.save(transaction);
                        });
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to process webhook: " + e.getMessage());
        }
    }

    private TransactionDto convertToDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
        dto.setId(transaction.getId());
        dto.setAmount(transaction.getAmount());
        dto.setCurrency(transaction.getCurrency());
        dto.setType(transaction.getType());
        dto.setDescription(transaction.getDescription());
        dto.setReferenceId(transaction.getReferenceId());
        dto.setStripePaymentIntentId(transaction.getStripePaymentIntentId());
        dto.setStatus(transaction.getStatus());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setUpdatedAt(transaction.getUpdatedAt());
        dto.setProcessedAt(transaction.getProcessedAt());
        return dto;
    }
}
