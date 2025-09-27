import React, { useEffect, useState } from 'react';

interface ServerHealthCheckProps {
  onServerRestart: () => void;
}

const ServerHealthCheck: React.FC<ServerHealthCheckProps> = ({ onServerRestart }) => {
  const [isServerHealthy, setIsServerHealthy] = useState(true);
  const [lastCheck, setLastCheck] = useState(Date.now());

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await fetch('http://i3m.local:3009/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsServerHealthy(true);
        } else {
          throw new Error('Server not healthy');
        }
      } catch (error) {
        console.log('🔄 Server health check failed:', error);
        setIsServerHealthy(false);
        
        // Clear storage and redirect
        localStorage.clear();
        sessionStorage.clear();
        onServerRestart();
      }
    };

    // Check server health every 30 seconds
    const interval = setInterval(checkServerHealth, 30000);
    
    // Initial check
    checkServerHealth();

    return () => clearInterval(interval);
  }, [onServerRestart]);

  if (!isServerHealthy) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>🔄 Server Restarted</h3>
          <p>Please refresh the page to continue...</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ServerHealthCheck;
