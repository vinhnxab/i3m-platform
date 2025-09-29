// Test fresh login
console.log('🧪 Testing fresh login...');

// Clear old data first
localStorage.clear();
sessionStorage.clear();

// Test login
fetch('http://localhost:3008/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ Login successful:', data);
  
  // Store tokens
  localStorage.setItem('authToken', data.access_token);
  localStorage.setItem('refreshToken', data.refresh_token);
  localStorage.setItem('userData', JSON.stringify(data.user));
  
  if (data.tenant_token) {
    localStorage.setItem('tenantToken', data.tenant_token);
  }
  
  console.log('✅ Tokens stored in localStorage');
  console.log('🔄 Please refresh the page');
})
.catch(error => {
  console.error('❌ Login failed:', error);
});
