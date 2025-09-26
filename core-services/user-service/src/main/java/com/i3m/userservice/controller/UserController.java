package com.i3m.userservice.controller;

import com.i3m.userservice.dto.UserDto;
import com.i3m.userservice.model.User;
import com.i3m.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

/**
 * User Controller - REST API for user management
 */
@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Object> health() {
        return ResponseEntity.ok().body(java.util.Map.of(
            "service", "User Service",
            "status", "healthy",
            "timestamp", java.time.Instant.now(),
            "version", "1.0.0"
        ));
    }

    /**
     * Get all users with pagination and filtering
     */
    @GetMapping
    public ResponseEntity<Page<UserDto>> getUsers(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role) {

        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") 
            ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<UserDto> users = userService.getUsers(tenantId, pageable, search, status, role);
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        UserDto user = userService.getUserById(tenantId, id);
        return ResponseEntity.ok(user);
    }

    /**
     * Create new user
     */
    @PostMapping
    public ResponseEntity<UserDto> createUser(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @Valid @RequestBody UserDto userDto) {
        userDto.setTenantId(tenantId);
        UserDto createdUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    /**
     * Update user
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id,
            @Valid @RequestBody UserDto userDto) {
        userDto.setId(id);
        userDto.setTenantId(tenantId);
        UserDto updatedUser = userService.updateUser(userDto);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Delete user
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @PathVariable UUID id) {
        userService.deleteUser(tenantId, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get user statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<Object> getUserStatistics(
            @RequestHeader("X-Tenant-ID") UUID tenantId) {
        java.util.Map<String, Long> stats = userService.getUserStatistics(tenantId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Bulk update user status
     */
    @PatchMapping("/bulk-status")
    public ResponseEntity<Object> bulkUpdateStatus(
            @RequestHeader("X-Tenant-ID") UUID tenantId,
            @RequestBody java.util.Map<String, Object> request) {
        
        @SuppressWarnings("unchecked")
        List<UUID> userIds = (List<UUID>) request.get("userIds");
        String status = (String) request.get("status");
        
        userService.bulkUpdateStatus(tenantId, userIds, status);
        
        return ResponseEntity.ok().body(java.util.Map.of(
            "message", "Users status updated successfully",
            "updatedCount", userIds.size()
        ));
    }
}
