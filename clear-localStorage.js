// Clear localStorage script
console.log('🧹 Clearing localStorage...');

// Clear all auth-related data
localStorage.removeItem('authToken');
localStorage.removeItem('refreshToken');
localStorage.removeItem('tenantToken');
localStorage.removeItem('userData');
localStorage.removeItem('currentTenant');
localStorage.removeItem('user_data');

// Clear session storage
sessionStorage.clear();

console.log('✅ localStorage cleared');
console.log('Please refresh the page and login again');
