# Authentication Setup Guide

## Overview
This guide explains how to set up authentication for the master-dashboard with the auth-service.

## Environment Configuration

Create a `.env` file in the root directory with the following configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3004/api/v1

# Individual Service URLs
VITE_AUTH_SERVICE_URL=http://localhost:3008
VITE_USER_SERVICE_URL=http://localhost:3009
VITE_CONTENT_SERVICE_URL=http://localhost:3003
VITE_API_GATEWAY_URL=http://localhost:3004

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
```

## Authentication Flow

### 1. Login Process
- User enters email and password
- Frontend sends POST request to `{AUTH_SERVICE_URL}/auth/login`
- Backend validates credentials and returns JWT tokens
- Frontend stores tokens in localStorage
- User is redirected to appropriate dashboard based on role

### 2. Registration Process
- User enters registration details
- Frontend sends POST request to `{AUTH_SERVICE_URL}/auth/register`
- Backend creates user account and returns JWT tokens
- Frontend stores tokens and redirects to dashboard

### 3. Token Management
- Access tokens are stored in localStorage
- Refresh tokens are used to get new access tokens
- Tokens are automatically included in API requests
- Expired tokens trigger automatic refresh or logout

## API Endpoints

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

## Redux State Management

The authentication state is managed using Redux Toolkit with the following structure:

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
}
```

## Components

### AuthFormWithTabs
- Handles login and registration forms
- Uses Redux for state management
- Redirects users based on their role after successful authentication

### SimpleAuthGuard
- Initializes authentication state on app startup
- Verifies existing tokens
- Wraps the entire application

### ProtectedRoute
- Protects routes based on authentication status
- Checks user roles for authorization
- Handles tenant-specific routing

## User Roles

The system supports the following user roles:
- `PLATFORM_ADMIN` - Platform administrators
- `PLATFORM_USER` - Platform users
- `MARKETPLACE_DEVELOPER` - Marketplace developers
- `TENANT_ADMIN` - Tenant administrators
- `TENANT_USER` - Tenant users
- `END_CUSTOMER` - End customers

## Dashboard Routing

Users are redirected to different dashboards based on their role:
- `MARKETPLACE_DEVELOPER` → `/developer/dashboard`
- `TENANT_*` → `/tenant/dashboard`
- `PLATFORM_*` → `/dashboard`
- `END_CUSTOMER` → `/customer/dashboard`

## Security Features

- JWT token-based authentication
- Automatic token refresh
- Secure password hashing (bcrypt)
- Session management
- Role-based access control
- Tenant isolation

## Development

To start the development server:

```bash
npm run dev
```

Make sure the auth-service is running on port 3008 before starting the frontend.

## Testing

You can test the authentication flow by:
1. Starting the auth-service
2. Starting the frontend development server
3. Navigating to `/login`
4. Using test credentials or registering a new account
