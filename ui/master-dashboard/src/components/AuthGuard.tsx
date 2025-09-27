import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First check if we have a token
        if (!authService.isAuthenticated()) {
          console.log('🔍 No token found, redirecting to login...');
          authService.clearAuth();
          window.location.href = '/login';
          return;
        }

        // Check server health
        const isServerHealthy = await authService.checkServerHealth();
        if (!isServerHealthy) {
          console.log('🔍 Server not responding, clearing auth and redirecting...');
          authService.clearAuth();
          window.location.href = '/login';
          return;
        }

        // Validate token with server
        const validation = await authService.validateToken();
        
        if (validation.isValid) {
          console.log('✅ Token is valid, user authenticated');
          setIsAuthenticated(true);
        } else {
          console.log('❌ Token validation failed:', validation.error);
          authService.clearAuth();
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('🔍 Authentication check failed:', error);
        authService.clearAuth();
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>🔍 Checking authentication...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>❌ Authentication Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>🔒 Access Denied</h2>
        <p>Please log in to continue</p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
