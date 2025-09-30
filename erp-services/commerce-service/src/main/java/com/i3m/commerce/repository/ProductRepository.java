package com.i3m.commerce.repository;

import com.i3m.commerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    Page<Product> findByTenantId(UUID tenantId, Pageable pageable);
    
    Optional<Product> findByIdAndTenantId(UUID id, UUID tenantId);
    
    Page<Product> findByTenantIdAndCategory(UUID tenantId, String category, Pageable pageable);
    
    Page<Product> findByTenantIdAndStatus(UUID tenantId, Product.ProductStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.tenantId = :tenantId AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.searchKeywords) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findByTenantIdAndSearch(@Param("tenantId") UUID tenantId, 
                                         @Param("search") String search, 
                                         Pageable pageable);
    
    List<Product> findByTenantIdAndQuantityInStockLessThan(UUID tenantId, Integer threshold);
    
    List<Product> findByTenantIdAndIsFeatured(UUID tenantId, Boolean isFeatured);
    
    Optional<Product> findByTenantIdAndSku(UUID tenantId, String sku);
    
    Long countByTenantIdAndStatus(UUID tenantId, Product.ProductStatus status);
}
