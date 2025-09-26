package com.i3m.procurementservice.config;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserPrincipal {
    private String userId;
    private String email;
    private UUID tenantId;
    private String role;
    private List<String> permissions;
    
    public boolean hasPermission(String permission) {
        return permissions != null && (permissions.contains(permission) || permissions.contains("admin"));
    }
    
    public boolean hasRole(String role) {
        return this.role != null && this.role.equalsIgnoreCase(role);
    }
    
    public boolean isAdmin() {
        return hasRole("ADMIN") || hasPermission("admin");
    }
}
