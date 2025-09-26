package com.i3m.procurementservice.repository;

import com.i3m.procurementservice.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, UUID>, JpaSpecificationExecutor<Supplier> {
    
    Optional<Supplier> findByIdAndTenantId(UUID id, UUID tenantId);
    
    boolean existsByTenantIdAndCode(UUID tenantId, String code);
    
    boolean existsByTenantIdAndCodeAndIdNot(UUID tenantId, String code, UUID id);
    
    boolean existsByTenantIdAndEmailAndIdNot(UUID tenantId, String email, UUID id);
    
    Page<Supplier> findByTenantId(UUID tenantId, Pageable pageable);
}
