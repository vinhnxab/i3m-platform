import axios from 'axios';

// Use Auth Service directly for authentication
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3008';
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3004';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = this.getStoredToken();
  }

  // Get token from localStorage
  private getStoredToken(): string | null {
    return localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
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
      const response = await axios.get(`${AUTH_SERVICE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        return { 
          isValid: true, 
          user: {
            id: response.data.id,
            email: response.data.email,
            role: response.data.role,
            name: `${response.data.first_name || ''} ${response.data.last_name || ''}`.trim() || response.data.email
          }
        };
      } else {
        return { isValid: false, error: 'Invalid token response' };
      }
    } catch (error: any) {
      console.log('🔍 Token validation failed:', error.response?.status);
      
      // Clear invalid token
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
    
    // Clear tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authRefreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('authUser');
    localStorage.removeItem('user_data');
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear token in memory
    this.token = null;
    
    console.log('✅ Authentication data cleared');
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
    return localStorage.getItem('refreshToken') || localStorage.getItem('authRefreshToken');
  }

  // Get user data from localStorage
  getUserData(): any | null {
    try {
      const userData = localStorage.getItem('user_data');
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
    localStorage.setItem('current_tenant', tenantId);
  }

  // Get tenant context for API calls
  getTenantContext(): string {
    return localStorage.getItem('current_tenant') || this.getCurrentTenant() || 'default-tenant';
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
      const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, data);
      if (response.status === 201) {
        const { access_token, refresh_token, user } = response.data;
        this.setTokens(access_token, refresh_token);
        return { 
          success: true, 
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
          }
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

      console.log('🔍 AuthService - Sending login request:', { email, password: '***' });
      
      const requestData = {
        email: email.trim(),
        password: password.trim()
      };
      
      console.log('🔍 AuthService - Request data:', requestData);
      
      const response = await axios.post(`${AUTH_SERVICE_URL}/api/v1/auth/login`, requestData);

      if (response.status === 200) {
        const { access_token, refresh_token, user } = response.data;
        this.setTokens(access_token, refresh_token);
        
        // Store user data in localStorage
        if (user) {
          localStorage.setItem('user_data', JSON.stringify(user));
          console.log('🔍 AuthService - User data stored:', user);
        }
        
        return { 
          success: true, 
          token: access_token, 
          refreshToken: refresh_token, 
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
          }
        };
      } else {
        return { success: false, error: response.data.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
}

export const authService = new AuthService();
export default authService;