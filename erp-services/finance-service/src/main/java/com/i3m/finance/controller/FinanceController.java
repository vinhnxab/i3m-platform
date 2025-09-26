package com.i3m.finance.controller;

import com.i3m.finance.dto.TransactionDto;
import com.i3m.finance.service.FinanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/finance")
@CrossOrigin(origins = "*")
public class FinanceController {

    @Autowired
    private FinanceService financeService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "service", "Finance Service",
            "version", "1.0.0",
            "timestamp", System.currentTimeMillis()
        ));
    }

    @PostMapping("/transactions")
    public ResponseEntity<TransactionDto> createTransaction(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody TransactionDto transactionDto) {
        TransactionDto created = financeService.createTransaction(tenantId, transactionDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/transactions")
    public ResponseEntity<Page<TransactionDto>> getTransactions(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            Pageable pageable) {
        Page<TransactionDto> transactions = financeService.getTransactions(tenantId, pageable);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<TransactionDto> getTransaction(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        TransactionDto transaction = financeService.getTransaction(tenantId, id);
        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/transactions/{id}/status")
    public ResponseEntity<TransactionDto> updateTransactionStatus(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @RequestParam String status) {
        TransactionDto updated = financeService.updateTransactionStatus(tenantId, id, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/transactions/summary")
    public ResponseEntity<Map<String, Object>> getTransactionSummary(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        Map<String, Object> summary = financeService.getTransactionSummary(tenantId);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/stripe/payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam BigDecimal amount,
            @RequestParam String currency) {
        String paymentIntentId = financeService.createStripePaymentIntent(tenantId, amount, currency);
        return ResponseEntity.ok(Map.of("paymentIntentId", paymentIntentId));
    }

    @PostMapping("/stripe/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        financeService.handleStripeWebhook(payload, sigHeader);
        return ResponseEntity.ok("Webhook handled");
    }
}
