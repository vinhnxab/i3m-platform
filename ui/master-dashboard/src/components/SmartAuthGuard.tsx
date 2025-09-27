import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';

interface SmartAuthGuardProps {
  children: React.ReactNode;
}

const SmartAuthGuard: React.FC<SmartAuthGuardProps> = ({ children }) => {
  const [isServerRestarted, setIsServerRestarted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastServerCheck, setLastServerCheck] = useState(Date.now());

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const isHealthy = await authService.checkServerHealth();
        
        if (!isHealthy) {
          console.log('🔍 Server not responding, checking if it\'s a restart...');
          
          // Check if this is a server restart (server was working before)
          const timeSinceLastCheck = Date.now() - lastServerCheck;
          const isLikelyRestart = timeSinceLastCheck > 30000; // 30 seconds
          
          if (isLikelyRestart && retryCount < 3) {
            console.log('🔄 Likely server restart detected, showing restart message...');
            setIsServerRestarted(true);
            setRetryCount(prev => prev + 1);
          } else if (retryCount >= 3) {
            console.log('❌ Server still not responding after retries, clearing auth...');
            authService.clearAuth();
            window.location.href = '/login';
          }
        } else {
          // Server is healthy, reset counters
          setRetryCount(0);
          setIsServerRestarted(false);
          setLastServerCheck(Date.now());
        }
      } catch (error: any) {
        console.log('🔍 Server health check failed:', error);
        
        // Handle rate limiting (429) - don't treat as server down
        if (error.response?.status === 429) {
          console.log('⚠️ Rate limited, reducing check frequency...');
          // Don't increment retry count for rate limiting
          return;
        }
        
        // For other errors, increment retry count
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
        } else {
          console.log('❌ Server health check failed after retries');
        }
      }
    };

    // Check server health every 30 seconds (reduced from 10s)
    const interval = setInterval(checkServerStatus, 30000);
    
    // Initial check with delay to avoid immediate rate limiting
    setTimeout(checkServerStatus, 2000);

    return () => clearInterval(interval);
  }, [lastServerCheck, retryCount]);

  if (isServerRestarted) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        color: 'white'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#333',
          maxWidth: '400px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
          <h2 style={{ margin: '0 0 16px 0', color: '#333' }}>Server Restarted</h2>
          <p style={{ margin: '0 0 24px 0', color: '#666' }}>
            The server has been restarted. Your session is still valid.
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => {
                setIsServerRestarted(false);
                window.location.reload();
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Continue
            </button>
            <button
              onClick={() => {
                authService.clearAuth();
                window.location.href = '/login';
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SmartAuthGuard;
