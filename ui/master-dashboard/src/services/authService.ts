import axios from 'axios';

// Use Auth Service directly for authentication
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3008';
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3004';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
  userGroups?: UserGroup[];
}

export interface UserGroup {
  groupId: string;
  groupName: string;
  role: string;
  permissions: Record<string, any>;
  assignedAt: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = this.getStoredToken();
    this.migrateLocalStorage();
  }

  // Migrate old localStorage keys to new format
  private migrateLocalStorage(): void {
    console.log('🔧 Starting localStorage migration...');
    
    // Migrate i3m-language to language (preserve the data)
    const oldLanguage = localStorage.getItem('i3m-language');
    if (oldLanguage) {
      localStorage.setItem('language', oldLanguage);
      localStorage.removeItem('i3m-language');
      console.log('🔧 Migrated i3m-language to language:', oldLanguage);
    }

    // Migrate user_data to userData if userData doesn't exist
    const oldUserData = localStorage.getItem('user_data');
    const currentUserData = localStorage.getItem('userData');
    
    if (oldUserData && !currentUserData) {
      try {
        const parsedUserData = JSON.parse(oldUserData);
        // Convert platformRoles to userGroups if it exists
        if (parsedUserData.platformRoles) {
          parsedUserData.userGroups = parsedUserData.platformRoles;
          delete parsedUserData.platformRoles;
        }
        localStorage.setItem('userData', JSON.stringify(parsedUserData));
        console.log('🔧 Migrated user_data to userData');
      } catch (error) {
        console.error('Error migrating user_data:', error);
      }
    }
    
    // ALWAYS remove old user_data key after migration (aggressive cleanup)
    if (localStorage.getItem('user_data')) {
      localStorage.removeItem('user_data');
      console.log('🗑️ Removed old user_data key');
    }

    // Clean up any other old keys
    const oldKeys = ['authRefreshToken', 'authUser', 'user'];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log('🔧 Removed old key:', key);
      }
    });
    
    console.log('✅ localStorage migration completed');
  }

  // Get token from localStorage
  private getStoredToken(): string | null {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Validate token with server
  async validateToken(): Promise<{ isValid: boolean; user?: AuthUser; error?: string }> {
    if (!this.token) {
      return { isValid: false, error: 'No token found' };
    }

    try {
      const response = await axios.get(`${AUTH_SERVICE_URL}/api/v1/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Fetch user's groups
        let userGroups: UserGroup[] = [];
        try {
          const rolesResponse = await axios.get(`${AUTH_SERVICE_URL}/api/v1/auth/groups/users/${response.data.id}`, {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (rolesResponse.status === 200 && rolesResponse.data.groups) {
            userGroups = rolesResponse.data.groups.map((group: any) => ({
              groupId: group.id,
              groupName: group.name,
              role: group.role || 'member',
              permissions: group.permissions || {},
              assignedAt: group.assigned_at || new Date().toISOString()
            }));
          }
        } catch (rolesError) {
          console.log('🔍 Could not fetch user groups during validation:', rolesError);
        }
        
        const userData = {
          id: response.data.id,
          email: response.data.email,
          role: response.data.role,
          name: `${response.data.first_name || ''} ${response.data.last_name || ''}`.trim() || response.data.email,
          userGroups: userGroups
        };
        
        // Update stored user data with latest user groups
        localStorage.setItem('userData', JSON.stringify(userData));
        
        return { 
          isValid: true, 
          user: userData
        };
      } else {
        return { isValid: false, error: 'Invalid token response' };
      }
    } catch (error: any) {
      console.log('🔍 Token validation failed, using stored data:', error.response?.status);
      
      // Try to use stored user data as fallback
      const userData = this.getUserData();
      if (userData) {
        console.log('🔍 Using stored user data as fallback');
        return { 
          isValid: true, 
          user: userData 
        };
      }
      
      // Clear invalid token only if no stored data
      this.clearAuth();
      
      return { 
        isValid: false, 
        error: error.response?.status === 401 ? 'Token expired' : 'Server error' 
      };
    }
  }

  // Clear all authentication data
  clearAuth(): void {
    console.log('🧹 Clearing authentication data...');
    
    // Clear tokens (using camelCase consistently)
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tenantToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('currentTenant');
    localStorage.removeItem('user_data'); // Remove old key
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear token in memory
    this.token = null;
    
    console.log('✅ Authentication data cleared');
  }

  // Force cleanup of old localStorage keys
  forceCleanup(): void {
    console.log('🧹 Force cleaning up old localStorage keys...');
    
    const oldKeys = [
      'user_data', 
      'i3m-language', 
      'authRefreshToken', 
      'authUser', 
      'user',
      'token' // Remove old token key if it exists
    ];
    
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log('🗑️ Removed old key:', key);
      }
    });
    
    console.log('✅ Force cleanup completed');
  }

  // Force migration and cleanup (can be called manually)
  forceMigration(): void {
    console.log('🔄 Force migration and cleanup...');
    this.migrateLocalStorage();
    this.forceCleanup();
    console.log('✅ Force migration completed');
  }

  // Set new token
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Get user data from localStorage
  getUserData(): any | null {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Get current tenant context
  getCurrentTenant(): string | null {
    const userData = this.getUserData();
    return userData?.tenantIds?.[0] || userData?.customerId || 'default-tenant';
  }

  // Set tenant context for API calls
  setTenantContext(tenantId: string): void {
    localStorage.setItem('currentTenant', tenantId);
  }

  // Get tenant context for API calls
  getTenantContext(): string {
    return localStorage.getItem('currentTenant') || this.getCurrentTenant() || 'default-tenant';
  }

  // Set refresh token
  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  // Clear tokens (for compatibility with existing code)
  clearTokens(): void {
    this.clearAuth();
  }

  // Set both access and refresh tokens
  setTokens(accessToken: string, refreshToken: string): void {
    this.setToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  // Register new user
  async register(data: any): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/api/v1/auth/register`, data);
      if (response.status === 200) {
        const { access_token, refresh_token, user } = response.data;
        this.setTokens(access_token, refresh_token);
        
        // Prepare user data (new users won't have groups yet)
        const userData = {
          ...user,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
          userGroups: []
        };
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        return { 
          success: true, 
          user: userData
        };
      } else {
        return { success: false, error: response.data.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false, 
        error: error.response?.data?.message || error.response?.data?.error || 'Registration failed' 
      };
    }
  }

  // Verify token
  async verifyToken(): Promise<AuthUser | null> {
    try {
      const validation = await this.validateToken();
      return validation.user || null;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ success: boolean; token?: string; refreshToken?: string; error?: string }> {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/auth/refresh`, {
        refresh_token: refreshToken
      });
      
      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;
        this.setTokens(access_token, refresh_token);
        return { success: true, token: access_token, refreshToken: refresh_token };
      } else {
        return { success: false, error: response.data.message || 'Token refresh failed' };
      }
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      return {
        success: false, 
        error: error.response?.data?.message || error.response?.data?.error || 'Token refresh failed' 
      };
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/auth/forgot-password`, { email });
      return { success: response.status === 200, error: response.data.message };
    } catch (error: any) {
      console.error('Forgot password failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data?.error || 'Forgot password failed' 
      };
    }
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/auth/reset-password`, { 
        token, 
        new_password: newPassword 
      });
      return { success: response.status === 200, error: response.data.message };
    } catch (error: any) {
      console.error('Reset password failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data?.error || 'Reset password failed' 
      };
    }
  }

  // Login with credentials
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; refreshToken?: string; user?: AuthUser; error?: string }> {
    try {
      console.log('🔍 AuthService - Login called with:', { email, password: '***' });
      
      // Validate inputs before sending
      if (!email || !password) {
        console.log('❌ AuthService - Missing email or password');
        return { 
          success: false, 
          error: 'Email and password are required' 
        };
      }

      // Mock mode for testing - simulate server error
      if (import.meta.env.VITE_MOCK_AUTH === 'true') {
        console.log('🔍 AuthService - Mock mode enabled, simulating error');
        
        // Simulate network error
        if (email === 'error@test.com') {
          return {
            success: false,
            error: 'Network error: Unable to connect to authentication server'
          };
        }
        
        // Simulate invalid credentials
        if (email === 'wrong@test.com' || password === 'wrongpassword') {
          return {
            success: false,
            error: 'Invalid email or password. Please check your credentials and try again.'
          };
        }
        
        // Simulate successful login for demo
        if (email === 'admin@i3m.com' && password === 'admin123') {
          const mockUser = {
            id: '1',
            email: email,
            role: 'PLATFORM_ADMIN',
            name: 'Admin User',
            userGroups: [
              {
                groupId: 'admin-group-1',
                groupName: 'Platform Administrators',
                role: 'admin',
                permissions: { admin: true, manageUsers: true, manageGroups: true },
                assignedAt: new Date().toISOString()
              }
            ]
          };
          
          this.setTokens('mock-access-token', 'mock-refresh-token');
          localStorage.setItem('userData', JSON.stringify(mockUser));
          
          return {
            success: true,
            token: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
            user: mockUser
          };
        }
        
        // Default error for other cases
        return {
          success: false,
          error: 'Invalid credentials. Please try again.'
        };
      }

      console.log('🔍 AuthService - Sending login request:', { email, password: '***' });
      
      const requestData = {
        email: email.trim(),
        password: password.trim()
      };
      
      console.log('🔍 AuthService - Request data:', requestData);
      
      const response = await axios.post(`${AUTH_SERVICE_URL}/api/v1/auth/login`, requestData);

      if (response.status === 200) {
        const { access_token, refresh_token, user, tenant_token, primary_group } = response.data;
        this.setTokens(access_token, refresh_token);
        
        // Store tenant token if available
        if (tenant_token) {
          localStorage.setItem('tenantToken', tenant_token);
          console.log('🔍 AuthService - Tenant token stored');
        }
        
        // Fetch user's groups (fallback if not provided in response)
        let userGroups: UserGroup[] = [];
        if (primary_group) {
          // Use primary group from response
          userGroups = [{
            groupId: primary_group.id,
            groupName: primary_group.name,
            role: primary_group.role || 'member',
            permissions: primary_group.permissions || {},
            assignedAt: primary_group.assigned_at || new Date().toISOString()
          }];
        } else {
          // Fallback: fetch from API
          try {
            const rolesResponse = await axios.get(`${AUTH_SERVICE_URL}/api/v1/auth/groups/users/${user.id}`, {
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (rolesResponse.status === 200 && rolesResponse.data.groups) {
              userGroups = rolesResponse.data.groups.map((group: any) => ({
                groupId: group.id,
                groupName: group.name,
                role: group.role || 'member',
                permissions: group.permissions || {},
                assignedAt: group.assigned_at || new Date().toISOString()
              }));
            }
          } catch (rolesError) {
            console.log('🔍 Could not fetch user groups:', rolesError);
            // Continue without groups - user might not be in any groups yet
          }
        }
        
        // Prepare enhanced user data with primary group/role and tenant info
        const userData = {
          ...user,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
          userGroups: userGroups,
          primaryGroup: primary_group,
          primaryRole: user.primary_role,
          tenantToken: tenant_token,
          tenantId: user.tenant_id
        };
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('🔍 AuthService - Enhanced user data stored:', userData);
        
        return { 
          success: true, 
          token: access_token, 
          refreshToken: refresh_token, 
          user: userData
        };
      } else {
        return { success: false, error: response.data.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Mock mode fallback for network errors
      if (import.meta.env.VITE_MOCK_AUTH === 'true') {
        return {
          success: false,
          error: 'Network error: Unable to connect to authentication server. Please try again later.'
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data?.error || 'Login failed' 
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await axios.post(`${AUTH_SERVICE_URL}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
      window.location.href = '/login';
    }
  }

  // Check server health - simplified to avoid rate limiting
  async checkServerHealth(): Promise<boolean> {
    try {
      // Try to validate token instead of health check to avoid rate limiting
      const token = this.getToken();
      if (!token) {
        return false;
      }

      // Use a lightweight endpoint that's less likely to be rate limited
      const response = await axios.get(`${API_GATEWAY_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        },
        timeout: 3000
      });
      
      return response.status === 200;
    } catch (error: any) {
      console.log('🔍 Server health check failed:', error);
      
      // If we get 401/403, server is up but token is invalid
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('⚠️ Server is up but token is invalid');
        return true; // Server is up, just token issue
      }
      
      // If we get 429, server is up but rate limited
      if (error.response?.status === 429) {
        console.log('⚠️ Server is up but rate limited');
        return true; // Server is up, just rate limited
      }
      
      return false;
    }
  }

  // Get user groups
  async getUserGroups(userId: string) {
    const response = await axios.get(`${API_GATEWAY_URL}/api/v1/auth/groups/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    return response.data;
  }

  // Set primary role
  async setPrimaryRole(userId: string, primaryRole: string) {
    const response = await axios.post(`${API_GATEWAY_URL}/api/v1/auth/primary-role/set`, {
      user_id: userId,
      primary_role: primaryRole
    }, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    return response.data;
  }

  // Get primary role
  async getPrimaryRole(userId: string) {
    const response = await axios.get(`${API_GATEWAY_URL}/api/v1/auth/primary-role/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    return response.data;
  }

}

export const authService = new AuthService();
export default authService;