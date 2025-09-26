package com.i3m.userservice.repository;

import com.i3m.userservice.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * User Repository - Data access layer for User entity
 * Provides multi-tenant data operations
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by ID and tenant ID
     */
    Optional<User> findByIdAndTenantId(UUID id, UUID tenantId);

    /**
     * Find all users by tenant ID with pagination, ordered by created date
     */
    Page<User> findByTenantIdOrderByCreatedAtDesc(UUID tenantId, Pageable pageable);

    /**
     * Check if user exists by email and tenant ID
     */
    boolean existsByEmailAndTenantId(String email, UUID tenantId);

    /**
     * Find users by tenant ID and search criteria
     */
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId AND " +
           "(LOWER(u.firstName) LIKE %:search% OR LOWER(u.lastName) LIKE %:search% OR LOWER(u.email) LIKE %:search%)")
    Page<User> findByTenantIdAndSearchCriteria(@Param("tenantId") UUID tenantId, 
                                               @Param("search") String search, 
                                               Pageable pageable);

    /**
     * Find users by tenant ID and filters
     */
    @Query("SELECT u FROM User u WHERE u.tenantId = :tenantId " +
           "AND (:status IS NULL OR u.status = :status) " +
           "AND (:role IS NULL OR u.role = :role)")
    Page<User> findByTenantIdAndFilters(@Param("tenantId") UUID tenantId,
                                        @Param("status") String status,
                                        @Param("role") String role,
                                        Pageable pageable);

    /**
     * Find users by IDs and tenant ID
     */
    List<User> findByIdInAndTenantId(List<UUID> ids, UUID tenantId);

    /**
     * Get user statistics for a tenant
     */
    @Query(value = "SELECT " +
           "COUNT(*) as total, " +
           "COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active, " +
           "COUNT(CASE WHEN status = 'INACTIVE' THEN 1 END) as inactive, " +
           "COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as admins, " +
           "COUNT(CASE WHEN role = 'USER' THEN 1 END) as users " +
           "FROM users.users WHERE tenant_id = :tenantId", nativeQuery = true)
    Map<String, Long> getUserStatistics(@Param("tenantId") UUID tenantId);

    /**
     * Count users by tenant ID
     */
    long countByTenantId(UUID tenantId);

    /**
     * Count active users by tenant ID
     */
    long countByTenantIdAndStatus(UUID tenantId, String status);

    /**
     * Find users by role and tenant ID
     */
    List<User> findByTenantIdAndRole(UUID tenantId, String role);

    /**
     * Find users by status and tenant ID
     */
    List<User> findByTenantIdAndStatus(UUID tenantId, String status);
}