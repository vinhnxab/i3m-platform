package com.i3m.finance.repository;

import com.i3m.finance.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    
    Page<Transaction> findByTenantId(UUID tenantId, Pageable pageable);
    
    Optional<Transaction> findByIdAndTenantId(UUID id, UUID tenantId);
    
    List<Transaction> findByTenantIdAndStatus(UUID tenantId, Transaction.TransactionStatus status);
    
    List<Transaction> findByTenantIdAndType(UUID tenantId, Transaction.TransactionType type);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.tenantId = :tenantId AND t.type = :type AND t.status = 'COMPLETED'")
    BigDecimal getTotalAmountByTenantAndType(@Param("tenantId") UUID tenantId, @Param("type") Transaction.TransactionType type);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.tenantId = :tenantId AND t.status = :status")
    Long countByTenantIdAndStatus(@Param("tenantId") UUID tenantId, @Param("status") Transaction.TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.tenantId = :tenantId AND t.createdAt BETWEEN :startDate AND :endDate")
    List<Transaction> findByTenantIdAndDateRange(@Param("tenantId") UUID tenantId, 
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    Optional<Transaction> findByStripePaymentIntentId(String stripePaymentIntentId);
}
