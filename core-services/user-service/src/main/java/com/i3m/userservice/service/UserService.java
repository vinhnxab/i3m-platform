package com.i3m.userservice.service;

import com.i3m.userservice.dto.UserDto;
import com.i3m.userservice.model.User;
import com.i3m.userservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * User Service - Business logic for user management
 * Provides multi-tenant user operations with caching
 */
@Service
@Transactional
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get users with pagination and filtering
     */
    @Cacheable(value = "users", key = "#tenantId + '_' + #pageable.pageNumber + '_' + #search + '_' + #status + '_' + #role")
    public Page<UserDto> getUsers(UUID tenantId, Pageable pageable, String search, String status, String role) {
        logger.info("Getting users for tenant: {}, page: {}, search: {}", tenantId, pageable.getPageNumber(), search);
        
        Page<User> users;
        
        if (search != null && !search.trim().isEmpty()) {
            users = userRepository.findByTenantIdAndSearchCriteria(tenantId, search.toLowerCase(), pageable);
        } else if (status != null || role != null) {
            users = userRepository.findByTenantIdAndFilters(tenantId, status, role, pageable);
        } else {
            users = userRepository.findByTenantIdOrderByCreatedAtDesc(tenantId, pageable);
        }
        
        List<UserDto> userDtos = users.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return new PageImpl<>(userDtos, pageable, users.getTotalElements());
    }

    /**
     * Get user by ID
     */
    @Cacheable(value = "user", key = "#tenantId + '_' + #userId")
    public UserDto getUserById(UUID tenantId, UUID userId) {
        logger.info("Getting user by ID: {} for tenant: {}", userId, tenantId);
        
        User user = userRepository.findByIdAndTenantId(userId, tenantId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        return convertToDto(user);
    }

    /**
     * Create new user
     */
    @CacheEvict(value = {"users", "userStats"}, key = "#userDto.tenantId")
    public UserDto createUser(UserDto userDto) {
        logger.info("Creating user: {} for tenant: {}", userDto.getEmail(), userDto.getTenantId());
        
        // Check if user already exists
        if (userRepository.existsByEmailAndTenantId(userDto.getEmail(), userDto.getTenantId())) {
            throw new RuntimeException("User already exists with email: " + userDto.getEmail());
        }
        
        User user = convertToEntity(userDto);
        user.setId(UUID.randomUUID());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        logger.info("User created successfully with ID: {}", savedUser.getId());
        
        return convertToDto(savedUser);
    }

    /**
     * Update user
     */
    @CacheEvict(value = {"user", "users"}, key = "#userDto.tenantId + '_' + #userDto.id")
    public UserDto updateUser(UserDto userDto) {
        logger.info("Updating user: {} for tenant: {}", userDto.getId(), userDto.getTenantId());
        
        User existingUser = userRepository.findByIdAndTenantId(userDto.getId(), userDto.getTenantId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userDto.getId()));
        
        // Update fields
        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setLastName(userDto.getLastName());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setPhone(userDto.getPhone());
        existingUser.setRole(userDto.getRole());
        existingUser.setStatus(userDto.getStatus());
        existingUser.setDepartment(userDto.getDepartment());
        existingUser.setJobTitle(userDto.getJobTitle());
        existingUser.setPreferences(userDto.getPreferences());
        existingUser.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(existingUser);
        logger.info("User updated successfully: {}", savedUser.getId());
        
        return convertToDto(savedUser);
    }

    /**
     * Delete user
     */
    @CacheEvict(value = {"user", "users", "userStats"}, key = "#tenantId + '_' + #userId")
    public void deleteUser(UUID tenantId, UUID userId) {
        logger.info("Deleting user: {} for tenant: {}", userId, tenantId);
        
        User user = userRepository.findByIdAndTenantId(userId, tenantId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        userRepository.delete(user);
        logger.info("User deleted successfully: {}", userId);
    }

    /**
     * Get user statistics
     */
    @Cacheable(value = "userStats", key = "#tenantId")
    public Map<String, Long> getUserStatistics(UUID tenantId) {
        logger.info("Getting user statistics for tenant: {}", tenantId);
        return userRepository.getUserStatistics(tenantId);
    }

    /**
     * Bulk update user status
     */
    @CacheEvict(value = {"users", "userStats"}, key = "#tenantId")
    public void bulkUpdateStatus(UUID tenantId, List<UUID> userIds, String status) {
        logger.info("Bulk updating status for {} users in tenant: {}", userIds.size(), tenantId);
        
        List<User> users = userRepository.findByIdInAndTenantId(userIds, tenantId);
        
        users.forEach(user -> {
            user.setStatus(status);
            user.setUpdatedAt(LocalDateTime.now());
        });
        
        userRepository.saveAll(users);
        logger.info("Bulk status update completed for {} users", users.size());
    }

    /**
     * Convert User entity to DTO
     */
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setTenantId(user.getTenantId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setDepartment(user.getDepartment());
        dto.setJobTitle(user.getJobTitle());
        dto.setPreferences(user.getPreferences());
        dto.setLastLoginAt(user.getLastLoginAt());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    /**
     * Convert DTO to User entity
     */
    private User convertToEntity(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setTenantId(dto.getTenantId());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole() != null ? dto.getRole() : "USER");
        user.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        user.setDepartment(dto.getDepartment());
        user.setJobTitle(dto.getJobTitle());
        user.setPreferences(dto.getPreferences());
        user.setLastLoginAt(dto.getLastLoginAt());
        return user;
    }
}