import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthState, AuthContextType, AuthResponse } from '@/types/auth';
import { authService } from '@/services/authService';

// Auth reducer
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_UPDATE_USER'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          // Verify token with backend
          const user = await authService.verifyToken();
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } catch (error) {
          // Token is invalid, try to refresh
          const refreshToken = authService.getRefreshToken();
          if (refreshToken) {
            try {
              const { token: newToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);
              authService.setTokens(newToken, newRefreshToken);
              const user = await authService.verifyToken();
              dispatch({ type: 'AUTH_SUCCESS', payload: user });
            } catch (refreshError) {
              // Refresh failed, clear all data
              authService.clearTokens();
              dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
            }
          } else {
            // No refresh token, clear all data
            authService.clearTokens();
            dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
          }
        }
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authService.login(credentials);
      
      // Store tokens and user data
      authService.setTokens(response.token, response.refreshToken);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await authService.register(data);
      
      // Store tokens and user data
      authService.setTokens(response.token, response.refreshToken);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      authService.clearTokens();
      
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authService.forgotPassword(email);
      if (!response.success) {
        throw new Error(response.error || 'Failed to send reset email');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      if (!response.success) {
        throw new Error(response.error || 'Failed to reset password');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      throw new Error(errorMessage);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'AUTH_UPDATE_USER', payload: userData });
    
    // Update localStorage
    const currentUser = state.user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
