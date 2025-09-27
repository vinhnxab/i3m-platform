import axios from 'axios';

// Global axios interceptor to handle token expiration
export const setupAuthInterceptor = () => {
  // Response interceptor
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('🔄 Authentication error detected, clearing storage...');
        
        // Clear all storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Auto-clear storage on page load if server is down
export const checkServerHealth = async () => {
  try {
    const response = await fetch('http://i3m.local:3009/health');
    if (!response.ok) {
      throw new Error('Server not responding');
    }
  } catch (error) {
    console.log('🔄 Server not available, clearing storage...');
    localStorage.clear();
    sessionStorage.clear();
  }
};
