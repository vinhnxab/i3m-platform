package com.i3m.ecommerce.repository;

import com.i3m.ecommerce.model.Order;
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
public interface OrderRepository extends JpaRepository<Order, UUID> {
    
    Page<Order> findByTenantId(UUID tenantId, Pageable pageable);
    
    Optional<Order> findByIdAndTenantId(UUID id, UUID tenantId);
    
    Page<Order> findByTenantIdAndStatus(UUID tenantId, Order.OrderStatus status, Pageable pageable);
    
    Page<Order> findByTenantIdAndCustomerEmail(UUID tenantId, String customerEmail, Pageable pageable);
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    Optional<Order> findByStripePaymentIntentId(String stripePaymentIntentId);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.tenantId = :tenantId AND o.status = 'DELIVERED'")
    BigDecimal getTotalRevenue(@Param("tenantId") UUID tenantId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.tenantId = :tenantId AND o.createdAt >= :startDate")
    Long countOrdersSince(@Param("tenantId") UUID tenantId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.tenantId = :tenantId AND o.createdAt BETWEEN :startDate AND :endDate AND o.status = 'DELIVERED'")
    BigDecimal getRevenueBetween(@Param("tenantId") UUID tenantId, 
                                @Param("startDate") LocalDateTime startDate, 
                                @Param("endDate") LocalDateTime endDate);
    
    Long countByTenantIdAndStatus(UUID tenantId, Order.OrderStatus status);
}
