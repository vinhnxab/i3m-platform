import { useEffect } from 'react';

export const useAutoClearStorage = () => {
  useEffect(() => {
    // Check for server restart on component mount
    const checkServerRestart = async () => {
      try {
        const response = await fetch('http://i3m.local:3009/health');
        if (!response.ok) {
          throw new Error('Server not responding');
        }
      } catch (error) {
        console.log('🔄 Server restart detected, clearing storage...');
        localStorage.clear();
        sessionStorage.clear();
        
        // Show notification
        if (window.confirm('Server has been restarted. Clear storage and refresh?')) {
          window.location.reload();
        }
      }
    };

    // Check on mount
    checkServerRestart();

    // Listen for storage events (when localStorage is cleared from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === null && e.newValue === null) {
        console.log('🔄 Storage cleared, refreshing...');
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};

// Hook to clear storage when token is invalid
export const useTokenValidation = () => {
  const clearStorageOnAuthError = () => {
    console.log('🔄 Token validation failed, clearing storage...');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return { clearStorageOnAuthError };
};
