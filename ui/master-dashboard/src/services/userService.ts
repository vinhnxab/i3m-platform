import axios from 'axios';
import { authService } from './authService';

// Use API Gateway for all user operations
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://i3m.local:3004';

// User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  userRoles: string[];
  tenantId?: string;
  customerId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];
  customPermissions: string[];
  profile?: {
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
  };
}

// Create user request
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  tenantId?: string;
  customerId?: string;
  isActive?: boolean;
  password: string;
  profile?: {
    bio?: string;
    location?: string;
    website?: string;
  };
}

// Update user request
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  tenantId?: string;
  customerId?: string;
  isActive?: boolean;
  profile?: {
    bio?: string;
    location?: string;
    website?: string;
  };
}

// User service class
class UserService {
  private getAuthHeaders() {
    const token = authService.getToken();
    const tenantId = authService.getTenantContext();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Tenant-Id': tenantId
    };
  }

  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/users`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      
      // Auto-clear localStorage if token is invalid
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('🔄 Token invalid, clearing auth...');
        authService.clearAuth();
        return [];
      }
      
      throw new Error('Failed to fetch users');
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/users/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching user:', error);
      
      // Auto-clear localStorage if token is invalid
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('🔄 Token invalid, clearing auth...');
        authService.clearAuth();
        throw new Error('Authentication required');
      }
      
      throw new Error('Failed to fetch user');
    }
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await axios.post(`${API_GATEWAY_URL}/users`, userData, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await axios.put(`${API_GATEWAY_URL}/users/${id}`, userData, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${API_GATEWAY_URL}/users/${id}`, {
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  // Toggle user status
  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    try {
      const response = await axios.patch(`${API_GATEWAY_URL}/users/${id}/status`, 
        { isActive }, 
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw new Error('Failed to toggle user status');
    }
  }

  // Get users by role
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/users/role/${role}`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw new Error('Failed to fetch users by role');
    }
  }

  // Get users by tenant
  async getUsersByTenant(tenantId: string): Promise<User[]> {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/users/tenant/${tenantId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching users by tenant:', error);
      throw new Error('Failed to fetch users by tenant');
    }
  }

  // Search users
  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/users/search`, {
        params: { q: query },
        headers: this.getAuthHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error('Failed to search users');
    }
  }

  // Get user statistics
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
    byTenant: Record<string, number>;
  }> {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/users/stats`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw new Error('Failed to fetch user statistics');
    }
  }
}

export const userService = new UserService();
export default userService;
