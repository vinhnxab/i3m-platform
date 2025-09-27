import { useState, useEffect } from 'react';
import { authService, AuthUser } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        if (!authService.isAuthenticated()) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        const validation = await authService.validateToken();
        
        if (validation.isValid && validation.user) {
          setIsAuthenticated(true);
          setUser(validation.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          authService.clearAuth();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        authService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setIsAuthenticated(true);
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const clearAuth = () => {
    authService.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    clearAuth
  };
};
