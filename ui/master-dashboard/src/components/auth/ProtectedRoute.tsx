import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { authService } from '@/services/authService';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredFeature?: string;
  requireFullAccess?: boolean;
  requireLimitedAccess?: boolean;
}

interface RootState {
  auth: {
    user: {
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      role: string;
      department: string;
      tenantId?: string;
      tenant?: {
        id: string;
        name: string;
        subdomain: string;
      };
    };
    isAuthenticated: boolean;
    isLoading: boolean;
  };
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredFeature,
  requireFullAccess = false,
  requireLimitedAccess = false
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const location = useLocation();
  const { canAccess, canAccessFull, canAccessLimited, hasAnyRole } = usePermissions();
  
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validate token with server
  useEffect(() => {
    const validateAuth = async () => {
      try {
        setIsValidating(true);
        setValidationError(null);

        // Check if we have a token
        if (!authService.isAuthenticated()) {
          console.log('🔍 No token found, redirecting to login...');
          // Don't clear auth here, just redirect
          return;
        }

        // Skip server health check to avoid rate limiting
        // Let token validation handle authentication

        // Validate token with server
        const validation = await authService.validateToken();
        
        if (!validation.isValid) {
          console.log('❌ Token validation failed:', validation.error);
          // Only clear auth if token is truly invalid (expired, malformed, etc.)
          if (validation.error === 'Token expired' || validation.error === 'Invalid token') {
            authService.clearAuth();
            setValidationError('Session expired. Please login again.');
          } else {
            // For other errors, don't clear auth immediately
            setValidationError(validation.error || 'Token validation failed');
          }
        }
      } catch (error) {
        console.error('🔍 Authentication validation failed:', error);
        // Don't clear auth on network errors, just show error
        setValidationError('Authentication check failed. Please try again.');
      } finally {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, []);

  // Show loading spinner while checking authentication or validating token
  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            {isValidating ? 'Validating authentication...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error if token validation failed
  if (validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
          <p className="text-muted-foreground">{validationError}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Retry
            </button>
            {validationError.includes('expired') && (
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!hasAnyRole(roles)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Required role: {roles.join(' or ')} | Your role: {user?.role}
            </p>
          </div>
        </div>
      );
    }
  }

  // Check feature-based access
  if (requiredFeature) {
    if (!canAccess(requiredFeature as any)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this feature.
            </p>
            <p className="text-sm text-muted-foreground">
              Required feature: {requiredFeature} | Your role: {user?.role}
            </p>
          </div>
        </div>
      );
    }

    // Check access level requirements
    if (requireFullAccess && !canAccessFull(requiredFeature as any)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">
              You need full access to this feature.
            </p>
            <p className="text-sm text-muted-foreground">
              Required feature: {requiredFeature} | Your role: {user?.role}
            </p>
          </div>
        </div>
      );
    }

    if (requireLimitedAccess && !canAccessLimited(requiredFeature as any)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">
              You need at least limited access to this feature.
            </p>
            <p className="text-sm text-muted-foreground">
              Required feature: {requiredFeature} | Your role: {user?.role}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
