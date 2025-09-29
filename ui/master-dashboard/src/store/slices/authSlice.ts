import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, RegisterData } from '../../types/auth';
import { authService } from '../../services/authService';

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  userGroups: any[] | null;
  primaryGroup: any | null; // ← Thêm primary group
  primaryRole: string | null; // ← Thêm primary role
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  refreshToken: null,
  userGroups: null,
  primaryGroup: null, // ← Thêm primary group
  primaryRole: null, // ← Thêm primary role
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials.email, credentials.password);
      if (response.success && response.user) {
        return {
          user: response.user,
          token: response.token || '',
          refreshToken: response.refreshToken || ''
        };
      } else {
        return rejectWithValue(response.error || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Login failed'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register({
        email: data.email,
        password: data.password,
        first_name: data.name.split(' ')[0] || '',
        last_name: data.name.split(' ').slice(1).join(' ') || ''
      });
      if (response.success && response.user) {
        // For registration, we need to login after successful registration
        const loginResponse = await authService.login(data.email, data.password);
        if (loginResponse.success && loginResponse.user) {
          return {
            user: loginResponse.user,
            token: loginResponse.token || '',
            refreshToken: loginResponse.refreshToken || ''
          };
        } else {
          return rejectWithValue('Registration successful but login failed');
        }
      } else {
        return rejectWithValue(response.error || 'Registration failed');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Registration failed'
      );
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.verifyToken();
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Token verification failed'
      );
    }
  }
);

// Fetch user groups
export const fetchUserGroups = createAsyncThunk(
  'auth/fetchUserGroups',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await authService.getUserGroups(userId);
      return response.user_groups || [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch user groups'
      );
    }
  }
);

// Set primary role
export const setPrimaryRole = createAsyncThunk(
  'auth/setPrimaryRole',
  async ({ userId, primaryRole }: { userId: string; primaryRole: string }, { rejectWithValue }) => {
    try {
      const response = await authService.setPrimaryRole(userId, primaryRole);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to set primary role'
      );
    }
  }
);

// Fetch primary role
export const fetchPrimaryRole = createAsyncThunk(
  'auth/fetchPrimaryRole',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await authService.getPrimaryRole(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch primary role'
      );
    }
  }
);


export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authService.refreshToken(refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Token refresh failed'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        return email;
      } else {
        return rejectWithValue(response.error || 'Failed to send reset email');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to send reset email'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }: { token: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      if (response.success) {
        return true;
      } else {
        return rejectWithValue(response.error || 'Failed to reset password');
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to reset password'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error) {
      // Don't reject on logout error, just log it
      console.error('Logout error:', error);
      return true;
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage with new key
        localStorage.setItem('userData', JSON.stringify(state.user));
      }
    },
    setCredentials: (state, action: PayloadAction<{ token: string; refreshToken: string; user: any }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user as User;
      state.isAuthenticated = true;
      state.error = null;
      
      // Store in localStorage
      authService.setTokens(action.payload.token, action.payload.refreshToken);
      localStorage.setItem('userData', JSON.stringify(action.payload.user));
    },
    clearCredentials: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.userGroups = null;
      
      // Clear localStorage
      authService.clearTokens();
    },
    setUserGroups: (state, action: PayloadAction<any[]>) => {
      state.userGroups = action.payload;
    },
    setPrimaryRoleState: (state, action: PayloadAction<string>) => {
      state.primaryRole = action.payload;
    },
    initializeAuth: (state) => {
      const token = authService.getToken();
      const refreshToken = authService.getRefreshToken();
      const userData = localStorage.getItem('userData');
      
      if (token && refreshToken && userData) {
        try {
          const user = JSON.parse(userData);
          state.token = token;
          state.refreshToken = refreshToken;
          state.user = user;
          state.isAuthenticated = true;
        } catch (error) {
          // Clear invalid data
          authService.clearTokens();
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as User;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store in localStorage
        authService.setTokens(action.payload.token, action.payload.refreshToken);
        localStorage.setItem('userData', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as User;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store in localStorage
        authService.setTokens(action.payload.token, action.payload.refreshToken);
        localStorage.setItem('userData', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Verify Token
    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as User;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        // Try to refresh token
        if (state.refreshToken) {
          // This will be handled by the component
        }
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refreshToken || null;
        state.error = null;
        
        // Update localStorage
        if (action.payload.token && action.payload.refreshToken) {
          authService.setTokens(action.payload.token, action.payload.refreshToken);
        }
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.user = null;
        
        // Clear localStorage
        authService.clearTokens();
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        
        // Clear localStorage
        authService.clearTokens();
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
        
        // Clear localStorage
        authService.clearTokens();
      });

    // Fetch User Groups
    builder
      .addCase(fetchUserGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userGroups = action.payload;
        state.error = null;
      })
      .addCase(fetchUserGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Set Primary Role
    builder
      .addCase(setPrimaryRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setPrimaryRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.primaryRole = action.payload.primary_role;
        state.error = null;
      })
      .addCase(setPrimaryRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Primary Role
    builder
      .addCase(fetchPrimaryRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPrimaryRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.primaryRole = action.payload.primary_role;
        state.error = null;
      })
      .addCase(fetchPrimaryRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

  },
});

export const {
  clearError,
  updateUser,
  setCredentials,
  clearCredentials,
  initializeAuth,
  setUserGroups,
  setPrimaryRoleState,
} = authSlice.actions;

export default authSlice.reducer;
