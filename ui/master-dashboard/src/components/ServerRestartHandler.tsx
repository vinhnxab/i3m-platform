import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';

const ServerRestartHandler: React.FC = () => {
  const [showRestartMessage, setShowRestartMessage] = useState(false);
  const [lastServerCheck, setLastServerCheck] = useState(Date.now());

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const isHealthy = await authService.checkServerHealth();
        
        if (!isHealthy) {
          console.log('🔄 Server restart detected');
          setShowRestartMessage(true);
          
          // Clear auth data
          authService.clearAuth();
          
          // Show message for 3 seconds then redirect
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else {
          setLastServerCheck(Date.now());
        }
      } catch (error) {
        console.log('🔍 Server health check failed:', error);
        setShowRestartMessage(true);
        authService.clearAuth();
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    };

    // Check server health every 30 seconds
    const interval = setInterval(checkServerHealth, 30000);
    
    // Initial check
    checkServerHealth();

    return () => clearInterval(interval);
  }, []);

  if (showRestartMessage) {
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
            The server has been restarted. Your session has been cleared for security.
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => window.location.href = '/login'}
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
              Go to Login
            </button>
            <button
              onClick={() => window.location.reload()}
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
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ServerRestartHandler;
